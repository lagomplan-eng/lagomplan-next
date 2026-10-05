/**
 * tests/october-guides-registration.test.ts
 *
 * Regression suite for the October 2026 guide batch (Roma, Udaipur,
 * Mauricio, Hong Kong) plus the same-session link fixes to Oaxaca,
 * Guatemala, and Uruguay. Covers three things that previously broke, or
 * nearly broke, in this exact codebase:
 *
 *   1. Content + affiliate-link completeness for the 7 guides touched this
 *      session (Roma/Udaipur/Mauricio/Hong Kong/Oaxaca/Guatemala must be
 *      100% populated; Uruguay intentionally keeps 2 empty slots that rely
 *      on the generic affiliate fallback instead of a per-venue link).
 *
 *   2. Locale-mismatched slugs (Roma/Rome, Mauricio/Mauritius) — the same
 *      bug class as kioto-osaka (see MEMORY feedback_guide-slug-locale-
 *      naming): resolveCanonicalSlug must resolve both spellings, and the
 *      lib/guides.ts shadow entry must carry the real per-locale slug.
 *
 *   3. The alternate-locale URL Roma/Mauricio emit from the sitemap
 *      (app/sitemap.ts) — fixed this session after it re-emitted the bare
 *      canonical slug for both locales, which 404s (or silently mis-
 *      routes) for any guide whose ES/EN slugs differ. The equivalent fix
 *      in the guide detail page's language switcher
 *      (app/[locale]/guides/[slug]/page.tsx) is covered separately in
 *      __tests__/guide-alternate-locale-url.jest.test.tsx — that page
 *      pulls in the full client component tree (CSS modules etc.), which
 *      needs Next's Jest transform rather than the bare `tsx` runner used
 *      here.
 *
 *   npx tsx tests/october-guides-registration.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import fs from 'fs'
import path from 'path'
import {
  getGuidePageData,
  getAllFlatGuides,
  resolveCanonicalSlug,
} from '../lib/data/guides'
import { getGuideBySlug } from '../lib/guides'
import sitemap from '../app/sitemap'

const REPO_ROOT = path.resolve(__dirname, '..')
const LOCALES = ['es', 'en'] as const

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectTrue(name: string, got: boolean, detail?: string) {
  results.push({ name, pass: got, detail: got ? undefined : (detail ?? 'expected true') })
}
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}

// ── 1. Content + affiliate-link completeness ────────────────────────────────────

// canonical slug -> { es url slug, en url slug, cover image filename, hasShadow }
// hasShadow: false means this guide predates the lib/guides.ts "shadow entry"
// pattern and was never given one (oaxaca only has the older, differently-
// slugged legacy entry "oaxaca-guia-esencial") — not a bug, just means
// getGuideBySlug() legitimately returns undefined for the bare slug.
const FULLY_POPULATED_GUIDES = {
  roma:      { esSlug: 'roma',      enSlug: 'rome',      image: 'roma',      hasShadow: true },
  udaipur:   { esSlug: 'udaipur',   enSlug: 'udaipur',   image: 'udaipur',   hasShadow: true },
  mauricio:  { esSlug: 'mauricio',  enSlug: 'mauritius', image: 'mauricio',  hasShadow: true },
  'hong-kong': { esSlug: 'hong-kong', enSlug: 'hong-kong', image: 'hong-kong', hasShadow: true },
  oaxaca:    { esSlug: 'oaxaca',    enSlug: 'oaxaca',    image: null,        hasShadow: false },
  guatemala: { esSlug: 'guatemala', enSlug: 'guatemala', image: null,        hasShadow: true },
} as const

for (const [canonical, cfg] of Object.entries(FULLY_POPULATED_GUIDES)) {
  if (cfg.image) {
    const imgPath = path.join(REPO_ROOT, 'public', 'images', 'guides', `${cfg.image}.png`)
    expectTrue(`${canonical}: cover image exists`, fs.existsSync(imgPath))
  }

  expectEq(`${canonical}: resolveCanonicalSlug(esSlug) -> canonical`, resolveCanonicalSlug(cfg.esSlug), canonical)
  expectEq(`${canonical}: resolveCanonicalSlug(enSlug) -> canonical`, resolveCanonicalSlug(cfg.enSlug), canonical)

  for (const locale of LOCALES) {
    const urlSlug = locale === 'es' ? cfg.esSlug : cfg.enSlug
    const page = getGuidePageData(urlSlug, locale)
    expectTrue(`${canonical}/${locale}: getGuidePageData(${urlSlug}) resolves`, page !== null)
    if (!page) continue

    expectEq(`${canonical}/${locale}: page.slug is canonical key`, page.slug, canonical)
    expectTrue(`${canonical}/${locale}: every hotel has a real bookingUrl`,
      page.hotels.items.every(h => !!h.bookingUrl),
      `empty hotel bookingUrl in ${canonical}/${locale}: ${page.hotels.items.filter(h => !h.bookingUrl).map(h => h.name).join(', ')}`)
    expectTrue(`${canonical}/${locale}: every experience has a real bookingUrl`,
      page.experiences.items.every(e => !!e.bookingUrl),
      `empty experience bookingUrl in ${canonical}/${locale}: ${page.experiences.items.filter(e => !e.bookingUrl).map(e => e.name).join(', ')}`)

    // Shadow entry (lib/guides.ts) — routing depends on this where present
    if (cfg.hasShadow) {
      const stub = getGuideBySlug(locale, urlSlug)
      expectTrue(`${canonical}/${locale}: getGuideBySlug resolves in shadow registry`, stub !== undefined)
      if (stub) {
        expectEq(`${canonical}/${locale}: stub.slug_es`, stub.slug_es, cfg.esSlug)
        expectEq(`${canonical}/${locale}: stub.slug_en`, stub.slug_en, cfg.enSlug)
      }
    }
  }
}

// Uruguay: intentionally incomplete — the ferry fix must hold, and the two
// known-empty experiences must stay exactly those two (not grow silently,
// which would mean a *new* gap shipped without anyone noticing).
{
  for (const locale of LOCALES) {
    const page = getGuidePageData('uruguay', locale)
    expectTrue(`uruguay/${locale}: getGuidePageData resolves`, page !== null)
    if (!page) continue
    expectTrue(`uruguay/${locale}: every hotel has a real bookingUrl`,
      page.hotels.items.every(h => !!h.bookingUrl))
    const emptyExpNames = page.experiences.items.filter(e => !e.bookingUrl).map(e => e.name).sort()
    const expectedEmpty = locale === 'es'
      ? ['Estancia de un día en el campo uruguayo', 'Visita a las ruinas de Colonia Valdense'].sort()
      : ['Day at a Uruguayan estancia', 'Visit to the Colonia Valdense ruins'].sort()
    expectEq(`uruguay/${locale}: exactly the known 2 experiences remain without a bookingUrl`, emptyExpNames, expectedEmpty)
    // The ferry experience (previously empty in EN only) must now be populated.
    const ferryName = locale === 'es' ? 'Cruce en ferry a Colonia desde Buenos Aires' : 'Ferry to Colonia from Buenos Aires'
    const ferry = page.experiences.items.find(e => e.name === ferryName)
    expectTrue(`uruguay/${locale}: ferry experience exists`, !!ferry)
    expectTrue(`uruguay/${locale}: ferry experience has a real bookingUrl`, !!ferry?.bookingUrl)
  }
}

// Registry-wide: the 4 new canonical slugs must be present, no duplicates introduced.
{
  const flatEs = getAllFlatGuides('es').map(g => g.canonical)
  for (const canonical of Object.keys(FULLY_POPULATED_GUIDES)) {
    expectTrue(`getAllFlatGuides('es') includes ${canonical}`, flatEs.includes(canonical))
  }
  expectEq('FlatGuide registry has no duplicate canonical slugs', flatEs.length, new Set(flatEs).size)
}

// ── 2 & 3. Locale-mismatched slugs: sitemap alternate-locale URL ───────────────

{
  const entries = sitemap()

  const romaEs = entries.find(e => e.url === 'https://www.lagomplan.com/es/guias/roma')
  expectTrue('sitemap: roma ES entry exists', !!romaEs)
  expectEq('sitemap: roma alternate EN url uses the real "rome" slug, not bare "roma"',
    romaEs?.alternates?.languages?.en, 'https://www.lagomplan.com/en/guides/rome')

  const mauricioEs = entries.find(e => e.url === 'https://www.lagomplan.com/es/guias/mauricio')
  expectTrue('sitemap: mauricio ES entry exists', !!mauricioEs)
  expectEq('sitemap: mauricio alternate EN url uses the real "mauritius" slug, not bare "mauricio"',
    mauricioEs?.alternates?.languages?.en, 'https://www.lagomplan.com/en/guides/mauritius')

  // A same-slug guide should not regress to something like /en/guides/oaxaca -> wrong path.
  const oaxacaEs = entries.find(e => e.url === 'https://www.lagomplan.com/es/guias/oaxaca')
  expectTrue('sitemap: oaxaca ES entry exists', !!oaxacaEs)
  expectEq('sitemap: oaxaca (same slug both locales) alternate EN url',
    oaxacaEs?.alternates?.languages?.en, 'https://www.lagomplan.com/en/guides/oaxaca')
}

const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\noctober-guides-registration: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)
