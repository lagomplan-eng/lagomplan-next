/**
 * hotel_booking is recorded in the capture phase (lib/analytics/capture-click.ts), before Stay22 can take the click,
 * on /hoteles (section hotels_index) and on a guide's hotel section (section guide_hotels). Static guards: the
 * listener only observes, the two pages use it, the old React onClick is gone (no double count), the section value
 * exists, and the taxonomy doc names it.
 */
import fs from 'fs'
import path from 'path'

const root = path.join(__dirname, '..')
let failed = 0
function ok(name: string, cond: boolean, detail = '') {
  if (cond) console.log(`ok   ${name}`)
  else { failed++; console.log(`FAIL ${name}${detail ? ` — ${detail}` : ''}`) }
}
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf-8')
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const helper = strip(read('lib/analytics/capture-click.ts'))
ok('the listener is on window, capture phase', /window\.addEventListener\('click', handler, \{ capture: true \}\)/.test(helper))
ok('the listener never prevents or stops the click', !/preventDefault|stopPropagation|stopImmediatePropagation/.test(helper))

const hotels = strip(read('components/hotels/HotelsClient.tsx'))
ok('/hoteles records the booking click through the capture helper', /onLinkClickFirst\(/.test(hotels) && /trackHotelBook\(list\[i\], i \+ 1, l\)/.test(hotels))
ok('/hoteles has no React onClick for the booking link (no double count)', !/onClick: \(\) => trackHotelBook/.test(hotels))

const guide = strip(read('components/guides/HotelsSection.tsx'))
ok('guide hotels record the booking click through the capture helper', /onLinkClickFirst\(/.test(guide))
ok("guide hotels report section guide_hotels with the guide key, language and position", /'guide_hotels'/.test(guide) && /destinationKey: key/.test(guide) && /i \+ 1/.test(guide))
ok('guide hotels get the guide key from the page', /guideKey=\{data\.slug\}/.test(read('components/guides/GuidePageClientV2.tsx')))

ok("'guide_hotels' is a known section", /'guide_hotels'/.test(read('lib/analytics/ga.ts')) && /'guide_hotels'/.test(read('lib/catalog-analytics.ts')))
const doc = read('docs/analytics/mxcity-pilot-taxonomy.md')
ok('taxonomy doc: guide_hotels in the section list and the catalog table', (doc.match(/guide_hotels/g) ?? []).length >= 3)
ok('taxonomy doc: notes the one-time rise in hotel_booking counts', /one-time rise|will rise/i.test(doc) && /Stay22/.test(doc))

console.log(`hotel-click-tracking: ${failed === 0 ? 'all passed' : `${failed} failed`}`)
process.exit(failed ? 1 : 0)
