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
      }
    }
  },
  plugins: []
};
