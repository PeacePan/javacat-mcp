import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { NormUpdateArgs } from '@norwegianForestTypes';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$table: String!', '$data: [UpdateRecord!]!', '$ignorePolicy: Boolean'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 更新資料處理函式
 * @param client - ApolloClient 實例
 * @param updateArgs - 更新操作參數
 * @param options - 可選的額外選項，例如中止信號
 * @returns 更新結果的 ID 陣列
 */
export default async function (
	client: ApolloClient<NormalizedCacheObject>,
	updateArgs: NormUpdateArgs,
	options: { abortSignal?: AbortSignal } = {}
): Promise<string[]> {
	const { abortSignal } = options;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const res = await client.mutate<{ updatedIds: string[] }, NormUpdateArgs>({
		mutation: gql`mutation(${cVariablesTypeDefine}) { updatedIds: updateV2(${cVariableString}) }`,
		variables: updateArgs,
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	return res?.data?.updatedIds ?? [];
}
