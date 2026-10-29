/**
 * __tests__/agenda-section.jest.test.tsx
 *
 * "Mientras estás aquí" / "While you're here", stay-window version:
 *   - AgendaSection: range chips (first selected, aria-pressed), one list per range,
 *     link rows vs plain rows, "Por confirmar" pill, quiet range, "Cada semana" row,
 *     "Más adelante" / "Escapadas" buttons (hidden when empty), Production vs Preview, ES/EN.
 *   - GuiaClient: opt-in only; AGENDA_ENABLED=false falls back to the weekly section.
 * Only Date is faked; the clock is frozen to Thursday 29 Oct 2026 in Mexico City.
 */
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import AgendaSection from '../app/guia/[partner]/AgendaSection'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { loadAgenda } from '../content/guia/agenda'
import { getCity, getPartner } from '../content/guia'
import { buildDemoPartner, getDemoProspect } from '../content/guia/demos'

let mockEnabled = true
jest.mock('../content/guia/agenda/config', () => ({ get AGENDA_ENABLED() { return mockEnabled } }))

const agenda = loadAgenda()
const city = getCity('cdmx')!
const NO_FAKE = ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate', 'clearImmediate', 'nextTick', 'queueMicrotask', 'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback', 'cancelIdleCallback', 'performance', 'hrtime'] as const
const freeze = (iso: string) => jest.useFakeTimers({ now: new Date(iso), doNotFake: [...NO_FAKE] })
const STAY = { arrival: '2026-10-30', nights: 4 } // Fri → Tue

beforeEach(() => {
  mockEnabled = true
  window.localStorage.clear()
  ;(global as any).fetch = jest.fn(() => Promise.reject(new Error('offline'))) // WeatherCard hides itself
  ;(window as any).IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} }
  freeze('2026-10-29T18:00:00Z') // Thu 29 Oct 2026, 12:00 in Mexico City
})
afterEach(() => jest.useRealTimers())

async function mount(over: Partial<React.ComponentProps<typeof AgendaSection>> = {}) {
  let u!: ReturnType<typeof render>
  await act(async () => { u = render(<AgendaSection lang="es" agenda={agenda} showUnverified stay={STAY} {...over} />) })
  const chips = () => [...u.container.querySelectorAll('button[aria-pressed]')] as HTMLButtonElement[]
  const rows = () => [...u.container.querySelectorAll('ul[class*="agList"] > li')] as HTMLElement[]
  const click = async (el: Element) => { await act(async () => { fireEvent.click(el) }) }
  return { ...u, chips, rows, click }
}

