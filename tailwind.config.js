/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Paleta de SUNANDA: Negro, Blanco y Dorado
        gold: {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f3ead3',
          300: '#ebddb9',
          400: '#dcc485',
          500: '#d4af37', // Dorado principal
          600: '#c49d2f',
          700: '#a38327',
          800: '#82691f',
          900: '#6a5619',
          DEFAULT: '#d4af37',
          dark: '#a38327', // gold-dark para hover
        },
        dark: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#717171',
          500: '#4a4a4a',
          600: '#2d2d2d',
          700: '#1f1f1f',
          800: '#141414',
          900: '#000000', // Negro principal
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'gold-sm': '0 1px 2px 0 rgba(212, 175, 55, 0.05)',
        'gold': '0 4px 6px -1px rgba(212, 175, 55, 0.1), 0 2px 4px -1px rgba(212, 175, 55, 0.06)',
        'gold-md': '0 10px 15px -3px rgba(212, 175, 55, 0.1), 0 4px 6px -2px rgba(212, 175, 55, 0.05)',
        'gold-lg': '0 20px 25px -5px rgba(212, 175, 55, 0.1), 0 10px 10px -5px rgba(212, 175, 55, 0.04)',
        'gold-xl': '0 25px 50px -12px rgba(212, 175, 55, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
