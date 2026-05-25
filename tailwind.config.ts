import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'kashda-bg': '#2a004a',
        'kashda-sidebar': '#1a003a',
        'kashda-surface': '#3a005f',
        'kashda-border': '#4a007a',
        'kashda-purple': '#6a0dad',
        'kashda-purple-hover': '#8a2dd3',
        'kashda-gold': '#d4af37',
        'kashda-gold-hover': '#e6c24d',
        'kashda-text': '#e0e0e0',
        'kashda-muted': '#a0a0a0',
        'kashda-light': '#ffffff',
        'kashda-dark': '#0a0a0a',
        'kashda-text-light': '#171717',
        'kashda-text-dark': '#ededed',
      },
    },
  },
  plugins: [],
};

export default config;
