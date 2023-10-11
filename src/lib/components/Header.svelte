<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>
<header class="mb-12" >
	<Navbar  >
		<NavBrand href="/">
		  <img src="https://placehold.co/75" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
		  <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Daistra</span>
		</NavBrand>
		<NavHamburger  />
		<NavUl >
		  <NavLi href="/">Home</NavLi>
		  <NavLi href="#about">About</NavLi>
		  <NavLi href="#services">Services</NavLi>
		  <NavLi href="#contact">Contact</NavLi>
		</NavUl>
	  </Navbar>
</header>
