/**
 * lib/fonts/index.ts
 *
 * Self-hosted fonts (next/font/local). Replaces next/font/google, whose build-time fetch from
 * fonts.googleapis.com failed intermittently in CI and on Vercel ("Cannot read properties of
 * null (reading '1')"). The build no longer touches the network for fonts.
 *
 * Same fonts, weights, styles, display and CSS variables as before:
 *   Manrope   400 500 700            normal         --font-sans
 *   Fraunces  500 600                normal+italic  --font-display
 *   DM Mono   400                    normal         --font-mono
 *
 * The files are the exact woff2 files Google served (byte-identical to the response to Next's own
 * request), one per family/style/subset, see files/README.md. Google serves a font as several
 * unicode-range subsets and the browser downloads only the ones a page needs, so every subset is
 * kept (the guides use č š ž ğ ş, which live in latin-ext). Only the latin subset is preloaded.
 *
 * next/font/local applies `declarations` to a whole family, so each subset is its own localFont()
 * call (and CSS variable, --font-sans-latin-ext, ...). app/globals.css then combines them back into
 * --font-sans / --font-display / --font-mono, the names the rest of the code (tailwind.config.js,
 * globals.css) already uses. Every layout must put `fontVariables` on <html>.
 *
 * Fallback fonts: next/font would compute the size-adjusted fallback (shown while the web font loads,
 * font-display: swap) from the variable font's default instance, which differs slightly from the values
 * next/font/google used. To keep layout identical during load, adjustFontFallback is off here and
 * app/globals.css defines the same three fallback faces next/font/google generated (Google's metrics).
 *
 * NOTE: localFont() arguments must be literals (a compile-time requirement of next/font), so this
 * file is long on purpose. Do not factor the repeated values into constants.
 * Generated from the production font-face data; edit by hand only to add a font.
 */

import localFont from 'next/font/local'

