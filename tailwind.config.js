/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.content-space': {
          content: "'\\0020'",
        },
        '.content-check': {
          content: "'\\2713'"
        },
        '.outline-solid': {
          'outline-style': "solid"
        },
        '.tracking-widest-5xl': {
          'letter-spacing': "1.5rem"
        },
        '.w-120': {
          'width': "30rem"
        },
        '.w-128': {
          'width': "32rem"
        }
      }

      addUtilities(newUtilities, ['before', 'after'])
    }
  ],
}
