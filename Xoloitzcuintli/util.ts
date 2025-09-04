import { AnyObject, Keyof } from "./interface";
import { isServerSide, isValidObject, isValidString } from "./validator";

/** 列表 key 值，因為 typescript native js typeing 沒有考量到 keyof */
export function ObjectKeys<T extends AnyObject>(
	obj: T | undefined | null
): Array<Extract<Keyof<T>, string>> {
	if (!obj) return [];
	return Object.keys(obj) as Array<Extract<Keyof<T>, string>>;
}
/**
 * 安全的轉換 JSON 而不會轉換失敗時擲出錯誤，無法轉換時會回傳預設值
 * @param jsonString 要轉換的 json 字串
 * @param defaultValue 轉換失敗時，回傳的預設值
 */
export function safetyParseJSON<T = unknown>(
	jsonString: string | null | undefined,
	defaultValue: T,
	traceParseError = false
): T {
	if (!isValidString(jsonString)) return defaultValue;
	try {
		return JSON.parse(jsonString);
	} catch (err) {
		if (traceParseError) {
			console.warn(`"${jsonString}" 無法轉換為 JSON 物件`);
			console.warn(err);
		}
		return defaultValue;
	}
}
/**
 * 如果屬性的值是 undefined 就填上 null
 * @param obj 目標物件
 * @param key 屬性名稱
 * @note 如果 obj 不是有效物件則不會有任何副作用
 */
export function fillNull<T>(obj: T, key: string): T {
	if (isValidObject(obj) && obj[key] === undefined) {
		obj[key] = null;
	}
	return obj;
}
/**
 * 移除掉物件內指定的欄位資料，使用情境類似 { value, ...remain } = obj
 * 但 value 不會被使用卻要過濾，使用此函式可避免沒必要的變數宣告
 */
export function omitProperties<
	T extends AnyObject,
	OmitKeys extends Keyof<T> = Keyof<T>
>(obj: T, keys: OmitKeys | OmitKeys[]): Omit<T, OmitKeys> {
	const omitted = { ...obj };
	if (typeof keys === "string") {
		delete omitted[keys];
	} else if (Array.isArray(keys)) {
		for (const key of keys) delete omitted[key];
	}
	return omitted;
}
/** 嘗試轉換資料成整數，轉換失敗會回傳 null */
export function tryParseInt(value: unknown): number | null {
	if (typeof value === "number") return value;
	const int = typeof value === "string" ? parseInt(value, 10) : NaN;
	return isNaN(int) ? null : int;
}
/** 嘗試轉換資料成浮點數，轉換失敗會回傳 null */
export function tryParseFloat(value: unknown): number | null {
	if (typeof value === "number") return value;
	const float = typeof value === "string" ? parseFloat(value) : NaN;
	return isNaN(float) ? null : float;
}
/** 嘗試轉換資料成日期，只有可格式化的日期字串與日期物件才會回傳 Date，其餘類型或轉換失敗會回傳 null */
export function tryParseDate(value: unknown): Date | null {
	if (!(value instanceof Date || typeof value === "string")) return null;
	const unitTime =
		typeof value === "string" ? Date.parse(value) : value.getTime();
	return isNaN(unitTime) ? null : new Date(unitTime);
}
/**
 * 瀏覽器內非同步載入 script \
 * 相同的 src 如果已經掛載則不會再掛載 script
 * @param src - script 資源位址
 * @param id - 指定 script 的 id
 */
export async function loadScript(
	src: string,
	id?: string
): Promise<HTMLScriptElement> {
	return new Promise<HTMLScriptElement>((resolve, reject) => {
		if (isServerSide()) return reject(new Error("不支援 Server Side 呼叫"));
		let script = document.querySelector<HTMLScriptElement>(
			id ? `script#${id}` : `script[src^="${src}"]`
		);
		const handleLoaded = () => {
			script?.setAttribute("data-loaded", "true");
			script?.removeEventListener("error", handleError);
			resolve(script!);
		};
		const handleError = () => {
			script?.removeEventListener("load", handleLoaded);
			reject(new Error("載入 script 發生錯誤"));
		};
		/** 相同的 link url 資源已經掛載至 DOM 上無需再處理 */
		if (script) {
			if (script.getAttribute("data-loaded") === "true") {
				resolve(script);
			} else {
				script.addEventListener("load", handleLoaded, { once: true });
				script.addEventListener("error", handleError, { once: true });
			}
			return;
		}
		script = document.createElement("script");
		if (id) script.id = id;
		script.async = script.defer = true;
		script.addEventListener("load", handleLoaded, { once: true });
		script.addEventListener("error", handleError, { once: true });
		script.setAttribute("data-loaded", "false");
		script.src = src;
		document.head.appendChild(script);
	});
}
/**
 * 瀏覽器內非同步載入 css 樣式表 \
 * 相同的 href 如果已經掛載則不會再掛載 link
 * @param href - 樣式表資源位址
 * @param id - 指定元素 link 的 id
 */
export async function loadStyle(
	href: string,
	id?: string
): Promise<HTMLLinkElement> {
	return new Promise<HTMLLinkElement>((resolve, reject) => {
		if (isServerSide()) return reject(new Error("不支援 Server Side 呼叫"));
		let link = document.querySelector<HTMLLinkElement>(
			id ? `link#${id}` : `link[href^="${href}"]`
		);
		const handleLoaded = () => {
			link?.setAttribute("data-loaded", "true");
			link?.removeEventListener("error", handleError);
			resolve(link!);
		};
		const handleError = () => {
			link?.removeEventListener("load", handleLoaded);
			reject(new Error("載入樣式表發生錯誤"));
		};
		/** 相同的 link url 資源已經掛載至 DOM 上無需再處理 */
		if (link) {
			if (link.getAttribute("data-loaded") === "true") {
				resolve(link);
			} else {
				link.addEventListener("load", handleLoaded, { once: true });
				link.addEventListener("error", handleError, { once: true });
			}
			return;
		}
		link = document.createElement("link");
		if (id) link.id = id;
		link.addEventListener("load", handleLoaded, { once: true });
		link.addEventListener("error", handleError, { once: true });
		link.setAttribute("data-loaded", "false");
		link.rel = "stylesheet";
		link.href = href;
		document.head.appendChild(link);
	});
}
