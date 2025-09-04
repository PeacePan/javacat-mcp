import { CronLogBody } from '@javaCat/@type/tables/cronlog';
import { Log2Body, Log2Lines } from '@javaCat/@type/tables/log2';
import { SYSTEM_TABLE_NAME } from '@norwegianForestLibs/enum';
import { BoxfulTaskBody } from '@norwegianForestTables/boxful/_type';
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
import {
	EmContactTaskBody,
	EmProductTaskBody,
	EmSaleTaskBody,
	EmSaleTaskLines,
	EmStoreTaskBody,
	EmWebhookBody,
} from '@norwegianForestTables/emarsys/_type';
import { ExpenseBody, ExpenseCategoryBody, ExpenseClassBody, ExpenseLines } from '@norwegianForestTables/expense/_type';
import { FoodpandaItemBody, FoodpandaItemLines, FoodpandaStoreBody } from '@norwegianForestTables/foodpanda/_type';
import {
	ApprovalRegenerateBody,
	BatchBillBody,
	ECNetSuiteBody,
	GenApprovalChainBody,
	MaNetSuiteBody,
	NSDeleteBody,
	OneNetSuiteBody,
	PosNetSuiteBody,
} from '@norwegianForestTables/function/_type';
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
import {
	Ma3PLTokenBody,
	MaFastBuyOrderBody,
	MaFastBuyOrderLines,
	MaFastBuyRefundBody,
	MaFastBuyRefundLines,
	MaFastBuyReturnBody,
	MaFastBuyReturnLines,
	MaPartialExchangeBody,
	MaPartialExchangeLines,
	MaPartialOrderBody,
	MaPartialOrderLines,
	MaPartialRefundBody,
	MaPartialRefundLines,
	MaPartialReturnBody,
	MaPartialReturnLines,
	MaShopOrderBody,
	MaShopOrderLines,
	MaShopPerformanceBody,
	MaShopRefundBody,
	MaShopRefundLines,
	MaShopReturnBody,
	MaShopReturnLines,
} from '@norwegianForestTables/magento/_type';
import {
	AutoUpdateMemberClassBody,
	CrescLabSyncMemberBody,
	CrescLabSyncMemberLines,
	GivePointSettingBody,
	GivePointSettingLines,
	ImportPointBody,
	ImportPointLines,
	MemberAutoArchiveBody,
	MemberClassBody,
	MemberMergeBody,
	OCardSyncPointTaskBody,
	OCardSyncPointTaskLines,
	OCardSyncTaskBody,
	OCardSyncTaskLines,
	PetParkCouponAssignBody,
	PetParkCouponAssignLines,
	PetParkCouponBody,
	PetParkCouponEventBody,
	PetParkCouponEventLines,
	PetParkCouponExpirationBody,
	PetParkCouponExpirationLines,
	PointAccountBody,
	PointAccountLines,
	PointDiscountBody,
	PointPromotionBody,
	PointPromotionLines,
} from '@norwegianForestTables/memberRights/_type';
import { PChomeInventoryTaskBody } from '@norwegianForestTables/pchome/_type';
import {
	ExpenditureBody,
	PosConfigBody,
	PosCouponBody,
	PosCouponLines,
	PosCustomerOrderBody,
	PosCustomerOrderLines,
	PosDepositBody,
	PosDepositLines,
	PosDepositWithdrawBody,
	PosDepositWithdrawLines,
	PosEGUINoBody,
	PosEGUINoLines,
	PosFreebieBody,
	PosFreebieLines,
	PosMemberBody,
	PosMemberLines,
	PosOrderDiscountBody,
	PosOrderDiscountLines,
	PosPetBody,
	PosPetLines,
	PosPetSpeciesBody,
	PosPilotBody,
	PosPilotLines,
	PosPrintableCouponBody,
	PosPrintableCouponLines,
	PosPromotionBody,
	PosPromotionLines,
	PosReportBody,
	PosReturnBody,
	PosReturnLines,
	PosSaleBody,
	PosSaleLines,
	PosSaleSnapshotBody,
	PosSaleSnapshotLines,
	PosShelfBody,
	PosShelfGroupBody,
	PosShelfLines,
	PosShortcutBody,
	PosShortcutLines,
	PosStoreBody,
	PosStoreGroupBody,
	PosStoreGroupLines,
	PosStoreLines,
	PosStoreShelfBody,
	PosStoreShelfLines,
	PosVoucherBody,
	PosVoucherLines,
	PosVoucherLogBody,
	PosVoucherLogLines,
} from '@norwegianForestTables/pos/_type';
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
import {
	BankReconciliationRecordBody,
	ImportReconciliationBody,
	ImportReconciliationLines,
	ReconciliationResultBody,
} from '@norwegianForestTables/reconciliation/_type';
import { CustomerBody, SaleOrderBody, SaleOrderLines, SaleReturnBody, SaleReturnLines } from '@norwegianForestTables/sales/_type';
import {
	PosTargetTrackingSettingBody,
	PosTargetTrackingSettingLines,
	SalonSalesTargetsSettingBody,
	SalonSalesTargetsSettingLines,
	SalonTargetTrackingSettingBody,
	SalonTargetTrackingSettingLines,
	TotalSalesTargetsSettingBody,
	TotalSalesTargetsSettingLines,
} from '@norwegianForestTables/salesTargets/_types';
import {
	PackageServiceItemBody,
	PackageServiceItemLines,
	PosSalonCouponBody,
	PosSalonCouponLines,
	PosSalonPromotionBody,
	PosSalonPromotionLines,
	PosServiceReturnBody,
	PosServiceReturnLines,
	PosServiceSaleBody,
	PosServiceSaleLines,
	ServiceItemBody,
	ServiceItemLines,
} from '@norwegianForestTables/salonPos/_type';
import {
	LongTermRebateConfigBody,
	LongTermRebateConfigLines,
	LongTermRebateContractAdjustmentBody,
	LongTermRebateContractAdjustmentLines,
	LongTermRebateContractBody,
	LongTermRebateContractLines,
	LongTermRebateSnapshotBody,
	LongTermRebateSnapshotVersionBody,
	RebateTimeRangeConfigBody,
} from '@norwegianForestTables/scm/_type';
import {
	AbnormalLoginLogBody,
	AnnouncementBody,
	AnnouncementLines,
	EnumBody,
	LimitBody,
	PosVersionHashBody,
	PrintTemplateBody,
	PrintTemplateLines,
} from '@norwegianForestTables/setting/type';
import {
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
import { WdsInventorySyncBackBody, WdsProductSyncBackBody, WdsProductSyncBody } from '@norwegianForestTables/wds/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import {
	CronViewBody,
	EmailBody,
	EmailLines,
	File2Body,
	FileCategoryBody,
	RoleBody,
	RoleLines,
	TodoJobBody,
	TodoJobLines,
	TodoJobLogBody,
	TodoJobLogLines,
	UserBody,
} from '@norwegianForestTypes/systemTable';
import { MyTableBody, MyTableLines } from '@norwegianForestTypes/table';
import { GQLMutationOperation, SchemaDefineContent } from '../type';

