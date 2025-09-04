import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { CallArgs } from '@norwegianForestTypes/graphql';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$table: String!', '$name: String!', '$argument: String!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/** 執行特定表格的特定 functions，可輸入任意 JSON 參數的函數 */
export default async function call<Response extends unknown = unknown>(
	client: ApolloClient<NormalizedCacheObject>,
	args: CallArgs & { abortSignal?: AbortSignal }
): Promise<Response | null> {
	const { abortSignal, ...variables } = args;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const result = await client.mutate<{ call: string | null }, CallArgs>({
		mutation: gql`mutation call(${cVariablesTypeDefine}) { call(${cVariableString}) }`,
		variables,
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	try {
		return JSON.parse(result.data?.call || 'null');
	} catch {
		return null;
	}
}
