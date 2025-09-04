import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { mapNormRecord2AsMyRecord2 } from '@norwegianForestLibs/util';
import { NormGetArgs, NormRecord2, SafeRecord2 } from '@norwegianForestTypes';
import { cNormField } from '../libs/consts';
import { convertNormArgsToGraphQLType, variableStringGenerator } from '../libs/utils';
import { GraphQLNormArgs } from '../type';

const cVariablesTypeDefine = [
	'$table: String!',
	'$keyName: String!',
	'$keyValue: String!',
	'$archived: ArchivedStatus',
	'$approved: ApprovedStatus',
	'$skipLines: Boolean',
	'$selects: [String]',
].join(' ');
const cVariableString = `${variableStringGenerator(cVariablesTypeDefine)}`;

/** 使用 keyName, keyValue 抓取單一筆資料 */
export default async function <SpecificRecord extends SafeRecord2 = SafeRecord2>(
	client: ApolloClient<NormalizedCacheObject>,
	getArgs: NormGetArgs
): Promise<SpecificRecord | null> {
	const res = await client.query<{ getV2: NormRecord2 }, GraphQLNormArgs<NormGetArgs>>({
		query: gql`
        query(${cVariablesTypeDefine}) {
            getV2(${cVariableString}) {
                bodyFields { ${cNormField.join(' ')} }
                lineRows { lineName lineFields { ${cNormField.join(' ')} } }
            }
        }`,
		variables: convertNormArgsToGraphQLType(getArgs),
		fetchPolicy: 'no-cache',
	});
	const NormRecord2 = res?.data?.getV2 ?? null;
	return NormRecord2 && (mapNormRecord2AsMyRecord2(NormRecord2) as SpecificRecord);
}
