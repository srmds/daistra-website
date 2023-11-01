<script>
	import '../app.postcss';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Analytics from '$lib/analytics.svelte';
</script>

<Analytics />
<Header />
<main>
	<slot />
</main>
<Footer />
