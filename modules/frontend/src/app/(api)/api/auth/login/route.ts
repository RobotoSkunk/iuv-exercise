
import {
	cookies,
} from 'next/headers';

import {
	NextRequest,
} from 'next/server';

const required: {
	[ key: string ]: string;
} = {
	serial: 'string',
	password: 'string',
};

export async function POST(request: NextRequest)
{
	try {
		const data = await request.json() as { [ key: string ]: string, serial: string, password: string };

		for (const key in required) {
			const type = typeof data[key];
			const reqType = required[key];

			if (type !== reqType) {
				return Response.json({
					code: -1,
					error: `Expected '${key}' of type '${reqType}', but got '${type}'.`,
				});

			// @ts-ignore The type is alredy being checked
			} else if (data[key].length === 0) {
				return Response.json({
					code: -2,
					error: `The content of '${key}' is missing.`,
				});
			}
		}

		const req = await fetch(`http://127.0.0.1:5003/generate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				serial: data.serial,
				password: data.password,
			}),
		});

		const json = await req.json() as {
			code: number,
			error?: string,
			data: {
				token: string,
			},
		};

		if (json.code > 0) {
			return Response.json({
				code: 1,
				error: `La cédula o la contraseña son incorrectas.`,
			});
		} else if (json.code < 0) {
			return Response.json({
				code: -3,
				error: `Algo ha salido mal, reporte el problema con el administrador.`,
			});
		}

		(await cookies()).set('auth_token', json.data.token);

		return Response.json({
			code: 0,
		});
	} catch (error) {
		console.error(error);

		return Response.json({
			code: -4,
			error: `Algo salió mal, intenta de nuevo más tarde.`,
		});
	}
}
