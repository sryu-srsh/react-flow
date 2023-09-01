/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightgreen: '#93eb50',
        darkgreen: 'rgb(28, 145, 69)',
        blue: 'blue',
        black: 'black',
      },
    },
  },
  plugins: [],
}