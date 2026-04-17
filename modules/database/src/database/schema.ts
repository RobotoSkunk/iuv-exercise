
import {
	Kysely,
} from 'kysely';

import * as placeholder from './tables/placeholder';


export type DatabaseSchemaType =
	placeholder.PartialDB;


export type DatabaseSchema = Kysely<DatabaseSchemaType>;

export default DatabaseSchema;
