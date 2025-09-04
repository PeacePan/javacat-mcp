import { TABLE_NAME } from '@norwegianForestTables/const';
import {
	DSVDailyTaskBody,
	DSVDailyTaskLines,
	DSVInventoryBody,
	DSVInventoryOperationBody,
	DSVOrderBody,
	DSVOrderDetailBody,
	DSVShipmentBody,
	DSVShipmentLines,
} from '@norwegianForestTables/dsv/_type';
import { DSVOrderShippingArgs } from '@norwegianForestTables/dsv/scripts/dsvorder/shipping';
import { SafeRecord2 } from '@norwegianForestTypes';
import { BulkFunctionArgs } from '@norwegianForestTypes/MyScript';
import { CallDefineContent, NormalDefaultOperation, SchemaDefineContent } from '../';

export type DSVTableRecordsSchemaDefine = {
	[TABLE_NAME.DSV_DAILY_TASK]: SchemaDefineContent<SafeRecord2<DSVDailyTaskBody, DSVDailyTaskLines>, NormalDefaultOperation>;
	[TABLE_NAME.DSV_INVENTORY]: SchemaDefineContent<SafeRecord2<DSVInventoryBody>, NormalDefaultOperation>;
	[TABLE_NAME.DSV_INVENTORY_OPERATION]: SchemaDefineContent<SafeRecord2<DSVInventoryOperationBody>, NormalDefaultOperation>;
	[TABLE_NAME.DSV_ORDER]: SchemaDefineContent<
		SafeRecord2<DSVOrderBody>,
		NormalDefaultOperation,
		false,
		never,
		CallDefineContent<'出貨拋單', BulkFunctionArgs<DSVOrderShippingArgs>, string> &
			CallDefineContent<'取消拋單', BulkFunctionArgs, string>
	>;
	[TABLE_NAME.DSV_ORDER_DETAIL]: SchemaDefineContent<SafeRecord2<DSVOrderDetailBody>, NormalDefaultOperation>;
	[TABLE_NAME.DSV_SHIPMENT]: SchemaDefineContent<SafeRecord2<DSVShipmentBody, DSVShipmentLines>, NormalDefaultOperation>;
};
