import { NormFindArgs } from '@norwegianForestTypes';
import { GraphQLNormArgs } from '../../client/@types';
import { cApprovalStatusMap, cArchivedStatusMap } from './consts';

/**
 * 取出 query variables 中 `$` 與 `:` 之間的值\
 * 再將它組合成傳入 api 的 parameter
 * @example
 * input = `$ID: [LongID] $name: String`
 * output = `ID: $ID name: $name`
 */
export function variableStringGenerator(gqlVarString: string): string {
	/**
	 * 不要使用 `?<=`，無法運作於不支援 lookbehind 語法的瀏覽器
	 * https://caniuse.com/#feat=js-regexp-lookbehind
	 */
	return (
		gqlVarString
			.match(/\$(.*?):/g)
			?.map((matchedPattern) => {
				const field = matchedPattern.replace(/^\$/, '').replace(/:$/, '');
				return `${field}: $${field}`;
			})
			.join(' ') || ''
	);
}
/** 依據資料型態或 Enum 前後端差異等做搜尋變數的轉換 */
export function convertNormArgsToGraphQLType<Args extends Partial<NormFindArgs> = NormFindArgs>(
	variables: Args
): GraphQLNormArgs<Args> {
	const { archived, approved, sorting, selects } = variables;
	return {
		...variables,
		selects: selects ? Array.from(new Set(selects)) : void 0,
		// 由於有些表格已經移除 body._id，_id 的 sort 不能再使用 body._id
		sorting: sorting?.field === 'body._id' ? { ...sorting, field: '_id' } : sorting,
		// Enum 前後端使用不同
		archived: archived ? cArchivedStatusMap[archived] ?? 'NORMAL' : 'NORMAL',
		approved: approved ? cApprovalStatusMap[approved] ?? null : null,
	};
}
/**
 * 檢查當前執行環境是否為客戶端
 * @returns {boolean} 如果當前環境為客戶端（瀏覽器）則返回 true，否則返回 false
 */
/**
 * 檢查當前執行環境是否為客戶端
 * @returns 如果為客戶端（瀏覽器）則返回 true，否則 false
 */
export function isClientSide(): boolean {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}
/**
 * 檢查當前執行環境是否為伺服器端
 * @returns {boolean} 如果當前環境為伺服器端（Node.js）則返回 true，否則返回 false
 */
/**
 * 檢查當前執行環境是否為伺服器端
 * @returns 如果為伺服器端（Node.js）則返回 true，否則 false
 */
export function isServerSide(): boolean {
	return typeof window === 'undefined' || typeof localStorage === 'undefined';
}
