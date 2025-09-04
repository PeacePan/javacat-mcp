import { ASSIGNED_TABLE_NAME } from '../../tables/const';
import {
	ApprovalMode,
	ApprovalStatus,
	CharWidth,
	CronRate,
	DBSource,
	FieldReadWrite,
	FieldType,
	FieldValueType,
	FunctionType,
	HookType,
	IdType,
	LineReadWrite,
	LineType,
	NamingConvention,
	NoWhiteSpace,
	SYSTEM_TABLE_NAME,
	TableSelector,
	TableStorageType,
	TableType,
	TimeGranularity,
} from '../enum';
import {
	BUILTIN_BODY_FIELD,
	BUILTIN_BODY_FIELD2,
	BUILTIN_LINE_FILED,
	BUILTIN_LINE_FILED2,
	NormFindArgs,
	NormUpdateArgs,
	SafeRecord,
	SafeRecord2,
	UnsafeRecord,
	UnsafeRecord2,
} from './';

//#region FieldSchema 表頭欄位定義
/**
 * 表頭欄位定義
 * @template FIELD_NAME 欄位名稱
 * @template ENUM_NAME 列舉
 * @template GROUP_NAME 群組名稱
 */
export type FieldSchema<FIELD_NAME extends string = string, ENUM_NAME extends string = string, GROUP_NAME extends string = string> = {
	//#region 欄位基礎
	/** 欄位名稱 (不可修改) */
	name: FIELD_NAME;
	/** 欄位顯示名稱 */
	displayName: string;
	/**
	 * 欄位描述
	 * 1. 紀錄編輯器移欄位標題 mouseover 顯示
	 */
	description?: string;
	/** 欄位類型 (不可修改) */
	fieldType: FieldType;
	/** 資料型別 (不可修改) */
	valueType: FieldValueType;
	/** 欄位讀寫 */
	readWrite: FieldReadWrite;
	/** 腳本時期表身讀寫 */
	scriptReadWrite?: FieldReadWrite;
	/** 列舉名稱 (限列舉欄位/不可修改) */
	enumName?: ENUM_NAME;
	/** 寫入時允許空值 */
	allowNull?: boolean;
	/** 是否為一 (限表頭欄位/不可修改) */
	unique?: boolean;
	/** 參考表格名稱 (限參考欄位/不可修改) */
	refTableName?: TableName;
	/** 參考欄位名稱 (限參考欄位/不可修改) */
	refFieldName?: string;
	/**
	 * 透過資料庫交易參考
	 * @important 會降低效能
	 * @readWrite UPDATE
	 * @nullable
	 */
	refByTx?: boolean;
	//#region 參考限制
	/** 參考限制欄位 */
	refLimitField?: string;
	//#endregion
	/** 參考列舉顯示名稱欄位 (後端用) */
	refEnumDisplayNameField?: string;
	/** 參考列舉搜尋參數 (前端用) */
	refEnumSearchArguments?: string;
	/**
	 * 限制資料夾 (限參考圖片欄位)
	 * @deprecated
	 */
	limitFolder?: string;
	/** 函數名稱 */
	functionName?: string;
	/** 函數影響欄位(逗號分隔) */
	functionEffectFields?: string;
	//#endregion
	//#region 欄位修飾
	/** 欄位群組名稱 */
	groupName?: GROUP_NAME;
	/** 隱藏欄位 */
	isHidden?: boolean;
	/** 預設顯示欄位 */
	defaultField?: boolean;
	/** 預設顯示關聯欄位 */
	defaultRefField?: string;
	/** 範例值 */
	exampleValue?: string;
	/** 預設值
	 * 只允許輸入字串型別
	 * 如需使用布林、數字、日期皆須使用引號表示(ex. 'true', '123')
	 */
	defaultValue?: string;
	/** 時間顆粒度 */
	timeGranularity?: TimeGranularity;
	/** 時區 */
	timezoneOffset?: number;
	/**
	 * 停用參考資料
	 * @description 表格被參考時，此欄位要不要轉化成參考資料欄位，限表頭欄位
	 */
	disableRefData?: boolean;
	/**
	 * 跳過參考資料
	 * @description 設定參考鍵欄位是否跳過參考資料
	 */
	bypassRefData?: boolean;
	/** 指定要拉出那些參考資料欄位 */
	refDataFields?: string;
	/** 欄位排序 */
	ordering?: number;
	/** 啟用行內編輯 */
	enableInlineEditing?: boolean;
	//#endregion
	//#region 資料驗證
	/** 最小值 */
	numberMin?: number;
	/** 最大值 */
	numberMax?: number;
	/** 最小時間 */
	dateMin?: number;
	/** 最大時間 */
	dateMax?: number;
	/** 電子郵件地址驗證 */
	isEmail?: boolean;
	/** 最大信箱數量 */
	maxEmailCount?: number;
	/** 手機號碼驗證，逗號分隔字串 */
	mobileLocale?: string;
	/** 正規表示式 */
	regExp?: string;
	/** 空白字元檢查 */
	noWhiteSpace?: NoWhiteSpace;
	/** 字元寬度檢查 */
	charWidth?: CharWidth;
	/** 允許字元 */
	allowChar?: string;
	/** 不允許字元 */
	disallowChar?: string;
	/** 最小長度 */
	minLength?: number;
	/** 最大長度 */
	maxLength?: number;
	/** 命名慣例 */
	namingConvention?: NamingConvention;
	//#endregion
	//#region 自動編碼
	/** 固定前綴 */
	autoKeyPrefix?: string;
	/** 動態前綴 (逗點分隔) */
	autoKeyPrefixByField?: string;
	/** 時間字串前墜 */
	autoKeyPrefixByDayjs?: string;
	/** 固定後綴 */
	autoKeySuffix?: string;
	/** 動態後綴 (逗點分隔) */
	autoKeySuffixByField?: string;
	/** 時間字串後綴 */
	autoKeySuffixByDayjs?: string;
	/** 最小位數 */
	autoKeyMinDigits?: number;
	/** 起始號碼 */
	autoKeyInitialNumber?: number;
	/** 使用隨機產生編碼(不可排序) */
	autoKeyNonSerialId?: boolean;
	/** 使用隨機產生編碼(可排序) */
	autoKeySerialId?: boolean;
	/** 使用時間序編碼(可排序) */
	autoKeyTimestampId?: boolean;
	/** 使用固定字串編碼。固定字串編碼需搭配其他動態前後綴設定，才不會編碼衝突 */
	autoKeyFixedString?: string;
	/** 自動編碼的分隔符號 */
	autoKeySep?: string;
	//#endregion
	//#region 多行字串 (前端用來顯示多行文字)
	/** 多行字串 (前端用) */
	isMultipleLine?: boolean;
	/** 可使用 HTML 編輯器編輯多行字串 (前端用) */
	useHTML?: boolean;
	//#endregion
	//#region 多值
	/** 多值 (前端用) */
	multiple?: number;
	//#endregion
	//#region 表格選擇欄位 (前端用)
	/**
	 * 表格選擇器。前端根據這個屬性依照不同的表格部分顯示介面：
	 * 1. 表格名稱: 提供使用者選擇表格名稱
	 * 2. 表頭欄位: 提供使用者選擇表頭欄位
	 * 3. 表身: 提供使用者選擇表身
	 * 4. 表身欄位: 提供使用者選擇表身欄位
	 */
	tableSelector?: TableSelector;
	/**
	 * 表格選擇參考來源
	 * 前端應該參考這裡指定的欄位名稱，從該欄位取使用者當前的輸入值作為表格名稱
	 */
	tableSourceField?: string;
	/**
	 * 表身選擇參考來源
	 * 前端應該參考這裡指定的欄位名稱，從該欄位取使用者當前的輸入值作為表身名稱
	 */
	tableLineSourceField?: string;
	/** 欄位提示文字 (前端用) */
	placeholder?: string;
	//#endregion
	//#region 草稿模式
	draftable?: boolean;
	//#endregion
};
//#endregion

