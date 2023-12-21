<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import {i, language, languages, switchLanguage} from "@inlang/sdk-js";
	import { page } from "$app/stores"

</script>
<header class="mb-12" >
	<Navbar >
		<NavBrand href={$page.url.pathname}>
			<img src="/images/logo-header.png" class="mr-5 h-24 sm:h-24" alt="Daistra Logo" />
		</NavBrand>
		<NavHamburger  />
		<NavUl >
		  <NavLi class="text-2xl" href="/">Home</NavLi>
		  <NavLi class="text-2xl" href="#about">{i("about")}</NavLi>
		  <NavLi class="text-2xl" href="#service">Services</NavLi>
		  <NavLi class="text-2xl" href="#contact">Contact</NavLi>
		  	{#if language == 'en' }
		  		<button on:click={() => switchLanguage('nl')}><img src="/images/dutch-language-icon.svg" class="mr-5 h-8 sm:h-8" alt="Dutch language icon"/></button>
	  		{/if}
			{#if language == 'nl' }
				<button on:click={() => switchLanguage('en')}><img src="/images/english-language-icon.svg" class="mr-5 h-8 sm:h-8" alt="English language icon"/></button>
			{/if}
		</NavUl>
	  </Navbar>
	  {#each languages as lang}
	  	<link rel="alternate" hreflang={lang} href={$page.url.pathname + "/" + lang} />
  	  {/each}
</header>
