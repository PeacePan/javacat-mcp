/** 條件比較子 */
export enum ConditionOperator {
	/** IN */
	IN = 'IN',
	/** NOT IN */
	NIN = 'NIN',
	/** LIKE */
	LIKE = 'LIKE',
	/** GTE */
	GTE = 'GTE',
	/** LTE */
	LTE = 'LTE',
	/**GT */
	GT = 'GT',
	/** LT */
	LT = 'LT',
}
//#endregion

//#region ArchivedStatus 封存狀態
/** 封存狀態 */
export enum ArchivedStatus {
	/** 只顯示已封存的 */
	ARCHIVED_ONLY = 'ARCHIVED_ONLY',
	/** 全部顯示 */
	ALL = 'ALL',
	/** 只顯示未被封存的 */
	NORMAL = 'NORMAL',
}
//#endregion

//#region ApprovalStatus 簽核狀態
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
/** ApprovalStatus 的 displayName 對照 */
export const ApprovalStatusDisplayName: Record<ApprovalStatus, string> = {
	[ApprovalStatus.APPROVED]: '已通過',
	[ApprovalStatus.APPROVED_EXACT]: '已通過(只用在搜尋)',
	[ApprovalStatus.DENIED]: '已拒絕',
	[ApprovalStatus.PENDING]: '待決',
	[ApprovalStatus.ERROR]: '錯誤',
};
//#endregion
//#region PermissionAction 權限動作 */
export enum PermissionAction {
	/** 讀取紀錄 */
	FIND = 'FIND',
	/** 新增紀錄 */
	INSERT = 'INSERT',
	/** 更新紀錄 */
	UPDATE = 'UPDATE',
	/** 封存紀錄 */
	ARCHIVE = 'ARCHIVE',
	/** 解封存紀錄 */
	UNARCHIVE = 'UNARCHIVE',
	/** 下載紀錄 (前端用) */
	DOWNLOAD = 'DOWNLOAD',
	/** 列出紀錄 */
	LIST = 'LIST',
	/** 執行 CALL */
	CALL = 'CALL',
	/** 執行 EXECUTE */
	EXECUTE = 'EXECUTE',
}
/** PermissionAction 的 displayName 對照 */
export const PermissionActionDisplayName: Record<PermissionAction, string> = {
	/** 讀取紀錄 */
	[PermissionAction.FIND]: '讀取',
	/** 新增紀錄 */
	[PermissionAction.INSERT]: '新增',
	/** 更新紀錄 */
	[PermissionAction.UPDATE]: '更新',
	/** 封存紀錄 */
	[PermissionAction.ARCHIVE]: '封存',
	/** 解封存紀錄 */
	[PermissionAction.UNARCHIVE]: '解封存',
	/** 下載紀錄 (前端用) */
	[PermissionAction.DOWNLOAD]: '下載',
	/** 列出紀錄 */
	[PermissionAction.LIST]: '側欄列出',
	/** 執行 CALL */
	[PermissionAction.CALL]: 'CALL',
	/** 執行 EXECUTE */
	[PermissionAction.EXECUTE]: 'EXECUTE',
};
//#endregion
//#region ApprovalAction 簽核動作
/** 簽核動作 */
export enum ApprovalAction {
	/** 同意 */
	APPROVE = 'APPROVE',
	/** 拒絕 */
	DENY = 'DENY',
}
/** ApprovalAction 的 displayName 對照 */
export const ApprovalActionDisplayName: Record<ApprovalAction, string> = {
	[ApprovalAction.APPROVE]: '同意',
	[ApprovalAction.DENY]: '拒絕',
};
//#endregion

/** 正規欄位值型別 */
export enum NormFieldValueType {
	BOOLEAN = 'BOOLEAN',
	STRING = 'STRING',
	NUMBER = 'NUMBER',
	DATE = 'DATE',
	NULL = 'NULL',
	ID = 'ID',
}

export { NormFieldValueType as ValueType };

//#region FieldReadWrite 欄位讀寫
export enum FieldReadWrite {
	/** 建立，不能更新 */
	INSERT = 'INSERT',
	/** 更新，都可以 */
	UPDATE = 'UPDATE',
	/** 讀取，不能更新和建立 */
	READ = 'READ',
}
/** FieldReadWrite 的 displayName 對照 */
export const FieldReadWriteDisplayName: Record<FieldReadWrite, string> = {
	[FieldReadWrite.INSERT]: '建立',
	[FieldReadWrite.READ]: '讀取',
	[FieldReadWrite.UPDATE]: '更新',
};
//#endregion

