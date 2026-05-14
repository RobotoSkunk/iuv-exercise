
import {
	createContext,
} from 'react';

export const NotificationsContext = createContext<{
	push: (type: NotificationTypes, content: string) => void;
}>({
	push: (_1, _2) => {},
});
