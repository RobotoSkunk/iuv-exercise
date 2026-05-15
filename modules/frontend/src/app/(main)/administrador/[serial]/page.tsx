
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

import {
	LoggedUserContext,
} from '@/contexts/logged-user';

import panelStyle from '../../panel.module.css';

export default function Page({
	params,
}: {
	params: Promise<{ serial: string }>
})
{
	const { serial } = use(params);
	const notificationsContext = useContext(NotificationsContext);
	const loggedUserContext = useContext(LoggedUserContext);

	const [ busy, setBusy ] = useState<boolean>(false);
	const [ adminData, setAdminData ] = useState<Admin | null>(null);
	const [ roles, setRoles ] = useState<RoleData[]>([]);

	async function fetchRoles()
	{
		const result = await fetch('/api/roles');
		const json = await result.json() as APIResponse<RoleData[]>;

		setRoles(json.data);
	}

	useEffect(() => {
		(async () => {
			await fetchRoles();

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
				const data: { [ key: string ]: string | number } = { };

				for (const [ key, value ] of formData.entries()) {
					if (key === 'role_id') {
						data[key] = Number.parseInt(value as string);
					} else {
						data[key] = value as string;
					}
				}

				try {
					const response = await fetch(`/api/admin/${serial}`, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(data),
					});

					const json = await response.json() as { code: number, error?: string };

					if (!json.error) {
						await loggedUserContext.fetch();
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

			<select name='role_id' defaultValue={ adminData.role.id }>
				{ roles.map((v, i) => (
					<option
						key={ i }
						value={ v.id }
					>
						{ v.name }
					</option>
				)) }
			</select>

			<button>Actualizar datos</button>
		</form>
		<section style={{ textAlign: 'center' }}>
			<h2>Registro de auditoría</h2>
			<p>Próximamente, parte del tercer sprint.</p>
		</section>
	</>);
};
