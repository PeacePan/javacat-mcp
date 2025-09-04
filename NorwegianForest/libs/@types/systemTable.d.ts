import {
	ApprovalAction,
	ApprovalStatus,
	ApprovalUpdateStatus,
	CronExecuteSetting,
	CronRate,
	CronRunResult,
	CronType,
	EmailSendingStatus,
	JobStatus,
	PermissionEffect,
	RecurringCronUnit,
	RoleConstraintOperator,
	TodoJobStatus,
} from '../enum';
import { EnumLiteral, SafeRecord, SafeRecord2, UnsafeRecord } from './';
import { TableName } from './table';

//#region 郵件
/** 郵件表頭 */
export type EmailBody = {
	/** 寄信編號 (主鍵，自動編碼) */
	name?: string;
	/** 來源 */
	source: string;
	/** 信件主旨 */
	subject: string;
	/** 信件內容(純文字), text 與 html 二選一 */
	text?: string;
	/** 信件內容(html), text 與 html 二選一 */
	html?: string;
	/** 備註，存放一些額外的內容 */
	memo?: string;
	/** 寄信狀態 */
	status?: EmailSendingStatus;
	/** 寄信時間 */
	sendAt?: Date;
	/** 寄信結果 */
	sendResult?: string;
};
export type EmailLines = {
	/** 目的地址 */
	to: {
		/** 地址 */
		name: string;
	};
	/** 附件檔路徑 */
	attachments: {
		/** S3 的 key {partition}/{folder}/{name} */
		name: string;
		/** 檔案名稱 */
		fileName: string;
		/** 內容類型 */
		contentType: string;
	};
};

/** 郵件紀錄 */
export type EmailRecord = SafeRecord2<EmailBody, EmailLines>;
//#endregion

//#region 使用者
/** 使用者表頭 */
export type UserBody = {
	/** 使用者編號 (主鍵/員工就用員編) */
	name: string;
	/** 使用者名稱 */
	displayName: string;
	/** 使用者層級 */
	level: string;
	/** 信箱 */
	email?: string;
	/** 手機號碼 */
	mobile?: string;
	/** TOTP 金鑰 */
	totpSecret?: string;
	/** 一次性登入密碼 */
	otp?: string;
	/** 一次性登入密碼發行時間 */
	otpIssuedAt?: Date;
	/** 備註 */
	memo?: string;
	/** 是否禁用 */
	disabled?: boolean;
	/** 上次登入時間 */
	lastLoginAt?: Date;
	/** 上次登入效期(秒)*/
	lastLoginDuration?: number;
};

/** 使用者紀錄 */
export type UserRecord = SafeRecord2<UserBody>;
//#endregion

//#region 令牌
/** 令牌表頭 */
export type TokenBody = {
	/** 令牌編號 */
	name: string;
	/**
	 * 存取金鑰編號
	 * 1. 系統產生
	 * 1. 名碼
	 * 1. as username
	 */
	accessKeyId?: string;
	/**
	 * 存取金鑰密碼
	 * 1. 系統產生
	 * 1. salted hash
	 * 1. as password
	 */
	secretAccessKey?: string;
	/** 備註 */
	memo?: string;
};

/** 令牌表身 */
export type TokenLines = {
	/** 限制來源 */
	source?: {
		/** 地址 */
		address: string;
		/** 備註 */
		memo?: string;
	};
};

/** 令牌紀錄 */
export type TokenRecord = SafeRecord2<TokenBody, TokenLines>;
//#endregion

//#region 角色
/** 角色表頭。使用者層級跟員工只能擇一輸入 */
export type RoleBody = {
	/** 角色名稱 */
	name: string;
	/**
	 * 使用者層級
	 * 1. 角色的權限套用到同層級的所有使用者
	 * 2. 可一次指定多個使用者層級，用逗號分隔
	 * 3. 特殊使用者層級: * ，代表該角色的權限套用到所有使用者
	 * */
	level?: string;
	/** 是否隱藏中台側欄的群組 */
	hideLeftNavGroup?: boolean;
	/** 備註 */
	memo?: string;
};

