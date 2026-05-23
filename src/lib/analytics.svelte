<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const GA_ID = 'G-73RC0XF497';

	onMount(() => {
		if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
			return;
		}

		window.dataLayer = window.dataLayer || [];
		window.gtag = function gtag(...args: unknown[]) {
			window.dataLayer.push(args);
		};

		const script = document.createElement('script');
		script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
		script.async = true;
		script.onload = () => {
			window.gtag('js', new Date());
			window.gtag('config', GA_ID);
		};
		document.head.appendChild(script);
	});

	$: if (browser && typeof window.gtag === 'function') {
		window.gtag('config', GA_ID, {
			page_title: document.title,
			page_path: $page.url.pathname
		});
	}
</script>
