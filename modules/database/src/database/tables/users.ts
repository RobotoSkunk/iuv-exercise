
export const tableName = 'users';

export interface DB_Users
{
	id?: string;
	name?: string;
	lastname_father?: string;
	lastname_mother?: string;
	serial?: string;
	password?: string;
	role_id?: number;
}

export type PartialDB = { [ tableName ]: DB_Users };
