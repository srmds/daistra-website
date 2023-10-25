<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>
<header class="mb-12" >
	<Navbar >
		<NavBrand href="https://daistra.com">
			<img src="/images/logo-header.png" class="mr-3 h-24 sm:h-24" alt="Daistra Logo" />
		</NavBrand>
		<NavHamburger  />
		<NavUl >
		  <NavLi class="text-lg" href="/">Home</NavLi>
		  <NavLi class="text-lg" href="#about">About</NavLi>
		  <NavLi class="text-lg" href="#service">Services</NavLi>
		  <NavLi class="text-lg" href="#contact">Contact</NavLi>
		</NavUl>
	  </Navbar>
</header>
