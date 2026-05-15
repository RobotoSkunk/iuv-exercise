
'use client';

import {
	useContext,
	useEffect,
	useState,
} from 'react';

import {
	NotificationsContext,
} from '@/contexts/notifications';

import Link from 'next/link';
import Image from 'next/image';

import eyeIcon from '@/assets/icon/eye.svg';
import trashIcon from '@/assets/icon/trash.svg';

export default function Page()
{
	const notificationsContext = useContext(NotificationsContext);

	const [ busy, setBusy ] = useState<boolean>(false);
	const [ teachers, setTeachers ] = useState<TeacherData[]>([]);

	async function fetchTeachers()
	{
		const result = await fetch('/api/teachers');
		const json = await result.json() as APIResponse<TeacherData[]>;

		setTeachers(json.data);
	}

	useEffect(() => {
		fetchTeachers();
	}, [ ]);

	return (<>
		<h1 style={{ marginLeft: 52 }}>Docentes</h1>
		{ teachers.length > 0 &&
			<table>
				<thead>
					<tr>
						<th>Cédula</th>
						<th>Nombre</th>
						<th>Apellido Paterno</th>
						<th>Apellido Materno</th>
						<th>Administrar</th>
					</tr>
				</thead>
				<tbody>
					{ teachers.map((v, i) => (
						<tr key={ i }>
							<td>{ v.serial }</td>
							<td>{ v.name }</td>
							<td>{ v.lastname_father }</td>
							<td>{ v.lastname_mother }</td>
							<td className='actions'>
								<Link
									href={ `/docente/${v.serial}` }
								>
									<Image
										src={ eyeIcon }
										alt=''
										title='Ver información del docente'
										width={ 26 }
										height={ 26 }
									/>
								</Link>
								<Link
									href='#'
									onClick={ async (ev) =>
									{
										ev.preventDefault();

										const answer = confirm(
											`¿Estás seguro de eliminar este docente del sistema (cédula ${v.serial})? ` +
											'Esta acción es permanente y no se puede deshacer.'
										);

										if (answer) {
											await fetch(`/api/teacher/${v.serial}`, { method: 'DELETE' })

											notificationsContext.push('success', 'Se ha eliminado el docente.');
											await fetchTeachers();
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
							</td>
						</tr>
					)) }
				</tbody>
			</table>
		}
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
				const data: { [ key: string ]: string } = { };

				for (const [ key, value ] of formData.entries()) {
					data[key] = value as string;
				}

				try {
					const response = await fetch('/api/teacher', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(data),
					});

					const json = await response.json() as { code: number, error?: string };

					if (!json.error) {
						form.reset();
						await fetchTeachers();
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
							<button>Registrar</button>
						</td>
					</tr>
				</tbody>
			</table>
		</form>
	</>);
}
