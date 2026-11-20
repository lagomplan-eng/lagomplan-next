import { test, expect } from '@playwright/test'
import { gotoTrip, seedTrip, deleteTrip, captureWindowOpen } from '../support/helpers'
import { TRIP_ANONYMOUS } from '../fixtures/trips'

// The Reservar CTA with the Stay22 LetMeAllez script LOADED (E-24 covers it without).
//
// Once LetMeAllez has loaded it rewrites a stay22 anchor's href (its own params and a second
// `campaign`), sets target=_blank and handles the click on the anchor itself, before React. Our
// own handler then never ran and the click went out with LetMeAllez's campaign, not
// lagomplan-planner-es. Stay22Guard now takes the click for data-lma-managed anchors.
//
// The real script is not used: its load time from CI is what made E-24 flaky. This stub does
// the three things that matter, deterministically (verified against the real script in a
// browser when this was written).
const LMA_STUB = `
  window.__lmaHandled = 0
  function convert(a) {
    var u = new URL(a.href)
    var rewritten = 'https://www.stay22.com/allez/booking?aid=lagomplan&campaign=lagomplan-es-trip&lmaID=x&' + u.searchParams.toString()
    a.setAttribute('href', rewritten)
    a.setAttribute('target', '_blank')
    a.addEventListener('click', function (ev) {
      window.__lmaHandled++
      ev.stopImmediatePropagation(); ev.preventDefault()
      window.open(a.href, '_blank')
    })
  }
  var t = setInterval(function () {
    var a = document.querySelector('a[data-lma-managed]')
    if (a) { clearInterval(t); convert(a); window.__lmaStubReady = true }
  }, 20)
`

test.describe('mobile-view · hotel card · Stay22 script loaded', () => {
  const created: string[] = []
  test.afterEach(async () => { while (created.length) await deleteTrip(created.pop() as string) })

  test('Reservar opens our url (lagomplan-planner-es) even though the script took over the anchor', async ({ page }) => {
    const opened = await captureWindowOpen(page)
    await page.route('**://scripts.stay22.com/**', r => r.fulfill({ contentType: 'application/javascript', body: LMA_STUB }))
    const id = await seedTrip(TRIP_ANONYMOUS); created.push(id)
    await gotoTrip(page, id)

    const cta = page.getByRole('link', { name: /Reservar para este viaje/ })
    await expect(cta).toBeVisible()
    await page.waitForFunction(() => (window as any).__lmaStubReady === true)          // the script has converted the anchor
    expect(await cta.getAttribute('href')).toContain('campaign=lagomplan-es-trip')       // precondition: href really was rewritten
    await cta.evaluate(el => new Promise<void>(res => {                                // React has hydrated it
      const t = setInterval(() => { if (Object.keys(el).some(k => k.startsWith('__reactProps$'))) { clearInterval(t); res() } }, 25)
    }))

    await cta.click()
    await expect.poll(() => opened.all()).toHaveLength(1)
    const url = new URL((await opened.last()) as string)
    expect(url.hostname).toBe('www.stay22.com')
    expect(url.searchParams.getAll('campaign')).toEqual(['lagomplan-planner-es'])
    expect(url.searchParams.get('lmaID')).toBeNull()
    expect(await page.evaluate(() => (window as any).__lmaHandled)).toBe(0)             // the script never got the click
  })
})