//#region FieldValueType 資料型別
/** 資料型別 */
export enum FieldValueType {
	/** ID */
	ID = 'ID',
	/** 整數 */
	INT = 'INT',
	/** 浮點數整數 */
	FLOAT_INT = 'FLOAT_INT',
	/** 浮點數 */
	FLOAT = 'FLOAT',
	/** 字串 */
	STRING = 'STRING',
	/** 日期時間 */
	DATE = 'DATE',
	/** 列舉 */
	ENUM = 'ENUM',
	/** 布林 */
	BOOLEAN = 'BOOLEAN',
}
/** FieldValueType 的 displayName 對照 */
export const FieldValueTypeDisplayName: Record<FieldValueType, string> = {
	[FieldValueType.ID]: 'ID',
	[FieldValueType.BOOLEAN]: '布林',
	[FieldValueType.DATE]: '日期',
	[FieldValueType.ENUM]: '列舉',
	[FieldValueType.INT]: '整數',
	[FieldValueType.FLOAT_INT]: '浮點數整數',
	[FieldValueType.FLOAT]: '浮點數',
	[FieldValueType.STRING]: '字串',
};
//#endregion

//#region FieldType 欄位類型
/** 欄位類型 */
export enum FieldType {
	/**
	 * 主鍵欄位
	 * 1. allowNull 必須為 false 或 null，除非有設定自動編碼
	 * 1. readWrite 必須為 INSERT
	 * 1. 只能用在表頭欄位
	 */
	KEY = 'KEY',
	/** 資料欄位 */
	DATA = 'DATA',
	/** 參考欄位 */
	REF_KEY = 'REF_KEY',
	/**
	 * 參考資料欄位
	 * 1. 開發者無法使用此類型
	 * 2. 產生給前端讀取的表格定義才會用到
	 */
	REF_DATA = 'REF_DATA',
	/**
	 * 推導欄位
	 * 1. 資料庫裡面並沒有這個欄位
	 * 1. 根據程式計算欄位值
	 * 1. 讀寫只能是 READ
	 */
	DERIVE = 'DERIVE',
	/** 函數欄位 */
	FUNCTION = 'FUNCTION',
}
/** FieldType 的 displayName 對照 */
export const FieldTypeDisplayName: Record<FieldType, string> = {
	[FieldType.KEY]: '主鍵欄位',
	[FieldType.DATA]: '資料欄位',
	[FieldType.REF_KEY]: '參考欄位',
	[FieldType.REF_DATA]: '參考資料欄位',
	[FieldType.DERIVE]: '推導欄位',
	[FieldType.FUNCTION]: '函數欄位',
};
//#endregion

//#region TableType 表格類型
/** 表格類型 */
export enum TableType {
	/** 系統表格 */
	SYSTEM = 'SYSTEM',
	/** 資料表格 */
	DATA = 'DATA',
	/** 異動表格 */
	UPDATE = 'UPDATE',
}
/** TableType 的 displayName 對照 */
export const TableTypeDisplayName: Record<TableType, string> = {
	[TableType.DATA]: '資料',
	[TableType.UPDATE]: '異動',
	[TableType.SYSTEM]: '系統',
};
//#endregion
//#region 表格儲存類型
/** 表格儲存類型 */
export enum TableStorageType {
	/** 實體儲存 */
	PHYSICAL = 'PHYSICAL',
	/** 虛擬儲存 */
	VIRTUAL = 'VIRTUAL',
}
/** 表格儲存類型的 displayName 對照 */
export const TableStorageTypeDisplayName: Record<TableStorageType, string> = {
	[TableStorageType.PHYSICAL]: '實體表格',
	[TableStorageType.VIRTUAL]: '虛擬表格',
};
//#endregion
//#region DBSource 資料庫來源
/** 資料庫來源 */
export enum DBSource {
	/** DocumentDB */
	DOCUMENTDB = 'DOCUMENTDB',
	/** Athena */
	ATHENA = 'ATHENA',
}
/** DBSource 的 displayName 對照 */
export const DBSourceDisplayName: Record<DBSource, string> = {
	[DBSource.DOCUMENTDB]: 'DocumentDB',
	[DBSource.ATHENA]: 'Athena',
};
//#endregion
//#region IdType 表格類型
export enum IdType {
	/** 遞增 ID */
	AUTO = 'AUTO',
	/** 時間戳 ID */
	TIMESTAMP = 'TIMESTAMP',
	/** 系統內建 ID */
	NATIVE = 'NATIVE',
	/** 未知 */
	UNKNOWN = 'UNKNOWN',
}

/** IdType 的 displayName 對照 */
export const IdTypeDisplayName: Record<IdType, string> = {
	[IdType.AUTO]: '遞增 ID',
	[IdType.TIMESTAMP]: '時間戳 ID',
	[IdType.NATIVE]: '系統內建 ID',
	[IdType.UNKNOWN]: '未知的 ID',
};
//#endregion

