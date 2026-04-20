import 'source-map-support';
import 'dotenv/config';

import express from 'express';

import router from './routes';
import databaseClient from './database';


(async () =>
{
	// Establish connection with database
	try {
		await databaseClient.tryMigrateToLatest();
		await databaseClient.testConnection();
	} catch (error) {
		console.error('Fatal error trying to connect to database', error);
		process.exit(-1);
	}

	console.log('Stablished connection with database.');


	// Start HTTP connections
	const app = express();

	app.use(express.json());
	app.use('/', router);
	app.use('*', (_, res) =>
	{
		res.status(400).json({
			code: 1,
			error: 'bad_request',
		});
	});

	app.listen(5001, () =>
	{
		console.log('Database service running.');
	});
})();
