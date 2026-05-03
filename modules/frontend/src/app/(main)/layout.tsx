
import type {
	Metadata
} from 'next';

import {
	Noto_Sans,
} from 'next/font/google';

import './globals.css';
import Dashboard from './dashboard';

const notoSans = Noto_Sans({
	subsets: [ 'latin' ],
});

export const metadata: Metadata = {
	title: 'Portal E.S.B.O.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>)
{
	return (
		<html lang='es' className={ notoSans.className } suppressHydrationWarning>
			<body>
				<Dashboard>
					{ children }
				</Dashboard>
			</body>
		</html>
	);
}
