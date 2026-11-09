/**
 * tests/experiences-phase6.test.ts — run: npx tsx tests/experiences-phase6.test.ts
 * JSON-LD, GA4 payloads, LetMeAllez loader, footer contrast, sitemap, nav.
 */
import { readFileSync, existsSync } from 'fs'
import { isExperiencesHubPath } from '../components/affiliate/Stay22Loader'
import { buildExperiencesJsonLd, serializeJsonLd } from '../lib/experiences/jsonld'
import { getExperiences } from '../lib/experiences'
import { trackBookClick, trackFilterChange, trackListView, trackGuideClick } from '../lib/experiences/analytics'
import { trackPlanChange, trackPlanHandoff } from '../lib/catalog-analytics'
import { parseFilters, serializeFilters } from '../lib/experiences/filters'

let pass = 0, fail = 0
function eq(a: unknown, b: unknown, msg: string) {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++
  else { fail++; console.error(`FAIL ${msg}\n  got      ${JSON.stringify(a)}\n  expected ${JSON.stringify(b)}`) }
}
const ok = (c: boolean, msg: string) => eq(c, true, msg)

;(async () => {
  const es = getExperiences('es'), en = getExperiences('en')

  // ── JSON-LD ───────────────────────────────────────────────────────────────
  for (const [loc, list] of [['es', es], ['en', en]] as const) {
    const blocks = buildExperiencesJsonLd(loc, list, { home: 'H', hub: 'Hub', listName: 'L' })
    const [bc, il] = blocks as any[]
    eq([bc['@type'], il['@type']], ['BreadcrumbList', 'ItemList'], `${loc}: block types`)
    eq(bc.itemListElement.length, 2, `${loc}: breadcrumb has 2 levels`)
    ok(bc.itemListElement[1].item.endsWith(loc === 'es' ? '/es/experiencias' : '/en/experiences'), `${loc}: breadcrumb hub url`)
    eq(il.numberOfItems, list.length, `${loc}: numberOfItems`)
    eq(il.itemListElement.map((x: any) => x.position), list.map((_, i) => i + 1), `${loc}: positions 1..n`)
    ok(il.itemListElement.every((x: any) => x.url.startsWith(`https://www.lagomplan.com/${loc}/${loc === 'es' ? 'guias' : 'guides'}/`) && x.url.includes('#exp-')), `${loc}: items point at our guide anchors`)
    ok(il.itemListElement.every((x: any) => !x.url.includes('getyourguide')), `${loc}: no GYG url in structured data`)
    const flat = JSON.stringify(blocks)
    ok(!/"Product"|"Offer"|AggregateRating|"Review"|"price"/.test(flat), `${loc}: no Product / Offer / AggregateRating / Review / price`)
  }
  ok(!serializeJsonLd({ a: '</script><b>' }).includes('</script>'), 'json-ld cannot close its own script tag')
  eq(JSON.parse(serializeJsonLd({ a: '</script>' })).a, '</script>', 'escaping round-trips')

  // ── GA4 payloads ──────────────────────────────────────────────────────────
  const sent: Array<[string, string, any]> = []
  ;(globalThis as any).window = { gtag: (...a: any[]) => sent.push(a as any) }
  const e = es[0]
  trackListView('es', 53)
  trackBookClick(e, 3, 'es')
  trackGuideClick(e, 3, 'es')
  trackPlanChange('add', { type: 'experience', id: e.id, destinationSlug: e.destinationSlug }, 1, 'es')
  trackPlanChange('remove', { type: 'experience', id: e.id, destinationSlug: e.destinationSlug }, 0, 'es')
  trackPlanHandoff(e.destinationSlug, 2, true, 'panel', 'es')
  trackPlanHandoff(null, 0, false, 'concierge', 'es')
  const ev = (n: string, i = 0) => sent.filter(s => s[1] === n)[i]?.[2]
  eq(ev('experience_list_view'), { lang: 'es', experiences_total: 53 }, 'list_view params')
  const pl = ev('partner_link_click')
  eq([pl.link_name, pl.section, pl.provider, pl.experience_id, pl.position, pl.destination_slug, pl.partner_slug], ['gyg_experience', 'experience_hub', 'gyg', e.id, 3, e.destinationSlug, 'getyourguide'], 'partner_link_click: gyg_experience params explicit')
  eq(pl.destination, 'www.getyourguide.com', 'destination stays the hostname')
  eq(ev('experience_guide_click'), { lang: 'es', experience_id: e.id, destination_slug: e.destinationSlug, position: 3 }, 'guide_click params')
  eq(ev('plan_add'), { lang: 'es', item_type: 'experience', item_id: e.id, destination_slug: e.destinationSlug, plan_size: 1 }, 'plan_add params')
  eq(ev('plan_remove').plan_size, 0, 'plan_remove params')
  eq(ev('plan_handoff', 0), { lang: 'es', plan_size: 2, mixed: true, source: 'panel', destination_slug: e.destinationSlug }, 'handoff (panel)')
  eq('destination_slug' in ev('plan_handoff', 1), false, 'handoff without a destination sends no destination_slug')
  ok(!JSON.stringify(sent).match(/price|rating|\bname\b/i), 'no price / rating / names in any payload')

  sent.length = 0
  const base = parseFilters(new URLSearchParams(''))
  const next = parseFilters(new URLSearchParams('region=europa&tipo=comida,naturaleza'))
  trackFilterChange('es', base, next, 9)
  eq(sent.map(s => [s[2].filter_group, s[2].filter_value, s[2].results_count]), [['region', 'europa', 9], ['tipo', 'comida,naturaleza', 9]], 'one filter event per changed group')
  sent.length = 0
  trackFilterChange('es', next, base, 53)
  eq(sent.map(s => s[2].filter_value), ['(cleared)', '(cleared)'], 'cleared filters are labelled')
  sent.length = 0
  trackFilterChange('es', next, next, 9)
  eq(sent.length, 0, 'no change = no event')
  eq(serializeFilters(next), 'region=europa&tipo=comida%2Cnaturaleza'.replace('%2C', ',') , 'sanity: serializer unchanged') // guards the filter URL contract
  delete (globalThis as any).window

  // ── LetMeAllez: not on the hub, excludes GYG ───────────────────────────────
  for (const p of ['/es/experiencias', '/en/experiences', '/es/experiencias/', '/en/experiences/']) ok(isExperiencesHubPath(p), `hub path: ${p}`)
  for (const p of ['/es', '/es/guias', '/es/guias/roma', '/en/guides/rome', '/es/planificador', '/es/experiencias/otra', '/es/experiences-x', null, undefined]) ok(!isExperiencesHubPath(p as any), `not hub: ${p}`)
  const loader = readFileSync('components/affiliate/Stay22Loader.tsx', 'utf8')
  ok(loader.includes("excludes: 'getyourguide'"), 'loader excludes getyourguide')
  ok(!/<Script id="stay22-letmeallez"/.test(readFileSync('app/[locale]/layout.tsx', 'utf8')), 'layout no longer loads LMA unconditionally')
  ok(/<Stay22Loader \/>/.test(readFileSync('app/[locale]/layout.tsx', 'utf8')), 'layout mounts Stay22Loader')
  ok(!existsSync('app/api/cron/check-gyg-links/route.ts') && JSON.parse(readFileSync('vercel.json', 'utf8')).crons === undefined, 'no cron')

  // ── footer contrast (WCAG AA 4.5:1 for small text) ────────────────────────
  const lum = (h: string) => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] }
  const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
  const footer = ['Footer', 'CookieSettingsLink', 'DoNotSellLink'].map(f => readFileSync(`components/layout/${f}.tsx`, 'utf8')).join('\n')
  ok(!/#6B8F86/i.test(footer), 'footer no longer uses #6B8F86')
  const colors = Array.from(new Set(Array.from(footer.matchAll(/(?:text|hover:text)-\[(#[0-9A-Fa-f]{6})\]/g)).map(m => m[1])))
  ok(colors.every(c => ratio(c, '#FFFFFF') >= 4.5), `footer text colors pass AA on white: ${colors.join(', ')}`)

  // ── sitemap + nav wiring ──────────────────────────────────────────────────
  const sitemap = (await import('../app/sitemap')).default()
  const urls = sitemap.map(x => x.url)
  ok(urls.includes('https://www.lagomplan.com/es/experiencias'), 'sitemap: es hub')
  ok(urls.includes('https://www.lagomplan.com/en/experiences'), 'sitemap: en hub')
  const hub = sitemap.find(x => x.url.endsWith('/es/experiencias'))!
  eq((hub.alternates?.languages as any)?.en, 'https://www.lagomplan.com/en/experiences', 'sitemap: hreflang en')
  eq((hub.alternates?.languages as any)?.['x-default'], 'https://www.lagomplan.com/es/experiencias', 'sitemap: x-default = es')
  ok(!urls.some(u => u.includes('?')), 'sitemap: no filtered URLs')
  const nav = readFileSync('components/layout/Nav.tsx', 'utf8')
  ok(/experiencesIndex' as const,\s+label: t\('experiences'\)/.test(nav) && /experiencesIndex:\s+'\/experiences'/.test(nav), 'nav: Experiencias link wired')

  console.log(`${pass} passed, ${fail} failed`)
  process.exit(fail ? 1 : 0)
})()
