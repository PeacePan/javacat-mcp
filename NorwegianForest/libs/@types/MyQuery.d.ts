import { TableName } from '@norwegianForestTypes/table';
import { NN } from '../';
import { ApprovalSequence } from '../assert';
import { ApprovalStatus, ArchivedStatus, TodoJobStatus } from '../enum';
import {
	BUILTIN_BODY_FIELD,
	BUILTIN_BODY_FIELD2,
	BUILTIN_LINE_FILED,
	FIELD_VALUE_TYPE,
	LEGACY_BUILTIN_BODY_FIELD,
	Lines,
	Row,
	SafeRecord,
	SafeRecord2,
	TodoJobUpdatableFields,
} from './';

/** 表頭欄位篩選, _id 雖然是字串但也可以被比較大小 */
export type FieldCondition<T extends FIELD_VALUE_TYPE = FIELD_VALUE_TYPE> = {
	$in?: (T extends Date | number | boolean ? T | null : T extends string ? T | `${T}` | null : never)[];
	$nin?: (T extends Date | number | boolean ? T | null : T extends string ? T | `${T}` | null : never)[];
	$gte?: T extends Date | number | string ? T : never;
	$gt?: T extends Date | number | string ? T : never;
	$lte?: T extends Date | number | string ? T : never;
	$lt?: T extends Date | number | string ? T : never;
	$like?: (T extends string ? T : never)[];
};

/** 表身欄位篩選 */
export type ConditionMap<T extends Row = Row> = {
	[fieldName in keyof (T & BUILTIN_LINE_FILED)]?: FieldCondition<NonNullable<(T & BUILTIN_LINE_FILED)[fieldName]>>;
};

/** 將表頭表身的欄位展開成完整欄位名稱 eg "_id" "body.name" */
export type ExpandFieldNames<B extends Row = Row, L extends Lines = Lines> =
	| keyof Pick<BUILTIN_BODY_FIELD, '_id'>
	| keyof {
			[FN in keyof (B & BUILTIN_BODY_FIELD) as FN extends string ? `body.${FN}` : never]: (B & BUILTIN_BODY_FIELD)[FN];
	  }
	| keyof { [LN in keyof L as LN extends string ? `lines.${LN}` : never]: L[LN] }
	| {
			[LN in keyof L]: keyof {
				[FN in keyof (NN<L[LN]> & BUILTIN_LINE_FILED) as LN extends string
					? `lines.${LN}.${FN extends string ? FN : never}`
					: never]: (NN<L[LN]> & BUILTIN_LINE_FILED)[FN];
			};
	  }[keyof L]
	| 'body'
	| 'lines';

/** 擷取紀錄 */
export type FindQuery<B extends Row = Row, L extends Lines = Lines, RB extends Row = B, RL extends Lines = L> = {
	/** 表格 */
	table: TableName;
	/** 過濾器 */
	filters?: Array<{
		/** 表頭條件 */
		body?: {
			[key in keyof (B & LEGACY_BUILTIN_BODY_FIELD)]?: FieldCondition<NonNullable<(B & LEGACY_BUILTIN_BODY_FIELD)[key]>>;
		};
		/** 表身條件 */
		lines?: { [lineName in keyof L]?: ConditionMap<L[lineName]> };
	}>;
	/** 選擇欄位，按照 MongoDB 語法 */
	selects?: ExpandFieldNames<RB, RL>[];
	/** 簽核狀態 `null` 代表不限制 */
	approved?: ApprovalStatus | keyof typeof ApprovalStatus | null;
	/** 封存狀態 */
	archived?: ArchivedStatus | keyof typeof ArchivedStatus;
	/**
	 * 是否啟用交易
	 * @default false
	 */
	session?: boolean;
	/**
	 * 回傳筆數上限
	 * @default 100
	 */
	limit?: number;
	/**
	 * 跳過幾筆資料
	 * @default 0
	 */
	skip?: number;
	/** 只回傳 _id */
	onlyId?: boolean;
	/**
	 * 排序
	 * @default "{ _id: -1 }"
	 * @deprecated 請改用 multiSort
	 */
	sorting?: {
		/** 完整欄位名稱 eg "_id" "body.name" */
		field: ExpandFieldNames<B, L>;
		/** 方向 */
		direction: 1 | -1;
	};
	/**
	 * 多條件排序
	 * 目前僅支援最多兩個欄位排序，array index即為優先順序
	 * 注意:
	 * 1. []: 不排序 (可以加速某些狀況下的查詢)
	 * 2. undefined: 使用預設排序 (_id 倒序)
	 * @default "[{ _id: -1 }]"
	 */
	multiSort?: Array<{
		field: ExpandFieldNames<B, L>;
		direction: 1 | -1;
	}>;
};

