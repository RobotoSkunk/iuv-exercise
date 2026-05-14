
'use client';

import {
	use,
	useContext,
	useEffect,
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
];

function Checkbox({
	name,
	children,
	defaultChecked,
}: {
	name: string;
	children: React.ReactNode;
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
				onChange={ (ev) => setChecked(ev.currentTarget.checked) }
			/>
			<AnimatePresence initial={ false }>
				<motion.div
					className={ style.switch }
					animate={{
						background: checked ? '#047857' : '#9f1239',
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

	const [ roleData, setRoleData ] = useState<RoleData | null>(null);
	const [ busy, setBusy ] = useState<boolean>(false);
	const [ loading, setLoading ] = useState<boolean>(true);

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

	if (!roleData) {
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

				for (const [ key, _ ] of formData.entries()) {
					data.permissions.push(key);
				}

				try {
					
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
						rolesContext.updateRoles();
						router.push('/rol');
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
						defaultChecked={ roleData.permissions.includes(v.intent) }
					>
						{ v.name }
					</Checkbox>
				)) }
			</section>
			<hr className={ style.separator }/>
			<section>
			{ roleId === 'nuevo' ?
				<button disabled={ busy }>Crear</button>
				:
				<>
					<button style={{ display: 'inline-block' }}>Actualizar</button>
					{ ' ' }
					<button style={{ display: 'inline-block' }}>Eliminar</button>
				</>
			}
			</section>
		</form>
	</>);
}
