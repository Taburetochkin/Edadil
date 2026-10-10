/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        ubuntu_mono: ['Ubuntu Mono', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif']
      },
      screens : {
        'sm': '320px',
        'md': '750px',
        'lg': '768px',
        'xl': '1024px',
        '2xl': '1440px',
        '3xl': '1920px'
      }
    },
  },
  plugins: [],
}

