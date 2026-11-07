/**
 * tests/affiliate-ref.test.ts — withRef is idempotent: a URL that already carries ref=lagomplan (84 guide
 * URLs do) must not get a second one ("?ref=lagomplan&ref=lagomplan"), and every URL of every guide ends
 * with exactly one.
 *   npx tsx tests/affiliate-ref.test.ts
 */
import { withRef } from '../lib/affiliate'
import { getAllFlatGuides } from '../lib/data/guides'

let failed = 0
const eq = (name: string, got: unknown, want: unknown) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { failed++; console.error(`FAIL ${name}\n   got:  ${JSON.stringify(got)}\n   want: ${JSON.stringify(want)}`) }
}
const count = (s: string) => (s.match(/[?&]ref=/g) ?? []).length

eq('no url → "#" (callers handle the fallback)', withRef(undefined), '#')
eq('adds ref when missing (no query)', withRef('https://www.booking.com/hotel/us/x.html'), 'https://www.booking.com/hotel/us/x.html?ref=lagomplan')
eq('adds ref when missing (existing query)', withRef('https://www.getyourguide.com/a/?partner_id=ABC'), 'https://www.getyourguide.com/a/?partner_id=ABC&ref=lagomplan')
eq('already has ref=lagomplan: unchanged, not doubled', withRef('https://www.booking.com/hotel/us/x.html?ref=lagomplan'), 'https://www.booking.com/hotel/us/x.html?ref=lagomplan')
eq('already has ref in the middle: still one, other params kept', withRef('https://www.booking.com/h.html?checkin=2026-11-25&ref=lagomplan&checkout=2026-11-30'), 'https://www.booking.com/h.html?checkin=2026-11-25&ref=lagomplan&checkout=2026-11-30')
eq('a different ref value is replaced, not stacked', count(withRef('https://x.com/a?ref=other')), 1)
eq('calling it twice gives the same result', withRef(withRef('https://x.com/a?b=1')), withRef('https://x.com/a?b=1'))
eq('a fragment is kept', withRef('https://x.com/a?b=1#top'), 'https://x.com/a?b=1&ref=lagomplan#top')
eq('relative url (no origin): one ref, idempotent', [withRef('/hotels/x?ref=lagomplan'), withRef('/hotels/x')], ['/hotels/x?ref=lagomplan', '/hotels/x?ref=lagomplan'])

// Every outbound url of every guide, in both locales
for (const locale of ['es', 'en']) {
  const bad: string[] = []
  let n = 0
  for (const { canonical, flat } of getAllFlatGuides(locale)) {
    for (const u of [...flat.hotels.map((h) => h.affiliateUrl), ...flat.experiences.map((e) => e.affiliateUrl)]) {
      if (!u) continue
      n++
      if (count(withRef(u)) !== 1) bad.push(`${canonical}: ${withRef(u)}`)
    }
  }
  eq(`all ${n} guide urls (${locale}) end up with exactly one ref`, bad, [])
}

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('affiliate-ref: all passed')
