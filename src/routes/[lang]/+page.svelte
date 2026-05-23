<script lang="ts">
	import GoToTop from "$lib/components/GoToTop.svelte"
	import { page } from '$app/stores';
	import { i, localeFromParam, setLanguage } from '$lib/i18n';

	$: lang = localeFromParam($page.params.lang);
	$: setLanguage(lang);
    import SvelteSeo from "svelte-seo";
    import { onMount } from 'svelte';
    import { parsePhoneNumberFromString, getCountries, getCountryCallingCode } from 'libphonenumber-js';
    import type { CountryCode } from 'libphonenumber-js';

	// Web3Forms access key (public per https://docs.web3forms.com/getting-started/installation)
	const WEB3FORMS_ACCESS_KEY = '40863508-069e-4a2b-bd58-343c719452e3';

	// Shared Web3Forms free-plan hCaptcha sitekey (public, not your access key)
	// https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha
	const WEB3FORMS_HCAPTCHA_SITEKEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

	let captchaContainer: HTMLDivElement | undefined;
	let captchaWidgetId: string | undefined;
	let captchaLang: string | undefined;

	async function loadHcaptchaScript(): Promise<void> {
		if (window.hcaptcha) return;

		const existing = document.querySelector('script[src*="js.hcaptcha.com/1/api.js"]');
		if (existing) {
			await new Promise<void>((resolve) => {
				const timer = window.setInterval(() => {
					if (window.hcaptcha) {
						window.clearInterval(timer);
						resolve();
					}
				}, 50);
			});
			return;
		}

		await new Promise<void>((resolve, reject) => {
			const script = document.createElement('script');
			script.src = 'https://js.hcaptcha.com/1/api.js?recaptchacompat=off';
			script.async = true;
			script.defer = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load hCaptcha'));
			document.head.appendChild(script);
		});
	}

	async function renderCaptcha(locale: string) {
		if (!captchaContainer || captchaLang === locale) return;

		await loadHcaptchaScript();
		if (!window.hcaptcha) return;

		captchaContainer.replaceChildren();
		captchaWidgetId = window.hcaptcha.render(captchaContainer, {
			sitekey: WEB3FORMS_HCAPTCHA_SITEKEY,
			hl: locale
		});
		captchaLang = locale;
	}

    var curUrl = ``;
	// strip off localization path
    onMount(() => {
		curUrl = window.location.hostname;
	});

	$: if (captchaContainer && lang) {
		renderCaptcha(lang);
	}

	// if language is nl, then we have removed the nl domain, add it back, yes this is ugly and buggy
	if (curUrl.includes(".nl") === false) {
		curUrl = String(curUrl).replace(lang, '')
	} else {
		curUrl = String(curUrl).substring(0, curUrl.length - 2);
	}

	let formSubmitted = false;
	let submissionTimeout: ReturnType<typeof setTimeout> | null = null;
	let status = "";

	let selectedCountry: CountryCode = 'NL';
	let phoneNumber = '';
	let phoneError = '';
	const countries = ['NL', ...getCountries().filter((c) => c !== 'NL')] as CountryCode[];

	let emailWarning = '';
	let isCheckingDomain = false;

	// Watch for language changes
	$: if (lang) {
		// Reset form state
		formSubmitted = false;
		selectedCountry = 'NL';
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
			if (formSubmitted) {
				status = 'Please wait before submitting again...';
				return;
			}

			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);
			const object = Object.fromEntries(formData);

			const captchaField = form.querySelector(
				'textarea[name="h-captcha-response"]'
			) as HTMLTextAreaElement | null;
			const hcaptchaResponse = captchaField?.value?.trim() ?? '';
			if (!hcaptchaResponse) {
				status = 'Please complete the CAPTCHA';
				return;
			}
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
    
</script>

<GoToTop showAtPixel={600} />

