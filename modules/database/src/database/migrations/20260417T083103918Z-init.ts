
import {
	Kysely,
	sql,
} from 'kysely';


async function up(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.createTable('teachers')
		.addColumn('id', 'uuid', cb => cb.primaryKey())
		.addColumn('name', 'text', cb => cb.notNull())
		.addColumn('lastname_father', 'text', cb => cb.notNull())
		.addColumn('lastname_mother', 'text', cb => cb.notNull())
		.addColumn('serial', 'text', cb => cb.notNull())
		.execute();

	await db.schema
		.createTable('roles')
		.addColumn('id', 'serial', cb => cb.primaryKey())
		.addColumn('name', 'text', cb => cb.notNull())
		.addColumn('permissions', sql`text[]`, cb => cb.notNull())
		.execute();

	await db.schema
		.createTable('users')
		.addColumn('id', 'uuid', cb => cb.primaryKey())
		.addColumn('name', 'text', cb => cb.notNull())
		.addColumn('lastname_father', 'text', cb => cb.notNull())
		.addColumn('lastname_mother', 'text', cb => cb.notNull())
		.addColumn('serial', 'text', cb => cb.notNull())
		.addColumn('password', 'text', cb => cb.notNull())
		.addColumn('role_id', 'integer', cb => cb.notNull())

		.addForeignKeyConstraint('fk_users_role_id', [ 'role_id' ], 'roles', [ 'id' ])
		.execute();

	await db.schema
		.createTable('attendances')
		.addColumn('id', 'uuid', cb => cb.primaryKey())
		.addColumn('teacher_id', 'uuid', cb => cb.notNull())
		.addColumn('created_at', 'timestamp', cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn('is_entry', 'boolean', cb => cb.notNull())

		.addForeignKeyConstraint('fk_attendances_teacher_id', [ 'teacher_id' ], 'teachers', [ 'id' ])
		.execute();

	await db.schema
		.createTable('auth_tokens')
		.addColumn('id', 'text', cb => cb.primaryKey())
		.addColumn('user_id', 'uuid', cb => cb.notNull())
		.addColumn('hmac_hash', 'text', cb => cb.notNull())
		.addColumn('created_at', 'timestamp', cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn('expires_at', 'timestamp', cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

		.addForeignKeyConstraint('fk_auth_tokens_user_id', [ 'user_id' ], 'users', [ 'id' ])
		.execute();
}

async function down(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.dropTable('auth_tokens')
		.execute();

	await db.schema
		.dropTable('attendances')
		.execute();

	await db.schema
		.dropTable('users')
		.execute();

	await db.schema
		.dropTable('teachers')
		.execute();

	await db.schema
		.dropTable('roles')
		.execute();
}


export {
	up,
	down,
};