//#region NoWhiteSpace 空白字元檢查
/** 空白字元檢查 */
export enum NoWhiteSpace {
	/** 不允許任何空白字元 */
	ALL = 'ALL',
	/** 允許字串中單一空格字元 */
	ALLOW_INNER_SINGLE_SPACE = 'ALLOW_INNER_SINGLE_SPACE',
	/** 除了空格都禁用 */
	EXCEPT_SPACE = 'EXCEPT_SPACE',
	/** 不允許字串前後有空白字元與換行符號，且字串中間不能有連續兩個空白字元 */
	NO_LEADING_SPACE_AND_TRAILING_SPACE = 'NO_LEADING_SPACE_AND_TRAILING_SPACE',
}
/** NoWhiteSpace 的 displayName 對照 */
export const NoWhiteSpaceDisplayName: Record<NoWhiteSpace, string> = {
	[NoWhiteSpace.ALL]: '不允許任何空白字元',
	[NoWhiteSpace.ALLOW_INNER_SINGLE_SPACE]: '允許字串中單一空格字元',
	[NoWhiteSpace.EXCEPT_SPACE]: '允許空格字元',
	[NoWhiteSpace.NO_LEADING_SPACE_AND_TRAILING_SPACE]: '不允許字串前後有空白字元與換行符號，且字串中間不能有連續兩個空白字元',
};
//#endregion

//#region CharWidth 字元寬度檢查
/** 字元寬度檢查 */
export enum CharWidth {
	/** 全為半形英數空白與符號 */
	ALL_HALF_WIDTH = 'ALL_HALF_WIDTH',
	/** 全為全形英數空白與符號 */
	ALL_FULL_WIDTH = 'ALL_FULL_WIDTH',
	/** 禁止半形英數空白與符號 */
	NO_HALF_WIDTH = 'NO_HALF_WIDTH',
	/** 禁止全形英數空白與符號 */
	NO_FULL_WIDTH = 'NO_FULL_WIDTH',
}
/** NoWhiteSpace 的 displayName 對照 */
export const CharWidthDisplayName: Record<CharWidth, string> = {
	[CharWidth.ALL_HALF_WIDTH]: '全為半形英數空白與符號',
	[CharWidth.ALL_FULL_WIDTH]: '全為全形英數空白與符號',
	[CharWidth.NO_HALF_WIDTH]: '禁止半形英數空白與符號',
	[CharWidth.NO_FULL_WIDTH]: '禁止全形英數空白與符號',
};
//#endregion

//#region LineReadWrite 表身讀寫
/**
 * 表身讀寫
 * @description
 * 1. 控制整個表身的行為
 * 2. 除了 READ 都可以更新表身列，但欄位可否更新還是看欄位讀寫
 * @note 欄位可否更新按照欄位讀寫
 */
export enum LineReadWrite {
	/** 僅供讀取 */
	READ = 'READ',
	/**
	 * 完全
	 * @note 欄位可否更新按照欄位讀寫
	 */
	FULL = 'FULL',
	/**
	 * 更新
	 * @can 建立、更新
	 * @cant 移除、新增
	 * @note 欄位可否更新按照欄位讀寫
	 */
	UPDATE = 'UPDATE',
	/**
	 * 新增
	 * @can 建立、新增、更新
	 * @cant 移除
	 * @note 欄位可否更新按照欄位讀寫
	 */
	PUSH = 'PUSH',
	/**
	 * 移除
	 * @can 建立、移除、更新
	 * @cant 新增
	 * @note 欄位可否更新按照欄位讀寫
	 */
	PULL = 'PULL',
	/**
	 * 建立
	 * @can 建立
	 * @cant 移除、新增、更新
	 * @note 欄位可否更新按照欄位讀寫
	 */
	INSERT = 'INSERT',
}
/** LineReadWrite 的 displayName 對照 */
export const LineReadWriteDisplayName: Record<LineReadWrite, string> = {
	[LineReadWrite.READ]: '讀取',
	[LineReadWrite.FULL]: '完全',
	[LineReadWrite.UPDATE]: '更新',
	[LineReadWrite.PULL]: '移除',
	[LineReadWrite.PUSH]: '新增',
	[LineReadWrite.INSERT]: '建立',
};
//#endregion

//#region TimeGranularity 時間顆粒度
/** 時間顆粒度 */
export enum TimeGranularity {
	/** 秒 */
	SECOND = 'SECOND',
	/** 毫秒 */
	MILLISECOND = 'MILLISECOND',
	/** 分鐘 */
	MINUTE = 'MINUTE',
	/** 小時 */
	HOUR = 'HOUR',
	/** 日期 */
	DAY = 'DAY',
}
/** TimeGranularity 的 displayName 對照 */
export const TimeGranularityDisplayName: Record<TimeGranularity, string> = {
	[TimeGranularity.SECOND]: '秒',
	[TimeGranularity.MILLISECOND]: '毫秒',
	[TimeGranularity.MINUTE]: '分鐘',
	[TimeGranularity.HOUR]: '小時',
	[TimeGranularity.DAY]: '日',
};
//#endregion

