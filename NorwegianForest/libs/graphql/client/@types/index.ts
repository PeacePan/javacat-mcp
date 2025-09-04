import { ArchivedStatus } from '@norwegianForestLibs/enum';
import {
	BUILTIN_BODY_FIELD2,
	BUILTIN_LINE_FILED2,
	EnumLiteral,
	ExtractSafeRecordBody,
	ExtractSafeRecordLines,
	LineRowLocator,
	NormFindArgs,
	NormLineRow,
	RecordLocator,
	SafeRecord2,
} from '@norwegianForestTypes';
import { ExecuteArgs } from '@norwegianForestTypes/graphql';
import { TableName } from '@norwegianForestTypes/table';
import { Keyof, NN, SpecificFieldsOnly } from '@xolo/interface';
import { RecordsSchemaDefine } from './schema';

/**
 * JavaCat GraphQL Client 的主選項型別
 * @template RSD - RecordsSchemaDefine 子集
 */
export type JavaCatGraphQLClientOptions<RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>>> =
	JavaCatGraphQLClientBaseOptions & JavaCatGraphQLClientQueryOptions<RSD>;
/**
 * JavaCat GraphQL Client 的查詢選項型別
 * @template RSD - RecordsSchemaDefine 子集
 */
export type JavaCatGraphQLClientQueryOptions<RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>>> = {
	/** 查詢欄位定義（可選） */
	querySchema?: QuerySchemaDefine<RSD>;
};
/**  JavaCat GraphQL Client 的基底選項型別 */
export type JavaCatGraphQLClientBaseOptions = {
	/** 執行環境 */
	env: 'production' | 'staging' | 'dev';
	/** Auth 憑證存放在瀏覽器的 localStorage 的鍵值 */
	jwtStorageKey?: string;
	/** Auth 憑證檔案路徑 */
	authEnvPath?: string;
};
/** GraphQL Server 本身會回傳的資料結構 */
/**
 * GraphQL 查詢回傳的資料結構
 * @template Record - SafeRecord2 子型別
 */
export type GraphQLFindResult<Record = SafeRecord2> = {
	/** GQL 查詢端點命名統一別名 (alias) */
	findResult: Record[];
};
/** GraphQL 查詢選項 */
export type GraphQLFindOptions = {
	/** 一個請求的最大回傳筆數，預設 50 */
	limitPerQuery?: number;
	/** fetch request 的中斷訊號 */
	abortSignal?: AbortSignal;
} & (
	| {
			/** 啟用批次查詢 */
			useBatch: true;
			/** 想抓取的資料筆數，若沒丟入則會抓取此資料表的最大筆數 */
			totalCount?: number;
			/** 一次併發的請求數，預設 4 */
			concurrency?: number;
			/**
			 * 區塊資料下載時的進度事件
			 * @param progress 0 ~ 1 的浮點數數值
			 */
			onProgress?: (progress: number) => void;
	  }
	| {
			/** 是否要一直查詢到最後一筆資料 */
			untilEnd?: true;
	  }
);
/**
 * GQL 使用的搜尋參數，主要是將 archived 轉為 GQL 可接受的格式
 * @template Args - NormFindArgs 子型別
 */
export type GraphQLNormArgs<Args extends Partial<NormFindArgs> = NormFindArgs> = Omit<Args, 'archived'> & {
	/** 封存狀態 */
	archived?: EnumLiteral<ArchivedStatus>;
};

//#region 資料與參數定義

/** 系統表預設限定的操作 */
export type SystemDefaultOperation = Extract<GQLMutationOperation, 'insert' | 'update'>;
/** 一般表預設限定的操作 */
export type NormalDefaultOperation = Extract<GQLMutationOperation, 'insert' | 'update' | 'archive'>;
/**
 * 資料與參數定義
 * @template SpecificRecord - SafeRecord2 子型別
 * @template Operation - 支援的 mutate 操作
 */
export type SchemaDefineContent<
	SpecificRecord extends SafeRecord2 = SafeRecord2,
	Operation extends GQLMutationOperation = never,
	EnableApproval extends boolean = false,
	ExecuteDefine = never,
	CallDefine = never,
