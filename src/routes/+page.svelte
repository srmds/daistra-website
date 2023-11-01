<script>
	import { PUBLIC_API_KEY } from '$env/static/public';
	import GoToTop from "$lib/components/GoToTop.svelte"

	let status = "";
	const handleSubmit = async data => {
	  status = 'Submitting...'
	  const formData = new FormData(data.currentTarget)
	  const object = Object.fromEntries(formData);
	  const json = JSON.stringify(object);
	
	  const response = await fetch("https://api.web3forms.com/submit", {
		  method: "POST",
		  headers: {
			  "Content-Type": "application/json",
			  Accept: "application/json",
		  },
		  body: json
	  });
	  const result = await response.json();
	  if (result.success) {
		  console.log(result);
		  status = result.message || "Success"
	  }
	}
</script>
<GoToTop showAtPixel={600} />

<svelte:head>
	<title>Daistra | Data & AI Strategy</title>
	<meta
		name="description"
		content="Delivering Data and AI Strategies, empowering DataOps & MLOps with expert Data & ML Engineers"
	/>
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-73RC0XF497"></script>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', 'G-73RC0XF497');
	</script>
</svelte:head>

<section id="about" class="bg-gray-100 my-10">
	<h1 class="hidden font-bold text-2xl md:text-4xl lg:text-5xl text-center">Daistra | Delivering Data & AI strategies, incorporating DataOps & MLOps and creating data- & machine learning engineering teams</h1>
		<!-- <div class="relative" style="padding-top: 0"> -->
		<!-- <div class="grid max-w-screen-xl grid-cols-1 mx-auto lg:grid-cols-1 justify-self-center"> -->
		<div class="relative" style="padding-top: 20%">
		<iframe 
			title="daistra-banner"
			loading="lazy" 
			style="position: absolute; width: 100%; height: 130%; top: 0; left: 0; border: white; padding: 0; margin: 0;"
			src="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAFyXCMhD7E&#x2F;view?embed"
			class="absolute inset-0 w-full h-full" 
			>
		</iframe>
		<!-- <img class="" 
		src="images/daistra-banner.gif" 
		style="position: relative; width: 100%; height: 100%; top: 0; left: 0; border: white; padding: 0; margin: 0;"
		alt="business strategy algined data strategy incorporating dataops mlops diagram"> -->
	</div>
</section>
<section id="service" class="px-6 bg-white py-40">
	<h2 class="font-bold text-2xl md:text-4xl lg:text-5xl text-center  py-20">Services</h2>

	<div class="grid max-w-screen-xl grid-cols-1 px-4 py-8 mx-auto gap-8 xl:gap-0 md:grid-cols-3">
		<div class="flex flex-col  items-start px-6 py-6">
			<div class="flex mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" 
				width="100"
				viewBox="0 0 25 25"
				fill="none"
				class="text-indigo-500">
			   <path 
				   stroke-linecap="round" 
				   stroke-linejoin="round" 
				   d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" 
				   fill="currentColor"
			   />
			 </svg>
			  </div>
			<h3 class="font-bold text-3xl">Data Strategy</h3>
			<p class="text-gray-500 whitespace-pre-line py-5">
				A data strategy serves as blueprint, encompassing technology, processes, people and governance. It sets out the high-level vision for data, identification of data sources, data quality standards, data governance, strategic goals for data utilization and alignment with overall business goals
				<br>
			</p>
			<p class="text-gray-800 whitespace-pre-line">
				Our mission is to be a strategic partner in designing and implementing data strategies that align with your business goals, crafting realistic road maps that empower your organization to collect, govern, manage, and leverage data effectively
			</p>
		</div>
		<div class="flex flex-col  items-start px-6 py-6">
			<div class="flex mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" 
				width="100"
				viewBox="0 0 25 25"
				fill="none"
				class="text-indigo-500">
				<path 
					stroke-linecap="round" 
					stroke-linejoin="round" 
					d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" 
					fill="currentColor"
				/>
			  </svg>
			</div>
			<h3 class="font-bold text-3xl">DataOps</h3>
			<p class="text-gray-500 whitespace-pre-line py-5">
				Part of a good data strategy is implementing Data Operations, DataOps. It is the engine that drives a sound and solid data strategy, ensuring your data is consistently available, reliable, and ready for strategic decision-making. 
				<br>
			</p>
			<p class="text-gray-800 whitespace-pre-line  py-12">
				Explore how we can be your partner in achieving data excellence, by formalizing, building, maturing & scaling talented and performant Data engineering teams
			</p>
		</div>
		<div class="flex flex-col  items-start px-6 py-6">
			<div class="flex mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" 
				width="100"
				viewBox="-5 -5 50 50"
				fill="none"
				class="text-indigo-500">
				<path 
					stroke-linecap="round" 
					stroke-linejoin="round" 
					d="M20.6679 0.65332C16.1173 14.2562 8.26773 31.1598 0 41.6277L20.6679 33.3768L41.3844 41.6277C33.1182 31.1598 25.263 14.2562 20.6679 0.65332Z"
					fill="currentColor"
				/>
			  </svg>
			</div>
			<h3 class="font-bold text-3xl">MLOps</h3>
			<p class="text-gray-500 whitespace-pre-line py-5">
				Machine Learning Operations, MLOps, is a crucial and pivotal element in a comprehensive data strategy. It enables stream-lined deployment, management, and optimization of machine learning models within an organization. 
				<br>
			</p>
			<p class="text-gray-800 whitespace-pre-line py-10">
				As your strategic ally, we specialize in architecting MLOps solutions that seamlessly integrate into your data strategy. Our expertise extends creating high-performing machine learning engineering teams, ensuring your Machine Learning models are seamlessly integrated for insights and innovation. Join us in transforming your data-driven, data-informed descision-making future, where AI, Data strategy, DataOps, MLOps, and data and ml engineering teams emerge, evolve and mature</p>
		</div>

	</div>
	<div class="grid max-w-screen-xxl grid-cols-1 mx-auto lg:grid-cols-1 justify-self-center my-10">
		<img class="" 
		src="images/data-strategy-diagram.svg" 
		style="position: relative; width: 100%; height: 100%; top: 0; left: 0; border: white; padding: 0; margin: 0;"
		alt="business strategy algined data strategy incorporating dataops mlops diagram">
	</div>
