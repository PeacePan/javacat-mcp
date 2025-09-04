import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { Authentication } from '@norwegianForestTypes';

/**
 * 驗證當前 JWT 令牌是否合法且未過期
 * 同時取得使用者的身份驗證資訊，包括角色、權限、約束條件等
 *
 * @returns {Promise<Authentication>} 身份驗證資訊物件
 * @returns {Promise<Authentication>} authentication.roles - 使用者角色列表
 * @returns {Promise<Authentication>} authentication.tables - 可存取的表格列表
 * @returns {Promise<Authentication>} authentication.hideLeftNavGroup - 是否隱藏左側導航群組
 * @returns {Promise<Authentication>} authentication.user - 使用者基本資訊
 * @returns {Promise<Authentication>} authentication.constraints - 舊版約束條件
 * @returns {Promise<Authentication>} authentication.permissions - 舊版權限設定
 * @returns {Promise<Authentication>} authentication.constraints2 - 新版約束條件
 * @returns {Promise<Authentication>} authentication.permissions2 - 新版權限設定
 * @returns {Promise<Authentication>} authentication.token - API 存取令牌資訊
 *
 * @throws {Error} 當 JWT 過期或無效時拋出錯誤
 * @throws {Error} 當 GraphQL 請求失敗時拋出錯誤
 *
 * @example
 * try {
 *   const authInfo = await client.authenticate();
 *   console.log('使用者角色:', authInfo.roles);
 *   console.log('使用者資訊:', authInfo.user);
 * } catch (error) {
 *   console.error('身份驗證失敗:', error.message);
 * }
 */
export default async function (client: ApolloClient<NormalizedCacheObject>): Promise<Authentication> {
	const result = await client.query<{ authenticate: Authentication }>({
		query: gql`
			query {
				authenticate {
					roles
					tables
					hideLeftNavGroup
					user {
						name
						displayName
						level
					}
					constraints {
						role
						name
						table
						line
						field
						operator
						value
					}
					permissions {
						role
						name
						table
						action
						field
						effect
					}
					constraints2 {
						name
						tableName
						bodyField
						lineName
						lineField
						operator
						value
						groupKey
						includeExecute
						memo
					}
					permissions2 {
						name
						tableName
						actions
						applyToAll
						bodyFields
						lineName
						lineFields
						functionNames
						effect
						memo
					}
					token {
						name
						accessKeyId
						memo
					}
				}
			}
		`,
		fetchPolicy: 'no-cache',
	});
	return result.data.authenticate;
}
