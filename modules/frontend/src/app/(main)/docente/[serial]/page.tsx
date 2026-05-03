
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

	useEffect(() => {
		(async () => {
			const result = await fetch(`/api/teacher/${serial}`);
			const json = await result.json() as APIResponse<TeacherData>;

			setTeacherData(json.data);
		})();
	}, [ serial ]);

	if (!serial || !teacherData) {
		return <></>;
	}

	return (<>
		<form
			className={ panelStyle.form }
			onSubmit={ (ev) => {
				ev.preventDefault();

				
			} }
		>
			<h1></h1>
			<input type='text' name='name' defaultValue={ teacherData.name }/>
			<input type='text' name='lastname-father' defaultValue={ teacherData.lastname_father }/>
			<input type='text' name='lastname-mother' defaultValue={ teacherData.lastname_mother }/>
			<button>Actualizar datos</button>
		</form>
	</>);
};
