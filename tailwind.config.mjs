import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        bg1: '#0D1117',
        bg2: '#161B22',
        textPrimary: '#E6EDF3',
        textSecondary: '#8B949E',
        accent1: '#FF6B6B',
        accent2: '#00D8FF',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
});
