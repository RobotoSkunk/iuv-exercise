
export const tableName = 'roles';

export interface DB_Roles
{
	id?: number;
	name?: string;
	permissions?: string[];
}

export type PartialDB = { [ tableName ]: DB_Roles };
