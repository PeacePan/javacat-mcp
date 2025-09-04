import { Lines, Row, SafeRecord, SafeRecord2 } from './';
import { TypeMyQuery } from './MyQuery';
import { TodoJobRecord, UnsafeApprovalRecord2 } from './systemTable';
import { MyTableFunction, TableName, UpdateRecord } from './table';

import type { SafeRecordWithApprovalRef } from '../../Lykoi/src/fields/interface';
import type { AfterMutationReturnTypeEnum, AfterMutationTriggerTypeEnum, AlertStatus, ApprovalAction, TodoJobStatus } from '../enum';

/** 建立後掛勾腳本 */
export type AfterInsertHookScript<R extends SafeRecord | SafeRecord2 = SafeRecord> = (
	record: R,
	ctx: Context
) => Promise<string | null | undefined>;

//#region 異動後函數 FunctionType.AFTER_MUTATION
/** 異動後函式 CallFunctionScript 的傳入參數， */
export type AfterMutationCallScriptArgs<BODY extends Row = Row, LINES extends Lines = Lines> = {
	triggerType:
		| AfterMutationTriggerTypeEnum
		| `${AfterMutationTriggerTypeEnum}`
		| AfterMutationReturnTypeEnum.CALL
		| `${AfterMutationReturnTypeEnum.CALL}`;
	record?: SafeRecordWithApprovalRef<BODY, LINES>;
};
/** 異動後函數執行後，接著 CALL 下一個函式 */
export type AfterMutationCallFunctionReturn = {
	type: AfterMutationReturnTypeEnum.CALL | `${AfterMutationReturnTypeEnum.CALL}`;
	functionName: MyTableFunction['name'];
	argument?: Record<string, unknown>;
};
/** 異動後函數執行後，接著 EXECUTE 下一個函式 */
export type AfterMutationExecuteFunctionReturn = {
	type: AfterMutationReturnTypeEnum.EXECUTE | `${AfterMutationReturnTypeEnum.EXECUTE}`;
	functionName: MyTableFunction['name'];
	argument?: Record<string, unknown>;
} & Partial<Pick<MyTableFunction, 'ignoreApproval'>>;
/** 除了指定用處的 key(type, functionName, ignoreApproval)，其餘皆視為 argument 參數 */
/** 異動後函式執行後，將結果顯示在中台前端的 BRAlert 元件 */
export type AfterMutationAlertReturn = {
	type: AfterMutationReturnTypeEnum.ALERT | `${AfterMutationReturnTypeEnum.ALERT}`;
	/** 控制 BPAlert 訊息顯示的底色，success 為藍色，error 為紅色 */
	status: AlertStatus | `${AlertStatus}`;
	/** BPAlert 顯示訊息 */
	message: string;
};
/** 異動後函數回傳型別 */
export type AfterMutationReturn<T extends AfterMutationReturnTypeEnum | `${AfterMutationReturnTypeEnum}` | 'ALL' = 'ALL'> = T extends
	| AfterMutationReturnTypeEnum.ALERT
	| `${AfterMutationReturnTypeEnum.ALERT}`
	? AfterMutationAlertReturn
	: T extends AfterMutationReturnTypeEnum.EXECUTE | `${AfterMutationReturnTypeEnum.EXECUTE}`
		? AfterMutationExecuteFunctionReturn
		: T extends AfterMutationReturnTypeEnum.CALL | `${AfterMutationReturnTypeEnum.CALL}`
			? AfterMutationCallFunctionReturn
			: T extends 'ALL'
				? {
						type: AfterMutationReturnTypeEnum | `${AfterMutationReturnTypeEnum}`;
					} & Partial<
						Omit<AfterMutationAlertReturn, 'type'> &
							Omit<AfterMutationExecuteFunctionReturn, 'type'> &
							Omit<AfterMutationCallFunctionReturn, 'type'>
					>
				: never;
//#endregion
/**
 * 政策腳本
 * 1. 回傳任何值都視作錯誤訊息
 * 1. 回傳 undefined 視作成功
 */
export type PolicyScript<R extends SafeRecord | SafeRecord2 = SafeRecord2> = (
	record: R,
	ctx: Context,
	oldRecord?: R
) => Promise<string | null | undefined>;

/** 函數腳本 for execute */
export type FunctionScript<
	R extends SafeRecord | SafeRecord2 = SafeRecord2,
	A extends SafeRecord | SafeRecord2 = SafeRecord2,
	P = unknown,
> = (record: R, argument: A, ctx: Context) => Promise<P>;

/**
 * 函數腳本 for todoJob
 * @description 支援不傳入工作目標之待辦工作
 */
export type TodoJobScript<
	R extends SafeRecord | SafeRecord2 = SafeRecord2,
	A extends SafeRecord | SafeRecord2 = SafeRecord2,
	P = unknown,
> = (record: R | null, argument: A, ctx: Context) => Promise<P>;

