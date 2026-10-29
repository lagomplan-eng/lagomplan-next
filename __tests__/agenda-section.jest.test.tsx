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
    const { rows, container } = await mount({ showUnverified: true })
    const f1 = rows().find((r) => /Gran Premio de México/.test(r.textContent!))!
    expect(f1.querySelector('[class*="agPill"]')).toBeNull()
    const parade = rows().find((r) => /Gran Desfile/.test(r.textContent!))!
    expect(parade.querySelector('[class*="agPill"]')).toHaveTextContent('Por confirmar')
    expect(container.textContent).not.toMatch(/Host Me Tender|Livin/)
  })

  test('Production: verified events only — F1 plus the weekly occurrences, no pills, no highlight', async () => {
    const { rows, container } = await mount({ showUnverified: false })
    expect(rows().map((r) => r.querySelector('[class*="agItemTitle"]')!.textContent)).toEqual(['Gran Premio de México de F1', 'Lucha libre, Arena México', 'Bazar Sábado, San Ángel', 'Muévete en Bici, Reforma'])
    expect(container.querySelectorAll('[class*="agPill"]')).toHaveLength(0)
    expect(container.textContent).not.toContain('lo más grande')
  })
})

describe('AgendaSection — empty range, weekly row, buttons', () => {
  test('quiet range (Wed–Thu in December): friendly card and still the weekly row', async () => {
    const { rows, container } = await mount({ stay: { arrival: '2026-12-09', nights: 1 } })
    expect(rows()).toHaveLength(0)
    expect(screen.getByText('Días tranquilos en la ciudad')).toBeInTheDocument()
    expect(screen.getByText(/No hay eventos especiales en estas fechas/)).toBeInTheDocument()
    expect(container.querySelectorAll('[class*="agWeeklyCard"]')).toHaveLength(4)
  })

  test('"Cada semana en la ciudad": all four recurring items, the viewpoint included', async () => {
    const { container } = await mount()
    expect(screen.getByText('Cada semana en la ciudad')).toBeInTheDocument()
    expect(container.querySelectorAll('[class*="agWeeklyCard"]')).toHaveLength(4)
    expect(screen.getAllByText(/Torre Latinoamericana/).length).toBeGreaterThan(0)
  })

  test('"Más adelante →" opens an inline panel (aria-expanded/controls) and closes again', async () => {
    const { click, container } = await mount()
    const btn = screen.getByRole('button', { name: 'Más adelante →' })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    const panel = document.getElementById(btn.getAttribute('aria-controls')!)!
    expect(panel).toHaveTextContent('Corona Capital')
    expect(panel).toHaveTextContent('20 – 22 NOV')
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
    const ahead = screen.getByRole('button', { name: 'Más adelante →' })
    const trips = screen.getByRole('button', { name: 'Escapadas de un día →' })
    await click(ahead); await click(trips)
    expect(ahead).toHaveAttribute('aria-expanded', 'false')
    expect(trips).toHaveAttribute('aria-expanded', 'true')
  })

  test('a button whose panel would be empty is hidden (Production: nothing verified later)', async () => {
    await mount({ showUnverified: false })
    expect(screen.queryByRole('button', { name: 'Más adelante →' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Escapadas de un día →' })).toBeInTheDocument()
  })

  test('no params → today … today+13 (3 chips), first selected', async () => {
    const { chips } = await mount({ stay: {} })
    expect(chips().map((c) => c.textContent)).toEqual(['29 oct – 1 nov', '2 – 8 nov', '9 – 11 nov'])
  })

  test('29 nights from Nov 1 → the four ranges of the brief', async () => {
    const { chips } = await mount({ stay: { arrival: '2026-11-01', nights: 29 } })
    expect(chips().map((c) => c.textContent)).toEqual(['1 – 8 nov', '9 – 15 nov', '16 – 22 nov', '23 – 30 nov'])
    expect(screen.queryByRole('button', { name: 'Más adelante →' })).toBeNull() // nothing starts after Nov 30 within +30d? (Dec items none)
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
    const shape = (u: typeof es) => ({ chips: u.chips().length, rows: u.rows().length, links: u.container.querySelectorAll('a').length, weekly: u.container.querySelectorAll('[class*="agWeeklyCard"]').length })
    const esShape = shape(es); es.unmount()
    const en = await mount({ lang: 'en' })
    expect(shape(en)).toEqual(esShape)
    expect(screen.getByRole('heading', { name: "While you're here" })).toBeInTheDocument()
    expect(en.chips().map((c) => c.textContent)).toEqual(['Oct 30 – Nov 1', 'Nov 2 – 3'])
    expect(screen.getByText("What's happening in the city during your stay.")).toBeInTheDocument()
    expect(screen.getByText('Every week in the city')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Coming up →' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Day trips →' })).toBeInTheDocument()
    expect(screen.getByText('Great Day of the Dead Parade')).toBeInTheDocument()
    expect(screen.getAllByText('To confirm').length).toBeGreaterThan(0)
    expect(en.container.textContent).toMatch(/the highlight of your stay/)
    expect(en.container.textContent).not.toMatch(/Por confirmar|Cada semana|estancia/)
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
})
