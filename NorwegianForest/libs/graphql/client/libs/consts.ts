import { ApprovalStatus, ArchivedStatus } from '@norwegianForestLibs/enum';
import { BUILTIN_BODY_FIELD2, NormField } from '@norwegianForestTypes';

/** GraphQL API 端點 */
export const cGraphQLEndPoints = {
	DEV: 'https://data-api-development.wonderpet.asia/graphql-omo',
	STAGING: 'https://data-api-staging.wonderpet.asia/graphql-omo',
	PRODUCTION: 'https://data-api-production.wonderpet.asia/graphql-omo',
};
/** 系統內建欄位 */
export const cSystemFields: Array<
	keyof BUILTIN_BODY_FIELD2 | '_createdBy_displayName' | '_updatedBy_displayName' | '_archivedBy_displayName'
> = [
	'_id',
	'_createdAt',
	'_createdBy',
	'_createdBy_displayName',
	'_updatedAt',
	'_updatedBy',
	'_updatedBy_displayName',
	'_archivedAt',
	'_archivedBy',
	'_archivedBy_displayName',
];
export const cNormField: Array<keyof NormField | 'boolean' | 'string' | 'number' | 'date' | 'id'> = [
	'fieldName',
	'valueType',
	'boolean',
	'date',
	'number',
	'string',
	'id',
];

/** 封存狀態 enum 值對照表 */
export const cArchivedStatusMap = {
	[ArchivedStatus.ARCHIVED_ONLY]: 'ARCHIVED_ONLY',
	[ArchivedStatus.ALL]: 'ALL',
	[ArchivedStatus.NORMAL]: 'NORMAL',
};
/** 簽核狀態 enum 值對照表 */
export const cApprovalStatusMap = {
	[ApprovalStatus.APPROVED]: 'APPROVED',
	[ApprovalStatus.DENIED]: 'DENIED',
	[ApprovalStatus.PENDING]: 'PENDING',
	[ApprovalStatus.ERROR]: 'ERROR',
};
