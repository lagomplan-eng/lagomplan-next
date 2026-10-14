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
eq('unknown slug → null', getDemoProspect('nope'), null)
eq('prototype keys are not slugs', getDemoProspect('constructor'), null)

const hmt = buildDemoPartner(getDemoProspect('host-me-tender')!)
eq('hmt slug', hmt.slug, 'demo_host-me-tender')
eq('hmt cobrand', hmt.cobrand, true)
eq('hmt logo', hmt.brand?.logo, '/demos/host-me-tender/logo.png')
eq('hmt accent', hmt.brand?.accent, '#194332')
eq('hmt 4 tours es/en', [hmt.ownTours?.es?.length, hmt.ownTours?.en?.length], [4, 4])
eq('hmt no Secrets & Spice', JSON.stringify(hmt.ownTours).includes('Secrets'), false)
eq('hmt taco image only on tour-4', hmt.ownTours?.es?.map((t) => !!t.image), [false, false, false, true])
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

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('demos-loader: all passed')
