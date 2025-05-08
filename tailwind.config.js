/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-geist-sans)',
        mono: 'var(--font-geist-mono)',
        heading: 'var(--font-league-spartan)',
      },
      colors: {
        navy: '#2c2d72',
        peach: '#F9C7B5',
        'peach-light': '#FFEDE6',
        'peach-extra-light': '#FFF7F2',
      },
    },
  },
  plugins: [],
};
