/**
 * tests/guides-registration.test.ts
 *
 * Regression suite for the September 2026 guide batch (Capadocia, Kioto y
 * Osaka, Marrakech, La Ruta del Chile en Nogada) — verifies both the rich
 * FlatGuide registry (lib/data/guides/index.ts, used by the guide detail
 * page) and the listing-stub registry (lib/guides.ts, used by /guias) agree
 * on every guide, in both locales, and that nothing collides with the
 * ~30 pre-existing guides already registered.
 *
 *   npx tsx tests/guides-registration.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import fs from 'fs'
import path from 'path'
import {
  getGuidePageData,
  getAllFlatGuides,
  getNewGuideParams,
  resolveCanonicalSlug,
  GUIDE_META,
} from '../lib/data/guides'
import { getAllGuides, getGuideBySlug, getAllGuideParams } from '../lib/guides'

const REPO_ROOT = path.resolve(__dirname, '..')
const NEW_SLUGS = ['capadocia', 'kioto-osaka', 'marrakech', 'chile-en-nogada'] as const
const LOCALES = ['es', 'en'] as const

function isValidUrl(u: string): boolean {
  try { return /^https?:$/.test(new URL(u).protocol) } catch { return false }
}

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectTrue(name: string, got: boolean, detail?: string) {
  results.push({ name, pass: got, detail: got ? undefined : (detail ?? 'expected true') })
}
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}

for (const slug of NEW_SLUGS) {
  // ── Cover image actually exists on disk ──────────────────────────────
  const imgPath = path.join(REPO_ROOT, 'public', 'images', 'guides', `${slug}.png`)
  expectTrue(`${slug}: cover image file exists at public/images/guides/${slug}.png`, fs.existsSync(imgPath))

  // ── No collision with the ~30 pre-existing guide slugs ───────────────
  expectEq(`${slug}: resolveCanonicalSlug is a no-op (no alias needed)`, resolveCanonicalSlug(slug), slug)

  for (const locale of LOCALES) {
    // ── Rich FlatGuide registry (guide detail page) ─────────────────────
    const page = getGuidePageData(slug, locale)
    expectTrue(`${slug}/${locale}: getGuidePageData resolves`, page !== null)
    if (!page) continue

    expectEq(`${slug}/${locale}: slug matches`, page.slug, slug)
    expectEq(`${slug}/${locale}: locale matches`, page.locale, locale)
    expectTrue(`${slug}/${locale}: hero.title is non-empty`, page.hero.title.length > 0)
    expectEq(`${slug}/${locale}: hero.coverImage points at the copied cover image`, page.hero.coverImage, `/images/guides/${slug}.png`)

    const subtitleLen = page.hero.subtitle.length
    expectTrue(`${slug}/${locale}: hero.subtitle is 300-380 chars (got ${subtitleLen})`, subtitleLen >= 300 && subtitleLen <= 380)

    expectTrue(`${slug}/${locale}: itinerary has at least 1 day`, page.itinerary.days.length > 0)
    expectTrue(`${slug}/${locale}: every itinerary day has at least 1 item`,
      page.itinerary.days.every(d => d.items.length > 0))

    expectTrue(`${slug}/${locale}: hotels has at least 1 item`, page.hotels.items.length > 0)
    expectTrue(`${slug}/${locale}: every hotel has a bookingUrl pointing at booking.com`,
      page.hotels.items.every(h => !!h.bookingUrl && h.bookingUrl.includes('booking.com')))
    expectTrue(`${slug}/${locale}: every hotel has a priceTier`,
      page.hotels.items.every(h => ['$', '$$', '$$$'].includes(h.priceTier)))

    expectTrue(`${slug}/${locale}: experiences has at least 1 item`, page.experiences.items.length > 0)
    // An experience may have no booking link at all (empty affiliateUrl → bookingUrl
    // undefined). When it does have one it must be a real URL, any provider.
    expectTrue(`${slug}/${locale}: every experience's bookingUrl is either absent or a valid URL`,
      page.experiences.items.every(e => !e.bookingUrl || isValidUrl(e.bookingUrl)))
    // Regression: ExperiencesSection.tsx used to hardcode "Reservar" instead
    // of rendering exp.bookingLabel — verify the adapter's per-locale label
    // is what actually reaches the data every guide page renders.
    const expectedBookingLabel = locale === 'en' ? 'Book →' : 'Reservar →'
    expectTrue(`${slug}/${locale}: every experience's bookingLabel is localized (${expectedBookingLabel})`,
      page.experiences.items.every(e => e.bookingLabel === expectedBookingLabel))

    expectTrue(`${slug}/${locale}: checklist has at least 1 item`, page.checklist.items.length > 0)
    expectTrue(`${slug}/${locale}: transport has at least 1 option`, page.transport.options.length > 0)

    // ── Listing-stub registry (/guias index) ────────────────────────────
    const stub = getGuideBySlug(locale as 'es' | 'en', slug)
    expectTrue(`${slug}/${locale}: getGuideBySlug resolves in the listing stub`, stub !== undefined)
    if (stub) {
      expectEq(`${slug}/${locale}: stub cover_img matches the FlatGuide cover image`, stub.cover_img, page.hero.coverImage)
      const excerptField = locale === 'es' ? stub.excerpt_es : stub.excerpt_en
      expectTrue(`${slug}/${locale}: stub excerpt is non-empty`, excerptField.length > 0)
    }
  }
}

// ── Registry-wide sanity ──────────────────────────────────────────────────

const flatEs = getAllFlatGuides('es').map(g => g.canonical)
const flatEn = getAllFlatGuides('en').map(g => g.canonical)
for (const slug of NEW_SLUGS) {
  expectTrue(`getAllFlatGuides('es') includes ${slug}`, flatEs.includes(slug))
  expectTrue(`getAllFlatGuides('en') includes ${slug}`, flatEn.includes(slug))
}
// No duplicate canonical keys anywhere in the FlatGuide registry.
expectEq('FlatGuide registry has no duplicate canonical slugs', flatEs.length, new Set(flatEs).size)

const newGuideParams = getNewGuideParams()
for (const slug of NEW_SLUGS) {
  for (const locale of LOCALES) {
    expectTrue(`getNewGuideParams() includes {locale: '${locale}', slug: '${slug}'}`,
      newGuideParams.some(p => p.locale === locale && p.slug === slug))
  }
}

const allGuideParams = getAllGuideParams()
for (const slug of NEW_SLUGS) {
  for (const locale of LOCALES) {
    expectTrue(`getAllGuideParams() (listing) includes {locale: '${locale}', slug: '${slug}'}`,
      allGuideParams.some(p => p.locale === locale && p.slug === slug))
  }
}

// getAllGuides() listing (used by the /guias index page) surfaces all 4, both locales.
for (const locale of LOCALES) {
  const listed = getAllGuides(locale as 'es' | 'en').map(g => g.slug)
  for (const slug of NEW_SLUGS) {
    expectTrue(`getAllGuides('${locale}') listing includes ${slug}`, listed.includes(slug))
  }
  // No duplicate slugs in the listing for this locale (would indicate a
  // copy-paste collision between the new batch and an existing guide).
  expectEq(`getAllGuides('${locale}') has no duplicate slugs`, listed.length, new Set(listed).size)
}

// ── Experience ids, categories, durations (every guide, not just NEW_SLUGS) ─────
// ES and EN experiences are paired by array position, so ids must line up.

const CATEGORIES = ['comida', 'cultura', 'naturaleza', 'aventura', 'excursion', 'bienestar']
const DURATIONS = ['corto', 'medio', 'completo']
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/

const flatEsAll = getAllFlatGuides('es')
const flatEnByKey = new Map(getAllFlatGuides('en').map(g => [g.canonical, g.flat]))
const allIds: string[] = []

for (const { canonical, flat: es } of flatEsAll) {
  const en = flatEnByKey.get(canonical)
  expectTrue(`${canonical}: has an EN guide`, !!en)
  if (!en) continue
  expectEq(`${canonical}: ES and EN have the same number of experiences`, es.experiences.length, en.experiences.length)

  es.experiences.forEach((e, i) => {
    const x = en.experiences[i]
    const where = `${canonical}[${i}] "${e.name}"`
    expectTrue(`${where}: has a kebab-case id`, typeof e.id === 'string' && KEBAB.test(e.id), `id=${JSON.stringify(e.id)}`)
    expectEq(`${where}: EN id matches ES id by position`, x?.id, e.id)
    expectEq(`${where}: EN category matches ES`, x?.category, e.category)
    expectEq(`${where}: EN duration matches ES`, x?.duration, e.duration)
    expectTrue(`${where}: category is one of the six or absent`, e.category === undefined || CATEGORIES.includes(e.category))
    expectTrue(`${where}: duration is one of the three or absent`, e.duration === undefined || DURATIONS.includes(e.duration))
    expectTrue(`${where}: affiliateUrl is empty or a valid URL`, e.affiliateUrl === '' || isValidUrl(e.affiliateUrl))
    expectTrue(`${where}: EN affiliateUrl is empty or a valid URL`, !x || x.affiliateUrl === '' || isValidUrl(x.affiliateUrl))
    allIds.push(e.id)
  })
}
expectEq('experience ids are unique across all guides', allIds.length, new Set(allIds).size)

// ── GUIDE_META: every registry key has a region and both short names ────────────

const REGIONS = ['mexico', 'latam', 'norteamerica', 'europa', 'asia', 'africa', 'oceania']
for (const { canonical } of flatEsAll) {
  const m = GUIDE_META[canonical]
  expectTrue(`GUIDE_META has an entry for ${canonical}`, !!m)
  if (!m) continue
  expectTrue(`GUIDE_META[${canonical}].region is valid (${m.region})`, REGIONS.includes(m.region))
  expectTrue(`GUIDE_META[${canonical}].shortName.es is non-empty`, !!m.shortName?.es?.trim())
  expectTrue(`GUIDE_META[${canonical}].shortName.en is non-empty`, !!m.shortName?.en?.trim())
}
expectEq('GUIDE_META has no keys outside the registry',
  Object.keys(GUIDE_META).filter(k => !flatEsAll.some(g => g.canonical === k)), [] as string[])

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\nguides-registration: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)
