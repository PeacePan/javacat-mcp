import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$name: String!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;
/**
 * 切換使用者 (DEV, STAGING only)
 * 會重新取得新的 JWT 令牌並儲存
 */
export default async function (client: ApolloClient<NormalizedCacheObject>, userName: string): Promise<string | null> {
	const result = await client.query<{ jwt: string }>({
		query: gql`mutation(${cVariablesTypeDefine}) { jwt: changeUser(${cVariableString}) }`,
		variables: { name: userName },
		fetchPolicy: 'no-cache',
	});
	const jwt = result.data?.jwt || null;
	return jwt;
}
