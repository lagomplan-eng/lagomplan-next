/**
 * e2e/guia-parity.spec.ts
 *
 * /demo/<slug> must stay the /guia/livin_condesa template 1:1. A redesign once
 * dropped tabs, neighborhood zones and experience cards; this fails if any demo
 * diverges structurally from Livin's guide. It compares a structural
 * fingerprint — NOT copy: sections, headings, neighborhood tabs (+ their
 * taglines and spot counts), experience cards and banner, the practical
 * section's groups/cards — in both languages.
 *
 * Only the PROPERTY layer may differ, and each allowed difference is listed in
 * ALLOWED below, explicitly. Anything else is a failure.
 */
import { test, expect, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const LIVIN = '/guia/livin_condesa'

/** Fingerprint keys allowed to differ, and why. Keep this list short. */
const ALLOWED = [
  'houseSpots', // "Your house": Livin has its real street list; a demo has 3 placeholders (or the operator's own)
] as const

/**
 * Differences that are allowed ONLY because of what the demo's JSON omits, with
 * the exact expected effect. A demo without guide.host_letter renders no letter
 * section (by design: it "renders only when provided"): one section and one
 * letter block fewer, nothing else.
 */
function conditional(cfg: { guide?: { host_letter?: unknown; display?: { agenda?: boolean } } }, livin: { sections: number }) {
  const out = cfg.guide?.host_letter
    ? { keys: [] as string[], expect: {} as Record<string, unknown> }
    : { keys: ['sections', 'letterBlocks'], expect: { sections: livin.sections - 1, letterBlocks: 0 } }
  // Demo guides (/demo/*) have their own layout; Livin (/guia/*) is untouched. Demos: section anchors, the practical
  // part shows its first 4 cards per tab ("Show N more"), and with the agenda Experiences sit under the 48-hour itinerary.
  out.keys.push('sectionIds', 'practicalCards')
  out.expect.practicalCards = 4
  out.expect.sectionIds = ['practico', 'zonas', 'itinerario', ...(cfg.guide?.display?.agenda ? ['experiencias', 'aqui'] : ['aqui', 'experiencias']), 'comer']
  return out
}

async function fingerprint(page: Page, url: string, lang: 'es' | 'en') {
  await page.goto(`${url}?lang=${lang}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('[role="tab"]')
  const tabs = page.locator('[role="tab"]')
  const n = await tabs.count()
  const labels: string[] = []
  const spots: number[] = []
  const taglines: string[] = []
  for (let i = 0; i < n; i++) {
    await tabs.nth(i).click()
    labels.push((await tabs.nth(i).innerText()).trim())
    spots.push(await page.locator('[class*="spotRow"]').count())
    // Zone tabs share the city layer, so their tagline must match; the house tab's is the property's own.
    taglines.push(i === 0 ? '(house)' : (await page.locator('[class*="nbTagline"]').first().innerText()).trim())
  }
  const count = (sel: string) => page.locator(sel).count()
  return {
    sections: await count('main section, body > div > section'),
    h2: await count('h2'),
    sectionIds: await page.$$eval('section[id]', (els) => els.map((e) => e.id)),
    tabLabels: labels,
    zoneTaglines: taglines,
    zoneSpots: spots.slice(1), // Roma Norte, Condesa, Polanco, Centro…
    houseSpots: spots[0],
    experienceCards: await count('[class*="expCard"]'),
    experienceBanner: await count('[class*="expBannerRow"]'),
    practicalGroups: await count('[class*="faqStackedGroup"]'),
    practicalFilterChips: await count('[class*="filterChip"]'),
    practicalCards: await count('#practico [class*="cardGrid"] > *'),
    letterBlocks: await count('[class*="letterCard"], [class*="letterSplit"]'),
    footers: await count('footer'),
  }
}

const demoSlugs = fs.readdirSync(path.join(process.cwd(), 'content', 'demos'), { withFileTypes: true })
  .filter((d) => d.isDirectory()).map((d) => d.name).sort()

test.describe('guide ↔ demo template parity', () => {
  test.skip(({ browserName, isMobile }) => isMobile, 'structure is viewport-independent; desktop is enough')

  for (const lang of ['en', 'es'] as const) {
    for (const slug of demoSlugs) {
      test(`${slug} (${lang}) has the same structure as ${LIVIN}`, async ({ page, request }) => {
        const res = await request.get(`/demo/${slug}`)
        test.skip(res.status() === 404, `/demo/${slug} is not served in this environment (environments: ["preview"])`)

        const livin = await fingerprint(page, LIVIN, lang)
        const demo = await fingerprint(page, `/demo/${slug}`, lang)

        // Sanity: the fingerprint actually saw the template (guards against an empty-vs-empty pass).
        expect(livin.tabLabels.length, 'Livin has the house tab + city zones').toBeGreaterThanOrEqual(5)
        expect(livin.experienceCards).toBeGreaterThanOrEqual(4)
        expect(livin.practicalCards).toBeGreaterThan(10)

        const cfg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'demos', slug, 'demo.json'), 'utf8'))
        const cond = conditional(cfg, livin)
        const skip = [...ALLOWED as readonly string[], ...cond.keys]
        const strip = <T extends Record<string, unknown>>(o: T) =>
          Object.fromEntries(Object.entries(o).filter(([k]) => !skip.includes(k)))
        expect(strip(demo)).toEqual(strip(livin))
        for (const [k, v] of Object.entries(cond.expect)) expect(demo[k as keyof typeof demo], `${k} (conditional difference)`).toEqual(v)
        // The allowed difference is bounded: a demo's house list is never empty.
        expect(demo.houseSpots).toBeGreaterThanOrEqual(3)
      })
    }
  }
})
