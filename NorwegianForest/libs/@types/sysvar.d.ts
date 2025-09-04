/** 系統變數表頭 */

export type SysVarBody = {
	/** 變數編號 */
	name: string;
	/** 變數類型 */
	type: string;
	/** 變數子類型 */
	subtype?: string;
	/** 表格名稱 */
	tableName: string;
	/** 啟用中 */
	enabled: boolean;
	/** 變數名稱 */
	varName: string;
	/** 變數值1 */
	value1?: string;
	/** 變數值2 */
	value2?: string;
	/** 變數值3 */
	value3?: string;
	/** 變數值4 */
	value4?: string;
	/** 變數值5 */
	value5?: string;
};
