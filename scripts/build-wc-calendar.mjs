#!/usr/bin/env node
/**
 * scripts/build-wc-calendar.mjs
 *
 * Port the editorial match data from lib/worldcup/data/<city>.ts into a
 * flat server-side calendar that the Edge Fn can import without crossing
 * the Next.js / Deno runtime boundary.
 *
 * Output: supabase/functions/generate-trip/wc-2026-calendar.ts
 *
 * Source-of-truth lookup: lib/worldcup/data/*.ts. Each city file has a
 * `matches: [{ id, date, day, time, teams: [{name,flag},{name,flag}],
 * stadium, tag, highlight }]` array curated by the editorial team. This
 * script greps those arrays, dedupes by (date + stadium + teams), and
 * writes a flat TS array sorted by date.
 *
 * Run with:
 *     node scripts/build-wc-calendar.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC  = path.join(ROOT, 'lib/worldcup/data')
const OUT  = path.join(ROOT, 'supabase/functions/generate-trip/wc-2026-calendar.ts')

// Spanish 3-letter month → 2-digit number (zero-padded). FIFA 2026
// runs Jun–Jul, so only those two months actually occur, but we cover
// the rest defensively in case the editorial adds preseason content.
const MONTHS = {
  Ene: '01', Feb: '02', Mar: '03', Abr: '04', May: '05', Jun: '06',
  Jul: '07', Ago: '08', Sep: '09', Oct: '10', Nov: '11', Dic: '12',
}

/** "11 Jun" / "5 Jul" → "2026-06-11" / "2026-07-05". Empty on failure. */
function parseSpanishShortDate(s) {
  const m = s.match(/^(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóú]{3})\.?$/)
  if (!m) return ''
  const day  = m[1].padStart(2, '0')
  const mon  = MONTHS[m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase()]
  if (!mon) return ''
  return `2026-${mon}-${day}`
}

/** Slice the `matches: [ ... ]` array body out of a city file. */
function extractMatchesBlock(src) {
  const i = src.search(/matches\s*:\s*\[/)
  if (i < 0) return ''
  // Walk braces to find the matching ]. Crude but matches[] never contains [].
  let depth = 0
  let start = src.indexOf('[', i)
  for (let j = start; j < src.length; j++) {
    if (src[j] === '[') depth++
    else if (src[j] === ']') {
      depth--
      if (depth === 0) return src.slice(start + 1, j)
    }
  }
  return ''
}

/** Pull a quoted string value from an inline object snippet. */
function field(snippet, key) {
  const re = new RegExp(`${key}\\s*:\\s*"([^"]*)"`)
  const m = snippet.match(re)
  return m ? m[1] : ''
}

/** Extract both team names from `teams:[{name:"X",flag:"…"},{name:"Y",flag:"…"}]`. */
function parseTeams(snippet) {
  const matches = [...snippet.matchAll(/name\s*:\s*"([^"]+)"/g)]
  return matches.slice(0, 2).map(m => m[1])
}

/** Pull city + country from the top of a city file. */
function parseCityHeader(src) {
  return {
    city:    field(src, 'city'),
    country: field(src, 'country'),
  }
}

// ── Run ─────────────────────────────────────────────────────────────────────

const files = fs.readdirSync(SRC)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts' && !f.startsWith('.'))
  .map(f => path.join(SRC, f))

const seen     = new Set()
const calendar = []

for (const file of files) {
  const id = path.basename(file, '.ts')
  const src = fs.readFileSync(file, 'utf-8')
  const { city, country } = parseCityHeader(src)
  if (!city) continue

  const block = extractMatchesBlock(src)
  if (!block) continue

  // Match each inline `{ id:"m...", ... }` object. The block has one per line
  // by editorial convention; we still depth-walk for safety.
  for (const m of block.matchAll(/\{\s*id\s*:\s*"m\d+"[^}]+\}/g)) {
    const snip    = m[0]
    const dateRaw = field(snip, 'date')
    const day     = field(snip, 'day')
    const time    = field(snip, 'time')
    const stadium = field(snip, 'stadium')
    const tag     = field(snip, 'tag')
    const date    = parseSpanishShortDate(dateRaw)
    if (!date) continue
    const teams = parseTeams(snip)
    const teamsLabel = teams.join(' vs ')

    const dedupKey = `${date}|${stadium}|${teamsLabel}`
    if (seen.has(dedupKey)) continue
    seen.add(dedupKey)

    calendar.push({
      date, dateRaw, day, time,
      cityId:      id,
      cityDisplay: city,
      country,
      stadium,
      teams,
      teamsLabel,
      tag,
    })
  }
}

calendar.sort((a, b) => a.date.localeCompare(b.date))

// ── Emit ────────────────────────────────────────────────────────────────────

const header = `/**
 * supabase/functions/generate-trip/wc-2026-calendar.ts
 *
 * GENERATED FILE — do not edit by hand. Run \`node scripts/build-wc-calendar.mjs\`
 * to regenerate from lib/worldcup/data/<city>.ts (the editorial source of truth).
 *
 * Flat WC 2026 match calendar consumed by the Edge Fn to layer match
 * awareness into the trip-generation prompt. ${calendar.length} matches across
 * ${new Set(calendar.map(m => m.cityId)).size} host cities.
 */

export interface WcMatch {
  /** ISO date YYYY-MM-DD. */
  date:        string
  /** Editorial short form, e.g. "11 Jun". Kept for prompt readability. */
  dateRaw:     string
  /** Spanish 3-letter weekday, e.g. "Jue". */
  day:         string
  /** Local time + timezone, e.g. "14:00 CT". */
  time:        string
  /** City file ID (kebab-case), e.g. "cdmx", "miami". */
  cityId:      string
  /** Display city, e.g. "Ciudad de México". */
  cityDisplay: string
  country:     string
  stadium:     string
  /** Both team names; placeholders ("Por definir") for elimination rounds. */
  teams:       string[]
  /** Convenience: \`\${teams[0]} vs \${teams[1]}\`. */
  teamsLabel:  string
  /** Editorial tag — group letter, round label, or storyline. */
  tag:         string
}

export const WC_2026_CALENDAR: WcMatch[] = ${JSON.stringify(calendar, null, 2)}

/** Substring-match hints for resolving free-form user destinations to host cityIds. */
export const WC_HOST_CITY_HINTS: Record<string, string[]> = {
${[...new Set(calendar.map(m => m.cityId))].sort().map(id => {
  const display = calendar.find(m => m.cityId === id).cityDisplay
  // Default hint set: the cityId itself + display name. Editor can add more
  // by editing this map after generation (kept out of the autoregen flow).
  const hints = new Set([id, display.toLowerCase()])
  // Common variants
  if (id === 'cdmx')        ['mexico city', 'ciudad de mexico'].forEach(h => hints.add(h))
  if (id === 'new-york')    ['nyc', 'new york', 'nueva york', 'manhattan', 'brooklyn'].forEach(h => hints.add(h))
  if (id === 'los-angeles') ['la', 'los angeles', 'hollywood'].forEach(h => hints.add(h))
  if (id === 'san-francisco') ['sf', 'san francisco', 'bay area'].forEach(h => hints.add(h))
  return `  ${JSON.stringify(id)}: ${JSON.stringify([...hints])},`
}).join('\n')}
}
`

fs.writeFileSync(OUT, header)
console.log(`✓ Wrote ${calendar.length} matches across ${new Set(calendar.map(m => m.cityId)).size} host cities → ${path.relative(ROOT, OUT)}`)
