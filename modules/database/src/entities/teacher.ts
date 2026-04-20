
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
				'id',
				'is_entry',
				'created_at',
			])
			.where('teacher_id', '=', this._serial)
			.where('created_at', '>=', from)
			.where('created_at', '<=', to)
			.execute();

		return attendances.map(({ id, created_at, is_entry }) => new Attendance(
			id as string,
			created_at as Date,
			Boolean(is_entry)
		));
	}

	public async setAttendance(timestamp: Date)
	{
		let isEntry = 0;

		try {
			isEntry = await Attendance.register(this._serial, timestamp);
		} catch (error) {
			throw error;
		}

		return isEntry;
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

	public static async getAll()
	{
		const teachers = await client.connection
			.selectFrom('teachers')
			.selectAll()
			.execute();

		return teachers.map(({ id, name, lastname_father, lastname_mother }) => new Teacher(
			id as string,
			name as string,
			lastname_father as string,
			lastname_mother as string
		));
	}
}

export default Teacher;
