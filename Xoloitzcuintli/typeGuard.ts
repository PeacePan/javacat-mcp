import { AnyObject, Keyof } from "./interface";
import { ObjectKeys } from "./util";

/**
 * 判斷是不是 string array
 * @param para 要檢查的陣列資料
 */
export const isStringArray = (para: any): para is string[] => {
	return para instanceof Array && typeof para[0] === "string";
};

/**
 * 物件陣列資料 TypeGuard
 * @param objectArray 要檢查的物件陣列資料
 * @param requiredKeys 物件資料內必須的欄位，輸入 `[]` 的話則無條件視為成立
 */
export function isSpecificObjectArray<T extends AnyObject>(
	objectArray: any[],
	requiredKeys: Keyof<T>[]
): objectArray is T[] {
	if (!Array.isArray(objectArray)) return false;
	if (objectArray.length === 0) return true;
	return isSpecificObject<T>(objectArray[0], requiredKeys);
}
/**
 * 物件資料 TypeGuard
 * @param objectArray 要檢查的物件資料
 * @param requiredKeys 物件資料內必須的欄位，輸入 `[]` 的話則無條件視為成立
 */
export function isSpecificObject<T extends AnyObject>(
	object: any,
	requiredKeys: Keyof<T>[]
): object is T {
	if (typeof object !== "object") return false;
	/** null 會是 object 但視為資料 */
	if (object === null) return true;
	const keys = ObjectKeys<T>(object);
	return requiredKeys.every((requiredKey) => keys.includes(requiredKey));
}
