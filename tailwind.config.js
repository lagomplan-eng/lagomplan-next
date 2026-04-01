/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './messages/**/*.{json,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        pine: '#0F3A33',
        sage: '#6B8F86',
        sand: '#EDE7E1',
        cream: '#FFF9F3',
        coral: '#E1615B',
        fjord: '#2D4F6C',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Fraunces', 'serif'],
        mono: ['var(--font-mono)', 'DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}