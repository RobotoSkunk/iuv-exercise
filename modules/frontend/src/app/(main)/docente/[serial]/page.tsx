
'use client';

import {
	use,
	useContext,
	useEffect,
	useState,
} from 'react';

import {
	NotificationsContext,
} from '@/contexts/notifications';

import panelStyle from '../../panel.module.css';

export default function Page({
	params,
}: {
	params: Promise<{ serial: string }>
})
{
	const { serial } = use(params);
	const notificationsContext = useContext(NotificationsContext);

	const [ busy, setBusy ] = useState<boolean>(false);
	const [ teacherData, setTeacherData ] = useState<TeacherData | null>(null);
	const [ attendances, setAttendances ] = useState<AttendanceData[]>([]);

	useEffect(() => {
		(async () => {
			const result = await fetch(`/api/teacher/${serial}`);
			const json = await result.json() as APIResponse<TeacherData>;

			setTeacherData(json.data);

			const resultAttendances = await fetch(`/api/teacher/${serial}/attendances`);
			const jsonAttendances = await resultAttendances.json() as APIResponse<AttendanceData[]>;

			setAttendances(jsonAttendances.data);
		})();
	}, [ serial ]);

	if (!serial || !teacherData) {
		return <></>;
	}

	return (<>
		<h1 className={ panelStyle.title }>Información del Docente</h1>
		<form
			className={ panelStyle.form }
			onSubmit={ async (ev) => {
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
					const response = await fetch(`/api/teacher/${serial}`, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(data),
					});

					const json = await response.json() as { code: number, error?: string };

					if (!json.error) {
						notificationsContext.push('success', 'Datos actualizados exitosamente.');
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
			<label className={ panelStyle['input-label'] }>
				<span>Nombre</span>
				<input type='text' name='name' defaultValue={ teacherData.name }/>
			</label>
			<label className={ panelStyle['input-label'] }>
				<span>Apellido Paterno</span>
				<input type='text' name='lastname_father' defaultValue={ teacherData.lastname_father }/>
			</label>
			<label className={ panelStyle['input-label'] }>
				<span>Apellido Materno</span>
				<input type='text' name='lastname_mother' defaultValue={ teacherData.lastname_mother }/>
			</label>
			<button>Actualizar datos</button>
		</form>

		<h2 className={ panelStyle.title }>Asistencias</h2>

		<table>
			<thead>
				<tr>
					<th>Fecha</th>
					<th>Tipo</th>
				</tr>
			</thead>
			<tbody>
				{ attendances.map((v, i) => (
					<tr key={ i }>
						<td>
							{ new Date(v.created_at).toLocaleDateString() }
							{ ' ' }
							{ new Date(v.created_at).toLocaleTimeString() }
						</td>
						<td>
							{ v.is_entry ? 'Entrada' : 'Salida' }
						</td>
					</tr>
				)) }
			</tbody>
		</table>
	</>);
};
