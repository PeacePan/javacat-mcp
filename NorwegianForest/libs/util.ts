import { NN } from '../../Xoloitzcuintli/interface';
import {
	ExternalNormFindArgsFilter,
	FIELD_VALUE_TYPE,
	Lines,
	NormCondition,
	NormField,
	NormRecord,
	NormRecord2,
	Row,
	SafeRecord,
	SafeRecord2,
} from './@types';
import { GeneralizedCondition, GeneralizedField, GeneralizedRecord } from './@types/graphql';
import { EnumSchema } from './@types/table';
import { ConditionOperator, NormFieldValueType } from './enum';

/** 兩個 MY_VALUE_TYPE 是否相等 */
export function isFieldValueEqual(a?: FIELD_VALUE_TYPE, b?: FIELD_VALUE_TYPE): boolean {
	if (a instanceof Date && b instanceof Date) {
		return a.getTime() === b.getTime();
	} else if ((a === null || a === undefined) && (b === null || b === undefined)) {
		/** a 和 b 都是 null 或 undefined */
		return true;
	}
	return a === b;
}

/** 轉換正規欄位清單成鍵值對 */
export function reduceNormFields(fields: NormField[]): Record<string, FIELD_VALUE_TYPE> {
	return fields.reduce((prev, curr) => {
		return {
			...prev,
			[curr.fieldName]:
				curr.valueType === NormFieldValueType.BOOLEAN
					? curr.boolean
					: curr.valueType === NormFieldValueType.NUMBER
					? curr.number
					: curr.valueType === NormFieldValueType.STRING
					? curr.string
					: curr.valueType === NormFieldValueType.DATE
					? curr.date
					: curr.valueType === NormFieldValueType.ID
					? curr.id
					: null,
		};
	}, {});
}

/** 轉換正規化紀錄成一般紀錄 */
export function mapNormRecordAsMyRecord(normRecord: NormRecord): SafeRecord {
	return {
		...(normRecord._id ? { _id: normRecord._id } : null),
		body: reduceNormFields(normRecord.bodyFields),
		lines: normRecord.lineRows.reduce((prev, curr) => {
			return {
				...prev,
				[curr.lineName]: [...(prev[curr.lineName] || []), reduceNormFields(curr.lineFields)],
			};
		}, {}),
	};
}

/** 轉換成正規欄位 */
export function convertAsNormField(fieldName: string, value: unknown): NormField {
	return fieldName === '_id'
		? { fieldName, valueType: NormFieldValueType.ID, id: `${value}` }
		: typeof value === 'string'
		? { fieldName, valueType: NormFieldValueType.STRING, string: value }
		: typeof value === 'number'
		? { fieldName, valueType: NormFieldValueType.NUMBER, number: value }
		: typeof value === 'boolean'
		? { fieldName, valueType: NormFieldValueType.BOOLEAN, boolean: value }
		: value instanceof Date
		? { fieldName, valueType: NormFieldValueType.DATE, date: value }
		: { fieldName, valueType: NormFieldValueType.NULL };
}

/**
 * 轉換鍵值對成正規欄位陣列
 */
export function convertMapAsGeneralizedFields<T extends Record<string, unknown>>(map: T): GeneralizedField[] {
	const result: GeneralizedField[] = [];
	const parser = (fieldName: string, value: unknown): GeneralizedField => {
		return fieldName === '_id'
			? { name: fieldName, type: NormFieldValueType.ID, id: `${value}` }
			: typeof value === 'string'
			? { name: fieldName, type: NormFieldValueType.STRING, string: value }
			: typeof value === 'number'
			? { name: fieldName, type: NormFieldValueType.NUMBER, number: value }
			: typeof value === 'boolean'
			? { name: fieldName, type: NormFieldValueType.BOOLEAN, boolean: value }
			: value instanceof Date
			? { name: fieldName, type: NormFieldValueType.DATE, date: value }
			: { name: fieldName, type: NormFieldValueType.NULL };
	};
	Object.keys(map).forEach((name) => {
		const value = map[name];
		if (Array.isArray(value)) {
			value.forEach((itemValue) => result.push(parser(name, itemValue)));
		} else {
			result.push(parser(name, value));
		}
	});
	return result;
}

/** 產生一般化紀錄 */
export function mapSafeRecordAsGeneralizedRecord<T extends SafeRecord>(record: T): GeneralizedRecord {
	const lines: GeneralizedRecord['lines'] = [];
	Object.keys(record.lines || {}).forEach((lineName) => {
		const line = record.lines?.[lineName];
		if (!line) return;
		line.forEach((row) => {
			lines.push({
				line: lineName,
				fields: convertMapAsGeneralizedFields(row),
			});
		});
	});
	return {
		...(record._id ? { _id: record._id } : null),
		body: convertMapAsGeneralizedFields(record.body),
		lines,
	};
}

