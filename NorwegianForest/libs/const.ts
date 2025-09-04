import type { SYSTEM_TABLE_NAME } from './enum';

/** 表格名稱正規表示式 */
export const TABLE_NAME_REGEXP = /^[a-z0-9_]{2,100}$/;

/** 欄位名稱正規表示式 */
export const FIELD_NAME_REGEXP = /^[a-zA-Z][a-zA-Z0-9]{0,39}$/;

/** 自動編碼集合名稱 */
export const AUTOKEY_COLLECTION_NAME = '__autokey__';

/**  系統表格名稱 */
export const SYSTEM_TABLE_DISPLAYNAME: Record<keyof typeof SYSTEM_TABLE_NAME, string> = {
	TABLE: '表格',
	FILE2: '檔案',
	FILE_CATEGORY: '檔案分類',
	USER: '使用者',
	LOG: '操作紀錄(舊)',
	LOG2: '操作紀錄',
	ROLE: '角色',
	APPROVAL2: '簽核',
	APPROVAL_CHAIN: '簽核鏈檔',
	TODO_JOB: '待辦工作',
	JOB_LOG: '工作歷程',
	TOKEN: '令牌',
	EMAIL: '郵件',
	DROP_REGISTER: '刪表註冊',
	CRON_VIEW: '排程總覽',
	CRON_LOG: '排程歷程',
	SYS_VAR: '系統變數',
	EVENT_LOG: '事件歷程',
	EMAIL_LOG: '事件歷程-信件服務',
	DLQ_LOG: '事件歷程-DLQ',
	APPROVAL_LOG: '事件歷程-簽核服務',
	DOCDB_LOG: '事件歷程-資料庫服務',
	AUTH_LOG: '事件歷程-登入',
	TABLE_STATS: '表格統計報告',
	SCRIPT: '指令碼檔',
	DEVICE: '裝置',
	DEVICE_TOKEN: '裝置令牌',
};

/** 欄位名稱保留字 */
export const FIELD_NAME_RESERVE_WORDS = [
	'_id' as const,
	'_createdAt' as const,
	'_updatedAt' as const,
	'_archivedAt' as const,
	'_createdBy' as const,
	'_updatedBy' as const,
	'_archivedBy' as const,
	'_approvalStage' as const,
	'_approvalStatus' as const,
	'_approvalRule' as const,
	'_approvalRole' as const,
	'_approvalUser' as const,
	'_approvalAction' as const,
	'_approvalMessage' as const,
	'_approvalActedAt' as const,
	'_approvalName' as const,
];

/** 外部表身的搜尋參數特定字串 */
export const EXTERNAL_LINES_SEARCH_STRING = {
	/** 過去 24 小時 */
	LAST_24_HOUR: '$$last24hour',
	/** 過去 7 天 */
	LAST_7_DAYS: '$$last7days',
	/** 過去 30 天 */
	LAST_30_DAYS: '$$last30days',
	/** 本月開始 */
	THIS_MONTH_START: '$$startofmonth',
	/** 上個月開始 */
	LAST_MONTH_START: '$$startoflastmonth',
	/** 上個月結束 */
	LAST_MONTH_END: '$$endoflastmonth',
} as const;
/** 外部表身的搜尋參數特定字串數值型別 */
export type ExternalLinesSearchValue = (typeof EXTERNAL_LINES_SEARCH_STRING)[keyof typeof EXTERNAL_LINES_SEARCH_STRING];
