
import {
	Kysely,
} from 'kysely';

import * as attendances from './tables/attendances';
import * as auth_tokens from './tables/auth-tokens';
import * as roles from './tables/roles';
import * as teachers from './tables/teachers';
import * as users from './tables/users';


export type DatabaseSchemaType =
	attendances.PartialDB &
	auth_tokens.PartialDB &
	roles.PartialDB &
	teachers.PartialDB &
	users.PartialDB;


export type DatabaseSchema = Kysely<DatabaseSchemaType>;

export default DatabaseSchema;