//#region NamingConvention 命名慣例
/** 命名慣例 */
export enum NamingConvention {
	/** SCREAMING_SNAKE_CASE */
	SCREAMING_SNAKE_CASE = 'SCREAMING_SNAKE_CASE',
	/** camelCase */
	CAMEL_CASE = 'CAMEL_CASE',
	/** PascalCase */
	PASCAL_CASE = 'PASCAL_CASE',
	/** snake_case */
	SNAKE_CASE = 'SNAKE_CASE',
}
/** NamingConvention 的 displayName 對照 */
export const NamingConventionDisplayName: Record<NamingConvention, string> = {
	[NamingConvention.SCREAMING_SNAKE_CASE]: 'SCREAMING_SNAKE_CASE',
	[NamingConvention.CAMEL_CASE]: 'camelCase',
	[NamingConvention.PASCAL_CASE]: 'PascalCase',
	[NamingConvention.SNAKE_CASE]: 'snake_case',
};
//#endregion

//#region ApprovalOperation 簽核動作
/** 簽核動作 */
export enum ApprovalOperation {
	/** 新增 */
	insert = 'insert',
}
/** ApprovalOperation 的 displayName 對照 */
export const ApprovalOperationDisplayName: Record<ApprovalOperation, string> = {
	[ApprovalOperation.insert]: '新增',
};
//#endregion

//#region PermissionEffect 權限效果
/** 權限效果 */
export enum PermissionEffect {
	/** 同意 */
	ALLOW = 'ALLOW',
	/** 拒絕 */
	DENY = 'DENY',
	/** 透過預設值允許 */
	ALLOW_BY_DEFAULT = 'ALLOW_BY_DEFAULT',
}
/** PermissionEffect 的 displayName 對照 */
export const PermissionEffectDisplayName: Record<PermissionEffect, string> = {
	[PermissionEffect.ALLOW]: '允許',
	[PermissionEffect.DENY]: '拒絕',
	[PermissionEffect.ALLOW_BY_DEFAULT]: '透過預設值允許',
};
//#endregion

//#region HookType 掛勾類型
/** 掛勾類型 */
export enum HookType {
	/**
	 * 映射掛勾
	 * @deprecated
	 * @description 每次新增或更新的時候都會呼叫
	 */
	MAPPING = 'MAPPING',
	/**
	 * 建立前掛勾
	 * @description 只有在第一次新增的時候會呼叫
	 * @scriptInput 整筆紀錄
	 * @scriptOutput 整筆紀錄代表成功；`string` 代表錯誤訊息
	 */
	BEFORE_INSERT = 'BEFORE_INSERT',
	/**
	 * 建立後掛勾
	 * @deprecated 請改用 POLICY
	 * @description 只有在第一次新增的時候會呼叫
	 * @scriptInput 整筆紀錄
	 * @scriptOutput `空值` 代表成功；`string` 代表錯誤訊息
	 */
	AFTER_INSERT = 'AFTER_INSERT',
	/**
	 * 更新前掛勾
	 * @description 在更新的時候會呼叫
	 * @scriptInput 正規化更新紀錄，及更新前的紀錄
	 * @scriptOutput 整筆紀錄代表成功；`string` 代表錯誤訊息
	 */
	BEFORE_UPDATE = 'BEFORE_UPDATE',
	/** 新版簽核用掛勾 */
	APPROVAL = 'APPROVAL',
	/**
	 * 批次建立前掛勾
	 * @description 只有在第一次新增的時候會呼叫。不可同時與 `BEFORE_INSERT` 使用
	 * @scriptInput 多筆紀錄
	 * @scriptOutput 多筆紀錄代表成功；`string` 代表錯誤訊息
	 */
	BATCH_BEFORE_INSERT = 'BATCH_BEFORE_INSERT',
	/**
	 * 批次簽核前掛勾
	 * @scriptInput 多筆紀錄
	 * @scriptOutput 多筆紀錄代表成功；`string` 代表錯誤訊息
	 */
	BATCH_BEFORE_APPROVAL = 'BATCH_BEFORE_APPROVAL',
	/**
	 * 批次更新前掛勾
	 * @description 不可同時與 `BEFORE_UPDATE` 使用
	 * @scriptInput 多筆紀錄
	 * @scriptOutput 多筆紀錄代表成功；`string` 代表錯誤訊息
	 */
	BATCH_BEFORE_UPDATE = 'BATCH_BEFORE_UPDATE',
	/**
	 * 批次政策掛勾
	 * @description 不可同時與 policies 使用
	 */
	BATCH_POLICY = 'BATCH_POLICY',
	/**
	 * 批次建立後掛勾
	 * @description 只有在第一次新增的時候會呼叫。不可同時與 `AFTER_INSERT` 使用
	 * @scriptInput 多筆紀錄
	 * @scriptOutput 多筆紀錄代表成功；`string` 代表錯誤訊息
	 */
	BATCH_AFTER_INSERT = 'BATCH_AFTER_INSERT',
}
/** 掛勾類型顯示名稱 */
export const HookTypeDisplayName: Record<HookType, string> = {
	[HookType.MAPPING]: '轉換',
	[HookType.BEFORE_INSERT]: '建立前',
	[HookType.BATCH_BEFORE_INSERT]: '批次建立前',
	[HookType.AFTER_INSERT]: '建立後',
	[HookType.BEFORE_UPDATE]: '更新前',
	[HookType.APPROVAL]: '簽核',
	[HookType.BATCH_BEFORE_APPROVAL]: '批次簽核前',
	[HookType.BATCH_BEFORE_UPDATE]: '批次更新前',
	[HookType.BATCH_POLICY]: '批次政策',
	[HookType.BATCH_AFTER_INSERT]: '批次建立後',
};
//#endregion

