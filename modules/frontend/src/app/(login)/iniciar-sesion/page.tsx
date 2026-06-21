
'use client';

import {
	useEffect,
	// Suspense,
	useState,
} from 'react';

import {
	useRouter,
	// useSearchParams,
} from 'next/navigation';

import Image from 'next/image';

import eyeIcon from '@/assets/icon/eye.svg';
import eyeSlashIcon from '@/assets/icon/eye-slash.svg';
import shieldImg from '@/assets/img/shield.svg';
import lionImg from '@/assets/img/lion.svg';

import style from './page.module.css';

export const dynamic = 'force-dynamic';

export default function Page()
{
	const router = useRouter();
	// const redirectUrl = useSearchParams().get('redirect');

	const [ busy, setBusy ] = useState(false);
	const [ showPassword, setShowPassword ] = useState(false);
	const [ width, setWidth ] = useState(1000);

	useEffect(() =>
	{
		const onResize = () => setWidth(window.innerWidth);
		window.addEventListener('resize', onResize);

		onResize();

		return () =>
		{
			window.removeEventListener('resize', onResize);
		};
	}, [ ]);

	return (<>
		{ width > 600 && <>
			<Image
				src={ lionImg }
				alt=''
				className={ 'lion' }
				unoptimized
				draggable={ false }
			/>
			<Image
				src={ shieldImg }
				alt=''
				className={ 'shield' }
				height={ 220 }
				unoptimized
				draggable={ false }
			/>
		</>}

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

					// if (redirectUrl && redirectUrl.startsWith('/')) {
					// 	router.push(redirectUrl);
					// } else {
						router.push('/');
					// }
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
					type='button'
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

			<button type='submit' disabled={ busy }>Autenticar</button>

			{ width <= 600 &&
				<Image
					src={ shieldImg }
					alt=''
					className={ 'shield' }
					height={ 220 }
					unoptimized
					draggable={ false }
				/>
			}
		</form>
	</>);
}
