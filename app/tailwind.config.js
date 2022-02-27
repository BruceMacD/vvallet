module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media', // or 'false' or 'class'
  theme: {
    extend: {
      colors: {
        'theme-yellow': '#f4d35e',
      },
      animation: {
        linger: 'linger 3s ease-in-out infinite',
      },
      keyframes: {
        linger: {
          '0%, 100%': {
            transform: 'translateY(-1%)',
            filter: 'brightness(1.1)',
            opacity: 0.99,
          },
          '50%': {
            transform: 'translateY(1%)',
            filter: 'brightness(0.9)',
            opacity: 0.92,
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    styled: true,
    themes: [
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
