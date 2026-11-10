/**
 * tests/experiences-search.test.ts — run: npx tsx tests/experiences-search.test.ts
 *
 * Hub search (regions + every guide we have) and the newsletter popup's scroll threshold.
 */
import { getDestinations, getExperiences } from '../lib/experiences'
import { REGIONS, searchHub } from '../lib/experiences/filters'
import { scrollTriggerFor, isCatalogPath } from '../lib/newsletter-trigger'
import { GUIDE_META } from '../lib/data/guides'
import type { GuideRegion } from '../lib/experiences/types'

let pass = 0, fail = 0
function eq(a: unknown, b: unknown, msg: string) {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++
  else { fail++; console.error(`FAIL ${msg}\n  got      ${JSON.stringify(a)}\n  expected ${JSON.stringify(b)}`) }
}
function ok(c: boolean, msg: string) { eq(c, true, msg) }

const regionNames = Object.fromEntries(REGIONS.map(r => [r, { es: r, en: r }])) as Record<GuideRegion, { es: string; en: string }>
Object.assign(regionNames, {
  mexico: { es: 'México', en: 'Mexico' }, europa: { es: 'Europa', en: 'Europe' }, latam: { es: 'Latinoamérica', en: 'Latin America' },
})

for (const loc of ['es', 'en'] as const) {
  const dests = getDestinations(loc, { ignoreWindow: true })
  const exps = getExperiences(loc, { ignoreWindow: true })
  const regions = new Set(exps.map(e => e.region))

  // every guide is a destination, with the right bookable count
  eq(dests.length, Object.keys(GUIDE_META).length, `${loc}: one destination per guide`)
  eq(dests.reduce((n, d) => n + d.bookable, 0), exps.length, `${loc}: bookable counts add up to the hub size`)

  // search never comes back empty for a destination we have a guide for (own name, other locale's name)
  for (const d of dests) {
    for (const q of [d.name, d.altName]) {
      const hits = searchHub(q, dests, regionNames, regions)
      ok(hits.some(h => (h.kind === 'destination' || h.kind === 'guide-only') && h.slug === d.slug), `${loc}: "${q}" finds ${d.slug}`)
    }
    const hit = searchHub(d.name, dests, regionNames, regions).find(h => 'slug' in h && h.slug === d.slug)!
    eq(hit.kind, d.bookable > 0 ? 'destination' : 'guide-only', `${loc}: ${d.slug} kind follows bookable count`)
  }

  // regions: both locales, accents ignored, only regions with experiences
  eq(searchHub('MEXICO', dests, regionNames, regions)[0], { kind: 'region', region: 'mexico' }, `${loc}: "MEXICO" → region first`)
  eq(searchHub('México', dests, regionNames, regions)[0], { kind: 'region', region: 'mexico' }, `${loc}: "México" → region`)
  eq(searchHub('europe', dests, regionNames, regions)[0], { kind: 'region', region: 'europa' }, `${loc}: "europe" → region`)
  eq(searchHub('europa', dests, regionNames, regions)[0], { kind: 'region', region: 'europa' }, `${loc}: "europa" → region`)
  ok(!searchHub('europe', dests, regionNames, new Set<GuideRegion>(['mexico'])).some(h => h.kind === 'region'), `${loc}: region without experiences isn't offered`)
}

const es = getDestinations('es', { ignoreWindow: true })
const regionsEs = new Set(getExperiences('es', { ignoreWindow: true }).map(e => e.region))
eq(searchHub('', es, regionNames, regionsEs), [], 'empty query → nothing')
eq(searchHub('   ', es, regionNames, regionsEs), [], 'blank query → nothing')
eq(searchHub('zzzz', es, regionNames, regionsEs), [], 'no match → nothing')
const first = es[0]
ok(!searchHub(first.name, es, regionNames, regionsEs, [first.slug]).some(h => 'slug' in h && h.slug === first.slug), 'chosen destinations are excluded')
ok(searchHub('a', es, regionNames, regionsEs, [], 3).length <= 3, 'limit respected')
ok(es.some(d => d.bookable === 0) && es.some(d => d.bookable > 0), 'data has both bookable and guide-only destinations')

// newsletter popup: 50% on catalog pages, 40% everywhere else
for (const p of ['/experiences', '/hotels', '/smart-finds', '/smart-finds/familias', '/smart-finds/[slug]']) eq(scrollTriggerFor(p), 0.5, `${p}: 50%`)
for (const p of ['/', '/planner', '/guides', '/guides/[slug]', '/hotels/[slug]', '/pricing', '/experiences/x']) eq(scrollTriggerFor(p), 0.4, `${p}: 40%`)
ok(!isCatalogPath('/smart-findsX'), 'prefix match needs the slash')

console.log(`${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
