
'use client';

import {
	use,
	useEffect,
	useState,
} from 'react';

import panelStyle from '../../panel.module.css';

type Admin = Omit<AdminData, 'role_id'> & {
	id: number;
	name: string;
};

export default function Page({
	params,
}: {
	params: Promise<{ serial: string }>
})
{
	const { serial } = use(params);
	const [ adminData, setAdminData ] = useState<Admin | null>(null);

	useEffect(() => {
		(async () => {
			const result = await fetch(`/api/admin/${serial}`);
			const json = await result.json() as APIResponse<Admin>;

			setAdminData(json.data);
		})();
	}, [ serial ]);

	if (!serial || !adminData) {
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
			<input type='text' name='name' defaultValue={ adminData.name }/>
			<input type='text' name='lastname-father' defaultValue={ adminData.lastname_father }/>
			<input type='text' name='lastname-mother' defaultValue={ adminData.lastname_mother }/>
			<button>Actualizar datos</button>
		</form>
	</>);
};
