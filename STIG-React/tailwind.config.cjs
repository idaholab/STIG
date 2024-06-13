const colors = require('tailwindcss/colors');

module.exports = {
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
        "gray-75": "#f6f7f8",
        "gray-150": "#ecedf0",
        "gray-925": "#0d162b",
      },
    },
    // colors: {
    //   //transparent: 'transparent',
    //   //primary: 'rgb(var(--color-accent-800) / <alpha-value>)',
    //   //gray: colors.gray,
    //   // slate: colors.slate
    // },
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
          "secondary": '#F9FAFB',
          "secondary-focus": "",
          "secondary-content": "#ffffff",
          "neutral": '#9ca3af',
          "neutral-focus": "",
          "neutral-content": "#ffffff",
          "base-content": "#333",
        },
      },
      {
        // For some reason this doesn't work??: "primary": 'rgb(var(--color-primary))',
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          "primary": '#2c7aba',
          "primary-focus": "",
          "primary-content": "#ffffff",
          "secondary": '#111827',
          "secondary-focus": "",
          "secondary-content": "#ffffff",
          "neutral": '#3f3f3f',
          "neutral-focus": "",
          "neutral-content": "#ffffff",
          "base-content": "#ddd",
        },
      },
    ],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
};
