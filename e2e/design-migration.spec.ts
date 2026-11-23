/**
 * e2e/design-migration.spec.ts
 *
 * /guias and the guide pages moved onto the design foundation with no behaviour change:
 *  - /guias: same search + one-filter-at-a-time filtering; inline chips on desktop, "Filtros (n)" sheet on mobile
 *  - guide page: the first day is open, a closed day opens on click, the checklist ticks, the PDF button is there
 */
import { test, expect } from '@playwright/test'

const consent = async (page: import('@playwright/test').Page) =>
  page.addInitScript(() => { try { localStorage.setItem('lagomplan-consent', 'essential') } catch { /* ignore */ } })

test.describe('/guias filters', () => {
  test.beforeEach(async ({ page }) => { await consent(page); await page.goto('/es/guias') })

  test('desktop: chips filter one at a time, "Todos" resets, no "+ Más" toggle', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'desktop pattern')
    const count = page.getByText(/^\d+ destinos?$/)
    const all = Number((await count.textContent())!.match(/\d+/)![0])
    await expect(page.getByRole('button', { name: '+ Más' })).toHaveCount(0)
    const inline = page.locator('[data-filter="inline"]')
    await inline.getByRole('button', { name: 'Playa', exact: true }).click()
    await expect(inline.getByRole('button', { name: 'Playa', exact: true })).toHaveAttribute('aria-pressed', 'true')
    const beach = Number((await count.textContent())!.match(/\d+/)![0])
    expect(beach).toBeGreaterThan(0)
    expect(beach).toBeLessThan(all)
    await inline.getByRole('button', { name: 'Ciudad', exact: true }).click()
    await expect(inline.getByRole('button', { name: 'Playa', exact: true })).toHaveAttribute('aria-pressed', 'false')
    await inline.getByRole('button', { name: 'Todos', exact: true }).click()
    await expect(count).toHaveText(new RegExp(`^${all} destinos`))
  })

  test('search narrows the grid and clearing restores it', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: /Buscar destino/ })
    await search.fill('Oaxaca')
    await expect(page.getByText(/^1 destino$/)).toBeVisible()
    await search.fill('zzzz-no-match')
    await expect(page.getByText('No hay guías que coincidan con tu búsqueda.')).toBeVisible()
    await search.fill('')
    await expect(page.getByText(/^\d+ destinos$/)).toBeVisible()
  })

  test('mobile: "Filtros" opens the sheet, a chip filters live, Limpiar clears', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile pattern')
    await expect(page.locator('[data-filter="inline"]')).toBeHidden()
    await page.getByRole('button', { name: /^Filtros$/ }).click()
    const sheet = page.getByRole('dialog', { name: 'Filtros' })
    await sheet.getByRole('button', { name: 'Playa', exact: true }).click()
    await expect(sheet.getByRole('button', { name: /^Ver \d+ destinos?$/ })).toBeVisible()
    await sheet.getByRole('button', { name: 'Limpiar' }).click()
    await sheet.getByRole('button', { name: /^Ver \d+ destinos$/ }).click()
    await expect(sheet).toBeHidden()
    await expect(page.getByRole('button', { name: /^Filtros$/ })).toBeVisible()
  })
})

test.describe('guide page', () => {
  test.beforeEach(async ({ page }) => { await consent(page); await page.goto('/es/guias/roma') })

  test('hero: one H1, planner CTA and save/share/PDF actions', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Roma')
    await expect(page.locator('[data-guide="hero"] a[href*="planificador"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /Guardar PDF/ })).toBeVisible()
  })

  test('day 1 is open, a closed day opens on click', async ({ page }) => {
    const headers = page.locator('[data-day="header"]')
    await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'true')
    await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'false')
    await headers.nth(1).click()
    await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'true')
  })

  test('the checklist ticks and resets', async ({ page }) => {
    const first = page.locator('[data-check="item"]').first()
    await first.click()
    await expect(first).toHaveAttribute('aria-checked', 'true')
    await page.locator('[data-guide="checklist"]').getByRole('button', { name: 'Reset' }).click()
    await expect(first).toHaveAttribute('aria-checked', 'false')
  })
})
