
import { Router } from 'express';
import Teacher from '../entities/teacher';

const teachersRouter = Router();

teachersRouter.get('/teacher/:id', async (req, res) =>
{
	const teacherId = req.params.id as string;
	const teacherData = await Teacher.getBySerial(teacherId);

	if (!teacherData) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	res.json({
		code: 0,
		data: {
			serial: teacherData.serial,
			name: teacherData.name,
			lastname_father: teacherData.lastnameFather,
			lastname_mother: teacherData.lastnameMother,
		},
	});
});

teachersRouter.post('/teacher', async (req, res) =>
{
	const data: {
		serial: string;
		name: string;
		lastname_father: string;
		lastname_mother: string;
	} = req.body;

	await Teacher.register(
		data.serial,
		data.name,
		data.lastname_father,
		data.lastname_mother
	);

	res.json({
		code: 0,
	});
});

teachersRouter.patch('/teacher/:id', async (req, res) =>
{
	const teacherId = req.params.id;

	const data: {
		name?: string;
		lastname_father?: string;
		lastname_mother?: string;
	} = req.body;

	const teacher = await Teacher.getBySerial(teacherId);

	if (!teacher) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	if (data.name) {
		teacher.name = data.name;
	}

	if (data.lastname_father) {
		teacher.lastnameFather = data.lastname_father;
	}

	if (data.lastname_mother) {
		teacher.lastnameMother = data.lastname_mother;
	}

	await teacher.syncToDatabase();

	res.json({
		code: 0,
	});
});

teachersRouter.get('/teachers', async (req, res) =>
{
	const teachers = await Teacher.getAll();

	res.json({
		code: 0,
		data: {
			teachers: teachers.map((value) => ({
				serial: value.serial,
				name: value.name,
				lastname_father: value.lastnameFather,
				lastname_mother: value.lastnameMother,
			})),
		},
	});
});

teachersRouter.get('/teacher/:id/attendances/:from/:to', async (req, res) =>
{
	const from = new Date(Number.parseInt(req.params.from));
	const to = new Date(Number.parseInt(req.params.to));
	const teacherId = req.params.id;

	const teacher = await Teacher.getBySerial(teacherId);

	if (!teacher) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	const attendances = await teacher.getAttendances(from, to);

	res.json({
		code: 0,
		data: {
			attendances: attendances.map((value) => ({
				id: value.id,
				is_entry: value.isEntry,
				created_at: value.createdAt.getTime(),
			})),
		},
	});
});

teachersRouter.post('/teacher/:id/attendance', async (req, res) =>
{
	let date: string | undefined = req.body?.date;
	let timestamp = new Date();

	if (date) {
		timestamp = new Date(Number.parseInt(date));
	}

	const teacherId = req.params.id;

	const teacher = await Teacher.getBySerial(teacherId);

	if (!teacher) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	const isEntry = await teacher.setAttendance(timestamp);

	res.json({
		code: 0,
		data: {
			is_entry: isEntry === 1,
		},
	});
});

export default teachersRouter;
