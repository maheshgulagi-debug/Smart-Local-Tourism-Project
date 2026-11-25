/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#ea580c',
          600: '#c2410c',
          700: '#9a3412',
        },
        forest: {
          50: '#f0fdf4',
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
        },
      },
    },
  },
  plugins: [],
};
