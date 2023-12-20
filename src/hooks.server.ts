/* This file was created by inlang.
It is needed in order to circumvent a current limitation of SvelteKit. See https://github.com/inlang/inlang/issues/647
You can remove this comment and modify the file as you like. We just need to make sure it exists.
Please do not delete it (inlang will recreate it if needed). */


// import { language } from '@inlang/sdk-js';

export async function handle({ event, resolve }) {
	// const lang = event.params.lang ?? language

	return await resolve(event, {
		transformPageChunk({ done, html }) {
			//Only do it at the very end of the rendering process
			if (done) {
				return html.replace("%lang%", 'nl')
			}
		},
	})
}