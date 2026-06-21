
'use client';

import {
	useContext,
	useEffect,
	useState,
} from 'react';

import {
	NotificationsContext,
} from '@/contexts/notifications';

import {
	LoggedUserContext,
} from '@/contexts/logged-user';

import Link from 'next/link';
import Image from 'next/image';

import eyeIcon from '@/assets/icon/eye.svg';
import trashIcon from '@/assets/icon/trash.svg';

type Admin = Omit<AdminData, 'role_id'> & {
	role: string;
};

export default function Page()
{
	const notificationsContext = useContext(NotificationsContext);
	const loggedUserContext = useContext(LoggedUserContext);

	const [ busy, setBusy ] = useState<boolean>(false);
	const [ admins, setAdmins ] = useState<Admin[]>([]);
	const [ roles, setRoles ] = useState<RoleData[]>([]);

	const [ passwords, setPasswords ] = useState<{
		serial: string;
		name: string;
		password: string;
	}[]>([]);

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
		{ admins.length > 0 &&
			<div className='table-container'>
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
								<td>{ v.lastname_mother }</td>
								<td>{ v.role }</td>
								<td className='actions'>
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
									{ v.serial != loggedUserContext.data.serial &&
										<Link
											href='#'
											onClick={ async (ev) =>
											{
												ev.preventDefault();

												const answer = confirm(
													`¿Estás seguro de eliminar este administrador (cédula ${v.serial})? ` +
													'Esta acción es permanente y no se puede deshacer.'
												);

												if (answer) {
													await fetch(`/api/admin/${v.serial}`, { method: 'DELETE' });

													notificationsContext.push('success', 'Se ha eliminado el administrador.');
													await fetchAdmins();
												}
											} }
										>
											<Image
												src={ trashIcon }
												alt=''
												title='Eliminar docente'
												width={ 26 }
												height={ 26 }
											/>
										</Link>
									}
								</td>
							</tr>
						)) }
					</tbody>
				</table>
			</div>
		}
		<h2 style={{ marginLeft: 52 }}>Registrar un nuevo docente</h2>
		<div className='table-container'>
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

						const json = await response.json() as { code: number, error?: string, data: { password: string } };

						if (!json.error) {
							form.reset();
							await fetchAdmins();

							setPasswords([
								...passwords,
								{
									serial: formData.get('serial') as string,
									name: formData.get('name') as string,
									password: json.data.password,
								},
							]);
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
								<input type='text' name='lastname_father' required/>
							</td>
							<td>
								<input type='text' name='lastname_mother' required/>
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
		</div>

		{ passwords.length > 0 &&
			<section>
				<h2 style={{ marginLeft: 52 }}>Contraseñas generadas</h2>
				<p style={{ marginLeft: 52 }}>
					Guarda las contraseñas generadas en un lugar seguro, porque no se podrán volver a ver una vez se
					cierre la página.
				</p>
				<div className='table-container'>
					<table>
						<thead>
							<tr>
								<th>Cédula</th>
								<th>Nombre</th>
								<th>Contraseña</th>
							</tr>
						</thead>
						<tbody>
							{ passwords.map((v, i) =>
							(
								<tr key={ i }>
									<td>
										<span>{ v.serial }</span>
									</td>
									<td>
										<span>{ v.name }</span>
									</td>
									<td>
										<input type='text' readOnly value={ v.password }/>
									</td>
								</tr>
							)) }
						</tbody>
					</table>
				</div>
			</section>
		}
	</>);
}
