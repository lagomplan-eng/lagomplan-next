/**
 * tests/design-tokens.test.ts
 *
 *   npx tsx tests/design-tokens.test.ts
 *
 * The design token source of truth (app/globals.css :root) and its Tailwind exposure (tailwind.config.js):
 *  - every Tailwind colour reads a CSS variable; no colour value is written twice
 *  - the stale aliases are gone; no hardcoded #E4DFD8 is left in app/ or components/
 *  - page title / H2 / H3 / eyebrow / buttons / radii / shadows equal the values measured on HOME (docs/design/home-canon.md)
 */
import fs from 'fs'
import path from 'path'

const root = path.join(__dirname, '..')
const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf-8')
const tw = fs.readFileSync(path.join(root, 'tailwind.config.js'), 'utf-8')
const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf('\n}\n', css.indexOf(':root {')) + 3)

const results: { name: string; pass: boolean; detail?: string }[] = []
const ok = (name: string, pass: boolean, detail?: string) => results.push({ name, pass, detail })
const decl = (name: string): string | null => {
  const m = rootBlock.match(new RegExp(`--${name}:\\s*([^;]+);`))
  return m ? m[1].replace(/\/\*.*?\*\//g, '').trim() : null
}

// ── one source ────────────────────────────────────────────────────────────────────
ok('Tailwind config has no hex colour literals', !/#[0-9a-fA-F]{3,8}\b/.test(tw.replace(/\/\*[\s\S]*?\*\//g, '')), 'a colour is written in tailwind.config.js')
const BRAND = ['pine', 'sage', 'sage-text', 'sand', 'cream', 'coral', 'fjord', 'mint', 'white', 'success', 'warning', 'error', 'ink-2', 'ink-3', 'label', 'line-soft', 'line-strong', 'ink-body', 'ink-card', 'ink-input', 'field-error']
for (const n of BRAND) ok(`colour --${n}-rgb is defined once, and --${n} derives from it`, (rootBlock.match(new RegExp(`--${n}-rgb:`, 'g')) ?? []).length === 1 && decl(n) === `rgb(var(--${n}-rgb))`, `${decl(n)}`)
const channelUsed = (n: string) => new RegExp(`['"]?${n}['"]?:\\s*channel\\('${n}'\\)`).test(tw)
for (const n of ['pine', 'sage', 'sage-text', 'sand', 'cream', 'coral', 'fjord', 'mint', 'success', 'warning', 'error', 'ink-2', 'ink-3', 'label', 'line-soft', 'line-strong', 'ink-body', 'ink-card', 'ink-input', 'field-error']) ok(`Tailwind colour ${n} reads --${n}-rgb`, channelUsed(n))
ok('brand RGB values are the brand (pine #0F3A33, cream #FFF9F3)', decl('pine-rgb') === '15 58 51' && decl('cream-rgb') === '255 249 243')

// ── contrast (informational): home's own text colours, measured on cream and white ─
// Home is the canon, so these are not gates. They are printed so nobody is surprised: home's sage text
// (eyebrows, chip text, hints) is below WCAG AA 4.5:1; --sage-text (same hue, darker) is kept for when that is decided.
const rgbOf = (n: string) => (decl(`${n}-rgb`) ?? '0 0 0').split(/\s+/).map(Number) as [number, number, number]
const lin = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
const lum = ([r, g, b]: number[]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
const contrast = (a: number[], b: number[]) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05) }
for (const n of ['pine', 'ink-body', 'ink-card', 'sage', 'sage-text'])
  console.log(`info contrast ${n}: ${contrast(rgbOf(n), rgbOf('cream')).toFixed(2)}:1 on cream, ${contrast(rgbOf(n), rgbOf('white')).toFixed(2)}:1 on white`)
ok('pine and the body text colours reach 4.5:1 on cream and white', ['pine', 'ink-body', 'ink-card'].every(n => contrast(rgbOf(n), rgbOf('cream')) >= 4.5 && contrast(rgbOf(n), rgbOf('white')) >= 4.5))
ok('--sage is home\'s #6B8F86 and --sage-text stays the darker same-hue option', decl('sage-rgb') === '107 143 134' && decl('sage-text-rgb') === '90 120 113')
ok('home colour values: body #3E5F58, card text #35584F, field text #0F1A16, error #B94030', decl('ink-body-rgb') === '62 95 88' && decl('ink-card-rgb') === '53 88 79' && decl('ink-input-rgb') === '15 26 22' && decl('field-error-rgb') === '185 64 48')
ok('Eyebrow uses sage (home .sec-label), not sage-text', /text-eyebrow uppercase text-sage['"` ]/.test(fs.readFileSync(path.join(root, 'components/design/Typography.tsx'), 'utf-8')))

// ── stale aliases ─────────────────────────────────────────────────────────────────
for (const a of ['forest', 'ink', 'accent', 'card', 'muted', 'border', 'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'])
  ok(`stale alias --${a} is not defined`, decl(a) === null)
function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, e.name)
    if (e.isDirectory()) walk(rel, out)
    else if (/\.(tsx?|jsx|css)$/.test(e.name)) out.push(rel)
  }
  return out
}
const files = [...walk('app'), ...walk('components')].filter(f => f !== path.join('app', 'globals.css'))
const dead = files.filter(f => /var\(--(forest|ink|card|muted|border)\)/.test(fs.readFileSync(path.join(root, f), 'utf-8')))
ok('nothing references a removed alias (--forest --ink --card --muted --border)', dead.length === 0, dead.join(', '))
const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
const hexLeft = files.filter(f => /#E4DFD8/i.test(stripComments(fs.readFileSync(path.join(root, f), 'utf-8'))))
ok('no hardcoded #E4DFD8 (use border-line-soft / var(--line-soft))', hexLeft.length === 0, hexLeft.join(', '))

// ── home type values (measured on www /es, docs/design/home-canon.md) ────────────
ok('page title = home H1: 60px (40 on mobile), 700, -1.5px, line-height 1.05', decl('fs-title') === '60px' && decl('fw-title') === '700' && decl('ls-title') === '-1.5px' && decl('lh-title') === '1.05')
ok('H2 = home section title: 40px (30 on mobile), 700, line-height 1.15; closing title 50px (34)', decl('fs-h2') === '40px' && decl('fw-h2') === '700' && decl('lh-h2') === '1.15' && decl('fs-h2-xl') === '50px')
ok('H3 = home guide-card title: 22px, 400, -0.02em; names 18/600; feature titles 15/600', decl('fs-h3') === '22px' && decl('fw-h3') === '400' && decl('ls-h3') === '-0.02em' && decl('fs-h4') === '18px' && decl('fw-h4') === '600' && decl('fs-h5') === '15px' && decl('fw-h5') === '600')
ok('eyebrow = home .sec-label: 11px, 500, 0.12em', decl('fs-eyebrow') === '11px' && decl('fw-eyebrow') === '500' && decl('ls-eyebrow') === '0.12em')
ok('body 15px / 1.8, lede 15px, small 13px, tiny 12px, micro 10px', decl('fs-body') === '15px' && decl('lh-body') === '1.8' && decl('fs-lede') === '15px' && decl('fs-small') === '13px' && decl('fs-tiny') === '12px' && decl('fs-micro') === '10px')
ok('mobile step at 768px: title 40, H2 30, closing 34, sections 64', /@media \(max-width: 768px\) \{\s*:root \{[^}]*--fs-title: 40px;[^}]*--fs-h2: 30px;[^}]*--fs-h2-xl: 34px;[^}]*--section-y: 64px;/.test(css))
ok('Tailwind exposes title, h2, h2-xl, h3, h4, h5, eyebrow, lede, body, small, tiny, micro type styles', ['title', 'h2', 'h3', 'h4', 'h5', 'eyebrow', 'lede', 'body', 'small', 'tiny', 'micro'].every(n => new RegExp(`\\b${n}:\\s*\\['var\\(--fs-${n}\\)'`).test(tw)) && /'h2-xl':/.test(tw))

