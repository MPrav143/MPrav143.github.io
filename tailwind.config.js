/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
        },
        cyan: {
          400: '#22d3ee',
          600: '#0891b2',
        }
      },
    },
  },
  plugins: [],
}
