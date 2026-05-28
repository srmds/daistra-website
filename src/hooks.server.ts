import { localeFromParam } from '$lib/i18n';

export async function handle({ event, resolve }) {
	const lifecycleStaticMap: Record<string, string> = {
		'/lifecycle/ml-lifecycle-e2e-poster': '/lifecycle/ml-lifecycle-e2e-poster.html',
		'/lifecycle/ml-lifecycle-executive-layers': '/lifecycle/ml-lifecycle-executive-layers.html',
		'/lifecycle/ml-lifecycle-mental-model': '/lifecycle/ml-lifecycle-mental-model.html'
	};

	const mappedPath = lifecycleStaticMap[event.url.pathname];
	if (mappedPath) {
		const target = new URL(event.url);
		target.pathname = mappedPath;
		return Response.redirect(target.toString(), 308);
	}

	const lang = localeFromParam(event.params.lang);

	return resolve(event, {
		transformPageChunk({ done, html }) {
			if (done) {
				return html.replace('%lang%', lang);
			}
		}
	});
}