> = {
	/** 搜尋的回傳資料與參數定義 */
	query: {
		/** 回傳資料型態，各資料於 models 裡定義 */
		records: SpecificRecord[];
		/** 可傳入的 query variables */
		findParams: Omit<NormFindArgs, 'table' | 'sorting' | 'multiSort' | 'sort' | 'selects'> & {
			/** 指定回傳欄位 */
			selects?: Array<GraphQLSorting<SpecificRecord>['field'] | 'body' | 'lines'>;
			/**
			 * 排序
			 * @default "{ field: '_id', direction: -1 }"
			 */
			sorting?: GraphQLSorting<SpecificRecord>;
			/**
			 * 多條件排序
			 * 目前僅支援最多兩個欄位排序，array index即為優先順序
			 * @default "[{ _id: -1, direction: -1 }]"
			 */
			multiSort?: [GraphQLSorting<SpecificRecord>] | [GraphQLSorting<SpecificRecord>, GraphQLSorting<SpecificRecord>];
		};
	};
	/** 允許的資料操作 */
	operation: Operation;
	/** 該表是否有啟用簽核 */
	enableApproval: EnableApproval;
	/** 資料操作的參數定義 */
	mutation: {
		/** 可支援新增 */
		insert: 'insert' extends Operation ? PreparseInsertRecord<SpecificRecord>[] : never;
		/** 可支援更新 */
		update: 'update' extends Operation ? PreparseNormUpdateRecord<SpecificRecord>[] : never;
		/** 可支援修補 */
		patch: 'patch' extends Operation ? PreparseNormPatchRecord<SpecificRecord>[] : never;
		/** 可支援封存 */
		archive: 'archive' extends Operation
			? Array<RecordLocator<SpecificFieldsOnly<ExtractSafeRecordBody<SpecificRecord> & BUILTIN_BODY_FIELD2, string>>>
			: never;
	};
	executeFunctions: {
		[FunctionName in Extract<keyof ExecuteDefine, string>]: {
			executeArgs: Pick<ExecuteArgs, 'ignoreArchive' | 'ignoreApproval' | 'param'> & {
				key: { name: SpecificFieldsOnly<ExtractSafeRecordBody<SpecificRecord> & BUILTIN_BODY_FIELD2, string>; value: string };
				name: FunctionName;
				argument?: (ExecuteDefine[FunctionName] & ExecuteDefineContent)['argument'];
			};
			response: (ExecuteDefine[FunctionName] & ExecuteDefineContent)['response'];
		};
	};
	callFunctions: {
		[FunctionName in Extract<keyof CallDefine, string>]: {
			callArgs: {
				name: FunctionName;
				argument?: (CallDefine[FunctionName] & CallDefineContent)['argument'];
			};
			response: (CallDefine[FunctionName] & CallDefineContent)['response'];
		};
	};
};
/**
 * 搜尋 record 可以使用的排序參數
 * @template R - SafeRecord2 子型別
 */
export type GraphQLSorting<R extends SafeRecord2> = Pick<NN<NormFindArgs['sorting']>, 'direction'> & {
	/** 完整欄位名稱 eg "_id" "body.name" */
	field:
		| Keyof<Pick<R, '_id'>>
		| Keyof<{
				[FieldName in Keyof<R['body']> as `body.${Extract<FieldName, string>}`]: R['body'][FieldName];
		  }>
		| {
				[LineName in Keyof<NN<R['lines']>>]: Keyof<{
					[FieldName in Keyof<NN<NN<NN<R['lines']>[LineName]>>[number]> as LineName extends string
						? string extends LineName
							? never
							: FieldName extends string
								? string extends FieldName
									? never
									: `lines.${LineName}.${FieldName}`
								: never
						: never]: NN<NN<NN<R['lines']>[LineName]>>[number];
				}>;
		  }[Keyof<NN<R['lines']>>];
};
/**
 * 支援的資料種類 query variables 文本內容
 * @template RSD - RecordsSchemaDefine 子集
 */
export type QuerySchemaDefine<RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>>> = {
	[Table in Extract<keyof RSD, string>]?: Pick<NormFindArgs, 'skipRefTables'> & {
		/** 表頭回傳欄位文本 */
		bodyFields: Array<keyof QueryRecord<RSD, Table>['body']>;
		/** 表身回傳欄位文本 */
		lineFields?: {
			[LineName in keyof NN<QueryRecord<RSD, Table>['lines']>]?: Array<RecordLineFields<RSD, Table, LineName>>;
		};
	};
};
export type ExecuteDefineContent<
	FunctionName extends string = string,
	Argument extends SafeRecord2 = SafeRecord2,
	Response extends Record<string, unknown> | boolean | number | Date | string | null = null,
> = {
	[F in FunctionName]: { argument: Argument; response: Response };
};
export type CallDefineContent<
	FunctionName extends string = string,
	Argument extends unknown = never,
	Response extends Record<string, unknown> | boolean | number | Date | string | null = null,
> = {
	[F in FunctionName]: { argument: Argument; response: Response };
};
/** 應用端使用非泛用型資料格式的新增紀錄格式 */
export type PreparseInsertRecord<SpecificRecord extends SafeRecord2> = {
	/** 自指定 Record 提取的表頭型別 */
	body: ExtractSafeRecordBody<SpecificRecord>;
	/** 自指定 Record 提取的表身型別 */
	lines?: Partial<ExtractSafeRecordLines<SpecificRecord>>;
};
/** 應用端使用非泛用型資料格式的更新紀錄格式 */
export type PreparseNormUpdateRecord<SpecificRecord extends SafeRecord2> = RecordLocator<
	SpecificFieldsOnly<ExtractSafeRecordBody<SpecificRecord> & BUILTIN_BODY_FIELD2, string>
