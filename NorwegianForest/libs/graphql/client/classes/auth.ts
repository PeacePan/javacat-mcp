import { GraphQLError } from 'graphql/error/GraphQLError';
import { jwtDecode } from 'jwt-decode';
import setCookieParser from 'set-cookie-parser';
import {
	ApolloClient,
	ApolloLink,
	ApolloQueryResult,
	FetchResult,
	InMemoryCache,
	MutationOptions,
	NormalizedCacheObject,
	OperationVariables,
	QueryOptions,
	createHttpLink,
	gql,
	isApolloError,
} from '@apollo/client';
import { setContext as setLinkContext } from '@apollo/client/link/context';
import { onError as handleLinkError } from '@apollo/client/link/error';
import { asyncMap } from '@apollo/client/utilities';
import { GraphQLServerResult, OneTimePasswordArgs, SigninArgs, SigninByTokenArgs } from '../../../@types/graphql';
import { variableStringGenerator } from '../libs/utils';
import { JavaCatGraphQLClientBaseOptions } from '../type';

/**
 * JavaCat GraphQL Client 的驗證處理類別
 * 提供 JWT、Cookie 管理、登入、OTP、Token 登入、JWT 刷新等功能
 */
export class JavaCatGraphQLClientAuth {
	//#region Properties

	/** Apollo Client 實體 */
	protected _client: ApolloClient<NormalizedCacheObject>;
	/** JWT 令牌字串 */
	protected _jwt: string | null = null;
	/** Cookie 字串 */
	protected _cookie: string | null = null;
	/** GraphQL Doamin */
	private _domain: string;
	/** JWT 在 localStorage 的儲存鍵值 */
	private _jwtStorageKey: string | null = null;
	/** 伺服器端憑證檔案路徑 */
	private _authEnvPath: string | null = null;

	/** 唯讀 Apollo Client 實體 */
	public get client(): ApolloClient<NormalizedCacheObject> {
		return this._client;
	}
	/**
	 * 是否已登入（JWT 有效且未過期）
	 */
	public get isSignedIn(): boolean {
		const isSignedIn = isClientSide() ? !!this._jwt : !!this._jwt && !!this._cookie;
		if (isSignedIn) {
			try {
				/**
				 * 嘗試解碼 JWT 以驗證其有效性
				 * 如果 JWT 已過期，則視為未登入
				 */
				const result = jwtDecode<{ exp: number }>(this._jwt || '');
				return typeof result?.exp === 'number' && result.exp > Date.now() / 1000;
			} catch (error) {
				return false;
			}
		}
		return false;
	}
	//#endregion

