import { TABLE_NAME } from '@norwegianForestTables/const';
import { CustomerBody, SaleOrderBody, SaleOrderLines, SaleReturnBody, SaleReturnLines } from '@norwegianForestTables/sales/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type SalesTableRecordsSchemaDefine = {
	[TABLE_NAME.CUSTOMER]: SchemaDefineContent<SafeRecord2<CustomerBody>, NormalDefaultOperation, true>;
	[TABLE_NAME.SALE_ORDER]: SchemaDefineContent<SafeRecord2<SaleOrderBody, SaleOrderLines>, NormalDefaultOperation, true>;
	[TABLE_NAME.SALE_RETURN]: SchemaDefineContent<SafeRecord2<SaleReturnBody, SaleReturnLines>, NormalDefaultOperation, true>;
};
