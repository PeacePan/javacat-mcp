import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { NormPatchArgs } from '@norwegianForestTypes';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$table: String!', '$data: [PatchRecord!]!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 修補資料處理函式
 * @param client - ApolloClient 實例
 * @param patchArgs - 修補操作參數
 * @param options - 可選的額外選項，例如中止信號
 * @returns 修補結果的 ID 陣列
 */
export default async function (
	client: ApolloClient<NormalizedCacheObject>,
	patchArgs: NormPatchArgs,
	options: { abortSignal?: AbortSignal } = {}
): Promise<string[]> {
	const { abortSignal } = options;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const res = await client.mutate<{ patchedIds: string[] }, NormPatchArgs>({
		mutation: gql`mutation(${cVariablesTypeDefine}) { patchedIds: patchV2(${cVariableString}) }`,
		variables: patchArgs,
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	return res?.data?.patchedIds ?? [];
}
