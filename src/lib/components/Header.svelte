<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>
<header class="mb-12" >
	<Navbar  >
		<NavBrand href="https://daistra.com">
			<img src="/images/logo-header.png" class="mr-3 h-24 sm:h-24" alt="Daistra Logo" />
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
