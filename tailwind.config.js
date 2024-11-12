/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./node_modules/flowbite.{js,ts}'],
  theme: {
    extend: {
      colors: {
        // primary: '#843bd7',
      },
      fontFamily: {
        primary: ['Inter'],
      },
    },
  },
  daisyui: {
    styled: true,
    themes: [
      'cupcake'
    ],

  },
  plugins: [
    '@tailwindcss/forms',
    '@tailwindcss/container-queries',
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
};
