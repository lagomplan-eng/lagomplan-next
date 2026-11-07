/**
 * tests/seasonal-edition.test.ts — a guide's seasonal edition: active/expired in the destination's timezone,
 * band and day-column labels, Booking.com date params, and the Houston content rules (no dangling "Cuándo ir",
 * facts only, Black Friday hours in one place, retitle).
 *   npx tsx tests/seasonal-edition.test.ts
 */
import fs from 'node:fs'
import { guide as hEs } from '../lib/data/guides/houston/es'
import { guide as hEn } from '../lib/data/guides/houston/en'
import { guide as ixEs } from '../lib/data/guides/ixtapa-zihuatanejo/es'
import { adaptFlatGuide } from '../lib/data/guides/adapter'
import { bandLabel, dayColumns, seasonalState, todayIn, windowLabel, withBookingDates } from '../lib/data/guides/seasonal'
import { withRef } from '../lib/affiliate'

let failed = 0
const eq = (name: string, got: unknown, want: unknown) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { failed++; console.error(`FAIL ${name}\n   got:  ${JSON.stringify(got)}\n   want: ${JSON.stringify(want)}`) }
}
const ok = (name: string, cond: boolean, extra?: unknown) => { if (!cond) { failed++; console.error(`FAIL ${name}`, extra ?? '') } }

const SE = hEs.seasonalEdition!
const at = (iso: string) => new Date(iso)

// ── state, in the destination's timezone (America/Chicago, CST = UTC−6 in late November) ──
eq('Chicago: 23:59 on Nov 30 is still active', seasonalState(SE, at('2026-12-01T05:59:59Z')), 'active')
eq('Chicago: 00:00 on Dec 1 is expired', seasonalState(SE, at('2026-12-01T06:00:00Z')), 'expired')
eq('the timezone matters: 03:00Z Dec 1 is Nov 30 21:00 in Chicago, so still active', seasonalState(SE, at('2026-12-01T03:00:00Z')), 'active')
eq('well before the window: active (it has not passed)', seasonalState(SE, at('2026-10-30T18:00:00Z')), 'active')
eq('todayIn follows the given zone', [todayIn('America/Chicago', at('2026-12-01T03:00:00Z')), todayIn('UTC', at('2026-12-01T03:00:00Z'))], ['2026-11-30', '2026-12-01'])

// ── labels ──
eq('band (ES)', bandLabel(SE, 'es'), 'EDICIÓN THANKSGIVING 2026 — 25/30 NOV — VERIFICADO 23 OCT')
eq('band (EN)', bandLabel(hEn.seasonalEdition!, 'en'), 'THANKSGIVING 2026 EDITION — 25/30 NOV — VERIFIED 23 OCT')
eq('window across two months', windowLabel('2026-12-28', '2027-01-03', 'es'), '28 DIC/3 ENE')
const cols = dayColumns(SE, hEs.itinerary.map((d) => d.day), 'es')
eq('six columns, leading zeros, ids dia-01…dia-06', cols.map((c) => [c.label, c.id]), [['01', 'dia-01'], ['02', 'dia-02'], ['03', 'dia-03'], ['04', 'dia-04'], ['05', 'dia-05'], ['06', 'dia-06']])
eq('weekday + date per day', cols.map((c) => `${c.weekday} ${c.date}`), ['MIÉ 25 NOV', 'JUE 26 NOV', 'VIE 27 NOV', 'SÁB 28 NOV', 'DOM 29 NOV', 'LUN 30 NOV'])
eq('events per day (days 4 and 6 have none: empty, not invented)', cols.map((c) => c.events.length), [1, 2, 2, 0, 1, 0])
eq('English weekdays', dayColumns(hEn.seasonalEdition!, hEn.itinerary.map((d) => d.day), 'en').map((c) => c.weekday), ['WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON'])

// ── Booking.com dates ──
const U = 'https://www.booking.com/hotel/us/the-post-oak.html?ref=lagomplan'
eq('active: dates added', withBookingDates(U, SE.bookingDates, 'active'), 'https://www.booking.com/hotel/us/the-post-oak.html?ref=lagomplan&checkin=2026-11-25&checkout=2026-11-30')
eq('expired: dates removed', withBookingDates('https://www.booking.com/hotel/us/the-post-oak.html?checkin=2026-11-25&checkout=2026-11-30&ref=lagomplan', SE.bookingDates, 'expired'), U)
eq('active twice is the same (idempotent)', withBookingDates(withBookingDates(U, SE.bookingDates, 'active'), SE.bookingDates, 'active'), withBookingDates(U, SE.bookingDates, 'active'))
eq('other hosts are untouched', withBookingDates('https://www.getyourguide.com/x/?ref=lagomplan', SE.bookingDates, 'active'), 'https://www.getyourguide.com/x/?ref=lagomplan')
eq('no url stays no url', withBookingDates(undefined, SE.bookingDates, 'active'), undefined)

