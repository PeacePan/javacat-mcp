import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { DeviceSigninArgs, OneTimePasswordArgs, SigninArgs, SigninByTokenArgs } from '@norwegianForestTypes/graphql';
import { JavaCatGraphQLClientBaseOptions } from '../../client/@types';

/**
 * JavaCat GraphQL Client 的驗證處理類別
 * 提供 JWT、Cookie 管理、登入、OTP、Token 登入、JWT 刷新等功能
 */
export class JavaCatGraphQLClientAuthHandler {
	private _env: JavaCatGraphQLClientBaseOptions['env'];

	constructor(
		private _client: ApolloClient<NormalizedCacheObject>,
		private _credentialSaver: (jwt: string | null) => Promise<void>,
		args?: Pick<JavaCatGraphQLClientBaseOptions, 'env'>
	) {
		this._env = args?.env || 'dev';
	}

	/**
	 * 驗證當前 JWT 令牌是否合法且未過期
	 * 同時取得使用者的身份驗證資訊，包括角色、權限、約束條件等
	 *
	 * @returns {Promise<Authentication>} 身份驗證資訊物件
	 * @returns {Promise<Authentication>} authentication.roles - 使用者角色列表
	 * @returns {Promise<Authentication>} authentication.tables - 可存取的表格列表
	 * @returns {Promise<Authentication>} authentication.hideLeftNavGroup - 是否隱藏左側導航群組
	 * @returns {Promise<Authentication>} authentication.user - 使用者基本資訊
	 * @returns {Promise<Authentication>} authentication.constraints - 舊版約束條件
	 * @returns {Promise<Authentication>} authentication.permissions - 舊版權限設定
	 * @returns {Promise<Authentication>} authentication.constraints2 - 新版約束條件
	 * @returns {Promise<Authentication>} authentication.permissions2 - 新版權限設定
	 * @returns {Promise<Authentication>} authentication.token - API 存取令牌資訊
	 *
	 * @throws {Error} 當 JWT 過期或無效時拋出錯誤
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 *
	 * @example
	 * try {
	 *   const authInfo = await authenticate();
	 *   console.log('使用者角色:', authInfo.roles);
	 *   console.log('使用者資訊:', authInfo.user);
	 * } catch (error) {
	 *   console.error('身份驗證失敗:', error.message);
	 * }
	 */
	/**
	 * 驗證當前 JWT 令牌是否合法且未過期，並取得使用者身份資訊
	 * @returns 身份驗證資訊物件
	 * @throws {Error} JWT 過期或無效、GraphQL 請求失敗時拋出
	 */
	public async authenticate(): ReturnType<typeof authenticateHandler> {
		const authenticateHandler = await import('./authenticate').then((m) => m.default);
		return authenticateHandler(this._client);
	}
	/**
	 * 產生驗證碼並發送到指定的電子郵件或手機號碼
	 * 支援一般 OTP 和危險操作 OTP 兩種模式
	 *
	 * @param {OneTimePasswordArgs} args - 驗證碼請求參數
	 * @param {string} args.name - 使用者名稱
	 * @param {string} [args.email] - 電子郵件地址（與 mobile 二選一）
	 * @param {string} [args.mobile] - 手機號碼（與 email 二選一，會自動將 09 開頭轉換為 +886）
	 * @param {string} [args.dangerOTP] - 危險操作 OTP 標識
	 *
	 * @returns {Promise<boolean>} 發送成功返回 true，失敗返回 false
	 *
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 *
	 * @example 使用電子郵件發送 OTP
	 * const success = await client.otp({
	 *   name: 'john_doe',
	 *   email: 'john@example.com'
	 * });
	 *
	 * @example 發送危險操作 OTP
	 * const success = await client.otp({
	 *   name: 'john_doe',
	 *   email: 'john@example.com',
	 *   dangerOTP: '000000'
	 * });
	 */
	public async otp(args: OneTimePasswordArgs): ReturnType<typeof otpHandler> {
		const otpHandler = await import('./otp').then((m) => m.default);
		return otpHandler(this._client, args);
	}

