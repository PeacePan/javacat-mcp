import { TableName } from '@norwegianForestTypes/table';
import { JavaCatGraphQLClientOptions, SchemaDefineContent } from './@types';
import { RecordsSchemaDefine } from './@types/schema';
import { JavaCatGraphQLClientAuthHandler } from './auth';
import { JavaCatGraphQLClientBase } from './libs/base';
import { JavaCatGraphQLClientMutationHandler } from './mutation';
import { JavaCatGraphQLClientQueryHandler } from './query';

/**
 * JavaCat GraphQL 客戶端類別
 * 提供與 JavaCat GraphQL API 交互的功能，包括身份驗證、查詢、變更等操作
 * 支援客戶端和伺服器端環境，自動處理 JWT 令牌和 Cookie 管理
 *
 * @template RSD - RecordsSchemaDefine 子集
 *
 * 注意：
 * 如果在 webpack 中遇到 Module not found: Can't resolve 'fs' 的錯誤
 * 可以在 webpack 配置中添加以下設定來解決
 * 代表的意義是 -> 我知道 fs 是 Node 的模組，但你在 client-side 不要管它
 * ```javascript
 * webpack: (config, { isServer }) => {
 *   if (!isServer) {
 *     config.resolve.fallback.fs = false;
 *   }
 *   return config;
 * }
 * ```
 * 或者在 package.json 中添加以下設定
 * ```json
 * "browser": {
 *   "fs": false
 * }
 * ```
 * 伺服器端則需要在 tsconfig.json 中的 compilerOptions 添加 "DOM" 到 lib 陣列中
 * 避免出現 typeof window 出現 Cannot find name 'window' 的錯誤
 *
 * @example 客戶端環境
 * const client = new JavaCatGraphQLClient({
 *   env: 'production',
 *   jwtStorageKey: 'javacat_jwt'
 * });
 *
 * @example 伺服器端環境
 * const client = new JavaCatGraphQLClient({
 *   env: 'production',
 *   authEnvPath: '/path/to/auth.json'
 * });
 */
export class JavaCatGraphQLClient<
	RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>> = RecordsSchemaDefine,
> extends JavaCatGraphQLClientBase {
	//#region Properties
	private _authHandler: JavaCatGraphQLClientAuthHandler;
	private _queryHandler: JavaCatGraphQLClientQueryHandler<RSD>;
	private _mutationHandler: JavaCatGraphQLClientMutationHandler<RSD>;
	//#endregion

	constructor(options: JavaCatGraphQLClientOptions<RSD>) {
		const { querySchema, ...baseOptions } = options;
		super(baseOptions);
		this._authHandler = new JavaCatGraphQLClientAuthHandler(this._client, this._saveCredential.bind(this), {
			env: options.env,
		});
		this._queryHandler = new JavaCatGraphQLClientQueryHandler<RSD>(this._client, { querySchema });
		this._mutationHandler = new JavaCatGraphQLClientMutationHandler<RSD>(this._client, {
			env: options.env,
		});
	}

	/** 憑證相關操作 */
	public get auth(): JavaCatGraphQLClientAuthHandler {
		return this._authHandler;
	}
	/** 查詢相關操作 */
	public get query(): JavaCatGraphQLClientQueryHandler<RSD> {
		return this._queryHandler;
	}
	/** 變更相關操作 */
	public get mutation(): JavaCatGraphQLClientMutationHandler<RSD> {
		return this._mutationHandler;
	}
}
