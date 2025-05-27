<script lang="ts">
	import { PUBLIC_API_KEY } from '$env/static/public';
	import GoToTop from "$lib/components/GoToTop.svelte"
    import {i, language } from '@inlang/sdk-js';
    import SvelteSeo from "svelte-seo";
    import { onMount } from 'svelte';
    import { parsePhoneNumberFromString, getCountries, getCountryCallingCode } from 'libphonenumber-js';
    import type { CountryCode } from 'libphonenumber-js';

    var curUrl = ``;
	// strip off localization path
    onMount(() => curUrl = window.location.hostname);

	// if language is nl, then we have removed the nl domain, add it back, yes this is ugly and buggy
	if (curUrl.includes(".nl") === false) {
		curUrl = String(curUrl).replace(language, '')
	} else {
		curUrl = String(curUrl).substring(0, curUrl.length - 2);
	}

	let formSubmitted = false;
	let submissionTimeout: ReturnType<typeof setTimeout> | null = null;
	let status = "";

	let selectedCountry: CountryCode = language === 'nl' ? 'NL' : 'US';
	let phoneNumber = '';
	let phoneError = '';
	let countries = getCountries();

	let emailWarning = '';
	let isCheckingDomain = false;

	let captchaContainer: HTMLElement | null = null;
	let captchaLoaded = false;

	let hcaptchaReady = false;
	let hcaptchaWidgetId: string | null = null;

	// Watch for language changes
	$: if (language) {
		// Reset form state
		formSubmitted = false;
		if (submissionTimeout) {
			clearTimeout(submissionTimeout);
			submissionTimeout = null;
		}
		status = "";
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
		
		try {
			if (!hcaptchaReady) {
				status = 'Please complete the CAPTCHA';
				return;
			}

			if (formSubmitted) {
				status = 'Please wait before submitting again...';
				return;
			}

			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);
			const object = Object.fromEntries(formData);
			
			// Get hCaptcha token
			const hcaptchaResponse = (window as any).hcaptcha.getResponse();
			if (!hcaptchaResponse) {
				status = 'Please complete the CAPTCHA';
				return;
			}

			// Add hCaptcha token to the submission
			object['h-captcha-response'] = hcaptchaResponse;
			
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
			
			status = 'Submitting...';
			formSubmitted = true;
			
			// Sanitize inputs
			Object.keys(object).forEach(key => {
				if (typeof object[key] === 'string') {
					object[key] = (object[key] as string).trim();
				}
			});

			// Add formatted phone number
			object.phone = formatPhoneNumber(phoneNumber, selectedCountry);

			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(object)
			});
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const result = await response.json();
			
			if (result.success) {
				status = result.message || "Success";
				// Reset form after successful submission
				form.reset();
				// Clear all input fields
				const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
				inputs.forEach(input => {
					if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
						input.value = '';
					}
				});
				// Reset form state
				formSubmitted = false;
				if (submissionTimeout) {
					clearTimeout(submissionTimeout);
				}
				submissionTimeout = setTimeout(() => {
					formSubmitted = false;
				}, 30000);
				
				// Redirect to success page
				window.location.href = 'https://web3forms.com/success#form';
			} else {
				throw new Error(result.message || "Something went wrong");
			}
		} catch (error) {
			console.error('Form submission error:', error);
			status = error instanceof Error ? `Error: ${error.message}` : "Error submitting form. Please try again.";
			formSubmitted = false;
		}
	}
    
    //Set the lang attribute on the html tag
    // document.documentElement.setAttribute('lang',language);

    // Function to initialize hCaptcha
    function initializeCaptcha() {
        if (typeof window === 'undefined') return;
        
        // Check if hCaptcha is loaded
        if (!(window as any).hcaptcha) {
            console.log('hCaptcha not loaded yet, waiting...');
            setTimeout(initializeCaptcha, 100);
            return;
        }
        
        // Remove existing hCaptcha if it exists
        if (captchaContainer) {
            captchaContainer.innerHTML = '';
        }
        
        // Create new hCaptcha container
        captchaContainer = document.createElement('div');
        captchaContainer.className = 'h-captcha';
        captchaContainer.setAttribute('data-captcha', 'true');
        
        // Find the form and insert the hCaptcha before the submit button
        const form = document.getElementById('form');
        const submitButton = form?.querySelector('button[type="submit"]');
        if (form && submitButton) {
            form.insertBefore(captchaContainer, submitButton);
            captchaLoaded = true;
        }
    }

    // Initialize hCaptcha on mount
    onMount(() => {
        // Add hCaptcha script to head
        const script = document.createElement('script');
        script.src = 'https://js.hcaptcha.com/1/api.js';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            // Initialize hCaptcha with explicit render
            (window as any).hcaptcha.render('hcaptcha-container', {
                sitekey: '10000000-ffff-ffff-ffff-000000000001',
                callback: (token: string) => {
                    hcaptchaReady = true;
                    console.log('hCaptcha rendered successfully');
                },
                'expired-callback': () => {
                    hcaptchaReady = false;
                    console.log('hCaptcha expired');
                }
            });
        };

        document.head.appendChild(script);
    });

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
    url: String(curUrl),
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
  <script src="https://web3forms.com/client/script.js" async defer></script>
  <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
