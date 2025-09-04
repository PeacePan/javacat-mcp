import { Keyof, NN } from '../../../../Xoloitzcuintli/interface';
import { EnumLiteral, NormArchiveArgs, NormFindArgs, NormInsertArgs, NormUpdateArgs, SafeRecord2 } from '../../@types';
import { TableName } from '../../@types/table';
import { ArchivedStatus } from '../../enum';
import { RecordsSchemaDefine } from './libs/schema';

/**
 * JavaCat GraphQL Client 的主選項型別
 * @template RSD - RecordsSchemaDefine 子集
 */
export type JavaCatGraphQLClientOptions<
	RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>>
> = JavaCatGraphQLClientBaseOptions & {
	/** 查詢欄位定義（可選） */
	querySchema?: QuerySchemaDefine<RSD>;
};
/**  JavaCat GraphQL Client 的基底選項型別 */
export type JavaCatGraphQLClientBaseOptions = JavaCatGraphQLClientAuthOptions & {
	/** 執行環境 */
	env: 'production' | 'staging' | 'dev';
};
/** JavaCat GraphQL Client 的驗證選項型別 */
export type JavaCatGraphQLClientAuthOptions = {
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
/**
 * 資料與參數定義
 * @template SpecificRecord - SafeRecord2 子型別
 * @template Operation - 支援的 mutate 操作
 */
export type SchemaDefineContent<
	SpecificRecord extends SafeRecord2 = SafeRecord2,
	Operation extends GQLMutationOperation = never
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
			multiSort?:
				| [GraphQLSorting<SpecificRecord>]
				| [GraphQLSorting<SpecificRecord>, GraphQLSorting<SpecificRecord>];
		};
	};
	/** 資料操作的參數定義 */
	mutation?: {
		/** 可支援新增 */
		insert: Extract<Operation, 'insert'> extends never ? never : NormInsertArgs['data'];
		/** 可支援更新 */
		update: Extract<Operation, 'update'> extends never ? never : NormUpdateArgs['data'];
		/** 可支援封存 */
		archive: Extract<Operation, 'archive'> extends never ? never : NormArchiveArgs['data'];
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
export type QuerySchemaDefine<
	RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>>
> = {
	[Table in Extract<keyof RSD, string>]?: Pick<NormFindArgs, 'skipRefTables'> & {
		/** 表頭回傳欄位文本 */
		bodyFields: Array<keyof QueryRecord<RSD, Table>['body']>;
		/** 表身回傳欄位文本 */
		lineFields?: {
			[LineName in keyof NN<QueryRecord<RSD, Table>['lines']>]?: Array<RecordLineFields<RSD, Table, LineName>>;
		};
	};
};
/**
 * 取得指定表格的回傳資料型別
 * @template RSD - RecordsSchemaDefine 子集
 * @template Table - 表格名稱
 */
type QueryRecord<
	RSD extends Partial<RecordsSchemaDefine> | Partial<Record<TableName, SchemaDefineContent>>,
	Table extends Extract<keyof RSD, string> = Extract<keyof RSD, string>
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
	LineName extends keyof NN<QueryRecord<RSD, Table>['lines']> = keyof NN<QueryRecord<RSD, Table>['lines']>
> = keyof NN<NN<QueryRecord<RSD, Table>['lines']>[LineName]>[number];
/**
 * 支援的 mutate 操作
 * @typeParam insert - 新增
 * @typeParam update - 更新
 * @typeParam archive - 封存
 */
export type GQLMutationOperation = 'insert' | 'update' | 'archive';
//#endregion
