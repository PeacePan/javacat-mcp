import { ApprovalStatus, ArchivedStatus, ConditionOperator, NormFieldValueType } from '../enum';
import { UserBody } from './systemTable';

//#region Generalized
/** 一般化欄位 */
export type GeneralizedField = {
	/** 欄位名稱 */
	name: string;
	/** 欄位值類型 */
	type: NormFieldValueType;
	/** 布林值 */
	boolean?: boolean | null;
	/** 字串值 */
	string?: string | null;
	/** 數值 */
	number?: number | null;
	/** 日期時間值 */
	date?: Date | null;
	/** ID值，視為字串 */
	id?: string | null;
};
/** 一般化表身列 */
export type GeneralizedLineRow = {
	/** 表身名稱 */
	line: string;
	/** 表身欄位 */
	fields: Array<GeneralizedField>;
};
/** 一般化紀錄 */
export type GeneralizedRecord = {
	/** 正規化表頭 */
	body: Array<GeneralizedField>;
	/** 正規化表身 */
	lines: Array<GeneralizedLineRow>;
};
//#endregion

//#region InsertArgs
/** 新增參數 */
export type InsertArgs = {
	/** 表格名稱 */
	table: string;
	/** 批次新增資料 */
	data: Array<GeneralizedRecord>;
	/** 簽核主旨 */
	approvalSubject?: string;
	/** 簽核說明 */
	approvalDescription?: string;
};
//#endregion

//#region PatchArgs
/** 紀錄定位 */
export type RecordLocator = {
	key: {
		/** 鍵欄位名稱，特殊值 `_id` */
		name: string;
		/** 鍵欄位值，如果 keyName 為 `_id` 必須為可正整數化文字 */
		value: string;
	};
};
/** 正規化更新紀錄 */
export type GeneralizedPatchRecord = RecordLocator & GeneralizedRecord;
/** 差異更新參數 */
export type PatchArgs = {
	/** 表格名稱 */
	table: string;
	/** 批次差異更新資料 */
	data: Array<GeneralizedPatchRecord>;
};
//#endregion

//#region ExecuteArgs
/** mutation.execute 的參數 */
export type ExecuteArgs = {
	/** 表格名稱 */
	table: string;
	/** 主鍵 */
	key: {
		/** 主鍵名稱 */
		name: string;
		/** 主鍵值 */
		value: string;
	};
	/** 函數名稱 */
	name: string;
	/** 參數 */
	argument?: GeneralizedRecord;
	/** 忽略簽核檢查 */
	ignoreApproval?: boolean;
	/** 忽略封存檢查 */
	ignoreArchive?: boolean;
	/** 其他參數 */
	param?: string;
};
//#endregion

//#region CallArgs
/** mutation.call 的參數 */
export type CallArgs = {
	/** 表格名稱 */
	table: string;
	/** 函數名稱 */
	name: string;
	/** 參數 */
	argument: string;
};
//#endregion

//#region NormFindArgs
/** 正規化搜尋條件 */
export type GeneralizedCondition = GeneralizedField & {
	/** 運算子，只有 `in` `like` 會聚合 */
	operator: ConditionOperator;
};
export type GeneralizedLineCondition = {
	/** 表身名稱 */
	name: string;
	/** 條件 */
	conditions: Array<GeneralizedCondition>;
};
/** 正規化過濾器 */
export type GeneralizedFilter = {
	/** 表頭欄位條件 */
	body?: Array<GeneralizedCondition>;
	/** 表身條件 */
	lines?: Array<GeneralizedLineCondition>;
};
/**
 * 正規化搜尋
 */
export interface FindArgs {
	/** 表格名稱 */
	table: string;
	/** 過濾器 */
	filters?: Array<GeneralizedFilter>;
	/** 簽核狀態 `null` 代表不限制 */
	approved?: ApprovalStatus | null;
	/** 封存狀態 */
	archived?: ArchivedStatus | `${ArchivedStatus}`;
	/** 限制 */
	constraints?: FindArgs['filters'];
	/** 偏移量 */
	offset?: number;
	/**
	 * 回傳筆數
	 * @default 50
	 */
	limit?: number;
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
	multiSort?: Array<FindArgsSortingCondition>;
	/**
	 * 展開表身列名稱
	 */
	expand?: string;
}
/** 正規化搜尋之排序條件
 * @field 完整欄位名稱 eg "_id" "body.name"
 * @direction 方向 1: 升冪 -1: 降冪
 */
export type FindArgsSortingCondition<F extends string = string> = {
	field: F;
	direction: 1 | -1;
};
//#endregion

//#region SigninArgs
/** 使用驗證碼登入相關輸入參數 */
export type SigninArgs = Omit<OneTimePasswordArgs, 'dangerOTP'> & Pick<UserBody, 'otp'>;

/** 產生驗證碼相關輸入參數 */
export type OneTimePasswordArgs = Pick<UserBody, 'name' | 'email' | 'mobile'> & {
	/** 直接指定驗證碼，用於測試環境 */
	dangerOTP?: string;
};
/** 令牌登入參數 */
export type SigninByTokenArgs = {
	accessKeyId: string;
	secretAccessKey: string;
};
//#endregion

//#region ServerError
/** Server 端回傳的錯誤結構 */
export type ServerError = {
	/** 錯誤代碼定義 */
	extensions: {
		/** 錯誤代碼 */
		code: string;
		/** 例外錯誤堆疊追蹤 */
		exception: {
			/** 伺服器端的錯誤堆疊路徑 */
			stacktrace: string[];
		};
	};
	/** 伺服器端的錯誤發生的代碼位置 */
	localtions: Array<{
		/** 第幾行 */
		line: number;
		/** 第幾欄 */
		column: number;
	}>;
	/** 錯誤訊息 */
	message: string;
};
/** GraphQL Server 自行 catch 錯誤回傳的自定義錯誤回傳格式 */
export type GraphQLServerResult = {
	/** 錯誤資訊 */
	errors: ServerError[];
	/** 從伺服器回傳的錯誤狀態碼 */
	statusCode: number;
	/** 總結錯誤訊息 */
	message: string;
	/** 錯誤堆疊 */
	stack: string;
};
//#endregion
