
import argon2 from 'argon2';

import client from '../database';
import User from './user';

import crypto from 'crypto';

class Administrator extends User
{
	public roleId: number;

	constructor(
		serial: string,
		name: string,
		lastnameFather: string,
		lastnameMother: string,
		roleId: number)
	{
		super(serial, name, lastnameFather, lastnameMother);
		this.roleId = roleId;
	}


	/**
	 * Creates a new secure password for the current administrator automatically.
	 * @returns The new generated random password.
	 */
	public async changePassword()
	{
		const newPassword = crypto
			.randomBytes(12)
			.toString('base64url');

		const passwordHash = await argon2.hash(newPassword);

		try {
			await client.connection
				.updateTable('users')
				.set({
					password: passwordHash,
				})
				.where('id', '=', this._serial)
				.execute();

			return newPassword;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Terminates all authentication sessions in a row.
	 */
	public async endSession()
	{
		try {
			await client.connection
				.deleteFrom('auth_tokens')
				.where('user_id', '=', this._serial)
				.execute();
		} catch (error) {
			throw error;
		}
	}

	public static async authenticate(serial: string, password: string)
	{
		const userData = await client.connection
			.selectFrom('users')
			.select('password')
			.where('id', '=', serial)
			.executeTakeFirst();

		if (!userData) {
			return false;
		}

		const passwordMatches = await argon2.verify(userData.password as string, password);

		if (!passwordMatches) {
			return false;
		}

		let passwordHash = userData.password;

		if (argon2.needsRehash(userData.password as string)) {
			passwordHash = await argon2.hash(password);

			await client.connection
				.updateTable('users')
				.set({
					password: passwordHash,
				})
				.where('id', '=', serial)
				.execute();
		}

		return true;
	}

	public async syncToDatabase()
	{
		try {
			await client.connection
				.updateTable('users')
				.set({
					name: this.name,
					lastname_father: this.lastnameFather,
					lastname_mother: this.lastnameMother,
					role_id: this.roleId,
				})
				.execute();
		} catch (error) {
			throw error;
		}
	}

	public static async getBySerial(serial: string)
	{
		const userData = await client.connection
			.selectFrom('users')
			.selectAll()
			.where('id', '=', serial)
			.executeTakeFirst();

		if (!userData) {
			return undefined;
		}

		return new Administrator(
			userData.id as string,
			userData.name as string,
			userData.lastname_father as string,
			userData.lastname_mother as string,
			userData.role_id as number);
	}

	public static async register(
		serial: string,
		name: string,
		lastnameFather: string,
		lastnameMother: string,
		password: string,
		roleId: number)
	{
		const passwordHash = await argon2.hash(password);

		try {
			await client.connection
				.insertInto('users')
				.values({
					id: serial,
					name: name,
					lastname_father: lastnameFather,
					lastname_mother: lastnameMother,
					password: passwordHash,
					role_id: roleId,
				})
				.execute();

		} catch (error) {
			throw error;
		}

		return new Administrator(serial as string, name, lastnameFather, lastnameMother, roleId);
	}
}

export default Administrator;
