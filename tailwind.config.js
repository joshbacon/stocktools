/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        'card': '0 10px 8px rgba(162, 28, 175, 0.25)',
        'button': '0 5px 5px rgba(162, 28, 175, 1)',
        'remove': '0 0px 5px rgba(190, 18, 60, 1)'
      }
    },
  },
  plugins: [],
}

