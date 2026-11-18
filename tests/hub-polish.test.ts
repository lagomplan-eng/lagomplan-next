/**
 * tests/hub-polish.test.ts
 *
 *   npx tsx tests/hub-polish.test.ts
 *
 * Guards for the hub-polish PR:
 *   1. no experience description carries a GetYourGuide rating / "Desde|From US$" claim; removed tour prices stay removed, kept costs stay
 *   2. Experiencias / Experiences is in the footer (es + en)
 *   3. the cookie banner's space is reserved before it mounts (it was the CLS source on every first visit)
 */
import fs from 'fs'
import path from 'path'
import { getAllFlatGuides } from '../lib/data/guides'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
const ok = (name: string, pass: boolean, detail?: string) => results.push({ name, pass, detail: pass ? undefined : detail })
const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf-8')

// 1 ── no GetYourGuide rating / price claim in the editorial copy
// "GetYourGuide" followed (in the same sentence) by a rating (4.8/5, 177 reviews) or a price (US$30, Desde/From US$N),
// or a "top rated on GetYourGuide" claim.
const GYG_CLAIM = new RegExp([
  String.raw`GetYourGuide\b[^.]{0,80}?(?:\d(?:\.\d)?\/5|\d[\d,]*\+?\s*(?:reseñas?|reviews?)|(?:Desde|From|desde|from|starts at|cuesta)\s+(?:desde\s+)?US\$\s?\d|US\$\s?\d)`,
  String.raw`(?:mejor calificad[oa]|top[- ]rated|best[- ]rated|mejor valorad[oa])\s+(?:en|on)\s+GetYourGuide`,
].join('|'), 'i')

// the regex itself must catch every shape we removed (so the guard can't silently rot)
const SHOULD_MATCH = [
  'GetYourGuide: 4.8/5 (177 reseñas) · Desde US$150. Algo.',
  'GetYourGuide: 4.4/5 (339 reviews) · From US$27 per person. Something.',
  'Marcada como mejor calificada en GetYourGuide: entrada general.',
  'Marked as top rated on GetYourGuide: general admission.',
  'la entrada general en GetYourGuide cuesta desde US$30 (4.5/5, más de 3,800 reseñas).',
  'general admission on GetYourGuide starts at US$30 (4.5/5, more than 3,800 reviews).',
]
const SHOULD_NOT_MATCH = [
  'Reserva en GetYourGuide con cancelación gratis.',
  'The permit costs $100 USD per person.',
  'the rowboat on the lake costs €10 and is the most-remembered part of the four days.',
  'Rentals in town for $8–12 USD/day.',
]
ok('GYG claim regex matches every removed shape', SHOULD_MATCH.every(t => GYG_CLAIM.test(t)), SHOULD_MATCH.filter(t => !GYG_CLAIM.test(t)).join(' | '))
ok('GYG claim regex leaves the kept costs alone', SHOULD_NOT_MATCH.every(t => !GYG_CLAIM.test(t)), SHOULD_NOT_MATCH.filter(t => GYG_CLAIM.test(t)).join(' | '))

for (const loc of ['es', 'en']) {
  const bad: string[] = []
  for (const { canonical, flat } of getAllFlatGuides(loc)) {
    for (const e of flat.experiences) if (GYG_CLAIM.test(e.description)) bad.push(`${canonical}/${e.id}`)
  }
  ok(`${loc}: no experience description has a GetYourGuide rating or "Desde/From US$" claim`, bad.length === 0, bad.join(', '))
}

// the tour prices that were removed stay removed; the three costs that were kept are still there
const all = (loc: string) => getAllFlatGuides(loc).flatMap(g => g.flat.experiences.map(e => ({ g: g.canonical, ...e })))
for (const loc of ['es', 'en']) {
  const byId = new Map(all(loc).map(e => [e.id, e.description]))
  for (const id of ['geiseres-del-tatio-al-amanecer', 'lagunas-altiplanicas-y-flamencos', 'camino-salkantay-4-dias-alternativa-al-camino-inca', 'valle-sagrado-en-un-dia', 'surf-o-clases-de-surf-en-playa-tamarindo',
    'casa-ofrenda-y-taller-artesanal-de-dia-de-muertos-cdmx', 'patzcuaro-de-dia-piramides-panteones-y-espiritus', 'noche-de-muertos-en-michoacan-tour-nocturno-desde-morelia']) {
    ok(`${loc}: ${id} carries no price`, !/US\$|\bUSD\b|\$\s?\d/.test(byId.get(id) ?? '$'), byId.get(id))
  }
  ok(`${loc}: bike rental cost kept (Valle de la Luna)`, /\$8–12 USD/.test(byId.get('valle-de-la-luna-al-atardecer') ?? ''))
  ok(`${loc}: Rwanda gorilla permit cost kept`, /\$1,500 USD/.test(byId.get('mountain-gorilla-trekking') ?? ''))
  ok(`${loc}: Lake Braies rowboat cost kept`, /€10/.test(byId.get('lago-di-braies-early-morning-tour') ?? ''))
}

// 2 ── footer
for (const loc of ['es', 'en']) {
  const m = JSON.parse(read(`messages/${loc}.json`))
  const nav = m.nav.experiences
  ok(`${loc}: footer.links.experiences exists and matches the nav label`, m.footer.links.experiences === nav && !!nav, `footer=${m.footer.links.experiences} nav=${nav}`)
}
ok('Footer.tsx links to /experiences', /key: '\/experiences',\s*labelKey: 'links\.experiences'/.test(read('components/layout/Footer.tsx')))

// 3 ── the cookie banner's space is reserved before it mounts (it was the CLS source)
const layout = read('app/[locale]/layout.tsx')
const css = read('app/globals.css')
const banner = read('components/layout/CookieBanner.tsx')
ok('layout: inline script marks <html class="consent-pending"> using the same condition as the banner',
  layout.includes("localStorage.getItem('lagomplan-consent')") && layout.includes('globalPrivacyControl!==true') && layout.includes("classList.add('consent-pending')"))
ok('css: body reserves the banner height while consent-pending', /html\.consent-pending body\s*{\s*padding-top:\s*var\(--cookie-banner-h,\s*var\(--cookie-banner-reserve\)\)/.test(css))
ok('css: an empty bar stands in for the banner while pending', /html\.consent-pending::before/.test(css))
ok('css: reserve heights are defined for mobile and desktop', (css.match(/--cookie-banner-reserve:\s*\d+px/g) ?? []).length >= 5)
ok('Nav offsets by the banner height or, before it mounts, the reserve', read('components/layout/Nav.tsx').includes("var(--cookie-banner-h, var(--cookie-banner-reserve, 0px))"))
ok('CookieBanner clears the pending class on every path (stored, GPC, choice, change)', (banner.match(/clearPending\(\)/g) ?? []).length >= 5, `found ${(banner.match(/clearPending\(\)/g) ?? []).length}`)

const failed = results.filter(r => !r.pass)
for (const r of failed) console.log(`FAIL ${r.name}: ${r.detail}`)
console.log(`hub-polish: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