// ── Manrope (--font-sans) ────────────────────────────────────────
const manropeCyrillicExt = localFont({
  src: [
    { path: './files/manrope-cyrillic-ext.woff2', weight: '400', style: 'normal' },
    { path: './files/manrope-cyrillic-ext.woff2', weight: '500', style: 'normal' },
    { path: './files/manrope-cyrillic-ext.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans-cyrillic-ext',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+0460-052f,u+1c80-1c8a,u+20b4,u+2de0-2dff,u+a640-a69f,u+fe2e-fe2f' }],
})
const manropeCyrillic = localFont({
  src: [
    { path: './files/manrope-cyrillic.woff2', weight: '400', style: 'normal' },
    { path: './files/manrope-cyrillic.woff2', weight: '500', style: 'normal' },
    { path: './files/manrope-cyrillic.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans-cyrillic',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+0301,u+0400-045f,u+0490-0491,u+04b0-04b1,u+2116' }],
})
const manropeGreek = localFont({
  src: [
    { path: './files/manrope-greek.woff2', weight: '400', style: 'normal' },
    { path: './files/manrope-greek.woff2', weight: '500', style: 'normal' },
    { path: './files/manrope-greek.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans-greek',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+0370-0377,u+037a-037f,u+0384-038a,u+038c,u+038e-03a1,u+03a3-03ff' }],
})
const manropeVietnamese = localFont({
  src: [
    { path: './files/manrope-vietnamese.woff2', weight: '400', style: 'normal' },
    { path: './files/manrope-vietnamese.woff2', weight: '500', style: 'normal' },
    { path: './files/manrope-vietnamese.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans-vietnamese',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+0102-0103,u+0110-0111,u+0128-0129,u+0168-0169,u+01a0-01a1,u+01af-01b0,u+0300-0301,u+0303-0304,u+0308-0309,u+0323,u+0329,u+1ea0-1ef9,u+20ab' }],
})
const manropeLatinExt = localFont({
  src: [
    { path: './files/manrope-latin-ext.woff2', weight: '400', style: 'normal' },
    { path: './files/manrope-latin-ext.woff2', weight: '500', style: 'normal' },
    { path: './files/manrope-latin-ext.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans-latin-ext',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+0100-02ba,u+02bd-02c5,u+02c7-02cc,u+02ce-02d7,u+02dd-02ff,u+0304,u+0308,u+0329,u+1d00-1dbf,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c4,u+2113,u+2c60-2c7f,u+a720-a7ff' }],
})
const manropeLatin = localFont({
  src: [
    { path: './files/manrope-latin.woff2', weight: '400', style: 'normal' },
    { path: './files/manrope-latin.woff2', weight: '500', style: 'normal' },
    { path: './files/manrope-latin.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans-latin',
  preload: true,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd' }],
})

// ── Fraunces (--font-display) ────────────────────────────────────────
const frauncesVietnamese = localFont({
  src: [
    { path: './files/fraunces-vietnamese.woff2', weight: '500', style: 'normal' },
    { path: './files/fraunces-vietnamese.woff2', weight: '600', style: 'normal' },
    { path: './files/fraunces-vietnamese-italic.woff2', weight: '500', style: 'italic' },
    { path: './files/fraunces-vietnamese-italic.woff2', weight: '600', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-display-vietnamese',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+0102-0103,u+0110-0111,u+0128-0129,u+0168-0169,u+01a0-01a1,u+01af-01b0,u+0300-0301,u+0303-0304,u+0308-0309,u+0323,u+0329,u+1ea0-1ef9,u+20ab' }],
})
const frauncesLatinExt = localFont({
  src: [
    { path: './files/fraunces-latin-ext.woff2', weight: '500', style: 'normal' },
    { path: './files/fraunces-latin-ext.woff2', weight: '600', style: 'normal' },
    { path: './files/fraunces-latin-ext-italic.woff2', weight: '500', style: 'italic' },
    { path: './files/fraunces-latin-ext-italic.woff2', weight: '600', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-display-latin-ext',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+0100-02ba,u+02bd-02c5,u+02c7-02cc,u+02ce-02d7,u+02dd-02ff,u+0304,u+0308,u+0329,u+1d00-1dbf,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c4,u+2113,u+2c60-2c7f,u+a720-a7ff' }],
})
const frauncesLatin = localFont({
  src: [
    { path: './files/fraunces-latin.woff2', weight: '500', style: 'normal' },
    { path: './files/fraunces-latin.woff2', weight: '600', style: 'normal' },
    { path: './files/fraunces-latin-italic.woff2', weight: '500', style: 'italic' },
    { path: './files/fraunces-latin-italic.woff2', weight: '600', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-display-latin',
  preload: true,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd' }],
})

// ── DM Mono (--font-mono) ────────────────────────────────────────
const dmMonoLatinExt = localFont({
  src: [
    { path: './files/dm-mono-latin-ext.woff2', weight: '400', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-mono-latin-ext',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+0100-02ba,u+02bd-02c5,u+02c7-02cc,u+02ce-02d7,u+02dd-02ff,u+0304,u+0308,u+0329,u+1d00-1dbf,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c4,u+2113,u+2c60-2c7f,u+a720-a7ff' }],
})
const dmMonoLatin = localFont({
  src: [
    { path: './files/dm-mono-latin.woff2', weight: '400', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-mono-latin',
  preload: true,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd' }],
})

/** Put on <html className>: defines every --font-<family>-<subset> variable that globals.css combines. */
export const fontVariables = [
  manropeCyrillicExt.variable,
  manropeCyrillic.variable,
  manropeGreek.variable,
  manropeVietnamese.variable,
  manropeLatinExt.variable,
  manropeLatin.variable,
  frauncesVietnamese.variable,
  frauncesLatinExt.variable,
  frauncesLatin.variable,
  dmMonoLatinExt.variable,
  dmMonoLatin.variable,
].join(' ')
