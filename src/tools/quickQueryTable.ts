import { z } from 'zod';
import { NormFieldValueType } from '@norwegianForestLibs/enum';
import { ToolContext, ToolDefinition } from './types';

export const quickQueryTable = (context: ToolContext): ToolDefinition => ({
	name: 'quickQueryTable',
	description: '快速查詢表格資料。適用於簡單的查詢需求，如查看表格的所有記錄或基本條件篩選',
	parameters: z.object({
		table: z.string().describe('表格名稱'),
		limit: z.number().min(1).max(500).default(20).describe('回傳筆數限制 (預設 20)'),
		offset: z.number().min(0).default(0).describe('偏移量 (預設 0)'),
		orderBy: z.string().default('_id').describe('排序欄位 (預設 _id)'),
		orderDirection: z.enum(['asc', 'desc']).default('desc').describe('排序方向 (預設 desc)'),
		fieldFilter: z
			.object({
				field: z.string().describe('要篩選的欄位名稱'),
				value: z.union([z.string(), z.number(), z.boolean()]).describe('篩選值'),
				operator: z
					.enum(['equals', 'contains', 'gt', 'gte', 'lt', 'lte'])
					.default('equals')
					.describe('比較方式'),
			})
			.optional()
			.describe('簡單欄位篩選'),
		dateRange: z
			.object({
				field: z.string().describe('日期欄位名稱'),
				startDate: z.string().describe('開始日期 (ISO 格式)'),
				endDate: z.string().describe('結束日期 (ISO 格式)'),
			})
			.optional()
			.describe('日期範圍篩選'),
	}),
	execute: async (args: {
		table: string;
		limit?: number;
		offset?: number;
		orderBy?: string;
		orderDirection?: 'asc' | 'desc';
		fieldFilter?: {
			field: string;
			value: string | number | boolean;
			operator: 'equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte';
		};
		dateRange?: {
			field: string;
			startDate: string;
			endDate: string;
		};
	}) => {
		try {
			const queryArgs: any = {
				table: args.table,
				limit: args.limit || 20,
				offset: args.offset || 0,
				sorting: {
					field: args.orderBy || '_id',
					direction: (args.orderDirection === 'asc' ? 1 : -1) as 1 | -1,
				},
			};

			// 建立過濾條件
			const bodyConditions: any[] = [];

			// 添加欄位篩選
			if (args.fieldFilter) {
				const { field, value, operator } = args.fieldFilter;
				let condition: any = {
					fieldName: field,
				};

				// 根據值的類型設定 valueType 和對應的值
				if (typeof value === 'string') {
					condition.valueType = NormFieldValueType.STRING;
					condition.string = value;
					// 根據操作符調整
					switch (operator) {
						case 'contains':
							condition.operator = 'like';
							break;
						case 'equals':
							condition.operator = 'in';
							break;
						default:
							condition.operator = 'in';
					}
				} else if (typeof value === 'number') {
					condition.valueType = NormFieldValueType.NUMBER;
					condition.number = value;
					switch (operator) {
						case 'gt':
							condition.operator = 'gt';
							break;
						case 'gte':
							condition.operator = 'gte';
							break;
						case 'lt':
							condition.operator = 'lt';
							break;
						case 'lte':
							condition.operator = 'lte';
							break;
						default:
							condition.operator = 'in';
					}
				} else if (typeof value === 'boolean') {
					condition.valueType = NormFieldValueType.BOOLEAN;
					condition.boolean = value;
					condition.operator = 'in';
				}

				bodyConditions.push(condition);
			}

			// 添加日期範圍篩選
			if (args.dateRange) {
				const { field, startDate, endDate } = args.dateRange;
				bodyConditions.push(
					{
						fieldName: field,
						valueType: NormFieldValueType.DATE,
						operator: 'gte',
						date: new Date(startDate),
					},
					{
						fieldName: field,
						valueType: NormFieldValueType.DATE,
						operator: 'lte',
						date: new Date(endDate),
					}
				);
			}

			// 如果有條件，添加到查詢參數中
			if (bodyConditions.length > 0) {
				queryArgs.filters = [{ bodyConditions }];
			}

			const records = await context.graphqlClient.query.find(queryArgs);

			return JSON.stringify(
				{
					success: true,
					data: records,
					metadata: {
						table: args.table,
						count: records.length,
						limit: args.limit || 20,
						offset: args.offset || 0,
						hasMore: records.length === (args.limit || 20),
						appliedFilters: {
							fieldFilter: args.fieldFilter,
							dateRange: args.dateRange,
						},
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
