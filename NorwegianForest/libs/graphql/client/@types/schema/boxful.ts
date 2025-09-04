import { BoxfulTaskBody } from '@norwegianForestTables/boxful/_type';
import { TABLE_NAME } from '@norwegianForestTables/const';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type BoxfulTableRecordsSchemaDefine = {
	[TABLE_NAME.BOXFUL_TASK]: SchemaDefineContent<SafeRecord2<BoxfulTaskBody>, NormalDefaultOperation>;
};
