<script>
	import { PUBLIC_API_KEY } from '$env/static/public';
	import GoToTop from "$lib/components/GoToTop.svelte"
    import {i, language } from '@inlang/sdk-js';
    import SvelteSeo from "svelte-seo";
    import { onMount } from 'svelte';

    var curUrl = ``;
	// strip off localization path
    onMount(() => curUrl = window.location.hostname);

	// if language is nl, then we have removed the nl domain, add it back, yes this is ugly and buggy
	if (curUrl.includes(".nl") === false) {
		curUrl = String(curUrl).replace(language, '')
	} else {
		curUrl = String(curUrl).substring(0, curUrl.length - 2);
	}

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
		//   console.log(result);
		  status = result.message || "Success"
	  }
	}
    
    //Set the lang attribute on the html tag
    // document.documentElement.setAttribute('lang',language);

</script>
<GoToTop showAtPixel={600} />

<SvelteSeo
  title={i("page_title")}
  description={i("page_description")}
  canonical={curUrl}
  keywords="data, ai, artificial intelligence, data strategy, ai strategy, business strategy, xops, dataops, mlops, data engineering, machine learning engineering, ml engineering, data engineer, ml engineer, data excellence, data course, ml course, machine learning course, data strategie, ai strategie, kunstmatige intelligentie, data-gedreven, data-geinformeerd, data excellentie, data architectuur, data cursus, ai cursus, machine learning cursus, data talent"
  openGraph={{
    title: i('page_title'),
    description: i("page_description"),
    image: "https://" + String(curUrl) + "/images/logo-header.png",
    url: {curUrl},
    type: "website",
    images: [
      {
        url: "https://" + String(curUrl) + "/images/daistra-banner.png",
        width: 1557,
        height: 400,
        alt: "Daistra banner",
      },
      {
        url: "https://" + String(curUrl) + "/images/business-data-ai-strategy.svg",
        alt: "Venn diagram business data AI strategy",
      },
      {
        url: "https://" + String(curUrl) + "/images/data-ai-strategy.svg",
        alt: "Data & AI strategy aligned with business strategy"
      },
      {
        url: "https://" + String(curUrl) + "/images/business-card-steven-ramdas.png",
        alt: "Steven Ramdas - Founder | AI Solution Architect | Senior Data- & ML Engineer"
      },
    ],
    site_name: i('page_title'),
  }}
/>

<svelte:head>
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-73RC0XF497"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js"
		integrity="sha512-Kef5sc7gfTacR7TZKelcrRs15ipf7+t+n7Zh6mKNJbmW+/RRdCW9nwfLn4YX0s2nO6Kv5Y2ChqgIakaC6PW09A=="
		crossorigin="anonymous" referrerpolicy="no-referrer"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'G-73RC0XF497');
  </script>
</svelte:head>

<section id="about" class="z-[-1]">
	<h1 class="hidden font-bold ">{i("seo_h1")}</h1>
	<div id="particles" class="relative  before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-0 before:z-10">
		<div class="grid max-w-screen grid-cols-1 md:grid-cols-1 bg-black opacity-100" style="height: 650px;">
			<div id="particles-js" class="absolute inset-0">
					<p class="absolute my-40 font-venus justify-self-center tracking-wider sm:text-7xl lg:text-9xl font-bold mb-6 text-center text-white inset-0" style="">DAISTRA<p>
					<p class="absolute my-80 font-venus justify-self-center tracking-widest sm:text-6xl lg:text-6xl font-thin mb-6 text-center text-white inset-0" style="padding-top: 0px">data & ai<br>{i("banner_subscript")}<p>
			</div>
		</div>
		
	<script>
	particlesJS.load("particles-js", "assets/particles.json", function() {
		// console.log("callback - particles loaded")
	})
	</script>
	<div class="grid max-w-screen-xl grid-cols-1 py-8 mx-auto gap-2 xl:gap-4 md:grid-cols-1">
		<div class="flex flex-col  items-start">
			<p class=" text-4xl text-center">{i("about_extended")}</p>
		</div>
	</div>