//#region FunctionType 函數類型
/** 函數類型 */
export enum FunctionType {
	/** 一般函數 */
	NORMAL = 'NORMAL',
	/**
	 * 前端中台專用的類型，產生 URL 的函數 (前端用) \
	 * 觸發時機：中台清單頁與資料頁執行函數後 \
	 * 用途：中台根據回傳值對指定 URL 進行 POST 請求
	 */
	URL = 'URL',
	/**
	 * 前端中台專用的類型 \
	 * 觸發時機：中台清單頁與資料頁執行函數後 \
	 * 用途：中台根據回傳值直接開啟新分頁瀏覽指定表格紀錄
	 */
	PAGE = 'PAGE',
	/**
	 * 前端中台專用的類型 \
	 * 觸發時機：中台資料頁執行完 mutation 的動作後 \
	 * 用途：中台資料頁資料變更後，顯示訊息於畫面上
	 */
	AFTER_MUTATION = 'AFTER_MUTATION',
}
/** 函數類型顯示名稱 */
export const FunctionTypeDisplayName: Record<FunctionType, string> = {
	[FunctionType.NORMAL]: '一般函數',
	[FunctionType.URL]: 'URL函數',
	[FunctionType.PAGE]: '分頁函數',
	[FunctionType.AFTER_MUTATION]: '變更後執行函數',
};
//#endregion

//#region 排程速率 CronRate
/** 排程速率
 * @description 一次性排程請手動設定 ONE_TIME_CRON
 */
export enum CronRate {
	/** 每日。支援定時執行, 透過設置 atUtcTime */
	DAILY = 'DAILY',
	/** 每小時 */
	HOURLY = 'HOURLY',
	/** 每半小時 */
	HALF_HOURLY = 'HALF_HOURLY',
	/** 每十五分鐘 */
	FIFTEEN_MINS = 'FIFTEEN_MINS',
	/** 每十分鐘 */
	TEN_MINS = 'TEN_MINS',
	/** 每五分鐘 */
	FIVE_MINS = 'FIVE_MINS',
	/** 每一分鐘 */
	ONE_MIN = 'ONE_MIN',
}
/** 排程速率顯示名稱 */
export const CronRateDisplayName: Record<CronRate, string> = {
	[CronRate.DAILY]: '每日',
	[CronRate.HOURLY]: '每小時',
	[CronRate.HALF_HOURLY]: '每半小時',
	[CronRate.FIFTEEN_MINS]: '每十五分鐘',
	[CronRate.TEN_MINS]: '每十分鐘',
	[CronRate.FIVE_MINS]: '每五分鐘',
	[CronRate.ONE_MIN]: '每一分鐘',
};
//#endregion

//#region 任務狀態 JobStatus
/** 任務狀態 */
export enum JobStatus {
	NEW = 'NEW',
	RUNNING = 'RUNNING',
	DONE = 'DONE',
}
/** 任務狀態顯示名稱 */
export const JobStatusDisplayName: Record<JobStatus, string> = {
	[JobStatus.NEW]: '新建立',
	[JobStatus.RUNNING]: '執行中',
	[JobStatus.DONE]: '已完成',
};
//#endregion
//#region 異動表用列舉
/** 表身動作 */
export enum LineAction {
	/** 新增表身列 */
	PUSH = 'PUSH',
	/** 移除表身列 */
	PULL = 'PULL',
	/** 更新表身列 */
	SET = 'SET',
}
/** LineAction 的 displayName 對照 */
export const LineActionDisplayName: Record<LineAction, string> = {
	[LineAction.PUSH]: '新增表身列',
	[LineAction.PULL]: '移除表身列',
	[LineAction.SET]: '更新表身列',
};
/** 更新狀態 */
export enum ApprovalUpdateStatus {
	/** 等待中 */
	WAITING = 'WAITING',
	/** 更新成功 */
	SUCCESS = 'SUCCESS',
	/** 更新失敗 */
	ERROR = 'ERROR',
}
/** ApprovalUpdateStatus 的 displayName 對照 */
export const ApprovalUpdateStatusDisplayName: Record<ApprovalUpdateStatus, string> = {
	[ApprovalUpdateStatus.WAITING]: '等待中',
	[ApprovalUpdateStatus.SUCCESS]: '更新成功',
	[ApprovalUpdateStatus.ERROR]: '更新失敗',
};
//#endregion

