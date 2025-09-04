import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';

/**
 * 刷新當前的 JWT 令牌 (DEV only)
 * 使用現有的 JWT 令牌取得新的令牌，延長登入時效
 */
export default async function (client: ApolloClient<NormalizedCacheObject>): Promise<string | null> {
	const result = await client.query<{ jwt: string }>({
		query: gql('mutation { jwt: renew }'),
		fetchPolicy: 'no-cache',
	});
	const jwt = result.data?.jwt || null;
	return jwt;
}
