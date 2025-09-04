import { omit } from 'lodash';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { convertMapAsNormFields, mapMyRecordAsNormRecord, mapSafeRecord2AsGeneralizedRecord } from '@norwegianForestLibs/util';
import {
	ApproveArgs2,
	NormArchiveArgs,
	NormInsertArgs,
	NormPatchArgs,
	NormPatchRecord,
	NormUpdateArgs,
	NormUpdateRecord,
	SafeRecord2,
} from '@norwegianForestTypes';
import { CallArgs, DangerDropTableArgs, ExecuteArgs } from '@norwegianForestTypes/graphql';
import { TableName } from '@norwegianForestTypes/table';
import {
	ExtractSchemaDefineContentRecordType,
	GQLMutationOperation,
	IsSchemaDefineContentEnableApproval,
	JavaCatGraphQLClientBaseOptions,
	PreparseNormPatchRecord,
	PreparseNormUpdateRecord,
	SchemaDefineContent,
} from '../@types';
import { RecordsSchemaDefine } from '../@types/schema';

export class JavaCatGraphQLClientMutationHandler<
	RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>> = RecordsSchemaDefine,
> {
	private _env: JavaCatGraphQLClientBaseOptions['env'];

	/**
	 * 建構函式
	 * @param _client ApolloClient 實例
	 */
	constructor(
		private _client: ApolloClient<NormalizedCacheObject>,
		args?: Pick<JavaCatGraphQLClientBaseOptions, 'env'>
	) {
		this._env = args?.env || 'dev';
	}

	/**
	 * 新增資料
	 * @template Table - 表格名稱類型
	 * @param args - 新增操作參數
	 * @returns 新增結果的 ID 陣列
	 */
	public async insert<Table extends Extract<keyof RSD, string>>(
		args: Pick<NormInsertArgs<Table>, 'table'> & {
			data: ExtractSchemaDefineContentMutationArgs<RSD[Table], 'insert'>;
		} & (IsSchemaDefineContentEnableApproval<RSD[Table]> extends true
				? Pick<NormInsertArgs<Table>, 'approvalSubject' | 'approvalDescription' | 'files'>
				: unknown)
	): ReturnType<typeof insertHandler> {
		const { table, data } = args;
		const insertArgs: NormInsertArgs<Table> = {
			table,
			data: (Array.isArray(data) ? data : [data]).map(mapMyRecordAsNormRecord),
		};
		if ('approvalSubject' in args || 'approvalDescription' in args || 'files' in args) {
			const { approvalSubject, approvalDescription, files } = args as Pick<
				NormInsertArgs<Table>,
				'approvalSubject' | 'approvalDescription' | 'files'
			>;
			if (approvalSubject) insertArgs.approvalSubject = approvalSubject;
			if (approvalDescription) insertArgs.approvalDescription = approvalDescription;
			if (Array.isArray(files) && files.length) insertArgs.files = files;
		}
		const insertHandler = await import('./insert').then((m) => m.default);
		return insertHandler(this._client, insertArgs);
	}

	/**
	 * 更新資料
	 * @template Table - 表格名稱類型
	 * @param args - 更新操作參數
	 * @returns 更新結果的 ID 陣列
	 */
	public async update<Table extends Extract<keyof RSD, string>>(
		args: Pick<NormUpdateArgs<Table>, 'table' | 'ignorePolicy'> & {
			data: ExtractSchemaDefineContentMutationArgs<RSD[Table], 'update'>;
		}
	): ReturnType<typeof updateHandler> {
		const { table, data, ignorePolicy } = args;
		const rawData: PreparseNormUpdateRecord<ExtractSchemaDefineContentRecordType<RSD[Table]>>[] = Array.isArray(data) ? data : [data];
		const updateArgs: NormUpdateArgs<Table> = {
			table,
			data: rawData.map<NormUpdateRecord>((raw) => {
				const parsed: NormUpdateRecord = {
					keyName: raw.keyName,
					keyValue: raw.keyValue,
				};
				if ('body' in raw && raw.body && Object.keys(raw.body || {}).length) {
					parsed.bodyFields = convertMapAsNormFields(raw.body);
				}
				if ('pushLineRows' in raw && raw.pushLineRows?.length) {
					parsed.pushLineRows = raw.pushLineRows.map((row) => ({
						...row,
						lineFields: convertMapAsNormFields(row.lineRow),
					}));
				}
				if ('setLineRows' in raw && raw.setLineRows?.length) {
					parsed.setLineRows = raw.setLineRows.map((row) => ({
						...row,
						lineFields: convertMapAsNormFields(row.lineRow),
					}));
				}
				if ('pullLineRows' in raw && raw.pullLineRows?.length) {
					parsed.pullLineRows = raw.pullLineRows;
				}
				return parsed;
			}),
			ignorePolicy,
		};
		const updateHandler = await import('./update').then((m) => m.default);
		return updateHandler(this._client, updateArgs);
	}

	/**
	 * 修補資料，只會更新有差異的部分 (用於更新表格)
	 * @template Table - 表格名稱類型
	 * @param args - 修補操作參數
	 * @returns 修補結果的 ID 陣列
	 */
	public async patch<Table extends Extract<keyof RSD, string>>(
		args: Pick<NormPatchArgs<Table>, 'table'> & {
			data: ExtractSchemaDefineContentMutationArgs<RSD[Table], 'patch'>;
		}
	): ReturnType<typeof patchHandler> {
		const { table, data } = args;
		const rawData: PreparseNormPatchRecord<ExtractSchemaDefineContentRecordType<RSD[Table]>>[] = Array.isArray(data) ? data : [data];
		const patchArgs: NormPatchArgs<Table> = {
			table,
			data: rawData.map<NormPatchRecord>((raw) => {
				const parsed: NormPatchRecord = {
					keyName: raw.keyName,
					keyValue: raw.keyValue,
					bodyFields: [],
					lineRows: [],
				};
				if ('body' in raw && raw.body && Object.keys(raw.body || {}).length) {
					parsed.bodyFields.push(...convertMapAsNormFields(raw.body));
				}
				if ('lineRows' in raw && raw.lineRows?.length) {
					parsed.lineRows.push(
						...raw.lineRows.map((row) => ({
							...row,
							lineFields: convertMapAsNormFields(row.lineRow),
						}))
					);
				}
				return parsed;
			}),
		};
		const patchHandler = await import('./patch').then((m) => m.default);
		return patchHandler(this._client, patchArgs);
	}

	/**
	 * 封存資料
	 * @template Table - 表格名稱類型
	 * @param args - 封存操作參數
	 * @returns 封存結果的 ID 陣列
	 */
	public async archive<Table extends Extract<keyof RSD, string>>(
		args: Pick<NormArchiveArgs<Table>, 'table'> & { data: ExtractSchemaDefineContentMutationArgs<RSD[Table], 'archive'> }
	): ReturnType<typeof archiveHandler> {
		const archiveHandler = await import('./archive').then((m) => m.default);
		return archiveHandler(this._client, args);
	}

	/**
	 * 解封存資料
	 * @template Table - 表格名稱類型
	 * @param args - 解封存操作參數
	 * @returns 解封存結果的 ID 陣列
	 */
	public async unarchive<Table extends Extract<keyof RSD, string>>(
		args: Pick<NormArchiveArgs<Table>, 'table'> & { data: ExtractSchemaDefineContentMutationArgs<RSD[Table], 'archive'> }
	): ReturnType<typeof unarchiveHandler> {
		const unarchiveHandler = await import('./unarchive').then((m) => m.default);
		return unarchiveHandler(this._client, args);
	}

	/**
	 * 執行特定表格的特定 functions
	 * @template Table - 表格名稱類型
	 * @template FunctionName - 函數名稱類型
	 * @param args - 執行操作參數
	 * @returns 函數執行結果
	 */
	public async execute<
		Table extends Extract<keyof RSD, string>,
		ExecuteDefine = ExtractSchemaDefineContentExecuteDefine<RSD[Table]>,
		FunctionName extends Extract<keyof ExecuteDefine, string> = Extract<keyof ExecuteDefine, string>,
	>(
		args: { table: Table } & ExtractSchemaDefineContentExecuteArgs<ExecuteDefine, FunctionName>
	): Promise<ExtractSchemaDefineContentExecuteResponse<ExecuteDefine, FunctionName> | null> {
		const _args = args as typeof args & ExecuteArgs;
		const executeArgs: ExecuteArgs = omit(_args, 'argument');
		if ('argument' in args && typeof args.argument === 'object' && args.argument !== null && 'body' in args.argument) {
			const argument = args.argument as SafeRecord2;
			executeArgs.argument = mapSafeRecord2AsGeneralizedRecord(argument);
		}
		const executeHandler = await import('./execute').then((m) => m.default);
		return await executeHandler(this._client, executeArgs);
	}

	/**
	 * 執行特定表格的特定 functions，可輸入任意 JSON 參數的函數
	 * @template Table - 表格名稱類型
	 * @template FunctionName - 函數名稱類型
	 * @param args - 執行操作參數
	 * @returns 函數執行結果
	 */
	public async call<
		Table extends Extract<keyof RSD, string>,
		CallDefine = ExtractSchemaDefineContentCallDefine<RSD[Table]>,
		FunctionName extends Extract<keyof CallDefine, string> = Extract<keyof CallDefine, string>,
	>(
		args: { table: Table } & ExtractSchemaDefineContentCallArgs<CallDefine, FunctionName>
	): Promise<ExtractSchemaDefineContentCallResponse<CallDefine, FunctionName> | null> {
		const _args = args as typeof args & CallArgs;
		const callArgs: CallArgs = {
			...omit(_args, 'argument'),
			argument: JSON.stringify(_args.argument || {}),
		};
		const callHandler = await import('./call').then((m) => m.default);
		return await callHandler(this._client, callArgs);
	}

	/**
	 * 簽核通過
	 * @param args - 簽核操作參數
	 * @returns 簽核結果的 ID 陣列
	 */
	public async approve(args: ApproveArgs2): Promise<string[]> {
		const approveHandler = await import('./approve').then((m) => m.default);
		return await approveHandler(this._client, args);
	}

	/**
	 * 簽核駁回
	 * @param args - 簽核操作參數
	 * @returns 簽核結果的 ID 陣列
	 */
	public async deny(args: ApproveArgs2): Promise<string[]> {
		const denyHandler = await import('./approve').then((m) => m.default);
		return await denyHandler(this._client, args);
	}

	/**
	 * 刪除表格
	 * @param args 刪除表格輸入參數
	 * @returns 刪除表格是否成功
	 */
	public async dangerDropTable(args: DangerDropTableArgs): Promise<boolean> {
		if (this._env !== 'dev') throw new Error('dangerDropTable 只能在 DEV 環境下執行');
		const dangerDropTableHandler = await import('./dangerDropTable').then((m) => m.default);
		return await dangerDropTableHandler(this._client, args);
	}
}

