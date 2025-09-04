import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { DeviceSigninArgs, DeviceToken } from '@norwegianForestTypes/graphql';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$deviceName: String!', '$deviceId: String!', '$userName: String!', '$otp: String!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 裝置登入產生 token
 * @param client - ApolloClient 實例
 * @param args 裝置登入參數
 */
export default async function (client: ApolloClient<NormalizedCacheObject>, args: DeviceSigninArgs): Promise<DeviceToken | null> {
	const result = await client.mutate<{ tokenNew: DeviceToken }, typeof args>({
		mutation: gql`mutation(${cVariablesTypeDefine}) {
            tokenNew(${cVariableString}) { accessToken refreshToken }
        }`,
		variables: args,
		fetchPolicy: 'no-cache',
	});
	const token = result.data?.tokenNew || null;
	return token;
}
