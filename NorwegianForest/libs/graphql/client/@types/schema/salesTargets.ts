import { TABLE_NAME } from '@norwegianForestTables/const';
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
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type SalesTargetsTableRecordsSchemaDefine = {
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
};
