/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      colors: {
        primary_blue: '#1976d2',
        primary_hover: '#398de1',
        light_blue: '#DBEAFD',
        light_green:'#ccfbf1',
        light_red: '#fee2e2',
        light_yellow: '#fef9c3',
        light_dark: '#f3f4f6',
        solid_blue: '#1e40af',
        solid_green:'#115e59',
        solid_red: '#991b1b',
        solid_yellow: '#854d0e',
        solid_dark: '#4b5563',
        bg_dark_mode: '#262626'

      },
    },
  },
  plugins: [
    require('preline/plugin'),
    require('@tailwindcss/forms'),
  ],
}
