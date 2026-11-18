/**
 * tests/brand-tokens.test.ts
 *
 *   npx tsx tests/brand-tokens.test.ts
 *
 * 1. No component names a font family directly ('Manrope' / 'Fraunces' / 'DM Mono'): the site loads its fonts
 *    under next/font names, so a literal name resolves to the browser's default sans/serif. Use var(--font-sans),
 *    var(--font-display), var(--font-mono). KNOWN_LITERALS lists the files still to be converted; a NEW file with a
 *    literal name fails.
 * 2. The old brand "forest" #1B4D3E (and its rgba form) is gone from app/ and components/. Use the pine token.
 */
import fs from 'fs'
import path from 'path'

const root = path.join(__dirname, '..')
const results: { name: string; pass: boolean; detail?: string }[] = []
const ok = (name: string, pass: boolean, detail?: string) => results.push({ name, pass, detail })

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, e.name)
    if (e.isDirectory()) walk(rel, out)
    else if (/\.(tsx?|jsx|css)$/.test(e.name)) out.push(rel)
  }
  return out
}
const files = [...walk('app'), ...walk('components')].filter(f => f !== path.join('app', 'globals.css'))

// font-family set to a literal family name (not a var(--font-*)): fontFamily: "'Manrope',…", font-family:'Manrope',…
const LITERAL_FONT = /font-?[fF]amily\s*[:=]\s*\{?\s*[`"']+\s*\\?['"]?\s*(Manrope|Fraunces|DM Mono)/

// Still to convert (follow-up): the World Cup pages and the date picker's inline styles.
const KNOWN_LITERALS = (f: string) => f.startsWith(path.join('components', 'worldcup')) || f === path.join('components', 'forms', 'DateRangePicker.tsx')

const offenders: string[] = []
for (const f of files) {
  if (KNOWN_LITERALS(f)) continue
  const src = fs.readFileSync(path.join(root, f), 'utf-8')
  if (LITERAL_FONT.test(src)) offenders.push(f)
}
ok('no component sets font-family to a literal Manrope / Fraunces / DM Mono (outside the known follow-up list)', offenders.length === 0, offenders.join(', '))

const old: string[] = []
for (const f of files) {
  const src = fs.readFileSync(path.join(root, f), 'utf-8')
  if (/#1B4D3E/i.test(src) || /rgba\(\s*27\s*,\s*77\s*,\s*62/.test(src)) old.push(f)
}
ok('no #1B4D3E (old forest) or its rgba form in app/ or components/', old.length === 0, old.join(', '))

// the guard itself must catch the shapes we fixed
for (const s of [`fontFamily: "'Manrope',sans-serif"`, `fontFamily: "'Fraunces', serif"`, `font-family:'Manrope',sans-serif;`]) ok(`guard matches: ${s}`, LITERAL_FONT.test(s))
for (const s of [`fontFamily: 'var(--font-sans)'`, `font-family: var(--font-display), 'Fraunces', serif`]) ok(`guard ignores: ${s}`, !LITERAL_FONT.test(s))

const failed = results.filter(r => !r.pass)
for (const r of failed) console.log(`FAIL ${r.name}: ${r.detail}`)
console.log(`brand-tokens: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
