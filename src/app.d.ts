// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	interface Window {
		dataLayer: unknown[];
		gtag: (...args: unknown[]) => void;
		hcaptcha?: {
			reset: (widgetId?: string) => void;
			render: (
				element: HTMLElement | string,
				options: {
					sitekey: string;
					hl?: string;
					theme?: 'light' | 'dark';
					size?: 'normal' | 'compact' | 'invisible';
				}
			) => string;
		};
	}

	namespace App {
        interface Platform {
          env: {
            COUNTER: DurableObjectNamespace;
          };
          context: {
            waitUntil(promise: Promise<any>): void;
          };
          caches: CacheStorage & { default: Cache }
        }
    }
}

export {};
