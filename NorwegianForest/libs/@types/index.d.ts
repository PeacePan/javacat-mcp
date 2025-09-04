import { Null, SpecificFieldsOnly } from '@xolo/interface';
import {
	ApprovalStatus,
	ArchivedStatus,
	NormFieldValueType,
	PermissionAction,
	PermissionEffect,
	TodoJobStatus,
} from '../enum';
import { FindArgsSortingCondition } from './graphql';
import { RoleLines, TokenBody, UserBody } from './systemTable';
import { TableName } from './table';

import type { ExternalLinesSearchValue } from '../const';

/** 欄位值型別 */
export type FIELD_VALUE_TYPE = null | boolean | number | Date | string | SystemId;

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

/**
 * SafeRecord 的內建表頭欄位，未來連同 SafeRecord 一起捨棄
 */
export type LEGACY_BUILTIN_BODY_FIELD = Omit<BUILTIN_BODY_FIELD, '_id'> & { _id?: number };

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

/** 安全的表身列 */
export type SafeLineRow<T = Row> = Null<BUILTIN_LINE_FILED & T>;

/**
 * 紀錄資料結構
 * @template BODY 表頭資料結構
 * @template LINES 表身資料結構
 * @deprecated 改用 ObjectID 的系統編號後，不再需要使用這個型別，請改用 SafeRecord or SafeRecord2
 */
export type UnsafeRecord<BODY extends Row = Row, LINES extends Lines = Lines> = {
	/** 系統編號，整數編號，從 1 開始 */
	_id: number;
	/** 表頭 */
	body: BODY & BUILTIN_BODY_FIELD;
	/** 表身集合 */
	lines: {
		/** 表身 */
		[lineName in keyof LINES]: Array<LINES[lineName] & BUILTIN_LINE_FILED>;
	};
};

/**
 * 紀錄資料結構
 * @template BODY 表頭資料結構
 * @template LINES 表身資料結構
 */
export type SafeRecord<BODY extends Row = Row, LINES extends Lines = Lines> = {
	/** 系統編號，整數編號，從 1 開始 */
	_id?: number;
	/** 表頭 */
	body: Null<BODY & LEGACY_BUILTIN_BODY_FIELD>;
	/** 表身集合 */
	lines?: {
		/** 表身 */
		[lineName in keyof LINES]?: Array<Null<LINES[lineName] & BUILTIN_LINE_FILED>> | null;
	};
};
/** 後端內部 ID */
export type SystemId = number | ObjectId;

//#region NormField & NormRecord & NormInsertArgs
/** 正規化鍵值對 */
export type NormField<Field extends string = string> = {
	/** 欄位名稱，特殊值 `_id` */
	fieldName: Field;
} & (
	| {
			valueType: EnumLiteral<NormFieldValueType.BOOLEAN>;
			boolean: boolean | null;
	  }
	| {
			valueType: EnumLiteral<NormFieldValueType.STRING>;
			string: string | null;
	  }
	| {
			valueType: EnumLiteral<NormFieldValueType.NUMBER>;
			number: number | null;
	  }
	| {
			valueType: EnumLiteral<NormFieldValueType.DATE>;
			date: Date | null;
	  }
	| {
			valueType: EnumLiteral<NormFieldValueType.ID>;
			id: string | null;
	  }
	| { valueType: EnumLiteral<NormFieldValueType.NULL> }
);
/** 正規化表身列 */
export interface NormLineRow {
	/** 表身名稱 */
	lineName: string;
	/** 表身列資料 */
	lineFields: Array<NormField>;
}
/** 正規化 MyRecord */
export interface NormRecord {
	/** 系統編號，整數編號，從 1 開始 */
	_id?: number;
	/** 表頭，如果欄位值為 null 就不會存在 */
	bodyFields: Array<NormField>;
	/** 表身資料 */
	lineRows: Array<NormLineRow>;
}
/**
 * GraphQL 批次新增
 */
export type NormInsertArgs<Table extends string = string> = {
	/** 表格名稱 */
	table: Table;
	/** 批次資料 */
	data: Array<Omit<NormRecord, '_id'>>;
	/** 簽核主旨 */
	approvalSubject?: string;
	/** 簽核說明 */
	approvalDescription?: string;
	files?: string[];
};
//#endregion
//#region 使用者認證、權限
/** 欄位效果 */
export type FieldEffect = {
	/** 欄位名稱 */
	name: string;
	/** 效果，固定回傳 ALLOW or DENY */
	effect: PermissionEffect;
};
/** FieldPermission 欄位權限 */
export type FieldPermission = {
	effect: PermissionEffect;
	/** 表頭欄位效果 */
	bodyFields: Array<FieldEffect>;
	/** 表身欄位效果列表 */
	lineFields: Array<
		FieldEffect & {
			/** 表身名稱 */
			line: string;
		}
	>;
};