//#region LineFieldSchema 表身欄位定義
/**
 * 表身欄位定義
 * @template LINE_NAME 表身名稱
 * @template LINE_FIELD_NAME 欄位名稱
 * @template ENUM_NAME 列舉
 * @template GROUP_NAME 群組名稱
 */
export type LineFieldSchema<
	LINE_NAME extends string = string,
	LINE_FIELD_NAME extends string = string,
	ENUM_NAME extends string = string,
	GROUP_NAME extends string = string,
> = {
	/** 表身名稱 */
	lineName: LINE_NAME;
	/** 是否為表身鍵 */
	isLineKey?: boolean;
} & FieldSchema<LINE_FIELD_NAME, ENUM_NAME, GROUP_NAME>;
//#endregion

//#region LineSchema 表身定義
/** 表身定義 */
export type LineSchema<LINE_NAME extends string = string> = {
	/** 表身列 ID 類型 */
	idType?: IdType;
	/** 表身名稱 */
	name: LINE_NAME;
	/** 表身顯示名稱 */
	displayName: string;
	/** 表身讀寫 */
	readWrite: LineReadWrite;
	/** 腳本時期表身讀寫 */
	scriptReadWrite?: LineReadWrite;
	/** 複合表身鍵 */
	compoundLineKey?: string;
	/** 排序 */
	ordering?: number;
	/** 反序呈現 */
	isReversed?: boolean;
	/** 批次新增展開欄位 */
	batchAddLineRowBy?: string;
	/** 描述 */
	description?: string;
	/** 表身列編輯時的描述 */
	editDescription?: string;
	/** 是否隱藏 */
	isHidden?: boolean;
	/** 表身列最小數量 */
	minLength?: number;
	/** 表身列最大數量 */
	maxLength?: number;
	/** 資料嵌入類型 */
	lineType?: LineType;
	/** 資料類型擴充時關聯的表格 */
	extTableName?: TABLE_NAMING | SYSTEM_TABLE_NAMING;
	/** 資料類型擴充時的搜尋參數 */
	extSearchArgument?: string;
	/** 資料類型表身是否可以被 mutation */
	isExtMutable?: boolean;
};
//#endregion