</section>
<section id="service" class="px-6 bg-white py-10">
	<h2 class="font-bold text-5xl text-center">Services</h2>
	
	<div class="grid max-w-screen-xl grid-cols-1 py-8 mx-auto gap-2 xl:gap-4 md:grid-cols-1">
		<div class="flex flex-col  items-start">
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
			<h3 class="font-bold text-4xl">{i("data_strategy_title")}</h3>
			<p class="text-gray-500 text-xl whitespace-pre-line py-5">
				{i("data_strategy_intro")}
			</p>
			<p class="text-gray-800 text-xl whitespace-pre-line">
				{i("data_strategy_main")}
			</p>
		</div>
		<div class="flex flex-col  items-start py-5">
			<h4 class="font-bold text-4xl">DataOps</h4>
			<p class="text-gray-500 text-xl whitespace-pre-line py-5">
				{i("dataops_intro")}
			</p>
			<p class="text-gray-800 text-xl whitespace-pre-line">
				{i("dataops_main")}
			</p>
			<img class="relative"
			src="images/business-data-ai-strategy.svg"
			style="position: relative; width: 100%; height: 100%; top: 50px; left: 0; border: white; padding: 0; margin: 0;"
			alt="business strategy algined with data and ai strategy venn diagram">
		</div>
		<div class="flex flex-col  items-start py-5">
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
			<h3 class="font-bold text-4xl">{i("ai_strategy_title")}</h3>
			<p class="text-gray-500 text-xl whitespace-pre-line py-6">
				{i("ai_strategy_intro")}
			</p>
			<p class="text-gray-800 text-xl whitespace-pre-line">
				{i("ai_strategy_main")}
			</p>
		</div>

		<div class="flex flex-col  items-start">
			<h4 class="font-bold text-4xl">MLOps</h4>
			<p class="text-gray-500 text-xl whitespace-pre-line py-5">
				{i("mlops_intro")}
			</p>
			<p class="text-gray-800 text-xl whitespace-pre-line">
				{i("mlops_main")}
		</div>
	</div>
	<div class="grid max-w-screen-xl grid-cols-1 mx-auto lg:grid-cols-1 justify-self-center my-10">
		<h3 class="text-xl font-bold justify-self-center my-10">{i("business_alignment_title")}</h3>
		<p class="text-xl whitespace-pre-line py-5">
			{i("business_alignment_intro")} <br>
			{i("business_alignment_main")}
		</p>
		<img class="relative"
		src="images/data-ai-strategy.svg"
		style="position: relative; width: 100%; height: 100%; top: 0; left: 0; border: white; padding: 0; margin: 0 0 50px 0;"
		alt="business strategy algined with data and ai strategy incorporating dataops mlops diagram">
	</div>
</section>

<section id="contact" class="px-6 py-12 bg-gray-100">
	<div class="grid max-w-screen-xxl grid-cols-1 px-4 py-8 mx-auto gap-3 lg:py-16 md:grid-cols-2">
        <!-- <div class="flex flex-col items-start px-20 bg-gray">
			<div>
               
		    </div>
		</div> -->
		<div class="flex flex-col items-start bg-gray">
			<div style="position: relative; position: relative; width: 100%; height: 100%; top: 0; left: 0; border: white; padding: 0; margin: 0 0 50px 0;">
				<a href="https://www.linkedin.com/in/srmds" target="_blank">
                <img 
					src="images/business-card-steven-ramdas.png" 
					alt="Steven Ramdas | Founder | AI Solution architect | Senior Data- & ML Engineer"/>
				</a>
		    </div>
		</div>
		<div class="max-w-2xl items-start max-w-4xl bg-gray">
			<h3 class="font-bold text-3xl">{i("contact_us")}</h3>
			<p class="text-gray-400 dark:text-gray-400 text-2xl">
				{i("fill_form")}
			  </p>
			<p class="font-light text-sm mb-3 text-gray-500">
			</p>
			<form action="https://api.web3forms.com/submit" method="POST" id="form">
				<input type="hidden" name="subject" value="New website contact submission">
				<input type="hidden" name="redirect" value="https://web3forms.com/success">
				<input type="hidden" name="access_key" value={PUBLIC_API_KEY}>
				<input type="checkbox" name="botcheck" class="hidden" style="display: none;">
				<label for="name" class="block mb-2 text-lg text-gray-600 dark:text-gray-400">{i("full_name")}</label>
				<div class="mb-6 flex flex-col md:flex-row gap-5">
				<input
						type="text"
						id="name"
						name="name"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
						placeholder="Jane Doe"
						required
				/>
				</div>
				<label for="name" class="block mb-2 text-lg text-gray-600 dark:text-gray-400">{i("email_address")}</label>
				<div class="mb-6 flex flex-col md:flex-row gap-5">
					<input
						type="email"
						id="email"
						name="email-address"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
						placeholder="you@domain.com"
						required
				/>
				</div>
				<label for="name" class="block mb-2 text-lg text-gray-600 dark:text-gray-400">{i("phone_number")}</label>
				<div class="mb-6 flex flex-col md:flex-row gap-5">
					<input
						type="text"
						id="phone"
						name="phone"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
						placeholder="+316 0000 0000"
						required
				/>
				</div>
				<label for="name" class="block mb-2 text-lg text-gray-600 dark:text-gray-400">{i("message")}</label>
				<textarea
					id="message"
					name="message"
					rows="4"
					class="w-full px-3 py-3 text-lg text-gray-900 bg-gray-50 border rounded-lg border-gray-300 focus:ring-0"
					placeholder={i("message_text")}
					required
				/>
				<p class="font-light text-gray-500 mb-6"></p>
				<div class="h-captcha" data-captcha="true"></div>
				<button
					type="submit"
					class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xl px-4 py-4 text-center mr-3 md:mr-0 my-5"
					>{i("send_message")}</button
				>
			</form>
			<script src="https://web3forms.com/client/script.js" async defer></script>

		</div>
	</div>
</section>
