import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { DeviceSigninArgs } from '@norwegianForestTypes/graphql';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$deviceName: String!', '$deviceId: String!', '$userName: String!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 裝置登入請求 OTP
 * @param client - ApolloClient 實例
 * @param args 裝置登入參數
 */
export default async function (
	client: ApolloClient<NormalizedCacheObject>,
	args: Pick<DeviceSigninArgs, 'deviceName' | 'deviceId' | 'userName'>
): Promise<boolean> {
	const result = await client.mutate<{ tokenNewReq: boolean }, typeof args>({
		mutation: gql`mutation(${cVariablesTypeDefine}) { tokenNewReq(${cVariableString}) }`,
		variables: args,
		fetchPolicy: 'no-cache',
	});
	return result.data?.tokenNewReq || false;
}
