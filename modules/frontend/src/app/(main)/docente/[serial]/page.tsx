
'use client';

import {
	use,
	useEffect,
	useState,
} from 'react';

import panelStyle from '../../panel.module.css';

export default function Page({
	params,
}: {
	params: Promise<{ serial: string }>
})
{
	const { serial } = use(params);
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
			onSubmit={ (ev) => {
				ev.preventDefault();

				
			} }
		>
			<label className={ panelStyle['input-label'] }>
				<span>Nombre</span>
				<input type='text' name='name' defaultValue={ teacherData.name }/>
			</label>
			<label className={ panelStyle['input-label'] }>
				<span>Apellido Paterno</span>
				<input type='text' name='lastname-father' defaultValue={ teacherData.lastname_father }/>
			</label>
			<label className={ panelStyle['input-label'] }>
				<span>Apellido Materno</span>
				<input type='text' name='lastname-mother' defaultValue={ teacherData.lastname_mother }/>
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