/** 更新紀錄 */
export type UpdateQuery<B extends Row = Row, L extends Lines = Lines> = Pick<FindQuery, 'archived'> & {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'update';
	/** 表格 */
	table: string;
	/** 忽略簽核 */
	ignoreApproval?: boolean;
	/** 忽略政策 */
	ignorePolicy?: boolean;
	/** 跳過紀錄 */
	bypassLogging?: boolean;
	/** 建立者，可以是使用者編號或任意字串 */
	user?: string;
	/** 主鍵 */
	key: {
		/** 主鍵欄位名稱 */
		name: string;
		/** 主鍵欄位值 */
		value: string;
	};
	//#region deprecated
	/**
	 * 更新資料
	 * @deprecated 可以直接用 `body` 或 `lines`
	 */
	data?: {
		/** 表頭更新 */
		body?: {
			[fieldName in keyof B]?: B[fieldName] | null;
		};
		/** 表身更新 */
		lines?: {
			[lineName in keyof L]?: {
				/** 更新表身列 */
				$set?: Array<{
					/** 表身鍵 */
					key: {
						/** 表身鍵欄位名稱 */
						name: string;
						/** 表身鍵欄位值 */
						value: string;
					};
					/** 更新資料 */
					data: {
						[fieldName in keyof NonNullable<L[lineName]>]?: NonNullable<L[lineName]>[fieldName] | null;
					};
				}>;
				/** 移除表身列 */
				$pull?: Array<{
					/** 表身鍵 */
					key: {
						/** 表身鍵欄位名稱 */
						name: string;
						/** 表身鍵欄位值 */
						value: string;
					};
				}>;
				/** 新增表身列 */
				$push?: Array<{
					[fieldName in keyof NonNullable<L[lineName]>]?: NonNullable<L[lineName]>[fieldName];
				}>;
			};
		};
	};
	//#endregion
	/** 表頭更新 */
	body?: {
		[fieldName in keyof B]?: B[fieldName] | null;
	};
	/** 表身更新 */
	lines?: {
		[lineName in keyof L]?: {
			/** 更新表身列 */
			$set?: Array<{
				/** 表身鍵 */
				key: {
					/** 表身鍵欄位名稱 */
					name: string;
					/** 表身鍵欄位值 */
					value: string;
				};
				/** 更新資料 */
				data: {
					[fieldName in keyof NonNullable<L[lineName]>]?: NonNullable<L[lineName]>[fieldName] | null;
				};
			}>;
			/** 移除表身列 */
			$pull?: Array<{
				/** 表身鍵 */
				key: {
					/** 表身鍵欄位名稱 */
					name: string;
					/** 表身鍵欄位值 */
					value: string;
				};
			}>;
			/** 新增表身列 */
			$push?: Array<{
				[fieldName in keyof NonNullable<L[lineName]>]?: NonNullable<L[lineName]>[fieldName] | null;
			}>;
		};
	};
};

/** 批次更新紀錄 */
export type BatchUpdateQuery<B extends Row = Row, L extends Lines = Lines> = Pick<
	UpdateQuery,
	'table' | 'ignoreApproval' | 'ignorePolicy' | 'bypassLogging' | 'user' | 'archived'
> & {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'batchUpdate';
	/** 批次更新內容 */
	updates: Array<Pick<UpdateQuery<B, L>, 'key' | 'body' | 'lines'>>;
};

/** 不使用 session 批次更新紀錄 */
export type DangerBatchUpdateQuery<B extends Row = Row, L extends Lines = Lines> = Omit<BatchUpdateQuery<B, L>, 'method'> & {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'dangerBatchUpdate';
};

/** 新增紀錄 */
export type InsertQuery<B extends Row = Row, L extends Lines = Lines> = {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'insert';
	/** 表格 */
	table: string;
	/** 紀錄 */
	data: {
		body: {
			[fieldName in keyof B]?: B[fieldName];
		};
		lines?: {
			[lineName in keyof L]?: Array<{ [key in keyof NonNullable<L[lineName]>]?: NonNullable<L[lineName]>[key] }>;
		};
	};
	/** 簽核序數 */
	sequence?: ApprovalSequence;
	/** 建立者，可以是使用者編號或任意字串 */
	user?: string;
	/** 忽略簽核 */
	ignoreApproval?: boolean;
	/** 忽略政策 */
	ignorePolicy?: boolean;
};

