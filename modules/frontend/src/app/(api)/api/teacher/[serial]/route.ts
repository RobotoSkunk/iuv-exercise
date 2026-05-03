import { NextRequest } from "next/server";

export async function GET(_: NextRequest, {
	params,
}: {
	params: Promise<{ serial: string }>;
})
{
	const { serial } = await params;

	const response = await fetch(`http://127.0.0.1:5001/teacher/${serial}`);
	const json = await response.json() as APIResponse<TeacherData>;

	return Response.json({
		code: 0,
		data: {
			serial,
			name: json.data.name,
			lastname_father: json.data.lastname_father,
			lastname_mother: json.data.lastname_mother,
		},
	});
}
