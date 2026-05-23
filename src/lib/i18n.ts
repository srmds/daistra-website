import { get, writable } from 'svelte/store';
import { goto } from '$app/navigation';
import en from '../../languages/en.json';
import nl from '../../languages/nl.json';

export type Locale = 'en' | 'nl';

const dictionaries: Record<Locale, Record<string, string>> = { en, nl };

export const languages: Locale[] = ['en', 'nl'];
export const language = writable<Locale>('en');

export function setLanguage(locale: Locale) {
	language.set(locale);
}

export function i(key: string, locale?: Locale): string {
	const lang = locale ?? get(language);
	return dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key;
}

export function switchLanguage(target: Locale) {
	if (typeof window === 'undefined') return;

	const pathname = window.location.pathname;
	const newPath =
		pathname.replace(/^\/(en|nl)(?=\/|$)/, `/${target}`) || `/${target}`;

	goto(newPath, { invalidateAll: true });
}

export function localizedPath(pathname: string, target: Locale): string {
	return pathname.replace(/^\/(en|nl)/, `/${target}`) || `/${target}`;
}

export function localeFromParam(param: string | undefined): Locale {
	return param === 'nl' ? 'nl' : 'en';
}
