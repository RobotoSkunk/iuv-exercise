
import client from '../database';
import Entity from './entity';

class User implements Entity
{
	protected _serial: string;
	public name: string;
	public lastnameFather: string;
	public lastnameMother: string;

	constructor(
		serial: string,
		name: string,
		lastnameFather: string,
		lastnameMother: string)
	{
		this._serial = serial;
		this.name = name;
		this.lastnameFather = lastnameFather;
		this.lastnameMother = lastnameMother;
	}

	public get serial()
	{
		return this._serial;
	}

	public async syncToDatabase()
	{
		try {
			await client.connection
				.updateTable('users')
				.set({
					name: this.name,
					lastname_father: this.lastnameFather,
					lastname_mother: this.lastnameMother,
				})
				.execute();
		} catch (error) {
			throw error;
		}
	}

	public static async getBySerial(serial: string)
	{
		const userData = await client.connection
			.selectFrom('users')
			.selectAll()
			.where('id', '=', serial)
			.executeTakeFirst();

		if (!userData) {
			return undefined;
		}

		return new User(
			userData.id as string,
			userData.name as string,
			userData.lastname_father as string,
			userData.lastname_mother as string);
	}

	// A register method should be here, but TypeScript is dumb and doesn't understand how to overload properly.
}

export default User;
