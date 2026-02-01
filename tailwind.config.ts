import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './App.tsx',
    './Router.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C5A265',
          dark: '#4a3b20',
        },
        surface: {
          DEFAULT: '#141414',
          light: '#1a1a1a',
          lighter: '#222222',
        },
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
        serif: ['Shippori Mincho', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
