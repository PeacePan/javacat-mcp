import { CronLogBody } from '@javaCat/@type/tables/cronlog';
import { Log2Body, Log2Lines } from '@javaCat/@type/tables/log2';
import { SYSTEM_TABLE_NAME } from '@norwegianForestLibs/enum';
import { ApprovalRegenerateBody } from '@norwegianForestTables/function/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import {
	CronViewBody,
	EmailBody,
	EmailLines,
	File2Body,
	FileCategoryBody,
	RoleBody,
	RoleLines,
	TodoJobBody,
	TodoJobLines,
	TodoJobLogBody,
	TodoJobLogLines,
	UserBody,
} from '@norwegianForestTypes/systemTable';
import { MyTableBody, MyTableLines } from '@norwegianForestTypes/table';
import { SchemaDefineContent, SystemDefaultOperation } from '../';

export type SystemRecordsSchemaDefine = {
	[SYSTEM_TABLE_NAME.TABLE]: SchemaDefineContent<SafeRecord2<MyTableBody, MyTableLines>, SystemDefaultOperation | 'patch'>;
	[SYSTEM_TABLE_NAME.USER]: SchemaDefineContent<SafeRecord2<UserBody>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.ROLE]: SchemaDefineContent<SafeRecord2<RoleBody, RoleLines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.APPROVAL2]: SchemaDefineContent<SafeRecord2<ApprovalRegenerateBody>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.EMAIL]: SchemaDefineContent<SafeRecord2<EmailBody, EmailLines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.FILE2]: SchemaDefineContent<SafeRecord2<File2Body>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.FILE_CATEGORY]: SchemaDefineContent<SafeRecord2<FileCategoryBody>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.TODO_JOB]: SchemaDefineContent<SafeRecord2<TodoJobBody, TodoJobLines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.JOB_LOG]: SchemaDefineContent<SafeRecord2<TodoJobLogBody, TodoJobLogLines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.LOG2]: SchemaDefineContent<SafeRecord2<Log2Body, Log2Lines>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.CRON_LOG]: SchemaDefineContent<SafeRecord2<CronLogBody>, SystemDefaultOperation>;
	[SYSTEM_TABLE_NAME.CRON_VIEW]: SchemaDefineContent<SafeRecord2<CronViewBody>, SystemDefaultOperation>;
};
