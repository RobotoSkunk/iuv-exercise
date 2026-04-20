
import client from '../database';
import Entity from './entity';


class Attendance implements Entity
{
	private _createdAt: Date;
	private _isEntry: boolean;

	constructor(createdAt: Date, isEntry: boolean)
	{
		this._createdAt = createdAt;
		this._isEntry = isEntry;
	}

	public get createdAt()
	{
		return this._createdAt;
	}

	public get isEntry()
	{
		return this._isEntry;
	}

	// Attendances can't be modified
	public async syncToDatabase() { };

	public static async register(serial: string, createdAt: Date)
	{
		const dateDayStart = new Date(createdAt.getTime());
		dateDayStart.setHours(0, 0, 0, 0);

		const dateDayEnd = new Date(createdAt.getTime());
		dateDayEnd.setHours(23, 59, 59, 0);

		const attendances = await client.connection
			.selectFrom('attendances')
			.select('is_entry')
			.where('teacher_id', '=', serial)
			.where('created_at', '>=', dateDayStart)
			.where('created_at', '<=', dateDayEnd)
			.orderBy('created_at', 'desc')
			.limit(1)
			.executeTakeFirst();

		await client.connection
			.insertInto('attendances')
			.values({
				teacher_id: serial,
				is_entry: !attendances?.is_entry ? 1 : 0,
				created_at: createdAt,
			})
			.execute();
	}
}

export default Attendance;
