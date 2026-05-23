<script>
	import { page } from '$app/stores';
	import { i, localeFromParam, setLanguage } from '$lib/i18n';

	$: lang = localeFromParam($page.params.lang);
	$: setLanguage(lang);
	let year = new Date().getFullYear();
</script>

<footer class="relative overflow-hidden bg-brand-950 text-slate-300">
	<div class="absolute inset-x-0 top-0 h-1 bg-brand-bar" aria-hidden="true"></div>
	<div class="section-shell py-14 lg:py-16">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-x-16">
			<div class="space-y-5">
				<img
					src="/images/daistra-logo-full.png"
					class="h-14 w-auto rounded-lg bg-white px-3 py-2"
					width="723"
					height="660"
					alt="Daistra Data &amp; AI Strategy"
				/>
				<p class="flex items-start gap-3 text-base leading-relaxed">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mt-0.5 h-5 w-5 shrink-0 text-cyan-brand"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
						/>
					</svg>
					<span>{i('footer_address', lang)}</span>
				</p>
			</div>
			<div class="space-y-1 text-base text-slate-400 md:text-right">
				<p>{i('footer_chamber_of_commerce', lang)}: 91660165</p>
				<p>{i('footer_value_added_tax', lang)}: NL865728318B01</p>
			</div>
		</div>
		<hr class="my-8 border-slate-800" />
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<span class="text-sm text-slate-500">
				© {year}
				<a href="/" class="text-slate-300 transition hover:text-white">Daistra</a>.
				{i('footer_copyright', lang)}
			</span>
			<div class="flex gap-4">
				<a
					href="https://www.linkedin.com/company/daistra"
					class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
					aria-label="LinkedIn"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
						/>
					</svg>
				</a>
				<a
					href="https://github.com/srmds/daistra-website"
					class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
					aria-label="GitHub"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</footer>
