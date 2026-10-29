// npm run agenda:check [-- --today YYYY-MM-DD] [--stale-days 14] [--weeks 6]
//
// Reads content/guia/cdmx/agenda.json (an invalid file fails with every problem listed)
// and reports what still needs a human:
//   - events still "to_verify" (Preview/local on /demo show them with a "Por confirmar"
//     pill; Production never does) and the QA note of each
//   - verified events whose verification is older than --stale-days (default 14)
//   - events without an official link (their row is not a link)
//   - any "[placeholder]" left in a string (none should be: unknown values are omitted)
//   - the recurring items and which of them never appear in the calendar (no weekdays)
//   - week by week (Mon–Sun) for the next --weeks weeks: how many dated events a guest
//     would see on Preview vs Production, so verification can start with the quiet weeks
// Exit 0 unless the file is invalid: these are warnings for the editor.

import { loadAgenda } from '../content/guia/agenda'
import { addDays, daysBetween, formatRange, mexicoToday, rowsForRange, splitRanges, visibleEvents, weekdayOf } from '../content/guia/agenda/logic'

const args = process.argv.slice(2)
const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined }
const today = opt('--today') ?? mexicoToday()
const staleDays = Number(opt('--stale-days') ?? 14)
const weeks = Number(opt('--weeks') ?? 6)
if (!/^\d{4}-\d{2}-\d{2}$/.test(today) || !Number.isFinite(staleDays) || !Number.isFinite(weeks)) {
  console.error('usage: agenda:check [--today YYYY-MM-DD] [--stale-days N] [--weeks N]'); process.exit(2)
}

let agenda
try { agenda = loadAgenda() } catch (e) { console.error(`✖ ${(e as Error).message}`); process.exit(1) }

const live = agenda.events.filter((e) => e.end >= today)
console.log(`agenda: ${agenda.events.length} events (${agenda.events.length - live.length} already ended), ${agenda.recurring.length} recurring, ${agenda.dayTrips.length} day trips · today ${today} (America/Mexico_City)\n`)

const toVerify = live.filter((e) => e.status === 'to_verify')
console.log(`⏳ to_verify (${toVerify.length}): Production hides these; /demo Preview shows them with the "Por confirmar" pill`)
for (const e of toVerify) console.log(`   ${e.id.padEnd(28)} ${e.start}${e.end !== e.start ? ` → ${e.end}` : ''}${e.featured ? '  ★ featured' : ''}${e.checkNote ? `\n      ↳ ${e.checkNote}` : ''}`)

const verified = live.filter((e) => e.status === 'verified')
console.log(`\n✔ verified (${verified.length}): the only dated events Production shows`)
for (const e of verified) console.log(`   ${e.id.padEnd(28)} by ${e.verifiedBy} on ${e.verifiedAt}${e.checkNote ? `\n      ↳ ${e.checkNote}` : ''}`)

const stale = verified.filter((e) => daysBetween(e.verifiedAt!, today) > staleDays)
console.log(`\n${stale.length ? '⚠' : '✔'} verified more than ${staleDays} days ago: ${stale.length || 'none'}`)
for (const e of stale) console.log(`   ${e.id} (verified ${e.verifiedAt}, ${daysBetween(e.verifiedAt!, today)} days ago) — re-verify`)

const noUrl = live.filter((e) => !e.url)
console.log(`\n${noUrl.length ? '⚠' : '✔'} live events with no official link (the row is not tappable): ${noUrl.length || 'none'}`)
for (const e of noUrl) console.log(`   ${e.id}`)

const ph: string[] = []
const walk = (v: unknown, path: string) => {
  if (typeof v === 'string') { if (/\[[^\]]{1,80}\]/.test(v)) ph.push(`${path}: ${v}`) }
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`))
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k)
}
walk(agenda, '')
console.log(`\n${ph.length ? '⚠' : '✔'} "[placeholders]" left in any string: ${ph.length || 'none'}`)
for (const s of ph.slice(0, 8)) console.log(`   ${s.slice(0, 100)}`)

console.log(`\nrecurring (shown in Production as published copy; not individually verified):`)
for (const r of agenda.recurring) {
  console.log(`   ${r.id.padEnd(32)} ${r.weekdays.length ? `weekdays ${r.weekdays.join(',')}` : 'no weekdays: never shown in the calendar'}${r.time ? `  time "${r.time.es}"` : ''}`)
}
console.log(`   day trips without an official link: ${agenda.dayTrips.filter((t) => !t.url).length}/${agenda.dayTrips.length} (they are never links)`)

// Week by week from the Monday of this week.
const monday = addDays(today, -((weekdayOf(today) + 6) % 7))
console.log(`\nnext ${weeks} calendar weeks: dated events + weekly occurrences a guest would see (range chips use these weeks)`)
for (let w = 0; w < weeks; w++) {
  const start = addDays(monday, 7 * w)
  const range = { start: w === 0 && start < today ? today : start, end: addDays(start, 6) }
  const win = { start: range.start, end: range.end }
  const count = (showUnverified: boolean) => rowsForRange(agenda, range, { lang: 'es', today, showUnverified, window: win })
  const prev = count(true), prod = count(false)
  const ev = (rows: ReturnType<typeof count>) => rows.filter((r) => r.kind === 'event').length
  const rec = prod.filter((r) => r.kind === 'recurring').length
  const quiet = ev(prod) === 0
  console.log(`   ${formatRange(range, 'es').padEnd(18)} Preview ${String(ev(prev)).padStart(2)} events · Production ${String(ev(prod)).padStart(2)} events + ${rec} weekly${quiet ? '   ⚠ no verified event: Production shows only the weekly things' : ''}`)
}
const featured = live.filter((e) => e.featured)
console.log(`\nfeatured events (the first one by date inside a stay gets "lo más grande de tu estancia"): ${featured.map((e) => e.id).join(', ') || 'none'}`)