/** query.permission 參數 */
export type PermissionArgs = {
	/** 表格名稱 */
	table: string;
	/** 權限動作 */
	action: PermissionAction;
};
/**
 * 使用者驗證回傳
 * @deprecated 請改用 Authentication
 */
export type VerifyResult = Authentication;
/** 使用者驗證，使用者與令牌只會擇一出現 */
export type Authentication = {
	/**
	 * 使用者編號
	 * @deprecated
	 */
	name?: string;
	/**
	 * 使用者顯示名稱
	 * @deprecated
	 */
	displayName?: string;
	/**
	 * 使用者層級
	 * @deprecated
	 */
	level?: string;
	/** 使用者 */
	user?: Pick<UserBody, 'name' | 'displayName' | 'level' | 'disabled'>;
	/** 令牌 */
	token?: Pick<TokenBody, 'name' | 'memo' | 'accessKeyId'>;
	/** 角色清單 */
	roles: Array<string>;
	/** 隱藏中台側欄群組 */
	hideLeftNavGroup?: boolean;
	//#region 權限 & 限制
	/** 權限清單 */
	permissions: Array<{ role: string } & RoleLines['permissions']>;
	/** 限制清單 */
	constraints: Array<{ role: string } & RoleLines['constraints']>;
	//#endregion
	//#region 權限2 & 限制2
	/** 權限清單 */
	permissions2: Array<{ role: string } & RoleLines['permissions2']>;
	/** 限制清單 */
	constraints2: Array<{ role: string } & RoleLines['constraints2']>;
	//#endregion
	/** 後端用查詢權限結構，使用 Map 儲存，key 的結構: `table,field` 或 `table,lineName.field` */
	permissionMap: Map<string, PermissionEffect>;
	/** 可存取表格清單 */
	tables: Array<string>;
};
//#endregion
//#region NormPatchArgs
export type NormPatchArgs<Table extends string = string> = {
	/** 表格名稱 */
	table: Table;
	/** 批次資料 */
	data: Array<NormPatchRecord>;
};
/** 正規化更新紀錄 */
export type NormPatchRecord = RecordLocator & {
	/** 表頭欄位 */
	bodyFields: Array<UpdateNormField>;
	/** 表身列 */
	lineRows: Array<NormLineRow>;
};
//#endregion
//#region NormUpdateArgs
/** 更新鍵值對 */
export type UpdateNormField = NormField;
/** 表身列定位 */
export type LineRowLocator<LineName extends string = string, KeyName extends string = string> = {
	/** 表身名稱 */
	lineName: LineName;
	/** 表身鍵欄位名稱，特殊值 `_id` */
	lineKeyName: KeyName;
	/** 表身鍵欄位值 */
	lineKeyValue: string;
};
/** 紀錄定位 */
export type RecordLocator<KeyName extends string = string> = {
	/** 鍵欄位名稱，特殊值 `_id` */
	keyName: KeyName;
	/** 鍵欄位值，如果 keyName 為 `_id` 必須為可正整數化文字 */
	keyValue: string;
};
/** 正規化更新紀錄 */
export type NormUpdateRecord = RecordLocator & {
	/** 表頭更新 */
	bodyFields?: Array<UpdateNormField>;
	/** 新增表身列 */
	pushLineRows?: Array<NormLineRow>;
	/** 移除表身列 */
	pullLineRows?: Array<LineRowLocator>;
	/** 更新表身列 */
	setLineRows?: Array<
		LineRowLocator & {
			/** 表身欄位更新 */
			lineFields: Array<UpdateNormField>;
		}
	>;
};
/** GraphQL 批次更新 */
export interface NormUpdateArgs<Table extends string = string> {
	/** 表格名稱 */
	table: Table;
	/** 批次資料 */
	data: Array<NormUpdateRecord>;
	/** 忽略政策 */
	ignorePolicy?: boolean;
}
//#endregion
//#region NormArchiveArgs & NormGetArgs
/** GraphQL 批次封存 */
export interface NormArchiveArgs<Table extends string = string> {
	/** 表格名稱 */
	table: Table;
	/** 批次資料 */
	data: Array<RecordLocator>;
}
/** 找單一紀錄 */
export type NormGetArgs<Table extends string = string> = RecordLocator & {
	/** 表格名稱 */
	table: Table;
	/** 封存狀態 */
	archived?: ArchivedStatus;
	/** 簽核狀態 `null` 代表不限制 */
	approved?: ApprovalStatus | null;
	/** 限制 */
	constraints?: NormFindArgs['filters'];
	/** 回傳忽略表身 */
	skipLines?: boolean;
	/** 選擇欄位 */
	selects?: string[];
};
//#endregion
//#region NormFindArgs
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
/** 正規化搜尋 */
export interface NormFindArgs<Table extends string = string> {
	/** 表格名稱 */
	table: Table;
	/** 跳過參考資料 */
	skipRefTables?: TableName[];
	/** 回傳忽略表身 */
	skipLines?: boolean;
	/** 選擇欄位 */
	selects?: string[];
	/** 過濾器 */
	filters?: NormFindArgsFilter[];
	/** 簽核狀態 `null` 代表不限制 */
	approved?: ApprovalStatus | null;
	/** 封存狀態 */
	archived?: ArchivedStatus;
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
/** 正規化搜尋資料過濾 */
export type NormFindArgsFilter = {
	/** 表頭欄位條件 */
	bodyConditions?: Array<NormCondition>;
	/** 表身條件 */
	lineFilters?: Array<NormLineFilter>;
};
//#endregion
//#region NormCountArgs & FieldLocator & NormDistinctArgs
/** GraphQL query.count 計算紀錄數量 */
export type NormCountArgs<Table extends string = string> = Omit<
	NormFindArgs<Table>,
	'sorting' | 'sort' | 'offset' | 'limit'
>;
/**
 * 欄位定位子
 * @deprecated
 */
export type FieldLocator = {
	/** 表身名稱，null 代表表頭 */
	line?: string | null;
	/** 欄位名稱 */
	field: string;
};
/** GraphQL query.distinct 列出欄位值 */
export type NormDistinctArgs = Pick<NormFindArgs, 'filters' | 'table' | 'archived' | 'approved'> & FieldLocator;
//#endregion
//#region ApproveArgs
/** 同意簽核參數 */
export type ApproveArgs = {
	/** 批次資料 */
	data: Array<{
		/** 簽核單編號 */
		name: string;
		/** 紀錄的系統編號 */
		id: number;
		/** 簽核意見 */
		message?: string;
	}>;
};
//#endregion
//#region ApproveArgs2
/** 同意簽核參數2版 */
export type ApproveArgs2 = {
	/** 批次資料 */
	data: Array<{
		/** 簽核單編號 */
		name: string;
		/** 簽核意見 */
		message?: string;
	}>;
};
//#endregion

export type TodoJobUpdatableFields = {
	/** 執行狀態 */
	status?: TodoJobStatus | `${TodoJobStatus}`;
	/** 工作暫存區 */
	buffer?: string | null;
	/** 工作佇列編號 */
	queueNo?: number;
	/** 重啟自工作歷程 */
	restartFrom?: string;
	/** 備註 */
	memo?: string;
};

//#region string _id 相關
/** 內建表頭欄位 */
export type BUILTIN_BODY_FIELD2 = {
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
export type BUILTIN_LINE_FILED2 = {
	/** 系統主鍵 */
	_id?: string;
	/** 建立時間 */
	_createdAt?: Date;
	/** 更新時間 */
	_updatedAt?: Date;
	/** 建立者 */
	_createdBy?: string;
	/** 更新者 */
	_updatedBy?: string;
};
/** 安全的表身列 */
export type SafeLineRow2<T = Row> = Null<BUILTIN_LINE_FILED2 & T>;
/**
 * 紀錄資料結構
 * @template BODY 表頭資料結構
 * @template LINES 表身資料結構
 */
export type UnsafeRecord2<BODY extends Row = Row, LINES extends Lines = Lines> = {
	/** 系統編號\ */
	_id: string;
	/** 表頭 */
	body: BODY & BUILTIN_BODY_FIELD2;
	/** 表身集合 */
	lines: {
		/** 表身 */
		[lineName in keyof LINES]: Array<LINES[lineName] & BUILTIN_LINE_FILED2>;
	};
};
/**
 * 紀錄資料結構
 * @template BODY 表頭資料結構
 * @template LINES 表身資料結構
 */
export type SafeRecord2<BODY extends Row = Row, LINES extends Lines = Lines> = {
	/** 系統編號 */
	_id?: string;
	/** 表頭 */
	body: Null<BODY & BUILTIN_BODY_FIELD2>;
	/** 表身集合 */
	lines?: {
		/** 表身 */
		[lineName in keyof LINES]?: Array<Null<LINES[lineName] & BUILTIN_LINE_FILED2>> | null;
	};
};
/** 提取 SafeRecord2 的表頭型別 */
export type ExtractSafeRecordBody<T> = T extends SafeRecord2<infer BODY, unknown> ? BODY : never;
/** 提取 SafeRecord2 的表身型別 */
export type ExtractSafeRecordLines<T> = T extends SafeRecord2<unknown, infer LINES> ? LINES : never;
/** 正規化 MyRecord */
export interface NormRecord2 {
	/** 系統編號 */
	_id?: string;
	/** 表頭，如果欄位值為 null 就不會存在 */
	bodyFields: Array<NormField>;
	/** 表身資料 */
	lineRows: Array<NormLineRow>;
}
//#endregion

/** 將 Enum 轉換成字串也通用的型別，目的是在應用時輸入 string 也能觸發 snippet */
export type EnumLiteral<E extends EnumType> = E | `${E}`;

//#region 外部表身搜尋參數
/** 提取特定 valueType 的 NormField */
export type NormFieldByType<T extends NormFieldValueType, Field extends string = string> = Extract<
	NormField<Field>,
	{ valueType: EnumLiteral<T> }
>;
/** 外部表身搜尋條件 */
export type ExternalNormCondition<DestRow extends Row, SourceRow extends Row = DestRow> = {
	[Field in Extract<keyof DestRow, string>]:
		| NormFieldByType<NormFieldValueType.NULL, Field>
		| (Field extends '_id'
				? NormFieldByType<NormFieldValueType.ID, Field> & { operator: 'in' | 'nin' }
				: DestRow[Field] extends string
				? Omit<NormFieldByType<NormFieldValueType.STRING, Field>, 'string'> & {
						string: string | `$${SpecificFieldsOnly<SourceRow, string>}` | null;
				  } & { operator: 'in' | 'nin' | 'like' }
				: DestRow[Field] extends number
				? Omit<NormFieldByType<NormFieldValueType.NUMBER, Field>, 'number'> & {
						number: number | `$${SpecificFieldsOnly<SourceRow, number>}` | null;
				  } & {
						operator: 'in' | 'nin' | 'gte' | 'lte' | 'gt' | 'lt';
				  }
				: DestRow[Field] extends Date
				? Omit<NormFieldByType<NormFieldValueType.DATE, Field>, 'date'> & {
						date: Date | ExternalLinesSearchValue | `$${SpecificFieldsOnly<SourceRow, Date>}` | null;
				  } & {
						operator: 'in' | 'nin' | 'gte' | 'lte' | 'gt' | 'lt';
				  }
				: DestRow[Field] extends boolean
				? Omit<NormFieldByType<NormFieldValueType.BOOLEAN, Field>, 'boolean'> & {
						boolean: `$${SpecificFieldsOnly<SourceRow, boolean>}` | null;
				  } & { operator: 'in' | 'nin' }
				: never);
}[Extract<keyof DestRow, string>];
/** 外部表身正規化表身查詢過濾器 */
export type ExternalNormLineFilter<DestLines extends Lines = Lines, SourceBody extends Row = Row> = {
	/** 表身名稱 */
	lineName: keyof DestLines;
	/** 表身欄位條件 */
	lineConditions: Array<
		ExternalNormCondition<
			Required<DestLines[keyof DestLines] & BUILTIN_LINE_FILED2>,
			Required<SourceBody & BUILTIN_BODY_FIELD2>
		>
	>;
};
/** 外部表身正規化查詢資料過濾器參數 */
export type ExternalNormFindArgsFilter<
	DestBody extends Row = Row,
	DestLines extends Lines = Lines,
	SourceBody extends Row = Row
> = {
	/** 表頭欄位條件 */
	bodyConditions?: Array<
		ExternalNormCondition<Required<DestBody & BUILTIN_BODY_FIELD2>, Required<SourceBody & BUILTIN_BODY_FIELD2>>
	>;
	/** 表身條件 */
	lineFilters?: Array<ExternalNormLineFilter<Required<DestLines>, SourceBody>>;
};
//#endregion
