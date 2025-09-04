import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { mapNormRecord2AsMyRecord2 } from '@norwegianForestLibs/util';
import { NormFindArgs, NormRecord2, SafeRecord2 } from '@norwegianForestTypes';
import { cNormField } from '../libs/consts';
import { convertNormArgsToGraphQLType, variableStringGenerator } from '../libs/utils';
import { GraphQLFindOptions, GraphQLFindResult, GraphQLNormArgs } from '../type';

/**
 * 分批取得資料表的所有資料再將資料組合起來回傳 \
 * 用途是在下載搜尋清單時，取得全部的資料給使用者下載
 */
export default async function <SpecificRecord extends SafeRecord2 = SafeRecord2>(
	client: ApolloClient<NormalizedCacheObject>,
	findArgs: NormFindArgs,
	options: GraphQLFindOptions = {}
): Promise<SpecificRecord[]> {
	const { abortSignal, limitPerQuery = 50 } = options;
	if ('useBatch' in options && options.useBatch) {
		const { totalCount, concurrency = 4, onProgress } = options;
		const { sorting, ...commonArgs } = findArgs;
		onProgress?.(0);
		/** 取得資料總筆數，若有給定資料數量則使用，反之會自動根據 tableName 取得資料總筆數 */
		const count = totalCount ?? (await this.count(commonArgs));
		if (!count) {
			onProgress?.(1);
			return [];
		}
		/** 根據單一請求的最大回傳筆數計算總共需要請求幾次才能抓完 */
		const totalChunks = Math.ceil(count / limitPerQuery);
		/** 根據資料數量計算出總共會發出的請求數量 */
		const totalRequests = concurrency * Math.floor(totalChunks / concurrency) + (totalChunks % concurrency);
		/** 每一個併發請求回應後佔整體進度的數值 */
		const progressPerRequest = 1 / totalRequests;
		let progress = 0;
		return execBatchRecords<SpecificRecord>(totalChunks, concurrency, async (chunkOffset) => {
			const currentOffset = chunkOffset * limitPerQuery;
			const remainingRecords = count - currentOffset;
			const currentLimit = Math.min(limitPerQuery, remainingRecords);
			const chunkRecords = await find<SpecificRecord>(
				client,
				{ ...commonArgs, sorting, limit: currentLimit, offset: currentOffset },
				{ abortSignal }
			);
			progress += progressPerRequest;
			onProgress?.(Math.min(progress, 1));
			return chunkRecords;
		});
	} else {
		const untilEnd = 'untilEnd' in options && options.untilEnd;
		const limit = findArgs.limit;
		let offset = findArgs.offset ?? 0;
		let shouldContinue = false;
		const records: SpecificRecord[] = [];
		do {
			const realLimit = limit !== void 0 ? Math.min(limitPerQuery, limit - offset) : limitPerQuery;
			const chunkRecords = await find<SpecificRecord>(client, { ...findArgs, offset, limit: realLimit }, { abortSignal });
			if (!chunkRecords.length) break;
			records.push(...chunkRecords);
			offset += limitPerQuery;
			shouldContinue = !!untilEnd && chunkRecords.length >= limitPerQuery && (limit === void 0 || offset < limit);
		} while (shouldContinue);
		return records;
	}
}
const cVariablesTypeDefine = [
	'$table: String!',
	'$skipLines: Boolean',
	'$archived: ArchivedStatus',
	'$approved: ApprovedStatus',
	'$offset: Int',
	'$limit: Int',
	'$sorting: FindSorting',
	'$filters: [FindFilter!]',
	'$expand: String',
	'$skipRefTables: [String]',
	'$selects: [String]',
	'$multiSort: [FindSortingMutiple!]',
].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/** 使用正規化參數與篩選器取得 Record 資料，輸出會自動將資料轉成 SafeRecord2 形式 */
async function find<SpecificRecord extends SafeRecord2 = SafeRecord2>(
	client: ApolloClient<NormalizedCacheObject>,
	findArgs: NormFindArgs,
	options: { abortSignal?: AbortSignal } = {}
): Promise<SpecificRecord[]> {
	const { abortSignal } = options;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const res = await client.query<GraphQLFindResult<NormRecord2>, GraphQLNormArgs<NormFindArgs>>({
		query: gql`
            query(${cVariablesTypeDefine}) {
                findResult: findV2(${cVariableString}) {
                    bodyFields { ${cNormField.join(' ')} }
                    lineRows { lineName lineFields { ${cNormField.join(' ')} } }
                }
            }`,
		variables: convertNormArgsToGraphQLType(findArgs),
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	const normRecords = res?.data?.findResult || [];
	return normRecords.map((normRecord) => mapNormRecord2AsMyRecord2(normRecord) as SpecificRecord);
}
/**
 * 併發多個非同步的請求數處理資料抓取 \
 * 一次併發的所有請求都回傳後，將資料重新組裝成一維陣列回傳
 * @param totalChunks 根據 GQL 能夠最大回傳筆數計算總共需要請求幾次才能抓完
 * @param concurrency 一次併發的請求數
 * @param recordsFetcher 資料抓取的非同步函式，回傳的是 Promise
 */
async function execBatchRecords<Record>(
	totalChunks: number,
	concurrency: number,
	recordsFetcher: (chunkOffset: number) => Promise<Record[]>
): Promise<Record[]> {
	const totalRecords: Record[] = [];
	let fetchedChunks = 0;
	do {
		/** 一次性發出 runStep 次的請求 */
		const runStep = Math.max(0, Math.min(concurrency, totalChunks - fetchedChunks));
		const batches = await Promise.all(
			Array(runStep)
				.fill(null)
				.map((_, i) => recordsFetcher(fetchedChunks + i))
		);
		fetchedChunks += runStep;
		/** 將取回的資料重新組裝 */
		const batchRecords = batches.reduce((output, records) => {
			output.push(...records);
			return output;
		}, []);
		totalRecords.push(...batchRecords);
	} while (fetchedChunks < totalChunks);
	return totalRecords;
}