	/**
	 * 建構子
	 * @param graphQLUri GraphQL 端點 URI
	 * @param options jwtStorageKey（client 端）或 authEnvPath（server 端）
	 */
	constructor(
		graphQLUri: string,
		options: Pick<JavaCatGraphQLClientBaseOptions, 'jwtStorageKey' | 'authEnvPath'> = {}
	) {
		const { authEnvPath, jwtStorageKey } = options;
		this._domain = graphQLUri.replace(/^http(s?):\/\//, '').split('/')[0];
		if (isServerSide()) {
			if (!authEnvPath) {
				throw new Error('JavaCatGraphQLClient: authFilePath is required in server side');
			}
			try {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const fs = require('fs');
				if (fs.existsSync(authEnvPath)) {
					const raw = fs.readFileSync(authEnvPath, 'utf8');
					const json = JSON.parse(raw)?.[this._domain];
					this._jwt = json?.jwt || null;
					this._cookie = json?.cookies || null;
				}
			} catch (error) {
				throw new Error(`JavaCatGraphQLClient: failed to read auth file at ${authEnvPath}, error: ${error}`);
			}
			this._authEnvPath = authEnvPath;
		} else {
			if (!jwtStorageKey) {
				throw new Error('JavaCatGraphQLClient: jwtStorageKey is required in client side');
			}
			this._jwt = localStorage.getItem(jwtStorageKey) || '';
			this._jwtStorageKey = jwtStorageKey;
		}
		this._client = createApolloClient.bind(this)(graphQLUri, {
			customApolloLink: isServerSide()
				? (apolloLink: ApolloLink): ApolloLink => {
						const cookieSaverLink = new ApolloLink((operation, forward) =>
							asyncMap(forward(operation), async (response) => {
								const context = operation.getContext();
								const { headers } = context.response;
								if (headers) {
									/** 透過 setCookieParser 把回傳的 response header 裡的 set-cookie 字串轉成 cookie 物件資料 */
									const cookieToSet = headers.get('set-cookie') || headers.get('Set-Cookie');
									if (cookieToSet) {
										const parsedCookies = setCookieParser.parse(cookieToSet);
										this._cookie = parsedCookies
											.map(({ name, value }) => `${name}=${value};`)
											.join(' ');
									}
								}
								return response;
							})
						);
						return cookieSaverLink.concat(apolloLink);
				  }
				: void 0,
		});
	}

	/**
	 * 儲存 JWT 令牌到對應的儲存位置
	 * 客戶端使用 localStorage，伺服器端使用檔案系統
	 * @param jwt 要儲存的 JWT 令牌，null 則清除
	 * @throws {Error} 無法寫入檔案時拋出
	 */
	private async _saveCredential(jwt: string | null): Promise<void> {
		this._jwt = jwt;
		if (isClientSide() && this._jwtStorageKey) {
			if (this._jwt) localStorage.setItem(this._jwtStorageKey, this._jwt);
			else localStorage.removeItem(this._jwtStorageKey);
		} else if (isServerSide() && this._authEnvPath) {
			const fs = await import('fs');
			if (this._jwt && this._cookie) {
				const authData = {
					[this._domain]: { jwt: this._jwt, cookies: this._cookie },
				};
				fs.writeFileSync(this._authEnvPath, JSON.stringify(authData, null, 2), 'utf8');
			} else if (fs.existsSync(this._authEnvPath)) {
				fs.unlinkSync(this._authEnvPath);
			}
		}
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
	public async otp(args: OneTimePasswordArgs): Promise<boolean> {
		const variablesTypeDefine = ['$name: String!', '$email: String', '$mobile: String', '$dangerOTP: String'].join(
			' '
		);
		const { mobile } = args;
		const result = await this._client.mutate<{ otp: boolean }, typeof args>({
			mutation: gql`mutation otp(${variablesTypeDefine}) { otp(${variableStringGenerator(
				variablesTypeDefine
			)}) }`,
			variables: { ...args, mobile: typeof mobile === 'string' ? mobile.replace(/^09/, '+886') : void 0 },
			fetchPolicy: 'no-cache',
		});
		return !!result.data?.otp;
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
	 * const jwt = await client.signIn({
	 *   name: 'john_doe',
	 *   email: 'john@example.com',
	 *   otp: '123456'
	 * });
	 *
	 */
	public async signIn(args: SigninArgs): Promise<string | null> {
		const variablesTypeDefine = ['$name: String!', '$email: String', '$mobile: String', '$otp: String!'].join(' ');
		const { mobile } = args;
		const result = await this._client.mutate<{ signin: string }, typeof args>({
			mutation: gql`mutation signin(${variablesTypeDefine}) { signin(${variableStringGenerator(
				variablesTypeDefine
			)}) }`,
			variables: { ...args, mobile: typeof mobile === 'string' ? mobile.replace(/^09/, '+886') : void 0 },
			fetchPolicy: 'no-cache',
		});
		const jwt = result.data?.signin || null;
		await this._saveCredential(jwt);
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
	 * const jwt = await client.signInByToken({
	 *   accessKeyId: 'your_access_key_id',
	 *   secretAccessKey: 'your_secret_access_key'
	 * });
	 */
	public async signInByToken(args: SigninByTokenArgs): Promise<string | null> {
		const variablesTypeDefine = ['$accessKeyId: String!', '$secretAccessKey: String!'].join(' ');
		const result = await this._client.mutate<{ signinByToken: string }, typeof args>({
			mutation: gql`mutation signinByToken(${variablesTypeDefine}) {
						signinByToken(${variableStringGenerator(variablesTypeDefine)})
					}`,
			variables: args,
			fetchPolicy: 'no-cache',
		});
		const jwt = result.data?.signinByToken || null;
		await this._saveCredential(jwt);
		return jwt;
	}
	/**
	 * 刷新當前的 JWT 令牌
	 * 使用現有的 JWT 令牌取得新的令牌，延長登入時效
	 *
	 * @returns {Promise<string>} 新的 JWT 令牌字串
	 *
	 * @throws {Error} 當現有 JWT 無效或過期時拋出錯誤
	 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
	 *
	 * @example
	 * try {
	 *   const newJwt = await client.jwtRenew();
	 *   console.log('JWT 令牌已刷新:', newJwt);
	 * } catch (error) {
	 *   console.error('刷新 JWT 失敗:', error.message);
	 * }
	 */
	public async jwtRenew(): Promise<string | null> {
		const result = await this._client.query<{ renew: string }>({
			query: gql('mutation { renew }'),
			fetchPolicy: 'no-cache',
		});
		const jwt = result.data?.renew || null;
		await this._saveCredential(jwt);
		return jwt;
	}
}

/**
 * 建立 Apollo Client 實體
 * @param uri GraphQL 端點 URI
 * @param options 可自訂 Apollo Link
 * @returns ApolloClient 實體
 */
function createApolloClient(
	this: JavaCatGraphQLClientAuth,
	uri: string,
	options: {
		customApolloLink?: (apolloLink: ApolloLink) => ApolloLink;
	} = {}
): ApolloClient<NormalizedCacheObject> {
	/** 指定 graphql 位置的 link */
	const httpLink = createHttpLink({ uri, fetch, credentials: 'include' });
	/** 處理 jwt token 的 link */
	const authLink = setLinkContext(({ context = {} }, prevContext) => {
		const { headers = {} } = context;
		const newHeaders: Record<string, string> = { ...headers };
		if (this._jwt) newHeaders.authorization = `Bearer ${this._jwt}`;
		if (isServerSide() && this._cookie) newHeaders.cookie = this._cookie;
		return { ...prevContext, ...context, mode: 'cors', headers: newHeaders };
	});
	/** 當發出的 GraphQL 請求遭到回應 403 時優化錯誤訊息 */
	const errorLink = handleLinkError(({ networkError, response }) => {
		if (networkError && 'response' in networkError && networkError.statusCode === 403) {
			if (this._jwt) networkError.message = '登入時效權限過期，請重新登入';
		}
		if (response) {
			/** 優化權限過期的錯誤訊息 */
			if (response.errors?.some((error) => error.message === 'jwt expired')) {
				response.errors = response.errors.map((error) => ({
					...error,
					message: '登入時效權限過期，請重新登入',
				}));
			}
			/** 優化拒絕存取的錯誤訊息 */
			if (response.errors?.some(({ message }) => message.includes('拒絕存取'))) {
				response.errors = response.errors.map((error) => ({
					...error,
					message:
						'當前使用者無權限，若需要申請權限\n正式站 (Production)：請詢問系統維運部\n測試站 (Staging)：請詢問系統發展部\n' +
						error.message,
				}));
			}
		}
	});
	let apolloLinkChain = errorLink.concat(authLink.concat(httpLink));
	apolloLinkChain = options.customApolloLink?.(apolloLinkChain) ?? apolloLinkChain;

	const client = new ApolloClient({
		cache: new InMemoryCache({ addTypename: false }),
		link: apolloLinkChain,
		ssrMode: isServerSide(),
		/**
		 * 讓每一次的 fetch promise 都視為不同的請求，讓 fetchOptions 不被重複使用
		 * @see https://www.apollographql.com/docs/react/v2/networking/network-layer/#query-deduplication
		 */
		queryDeduplication: false,
	});
	const origiqnalQuery = client.query;
	client.query = (async <T, TVariables extends OperationVariables>(
		options: QueryOptions<TVariables, T>
	): Promise<ApolloQueryResult<T>> =>
		origiqnalQuery(options).catch((error) => {
			throw new Error(extractMessageFromServerError(error));
		})).bind(client);
	const origiqnalMutate = client.mutate;
	client.mutate = (async <T, TVariables extends OperationVariables>(
		options: MutationOptions<T, TVariables>
	): Promise<FetchResult<T>> =>
		origiqnalMutate(options).catch((error) => {
			throw new Error(extractMessageFromServerError(error));
		})).bind(client);
	return client;
}
/**
 * 將伺服器回傳的錯誤結構轉成一連串的字串
 * 主要包含 GraphQL server 檢查出的 error 和 GraphQL 操作的 error
 * 多個錯誤時會以 `\n` 字元做串接，可以使用 `.split('\n')` 來切割
 * 若有伺服器回傳的錯誤會優先擺到前頭，網路 HTTP 狀態錯誤擺在最後
 *
 * @param {Error} error - 原始錯誤物件，可能是 Apollo Error 或一般 Error
 *
 * @returns {string} 格式化後的錯誤訊息字串，多個錯誤以換行符號分隔
 *
 * @description
 * 可能會遭遇以下幾種情況的錯誤：
 * 1. 普通程式的錯誤
 * 2. 網路請求的錯誤 HTTP (請求不會到達 Server)
 * 3. 網路請求 4XX (請求到達 Server 但 GraphQL 解析發生錯誤)
 * 4. 網路請求 5XX 且回傳結果為純文字 (請求到達 Server 但 GraphQL Server 程式出錯)
 * 5. 網路請求 5XX 且有回傳處理結果 (請求到達 Server 但 GraphQL Handler 處理發生錯誤沒有 catch 到)
 *
 * @example
 * try {
 *   await client.find({ table: 'users' });
 * } catch (error) {
 *   const formattedMessage = extractMessageFromServerError(error);
 *   console.error('請求失敗:', formattedMessage);
 *
 *   const errorMessages = formattedMessage.split('\n');
 *   errorMessages.forEach((msg, index) => {
 *     console.error(`錯誤 ${index + 1}:`, msg);
 *   });
 * }
 */
/**
 * 將伺服器回傳的錯誤結構轉成一連串的字串
 * 主要包含 GraphQL server 檢查出的 error 和 GraphQL 操作的 error
 * 多個錯誤時會以 `\n` 字元做串接，可用 `.split('\n')` 切割
 * @param error 原始錯誤物件
 * @returns 格式化後的錯誤訊息字串
 */
function extractMessageFromServerError(error: Error): string {
	const messages: string[] = [];
	let httpStatus: number | null = null;
	// 把 client 端的錯誤堆疊印出
	if (error?.stack) console.error(error.stack);
	if (error && isApolloError(error) && error.networkError) {
		const { networkError } = error;
		if ('bodyText' in networkError) {
			/** Apollo ServerParseError Type Guard */
			httpStatus = networkError.statusCode;
			messages.push(networkError.message);
			/** 造成 ServerParseError 時，通常是伺服器回傳純文字而不是 JSON 因此把回傳的結果帶出 */
			messages.push(networkError.bodyText);
		} else if ('response' in networkError) {
			/** Apollo ServerError Type Guard */
			httpStatus = networkError.statusCode;
			const serverResult = networkError.result as GraphQLServerResult;
			// 處理 server 端帶過來的 error
			const serverErrors = serverResult?.errors || [];
			for (const serverError of serverErrors) {
				// 把 server 端的錯誤堆疊印出
				console.error(
					serverError?.extensions?.code,
					serverError?.extensions?.exception?.stacktrace?.join('\n')
				);
				let message = serverError?.message;
				/**
				 * 如果後端直接帶出 error 的 message 而不是用 error 直接輸出字串的話
				 * 不會帶有 Error 名前綴，這邊補上 Error 名前綴，以利後續處理
				 */
				if (typeof message === 'string' || /^(\w+)?(Error: )/.test(message)) {
					message = `Error: ${message}`;
				}
				messages.push(message);
			}
			/** 處理寫入 gql 操作時發生的錯誤 */
			const graphQLErrors = error?.graphQLErrors || [];
			for (const graphQLError of graphQLErrors) {
				messages.push(graphQLError.message);
			}
		} else {
			messages.push(networkError.message);
		}
	} else if (error instanceof GraphQLError) {
		messages.push(error.toString());
	}
	let defaultMessage = (error?.message || error?.toString() || '').replace(/^(GraphQL error: )/, '');
	const invalidMutateNum = +(defaultMessage.match(/###\d+###/)?.[0]?.match(/\d+/)?.[0] || '0');
	if (invalidMutateNum > 0) {
		defaultMessage = defaultMessage.replace(new RegExp(`###${invalidMutateNum}###`), `第 ${invalidMutateNum} 筆`);
	}
	messages.push(defaultMessage);
	if (httpStatus && httpStatus >= 400) messages.unshift(`http status: ${httpStatus}`);
	return Array.from(new Set(messages)).join('\n');
}

/**
 * 檢查當前執行環境是否為客戶端
 * @returns {boolean} 如果當前環境為客戶端（瀏覽器）則返回 true，否則返回 false
 */
/**
 * 檢查當前執行環境是否為客戶端
 * @returns 如果為客戶端（瀏覽器）則返回 true，否則 false
 */
function isClientSide(): boolean {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}
/**
 * 檢查當前執行環境是否為伺服器端
 * @returns {boolean} 如果當前環境為伺服器端（Node.js）則返回 true，否則返回 false
 */
/**
 * 檢查當前執行環境是否為伺服器端
 * @returns 如果為伺服器端（Node.js）則返回 true，否則 false
 */
function isServerSide(): boolean {
	return typeof window === 'undefined' || typeof localStorage === 'undefined';
}
