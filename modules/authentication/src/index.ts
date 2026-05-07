
import 'source-map-support';
import 'dotenv/config';

import express from 'express';

import {
	generateTokenParts,
} from './crypto';

const app = express();
const host = 'http://127.0.0.1:5001';

app.use(express.json());

app.post('/generate', async (req, res) =>
{
	const data: {
		serial: string,
		password: string,
	} = req.body;

	// Check if credentials are correct.
	try {
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

	// Generate token
	const { id, token, hash } = generateTokenParts();

	try {
		await fetch(`${host}/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id,
				hmac_hash: hash,
				user_id: data.serial,
			}),
		});
	} catch (error) {
		res.json({
			code: -1,
			error: 'Something went wrong',
		});
		return;
	}

	res.json({
		code: 0,
		data: {
			token,
		},
	});
});

app.listen(5003, () =>
{
	console.log('Authentication service running.');
});
