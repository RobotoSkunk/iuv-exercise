
'use client';

import {
	useEffect,
	useState,
} from 'react';

import Link from 'next/link';
import Image from 'next/image';

import eyeIcon from '@/assets/icon/eye.svg';

export default function Page()
{
	const [ teachers, setTeachers ] = useState<TeacherData[]>([]);

	useEffect(() => {
		(async () => {
			const result = await fetch('/api/teachers');
			const json = await result.json() as APIResponse<TeacherData[]>;

			setTeachers(json.data);
		})();
	}, [ ]);

	return (<>
		<h1 className='title'>Docentes</h1>
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
						<td>{ v.lastname_father }</td>
						<td>
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
						</td>
					</tr>
				)) }
			</tbody>
		</table>
	</>);
}
