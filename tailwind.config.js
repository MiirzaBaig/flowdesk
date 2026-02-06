/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // YC / Neo-Brutalism Palette
        brand: {
          DEFAULT: '#F26522', // YC Orange
          50: '#fff3eb',
          100: '#ffe3d1',
          500: '#F26522',
          600: '#d94e0f', // Darker interaction state
        },
        black: '#000000',
        white: '#ffffff',
        // Health segment colors - high contrast
        health: {
          healthy: '#00A96E', // Sharp green
          watch: '#FCB900', // Sharp yellow
          'at-risk': '#FF3333', // Sharp red
        },
        slate: {
          50: '#f9f9f9', // Very light gray, almost white
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#000000', // Borders are black
          400: '#000000',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
      },
      borderRadius: {
        'none': '0px',
        DEFAULT: '0px', // Default to sharp
        'sm': '2px', // Very slight rounding if needed
        'md': '4px',
        'lg': '6px',
      },
      borderWidth: {
        DEFAULT: '1px',
        '2': '2px',
        '3': '3px',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
