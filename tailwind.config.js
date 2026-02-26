/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#1a1a2e',
          card: '#16213e',
          elevated: '#1f2b47',
          hover: '#253350',
        },
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
        },
        accent: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
        },
        followup: {
          pending: '#f59e0b',
          completed: '#10b981',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        chip: '20px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.3)',
        elevated: '0 8px 32px rgba(0, 0, 0, 0.4)',
        fab: '0 6px 20px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  plugins: [],
}
