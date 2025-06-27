// tailwind.config.js
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        heading: ['var(--font-league-spartan)', 'sans-serif'],
      },
      colors: {
        navy: '#2c2d72',
        peach: '#F9C7B5',
        'peach-light': '#FFEDE6',
        'peach-extra-light': '#FEF1ED',
        'peach-pale': '#fff7f2',
        'peach-dark': '#f4a76c',
        'navy-light': '#c0cedb',
        'navy-medium': '#829cb8'
      },
    },
    
  },
  plugins: [],
  
}

