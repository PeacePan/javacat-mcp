import { FastMCP } from 'fastmcp';
import { JavaCatGraphQLClient } from '../NorwegianForest/libs/graphql/client';
import { getAllTools } from './tools';

const graphqlClient = new JavaCatGraphQLClient({
	env: (process.env.GRAPHQL_ENV || 'dev') as 'production' | 'staging' | 'dev',
	authEnvPath: './javacat-auth.json',
});

(async function main() {
	const mcpServer = new FastMCP({
		name: 'wonderpet-omo-mcp',
		version: '1.0.0',
	});
	const tools = getAllTools({ graphqlClient });
	for (const tool of tools) mcpServer.addTool(tool);
	try {
		await mcpServer.start({ transportType: 'stdio' });
		await graphqlClient.auth.signin({
			name: 'Administrator',
			email: 'Administrator',
			otp: 'Administrator',
		});
		// 使用 stderr 避免干擾 MCP 通訊（stdout 用於協議通訊）
		console.error('MCP 伺服器已啟動並運行中');
		console.error(`已載入 ${tools.length} 個工具:`, tools.map((t) => t.name).join(', '));
	} catch (error) {
		console.error('啟動 MCP 伺服器失敗:', error);
		process.exit(1);
	}

	process.on('SIGINT', () => {
		console.error('正在關閉系統...');
		process.exit(0);
	});
})();
