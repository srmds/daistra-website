<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>
<header class="mb-12" >
	<Navbar >
		<NavBrand href="https://daistra.com">
			<img src="/images/logo-header.png" class="mr-5 h-24 sm:h-24" alt="Daistra Logo" />
		</NavBrand>
		<NavHamburger  />
		<NavUl >
		  <NavLi class="text-2xl" href="/">Home</NavLi>
		  <NavLi class="text-2xl" href="#about">About</NavLi>
		  <NavLi class="text-2xl" href="#service">Services</NavLi>
		  <NavLi class="text-2xl" href="#contact">Contact</NavLi>
		</NavUl>
	  </Navbar>
</header>
