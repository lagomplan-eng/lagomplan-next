/**
 * tests/experiences.test.ts
 *
 * Experiencias hub: data layer (lib/experiences/index.ts) and filter rules
 * (lib/experiences/filters.ts).
 *
 *   npx tsx tests/experiences.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import { getAllFlatGuides } from '../lib/data/guides'
import { GYG_PARTNER_ID, isGygTourUrl } from '../lib/affiliate/gyg'
import { getExperiences, personasFromEsTags } from '../lib/experiences'
import type { Experience } from '../lib/experiences/types'
import {
  EMPTY_FILTERS, FILTER_PARAMS, activeFilterCount, coverage, destinationOptions, facetCounts, filterExperiences,
  groupVisible, hasFilterParams, matches, parseFilters, sanitizeFilters, serializeFilters, type FilterState,
} from '../lib/experiences/filters'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectTrue(name: string, got: boolean, detail?: string) {
  results.push({ name, pass: got, detail: got ? undefined : (detail ?? 'expected true') })
}
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}

// ── data layer ──────────────────────────────────────────────────────────────────

// The membership rule is tested independent of the calendar; the hubWindow has its own file (experiences-window.test.ts).
const es = getExperiences('es', { ignoreWindow: true })
const en = getExperiences('en', { ignoreWindow: true })

// Independent count straight from the registry: experiences whose affiliateUrl is a GYG tour page.
const bookableInRegistry = getAllFlatGuides('es').flatMap(g => g.flat.experiences).filter(e => isGygTourUrl(e.affiliateUrl))
expectEq('hub lists exactly the experiences whose affiliateUrl is a GYG tour page (es)', es.length, bookableInRegistry.length)
expectEq('hub lists exactly the same ids in the same order as the registry (es)', es.map(e => e.id), bookableInRegistry.map(e => e.id))
expectTrue('there is at least one bookable experience', es.length > 0)

expectEq('es and en have the same ids in the same order', en.map(e => e.id), es.map(e => e.id))
expectEq('es and en have the same personas per experience', en.map(e => e.personas), es.map(e => e.personas))
expectEq('es and en have the same regions and destination slugs', en.map(e => `${e.region}/${e.destinationSlug}`), es.map(e => `${e.region}/${e.destinationSlug}`))
expectEq('ids are unique', new Set(es.map(e => e.id)).size, es.length)

expectTrue('editorial order is strictly increasing (registry order, then position in guide)',
  es.every((e, i) => i === 0 || e.order > es[i - 1].order))

for (const e of es) {
  const u = new URL(e.bookingUrl)
  const where = `${e.id}`
  expectEq(`${where}: booking host is www.getyourguide.com`, u.host, 'www.getyourguide.com')
  expectEq(`${where}: booking has exactly partner_id and cmp`, [...u.searchParams.keys()].sort(), ['cmp', 'partner_id'])
  expectEq(`${where}: partner_id`, u.searchParams.get('partner_id'), GYG_PARTNER_ID)
  expectEq(`${where}: cmp is experiencias-<registryKey>`, u.searchParams.get('cmp'), `experiencias-${e.destinationSlug}`)
  expectTrue(`${where}: booking path is a tour page without a locale prefix`, isGygTourUrl(e.bookingUrl) && !/^\/[a-z]{2}(-[a-z]{2,4})?\//.test(u.pathname))
  expectEq(`${where}: guideAnchor`, e.guideAnchor, `exp-${e.id}`)
  expectTrue(`${where}: has a non-empty name and description`, e.name.length > 0 && e.description.length > 0)
}

// No GYG data may ride along: the Experience shape has only guide-file fields.
// destinationImage is the guide's own hero illustration, never an image from GetYourGuide.
const allowedKeys = ['bookingUrl', 'category', 'description', 'destinationAltName', 'destinationImage', 'destinationName', 'destinationSlug', 'duration', 'guideAnchor', 'guideSlug', 'id', 'name', 'order', 'personas', 'region']
expectTrue('Experience objects carry only known guide-file fields (no price/rating/reviews; destinationImage is our own guide illustration)',
  es.every(e => Object.keys(e).every(k => allowedKeys.includes(k))))

// Per-locale slug + short name
const roma = (l: Experience[]) => l.find(e => e.destinationSlug === 'roma')
expectEq('roma: guideSlug es', roma(es)?.guideSlug, 'roma')
expectEq('roma: guideSlug en', roma(en)?.guideSlug, 'rome')
expectEq('alto-adigio: shortName en', en.find(e => e.destinationSlug === 'alto-adigio-dolomitas')?.destinationName, 'South Tyrol')
expectEq('alto-adigio: shortName es', es.find(e => e.destinationSlug === 'alto-adigio-dolomitas')?.destinationName, 'Alto Adigio')

// ── personas ───────────────────────────────────────────────────────────────────

expectEq('personas: Familia + Niños pequeños → familia once', personasFromEsTags(['Familia', 'Niños pequeños']), ['familia'])
expectEq('personas: Parejas/Romance → pareja', personasFromEsTags(['Romance', 'Parejas']), ['pareja'])
expectEq('personas: Amigas / Grupo de amigos → amigos', personasFromEsTags(['Amigas', 'Grupo de amigos']), ['amigos'])
expectEq('personas: Familia multigeneracional → familia', personasFromEsTags(['Familia multigeneracional', 'Playa']), ['familia'])
expectEq('personas: Familia + Familia multigeneracional → familia once', personasFromEsTags(['Familia', 'Familia multigeneracional']), ['familia'])
expectEq('Punta Cana (Familia multigeneracional) experiences are tagged familia', es.filter(e => e.destinationSlug === 'punta-cana').map(e => e.personas), [['familia'], ['familia'], ['familia']])
expectEq('personas: Solo, Lujo and topics are ignored', personasFromEsTags(['Solo', 'Lujo', 'Gastronomía', 'Viajero solo']), [])
expectEq('personas: mixed keeps first-seen order', personasFromEsTags(['Amigos', 'Pareja', 'Familia']), ['amigos', 'pareja', 'familia'])

// ── filters: URL <-> state ───────────────────────────────────────────────────────

const q = (s: string) => new URLSearchParams(s)
expectEq('parse: empty query → empty state', parseFilters(q('')), EMPTY_FILTERS)
expectEq('parse: full query', parseFilters(q('region=europa&destino=roma,azores&para=familia&tipo=comida,cultura&duracion=corto')),
  { region: 'europa', destinos: ['roma', 'azores'], para: 'familia', tipos: ['comida', 'cultura'], duracion: 'corto' } satisfies FilterState)
expectEq('parse: unknown enum values are ignored', parseFilters(q('region=mars&para=perros&tipo=comida,nope&duracion=eterno')),
  { ...EMPTY_FILTERS, tipos: ['comida'] })
expectEq('parse: duplicate destinos collapse', parseFilters(q('destino=roma,roma,%20roma')).destinos, ['roma'])
const full: FilterState = { region: 'europa', destinos: ['roma', 'azores'], para: 'pareja', tipos: ['comida', 'cultura'], duracion: 'medio' }
expectEq('serialize → parse round trip', parseFilters(q(serializeFilters(full))), full)
expectEq('serialize: empty state → empty string', serializeFilters(EMPTY_FILTERS), '')
expectEq('serialize: stable param order', serializeFilters(full), 'region=europa&destino=roma,azores&para=pareja&tipo=comida,cultura&duracion=medio')
expectTrue('hasFilterParams: true for each filter param', FILTER_PARAMS.every(p => hasFilterParams(q(`${p}=x`))))
expectTrue('hasFilterParams: false for utm / unrelated params', !hasFilterParams(q('utm_source=ig&ref=qr')))
expectEq('activeFilterCount counts every selection', activeFilterCount(full), 1 + 2 + 1 + 2 + 1)

// ── filters: matching rules (synthetic, so the rules are pinned independent of data) ──

const mk = (o: Partial<Experience> & { id: string }): Experience => ({
  name: o.id, description: 'd', personas: [], region: 'mexico', destinationSlug: 'cdmx', destinationName: 'CDMX', destinationAltName: 'CDMX',
  guideSlug: 'cdmx', guideAnchor: `exp-${o.id}`, bookingUrl: 'https://x', order: 0, ...o,
})
const syn: Experience[] = [
  mk({ id: 'a', personas: ['familia', 'pareja'], category: 'comida', duration: 'corto', order: 0 }),
  mk({ id: 'b', personas: ['pareja'], category: 'cultura', duration: 'completo', order: 1, region: 'europa', destinationSlug: 'roma' }),
  mk({ id: 'c', personas: [], order: 2, region: 'europa', destinationSlug: 'roma' }),            // no persona, no category, no duration
  mk({ id: 'd', personas: ['amigos'], category: 'comida', order: 3, region: 'asia', destinationSlug: 'kioto' }), // no duration
]
const ids = (l: Experience[]) => l.map(e => e.id)

expectEq('no filters → everything, in order', ids(filterExperiences(syn, EMPTY_FILTERS)), ['a', 'b', 'c', 'd'])
expectEq('region filter', ids(filterExperiences(syn, { ...EMPTY_FILTERS, region: 'europa' })), ['b', 'c'])
expectEq('destino multi-select', ids(filterExperiences(syn, { ...EMPTY_FILTERS, destinos: ['cdmx', 'kioto'] })), ['a', 'd'])
expectEq('para: only experiences carrying that persona (missing persona does NOT match)', ids(filterExperiences(syn, { ...EMPTY_FILTERS, para: 'pareja' })), ['a', 'b'])
expectEq('tipo multi: missing category does NOT match', ids(filterExperiences(syn, { ...EMPTY_FILTERS, tipos: ['comida', 'cultura'] })), ['a', 'b', 'd'])
expectEq('duracion: missing duration does NOT match', ids(filterExperiences(syn, { ...EMPTY_FILTERS, duracion: 'corto' })), ['a'])
expectEq('groups combine with AND', ids(filterExperiences(syn, { ...EMPTY_FILTERS, region: 'europa', para: 'pareja' })), ['b'])
expectEq('AND across all five groups', ids(filterExperiences(syn, { region: 'europa', destinos: ['roma'], para: 'pareja', tipos: ['cultura'], duracion: 'completo' })), ['b'])
expectEq('filtering never reorders', ids(filterExperiences(syn, { ...EMPTY_FILTERS, tipos: ['comida', 'cultura'] })), ids(syn).filter(i => i !== 'c'))
expectEq('a filter matching nothing → empty list', ids(filterExperiences(syn, { ...EMPTY_FILTERS, region: 'africa' })), [])

// sanitize
expectEq('sanitize: unknown destinos dropped', sanitizeFilters({ ...EMPTY_FILTERS, destinos: ['roma', 'atlantis'] }, syn).destinos, ['roma'])
expectEq('sanitize: destinos outside the chosen region dropped', sanitizeFilters({ ...EMPTY_FILTERS, region: 'europa', destinos: ['roma', 'kioto', 'cdmx'] }, syn).destinos, ['roma'])

// group visibility (>= 50%)
expectEq('coverage: personas 3 of 4', coverage(syn, 'personas'), 0.75)
expectEq('coverage: category 3 of 4', coverage(syn, 'category'), 0.75)
expectEq('coverage: duration 2 of 4', coverage(syn, 'duration'), 0.5)
expectTrue('groupVisible: exactly 50% renders', groupVisible(syn, 'duration'))
expectTrue('groupVisible: below 50% is hidden', !groupVisible([...syn, mk({ id: 'e' })], 'duration'))
expectTrue('groupVisible: empty set is hidden', !groupVisible([], 'category'))

// facets
const facetsNone = facetCounts(syn, EMPTY_FILTERS, 'tipo')
expectEq('facet tipo (no filters)', facetsNone, { comida: 2, cultura: 1 })
expectEq('facet tipo respects OTHER groups (region=europa) but not its own', facetCounts(syn, { ...EMPTY_FILTERS, region: 'europa', tipos: ['comida'] }, 'tipo'), { cultura: 1 })
expectEq('facet para counts personas per experience', facetCounts(syn, EMPTY_FILTERS, 'para'), { familia: 1, pareja: 2, amigos: 1 })
expectEq('facet duracion skips experiences with no duration', facetCounts(syn, EMPTY_FILTERS, 'duracion'), { corto: 1, completo: 1 })
expectEq('facet region', facetCounts(syn, EMPTY_FILTERS, 'region'), { mexico: 1, europa: 2, asia: 1 })
expectEq('destinationOptions: unique, first-appearance order', destinationOptions(syn).map(d => d.slug), ['cdmx', 'roma', 'kioto'])

// ── the real v0 data, as shipped ─────────────────────────────────────────────────

expectTrue('real data: "Para quién" group is shown (>= 50% have a persona)', groupVisible(es, 'personas'), `coverage=${coverage(es, 'personas')}`)
expectTrue('real data: "Tipo" group is shown (>= 50% have a category)', groupVisible(es, 'category'), `coverage=${coverage(es, 'category')}`)
expectTrue('real data: "Duración" group is hidden in v0 (< 50% have a duration)', !groupVisible(es, 'duration'), `coverage=${coverage(es, 'duration')}`)
expectTrue('real data: every region filter value has at least one experience', ['mexico', 'latam', 'europa', 'asia', 'africa'].every(r => es.some(e => e.region === r)))
expectTrue('real data: matches() with empty filters is true for everyone', es.every(e => matches(e, EMPTY_FILTERS)))

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\nexperiences: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}  (hub size: ${es.length} experiences)\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
