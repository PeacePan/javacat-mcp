import { TABLE_NAME } from '@norwegianForestTables/const';
import { ExpenseBody, ExpenseCategoryBody, ExpenseClassBody, ExpenseLines } from '@norwegianForestTables/expense/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type ExpenseTableRecordsSchemaDefine = {
	[TABLE_NAME.EXPENSE]: SchemaDefineContent<SafeRecord2<ExpenseBody, ExpenseLines>, NormalDefaultOperation, true>;
	[TABLE_NAME.EXPENSE_CATEGORY]: SchemaDefineContent<SafeRecord2<ExpenseCategoryBody>, NormalDefaultOperation>;
	[TABLE_NAME.EXPENSE_CLASS]: SchemaDefineContent<SafeRecord2<ExpenseClassBody>, NormalDefaultOperation>;
};
