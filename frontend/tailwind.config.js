/** @type {import('tailwindcss').Config} */
 
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/@storefront-ui/react/**/*.{js,mjs}'],
  theme: {
    extend: {
      colors: {
        cream: '#C0BFA1',
      },
    },
  },
  screens: {
    xs: '400px',
    sm: '600px',
    md: '900px',
    lg: '1500px',
    xl: '1880px',
    xxl: '1920px',
  },
  extend: {},
  variants: {},
  plugins: [],
}