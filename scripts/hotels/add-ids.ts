/**
 * scripts/hotels/add-ids.ts
 *
 * Writes a stable `id` on every hotel record, in both locales:
 *
 *   lib/data/guides/<guide>/{es,en}.ts   `hotels: [ { id: '…', name: … } ]`
 *   lib/worldcup/data/<city>.ts          `stays:[ { id:"…", name:"…", … } ]`  (es + en blocks)
 *
 * The id is the slug of the SPANISH name; the English record at the same position
 * gets the same id (hotel order is the same in both locales). Line-based like
 * scripts/experiences/apply-review.ts: it refuses to write if a file deviates from
 * the expected shape, if ES and EN have different hotel counts, or if two hotels
 * get the same id. Idempotent: re-running replaces the id line instead of duplicating.
 * The only reformatting it does is splitting a `    },{` line (one in guanacaste).
 *
 * Positions whose ES and EN names differ are reported, never "fixed".
 *
 * Run:   npx tsx scripts/hotels/add-ids.ts          (writes)
 *        npx tsx scripts/hotels/add-ids.ts --check  (reports, writes nothing)
 */

import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '../..')
const GUIDES_DIR = path.join(ROOT, 'lib/data/guides')
const WC_DIR = path.join(ROOT, 'lib/worldcup/data')
const CHECK = process.argv.includes('--check')

import { slugifyHotelName } from '../../lib/hotels-catalog'

const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

