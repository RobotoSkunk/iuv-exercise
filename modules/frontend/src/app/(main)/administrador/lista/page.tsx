
'use client';

import {
	useEffect,
	useState,
} from 'react';

import Link from 'next/link';
import Image from 'next/image';

import eyeIcon from '@/assets/icon/eye.svg';

type Admin = Omit<AdminData, 'role_id'> & {
	role: string;
};

export default function Page()
{
	const [ admins, setAdmins ] = useState<Admin[]>([]);

	useEffect(() => {
		(async () => {
			const result = await fetch('/api/admins');
			const json = await result.json() as APIResponse<Admin[]>;

			setAdmins(json.data);
		})();
	}, [ ]);

	return (<>
		<h1 className='title'>Administradores</h1>
		<table>
			<thead>
				<tr>
					<th>Cédula</th>
					<th>Nombre</th>
					<th>Apellido Paterno</th>
					<th>Apellido Materno</th>
					<th>Rol</th>
					<th>Administrar</th>
				</tr>
			</thead>
			<tbody>
				{ admins.map((v, i) => (
					<tr key={ i }>
						<td>{ v.serial }</td>
						<td>{ v.name }</td>
						<td>{ v.lastname_father }</td>
						<td>{ v.lastname_father }</td>
						<td>{ v.role }</td>
						<td>
							<Link
								href={ `/administrador/${v.serial}` }
							>
								<Image
									src={ eyeIcon }
									alt=''
									title='Ver información del administrador'
									width={ 26 }
									height={ 26 }
								/>
							</Link>
						</td>
					</tr>
				)) }
			</tbody>
		</table>
	</>);
}
