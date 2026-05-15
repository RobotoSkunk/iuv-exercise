
'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

import {
	usePathname,
} from 'next/navigation';

import {
	AnimatePresence,
	motion,
} from 'framer-motion';

import {
	LoggedUserContext,
} from '@/contexts/logged-user';

import Link from 'next/link';
import Image from 'next/image';

import style from './layout.module.css';

import arrowRightIcon from '@/assets/icon/arrow-right.svg';
import plusIcon from '@/assets/icon/plus.svg';

export const RolesContext = createContext<{
	updateRoles: () => Promise<void>;
}>({
	updateRoles: async () => {},
});

export default function Page({
	children,
}: {
	children: React.ReactNode;
})
{
	const pathname = usePathname();
	const loggedUserContext = useContext(LoggedUserContext);

	const [ roles, setRoles ] = useState<RoleData[]>([]);

	async function fetchRoles()
	{
		const result = await fetch('/api/roles');
		const json = await result.json() as APIResponse<RoleData[]>;

		setRoles(json.data);
	}

	useEffect(() => {
		fetchRoles();
	}, [ ]);

	return (<>
		<h1 style={{ marginLeft: 52 }}>Roles</h1>
		<div className={ style.panel }>
			<div className={ style.list }>
					{ roles.map((v, i) =>
					(
						<Link
							key={ i }
							href={ `/rol/${v.id}` }
							className={ 'button ' + style.button }
						>
							<span>
								{ v.name }
							</span>
							<AnimatePresence>
								{ (pathname.split('/').pop() ?? 0) == v.id &&
									<motion.div
										className={ style.arrow }
										style={{
											y: '-50%',
										}}

										initial={{ x: -24, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: -12, opacity: 0 }}

										key='arrow'
									>
										<Image
											src={ arrowRightIcon }
											width={ 26 }
											height={ 26 }
											alt=''
										/>
									</motion.div>
								}
							</AnimatePresence>
						</Link>
					)) }

				{ loggedUserContext.data.role.permissions.includes('role.create') &&
					<Link
						href={ `/rol/nuevo` }
						className={ 'button ' + style.button }
					>
						<Image
							src={ plusIcon }
							width={ 26 }
							height={ 26 }
							alt=''
							className={ style.plus }
						/>
						<span>
							Crear nuevo rol
						</span>
					</Link>
				}
			</div>
			<div className={ style.config }>
				<RolesContext value={{
					updateRoles: async () => await fetchRoles(),
				}}>
					{ children }
				</RolesContext>
			</div>
		</div>
	</>);
}
