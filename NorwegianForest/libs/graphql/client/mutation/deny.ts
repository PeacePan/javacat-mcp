import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { ApproveArgs2 } from '@norwegianForestTypes';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$data: [ApprovalOperation2!]!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 對指定 table 進行簽核資料駁回
 * @param client - ApolloClient 實例
 * @param denyArgs 簽核駁回資料的輸入參數
 */
export default async function (client: ApolloClient<NormalizedCacheObject>, denyArgs: ApproveArgs2): Promise<string[]> {
	const result = await client.mutate<{ deniedIds: string[] }, ApproveArgs2>({
		mutation: gql`mutation (${cVariablesTypeDefine}) { deniedIds: deny2V2V2(${cVariableString}) }`,
		variables: denyArgs,
		fetchPolicy: 'no-cache',
	});
	return result?.data?.deniedIds || [];
}
