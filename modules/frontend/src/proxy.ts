
import {
	type NextRequest,
	NextResponse,
} from 'next/server';

import {
	cookies,
} from 'next/headers';

export const config = {
	matcher: [
		{
			source: '/((?!assets|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/auth).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' },
			],
		},
	],
}

export default async function proxy(request: NextRequest)
{
	const cookie = await cookies();
	const authToken = cookie.get('auth_token');
	let userId: string | null = null;

	if (authToken) {
		const fetchResponse = await fetch('http://127.0.0.1:5003/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token: authToken.value }),
		});

		const fetchJson = await fetchResponse.json() as { code: number, data: { user_id: string } };
		console.log(fetchJson);

		if (fetchJson.code === 0) {
			userId = fetchJson.data.user_id;
		} else {
			cookie.delete('auth_token');
		}
	}

	const isSigninPath = request.nextUrl.pathname === '/iniciar-sesion';

	if (isSigninPath && userId) {
		return NextResponse.redirect(new URL('/', request.nextUrl));

	} else if (!isSigninPath && !userId) {
		return NextResponse.redirect(new URL(`/iniciar-sesion?redirect=${request.nextUrl.pathname}`, request.nextUrl));
	}


	const isDev = process.env.NODE_ENV !== 'production';

	const csp = [
		`default-src 'self';`,
		`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};`,
		`style-src 'self' 'unsafe-inline';`,
		`img-src 'self' blob: data:;`,
		`font-src 'self';`,
		`object-src 'none';`,
		`base-uri 'self';`,
		`form-action 'self';`,
		`frame-ancestors 'none';`,
		`upgrade-insecure-requests;`,
	];

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('Content-Security-Policy',   csp.join(' '));

	if (userId) {
		requestHeaders.set('X-UserId', userId);
	}

	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	response.headers.set('Content-Security-Policy',   csp.join(' '));
	response.headers.set('X-UA-Compatible',           'IE=Edge');
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains;');
	response.headers.set('X-Frame-Options',           'sameorigin');
	response.headers.set('X-XSS-Protection',          '0; mode=block');
	response.headers.set('X-Content-Type-Options',    'nosniff');
	response.headers.set('Referrer-Policy',           'strict-origin-when-cross-origin');
	response.headers.set('Feature-Policy',            "microphone 'none'; geolocation 'none'; camera 'none';");
	response.headers.set('Keep-Alive',                'timeout=5');

	return response;
}
