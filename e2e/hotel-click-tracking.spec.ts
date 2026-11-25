/**
 * e2e/hotel-click-tracking.spec.ts
 *
 * hotel_booking must be recorded even when a script takes the click over (Stay22 does, in the capture phase).
 * To keep CI independent of the third party, the real Stay22 script is blocked and a handler that behaves like it
 * (window capture, registered after hydration, prevents the default and stops the event) is installed instead.
 * The real-browser run with the real Stay22 script is in docs/analytics (PR description).
 */
import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, path: string) {
  await page.route(/stay22/i, r => r.abort())
  await page.addInitScript(() => {
    try { localStorage.setItem('lagomplan-consent', 'essential') } catch { /* ignore */ }
    const w = window as unknown as { __ga: unknown[]; gtag: (...a: unknown[]) => void }
    w.__ga = []
    w.gtag = (...a) => { w.__ga.push(JSON.parse(JSON.stringify(a))) }
  })
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => {
    ;(window as unknown as { __stay22Clicks: number }).__stay22Clicks = 0
    window.addEventListener('click', e => {
      const a = (e.target as Element).closest?.('a[href]')
      if (!a) return
      ;(window as unknown as { __stay22Clicks: number }).__stay22Clicks++
      e.preventDefault(); e.stopImmediatePropagation() // takes the click over, like Stay22
    }, true)
  })
}
// The stub above collects gtag calls; when a build carries the real GA tag (it redefines gtag) the calls are in dataLayer.
const hotelEvents = async (page: Page) =>
  (await page.evaluate(() => {
    const w = window as unknown as { __ga: unknown[][]; dataLayer?: ArrayLike<unknown>[] }
    const fromDl = (w.dataLayer ?? []).map(a => Array.prototype.slice.call(a) as unknown[])
    return [...w.__ga, ...fromDl]
  }))
    .filter(a => a[0] === 'event' && a[1] === 'partner_link_click' && (a[2] as { link_name?: string }).link_name === 'hotel_booking')
    .map(a => a[2] as Record<string, unknown>)

test('/hoteles: the booking click is recorded once, params unchanged, even when a script takes the click', async ({ page }) => {
  await open(page, '/es/hoteles')
  await page.locator('[data-hotel="nizuc-resort-spa"] a[rel~="sponsored"]').click()
  expect(await page.evaluate(() => (window as unknown as { __stay22Clicks: number }).__stay22Clicks)).toBe(1)
  expect(await hotelEvents(page)).toEqual([expect.objectContaining({
    link_name: 'hotel_booking', section: 'hotels_index', hotel_id: 'nizuc-resort-spa', position: 1, lang: 'es',
    partner_slug: 'booking', provider: 'booking', destination_slug: 'cancun',
  })])
})

test('/hoteles: a hotel deep in the list reports its position in the list', async ({ page }) => {
  await open(page, '/es/hoteles')
  await page.locator('[data-hotel="le-bambou-gorilla-lodge"] a[rel~="sponsored"]').click()
  expect(await hotelEvents(page)).toEqual([expect.objectContaining({ hotel_id: 'le-bambou-gorilla-lodge', position: 91, section: 'hotels_index' })])
})

for (const [path, lang, key] of [['/es/guias/roma', 'es', 'roma'], ['/en/guides/rome', 'en', 'roma']] as const) {
  test(`guide hotel link (${lang}): guide_hotels with the guide key, language and position`, async ({ page }) => {
    await open(page, path)
    await page.locator('[data-hotel="book-link"]').first().click()
    expect(await page.evaluate(() => (window as unknown as { __stay22Clicks: number }).__stay22Clicks)).toBe(1)
    expect(await hotelEvents(page)).toEqual([expect.objectContaining({
      link_name: 'hotel_booking', section: 'guide_hotels', destination_slug: key, lang, position: 1, hotel_id: 'casa-monti-roma',
    })])
  })
}
