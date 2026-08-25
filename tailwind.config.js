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
        gold: {
          50: '#FDFBF7',
          100: '#FAF5EA',
          200: '#F4E7CB',
          300: '#EBD4A5',
          400: '#DFBD78',
          500: '#D4AF37', // Nagulan Accent Gold
          600: '#C5A059',
          700: '#9E7E36',
          800: '#7E632B',
          900: '#54411C',
        },
        charcoal: {
          50: '#F7F7F7',
          100: '#EAEAEA',
          200: '#D1D1D1',
          300: '#A8A8A8',
          400: '#707070',
          500: '#4A4A4A',
          600: '#333333',
          700: '#242424',
          800: '#181818',
          850: '#141414',
          900: '#0D0D0D',
          950: '#080808',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      screens: {
        print: { raw: 'print' },
      },
    },
  },
  plugins: [],
}
