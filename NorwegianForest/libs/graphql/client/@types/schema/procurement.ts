import { TABLE_NAME } from '@norwegianForestTables/const';
import {
	AnnualCalendarBody,
	AnnualCalendarLines,
	BillBody,
	BillLines,
	BillNoteBody,
	BillNoteLines,
	ItemAnimalBody,
	ItemBody,
	ItemBrandBody,
	ItemCategoryBody,
	ItemDeptBody,
	ItemECBody,
	ItemECCategoryBody,
	ItemECLines,
	ItemLines,
	ItemPriceChangeBody,
	ItemPriceChangeLines,
	ItemPromotionPriceBody,
	ItemPromotionPriceLines,
	ItemSmallCategoryBody,
	ItemSubCategoryBody,
	PartialItemBody,
	PartialItemLines,
	PreferredVendorBody,
	PurchaseOrderBody,
	PurchaseOrderLines,
	ReorderBody,
	ReorderDayBody,
	ReorderDayLines,
	ReorderEstimationBody,
	ReorderLines,
	ReorderTaskBody,
	ReorderTaskLines,
	ReorderV2StoreConfigBody,
	RequisitionBody,
	RequisitionLines,
	ReturnAdjustmentBody,
	ReturnAdjustmentClosedBody,
	ReturnAdjustmentClosedLines,
	ReturnAdjustmentLines,
	ReturnOrderBody,
	ReturnOrderLines,
	ShelfTagBody,
	StoreDailyReorderListBody,
	StoreDailyReorderListLines,
	StoreDailyTransferHOBody,
	StoreItemSaleStatisticsBody,
	StoreReorderAdjustmentBody,
	StoreReorderAdjustmentDetailBody,
	StoreReorderRecommendBody,
	StoreReorderRecommendLines,
	VendorBody,
	VendorLines,
	VendorLocationBody,
} from '@norwegianForestTables/procurement/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type ProcurementTableRecordsSchemaDefine = {
	[TABLE_NAME.REQUISITION]: SchemaDefineContent<SafeRecord2<RequisitionBody, RequisitionLines>, NormalDefaultOperation, true>;
	[TABLE_NAME.PURCHASE_ORDER]: SchemaDefineContent<SafeRecord2<PurchaseOrderBody, PurchaseOrderLines>, NormalDefaultOperation, true>;
	[TABLE_NAME.ITEM]: SchemaDefineContent<SafeRecord2<ItemBody, ItemLines>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_EC]: SchemaDefineContent<SafeRecord2<ItemECBody, ItemECLines>, NormalDefaultOperation, true>;
	[TABLE_NAME.ITEM_EC_CATEGORY]: SchemaDefineContent<SafeRecord2<ItemECCategoryBody>, NormalDefaultOperation>;
	[TABLE_NAME.PREFERRED_VENDOR]: SchemaDefineContent<SafeRecord2<PreferredVendorBody>, NormalDefaultOperation>;
	[TABLE_NAME.VENDOR]: SchemaDefineContent<SafeRecord2<VendorBody, VendorLines>, NormalDefaultOperation>;
	[TABLE_NAME.RETURN_ORDER]: SchemaDefineContent<SafeRecord2<ReturnOrderBody, ReturnOrderLines>, NormalDefaultOperation>;
	[TABLE_NAME.RETURN_ADJUSTMENT]: SchemaDefineContent<
		SafeRecord2<ReturnAdjustmentBody, ReturnAdjustmentLines>,
		NormalDefaultOperation,
		true
	>;
	[TABLE_NAME.RETURN_ADJUSTMENT_CLOSED]: SchemaDefineContent<
		SafeRecord2<ReturnAdjustmentClosedBody, ReturnAdjustmentClosedLines>,
		NormalDefaultOperation,
		true
	>;
	[TABLE_NAME.BILL_NOTE]: SchemaDefineContent<SafeRecord2<BillNoteBody, BillNoteLines>, NormalDefaultOperation>;
	[TABLE_NAME.BILL]: SchemaDefineContent<SafeRecord2<BillBody, BillLines>, NormalDefaultOperation>;
	[TABLE_NAME.REORDER]: SchemaDefineContent<SafeRecord2<ReorderBody, ReorderLines>, NormalDefaultOperation, true>;
	[TABLE_NAME.REORDER_DAY]: SchemaDefineContent<SafeRecord2<ReorderDayBody, ReorderDayLines>, NormalDefaultOperation>;
	[TABLE_NAME.REORDER_TASK]: SchemaDefineContent<SafeRecord2<ReorderTaskBody, ReorderTaskLines>, NormalDefaultOperation>;
	[TABLE_NAME.STORE_DAILY_REORDER_LIST]: SchemaDefineContent<
		SafeRecord2<StoreDailyReorderListBody, StoreDailyReorderListLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.REORDERV2_STORE_CONFIG]: SchemaDefineContent<SafeRecord2<ReorderV2StoreConfigBody>, NormalDefaultOperation>;
	[TABLE_NAME.STORE_DAILY_TRANSFER_HO]: SchemaDefineContent<SafeRecord2<StoreDailyTransferHOBody>, NormalDefaultOperation>;
	[TABLE_NAME.STORE_ITEM_SALE_STATISTICS]: SchemaDefineContent<SafeRecord2<StoreItemSaleStatisticsBody>, NormalDefaultOperation>;
	[TABLE_NAME.REORDER_ESTIMATION]: SchemaDefineContent<SafeRecord2<ReorderEstimationBody>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_ANIMAL]: SchemaDefineContent<SafeRecord2<ItemAnimalBody>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_BRAND]: SchemaDefineContent<SafeRecord2<ItemBrandBody>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_CATEGORY]: SchemaDefineContent<SafeRecord2<ItemCategoryBody>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_SUBCATEGORY]: SchemaDefineContent<SafeRecord2<ItemSubCategoryBody>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_SMALL_CATEGORY]: SchemaDefineContent<SafeRecord2<ItemSmallCategoryBody>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_DEPT]: SchemaDefineContent<SafeRecord2<ItemDeptBody>, NormalDefaultOperation>;
	[TABLE_NAME.ANNUAL_CALENDAR]: SchemaDefineContent<SafeRecord2<AnnualCalendarBody, AnnualCalendarLines>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_PRICE_CHANGE]: SchemaDefineContent<SafeRecord2<ItemPriceChangeBody, ItemPriceChangeLines>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_PROMOTION_PRICE]: SchemaDefineContent<
		SafeRecord2<ItemPromotionPriceBody, ItemPromotionPriceLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.STORE_REORDER_RECOMMEND]: SchemaDefineContent<
		SafeRecord2<StoreReorderRecommendBody, StoreReorderRecommendLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.STORE_REORDER_ADJUSTMENT]: SchemaDefineContent<SafeRecord2<StoreReorderAdjustmentBody>, NormalDefaultOperation>;
	[TABLE_NAME.STORE_REORDER_ADJUSTMENT_DETAIL]: SchemaDefineContent<
		SafeRecord2<StoreReorderAdjustmentDetailBody>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.VENDOR_LOCATION]: SchemaDefineContent<SafeRecord2<VendorLocationBody>, NormalDefaultOperation>;
	[TABLE_NAME.PARTIAL_ITEM]: SchemaDefineContent<SafeRecord2<PartialItemBody, PartialItemLines>, NormalDefaultOperation>;
	[TABLE_NAME.SHELF_TAG]: SchemaDefineContent<SafeRecord2<ShelfTagBody>, NormalDefaultOperation>;
};
