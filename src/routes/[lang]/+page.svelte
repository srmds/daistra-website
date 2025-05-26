<script lang="ts">
	import { PUBLIC_API_KEY } from '$env/static/public';
	import GoToTop from "$lib/components/GoToTop.svelte"
    import {i, language } from '@inlang/sdk-js';
    import SvelteSeo from "svelte-seo";
    import { onMount } from 'svelte';
    import { parsePhoneNumberFromString, CountryCode, getCountries } from 'libphonenumber-js';

    var curUrl = ``;
	// strip off localization path
    onMount(() => curUrl = window.location.hostname);

	// if language is nl, then we have removed the nl domain, add it back, yes this is ugly and buggy
	if (curUrl.includes(".nl") === false) {
		curUrl = String(curUrl).replace(language, '')
	} else {
		curUrl = String(curUrl).substring(0, curUrl.length - 2);
	}

	let captchaLoaded = false;
	let captchaError = false;
	let formSubmitted = false;
	let submissionTimeout: ReturnType<typeof setTimeout> | null = null;
	let status = "";

	let selectedCountry: CountryCode = 'NL';
	let phoneNumber = '';
	let phoneError = '';
	let countries = getCountries();

	let emailWarning = '';
	let isCheckingDomain = false;

	// Add type declaration for hCaptcha
	declare global {
		interface Window {
			hcaptcha?: {
				reset: () => void;
				render: (element: HTMLElement, options: any) => void;
			};
		}
	}

	function initializeCaptcha() {
		// Reset states
		captchaLoaded = false;
		captchaError = false;

		// Remove existing CAPTCHA if it exists
		const existingCaptcha = document.querySelector('.h-captcha');
		if (existingCaptcha) {
			existingCaptcha.innerHTML = '';
		}

		if (!document.querySelector('script[src="https://js.hcaptcha.com/1/api.js"]')) {
			const script = document.createElement('script');
			script.src = 'https://js.hcaptcha.com/1/api.js';
			script.async = true;
			script.defer = true;
			script.onload = () => {
				captchaLoaded = true;
				captchaError = false;
				// Re-render CAPTCHA after script loads
				const captchaContainer = document.querySelector('.h-captcha');
				if (captchaContainer && window.hcaptcha) {
					window.hcaptcha.render(captchaContainer as HTMLElement, {
						sitekey: '50b2fe65-b00b-4b9e-ad62-3ba471098be2'
					});
				}
			};
			script.onerror = () => {
				captchaError = true;
			};
			document.head.appendChild(script);
		} else {
			// If script already exists, just re-render
			const captchaContainer = document.querySelector('.h-captcha');
			if (captchaContainer && window.hcaptcha) {
				window.hcaptcha.render(captchaContainer as HTMLElement, {
					sitekey: '50b2fe65-b00b-4b9e-ad62-3ba471098be2'
				});
				captchaLoaded = true;
			}
		}
	}

	onMount(() => {
		initializeCaptcha();

		// Initialize form validation
		const form = document.getElementById('form');
		if (form) {
			form.addEventListener('submit', handleSubmit);
		}
	});

	// Watch for language changes
	$: if (language) {
		// Reset form state
		formSubmitted = false;
		if (submissionTimeout) {
			clearTimeout(submissionTimeout);
			submissionTimeout = null;
		}
		status = "";
		
		// Small delay to ensure DOM is updated
		setTimeout(() => {
			initializeCaptcha();
		}, 100);
	}

	function isValidName(name: string): boolean {
		// Remove extra spaces
		name = name.trim();
		
		// Check minimum and maximum length
		if (name.length < 2 || name.length > 50) return false;
		
		// Check for suspicious patterns
		const suspiciousPatterns = [
			/^[a-z0-9]+$/i,  // Only alphanumeric
			/^[a-z]+$/i,     // Only letters
			/^[0-9]+$/,      // Only numbers
			/^[a-z]{1,2}[0-9]{1,2}$/i,  // Short alphanumeric combinations
			/^[a-z]+[0-9]+$/i,  // Letters followed by numbers
			/^[0-9]+[a-z]+$/i,  // Numbers followed by letters
			/^[a-z]{8,}$/i,     // Long single words
			/^[a-z]{1,2}$/i,    // Very short names
			/^[0-9]{1,2}$/,     // Very short numbers
			/^[a-z]+[0-9]+[a-z]+$/i,  // Alternating letters and numbers
			/^[0-9]+[a-z]+[0-9]+$/i   // Alternating numbers and letters
		];

		// Check if name matches any suspicious pattern
		if (suspiciousPatterns.some(pattern => pattern.test(name))) {
			return false;
		}

		// Check for common name patterns
		const validNamePattern = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
		return validNamePattern.test(name);
	}

	function isValidEmail(email: string): boolean {
		// Basic email format validation
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailRegex.test(email)) return false;

		// Additional checks
		const [localPart, domain] = email.split('@');
		
		// Check local part length (before @)
		if (localPart.length > 64) return false;
		
		// Check domain length
		if (domain.length > 255) return false;
		
		// Check for consecutive dots
		if (email.includes('..')) return false;

		return true;
	}

	function validatePhoneNumber(phone: string, country: CountryCode): boolean {
		try {
			const phoneNumberObj = parsePhoneNumberFromString(phone, country);
			return phoneNumberObj?.isValid() ?? false;
		} catch (error) {
			return false;
		}
	}

	function formatPhoneNumber(phone: string, country: CountryCode): string {
		try {
			const phoneNumberObj = parsePhoneNumberFromString(phone, country);
			return phoneNumberObj?.format('INTERNATIONAL') ?? phone;
		} catch (error) {
			return phone;
		}
	}

	function handlePhoneInput(event: Event) {
		const input = event.target as HTMLInputElement;
		phoneNumber = input.value;
		
		if (phoneNumber) {
			if (validatePhoneNumber(phoneNumber, selectedCountry)) {
				phoneError = '';
				phoneNumber = formatPhoneNumber(phoneNumber, selectedCountry);
			} else {
				phoneError = 'Please enter a valid phone number';
			}
		} else {
			phoneError = '';
		}
	}

	function handleCountryChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedCountry = select.value as CountryCode;
		if (phoneNumber) {
			handlePhoneInput({ target: { value: phoneNumber } } as any);
		}
	}

	async function checkDomainExists(domain: string): Promise<boolean> {
		try {
			const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
			const data = await response.json();
			return data.Answer && data.Answer.length > 0;
		} catch (error) {
			return false;
		}
	}

	async function validateEmailWithDomain(email: string): Promise<boolean> {
		const [localPart, domain] = email.split('@');
		
		// Basic validation first
		if (!isValidEmail(email)) return false;

		// Check domain existence
		isCheckingDomain = true;
		emailWarning = '';
		
		try {
			const domainExists = await checkDomainExists(domain);
			if (!domainExists) {
				emailWarning = 'Warning: This email domain might not exist. Please double-check your email address.';
			}
		} catch (error) {
			emailWarning = 'Warning: Could not verify email domain. Please double-check your email address.';
		} finally {
			isCheckingDomain = false;
		}

		return true;
	}

	async function handleEmailInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const email = input.value.trim();
		
		if (email) {
			await validateEmailWithDomain(email);
		} else {
			emailWarning = '';
		}
	}

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		
		if (formSubmitted) {
			status = 'Please wait before submitting again...';
			return;
		}

		if (!captchaLoaded || captchaError) {
			status = 'Please wait for CAPTCHA to load...';
			return;
		}

		const hCaptchaResponse = document.querySelector('textarea[name="h-captcha-response"]') as HTMLTextAreaElement;
		if (!hCaptchaResponse?.value) {
			status = 'Please complete the CAPTCHA verification';
			return;
		}
		
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const object = Object.fromEntries(formData);
		
		// Validate name
		const name = (object.name as string).trim();
		if (!isValidName(name)) {
			status = 'Please enter a valid name';
			return;
		}

		// Validate email
		const email = (object['email-address'] as string).trim();
		if (!isValidEmail(email)) {
			status = 'Please enter a valid email address';
			return;
		}

		// Validate phone
		if (!validatePhoneNumber(phoneNumber, selectedCountry)) {
			status = 'Please enter a valid phone number';
			return;
		}
		
		status = 'Submitting...'
		formSubmitted = true;
		
		// Sanitize inputs
		Object.keys(object).forEach(key => {
			if (typeof object[key] === 'string') {
				object[key] = (object[key] as string).trim();
			}
		});

		// Add formatted phone number
		object.phone = formatPhoneNumber(phoneNumber, selectedCountry);

		const json = JSON.stringify(object);

		try {
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
				status = result.message || "Success"
				// Reset form after successful submission
				form.reset();
				// Clear all input fields
				const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
				inputs.forEach(input => {
					if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
						input.value = '';
					}
				});
				// Reset CAPTCHA
				if (window.hcaptcha) {
					window.hcaptcha.reset();
				}
				// Reset form state
				formSubmitted = false;
				if (submissionTimeout) {
					clearTimeout(submissionTimeout);
				}
				submissionTimeout = setTimeout(() => {
					formSubmitted = false;
				}, 30000);
			} else {
				status = "Error: " + (result.message || "Something went wrong")
				formSubmitted = false;
			}
		} catch (error) {
			status = "Error submitting form. Please try again."
			formSubmitted = false;
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
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'G-73RC0XF497');
  </script>
