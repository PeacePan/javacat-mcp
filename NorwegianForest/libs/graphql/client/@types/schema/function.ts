import { TABLE_NAME } from '@norwegianForestTables/const';
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
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type FunctionTableRecordsSchemaDefine = {
	[TABLE_NAME.NS_DELETE]: SchemaDefineContent<SafeRecord2<NSDeleteBody>, NormalDefaultOperation>;
	[TABLE_NAME.POS_NETSUITE]: SchemaDefineContent<SafeRecord2<PosNetSuiteBody>, NormalDefaultOperation>;
	[TABLE_NAME.EC_NETSUITE]: SchemaDefineContent<SafeRecord2<ECNetSuiteBody>, NormalDefaultOperation>;
	[TABLE_NAME.MA_NETSUITE]: SchemaDefineContent<SafeRecord2<MaNetSuiteBody>, NormalDefaultOperation>;
	[TABLE_NAME.GEN_APPROVAL_CHAIN]: SchemaDefineContent<SafeRecord2<GenApprovalChainBody>, NormalDefaultOperation>;
	[TABLE_NAME.BATCH_BILL]: SchemaDefineContent<SafeRecord2<BatchBillBody>, NormalDefaultOperation>;
	[TABLE_NAME.APPROVAL_REGENERATE]: SchemaDefineContent<SafeRecord2<ApprovalRegenerateBody>, NormalDefaultOperation>;
	[TABLE_NAME.ONE_NETSUITE]: SchemaDefineContent<SafeRecord2<OneNetSuiteBody>, NormalDefaultOperation>;
};
