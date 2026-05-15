
import {
	NextRequest,
} from 'next/server';

export async function POST(_: NextRequest, {
	params,
}: {
	params: Promise<{ serial: string }>;
})
{
	const { serial } = await params;

	await fetch('http://127.0.0.1:5002/checkout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			serial,
		}),
	});

	return Response.json({
		code: 0,
	});
}
