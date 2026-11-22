/**
 * e2e/design-system.spec.ts
 *
 * /dev/design (the design style guide): noindex, renders every section, and the foundation matches HOME:
 *  - for each "matches home" pair, the component's computed style equals the style of home's real markup
 *    shown next to it (font, size, weight, tracking, colour, background, border, radius, shadow, padding)
 *  - the home side itself equals the live home page (/es), so the side-by-side cannot drift from the canon
 *  - FilterPanel: inline panel on desktop, "Filtros (n)" bottom sheet on mobile
 */
import { test, expect, type Page } from '@playwright/test'

const PROPS = ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'color', 'backgroundColor', 'borderTopWidth', 'borderTopColor', 'borderTopLeftRadius', 'boxShadow', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'textTransform', 'height']

// [pair id, selector inside home side, selector inside component side, extra props to skip]
const PAIRS: Array<[string, string, string, string[]?]> = [
  ['eyebrow', 'span', 'p'],
  ['h1', 'h1', 'h1'],
  ['lede', 'p', 'p'],
  ['h2', 'h2', 'h2'],
  ['h2xl', 'h2', 'h2'],
  ['body', 'p', 'p'],
  ['btn-solid', 'a', 'a'],
  ['btn-outline', 'a', 'a'],
  ['guide-card', 'a > div:last-child', 'article > div:last-child'],
  ['guide-card', 'h3', 'h3'],
  ['guide-card', 'p', 'p'],
  ['review-card', ':scope > div', '[data-card="info"]'],
  ['form-card', ':scope > div', '[data-card="info"]', ['height']],
  ['chip-sm', 'button:nth-child(1)', 'button:nth-child(1)'],
  ['chip-sm', 'button:nth-child(2)', 'button:nth-child(2)'],
  ['field', 'input', 'input'],
  ['field-soft', 'input', 'input', ['height']],
  ['textarea', 'textarea', 'textarea', ['height']],
]

// The font stacks end differently (".., sans-serif" vs ".., Manrope, system-ui, sans-serif") after the same loaded
// Manrope files; compare the stack up to the fallback face.
// (A border with no width has no colour that matters.)
const norm = (o: Record<string, string>) => ({ ...o, fontFamily: o.fontFamily.split(', "Manrope Fallback"')[0], borderTopColor: o.borderTopWidth === '0px' ? '' : o.borderTopColor })

async function styleOf(page: Page, root: string, sel: string) {
  return norm(await page.evaluate(({ root, sel, props }) => {
    const side = document.querySelector(root)!
    const el = sel.startsWith(':scope') ? (side.firstElementChild as Element) : side.querySelector(sel)!
    if (sel === 'a > div:last-child' || sel === 'article > div:last-child') {
      // the card body, below the image
      const card = side.querySelector(sel.split(' ')[0])!
      const body = card.lastElementChild!
      const s = getComputedStyle(body); return Object.fromEntries(props.map(k => [k, (s as any)[k]]))
    }
    const s = getComputedStyle(el)
    return Object.fromEntries(props.map(k => [k, (s as any)[k]]))
  }, { root, sel, props: PROPS }))
}

test('the style guide is noindex (header + meta) and shows every section', async ({ page }) => {
  const res = await page.goto('/dev/design')
  expect(res?.status()).toBe(200)
  expect(res?.headers()['x-robots-tag']).toContain('noindex')
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/)
  for (const name of ['Home vs components', 'Tokens', 'Typography', 'Buttons', 'Cards', 'Chips and tags', 'Inputs', 'FilterPanel (derived)']) {
    await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible()
  }
})

test('the colour swatches read live values from the CSS variables', async ({ page }) => {
  await page.goto('/dev/design')
  await expect(page.locator('[data-swatch="pine"]').locator('xpath=following-sibling::div')).toContainText('#0F3A33')
  await expect(page.locator('[data-swatch="ink-body"]').locator('xpath=following-sibling::div')).toContainText('#3E5F58')
})

test.describe('components match home (desktop)', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('every "matches home" pair has equal computed styles', async ({ page }) => {
    await page.goto('/dev/design')
    for (const [id, homeSel, compSel, skip = []] of PAIRS) {
      const home = await styleOf(page, `[data-pair="${id}"] [data-side="home"]`, homeSel)
      const comp = await styleOf(page, `[data-pair="${id}"] [data-side="component"]`, compSel)
      for (const k of skip) { delete (home as any)[k]; delete (comp as any)[k] }
      expect(comp, `${id} ${homeSel}`).toEqual(home)
    }
  })

  test('the pairs marked "matches home" are exactly the ones compared here', async ({ page }) => {
    await page.goto('/dev/design')
    const matched = await page.$$eval('[data-pair]', els => els.filter(e => e.querySelector('[data-status="match"]')).map(e => e.getAttribute('data-pair')))
    const compared = new Set(PAIRS.map(p => p[0]))
    expect(matched.filter(id => !compared.has(id!))).toEqual([])
  })

  test('home\'s side equals the live home page', async ({ page }) => {
    await page.goto('/dev/design')
    const pick = (root: string, sel: string) => styleOf(page, root, sel)
    const mine = {
      h1: await pick('[data-pair="h1"] [data-side="home"]', 'h1'),
      eyebrow: await pick('[data-pair="eyebrow"] [data-side="home"]', 'span'),
      btnSolid: await pick('[data-pair="btn-solid"] [data-side="home"]', 'a'),
      btnOutline: await pick('[data-pair="btn-outline"] [data-side="home"]', 'a'),
    }
    await page.addInitScript(() => { try { localStorage.setItem('lagomplan-consent', 'essential') } catch { /* ignore */ } })
    await page.goto('/es')
    const live0 = await page.evaluate((props) => {
      const cs = (e: Element) => { const s = getComputedStyle(e); return Object.fromEntries(props.map(k => [k, (s as any)[k]])) }
      return {
        h1: cs(document.querySelector('h1')!),
        eyebrow: cs(document.querySelector('main .sec-label')!),
        btnSolid: cs(document.querySelector('main a.btn-solid')!),
        btnOutline: cs(document.querySelector('main a.btn-outline')!),
      }
    }, PROPS)
    const live = Object.fromEntries(Object.entries(live0).map(([k, v]) => [k, norm(v as Record<string, string>)])) as typeof live0
    // widths/heights depend on the surrounding layout, not on the style
    for (const k of Object.keys(mine) as Array<keyof typeof mine>) { delete (mine[k] as any).height; delete (live[k] as any).height }
    expect(mine.h1).toEqual(live.h1)
    expect(mine.eyebrow).toEqual(live.eyebrow)
    expect(mine.btnSolid).toEqual(live.btnSolid)
    expect(mine.btnOutline).toEqual(live.btnOutline)
  })
})

test.describe('FilterPanel on desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })
  test('chips inline in a panel; selecting filters the results; the sheet button is hidden', async ({ page }) => {
    await page.goto('/dev/design')
    await page.locator('#filters').scrollIntoViewIfNeeded()
    const inline = page.locator('[data-filter="inline"]')
    await expect(inline).toBeVisible()
    await expect(page.locator('[data-filter="mobile"]')).toBeHidden()
    await expect(page.getByTestId('results')).toHaveText('10 experiencias')
    await inline.getByRole('button', { name: 'Europa' }).click()
    await expect(page.getByTestId('results')).toHaveText('2 experiencias')
    await inline.getByRole('button', { name: 'Europa' }).click()
    await expect(page.getByTestId('results')).toHaveText('10 experiencias')
  })
})

test.describe('FilterPanel on mobile', () => {
  test.use({ viewport: { width: 390, height: 780 } })
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
