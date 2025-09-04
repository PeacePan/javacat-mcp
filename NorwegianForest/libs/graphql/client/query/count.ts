import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { NormCountArgs } from '@norwegianForestTypes';
import { GraphQLNormArgs } from '../../client/@types';
import { convertNormArgsToGraphQLType, variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = [
	'$table: String!',
	'$filters: [FindFilter!]',
	'$archived: ArchivedStatus',
	'$approved: ApprovedStatus',
	'$expand: String',
].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/** 取得資料總筆數 */
export default async function (
	client: ApolloClient<NormalizedCacheObject>,
	countArgs: NormCountArgs,
	options: { abortSignal?: AbortSignal } = {}
): Promise<number> {
	const { abortSignal } = options;
	const fetchOptions: Partial<RequestInit> = { signal: abortSignal };
	const res = await client.query<{ count: number }, GraphQLNormArgs<NormCountArgs>>({
		query: gql`query(${cVariablesTypeDefine}) { count(${cVariableString}) }`,
		variables: convertNormArgsToGraphQLType(countArgs),
		fetchPolicy: 'no-cache',
		context: { fetchOptions },
	});
	return res?.data?.count ?? 0;
}
