import { env as publicEnv } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ platform }) => {
	const web3formsAccessKey =
		platform?.env?.PUBLIC_API_KEY ?? publicEnv.PUBLIC_API_KEY ?? '';

	return { web3formsAccessKey };
};
