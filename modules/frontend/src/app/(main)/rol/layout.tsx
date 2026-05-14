
'use client';

import {
	useEffect,
	useState,
} from 'react';

import Link from 'next/link';
import Image from 'next/image';

import style from './layout.module.css';

import arrowRightIcon from '@/assets/icon/arrow-right.svg';
import plusIcon from '@/assets/icon/plus.svg';

export default function Page({
	children,
}: {
	children: React.ReactNode;
})
{
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
						<div className={ style.arrow }>
							<Image
								src={ arrowRightIcon }
								width={ 26 }
								height={ 26 }
								alt=''
							/>
						</div>
					</Link>
				)) }

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
			</div>
			<div className={ style.config }>
				{ children }
			</div>
		</div>
	</>);
}
