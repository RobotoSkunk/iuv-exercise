
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

	const response = await fetch(`http://127.0.0.1:5001/teacher/${serial}`);
	const json = await response.json() as APIResponse<TeacherData>;

	return Response.json({
		code: 0,
		data: {
			serial,
			name: json.data.name,
			lastname_father: json.data.lastname_father,
			lastname_mother: json.data.lastname_mother,
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

	await fetch(`http://127.0.0.1:5001/teacher/${serial}`, { method: 'DELETE' });

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
};

export async function PATCH(request: NextRequest, {
	params,
}: {
	params: Promise<{ serial: string }>;
})
{
	const { serial } = await params;

	try {
		const data = await request.json() as Partial<TeacherData> & { [ key: string ]: string | undefined };

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

			// @ts-ignore This is never undefined, it has been already checked.
			} else if (data[key].length === 0) {
				return Response.json({
					code: -2,
					error: `The content of '${key}' is missing.`,
				});
			}
		}

		const req = await fetch(`http://127.0.0.1:5001/teacher/${serial}`, {
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
				code: -3,
				error: `Algo salió mal, intenta de nuevo más tarde.`,
			});
		}

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
