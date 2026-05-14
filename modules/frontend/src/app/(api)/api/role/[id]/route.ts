
import {
	NextRequest,
} from 'next/server';

export async function GET(_: NextRequest, {
	params,
}: {
	params: Promise<{ id: number }>;
})
{
	const { id } = await params;

	const responseAdmin = await fetch(`http://127.0.0.1:5001/role/${id}`);
	const jsonAdmin = await responseAdmin.json() as APIResponse<RoleData>;

	return Response.json({
		code: 0,
		data: {
			id,
			name: jsonAdmin.data.name,
			permissions: [
				...jsonAdmin.data.permissions,
			],
		},
	});
}
