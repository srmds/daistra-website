<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { localeFromParam, setLanguage } from '$lib/i18n';

	$: lang = localeFromParam($page.params.lang);
	$: setLanguage(lang);

	$: if (browser) {
		document.documentElement.lang = lang;
	}
</script>

{#key lang}
	<slot />
{/key}
