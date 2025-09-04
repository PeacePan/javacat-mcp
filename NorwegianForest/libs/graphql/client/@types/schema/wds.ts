import { TABLE_NAME } from '@norwegianForestTables/const';
import { WdsInventorySyncBackBody, WdsProductSyncBackBody, WdsProductSyncBody } from '@norwegianForestTables/wds/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type WDSTableRecordsSchemaDefine = {
	[TABLE_NAME.WDS_PRODUCT_SYNC]: SchemaDefineContent<SafeRecord2<WdsProductSyncBody>, NormalDefaultOperation>;
	[TABLE_NAME.WDS_PRODUCT_SYNC_BACK]: SchemaDefineContent<SafeRecord2<WdsProductSyncBackBody>, NormalDefaultOperation>;
	[TABLE_NAME.WDS_INVENTORY_SYNC_BACK]: SchemaDefineContent<SafeRecord2<WdsInventorySyncBackBody>, NormalDefaultOperation>;
};
