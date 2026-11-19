/**
 * tests/brand-tokens.test.ts
 *
 *   npx tsx tests/brand-tokens.test.ts
 *
 * 1. No component names a font family directly ('Manrope' / 'Fraunces' / 'DM Mono'): the site loads its fonts
 *    under next/font names, so a literal name resolves to the browser's default sans/serif (or needs a runtime
 *    Google Fonts import). Use var(--font-sans), var(--font-display), var(--font-mono). No exceptions: only comments
 *    and prototypes/ may still mention the names (the scan covers app/ and components/ code, comments are not matched).
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

const offenders: string[] = []
for (const f of files) {
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

const googleFonts: string[] = []
for (const f of files) if (/fonts\.googleapis\.com/.test(fs.readFileSync(path.join(root, f), 'utf-8'))) googleFonts.push(f)
ok('no runtime Google Fonts import in app/ or components/ (fonts are self-hosted via next/font)', googleFonts.length === 0, googleFonts.join(', '))

const oldHover: string[] = []
for (const f of files) if (/#163d31/i.test(fs.readFileSync(path.join(root, f), 'utf-8'))) oldHover.push(f)
ok('no #163d31 (old forest hover shade): use the pine-hover token', oldHover.length === 0, oldHover.join(', '))
ok('pine-hover token exists in tailwind.config.js and globals.css', /'pine-hover':\s*'var\(--pine-hover\)'/.test(fs.readFileSync(path.join(root, 'tailwind.config.js'), 'utf-8')) && /--pine-hover:\s*#12453D/i.test(fs.readFileSync(path.join(root, 'app/globals.css'), 'utf-8')))

// the guard itself must catch the shapes we fixed
for (const s of [`fontFamily: "'Manrope',sans-serif"`, `fontFamily: "'Fraunces', serif"`, `font-family:'Manrope',sans-serif;`, `fontFamily:"'Fraunces',serif"`, `cssText = 'font-family:"DM Mono",monospace;'`]) ok(`guard matches: ${s}`, LITERAL_FONT.test(s))
for (const s of [`fontFamily: 'var(--font-sans)'`, `font-family: var(--font-display), 'Fraunces', serif`, `font-family:var(--font-mono);`]) ok(`guard ignores: ${s}`, !LITERAL_FONT.test(s))

const failed = results.filter(r => !r.pass)
for (const r of failed) console.log(`FAIL ${r.name}: ${r.detail}`)
console.log(`brand-tokens: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
