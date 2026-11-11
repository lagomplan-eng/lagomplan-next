/**
 * scripts/experiences/apply-links.ts
 *
 * Phase 2, step 3 of the Experiencias hub. Applies Elena's FINAL link table to
 * the guide files. Run only after she says the table is final.
 *
 *   npx tsx scripts/experiences/apply-links.ts --check          report, write nothing
 *   npx tsx scripts/experiences/apply-links.ts                  write
 *   npx tsx scripts/experiences/apply-links.ts --table <file>   default: links.xlsx (or a .csv)
 *
 * Reading links.xlsx needs python3 + openpyxl (see links-xlsx-to-json.py); point
 * XL_PYTHON at an interpreter that has it. Nothing is added to package.json.
 *
 * How each row's new_url is read:
 *   (blank)  status ok → normalize: write resolved_gyg_url (plain tour URL, no params, no locale)
 *            status review / no_gyg → no change
 *   keep     → resolved_gyg_url if present, otherwise no change
 *   remove   → affiliateUrl becomes ''
 *   a GYG tour URL → written as the plain tour URL (params + locale prefix stripped)
 *   any other URL (OpenTable, venue site, Stay22 …) → written as-is
 *
 * Matching is by experience `id`, never by position; both es.ts and en.ts get the
 * same value. REFUSES to write anything when any row is bad (a getyourguide.com
 * new_url that is not a tour page, an invalid URL, an unknown id, a guide file
 * edited since the table was generated) and lists every such row.
 *
 * Also rewrites the pinned Uruguay empties in tests/october-guides-registration.test.ts
 * so the pin reflects the final table. Idempotent: a second run changes nothing.
 */

import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { getAllFlatGuides } from '../../lib/data/guides/index'
import { normalizeGygTourUrl } from '../../lib/affiliate/gyg'

const ROOT = path.resolve(__dirname, '../..')
const GUIDES_DIR = path.join(ROOT, 'lib/data/guides')
const OCTOBER_TEST = path.join(ROOT, 'tests/october-guides-registration.test.ts')
const CHECK = process.argv.includes('--check')
const tableArg = process.argv.indexOf('--table')
const TABLE = path.resolve(tableArg > -1 ? process.argv[tableArg + 1] : path.join(__dirname, 'links.xlsx'))

const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

// ── table loading ──────────────────────────────────────────────────────────────

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = [], cell = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') inQ = false
      else cell += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = '' }
    else if (c !== '\r') cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  const [head, ...body] = rows
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])))
}

function loadTable(file: string): Record<string, string>[] {
  if (!fs.existsSync(file)) throw new Error(`table not found: ${file}`)
  if (/\.csv$/i.test(file)) return parseCsv(fs.readFileSync(file, 'utf8'))
  const python = process.env.XL_PYTHON || 'python3'
  try {
    const out = execFileSync(python, [path.join(__dirname, 'links-xlsx-to-json.py'), file], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
    return JSON.parse(out)
  } catch (e: any) {
    throw new Error(`could not read ${path.basename(file)} with "${python}" (needs openpyxl; set XL_PYTHON to an interpreter that has it).\n${e.stderr || e.message}`)
  }
}

// ── decisions ──────────────────────────────────────────────────────────────────

type Action = 'normalize' | 'keep' | 'remove' | 'new-gyg-tour' | 'other-url'
type Change = { target: string; action: Action }
type Decision = Change | { target: null } | { error: string }

const isGygHost = (h: string) => h === 'getyourguide.com' || h.endsWith('.getyourguide.com')

function decide(row: Record<string, string>): Decision {
  const nu = (row.new_url ?? '').trim()
  const low = nu.toLowerCase()
  const resolved = (row.resolved_gyg_url ?? '').trim()

  if (nu === '') {
    if (row.status !== 'ok') return { target: null }
    const n = normalizeGygTourUrl(resolved)
    return n ? { target: n, action: 'normalize' } : { error: `status is ok but resolved_gyg_url is not a GYG tour URL: ${resolved || '(blank)'}` }
  }
  if (low === 'keep') {
    if (!resolved) return { target: null }
    const n = normalizeGygTourUrl(resolved)
    return n ? { target: n, action: 'keep' } : { error: `"keep" resolves to a GYG page that is not a tour (-t<number>/): ${resolved}` }
  }
  if (low === 'remove') return { target: '', action: 'remove' }

  let u: URL
  try { u = new URL(nu) } catch { return { error: `new_url is not a valid URL: ${nu}` } }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return { error: `new_url must be http(s): ${nu}` }
  if (isGygHost(u.host.toLowerCase())) {
    const n = normalizeGygTourUrl(nu)
    return n ? { target: n, action: 'new-gyg-tour' } : { error: `new_url is on getyourguide.com but is not a tour page (-t<number>/ on www.getyourguide.com): ${nu}` }
  }
  return { target: nu, action: 'other-url' }
}

// ── guide-file edit: replace the affiliateUrl of the object whose id matches ───────

function applyToFile(file: string, targets: Map<string, string>): { text: string; changed: boolean; missing: string[] } {
  const src = fs.readFileSync(file, 'utf8')
  const lines = src.split('\n')
  const seen = new Set<string>()
  let currentId: string | null = null
  const out = lines.map(line => {
    const idm = line.match(/^ {6}id: '([^']+)',$/)
    if (idm) { currentId = idm[1]; return line }
    if (/^ {4}\},?$/.test(line)) { currentId = null; return line }
    if (currentId && /^ {6}affiliateUrl:/.test(line) && targets.has(currentId)) {
      seen.add(currentId)
      return `      affiliateUrl: ${q(targets.get(currentId)!)},`
    }
    return line
  })
  const text = out.join('\n')
  return { text, changed: text !== src, missing: [...targets.keys()].filter(id => !seen.has(id)) }
}

