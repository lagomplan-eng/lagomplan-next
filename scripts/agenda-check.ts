// npm run agenda:check [-- --today YYYY-MM-DD] [--stale-days 14]
//
// Reads content/guia/cdmx/agenda.json (an invalid file fails with every
// problem listed) and reports what still needs a human:
//   - events still "to_verify" (and what Production would show today)
//   - verified events whose verification is older than --stale-days (default 14)
//   - "[placeholders]" left inside events
//   - months whose first 4 cards cover fewer than 3 categories
//   - more than one featured event in a month
// Exit 0 unless the file is invalid: these are warnings for the editor.

import { loadAgenda } from '../content/guia/agenda'
import { MIN_CATEGORIES, addMonths, categoriesInFirst, mexicoToday, monthName, monthPlans, visibleEvents, touchesMonth } from '../content/guia/agenda/logic'

const args = process.argv.slice(2)
const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined }
const today = opt('--today') ?? mexicoToday()
const staleDays = Number(opt('--stale-days') ?? 14)
if (!/^\d{4}-\d{2}-\d{2}$/.test(today) || !Number.isFinite(staleDays)) { console.error('usage: agenda:check [--today YYYY-MM-DD] [--stale-days N]'); process.exit(2) }

let agenda
try { agenda = loadAgenda() } catch (e) { console.error(`✖ ${(e as Error).message}`); process.exit(1) }

const days = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 864e5)
const PH = /\[[^\]\n]{1,80}\]/g
const live = agenda.events.filter((e) => e.end >= today)
const ended = agenda.events.filter((e) => e.end < today)

console.log(`agenda: ${agenda.events.length} events (${ended.length} already ended), ${agenda.dayTrips.length} day trips · today ${today} (America/Mexico_City)\n`)

const toVerify = live.filter((e) => e.status === 'to_verify')
console.log(`⏳ to_verify (${toVerify.length}) — Preview/local show these with the "Por confirmar" pill, Production hides them:`)
for (const e of toVerify) console.log(`   ${e.id.padEnd(28)} ${e.start}${e.end !== e.start ? ` → ${e.end}` : ''}${e.checkNote ? `\n      ↳ ${e.checkNote}` : ''}`)

const verified = live.filter((e) => e.status === 'verified')
console.log(`\n✔ verified (${verified.length}) — Production shows only these:`)
for (const e of verified) console.log(`   ${e.id.padEnd(28)} by ${e.verifiedBy} on ${e.verifiedAt}${e.checkNote ? `\n      ↳ ${e.checkNote}` : ''}`)

const stale = verified.filter((e) => days(e.verifiedAt!, today) > staleDays)
console.log(`\n${stale.length ? '⚠' : '✔'} verified more than ${staleDays} days ago: ${stale.length || 'none'}`)
for (const e of stale) console.log(`   ${e.id} (verified ${e.verifiedAt}, ${days(e.verifiedAt!, today)} days ago) — re-verify`)

const withPh = live.map((e) => ({ id: e.id, n: (JSON.stringify([e.title, e.place, e.why, e.hours, e.cost ?? '']).match(PH) ?? []).length })).filter((x) => x.n)
console.log(`\n⏳ "[placeholders]" still inside live events: ${withPh.reduce((s, x) => s + x.n, 0)} in ${withPh.length} events (ES and EN counted separately)`)
for (const x of withPh) console.log(`   ${x.id.padEnd(28)} ${x.n}`)
console.log(`   day trips without an official link: ${agenda.dayTrips.filter((t) => !t.url).length}/${agenda.dayTrips.length}`)

// Months to review: the current and next month, plus any month a live event touches.
const months = new Set<string>([today.slice(0, 7), addMonths(today.slice(0, 7), 1)])
for (const e of live) for (const ym of [e.start.slice(0, 7), e.end.slice(0, 7)]) months.add(ym)
console.log('\nmonth mix (first 4 compact cards must cover ≥ ' + MIN_CATEGORIES + ' categories):')
let warns = 0
for (const ym of [...months].sort()) {
  for (const [label, showUnverified] of [['Preview', true], ['Production', false]] as const) {
    const m = monthPlans(agenda, ym, today, showUnverified)
    if (!m.total) { console.log(`   ${ym} ${label.padEnd(10)} no plans`); continue }
    const first = m.compact.slice(0, 4)
    const n = categoriesInFirst(m.compact)
    const bad = m.compact.length >= MIN_CATEGORIES && n < MIN_CATEGORIES
    const tooFew = m.compact.length < MIN_CATEGORIES
    if (bad) warns++
    console.log(`   ${ym} ${label.padEnd(10)} ${m.total} plans (${m.featured ? 'featured + ' : ''}${m.compact.length} cards) · first ${first.length}: ${first.map((e) => e.category).join(', ') || '—'} → ${n} categories ${bad ? '⚠ below ' + MIN_CATEGORIES : tooFew ? '(too few cards to judge)' : '✔'}`)
  }
  const feats = visibleEvents(agenda.events, today, true).filter((e) => e.featured && touchesMonth(e, ym))
  if (feats.length > 1) { warns++; console.log(`   ⚠ ${ym}: ${feats.length} featured events (${feats.map((e) => e.id).join(', ')}) — only the first is featured`) }
}
console.log(`\n${warns ? `⚠ ${warns} warning(s)` : '✔ no mix warnings'} · current month ${monthName(today.slice(0, 7), 'es')}`)
