/**
 * __tests__/demo-display-options.jest.test.tsx
 *
 * Renders the real GuiaClient for the two Host Me Tender demos and pins the
 * opt-in presentation options (demo.json guide.display):
 *   - host-me-tender-alejandro: neutral placeholder pill (label via --ph-label),
 *     no newsletter form, Book → Localbird, per-language prices
 *   - host-me-tender (the original): none of that — newsletter kept, no pill
 */
import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { getCity } from '../content/guia'
import { buildDemoPartner, getDemoProspect } from '../content/guia/demos'

const city = getCity('cdmx')!

beforeEach(() => {
  window.localStorage.clear()
  ;(global as any).fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }))
  ;(window as any).IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} }
})

async function renderDemo(slug: string, lang: 'es' | 'en') {
  const prospect = getDemoProspect(slug)!
  window.history.pushState({}, '', `/demo/${slug}?lang=${lang}`)
  let utils!: ReturnType<typeof render>
  await act(async () => {
    utils = render(<GuiaClient partner={buildDemoPartner(prospect)} city={city} demo={{ slug, prospectName: prospect.partner.name }} />)
  })
  return utils
}
const pageRoot = (c: HTMLElement) => c.firstElementChild as HTMLElement

describe('host-me-tender-alejandro', () => {
  test.each([['es', 'Por confirmar con Host Me Tender'], ['en', 'To confirm with Host Me Tender']] as const)('pill label (%s)', async (lang, label) => {
    const { container } = await renderDemo('host-me-tender-alejandro', lang)
    expect(pageRoot(container).style.getPropertyValue('--ph-label')).toBe(JSON.stringify(label))
    expect(pageRoot(container).className).toMatch(/phPill/)
    expect(container.querySelectorAll('mark').length).toBeGreaterThan(0) // placeholders still rendered, just restyled
  })

  test('newsletter form is hidden; the planner CTA stays', async () => {
    const { container } = await renderDemo('host-me-tender-alejandro', 'en')
    expect(container.querySelector('input[type="email"]')).toBeNull()
    expect(container.textContent).not.toMatch(/The Itinerary/)
    expect(screen.getByText('Plan my next trip →')).toBeInTheDocument()
  })

  test('every Book button goes to the Localbird experiences page; attribution line', async () => {
    const { container } = await renderDemo('host-me-tender-alejandro', 'en')
    const books = [...container.querySelectorAll('a')].filter((a) => /^Book$/.test(a.textContent ?? ''))
    expect(books).toHaveLength(4)
    books.forEach((a) => expect(a).toHaveAttribute('href', 'https://p.localbird.io/hostmetender/for-you'))
    expect(screen.getByText("Book through Host Me Tender's experiences page")).toBeInTheDocument()
    expect(container.textContent).not.toContain('Sabores México, our local partner')
  })

  test('4 tours = Localbird listings: title, duration, per-language price; no price placeholders left', async () => {
    const es = await renderDemo('host-me-tender-alejandro', 'es')
    for (const t of ['Colonia Roma Food Tour in Mexico City', 'Mexico City Historic Center Food Tour', 'Coyoacán Food Tour in Mexico City', 'Mexico City Taco Mezcal Tour']) {
      expect(es.container.textContent).toContain(t)
    }
    expect(es.container.textContent).toContain('Desde $115 en Localbird')
    expect(es.container.textContent).toContain('Desde $110 en Localbird')
    expect(es.container.textContent).toContain('Desde $135 en Localbird')
    expect(es.container.textContent).toContain('4 horas, 6 paradas')
    expect(es.container.textContent).toContain('4 horas, 8 paradas')
    expect(es.container.textContent).not.toMatch(/Centro Histórico: 5 horas, \d+ paradas/) // no stop count where the listing states none
    expect(es.container.querySelectorAll('p[class*="tourPrice"] mark')).toHaveLength(0)
    es.unmount()
    const en = await renderDemo('host-me-tender-alejandro', 'en')
    expect(en.container.textContent).toContain('From $115 on Localbird')
    expect(en.container.textContent).toContain('From $110 on Localbird')
    expect(en.container.textContent).toContain('3.5 hours')
    expect(en.container.textContent).not.toContain('Desde $')
  })

  test('all 4 tours show their image (Centro keeps exp-hmt-tour-2); no image placeholder', async () => {
    const { container } = await renderDemo('host-me-tender-alejandro', 'en')
    const srcs = [...container.querySelectorAll('img[src*="/images/guia/experiences/"]')].map((i) => i.getAttribute('src'))
    expect(srcs).toEqual(['/images/guia/experiences/exp-hmt-tour-3.jpg', '/images/guia/experiences/exp-hmt-tour-2.jpg', '/images/guia/experiences/exp-hmt-tour-1.jpg', '/images/guia/experiences/exp-tacos.jpg'])
    expect(container.querySelectorAll('[class*="expImgPlaceholder"]')).toHaveLength(0)
  })

  test.each([['es', 'Reserva tu traslado al aeropuerto en la página de experiencias de Host Me Tender'], ['en', "Book your airport transfer on Host Me Tender's experiences page"]] as const)(
    'Transportation card links to Localbird, not Insider (%s)', async (lang, linkText) => {
      const { container } = await renderDemo('host-me-tender-alejandro', lang)
      const card = [...container.querySelectorAll('#practico h4')].find((h) => /Transporte|Transportation/.test(h.textContent ?? ''))!.parentElement!
      const a = card.querySelector('a')!
      expect(a.textContent).toBe(linkText)
      expect(a).toHaveAttribute('href', 'https://p.localbird.io/hostmetender/for-you')
      expect(card.textContent).not.toMatch(/Insider/)
    })

  test.each(['es', 'en'] as const)('no Livin / Insider / WhatsApp reference anywhere in the page (%s)', async (lang) => {
    const { container } = await renderDemo('host-me-tender-alejandro', lang)
    // Open every card group so all practical cards are in the DOM.
    for (const b of [...container.querySelectorAll('#practico button')]) { await act(async () => { (b as HTMLElement).click() }); collectLeaks(container) }
    for (const tab of screen.getAllByRole('tab')) { await act(async () => { (tab as HTMLElement).click() }); collectLeaks(container) }
    expect(collectLeaks(container)).toEqual([])
    expect(leaks).toEqual([])
  })
})

const LEAK = /livin|insider|wa\.me|whatsapp\.com|\b52\d{10}\b|veracruz\s*85|casa ancestras|adán|di monaco/i
const leaks: string[] = []
function collectLeaks(c: HTMLElement): string[] {
  const out: string[] = []
  if (LEAK.test(c.textContent ?? '')) out.push('text: ' + (c.textContent ?? '').match(LEAK)![0])
  c.querySelectorAll('a[href]').forEach((a) => { if (LEAK.test(decodeURIComponent(a.getAttribute('href') ?? ''))) out.push('href: ' + a.getAttribute('href')) })
  leaks.push(...out)
  return out
}

describe('host-me-tender (original) is unaffected', () => {
  test('no pill, newsletter kept, original attribution and string prices', async () => {
    const { container } = await renderDemo('host-me-tender', 'en')
    expect(pageRoot(container).style.getPropertyValue('--ph-label')).toBe('')
    expect(pageRoot(container).className).not.toMatch(/phPill/)
    expect(container.querySelector('input[type="email"]')).not.toBeNull()
    expect(screen.getByText('Booked through Sabores México, our local partner.')).toBeInTheDocument()
    expect(container.querySelectorAll('p[class*="tourPrice"] mark')).toHaveLength(4)
  })
})