//#region 信件表
/** 信件寄送狀態 */
export enum EmailSendingStatus {
	/** 等待寄信中 */
	WAITING = 'WAITING',
	/** 寄信成功 */
	SUCCESS = 'SUCCESS',
	/** 寄信失敗 */
	ERROR = 'ERROR',
}
/** EmailSendingStatus 的 displayName 對照 */
export const EmailSendingStatusDisplayName: Record<EmailSendingStatus, string> = {
	[EmailSendingStatus.WAITING]: '等待寄信中',
	[EmailSendingStatus.SUCCESS]: '寄信成功',
	[EmailSendingStatus.ERROR]: '寄信失敗',
};
//#endregion

//#region 表格選擇器
/** 表格選擇器類型 */
export enum TableSelector {
	/** 欄位將顯示/輸入表格名稱 */
	TABLE_NAME = 'TABLE_NAME',
	/** 欄位將顯示/輸入表頭欄位 */
	BODY_FIELD = 'BODY_FIELD',
	/** 欄位將顯示/輸入表身 */
	LINE = 'LINE',
	/** 欄位將顯示/輸入表身欄位 */
	LINE_FIELD = 'LINE_FIELD',
	/** 欄位將顯示/輸入函式名稱 */
	FUNCTION_NAME = 'FUNCTION_NAME',
}
/** 表格選擇器的 displayName 對照 */
export const TableSelectorDisplayName: Record<TableSelector, string> = {
	[TableSelector.TABLE_NAME]: '填入表格名稱',
	[TableSelector.BODY_FIELD]: '填入表頭欄位',
	[TableSelector.LINE]: '填入表身',
	[TableSelector.LINE_FIELD]: '填入表身欄位',
	[TableSelector.FUNCTION_NAME]: '填入函式名稱',
};
//#endregion

//#region 簽核模式
/** 簽核模式 */
export enum ApprovalMode {
	/** 一般簽核模式 (允許批次簽核；簽核意見選填) */
	NORMAL = 'NORMAL',
	/** 嚴格簽核模式 (禁止批次簽核；簽核意見必填) */
	STRICT = 'STRICT',
}
/** 簽核模式顯示名稱 */
export const ApprovalModeDisplayName: Record<ApprovalMode, string> = {
	[ApprovalMode.NORMAL]: '一般簽核模式',
	[ApprovalMode.STRICT]: '嚴格簽核模式',
};
//#endregion
//#region 待辦工作-執行狀態
/** 待辦工作-執行狀態 */
export enum TodoJobStatus {
	/** 閒置 */
	IDLE = 'IDLE',
	/** 執行中 */
	WORKING = 'WORKING',
	/** 已取消 */
	CANCELLED = 'CANCELLED',
	/** 錯誤 */
	ERROR = 'ERROR',
	/** 完成 */
	DONE = 'DONE',
	/** 暫停 */
	PENDING = 'PENDING',
}
/** 待辦工作-執行狀態顯示名稱 */
export const TodoJobStatusDisplayName: Record<TodoJobStatus, string> = {
	[TodoJobStatus.IDLE]: '閒置',
	[TodoJobStatus.WORKING]: '執行中',
	[TodoJobStatus.CANCELLED]: '已取消',
	[TodoJobStatus.PENDING]: '暫停',
	[TodoJobStatus.ERROR]: '錯誤',
	[TodoJobStatus.DONE]: '已完成',
};

/** 排程執行結果 */
export enum CronRunResult {
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
}

export const CronRunResultDisplayName: Record<CronRunResult, string> = {
	[CronRunResult.SUCCESS]: '成功',
	[CronRunResult.FAILED]: '失敗',
};

/** 排程類型 */
export enum CronType {
	ONE_TIME_CRON = 'ONE_TIME_CRON',
	RECURRING_CRON = 'RECURRING_CRON',
}

export const CronTypeDisplayName: Record<CronType, string> = {
	[CronType.ONE_TIME_CRON]: '一次性排程',
	[CronType.RECURRING_CRON]: '週期性排程',
};

/** 週期性排程 by rate
 * 分：數值只可為 60 的因數，且受限於現行機制，最小值為 5 */
export enum RecurringCronAtMinutes {
	FIVE_MINS = 'FIVE_MINS',
	SIX_MINS = 'SIX_MINS',
	TEN_MINS = 'TEN_MINS',
	TWELVE_MINS = 'TWELVE_MINS',
	FIVTEEN_MINS = 'FIVTEEN_MINS',
	TWENTY_MINS = 'TWENTY_MINS',
	THIRTY_MINS = 'THIRTY_MINS',
}

export const RecurringCronAtMinutesDisplayName: Record<RecurringCronAtMinutes, string> = {
	[RecurringCronAtMinutes.FIVE_MINS]: '5',
	[RecurringCronAtMinutes.SIX_MINS]: '6',
	[RecurringCronAtMinutes.TEN_MINS]: '10',
	[RecurringCronAtMinutes.TWELVE_MINS]: '12',
	[RecurringCronAtMinutes.FIVTEEN_MINS]: '15',
	[RecurringCronAtMinutes.TWENTY_MINS]: '20',
	[RecurringCronAtMinutes.THIRTY_MINS]: '30',
};

