<!-- Originally posted on https://webjeda.com/blog/back-to-top-svelte-component/ -->
<script>
	export let showAtPixel = 600;

	let scrollHeight = 0;

	const gotoTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	$: showGotoTop = scrollHeight > showAtPixel;
</script>

{#if showGotoTop}
	<button on:click={gotoTop} class="goto__top" title="Go to top" aria-label="Go to top">
		<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
			<defs>
				<linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#22d3ee" />
					<stop offset="50%" stop-color="#3b82f6" />
					<stop offset="100%" stop-color="#1e40af" />
				</linearGradient>
			</defs>
			<circle cx="24" cy="24" r="22" fill="white" stroke="url(#topGrad)" stroke-width="2" />
			<path
				d="M24 30V18M24 18l-6 6M24 18l6 6"
				stroke="url(#topGrad)"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				fill="none"
			/>
		</svg>
	</button>
{/if}

<svelte:window bind:scrollY={scrollHeight} />

<style>
	.goto__top {
		position: fixed;
		right: 1.25rem;
		bottom: 1.25rem;
		cursor: pointer;
		border: none;
		background: none;
		padding: 0;
		border-radius: 9999px;
		box-shadow: 0 12px 32px rgba(37, 99, 235, 0.28);
		transition: transform 300ms ease, box-shadow 300ms ease;
		z-index: 999;
	}

	.goto__top:hover {
		transform: translateY(-4px);
		box-shadow: 0 16px 40px rgba(34, 211, 238, 0.35);
	}
</style>
