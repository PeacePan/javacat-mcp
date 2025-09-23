import { JavaCatGraphQLClient } from '@norwegianForestLibs/graphql/client';

export type ToolContext = {
	graphqlClient: JavaCatGraphQLClient;
};

export interface ToolDefinition {
	name: string;
	description: string;
	parameters: any;
	execute: (args: any) => Promise<string>;
}