//#region EnumSchema 列舉定義
/** 列舉定義 */
export type EnumSchema<ENUM_NAME extends string = string, ENUM_MEMBER extends string = string> = {
	/** 列舉名稱 */
	enumName: ENUM_NAME;
	/** 列舉成員名稱 */
	name: ENUM_MEMBER;
	/** 列舉成員顯示名稱 */
	displayName: string;
	/** 停用 */
	disabled?: boolean;
	/** 描述 */
	description?: string;
};
//#endregion

//#region MyTableFieldGroup 欄位群組定義
/** 欄位群組定義 */
export type MyTableFieldGroup<LINE_NAME extends string = string, GROUP_NAME extends string = string> = {
	/** 所屬表身，null 代表表頭 */
	lineName?: LINE_NAME;
	/** 欄位群組名稱 */
	name: GROUP_NAME;
	/** 排序 */
	ordering?: number;
	/** 備註 */
	memo?: string;
};
//#endregion

//#region MyTablePolicy 政策定義
/** 政策定義 */
export type MyTablePolicy = {
	/** 政策名稱 */
	name: string;
	/** 政策指令碼 */
	script: string;
	/** 備忘 */
	memo?: string;
};
//#endregion

//#region MyTableHook 表格掛勾
/** 掛勾事件 */
export type MyTableHook = {
	/** 掛勾類型 */
	type: HookType;
	/** 掛勾名稱 */
	name: string;
	/** 表身名稱。如果不指定就是表頭 */
	lineName?: string;
	/**
	 * 掛勾指令碼，應預設匯出函數，函數應回傳物件
	 * @example 如果 `type` 為 MAPPING
	 * module.exports = (row: Record<string, FIELD_VALUE_TYPE>) => { return row }
	 * @example 如果 `type` 為 AFTER_INSERT
	 * module.exports = (record: SafeRecord) => { return null }
	 */
	script: string;
	/** 備忘 */
	memo?: string;
};
//#endregion

//#region 表格簽核路徑
/** 表格簽核路徑 */
export type MyTableApprovalChain = {
	/** 規則編號 */
	name: string;
	/** 簽核鏈名稱 */
	ruleName: string;
	/** 簽核階段 */
	stage: number;
	/** 角色 */
	role: string;
	/** 腳本 */
	script?: string;
	/** 備註 */
	memo?: string;
	/** 簽核提醒 */
	reminder?: string;
};
//#endregion

//#region 表格共用函式庫
/** 表格共用函式庫 */
export type MyTableLib = {
	/** 命名空間。在 script 中可以用這個名字存取共用函式庫的函式 */
	name: keyof typeof global;
	/** 腳本 */
	script: string;
	/** 備註 */
	memo?: string;
};
//#endregion

