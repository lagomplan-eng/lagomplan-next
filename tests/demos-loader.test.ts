/**
 * tests/demos-loader.test.ts
 *
 * content/demos/<slug>/demo.json → Partner. Demos are data: no TypeScript
 * registry. Run: npx tsx tests/demos-loader.test.ts
 */
import { buildDemoPartner, demoLogoSrc, getDemoProspect, listDemoSlugs } from '../content/guia/demos'

let failed = 0
const eq = (name: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) { failed++; console.error(`FAIL ${name}\n  got:  ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`) }
}

eq('slugs come from the folders', listDemoSlugs(), ['dave-nat', 'host-me-tender'])
// dave-nat is preview-only: hidden (404) when VERCEL_ENV=production.
eq('dave-nat is served outside production', getDemoProspect('dave-nat')?.slug, 'dave-nat')
process.env.VERCEL_ENV = 'production'
eq('production lists only host-me-tender', listDemoSlugs(), ['host-me-tender'])
eq('dave-nat → null in production', getDemoProspect('dave-nat'), null)
eq('host-me-tender still served in production', getDemoProspect('host-me-tender')?.slug, 'host-me-tender')
process.env.VERCEL_ENV = 'preview'
eq('preview lists both', listDemoSlugs(), ['dave-nat', 'host-me-tender'])
delete process.env.VERCEL_ENV
eq('unknown slug → null', getDemoProspect('nope'), null)
eq('prototype keys are not slugs', getDemoProspect('constructor'), null)

const hmt = buildDemoPartner(getDemoProspect('host-me-tender')!)
eq('hmt slug', hmt.slug, 'demo_host-me-tender')
eq('hmt cobrand', hmt.cobrand, true)
eq('hmt logo', hmt.brand?.logo, '/demos/host-me-tender/logo.png')
eq('hmt accent', hmt.brand?.accent, '#194332')
eq('hmt 4 tours es/en', [hmt.ownTours?.es?.length, hmt.ownTours?.en?.length], [4, 4])
eq('hmt no Secrets & Spice', JSON.stringify(hmt.ownTours).includes('Secrets'), false)
eq('hmt every tour has an image; tour-4 keeps the taco one', [hmt.ownTours?.es?.every((t) => !!t.image), hmt.ownTours?.es?.[3]?.image], [true, '/images/guia/experiences/exp-tacos.jpg'])
eq('hmt chefs card: only the Take a Chef link, no named chefs', [hmt.faqAnswers?.chefsAtHome?.links?.en?.map((l) => l.text), JSON.stringify(hmt.faqAnswers?.chefsAtHome).includes('Adán')], [['Take a Chef'], false])
eq('hmt letter 3 paragraphs', hmt.hostLetter?.es?.paragraphs?.length, 3)
eq('hmt letter link', hmt.hostLetter?.en?.link?.href, '#tour-1')
eq('hmt instagram href', hmt.stayGlance?.instagram?.href, 'https://www.instagram.com/host.me.tender/')
eq('hmt zone / tab', [hmt.zone, hmt.defaultNeighborhood], ['condesa', 'Condesa'])
eq('hmt noindex', hmt.noindex, true)

const dn = buildDemoPartner(getDemoProspect('dave-nat')!)
eq('dave-nat loads from its JSON alone', [dn.displayName, dn.slug], ['Dave & Nat', 'demo_dave-nat'])
eq('dave-nat has no logo / letter / tours / glance', [dn.brand?.logo, dn.hostLetter, dn.ownTours, dn.stayGlance], [undefined, undefined, undefined, undefined])
eq('dave-nat cobrand off', dn.cobrand, false)
eq('dave-nat logo src', demoLogoSrc(getDemoProspect('dave-nat')!), undefined)
eq('dave-nat check-out stays a placeholder', dn.atAGlance?.checkOut, '[check-out]')

// Optional blocks of the documented example flow through to the Partner.
import fs from 'node:fs'
import { buildDemoPartner as build } from '../content/guia/demos'
const ex = JSON.parse(fs.readFileSync('docs/demos/example.demo.json', 'utf8'))
const exp = build(ex)
eq('example: first zone → tab + faq zone', [exp.defaultNeighborhood, exp.zone], ['Polanco', 'polanco'])
eq('example: house from JSON', [exp.yourHouse.name, exp.yourHouse.spots.es.length, exp.yourHouse.mapUrl], ['Kasava Masaryk', 3, 'https://maps.app.goo.gl/EXAMPLE'])
eq('example: whatsapp href', exp.operatorWhatsApp?.href, 'https://wa.me/5215512345678')
eq('example: faq overrides', [exp.faqAnswers?.chefsAtHome?.body.en.startsWith('We work with a chef'), exp.faqAnswers?.massages?.body.es.startsWith('Un estudio')], [true, true])
eq('example: tour overrides', [exp.ownTours?.es?.[0].minBookingTime, exp.ownTours?.es?.[0].image], ['24 h', '/images/guia/experiences/exp-tacos.jpg'])

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('demos-loader: all passed')
