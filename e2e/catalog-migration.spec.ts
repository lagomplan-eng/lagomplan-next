/**
 * e2e/catalog-migration.spec.ts
 *
 * /experiencias and /hoteles on the shared components, with no behaviour or analytics change:
 *  - filters narrow the list one group at a time, the URL is the state, "Todos" resets
 *  - lists are grouped by destination: one header card (illustration once) per destination, its items below
 *  - the destination search picks a destination (token + one header card)
 *  - desktop: inline rows in a panel; mobile: "Filtros (n)" opens a sheet with a live "Ver N resultados"
 *  - GA4: the same events and params as before (window.gtag is stubbed and read back)
 */
import { test, expect, type Page } from '@playwright/test'

type GaCall = [string, string, Record<string, unknown>?]

async function setup(page: Page, path: string) {
  await page.addInitScript(() => {
    try { localStorage.setItem('lagomplan-consent', 'essential') } catch { /* ignore */ }
    const w = window as unknown as { __ga: unknown[]; gtag: (...a: unknown[]) => void }
    w.__ga = []
    w.gtag = (...a) => { w.__ga.push(JSON.parse(JSON.stringify(a))) }
    // let handlers run, but never leave the page
    document.addEventListener('click', e => { if ((e.target as Element).closest?.('a')) e.preventDefault() }, true)
  })
  await page.goto(path)
  await page.waitForLoadState('networkidle') // handlers attach on hydration
}
const events = async (page: Page, name: string) =>
  (await page.evaluate(() => (window as unknown as { __ga: GaCall[] }).__ga)).filter(a => a[0] === 'event' && a[1] === name).map(a => a[2] ?? {})

async function chip(page: Page, isMobile: boolean, name: string) {
  if (isMobile) await page.getByRole('button', { name: /^Filtros/ }).click()
  await page.getByRole('button', { name, exact: true }).first().click()
  if (isMobile) await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
}
const count = (page: Page) => page.locator('p[aria-live="polite"]').first()

test.describe('/experiencias', () => {
  test('filters, URL state, reset, GA4', async ({ page, isMobile }) => {
    await setup(page, '/es/experiencias')
    await expect(count(page)).toContainText('88 experiencias')
    await expect.poll(() => events(page, 'experience_list_view')).toEqual([{ lang: 'es', experiences_total: 88 }])

    await chip(page, !!isMobile, 'México')
    await expect(count(page)).not.toContainText('88 experiencias')
    expect(page.url()).toContain('region=mexico')
    expect(await events(page, 'experience_filter')).toEqual([expect.objectContaining({ lang: 'es', filter_group: 'region', filter_value: 'mexico' })])

    await chip(page, !!isMobile, 'Pareja')
    expect(page.url()).toContain('para=pareja')
    await chip(page, !!isMobile, 'México')
    await chip(page, !!isMobile, 'Pareja')
    await expect(count(page)).toContainText('88 experiencias')
    expect(page.url()).not.toContain('region=')
    const groups = (await events(page, 'experience_filter')).map(e => `${e.filter_group}:${e.filter_value}`)
    expect(groups).toEqual(['region:mexico', 'para:pareja', 'region:(cleared)', 'para:(cleared)'])
  })

  test('grouped by destination: one header card each, items below, positions are the overall index', async ({ page }) => {
    await setup(page, '/es/experiencias')
    const headers = await page.locator('[data-destination]').evaluateAll(els => els.map(e => e.getAttribute('data-destination')))
    expect(headers.length).toBeGreaterThan(10)
    expect(new Set(headers).size).toBe(headers.length) // each illustration once
    expect(await page.locator('[data-experience]').count()).toBe(88)
    // every experience sits inside its destination's section; items have no image of their own
    expect(await page.locator('section[aria-label] [data-experience] img').count()).toBe(0)
    // position = index in the overall visible list, whatever the grouping
    await page.locator('[data-experience="parque-xcaret"] a[href*="getyourguide"]').click()
    expect(await events(page, 'partner_link_click')).toEqual([expect.objectContaining({ experience_id: 'parque-xcaret', position: 1 })])
  })

  test('search picks a destination: token, one header card, event', async ({ page }) => {
    await setup(page, '/es/experiencias')
    await page.getByRole('combobox').fill('Oax')
    await page.locator('ul[id] button').first().click()
    await expect(page.locator('[data-destination]')).toHaveCount(1)
    await expect(page.locator('[data-destination="oaxaca"]')).toBeVisible()
    expect(page.url()).toContain('destino=oaxaca')
    expect(await events(page, 'experience_filter')).toEqual([expect.objectContaining({ filter_group: 'destino', filter_value: 'oaxaca' })])
  })

  test('the header card filters by its destination', async ({ page }) => {
    await setup(page, '/es/experiencias')
    await page.locator('[data-destination="cancun"]').getByRole('button', { name: /^Ver experiencias en / }).click()
    expect(page.url()).toContain('destino=cancun')
    await expect(page.locator('[data-destination]')).toHaveCount(1)
    await expect(page.locator('[data-destination="cancun"]').getByRole('button')).toHaveCount(0)
  })

  test('card actions keep their events', async ({ page }) => {
    await setup(page, '/es/experiencias')
    const card = page.locator('[data-experience="parque-xcaret"]')
    await card.locator('a[href*="getyourguide"]').click()
    await card.getByRole('link', { name: /Ver guía/ }).click()
    expect(await events(page, 'partner_link_click')).toEqual([expect.objectContaining({ link_name: 'gyg_experience', section: 'experience_hub', position: 1, provider: 'gyg', experience_id: 'parque-xcaret' })])
    expect(await events(page, 'experience_guide_click')).toEqual([expect.objectContaining({ position: 1 })])
    await page.locator('main a[href*="planificador"]').filter({ hasText: 'Planear mi viaje' }).first().click()
    expect(await events(page, 'planner_cta_click')).toHaveLength(1)
  })

  test('desktop panel / mobile sheet', async ({ page, isMobile }) => {
    await setup(page, '/es/experiencias')
    if (isMobile) {
      await expect(page.locator('[data-filter="inline"]')).toBeHidden()
      await page.getByRole('button', { name: /^Filtros/ }).click()
      const sheet = page.getByRole('dialog', { name: 'Filtros' })
      await sheet.getByRole('button', { name: 'México', exact: true }).click()
      await expect(sheet.getByRole('button', { name: /^Ver \d+ resultados$/ })).toBeVisible()
      await sheet.getByRole('button', { name: 'Limpiar' }).click()
      await expect(sheet.getByRole('button', { name: 'Ver 88 resultados' })).toBeVisible()
    } else {
      await expect(page.locator('[data-filter="inline"]')).toBeVisible()
      await expect(page.getByRole('button', { name: /^Filtros/ })).toBeHidden()
    }
  })
})