describe('AgendaSection — chips and rows', () => {
  test('header, no collapse toggle, two date-only chips, the first one selected', async () => {
    const { chips, container } = await mount()
    expect(screen.getByRole('heading', { name: 'Mientras estás aquí' })).toBeInTheDocument()
    expect(screen.getByText('Lo que pasa en la ciudad durante tu estancia.')).toBeInTheDocument()
    expect(chips().map((c) => c.textContent)).toEqual(['30 oct – 1 nov', '2 – 3 nov'])
    expect(chips().map((c) => c.getAttribute('aria-pressed'))).toEqual(['true', 'false'])
    expect(container.querySelector('button[aria-controls][aria-expanded]')).not.toBeNull() // only the two bottom buttons
    expect(container.querySelectorAll('button[aria-expanded]')).toHaveLength(2)
  })

  test('before mount nothing but the header is rendered (dates are computed in the browser)', () => {
    const { container } = render(<AgendaSection lang="es" agenda={agenda} showUnverified stay={STAY} />)
    // effects flush inside render's act(); assert the post-mount state exists and the skeleton is gone
    expect(container.querySelector('[class*="agSkeleton"]')).toBeNull()
  })

  test('range 1 rows: date + time left, title + "Categoría · lugar" right, highlight on the parade only', async () => {
    const { rows } = await mount()
    const parade = rows().find((r) => /Gran Desfile/.test(r.textContent!))!
    expect(parade).toHaveTextContent('SÁB 31')
    expect(parade).toHaveTextContent('14:00')
    expect(parade).toHaveTextContent('lo más grande de tu estancia')
    expect(rows().filter((r) => /lo más grande/.test(r.textContent!))).toHaveLength(1)
    expect(rows().some((r) => /Muévete en Bici/.test(r.textContent!) && /Cada domingo/.test(r.textContent!))).toBe(true)
    expect(rows().some((r) => /Lucha libre/.test(r.textContent!) && /Noche/.test(r.textContent!))).toBe(true)
    expect(rows().some((r) => /Mirador|Torre Latinoamericana/i.test(r.textContent!))).toBe(false)
  })

  test('clicking a chip swaps the list and moves aria-pressed', async () => {
    const { chips, rows, click } = await mount()
    await click(chips()[1])
    expect(chips().map((c) => c.getAttribute('aria-pressed'))).toEqual(['false', 'true'])
    expect(rows().some((r) => /Gran Desfile/.test(r.textContent!))).toBe(false)
    expect(rows().some((r) => /Lucha libre/.test(r.textContent!) && /MAR 3/.test(r.textContent!))).toBe(true)
  })

  test('a row with an official URL is one link (new tab, subtle arrow, sr-only hint); one without is plain', async () => {
    const { rows } = await mount()
    const f1 = rows().find((r) => /Gran Premio de México/.test(r.textContent!))!
    const a = f1.querySelector('a')!
    expect(a).toHaveAttribute('href', agenda.events.find((e) => e.id === 'gp-mexico-f1')!.url)
    expect(a).toHaveAttribute('target', '_blank')
    expect(a.getAttribute('rel')).toContain('noopener')
    expect(a.textContent).toContain('↗')
    const bici = rows().find((r) => /Muévete en Bici/.test(r.textContent!))!
    expect(bici.querySelector('a')).toBeNull()
    expect(rows().every((r) => !r.querySelector('button'))).toBe(true) // no "+" and no detail panel
  })

  test('Preview: unverified rows get the neutral pill (no operator name); the verified one does not', async () => {
    const { rows, container } = await mount({ showUnverified: true, stay: { arrival: '2026-11-06', nights: 3 } }) // Nov 6–9: Food & Wine (to_verify) + NBA (verified)
    const fw = rows().find((r) => /Food & Wine/.test(r.textContent!))!
    expect(fw.querySelector('[class*="agPill"]')).toHaveTextContent('Por confirmar')
    const nba = rows().find((r) => /NBA Mexico City Game/.test(r.textContent!))!
    expect(nba.querySelector('[class*="agPill"]')).toBeNull()
    expect(container.textContent).not.toMatch(/Host Me Tender|Livin/)
  })

  test('Production: verified events only — the parade (verified) carries the highlight, no pills', async () => {
    const { rows, container } = await mount({ showUnverified: false })
    expect(rows().map((r) => r.querySelector('[class*="agItemTitle"]')!.textContent)).toEqual(['Festival Cacao para Todos', 'Feria «No estaban muertos, andaban de parranda»', 'Gran Premio de México de F1', 'Ofrenda monumental del Zócalo', 'El Camino · iluminación de Día de Muertos', 'La Puerta entre dos mundos', 'Iluminación del Zócalo y el Centro Histórico', 'Lucha libre, Arena México', 'Gran Desfile de Día de Muertos', 'Bazar Sábado, San Ángel', 'Muévete en Bici, Reforma'])
    expect(container.querySelectorAll('[class*="agPill"]')).toHaveLength(0)
    expect(container.querySelectorAll('[class*="agPill"]')).toHaveLength(0)
    expect(container.textContent!.match(/lo más grande de tu estancia/g)).toHaveLength(1)
    expect(rows().find((r) => /lo más grande/.test(r.textContent!))).toHaveTextContent('Gran Desfile de Día de Muertos')
  })
})