type SystemDefaultOperation = Extract<GQLMutationOperation, 'insert' | 'update'>;
type SystemRecordsSchemaDefine = {
	[SYSTEM_TABLE_NAME.TABLE]: SchemaDefineContent<SafeRecord2<MyTableBody, MyTableLines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.USER]: SchemaDefineContent<SafeRecord2<UserBody>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.ROLE]: SchemaDefineContent<SafeRecord2<RoleBody, RoleLines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.APPROVAL2]: SchemaDefineContent<SafeRecord2<ApprovalRegenerateBody>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.EMAIL]: SchemaDefineContent<SafeRecord2<EmailBody, EmailLines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.FILE2]: SchemaDefineContent<SafeRecord2<File2Body>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.FILE_CATEGORY]: SchemaDefineContent<SafeRecord2<FileCategoryBody>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.TODO_JOB]: SchemaDefineContent<SafeRecord2<TodoJobBody, TodoJobLines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.JOB_LOG]: SchemaDefineContent<SafeRecord2<TodoJobLogBody, TodoJobLogLines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.LOG2]: SchemaDefineContent<SafeRecord2<Log2Body, Log2Lines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.CRON_LOG]: SchemaDefineContent<SafeRecord2<CronLogBody>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.CRON_VIEW]: SchemaDefineContent<SafeRecord2<CronViewBody>, SystemDefaultOperation>;
};
type NormalDefaultOperation = Extract<GQLMutationOperation, 'insert' | 'update' | 'archive'>;
type NorwegianforestRecordsSchemaDefine = {
	//#region boxful
	[TABLE_NAME.BOXFUL_TASK]: SchemaDefineContent<SafeRecord2<BoxfulTaskBody>, NormalDefaultOperation>;
	//#endregion

	//#region DSV
	[TABLE_NAME.DSV_DAILY_TASK]: SchemaDefineContent<SafeRecord2<DSVDailyTaskBody, DSVDailyTaskLines>, NormalDefaultOperation>;
	[TABLE_NAME.DSV_INVENTORY]: SchemaDefineContent<SafeRecord2<DSVInventoryBody>, NormalDefaultOperation>;
	[TABLE_NAME.DSV_INVENTORY_OPERATION]: SchemaDefineContent<SafeRecord2<DSVInventoryOperationBody>, NormalDefaultOperation>;
	[TABLE_NAME.DSV_ORDER]: SchemaDefineContent<SafeRecord2<DSVOrderBody>, NormalDefaultOperation>;
	[TABLE_NAME.DSV_ORDER_DETAIL]: SchemaDefineContent<SafeRecord2<DSVOrderDetailBody>, NormalDefaultOperation>;
	[TABLE_NAME.DSV_SHIPMENT]: SchemaDefineContent<SafeRecord2<DSVShipmentBody, DSVShipmentLines>, NormalDefaultOperation>;
	//#endregion

	//#region emarsys
	[TABLE_NAME.EM_PRODUCT_TASK]: SchemaDefineContent<SafeRecord2<EmProductTaskBody>, NormalDefaultOperation>;
	[TABLE_NAME.EM_STORE_TASK]: SchemaDefineContent<SafeRecord2<EmStoreTaskBody>, NormalDefaultOperation>;
	[TABLE_NAME.EM_SALE_TASK]: SchemaDefineContent<SafeRecord2<EmSaleTaskBody, EmSaleTaskLines>, NormalDefaultOperation>;
	[TABLE_NAME.EM_CONTACT_TASK]: SchemaDefineContent<SafeRecord2<EmContactTaskBody>, NormalDefaultOperation>;
	[TABLE_NAME.EM_WEBHOOK]: SchemaDefineContent<SafeRecord2<EmWebhookBody>, NormalDefaultOperation>;
	//#endregion

	//#region expense
	[TABLE_NAME.EXPENSE]: SchemaDefineContent<SafeRecord2<ExpenseBody, ExpenseLines>, NormalDefaultOperation>;
	[TABLE_NAME.EXPENSE_CATEGORY]: SchemaDefineContent<SafeRecord2<ExpenseCategoryBody>, NormalDefaultOperation>;
	[TABLE_NAME.EXPENSE_CLASS]: SchemaDefineContent<SafeRecord2<ExpenseClassBody>, NormalDefaultOperation>;
	//#endregion

	//#region foodpanda
	[TABLE_NAME.FOODPANDA_STORE]: SchemaDefineContent<SafeRecord2<FoodpandaStoreBody>, NormalDefaultOperation>;
	[TABLE_NAME.FOODPANDA_ITEM]: SchemaDefineContent<SafeRecord2<FoodpandaItemBody, FoodpandaItemLines>, NormalDefaultOperation>;
	//#endregion

	//#region function
	[TABLE_NAME.NS_DELETE]: SchemaDefineContent<SafeRecord2<NSDeleteBody>, NormalDefaultOperation>;
	[TABLE_NAME.POS_NETSUITE]: SchemaDefineContent<SafeRecord2<PosNetSuiteBody>, NormalDefaultOperation>;
	[TABLE_NAME.EC_NETSUITE]: SchemaDefineContent<SafeRecord2<ECNetSuiteBody>, NormalDefaultOperation>;
	[TABLE_NAME.MA_NETSUITE]: SchemaDefineContent<SafeRecord2<MaNetSuiteBody>, NormalDefaultOperation>;
	[TABLE_NAME.GEN_APPROVAL_CHAIN]: SchemaDefineContent<SafeRecord2<GenApprovalChainBody>, NormalDefaultOperation>;
	[TABLE_NAME.BATCH_BILL]: SchemaDefineContent<SafeRecord2<BatchBillBody>, NormalDefaultOperation>;
	[TABLE_NAME.APPROVAL_REGENERATE]: SchemaDefineContent<SafeRecord2<ApprovalRegenerateBody>, NormalDefaultOperation>;
	[TABLE_NAME.ONE_NETSUITE]: SchemaDefineContent<SafeRecord2<OneNetSuiteBody>, NormalDefaultOperation>;
	//#endregion

	//#region inventory
	[TABLE_NAME.LOCK]: SchemaDefineContent<SafeRecord2<LockBody, LockLines>, NormalDefaultOperation>;
	[TABLE_NAME.LOCK_ADJUSTMENT]: SchemaDefineContent<SafeRecord2<LockAdjustmentBody, LockAdjustmentLines>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_RECEIPT]: SchemaDefineContent<SafeRecord2<ItemReceiptBody, ItemReceiptLines>, NormalDefaultOperation>;
	[TABLE_NAME.LOCATION]: SchemaDefineContent<SafeRecord2<LocationBody>, NormalDefaultOperation>;
	[TABLE_NAME.TRANSFER_ORDER]: SchemaDefineContent<SafeRecord2<TransferOrderBody, TransferOrderLines>, NormalDefaultOperation>;
	[TABLE_NAME.ADJUSTMENT]: SchemaDefineContent<SafeRecord2<AdjustmentBody, AdjustmentLines>, NormalDefaultOperation>;
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
		NormalDefaultOperation
	>;
	[TABLE_NAME.PURCHASE_ADJUSTMENT_CLOSED]: SchemaDefineContent<
		SafeRecord2<PurchaseAdjustmentClosedBody, PurchaseAdjustmentClosedLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.CUSTOMER_ORDER_BALANCE_OPERATION]: SchemaDefineContent<
		SafeRecord2<CustomerOrderBalanceOperationBody>,
		NormalDefaultOperation
	>;
	//#endregion

	//#region memberRights
	[TABLE_NAME.POINT_ACCOUNT]: SchemaDefineContent<SafeRecord2<PointAccountBody, PointAccountLines>, NormalDefaultOperation>;
	[TABLE_NAME.PET_PARK_COUPON_EVENT]: SchemaDefineContent<
		SafeRecord2<PetParkCouponEventBody, PetParkCouponEventLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.PET_PARK_COUPON_ASSIGN]: SchemaDefineContent<
		SafeRecord2<PetParkCouponAssignBody, PetParkCouponAssignLines>,
		NormalDefaultOperation
	>;
	petparkcouponexpiration: SchemaDefineContent<
		SafeRecord2<PetParkCouponExpirationBody, PetParkCouponExpirationLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.PET_PARK_COUPON]: SchemaDefineContent<SafeRecord2<PetParkCouponBody>, NormalDefaultOperation>;
	[TABLE_NAME.MEMBER_CLASS]: SchemaDefineContent<SafeRecord2<MemberClassBody>, NormalDefaultOperation>;
	[TABLE_NAME.POINT_PROMOTION]: SchemaDefineContent<SafeRecord2<PointPromotionBody, PointPromotionLines>, NormalDefaultOperation>;
	[TABLE_NAME.POINT_DISCOUNT]: SchemaDefineContent<SafeRecord2<PointDiscountBody>, NormalDefaultOperation>;
	[TABLE_NAME.CRESC_LAB_SYNC_MEMBER]: SchemaDefineContent<
		SafeRecord2<CrescLabSyncMemberBody, CrescLabSyncMemberLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.GIVE_POINT_SETTING]: SchemaDefineContent<SafeRecord2<GivePointSettingBody, GivePointSettingLines>, NormalDefaultOperation>;
	[TABLE_NAME.IMPORT_POINT]: SchemaDefineContent<SafeRecord2<ImportPointBody, ImportPointLines>, NormalDefaultOperation>;
	[TABLE_NAME.MEMBER_MERGE]: SchemaDefineContent<SafeRecord2<MemberMergeBody>, NormalDefaultOperation>;
	[TABLE_NAME.MEMBER_AUTO_ARCHIVE]: SchemaDefineContent<SafeRecord2<MemberAutoArchiveBody>, NormalDefaultOperation>;
	[TABLE_NAME.OCARD_SYNC_TASK]: SchemaDefineContent<SafeRecord2<OCardSyncTaskBody, OCardSyncTaskLines>, NormalDefaultOperation>;
	[TABLE_NAME.OCARD_SYNC_POINT_TASK]: SchemaDefineContent<
		SafeRecord2<OCardSyncPointTaskBody, OCardSyncPointTaskLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.AUTO_UPDATE_MEMBER_CLASS]: SchemaDefineContent<SafeRecord2<AutoUpdateMemberClassBody>, NormalDefaultOperation>;
	//#endregion

	//#region pchome
	[TABLE_NAME.PCHOME_INVENTORY_TASK]: SchemaDefineContent<SafeRecord2<PChomeInventoryTaskBody>, NormalDefaultOperation>;
	//#endregion

	//#region pos
	[TABLE_NAME.EXPENDITURE]: SchemaDefineContent<SafeRecord2<ExpenditureBody>, NormalDefaultOperation>;
	[TABLE_NAME.POS_CONFIG]: SchemaDefineContent<SafeRecord2<PosConfigBody>, NormalDefaultOperation>;
	[TABLE_NAME.POS_COUPON]: SchemaDefineContent<SafeRecord2<PosCouponBody, PosCouponLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_EGUI_NO]: SchemaDefineContent<SafeRecord2<PosEGUINoBody, PosEGUINoLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_FREEBIE]: SchemaDefineContent<SafeRecord2<PosFreebieBody, PosFreebieLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_MEMBER]: SchemaDefineContent<SafeRecord2<PosMemberBody, PosMemberLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_ORDER_DISCOUNT]: SchemaDefineContent<SafeRecord2<PosOrderDiscountBody, PosOrderDiscountLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_PET]: SchemaDefineContent<SafeRecord2<PosPetBody, PosPetLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_PET_SPECIES]: SchemaDefineContent<SafeRecord2<PosPetSpeciesBody>, NormalDefaultOperation>;
	[TABLE_NAME.POS_PILOT]: SchemaDefineContent<SafeRecord2<PosPilotBody, PosPilotLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_PROMOTION]: SchemaDefineContent<SafeRecord2<PosPromotionBody, PosPromotionLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_REPORT]: SchemaDefineContent<SafeRecord2<PosReportBody>, NormalDefaultOperation>;
	[TABLE_NAME.POS_RETURN]: SchemaDefineContent<SafeRecord2<PosReturnBody, PosReturnLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_SALE]: SchemaDefineContent<SafeRecord2<PosSaleBody, PosSaleLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_SALE_SNAPSHOT]: SchemaDefineContent<SafeRecord2<PosSaleSnapshotBody, PosSaleSnapshotLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_SHELF]: SchemaDefineContent<SafeRecord2<PosShelfBody, PosShelfLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_SHELF_GROUP]: SchemaDefineContent<SafeRecord2<PosShelfGroupBody>, NormalDefaultOperation>;
	[TABLE_NAME.POS_SHORTCUT]: SchemaDefineContent<SafeRecord2<PosShortcutBody, PosShortcutLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_STORE]: SchemaDefineContent<SafeRecord2<PosStoreBody, PosStoreLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_STORE_GROUP]: SchemaDefineContent<SafeRecord2<PosStoreGroupBody, PosStoreGroupLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_STORE_SHELF]: SchemaDefineContent<SafeRecord2<PosStoreShelfBody, PosStoreShelfLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_VOUCHER]: SchemaDefineContent<SafeRecord2<PosVoucherBody, PosVoucherLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_VOUCHER_LOG]: SchemaDefineContent<SafeRecord2<PosVoucherLogBody, PosVoucherLogLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_PRINTABLE_COUPON]: SchemaDefineContent<
		SafeRecord2<PosPrintableCouponBody, PosPrintableCouponLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.POS_DEPOSIT]: SchemaDefineContent<SafeRecord2<PosDepositBody, PosDepositLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_DEPOSIT_WITHDRAW]: SchemaDefineContent<
		SafeRecord2<PosDepositWithdrawBody, PosDepositWithdrawLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.POS_CUSTOMER_ORDER]: SchemaDefineContent<SafeRecord2<PosCustomerOrderBody, PosCustomerOrderLines>, NormalDefaultOperation>;
	//#endregion

	//#region procurement
	[TABLE_NAME.REQUISITION]: SchemaDefineContent<SafeRecord2<RequisitionBody, RequisitionLines>, NormalDefaultOperation>;
	[TABLE_NAME.PURCHASE_ORDER]: SchemaDefineContent<SafeRecord2<PurchaseOrderBody, PurchaseOrderLines>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM]: SchemaDefineContent<SafeRecord2<ItemBody, ItemLines>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_EC]: SchemaDefineContent<SafeRecord2<ItemECBody, ItemECLines>, NormalDefaultOperation>;
	[TABLE_NAME.ITEM_EC_CATEGORY]: SchemaDefineContent<SafeRecord2<ItemECCategoryBody>, NormalDefaultOperation>;
	[TABLE_NAME.PREFERRED_VENDOR]: SchemaDefineContent<SafeRecord2<PreferredVendorBody>, NormalDefaultOperation>;
	[TABLE_NAME.VENDOR]: SchemaDefineContent<SafeRecord2<VendorBody, VendorLines>, NormalDefaultOperation>;
	[TABLE_NAME.RETURN_ORDER]: SchemaDefineContent<SafeRecord2<ReturnOrderBody, ReturnOrderLines>, NormalDefaultOperation>;
	[TABLE_NAME.RETURN_ADJUSTMENT]: SchemaDefineContent<SafeRecord2<ReturnAdjustmentBody, ReturnAdjustmentLines>, NormalDefaultOperation>;
	[TABLE_NAME.RETURN_ADJUSTMENT_CLOSED]: SchemaDefineContent<
		SafeRecord2<ReturnAdjustmentClosedBody, ReturnAdjustmentClosedLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.BILL_NOTE]: SchemaDefineContent<SafeRecord2<BillNoteBody, BillNoteLines>, NormalDefaultOperation>;
	[TABLE_NAME.BILL]: SchemaDefineContent<SafeRecord2<BillBody, BillLines>, NormalDefaultOperation>;
	[TABLE_NAME.REORDER]: SchemaDefineContent<SafeRecord2<ReorderBody, ReorderLines>, NormalDefaultOperation>;
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
	//#endregion

	//#region reconciliation
	[TABLE_NAME.BANK_RECONCILIATION]: SchemaDefineContent<SafeRecord2<BankReconciliationRecordBody>, NormalDefaultOperation>;
	[TABLE_NAME.RECONCILIATION_RESULT]: SchemaDefineContent<SafeRecord2<ReconciliationResultBody>, NormalDefaultOperation>;
	[TABLE_NAME.IMPORT_RECONCILIATION]: SchemaDefineContent<
		SafeRecord2<ImportReconciliationBody, ImportReconciliationLines>,
		NormalDefaultOperation
	>;
	//#endregion

	//#region sales
	[TABLE_NAME.CUSTOMER]: SchemaDefineContent<SafeRecord2<CustomerBody>, NormalDefaultOperation>;
	[TABLE_NAME.SALE_ORDER]: SchemaDefineContent<SafeRecord2<SaleOrderBody, SaleOrderLines>, NormalDefaultOperation>;
	[TABLE_NAME.SALE_RETURN]: SchemaDefineContent<SafeRecord2<SaleReturnBody, SaleReturnLines>, NormalDefaultOperation>;
	//#endregion

	//#region salonPos
	[TABLE_NAME.PACKAGE_SERVICE_ITEM]: SchemaDefineContent<
		SafeRecord2<PackageServiceItemBody, PackageServiceItemLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.POS_SALON_COUPON]: SchemaDefineContent<SafeRecord2<PosSalonCouponBody, PosSalonCouponLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_SALON_PROMOTION]: SchemaDefineContent<
		SafeRecord2<PosSalonPromotionBody, PosSalonPromotionLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.SERVICE_ITEM]: SchemaDefineContent<SafeRecord2<ServiceItemBody, ServiceItemLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_SERVICE_SALE]: SchemaDefineContent<SafeRecord2<PosServiceSaleBody, PosServiceSaleLines>, NormalDefaultOperation>;
	[TABLE_NAME.POS_SERVICE_RETURN]: SchemaDefineContent<SafeRecord2<PosServiceReturnBody, PosServiceReturnLines>, NormalDefaultOperation>;
	//#endregion

	//#region scm
	[TABLE_NAME.REBATE_TIME_RANGE_CONFIG]: SchemaDefineContent<SafeRecord2<RebateTimeRangeConfigBody>, NormalDefaultOperation>;
	[TABLE_NAME.LONG_TERM_REBATE_CONFIG]: SchemaDefineContent<
		SafeRecord2<LongTermRebateConfigBody, LongTermRebateConfigLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.LONG_TERM_REBATE_CONTRACT]: SchemaDefineContent<
		SafeRecord2<LongTermRebateContractBody, LongTermRebateContractLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.LONG_TERM_REBATE_CONTRACT_ADJUSTMENT]: SchemaDefineContent<
		SafeRecord2<LongTermRebateContractAdjustmentBody, LongTermRebateContractAdjustmentLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.LONG_TERM_REBATE_SNAPSHOT]: SchemaDefineContent<SafeRecord2<LongTermRebateSnapshotBody>, NormalDefaultOperation>;
	[TABLE_NAME.LONG_TERM_REBATE_SNAPSHOT_VERSION]: SchemaDefineContent<
		SafeRecord2<LongTermRebateSnapshotVersionBody>,
		NormalDefaultOperation
	>;
	//#endregion

	//#region ubereats
	[TABLE_NAME.UBEREATS_STORE]: SchemaDefineContent<SafeRecord2<UberEatsStoreBody, UberEatsStoreLines>, NormalDefaultOperation>;
	[TABLE_NAME.UBEREATS_ITEM]: SchemaDefineContent<SafeRecord2<UberEatsItemBody, UberEatsItemLines>, NormalDefaultOperation>;
	[TABLE_NAME.UBEREATS_MENU]: SchemaDefineContent<SafeRecord2<UberEatsMenuBody, UberEatsMenuLines>, NormalDefaultOperation>;
	[TABLE_NAME.UBEREATS_CATEGORY]: SchemaDefineContent<SafeRecord2<UberEatsCategoryBody, UberEatsCategoryLines>, NormalDefaultOperation>;
	[TABLE_NAME.UBEREATS_STORE_ITEM]: SchemaDefineContent<SafeRecord2<UberEatsStoreItemBody>, NormalDefaultOperation>;
	[TABLE_NAME.UBEREATS_TOKEN]: SchemaDefineContent<SafeRecord2<UberEatsTokenBody>, NormalDefaultOperation>;
	//#endregion

	//#region magento
	[TABLE_NAME.MA_3PL_TOKEN]: SchemaDefineContent<SafeRecord2<Ma3PLTokenBody>, NormalDefaultOperation>;
	[TABLE_NAME.MA_FAST_BUY_ORDER]: SchemaDefineContent<SafeRecord2<MaFastBuyOrderBody, MaFastBuyOrderLines>, NormalDefaultOperation>;
	[TABLE_NAME.MA_FAST_BUY_RETURN]: SchemaDefineContent<SafeRecord2<MaFastBuyReturnBody, MaFastBuyReturnLines>, NormalDefaultOperation>;
	[TABLE_NAME.MA_FAST_BUY_REFUND]: SchemaDefineContent<SafeRecord2<MaFastBuyRefundBody, MaFastBuyRefundLines>, NormalDefaultOperation>;
	[TABLE_NAME.MA_SHOP_ORDER]: SchemaDefineContent<SafeRecord2<MaShopOrderBody, MaShopOrderLines>, NormalDefaultOperation>;
	[TABLE_NAME.MA_SHOP_RETURN]: SchemaDefineContent<SafeRecord2<MaShopReturnBody, MaShopReturnLines>, NormalDefaultOperation>;
	[TABLE_NAME.MA_SHOP_REFUND]: SchemaDefineContent<SafeRecord2<MaShopRefundBody, MaShopRefundLines>, NormalDefaultOperation>;
	[TABLE_NAME.MA_SHOP_PERFORMANCE]: SchemaDefineContent<SafeRecord2<MaShopPerformanceBody>, NormalDefaultOperation>;
	[TABLE_NAME.MA_PARTIAL_ORDER]: SchemaDefineContent<SafeRecord2<MaPartialOrderBody, MaPartialOrderLines>, NormalDefaultOperation>;
	[TABLE_NAME.MA_PARTIAL_EXCHANGE]: SchemaDefineContent<
		SafeRecord2<MaPartialExchangeBody, MaPartialExchangeLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.MA_PARTIAL_RETURN]: SchemaDefineContent<SafeRecord2<MaPartialReturnBody, MaPartialReturnLines>, NormalDefaultOperation>;
	[TABLE_NAME.MA_PARTIAL_REFUND]: SchemaDefineContent<SafeRecord2<MaPartialRefundBody, MaPartialRefundLines>, NormalDefaultOperation>;
	//#endregion

	//#region salesTargets
	[TABLE_NAME.TOTAL_SALES_TARGETS_SETTING]: SchemaDefineContent<
		SafeRecord2<TotalSalesTargetsSettingBody, TotalSalesTargetsSettingLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.SALON_SALES_TARGETS_SETTING]: SchemaDefineContent<
		SafeRecord2<SalonSalesTargetsSettingBody, SalonSalesTargetsSettingLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.POS_TARGET_TRACKING_SETTING]: SchemaDefineContent<
		SafeRecord2<PosTargetTrackingSettingBody, PosTargetTrackingSettingLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.SALON_TARGET_TRACKING_SETTING]: SchemaDefineContent<
		SafeRecord2<SalonTargetTrackingSettingBody, SalonTargetTrackingSettingLines>,
		NormalDefaultOperation
	>;
	//#endregion

	//#region setting
	[TABLE_NAME.PRINT_TEMPLATE]: SchemaDefineContent<SafeRecord2<PrintTemplateBody, PrintTemplateLines>, NormalDefaultOperation>;
	[TABLE_NAME.LIMIT]: SchemaDefineContent<SafeRecord2<LimitBody>, NormalDefaultOperation>;
	[TABLE_NAME.ENUM]: SchemaDefineContent<SafeRecord2<EnumBody>, NormalDefaultOperation>;
	[TABLE_NAME.ANNOUNCEMENT]: SchemaDefineContent<SafeRecord2<AnnouncementBody, AnnouncementLines>, NormalDefaultOperation>;
	[TABLE_NAME.ABNORMAL_LOGIN_LOG]: SchemaDefineContent<SafeRecord2<AbnormalLoginLogBody>, NormalDefaultOperation>;
	[TABLE_NAME.POS_VERSION_HASH]: SchemaDefineContent<SafeRecord2<PosVersionHashBody>, NormalDefaultOperation>;
	//#endregion

	//#region wds
	[TABLE_NAME.WDS_PRODUCT_SYNC]: SchemaDefineContent<SafeRecord2<WdsProductSyncBody>, NormalDefaultOperation>;
	[TABLE_NAME.WDS_PRODUCT_SYNC_BACK]: SchemaDefineContent<SafeRecord2<WdsProductSyncBackBody>, NormalDefaultOperation>;
	[TABLE_NAME.WDS_INVENTORY_SYNC_BACK]: SchemaDefineContent<SafeRecord2<WdsInventorySyncBackBody>, NormalDefaultOperation>;
	//#endregion
};
export type RecordsSchemaDefine = NorwegianforestRecordsSchemaDefine & SystemRecordsSchemaDefine;
