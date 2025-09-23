import { z } from 'zod';
import { NormFieldValueType } from '@norwegianForestLibs/enum';
import { ToolContext, ToolDefinition } from './types';

export const listAvailableTables = (context: ToolContext): ToolDefinition => ({
	name: 'listAvailableTables',
	description: '列出系統中可用的表格清單，幫助了解有哪些表格可以查詢',
	parameters: z.object({
		tableType: z.enum(['all', 'system', 'data']).default('all').describe('表格類型篩選'),
		limit: z.number().min(1).max(200).default(50).describe('回傳筆數'),
	}),
	execute: async (args: { tableType?: 'all' | 'system' | 'data'; limit?: number }) => {
		try {
			const queryArgs: any = {
				table: '__table__',
				limit: args.limit || 50,
				sorting: {
					field: 'name',
					direction: 1 as 1,
				},
			};

			// 根據表格類型添加篩選
			if (args.tableType && args.tableType !== 'all') {
				const filters: any[] = [];
				if (args.tableType === 'system') {
					filters.push({
						fieldName: 'name',
						valueType: NormFieldValueType.STRING,
						operator: 'like',
						string: '__',
					});
				} else if (args.tableType === 'data') {
					// 資料表格通常不以 __ 開頭
					filters.push({
						fieldName: 'name',
						valueType: NormFieldValueType.STRING,
						operator: 'nin',
						string: '__',
					});
				}

				if (filters.length > 0) {
					queryArgs.filters = [{ bodyConditions: filters }];
				}
			}

			const tables = await context.graphqlClient.query.find(queryArgs);

			const tableList = tables.map((table: any) => {
				const name = table.body?.name || 'unknown';
				const displayName = table.body?.displayName || name;
				const tableType = name.startsWith('__') ? 'system' : 'data';
				const description = table.body?.description || '';

				return {
					name,
					displayName,
					type: tableType,
					description,
				};
			});

			return JSON.stringify(
				{
					success: true,
					data: {
						tables: tableList,
						count: tableList.length,
						totalAvailable: tables.length,
						filterApplied: args.tableType || 'all',
					},
					usage: {
						note: '使用 getTableSchema 工具可查看特定表格的詳細結構',
						queryTools: ['queryTableRecords', 'quickQueryTable'],
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
						message: error instanceof Error ? error.message : '取得表格清單失敗',
						stack: error instanceof Error ? error.stack : undefined,
					},
				},
				null,
				2
			);
		}
	},
});
