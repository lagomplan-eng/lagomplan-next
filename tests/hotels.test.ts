/**
 * tests/hotels.test.ts — run: npx tsx tests/hotels.test.ts
 *
 * Hoteles: stable ids, traveler-type normalization, booking provider, filters (incl. the
 * "at least 5 hotels" Viajero rule), URL state, search (hotel names) and GA payloads.
 */
import { getAllHotels, getHotelDestinations } from '../lib/hotels'
import {
  TRAVELER_KEYS, TRAVELER_LABEL_MAP, MIN_TRAVELER_HOTELS, normalizeTravelers, hotelProviderFromUrl, priceBucket, filterHotels, travelerOptions,
  slugifyHotelName, parseHotelFilters, serializeHotelFilters, EMPTY_HOTEL_FILTERS, HOTEL_FILTER_PARAMS, type HotelListing,
} from '../lib/hotels-catalog'
import { searchCatalog } from '../lib/catalog-search'
import { trackHotelFilter, trackHotelBook } from '../lib/catalog-analytics'
import { getAllFlatGuides, GUIDE_META } from '../lib/data/guides'
import { getAllCityGuides } from '../lib/worldcup/data'

let pass = 0, fail = 0
function eq(a: unknown, b: unknown, msg: string) {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++
  else { fail++; console.error(`FAIL ${msg}\n  got      ${JSON.stringify(a)}\n  expected ${JSON.stringify(b)}`) }
}
const ok = (c: boolean, msg: string) => eq(c, true, msg)
const tally = (xs: string[]) => xs.reduce<Record<string, number>>((m, k) => ((m[k] = (m[k] ?? 0) + 1), m), {})

const es = getAllHotels('es')
const en = getAllHotels('en')

// ── ids ──────────────────────────────────────────────────────────────────────
eq([es.length, en.length], [186, 186], '186 hotels in both locales')
eq(new Set(es.map(h => h.id)).size, 186, 'ids are unique across all 186')
eq(es.map(h => h.id), en.map(h => h.id), 'same ids, same order in ES and EN')
ok(es.every(h => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(h.id)), 'ids are slugs')
ok(es.every(h => h.id === slugifyHotelName(h.name)), 'id = slug of the Spanish name')
ok(es.every(h => h.id.length > 0), 'no empty id')

// ── traveler types ───────────────────────────────────────────────────────────
eq([...TRAVELER_KEYS], ['ninos', 'parejas', 'solo', 'negocios', 'aventura', 'bienestar', 'workation', 'eco'], 'key set')
ok(Object.values(TRAVELER_LABEL_MAP).every(k => (TRAVELER_KEYS as readonly string[]).includes(k)), 'map only targets known keys')
eq(['Familias', 'Families'].map(l => normalizeTravelers([l]).keys[0]), ['ninos', 'ninos'], 'Familias/Families → ninos')
eq(['Parejas', 'Couples'].map(l => normalizeTravelers([l]).keys[0]), ['parejas', 'parejas'], 'Parejas/Couples → parejas')
eq(['Bienestar', 'Wellness'].map(l => normalizeTravelers([l]).keys[0]), ['bienestar', 'bienestar'], 'Bienestar/Wellness → bienestar')
eq(['Negocios', 'Business', 'business '].map(l => normalizeTravelers([l]).keys[0]), ['negocios', 'negocios', 'negocios'], 'Negocios/Business (case, spaces)')
eq(normalizeTravelers(['Pet Friendly', 'Parejas']), { keys: ['parejas'], unmapped: ['Pet Friendly'] }, 'unknown labels are reported, not dropped silently')
eq(normalizeTravelers(['Parejas', 'Couples']).keys, ['parejas'], 'both languages of one key collapse')
const unmapped = new Set<string>()
for (const l of ['es', 'en'] as const) {
  for (const g of getAllFlatGuides(l)) g.flat.hotels.forEach(h => normalizeTravelers(h.archetypes).unmapped.forEach(u => unmapped.add(u)))
  for (const [, c] of getAllCityGuides(l)) (c.stays ?? []).forEach(s => normalizeTravelers(s.archetypes).unmapped.forEach(u => unmapped.add(u)))
}
eq([...unmapped], [], 'every label in the data maps to a key')
eq(tally(es.flatMap(h => h.travelers)), { ninos: 62, parejas: 103, bienestar: 23, aventura: 11, eco: 2, solo: 9, negocios: 1 }, 'ES: hotels per key')
eq(tally(en.flatMap(h => h.travelers)), { ninos: 60, parejas: 103, bienestar: 28, aventura: 12, eco: 2, solo: 8, negocios: 1 }, 'EN: hotels per key')