/** 角色表身 */
export type RoleLines = {
	/** 員工 */
	employees?: {
		/** 使用者名稱 */
		user: string;
		/** 備註 */
		memo?: string;
	};
	/** 令牌 */
	tokens?: {
		/** 令牌名稱 */
		token: string;
		/** 備註 */
		memo?: string;
	};
	/** 權限: 對資料欄限制 */
	permissions?: {
		/** 權限名稱 */
		name: string;
		/** 表格名稱，逗號分隔字串 */
		table: string;
		/** 動作，逗號分隔字串 */
		action: string;
		/** 效果 */
		effect: PermissionEffect;
		/** 欄位名稱，逗號分隔字串 */
		field: string;
		/** 備註 */
		memo?: string;
	};
	/** 限制: 對資料列限制 */
	constraints?: {
		/** 限制名稱 */
		name: string;
		/** 表格名稱(多選) */
		table: string;
		/** 表身名稱。如果設定了表身名稱，視 field 為表身欄位 */
		line?: string;
		/** 欄位名稱 */
		field: string;
		/** 運算子。如果 `operator` 是 in ，欄位值將視為 comma-separated string */
		operator: ConstraintOperator;
		/** 限制值。根據 `field` 的欄位定義轉型別 */
		value: string;
		/** 群組鍵，同一群組將會合併成一個過濾器條件 */
		groupKey?: string;
		/** 本項限制是否套用到 execute 。預設是 false 只會影響 find, insert */
		includeExecute?: boolean;
	};
	//#region 角色2
	/**
	 * 權限 - 控管表格的欄位
	 * 1. 表頭欄位、表身欄位、函式名稱可同時輸入
	 * 2. 1 版中的 * $ 兩個符號將一併在 applyToAll 處理
	 * 3. 動作 LIST, DOWNLOAD, ARCHIVE, UNARCHIVE 一定要設定 { applyToAll: true }
	 */
	permissions2?: {
		/** 權限名稱 */
		name: string;
		/** 表格名稱(單選) */
		tableName: string;
		/** 動作(多選) */
		actions: string;
		/**
		 * 是否指定所有欄位
		 * 1. 設定為 false 需要設定表頭或表身欄位
		 * 2. 設定為 true 時代表所有欄位，因此不需要設定表頭或表身欄位
		 * */
		applyToAll: boolean;
		/** 表頭欄位(多選) */
		bodyFields?: string;
		/** 表身名稱(單選) */
		lineName?: string;
		/** 表身欄位(多選) */
		lineFields?: string;
		/** 函式名稱 for EXECUTE (多選) */
		functionNames?: string;
		/** 效果 */
		effect: PermissionEffect;
		/** 備註 */
		memo?: string;
	};
	/** 限制 - 控管表格的資料列。
	 *  1. 表頭欄位跟表身欄位只能擇一輸入
	 *  2. 如果一個表格沒有任何限制，代表可以存取表格所有資料
	 * */
	constraints2?: {
		/** 限制名稱 */
		name: string;
		/** 表格名稱(單選) */
		tableName: string;
		/** 表頭欄位(單選) */
		bodyField?: string;
		/** 表身名稱(單選) */
		lineName?: string;
		/** 表身欄位(單選) */
		lineField?: string;
		/** 運算子 */
		operator: RoleConstraintOperator;
		/** 限制值。當運算子是 in 時，限制值將視為逗號分隔字串 */
		value: string;
		/** 群組鍵，同群組以 AND 組成過濾器。不同群組以 OR 連結 */
		groupKey?: string;
		/**
		 * 本項限制是否適用在 GraphQL 函式 execute
		 * 1. 設為 false 時限制只套用在以下 GraphQL 函式: insert, find, distinct, count
		 * 2. 設為 true 時限制除了以上函式外還適用在 execute 函式
		 * */
		includeExecute: boolean;
		/** 備註 */
		memo?: string;
	};
	//#endregion
};

export type ConstraintOperator = 'in' | 'gte' | 'gt' | 'lt' | 'lte';
/** 角色紀錄 */
export type RoleRecord = SafeRecord2<RoleBody, RoleLines>;
//#endregion

