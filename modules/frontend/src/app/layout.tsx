
import type {
	Metadata
} from 'next';

import {
	Noto_Sans,
} from 'next/font/google';

import './globals.css';

const notoSans = Noto_Sans({
	subsets: [ 'latin' ],
});

export const metadata: Metadata = {
	title: 'ESBO Portal Docente',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='es' className={ notoSans.className }>
			<body>{children}</body>
		</html>
	);
}
