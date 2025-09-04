import { TABLE_NAME } from '@norwegianForestTables/const';
import {
	ListOrdersDetailsArgs,
	UberEatsCategoryBody,
	UberEatsCategoryLines,
	UberEatsItemBody,
	UberEatsItemLines,
	UberEatsMenuBody,
	UberEatsMenuLines,
	UberEatsStoreBody,
	UberEatsStoreItemBody,
	UberEatsStoreLines,
} from '@norwegianForestTables/ubereats/type';
import { UberEatsTokenBody } from '@norwegianForestTables/ubereats/ubereatstoken';
import { SafeRecord2 } from '@norwegianForestTypes';
import { ExecuteDefineContent, NormalDefaultOperation, SchemaDefineContent } from '../';

export type UberEatsTableRecordsSchemaDefine = {
	[TABLE_NAME.UBEREATS_STORE]: SchemaDefineContent<
		SafeRecord2<UberEatsStoreBody, UberEatsStoreLines>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<'取得門市訂單', SafeRecord2<ListOrdersDetailsArgs>, string>
	>;
	[TABLE_NAME.UBEREATS_ITEM]: SchemaDefineContent<SafeRecord2<UberEatsItemBody, UberEatsItemLines>, NormalDefaultOperation>;
	[TABLE_NAME.UBEREATS_MENU]: SchemaDefineContent<SafeRecord2<UberEatsMenuBody, UberEatsMenuLines>, NormalDefaultOperation>;
	[TABLE_NAME.UBEREATS_CATEGORY]: SchemaDefineContent<SafeRecord2<UberEatsCategoryBody, UberEatsCategoryLines>, NormalDefaultOperation>;
	[TABLE_NAME.UBEREATS_STORE_ITEM]: SchemaDefineContent<SafeRecord2<UberEatsStoreItemBody>, NormalDefaultOperation>;
	[TABLE_NAME.UBEREATS_TOKEN]: SchemaDefineContent<SafeRecord2<UberEatsTokenBody>, NormalDefaultOperation>;
};