//#region 表格函數 MyTableFunction
/** 表格函數 */
export type MyTableFunction = {
	/** 函數名稱 */
	name: string;
	/** 函數指令碼 */
	script: string;
	/** 函數類型 */
	type?: FunctionType;
	/** 是否公開(前端用) */
	isPublic?: boolean;
	/** 可擇量執行(前端用) */
	isBulk?: boolean;
	/** 執行前忽略簽核狀態。預設值: false */
	ignoreApproval?: boolean;
	/** 備註 */
	memo?: string;
	/**
	 * 在中台是否能允許批次執行 \
	 * 啟用後會出現在 `批次作業` 的下拉選單中
	 */
	isBatchable?: boolean;
	/** 函式群組，在中台會將相同群組的函式顯示在一起 */
	group?: string;
	/** 待辦工作重試次數。預設值: 0 */
	onJobRetry?: number;
};
//#endregion

//#region 表格函數參數 MyTableFunctionArgument
/** 表格函數參數 */
type MyTableFunctionArgument = Omit<
	FieldSchema,
	| 'refEnumDisplayNameField'
	| 'refEnumSearchArguments'
	| 'unique'
	| 'isHidden'
	| 'defaultField'
	| 'defaultValue'
	| 'disableRefData'
	| 'bypassRefData'
	| 'autoKeyPrefix'
	| 'autoKeyPrefixByField'
	| 'autoKeySuffix'
	| 'autoKeySuffixByField'
	| 'autoKeyMinDigits'
	| 'autoKeyInitialNumber'
	| 'autoKeyNonSerialId'
	| 'autoKeySerialId'
	| 'autoKeyTimestampId'
	| 'scriptReadWrite'
	| 'functionName'
> & {
	/** 函數名稱 */
	functionName: string;
	/** 表身名稱；`null` 代表表頭 */
	lineName: string | null;
	/** 參數名稱 */
	name: string;
	/** 欄位類型 (不可修改) */
	fieldType: FieldType.DATA | FieldType.REF_KEY;
	/** 欄位讀寫 */
	readWrite: FieldReadWrite.INSERT;
};
//#endregion

//#region 表格排程 MyTableCron
/** 表格排程 */
export type MyTableCron = {
	/** 排程名稱 noWhiteSpace=ALL */
	name: string;
	/** 指令碼 */
	script: string;
	/** 函數名稱
	 * @description 唯有使用待辦工作時可以不設定
	 */
	functionName?: string;
	/** 速率
	 * @description 唯有使用待辦工作且手動設定排程執行條件時可以不設定
	 */
	rate?: CronRate;
	/** 指定特定時間執行，只在 CronRate.DAILY 時生效 */
	atUtcTime?: string;
	/** 備註 */
	memo?: string;
	/**
	 * 是否使用待辦工作
	 * @deprecated
	 * */
	useTodoJob?: boolean;
	/** 排程群組 */
	group?: string;
};
//#endregion

//#region
/** 查詢提示 */
export type MyTableSearchSuggestions = {
	/** 編號 */
	name?: string;
	/** 顯示名稱 */
	displayName?: string;
	/** 預設查詢
	 * @description 內容設置方式同預設查詢 */
	searchArgument?: string;
};
//#endregion