// ── the adapter ──
const active = adaptFlatGuide(hEs, at('2026-11-26T18:00:00Z'))
const expired = adaptFlatGuide(hEs, at('2026-12-01T18:00:00Z'))
eq('adapter: active state', active.seasonal?.state, 'active')
eq('adapter: expired state', expired.seasonal?.state, 'expired')
ok('active: every hotel link has the suggested dates and exactly one ref', active.hotels.items.every((h) => /checkin=2026-11-25&checkout=2026-11-30/.test(withRef(h.bookingUrl)) && (withRef(h.bookingUrl).match(/ref=lagomplan/g) ?? []).length === 1), active.hotels.items.map((h) => h.bookingUrl))
ok('expired: no hotel link has date params', expired.hotels.items.every((h) => !/checkin|checkout/.test(h.bookingUrl ?? '')), expired.hotels.items.map((h) => h.bookingUrl))
const plain = adaptFlatGuide(ixEs, at('2026-11-26T18:00:00Z'))
eq('a guide with no edition has no seasonal data', plain.seasonal, undefined)
eq('…and its hotel links are exactly the source urls (untouched)', plain.hotels.items.map((h) => h.bookingUrl), ixEs.hotels.map((h) => h.affiliateUrl))
eq('houston no longer has the old timely block', [hEs.timely, hEn.timely], [undefined, undefined])

// ── Houston content rules ──
for (const [name, g] of [['es', hEs], ['en', hEn]] as const) {
  const se = g.seasonalEdition!
  const itinText = JSON.stringify(g.itinerary) + JSON.stringify(g.tips) + JSON.stringify(g.transport) + JSON.stringify(g.checklist)
  ok(`${name}: no dangling "Cuándo ir" / "When to go" in the page`, !/cuándo ir|when to go/i.test(itinText), itinText.match(/.{30}(cuándo ir|when to go).{10}/i)?.[0])
  ok(`${name}: essentials are at most 4 (3 here)`, (se.essentials ?? []).length === 3)
  ok(`${name}: every dayEvent is on a real itinerary day and its date is windowStart + day − 1`, (se.dayEvents ?? []).every((e) => e.dayIndex >= 1 && e.dayIndex <= g.itinerary.length && cols[e.dayIndex - 1] && e.date === `2026-11-${24 + e.dayIndex}`))
  eq(`${name}: three season-long items`, se.seasonLong?.length, 3)
  const all = JSON.stringify(g)
  eq(`${name}: Black Friday hours (7:00 / 6:00 outlets) appear in one place only`, (all.match(/Houston Premium/g) ?? []).length, 1)
  ok(`${name}: the SEP calendar is in the essentials, not a table row`, (se.essentials ?? []).some((e) => /SEP/.test(e)))
  ok(`${name}: bookingDates are the window`, se.bookingDates?.checkin === se.windowStart && se.bookingDates?.checkout === se.windowEnd)
}
eq('essentials order (ES): visa, SEP, Thursday restaurants', (SE.essentials ?? []).map((e) => e.split(' ')[0]), ['Todos', 'Calendario', 'El'])
eq('retitle ES', hEs.hero.title, 'Houston en Thanksgiving con adolescentes')
eq('retitle EN', hEn.hero.title, 'Houston at Thanksgiving with Teens')
eq('adapter derives the headings from the new title', [adaptFlatGuide(hEs).planCta.title, adaptFlatGuide(hEn).planCta.title], ['¿Viajando a Houston en Thanksgiving con adolescentes?', 'Heading to Houston at Thanksgiving with Teens?'])
const cards = fs.readFileSync('lib/guides.ts', 'utf8')
ok('guide-card titles updated in lib/guides.ts (ES and EN)', cards.includes("title_es: 'Houston en Thanksgiving con adolescentes'") && cards.includes("title_en: 'Houston at Thanksgiving with Teens'"))
ok('slug is unchanged', hEs.slug === 'houston' && hEn.slug === 'houston' && cards.includes("slug_es: 'houston'") && cards.includes("slug_en: 'houston'"))

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('seasonal-edition: all passed')
