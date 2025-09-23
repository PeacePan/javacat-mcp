import { z } from 'zod';
import { NormFieldValueType } from '@norwegianForestLibs/enum';
import { ToolContext, ToolDefinition } from './types';

export const getTableSchema = (context: ToolContext): ToolDefinition => ({
	name: 'getTableSchema',
	description: '取得表格結構定義，包含欄位資訊、資料型別等。幫助了解表格有哪些欄位可以查詢',
	parameters: z.object({
		tableName: z.string().describe('表格名稱'),
	}),
	execute: async (args: { tableName: string }) => {
		try {
			// 查詢系統表格定義
			const tableInfo = await context.graphqlClient.query.find({
				table: '__table__',
				filters: [
					{
						bodyConditions: [
							{
								fieldName: 'name',
								valueType: NormFieldValueType.STRING,
								operator: 'in',
								string: args.tableName,
							},
						],
					},
				],
				limit: 1,
			});

			if (tableInfo.length === 0) {
				return JSON.stringify(
					{
						success: false,
						error: {
							message: `找不到表格: ${args.tableName}`,
						},
					},
					null,
					2
				);
			}

			return JSON.stringify(
				{
					success: true,
					data: {
						table: args.tableName,
						definition: tableInfo[0],
						usage: {
							example: `可使用 queryTableRecords 或 quickQueryTable 工具查詢此表格的資料`,
							commonFields: ['_id', '_createdAt', '_updatedAt', '_archivedAt'],
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
						message: error instanceof Error ? error.message : '取得表格結構失敗',
						stack: error instanceof Error ? error.stack : undefined,
					},
				},
				null,
				2
			);
		}
	},
});
