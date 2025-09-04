import { TABLE_NAME } from '@norwegianForestTables/const';
import {
	BankReconciliationRecordBody,
	ImportReconciliationBody,
	ImportReconciliationLines,
	ReconciliationResultBody,
} from '@norwegianForestTables/reconciliation/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type ReconciliationTableRecordsSchemaDefine = {
	[TABLE_NAME.BANK_RECONCILIATION]: SchemaDefineContent<SafeRecord2<BankReconciliationRecordBody>, NormalDefaultOperation>;
	[TABLE_NAME.RECONCILIATION_RESULT]: SchemaDefineContent<SafeRecord2<ReconciliationResultBody>, NormalDefaultOperation>;
	[TABLE_NAME.IMPORT_RECONCILIATION]: SchemaDefineContent<
		SafeRecord2<ImportReconciliationBody, ImportReconciliationLines>,
		NormalDefaultOperation
	>;
};
