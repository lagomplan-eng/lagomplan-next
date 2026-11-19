/**
 * tests/design-tokens.test.ts
 *
 *   npx tsx tests/design-tokens.test.ts
 *
 * The design token source of truth (app/globals.css :root) and its Tailwind exposure (tailwind.config.js):
 *  - every Tailwind colour reads a CSS variable; no colour value is written twice
 *  - the stale aliases are gone; no hardcoded #E4DFD8 is left in app/ or components/
 *  - page title / H2 / H3 / eyebrow equal the measured /guias values; radii, controls and shadows as decided
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
const BRAND = ['pine', 'sage', 'sand', 'cream', 'coral', 'fjord', 'mint', 'white', 'success', 'warning', 'error', 'ink-2', 'ink-3', 'label', 'line-soft', 'line-strong']
for (const n of BRAND) ok(`colour --${n}-rgb is defined once, and --${n} derives from it`, (rootBlock.match(new RegExp(`--${n}-rgb:`, 'g')) ?? []).length === 1 && decl(n) === `rgb(var(--${n}-rgb))`, `${decl(n)}`)
const channelUsed = (n: string) => new RegExp(`['"]?${n}['"]?:\\s*channel\\('${n}'\\)`).test(tw)
for (const n of ['pine', 'sage', 'sand', 'cream', 'coral', 'fjord', 'mint', 'success', 'warning', 'error', 'ink-2', 'ink-3', 'label', 'line-soft', 'line-strong']) ok(`Tailwind colour ${n} reads --${n}-rgb`, channelUsed(n))
ok('brand RGB values are the brand (pine #0F3A33, cream #FFF9F3)', decl('pine-rgb') === '15 58 51' && decl('cream-rgb') === '255 249 243')

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

// ── /guias type values (measured on the live page) ────────────────────────────────
ok('page title = /guias H1: clamp(44px, 7vw, 72px), 800, -0.04em, line-height .92', decl('fs-title') === 'clamp(44px, 7vw, 72px)' && decl('fw-title') === '800' && decl('ls-title') === '-0.04em' && decl('lh-title') === '0.92')
ok('H2 = /guias H2: 36px, 800, -0.02em, line-height 1.05', decl('fs-h2') === '36px' && decl('fw-h2') === '800' && decl('ls-h2') === '-0.02em' && decl('lh-h2') === '1.05')
ok('H3 = /guias H3: 24px, 800, -0.02em, line-height 1.12', decl('fs-h3') === '24px' && decl('fw-h3') === '800' && decl('ls-h3') === '-0.02em' && decl('lh-h3') === '1.12')
ok('eyebrow = /guias .sec-label: 11px, 500, 0.12em, line-height 1.55', decl('lh-eyebrow') === '1.55' && decl('fs-eyebrow') === '11px' && decl('fw-eyebrow') === '500' && decl('ls-eyebrow') === '0.12em')
ok('Tailwind exposes title, h2, h3, eyebrow, lede, body, small, tiny type styles', ['title', 'h2', 'h3', 'eyebrow', 'lede', 'body', 'small', 'tiny'].every(n => new RegExp(`\\b${n}:\\s*\\['var\\(--fs-${n}\\)'`).test(tw)))
ok('/guias title and H2 use the same values today (guards the source of the numbers)', (() => {
  const g = fs.readFileSync(path.join(root, 'components/guides/GuidesClient.tsx'), 'utf-8')
  return g.includes("fontSize: 'clamp(44px, 7vw, 72px)'") && g.includes("letterSpacing: '-0.04em'") && g.includes("lineHeight: 0.92") && /fontSize: '36px', lineHeight: 1\.05, letterSpacing: '-0\.02em', fontWeight: 800/.test(g)
})())

// ── decisions ────────────────────────────────────────────────────────────────────
ok('radii: pill, destination 24, info 16', decl('radius-pill') === '999px' && decl('radius-destination') === '24px' && decl('radius-info') === '16px')
ok('controls: button 48 / small 40, search 56, chip 44', decl('control-h') === '48px' && decl('control-h-sm') === '40px' && decl('control-h-lg') === '56px' && decl('chip-h') === '44px')
ok('card shadow is the /guias shadow', decl('shadow-soft') === '0 2px 8px rgb(0 0 0 / .04)')
ok('spacing scale is a 4px base', decl('space-1') === '4px' && decl('space-6') === '24px')
ok('Tailwind maps destination/info radii and soft/pop/sheet shadows', /destination: 'var\(--radius-destination\)'/.test(tw) && /info: 'var\(--radius-info\)'/.test(tw) && /soft: 'var\(--shadow-soft\)'/.test(tw))

// ── components use tokens, not literals ──────────────────────────────────────────
const comp = fs.readdirSync(path.join(root, 'components/design')).filter(f => /\.tsx$/.test(f)).map(f => [f, fs.readFileSync(path.join(root, 'components/design', f), 'utf-8')] as const)
const hex = comp.filter(([, s]) => /#[0-9a-fA-F]{6}\b/.test(s)).map(([f]) => f)
ok('components/design has no hex colour literals', hex.length === 0, hex.join(', '))

const failed = results.filter(r => !r.pass)
for (const r of failed) console.log(`FAIL ${r.name}${r.detail ? `: ${r.detail}` : ''}`)
console.log(`design-tokens: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
