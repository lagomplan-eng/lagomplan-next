/**
 * tests/hub-polish.test.ts
 *
 *   npx tsx tests/hub-polish.test.ts
 *
 * Guards for the hub-polish PR:
 *   1. no guide experience description carries a "GetYourGuide: X/5 (N reviews) · From US$N" line
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

// 1 ── no GYG rating / price line in the editorial copy
const RATING_LINE = /GetYourGuide: [\d.]+\/5 \([\d,]+ (?:reseñas?|reviews?)\)/
for (const loc of ['es', 'en']) {
  const bad: string[] = []
  for (const { canonical, flat } of getAllFlatGuides(loc)) {
    for (const e of flat.experiences) if (RATING_LINE.test(e.description)) bad.push(`${canonical}/${e.id}`)
  }
  ok(`${loc}: no "GetYourGuide: X/5 (N reviews)" line in any experience description`, bad.length === 0, bad.join(', '))
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
