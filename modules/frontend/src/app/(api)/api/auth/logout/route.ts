
import {
	cookies,
} from 'next/headers';

export async function POST()
{
	try {
		const cookie = await cookies();
		const token = cookie.get('auth_token');

		if (token) {
			const [ id ] = token.value.split('.');

			await fetch(`http://127.0.0.1:5001/token/${id}`, {
				method: 'DELETE',
			});

			cookie.delete('auth_token');
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
