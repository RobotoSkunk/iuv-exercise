
'use client';

import {
	use,
	useContext,
	useLayoutEffect,
	useState,
} from 'react';

import {
	AnimatePresence,
	motion,
} from 'framer-motion';

import {
	useRouter,
} from 'next/navigation';

import {
	RolesContext,
} from '../layout';

import {
	NotificationsContext,
} from '@/contexts/notifications';

import {
	LoggedUserContext,
} from '@/contexts/logged-user';

import Image from 'next/image';

import style from './page.module.css';

import loaderIcon from '@/assets/icon/loader.svg';


const permissionsData: {
	intent: string;
	name: string;
}[] = [
	{
		intent: 'admin.create',
		name: 'Crear administradores',
	},
	{
		intent: 'admin.edit',
		name: 'Editar administradores',
	},
	{
		intent: 'admin.delete',
		name: 'Eliminar administradores',
	},
	{
		intent: 'role.create',
		name: 'Crear roles',
	},
	{
		intent: 'role.edit',
		name: 'Editar roles',
	},
	{
		intent: 'role.delete',
		name: 'Eliminar roles',
	},
	{
		intent: 'teacher.create',
		name: 'Registrar personal docente',
	},
	{
		intent: 'teacher.edit',
		name: 'Editar personal docente',
	},
	{
		intent: 'teacher.delete',
		name: 'Eliminar personal docente del sistema',
	},
];

function Checkbox({
	name,
	children,
	disabled,
	defaultChecked,
}: {
	name: string;
	children: React.ReactNode;
	disabled?: boolean;
	defaultChecked: boolean;
})
{
	const [ checked, setChecked ] = useState(defaultChecked);

	return (
		<label className={ style.checkbox }>
			<input
				type='checkbox'
				name={ name }
				defaultChecked={ defaultChecked }
				disabled={ disabled }
				onChange={ (ev) => setChecked(ev.currentTarget.checked) }
			/>
			<AnimatePresence initial={ false }>
				<motion.div
					className={ style.switch }
					animate={{
						background: disabled ? '#4b5563' : (checked ? '#047857' : '#9f1239'),
					}}
				>
					<motion.div
						className={ style.handler }
						animate={{
							x: checked ? 22 : 0,
						}}
					/>
				</motion.div>
			</AnimatePresence>
			<span>{ children }</span>
		</label>
	);
}

