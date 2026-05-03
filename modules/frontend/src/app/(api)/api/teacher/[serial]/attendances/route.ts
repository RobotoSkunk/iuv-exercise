import { NextRequest } from "next/server";

export async function GET(_: NextRequest, {
	params,
}: {
	params: Promise<{ serial: string }>;
})
{
	const { serial } = await params;

	// The 'from' and 'to' parameters will be changed later, for now, they will be used for testing purposes.
	const response = await fetch(`http://127.0.0.1:5001/teacher/${serial}/attendances/0/${Date.now()}`);
	const json = await response.json() as APIResponse<{ attendances: AttendanceData[] }>;

	return Response.json({
		code: 0,
		data: json.data.attendances,
	});
}
