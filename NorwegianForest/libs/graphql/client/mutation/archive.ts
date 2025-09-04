import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { NormArchiveArgs } from '@norwegianForestTypes';
import { GraphQLNormArgs } from '../../client/@types';
import { convertNormArgsToGraphQLType, variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$table: String!', '$data: [RecordLocator!]!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 封存資料處理函式
 * @param client - ApolloClient 實例
 * @param archiveArgs - 封存操作參數
 * @param options - 可選的額外選項，例如中止信號
 * @returns 封存結果的 ID 陣列
 */
export default async function (
	client: ApolloClient<NormalizedCacheObject>,
	archiveArgs: NormArchiveArgs,
	options: { abortSignal?: AbortSignal } = {}
): Promise<string[]> {
	const { abortSignal } = options;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const res = await client.mutate<{ archivedIds: string[] }, GraphQLNormArgs<NormArchiveArgs>>({
		mutation: gql`mutation(${cVariablesTypeDefine}) { archivedIds: archiveV2(${cVariableString}) }`,
		variables: convertNormArgsToGraphQLType(archiveArgs),
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	return res?.data?.archivedIds ?? [];
}
