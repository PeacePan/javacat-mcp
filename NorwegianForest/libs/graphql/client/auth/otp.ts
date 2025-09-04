import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { OneTimePasswordArgs } from '@norwegianForestTypes/graphql';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$name: String!', '$email: String', '$mobile: String', '$dangerOTP: String'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 產生驗證碼並發送到指定的電子郵件或手機號碼
 * 支援一般 OTP 和危險操作 OTP 兩種模式
 */
export default async function (client: ApolloClient<NormalizedCacheObject>, args: OneTimePasswordArgs): Promise<boolean> {
	const { mobile } = args;
	const result = await client.mutate<{ otp: boolean }, typeof args>({
		mutation: gql`mutation(${cVariablesTypeDefine}) { otp(${cVariableString}) }`,
		variables: { ...args, mobile: typeof mobile === 'string' ? mobile.replace(/^09/, '+886') : void 0 },
		fetchPolicy: 'no-cache',
	});
	return !!result.data?.otp;
}
