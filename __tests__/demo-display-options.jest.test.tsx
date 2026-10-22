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

  test('prices: confirmed ones are per-language, the rest stay placeholders', async () => {
    const es = await renderDemo('host-me-tender-alejandro', 'es')
    expect(es.container.textContent).toContain('Desde $115 en Localbird')
    expect(es.container.textContent).toContain('Desde $135 en Localbird')
    expect(es.container.textContent).not.toContain('From $115')
    expect(es.container.querySelectorAll('p[class*="tourPrice"] mark')).toHaveLength(2)
    es.unmount()
    const en = await renderDemo('host-me-tender-alejandro', 'en')
    expect(en.container.textContent).toContain('From $115 on Localbird')
    expect(en.container.textContent).not.toContain('Desde $115')
  })
})

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
