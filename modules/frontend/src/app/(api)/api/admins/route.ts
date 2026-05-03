
export async function GET()
{
	const responseRoles = await fetch(`http://127.0.0.1:5001/roles`);
	const jsonRoles = await responseRoles.json() as APIResponse<{ roles: RoleData[] }>;

	const responseAdmins = await fetch(`http://127.0.0.1:5001/administrators`);
	const jsonAdmins = await responseAdmins.json() as APIResponse<{ administrators: AdminData[] }>;


	return Response.json({
		code: 0,
		data: jsonAdmins.data.administrators.map((admin) => ({
			serial: admin.serial,
			name: admin.name,
			lastname_father: admin.lastname_father,
			lastname_mother: admin.lastname_mother,
			role: jsonRoles.data.roles.find(r => r.id === admin.role_id)?.name || '',
		})),
	});
}
