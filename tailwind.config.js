/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0FB9B1',
          600: '#0D9488',
          700: '#0F766E',
          DEFAULT: '#0FB9B1',
          dark: '#06233D',
        },
        health: {
          bg: '#F7FAFC',
          card: '#FFFFFF',
          text: {
            primary: '#1E293B',
            secondary: '#64748B',
          }
        }
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #5FD3D0 0%, #0FB9B1 100%)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};
