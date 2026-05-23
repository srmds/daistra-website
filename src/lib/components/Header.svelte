<script lang="ts">
	import { page } from '$app/stores';
	import { i, languages, localeFromParam, localizedPath, setLanguage, switchLanguage } from '$lib/i18n';
	import { onMount } from 'svelte';

	$: lang = localeFromParam($page.params.lang);
	$: setLanguage(lang);

	let scrolled = false;
	let mobileOpen = false;

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 32;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<header
	class="fixed top-0 z-50 w-full transition-all duration-300 {scrolled
		? 'border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl'
		: 'border-b border-transparent bg-transparent'}"
>
	<div class="section-shell-wide">
		<div class="flex h-[5.25rem] items-center justify-between gap-6 sm:h-[5.5rem]">
			<a
				href={$page.url.pathname}
				class="inline-flex shrink-0 items-center {!scrolled
					? 'rounded-xl bg-white/95 px-3 py-2 shadow-sm'
					: ''}"
				on:click={closeMobile}
			>
				<img
					src="/images/daistra-logo-full.png"
					class="block h-11 w-auto sm:h-12 md:h-[3.25rem]"
					width="723"
					height="660"
					alt="Daistra Data &amp; AI Strategy"
				/>
			</a>

			<nav class="hidden items-center gap-1 md:flex" aria-label="Main">
				<a
					href="#about"
					class="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium transition {scrolled
						? 'text-slate-600 hover:bg-slate-100 hover:text-brand-700'
						: 'text-slate-200 hover:bg-white/10 hover:text-white'}"
					>{i('about', lang)}</a
				>
				<a
					href="#service"
					class="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium transition {scrolled
						? 'text-slate-600 hover:bg-slate-100 hover:text-brand-700'
						: 'text-slate-200 hover:bg-white/10 hover:text-white'}"
					>{i('services_title', lang)}</a
				>
				<a
					href="#contact"
					class="inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold transition {scrolled
						? 'bg-brand-gradient text-white shadow-brand hover:scale-[1.02]'
						: 'border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'}"
					>{i('contact_us', lang)}</a
				>
				{#if lang == 'en'}
					<button
						class="inline-flex h-10 w-10 items-center justify-center rounded-lg transition {scrolled
							? 'hover:bg-slate-100'
							: 'hover:bg-white/10'}"
						on:click={() => switchLanguage('nl')}
						aria-label="Switch to Dutch"
					>
						<img src="/images/dutch-language-icon.svg" class="h-5 w-5" alt="" />
					</button>
				{/if}
				{#if lang == 'nl'}
					<button
						class="inline-flex h-10 w-10 items-center justify-center rounded-lg transition {scrolled
							? 'hover:bg-slate-100'
							: 'hover:bg-white/10'}"
						on:click={() => switchLanguage('en')}
						aria-label="Switch to English"
					>
						<img src="/images/english-language-icon.svg" class="h-5 w-5" alt="" />
					</button>
				{/if}
			</nav>

			<div class="flex items-center gap-1 md:hidden">
				{#if lang == 'en'}
					<button
						class="inline-flex h-10 w-10 items-center justify-center rounded-lg {scrolled
							? 'hover:bg-slate-100'
							: 'hover:bg-white/10'}"
						on:click={() => switchLanguage('nl')}
						aria-label="Switch to Dutch"
					>
						<img src="/images/dutch-language-icon.svg" class="h-5 w-5" alt="" />
					</button>
				{/if}
				{#if lang == 'nl'}
					<button
						class="inline-flex h-10 w-10 items-center justify-center rounded-lg {scrolled
							? 'hover:bg-slate-100'
							: 'hover:bg-white/10'}"
						on:click={() => switchLanguage('en')}
						aria-label="Switch to English"
					>
						<img src="/images/english-language-icon.svg" class="h-5 w-5" alt="" />
					</button>
				{/if}
				<button
					type="button"
					class="inline-flex h-10 w-10 items-center justify-center rounded-lg {scrolled
						? 'text-slate-700 hover:bg-slate-100'
						: 'text-white hover:bg-white/10'}"
					aria-expanded={mobileOpen}
					aria-controls="mobile-nav"
					on:click={() => (mobileOpen = !mobileOpen)}
				>
					<span class="sr-only">Menu</span>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						{#if mobileOpen}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</div>

	{#if mobileOpen}
		<nav
			id="mobile-nav"
			class="border-t md:hidden {scrolled
				? 'border-slate-200 bg-white/95 backdrop-blur-xl'
				: 'border-white/10 bg-brand-950/95 backdrop-blur-xl'}"
		>
			<ul class="section-shell-wide flex flex-col gap-1 py-4">
				<li>
					<a
						href="#about"
						class="block rounded-lg px-3 py-3 text-base font-medium {scrolled
							? 'text-slate-700 hover:bg-slate-100'
							: 'text-slate-100 hover:bg-white/10'}"
						on:click={closeMobile}>{i('about', lang)}</a
					>
				</li>
				<li>
					<a
						href="#service"
						class="block rounded-lg px-3 py-3 text-base font-medium {scrolled
							? 'text-slate-700 hover:bg-slate-100'
							: 'text-slate-100 hover:bg-white/10'}"
						on:click={closeMobile}>{i('services_title', lang)}</a
					>
				</li>
				<li>
					<a href="#contact" class="btn-primary mt-2 w-full" on:click={closeMobile}>{i('contact_us', lang)}</a>
				</li>
			</ul>
		</nav>
	{/if}

	{#each languages as altLang}
		<link rel="alternate" hreflang={altLang} href={localizedPath($page.url.pathname, altLang)} />
	{/each}
</header>
