
import style from './page.module.css';

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

export default function Page()
{
	return (<>
		<input type='text'/>
		{ permissionsData.map((v, i) =>
		(
			<label className={ style.checkbox } key={ i }>
				<input type='checkbox' name={ `intent-${v.intent.replaceAll('.', '-')}` }/>
				<span>{ v.name }</span>
			</label>
		)) }
	</>);
}
