/**
 * Tailwind is kept for utility classes only. The palette and type scale that
 * the site actually uses live in src/colony/tokens.ts; defining them here too
 * would be the "second palette" the design brief rules out, so this config
 * deliberately extends nothing.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
