/** 不是 null 也不是 undefined */
export function isValid<InputType = unknown>(
	input: InputType
): input is NonNullable<InputType> {
	return input !== null && input !== undefined;
}
/** 是 null 或 undefined */
export function isInValid(input: unknown): input is null | undefined {
	return input === null || input === undefined;
}
/** 有效物件 */
export function isValidObject(obj: unknown): obj is NonNullable<object> {
	return typeof obj === 'object' && isValid(obj);
}
/** 非空字串的字串 */
export function isValidString(input: unknown): input is string {
	return typeof input === 'string' && input.length > 0;
}
/** 合法的數字 */
export function isValidNumber(input: unknown): input is number {
	return typeof input === 'number' && !isNaN(input) && isFinite(input);
}
/** 空字串的字串 */
export function isEmptyString(input: unknown): input is '' {
	return typeof input === 'string' && input.length === 0;
}
/**
 * 判斷是否為 `/` 或 `http` 開頭的連結
 * @param value 要檢測的字串
 */
export function isLink(value: string | undefined | null): value is string {
	if (!value) return false;
	return /^(\/|https?:\/\/)/.test(value);
}

/** 是否為客戶端 */
export const isClientSide = () =>
	typeof window !== 'undefined' && 'document' in window;
/** 是否為伺服器端 */
export const isServerSide = () => !isClientSide();
