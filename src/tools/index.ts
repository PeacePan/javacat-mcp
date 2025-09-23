import { getTableSchema } from './getTableSchema';
import { listAvailableTables } from './listAvailableTables';
import { queryTableRecords } from './queryTableRecords';
import { quickQueryTable } from './quickQueryTable';
import { ToolContext, ToolDefinition } from './types';

export const getAllTools = (context: ToolContext): ToolDefinition[] => [
	queryTableRecords(context),
	quickQueryTable(context),
	getTableSchema(context),
	listAvailableTables(context),
];

export * from './types';
export { queryTableRecords, quickQueryTable, getTableSchema, listAvailableTables };
