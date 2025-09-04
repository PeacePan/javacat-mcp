import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { NormArchiveArgs } from '@norwegianForestTypes';
import { convertNormArgsToGraphQLType, variableStringGenerator } from '../libs/utils';
import { GraphQLNormArgs } from '../type';

const cVariablesTypeDefine = ['$table: String!', '$data: [RecordLocator!]!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 解封存資料處理函式
 * @param client - ApolloClient 實例
 * @param unarchiveArgs - 解封存操作參數
 * @param options - 可選的額外選項，例如中止信號
 * @returns 解封存結果的 ID 陣列
 */
export default async function (
	client: ApolloClient<NormalizedCacheObject>,
	unarchiveArgs: NormArchiveArgs,
	options: { abortSignal?: AbortSignal } = {}
): Promise<string[]> {
	const { abortSignal } = options;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const res = await client.mutate<{ unarchivedIds: string[] }, GraphQLNormArgs<NormArchiveArgs>>({
		mutation: gql`mutation(${cVariablesTypeDefine}) { unarchivedIds: unarchiveV2(${cVariableString}) }`,
		variables: convertNormArgsToGraphQLType(unarchiveArgs),
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	return res?.data?.unarchivedIds ?? [];
}