/** 轉換正規欄位清單成鍵值對 */
export function reduceGeneralizedFields(fields: GeneralizedField[]): Record<string, FIELD_VALUE_TYPE> {
	return fields.reduce((prev, curr) => {
		return {
			...prev,
			[curr.name]:
				curr.type === NormFieldValueType.BOOLEAN
					? curr.boolean
					: curr.type === NormFieldValueType.NUMBER
					? curr.number
					: curr.type === NormFieldValueType.STRING
					? curr.string
					: curr.type === NormFieldValueType.DATE
					? curr.date
					: null,
		};
	}, {});
}

/** 轉換一般化紀錄成安全紀錄 */
export function mapGeneralizedRecordAsSafeRecord(gRecord: GeneralizedRecord): SafeRecord {
	return {
		...gRecord,
		body: reduceGeneralizedFields(gRecord.body),
		lines: gRecord.lines.reduce((prev, curr) => {
			return {
				...prev,
				[curr.line]: [...(prev[curr.line] || []), reduceGeneralizedFields(curr.fields)],
			};
		}, {}),
	};
}

/** 轉換鍵值對成正規欄位條件 */
export function convertMapAsGeneralizedCondition<T extends Record<string, unknown>>(
	keyValue: T
): GeneralizedCondition[] {
	return convertMapAsGeneralizedFields<T>(keyValue).map((row) => {
		return {
			...row,
			operator: ConditionOperator.IN,
		};
	});
}

/**
 * 轉換鍵值對成正規欄位陣列
 */
export function convertMapAsNormFields<T extends Record<string, FIELD_VALUE_TYPE> = Record<string, FIELD_VALUE_TYPE>>(
	map: T
): NormField[] {
	return Object.keys(map).reduce<NormField[]>((prev, fieldName) => {
		return [...prev, convertAsNormField(fieldName, map[fieldName])];
	}, []);
}

/** 轉換鍵值對成正規欄位條件 */
export function convertMapAsNormFindCondition<
	T extends Record<string, FIELD_VALUE_TYPE> = Record<string, FIELD_VALUE_TYPE>
>(keyValue: T, operator: NormCondition['operator'] = 'in'): NormCondition[] {
	return convertMapAsNormFields<T>(keyValue).map((row) => {
		return { ...row, operator };
	});
}

/** 轉換 MyRecord 成 NormRecord */
export function mapMyRecordAsNormRecord<T extends SafeRecord = SafeRecord>(record: T): NormRecord {
	return {
		...(record._id ? { _id: record._id } : null),
		bodyFields: convertMapAsNormFields(record.body),
		lineRows: Object.keys(record.lines || {}).reduce<NormRecord['lineRows']>((prev, lineName) => {
			const line = record.lines?.[lineName];
			if (!line) return prev;
			return [
				...prev,
				...line.map((row) => {
					return {
						lineName,
						lineFields: convertMapAsNormFields(row),
					};
				}),
			];
		}, []),
	};
}

/**
 * 產生參考資料欄位名稱
 * @param srcFieldName 來源欄位名稱
 * @param refFieldName 參考欄位名稱
 */
export function genRefDataFieldName(srcFieldName: string, refFieldName: string): string {
	return `${srcFieldName}_${refFieldName}`;
}

/**
 * 解析參考資料欄位名稱
 * @param refDataFieldName 參考資料欄位名稱
 */
export function resolveRefDataFieldName(refDataFieldName: string): {
	srcFieldName: string;
	refFieldName: string | null;
} {
	const tmp = refDataFieldName.split('_');
	if (tmp.length === 3) {
		return {
			srcFieldName: `_${tmp[1]}`,
			refFieldName: tmp[2] || null,
		};
	} else if (tmp[0] === '' && tmp.length === 4) {
		/** 解析系統欄位關連系統欄位的情況，如 _approval2-_createdBy_displayName */
		const [, srcFieldName, ...refFieldParts] = tmp;
		return {
			srcFieldName: `_${srcFieldName}`,
			refFieldName: refFieldParts.join('_'),
		};
	} else if (tmp.length === 2) {
		return {
			srcFieldName: tmp[0],
			refFieldName: tmp[1],
		};
	} else if (tmp.length === 1) {
		return {
			srcFieldName: tmp[0],
			refFieldName: null,
		};
	}
	throw new Error(`無法解析欄位名稱 ${refDataFieldName}`);
}

/**
 * callback 轉換成 async，兩參數版本
 * @template R 回傳結果型別
 */
export function promisify<R>(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	func: (callback: (err: any, result: R) => void) => void
): Promise<R> {
	return new Promise<R>((resolve, reject) => {
		func((err, result) => {
			if (err) return reject(new Error(err + ''));
			return resolve(result);
		});
	});
}

/** 睡眠指定 ms 數，預設 10ms */
export function sleep(ms = 10): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			return resolve();
		}, ms);
	});
}

/**
 * 非同步重試
 * @param option.delay 重試間隔時間(毫秒)。會睡眠 delay + delay * Math.random() 毫秒。(default=200)
 * @param option.max 總執行次數。執行 n 次後才會丟出例外。(default=3)
 */