/** 週期性排程 by rate
 * 時：數值只可為 24 的因數 */
export enum RecurringCronAtHours {
	ONE_HOUR = 'ONE_HOUR',
	TWO_HOURS = 'TWO_HOURS',
	THREE_HOURS = 'THREE_HOURS',
	FOUR_HOURS = 'FOUR_HOURS',
	SIX_HOURS = 'SIX_HOURS',
	EIGHT_HOURS = 'EIGHT_HOURS',
	TWELVE_HOURS = 'TWELVE_HOURS',
}

export const RecurringCronAtHoursDisplayName: Record<RecurringCronAtHours, string> = {
	[RecurringCronAtHours.ONE_HOUR]: '1',
	[RecurringCronAtHours.TWO_HOURS]: '2',
	[RecurringCronAtHours.THREE_HOURS]: '3',
	[RecurringCronAtHours.FOUR_HOURS]: '4',
	[RecurringCronAtHours.SIX_HOURS]: '6',
	[RecurringCronAtHours.EIGHT_HOURS]: '8',
	[RecurringCronAtHours.TWELVE_HOURS]: '12',
};

/** 週期性排程 by rate 單位 */
export enum RecurringCronUnit {
	MINUTES = 'MINUTES',
	HOURS = 'HOURS',
	DAYS = 'DAYS',
}

export const RecurringCronUnitDisplayName: Record<RecurringCronUnit, string> = {
	[RecurringCronUnit.MINUTES]: '分',
	[RecurringCronUnit.HOURS]: '時',
	[RecurringCronUnit.DAYS]: '日',
};

/** 週期性排程 by rate 單位 */
export enum CronExecuteSetting {
	ENABLE = 'ENABLE',
	DISABLE = 'DISABLE',
}

export const CronExecuteSettingDisplayName: Record<CronExecuteSetting, string> = {
	[CronExecuteSetting.ENABLE]: '開啟',
	[CronExecuteSetting.DISABLE]: '關閉',
};
//#endregion

//#region 系統表格名稱
export const SYSTEM_TABLE_NAME = Object.freeze({
	/** 表格 */
	TABLE: '__table__',
	/** 使用者 */
	USER: '__user__',
	/** 操作紀錄(舊) */
	LOG: '__log__',
	/** 操作紀錄 */
	LOG2: '__log2__',
	/** 檔案 */
	FILE2: '__file2__',
	/** 檔案分類表 */
	FILE_CATEGORY: '__filecategory__',
	/** 角色 */
	ROLE: '__role__',
	/** 簽核 */
	APPROVAL2: '__approval2__',
	/** 簽核鏈檔 */
	APPROVAL_CHAIN: '__approvalchain__',
	/** 待辦工作 */
	TODO_JOB: '__todojob__',
	/** 工作歷程 */
	JOB_LOG: '__joblog__',
	/** 令牌 */
	TOKEN: '__token__',
	/** 信件 */
	EMAIL: '__email__',
	/** 刪表註冊 */
	DROP_REGISTER: '__dropregister__',
	/** 排程總覽 */
	CRON_VIEW: '__cronview__',
	/** 排程歷程 */
	CRON_LOG: '__cronlog__',
	/** 系統變數 */
	SYS_VAR: '__sysvar__',
	/** 事件歷程 */
	EVENT_LOG: '__eventlog__',
	/** 事件歷程-信件服務 */
	EMAIL_LOG: '__emaillog__',
	/** 事件歷程-DLQ */
	DLQ_LOG: '__dlqlog__',
	/** 事件歷程-簽核服務 */
	APPROVAL_LOG: '__approvallog__',
	/** 事件歷程-資料庫服務 */
	DOCDB_LOG: '__docdblog__',
	/** 事件歷程-登入 */
	AUTH_LOG: '__authlog__',
	/** 表格統計報告 */
	TABLE_STATS: '__tablestats__',
	/** 指令碼檔 */
	SCRIPT: '__script__',
	/** 裝置 */
	DEVICE: '__device__',
	/** 裝置令牌 */
	DEVICE_TOKEN: '__devicetoken__',
});
export type SYSTEM_TABLE_NAME = { [K in keyof typeof SYSTEM_TABLE_NAME]: (typeof SYSTEM_TABLE_NAME)[K] };
//#endregion

//#region 角色限制運算子
export enum RoleConstraintOperator {
	/** IN */
	IN = 'IN',
	/** GTE */
	GTE = 'GTE',
	/** LTE */
	LTE = 'LTE',
	/**GT */
	GT = 'GT',
	/** LT */
	LT = 'LT',
}
//#endregion

