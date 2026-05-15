
import {
	NextRequest,
} from 'next/server';

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


export async function DELETE(_: NextRequest, {
	params,
}: {
	params: Promise<{ serial: string }>;
})
{
	const { serial } = await params;

	await fetch(`http://127.0.0.1:5001/administrator/${serial}`, { method: 'DELETE' });

	return Response.json({
		code: 0,
	});
}

const required: {
	[ key: string ]: string;
} = {
	name: 'string',
	lastname_father: 'string',
	lastname_mother: 'string',
	role_id: 'number',
};

export async function PATCH(request: NextRequest, {
	params,
}: {
	params: Promise<{ serial: number }>;
})
{
	const { serial } = await params;

	try {
		const data = await request.json() as Partial<AdminData> & { [ key: string ]: string | number | undefined };

		for (const key in required) {
			const type = typeof data[key];
			const reqType = required[key];

			if (type === 'undefined') {
				continue;
			}

			if (type !== reqType) {
				return Response.json({
					code: -1,
					error: `Expected '${key}' of type '${reqType}', but got '${type}'.`,
				});

			// @ts-ignore The type is alredy being checked
			} else if (type === 'string' && data[key].length === 0) {
				return Response.json({
					code: -2,
					error: `The content of '${key}' is missing.`,
				});

			// @ts-ignore The type is alredy being checked
			} else if (type === 'number' && data[key] < 0) {
				return Response.json({
					code: -3,
					error: `The content of '${key}' is missing.`,
				});
			}
		}

		const req = await fetch(`http://127.0.0.1:5001/administrator/${serial}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const json = await req.json() as { code: number, error?: string };

		if (json.code !== 0) {
			console.error(json.error);

			return Response.json({
				code: -4,
				error: `Algo salió mal, intenta de nuevo más tarde.`,
			});
		}

		return Response.json({
			code: 0,
		});
	} catch (error) {
		console.error(error);

		return Response.json({
			code: -5,
			error: `Algo salió mal, intenta de nuevo más tarde.`,
		});
	}
}
