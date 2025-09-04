import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { ApproveArgs2 } from '@norwegianForestTypes';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$data: [ApprovalOperation2!]!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 對指定 table 進行簽核資料核准
 * @param client - ApolloClient 實例
 * @param approveArgs 簽核核准資料的輸入參數
 */
export default async function (client: ApolloClient<NormalizedCacheObject>, approveArgs: ApproveArgs2): Promise<string[]> {
	const result = await client.mutate<{ approvedIds: string[] }, ApproveArgs2>({
		mutation: gql`mutation (${cVariablesTypeDefine}) { approvedIds: approve2V2V2(${cVariableString}) }`,
		variables: approveArgs,
		fetchPolicy: 'no-cache',
	});
	return result?.data?.approvedIds || [];
}
