/**
 * scripts/experiences/apply-review.ts
 *
 * Phase 1b of the Experiencias hub. Writes the APPROVED review CSVs into code:
 *
 *   review.csv        → `id`, `category`, `duration` on every experience in
 *                       lib/data/guides/<guide>/{es,en}.ts (same values in both)
 *   guides-review.csv → the GUIDE_META block in lib/data/guides/index.ts
 *                       (region, short names, and the optional hub_window_from / hub_window_until
 *                       columns, MM-DD, which become GuideMeta.hubWindow)
 *
 * Line-based on purpose: every guide file has the same shape
 * (`  experiences: [` / 4-space `{` objects / 6-space props), and the script
 * refuses to write if a file deviates or if an experience's name differs from
 * the CSV (guards against index drift). Idempotent: re-running replaces the
 * id/category/duration lines instead of duplicating them.
 *
 * Run:   npx tsx scripts/experiences/apply-review.ts          (writes)
 *        npx tsx scripts/experiences/apply-review.ts --check  (reports, writes nothing)
 */

import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '../..')
const GUIDES_DIR = path.join(ROOT, 'lib/data/guides')
const CHECK = process.argv.includes('--check')

const CATEGORIES = ['comida', 'cultura', 'naturaleza', 'aventura', 'excursion', 'bienestar']
const DURATIONS = ['corto', 'medio', 'completo']
const REGIONS = ['mexico', 'latam', 'norteamerica', 'europa', 'asia', 'africa', 'oceania']
const MMDD = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

// ── CSV (RFC 4180: quoted cells, "" escapes, newlines inside quotes) ────────────

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = [], cell = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') q = false
      else cell += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = '' }
    else if (c !== '\r') cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  const [head, ...body] = rows
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])))
}

const readCsv = (name: string) => parseCsv(fs.readFileSync(path.join(__dirname, name), 'utf8'))
const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

// ── per-file transform ───────────────────────────────────────────────────────

type Entry = { id: string; category: string; duration: string; name: string }

