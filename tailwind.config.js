/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        custom: {
          bg: '#F0F1F5',
          red: '#EE172E',
          grey: '#666666',
          lightgrey: '#DEDEDE',
        },
      },
    },
  },
  plugins: [],
}

