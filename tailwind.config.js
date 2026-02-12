/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Space Professional Theme
        'bg-base': '#0A0E27',
        'bg-elevated': '#121729',
        'accent-primary': '#60A5FA',
        'accent-secondary': '#34D399',
        'accent-tertiary': '#8B5CF6',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        'border': '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'scroll': 'scroll 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '30%': { opacity: '1' },
          '60%': { opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
