
import { Router } from 'express';

import Administrator from '../entities/administrator';

import crypto from 'crypto';

const adminRouter = Router();

adminRouter.get('/administrator/:id', async (req, res) =>
{
	const adminId = req.params.id as string;
	const adminData = await Administrator.getBySerial(adminId);

	if (!adminData) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	res.json({
		code: 0,
		data: {
			serial: adminData.serial,
			name: adminData.name,
			lastname_father: adminData.lastnameFather,
			lastname_mother: adminData.lastnameMother,
			role_id: adminData.roleId,
		},
	});
});

adminRouter.post('/administrator', async (req, res) =>
{
	const data: {
		serial: string;
		name: string;
		lastname_father: string;
		lastname_mother: string;
		role_id: number;
	} = req.body;

	const newPassword = crypto
		.randomBytes(12)
		.toString('base64url');

	await Administrator.register(
		data.serial,
		data.name,
		data.lastname_father,
		data.lastname_mother,
		newPassword,
		data.role_id
	);

	res.json({
		code: 0,
		data: {
			password: newPassword,
		},
	});
});

adminRouter.patch('/administrator/:id', async (req, res) =>
{
	const adminId = req.params.id;

	const data: {
		name?: string;
		lastname_father?: string;
		lastname_mother?: string;
		role_id?: number;
	} = req.body;

	const admin = await Administrator.getBySerial(adminId);

	if (!admin) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	if (data.name) {
		admin.name = data.name;
	}

	if (data.lastname_father) {
		admin.lastnameFather = data.lastname_father;
	}

	if (data.lastname_mother) {
		admin.lastnameMother = data.lastname_mother;
	}

	if (data.role_id) {
		admin.roleId = data.role_id;
	}

	await admin.syncToDatabase();

	res.json({
		code: 0,
	});
});

adminRouter.post('/administrator/authenticate', async (req, res) =>
{
	const data: {
		serial: string;
		password: string;
	} = req.body;

	const success = await Administrator.authenticate(data.serial, data.password);

	res.json({
		code: 0,
		data: {
			success,
		},
	});
});

adminRouter.get('/administrator/:id/change-password', async (req, res) =>
{
	const adminId = req.params.id;

	const adminData = await Administrator.getBySerial(adminId);

	if (!adminData) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	const newPassword = await adminData.changePassword();

	res.json({
		code: 0,
		data: {
			password: newPassword,
		},
	});
});


adminRouter.get('/administrators', async (req, res) =>
{
	const administrators = await Administrator.getAll();

	res.json({
		code: 0,
		data: {
			administrators: administrators.map((admin) =>
			({
				serial: admin.serial,
				name: admin.name,
				lastname_father: admin.lastnameFather,
				lastname_mother: admin.lastnameMother,
				role_id: admin.roleId,
			})),
		},
	});
});

export default adminRouter;