//#region 表格表頭 MyTableBody
/** 表格定義表頭 */
export type MyTableBody = {
	/** 表格名稱 */
	name: TABLE_NAMING;
	/** 顯示名稱 */
	displayName: string;
	/**
	 * 表格類型
	 * @default `DATA`
	 */
	type: TableType;
	/**
	 * 表格儲存類型
	 * @default `PHYSICAL`
	 */
	storageType?: TableStorageType;
	/** 版本號 (後端專用/系統產生) */
	version?: number;
	/** 表格架構版本號 (後端判斷架構使用) */
	schemaVer?: string;
	/** 說明 */
	description?: string;
	/** 群組 */
	group?: string;
	/** 排序 */
	ordering?: number;
	/** 圖示 */
	icon?: string;
	/** 工作佇列數量 */
	jobQueues?: string;
	/** 啟用簽核 */
	enableApproval2?: boolean;
	/** 簽核模式。嚴格簽核模式下，簽核意見必填 & 禁止批次簽核 */
	approvalMode?: ApprovalMode;
	/** 指定紀錄編號 */
	nameField?: string;
	/** 指定紀錄顯示名稱欄位 */
	displayNameField?: string;
	/** 變更單來源表格 */
	source?: string;
	/** 批次下載大小，不設定=不限制 */
	downloadBatchSize?: number;
	/** 限定變更單表頭欄位，逗號分隔 */
	limitedBodyFields?: string;
	/** 限定變更單表身欄位，逗號分隔 */
	limitedLineFields?: string;
	/** 紀錄 ID 類型 */
	idType?: IdType;
	/** 預設查詢 (JSON 字串)，解析後的型別 @see ParsedDefaultSearchArgument */
	defaultSearchArgument?: string;
	/** 發布控制 */
	publishOn?: string;
	/** 資料庫來源 @default `DOCUMENTDB` */
	dbSource?: DBSource;
	/** 資料庫表格名稱 */
	dbTableName?: string;
	/** 支援排程v2
	 * @description 取代原 producer() 機制
	 */
	enableCron?: boolean;
	/** 是否為公開表格 */
	isPublicTable?: boolean;
};
/** 表格表頭中預設查詢 defaultSearchArgument 解析後的格式 */
export type ParsedDefaultSearchArgument = Partial<Pick<NormFindArgs, 'approved' | 'archived' | 'filters' | 'multiSort' | 'expand'>>;
//#endregion

//#region 表格表身 MyTableLines
export type MyTableLines<
	BODY_FIELD_NAME extends string = string,
	LINE_NAME extends string = string,
	LINE_FIELD_NAME extends string = string,
	ENUM_NAME extends string = string,
	ENUM_MEMBER extends string = string,
	GROUP_NAME extends string = string,
> = {
	/** 表頭欄位 */
	bodyFields: FieldSchema<BODY_FIELD_NAME | keyof BUILTIN_BODY_FIELD, ENUM_NAME>;
	/** 表身欄位 */
	lineFields?: LineFieldSchema<LINE_NAME, LINE_FIELD_NAME | keyof BUILTIN_LINE_FILED, ENUM_NAME, GROUP_NAME>;
	/** 表身 */
	lines?: LineSchema<LINE_NAME>;
	/** 列舉 */
	enums?: EnumSchema<ENUM_NAME, ENUM_MEMBER>;
	/** 欄位群組 */
	fieldGroups?: MyTableFieldGroup<LINE_NAME, GROUP_NAME>;
	/** 政策 */
	policies?: MyTablePolicy;
	/** 掛勾 */
	hooks?: MyTableHook;
	/** 函數 */
	functions?: MyTableFunction;
	/** 函數參數 */
	arguments?: MyTableFunctionArgument;
	/** 排程 */
	crons?: MyTableCron;
	/** 簽核簽核路徑 */
	approvalChain?: MyTableApprovalChain;
	/** 共用函式庫 */
	libs?: MyTableLib;
	/** 查詢提示 */
	searchSuggestions?: MyTableSearchSuggestions;
};
//#endregion

//#region 安全的表格型別 SafeMyTable
/**
 * 安全的表格定義型別
 * @template BODY_FIELD_NAME 表頭欄位名稱
 * @template LINE_NAME 表身名稱
 * @template LINE_FIELD_NAME 表身欄位名稱
 * @template ENUM_NAME 列舉名稱
 * @template ENUM_MEMBER 列舉成員
 * @template GROUP_NAME 欄位群組名稱
 */
export type SafeMyTable<
	BODY_FIELD_NAME extends string = string,
	LINE_NAME extends string = string,
	LINE_FIELD_NAME extends string = string,
	ENUM_NAME extends string = string,
	ENUM_MEMBER extends string = string,
	GROUP_NAME extends string = string,
> = SafeRecord<MyTableBody, MyTableLines<BODY_FIELD_NAME, LINE_NAME, LINE_FIELD_NAME, ENUM_NAME, ENUM_MEMBER, GROUP_NAME>>;
//#endregion

//#region 不安全的表格型別 UnsafeMyTable
/**
 * 不安全的表格定義型別
 * @template BODY_FIELD_NAME 表頭欄位名稱
 * @template LINE_NAME 表身名稱
 * @template LINE_FIELD_NAME 表身欄位名稱
 * @template ENUM_NAME 列舉名稱
 * @template ENUM_MEMBER 列舉成員
 * @template GROUP_NAME 欄位群組名稱
 */
