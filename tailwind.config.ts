import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					muted: 'hsl(var(--nova-primary-muted))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				nova: {
					bg: 'hsl(var(--nova-bg))',
					surface: 'hsl(var(--nova-surface))',
					elevated: 'hsl(var(--nova-elevated))',
					primary: 'hsl(var(--nova-primary))',
					'primary-muted': 'hsl(var(--nova-primary-muted))',
					accent: 'hsl(var(--nova-accent))',
					success: 'hsl(var(--nova-success))',
					warning: 'hsl(var(--nova-warning))',
					error: 'hsl(var(--nova-error))',
					text: 'hsl(var(--nova-text))',
					'text-muted': 'hsl(var(--nova-text-muted))',
					border: 'hsl(var(--nova-border))',
				}
			},
			borderRadius: {
				lg: '1rem', /* 16px */
				xl: '1.5rem', /* 24px */
				'2xl': '2rem', /* 32px */
				pill: '999px',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-surface': 'var(--gradient-surface)',
				'gradient-glow': 'var(--gradient-glow)',
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'glow': 'var(--shadow-glow)',
			},
			transitionTimingFunction: {
				'nova': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			},
			transitionDuration: {
				'nova': '180ms',
				'bounce': '320ms',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'glow': {
					'0%': {
						'box-shadow': '0 0 20px hsl(var(--nova-primary) / 0.3)'
					},
					'50%': {
						'box-shadow': '0 0 40px hsl(var(--nova-primary) / 0.6)'
					},
					'100%': {
						'box-shadow': '0 0 20px hsl(var(--nova-primary) / 0.3)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
				'scale-in': 'scale-in 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
				'slide-up': 'slide-up 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
				'glow': 'glow 2s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
