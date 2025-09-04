import { TABLE_NAME } from '@norwegianForestTables/const';
import { PChomeInventoryTaskBody } from '@norwegianForestTables/pchome/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type PchomeTableRecordsSchemaDefine = {
	[TABLE_NAME.PCHOME_INVENTORY_TASK]: SchemaDefineContent<SafeRecord2<PChomeInventoryTaskBody>, NormalDefaultOperation>;
};
