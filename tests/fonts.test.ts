/**
 * tests/fonts.test.ts — run: npx tsx tests/fonts.test.ts
 *
 * Fonts are self-hosted (next/font/local, lib/fonts/index.ts). Guards against:
 *  - a next/font/google import coming back (its build-time fetch failed intermittently in CI and Vercel),
 *  - a layout that renders <html> without the font variables (the combined --font-* would be invalid
 *    and the whole font-family declaration would fall back to the browser default),
 *  - the declared weights / styles / display / preload / subsets drifting from what production served.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

let pass = 0, fail = 0
function eq(a: unknown, b: unknown, msg: string) {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++
  else { fail++; console.error(`FAIL ${msg}\n  got      ${JSON.stringify(a)}\n  expected ${JSON.stringify(b)}`) }
}
const ok = (c: boolean, msg: string) => eq(c, true, msg)

// ── 1. no next/font/google anywhere in the source ────────────────────────────────
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (['node_modules', '.next', '.git', 'prototypes', 'public'].includes(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(name)) out.push(p)
  }
  return out
}
/** Source without comments, so a doc comment mentioning next/font/google or <html> is not a match. */
const code = (f: string) => readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

const sources = ['app', 'components', 'lib', 'content', 'hooks', 'types'].filter(existsSync).flatMap(d => walk(d))
const offenders = sources.filter(f => /(from\s+|require\(\s*|import\(\s*)['"]next\/font\/google['"]/.test(code(f)))
eq(offenders, [], 'no file imports next/font/google')

// ── 2. every layout that renders <html> puts fontVariables on it ────────────────────
const layouts = sources.filter(f => /(^|\/)layout\.tsx$/.test(f))
const htmlLayouts = layouts.filter(f => /<html[\s>]/.test(code(f)))
ok(htmlLayouts.length >= 4, `found the <html> layouts (${htmlLayouts.length})`)
for (const f of htmlLayouts) {
  const s = code(f)
  ok(/import \{ fontVariables \} from '[./]+\/lib\/fonts'/.test(s), `${f}: imports fontVariables`)
  ok(/<html[^>]*className=\{[^}]*fontVariables/.test(s), `${f}: fontVariables on <html className>`)
}

// ── 3. lib/fonts/index.ts: declarations ───────────────────────────────────────────
const fonts = readFileSync('lib/fonts/index.ts', 'utf8')
const calls = [...fonts.matchAll(/const (\w+) = localFont\(\{([\s\S]*?)\n\}\)\n/g)].map(m => ({ name: m[1], body: m[2] }))
eq(calls.length, 11, '11 localFont calls (6 Manrope + 3 Fraunces + 2 DM Mono subsets)')
const FAMILIES: Record<string, { prefix: string; varBase: string; subsets: string[]; faces: string[] }> = {
  Manrope:  { prefix: 'manrope',  varBase: '--font-sans',    subsets: ['cyrillic-ext', 'cyrillic', 'greek', 'vietnamese', 'latin-ext', 'latin'],
              faces: ['normal 400', 'normal 500', 'normal 700'] },
  Fraunces: { prefix: 'fraunces', varBase: '--font-display', subsets: ['vietnamese', 'latin-ext', 'latin'],
              faces: ['italic 500', 'italic 600', 'normal 500', 'normal 600'] },
  'DM Mono': { prefix: 'dmMono',  varBase: '--font-mono',    subsets: ['latin-ext', 'latin'],
              faces: ['normal 400'] },
}
const definedVars: string[] = []
for (const [fam, spec] of Object.entries(FAMILIES)) {
  const mine = calls.filter(c => c.name.startsWith(spec.prefix) && /^[A-Z]/.test(c.name.slice(spec.prefix.length)))
  eq(mine.length, spec.subsets.length, `${fam}: one call per subset`)
  for (const c of mine) {
    const v = /variable: '([^']+)'/.exec(c.body)?.[1] ?? ''
    definedVars.push(v)
    const subset = v.slice(spec.varBase.length + 1)
    ok(spec.subsets.includes(subset), `${fam}: variable ${v} is a known subset`)
    ok(v.startsWith(spec.varBase + '-'), `${c.name}: variable under ${spec.varBase}`)
    ok(/display: 'swap'/.test(c.body), `${c.name}: display swap`)
    ok(/declarations: \[\{ prop: 'unicode-range', value: '[^']+' \}\]/.test(c.body), `${c.name}: has a unicode-range`)
    eq(/preload: (true|false)/.exec(c.body)?.[1], subset === 'latin' ? 'true' : 'false', `${c.name}: only the latin subset is preloaded`)
    const faces = [...c.body.matchAll(/path: '\.\/files\/([^']+)', weight: '(\d+)', style: '(\w+)'/g)]
    eq([...new Set(faces.map(m => `${m[3]} ${m[2]}`))].sort(), spec.faces, `${c.name}: weights and styles (${fam})`)
    for (const m of faces) {
      const file = join('lib/fonts/files', m[1])
      ok(existsSync(file) && readFileSync(file).subarray(0, 4).toString('latin1') === 'wOF2', `${file} exists and is a woff2`)
    }
  }
}
eq(definedVars.length, new Set(definedVars).size, 'every subset variable is unique')

// ── 4. globals.css combines exactly the variables lib/fonts defines ───────────────────
const css = readFileSync('app/globals.css', 'utf8')
for (const [fam, spec] of Object.entries(FAMILIES)) {
  const stack = new RegExp(`${spec.varBase}:\\s*([^;]+);`).exec(css)?.[1] ?? ''
  const used = [...stack.matchAll(/var\((--[\w-]+)\)/g)].map(m => m[1])
  const defined = definedVars.filter(v => v.startsWith(spec.varBase + '-'))
  eq([...used].sort(), [...defined].sort(), `${spec.varBase} combines every ${fam} subset variable`)
  eq(used[used.length - 1], `${spec.varBase}-latin`, `${spec.varBase}: latin is the last web font in the stack`)
  ok(new RegExp(`'${fam} Fallback'`).test(stack), `${spec.varBase}: stack ends with the ${fam} fallback face`)
  ok(new RegExp(`@font-face \\{ font-family: '${fam} Fallback';`).test(css), `globals.css defines the ${fam} fallback face`)
}
ok(/export const fontVariables = \[/.test(fonts), 'fontVariables is exported')
eq((/export const fontVariables = \[([\s\S]*?)\]\.join/.exec(fonts)?.[1].match(/\.variable/g) ?? []).length, 11, 'fontVariables lists all 11 classes')

// ── 5. licenses shipped with the files ──────────────────────────────────────────────
for (const f of ['OFL-Manrope.txt', 'OFL-Fraunces.txt', 'OFL-DM-Mono.txt']) ok(existsSync(join('lib/fonts', f)), `${f} present`)
eq(readdirSync('lib/fonts/files').filter(f => f.endsWith('.woff2')).length, 14, '14 woff2 files')

console.log(`${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
