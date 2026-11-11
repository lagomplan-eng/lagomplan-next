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
        // Catalog system (values live in app/globals.css :root)
        'ink-2': 'var(--ink-2)',
        label: 'var(--label)',
        'line-card': 'var(--line-card)',
        'line-panel': 'var(--line-panel)',
        'line-chip': 'var(--line-chip)',
        'line-btn': 'var(--line-btn)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
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