
export const tableName = 'teachers';

export interface DB_Teachers
{
	id?: string;
	name?: string;
	lastname_father?: string;
	lastname_mother?: string;
	serial?: string;
}

export type PartialDB = { [ tableName ]: DB_Teachers };
