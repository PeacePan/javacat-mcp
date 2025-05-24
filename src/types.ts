import { ServerError } from '@apollo/client';

/** GraphQL Server 自行 catch 錯誤回傳的自定義錯誤回傳格式 */
export interface GQLServerResult {
	/** 錯誤資訊 */
	errors: ServerError[];
	/** 從伺服器回傳的錯誤狀態碼 */
	statusCode: number;
	/** 總結錯誤訊息 */
	message: string;
	/** 錯誤堆疊 */
	stack: string;
}
/** 正規化搜尋之排序條件
 * @field 完整欄位名稱 eg "_id" "body.name"
 * @direction 方向 1: 升冪 -1: 降冪
 */
export type FindArgsSortingCondition = {
	field: string;
	direction: 1 | -1;
};
/** 正規化搜尋條件 */
export type NormCondition = NormField & {
	/** 運算子，只有 `in` `like` 會聚合 */
	operator: 'in' | 'nin' | 'like' | 'gte' | 'lte' | 'gt' | 'lt';
};
/** 正規化表身過濾器 */
export interface NormLineFilter {
	/** 表身名稱 */
	lineName: string;
	/** 表身欄位條件 */
	lineConditions: Array<NormCondition>;
}
export type NormFindArgsFilter = {
	/** 表頭欄位條件 */
	bodyConditions?: Array<NormCondition>;
	/** 表身條件 */
	lineFilters?: Array<NormLineFilter>;
};
/** 正規化搜尋 */
export interface NormFindArgs {
	/** 表格名稱 */
	table: string;
	/** 跳過參考資料 */
	skipRefTables?: string[]; // TODO: 改成使用 literal type
	/** 回傳忽略表身 */
	skipLines?: boolean;
	/** 選擇欄位 */
	selects?: string[];
	/** 過濾器 */
	filters?: NormFindArgsFilter[];
	/** 簽核狀態 `null` 代表不限制 */
	approved?: ApprovalStatus | `${ApprovalStatus}` | null;
	/** 封存狀態 */
	archived?: ArchivedStatus | `${ArchivedStatus}`;
	// /** 限制 */
	// constraints?: NormFindArgs['filters'],
	/**
	 * 偏移量 ~~或上一頁的邊界 _id~~
	 * 1. ~~如果沒有設定 pagingById，視作 skip(offset)~~
	 * 1. ~~如果 pagingById 為 1 視作 { _id: { $gt: offset } }~~
	 * 1. ~~如果 pagingById 為 -1 視作 { _id: { $lt: offset } }~~
	 */
	offset?: number;
	/**
	 * 回傳筆數
	 * @default 50
	 */
	limit?: number;
	/**
	 * 使用 _id 來分頁
	 * @deprecated
	 * 1. 1 按照 _id 升冪
	 * 1. -1 按照 _id 降冪
	 * 1. 和 sort 互斥
	 * 1. 關於分頁 https://medium.com/swlh/mongodb-pagination-fast-consistent-ece2a97070f3
	 */
	pagingById?: -1 | 1;
	/**
	 * 排序
	 * 1. 和 pagingById 互斥
	 * @default { field: '_id', direction: -1 }
	 * @deprecated
	 */
	sort?: Array<{
		/** 欄位名稱 */
		field: string;
		/** 排序 */
		direction: 1 | -1;
	}>;
	/**
	 * 排序
	 * @default "{ _id: -1 }"
	 */
	sorting?: {
		/** 完整欄位名稱 eg "_id" "body.name" */
		field: string;
		/** 方向 */
		direction: 1 | -1;
	};
	/**
	 * 多條件排序
	 * 目前僅支援最多兩個欄位排序，array index即為優先順序
	 * @default "[{ _id: -1 }]"
	 */
	multiSort?: FindArgsSortingCondition[];
	//#region 展開表身的參數
	/**
	 * 展開表身列名稱
	 */
	expand?: string;
	/**
	 * 展開表身列名稱
	 * @deprecated 請改用 expand
	 */
	expandLineName?: string;
	/**
	 * 展開表身列偏移
	 * @deprecated
	 **/
	expandLineRowOffset?: number;
	//#endregion
}
/** gql server 本身會回傳的資料結構 */
export interface GQLFindResult<Record = SafeRecord2> {
	/** GQL 查詢端點命名統一別名 (alias) */
	findResult: Record[];
}
/** GQL 使用的封存狀態 */
export type GQLArchivedStatus = keyof typeof ArchivedStatus;
/** GQL 使用的搜尋參數，主要是將 archived 轉為 GQL 可接受的格式 */
export type GQLNormArgs<Args extends Partial<NormFindArgs> = NormFindArgs> = Omit<Args, 'archived'> & {
	archived?: GQLArchivedStatus;
};
/** 正規化 MyRecord */
export interface NormRecord2 {
	/** 系統編號 */
	_id?: string;
	/** 表頭，如果欄位值為 null 就不會存在 */
	bodyFields: Array<NormField>;
	/** 表身資料 */
	lineRows: Array<NormLineRow>;
}
/** 正規化表身列 */
export interface NormLineRow {
	/** 表身名稱 */
	lineName: string;
	/** 表身列資料 */
	lineFields: Array<NormField>;
}
/** 正規化鍵值對 */
export type NormField = {
	/** 欄位名稱，特殊值 `_id` */
	fieldName: string;
} & (
	| {
			valueType: NormFieldValueType.BOOLEAN;
			boolean: boolean | null;
	  }
	| {
			valueType: NormFieldValueType.STRING;
			string: string | null;
	  }
	| {
			valueType: NormFieldValueType.NUMBER;
			number: number | null;
	  }
	| {
			valueType: NormFieldValueType.DATE;
			date: Date | null;
	  }
	| {
			valueType: NormFieldValueType.ID;
			id: string | null;
	  }
	| { valueType: NormFieldValueType.NULL }
);
/** 正規欄位值型別 */
export enum NormFieldValueType {
	BOOLEAN = 'BOOLEAN',
	STRING = 'STRING',
	NUMBER = 'NUMBER',
	DATE = 'DATE',
	NULL = 'NULL',
	ID = 'ID',
}
/** 輸出類型確實為 string 的 key */
export type Keyof<T> = Extract<keyof T, string>;
/** 取得所有可選的 key */
export type OptionalKeys<T> = {
	[K in Keyof<T>]-?: undefined extends T[K] ? K : never;
}[Keyof<T>];
/** 取得所有必填的 key */
export type RequiredKeys<T> = {
	[K in Keyof<T>]-?: undefined extends T[K] ? never : K;
}[Keyof<T>];
/** null 化每個 key 值 */
export type Null<T> = { [K in RequiredKeys<T>]: T[K] | null } & {
	[K in OptionalKeys<T>]?: T[K] | null;
};
/**
 * 紀錄資料結構
 * @template BODY 表頭資料結構
 * @template LINES 表身資料結構
 */
