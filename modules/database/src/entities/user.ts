
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

	public static async register(
		serial: string,
		name: string,
		lastnameFather: string,
		lastnameMother: string)
	{
		try {
			await client.connection
				.insertInto('users')
				.values({
					id: serial,
					name: name,
					lastname_father: lastnameFather,
					lastname_mother: lastnameMother,
				})
				.execute();

		} catch (error) {
			throw error;
		}

		return new User(serial as string, name, lastnameFather, lastnameMother);
	}
}

export default User;
