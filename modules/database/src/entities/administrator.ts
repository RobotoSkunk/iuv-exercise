
import client from '../database';
import User from './user';

import crypto from 'crypto';

class Administrator extends User
{
	private password: string;

	constructor(
		serial: string,
		name: string,
		lastnameFather: string,
		lastnameMother: string,
		password: string)
	{
		super(serial, name, lastnameFather, lastnameMother);

		this.password = password;
	}


	// public async changePassword()
	// {
	// 	const newPassword = crypto
	// 		.randomBytes(12)
	// 		.toString('base64url');

	// 	await client.connection
	// 		.updateTable('users')
	// 		.set({})
	// }
}

export default Administrator;
