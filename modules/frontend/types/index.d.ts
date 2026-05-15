
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

	interface AttendanceData
	{
		id: string;
		is_entry: boolean;
		created_at: number;
	}


	type NotificationTypes = 'info' | 'success' | 'alert' | 'error';

	interface PanelNotification
	{
		id: number;
		type: NotificationTypes;
		content: string;
	}

	type Admin = Omit<AdminData, 'role_id'> & {
		role: {
			id: number;
			name: string;
		},
	};

	type UserData = Admin & {
		role: {
			permissions: string[];
		},
	};
}

export { };
