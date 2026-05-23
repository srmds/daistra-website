import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ request }) => {
	const accept = request.headers.get('accept-language') ?? '';
	const preferNl = /\bnl\b/i.test(accept);

	throw redirect(302, preferNl ? '/nl' : '/en');
};
