
'use client';

import {
	useRouter,
} from 'next/navigation';

import {
	Alfa_Slab_One,
} from 'next/font/google';

import Link from 'next/link';
import Image from 'next/image';

import houseIcon from '@/assets/icon/house.svg';
import userShieldIcon from '@/assets/icon/user-shield.svg';
import bookUserIcon from '@/assets/icon/book-user.svg';
import doorOpenIcon from '@/assets/icon/door-open.svg';
import gearIcon from '@/assets/icon/gear.svg';

const alfaSlabOneFont = Alfa_Slab_One({ weight: '400' });

export default function Dashboard({
	children,
}: {
	children: React.ReactNode;
})
{
	const router = useRouter();

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
					<Link href='/rol'>
						<div className='background'/>
						<Image
							src={ gearIcon }
							alt=''
							width={ 20 }
							height={ 20 }
						/>
						<span>Roles</span>
					</Link>
				</div>
				<div>
					<Link
						href='/iniciar-sesion'
						onClick={ async (ev) => {
							ev.preventDefault();

							await fetch('/api/auth/logout', { method: 'POST' });

							router.push('/iniciar-sesion');
						}}
					>
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
