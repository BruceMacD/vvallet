// default settings can be found here
// https://unpkg.com/browse/tailwindcss@2.2.17/stubs/defaultConfig.stub.js

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media', // or 'false' or 'class'
  theme: {
    fontFamily: {
      // sans: ['Graphik', 'sans-serif'],
      // serif: ['Merriweather', 'serif'],
    },
    extend: {
      // spacing: {
      //   '128': '32rem',
      //   '144': '36rem',
      // },
      // borderRadius: {
      //   '4xl': '2rem',
      // }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    styled: true,
    themes: [
      // first one will be the default theme
      // uncomment to enable
      // "dark",
      // "light (default)",
      // "cupcake",
      // "bumblebee",
      // "emerald",
      // "corporate",
      // "synthwave",
      // "retro",
      // "cyberpunk",
      // "valentine",
      // "halloween",
      // "garden",
      // "forest",
      // "aqua",
      // "lofi",
      // "pastel",
      // "fantasy",
      // "wireframe",
      // 'black',
      // "luxury",
      // "dracula",
      {
        'vvallet-black': {
          primary: '#ffffff',
          'primary-focus': '#ffffff',
          'primary-content': '#000000',
          secondary: '#ffffff',
          'secondary-focus': '#ffffff',
          'secondary-content': '#000000',
          accent: '#ffffff',
          'accent-focus': '#ffffff',
          'accent-content': '#000000',
          'base-100': '#000000',
          'base-200': '#333333',
          'base-300': '#4d4d4d',
          'base-content': '#ffffff',
          neutral: '#333333',
          'neutral-focus': '#4d4d4d',
          'neutral-content': '#ffffff',
          info: '#66c6ff',
          success: '#87d039',
          warning: '#e2d562',
          error: '#ff6f6f',
          '--border-color': 'var(--b3)',
          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '.2s',
          '--btn-text-case': 'lowercase',
          '--btn-focus-scale': '0.95',
          '--navbar-padding': '.5rem',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
}