export type UnsafeMyTable<
	BODY_FIELD_NAME extends string = string,
	LINE_NAME extends string = string,
	LINE_FIELD_NAME extends string = string,
	ENUM_NAME extends string = string,
	ENUM_MEMBER extends string = string,
	GROUP_NAME extends string = string,
> = UnsafeRecord<MyTableBody, MyTableLines<BODY_FIELD_NAME, LINE_NAME, LINE_FIELD_NAME, ENUM_NAME, ENUM_MEMBER, GROUP_NAME>>;
//#endregion

//#region TABLE_TABLE_FIELD_GROUP 表格表格欄位群組名稱
/** 欄位群組名稱 */
export enum TABLE_TABLE_FIELD_GROUP {
	VALIDATION = '資料驗證',
	AUTO_KEY = '自動編碼',
}
//#endregion

//#region SafeMyTableMyTable 表格的表格的型別
/** 表格的表格的型別 */
export type SafeMyTableMyTable = SafeMyTable<
	keyof UnsafeMyTable['body'],
	keyof UnsafeMyTable['lines'],
	| keyof LineFieldSchema
	| keyof EnumSchema
	| keyof LineSchema
	| keyof MyTablePolicy
	| keyof MyTableHook
	| keyof MyTableFunctionArgument
	| keyof MyTableCron
	| keyof MyTableFunction
	| keyof MyTableApprovalChain
	| keyof MyTableSearchSuggestions,
	| 'type'
	| 'fieldType'
	| 'fieldValueType'
	| 'fieldReadWrite'
	| 'timeGranularity'
	| 'noWhiteSpace'
	| 'charWidth'
	| 'lineReadWrite'
	| 'namingConvention'
	| 'hookType'
	| 'cronRate'
	| 'tableSelector'
	| 'functionType'
	| 'approvalMode'
	| '_approvalStatus'
	| 'lineType'
	| 'publishOn'
	| 'dbSource',
	| TableType
	| FieldType
	| FieldValueType
	| FieldReadWrite
	| TimeGranularity
	| NoWhiteSpace
	| CharWidth
	| LineReadWrite
	| NamingConvention
	| HookType
	| CronRate
	| TableSelector
	| FunctionType
	| ApprovalMode
	| ApprovalStatus
	| LineType
	| EventType
	| DBSource,
	string
>;
//#endregion

/** 更新紀錄 */
export type UpdateRecord = {
	/** 紀錄資料 */
	data: NormUpdateArgs['data'][number];
	/** 交易會話 */
	session?: unknown;
	/** 使用者編號 */
	user?: string;
	/** GraphQL 資料路徑 */
	path?: string;
	/** 忽略簽核 */
	ignoreApproval?: boolean;
	/** 忽略政策 */
	ignorePolicy?: boolean;
	/** 跳過紀錄 */
	bypassLogging?: boolean;
	/** 試跑 */
	dryRun?: boolean;
};

//#region string _id 相關
/** 表格表身 MyTableLines */
export type MyTableLines2<
	BODY_FIELD_NAME extends string = string,
	LINE_NAME extends string = string,
	LINE_FIELD_NAME extends string = string,
	ENUM_NAME extends string = string,
	ENUM_MEMBER extends string = string,
	GROUP_NAME extends string = string,
> = {
	/** 表頭欄位 */
	bodyFields: FieldSchema<BODY_FIELD_NAME | keyof BUILTIN_BODY_FIELD2, ENUM_NAME>;
	/** 表身欄位 */
	lineFields?: LineFieldSchema<LINE_NAME, LINE_FIELD_NAME | keyof BUILTIN_LINE_FILED2, ENUM_NAME, GROUP_NAME>;
	/** 表身 */
	lines?: LineSchema<LINE_NAME>;
	/** 列舉 */
	enums?: EnumSchema<ENUM_NAME, ENUM_MEMBER>;
	/** 欄位群組 */
	fieldGroups?: MyTableFieldGroup<LINE_NAME, GROUP_NAME>;
	/** 政策 */
	policies?: MyTablePolicy;
	/** 掛勾 */
	hooks?: MyTableHook;
	/** 函數 */
	functions?: MyTableFunction;
	/** 函數參數 */
	arguments?: MyTableFunctionArgument;
	/** 排程 */
	crons?: MyTableCron;
	/** 簽核簽核路徑 */
	approvalChain?: MyTableApprovalChain;
	/** 共用函式庫 */
	libs?: MyTableLib;
	/** 查詢提示 */
	searchSuggestions?: MyTableSearchSuggestions;
};
/**
 * 安全的表格定義型別
 * @template BODY_FIELD_NAME 表頭欄位名稱
 * @template LINE_NAME 表身名稱
 * @template LINE_FIELD_NAME 表身欄位名稱
 * @template ENUM_NAME 列舉名稱
 * @template ENUM_MEMBER 列舉成員
 * @template GROUP_NAME 欄位群組名稱
 */
