/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        'add': '0 0px 10px rgba(70, 193, 162, 1)',
        'remove': '0 0px 5px rgba(190, 18, 60, 1)'
      }
    },
  },
  plugins: [],
}

