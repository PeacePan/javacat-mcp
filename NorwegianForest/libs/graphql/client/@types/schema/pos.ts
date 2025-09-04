import { TABLE_NAME } from '@norwegianForestTables/const';
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
import { SafeRecord2 } from '@norwegianForestTypes';
import { ExecuteDefineContent, NormalDefaultOperation, SchemaDefineContent } from '../';

export type PosTableRecordsSchemaDefine = {
	[TABLE_NAME.EXPENDITURE]: SchemaDefineContent<SafeRecord2<ExpenditureBody>, NormalDefaultOperation, true>;
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
	[TABLE_NAME.POS_REPORT]: SchemaDefineContent<
		SafeRecord2<PosReportBody>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<'closeEntry', SafeRecord2<Pick<PosReportBody, 'squaringUserName' | 'memo'>>>
	>;
	[TABLE_NAME.POS_RETURN]: SchemaDefineContent<
		SafeRecord2<PosReturnBody, PosReturnLines>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<'refund', SafeRecord2<never, Pick<PosReturnLines, 'refunds'>>> &
			ExecuteDefineContent<'cancel', never> &
			ExecuteDefineContent<
				'finish',
				SafeRecord2<Pick<PosReturnBody, 'salerName' | 'eGUICanceledAt' | 'creditNoteId' | 'creditNoteNo' | 'creditNoteCreatedAt'>>
			>
	>;
	[TABLE_NAME.POS_SALE]: SchemaDefineContent<
		SafeRecord2<PosSaleBody, PosSaleLines>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<
			'finishCheckout',
			SafeRecord2<Pick<PosSaleBody, 'eGUIUniNo' | 'eGUICarrier' | 'eGUINo' | 'reportName' | 'invoiceId'>>,
			string
		>
	>;
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
	[TABLE_NAME.POS_CUSTOMER_ORDER]: SchemaDefineContent<
		SafeRecord2<PosCustomerOrderBody, PosCustomerOrderLines>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<
			'更新客訂單表頭',
			SafeRecord2<
				Partial<Pick<PosCustomerOrderBody, 'status' | 'saleName' | 'memberName' | 'contactName' | 'contactPhone' | 'contactMethod'>>
			>,
			string
		>
	>;
};
