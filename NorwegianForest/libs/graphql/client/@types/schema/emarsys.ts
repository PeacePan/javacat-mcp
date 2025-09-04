import { TABLE_NAME } from '@norwegianForestTables/const';
import {
	EmContactTaskBody,
	EmProductTaskBody,
	EmSaleTaskBody,
	EmSaleTaskLines,
	EmStoreTaskBody,
	EmWebhookBody,
} from '@norwegianForestTables/emarsys/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type EmarsysTableRecordsSchemaDefine = {
	[TABLE_NAME.EM_PRODUCT_TASK]: SchemaDefineContent<SafeRecord2<EmProductTaskBody>, NormalDefaultOperation>;
	[TABLE_NAME.EM_STORE_TASK]: SchemaDefineContent<SafeRecord2<EmStoreTaskBody>, NormalDefaultOperation>;
	[TABLE_NAME.EM_SALE_TASK]: SchemaDefineContent<SafeRecord2<EmSaleTaskBody, EmSaleTaskLines>, NormalDefaultOperation>;
	[TABLE_NAME.EM_CONTACT_TASK]: SchemaDefineContent<SafeRecord2<EmContactTaskBody>, NormalDefaultOperation>;
	[TABLE_NAME.EM_WEBHOOK]: SchemaDefineContent<SafeRecord2<EmWebhookBody>, NormalDefaultOperation>;
};