</section>

<section id="contact" class="px-6 py-12 bg-gray-100">
	<div class="grid max-w-screen-xl grid-cols-1 px-4 py-8 mx-auto gap-3 lg:py-16 md:grid-cols-2">
		<div class="flex flex-col  items-start px-6 py-6 bg-gray">
			<div style="position: relative; width: 100%; height: 0; padding-top: 56.3415%; padding-bottom: 0;">
			 <iframe 
			 	title="contact-us"
			 	loading="lazy" 
				style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
			    src="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAFyZTRgprE&#x2F;view?embed" >
			 </iframe>
		   </div>
			<!-- <img 
				src="images/logo-page.png" 
				class="loop=once"
				alt="banner"
			/> -->
		  </div>
		<div>
			<h3 class="font-bold text-2xl">Contact Us</h3>
			<p class="text-gray-400 dark:text-gray-400">
				Fill up the form below to send us a message.
			  </p>
			<p class="font-light text-sm py-2 mb-3 text-gray-500">
			</p>
			<form action="https://api.web3forms.com/submit" method="POST" id="form">
				<input type="hidden" name="subject" value="New website contact submission">
				<input type="hidden" name="redirect" value="https://web3forms.com/success">
				<input type="hidden" name="access_key" value={PUBLIC_API_KEY}>
				<input type="checkbox" name="botcheck" class="hidden" style="display: none;">
				<label for="name" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Full Name</label>
				<div class="mb-6 flex flex-col md:flex-row gap-5">
				<input
						type="text"
						id="name"
						name="name"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
						placeholder="Jane Doe"
						required
				/>
				</div>
				<label for="name" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email Address</label>
				<div class="mb-6 flex flex-col md:flex-row gap-5">
					<input
						type="email"
						id="email"
						name="email-address"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
						placeholder="you@domain.com"
						required
				/>
				</div>
				<label for="name" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Phone Number</label>
				<div class="mb-6 flex flex-col md:flex-row gap-5">
					<input
						type="text"
						id="phone"
						name="phone"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
						placeholder="+316 0000 0000"
						required
				/>
				</div>
				<label for="name" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Message</label>
				<textarea
					id="message"
					name="message"
					rows="4"
					class="w-full px-3 py-3 text-sm text-gray-900 bg-gray-50 border rounded-lg border-gray-300 focus:ring-0"
					placeholder="Your Message"
					required
				/>
				<p class="font-light text-gray-500 mb-6"></p>
				<div class="h-captcha" data-captcha="true"></div>
				<button 
					type="submit"
					class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-4 text-center mr-3 md:mr-0 my-5"
					>Send Message</button
				>
			</form>
			<script src="https://web3forms.com/client/script.js" async defer></script>
	
		</div>
	</div>

</section>