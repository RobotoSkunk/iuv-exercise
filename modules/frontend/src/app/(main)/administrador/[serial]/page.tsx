
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
		<h1 className={ panelStyle.title }>Información del Administrador</h1>
		<form
			className={ panelStyle.form }
			onSubmit={ (ev) => {
				ev.preventDefault();

				
			} }
		>
			<label className={ panelStyle['input-label'] }>
				<span>Nombre</span>
				<input type='text' name='name' defaultValue={ adminData.name }/>
			</label>
			<label className={ panelStyle['input-label'] }>
				<span>Apellido Paterno</span>
				<input type='text' name='lastname-father' defaultValue={ adminData.lastname_father }/>
			</label>
			<label className={ panelStyle['input-label'] }>
				<span>Apellido Materno</span>
				<input type='text' name='lastname-mother' defaultValue={ adminData.lastname_mother }/>
			</label>

			<button>Actualizar datos</button>
		</form>
	</>);
};
