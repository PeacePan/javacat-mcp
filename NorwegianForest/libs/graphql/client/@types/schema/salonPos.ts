import { TABLE_NAME } from '@norwegianForestTables/const';
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
import { SafeRecord2 } from '@norwegianForestTypes';
import { ExecuteDefineContent, NormalDefaultOperation, SchemaDefineContent } from '../';

export type SalonPosTableRecordsSchemaDefine = {
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
	[TABLE_NAME.POS_SERVICE_SALE]: SchemaDefineContent<
		SafeRecord2<PosServiceSaleBody, PosServiceSaleLines>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<
			'finishCheckout',
			SafeRecord2<
				Pick<PosServiceSaleBody, 'eGUIUniNo' | 'eGUICarrier' | 'eGUINo' | 'reportName' | 'configName' | 'invoiceType' | 'invoiceId'>
			>,
			string
		> &
			ExecuteDefineContent<'finishCheckout', never, string>
	>;
	[TABLE_NAME.POS_SERVICE_RETURN]: SchemaDefineContent<
		SafeRecord2<PosServiceReturnBody, PosServiceReturnLines>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<'refund', SafeRecord2<never, Pick<PosServiceReturnLines, 'refunds'>>, string> &
			ExecuteDefineContent<'cancel', never, string> &
			ExecuteDefineContent<
				'finish',
				SafeRecord2<
					Pick<PosServiceReturnBody, 'salerName' | 'eGUICanceledAt' | 'creditNoteId' | 'creditNoteNo' | 'creditNoteCreatedAt'>
				>,
				string
			>
	>;
};