/** 待辦工作函數回傳型別 */
export type TodoJobFunctionReturn =
	| string
	| {
			/** 待辦工作狀態 */
			status: TodoJobStatus | `${TodoJobStatus}`;
			/** 執行結果，將會被記錄在工作歷程中 */
			result?: string;
			/** 暫存區，供下次 stage 使用 */
			buffer?: string;
			/**
			 * 待辦工作結束後，是否禁止繼續執行 queue 中的工作
			 * @deprecated 請改用 keepQueue ，如果同時定義，以 keepQueue 優先
			 */
			disableBurst?: boolean;
			/** 待辦工作結束後，是否繼續執行 queue 中的工作 */
			keepQueue?: boolean;
			/**
			 * 在 status = ERROR 的情況時，是否讓資料庫 rollback
			 * true: 資料庫 commit
			 * false: 資料庫 rollback (預設)
			 */
			disableRollback?: boolean;
	  };

/** 函數腳本 for call */
export type CallFunctionScript<A extends Record<string, unknown> | Array<Record<string, unknown>> = Row, R = unknown> = (
	record: null,
	/** 由於參數直接經過 JSON.parse 所以日期物件會直接轉為 ISO String */
	argument: ParseDateFieldToISOString<A> | null,
	ctx: Context
) => Promise<R>;
/** 擇量執行函式輸入的參數物件內容 */
export type BulkFunctionArgs<A extends Record<string, unknown> = Row> = Partial<{
	/** 表格定義的 argument 參數 */
	argument: Partial<A>;
	/** 目標資料鍵值，由於中台資料可能欄位有缺漏，因此需要根據包含資料的鍵值，Sandbox 腳本自行處理重新抓取完整資料 */
	keys: Array<{ name: string; value: string }>;
}>;
/** 擇量執行函式腳本輸入內容 */
export type BulkFunctionScript<A extends Record<string, unknown> = Row, R = unknown> = CallFunctionScript<BulkFunctionArgs<A>, R>;

/** 將物件中的日期欄位轉為字串欄位 */
type ParseDateFieldToISOString<T extends Record<string, unknown> | Array<Record<string, unknown>>> = {
	[K in keyof T]: NonNullable<T[K]> extends Date
		? string
		: NonNullable<T[K]> extends Record<string, unknown>
			? ParseDateFieldToISOString<NonNullable<T[K]>>
			: NonNullable<T[K]> extends Array<Record<string, unknown>>
				? Array<ParseDateFieldToISOString<NonNullable<T[K]>[number]>>
				: T[K];
};

/**
 * 排程腳本
 * 1. 禁止更新資料庫，只能讀取
 */
export type Cron2Script = (ctx: Context) => Promise<string | void>;

/**
 * 建立前掛勾腳本
 */
export type BeforeInsertScript<R extends SafeRecord = SafeRecord> = (record: R, ctx: Context) => R | Promise<R>;

/**
 * 更新前掛勾腳本
 * 1. 應回傳更新物件
 * 1. 其他回傳都當作錯誤
 */
export type BeforeUpdateScript<R extends SafeRecord | SafeRecord2 = SafeRecord2> = (
	update: UpdateRecord['data'],
	original: R,
	ctx: Context
) => Promise<UpdateRecord['data'] | string>;

/** 簽核鏈腳本 */
export type ApprovalRuleScript<R extends SafeRecord | SafeRecord2 = SafeRecord2> = (
	record: R,
	updaterSource: R
) => Promise<boolean | null | undefined>;

/**
 * 簽核鏈掛勾腳本
 * 1. 應回傳簽核鏈名稱 (ruleName)
 * 1. 回傳的簽核鏈名稱必須在 approvalChain 裡
 * @typeParam isUpdate 是否為變更單
 */
export type ApprovalHookScript<isUpdate extends boolean = false> = isUpdate extends true
	? (record: SafeRecord, updaterSource: SafeRecord, ctx: Context) => Promise<string>
	: (record: SafeRecord, ctx: Context) => Promise<string>;

