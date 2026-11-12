/**
 * tests/catalog-analytics.test.ts — run: npx tsx tests/catalog-analytics.test.ts
 *
 * GA4 contract of the catalog pages (Experiencias hub, Hoteles, shared plan): every event's exact
 * parameter set, where a booking click happened (`section`), the renames, and that
 * docs/analytics/mxcity-pilot-taxonomy.md documents every event, parameter and section value.
 * Change the contract here, in lib/experiences/analytics.ts / lib/catalog-analytics.ts, and in the doc together.
 */
import { readFileSync } from 'fs'
import { getExperiences } from '../lib/experiences'
import { getPlanCatalog } from '../lib/plan-catalog'
import { getAllHotels } from '../lib/hotels'
import { trackBookClick, trackFilterChange, trackGuideClick, trackListView } from '../lib/experiences/analytics'
import { trackHotelBook, trackHotelFilter, trackPlanBook, trackPlanChange, trackPlanHandoff } from '../lib/catalog-analytics'
import { parseFilters } from '../lib/experiences/filters'
import { EMPTY_HOTEL_FILTERS } from '../lib/hotels-catalog'

let pass = 0, fail = 0
function eq(a: unknown, b: unknown, msg: string) {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++
  else { fail++; console.error(`FAIL ${msg}\n  got      ${JSON.stringify(a)}\n  expected ${JSON.stringify(b)}`) }
}
const ok = (c: boolean, msg: string) => eq(c, true, msg)

type Sent = [string, string, Record<string, unknown>]
const sent: Sent[] = []
;(globalThis as any).window = { gtag: (...a: any[]) => sent.push(a as Sent) }
const last = (name: string) => sent.filter(s => s[1] === name).pop()![2]
const keys = (o: Record<string, unknown>) => Object.keys(o).sort()

// ── fixtures ───────────────────────────────────────────────────────────────────────
const exp = getExperiences('es', { ignoreWindow: true })[0]
const hotel = getAllHotels('es').find(h => h.bookingUrl)!
const catalog = getPlanCatalog('es')
const planExp = catalog.find(e => e.type === 'experience' && e.bookingUrl)!
const planHotel = catalog.find(e => e.type === 'hotel' && e.bookingUrl)!
ok(!!exp && !!hotel && !!planExp && !!planHotel, 'fixtures found')

// ── 1. exact parameter sets ──────────────────────────────────────────────────────────
trackListView('es', 88)
eq(keys(last('experience_list_view')), ['experiences_total', 'lang'], 'experience_list_view params')

const base = parseFilters(new URLSearchParams(''))
trackFilterChange('es', base, parseFilters(new URLSearchParams('region=europa')), 9)
eq(keys(last('experience_filter')), ['filter_group', 'filter_value', 'lang', 'results_count'], 'experience_filter params')

trackGuideClick(exp, 3, 'es')
eq(keys(last('experience_guide_click')), ['destination_slug', 'experience_id', 'lang', 'position'], 'experience_guide_click params')

trackHotelFilter('es', EMPTY_HOTEL_FILTERS, { destino: 'ciudad-de-mexico', price: null, viajero: null }, 12)
eq(keys(last('hotel_filter')), ['filter_group', 'filter_value', 'lang', 'results_count'], 'hotel_filter params (same count name as experience_filter)')

trackPlanChange('add', { type: 'experience', id: exp.id, destinationSlug: exp.destinationSlug }, 3, 'es')
eq(keys(last('plan_add')), ['destination_slug', 'item_type', 'lang', 'plan_item_id', 'plan_size'], 'plan_add params')
trackPlanChange('remove', { type: 'hotel', id: hotel.id, destinationSlug: hotel.destinationKey }, 2, 'es')
eq(keys(last('plan_remove')), ['destination_slug', 'item_type', 'lang', 'plan_item_id', 'plan_size'], 'plan_remove params')
eq([last('plan_remove').item_type, last('plan_remove').plan_item_id], ['hotel', hotel.id], 'plan_remove carries the hotel id in plan_item_id')

trackPlanHandoff(exp.destinationSlug, 4, true, 'panel', 'es')
eq(keys(last('plan_handoff')), ['destination_slug', 'lang', 'mixed', 'plan_size', 'source'], 'plan_handoff params')
trackPlanHandoff(null, 0, false, 'concierge', 'es')
eq(keys(last('plan_handoff')), ['lang', 'mixed', 'plan_size', 'source'], 'plan_handoff without a destination omits destination_slug')

// ── 2. partner_link_click: which surface the click came from ───────────────────────────
const EXP_KEYS = ['destination', 'destination_slug', 'experience_id', 'lang', 'link_name', 'partner_slug', 'position', 'provider', 'section']
const HOTEL_KEYS = ['destination', 'destination_slug', 'hotel_id', 'lang', 'link_name', 'partner_slug', 'position', 'provider', 'section']

