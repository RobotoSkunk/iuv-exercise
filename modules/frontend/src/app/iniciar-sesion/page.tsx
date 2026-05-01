
'use client';

import {
	useState,
} from 'react';

import Image from 'next/image';

import eyeIcon from '@/assets/icon/eye.svg';
import eyeSlashIcon from '@/assets/icon/eye-slash.svg';

import style from './page.module.css';

export default function Page()
{
	const [ showPassword, setShowPassword ] = useState(false);

	return (
		<form className={ style.form }>
			<h1>INICIO DE SESIÓN DEL EMPLEADO</h1>

			<label htmlFor='user-id'>
				<input type='text' id='user-id' placeholder=' '/>
				<span>Clave de Empleado</span>
			</label>

			<label htmlFor='password'>
				<input type={ showPassword ? 'text' : 'password' } id='password' placeholder=' '/>
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

			<button>Autenticar</button>
		</form>
	);
}
