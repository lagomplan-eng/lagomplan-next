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

eq('slugs come from the folders', listDemoSlugs(), ['dave-nat', 'host-me-tender', 'host-me-tender-alejandro'])
// dave-nat is preview-only: hidden (404) when VERCEL_ENV=production.
eq('dave-nat is served outside production', getDemoProspect('dave-nat')?.slug, 'dave-nat')
process.env.VERCEL_ENV = 'production'
eq('production lists only host-me-tender (the others are preview-only)', listDemoSlugs(), ['host-me-tender'])
eq('dave-nat → null in production', getDemoProspect('dave-nat'), null)
eq('host-me-tender still served in production', getDemoProspect('host-me-tender')?.slug, 'host-me-tender')
process.env.VERCEL_ENV = 'preview'
eq('preview lists every demo', listDemoSlugs(), ['dave-nat', 'host-me-tender', 'host-me-tender-alejandro'])
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

// ── host-me-tender-alejandro: an editable copy of host-me-tender (preview-only) ──
const alej = buildDemoPartner(getDemoProspect('host-me-tender-alejandro')!)
const tours = (l: 'es' | 'en') => alej.ownTours?.[l] ?? []
eq('alejandro: every Book button → Localbird experiences page', tours('es').concat(tours('en')).map((t) => t.bookHref), Array(8).fill('https://p.localbird.io/hostmetender/for-you'))
eq('alejandro: attribution (ES/EN)', alej.experiencesPartnerNote, { es: 'Reserva en la página de experiencias de Host Me Tender', en: "Book through Host Me Tender's experiences page" })
eq('alejandro: confirmed prices are bilingual (Roma, Taco)', [tours('es')[0].price, tours('en')[0].price, tours('es')[3].price, tours('en')[3].price], ['Desde $115 en Localbird', 'From $115 on Localbird', 'Desde $135 en Localbird', 'From $135 on Localbird'])
eq('alejandro: unconfirmed prices stay placeholders (Coyoacán, Centro: tour data differs from Localbird)', [tours('es')[1].price, tours('es')[2].price, tours('en')[1].price, tours('en')[2].price], ['[precio]', '[precio]', '[precio]', '[precio]'])
eq('alejandro: placeholder pill label + hidden newsletter', [alej.placeholderPill, alej.hideNewsletter], [{ es: 'Por confirmar con Host Me Tender', en: 'To confirm with Host Me Tender' }, true])
eq('alejandro: preview-only', getDemoProspect('host-me-tender-alejandro')?.environments, ['preview'])
// The original and every other demo get none of the new options.
const hmtOrig = getDemoProspect('host-me-tender')!
eq('host-me-tender: no pill, newsletter kept, string price unchanged', [hmt.placeholderPill, hmt.hideNewsletter, hmt.ownTours?.es?.[0].price, hmtOrig.guide?.display], [undefined, undefined, '[precio]', undefined])
eq('dave-nat: no display options', [buildDemoPartner(getDemoProspect('dave-nat')!).placeholderPill, buildDemoPartner(getDemoProspect('dave-nat')!).hideNewsletter], [undefined, undefined])
// Copy fidelity: apart from the edits above, the copy IS host-me-tender (guards silent drift).
const strip = (c: any) => { const d = JSON.parse(JSON.stringify(c)); delete d.slug; delete d.environments; delete d.guide.display; delete d.guide.tours_partner_note; d.guide.tours.forEach((t: any) => { delete t.url; delete t.price }); return d }
eq('alejandro == host-me-tender except slug / environments / tour urls+prices / attribution / display', strip(getDemoProspect('host-me-tender-alejandro')), strip(hmtOrig))

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('demos-loader: all passed')
