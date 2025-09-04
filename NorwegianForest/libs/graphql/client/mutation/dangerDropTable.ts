import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { DangerDropTableArgs } from '@norwegianForestTypes/graphql';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$table: String!', 'forceDrop: Boolean', 'keepAutoKey: Boolean', 'purgeAll: Boolean'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 刪除表格
 * @param client - ApolloClient 實例
 * @param args 刪除表格輸入參數
 */
export default async function (client: ApolloClient<NormalizedCacheObject>, args: DangerDropTableArgs): Promise<boolean> {
	const result = await client.mutate<{ dangerDropTable: boolean }, DangerDropTableArgs>({
		mutation: gql`mutation (${cVariablesTypeDefine}) { dangerDropTable(${cVariableString}) }`,
		variables: args,
		fetchPolicy: 'no-cache',
	});
	return result?.data?.dangerDropTable || false;
}