//#region 簽核 2 版
/** 簽核表頭欄位 */
export type ApprovalBody2 = {
	/** 簽核編號 */
	name?: string;
	/** 簽核主旨 */
	subject: string;
	/** 簽核說明 */
	description?: string;
	/** 目標表格 */
	table: string;
	/** 簽核鏈名稱 */
	rule: string;
	/** 簽核鏈角色 (JSON string) */
	rolesinrule?: string;
	/** 當前簽核階段 */
	stage?: number;
	/** 簽核階段總數 */
	totalStages?: number;
	/** 當前簽核角色 */
	role: string;
	/** 當前簽核狀態 */
	status: ApprovalStatus;
	/** 上一簽核者 */
	lastUser?: string;
	/** 上一簽核動作 */
	lastAction?: ApprovalAction;
	/** 上一簽核訊息 */
	lastMessage?: string;
	/** 上一簽核時間 */
	lastActedAt?: Date;
};

/** 簽核表身欄位 */
export type ApprovalLines2 = {
	/** 簽核對象 */
	items: {
		/** 目標紀錄的系統編號 */
		id: number;
		/** 目標紀錄的編號 */
		name: string;
	};
	/** 批次檔案 */
	files: {
		/** 檔案名稱 */
		name: string;
	};
	/** 簽核歷程 */
	history: Omit<__APPROVAL_LINE2['_approval2'], 'rule'>;
};

/** 紀錄的簽核表頭型別 */
export type __APPROVAL_BODY2 = {
	/** 簽核狀態 */
	_approvalStatus: ApprovalStatus;
	/** 簽核單編號 */
	_approvalName2?: string;
	/** 簽核序數。同一批新增的紀錄會有一樣的序數 */
	_approvalSequence2?: string;
	/** 簽核單產生的重試次數 */
	_approvalRetry: number;
	/** 簽核單產生的失敗原因 */
	_approvalResult: string;
	/** 簽核同意者 */
	_approvalApprovedBy2?: string;
	/** 簽核同意時間 */
	_approvalApprovedAt2?: Date;
	/** 簽核拒絕者 */
	_approvalDeniedBy2?: string;
	/** 簽核拒絕時間 */
	_approvalDeniedAt2?: Date;
};

/** 紀錄的簽核歷程表身型別 */
export type __APPROVAL_LINE2 = {
	/** 簽核歷程 */
	_approval2: {
		/** 執行後簽核狀態 */
		status: ApprovalStatus;
		/** 簽核規則 */
		rule: string;
		/** 簽核階段 */
		stage: number;
		/** 簽核動作 */
		action?: ApprovalAction;
		/** 簽核角色 */
		role: string;
		/** 簽核者使用者編號 */
		user?: string;
		/** 簽核者使用者名稱 */
		userDisplayName?: string;
		/** 簽核訊息 */
		message?: string;
	};
};

/** 檔案紀錄 */
export type ApprovalRecord2 = SafeRecord<ApprovalBody2, ApprovalLines2>;
export type UnsafeApprovalRecord2 = UnsafeRecord<ApprovalBody2, ApprovalLines2>;
//#endregion

//#region 檔案分類
/** 檔案分類表頭 */
export type FileCategoryBody = {
	/**
	 * 分類名稱
	 * @type KEY
	 */
	name: string;
	/** 分類顯示名稱 */
	displayName: string;
	/** 是否公開 */
	public?: boolean;
	//#region 前端用來限制檔案上傳
	/** 限制檔案大小 */
	limitedFileSize?: number;
	/** 限制檔案格式 */
	limitedContentType?: string;
	/** 限制最大寬 */
	limitedWidthMax?: number;
	/** 限制最小寬 */
	limitedWidthMin?: number;
	/** 限制最大高 */
	limitedHeightMax?: number;
	/** 限制最小高 */
	limitedHeightMin?: number;
	/** 禁止重複上傳 */
	disableReupload?: boolean;
	//#endregion
};

/** 檔案分類紀錄 */
export type FileCategoryRecord = SafeRecord<FileCategoryBody>;
//#endregion

//#region 檔案 2 版
/** 檔案表頭 */
export type File2Body = {
	/**
	 * 檔案名稱
	 * @type KEY
	 */
	name: string;
	/** 檔案顯示名稱 */
	displayName: string;
	/** 檔案分類 */
	category: string;
	/** 內容類型 (會放到 HTTP header 中) */
	contentType: string;
	/** 備註 */
	memo?: string;
	/** 讀取連結 (推導欄位/只能讀取) */
	url?: string;
	/** 上傳用網址 (推導欄位/只能讀取) */
	postURL?: string;
	/** 上傳欄位 (推導欄位/只能讀取) */
	postFields?: string;
	/** 檔案大小 (只能讀取) */
	fileSize?: number;
};

