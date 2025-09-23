import { FastMCP } from 'fastmcp';
import { JavaCatGraphQLClient } from '@norwegianForestLibs/graphql/client';
import { getAllTools } from './tools';

const graphqlClient = new JavaCatGraphQLClient({
	env: 'staging',
	authEnvPath: './auth.json',
});

(async function main() {
	const mcpServer = new FastMCP({
		name: 'javacat-mcp',
		version: '1.0.0',
		instructions: '這是一個簡易的 MCP 伺服器，使用 FastMCP 框架。',
	});
	const tools = getAllTools({ graphqlClient });
	for (const tool of tools) mcpServer.addTool(tool);
	try {
		await mcpServer.start({ transportType: 'httpStream', httpStream: { port: 54088 } });
		await graphqlClient.auth.signin({
			name: 'Administrator',
			email: 'Administrator',
			otp: 'Administrator',
		});
		console.log('MCP 伺服器已啟動並運行中');
		console.log(`已載入 ${tools.length} 個工具:`, tools.map((t) => t.name).join(', '));
	} catch (error) {
		console.error('啟動 MCP 伺服器失敗:', error);
	}

	process.on('SIGINT', () => {
		console.log('正在關閉系統...');
		process.exit(0);
	});
})();
