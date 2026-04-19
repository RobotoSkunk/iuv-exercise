
export const tableName = 'auth_tokens';

export interface DB_AuthTokens
{
	id?: string;
	user_id?: string;
	hmac_hash?: string;
	created_at?: Date;
	expires_at?: Date;
}

export type PartialDB = { [ tableName ]: DB_AuthTokens };
