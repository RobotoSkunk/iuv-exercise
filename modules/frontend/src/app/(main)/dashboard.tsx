
'use client';

import Link from 'next/link';

import houseIcon from '@/assets/icon/house.svg';
import userShieldIcon from '@/assets/icon/user-shield.svg';
import bookUserIcon from '@/assets/icon/book-user.svg';
import doorOpenIcon from '@/assets/icon/door-open.svg';
import Image from 'next/image';

export default function Dashboard({
	children,
}: {
	children: React.ReactNode;
})
{
	return (
		<div
			className='dashboard'
			id='dashboard'
		>
			<nav>
				<div className='links'>
					<Link href='#'>
						<div className='background'/>
						<Image
							src={ houseIcon }
							alt=''
							width={ 20 }
							height={ 20 }
						/>
						<span>Inicio</span>
					</Link>
					<Link href='#'>
						<div className='background'/>
						<Image
							src={ userShieldIcon }
							alt=''
							width={ 20 }
							height={ 20 }
						/>
						<span>Usuarios del sistema</span>
					</Link>
					<Link href='#'>
						<div className='background'/>
						<Image
							src={ bookUserIcon }
							alt=''
							width={ 20 }
							height={ 20 }
						/>
						<span>Docentes</span>
					</Link>
				</div>
				<div>
					<Link href='#'>
						<div className='background'/>
						<Image
							src={ doorOpenIcon }
							alt=''
							width={ 20 }
							height={ 20 }
						/>
						<span>Cerrar Sesión</span>
					</Link>
				</div>
			</nav>

			<main>
				{ children }
			</main>
		</div>
	);
}