// ── main ──────────────────────────────────────────────────────────────────────

const table = loadTable(TABLE)
for (const col of ['id', 'current_url', 'status', 'resolved_gyg_url', 'new_url']) {
  if (!table.length || !(col in table[0])) throw new Error(`table has no "${col}" column`)
}

const es = getAllFlatGuides('es'), enMap = new Map(getAllFlatGuides('en').map(g => [g.canonical, g.flat]))
const byId = new Map<string, { guide: string; i: number; cur: string }>()
for (const { canonical, flat } of es) flat.experiences.forEach((e, i) => byId.set(e.id, { guide: canonical, i, cur: e.affiliateUrl }))

const problems: string[] = []
const targets = new Map<string, string>()          // id → final affiliateUrl (only ids that change)
const finalUrl = new Map<string, string>()         // id → final affiliateUrl for every id
const counts: Record<string, number> = {}
const changes: string[] = []
const seenRowIds = new Set<string>()

for (const row of table) {
  const id = row.id
  if (seenRowIds.has(id)) { problems.push(`${id}: appears twice in the table`); continue }
  seenRowIds.add(id)
  const hit = byId.get(id)
  if (!hit) { problems.push(`${id}: no experience with this id in the guide files`); continue }
  const d = decide(row)
  if ('error' in d) { problems.push(`${id} (${hit.guide}): ${d.error}`); continue }
  if (d.target === null) { finalUrl.set(id, hit.cur); counts['no change'] = (counts['no change'] ?? 0) + 1; continue }
  const change = d as Change

  // The guide file must still hold what the table was generated from (or already hold the result).
  if (hit.cur !== change.target && hit.cur !== (row.current_url ?? '')) {
    problems.push(`${id} (${hit.guide}): the guide file's affiliateUrl changed since the table was generated\n      table current_url: ${row.current_url}\n      file:              ${hit.cur}`)
    continue
  }
  finalUrl.set(id, change.target)
  if (hit.cur === change.target) { counts['already applied'] = (counts['already applied'] ?? 0) + 1; continue }
  targets.set(id, change.target)
  const label = change.action === 'normalize' && /stay22/.test(row.current_url ?? '') ? 'normalize (Stay22 → direct GYG)' : change.action
  counts[label] = (counts[label] ?? 0) + 1
  changes.push(`${id.padEnd(58)} ${label.padEnd(30)} ${hit.cur || '(empty)'}\n${' '.repeat(90)}→ ${change.target || '(empty)'}`)
}
for (const [id, v] of byId) if (!seenRowIds.has(id)) { finalUrl.set(id, v.cur); counts['not in table (untouched)'] = (counts['not in table (untouched)'] ?? 0) + 1 }

