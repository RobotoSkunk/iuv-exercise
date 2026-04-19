
export const tableName = 'attendances';

export interface DB_Attendances
{
	id?: string;
	teacher_id?: string;
	created_at?: Date;
	is_entry?: number;
}

export type PartialDB = { [ tableName ]: DB_Attendances };
