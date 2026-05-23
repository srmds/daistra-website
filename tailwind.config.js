/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				},
				brand: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#0b1220'
				},
				cyan: {
					brand: '#22d3ee',
					light: '#67e8f9',
					dark: '#0891b2'
				},
				teal: {
					brand: '#14b8a6',
					light: '#5eead4',
					dark: '#0f766e'
				},
				accent: {
					400: '#e879f9',
					500: '#d946ef',
					600: '#c026d3',
					700: '#a21caf',
					950: '#581c87'
				}
			},
			fontFamily: {
				venus: ['Venus', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				display: ['Venus', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				sans: [
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				]
			},
			boxShadow: {
				brand: '0 20px 50px -12px rgba(37, 99, 235, 0.3)',
				'brand-lg': '0 32px 64px -16px rgba(34, 211, 238, 0.2), 0 16px 32px -8px rgba(30, 64, 175, 0.25)',
				card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)',
				glow: '0 0 80px rgba(34, 211, 238, 0.35)'
			},
			backgroundImage: {
				'hero-mesh':
					'radial-gradient(at 20% 30%, rgba(34, 211, 238, 0.18) 0px, transparent 45%), radial-gradient(at 75% 15%, rgba(59, 130, 246, 0.22) 0px, transparent 50%), radial-gradient(at 10% 70%, rgba(20, 184, 166, 0.12) 0px, transparent 45%), radial-gradient(at 85% 75%, rgba(217, 70, 239, 0.1) 0px, transparent 50%)',
				'brand-gradient': 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 45%, #1e40af 100%)',
				'teal-gradient': 'linear-gradient(135deg, #5eead4 0%, #14b8a6 50%, #0f766e 100%)',
				'accent-gradient': 'linear-gradient(135deg, #e879f9 0%, #c026d3 50%, #581c87 100%)',
				'section-fade': 'linear-gradient(180deg, #f1f5f9 0%, #ffffff 50%, #f8fafc 100%)',
				'brand-bar': 'linear-gradient(90deg, #22d3ee 0%, #3b82f6 33%, #14b8a6 66%, #c026d3 100%)'
			},
			animation: {
				'float-slow': 'float 8s ease-in-out infinite',
				'pulse-soft': 'pulseSoft 6s ease-in-out infinite'
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-12px)' }
				},
				pulseSoft: {
					'0%, 100%': { opacity: '0.5' },
					'50%': { opacity: '0.85' }
				}
			}
		}
	}
};

module.exports = config;