	/**
	 * 使用驗證碼登入並取得 JWT 令牌
	 * 登入成功後會自動儲存 JWT 令牌到對應的儲存位置（客戶端的 localStorage 或伺服器端的檔案）
	 *
	 * @param {SigninArgs} args - 登入參數
	 * @param {string} args.name - 使用者名稱
	 * @param {string} [args.email] - 電子郵件地址（與 mobile 二選一）
	 * @param {string} [args.mobile] - 手機號碼（與 email 二選一，會自動將 09 開頭轉換為 +886）
	 * @param {string} args.otp - 驗證碼
	 *
	 * @returns {Promise<string | null>} 登入成功返回 JWT 令牌字串，失敗返回 null
	 *
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 *
	 * @example 使用電子郵件和 OTP 登入
	 * const jwt = await client.signin({
	 *   name: 'john_doe',
	 *   email: 'john@example.com',
	 *   otp: '123456'
	 * });
	 *
	 */
	public async signin(args: SigninArgs): ReturnType<typeof signinHandler> {
		const signinHandler = await import('./signin').then((m) => m.default);
		const jwt = await signinHandler(this._client, args);
		await this._credentialSaver(jwt);
		return jwt;
	}
	/**
	 * 使用存取金鑰登入並取得 JWT 令牌
	 * 登入成功後會自動儲存 JWT 令牌到對應的儲存位置（客戶端的 localStorage 或伺服器端的檔案）
	 *
	 * @param {SigninByTokenArgs} args - 存取金鑰登入參數
	 * @param {string} args.accessKeyId - 存取金鑰 ID
	 * @param {string} args.secretAccessKey - 存取金鑰密鑰
	 *
	 * @returns {Promise<string | null>} 登入成功返回 JWT 令牌字串，失敗返回 null
	 *
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 *
	 * @example 使用存取金鑰登入
	 * const jwt = await client.signinByToken({
	 *   accessKeyId: 'your_access_key_id',
	 *   secretAccessKey: 'your_secret_access_key'
	 * });
	 */
	public async signinByToken(args: SigninByTokenArgs): ReturnType<typeof signinByTokenHandler> {
		const signinByTokenHandler = await import('./signinByToken').then((m) => m.default);
		const jwt = await signinByTokenHandler(this._client, args);
		await this._credentialSaver(jwt);
		return jwt;
	}
	/**
	 * 刷新當前的 JWT 令牌 (DEV only)
	 * 使用現有的 JWT 令牌取得新的令牌，延長登入時效
	 *
	 * @returns {Promise<string>} 新的 JWT 令牌字串
	 *
	 * @throws {Error} 當現有 JWT 無效或過期時拋出錯誤
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 */
	public async jwtRenew(): ReturnType<typeof jwtRenewHandler> {
		if (this._env !== 'dev') throw new Error('jwtRenew 只能在 DEV 環境下使用');
		const jwtRenewHandler = await import('./jwtRenew').then((m) => m.default);
		const jwt = await jwtRenewHandler(this._client);
		await this._credentialSaver(jwt);
		return jwt;
	}
	/**
	 * 切換使用者 (DEV & Administrator only)
	 * 會重新取得新的 JWT 令牌並儲存
	 *
	 * @returns {Promise<string | null>} 新的 JWT 令牌字串，若無法取得則返回 null
	 *
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 */
	public async changeUser(userName: string): ReturnType<typeof changeUserHandler> {
		if (this._env !== 'dev') throw new Error('changeUser 只能在 DEV 環境下使用');
		const authInfo = await this.authenticate();
		if (authInfo.user?.name !== 'Administrator') {
			const adminJWT = await this.signin({
				name: 'Administrator',
				email: 'Administrator',
				otp: 'Administrator',
			});
			await this._credentialSaver(adminJWT);
		}
		const changeUserHandler = await import('./changeUser').then((m) => m.default);
		const jwt = await changeUserHandler(this._client, userName);
		await this._credentialSaver(jwt);
		return jwt;
	}
	/**
	 * 裝置登入請求 OTP
	 * @param args 裝置登入參數
	 * @param args.deviceName - 裝置名稱
	 * @param args.deviceId - 裝置唯一識別碼
	 * @param args.userName - 使用者名稱
	 * @returns {Promise<boolean>} 請求成功返回 true，失敗返回 false
	 *
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 */
	public async tokenNewReq(
		args: Pick<DeviceSigninArgs, 'deviceName' | 'deviceId' | 'userName'>
	): ReturnType<typeof tokenNewReqHandler> {
		const tokenNewReqHandler = await import('./tokenNewReq').then((m) => m.default);
		return tokenNewReqHandler(this._client, args);
	}
	/**
	 * 裝置登入產生 token
	 * @param args 裝置登入參數
	 * @param args.deviceName - 裝置名稱
	 * @param args.deviceId - 裝置唯一識別碼
	 * @param args.userName - 使用者名稱
	 * @param args.otp - 驗證碼
	 * @returns {Promise<DeviceToken | null>} 登入成功返回裝置令牌物件，失敗返回 null
	 *
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 */
	public async tokenNew(args: DeviceSigninArgs): ReturnType<typeof tokenNewHandler> {
		const tokenNewHandler = await import('./tokenNew').then((m) => m.default);
		return tokenNewHandler(this._client, args);
	}
	/**
	 * 裝置令牌刷新 token
	 * @param args 裝置令牌刷新參數
	 * @param args.deviceName - 裝置名稱
	 * @param args.deviceId - 裝置唯一識別碼
	 * @returns {Promise<DeviceToken | null>} 刷新成功返回新的裝置令牌物件，失敗返回 null
	 *
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 */ public async tokenRenew(
		args: Pick<DeviceSigninArgs, 'deviceName' | 'deviceId'>
	): ReturnType<typeof tokenRenewHandler> {
		const tokenRenewHandler = await import('./tokenRenew').then((m) => m.default);
		return tokenRenewHandler(this._client, args);
	}
}
