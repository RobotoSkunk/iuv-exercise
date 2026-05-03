
declare global {
	interface APIResponse<T> {
		code: number;
		data: T;
	}

	interface AdminData
	{
		serial: string;
		name: string;
		lastname_father: string;
		lastname_mother: string;
		role_id: number;
	}

	interface RoleData {
		id: number;
		name: string;
		permissions: string[];
	}

	interface TeacherData
	{
		serial: string;
		name: string;
		lastname_father: string;
		lastname_mother: string;
	}
}

export { };
