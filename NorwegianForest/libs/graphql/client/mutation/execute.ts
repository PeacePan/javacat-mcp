import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { ExecuteArgs } from '@norwegianForestTypes/graphql';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = [
	'$table: String!',
	'$key: ExecuteKey!',
	'$name: String!',
	'$argument: ExecuteArgument',
	'$ignoreApproval: Boolean',
	'$ignoreArchive: Boolean',
	'$param: String',
].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/** 執行特定表格的特定 functions */
export default async function execute<Response extends unknown = unknown>(
	client: ApolloClient<NormalizedCacheObject>,
	args: ExecuteArgs & { abortSignal?: AbortSignal }
): Promise<Response | null> {
	const { abortSignal, ...variables } = args;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const result = await client.mutate<{ execute: string | null }, ExecuteArgs>({
		mutation: gql`mutation execute(${cVariablesTypeDefine}) { execute(${cVariableString}) }`,
		variables,
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	try {
		return JSON.parse(result.data?.execute || 'null');
	} catch {
		return null;
	}
}
