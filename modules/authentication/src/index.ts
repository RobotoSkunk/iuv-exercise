
import 'source-map-support';
import 'dotenv/config';

import express from 'express';

const app = express();
const host = 'http://127.0.0.1:5001';

app.use(express.json());

app.post('/generate', async (req, res) =>
{
	const data: {
		serial: string,
		password: string,
	} = req.body;

	const response = await fetch(`${host}/administrator/authenticate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			serial: data.serial,
			password: data.password,
		}),
	});

	try {
		const json = await response.json() as { data: { success: boolean } };

		if (!json.data.success) {
			res.json({
				code: 1,
				error: 'Wrong Credentials',
			});
			return;
		}
	} catch (error) {
		res.json({
			code: -1,
			error: 'Something went wrong',
		});
		return;
	}

	
});

app.listen(5003, () =>
{
	console.log('Authentication service running.');
});
