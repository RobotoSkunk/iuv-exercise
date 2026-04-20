
import { Router } from 'express';
import Role from '../entities/role';

const rolesRouter = Router();

rolesRouter.get('role/:id', async (req, res) =>
{
	const roleId = Number.parseInt(req.params.id);
	const roleData = await Role.getById(roleId);

	if (!roleData) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	res.json({
		code: 0,
		data: roleData,
	});
});

rolesRouter.get('roles', async (_, res) =>
{
	const rolesData = await Role.getAll();

	res.json({
		code: 0,
		data: {
			roles: rolesData,
		},
	});
});

rolesRouter.post('role', async (req, res) =>
{
	const data: {
		name: string,
		permissions: string[],
	} = req.body;

	await Role.register(data.name, data.permissions);

	res.json({
		code: 0,
	});
});

rolesRouter.patch('role/:id', async (req, res) =>
{
	const roleId = Number.parseInt(req.params.id);

	const data: {
		name?: string,
		permissions?: string[],
	} = req.body;

	const role = await Role.getById(roleId);

	if (!role) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	if (data.name) {
		role.name = data.name;
	}

	if (data.permissions) {
		role.permissions = data.permissions;
	}

	await role.syncToDatabase();

	res.json({
		code: 0,
	});
});

export default rolesRouter;
