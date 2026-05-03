
'use client';

import Link from 'next/link';
import Image from 'next/image';

import {
	Alfa_Slab_One,
} from 'next/font/google';

import houseIcon from '@/assets/icon/house.svg';
import userShieldIcon from '@/assets/icon/user-shield.svg';
import bookUserIcon from '@/assets/icon/book-user.svg';
import doorOpenIcon from '@/assets/icon/door-open.svg';

const alfaSlabOneFont = Alfa_Slab_One({ weight: '400' });

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
					<div className={ `title ${alfaSlabOneFont.className}` }>
						E.S.B.O. #8
					</div>
					<Link href='/'>
						<div className='background'/>
						<Image
							src={ houseIcon }
							alt=''
							width={ 20 }
							height={ 20 }
						/>
						<span>Inicio</span>
					</Link>
					<Link href='/administrador/lista'>
						<div className='background'/>
						<Image
							src={ userShieldIcon }
							alt=''
							width={ 20 }
							height={ 20 }
						/>
						<span>Administradores</span>
					</Link>
					<Link href='/docente/lista'>
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