/** 批次新增紀錄 */
export interface BatchInsertQuery<B extends Row = Row, L extends Lines = Lines> {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'batchInsert';
	/** 表格 */
	table: string;
	/** 忽略簽核 */
	ignoreApproval?: boolean;
	/** 忽略政策 */
	ignorePolicy?: boolean;
	/** 建立者，可以是使用者編號或任意字串 */
	user?: string;
	/** 批次新增內容 */
	inserts: Array<{
		body: {
			[fieldName in keyof B]?: B[fieldName];
		};
		lines?: {
			[lineName in keyof L]?: Array<{ [key in keyof NonNullable<L[lineName]>]?: NonNullable<L[lineName]>[key] }>;
		};
	}>;
	/** 簽核序數 */
	sequence?: ApprovalSequence;
}

/** 封存紀錄 */
export interface ArchiveQuery {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'archive';
	/** 表格 */
	table: string;
	/** 主鍵 */
	key: {
		/** 主鍵欄位名稱，特殊值 `_id` */
		name: string;
		/** 主鍵欄位值，如果 keyName 為 `_id` 必須為可正整數化文字 */
		value: string;
	};
}

/** 解封存紀錄 */
export interface UnarchiveQuery {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'unarchive';
	/** 表格 */
	table: string;
	/** 主鍵 */
	key: {
		/** 主鍵欄位名稱，特殊值 `_id` */
		name: string;
		/** 主鍵欄位值，如果 keyName 為 `_id` 必須為可正整數化文字 */
		value: string;
	};
}

/** 批次封存紀錄 */
export interface BatchArchiveQuery {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'batchArchive';
	/** 表格 */
	table: string;
	/** 主鍵 */
	archives: Array<{
		key: {
			/** 主鍵欄位名稱，特殊值 `_id` */
			name: string;
			/** 主鍵欄位值，如果 keyName 為 `_id` 必須為可正整數化文字 */
			value: string;
		};
	}>;
}

/** 批次解封存紀錄 */
export interface BatchUnarchiveQuery {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'batchUnarchive';
	/** 表格 */
	table: string;
	/** 主鍵 */
	unarchives: Array<{
		key: {
			/** 主鍵欄位名稱，特殊值 `_id` */
			name: string;
			/** 主鍵欄位值，如果 keyName 為 `_id` 必須為可正整數化文字 */
			value: string;
		};
	}>;
}

/** ECHO 指令 */
export type EchoQuery = {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'echo';
	data: unknown;
};

/** HTTP JSON */
export type FetchQuery = {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'http.json';
	/** URL 路徑 */
	url: string;
	/** http body */
	body?: Record<string, unknown>;
	/** http 標頭 */
	headers?: Record<string, string>;
	/** http 方法 */
	httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** 毫秒，如果設成 0 代表套用 OS 的設定值 */
	timeout?: number;
};

/** 呼叫函數 */
export type CallQuery = {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'call';
	table: string;
	/** 函數名稱 */
	name: string;
	/** 參數 */
	argument: string;
};

