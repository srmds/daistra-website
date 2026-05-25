<script lang="ts">
	import { page } from '$app/stores';
	import { i, localeFromParam, setLanguage } from '$lib/i18n';
	import SvelteSeo from 'svelte-seo';

	$: lang = localeFromParam($page.params.lang);
	$: setLanguage(lang);

	$: analyticsItems = [
		i('privacy_analytics_item_1', lang),
		i('privacy_analytics_item_2', lang),
		i('privacy_analytics_item_3', lang)
	];

	$: captchaItems = [
		i('privacy_captcha_item_1', lang),
		i('privacy_captcha_item_2', lang),
		i('privacy_captcha_item_3', lang)
	];
</script>

<SvelteSeo
	title={i('privacy_page_title', lang)}
	description={i('privacy_meta_description', lang)}
/>

<article class="section-shell py-16 lg:py-20">
	<p class="mb-2">
		<a href="/{lang}" class="text-sm font-medium text-brand-600 transition hover:text-brand-800">
			{i('privacy_back_home', lang)}
		</a>
	</p>
	<h1 class="font-display mb-4 text-3xl font-bold text-brand-950 md:text-4xl">
		{i('privacy_heading', lang)}
	</h1>
	<p class="mb-10 max-w-3xl text-lg leading-relaxed text-slate-600">{i('privacy_intro', lang)}</p>

	<div class="max-w-3xl space-y-8">
		<section class="card-surface p-6 md:p-8">
			<h2 class="mb-3 text-xl font-bold text-brand-950">{i('privacy_analytics_title', lang)}</h2>
			<p class="mb-4 leading-relaxed text-slate-600">{i('privacy_analytics_body', lang)}</p>
			<ul class="mb-4 list-disc space-y-2 pl-5 text-slate-600">
				{#each analyticsItems as item}
					<li>{item}</li>
				{/each}
			</ul>
			<a
				href="https://umami.is/privacy"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm font-semibold text-brand-600 hover:text-brand-800"
			>
				{i('privacy_analytics_link', lang)} →
			</a>
		</section>

		<section class="card-surface p-6 md:p-8">
			<h2 class="mb-3 text-xl font-bold text-brand-950">{i('privacy_captcha_title', lang)}</h2>
			<p class="mb-4 leading-relaxed text-slate-600">{i('privacy_captcha_body', lang)}</p>
			<ul class="mb-4 list-disc space-y-2 pl-5 text-slate-600">
				{#each captchaItems as item}
					<li>{item}</li>
				{/each}
			</ul>
			<a
				href="https://www.hcaptcha.com/privacy"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm font-semibold text-brand-600 hover:text-brand-800"
			>
				{i('privacy_captcha_link', lang)} →
			</a>
		</section>

		<section class="card-surface p-6 md:p-8">
			<h2 class="mb-3 text-xl font-bold text-brand-950">{i('privacy_form_title', lang)}</h2>
			<p class="mb-4 leading-relaxed text-slate-600">{i('privacy_form_body', lang)}</p>
			<a
				href="https://web3forms.com/privacy"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm font-semibold text-brand-600 hover:text-brand-800"
			>
				{i('privacy_form_link', lang)} →
			</a>
		</section>

		<section class="rounded-2xl border border-brand-100 bg-brand-50/60 p-6 md:p-8">
			<h2 class="mb-3 text-xl font-bold text-brand-950">{i('privacy_rights_title', lang)}</h2>
			<p class="leading-relaxed text-slate-600">
				{i('privacy_rights_body', lang)}
				<a href="/{lang}#contact" class="font-semibold text-brand-600 hover:text-brand-800">
					{i('privacy_rights_contact_link', lang)}
				</a>.
			</p>
		</section>

		<p class="text-sm text-slate-500">{i('privacy_last_updated', lang)}</p>
	</div>
</article>