// ── booking provider ─────────────────────────────────────────────────────────
const P = hotelProviderFromUrl
eq(P('https://booking.stay22.com/lagomplan/x?aid=1'), 'booking', 'booking.stay22.com → booking')
eq(P('https://www.booking.com/hotel/mx/x.html'), 'booking', 'www.booking.com → booking')
eq(P('https://booking.com/hotel/x'), 'booking', 'booking.com → booking')
eq(P('https://expedia.stay22.com/x'), 'expedia', 'expedia.stay22.com → expedia')
eq(P('https://hotelscom.stay22.com/x'), 'hotelscom', 'hotelscom.stay22.com → hotelscom')
eq(P('https://kayak.stay22.com/x'), 'kayak', 'kayak.stay22.com → kayak')
eq(P('https://www.sonnwies.com/en/family-hotel'), 'hotel-site', 'a hotel site → hotel-site')
eq(P('https://wandercabins.mx/?x=1'), 'hotel-site', 'a hotel site (tld mx) → hotel-site')
eq(P('https://getyourguide.stay22.com/x'), 'other', 'a Stay22 product we do not recognise → other')
eq(P('https://www.expedia.com/x'), 'other', 'a direct OTA we do not label → other (not "the hotel site")')
eq([P(undefined), P(''), P('not a url')], ['other', 'other', 'other'], 'missing / broken → other')
eq(tally(es.map(h => h.provider)), { booking: 173, other: 1, expedia: 6, hotelscom: 3, 'hotel-site': 2, kayak: 1 }, 'ES: hotels per provider')
eq(tally(en.map(h => h.provider)), { booking: 168, other: 6, expedia: 6, hotelscom: 3, 'hotel-site': 2, kayak: 1 }, 'EN: hotels per provider')
eq(en.filter(h => !h.bookingUrl).map(h => h.id), ['casa-pancha', 'hostal-nube-mia', 'rusk-house', 'hilton-kansas-city', 'hotel-indigo-kansas-city'], 'EN: the five stays without a booking link')
ok(es.every(h => !!h.bookingUrl), 'ES: every hotel has a booking link')

// ── destinations ─────────────────────────────────────────────────────────────
for (const loc of ['es', 'en'] as const) {
  const dests = getHotelDestinations(loc)
  eq(new Set(dests.map(d => d.key)).size, dests.length, `${loc}: destination keys unique`)
  ok(Object.keys(GUIDE_META).every(k => dests.some(d => d.key === k)), `${loc}: every guide is a search destination`)
  eq(dests.reduce((n, d) => n + d.hotels, 0), 186, `${loc}: hotels per destination add up`)
}
ok(es.some(h => h.source === 'worldcup' && h.destinationKey === 'ciudad-de-mexico'), 'World Cup CDMX stays share the guide destination key')
ok(es.some(h => h.destinationKey.startsWith('wc-')), 'cities without a guide keep a wc- key')
eq(es.find(h => h.id === 'brick-hotel')?.destinationKey, 'ciudad-de-mexico', 'Brick Hotel → ciudad-de-mexico')

