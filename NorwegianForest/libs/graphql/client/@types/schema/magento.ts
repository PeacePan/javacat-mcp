import { TABLE_NAME } from '@norwegianForestTables/const';
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
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type MagentoTableRecordsSchemaDefine = {
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
};
