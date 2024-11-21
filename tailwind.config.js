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
        '.content-space::before': {
          content: "'\\0020'",
        },
        '.content-check::before': {
          content: "'\\2713'"
        },
        '.content-error::before': {
          content: "'\\2715'"
        },
        '.outline-solid': {
          'outline-style': "solid"
        },
        '.tracking-widest-5xl': {
          'letter-spacing': "1.5rem"
        },
        '.leading-12': {
          'line-height': '3rem'
        },
        '.w-120': {
          'width': "30rem"
        },
        '.w-124': {
          'width': "31rem"
        },
        '.w-128': {
          'width': "32rem"
        },
        '.pt-1\\/2': {
          'padding-top': '50%'
        },
        '.aspect-2\\/3::before': {
          'content': "'\\0020'",
          'display': "block",
          'padding-top': "120%"
        }
      }

      addUtilities(newUtilities, ['before', 'after'])
      addComponents({

      });
    }
  ],
}
