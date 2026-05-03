
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
	const [ busy, setBusy ] = useState<boolean>(false);
	const [ admins, setAdmins ] = useState<Admin[]>([]);
	const [ roles, setRoles ] = useState<RoleData[]>([]);

	async function fetchAdmins()
	{
		const result = await fetch('/api/admins');
		const json = await result.json() as APIResponse<Admin[]>;

		setAdmins(json.data);
	}

	async function fetchRoles()
	{
		const result = await fetch('/api/roles');
		const json = await result.json() as APIResponse<RoleData[]>;

		setRoles(json.data);
	}

	useEffect(() => {
		fetchAdmins();
		fetchRoles();
	}, [ ]);

	return (<>
		<h1 style={{ marginLeft: 52 }}>Administradores</h1>
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

		<h2 style={{ marginLeft: 52 }}>Registrar un nuevo docente</h2>
		<form
			onSubmit={ async (ev) =>
			{
				ev.preventDefault();

				if (busy) {
					return;
				}

				const form = ev.currentTarget;

				if (!form.checkValidity()) {
					form.reportValidity();
					return;
				}

				setBusy(true);

				const formData = new FormData(ev.currentTarget);
				const data: { [ key: string ]: string | number } = { };

				for (const [ key, value ] of formData.entries()) {
					if (key === 'role_id') {
						data[key] = Number.parseInt(value as string);
					} else {
						data[key] = value as string;
					}
				}

				try {
					const response = await fetch('/api/admin', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(data),
					});

					const json = await response.json() as { code: number, error?: string };

					if (!json.error) {
						form.reset();
						await fetchAdmins();
					} else {
						alert(json.error);
					}
				} catch (error) {
					alert('Algo ha salido mal, intenta de nuevo más tarde');
					console.error(error);
				} finally {
					setBusy(false);
				}
			} }
		>
			<table>
				<thead>
					<tr>
						<th>Cédula</th>
						<th>Nombre</th>
						<th>Apellido Paterno</th>
						<th>Apellido Materno</th>
						<th>Rol</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<input type='text' name='serial' required/>
						</td>
						<td>
							<input type='text' name='name' required/>
						</td>
						<td>
							<input type='text' name='lastname_mother' required/>
						</td>
						<td>
							<input type='text' name='lastname_father' required/>
						</td>
						<td>
							<select name='role_id'>
								{ roles.map((v, i) => (
									<option
										key={ i }
										value={ v.id }
									>
										{ v.name }
									</option>
								)) }
							</select>
						</td>
						<td>
							<button>Registrar</button>
						</td>
					</tr>
				</tbody>
			</table>
		</form>
	</>);
}
