import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { SigninArgs } from '@norwegianForestTypes/graphql';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$name: String!', '$email: String', '$mobile: String', '$otp: String!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 使用驗證碼登入並取得 JWT 令牌
 * 登入成功後會自動儲存 JWT 令牌到對應的儲存位置（客戶端的 localStorage 或伺服器端的檔案）
 */
export default async function (client: ApolloClient<NormalizedCacheObject>, args: SigninArgs): Promise<string | null> {
	const { mobile } = args;
	const result = await client.mutate<{ signin: string }, typeof args>({
		mutation: gql`mutation(${cVariablesTypeDefine}) { signin(${cVariableString}) }`,
		variables: { ...args, mobile: typeof mobile === 'string' ? mobile.replace(/^09/, '+886') : void 0 },
		fetchPolicy: 'no-cache',
	});
	const jwt = result.data?.signin || null;
	return jwt;
}
