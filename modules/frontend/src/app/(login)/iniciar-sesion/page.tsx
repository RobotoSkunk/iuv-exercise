
'use client';

import {
	Suspense,
	useState,
} from 'react';

import {
	useRouter,
	useSearchParams,
} from 'next/navigation';

import Image from 'next/image';

import eyeIcon from '@/assets/icon/eye.svg';
import eyeSlashIcon from '@/assets/icon/eye-slash.svg';

import style from './page.module.css';

function Form()
{
	const router = useRouter();
	const redirectUrl = useSearchParams().get('redirect');

	const [ busy, setBusy ] = useState(false);
	const [ showPassword, setShowPassword ] = useState(false);

	return (
		<form
			action='POST'
			className={ style.form }
			onSubmit={ async (ev) =>
			{
				ev.preventDefault();

				const form = ev.currentTarget;

				if (!form.checkValidity()) {
					form.reportValidity();
					return;
				}

				const formData = new FormData(form);
				const data: { [ key: string ]: string } = {};

				for (const [ key, value ] of formData.entries()) {
					data[key] = value as string;
				}

				setBusy(true);

				try {
					const response = await fetch(`/api/auth/login`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(data),
					});

					const json = await response.json() as { code: number, error?: string };

					if (json.code !== 0) {
						alert(json.error);
						return;
					}

					if (redirectUrl && redirectUrl.startsWith('/')) {
						router.push(redirectUrl);
					} else {
						router.push('/');
					}
				} catch (error) {
					console.error(error);
				} finally {
					setBusy(false);
				}
			} }
		>
			<h1>INICIO DE SESIÓN DEL EMPLEADO</h1>

			<label htmlFor='user-id'>
				<input
					type='text'
					name='serial'
					id='user-id'
					placeholder=' '
					disabled={ busy }
					required
				/>
				<span>Clave de Empleado</span>
			</label>

			<label htmlFor='password'>
				<input
					type={ showPassword ? 'text' : 'password' }
					name='password'
					id='password'
					placeholder=' '
					disabled={ busy }
					required
				/>
				<span>Contraseña</span>
				<button
					className='raw'
					onClick={ (ev) => {
						ev.preventDefault();
						setShowPassword(!showPassword);
					} }
				>
					<Image
						src={ showPassword ? eyeSlashIcon : eyeIcon }
						alt={ `${showPassword ? 'Ocultar' : 'Mostrar'} contraseña` }
						width={ 32 }
						height={ 32 }
						unoptimized
					/>
				</button>
			</label>

			<button disabled={ busy }>Autenticar</button>
		</form>
	);
}

export default function Page()
{
	return (
		<Suspense>
			<Form/>
		</Suspense>
	);
}
