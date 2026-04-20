
import client from '../database';
import Attendance from './attendance';
import User from './user';

class Teacher extends User
{
	constructor(
		serial: string,
		name: string,
		lastnameFather: string,
		lastnameMother: string)
	{
		super(serial, name, lastnameFather, lastnameMother);
	}

	public async syncToDatabase()
	{
		try {
			await client.connection
				.updateTable('teachers')
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

	
	public async getAttendances(from: Date, to: Date)
	{
		const attendances = await client.connection
			.selectFrom('attendances')
			.select([
				'is_entry',
				'created_at',
			])
			.where('teacher_id', '=', this._serial)
			.where('created_at', '>=', from)
			.where('created_at', '<=', to)
			.execute();

		return attendances.map(({ created_at, is_entry }) => new Attendance(created_at as Date, Boolean(is_entry)));
	}

	public async setAttendance(timestamp: Date)
	{
		try {
			await Attendance.register(this._serial, timestamp);
		} catch (error) {
			throw error;
		}
	}


	public static async getBySerial(serial: string)
	{
		const userData = await client.connection
			.selectFrom('teachers')
			.selectAll()
			.where('id', '=', serial)
			.executeTakeFirst();

		if (!userData) {
			return undefined;
		}

		return new Teacher(
			userData.id as string,
			userData.name as string,
			userData.lastname_father as string,
			userData.lastname_mother as string);
	}

	public static async register(
		serial: string,
		name: string,
		lastnameFather: string,
		lastnameMother: string)
	{
		try {
			await client.connection
				.insertInto('teachers')
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

		return new Teacher(serial as string, name, lastnameFather, lastnameMother);
	}
}

export default Teacher;