// ── home decisions ───────────────────────────────────────────────────────────────
ok('radii: buttons 8, cards/tiles 12, guide card 22, place field 2, chips 9999', decl('radius-btn') === '8px' && decl('radius-info') === '12px' && decl('radius-destination') === '22px' && decl('radius-field') === '2px' && decl('radius-pill') === '9999px')
ok('buttons are not pills (Button uses rounded-btn)', /rounded-btn/.test(fs.readFileSync(path.join(root, 'components/design/Button.tsx'), 'utf-8')) && !/rounded-full/.test(fs.readFileSync(path.join(root, 'components/design/Button.tsx'), 'utf-8')))
ok('button: 13px text, solid hover #1A4A42, padding 12/24 (py-3 px-6)', decl('fs-button') === '13px' && decl('btn-solid-hover') === '#1A4A42' && /md: 'px-6 py-3 text-button'/.test(fs.readFileSync(path.join(root, 'components/design/Button.tsx'), 'utf-8')))
ok('card shadows are home\'s: guide card shadow-sm, planner card 0 4px 24px pine/6%', decl('shadow-soft') === '0 1px 2px 0 rgb(0 0 0 / .05)' && decl('shadow-form') === '0 4px 24px rgb(var(--pine-rgb) / .06)')
ok('sections 96px (64 mobile), page gutter 24, spacing scale is a 4px base', decl('section-y') === '96px' && decl('page-gutter') === '24px' && decl('space-1') === '4px' && decl('space-6') === '24px')
ok('Tailwind maps btn/field/info/destination radii and soft/lift/form shadows', /btn: 'var\(--radius-btn\)'/.test(tw) && /field: 'var\(--radius-field\)'/.test(tw) && /destination: 'var\(--radius-destination\)'/.test(tw) && /form: 'var\(--shadow-form\)'/.test(tw))

// ── components use tokens, not literals ──────────────────────────────────────────
const comp = fs.readdirSync(path.join(root, 'components/design')).filter(f => /\.tsx$/.test(f)).map(f => [f, fs.readFileSync(path.join(root, 'components/design', f), 'utf-8')] as const)
const hex = comp.filter(([, s]) => /#[0-9a-fA-F]{6}\b/.test(stripComments(s))).map(([f]) => f)
ok('components/design has no hex colour literals', hex.length === 0, hex.join(', '))

const failed = results.filter(r => !r.pass)
for (const r of failed) console.log(`FAIL ${r.name}${r.detail ? `: ${r.detail}` : ''}`)
console.log(`design-tokens: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
