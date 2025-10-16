const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      utilities: {
        '.avoid-column-before': {
          'break-before': 'avoid-column',
        },
      },
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-rgb-50))',
          100: 'rgb(var(--color-primary-rgb-100))',
          200: 'rgb(var(--color-primary-rgb-200))',
          300: 'rgb(var(--color-primary-rgb-300))',
          400: 'rgb(var(--color-primary-rgb-400))',
          500: 'rgb(var(--color-primary-rgb-500))',
          600: 'rgb(var(--color-primary-rgb-600))',
          700: 'rgb(var(--color-primary-rgb-700))',
          800: 'rgb(var(--color-primary-rgb-800))',
          900: 'rgb(var(--color-primary-rgb-900))',
          1000: 'rgb(var(--color-primary-rgb-1000))',
          DEFAULT: 'rgb(var(--color-primary-rgb-500))',
        },
        neutralc: {
          50: 'rgb(var(--color-neutral-rgb-50))',
          75: 'rgb(var(--color-neutral-rgb-75))',
          100: 'rgb(var(--color-neutral-rgb-100))',
          150: 'rgb(var(--color-neutral-rgb-150))',
          200: 'rgb(var(--color-neutral-rgb-200))',
          300: 'rgb(var(--color-neutral-rgb-300))',
          400: 'rgb(var(--color-neutral-rgb-400))',
          500: 'rgb(var(--color-neutral-rgb-500))',
          600: 'rgb(var(--color-neutral-rgb-600))',
          700: 'rgb(var(--color-neutral-rgb-700))',
          800: 'rgb(var(--color-neutral-rgb-800))',
          900: 'rgb(var(--color-neutral-rgb-900))',
          925: 'rgb(var(--color-neutral-rgb-925))',
          950: 'rgb(var(--color-neutral-rgb-950))',
          1000: 'rgb(var(--color-neutral-rgb-1000))',
          DEFAULT: 'rgb(var(--color-neutral-rgb-500))',
        },
        info: {
          light: 'rgb(var(--color-info-light-rgb))',
          dark: 'rgb(var(--color-info-dark-rgb))',
          default: 'rgb(var(--color-info-rgb))',
        },
        error: {
          light: 'rgb(var(--color-error-light-rgb))',
          dark: 'rgb(var(--color-error-dark-rgb))',
          DEFAULT: 'rgb(var(--color-error-rgb))',
        },
        success: {
          light: 'rgb(var(--color-success-light-rgb))',
          dark: 'rgb(var(--color-success-dark-rgb))',
          DEFAULT: 'rgb(var(--color-success-rgb))',
        },
        warning: {
          light: 'rgb(var(--color-warning-light-rgb))',
          dark: 'rgb(var(--color-warning-dark-rgb))',
          DEFAULT: 'rgb(var(--color-warning-rgb))',
        },
      },
    },

    fontFamily: {
      'sans': ['source sans pro'],
      'body': ['source sans pro']
      // 'serif': ['ui-serif', 'Georgia', ...],
      // 'mono': ['ui-monospace', 'SFMono-Regular', ...],
      // 'display': ['Oswald', ...],
      // 'body': ['"Open Sans"', ...],
    },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          "primary": '#2c7aba',
          "primary-focus": "",
          "primary-content": "#ffffff",
          'primary-inactive': '#1e4a85',
          'neutral': '#64748b',
          'warning': '#fed7aa',
          'error': '#fecaca',
          'info': '#c4dcf3',
        },
      },
      {
        // For some reason this doesn't work??: "primary": 'rgb(var(--color-primary))',
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          "primary": '#2c7aba',
          "primary-focus": "",
          "primary-content": "#ffffff",
          'primary-inactive': '#1e4a85',
          'warning': '#c24a0c',
          'neutral': '#6b7280',
          'error': '#7f1d1d',
          'info': '#1a4772',
        },
      },
    ],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus'],
    },
  },
};