export type SafeRecord2<BODY extends Row = Row, LINES extends Lines = Lines> = {
	/** 系統編號，整數編號，從 1 開始 */
	_id?: string;
	/** 表頭 */
	body: Null<BODY & BUILTIN_BODY_FIELD>;
	/** 表身集合 */
	lines?: {
		/** 表身 */
		[lineName in keyof LINES]?: Array<Null<LINES[lineName] & BUILTIN_LINE_FILED>> | null;
	};
};
/** 欄位值型別 */
export type FIELD_VALUE_TYPE = null | boolean | number | Date | string;

/** 鍵值對綱要 */
export type Row = Record<string, FIELD_VALUE_TYPE>;

/** 表身綱要 */
export type Lines = {
	[lineName: string]: Row;
};
/** 內建表頭欄位 */
export type BUILTIN_BODY_FIELD = {
	//#region 系統行為欄位
	/** 系統主鍵 */
	_id?: string;
	/** 建立時間 */
	_createdAt?: Date;
	/** 更新時間 */
	_updatedAt?: Date;
	/** 封存時間 */
	_archivedAt?: Date;
	/** 建立者 */
	_createdBy?: string;
	/** 更新者 */
	_updatedBy?: string;
	/** 封存者 */
	_archivedBy?: string;
	//#endregion
	//#region 簽核欄位
	/** 簽核狀態 */
	_approvalStatus?: ApprovalStatus | `${ApprovalStatus}`;
	/** 簽核單編號 */
	_approvalName2?: string;
	/** 簽核序數。同一批新增的紀錄會有一樣的序數 */
	_approvalSequence2?: string;
	/** 簽核單產生的重試次數 */
	_approvalRetry?: number;
	/** 簽核單產生的失敗原因 */
	_approvalResult?: string;
	/** 簽核同意者 */
	_approvalApprovedBy2?: string;
	/** 簽核同意時間 */
	_approvalApprovedAt2?: Date;
	/** 簽核拒絕者 */
	_approvalDeniedBy2?: string;
	/** 簽核拒絕時間 */
	_approvalDeniedAt2?: Date;
	//#endregion
};
/** 內建表身欄位 */
export type BUILTIN_LINE_FILED = {
	/** 系統主鍵 */
	_id?: number;
	/** 建立時間 */
	_createdAt?: Date;
	/** 更新時間 */
	_updatedAt?: Date;
	/** 建立者 */
	_createdBy?: string;
	/** 更新者 */
	_updatedBy?: string;
};
/** 封存狀態 */
export enum ArchivedStatus {
	/** 只顯示已封存的 */
	ARCHIVED_ONLY = 'ARCHIVED_ONLY',
	/** 全部顯示 */
	ALL = 'ALL',
	/** 只顯示未被封存的 */
	NORMAL = 'NORMAL',
}
/** 簽核狀態 */
export enum ApprovalStatus {
	/** 已通過。將篩選簽核狀態為 null 或已通過 */
	APPROVED = 'APPROVED',
	/** 已通過。只用在搜尋時可精確篩出已通過的紀錄。只開放給 Norcat 及後端內部使用 */
	APPROVED_EXACT = 'APPROVED_EXACT',
	/** 已拒絕 */
	DENIED = 'DENIED',
	/** 待決 */
	PENDING = 'PENDING',
	/** 錯誤，在這個狀態下可以手動重新產生簽核單 */
	ERROR = 'ERROR',
}