<SvelteSeo
  title={i("page_title")}
  description={i("page_description")}
  canonical={curUrl}
  keywords="data strategy, ai strategy, dataops, mlops, llmops, aiops, ai governance, eu ai act, responsible ai, genai, rag, data engineering, machine learning, data strategie, ai strategie"
  openGraph={{
    title: i('page_title'),
    description: i("page_description"),
    url: String(curUrl),
    type: "website",
    images: [
      {
        url: "https://" + String(curUrl) + "/images/daistra-logo-full.png",
        alt: "Daistra Data & AI Strategy",
      },
      {
        url: "https://" + String(curUrl) + "/images/business-data-ai-strategy.svg",
        alt: "Business-led data and AI alignment with DataOps, MLOps, LLMOps, AIOps and AI governance",
      },
      {
        url: "https://" + String(curUrl) + "/images/data-ai-strategy.svg",
        alt: "Data and AI operating model with governance and XOps execution layers"
      },
      {
        url: "https://" + String(curUrl) + "/images/business-card-steven-ramdas.png",
        alt: "Steven Ramdas, Founder and AI Solution Architect at Daistra"
      },
    ],
    site_name: i('page_title'),
  }}
/>

<section id="about">
	<h1 class="sr-only">{i("seo_h1")}</h1>

	<div id="banner" class="relative min-h-[100svh] overflow-hidden bg-brand-950">
		<div class="absolute inset-0 bg-hero-mesh" aria-hidden="true"></div>
		<div class="absolute inset-0 pixel-grid opacity-60" aria-hidden="true"></div>
		<div class="absolute inset-0" aria-hidden="true">
			<div class="absolute -left-20 top-24 h-80 w-80 animate-pulse-soft rounded-full bg-cyan-brand/40 blur-[110px]"></div>
			<div class="absolute right-[-5%] top-10 h-[28rem] w-[28rem] animate-float-slow rounded-full bg-brand-600/35 blur-[130px]"></div>
			<div class="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-teal-brand/30 blur-[100px]"></div>
			<div class="absolute bottom-16 right-1/4 h-56 w-56 rounded-full bg-accent-600/25 blur-[90px]"></div>
		</div>

		<div class="relative section-shell-wide flex min-h-[100svh] flex-col justify-center pb-16 pt-32 lg:pt-36">
			<div class="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
				<div class="text-center lg:text-left">
					<p class="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-light sm:text-sm">
						Data &amp; AI {i("banner_subscript")}
					</p>
					<h2 class="font-display mb-6 text-4xl font-bold leading-[1.1] tracking-wide text-white sm:text-5xl lg:text-6xl">
						{i("banner_headline")}
					</h2>
					<p class="mb-10 max-w-xl text-lg leading-relaxed text-slate-300 md:text-xl lg:mx-0 mx-auto">
						{i("banner_tagline")}
					</p>
					<div class="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
						<a href="#service" class="btn-primary">{i("banner_cta_services")}</a>
						<a href="#contact" class="btn-secondary">{i("banner_cta_contact")}</a>
					</div>
					<div class="mt-12 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
						<span class="pillar-strategy">{i("banner_pillar_strategy")}</span>
						<span class="pillar-governance">{i("banner_pillar_governance")}</span>
						<span class="pillar-operations">{i("banner_pillar_operations")}</span>
					</div>
				</div>

				<div class="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
					<div class="absolute h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true"></div>
					<div class="absolute h-56 w-56 translate-x-8 translate-y-8 rounded-full bg-teal-brand/15 blur-2xl" aria-hidden="true"></div>
					<div class="absolute h-48 w-48 -translate-x-6 -translate-y-6 rounded-full bg-accent-600/15 blur-2xl" aria-hidden="true"></div>
					<div class="relative animate-float-slow rounded-3xl border border-white/10 bg-white/95 p-8 shadow-glow sm:p-10">
						<img
							src="/images/daistra-logo.png"
							class="mx-auto h-44 w-auto sm:h-52 lg:h-60"
							width="474"
							height="405"
							alt=""
							aria-hidden="true"
						/>
					</div>
				</div>
			</div>

			<a
				href="#about-content"
				class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition hover:text-white lg:flex"
				aria-label="Scroll to content"
			>
				<span class="text-xs uppercase tracking-widest">Scroll</span>
				<svg class="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</a>
		</div>
	</div>

	<div id="about-content" class="bg-section-fade py-20 lg:py-28">
		<div class="section-shell">
			<div class="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
				<div>
					<p class="section-label">{i("about")}</p>
					<h2 class="section-title mb-6">
						{i("about_headline_prefix")}
						<span class="gradient-text">{i("about_headline_emphasis")}</span>
					</h2>
					<p class="section-intro">{i("about_extended")}</p>
				</div>
				<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
					<div class="value-card layer-strategy">
						<div class="mb-3 flex items-center gap-3">
							<span class="step-badge-strategy text-xs">01</span>
							<p class="text-xs font-semibold uppercase tracking-wider text-brand-600">{i("banner_pillar_strategy")}</p>
						</div>
						<p class="text-sm leading-relaxed text-slate-600">{i("strategy_layer_intro")}</p>
					</div>
					<div class="value-card layer-governance">
						<div class="mb-3 flex items-center gap-3">
							<span class="step-badge-governance text-xs">02</span>
							<p class="text-xs font-semibold uppercase tracking-wider text-teal-dark">{i("banner_pillar_governance")}</p>
						</div>
						<p class="text-sm leading-relaxed text-slate-600">{i("governance_layer_intro")}</p>
					</div>
					<div class="value-card layer-operations">
						<div class="mb-3 flex items-center gap-3">
							<span class="step-badge-operations text-xs">03</span>
							<p class="text-xs font-semibold uppercase tracking-wider text-accent-700">{i("banner_pillar_operations")}</p>
						</div>
						<p class="text-sm leading-relaxed text-slate-600">{i("operations_layer_intro")}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="service" class="relative bg-white py-20 lg:py-28">
	<div class="absolute inset-x-0 top-0 h-1 bg-brand-bar" aria-hidden="true"></div>
	<div class="section-shell">
		<div class="mb-16 max-w-3xl">
			<p class="section-label">{i("services_title")}</p>
			<h2 class="section-title mb-6">{i("services_title")}</h2>
			<p class="section-intro">{i("services_intro")}</p>
		</div>

		<div class="mb-20">
			<div class="service-card layer-strategy mb-10 p-8 md:p-10">
				<h3 class="mb-3 text-2xl font-bold text-brand-950 md:text-3xl">{i("strategy_layer_title")}</h3>
				<p class="mb-8 max-w-4xl text-lg leading-relaxed text-slate-600">{i("strategy_layer_intro")}</p>
				<div class="grid gap-8 lg:grid-cols-2">
					<article class="rounded-xl bg-brand-50/60 p-6 md:p-8">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/></svg>
						</div>
						<h4 class="mb-3 text-xl font-bold text-brand-900 md:text-2xl">{i("data_strategy_title")}</h4>
						<p class="mb-3 text-slate-500 leading-relaxed">{i("data_strategy_intro")}</p>
						<p class="text-slate-700 leading-relaxed">{i("data_strategy_main")}</p>
					</article>
					<article class="rounded-xl bg-brand-50/60 p-6 md:p-8">
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
						</div>
						<h4 class="mb-3 text-xl font-bold text-brand-900 md:text-2xl">{i("ai_strategy_title")}</h4>
						<p class="mb-3 text-slate-500 leading-relaxed">{i("ai_strategy_intro")}</p>
						<p class="text-slate-700 leading-relaxed">{i("ai_strategy_main")}</p>
					</article>
				</div>
			</div>
		</div>

		<div class="mb-20">
			<div class="service-card layer-governance bg-gradient-to-br from-teal-brand/5 to-white p-8 md:p-10">
				<h3 class="mb-3 text-2xl font-bold text-brand-950 md:text-3xl">{i("governance_layer_title")}</h3>
				<p class="mb-8 max-w-4xl text-lg leading-relaxed text-slate-600">{i("governance_layer_intro")}</p>
				<h4 class="mb-3 text-xl font-bold text-teal-dark">{i("ai_governance_title")}</h4>
				<p class="mb-3 text-slate-500 leading-relaxed">{i("ai_governance_intro")}</p>
				<p class="text-slate-700 leading-relaxed">{i("ai_governance_main")}</p>
			</div>
		</div>

		<div class="mb-20">
			<div class="mb-10">
				<h3 class="mb-3 text-2xl font-bold text-brand-950 md:text-3xl">{i("operations_layer_title")}</h3>
				<p class="max-w-4xl text-lg leading-relaxed text-slate-600">{i("operations_layer_intro")}</p>
			</div>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<article class="service-card layer-operations">
					<h4 class="mb-3 text-lg font-bold text-brand-900">{i("dataops_title")}</h4>
					<p class="mb-3 text-sm leading-relaxed text-slate-500">{i("dataops_intro")}</p>
					<p class="text-sm leading-relaxed text-slate-700">{i("dataops_main")}</p>
				</article>
				<article class="service-card layer-operations">
					<h4 class="mb-3 text-lg font-bold text-brand-900">{i("mlops_title")}</h4>
					<p class="mb-3 text-sm leading-relaxed text-slate-500">{i("mlops_intro")}</p>
					<p class="text-sm leading-relaxed text-slate-700">{i("mlops_main")}</p>
				</article>
				<article class="service-card layer-operations">
					<h4 class="mb-3 text-lg font-bold text-brand-900">{i("llmops_title")}</h4>
					<p class="mb-3 text-sm leading-relaxed text-slate-500">{i("llmops_intro")}</p>
					<p class="text-sm leading-relaxed text-slate-700">{i("llmops_main")}</p>
				</article>
				<article class="service-card layer-operations">
					<h4 class="mb-3 text-lg font-bold text-brand-900">{i("aiops_title")}</h4>
					<p class="mb-3 text-sm leading-relaxed text-slate-500">{i("aiops_intro")}</p>
					<p class="text-sm leading-relaxed text-slate-700">{i("aiops_main")}</p>
				</article>
			</div>
			<figure class="mx-auto mt-14 max-w-4xl">
				<div class="diagram-frame">
					<img class="w-full" src="/images/business-data-ai-strategy.svg" alt={i("alignment_diagram_caption")} />
				</div>
				<figcaption class="mt-4 text-center text-sm leading-relaxed text-slate-500">{i("alignment_diagram_caption")}</figcaption>
			</figure>
		</div>

		<div class="mb-20">
			<div class="mb-8 max-w-3xl">
				<p class="section-label">{i("engagement_title")}</p>
				<h3 class="section-title mb-4">{i("engagement_title")}</h3>
				<p class="section-intro">{i("engagement_intro")}</p>
			</div>
			<figure class="mx-auto max-w-5xl">
				<div class="diagram-frame">
					<img class="w-full" src="/images/daistra-engagement-journey.svg" alt={i("engagement_title")} />
				</div>
			</figure>
		</div>

		<div>
			<div class="mb-10 text-center">
				<h3 class="section-title mb-4">{i("business_alignment_title")}</h3>
				<p class="section-intro mx-auto mb-4">{i("business_alignment_intro")}</p>
				<p class="mx-auto max-w-4xl text-lg leading-relaxed text-slate-700">{i("business_alignment_main")}</p>
			</div>
			<figure class="mx-auto max-w-6xl">
				<div class="diagram-frame">
					<img class="w-full" src="/images/data-ai-strategy.svg" alt={i("operating_model_caption")} />
				</div>
				<figcaption class="mt-4 text-center text-sm leading-relaxed text-slate-500">{i("operating_model_caption")}</figcaption>
			</figure>
		</div>
	</div>
