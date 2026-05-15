
import {
	createContext,
} from 'react';

export const defaultUserData: UserData = {
	serial: '',
	name: '',
	lastname_father: '',
	lastname_mother: '',
	role: {
		id: 0,
		name: '',
		permissions: [],
	},
};

export const LoggedUserContext = createContext<{
	fetch: () => Promise<void>;
	data: UserData;
}>({
	fetch: async () => {},
	data: defaultUserData,
});
