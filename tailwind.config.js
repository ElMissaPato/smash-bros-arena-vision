
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'smash-red': '#e60012',
        'smash-blue': '#0074e8',
        'smash-yellow': '#ffdf00',
        'smash-green': '#00934b',
        'smash-orange': '#ff8c00',
        'smash-purple': '#8b00ff',
      },
      backgroundImage: {
        'smash-gradient': 'linear-gradient(135deg, #e60012 0%, #0074e8 100%)',
      },
      fontFamily: {
        'game': ['"Press Start 2P"', 'cursive'],
        'title': ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 215, 0, 0.8)',
        'glow': '0 0 15px rgba(0, 116, 232, 0.7)',
      },
    },
  },
  plugins: [],
}