</svelte:head>

<section id="about" class="z-[-1]">
	<h1 class="hidden font-bold ">{i("seo_h1")}</h1>
	<div id="banner" class="relative before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-0 ">
		
		<div class="grid max-w-screen grid-cols-1 md:grid-cols-1 bg-black opacity-100" style="height: 650px; background-image: linear-gradient(to right, rgb(55, 65, 81), rgb(17, 24, 39), rgb(0, 0, 0))">
				<p class="absolute my-40 font-venus justify-self-center tracking-wider sm:text-7xl lg:text-9xl font-bold mb-6 text-center text-white inset-0" style="">DAISTRA<p>
				<p class="absolute my-80 font-venus justify-self-center tracking-widest sm:text-6xl lg:text-6xl font-thin mb-6 text-center text-white inset-0" style="padding-top: 0px">data & ai<br>{i("banner_subscript")}<p>
		</div>
		
	<script>
	</script>
	<div class="grid max-w-screen-xl grid-cols-1 py-8 px-8 mx-auto gap-2 xl:gap-4 md:grid-cols-1">
		<div class="flex flex-col items-start">
			<p class=" text-2xl ">{i("about_extended")}</p>
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
			style="position: relative; width: 80%; height: 80%; top: 50px; left: 0; border: white; padding: 0; margin: 0;"
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
			<form id="form" class="space-y-4" on:submit|preventDefault={handleSubmit}>
				<input type="hidden" name="subject" value="New website contact submission">
				<input type="hidden" name="redirect" value="https://web3forms.com/success">
				<input type="hidden" name="access_key" value={PUBLIC_API_KEY}>
				<!-- Enhanced bot protection -->
				<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
				<input type="checkbox" name="botcheck" class="hidden" style="display: none;">
				<input type="hidden" name="from_name" value="Daistra Contact Form">
				<input type="hidden" name="form_id" value="daistra_contact">
				<input type="hidden" name="rate_limit" value="1">
				<input type="hidden" name="rate_limit_period" value="3600">
				<input type="hidden" name="spam_protection" value="true">
				<input type="hidden" name="spam_score_threshold" value="0.5">
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
				<label for="email" class="block mb-2 text-lg text-gray-600 dark:text-gray-400">{i("email_address")}</label>
				<div class="mb-6 flex flex-col md:flex-row gap-5">
		
					<div class="w-full">
						<input
							type="email"
							id="email"
							name="email-address"
							class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
							placeholder="you@domain.com"
							required
							title="Please enter a valid email address"
							on:input={handleEmailInput}
						/>
						{#if isCheckingDomain}
							<div class="text-gray-500 text-sm mt-1">Checking domain...</div>
						{/if}
						{#if emailWarning}
							<div class="text-yellow-600 text-sm mt-1">{emailWarning}</div>
						{/if}
					</div>
				</div>
				<label for="phone" class="block mb-2 text-lg text-gray-600 dark:text-gray-400">{i("phone_number")}</label>
				<div class="mb-6 flex flex-col md:flex-row gap-5">
					<div class="flex gap-2 w-full">
						<select
							bind:value={selectedCountry}
							on:change={handleCountryChange}
							class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-purple-500 focus:border-purple-500 p-2.5 w-32"
						>
							{#each countries as country}
								<option value={country}>
									{country} (+{parsePhoneNumberFromString('', country)?.countryCallingCode})
								</option>
							{/each}
						</select>
						<input
							type="tel"
							id="phone"
							name="phone"
							bind:value={phoneNumber}
							on:input={handlePhoneInput}
							class="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
							placeholder="+316 0000 0000"
							required
						/>
					</div>
				</div>
				{#if phoneError}
					<div class="text-red-500 text-sm mb-4">{phoneError}</div>
				{/if}
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
				{#if !captchaLoaded}
					<div class="text-gray-500 mb-4">Loading CAPTCHA...</div>
				{:else if captchaError}
					<div class="text-red-500 mb-4">Error loading CAPTCHA. Please refresh the page.</div>
				{:else}
					<div class="h-captcha" data-captcha="true" data-sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"></div>
				{/if}
				
				{#if status}
					<div class="text-sm {status.includes('Error') ? 'text-red-500' : 'text-green-500'} mb-4">
						{status}
					</div>
				{/if}

				<button
					type="submit"
					class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xl px-4 py-4 text-center mr-3 md:mr-0 my-5"
					disabled={!captchaLoaded || captchaError || formSubmitted}
				>{i("send_message")}</button>
			</form>
			<script src="https://web3forms.com/client/script.js" async defer></script>
			<script>
				function validateForm(event) {
					// Check if honeypot field is filled
					const honeypot = document.querySelector('input[name="website"]');
					if (honeypot.value) {
						event.preventDefault();
						return false;
					}

					// Check if hCaptcha is filled
					const hCaptcha = document.querySelector('textarea[name=h-captcha-response]');
					if (!hCaptcha || !hCaptcha.value) {
						event.preventDefault();
						alert("Please complete the CAPTCHA verification");
						return false;
					}

					return true;
				}

				// Add event listener for form submission
				const form = document.getElementById('form');
				form.addEventListener('submit', validateForm);
			</script>
		</div>
	</div>
</section>
