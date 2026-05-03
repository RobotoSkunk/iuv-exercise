
import {
	NextRequest,
} from 'next/server';

const required: {
	[ key: string ]: string;
} = {
	serial: 'string',
	name: 'string',
	lastname_father: 'string',
	lastname_mother: 'string',
	role_id: 'number',
};

export async function POST(request: NextRequest)
{
	try {
		const data = await request.json() as AdminData & { [ key: string ]: string | number };

		for (const key in required) {
			const type = typeof data[key];
			const reqType = required[key];

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
					code: -2,
					error: `The content of '${key}' is missing.`,
				});
			}
		}

		{
			const req = await fetch(`http://127.0.0.1:5001/administrator/${data.serial}`);
			const json = await req.json() as { code: number, error?: string };

			if (json.code === 0) {
				return Response.json({
					code: -3,
					error: `La cédula solicitada ya se encuentra registrada.`,
				});
			}
		}

		const req = await fetch(`http://127.0.0.1:5001/administrator`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const json = await req.json() as { code: number, error?: string };

		if (json.code !== 0) {
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
