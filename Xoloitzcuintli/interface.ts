/** 任意 JS 物件 */
export type AnyObject = Record<string, any>;
/** 空物件 */
export type EmptyObject = Record<never, never>;
/**
 * 將 type 中指定的 properties 轉成必填，其餘為可選
 * @ref
 * https://stackoverflow.com/questions/48230773/how-to-create-a-partial-like-that-requires-a-single-property-to-be-set/48244432
 */
export type AtLeast<T, K extends Keyof<T>> = Partial<T> & Pick<T, K>;

/**
 * 讓指定的 field 變成可選
 * @ref https://stackoverflow.com/questions/43159887/make-a-single-property-optional-in-typescript
 */
export type PartialBy<T, K extends Keyof<T>> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 只抓出指定類型的欄位
 * @type Fields 欄位物件型別
 * @type Type 指定欄位類型
 */
export type SpecificFieldsOnly<
	Fields extends Record<string, unknown>,
	Type = any
> = NonNullable<
	{
		[FieldName in Keyof<Fields>]: NonNullable<Fields[FieldName]> extends Type
			? FieldName
			: never;
	}[Keyof<Fields>]
>;

/** 讓傳入的物件值變成單一值與 array 共存 */
export type MakeValueArray<T extends AnyObject> = {
	[K in keyof T]: T[K] | Array<T[K] | null> | null | undefined;
};

/** null 化每個 key 值 */
export type Null<T> = { [K in RequiredKeys<T>]: T[K] | null } & {
	[K in OptionalKeys<T>]?: T[K] | null;
};
/** 簡化 NonNullable */
export type NN<T> = NonNullable<T>;
/** 輸出類型確實為 string 的 key */
export type Keyof<T> = Extract<keyof T, string>;
/** 取得所有可選的 key */
export type OptionalKeys<T> = {
	[K in Keyof<T>]-?: undefined extends T[K] ? K : never;
}[Keyof<T>];
/** 取得所有必填的 key */
export type RequiredKeys<T> = {
	[K in Keyof<T>]-?: undefined extends T[K] ? never : K;
}[Keyof<T>];
/**
 * 產生指定型別數組，如 Tuple<string, 3> = [string, string, string]
 * @ref https://github.com/microsoft/TypeScript/pull/40002
 */
export type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;
