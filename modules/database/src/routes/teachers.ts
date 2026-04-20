
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
		data: teacherData,
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
			attendances: attendances,
		},
	});
});

teachersRouter.post('/teacher/:id/attendance/:date', async (req, res) =>
{
	const timestamp = new Date(Number.parseInt(req.params.date));
	const teacherId = req.params.id;

	const teacher = await Teacher.getBySerial(teacherId);

	if (!teacher) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	await teacher.setAttendance(timestamp);

	res.json({
		code: 0,
	});
});

export default teachersRouter;
