import { TABLE_NAME } from '@norwegianForestTables/const';
import { FoodpandaItemBody, FoodpandaItemLines, FoodpandaStoreBody } from '@norwegianForestTables/foodpanda/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type FoodpandaTableRecordsSchemaDefine = {
	[TABLE_NAME.FOODPANDA_STORE]: SchemaDefineContent<SafeRecord2<FoodpandaStoreBody>, NormalDefaultOperation>;
	[TABLE_NAME.FOODPANDA_ITEM]: SchemaDefineContent<SafeRecord2<FoodpandaItemBody, FoodpandaItemLines>, NormalDefaultOperation>;
};
