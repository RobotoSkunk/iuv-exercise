
'use client';

import {
	useEffect,
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

import {
	defaultUserData,
	LoggedUserContext,
} from '@/contexts/logged-user';

import {
	NotificationsContext,
} from '@/contexts/notifications';

import Link from 'next/link';
import Image from 'next/image';

import houseIcon from '@/assets/icon/house.svg';
import userShieldIcon from '@/assets/icon/user-shield.svg';
import bookUserIcon from '@/assets/icon/book-user.svg';
import doorOpenIcon from '@/assets/icon/door-open.svg';
import gearIcon from '@/assets/icon/gear.svg';
import xmarkIcon from '@/assets/icon/xmark.svg';
import userIcon from '@/assets/icon/user.svg';
import shieldIcon from '@/assets/icon/shield.svg';
import menuIcon from '@/assets/icon/menu.svg';

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
	const [ userData, setUserData ] = useState<UserData>(defaultUserData);
	const [ navbarOpen, setNavbarOpen ] = useState(false);
	const [ width, setWidth ] = useState(1000);

	useEffect(() =>
	{
		const onResize = () => setWidth(window.innerWidth);
		window.addEventListener('resize', onResize);

		onResize();

		return () =>
		{
			window.removeEventListener('resize', onResize);
		};
	}, [ ]);

	function removeNotification(id: number)
	{
		const index = notifications.findIndex(n => n.id === id);

		const newNotifications = [ ...notifications ];
		newNotifications.splice(index, 1);

		setNotifications(newNotifications);
	}

	async function fetchIdentity()
	{
		try {
			const response = await fetch('/api/identity');
			const json = await response.json() as APIResponse<UserData>;

			if (json.code === 0) {
				setUserData(json.data);
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() =>
	{
		fetchIdentity();
	}, [ ]);

	return (
		<div
			className='dashboard'
			id='dashboard'
		>
			{ width <= 1000 &&
				<motion.button
					className='nav-toggle'
					onClick={ () => setNavbarOpen(!navbarOpen) }

					animate={{
						x: navbarOpen ? 214 : 0,
						transition: {
							type: 'tween'
						}
					}}
				>
					<Image
						src={ menuIcon }
						alt={ `${navbarOpen ? 'Cerrar' : 'Abrir'} menú de navegación` }
						width={ 32 }
					/>
				</motion.button>
			}
			<AnimatePresence>
				{ (width > 1000 || navbarOpen) &&
					<motion.nav
						initial={{ x: '-120%' }}
						animate={{ x: '0%' }}
						exit={{ x: '-120%' }}

						transition={{
							type: 'tween',
						}}
					>
						<div className='links'>
							<div className={ `title ${alfaSlabOneFont.className}` }>
								E.S.B.O. #8
							</div>
							<Link href='/' onClick={ () => setNavbarOpen(false) }>
								<div className='background'/>
								<Image
									src={ houseIcon }
									alt=''
									width={ 20 }
									height={ 20 }
								/>
								<span>Inicio</span>
							</Link>
							{ userData.role.permissions.filter(r => r.startsWith('admin')).length > 0 &&
								<Link href='/administrador/lista' onClick={ () => setNavbarOpen(false) }>
									<div className='background'/>
									<Image
										src={ userShieldIcon }
										alt=''
										width={ 20 }
										height={ 20 }
									/>
									<span>Administradores</span>
								</Link>
							}
							{ userData.role.permissions.filter(r => r.startsWith('teacher')).length > 0 &&
								<Link href='/docente/lista' onClick={ () => setNavbarOpen(false) }>
									<div className='background'/>
									<Image
										src={ bookUserIcon }
										alt=''
										width={ 20 }
										height={ 20 }
									/>
									<span>Docentes</span>
								</Link>
							}
							{ userData.role.permissions.filter(r => r.startsWith('role')).length > 0 &&
								<Link href='/rol' onClick={ () => setNavbarOpen(false) }>
									<div className='background'/>
									<Image
										src={ gearIcon }
										alt=''
										width={ 20 }
										height={ 20 }
									/>
									<span>Roles</span>
								</Link>
							}
						</div>
						<div className='user'>
							<span>
								<Image
									src={ userIcon }
									alt=''
									width={ 20 }
								/>
								<b>{ `${userData.name} ${userData.lastname_father} ${userData.lastname_mother}` }</b>
							</span>
							<span>
								<Image
									src={ shieldIcon }
									alt=''
									width={ 20 }
								/>
								{ userData.role.name }
							</span>
							<hr/>
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
					</motion.nav>
				}
			</AnimatePresence>

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
					<LoggedUserContext
						value={{
							data: userData,
							fetch: fetchIdentity,
						}}
					>
						{ children }
					</LoggedUserContext>
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