if (problems.length) {
  console.error(`\nREFUSING TO WRITE — ${problems.length} row(s) need fixing in the table:\n`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  console.error('\nNothing was written.')
  process.exit(1)
}

// ── per-file write plan (both locales, by id) ─────────────────────────────────────

const perGuide = new Map<string, Map<string, string>>()
for (const [id, t] of targets) {
  const g = byId.get(id)!.guide
  if (!perGuide.has(g)) perGuide.set(g, new Map())
  perGuide.get(g)!.set(id, t)
}
const pending: Array<{ file: string; text: string }> = []
for (const [guide, map] of perGuide) {
  for (const locale of ['es', 'en']) {
    const file = path.join(GUIDES_DIR, guide, `${locale}.ts`)
    const r = applyToFile(file, map)
    if (r.missing.length) throw new Error(`${file}: ids not found: ${r.missing.join(', ')}`)
    if (r.changed) pending.push({ file, text: r.text })
  }
}

// ── Uruguay pin ───────────────────────────────────────────────────────────────────

const uru = es.find(g => g.canonical === 'uruguay')!.flat
const uruEn = enMap.get('uruguay')!
const emptyIdx = uru.experiences.map((e, i) => (finalUrl.get(e.id) === '' ? i : -1)).filter(i => i >= 0)
const namesEs = emptyIdx.map(i => uru.experiences[i].name)
const namesEn = emptyIdx.map(i => uruEn.experiences[i].name)
const list = (a: string[]) => `[${a.map(q).join(', ')}]`
const BEGIN = '// <uruguay-pin:begin> generated by scripts/experiences/apply-links.ts from the final link table'
const END = '// <uruguay-pin:end>'
const pinBlock = [
  `    ${BEGIN}`,
  `    const expectedEmpty = locale === 'es'`,
  `      ? ${list(namesEs)}.sort()`,
  `      : ${list(namesEn)}.sort()`,
  `    expectEq(\`uruguay/\${locale}: exactly the known ${emptyIdx.length} ${emptyIdx.length === 1 ? 'experience remains' : 'experiences remain'} without a bookingUrl\`, emptyExpNames, expectedEmpty)`,
  `    ${END}`,
].join('\n')

let octo = fs.readFileSync(OCTOBER_TEST, 'utf8')
const octoOrig = octo
if (octo.includes(BEGIN)) {
  octo = octo.replace(new RegExp(`    ${BEGIN.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')}[\\s\\S]*?${END}`), pinBlock)
} else {
  const re = /    const expectedEmpty = locale === 'es'\n[\s\S]*?\.sort\(\)\n      : [\s\S]*?\.sort\(\)\n    expectEq\(`uruguay\/\$\{locale\}: exactly the known \d+ experiences? remains? without a bookingUrl`, emptyExpNames, expectedEmpty\)/
  if (!re.test(octo)) throw new Error('october-guides-registration.test.ts: cannot find the Uruguay pin to rewrite')
  octo = octo.replace(re, pinBlock)
  octo = octo.replace(
    '// Uruguay: intentionally incomplete — the ferry fix must hold, and the two\n// known-empty experiences must stay exactly those two (not grow silently,\n// which would mean a *new* gap shipped without anyone noticing).',
    '// Uruguay: intentionally incomplete — the ferry fix must hold, and the\n// known-empty experiences (pinned below to the final link table) must stay\n// exactly those (not grow silently, which would mean a *new* gap shipped\n// without anyone noticing).',
  )
}
if (octo !== octoOrig) pending.push({ file: OCTOBER_TEST, text: octo })

const ferryId = uru.experiences.find(e => /ferry/i.test(e.name))?.id
const warnings: string[] = []
if (ferryId && finalUrl.get(ferryId) === '') warnings.push(`the Uruguay ferry experience (${ferryId}) ends up with no link, but october-guides-registration.test.ts asserts it has a real bookingUrl — edit that assertion if this is intended`)

// ── report / write ─────────────────────────────────────────────────────────────

console.log(`\n${CHECK ? '[check] ' : ''}table: ${path.relative(ROOT, TABLE)} (${table.length} rows)`)
console.log('actions:'); for (const [k, v] of Object.entries(counts)) console.log(`  ${String(v).padStart(4)}  ${k}`)
if (changes.length) { console.log('\nchanges:'); for (const c of changes) console.log(`  ${c}`) }
console.log(`\nUruguay empties pinned (${emptyIdx.length}): ES ${JSON.stringify(namesEs)} | EN ${JSON.stringify(namesEn)}`)
for (const w of warnings) console.log(`\nWARNING: ${w}`)
console.log(`\n${pending.length} file(s) ${CHECK ? 'would change' : 'to write'}: ${pending.map(p => path.relative(ROOT, p.file)).join(', ') || '(none — already applied)'}`)
if (!CHECK) {
  for (const p of pending) fs.writeFileSync(p.file, p.text)
  console.log('written.')
}
