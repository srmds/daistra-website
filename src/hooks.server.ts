import { localeFromParam } from '$lib/i18n';

export async function handle({ event, resolve }) {
	const lang = localeFromParam(event.params.lang);

	return resolve(event, {
		transformPageChunk({ done, html }) {
			if (done) {
				return html.replace('%lang%', lang);
			}
		}
	});
}