> & {
	/** 自指定 Record 提取的表頭型別 */
	body?: Partial<ExtractSafeRecordBody<SpecificRecord>>;
	/** 新增表身列的操作，表身列資料使用表身定義而非泛用型的型別 */
	pushLineRows?: Array<
		Pick<NormLineRow, 'lineName'> & {
			lineRow: {
				[LineName in Keyof<ExtractSafeRecordLines<SpecificRecord>>]: ExtractSafeRecordLines<SpecificRecord>[LineName];
			}[Keyof<ExtractSafeRecordLines<SpecificRecord>>];
		}
	>;
	/** 更新表身列的操作，表身列資料使用表身定義而非泛用型的型別，並且鍵值限制於字串欄位 */
	setLineRows?: Array<
		{
			[LineName in Keyof<ExtractSafeRecordLines<SpecificRecord>>]: LineRowLocator<
				LineName,
				SpecificFieldsOnly<ExtractSafeRecordLines<SpecificRecord>[LineName] & BUILTIN_LINE_FILED2, string>
			>;
		}[Keyof<ExtractSafeRecordLines<SpecificRecord>>] & {
			lineRow: {
				[LineName in Keyof<ExtractSafeRecordLines<SpecificRecord>>]: Partial<ExtractSafeRecordLines<SpecificRecord>[LineName]>;
			}[Keyof<ExtractSafeRecordLines<SpecificRecord>>];
		}
	>;
	/** 移除表身列的操作，鍵值限制於字串欄位 */
	pullLineRows?: Array<
		{
			[LineName in Keyof<ExtractSafeRecordLines<SpecificRecord>>]: LineRowLocator<
				LineName,
				SpecificFieldsOnly<ExtractSafeRecordLines<SpecificRecord>[LineName] & BUILTIN_LINE_FILED2, string>
			>;
		}[Keyof<ExtractSafeRecordLines<SpecificRecord>>]
	>;
};
/** 應用端使用非泛用型資料格式的修補紀錄格式 */
export type PreparseNormPatchRecord<SpecificRecord extends SafeRecord2> = RecordLocator<
	SpecificFieldsOnly<ExtractSafeRecordBody<SpecificRecord> & BUILTIN_BODY_FIELD2, string>
> & {
	/** 自指定 Record 提取的表頭型別 */
	body?: Partial<ExtractSafeRecordBody<SpecificRecord>>;
	/** 修補表身列的操作 */
	lineRows?: Array<
		Pick<NormLineRow, 'lineName'> & {
			lineRow: {
				[LineName in Keyof<ExtractSafeRecordLines<SpecificRecord>>]: ExtractSafeRecordLines<SpecificRecord>[LineName];
			}[Keyof<ExtractSafeRecordLines<SpecificRecord>>];
		}
	>;
};
/** 輔助型別：提取記錄型別 */
export type ExtractSchemaDefineContentRecordType<T> = T extends { query: { records: infer R } }
	? R extends readonly unknown[]
		? R[number]
		: never
	: never;
/** 輔助型別：提取定義是否啟用簽核 */
export type IsSchemaDefineContentEnableApproval<T> = T extends { enableApproval: infer E } ? (E extends boolean ? E : never) : never;
/**
 * 取得指定表格的回傳資料型別
 * @template RSD - RecordsSchemaDefine 子集
 * @template Table - 表格名稱
 */
type QueryRecord<
	RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>>,
	Table extends Extract<keyof RSD, string> = Extract<keyof RSD, string>,
> = (RSD[Table] & SchemaDefineContent<SafeRecord2>)['query']['records'][number];
/**
 * 取得指定表格表身欄位型別
 * @template RSD - RecordsSchemaDefine 子集
 * @template Table - 表格名稱
 * @template LineName - 表身名稱
 */
type RecordLineFields<
	RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>>,
	Table extends Extract<keyof RSD, string> = Extract<keyof RSD, string>,
	LineName extends keyof NN<QueryRecord<RSD, Table>['lines']> = keyof NN<QueryRecord<RSD, Table>['lines']>,
> = keyof NN<NN<QueryRecord<RSD, Table>['lines']>[LineName]>[number];
/**
 * 支援的 mutate 操作
 * @typeParam insert - 新增
 * @typeParam update - 更新
 * @typeParam archive - 封存
 */
export type GQLMutationOperation = 'insert' | 'update' | 'patch' | 'archive';
//#endregion
