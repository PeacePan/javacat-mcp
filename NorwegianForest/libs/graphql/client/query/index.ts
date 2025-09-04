import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { NormCountArgs, PermissionArgs, RecordLocator, SafeRecord2 } from '@norwegianForestTypes';
import { TableName } from '@norwegianForestTypes/table';
import {
	ExtractSchemaDefineContentRecordType,
	GraphQLFindOptions,
	GraphQLSorting,
	JavaCatGraphQLClientQueryOptions,
	QuerySchemaDefine,
	SchemaDefineContent,
} from '../@types';
import { RecordsSchemaDefine } from '../@types/schema';

export class JavaCatGraphQLClientQueryHandler<
	RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>> = RecordsSchemaDefine,
> {
	/** 查詢欄位定義 */
	private _querySchema?: QuerySchemaDefine<RSD>;

	/**
	 * 建構函式
	 * @param _client ApolloClient 實例
	 * @param _options 查詢選項
	 */
	constructor(
		private _client: ApolloClient<NormalizedCacheObject>,
		_options?: JavaCatGraphQLClientQueryOptions<RSD>
	) {
		this._querySchema = _options?.querySchema;
	}
	/**
	 * 準備查詢欄位選擇器
	 * 如果查詢參數中沒有指定 selects 且有設定 querySchema，則自動產生欄位選擇器
	 * 包含主體欄位和明細欄位的完整選擇器
	 *
	 * @template Table - 表格名稱類型
	 * @template SpecificRecord - SafeRecord2 類型資料
	 * @param table 表格名稱
	 * @param findArgs 查詢參數
	 * @returns 欄位選擇器陣列，如果已有指定則返回原有的 selects
	 *
	 * @private
	 */
	private _prepareFieldSelects<
		Table extends Extract<keyof RSD, string>,
		SpecificRecord extends SafeRecord2 = ExtractSchemaDefineContentRecordType<RSD[Table]>,
	>(
		table: Table,
		findArgs: SchemaDefineContent<SpecificRecord>['query']['findParams']
	): Array<GraphQLSorting<SpecificRecord>['field']> | undefined {
		const selects: Array<GraphQLSorting<SpecificRecord>['field']> = [];
		const querySchema = this._querySchema?.[table];
		if (!findArgs.selects?.length && querySchema) {
			const { bodyFields, lineFields } = querySchema;
			if (bodyFields?.length) {
				selects.push(...bodyFields.map((fieldName) => `body.${fieldName.toString()}` as GraphQLSorting<SpecificRecord>['field']));
			}
			const lineNames = Object.keys(lineFields || {});
			if (lineFields && lineNames.length) {
				for (const lineName of lineNames) {
					selects.push(
						...(lineFields[lineName] || []).map(
							(fieldName) => `lines.${lineName}.${fieldName.toString()}` as GraphQLSorting<SpecificRecord>['field']
						)
					);
				}
			}
		}
		return selects.length ? selects : (findArgs.selects as Array<GraphQLSorting<SpecificRecord>['field']>);
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
	 * const permission = await permissions({
	 *   table: '__user__',
	 *   action: 'FIND'
	 * });
	 */
	public async permissions(args: PermissionArgs): ReturnType<typeof permissionsHandler> {
		const permissionsHandler = await import('./permissions').then((m) => m.default);
		return permissionsHandler(this._client, args);
	}
	/**
	 * 取得單一記錄
	 * 根據指定的記錄定位器（id 或 keys）取得單一記錄資料
	 * 自動處理欄位選擇器，如果未指定則使用 querySchema 中的定義
	 *
	 * @template Table - 表格名稱類型
	 * @template SpecificRecord - SafeRecord2 類型
	 * @param getArgs 取得記錄的參數，包含表格名稱、記錄定位器和查詢參數
	 * @returns Promise 解析為單一記錄物件，如果找不到則返回 null
	 *
	 * @example
	 * // 使用 id 取得記錄
	 * const user = await client.get({
	 *   table: 'users',
	 *   id: 'user123'
	 * });
	 *
	 * @example
	 * // 使用 keys 取得記錄
	 * const order = await client.get({
	 *   table: 'orders',
	 *   keys: [{ field: 'orderNumber', value: 'ORD001' }]
	 * });
	 */
	public async get<
		Table extends Extract<keyof RSD, string>,
		SpecificRecord extends SafeRecord2 = ExtractSchemaDefineContentRecordType<RSD[Table]>,
	>(
		getArgs: { table: Table } & RecordLocator & SchemaDefineContent<SpecificRecord>['query']['findParams']
	): Promise<ExtractSchemaDefineContentRecordType<RSD[Table]> | null> {
		const { table } = getArgs;
		getArgs.selects = this._prepareFieldSelects(table, getArgs);
		const getHandler = await import('./get').then((m) => m.default);
		return getHandler<ExtractSchemaDefineContentRecordType<RSD[Table]>>(this._client, { ...getArgs, table });
	}

	/**
	 * 查詢多筆記錄
	 * 根據指定的查詢條件取得多筆記錄資料
	 * 支援篩選、排序、分頁等功能，自動處理欄位選擇器
	 *
	 * @template Table - 表格名稱類型
	 * @template SpecificRecord - SafeRecord2 類型
	 * @param findArgs 查詢參數，包含表格名稱、篩選條件、排序、分頁等
	 * @param options 查詢選項，如中止信號等
	 * @returns Promise 解析為記錄陣列
	 *
	 * @example
	 * // 基本查詢
	 * const users = await client.find({
	 *   table: 'users',
	 *   filters: [{ field: 'status', operator: 'eq', value: 'active' }]
	 * });
	 *
	 * @example
	 * // 帶排序和分頁的查詢
	 * const orders = await client.find({
	 *   table: 'orders',
	 *   filters: [{ field: 'createdDate', operator: 'gte', value: '2023-01-01' }],
	 *   sorting: [{ field: 'createdDate', order: 'desc' }],
	 *   paging: { limit: 10, offset: 0 }
	 * });
	 */
	public async find<
		Table extends Extract<keyof RSD, string>,
		SpecificRecord extends SafeRecord2 = ExtractSchemaDefineContentRecordType<RSD[Table]>,
	>(
		findArgs: { table: Table } & SchemaDefineContent<SpecificRecord>['query']['findParams'],
		options: GraphQLFindOptions = {}
	): Promise<SpecificRecord[]> {
		const { table } = findArgs;
		findArgs.selects = this._prepareFieldSelects(table, findArgs);
		const findHandler = await import('./find').then((m) => m.default);
		return findHandler<SpecificRecord>(this._client, { ...findArgs, table }, options);
	}

	/**
	 * 計算記錄總數
	 * 根據指定的查詢條件計算符合條件的記錄總數
	 * 支援篩選條件，不會實際載入記錄資料，僅返回計數
	 *
	 * @template Table - 表格名稱類型
	 * @param countArgs 計數參數，包含表格名稱和篩選條件
	 * @param options 選項，如中止信號
	 * @returns Promise 解析為記錄總數
	 *
	 * @example
	 * // 計算所有使用者數量
	 * const totalUsers = await client.count({
	 *   table: 'users'
	 * });
	 *
	 * @example
	 * // 計算活躍使用者數量
	 * const activeUsers = await client.count({
	 *   table: 'users',
	 *   filters: [{ field: 'status', operator: 'eq', value: 'active' }]
	 * });
	 */
	public async count<Table extends Extract<keyof RSD, string>>(
		countArgs: NormCountArgs<Table>,
		options: { abortSignal?: AbortSignal } = {}
	): Promise<number> {
		const countHandler = await import('./count').then((m) => m.default);
		return countHandler(this._client, countArgs, options);
	}
}
