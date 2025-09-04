import type * as WebDav from 'webdav';

declare global {
	/** JavaCat 測試工具，請保持使用 any 型別，避免在本專案引入太多沒必要的型別 */
	// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
	var testTools: any;
	/** WebDav 5 開始改放在 Sandbox 的 global context 中 */
	let webdav5: typeof WebDav;
}