export default function Page({
	params,
}: {
	params: Promise<{ role_id?: string[] }>;
})
{
	const roleId = (use(params).role_id ?? [])[0];
	const router = useRouter();
	const rolesContext = useContext(RolesContext);
	const notificationsContext = useContext(NotificationsContext);
	const loggedUserContext = useContext(LoggedUserContext);

	const [ roleData, setRoleData ] = useState<RoleData | null>(null);
	const [ busy, setBusy ] = useState<boolean>(false);
	const [ loading, setLoading ] = useState<boolean>(true);

	function isSameRole()
	{
		return (loggedUserContext.data.role.id + '') == roleId;
	}

	function canEdit()
	{
		return roleId === 'nuevo' || !isSameRole() && loggedUserContext.data.role.permissions.includes('role.edit');
	}

	function canDelete()
	{
		return roleId === 'nuevo' || !isSameRole() && loggedUserContext.data.role.permissions.includes('role.delete');
	}

	useLayoutEffect(() =>
	{
		setLoading(false);

		if (roleId) {
			if (roleId === 'nuevo') {
				setRoleData({
					id: 1,
					name: 'Rol nuevo',
					permissions: [ ],
				});
			} else {
				(async () =>
				{
					setLoading(true);

					try {
						const response = await fetch(`/api/role/${roleId}`);
						const json = await response.json() as APIResponse<RoleData>;

						setRoleData(json.data);
					} catch (_) {
						router.push('/rol');
					}

					setLoading(false);
				})();
			}
		}
	}, [ ]);

	if (loading) {
		return (<>
			<div className={ style.alert }>
				<motion.div
					style={{ display: 'flex' }}

					animate={{
						rotate: 360,
					}}
					
					transition={{
						repeat: Infinity,
						duration: 1,
						repeatType: 'loop',
						ease: 'linear',
					}}
				>
					<Image
						src={ loaderIcon }
						alt=''
						width={ 100 }
						unoptimized
					/>
				</motion.div>
			</div>
		</>);
	}

	if (!roleData || (roleId === 'nuevo' && !loggedUserContext.data.role.permissions.includes('role.create'))) {
		return (<>
			<div className={ style.alert }>
				<h2>Selecciona un rol de la lista.</h2>
			</div>
		</>);
	}
	
	return (<>
		<form
			onSubmit={ async (ev) =>
			{
				ev.preventDefault();
				const form = ev.currentTarget;

				if (!form.checkValidity()) {
					form.reportValidity();
					return;
				}

				const formData = new FormData(form);
				const data = {
					id: -1,
					name: formData.get('name') as string,
					permissions: [] as string[],
				};
				formData.delete('name');

				let editing = false;
				if (formData.has('editing')) {
					editing = true;
					formData.delete('editing');
				}

				for (const [ key, _ ] of formData.entries()) {
					data.permissions.push(key);
				}

				try {
					if (editing) {
						const response = await fetch(`/api/role/${roleId}`, {
							method: 'PATCH',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(data),
						});

						const json = await response.json() as { code: number, error?: string };

						if (json.error) {
							alert(json.error);
						} else {
							await rolesContext.updateRoles();
							notificationsContext.push('success', 'Se ha actualizado el rol.');
						}
					} else {
						const response = await fetch('/api/role', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(data),
						});

						const json = await response.json() as { code: number, error?: string };

						if (json.error) {
							alert(json.error);
						} else {
							await rolesContext.updateRoles();
							router.push('/rol');
						}
					}
				} catch (error) {
					alert('Algo ha salido mal, intenta de nuevo más tarde');
					console.error(error);
				} finally {
					setBusy(false);
				}
			} }
		>
			<section className={ style.info }>
				<span className={ style['section-title'] }>Nombre del rol</span>
				<input
					type='text'
					name='name'
					defaultValue={ roleData.name }
					readOnly={ !canEdit() }
					required
				/>
			</section>
			<hr className={ style.separator }/>
			<section>
				<span className={ style['section-title'] }>Permisos del rol</span>
				{ permissionsData.map((v, i) =>
				(
					<Checkbox 
						key={ i }
						name={ v.intent }
						disabled={ !canEdit() }
						defaultChecked={ roleData.permissions.includes(v.intent) }
					>
						{ v.name }
					</Checkbox>
				)) }
			</section>
			{ (canEdit() || canDelete()) && <>
				<hr className={ style.separator }/>
				<section>
				{ roleId === 'nuevo' ?
					<button disabled={ busy }>Crear</button>
					:
					<>
						<input type='hidden' name='editing' value='1'/>
						{ canEdit() &&
							<button
								style={{ display: 'inline-block' }}
							>
								Actualizar
							</button>
						}
						{ canDelete() &&
							<button
								style={{
									display: 'inline-block',
									marginLeft: 12,
								}}
								onClick={ async (ev) =>
								{
									ev.preventDefault();

									const answer = confirm(
										'¿Estás seguro de eliminar este rol? Esto eliminará a todos los administradores ' +
										'adjuntos a este.'
									);

									if (!answer) {
										return;
									}

									await fetch(`/api/role/${roleId}`, {
										method: 'DELETE',
									});

									await rolesContext.updateRoles();

									notificationsContext.push('success', 'Se ha eliminado el rol solicitado.');
									router.push('/rol');
								} }
							>
								Eliminar
							</button>
						}
					</>
				}
				</section>
			</> }
			{ isSameRole() && <>
				<hr className={ style.separator }/>
				<p>Por seguridad, no puedes modificar ni eliminar el rol asignado a tu perfil.</p>
			</> }
		</form>
	</>);
}
