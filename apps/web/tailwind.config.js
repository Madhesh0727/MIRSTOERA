/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'royal-navy': {
          DEFAULT: '#16283D',
          light: '#253D5B',
          dark: '#0E1A29',
        },
        'champagne-gold': {
          DEFAULT: '#C8A45D',
          light: '#E8D49E',
          dark: '#9B7833',
        },
        'vintage-ivory': {
          DEFAULT: '#F7F1E5',
          card: '#FCF9F2',
          border: '#E3D8C4',
          dark: '#EFE6D5',
        },
        burgundy: {
          DEFAULT: '#692D40',
          light: '#883C54',
          dark: '#4E212F',
        },
        'ink-black': {
          DEFAULT: '#292623',
          light: '#423E3A',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'royal': '0 4px 20px -2px rgba(22, 40, 61, 0.08), 0 2px 6px -1px rgba(22, 40, 61, 0.04)',
        'royal-hover': '0 12px 30px -4px rgba(200, 164, 93, 0.25), 0 4px 12px -2px rgba(22, 40, 61, 0.1)',
        'gold-glow': '0 0 15px rgba(200, 164, 93, 0.35)',
      },
    },
  },
  plugins: [],
};
