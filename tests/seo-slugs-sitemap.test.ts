/**
 * tests/seo-slugs-sitemap.test.ts
 *
 * Alias → short-URL redirects (lib/guide-slugs.ts, used by middleware.ts),
 * per-locale slugs for Roma/Mauricio, and the sitemap shape (one entry per
 * URL, each with the full es/en/x-default alternates incl. itself, no alias
 * URLs).
 *
 *   npx tsx tests/seo-slugs-sitemap.test.ts
 */
import { SLUG_ALIASES, getGuideRedirectSlug, getPublicGuideSlug } from '../lib/guide-slugs'
import { getNewGuideParams, getGuidePageData } from '../lib/data/guides'
import sitemap from '../app/sitemap'

let pass = 0, fail = 0
function eq<T>(name: string, got: T, exp: T) {
  const ok = JSON.stringify(got) === JSON.stringify(exp)
  ok ? pass++ : (fail++, console.error(`FAIL ${name}: expected ${JSON.stringify(exp)}, got ${JSON.stringify(got)}`))
}

// Every alias redirects (both locales) to its registry key, and resolves to real content.
for (const [alias, key] of Object.entries(SLUG_ALIASES)) {
  for (const loc of ['es', 'en']) {
    eq(`${loc}/${alias} → ${key}`, getGuideRedirectSlug(loc, alias), key)
  }
  eq(`${alias} still resolves content`, getGuidePageData(alias, 'es') !== null, true)
}
// Public slugs never redirect
for (const p of getNewGuideParams()) eq(`no redirect for ${p.locale}/${p.slug}`, getGuideRedirectSlug(p.locale, p.slug), null)
// Locale slugs
eq('es roma', getPublicGuideSlug('roma', 'es'), 'roma')
eq('en roma', getPublicGuideSlug('roma', 'en'), 'rome')
eq('es mauricio', getPublicGuideSlug('mauricio', 'es'), 'mauricio')
eq('en mauricio', getPublicGuideSlug('mauricio', 'en'), 'mauritius')
eq('/en/guides/roma → rome', getGuideRedirectSlug('en', 'roma'), 'rome')
eq('/es/guias/rome → roma', getGuideRedirectSlug('es', 'rome'), 'roma')
eq('/en/guides/mauricio → mauritius', getGuideRedirectSlug('en', 'mauricio'), 'mauritius')
eq('/es/guias/mauritius → mauricio', getGuideRedirectSlug('es', 'mauritius'), 'mauricio')
eq('unknown slug untouched', getGuideRedirectSlug('es', 'no-existe'), null)

// Sitemap
const sm = sitemap()
const urls = sm.map(e => e.url)
eq('no duplicate URLs', new Set(urls).size, urls.length)
for (const e of sm) {
  const l = e.alternates?.languages as Record<string, string> | undefined
  const ok = !!l && Object.keys(l).sort().join() === 'en,es,x-default' && l['x-default'] === l.es && (e.url === l.es || e.url === l.en)
  if (!ok) { fail++; console.error(`FAIL alternates for ${e.url}`) } else pass++
}
for (const alias of Object.keys(SLUG_ALIASES)) eq(`sitemap omits alias ${alias}`, urls.some(u => u.endsWith('/' + alias)), false)
for (const u of ['/es/guias/roma', '/en/guides/rome', '/es/guias/mauricio', '/en/guides/mauritius', '/es', '/en', '/es/smart-finds/familias', '/en/smart-finds/families']) {
  eq(`sitemap has ${u}`, urls.includes('https://www.lagomplan.com' + u), true)
}
for (const u of ['/en/guides/roma', '/es/guias/rome', '/en/guides/mauricio', '/es/guias/mauritius']) {
  eq(`sitemap omits ${u}`, urls.includes('https://www.lagomplan.com' + u), false)
}
const rome = sm.find(e => e.url.endsWith('/en/guides/rome'))!
eq('rome alternates', rome.alternates?.languages, {
  es: 'https://www.lagomplan.com/es/guias/roma', en: 'https://www.lagomplan.com/en/guides/rome', 'x-default': 'https://www.lagomplan.com/es/guias/roma' })

console.log(`\nseo-slugs-sitemap: ${pass}/${pass + fail} passed`)
process.exit(fail ? 1 : 0)
