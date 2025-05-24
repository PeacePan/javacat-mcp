import fetch from 'cross-fetch';
import { GraphQLError, printError } from 'graphql';
import { uniq } from 'lodash';
import setCookieParser from 'set-cookie-parser';
import {
	ApolloClient,
	ApolloLink,
	InMemoryCache,
	NormalizedCacheObject,
	createHttpLink,
	gql,
	isApolloError,
} from '@apollo/client';
import { setContext as setLinkContext } from '@apollo/client/link/context/index.js';
import { asyncMap } from '@apollo/client/utilities/index.js';
import {
	ApprovalStatus,
	ArchivedStatus,
	FIELD_VALUE_TYPE,
	GQLFindResult,
	GQLNormArgs,
	GQLServerResult,
	NormField,
	NormFieldValueType,
	NormFindArgs,
	NormRecord2,
	SafeRecord2,
} from './types';

/** 使用關聯變數來設定 jwt 字串與 cookie session，類似偽 localStorage 作法 */
export const cSignRef = { jwt: '', cookie: '' };
const cNormField: Array<keyof NormField | 'boolean' | 'string' | 'number' | 'date' | 'id'> = [
	'fieldName',
	'valueType',
	'boolean',
	'date',
	'number',
	'string',
	'id',
];
/** 封存狀態 enum 值對照表 */
const archivedStatusMap = {
	[ArchivedStatus.ARCHIVED_ONLY]: 'ARCHIVED_ONLY',
	[ArchivedStatus.ALL]: 'ALL',
	[ArchivedStatus.NORMAL]: 'NORMAL',
} as const;
/** 簽核狀態 enum 值對照表 */
const approvalStatusMap = {
	[ApprovalStatus.APPROVED]: 'APPROVED',
	[ApprovalStatus.APPROVED_EXACT]: 'APPROVED_EXACT',
	[ApprovalStatus.DENIED]: 'DENIED',
	[ApprovalStatus.PENDING]: 'PENDING',
	[ApprovalStatus.ERROR]: 'ERROR',
} as const;
export const cStagingGraphQLClient = (() => {
	const apolloClient = new ApolloClient({
		cache: new InMemoryCache({ addTypename: false }),
		/** 處理 jwt token 的 link */
		link: new ApolloLink((operation, forward) => {
			return asyncMap(forward(operation), async (response) => {
				const context = operation.getContext();
				const {
					response: { headers },
				} = context;
				if (headers) {
					/** 透過 setCookieParser 把回傳的 response header 裡的 set-cookie 字串轉成 cookie 物件資料 */
					const cookieToSet = headers.get('set-cookie') || headers.get('Set-Cookie');
					if (cookieToSet) {
						const parsedCookies = setCookieParser.parse(cookieToSet);
						cSignRef.cookie = parsedCookies.map(({ name, value }) => `${name}=${value};`).join(' ');
					}
				}
				return response;
			});
		}).concat(
			setLinkContext((_, { headers = {} }) => {
				const { jwt, cookie } = cSignRef;
				const newHeaders: Record<string, string> = { ...headers };
				if (jwt) newHeaders.authorization = `Bearer ${jwt}`;
				if (cookie) newHeaders.cookie = cookie;
				return { mode: 'cors', headers: newHeaders };
			}).concat(
				createHttpLink({
					uri: 'https://data-api-staging.wonderpet.asia/graphql-omo',
					fetch,
					credentials: 'include',
				})
			)
		),
		ssrMode: true,
	});
	/** 封裝 query 與 mutate，當出現錯誤時組成自定義的錯誤訊息格式 */
	const _query = apolloClient.query;
	apolloClient.query = async (...args) => {
		try {
			return await _query(...args);
		} catch (error) {
			throw new Error(extractMessageFromServerError(error, { disablePrintErrorStack: true }));
		}
	};
	const _mutate = apolloClient.mutate;
	apolloClient.mutate = async (...args) => {
		try {
			return await _mutate(...args);
		} catch (error) {
			throw new Error(extractMessageFromServerError(error, { disablePrintErrorStack: true }));
		}
	};
	return apolloClient;
})();
/** 取得管理員的操作權限 jwt 並設定 */
export async function setupAdminJWT(): Promise<void> {
	if (cSignRef.jwt) return;
	const resp = await cStagingGraphQLClient.mutate<{ jwt: string }>({
		// prettier-ignore
		mutation: gql`mutation { jwt: signin(email: "Administrator", name: "Administrator", otp: "Administrator") }`,
		fetchPolicy: 'no-cache',
	});
	cSignRef.jwt = resp.data?.jwt!;
	console.log('已設定管理員 JWT:', cSignRef.jwt);
}
/** 使用正規化參數與篩選器取得 Record 資料，輸出會自動將資料轉成 SafeRecord2 形式 */
export async function gqlFindRecord(
	findArgs: NormFindArgs,
	options: {
		abortSignal?: AbortSignal;
		apolloClient?: ApolloClient<NormalizedCacheObject>;
	} = {}
): Promise<SafeRecord2[]> {
	const { abortSignal, apolloClient = cStagingGraphQLClient } = options;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const variablesTypeDefine = `
		$table: String!
		$skipLines: Boolean
		$archived: ArchivedStatus
		$approved: ApprovedStatus
		$offset: Int
		$limit: Int
		$sorting: FindSorting
		$filters: [FindFilter!]
		$expand: String
		$skipRefTables: [String]
		$selects: [String]
		$multiSort: [FindSortingMutiple!]
	`;
	const res = await apolloClient.query<GQLFindResult<NormRecord2>, GQLNormArgs<NormFindArgs>>({
		query: gql`
			query(${variablesTypeDefine}) {
				findResult: findV2(${variableStringGenerator(variablesTypeDefine)}) {
					bodyFields { ${cNormField.join(' ')} }
					lineRows {
						lineName
						lineFields { ${cNormField.join(' ')} }
					}
				}
			}
		`,
		variables: convertNormArgsToGQLType(findArgs),
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	const normRecords = res?.data?.findResult || [];
	return normRecords.map((normRecord) => mapNormRecord2AsMyRecord2(normRecord) as SafeRecord2);
}
/**
 * 將伺服器回傳的錯誤結構轉成一連串的字串
 * 主要包含 gql server 檢查出的 error & gql 操作的 error
 * 多個錯誤時會以 `\n` 字元做串接，可以使用 `.split('\n')` 來切割
 * 若有伺服器回傳的錯誤會優先擺到前頭，網路 http 狀態錯誤擺在最後
 * 可能會遭遇以下幾種情況的錯誤
 * 1. 普通程式的錯誤
 * 2. 網路請求的錯誤 http (請求不會到達 Server)
 * 3. 網路請求 4XX (請求到達 Server 但 GQL 解析發生錯誤)
 * 4. 網路請求 5XX 且回傳結果為純文字 (請求到達 Server 但 GQL Server 程式出錯)
 * 5. 網路請求 5XX 且有回傳處理結果 (請求到達 Server 但 GQL Handler 處理發生錯誤沒有 catch 到)
 */
export function extractMessageFromServerError(
	error: Error | unknown,
	options: {
		/** 不在主控台印出錯誤追蹤堆疊內容 */
		disablePrintErrorStack?: boolean;
	} = {}
): string {
	const { disablePrintErrorStack } = options;
	const messages: string[] = [];
	let httpStatus: number | null = null;
	// 把 client 端的錯誤堆疊印出
	if (error instanceof Error && error.stack && !disablePrintErrorStack) {
		console.error(error.stack);
	}
	if (error instanceof Error && isApolloError(error) && error.networkError) {
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
			const serverResult = networkError.result as GQLServerResult;
			// 處理 server 端帶過來的 error
			const serverErrors = serverResult?.errors || [];
			for (const serverError of serverErrors) {
				messages.push(serverError?.message);
			}
			// 處理寫入 gql 操作時發生的錯誤
			const graphQLErrors = error?.graphQLErrors || [];
			for (const graphQLError of graphQLErrors) {
				messages.push(printError(graphQLError as GraphQLError));
			}
		} else {
			messages.push(networkError.message);
		}
	} else if (error instanceof GraphQLError) {
		messages.push(printError(error));
	}
	let defaultMessage = (error instanceof Error ? error.message : `${error || ''}`).replace(
		/^(GraphQL error: )|(Error: )/,
		''
	);
	const invalidMutateNum = +(defaultMessage.match(/###\d+###/)?.[0]?.match(/\d+/)?.[0] || '0');
	if (invalidMutateNum > 0) {
		defaultMessage = defaultMessage.replace(new RegExp(`###${invalidMutateNum}###`), `第 ${invalidMutateNum} 筆`);
	}
	messages.push(defaultMessage);
	if (httpStatus && httpStatus >= 400) messages.unshift(`http status: ${httpStatus}`);
	const outputError = uniq(messages).join('\n');
	if (/Error: Write Conflict/.test(outputError)) return '伺服器忙碌，請重新操作';
	return outputError;
}
/**
 * 取出 query variables 中 `$` 與 `:` 之間的值\
 * 再將它組合成傳入 api 的 parameter
 * @example
 * input = `$ID: [LongID] $name: String`
 * output = `ID: $ID name: $name`
 */
export function variableStringGenerator(gqlVarString: string): string {
	/**
	 * 不要使用 `?<=`，無法運作於不支援 lookbehind 語法的瀏覽器
	 * https://caniuse.com/#feat=js-regexp-lookbehind
	 */
	return (
		gqlVarString
			.match(/\$(.*?)\:/g)
			?.map((matchedPattern) => {
				const field = matchedPattern.replace(/^\$/, '').replace(/:$/, '');
				return `${field}: $${field}`;
			})
			.join(' ') || ''
	);
}
/** 依據資料型態或 Enum 前後端差異等做搜尋變數的轉換 */
export function convertNormArgsToGQLType<Args extends Partial<NormFindArgs> = NormFindArgs>(
	variables: Args
): GQLNormArgs<Args> {
	const { archived, approved, sorting, selects } = variables;
	return {
		...variables,
		selects: selects ? uniq(selects) : void 0,
		// 由於有些表格已經移除 body._id，_id 的 sort 不能再使用 body._id
		sorting: sorting?.field === 'body._id' ? { ...sorting, field: '_id' } : sorting,
		// Enum 前後端使用不同
		archived: archived ? archivedStatusMap[archived] ?? 'NORMAL' : 'NORMAL',
		approved: approved ? approvalStatusMap[approved] ?? null : null,
	};
}
/** 轉換正規化紀錄成一般紀錄 */
export function mapNormRecord2AsMyRecord2(normRecord: NormRecord2): SafeRecord2 {
	return {
		...(normRecord._id ? { _id: normRecord._id } : null),
		body: reduceNormFields(normRecord.bodyFields),
		lines: (normRecord.lineRows || []).reduce<any>((prev, curr) => {
			return {
				...prev,
				[curr.lineName]: [...(prev[curr.lineName] || []), reduceNormFields(curr.lineFields)],
			};
		}, {}),
	};
}
/** 轉換正規欄位清單成鍵值對 */
export function reduceNormFields(fields: NormField[]): Record<string, FIELD_VALUE_TYPE> {
	return fields.reduce((prev, curr) => {
		return {
			...prev,
			[curr.fieldName]:
				curr.valueType === NormFieldValueType.BOOLEAN
					? curr.boolean
					: curr.valueType === NormFieldValueType.NUMBER
					? curr.number
					: curr.valueType === NormFieldValueType.STRING
					? curr.string
					: curr.valueType === NormFieldValueType.DATE
					? curr.date
					: curr.valueType === NormFieldValueType.ID
					? curr.id
					: null,
		};
	}, {});
}