//#region 表身資料嵌入類型
export enum LineType {
	/** 嵌入（預設），直接依附在主資料的表身 */
	EMBEDDED = 'EMBEDDED',
	/** 外部，由其他表格引入以表身的形式呈現，不實際存在主資料 */
	EXTERNAL = 'EXTERNAL',
}
export const LineTypeDisplayName: Record<LineType, string> = {
	[LineType.EMBEDDED]: '嵌入',
	[LineType.EXTERNAL]: '外部',
};
//#endregion

//#region AFTER_MUTATION 觸發類型
export enum AfterMutationTriggerTypeEnum {
	/** 新增後觸發 */
	AFTER_INSERT = 'INSERT',
	/** 更新後觸發 */
	AFTER_UPDATE = 'UPDATE',
	/** 封存後觸發 */
	AFTER_ARCHIVE = 'ARCHIVE',
}
export const AfterMutationTriggerTypeDisplayName: Record<AfterMutationTriggerTypeEnum, string> = {
	[AfterMutationTriggerTypeEnum.AFTER_INSERT]: '新增後觸發',
	[AfterMutationTriggerTypeEnum.AFTER_UPDATE]: '更新後觸發',
	[AfterMutationTriggerTypeEnum.AFTER_ARCHIVE]: '封存後觸發',
};
//#endregion
//#region AFTER_MUTATION 回傳類型
export enum AfterMutationReturnTypeEnum {
	/** 結束，不需要做任何處理 */
	DONE = 'DONE',
	/** 顯示 BPAlert 訊息 */
	ALERT = 'ALERT',
	/** 使用 CALL 的方式執行下一個函式 */
	CALL = 'CALL',
	/** 使用 EXECUTE 的方式執行下一個函式 */
	EXECUTE = 'EXECUTE',
}
export const AfterMutationReturnTypeDisplayName: Record<AfterMutationReturnTypeEnum, string> = {
	[AfterMutationReturnTypeEnum.DONE]: '結束',
	[AfterMutationReturnTypeEnum.ALERT]: '顯示 Alert 訊息',
	[AfterMutationReturnTypeEnum.CALL]: 'CALL 目標函式',
	[AfterMutationReturnTypeEnum.EXECUTE]: 'EXECUTE 目標函式',
};
//#endregion
//#region alert 的狀態
export enum AlertStatus {
	/** 成功 */
	SUCCESS = 'SUCCESS',
	/** 失敗 */
	ERROR = 'ERROR',
}
export const AlertStatusDisplayName: Record<AlertStatus, string> = {
	[AlertStatus.SUCCESS]: '成功',
	[AlertStatus.ERROR]: '失敗',
};
//#endregion

//#region ScriptType 指令碼檔類型
export enum ScriptType {
	/** 排程 */
	CRON = 'CRON',
	/** 函數 */
	FUNCTION = 'FUNCTION',
	/** 簽核 */
	APPROVAL = 'APPROVAL',
	/** 政策 */
	POLICY = 'POLICY',
	/** 批次政策 */
	BATCH_POLICY = 'BATCH_POLICY',
	/** 共用函式 */
	LIB = 'LIB',
	/** 新增前掛勾 */
	BEFORE_INSERT = 'BEFORE_INSERT',
	/** 批次新增前掛勾 */
	BATCH_BEFORE_INSERT = 'BATCH_BEFORE_INSERT',
	/** 新增後掛勾 */
	AFTER_INSERT = 'AFTER_INSERT',
	/** 批次新增後掛勾 */
	BATCH_AFTER_INSERT = 'BATCH_AFTER_INSERT',
	/** 更新前掛勾 */
	BEFORE_UPDATE = 'BEFORE_UPDATE',
	/** 批次更新前掛勾 */
	BATCH_BEFORE_UPDATE = 'BATCH_BEFORE_UPDATE',
	/** 簽核單掛勾 */
	APPROVAL_SHEET = 'APPROVAL_SHEET',
	/** 批次簽核前掛勾 */
	BATCH_BEFORE_APPROVAL = 'BATCH_BEFORE_APPROVAL',
}

export const ScriptTypeDisplayName: Record<ScriptType, string> = {
	[ScriptType.CRON]: '排程',
	[ScriptType.FUNCTION]: '函數',
	[ScriptType.APPROVAL]: '簽核',
	[ScriptType.POLICY]: '政策',
	[ScriptType.BATCH_POLICY]: '批次政策',
	[ScriptType.LIB]: '共用函式',
	[ScriptType.BEFORE_INSERT]: '新增前掛勾',
	[ScriptType.BATCH_BEFORE_INSERT]: '批次新增前掛勾',
	[ScriptType.AFTER_INSERT]: '新增後掛勾',
	[ScriptType.BATCH_AFTER_INSERT]: '批次新增後掛勾',
	[ScriptType.BEFORE_UPDATE]: '更新前掛勾',
	[ScriptType.BATCH_BEFORE_UPDATE]: '批次更新前掛勾',
	[ScriptType.APPROVAL_SHEET]: '簽核單掛勾',
	[ScriptType.BATCH_BEFORE_APPROVAL]: '批次簽核前掛勾',
};
//#endregion
