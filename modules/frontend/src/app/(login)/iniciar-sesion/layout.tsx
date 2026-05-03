
import type {
	Metadata
} from 'next';

import {
	Noto_Sans,
} from 'next/font/google';

import Image from 'next/image';

import lionImg from '@/assets/img/lion.svg';
import shieldImg from '@/assets/img/shield.svg';

import './globals.css';

const notoSans = Noto_Sans({
	subsets: [ 'latin' ],
});

export const metadata: Metadata = {
	title: 'Iniciar Sesión',
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
				<Image
					src={ lionImg }
					alt=''
					className={ 'lion' }
					unoptimized
					draggable={ false }
				/>
				<Image
					src={ shieldImg }
					alt=''
					className={ 'shield' }
					height={ 220 }
					unoptimized
					draggable={ false }
				/>
				{ children }
			</body>
		</html>
	);
}
