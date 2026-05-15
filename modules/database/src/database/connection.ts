
import {
	Pool,
} from 'pg';

import {
	Kysely,
	Migrator,
	PostgresDialect,
	sql,
} from 'kysely';

import {
	DatabaseSchemaType,
	DatabaseSchema,
} from './schema';

import {
	ContextMigrationProvider,
} from './migrations/provider';

import argon2 from 'argon2';


import * as migrations from './migrations';


class Database
{
	/**
	 * Database connection pool
	 */
	private pool: Pool;

	/**
	 * Kysely connection
	 */
	private db: DatabaseSchema;

	/**
	 * Kysely migrator
	 */
	private migrator: Migrator;


	/**
	 * Create a new database connection pool based on environment variables
	 */
	constructor()
	{
		this.pool = new Pool({
			database: process.env.DB_NAME,
			host: process.env.DB_HOST,
			password: process.env.DB_PASSWORD,
			port: Number.parseInt(process.env.DB_PORT ?? '0'),
			user: process.env.DB_USER,
		});

		const dialect = new PostgresDialect({ pool: this.pool });
		this.db = new Kysely<DatabaseSchemaType>({ dialect });

		this.migrator = new Migrator({
			db: this.db,
			provider: new ContextMigrationProvider(migrations, 'pg')
		})
	}

	/**
	 * Test the database connection.
	 */
	public async prepare(): Promise<void>
	{
		try {
			const { roles_count } = await this.db
				.selectFrom('roles')
				.select(eb => eb.fn.countAll().as('roles_count'))
				.executeTakeFirstOrThrow();

			const { users_count } = await this.db
				.selectFrom('users')
				.select(eb => eb.fn.countAll().as('users_count'))
				.executeTakeFirstOrThrow();

			if (roles_count == 0) {
				await this.db
					.insertInto('roles')
					.values([
						{
							name: 'Administrador del sistema',
							permissions: [
								'admin.create',
								'admin.edit',
								'admin.delete',
								'role.create',
								'role.edit',
								'role.delete',
								'teacher.create',
								'teacher.edit',
								'teacher.delete',
							],
						},
						{
							name: 'Empleado',
							permissions: [
								'teacher.create',
								'teacher.edit',
								'teacher.delete',
							],
						},
					])
					.execute();
			}

			if (users_count == 0) {
				const password = await argon2.hash('1234');

				await this.db
					.insertInto('users')
					.values({
						id: 'ABC123',
						name: 'José Ignacio',
						lastname_father: 'Orozco',
						lastname_mother: 'Álvarez',
						role_id: 1,
						password,
					})
					.execute();
			}

			console.log('Database ready.');

		} catch (error) {
			console.error('An error ocurred while trying to test database connection.');
			throw error;
		}
	}

	/**
	 * Just a wrapper of migrateTo but with try/catch compatibility.
	 */
	public async tryMigrateTo(migration: string)
	{
		const { error, results } = await this.migrator.migrateTo(migration);
		
		if (error) {
			throw error;
		}

		if (!results) {
			throw new Error('An unknown error ocurred while migrating.');
		}

		return results;
	}


	/**
	 * Just a wrapper of migrateToLatest but with try/catch compatibility.
	 */
	public async tryMigrateToLatest()
	{
		const { error, results } = await this.migrator.migrateToLatest();
		
		if (error) {
			throw error;
		}

		if (!results) {
			throw new Error('An unknown error ocurred while migrating.');
		}

		return results;
	}

	public get connection()
	{
		return this.db;
	}
}

export default Database;