trackBookClick(exp, 3, 'es')                       // a hub card (default section)
let p = last('partner_link_click')
eq([p.link_name, p.section, p.position, p.experience_id], ['gyg_experience', 'experience_hub', 3, exp.id], 'hub card -> experience_hub')
eq(keys(p), EXP_KEYS, 'experience booking click params')

trackPlanBook(planExp, 2, 'es')                    // the plan panel
p = last('partner_link_click')
eq([p.link_name, p.section, p.position, p.experience_id, p.provider, p.partner_slug], ['gyg_experience', 'experience_plan', 2, planExp.id, 'gyg', 'getyourguide'], 'experience in the plan panel -> experience_plan')
eq(keys(p), EXP_KEYS, 'experience_plan click has the same params as a card click')

trackHotelBook(hotel, 5, 'es')                     // a hotel card (default section)
p = last('partner_link_click')
eq([p.link_name, p.section, p.position, p.hotel_id], ['hotel_booking', 'hotels_index', 5, hotel.id], 'hotel card -> hotels_index')
eq(keys(p), HOTEL_KEYS, 'hotel booking click params')

trackPlanBook(planHotel, 1, 'es')                  // the plan panel
p = last('partner_link_click')
eq([p.link_name, p.section, p.position, p.hotel_id], ['hotel_booking', 'hotels_plan', 1, planHotel.id], 'hotel in the plan panel -> hotels_plan')
eq(keys(p), HOTEL_KEYS, 'hotels_plan click has the same params as a card click')
ok(typeof p.destination === 'string' && !/https?:/.test(String(p.destination)), 'destination stays a hostname, never a full URL')

const n = sent.length
trackPlanBook({ ...planExp, bookingUrl: undefined }, 1, 'es')
trackPlanBook({ ...planHotel, bookingUrl: undefined }, 1, 'es')
eq(sent.length, n, 'a plan item with no booking link sends no event')

// ── 3. renames, and nothing sent that should not be ───────────────────────────────────────
const all = JSON.stringify(sent.map(s => s[2]))
ok(!/"item_id"/.test(all), 'no catalog payload uses item_id (now plan_item_id)')
ok(!/"result_count"/.test(all), 'no catalog payload uses result_count (now results_count)')
ok(!/price|rating|review/i.test(all), 'no price / rating / review in any payload')
eq([...new Set(sent.map(s => s[1]))].sort(), ['experience_filter', 'experience_guide_click', 'experience_list_view', 'hotel_filter', 'partner_link_click', 'plan_add', 'plan_handoff', 'plan_remove'], 'the event names sent')

// the union the call sites rely on
const ga = readFileSync('lib/analytics/ga.ts', 'utf8')
const union = /export type PartnerLinkSection =([^\n]+)/.exec(ga)?.[1] ?? ''
for (const v of ['experience_hub', 'experience_plan', 'hotels_index', 'hotels_plan']) ok(union.includes(`'${v}'`), `PartnerLinkSection includes ${v}`)

// no gtag (consent not given / blocked): never throws
delete (globalThis as any).window
let threw = false
try { trackBookClick(exp, 1, 'es'); trackPlanBook(planHotel, 1, 'es'); trackHotelFilter('es', EMPTY_HOTEL_FILTERS, { destino: 'x', price: null, viajero: null }, 1) } catch { threw = true }
ok(!threw, 'tracking without window.gtag does not throw')

// ── 4. the taxonomy doc names every event, parameter and section value ─────────────────────
const doc = readFileSync('docs/analytics/mxcity-pilot-taxonomy.md', 'utf8')
const mentioned = (t: string) => doc.includes('`' + t + '`')
const names = [...new Set(sent.map(s => s[1]))]
const params = [...new Set(sent.flatMap(s => Object.keys(s[2])))]
for (const e of names) ok(mentioned(e) || (e.startsWith('plan_') && doc.includes('`plan_add` / `plan_remove`')), `doc names event ${e}`)
for (const q of params) ok(mentioned(q), `doc names parameter ${q}`)
for (const v of ['experience_hub', 'experience_plan', 'hotels_index', 'hotels_plan', 'gyg_experience', 'hotel_booking']) ok(mentioned(v), `doc names ${v}`)
ok(/\| Plan item ID \| Event \| `plan_item_id` \|/.test(doc), 'doc: dimension registration row for plan_item_id')
ok(!/`result_count`[^\n]*\|/.test(doc.split('### Changes to catalog parameters')[0]), 'doc: result_count only appears in the changes note')

console.log(`${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