/** 檔案紀錄 */
export type File2Record = SafeRecord<File2Body>;
//#endregion

/** 任務表頭 */
export type JobBody = {
	/** 任務編號 */
	name?: string;
	/** 表格名稱 */
	table: string;
	/** 排程名稱 */
	cron?: string;
	/** 函數名稱 */
	function: string;
	/** 填入觸發者的名稱，例如函數名稱 */
	source?: string;
	/** 自訂參數，任務如果需要額外的參數就放入這裡 */
	param?: string;
	/** 狀態 */
	status: JobStatus;
	/** 備註 */
	memo?: string;
};

/** 任務表身 */
export type JobLines = {
	/** 工作 */
	tasks: {
		/** 紀錄編號 */
		id: number;
		/** 任務狀態 */
		status: JobStatus;
		/** 備註 */
		memo?: string;
		/** 結果 */
		result?: string;
		/** 錯誤訊息 */
		error?: string;
		/** 錯誤堆疊 */
		stack?: string;
		/** 耗時 */
		time?: number;
		/** 被工作任務截取時間 */
		acquiredAt?: Date;
		/** 開始時間 */
		startAt?: Date;
		/** 結束時間 */
		endAt?: Date;
		/** AWS 請求編號 */
		awsRequestId?: string;
	};
};

/** 任務紀錄 */
export type JobRecord = SafeRecord<JobBody, JobLines>;

/** 待辦工作-表頭 */
export type TodoJobBody = {
	/** 工作編號 */
	name?: string;
	/** 表格名稱 */
	tableName: TableName;
	/** 函數名稱 */
	functionName: string;
	/** 執行次數 */
	execCount?: number;
	/** 連續錯誤次數 */
	errorCount?: number;
	/** 自訂參數 */
	param?: string;
	/** 執行狀態 */
	status?: EnumLiteral<TodoJobStatus>;
	/** 工作產生來源 */
	source: string;
	/** 工作佇列號碼 */
	queueNo: number;
	/** 執行期間儲存空間 */
	buffer?: string;
	/** 備註 */
	memo?: string;
	/** 重啟自工作歷程 */
	restartFrom?: string;
	/** 表格名稱.表格顯示名稱 */
	tableName_displayName?: string;
	/** 表格名稱.工作佇列數量 */
	tableName_jobQueues?: string;
	/** 表格名稱.啟用簽核 */
	tableName_enableApproval2?: boolean;
};

/** 待辦工作-表身 */
export type TodoJobLines = {
	/** 工作目標 */
	items: {
		/** 工作目標編號 */
		targetName: string;
	};
};

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

/** 待辦工作紀錄 */
export type TodoJobRecord = SafeRecord<TodoJobBody, TodoJobLines>;

/** 工作歷程-表頭 */
export type TodoJobLogBody = TodoJobBody & {
	/** 待辦工作編號 */
	todoJobName: string;
	/** 工作開始時間 */
	startAt: Date;
	/** 工作結束時間 */
	endAt: Date;
	/** 耗時-毫秒 */
	time: number;
	/** 啟動結果 */
	runResult: string;
	/** AWS Request Id */
	requestId: string;
};

/** 工作歷程-表身 */
export type TodoJobLogLines = TodoJobLines;

/** 工作歷程紀錄 */
export type JobLogRecord = SafeRecord<TodoJobLogBody, TodoJobLogLines>;

/** 變更單表頭欄位 */
export type __UPDATER_BODY = {
	/** 變更單編號 */
	_name?: string;
	/**
	 * 目標紀錄欄位
	 * @deprecated 已不需要
	 */
	_keyName?: string;
	/** 目標紀錄欄位值 */
	_keyValue: string;
	/** 移除欄位 (comma-separated) */
	_unset?: string;
	/** 變更單執行時間 */
	_syncedAt?: Date;
	/** 變更單狀態 */
	_status?: ApprovalUpdateStatus | `${ApprovalUpdateStatus}`;
	/** 重試次數 */
	_retry?: number;
	/** 失敗原因 */
	_result?: string;
};