/** Pull the string value of a `name:` line (single, double or backtick quoted). */
function readName(line: string): string | null {
  const m = line.match(/^\s+name:\s*(['"`])((?:\\.|(?!\1).)*)\1,?\s*$/)
  return m ? m[2].replace(/\\(['"`\\])/g, '$1') : null
}

function transform(file: string, entries: Entry[]): { text: string; changed: boolean } {
  const src = fs.readFileSync(file, 'utf8')
  const lines = src.split('\n')
  const start = lines.findIndex(l => l === '  experiences: [')
  if (start < 0) throw new Error(`${file}: no "  experiences: [" line`)
  let end = -1
  for (let i = start + 1; i < lines.length; i++) if (lines[i] === '  ],') { end = i; break }
  if (end < 0) throw new Error(`${file}: experiences array never closes`)

  const out: string[] = lines.slice(0, start + 1)
  let idx = -1
  let i = start + 1
  while (i < end) {
    if (lines[i] !== '    {') throw new Error(`${file}:${i + 1}: expected "    {", got ${JSON.stringify(lines[i])}`)
    let j = i + 1
    while (j < end && !/^    \},?$/.test(lines[j])) j++
    if (j >= end) throw new Error(`${file}:${i + 1}: experience object never closes`)
    const block = lines.slice(i + 1, j)
    idx++
    const entry = entries[idx]
    if (!entry) throw new Error(`${file}: more experiences in file than CSV rows (index ${idx})`)

    const nameLine = block.find(l => /^\s{6}name:/.test(l))
    const name = nameLine ? readName(nameLine) : null
    if (name !== entry.name) {
      throw new Error(`${file}: experience #${idx} name ${JSON.stringify(name)} does not match CSV ${JSON.stringify(entry.name)}`)
    }

    // drop any previous run's lines, then re-insert
    const kept = block.filter(l => !/^ {6}(id|category|duration):/.test(l))
    const tagsAt = kept.findIndex(l => /^ {6}tags:/.test(l))
    if (tagsAt < 0 || !/\],?\s*$/.test(kept[tagsAt])) {
      throw new Error(`${file}: experience #${idx}: expected a single-line "tags: [...]"`)
    }
    const extra: string[] = []
    if (entry.category) extra.push(`      category: ${q(entry.category)},`)
    if (entry.duration) extra.push(`      duration: ${q(entry.duration)},`)
    const next = [`      id: ${q(entry.id)},`, ...kept.slice(0, tagsAt + 1), ...extra, ...kept.slice(tagsAt + 1)]
    out.push('    {', ...next, lines[j])
    i = j + 1
  }
  if (idx + 1 !== entries.length) {
    throw new Error(`${file}: ${idx + 1} experiences in file, ${entries.length} rows in CSV`)
  }
  out.push(...lines.slice(end))
  const text = out.join('\n')
  return { text, changed: text !== src }
}

// ── review.csv → guide files ─────────────────────────────────────────────────

const review = readCsv('review.csv')
const byGuide = new Map<string, Array<Record<string, string>>>()
for (const r of review) {
  if (!byGuide.has(r.guide)) byGuide.set(r.guide, [])
  byGuide.get(r.guide)![Number(r.index)] = r
}

const seenIds = new Set<string>()
for (const r of review) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.proposed_id)) throw new Error(`bad id (not kebab-case): ${r.proposed_id}`)
  if (seenIds.has(r.proposed_id)) throw new Error(`duplicate id in CSV: ${r.proposed_id}`)
  seenIds.add(r.proposed_id)
  if (r.proposed_category && !CATEGORIES.includes(r.proposed_category)) throw new Error(`${r.proposed_id}: bad category ${r.proposed_category}`)
  if (r.proposed_duration && !DURATIONS.includes(r.proposed_duration)) throw new Error(`${r.proposed_id}: bad duration ${r.proposed_duration}`)
}

let filesChanged = 0, filesTotal = 0
const pending: Array<{ file: string; text: string }> = []
for (const [guide, rows] of byGuide) {
  for (const locale of ['es', 'en'] as const) {
    const file = path.join(GUIDES_DIR, guide, `${locale}.ts`)
    const entries: Entry[] = rows.map(r => ({
      id: r.proposed_id, category: r.proposed_category, duration: r.proposed_duration,
      name: locale === 'es' ? r.es_name : r.en_name,
    }))
    const { text, changed } = transform(file, entries)
    filesTotal++
    if (changed) { filesChanged++; pending.push({ file, text }) }
  }
}

// ── guides-review.csv → GUIDE_META block in index.ts ─────────────────────────

const BEGIN = '// <guide-meta:begin> generated by scripts/experiences/apply-review.ts from guides-review.csv'
const END = '// <guide-meta:end>'
const guides = readCsv('guides-review.csv')
const metaLines = [
  BEGIN,
  '// Region + short names live here, not in the guide files. Keys = registry keys.',
  'export const GUIDE_META: Record<string, GuideMeta> = {',
]
for (const g of guides) {
  if (!REGIONS.includes(g.proposed_region)) throw new Error(`${g.guide}: bad region ${JSON.stringify(g.proposed_region)}`)
  if (!g.proposed_shortName_es || !g.proposed_shortName_en) throw new Error(`${g.guide}: missing shortName`)
  const from = (g.hub_window_from ?? '').trim(), until = (g.hub_window_until ?? '').trim()
  if (Boolean(from) !== Boolean(until)) throw new Error(`${g.guide}: hub_window_from and hub_window_until must both be set or both be empty`)
  if (from && !(MMDD.test(from) && MMDD.test(until))) throw new Error(`${g.guide}: hub window must be MM-DD, got ${JSON.stringify(from)}..${JSON.stringify(until)}`)
  const win = from ? `, hubWindow: { from: ${q(from)}, until: ${q(until)} }` : ''
  metaLines.push(`  ${q(g.guide)}: { region: ${q(g.proposed_region)}, shortName: { es: ${q(g.proposed_shortName_es)}, en: ${q(g.proposed_shortName_en)} }${win} },`)
}
metaLines.push('}', END)
const metaBlock = metaLines.join('\n')

const indexFile = path.join(GUIDES_DIR, 'index.ts')
let indexSrc = fs.readFileSync(indexFile, 'utf8')
const b = indexSrc.indexOf(BEGIN), e = indexSrc.indexOf(END)
if (b >= 0 && e > b) {
  indexSrc = indexSrc.slice(0, b) + metaBlock + indexSrc.slice(e + END.length)
} else {
  const anchor = '// ── Public helpers'
  if (!indexSrc.includes(anchor)) throw new Error('index.ts: cannot find the "Public helpers" anchor')
  indexSrc = indexSrc.replace(anchor, `${metaBlock}\n\n${anchor}`)
}
if (!/import type \{[^}]*GuideMeta[^}]*\} from '\.\/types'/.test(indexSrc)) {
  indexSrc = indexSrc.replace("import type { FlatGuide, GuidePageData } from './types'", "import type { FlatGuide, GuidePageData, GuideMeta } from './types'")
}
const indexChanged = indexSrc !== fs.readFileSync(indexFile, 'utf8')

// ── write ────────────────────────────────────────────────────────────────────

console.log(`${CHECK ? '[check] ' : ''}guide files: ${filesChanged}/${filesTotal} would change; index.ts GUIDE_META: ${indexChanged ? 'would change' : 'up to date'}; experiences: ${review.length}`)
if (!CHECK) {
  for (const p of pending) fs.writeFileSync(p.file, p.text)
  if (indexChanged) fs.writeFileSync(indexFile, indexSrc)
  console.log('written.')
}
