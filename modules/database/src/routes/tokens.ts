
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
		data: tokenData,
	});
});

tokensRouter.delete('/token/:id', async (req, res) =>
{
	const tokenId = req.params.id;

	const tokenData = await client.connection
		.deleteFrom('auth_tokens')
		.where('id', '=', tokenId)
		.executeTakeFirst();

	res.json({
		code: 0,
		data: tokenData,
	});
});

tokensRouter.patch('/token/:id', async (req, res) =>
{
	const tokenId = req.params.id;

	const body: {
		hmac: string,
	} = req.body;

	await client.connection
		.updateTable('auth_tokens')
		.set({
			hmac_hash: body.hmac,
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

	await client.connection
		.insertInto('auth_tokens')
		.values({
			id: body.id,
			hmac_hash: body.hmac,
			user_id: body.user_id,
		})
		.execute();

	res.json({
		code: 0,
	});
});

export default tokensRouter;
