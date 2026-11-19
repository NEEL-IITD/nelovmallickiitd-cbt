/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo-600
          hover: '#4338CA',   // Indigo-700
          light: '#EEF2FF',   // Indigo-50
          dark: '#3730A3',
        },
        accent: {
          violet: '#7C3AED',
          fuchsia: '#D946EF',
        },
        background: {
          light: '#FFFFFF',
          dark: '#0A0A0C',
          canvasDark: '#0B0C10',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#121318',
          darkCard: '#161720',
        },
        border: {
          light: '#E2E8F0',
          dark: '#262730',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
        'card-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
