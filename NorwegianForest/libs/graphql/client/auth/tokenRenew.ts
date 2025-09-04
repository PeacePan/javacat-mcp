import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { DeviceSigninArgs, DeviceToken } from '@norwegianForestTypes/graphql';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$deviceName: String!', '$deviceId: String!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 裝置令牌刷新 token
 * @param client - ApolloClient 實例
 * @param args 裝置令牌刷新參數
 */
export default async function (
	client: ApolloClient<NormalizedCacheObject>,
	args: Pick<DeviceSigninArgs, 'deviceName' | 'deviceId'>
): Promise<DeviceToken | null> {
	const result = await client.mutate<{ tokenReNew: DeviceToken }, typeof args>({
		mutation: gql`mutation(${cVariablesTypeDefine}) {
            tokenReNew(${cVariableString}) { accessToken refreshToken }
        }`,
		variables: args,
		fetchPolicy: 'no-cache',
	});
	const token = result.data?.tokenReNew || null;
	return token;
}
