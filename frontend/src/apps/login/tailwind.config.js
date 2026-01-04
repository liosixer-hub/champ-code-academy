/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('../../shared/tailwind.preset.js')
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../shared/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