</svelte:head>

<section id="about" class="z-[-1]">
	<h1 class="hidden font-bold ">{i("seo_h1")}</h1>
	<div id="banner" class="relative overflow-hidden">
		<div class="relative h-[650px] w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-black">
			<!-- Animated background elements -->
			<div class="absolute inset-0 opacity-20">
				<div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent"></div>
				<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
			</div>
			
			<!-- Main content -->
			<div class="relative h-full flex flex-col items-center justify-center text-center px-4">
				<h2 class="font-venus tracking-wider text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-4 transform hover:scale-105 transition-transform duration-300">
					DAISTRA
				</h2>
				<p class="font-venus tracking-widest text-4xl md:text-5xl lg:text-6xl font-thin text-white/90 transform hover:scale-105 transition-transform duration-300">
					data & ai<br>
					<span class="text-indigo-300">{i("banner_subscript")}</span>
				</p>
			</div>
		</div>
	</div>
	
	<div class="grid max-w-screen-xl grid-cols-1 py-12 px-8 mx-auto gap-2 xl:gap-4 md:grid-cols-1">
		<div class="flex flex-col items-start">
			<p class="text-2xl text-gray-700 leading-relaxed">{i("about_extended")}</p>
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

<section id="contact" class="py-16 bg-gray-50">
    <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">{i("contact_us")}</h2>
            <p class="text-xl text-gray-600">{i("fill_form")}</p>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8">
            <form id="form" method="POST" action="https://api.web3forms.com/submit" on:submit|preventDefault={handleSubmit} class="space-y-6">
                <!-- Hidden fields -->
                <input type="hidden" name="access_key" value={PUBLIC_API_KEY}>
                <input type="hidden" name="subject" value="New website contact submission">
                <input type="hidden" name="redirect" value="https://web3forms.com/success#form">
                <input type="hidden" name="from_name" value="Daistra Contact Form">
                <input type="hidden" name="form_id" value="daistra_contact">
                <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
                <input type="checkbox" name="botcheck" class="hidden" style="display: none;">

                <!-- Name field -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{i("full_name")}</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Jane Doe"
                        required
                    />
                </div>

                <!-- Email field -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{i("email_address")}</label>
                    <div class="relative">
                        <input
                            type="email"
                            id="email"
                            name="email-address"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="you@domain.com"
                            required
                            on:input={handleEmailInput}
                        />
                        {#if isCheckingDomain}
                            <div class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Checking...</div>
                        {/if}
                    </div>
                    {#if emailWarning}
                        <p class="mt-1 text-sm text-yellow-600">{emailWarning}</p>
                    {/if}
                </div>

                <!-- Phone field -->
                <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">{i("phone_number")}</label>
                    <div class="flex gap-3">
                        <select
                            bind:value={selectedCountry}
                            on:change={handleCountryChange}
                            class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                            {#each countries as country}
                                <option value={country}>
                                    {country} (+{getCountryCallingCode(country)})
                                </option>
                            {/each}
                        </select>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            bind:value={phoneNumber}
                            on:input={handlePhoneInput}
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="612345678"
                            required
                        />
                    </div>
                    {#if phoneError}
                        <p class="mt-1 text-sm text-red-600">{phoneError}</p>
                    {/if}
                </div>

                <!-- Message field -->
                <div>
                    <label for="message" class="block text-sm font-medium text-gray-700 mb-1">{i("message")}</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder={i("message_text")}
                        required
                    ></textarea>
                </div>

                <!-- CAPTCHA -->
                <div id="hcaptcha-container" class="mb-4"></div>

                <!-- Status message -->
                {#if status}
                    <div class="text-sm {status.includes('Error') ? 'text-red-600' : 'text-green-600'}">
                        {status}
                    </div>
                {/if}

                <!-- Submit button -->
                <button
                    type="submit"
                    class="w-full px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={formSubmitted}
                >
                    {i("send_message")}
                </button>
            </form>
        </div>
    </div>
</section>
