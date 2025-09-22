import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { NormFieldValueType } from '@norwegianForestLibs/enum';
import { JavaCatGraphQLClient } from '@norwegianForestLibs/graphql/client';

const graphqlClient = new JavaCatGraphQLClient({
	env: 'staging',
	authEnvPath: './auth.json',
});

(async function main() {
	const mcpServer = new FastMCP({
		name: 'javacat-mcp-server',
		version: '1.0.0',
		instructions: '這是一個簡易的 MCP 伺服器，使用 FastMCP 框架。',
	});

	mcpServer.addTool({
		name: 'searchErrorTodoJobs',
		description: '查詢錯誤待辦工作歷程',
		parameters: z.object({
			startAt: z.string().describe('開始日期 須為 ISO 格式'),
			endAt: z.string().describe('結束日期 須為 ISO 格式'),
		}),
		execute: async (args: { startAt: string; endAt: string }) => {
			const { startAt, endAt } = args;
			const records = await graphqlClient.query.find({
				table: '__joblog__',
				filters: [
					{
						bodyConditions: [
							{
								fieldName: 'status',
								valueType: NormFieldValueType.STRING,
								operator: 'in',
								string: 'ERROR',
							},
							{
								fieldName: '_createdAt',
								valueType: NormFieldValueType.DATE,
								operator: 'gte',
								date: new Date(startAt),
							},
							{
								fieldName: '_createdAt',
								valueType: NormFieldValueType.DATE,
								operator: 'lte',
								date: new Date(endAt),
							},
						],
					},
				],
			});
			return JSON.stringify(records, null, 2);
		},
	});

	try {
		await mcpServer.start({ transportType: 'httpStream', httpStream: { port: 9453 } });
		await graphqlClient.auth.signin({
			name: 'Administrator',
			email: 'Administrator',
			otp: 'Administrator',
		});
		console.log('MCP 伺服器已啟動並運行中');
	} catch (error) {
		console.error('啟動 MCP 伺服器失敗:', error);
	}

	process.on('SIGINT', () => {
		console.log('正在關閉系統...');
		process.exit(0);
	});
})();
