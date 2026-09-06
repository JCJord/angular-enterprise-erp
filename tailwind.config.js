/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C', // Main Brand Orange
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        sidebar: {
          bg: '#0F172A',
          surface: '#1E293B',
          hover: '#334155',
          text: '#E2E8F0',
          muted: '#94A3B8'
        },
        homolog: {
          bg: '#FEF08A',
          text: '#854D0E',
          border: '#FDE047'
        },
        wms: {
          occupied: '#EA580C',
          reserved: '#3B82F6',
          free: '#10B981',
          blocked: '#6B7280',
          cargo: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
