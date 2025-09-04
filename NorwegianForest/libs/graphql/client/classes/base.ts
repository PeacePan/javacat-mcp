import { gql } from '@apollo/client';
import { Authentication, FieldPermission, PermissionArgs } from '../../../@types';
import { cGraphQLEndPoints } from '../libs/consts';
import { variableStringGenerator } from '../libs/utils';
import { JavaCatGraphQLClientBaseOptions } from '../type';
import { JavaCatGraphQLClientAuth } from './auth';

/**
 * JavaCat GraphQL Client 的基底類別
 * 提供身份驗證、權限查詢等功能，繼承自驗證處理類別
 */
export class JavaCatGraphQLClientBase extends JavaCatGraphQLClientAuth {
	/**
	 * 建構子
	 * @param options JavaCatGraphQLClientBaseOptions 配置選項
	 */
	constructor(options: JavaCatGraphQLClientBaseOptions) {
		const { env = 'dev', authEnvPath, jwtStorageKey } = options;
		const graphQLUri = cGraphQLEndPoints[env.toUpperCase()] || cGraphQLEndPoints.DEV;
		super(graphQLUri, { authEnvPath, jwtStorageKey });
	}

	//#region 權限相關操作

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
	/**
	 * 驗證當前 JWT 令牌是否合法且未過期，並取得使用者身份資訊
	 * @returns 身份驗證資訊物件
	 * @throws {Error} JWT 過期或無效、GraphQL 請求失敗時拋出
	 */
	public async authenticate(): Promise<Authentication> {
		const result = await this._client.query<{ authenticate: Authentication }>({
			// prettier-ignore
			query: gql`query {
				authenticate {
					roles tables hideLeftNavGroup
					user { name displayName level }
					constraints { role name table line field operator value }
					permissions { role name table action field effect }
					constraints2 {
						name tableName bodyField lineName lineField operator value groupKey includeExecute memo
					}
					permissions2 {
						name tableName actions applyToAll bodyFields lineName lineFields functionNames effect memo
					}
					token { name accessKeyId memo }
				}
			}`,
			fetchPolicy: 'no-cache',
		});
		return result.data.authenticate;
	}

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
	 *
	 * @example
	 * // 查詢 users 表格的讀取權限
	 * const permission = await client.permissions({
	 *   table: 'users',
	 *   action: 'read'
	 * });
	 *
	 * console.log('整體效果:', permission.effect);
	 * console.log('主體欄位權限:', permission.bodyFields);
	 */
	/**
	 * 查詢指定表格的欄位權限設定
	 * 根據使用者角色和指定操作類型，取得特定表格的欄位存取權限
	 * @param args 權限查詢參數
	 * @returns 欄位權限資訊物件
	 * @throws {Error} GraphQL 請求失敗時拋出
	 */
	public async permissions(args: PermissionArgs): Promise<FieldPermission> {
		const variablesTypeDefine = ['$table: String!', '$action: PermissionAction!'].join(' ');
		const result = await this._client.query<{ permission: FieldPermission }, PermissionArgs>({
			query: gql`query(${variablesTypeDefine}) {
					permission(${variableStringGenerator(variablesTypeDefine)}) {
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

	//#endregion
}
