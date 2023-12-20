<script lang="ts">
	import { browser } from "$app/environment"
    import { language } from "@inlang/sdk-js";
	//Keep the <html> lang and dir attributes in sync with the current language
    //Determine the current language from the URL. Fall back to the source language if none is specified.
	$: lang = language

	$: if (browser) {
		document.documentElement.lang = language
	}
</script>
<br />
{#key lang}
	<slot />
{/key}
