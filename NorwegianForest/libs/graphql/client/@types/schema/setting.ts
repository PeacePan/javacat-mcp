import { TABLE_NAME } from '@norwegianForestTables/const';
import {
	AbnormalLoginLogBody,
	AnnouncementBody,
	AnnouncementLines,
	EnumBody,
	LimitBody,
	PosVersionHashBody,
	PrintTemplateBody,
	PrintTemplateLines,
} from '@norwegianForestTables/setting/type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { NormalDefaultOperation, SchemaDefineContent } from '../';

export type SettingTableRecordsSchemaDefine = {
	[TABLE_NAME.PRINT_TEMPLATE]: SchemaDefineContent<SafeRecord2<PrintTemplateBody, PrintTemplateLines>, NormalDefaultOperation>;
	[TABLE_NAME.LIMIT]: SchemaDefineContent<SafeRecord2<LimitBody>, NormalDefaultOperation>;
	[TABLE_NAME.ENUM]: SchemaDefineContent<SafeRecord2<EnumBody>, NormalDefaultOperation>;
	[TABLE_NAME.ANNOUNCEMENT]: SchemaDefineContent<SafeRecord2<AnnouncementBody, AnnouncementLines>, NormalDefaultOperation>;
	[TABLE_NAME.ABNORMAL_LOGIN_LOG]: SchemaDefineContent<SafeRecord2<AbnormalLoginLogBody>, NormalDefaultOperation>;
	[TABLE_NAME.POS_VERSION_HASH]: SchemaDefineContent<SafeRecord2<PosVersionHashBody>, NormalDefaultOperation>;
};
