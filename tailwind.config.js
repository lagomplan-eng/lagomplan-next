/**
 * tailwind.config.js
 *
 * Exposes the design tokens to Tailwind. It defines NO values of its own: every colour, radius,
 * shadow, spacing and type size reads a CSS variable from app/globals.css (:root), the single
 * token source (reference: docs/design/tokens.md, live specimen: /dev/design).
 *
 * Colours use the channel form (rgb(var(--x-rgb) / <alpha-value>)), so opacity utilities
 * (text-pine/70, border-pine/30) keep working.
 */
const channel = name => `rgb(var(--${name}-rgb) / <alpha-value>)`

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
        // Brand
        pine: channel('pine'),
        sage: channel('sage'),
        'sage-text': channel('sage-text'),
        sand: channel('sand'),
        cream: channel('cream'),
        coral: channel('coral'),
        fjord: channel('fjord'),
        mint: channel('mint'),
        // Functional
        success: channel('success'),
        warning: channel('warning'),
        error: channel('error'),
        // Text neutrals
        'ink-2': channel('ink-2'),
        'ink-3': channel('ink-3'),
        label: channel('label'),
        // Line neutrals
        'line-soft': channel('line-soft'),
        'line-strong': channel('line-strong'),
        // Pine at fixed alphas (catalog hairlines)
        'line-card': 'var(--line-card)',
        'line-panel': 'var(--line-panel)',
        'line-chip': 'var(--line-chip)',
        'line-btn': 'var(--line-btn)',
        'pine-hover': 'var(--pine-hover)',
        // Home values (docs/design/home-canon.md)
        'ink-body': channel('ink-body'),
        'ink-card': channel('ink-card'),
        'ink-input': channel('ink-input'),
        'field-error': channel('field-error'),
        'btn-solid-hover': 'var(--btn-solid-hover)',
        'line-section': 'var(--line-section)',
        'line-hair': 'var(--line-hair)',
        'line-field': 'var(--line-field)',
        'line-sage': 'var(--line-sage)',
        'line-form': 'var(--line-form)',
        'line-divider': 'var(--line-divider)',
        placeholder: 'var(--placeholder)',
      },
      borderRadius: {
        btn: 'var(--radius-btn)',
        field: 'var(--radius-field)',
        info: 'var(--radius-info)',
        destination: 'var(--radius-destination)',
        sheet: 'var(--radius-sheet)',
        // legacy, used by the catalog until it migrates
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
        form: 'var(--shadow-form)',
        pop: 'var(--shadow-pop)',
        sheet: 'var(--shadow-sheet)',
      },
      spacing: {
        section: 'var(--section-y)',
        gutter: 'var(--page-gutter)',
        control: 'var(--control-h)',
        'control-sm': 'var(--control-h-sm)',
        field: 'var(--field-h)',
        chip: 'var(--chip-h)',
        'chip-sm': 'var(--chip-h-sm)',
      },
      fontSize: {
        // Home type scale (docs/design/home-canon.md); sizes switch to the mobile step at 768px in :root
        title:   ['var(--fs-title)',   { lineHeight: 'var(--lh-title)',   letterSpacing: 'var(--ls-title)',   fontWeight: 'var(--fw-title)' }],
        h2:      ['var(--fs-h2)',      { lineHeight: 'var(--lh-h2)',      letterSpacing: 'var(--ls-h2)',      fontWeight: 'var(--fw-h2)' }],
        'h2-xl': ['var(--fs-h2-xl)',   { lineHeight: 'var(--lh-h2-xl)',   fontWeight: 'var(--fw-h2)' }],
        h3:      ['var(--fs-h3)',      { lineHeight: 'var(--lh-h3)',      letterSpacing: 'var(--ls-h3)',      fontWeight: 'var(--fw-h3)' }],
        h4:      ['var(--fs-h4)',      { lineHeight: 'var(--lh-h4)',      fontWeight: 'var(--fw-h4)' }],
        h5:      ['var(--fs-h5)',      { lineHeight: 'var(--lh-h5)',      fontWeight: 'var(--fw-h5)' }],
        eyebrow: ['var(--fs-eyebrow)', { lineHeight: 'var(--lh-eyebrow)', letterSpacing: 'var(--ls-eyebrow)', fontWeight: 'var(--fw-eyebrow)' }],
        lede:    ['var(--fs-lede)',    { lineHeight: 'var(--lh-lede)' }],
        body:    ['var(--fs-body)',    { lineHeight: 'var(--lh-body)' }],
        small:   ['var(--fs-small)',   { lineHeight: 'var(--lh-small)' }],
        tiny:    ['var(--fs-tiny)',    { lineHeight: 'var(--lh-tiny)' }],
        micro:   ['var(--fs-micro)',   { lineHeight: 'var(--lh-micro)' }],
        button:      ['var(--fs-button)',    { lineHeight: '1.55', letterSpacing: '0.03em' }],
        'button-sm': ['var(--fs-button-sm)', { lineHeight: '1.55', letterSpacing: '0.03em' }],
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
