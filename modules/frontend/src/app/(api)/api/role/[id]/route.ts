
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

export async function DELETE(_: NextRequest, {
	params,
}: {
	params: Promise<{ id: number }>;
})
{
	const { id } = await params;

	await fetch(`http://127.0.0.1:5001/role/${id}`, { method: 'DELETE' });

	return Response.json({
		code: 0,
	});
}

const required: {
	[ key: string ]: string;
} = {
	name: 'string',
	permissions: 'object',
};

export async function PATCH(request: NextRequest, {
	params,
}: {
	params: Promise<{ id: number }>;
})
{
	const { id } = await params;

	try {
		const data = await request.json() as Partial<RoleData> & { [ key: string ]: string | object | undefined };

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

			} else if (type === 'object') {
				if (Array.isArray(data[key])) {
					for (const value of data[key]) {
						const valueType = typeof value;

						if (valueType !== 'string') {
							return Response.json({
								code: -4,
								error: `Expected values of '${key}' of type 'string', but got '${valueType}'.`,
							});
						}
					}
				} else {
					return Response.json({
						code: -5,
						error: `Expected '${key}' of type 'string[]', but got '${type}'.`,
					});
				}
			}
		}

		if (data.permissions && data.permissions.length === 0) {
			return Response.json({
				code: -6,
				error: `Debe haber al menos un permiso seleccionado.`,
			});
		}

		const req = await fetch(`http://127.0.0.1:5001/role/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const json = await req.json() as { code: number, error?: string };

		if (json.code !== 0) {
			return Response.json({
				code: -7,
				error: `Algo salió mal, intenta de nuevo más tarde.`,
			});
		}

		return Response.json({
			code: 0,
		});
	} catch (error) {
		console.error(error);

		return Response.json({
			code: -8,
			error: `Algo salió mal, intenta de nuevo más tarde.`,
		});
	}
}