/** 變更單表身欄位 */
export type __UPDATER_LINE = {
	/** 表身列操作類型 */
	_action: LineAction;
	/** 目標表身欄位 */
	_keyName?: string;
	/** 目標表身欄位值 */
	_keyValue?: string;
	/** 移除欄位 (comma-separated) */
	_unset?: string;
};

/** 變更單表頭 */
export type UpdaterBody = Row & __UPDATER_BODY;

/** 變更單表身 */
export type UpdaterLines = {
	/** 工作 */
	[lineName: string]: Row & __UPDATER_LINE;
};

/** 變更單紀錄 */
export type UpdaterRecord = SafeRecord<UpdaterBody, UpdaterLines>;

//#region string _id 相關
/** 郵件紀錄 */
export type EmailRecord2 = SafeRecord2<EmailBody, EmailLines>;
/** 使用者紀錄 */
export type UserRecord2 = SafeRecord2<UserBody>;
/** 令牌紀錄 */
export type TokenRecord2 = SafeRecord2<TokenBody, TokenLines>;
/** 角色紀錄 */
export type RoleRecord2 = SafeRecord2<RoleBody, RoleLines>;
/** 檔案紀錄 */
export type ApprovalRecord2v2 = SafeRecord2<ApprovalBody2, ApprovalLines2>;
export type UnsafeApprovalRecord2v2 = UnsafeRecord2<ApprovalBody2, ApprovalLines2>;
/** 檔案分類紀錄 */
export type FileCategoryRecord2 = SafeRecord2<FileCategoryBody>;
/** 檔案紀錄 */
export type File2Record2 = SafeRecord2<File2Body>;
/** 任務紀錄 */
export type JobRecord2 = SafeRecord2<JobBody, JobLines>;
/** 待辦工作紀錄 */
export type TodoJobRecord2 = SafeRecord2<TodoJobBody, TodoJobLines>;
/** 工作歷程紀錄 */
export type JobLogRecord2 = SafeRecord2<TodoJobLogBody, TodoJobLogLines>;
/** 變更單紀錄 */
export type UpdaterRecord2 = SafeRecord2<UpdaterBody, UpdaterLines>;
//#endregion

/** 排程總覽表頭欄位 */
export type CronViewBody = {
	/** 排程總覽編號 */
	name: string;
	/** 表格名稱 */
	tableName: string;
	/** 排程名稱 noWhiteSpace=ALL */
	cronName: string;
	/** 指令碼 */
	script: string;
	/** 函數名稱 */
	functionName?: string;
	/** 速率 */
	rate?: CronRate;
	/** 指定特定時間執行，只在 CronRate.DAILY 時生效 */
	atUtcTime?: string;
	/** 指定特定日期時間執行，只在 CronRate.ONE_TIME 時生效 */
	atUtcDateTime?: string;
	/** 備註 */
	memo?: string;
	/** 上次啟動時間 */
	lastRunAt?: Date;
	/** 上次結束時間 */
	lastEndAt?: Date;
	/** 上次耗時-毫秒 */
	lastRunTime?: number;
	/** 上次啟動結果: 成功 | 失敗 */
	lastRunResult?: CronRunResult;
	/** 上次啟動內容 */
	lastRunDetails?: string;
	/** 是否使用待辦工作 */
	usingTodoJob?: boolean;
	/** 下次排程預計執行時間 */
	nextCronsRunAt?: string;
	/** 排程類型 */
	cronType?: CronType;
	/** 排程執行日 */
	cronStartAt?: Date;
	/** 時區 */
	timezone?: string;
	/** 幾分 */
	recurringAtMinutes?: string;
	/** 幾點 */
	recurringAtHours?: string;
	/** 每月幾號 */
	recurringAtDaysOfMonth?: string;
	/** 幾月 */
	recurringAtMonths?: string;
	/** 週幾 */
	recurringAtDaysOfWeek?: string;
	/** 數值 */
	recurringValue?: number;
	/** 單位 */
	recurringUnit?: RecurringCronUnit;
	/** 排程執行設定 */
	executeSetting: CronExecuteSetting;
	/** 排程群組 */
	cronGroup?: string;
};
/** 排程總覽表紀錄 */

export type CronViewRecord = SafeRecord<CronViewBody>;
/** 排程總覽表表格紀錄型別 */
export type CronViewTableRecord = SafeMyTable<keyof CronViewBody>;
