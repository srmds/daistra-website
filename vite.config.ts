import { sveltekit } from '@sveltejs/kit/vite';
import inLangPlugin from '@inlang/sdk-js/adapter-sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [inLangPlugin(), sveltekit()]
});