export type SafeMyTable2<
	BODY_FIELD_NAME extends string = string,
	LINE_NAME extends string = string,
	LINE_FIELD_NAME extends string = string,
	ENUM_NAME extends string = string,
	ENUM_MEMBER extends string = string,
	GROUP_NAME extends string = string,
> = SafeRecord2<MyTableBody, MyTableLines2<BODY_FIELD_NAME, LINE_NAME, LINE_FIELD_NAME, ENUM_NAME, ENUM_MEMBER, GROUP_NAME>>;
/**
 * 不安全的表格定義型別
 * @template BODY_FIELD_NAME 表頭欄位名稱
 * @template LINE_NAME 表身名稱
 * @template LINE_FIELD_NAME 表身欄位名稱
 * @template ENUM_NAME 列舉名稱
 * @template ENUM_MEMBER 列舉成員
 * @template GROUP_NAME 欄位群組名稱
 */
export type UnsafeMyTable2<
	BODY_FIELD_NAME extends string = string,
	LINE_NAME extends string = string,
	LINE_FIELD_NAME extends string = string,
	ENUM_NAME extends string = string,
	ENUM_MEMBER extends string = string,
	GROUP_NAME extends string = string,
> = UnsafeRecord2<MyTableBody, MyTableLines2<BODY_FIELD_NAME, LINE_NAME, LINE_FIELD_NAME, ENUM_NAME, ENUM_MEMBER, GROUP_NAME>>;
/** 表格的表格的型別 */
export type SafeMyTableMyTable2 = SafeMyTable2<
	keyof UnsafeMyTable2['body'],
	keyof UnsafeMyTable2['lines'],
	| keyof LineFieldSchema
	| keyof EnumSchema
	| keyof LineSchema
	| keyof MyTablePolicy
	| keyof MyTableHook
	| keyof MyTableFunctionArgument
	| keyof MyTableCron
	| keyof MyTableFunction
	| keyof MyTableApprovalChain,
	| 'type'
	| 'fieldType'
	| 'fieldValueType'
	| 'fieldReadWrite'
	| 'timeGranularity'
	| 'noWhiteSpace'
	| 'charWidth'
	| 'lineReadWrite'
	| 'namingConvention'
	| 'hookType'
	| 'cronRate'
	| 'tableSelector'
	| 'functionType'
	| 'approvalMode'
	| '_approvalStatus',
	| TableType
	| FieldType
	| FieldValueType
	| FieldReadWrite
	| TimeGranularity
	| NoWhiteSpace
	| CharWidth
	| LineReadWrite
	| NamingConvention
	| HookType
	| CronRate
	| TableSelector
	| FunctionType
	| ApprovalMode
	| ApprovalStatus,
	string
>;
//#endregion

//#region 表格名稱 literal
/**
 * 一般表格名稱命名規格
 * NOTE: 如果以後 trim 實裝後可以加入讓型別更強健
 * @issue https://github.com/microsoft/TypeScript/issues/41283
 */
type NORMAL_TABLE_NAMING = Lowercase<string>;
/** 系統表格名稱命名規格 */
type SYSTEM_TABLE_NAMING = `__${Lowercase<string>}__`;
/** 表格名稱命名規格 */
export type TABLE_NAMING = NORMAL_TABLE_NAMING | SYSTEM_TABLE_NAMING;
/**
 * 目前可用的所有表格名稱型別，\
 * 一般來說會直接使用 TABLE_NAME 與 SYSTEM_TABLE_NAME 列舉內的表格名稱，\
 * 但有些測試會直接輸入測試用的表格名稱字串，所以需要再加上 TABLE_NAMING 與 SYSTEM_TABLE_NAMING 型別
 */
export type TableName = ASSIGNED_TABLE_NAME | (typeof SYSTEM_TABLE_NAME)[keyof typeof SYSTEM_TABLE_NAME];
//#endregion