test.describe('/hoteles', () => {
  test('filters, URL state, reset, GA4', async ({ page, isMobile }) => {
    await setup(page, '/es/hoteles')
    await expect(count(page)).toContainText('186 hoteles')
    await chip(page, !!isMobile, '$$ · Intermedio')
    expect(page.url()).toContain('precio=')
    await chip(page, !!isMobile, 'Parejas')
    await chip(page, !!isMobile, '$$ · Intermedio')
    await chip(page, !!isMobile, 'Parejas')
    await expect(count(page)).toContainText('186 hoteles')
    const groups = (await events(page, 'hotel_filter')).map(e => `${e.filter_group}:${e.filter_value}`)
    expect(groups).toEqual(['precio:intermedio', 'viajero:parejas', 'precio:(cleared)', 'viajero:(cleared)'])
  })

  test('grouped by destination; a hotel deep in the list reports its overall position', async ({ page }) => {
    await page.route(/stay22/i, r => r.abort())
    await setup(page, '/es/hoteles')
    const headers = await page.locator('[data-destination]').evaluateAll(els => els.map(e => e.getAttribute('data-destination')))
    expect(new Set(headers).size).toBe(headers.length)
    const ids = await page.locator('[data-hotel]').evaluateAll(els => els.map(e => e.getAttribute('data-hotel')))
    expect(ids.length).toBe(186)
    await page.locator('[data-hotel="le-bambou-gorilla-lodge"] a', { hasText: 'Ver disponibilidad' }).click()
    expect(await events(page, 'partner_link_click')).toEqual([expect.objectContaining({ hotel_id: 'le-bambou-gorilla-lodge', position: 91 })])
  })

  test('search picks a destination; booking keeps its event', async ({ page }) => {
    // The Stay22 affiliate script rewrites hotel links and takes over their clicks when it loads (as in CI);
    // this test is about the card's own handler, so keep the third party out.
    await page.route(/stay22/i, r => r.abort())
    await setup(page, '/es/hoteles')
    await page.getByRole('combobox').fill('Canc')
    await page.locator('ul[id] button').first().click()
    expect(page.url()).toContain('destino=cancun')
    await page.locator('[data-hotel="nizuc-resort-spa"] a', { hasText: 'Ver disponibilidad' }).click()
    expect(await events(page, 'partner_link_click')).toEqual([expect.objectContaining({ link_name: 'hotel_booking', section: 'hotels_index', position: 1, hotel_id: 'nizuc-resort-spa' })])
  })
})
