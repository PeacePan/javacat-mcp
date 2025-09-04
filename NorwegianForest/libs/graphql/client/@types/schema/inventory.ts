import { TABLE_NAME } from '@norwegianForestTables/const';
import {
	AdjustmentBody,
	AdjustmentLines,
	BalanceBody,
	BalanceLines,
	CustomerOrderBalanceOperationBody,
	HQClosePalletBody,
	HQCuftBody,
	HQReorderBody,
	HQReorderDayBody,
	HQReorderDayLines,
	HQReorderLines,
	HQReorderTaskLogBody,
	HQReorderTaskLogLines,
	ItemReceiptBody,
	ItemReceiptLines,
	LocationBody,
	LockAdjustmentBody,
	LockAdjustmentLines,
	LockBody,
	LockLines,
	PurchaseAdjustmentBody,
	PurchaseAdjustmentClosedBody,
	PurchaseAdjustmentClosedLines,
	PurchaseAdjustmentLines,
	SnapshotBody,
	SnapshotLines,
	StatBody,
	StatLines,
	TransferOrderBody,
	TransferOrderLines,
} from '@norwegianForestTables/inventory/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type InventoryTableRecordsSchemaDefine = {
	[TABLE_NAME.LOCK]: SchemaDefineContent<SafeRecord2<LockBody, LockLines>, NormalDefaultOperation>;
	[TABLE_NAME.LOCK_ADJUSTMENT]: SchemaDefineContent<SafeRecord2<LockAdjustmentBody, LockAdjustmentLines>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_RECEIPT]: SchemaDefineContent<SafeRecord2<ItemReceiptBody, ItemReceiptLines>, NormalDefaultOperation>;
	[TABLE_NAME.LOCATION]: SchemaDefineContent<SafeRecord2<LocationBody>, NormalDefaultOperation>;
	[TABLE_NAME.TRANSFER_ORDER]: SchemaDefineContent<SafeRecord2<TransferOrderBody, TransferOrderLines>, NormalDefaultOperation>;
	[TABLE_NAME.ADJUSTMENT]: SchemaDefineContent<SafeRecord2<AdjustmentBody, AdjustmentLines>, NormalDefaultOperation, true>;
	[TABLE_NAME.BALANCE]: SchemaDefineContent<SafeRecord2<BalanceBody, BalanceLines>, NormalDefaultOperation>;
	[TABLE_NAME.SNAPSHOT]: SchemaDefineContent<SafeRecord2<SnapshotBody, SnapshotLines>, NormalDefaultOperation>;
	[TABLE_NAME.STAT]: SchemaDefineContent<SafeRecord2<StatBody, StatLines>, NormalDefaultOperation>;
	[TABLE_NAME.HQ_REORDER]: SchemaDefineContent<SafeRecord2<HQReorderBody, HQReorderLines>, NormalDefaultOperation>;
	[TABLE_NAME.HQ_REORDER_TASK_LOG]: SchemaDefineContent<SafeRecord2<HQReorderTaskLogBody, HQReorderTaskLogLines>, NormalDefaultOperation>;
	[TABLE_NAME.HQ_REORDER_DAY]: SchemaDefineContent<SafeRecord2<HQReorderDayBody, HQReorderDayLines>, NormalDefaultOperation>;
	[TABLE_NAME.HQ_CUFT]: SchemaDefineContent<SafeRecord2<HQCuftBody>, NormalDefaultOperation>;
	[TABLE_NAME.HQ_CLOSE_PALLET]: SchemaDefineContent<SafeRecord2<HQClosePalletBody>, NormalDefaultOperation>;
	[TABLE_NAME.PURCHASE_ADJUSTMENT]: SchemaDefineContent<
		SafeRecord2<PurchaseAdjustmentBody, PurchaseAdjustmentLines>,
		NormalDefaultOperation,
		true
	>;
	[TABLE_NAME.PURCHASE_ADJUSTMENT_CLOSED]: SchemaDefineContent<
		SafeRecord2<PurchaseAdjustmentClosedBody, PurchaseAdjustmentClosedLines>,
		NormalDefaultOperation,
		true
	>;
	[TABLE_NAME.CUSTOMER_ORDER_BALANCE_OPERATION]: SchemaDefineContent<
		SafeRecord2<CustomerOrderBalanceOperationBody>,
		NormalDefaultOperation
	>;
};
