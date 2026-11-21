/**
 * e2e/design-system.spec.ts
 *
 * /dev/design (the design style guide): noindex, renders every section, its PageTitle equals the live /guias
 * H1 (so the foundation cannot drift from the canon page), and the FilterPanel is the inline panel on desktop
 * and a "Filtros (n)" bottom sheet on mobile.
 */
import { test, expect } from '@playwright/test'

test('the style guide is noindex (header + meta) and shows every section', async ({ page }) => {
  const res = await page.goto('/dev/design')
  expect(res?.status()).toBe(200)
  expect(res?.headers()['x-robots-tag']).toContain('noindex')
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
  for (const name of ['Tokens', 'Typography', 'Buttons', 'Cards', 'Chips and tags', 'Inputs', 'FilterPanel']) {
    await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible()
  }
})

test('the colour swatches read live values from the CSS variables', async ({ page }) => {
  await page.goto('/dev/design?embed=1')
  await expect(page.locator('[data-swatch="pine"]').locator('xpath=following-sibling::div')).toContainText('#0F3A33')
  await expect(page.locator('[data-swatch="cream"]').locator('xpath=following-sibling::div')).toContainText('#FFF9F3')
})

test('PageTitle, H2 and eyebrow have the same computed style as /guias', async ({ page }) => {
  const read = () => page.evaluate(() => {
    const cs = (e: Element) => { const s = getComputedStyle(e); return { fontSize: s.fontSize, fontWeight: s.fontWeight, letterSpacing: s.letterSpacing, lineHeight: s.lineHeight, color: s.color } }
    const h1 = document.querySelector('h1')!
    // the section H2 (not a card title: the featured card's title is an h2 too)
    const h2 = [...document.querySelectorAll('h2')].find(e => (e as HTMLElement).offsetHeight > 0 && !e.closest('[data-card="destination"]'))!
    return { h1: cs(h1), h2: cs(h2) }
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/es/guias')
  const guias = await read()
  await page.goto('/dev/design')
  // the guide's own H2 is "Tokens"; its H1 is the PageTitle
  const guide = await page.evaluate(() => {
    const cs = (e: Element) => { const s = getComputedStyle(e); return { fontSize: s.fontSize, fontWeight: s.fontWeight, letterSpacing: s.letterSpacing, lineHeight: s.lineHeight, color: s.color } }
    return { h1: cs(document.querySelector('h1')!), h2: cs([...document.querySelectorAll('h2')].find(e => e.textContent === 'Tokens')!) }
  })
  expect(guide.h1).toEqual(guias.h1)
  expect(guide.h2).toEqual(guias.h2)
})

test.describe('FilterPanel on desktop', () => {
  test.use({ viewport: { width: 1280, height: 900 } })
  test('chips are inline, there is no Filtros button', async ({ page }) => {
    await page.goto('/dev/design?embed=1')
    await page.locator('#filters').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-filter="inline"]').getByRole('button', { name: 'Europa' })).toBeVisible()
    await expect(page.locator('[data-filter="mobile"]')).toBeHidden()
  })
})

test.describe('FilterPanel on mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })
  test('Filtros opens a bottom sheet with a live result count; Limpiar clears; Esc closes', async ({ page }) => {
    await page.goto('/dev/design?embed=1')
    await page.locator('#filters').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-filter="inline"]')).toBeHidden()
    await page.getByRole('button', { name: /^Filtros$/ }).click()
    const sheet = page.getByRole('dialog', { name: 'Filtros' })
    await expect(sheet).toBeVisible()
    await expect(sheet.getByRole('button', { name: 'Ver 10 resultados' })).toBeVisible()
    await sheet.getByRole('button', { name: 'Europa' }).click()
    await expect(sheet.getByRole('button', { name: 'Ver 2 resultados' })).toBeVisible()
    await sheet.getByRole('button', { name: 'Limpiar' }).click()
    await expect(sheet.getByRole('button', { name: 'Ver 10 resultados' })).toBeVisible()
    // "Limpiar" just became disabled; in some browsers that drops focus to <body>. Esc must still close the sheet.
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()
    // the button now reflects nothing selected and is focusable again
    await expect(page.getByRole('button', { name: /^Filtros$/ })).toBeFocused()
  })
  test('the active count shows on the button and as removable chips', async ({ page }) => {
    await page.goto('/dev/design?embed=1')
    await page.locator('#filters').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /^Filtros$/ }).click()
    const sheet = page.getByRole('dialog')
    await sheet.getByRole('button', { name: 'Asia' }).click()
    await sheet.getByRole('button', { name: 'Pareja' }).click()
    await sheet.getByRole('button', { name: /Ver \d+ resultados/ }).click()
    await expect(page.getByRole('button', { name: 'Filtros (2)' })).toBeVisible()
    await page.getByRole('button', { name: 'Quitar asia' }).click()
    await expect(page.getByRole('button', { name: 'Filtros (1)' })).toBeVisible()
  })
})
