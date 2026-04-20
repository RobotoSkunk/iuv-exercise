
import 'source-map-support';
import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';

const app = express();
const host = 'http://127.0.0.1:5001';

app.use(express.json());
app.use(helmet());

app.post('/checkout', async (req, res) =>
{
	const data: {
		serial: string;
	} = req.body;


	const teacherDataResponse = await fetch(`${host}/teacher/${data.serial}`);
	
	if (teacherDataResponse.status !== 200) {
		res.status(403).json({
			code: 1,
			error: 'No se encuentró el docente con el identificador solicitado.',
		});
		return;
	}

	const teacherData = await teacherDataResponse.json() as {
		code: number;
		data: {
			serial: string;
			name: string;
			lastname_father: string;
			lastname_mother: string;
		};
	};

	const attendanceResponse = await fetch(`${host}/teacher/${data.serial}/attendance`, {
		method: 'POST',
	});

	const attendanceData = await attendanceResponse.json() as {
		code: number;
		data: {
			is_entry: boolean;
		};
	};

	res.json({
		code: 0,
		data: {
			name: `${teacherData.data.lastname_father} ${teacherData.data.lastname_mother} ${teacherData.data.name}`,
			is_entry: attendanceData.data.is_entry,
			date: new Date().toISOString(),
		},
	});
});

app.use((_, res) =>
{
	res.status(400).json({
		code: 1,
		error: 'bad_request',
	});
});

app.listen(5002, () =>
{
	console.log('Checkout service running.');
});
