
import { Router } from 'express';

import client from '../database';


const tokensRouter = Router();

tokensRouter.get('/token/:id', async (req, res) =>
{
	const tokenId = req.params.id;

	const tokenData = await client.connection
		.selectFrom('auth_tokens')
		.selectAll()
		.where('id', '=', tokenId)
		.executeTakeFirst();

	if (!tokenData) {
		res.status(403).json({
			code: 1,
			error: 'not_found',
		});
		return;
	}

	res.json({
		code: 0,
		data: {
			user_id: tokenData.user_id,
			hash: tokenData.hmac_hash,
			expires_at: tokenData.expires_at?.toISOString(),
		},
	});
});

tokensRouter.delete('/token/:id', async (req, res) =>
{
	const tokenId = req.params.id;

	await client.connection
		.deleteFrom('auth_tokens')
		.where('id', '=', tokenId)
		.executeTakeFirst();

	res.json({
		code: 0,
	});
});

tokensRouter.patch('/token/:id', async (req, res) =>
{
	const tokenId = req.params.id;

	const body: {
		hmac: string,
	} = req.body;

	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 1);

	await client.connection
		.updateTable('auth_tokens')
		.set({
			hmac_hash: body.hmac,
			expires_at: expiresAt,
		})
		.where('id', '=', tokenId)
		.execute();

	res.json({
		code: 0,
	});
});

tokensRouter.post('/token', async (req, res) =>
{
	// I'll add proper security later, for now I need functionality.
	const body: {
		id: string,
		hmac: string,
		user_id: string,
	} = req.body;

	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 1);

	await client.connection
		.insertInto('auth_tokens')
		.values({
			id: body.id,
			hmac_hash: body.hmac,
			user_id: body.user_id,
			expires_at: expiresAt,
		})
		.execute();

	res.json({
		code: 0,
	});
});

export default tokensRouter;
