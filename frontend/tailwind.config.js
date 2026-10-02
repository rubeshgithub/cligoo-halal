/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		fontFamily: {
			display: ['"El Messiri"', 'Georgia', 'serif'],
			sans: ['"Readex Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
			/* Zellige & Saffron palette */
			emerald: { 50: '#E3F4EC', 100: '#C6E9D9', 300: '#7FD6AE', 500: '#13A06F', 700: '#0B6E4F', 800: '#095A41', 900: '#06402E' },
			saffron: { 50: '#FFF1D6', 100: '#FFE6B0', 200: '#FCD68A', 300: '#FFC24D', 400: '#F2A71B', 700: '#A86F00', 900: '#7A4B00' },
			pome: { 50: '#FCE6E3', 400: '#E35D4F', 600: '#C0392B', 800: '#9E2A1F' },
			iznik: { 50: '#E2F3F5', 500: '#1C8C9C', 700: '#146F7C', 900: '#0E525C' },
			ink: { DEFAULT: '#14213D', 700: '#22345A', 900: '#0B1326', soft: '#4A5468', mute: '#7C8598', mist: '#B8C0D0' },
			sand: { DEFAULT: '#FFF8EE', 200: '#F3E6D2' },
			clay: '#EADBC4',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};