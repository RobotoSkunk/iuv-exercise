
'use client';

import {
	useState,
} from 'react';

import {
	useRouter,
} from 'next/navigation';

import {
	useImmer,
} from 'use-immer';

import {
	AnimatePresence,
	motion,
} from 'framer-motion';

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
import xmarkIcon from '@/assets/icon/xmark.svg';
import { NotificationsContext } from '@/contexts/notifications';

const alfaSlabOneFont = Alfa_Slab_One({ weight: '400' });

function NotificationElement({
	type,
	content,
	onClick,
}: {
	type: NotificationTypes;
	content: string;
	onClick: () => void;
})
{
	return (
		<motion.div
			className={ `notification ${type}` }

			initial={{ x: '110%' }}
			animate={{ x: 0 }}
			exit={{ x: '110%', transition: { duration: 0.12 } }}

			transition={{ type: 'spring', duration: 0.32 }}

			layout
		>
			<span>{ content }</span>
			<button onClick={ onClick }>
				<Image
					src={ xmarkIcon }
					width={ 26 }
					alt=''
				/>
			</button>
		</motion.div>
	);
}

export default function Dashboard({
	children,
}: {
	children: React.ReactNode;
})
{
	const router = useRouter();
	const [ notifications, setNotifications ] = useImmer<PanelNotification[]>([]);

	function removeNotification(id: number)
	{
		const index = notifications.findIndex(n => n.id === id);

		const newNotifications = [ ...notifications ];
		newNotifications.splice(index, 1);

		setNotifications(newNotifications);
	}

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
				<NotificationsContext
					value={{
						push: (type, content) =>
						{
							const id = Date.now();

							setNotifications([
								...notifications,
								{
									id,
									type,
									content,
								},
							]);

							setTimeout(() =>
							{
								removeNotification(id);
							}, 6000);
						}
					}}
				>
					{ children }
				</NotificationsContext>
			</main>

			<div className='notifications-container'>
				<AnimatePresence mode='popLayout'>
					{ notifications.map((v) =>
					(
						<NotificationElement
							key={ v.id }
							type={ v.type }
							content={ v.content }
							onClick={ () => removeNotification(v.id) }
						/>
					)) }
				</AnimatePresence>
			</div>
		</div>
	);
}
