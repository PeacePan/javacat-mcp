import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { FieldPermission, PermissionArgs } from '@norwegianForestTypes';
import { variableStringGenerator } from '../libs/utils';

const cVariablesTypeDefine = ['$table: String!', '$action: PermissionAction!'].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/**
 * 查詢指定表格的欄位權限設定
 * 根據使用者角色和指定的操作類型，取得對特定表格的欄位存取權限
 *
 * @param {PermissionArgs} args - 權限查詢參數
 * @param {string} args.table - 表格名稱
 * @param {PermissionAction} args.action - 權限操作類型（如：read, write, delete 等）
 *
 * @returns {Promise<FieldPermission>} 欄位權限資訊物件
 * @returns {Promise<FieldPermission>} permission.effect - 整體權限效果（allow/deny）
 * @returns {Promise<FieldPermission>} permission.bodyFields - 主體欄位權限列表
 * @returns {Promise<FieldPermission>} permission.lineFields - 明細欄位權限列表
 *
 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
 */
export default async function (client: ApolloClient<NormalizedCacheObject>, args: PermissionArgs): Promise<FieldPermission> {
	const result = await client.query<{ permission: FieldPermission }, PermissionArgs>({
		query: gql`query(${cVariablesTypeDefine}) {
					permission(${cVariableString}) {
						effect
						bodyFields { name effect }
						lineFields { line name effect }
					}
				}`,
		variables: args,
		fetchPolicy: 'no-cache',
	});
	return result.data.permission;
}
