import { BoxfulTableRecordsSchemaDefine } from './boxful';
import { DSVTableRecordsSchemaDefine } from './dsv';
import { EmarsysTableRecordsSchemaDefine } from './emarsys';
import { ExpenseTableRecordsSchemaDefine } from './expense';
import { FoodpandaTableRecordsSchemaDefine } from './foodpanda';
import { FunctionTableRecordsSchemaDefine } from './function';
import { InventoryTableRecordsSchemaDefine } from './inventory';
import { MagentoTableRecordsSchemaDefine } from './magento';
import { MemberRightsTableRecordsSchemaDefine } from './memberRights';
import { PchomeTableRecordsSchemaDefine } from './pchome';
import { PosTableRecordsSchemaDefine } from './pos';
import { ProcurementTableRecordsSchemaDefine } from './procurement';
import { ReconciliationTableRecordsSchemaDefine } from './reconciliation';
import { SalesTableRecordsSchemaDefine } from './sales';
import { SalesTargetsTableRecordsSchemaDefine } from './salesTargets';
import { SalonPosTableRecordsSchemaDefine } from './salonPos';
import { SCMTableRecordsSchemaDefine } from './scm';
import { SettingTableRecordsSchemaDefine } from './setting';
import { SystemRecordsSchemaDefine } from './system';
import { UberEatsTableRecordsSchemaDefine } from './ubereats';
import { WDSTableRecordsSchemaDefine } from './wds';

type NorwegianforestRecordsSchemaDefine = BoxfulTableRecordsSchemaDefine &
	DSVTableRecordsSchemaDefine &
	EmarsysTableRecordsSchemaDefine &
	ExpenseTableRecordsSchemaDefine &
	FoodpandaTableRecordsSchemaDefine &
	FunctionTableRecordsSchemaDefine &
	InventoryTableRecordsSchemaDefine &
	MagentoTableRecordsSchemaDefine &
	MemberRightsTableRecordsSchemaDefine &
	PchomeTableRecordsSchemaDefine &
	PosTableRecordsSchemaDefine &
	ProcurementTableRecordsSchemaDefine &
	ReconciliationTableRecordsSchemaDefine &
	SalesTableRecordsSchemaDefine &
	SalesTargetsTableRecordsSchemaDefine &
	SalonPosTableRecordsSchemaDefine &
	SCMTableRecordsSchemaDefine &
	SettingTableRecordsSchemaDefine &
	UberEatsTableRecordsSchemaDefine &
	WDSTableRecordsSchemaDefine;

export type RecordsSchemaDefine = SystemRecordsSchemaDefine & NorwegianforestRecordsSchemaDefine;