// ── filters ──────────────────────────────────────────────────────────────────
eq(['$', '$$', '$$$', '$$$$'].map(p => priceBucket(p as any)), ['economico', 'intermedio', 'lujo', 'lujo'], 'price buckets: $$$$ is Lujo')
const mk = (o: Partial<HotelListing> & { id: string }): HotelListing => ({
  name: o.id, altName: o.id, priceLevel: '$$', description: '', tags: [], source: 'guide', destinationKey: 'a', destination: 'A', cityLabel: 'A',
  cover_img: '', guideUrl: '#', provider: 'booking', travelers: [], ...o,
})
const many = (n: number, o: Partial<HotelListing>) => Array.from({ length: n }, (_, i) => mk({ id: `${o.destinationKey ?? 'a'}-${o.priceLevel ?? '$$'}-${(o.travelers ?? []).join('')}-${i}`, ...o }))
const syn = [
  ...many(5, { travelers: ['solo'] }), ...many(4, { travelers: ['eco'] }), ...many(5, { travelers: ['parejas'], priceLevel: '$$$$', destinationKey: 'b' }),
]
eq(travelerOptions(syn, EMPTY_HOTEL_FILTERS), ['parejas', 'solo'], 'Viajero: exactly 5 shows, 4 hides')
eq(MIN_TRAVELER_HOTELS, 5, 'the threshold is 5')
eq(travelerOptions(syn, { ...EMPTY_HOTEL_FILTERS, destino: 'b' }), ['parejas'], 'Viajero counts the current result set (destination filter applied)')
eq(travelerOptions(syn, { ...EMPTY_HOTEL_FILTERS, price: 'lujo' }), ['parejas'], 'Viajero counts the current result set (price filter applied)')
eq(travelerOptions(syn, { ...EMPTY_HOTEL_FILTERS, viajero: 'eco' }), ['solo', 'parejas', 'eco'].sort((a, b) => TRAVELER_KEYS.indexOf(a as any) - TRAVELER_KEYS.indexOf(b as any)), 'a selected type stays even under the threshold')
eq(travelerOptions(syn, { ...EMPTY_HOTEL_FILTERS, viajero: 'solo' }), ['parejas', 'solo'], 'selecting a type does not hide the others (its own filter is not applied to the count)')
eq(filterHotels(syn, { ...EMPTY_HOTEL_FILTERS, price: 'lujo' }).length, 5, 'price filter')
eq(filterHotels(syn, { ...EMPTY_HOTEL_FILTERS, viajero: 'solo', destino: 'a' }).length, 5, 'viajero + destino combine with AND')
eq(filterHotels(syn, EMPTY_HOTEL_FILTERS).map(h => h.id), syn.map(h => h.id), 'no filters keeps editorial order')
const real = travelerOptions(es, EMPTY_HOTEL_FILTERS)
ok(real.includes('solo') && !real.includes('eco') && !real.includes('negocios'), 'real data: Solo stays, Eco and Negocios disappear')

// ── URL state ────────────────────────────────────────────────────────────────
const q = (s: string) => new URLSearchParams(s)
const valid = new Set(['ciudad-de-mexico'])
eq(parseHotelFilters(q('destino=ciudad-de-mexico&precio=lujo&viajero=solo'), valid), { price: 'lujo', viajero: 'solo', destino: 'ciudad-de-mexico' }, 'parse')
eq(parseHotelFilters(q('destino=nope&precio=$$&viajero=pets'), valid), { price: null, viajero: null, destino: null }, 'parse drops unknown values')
eq(serializeHotelFilters({ destino: 'ciudad-de-mexico', price: 'lujo', viajero: 'solo' }), 'destino=ciudad-de-mexico&precio=lujo&viajero=solo', 'serialize order is stable')
eq(serializeHotelFilters(EMPTY_HOTEL_FILTERS), '', 'serialize empty')
eq(parseHotelFilters(q(serializeHotelFilters({ destino: 'ciudad-de-mexico', price: 'economico', viajero: 'ninos' })), valid), { price: 'economico', viajero: 'ninos', destino: 'ciudad-de-mexico' }, 'round trip')
eq([...HOTEL_FILTER_PARAMS], ['destino', 'precio', 'viajero'], 'noindex params')