/** 輔助型別：提取操作參數 */
type ExtractSchemaDefineContentMutationArgs<T, Operation extends GQLMutationOperation> = T extends {
	mutation: { [Key in Operation]: infer O };
}
	? O extends readonly unknown[]
		? O
		: never
	: never;
/** 輔助型別：提取 execute 定義 */
type ExtractSchemaDefineContentExecuteDefine<T> = T extends { executeFunctions: infer EF } ? EF : never;
/** 輔助型別：提取 execute 參數 */
type ExtractSchemaDefineContentExecuteArgs<T, FunctionName extends string> = FunctionName extends keyof T
	? T[FunctionName] extends { executeArgs: infer A }
		? A
		: never
	: never;
/** 輔助型別：提取 execute 回傳 */
type ExtractSchemaDefineContentExecuteResponse<T, FunctionName extends string> = FunctionName extends keyof T
	? T[FunctionName] extends { response: infer RES }
		? RES
		: never
	: never;
/** 輔助型別：提取 call 定義 */
type ExtractSchemaDefineContentCallDefine<T> = T extends { callFunctions: infer CF } ? CF : never;
/** 輔助型別：提取 call 參數 */
type ExtractSchemaDefineContentCallArgs<T, FunctionName extends keyof T> = FunctionName extends keyof T
	? T[FunctionName] extends { callArgs: infer A }
		? A
		: never
	: never;
/** 輔助型別：提取 call 回傳 */
type ExtractSchemaDefineContentCallResponse<T, FunctionName extends keyof T> = FunctionName extends keyof T
	? T[FunctionName] extends { response: infer RES }
		? RES
		: never
	: never;
