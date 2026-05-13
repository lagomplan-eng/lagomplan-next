#!/usr/bin/env node
/**
 * scripts/derive-archetypes.mjs
 *
 * One-shot pre-population pass for the Hotels-page revamp.
 *
 * Reads every hotel/stay object in:
 *   lib/data/guides/<slug>/{es,en}.ts        (FlatHotel records, `hotels: [...]`)
 *   lib/worldcup/data/<slug>.ts              (Stay records, `stays: [...]`)
 *
 * Derives a starting `archetypes` array from existing text fields using
 * conservative keyword rules. Inserts the field into each object literal
 * in-place. Records that already declare `archetypes:` are left alone.
 *
 * This is a STARTING POINT — the editorial team is expected to review the
 * resulting diff and override anything wrong. Once populated, the field
 * becomes the source of truth (this script never re-runs on data that has
 * archetypes set).
 *
 * Run with:
 *     node scripts/derive-archetypes.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// fileURLToPath decodes %20 → space etc. — directly using `.pathname` breaks
// when the project lives under a directory with a space in its name.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// ── Derivation rules ─────────────────────────────────────────────────────────
// Each rule fires on a regex match against the combined lowercased text of
// the record's prose fields. Keyword sets are conservative — favor false
// negatives over false positives, since the editorial pass will add tags
// but probably won't remove them.

const RULES = [
  {
    archetype: 'Familias',
    // Family signals — explicit family language, kids amenities, large rooms,
    // gardens (a key family marker in MX boutique-hotel copy).
    test: /familiar|familia |para familias|familias|niñ|kid|children|family|cuartos comunicantes|kit infantil|piscina (infantil|para niños)|jardín|amplia|habitaciones amplias|suite familiar/,
  },
  {
    archetype: 'Parejas',
    // Couples / adult-leaning signals — boutique, design hotel, rooftop, spa,
    // luxury, romance / "solo adultos" / "adults-only" language.
    test: /boutique|design hotel|rooftop|spa|romántic|romantic|solo adultos|adults?[-\s]?only|couples?|luxury|lujo|porfirian|porfiriana|st\.\s*regis|four seasons|ritz[-\s]carlton|the cape|las alcobas|four bedrooms with intimate|escapada en pareja/,
  },
  {
    archetype: 'Solo',
    // Solo / backpacker / coliving signals. Word-boundary `\bsolo\b` keeps
    // it from matching every casual use of "solo" (es: "sólo"). Hostels and
    // colivings are strong solo signals because they're priced + designed
    // around single travelers with common areas.
    test: /hostel|hostal|hostería|backpacker|mochiler|\bsolo travel|\bpara uno\b|individual room|coliving|co-living|capsule|cápsula|nómada(s)? digital|digital nomad|comunidad de viajer/,
  },
  {
    archetype: 'Negocios',
    // Business / corporate signals. Narrow on purpose — generic "downtown"
    // or "polanco" fires on too many leisure boutiques in the corpus.
    test: /\bbusiness (hotel|center|district|class|stay)|business cent|business[-\s]+ready|centro de negocios|ejecutiv|executive (suite|level|floor|lounge)|conference (room|center|facility)|conferenc(e|ia)s? para empresas|distrito financiero|corporate (stay|client|traveler)|para viajes de negocios|hilton garden|holiday inn|marriott courtyard|hyatt regency|hyatt place|sheraton|intercontinental|crowne plaza/,
  },
  {
    archetype: 'Aventura',
    // Outdoor / adventure activities — strong domain-specific verbs.
    test: /aventura|adventure|outdoor|trekking|hiking|senderismo|kayak|surf|rappel|escalada|climbing|jungla|selva|\bjungle\b|cenote|tirolesa|zipline|safari|expedici|ecoturismo|ecotourism|mountain bike|paddleboard|snorkel/,
  },
  {
    archetype: 'Bienestar',
    // Wellness signals. `\bspa\b` deliberately overlaps with the Parejas
    // rule — many spa hotels suit BOTH couples and wellness travelers,
    // and the catalog should reflect that overlap.
    test: /wellness|bienestar|\byoga\b|meditation|meditación|mindfulness|retreat|retiro|holistic|holístic|termal|thermal|aguas termales|hot springs|detox|ayurveda|temazcal|chakra|\bspa\b|sound bath|baño sonoro/,
  },
  {
    archetype: 'Workation',
    // Long-stay / remote-work signals. Requires explicit workation /
    // coworking / remote-work language — won't fire on a generic "good
    // wifi" boutique, which is most of the corpus.
    test: /workation|coworking|co-working|remote work|nómada(s)? digital|digital nomad|long[-\s]stay|estancia (larga|extendida)|extended stay|monthly stay|workspace|escritorio (cómodo|amplio|ergonomic|ergonómico)|fiber internet|fibra óptica/,
  },
  {
    archetype: 'Eco',
    // Sustainability signals. `\beco\b` word-boundary avoids matching
    // "economic" / "economía". `leed certified` and `b corp` catch
    // the credentialed sustainability-positioned properties.
    test: /\beco\b|ecológic|ecolodge|sustainable|sostenible|sustentable|orgánic|organic farm|permaculture|permacultura|carbon neutral|carbono neutral|net[-\s]zero|off[-\s]grid|fuera de la red|solar power|paneles solares|biofilico|biophilic|biofílic|leed certified|leed[-\s]gold|green hotel|reforestación|reforestation|b[-\s]?corp/,
  },
]

function deriveArchetypes(text) {
  const t = text.toLowerCase()
  const out = []
  for (const rule of RULES) {
    if (rule.test.test(t)) out.push(rule.archetype)
  }
  return out
}

// ── Object-literal parser ────────────────────────────────────────────────────
// Brace-counting walker that skips string contents (single/double/backtick)
// and escape sequences. Returns the index of the matching closing `}`.

function findObjectEnd(text, start) {
  let depth = 0
  let inString = null
  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (inString) {
      if (ch === '\\') { i++; continue }
      if (ch === inString) inString = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = ch; continue }
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

// ── Per-file processing ──────────────────────────────────────────────────────
//
// Strategy:
//   1. Locate the array start: `hotels: [` or `stays:[` (whitespace-flexible).
//   2. Walk past commas/whitespace; find the next `{`.
//   3. Find its matching `}`.
//   4. If the object already has `archetypes:`, skip.
//   5. Otherwise, derive from the object's full source text (cheap + catches
//      all prose fields without parsing).
//   6. Insert the new field just before the closing `}`. Preserves the
//      object's existing indentation style by sniffing what came just
//      before the close brace.

function processFile(filePath, arrayKey) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const arrayMarker = new RegExp(`\\b${arrayKey}\\s*:\\s*\\[`)
  const m = content.match(arrayMarker)
  if (!m) return { touched: 0, skipped: 0, file: filePath }

  let touched = 0
  let skipped = 0
  let i = m.index + m[0].length
  const out = [content.slice(0, i)]

  while (i < content.length) {
    // Skip whitespace and commas between objects
    while (i < content.length && /[\s,]/.test(content[i])) {
      out.push(content[i])
      i++
    }
    if (i >= content.length) break
    if (content[i] === ']') {
      out.push(content.slice(i))
      break
    }
    if (content[i] !== '{') {
      // Unexpected token — bail and emit the remainder as-is
      out.push(content.slice(i))
      break
    }

    const objStart = i
    const objEnd = findObjectEnd(content, i)
    if (objEnd === -1) {
      out.push(content.slice(i))
      break
    }
    const objText = content.slice(objStart, objEnd + 1)

    // Has an `archetypes: [...]` line already? Extend-mode: parse the
    // existing array, run derivation, take the union, and rewrite the
    // line in place. This lets the script add NEW archetype rules
    // (e.g. the 6 added later) to records that were tagged in an
    // earlier pass without re-deriving the original tags from scratch.
    const existingMatch = objText.match(/archetypes\s*:\s*\[([^\]]*)\]/)
    if (existingMatch) {
      const existing = existingMatch[1]
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
      const derived = deriveArchetypes(objText)
      const union = Array.from(new Set([...existing, ...derived]))

      // Same set → nothing to change; preserve the source byte-for-byte.
      if (union.length === existing.length &&
          union.every(a => existing.includes(a))) {
        out.push(objText)
        skipped++
        i = objEnd + 1
        continue
      }

      const newLine = `archetypes: [${union.map(a => `'${a}'`).join(', ')}]`
      const updated = objText.replace(/archetypes\s*:\s*\[[^\]]*\]/, newLine)
      out.push(updated)
      touched++
      i = objEnd + 1
      continue
    }

    const archetypes = deriveArchetypes(objText)
    const archetypeLiteral = `archetypes: [${archetypes.map(a => `'${a}'`).join(', ')}]`

    // Detect insertion style. Look at the character just before the closing
    // brace, skipping whitespace.
    let k = objEnd - 1
    while (k > objStart && /\s/.test(content[k])) k--
    const lastNonSpace = content[k]

    // Look at the chars between the last non-space and the closing brace to
    // pick up indentation.
    const tailIndent = content.slice(k + 1, objEnd) // whitespace before `}`
    const newlineInTail = tailIndent.includes('\n')

    let newObj
    if (newlineInTail) {
      // Multi-line object — preserve indentation. Use the indent of the
      // line that the closing brace sits on, plus 2 spaces for the new
      // field.
      const tailLines = tailIndent.split('\n')
      const closeIndent = tailLines[tailLines.length - 1] // indent before `}`
      const fieldIndent = closeIndent + '  '
      // If the previous non-space char isn't a comma, add one
      const needsComma = lastNonSpace !== ','
      // Build: before close brace, insert "<indent>archetypes: [...],\n"
      const before = content.slice(objStart, k + 1)
      newObj = `${before}${needsComma ? ',' : ''}\n${fieldIndent}${archetypeLiteral},${tailIndent}}`
    } else {
      // Single-line object — inline insertion.
      const needsComma = lastNonSpace !== ','
      newObj = `${content.slice(objStart, k + 1)}${needsComma ? ',' : ''} ${archetypeLiteral} }`
    }

    out.push(newObj)
    touched++
    i = objEnd + 1
  }

  fs.writeFileSync(filePath, out.join(''))
  return { touched, skipped, file: filePath }
}

// ── Discover targets ─────────────────────────────────────────────────────────

const guidesRoot = path.join(ROOT, 'lib/data/guides')
const worldcupRoot = path.join(ROOT, 'lib/worldcup/data')

const guideFiles = []
for (const slug of fs.readdirSync(guidesRoot)) {
  const dir = path.join(guidesRoot, slug)
  if (!fs.statSync(dir).isDirectory()) continue
  for (const lang of ['es', 'en']) {
    const f = path.join(dir, `${lang}.ts`)
    if (fs.existsSync(f)) guideFiles.push(f)
  }
}

const worldcupFiles = []
for (const f of fs.readdirSync(worldcupRoot)) {
  if (!f.endsWith('.ts')) continue
  worldcupFiles.push(path.join(worldcupRoot, f))
}

// ── Run ──────────────────────────────────────────────────────────────────────

let totalTouched = 0
let totalSkipped = 0
const log = []

for (const f of guideFiles) {
  const r = processFile(f, 'hotels')
  totalTouched += r.touched
  totalSkipped += r.skipped
  log.push(`hotels    ${r.touched.toString().padStart(2)} touched · ${r.skipped} skipped · ${path.relative(ROOT, f)}`)
}
for (const f of worldcupFiles) {
  const r = processFile(f, 'stays')
  totalTouched += r.touched
  totalSkipped += r.skipped
  log.push(`stays     ${r.touched.toString().padStart(2)} touched · ${r.skipped} skipped · ${path.relative(ROOT, f)}`)
}

console.log(log.join('\n'))
console.log(`\nTotal: ${totalTouched} records tagged · ${totalSkipped} skipped (already had archetypes).`)