/** 呼叫 DocumentDB find */
export type DocDbFindQuery = {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'docdbFind';
	/** 資料庫名稱 */
	db: string;
	/** 集合名稱 */
	collection: string;
	/** 篩選器名稱名稱 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	filter: any;
	/** 篩選器選項 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	findOptions?: any;
};

/** 新增工作 */
export type JobQuery = {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'job';
	/** 表格 */
	table: string;
	/** 函數名稱 */
	function: string;
	/** 執行來源。在 script 中執行來源要是必填的 */
	source: string;
	/** 參數 */
	param?: string;
	/** 工作任務 */
	tasks: Array<{
		/** 待執行的紀錄系統編號 */
		id: string;
		/** 備註 */
		memo?: string;
	}>;
};
/** 新增待辦工作 */
export type TodoJobsQuery = {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'todoJobs';
	data: Array<{
		body: {
			/** 表格名稱 */
			tableName: TableName;
			/** 函數名稱 */
			functionName: string;
			/** 工作產生來源 */
			source: string;
			/** 自訂參數 */
			param?: string;
			/** 工作佇列號碼 */
			queueNo: number;
			/** 工作暫存區 */
			buffer?: string;
			/** 執行狀態 */
			status?: TodoJobStatus | `${TodoJobStatus}`;
			/** 備註 */
			memo?: string;
			/** 重啟自工作歷程 */
			restartFrom?: string;
		};
		lines: {
			items: Array<{
				/** 工作目標編號 */
				targetName: string;
			}>;
		};
		/** 建立者，可以是使用者編號或任意字串 */
	}>;
	user?: string;
};

/** 設定待辦工作 */
export type SetTodoJobQuery = {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'setTodoJob';
	table: TableName;
	jobName: string;
} & TodoJobUpdatableFields;

/** 發布消息 */
export type PublishQuery = {
	/**
	 * @deprecated 不須由應用層指定 method
	 */
	method?: 'publish';
	/** 主題名稱 */
	topicArn: string;
	/** 訊息 */
	message: string;
};

/** 任意查詢 */
export type AnyQuery =
	| EchoQuery
	| InsertQuery
	| BatchInsertQuery
	| FindQuery
	| UpdateQuery
	| BatchUpdateQuery
	| DangerBatchUpdateQuery
	| FetchQuery
	| CallQuery
	| ArchiveQuery
	| UnarchiveQuery
	| DocDbFindQuery
	| TodoJobsQuery
	| SetTodoJobQuery
	| PublishQuery
	| InsertV2Query
	| BatchInsertV2Query
	| FindV2Query
	| UpdateV2Query
	| BatchUpdateV2Query
	| DangerBatchUpdateV2Query
	| ArchiveV2Query
	| UnarchiveV2Query
	| TodoJobsV2Query
	| PublishV2Query
	| BatchArchiveQuery
	| BatchUnarchiveQuery
	| BatchArchiveV2Query
	| BatchUnarchiveV2Query
	| MoveQuery
	| AthenaQuery;

export type AnyMethodQuery = AnyQuery & { method: string };

/** 處理 MySandbox 中的資料庫查詢 */
export interface TypeMyQuery {
	/** 新增紀錄 */
	insert<B extends Row = Row, L extends Lines = Lines>(query: InsertQuery<B, L>): Promise<number>;
	/** 批次新增 */
	batchInsert<B extends Row = Row, L extends Lines = Lines>(query: BatchInsertQuery<B, L>): Promise<number[]>;
	/** 擷取紀錄 */
	find<B extends Row = Row, L extends Lines = Lines, RB extends Row = B, RL extends Lines = L>(
		query: FindQuery<B, L, RB, RL>
	): Promise<Array<SafeRecord<RB, RL>>>;
	/** 更新紀錄 */
	update<B extends Row = Row, L extends Lines = Lines>(query: UpdateQuery<B, L>): Promise<number>;
	/** 批次更新紀錄 */
	batchUpdate<B extends Row = Row, L extends Lines = Lines>(query: BatchUpdateQuery<B, L>): Promise<number[]>;
	/** 不使用 session 批次更新紀錄 */
	dangerBatchUpdate<B extends Row = Row, L extends Lines = Lines>(query: DangerBatchUpdateQuery<B, L>): Promise<number[]>;
	/** 封存紀錄 */
	archive(query: ArchiveQuery): Promise<number>;
	/** 解封存紀錄 */
	unarchive(query: UnarchiveQuery): Promise<number>;
	/** 批次封存紀錄 */
	batchArchive(query: BatchArchiveQuery): Promise<number[]>;
	/** 批次解封存紀錄 */
	batchUnarchive(query: BatchUnarchiveQuery): Promise<number[]>;
	/** HTTP 請求 */
	http(query: FetchQuery): Promise<string>;
	/** 呼叫函數 */
	call(query: CallQuery): Promise<string>;
	/** 呼叫 DocumentDB find */
	docdbFind(query: DocDbFindQuery): Promise<Document>;
	/** 任務v2 - 新增待辦工作，可包含一個到多個工作任務 */
	todoJobs(query: TodoJobsQuery): Promise<number[]>;
	/** 任務v2 - 設定待辦工作 */
	setTodoJob(query: SetTodoJobQuery): Promise<boolean>;
	/** SNS 發布消息 */
	publish(query: PublishQuery): Promise<void>;
	/** Athena SQL 查詢 */
	athena(query: AthenaQuery): Promise<(string | undefined)[][]>;

	//#region V2 端點
	/** 新增紀錄 */
	insertV2<B extends Row = Row, L extends Lines = Lines>(query: InsertV2Query<B, L>): Promise<string>;
	/** 批次新增 */
	batchInsertV2<B extends Row = Row, L extends Lines = Lines>(query: BatchInsertV2Query<B, L>): Promise<string[]>;
	/** 擷取紀錄 */
	findV2<B extends Row = Row, L extends Lines = Lines, RB extends Row = B, RL extends Lines = L>(
		query: FindV2Query<B, L, RB, RL>
	): Promise<Array<SafeRecord2<RB, RL>>>;
	/** 更新紀錄 */
	updateV2<B extends Row = Row, L extends Lines = Lines>(query: UpdateV2Query<B, L>): Promise<string>;
	/** 批次更新紀錄 */
	batchUpdateV2<B extends Row = Row, L extends Lines = Lines>(query: BatchUpdateV2Query<B, L>): Promise<string[]>;
	/** 不使用 session 批次更新紀錄 */
	dangerBatchUpdateV2<B extends Row = Row, L extends Lines = Lines>(query: DangerBatchUpdateV2Query<B, L>): Promise<string[]>;
	/** 封存紀錄 */
	archiveV2(query: ArchiveV2Query): Promise<string>;
	/** 解封存紀錄 */
	unarchiveV2(query: UnarchiveV2Query): Promise<string>;
	/** 批次封存紀錄 */
	batchArchiveV2(query: BatchArchiveV2Query): Promise<string[]>;
	/** 批次解封存紀錄 */
	batchUnarchiveV2(query: BatchUnarchiveV2Query): Promise<string[]>;
	/** 任務v2 - 新增待辦工作，可包含一個到多個工作任務 */
	todoJobsV2(query: TodoJobsV2Query): Promise<string[]>;
	/** SNS 發布消息 */
	publishV2(query: PublishV2Query): Promise<void>;
	/** 移動紀錄 */
	move(query: MoveQuery): Promise<string[]>;
	//#endregion
}

export type InsertV2Query<B extends Row = Row, L extends Lines = Lines> = Omit<InsertQuery<B, L>, 'method'> & {
	method?: 'insertV2';
};
export type BatchInsertV2Query<B extends Row = Row, L extends Lines = Lines> = Omit<BatchInsertQuery<B, L>, 'method'> & {
	method?: 'batchInsertV2';
};
export type FindV2Query<B extends Row = Row, L extends Lines = Lines, RB extends Row = B, RL extends Lines = L> = Omit<
	FindQuery<B, L, RB, RL>,
	'method' | 'filters'
> & {
	method?: 'findV2';
	/** 過濾器 */
	filters?: Array<{
		/** 表頭條件 */
		body?: { [key in keyof (B & BUILTIN_BODY_FIELD2)]?: FieldCondition<NonNullable<(B & BUILTIN_BODY_FIELD2)[key]>> };
		/** 表身條件 */
		lines?: { [lineName in keyof L]?: ConditionMap<L[lineName]> };
	}>;
};
export type UpdateV2Query<B extends Row = Row, L extends Lines = Lines> = Omit<UpdateQuery<B, L>, 'method'> & {
	method?: 'updateV2';
};
export type BatchUpdateV2Query<B extends Row = Row, L extends Lines = Lines> = Omit<BatchUpdateQuery<B, L>, 'method'> & {
	method?: 'batchUpdateV2';
};
export type DangerBatchUpdateV2Query<B extends Row = Row, L extends Lines = Lines> = Omit<DangerBatchUpdateQuery<B, L>, 'method'> & {
	method?: 'dangerBatchUpdateV2';
};
export type ArchiveV2Query = Omit<ArchiveQuery, 'method'> & {
	method?: 'archiveV2';
};
export type UnarchiveV2Query = Omit<UnarchiveQuery, 'method'> & {
	method?: 'unarchiveV2';
};
export type BatchArchiveV2Query = Omit<BatchArchiveQuery, 'method'> & {
	method?: 'batchArchiveV2';
};
export type BatchUnarchiveV2Query = Omit<BatchUnarchiveQuery, 'method'> & {
	method?: 'batchUnarchiveV2';
};
export type JobV2Query = Omit<JobQuery, 'method'> & {
	method?: 'jobV2';
};
export type TodoJobsV2Query = Omit<TodoJobsQuery, 'method'> & {
	method?: 'todoJobsV2';
};
export type PublishV2Query = Omit<PublishQuery, 'method'> & {
	method?: 'publishV2';
};
export type AthenaQuery = {
	method?: 'athena';
	athenaQuery: string;
};
export type MoveQuery<B extends Row = Row, L extends Lines = Lines> = Pick<
	Omit<FindQuery<B, L>, 'method' | 'table'>,
	'session' | 'filters' | 'limit' | 'multiSort'
> & {
	method?: 'move';
	srcTable: string;
	destTable: string;
};
