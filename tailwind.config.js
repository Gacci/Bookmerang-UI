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
    function({ addUtilities, addComponents }) {
      const newUtilities = {
        '.content-space': {
          content: "'\\0020'",
        },
        '.content-check': {
          content: "'\\2713'"
        },
        '.content-error': {
          content: "'\\2715'"
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
        },
        '.pt-1\\/2': {
          'padding-top': '50%'
        }
      }

      addUtilities(newUtilities, ['before', 'after'])
      addComponents({

      });
    }
  ],
}
