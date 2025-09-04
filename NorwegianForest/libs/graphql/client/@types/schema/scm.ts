import { TABLE_NAME } from '@norwegianForestTables/const';
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
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type SCMTableRecordsSchemaDefine = {
	[TABLE_NAME.REBATE_TIME_RANGE_CONFIG]: SchemaDefineContent<SafeRecord2<RebateTimeRangeConfigBody>, NormalDefaultOperation>;
	[TABLE_NAME.LONG_TERM_REBATE_CONFIG]: SchemaDefineContent<
		SafeRecord2<LongTermRebateConfigBody, LongTermRebateConfigLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.LONG_TERM_REBATE_CONTRACT]: SchemaDefineContent<
		SafeRecord2<LongTermRebateContractBody, LongTermRebateContractLines>,
		NormalDefaultOperation,
		true
	>;
	[TABLE_NAME.LONG_TERM_REBATE_CONTRACT_ADJUSTMENT]: SchemaDefineContent<
		SafeRecord2<LongTermRebateContractAdjustmentBody, LongTermRebateContractAdjustmentLines>,
		NormalDefaultOperation,
		true
	>;
	[TABLE_NAME.LONG_TERM_REBATE_SNAPSHOT]: SchemaDefineContent<SafeRecord2<LongTermRebateSnapshotBody>, NormalDefaultOperation>;
	[TABLE_NAME.LONG_TERM_REBATE_SNAPSHOT_VERSION]: SchemaDefineContent<
		SafeRecord2<LongTermRebateSnapshotVersionBody>,
		NormalDefaultOperation
	>;
};