// ── search ───────────────────────────────────────────────────────────────────
const dests = getHotelDestinations('es')
const input = {
  destinations: dests.map(d => ({ slug: d.key, name: d.name, altName: d.altName, count: d.hotels })),
  items: es.map(h => ({ id: h.id, name: h.name, altName: h.altName, destinationSlug: h.destinationKey })),
}
const brick = searchCatalog('brick', input)
eq(brick, [{ kind: 'item', id: 'brick-hotel', destinationSlug: 'ciudad-de-mexico' }], '"brick" → Brick Hotel, with its destination')
eq(searchCatalog('BRÍCK hotel', input)[0], { kind: 'item', id: 'brick-hotel', destinationSlug: 'ciudad-de-mexico' }, 'accent- and case-insensitive')
const cdmx = searchCatalog('ciudad de mexico', input)
eq(cdmx[0], { kind: 'destination', slug: 'ciudad-de-mexico' }, 'destination hits come before hotel hits')
eq(searchCatalog('mexico city', input)[0], { kind: 'destination', slug: 'ciudad-de-mexico' }, 'matches the other locale\'s name')
ok(searchCatalog('', input).length === 0 && searchCatalog('zzzz', input).length === 0, 'empty / no match → nothing')
ok(!searchCatalog('ciudad de mexico', { ...input, excludeSlugs: ['ciudad-de-mexico'] }).some(h => h.kind === 'destination'), 'a chosen destination is not suggested again')
eq(searchCatalog('x', { destinations: [{ slug: 'g', name: 'Xalapa', altName: 'Xalapa', count: 0 }] }), [{ kind: 'guide-only', slug: 'g' }], 'a guide with no hotels is a guide-only hit')
for (const d of dests) ok(searchCatalog(d.name, input).some(h => (h.kind === 'destination' || h.kind === 'guide-only') && h.slug === d.key), `search finds ${d.key} by name`)

// ── GA4 payloads ─────────────────────────────────────────────────────────────
const sent: Array<[string, string, any]> = []
;(globalThis as any).window = { gtag: (...a: any[]) => sent.push(a as any) }
trackHotelFilter('es', EMPTY_HOTEL_FILTERS, { destino: 'ciudad-de-mexico', price: 'lujo', viajero: null }, 7)
trackHotelFilter('es', { destino: 'x', price: null, viajero: 'solo' }, EMPTY_HOTEL_FILTERS, 171)
trackHotelFilter('es', EMPTY_HOTEL_FILTERS, EMPTY_HOTEL_FILTERS, 171)
const hf = sent.filter(s => s[1] === 'hotel_filter').map(s => s[2])
eq(hf[0], { lang: 'es', filter_group: 'destino', filter_value: 'ciudad-de-mexico', results_count: 7 }, 'hotel_filter: destino')
eq(hf[1], { lang: 'es', filter_group: 'precio', filter_value: 'lujo', results_count: 7 }, 'hotel_filter: precio')
eq(hf.slice(2).map(p => [p.filter_group, p.filter_value]), [['destino', '(cleared)'], ['viajero', '(cleared)']], 'hotel_filter: cleared values')
eq(hf.length, 4, 'one event per changed group, none when nothing changed')
ok(hf.every(p => !('result_count' in p)), 'hotel_filter sends results_count only (same name as experience_filter)')
const b = es.find(h => h.id === 'brick-hotel')!
trackHotelBook(b, 2, 'es')
const book = sent.filter(s => s[1] === 'partner_link_click').pop()![2]
eq([book.link_name, book.section, book.hotel_id, book.position, book.provider, book.destination_slug], ['hotel_booking', 'hotels_index', 'brick-hotel', 2, b.provider, 'ciudad-de-mexico'], 'hotel booking click params')
ok(!/https?:/.test(JSON.stringify(book)) && book.destination === new URL(b.bookingUrl!).hostname, 'destination stays the hostname, no full URL sent')
const before = sent.length
trackHotelBook({ ...b, bookingUrl: undefined }, 1, 'es')
eq(sent.length, before, 'no booking link, no event')

console.log(`${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