</section>

<section id="contact" class="relative overflow-hidden bg-brand-950 py-20 lg:py-28">
	<div class="absolute inset-0 bg-hero-mesh opacity-60" aria-hidden="true"></div>
	<div class="absolute inset-0 pixel-grid opacity-40" aria-hidden="true"></div>
	<div class="relative section-shell">
		<div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
			<div class="text-white">
				<p class="section-label-light">{i("contact_us")}</p>
				<h2 class="font-display mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">{i("contact_us")}</h2>
				<p class="mb-8 text-lg leading-relaxed text-slate-300">{i("fill_form")}</p>

				<div class="mb-8 flex items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
					<div class="w-28 shrink-0 overflow-hidden rounded-xl bg-slate-900/40 shadow-md sm:w-32 aspect-[444/600]">
						<img
							src="/images/business-card-steven-ramdas.png"
							alt={i("founder_name")}
							class="h-full w-full object-contain"
							width="444"
							height="600"
							loading="lazy"
						/>
					</div>
					<div class="min-w-0">
						<p class="font-display text-xl font-bold text-white">{i("founder_name")}</p>
						<p class="mt-1 text-sm font-medium text-cyan-light">{i("founder_title")}</p>
						<p class="mt-3 text-sm leading-relaxed text-slate-300">{i("founder_bio")}</p>
						<a
							href="https://www.linkedin.com/in/srmds/"
							target="_blank"
							rel="noopener noreferrer"
							class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-200 transition hover:text-white"
						>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
								/>
							</svg>
							{i("founder_linkedin")}
						</a>
					</div>
				</div>

				<div class="space-y-4">
					<div class="flex items-start gap-3 text-slate-300">
						<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-cyan-light">
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
						</span>
						<span>{i("footer_address")}</span>
					</div>
				</div>
			</div>
			<div class="card-surface p-8 md:p-10">
				<form id="form" method="POST" action="https://api.web3forms.com/submit" on:submit|preventDefault={handleSubmit} class="space-y-5">
					<input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY}>
					<input type="hidden" name="subject" value="New website contact submission">
					<input type="hidden" name="redirect" value="https://web3forms.com/success#form">
					<input type="hidden" name="from_name" value="Daistra Contact Form">
					<input type="hidden" name="form_id" value="daistra_contact">
					<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
					<input type="checkbox" name="botcheck" class="hidden" style="display: none;">
					<div><label for="name" class="mb-1.5 block text-sm font-medium text-slate-700">{i("full_name")}</label><input type="text" id="name" name="name" class="form-input" placeholder="Jane Doe" required /></div>
					<div>
						<label for="email" class="mb-1.5 block text-sm font-medium text-slate-700">{i("email_address")}</label>
						<div class="relative">
							<input type="email" id="email" name="email-address" class="form-input" placeholder="you@domain.com" required on:input={handleEmailInput} />
							{#if isCheckingDomain}<div class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">Checking...</div>{/if}
						</div>
						{#if emailWarning}<p class="mt-1 text-sm text-amber-600">{emailWarning}</p>{/if}
					</div>
					<div>
						<label for="phone" class="mb-1.5 block text-sm font-medium text-slate-700">{i("phone_number")}</label>
						<div class="flex gap-3">
							<select bind:value={selectedCountry} on:change={handleCountryChange} class="form-input w-36 shrink-0">{#each countries as country}<option value={country}>{country} (+{getCountryCallingCode(country)})</option>{/each}</select>
							<input type="tel" id="phone" name="phone" bind:value={phoneNumber} on:input={handlePhoneInput} class="form-input flex-1" placeholder="06 12345678" required />
						</div>
						{#if phoneError}<p class="mt-1 text-sm text-red-600">{phoneError}</p>{/if}
					</div>
					<div><label for="message" class="mb-1.5 block text-sm font-medium text-slate-700">{i("message")}</label><textarea id="message" name="message" rows="4" class="form-input" placeholder={i("message_text")} required></textarea></div>
					<div bind:this={captchaContainer} class="mb-2 min-h-[78px]"></div>
					{#if status}<div class="text-sm {status.includes('Error') ? 'text-red-600' : 'text-emerald-600'}">{status}</div>{/if}
					<button type="submit" class="btn-primary w-full !rounded-xl disabled:cursor-not-allowed disabled:opacity-50" disabled={formSubmitted}>{i("send_message")}</button>
				</form>
			</div>
		</div>
	</div>
</section>
