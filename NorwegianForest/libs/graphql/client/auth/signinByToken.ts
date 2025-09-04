import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { SigninByTokenArgs } from '@norwegianForestTypes/graphql';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$accessKeyId: String!', '$secretAccessKey: String!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/** 使用存取金鑰登入並取得 JWT 令牌  */
export default async function (client: ApolloClient<NormalizedCacheObject>, args: SigninByTokenArgs): Promise<string | null> {
	const result = await client.mutate<{ signinByToken: string }, typeof args>({
		mutation: gql`mutation signinByToken(${cVariablesTypeDefine}) { signinByToken(${cVariableString}) }`,
		variables: args,
		fetchPolicy: 'no-cache',
	});
	const jwt = result.data?.signinByToken || null;
	return jwt;
}
