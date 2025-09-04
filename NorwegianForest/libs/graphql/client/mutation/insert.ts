import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { NormInsertArgs } from '@norwegianForestTypes';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = [
	'$table: String!',
	'$data: [InsertRecord!]!',
	'$approvalSubject: String',
	'$approvalDescription: String',
	'$files: [String!]',
].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 新增資料處理函式
 * @param client - ApolloClient 實例
 * @param insertArgs - 新增操作參數
 * @param options - 可選的額外選項，例如中止信號
 * @returns 新增結果的 ID 陣列
 */
export default async function (
	client: ApolloClient<NormalizedCacheObject>,
	insertArgs: NormInsertArgs,
	options: { abortSignal?: AbortSignal } = {}
): Promise<string[]> {
	const { abortSignal } = options;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const res = await client.mutate<{ insertedIds: string[] }, NormInsertArgs>({
		mutation: gql`mutation(${cVariablesTypeDefine}){ insertedIds: insertV2(${cVariableString}) }`,
		variables: insertArgs,
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	return res?.data?.insertedIds ?? [];
}
