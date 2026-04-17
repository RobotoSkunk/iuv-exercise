
export const tableName = 'placeholder';

export interface DB_Placeholder
{
	id?: string;
	type?: string;
	actor?: string;
	content?: string;
	created_at?: Date;
}

export type PartialDB = { [ tableName ]: DB_Placeholder };
