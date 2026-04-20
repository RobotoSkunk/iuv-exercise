
import client from '../database';
import Entity from './entity';


class Role implements Entity
{
	private _id: number;
	public name: string;
	public permissions: string[];

	constructor(id: number, name: string, permissions: string[])
	{
		this._id = id;
		this.name = name;
		this.permissions = permissions;
	}

	public get id()
	{
		return this._id;
	}

	public async syncToDatabase()
	{
		try {
			await client.connection
				.updateTable('roles')
				.set({
					name: this.name,
					permissions: this.permissions,
				})
				.where('id', '=', this._id)
				.execute();
		} catch (error) {
			throw error;
		}
	};

	public hasPermission(permission: string)
	{
		return this.permissions.includes(permission);
	};

	public static async register(name: string, permissions: string[])
	{
		await client.connection
			.insertInto('roles')
			.values({
				name,
				permissions,
			})
			.execute();
	}

	public static async getById(id: number)
	{
		const roleData = await client.connection
			.selectFrom('roles')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();

		if (!roleData) {
			return undefined;
		}

		return new Role(
			roleData.id as number,
			roleData.name as string,
			roleData.permissions as string[]);
	}

	public static async getAll()
	{
		const roles = await client.connection
			.selectFrom('roles')
			.selectAll()
			.execute();

		return roles.map(({ id, name, permissions }) => new Role(
			id as number,
			name as string,
			permissions as string[]
		));
	}
}

export default Role;
