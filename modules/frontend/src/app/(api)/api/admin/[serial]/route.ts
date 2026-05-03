import { NextRequest } from "next/server";

export async function GET(_: NextRequest, {
	params,
}: {
	params: Promise<{ serial: string }>;
})
{
	const { serial } = await params;

	const responseAdmin = await fetch(`http://127.0.0.1:5001/administrator/${serial}`);
	const jsonAdmin = await responseAdmin.json() as APIResponse<AdminData>;

	const responseRole = await fetch(`http://127.0.0.1:5001/role/${jsonAdmin.data.role_id}`);
	const jsonRole = await responseRole.json() as APIResponse<RoleData>;

	return Response.json({
		code: 0,
		data: {
			serial,
			name: jsonAdmin.data.name,
			lastname_father: jsonAdmin.data.lastname_father,
			lastname_mother: jsonAdmin.data.lastname_mother,
			role: {
				id: jsonRole.data.id,
				name: jsonRole.data.name,
			},
		},
	});
}