function readName(line: string): string | null {
  const m = line.match(/^\s+name:\s*(['"`])((?:\\.|(?!\1).)*)\1,?\s*$/)
  return m ? m[2].replace(/\\(['"`\\])/g, '$1') : null
}

// ── guides ──────────────────────────────────────────────────────────────────

interface Block { lines: string[]; start: number; end: number; objects: Array<{ from: number; to: number; name: string }> }

function parseGuide(file: string): Block {
  let lines = fs.readFileSync(file, 'utf8').split('\n')
  lines = lines.flatMap(l => (l === '    },{' ? ['    },', '    {'] : [l]))
  const start = lines.findIndex(l => l === '  hotels: [')
  if (start < 0) throw new Error(`${file}: no "  hotels: [" line`)
  const end = lines.findIndex((l, i) => i > start && l === '  ],')
  if (end < 0) throw new Error(`${file}: hotels array never closes`)
  const objects: Block['objects'] = []
  let i = start + 1
  while (i < end) {
    if (lines[i] !== '    {') throw new Error(`${file}:${i + 1}: expected "    {", got ${JSON.stringify(lines[i])}`)
    let j = i + 1
    while (j < end && !/^    \},?$/.test(lines[j])) j++
    if (j >= end + 0 && !/^    \},?$/.test(lines[j] ?? '')) throw new Error(`${file}:${i + 1}: hotel object never closes`)
    const names = lines.slice(i + 1, j).map(readName).filter((n): n is string => n !== null)
    if (names.length !== 1) throw new Error(`${file}:${i + 1}: expected exactly one name: line, found ${names.length}`)
    objects.push({ from: i, to: j, name: names[0] })
    i = j + 1
  }
  return { lines, start, end, objects }
}

function writeGuide(file: string, b: Block, ids: string[]): string {
  const out: string[] = []
  let o = 0
  for (let i = 0; i < b.lines.length; i++) {
    const l = b.lines[i]
    const obj = b.objects[o]
    if (obj && i === obj.from) { out.push(l, `      id: ${q(ids[o])},`); continue }
    if (obj && i > obj.from && i < obj.to && /^      id:\s/.test(l)) continue // replaced above
    if (obj && i === obj.to) o++
    out.push(l)
  }
  return out.join('\n')
}

// ── world cup ───────────────────────────────────────────────────────────────

interface WcStay { line: number; name: string }

/** Per `stays:[` block (es then en) in a city file: the stay lines. */
function parseWc(file: string): { lines: string[]; blocks: WcStay[][] } {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  const blocks: WcStay[][] = []
  for (let i = 0; i < lines.length; i++) {
    if (!/^  stays: ?\[/.test(lines[i])) continue
    const stays: WcStay[] = []
    let j = i + 1
    while (j < lines.length && !/^  \],?$/.test(lines[j])) {
      const l = lines[j]
      const m = l.match(/^    \{ (?:id:"[^"]*", )?name:"((?:\\.|[^"\\])*)"/)
      if (m) stays.push({ line: j, name: m[1].replace(/\\"/g, '"') })
      else if (l.trim() && !l.trim().startsWith('//')) throw new Error(`${file}:${j + 1}: unexpected line in stays: ${l.slice(0, 60)}`)
      j++
    }
    if (j >= lines.length) throw new Error(`${file}: stays block never closes`)
    blocks.push(stays)
  }
  return { lines, blocks }
}

// ── run ─────────────────────────────────────────────────────────────────────

const ids = new Map<string, string>() // id → where
const mismatches: string[] = []
const writes: Array<{ file: string; text: string }> = []
let total = 0

function claim(id: string, where: string) {
  if (!id) throw new Error(`${where}: empty slug`)
  const prev = ids.get(id)
  if (prev) throw new Error(`duplicate hotel id "${id}": ${prev} and ${where}`)
  ids.set(id, where)
}

for (const guide of fs.readdirSync(GUIDES_DIR).sort()) {
  const es = path.join(GUIDES_DIR, guide, 'es.ts'), en = path.join(GUIDES_DIR, guide, 'en.ts')
  if (!fs.existsSync(es) || !fs.existsSync(en)) continue
  const a = parseGuide(es), b = parseGuide(en)
  if (a.objects.length !== b.objects.length) throw new Error(`${guide}: ${a.objects.length} hotels in es, ${b.objects.length} in en`)
  const list = a.objects.map(o => slugifyHotelName(o.name))
  list.forEach((id, i) => { claim(id, `${guide}[${i}]`); total++ })
  a.objects.forEach((o, i) => { if (o.name !== b.objects[i].name) mismatches.push(`${guide}[${i}]: es "${o.name}" | en "${b.objects[i].name}"`) })
  writes.push({ file: es, text: writeGuide(es, a, list) }, { file: en, text: writeGuide(en, b, list) })
}

for (const f of fs.readdirSync(WC_DIR).sort()) {
  if (!f.endsWith('.ts') || f === 'index.ts') continue
  const file = path.join(WC_DIR, f), city = f.replace(/\.ts$/, '')
  const { lines, blocks } = parseWc(file)
  if (blocks.length === 0) continue
  if (blocks.length !== 2) throw new Error(`${f}: expected 2 stays blocks (es, en), found ${blocks.length}`)
  if (blocks[0].length !== blocks[1].length) throw new Error(`${f}: ${blocks[0].length} stays in es, ${blocks[1].length} in en`)
  const list = blocks[0].map(s => slugifyHotelName(s.name))
  list.forEach((id, i) => { claim(id, `wc:${city}[${i}]`); total++ })
  blocks[0].forEach((s, i) => { if (s.name !== blocks[1][i].name) mismatches.push(`wc:${city}[${i}]: es "${s.name}" | en "${blocks[1][i].name}"`) })
  const out = [...lines]
  blocks.forEach(blk => blk.forEach((s, i) => {
    out[s.line] = out[s.line].replace(/^    \{ (?:id:"[^"]*", )?name:/, `    { id:"${list[i]}", name:`)
  }))
  writes.push({ file, text: out.join('\n') })
}

let changed = 0
for (const w of writes) {
  if (fs.readFileSync(w.file, 'utf8') === w.text) continue
  changed++
  if (!CHECK) fs.writeFileSync(w.file, w.text)
}
console.log(`${total} hotels, ${ids.size} unique ids, ${changed} files ${CHECK ? 'would change' : 'written'}`)
console.log(`ES/EN names differ at ${mismatches.length} positions:`)
mismatches.forEach(m => console.log('  ' + m))
