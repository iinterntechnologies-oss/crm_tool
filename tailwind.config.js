/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#000F2B', // Deep Base - Main background
          900: '#1B264D', // Surface Layer - Cards and elevated surfaces
          800: '#263B61', // Depth/Stroke - Borders and dividers
          violet: '#1E0A3C', // Accent Surface - Secondary surfaces
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-0.5rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in-from-bottom 0.5s ease-out',
        'slide-in-top': 'slide-in-from-top 0.3s ease-out'
      }
    }
  },
  plugins: []
};