export async function retry<T>(f: () => Promise<T>, option?: Partial<RetryOption>): Promise<T> {
	const tmp: RetryOption = {
		...option,
		max: option?.max || 3,
		delay: option?.delay || 200,
	};
	if (tmp.max <= 0) throw new Error('option.max should be greater than or equal to zero');
	if (tmp.delay <= 0) throw new Error('option.delay should be greater than or equal to zero');
	if (!(f instanceof Function)) throw new Error('f should be a function');
	let counter = 0;
	const worker = async (): Promise<T> => {
		try {
			return await f();
		} catch (err) {
			counter++;
			if (tmp.onError) tmp.onError(err as Error, counter);
			if ((!tmp.test || tmp.test(err)) && counter < tmp.max) {
				await sleep(tmp.delay + tmp.delay * Math.random());
				return await worker();
			}
			console.error(`===== Reach maximum retry count ${tmp.max} =====`);
			console.error(err);
			console.error(`===== Reach maximum retry count ${tmp.max} =====`);
			throw err;
		}
	};
	return await worker();
}

/** 非同步重試參數 */
export interface RetryOption {
	/**
	 * 執行次數
	 * @default 3
	 */
	max: number;
	/**
	 * 重試間隔時間
	 * @default 200
	 */
	delay: number;
	/** 錯誤發生時執行 */
	onError?: RetryOnErrorEvent;
	/** 只重試指定類型的錯誤 */
	test?: (err: Error) => boolean;
}

/**
 * 錯誤發生時執行事件
 * @param {Error} err - 錯誤物件
 * @param {number} counter - 當前執行次數
 * */
export interface RetryOnErrorEvent {
	(err: Error, counter: number): void;
}

//#region convertTsEnumToMyTableEnum
/**
 * 轉換 TypeScript 列舉成 MyTableRecord['lines']['enums']
 * @param name 列舉名稱
 * @param tsEnum TypeScript 列舉，成員和值必須相等
 * @param displayName 成員的顯示名稱對照
 * @template ENUM_NAME 列舉名稱
 * @template ENUM_MEMBER 成員
 */
export function convertTsEnumToMyTableEnum<ENUM_NAME extends string, ENUM_MEMBER extends string>(
	name: ENUM_NAME,
	tsEnum: Record<ENUM_MEMBER, ENUM_MEMBER>,
	displayName?: Record<ENUM_MEMBER, string>,
	disabled?: ENUM_MEMBER[]
): NN<NN<SafeRecord<never, { enums: EnumSchema<ENUM_NAME, ENUM_MEMBER> }>['lines']>['enums']> {
	return Object.keys(tsEnum).map((key) => {
		return {
			enumName: name,
			name: tsEnum[key],
			displayName: displayName ? displayName[key] : key,
			...(disabled?.some((v) => v === key) ? { disabled: true } : null),
		};
	});
}
//#endregion

//#region string _id 相關
/** 轉換 MyRecord 成 NormRecord */
export function mapMyRecord2AsNormRecord2<T extends SafeRecord2 = SafeRecord2>(record: T): NormRecord2 {
	return {
		...(record._id ? { _id: record._id } : null),
		bodyFields: convertMapAsNormFields(record.body),
		lineRows: Object.keys(record.lines || {}).reduce<NormRecord2['lineRows']>((prev, lineName) => {
			const line = record.lines?.[lineName];
			if (!line) return prev;
			return [
				...prev,
				...line.map((row) => {
					return {
						lineName,
						lineFields: convertMapAsNormFields(row),
					};
				}),
			];
		}, []),
	};
}
/** 轉換正規化紀錄成一般紀錄 */
export function mapNormRecord2AsMyRecord2(normRecord: NormRecord2): SafeRecord2 {
	const record = {
		...(normRecord._id ? { _id: normRecord._id } : null),
		body: reduceNormFields(normRecord.bodyFields),
		lines: (normRecord.lineRows || []).reduce((prev, curr) => {
			return {
				...prev,
				[curr.lineName]: [...(prev[curr.lineName] || []), reduceNormFields(curr.lineFields)],
			};
		}, {}),
	};
	if (!record._id && record.body._id) record._id = `${record.body._id}`;
	return record;
}
/** 產生一般化紀錄 */
export function mapSafeRecord2AsGeneralizedRecord<T extends SafeRecord2>(record: T): GeneralizedRecord {
	const lines: GeneralizedRecord['lines'] = [];
	Object.keys(record.lines || {}).forEach((lineName) => {
		const line = record.lines?.[lineName];
		if (!line) return;
		line.forEach((row) => {
			lines.push({
				line: lineName,
				fields: convertMapAsGeneralizedFields(row),
			});
		});
	});
	return {
		...(record._id ? { _id: record._id } : null),
		body: convertMapAsGeneralizedFields(record.body),
		lines,
	};
}
/** 產生外部表身查詢的正規化搜尋資料過濾參數 */
export function generateExternalSearchArgument<
	ExternalBody extends Row = Row,
	SourceBody extends Row = Row,
	ExternalLines extends Lines = Lines
>(filter: ExternalNormFindArgsFilter<ExternalBody, ExternalLines, SourceBody>): string {
	return JSON.stringify(filter);
}
