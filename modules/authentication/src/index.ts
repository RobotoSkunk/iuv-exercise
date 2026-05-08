
import 'source-map-support';
import 'dotenv/config';

import express from 'express';

import {
	generateTokenParts,
	parseToken,
	verifyHash,
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
		console.error(error);

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
				hmac: hash,
				user_id: data.serial,
			}),
		});
	} catch (error) {
		console.error(error);

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

app.post('/authenticate', async (req, res) =>
{
	const data: {
		token: string;
	} = req.body;

	const [ id, key ] = parseToken(data.token);

	let userId: string;
	let hash: string;
	let expiresAt: Date;

	{
		const request = await fetch(`${host}/token/${id}`);
		const json = await request.json() as {
			code: number;
			data: {
				user_id: string;
				hash: string;
				expires_at: string;
			};
		};

		if (json.code !== 0) {
			res.json({
				code: 1,
			});
			return;
		}

		userId = json.data.user_id;
		hash = json.data.hash;
		expiresAt = new Date(json.data.expires_at);
	}

	if (!verifyHash(key, hash)) {
		res.json({
			code: 1,
		});
		return;
	}

	if (expiresAt.getTime() < Date.now()) {
		res.json({
			code: 1,
		});
		return;
	}

	res.json({
		code: 0,
		data: {
			user_id: userId,
		},
	});
});

app.all('/', (_, res) =>
{
	res.status(400).json({
		code: -1,
		error: 'Bad Request',
	});
});

app.listen(5003, () =>
{
	console.log('Authentication service running.');
});
