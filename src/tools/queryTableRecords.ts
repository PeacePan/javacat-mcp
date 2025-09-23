import { z } from 'zod';
import { NormFieldValueType } from '@norwegianForestLibs/enum';
import { ToolContext, ToolDefinition } from './types';

export const queryTableRecords = (context: ToolContext): ToolDefinition => ({
	name: 'queryTableRecords',
	description: '查詢指定表格的紀錄資料。支援各種過濾條件、排序、分頁等功能',
	parameters: z.object({
		table: z.string().describe('表格名稱，如: "__user__", "__joblog__", "customer", "sale_order" 等'),
		filters: z
			.array(
				z.object({
					bodyConditions: z
						.array(
							z.object({
								fieldName: z.string().describe('欄位名稱'),
								valueType: z.enum(['STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'ID']).describe('值的型別'),
								operator: z
									.enum(['in', 'nin', 'like', 'gte', 'lte', 'gt', 'lt'])
									.describe('比較運算子'),
								string: z.string().optional().describe('字串值 (當 valueType 為 STRING 時使用)'),
								number: z.number().optional().describe('數值 (當 valueType 為 NUMBER 時使用)'),
								date: z.string().optional().describe('日期 ISO 格式字串 (當 valueType 為 DATE 時使用)'),
								boolean: z.boolean().optional().describe('布林值 (當 valueType 為 BOOLEAN 時使用)'),
								id: z.string().optional().describe('ID 值 (當 valueType 為 ID 時使用)'),
							})
						)
						.optional()
						.describe('表頭欄位條件'),
					lineFilters: z
						.array(
							z.object({
								lineName: z.string().describe('表身名稱'),
								lineConditions: z.array(
									z.object({
										fieldName: z.string().describe('表身欄位名稱'),
										valueType: z
											.enum(['STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'ID'])
											.describe('值的型別'),
										operator: z
											.enum(['in', 'nin', 'like', 'gte', 'lte', 'gt', 'lt'])
											.describe('比較運算子'),
										string: z.string().optional().describe('字串值'),
										number: z.number().optional().describe('數值'),
										date: z.string().optional().describe('日期 ISO 格式字串'),
										boolean: z.boolean().optional().describe('布林值'),
										id: z.string().optional().describe('ID 值'),
									})
								),
							})
						)
						.optional()
						.describe('表身條件'),
				})
			)
			.optional()
			.describe('過濾條件陣列'),
		limit: z.number().min(1).max(1000).default(50).describe('回傳筆數限制 (1-1000，預設 50)'),
		offset: z.number().min(0).default(0).describe('偏移量，用於分頁 (預設 0)'),
		sorting: z
			.object({
				field: z.string().describe('排序欄位名稱，如: "_id", "body.name", "_createdAt"'),
				direction: z.enum(['1', '-1']).describe('排序方向: "1" 為升冪, "-1" 為降冪'),
			})
			.optional()
			.describe('排序設定'),
		archived: z.enum(['ARCHIVED_ONLY', 'ALL', 'NORMAL']).default('NORMAL').describe('封存狀態篩選'),
		approved: z.enum(['APPROVED', 'DENIED', 'PENDING', 'ERROR']).optional().describe('簽核狀態篩選'),
		skipLines: z.boolean().default(false).describe('是否跳過表身資料'),
		selects: z.array(z.string()).optional().describe('選擇特定欄位'),
	}),
	execute: async (args: {
		table: string;
		filters?: Array<{
			bodyConditions?: Array<{
				fieldName: string;
				valueType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'ID';
				operator: 'in' | 'nin' | 'like' | 'gte' | 'lte' | 'gt' | 'lt';
				string?: string;
				number?: number;
				date?: string;
				boolean?: boolean;
				id?: string;
			}>;
			lineFilters?: Array<{
				lineName: string;
				lineConditions: Array<{
					fieldName: string;
					valueType: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'ID';
					operator: 'in' | 'nin' | 'like' | 'gte' | 'lte' | 'gt' | 'lt';
					string?: string;
					number?: number;
					date?: string;
					boolean?: boolean;
					id?: string;
				}>;
			}>;
		}>;
		limit?: number;
		offset?: number;
		sorting?: {
			field: string;
			direction: '1' | '-1';
		};
		archived?: 'ARCHIVED_ONLY' | 'ALL' | 'NORMAL';
		approved?: 'APPROVED' | 'DENIED' | 'PENDING' | 'ERROR';
		skipLines?: boolean;
		selects?: string[];
	}) => {
		try {
			// 轉換過濾條件
			const convertedFilters = args.filters?.map((filter) => ({
				bodyConditions: filter.bodyConditions?.map((condition) => {
					const baseCondition = {
						fieldName: condition.fieldName,
						valueType: NormFieldValueType[condition.valueType],
						operator: condition.operator,
					};

					// 根據 valueType 添加對應的值
					switch (condition.valueType) {
						case 'STRING':
							return { ...baseCondition, string: condition.string || null };
						case 'NUMBER':
							return { ...baseCondition, number: condition.number || null };
						case 'DATE':
							return { ...baseCondition, date: condition.date ? new Date(condition.date) : null };
						case 'BOOLEAN':
							return { ...baseCondition, boolean: condition.boolean ?? null };
						case 'ID':
							return { ...baseCondition, id: condition.id || null };
						default:
							return baseCondition;
					}
				}),
				lineFilters: filter.lineFilters?.map((lineFilter) => ({
					lineName: lineFilter.lineName,
					lineConditions: lineFilter.lineConditions.map((condition) => {
						const baseCondition = {
							fieldName: condition.fieldName,
							valueType: NormFieldValueType[condition.valueType],
							operator: condition.operator,
						};

						switch (condition.valueType) {
							case 'STRING':
								return { ...baseCondition, string: condition.string || null };
							case 'NUMBER':
								return { ...baseCondition, number: condition.number || null };
							case 'DATE':
								return { ...baseCondition, date: condition.date ? new Date(condition.date) : null };
							case 'BOOLEAN':
								return { ...baseCondition, boolean: condition.boolean ?? null };
							case 'ID':
								return { ...baseCondition, id: condition.id || null };
							default:
								return baseCondition;
						}
					}),
				})),
			}));

			// 建立查詢參數
			const queryArgs: any = {
				table: args.table,
				limit: args.limit || 50,
				offset: args.offset || 0,
				skipLines: args.skipLines || false,
			};

			if (convertedFilters && convertedFilters.length > 0) {
				queryArgs.filters = convertedFilters;
			}

			if (args.sorting) {
				queryArgs.sorting = {
					field: args.sorting.field,
					direction: parseInt(args.sorting.direction) as 1 | -1,
				};
			}

			if (args.archived && args.archived !== 'NORMAL') {
				queryArgs.archived = args.archived;
			}

			if (args.approved) {
				queryArgs.approved = args.approved;
			}

			if (args.selects && args.selects.length > 0) {
				queryArgs.selects = args.selects;
			}

			// 執行查詢
			const records = await context.graphqlClient.query.find(queryArgs);

			return JSON.stringify(
				{
					success: true,
					data: records,
					metadata: {
						table: args.table,
						count: records.length,
						limit: args.limit || 50,
						offset: args.offset || 0,
						hasMore: records.length === (args.limit || 50),
					},
				},
				null,
				2
			);
		} catch (error) {
			return JSON.stringify(
				{
					success: false,
					error: {
						message: error instanceof Error ? error.message : '未知錯誤',
						stack: error instanceof Error ? error.stack : undefined,
					},
				},
				null,
				2
			);
		}
	},
});