/** 查詢函數 */
export interface Context {
	/** 查詢 */
	query: {
		/** 尋找紀錄 */
		find: TypeMyQuery['find'];
		/** 新增紀錄 */
		insert: TypeMyQuery['insert'];
		/** 批次新增紀錄 */
		batchInsert: TypeMyQuery['batchInsert'];
		/** 更新紀錄 */
		update: TypeMyQuery['update'];
		/** 批次更新紀錄 */
		batchUpdate: TypeMyQuery['batchUpdate'];
		/** 不使用 session 批次更新紀錄 */
		dangerBatchUpdate: TypeMyQuery['dangerBatchUpdate'];
		/** 封存紀錄 */
		archive: TypeMyQuery['archive'];
		/** 解封存紀錄 */
		unarchive: TypeMyQuery['unarchive'];
		/** HTTP 查詢 */
		http: TypeMyQuery['http'];
		/**
		 * HTTP 查詢
		 * @deprecated
		 */
		json: TypeMyQuery['http'];
		/** 呼叫函數 */
		call: TypeMyQuery['call'];
		/** 呼叫 DocumentDB find */
		docdbFind: TypeMyQuery['docdbFind'];
		/** 新增待辦工作
		 * @deprecated 改用 todoJobsV2
		 */
		todoJobs: TypeMyQuery['todoJobs'];
		/** 設定待辦工作 */
		setTodoJob: TypeMyQuery['setTodoJob'];
		/** SNS 發布消息 */
		publish: TypeMyQuery['publish'];

		//#region V2 端點
		/** 尋找紀錄 */
		findV2: TypeMyQuery['findV2'];
		/** 新增紀錄 */
		insertV2: TypeMyQuery['insertV2'];
		/** 批次新增紀錄 */
		batchInsertV2: TypeMyQuery['batchInsertV2'];
		/** 更新紀錄 */
		updateV2: TypeMyQuery['updateV2'];
		/** 批次更新紀錄 */
		batchUpdateV2: TypeMyQuery['batchUpdateV2'];
		/** 不使用 session 批次更新紀錄 */
		dangerBatchUpdateV2: TypeMyQuery['dangerBatchUpdateV2'];
		/** 封存紀錄 */
		archiveV2: TypeMyQuery['archiveV2'];
		/** 批次封存紀錄 */
		batchArchiveV2: TypeMyQuery['batchArchiveV2'];
		/** 解封存紀錄 */
		unarchiveV2: TypeMyQuery['unarchiveV2'];
		/** 批次解封存紀錄 */
		batchUnarchiveV2: TypeMyQuery['batchUnarchiveV2'];
		/** 新增待辦工作 */
		todoJobsV2: TypeMyQuery['todoJobsV2'];
		/** SNS 發布消息 */
		publishV2: TypeMyQuery['publishV2'];
		/** athena */
		athena: TypeMyQuery['athena'];
		/** 移動紀錄 */
		move: TypeMyQuery['move'];
		//#endregion
	};
	/** 表格名稱 */
	table: TableName;
	/** 函數名稱 */
	function: string | null;
	/** 執行環境 */
	env: string | null;
	/** user 或 token 或 cron */
	user?: string;
	/**
	 * 其他參數 \
	 * 若使用 todojob，請改用 ctx.todoJob.body.param
	 */
	param?: string;
	/** 待辦工作 */
	todoJob?: TodoJobRecord;
	/** 客製化 header */
	httpHeaders?: Record<string, string>;
}

//#region 批次掛勾

/** 批次腳本共用參數 */
export type BaseBatchScriptArgs = {
	ctx: Context;
};
/** 批次政策腳本參數 */
export type BatchPolicyScriptArgs<R extends SafeRecord | SafeRecord2 = SafeRecord> = BaseBatchScriptArgs & {
	/** 已更新的紀錄 (批次) */
	records: R[];
	/** 舊紀錄 (批次) */
	oldRecords?: R[];
};
/**
 * 批次政策腳本
 * 1. 回傳任何值都視作錯誤訊息
 * 1. 回傳 undefined 視作成功
 */
export type BatchPolicyScript<R extends SafeRecord | SafeRecord2 = SafeRecord> = (
	args: BatchPolicyScriptArgs<R>
) => Promise<string | null | void>;

/** 批次建立前掛勾腳本 */
export type BatchBeforeInsertScriptArgs<R extends SafeRecord | SafeRecord2 = SafeRecord> = BaseBatchScriptArgs & {
	/** 表格紀錄 */
	records: R[];
};
/** 批次新增前掛勾腳本 */
export type BatchBeforeInsertScript<R extends SafeRecord | SafeRecord2 = SafeRecord> = (
	args: BatchBeforeInsertScriptArgs<R>
) => R[] | Promise<R[]>;
/** 批次建立後掛勾腳本參數 */
export type BatchAfterInsertScriptArgs<R extends SafeRecord | SafeRecord2 = SafeRecord> = BaseBatchScriptArgs & {
	/** 表格紀錄 */
	records: R[];
};
/** 批次新增後掛勾腳本 */
export type BatchAfterInsertScript<R extends SafeRecord | SafeRecord2 = SafeRecord> = (
	args: BatchAfterInsertScriptArgs<R>
) => R[] | Promise<R[]>;
/** 批次更新前掛勾腳本參數 */
export type BatchBeforeUpdateScriptArgs<R extends SafeRecord | SafeRecord2 = SafeRecord> = BaseBatchScriptArgs & {
	/** 要更新的紀錄內容 (批次) */
	records: UpdateRecord['data'][];
	/** 舊紀錄 (批次) */
	oldRecords: R[];
};
/** 批次更新前掛勾腳本 */
export type BatchBeforeUpdateScript<R extends SafeRecord | SafeRecord2 = SafeRecord> = (
	args: BatchBeforeUpdateScriptArgs<R>
) => UpdateRecord['data'][] | Promise<UpdateRecord['data'][]>;

/** 批次簽核前掛勾腳本參數 */
export type BatchApprovalScriptArgs = BaseBatchScriptArgs & {
	/** 簽核單 */
	appRecords: Array<{
		/** 簽核單 */
		appdocs: UnsafeApprovalRecord2[];
		/** 簽核動作：APPROVE | DENY */
		action: ApprovalAction;
		/** 簽核意見 */
		message?: string;
	}>;
};
/** 批次簽核前掛勾腳本 */
export type BatchBeforeApprovalScript = (args: BatchApprovalScriptArgs) => Promise<void | string>;
//#endregion
