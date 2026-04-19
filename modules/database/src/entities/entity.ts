
export default interface Entity
{
	/**
	 * Synchronize the changes of the entity with the database.
	 */
	syncToDatabase: () => Promise<void>;
}