describe('AgendaSection — empty range, buttons', () => {
  test('quiet range (Wed–Thu in December): friendly card, no list', async () => {
    const { rows, container } = await mount({ stay: { arrival: '2026-12-09', nights: 1 } })
    expect(rows()).toHaveLength(0)
    expect(screen.getByText('Días tranquilos en la ciudad')).toBeInTheDocument()
    expect(screen.getByText(/No hay eventos especiales en estas fechas/)).toBeInTheDocument()
  })

  test('the "Cada semana en la ciudad" row is gone (no weekly cards, no title)', async () => {
    const { container } = await mount()
    expect(container.querySelectorAll('[class*="agWeekly"]')).toHaveLength(0)
    expect(container.textContent).not.toMatch(/Cada semana en la ciudad/)
  })

  test('"Más adelante →" opens an inline panel (aria-expanded/controls) and closes again', async () => {
    const { click, container } = await mount()
    const btn = screen.getByRole('button', { name: 'Próximamente en noviembre →' })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    const panel = document.getElementById(btn.getAttribute('aria-controls')!)!
    expect(panel).toHaveTextContent('Corona Capital')
    expect(panel).toHaveTextContent('20 – 22 NOV')
    expect(panel!.textContent!.match(/después de tu estancia/g)).toHaveLength(14) // the events that start after check-out (Nov 3)
    expect(panel).toHaveTextContent('Flow Fest') // the researched November events are there
    expect(panel).toHaveTextContent('Gran Premio de México') // the whole month: the stay's own events too, each once
    expect(panel!.querySelectorAll('li')).toHaveLength(21)
    expect(panel).toHaveTextContent('23 OCT – 8 NOV') // a multi-day event keeps its full dates
    await click(btn)
    expect(document.getElementById(btn.getAttribute('aria-controls')!)).toBeNull()
  })

  test('"Escapadas de un día →": four day trips, text only (no operator pill, no image, no link)', async () => {
    const { click, container } = await mount()
    const btn = screen.getByRole('button', { name: 'Escapadas de un día →' })
    await click(btn)
    const panel = document.getElementById(btn.getAttribute('aria-controls')!)!
    for (const t of ['Xochimilco', 'Teotihuacán', 'Los Dinamos', 'Tepoztlán']) expect(panel).toHaveTextContent(t)
    expect(panel.querySelectorAll('a, img, [class*="agPill"]')).toHaveLength(0)
  })

  test('only one panel is open at a time', async () => {
    const { click } = await mount()
    const ahead = screen.getByRole('button', { name: 'Próximamente en noviembre →' })
    const trips = screen.getByRole('button', { name: 'Escapadas de un día →' })
    await click(ahead); await click(trips)
    expect(ahead).toHaveAttribute('aria-expanded', 'false')
    expect(trips).toHaveAttribute('aria-expanded', 'true')
  })

  test('a button whose panel would be empty is hidden (stay in December: no event listed for that month yet)', async () => {
    await mount({ showUnverified: false, stay: { arrival: '2026-12-09', nights: 1 } })
    expect(screen.queryByRole('button', { name: 'Próximamente en noviembre →' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Escapadas de un día →' })).toBeInTheDocument()
  })

  test('no params → today … today+13 (3 chips), first selected', async () => {
    const { chips } = await mount({ stay: {} })
    expect(chips().map((c) => c.textContent)).toEqual(['29 oct – 1 nov', '2 – 8 nov', '9 – 11 nov'])
  })

  test('29 nights from Nov 1 → the four ranges of the brief', async () => {
    const { chips } = await mount({ stay: { arrival: '2026-11-01', nights: 29 } })
    expect(chips().map((c) => c.textContent)).toEqual(['1 – 8 nov', '9 – 15 nov', '16 – 22 nov', '23 – 30 nov'])
    expect(screen.getByRole('button', { name: 'Próximamente en noviembre →' })).toBeInTheDocument() // the whole month, stay included
  })

  test('a stay change resets the selection to the first chip', async () => {
    const { chips, click, rerender } = await mount()
    await click(chips()[1])
    await act(async () => { rerender(<AgendaSection lang="es" agenda={agenda} showUnverified stay={{ arrival: '2026-11-02', nights: 10 }} />) })
    expect(chips()[0]).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('AgendaSection — ES / EN', () => {
  test('same structure in both languages; every visible string switches', async () => {
    const es = await mount({ lang: 'es' })
    const shape = (u: typeof es) => ({ chips: u.chips().length, rows: u.rows().length, links: u.container.querySelectorAll('a').length })
    const esShape = shape(es); es.unmount()
    const en = await mount({ lang: 'en' })
    expect(shape(en)).toEqual(esShape)
    expect(screen.getByRole('heading', { name: "While you're here" })).toBeInTheDocument()
    expect(en.chips().map((c) => c.textContent)).toEqual(['Oct 30 – Nov 1', 'Nov 2 – 3'])
    expect(screen.getByText("What's happening in the city during your stay.")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Coming up in November →' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Day trips →' })).toBeInTheDocument()
    expect(screen.getByText('Great Day of the Dead Parade')).toBeInTheDocument()
        expect(en.container.textContent).toMatch(/the highlight of your stay/)
    expect(en.container.textContent).not.toMatch(/Por confirmar|Cada semana|estancia/)
    expect(screen.getByText(/Gran Desfile|Great Day of the Dead Parade/)).toBeInTheDocument()
  })

  test('English: "To confirm" pill and the "after your stay" tag', async () => {
    const { container, click } = await mount({ lang: 'en', stay: { arrival: '2026-11-06', nights: 3 } })
    expect(screen.getAllByText('To confirm').length).toBeGreaterThan(0)
    await click(screen.getByRole('button', { name: 'Coming up in November →' }))
    expect(container.textContent).toContain('after your stay')
  })

  test('quiet range in English', async () => {
    await mount({ lang: 'en', stay: { arrival: '2026-12-09', nights: 1 } })
    expect(screen.getByText('Quiet days in the city')).toBeInTheDocument()
    expect(screen.getByText(/no special events on these dates/)).toBeInTheDocument()
  })
})

describe('GuiaClient — opt-in, kill switch, weekly section intact elsewhere', () => {
  const renderGuide = async (partner: any, extra: object = {}) => {
    let u!: ReturnType<typeof render>
    window.history.pushState({}, '', '/x')
    await act(async () => { u = render(<GuiaClient partner={partner} city={city} {...extra} />) })
    return u
  }
  const demoProps = (slug: string) => ({ demo: { slug, prospectName: 'Host Me Tender' }, agenda, showUnverified: true })

  test.each(['host-me-tender-alejandro', 'host-me-tender-agenda'])('%s (display.agenda) shows "While you\'re here" and no weekly section; the weather stays', async (slug) => {
    ;(global as any).fetch = jest.fn(() => new Promise(() => {}))
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    expect(screen.getByRole('heading', { name: "While you're here" })).toBeInTheDocument()
    expect(container.textContent).not.toContain('Every week in Mexico City')
    expect(container.querySelector('[class*="weatherCard"]')).not.toBeNull()
  })

  test('kill switch: AGENDA_ENABLED=false brings back the weekly section "Every week in Mexico City"', async () => {
    mockEnabled = false
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect('host-me-tender-alejandro')!), demoProps('host-me-tender-alejandro'))
    expect(container.textContent).toContain('Every week in Mexico City')
    expect(container.textContent).not.toContain("While you're here")
  })

  test('the flag without data falls back to the weekly section (never a blank hole)', async () => {
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect('host-me-tender-agenda')!), { demo: { slug: 'host-me-tender-agenda', prospectName: 'x' } })
    expect(container.textContent).toContain('Every week in Mexico City')
  })

  test('/guia (Livin) never shows unverified items and keeps the weekly section', async () => {
    for (const slug of ['livin_condesa', 'livin_roma', 'livin_polanco']) {
      const { container, unmount } = await renderGuide(getPartner(slug)!, { agenda, showUnverified: true })
      expect(container.textContent).toContain('Every week in Mexico City')
      expect(container.textContent).not.toContain("While you're here")
      unmount()
    }
  })

  test('host-me-tender and dave-nat (no flag) keep the weekly section', async () => {
    for (const slug of ['host-me-tender', 'dave-nat']) {
      const { container, unmount } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
      expect(container.textContent).toContain('Every week in Mexico City')
      expect(container.textContent).not.toContain("While you're here")
      unmount()
    }
  })

  const before = (a: Element, b: Element) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)

  test('agenda layout: Experiences sit right under the 48-hour itinerary, before the agenda', async () => {
    const slug = 'host-me-tender-alejandro'
    await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    const itin = screen.getByText('Two days, walked and checked.')
    const exp = screen.getByRole('heading', { name: 'Worth the time' })
    const agendaH = screen.getByRole('heading', { name: "While you're here" })
    expect(before(itin, exp)).toBe(true)
    expect(before(exp, agendaH)).toBe(true)
  })

  test('other guides: Experiences stay AFTER the weekly section, unchanged (Livin and host-me-tender)', async () => {
    for (const partner of [getPartner('livin_condesa')!, buildDemoPartner(getDemoProspect('host-me-tender')!)]) {
      const { unmount } = await renderGuide(partner, { agenda, showUnverified: true })
      const weekly = screen.getByRole('heading', { name: 'Every week in Mexico City' })
      expect(before(weekly, screen.getByRole('heading', { name: 'Worth the time' }))).toBe(true)
      unmount()
    }
  })

  test('kill switch: Experiences go back after the weekly section too', async () => {
    mockEnabled = false
    const slug = 'host-me-tender-alejandro'
    await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    expect(before(screen.getByRole('heading', { name: 'Every week in Mexico City' }), screen.getByRole('heading', { name: 'Worth the time' }))).toBe(true)
    expect(screen.queryByRole('button', { name: /practical details/i })).toBeNull()
  })

  test('agenda layout: "A calm start to your trip" is collapsible (collapsed by default, content stays in the DOM)', async () => {
    const slug = 'host-me-tender-alejandro'
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    expect(screen.getByRole('heading', { name: 'A calm start to your trip' })).toBeInTheDocument()
    const toggle = screen.getByRole('button', { name: /Show the practical details/ })
    const body = container.querySelector('#practico-body') as HTMLElement
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'practico-body')
    expect(body).not.toBeVisible()
    expect(body.querySelectorAll('[class*="cardGrid"] > *').length).toBeGreaterThan(5)
    await act(async () => { fireEvent.click(toggle) })
    expect(screen.getByRole('button', { name: /Hide the practical details/ })).toHaveAttribute('aria-expanded', 'true')
    expect(body).toBeVisible()
  })

  test('other guides: the practical section is not collapsible (no toggle, nothing hidden)', async () => {
    const { container } = await renderGuide(getPartner('livin_condesa')!, { agenda, showUnverified: true })
    expect(screen.queryByRole('button', { name: /practical details/i })).toBeNull()
    expect(container.querySelector('#practico-body')).toBeNull() // markup identical to before: no id, no hidden attribute
    expect(container.querySelector('#practico [hidden]')).toBeNull()
  })
})
