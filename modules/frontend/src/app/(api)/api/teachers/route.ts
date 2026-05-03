
export async function GET()
{
	const response = await fetch(`http://127.0.0.1:5001/teachers`);
	const json = await response.json();

	return Response.json({
		code: 0,
		data: json.data.teachers,
	});
}
