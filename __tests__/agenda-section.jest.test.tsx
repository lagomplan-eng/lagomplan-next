/**
 * __tests__/agenda-section.jest.test.tsx
 *
 * "Mientras estás aquí" / "While you're here":
 *   - AgendaSection: collapsed by default, summary after mount (America/Mexico_City),
 *     pills, featured + compact cards, "+" details, "see all", empty month,
 *     Production (verified only) vs Preview/local ("Por confirmar"), ES/EN parity
 *   - GuiaClient: opt-in only — a demo with the flag swaps the weekly section for it;
 *     Livin and every other guide keep "Every week in Mexico City".
 * Only Date is faked; the clock is frozen to a Wednesday in Mexico City.
 */
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import AgendaSection from '../app/guia/[partner]/AgendaSection'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { loadAgenda } from '../content/guia/agenda'
import { getCity, getPartner } from '../content/guia'
import { buildDemoPartner, getDemoProspect } from '../content/guia/demos'

const agenda = loadAgenda()
const city = getCity('cdmx')!
const NO_FAKE = ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate', 'clearImmediate', 'nextTick', 'queueMicrotask', 'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback', 'cancelIdleCallback', 'performance', 'hrtime'] as const
const freeze = (iso: string) => jest.useFakeTimers({ now: new Date(iso), doNotFake: [...NO_FAKE] })

const ALWAYS = [
  { tag: 'Domingo', title: 'Muévete en Bici, Reforma', body: 'Cada domingo Reforma cierra a los coches.' },
  { tag: 'Sábado', title: 'Bazar Sábado, San Ángel', body: 'Solo sábados.' },
]

beforeEach(() => {
  window.localStorage.clear()
  ;(global as any).fetch = jest.fn(() => Promise.reject(new Error('offline'))) // WeatherCard hides itself
  ;(window as any).IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} }
  freeze('2026-10-28T18:00:00Z') // Wed 28 Oct 2026, 12:00 in Mexico City
})
afterEach(() => jest.useRealTimers())

async function mount(over: Partial<React.ComponentProps<typeof AgendaSection>> = {}) {
  let u!: ReturnType<typeof render>
  await act(async () => {
    u = render(<AgendaSection lang="es" agenda={agenda} showUnverified alwaysItems={ALWAYS} hostName="Host Me Tender" {...over} />)
  })
  const toggle = () => u.container.querySelector('button[aria-controls]') as HTMLButtonElement
  const pills = () => [...u.container.querySelectorAll('button[aria-pressed]')] as HTMLButtonElement[]
  const cards = () => [...u.container.querySelectorAll('article[class*="agCard"]')] as HTMLElement[]
  const open = async () => { await act(async () => { fireEvent.click(toggle()) }) }
  const pill = async (i: number) => { await act(async () => { fireEvent.click(pills()[i]) }) }
  return { ...u, toggle, pills, cards, open, pill }
}

describe('AgendaSection — states', () => {
  test('collapsed by default: eyebrow, title, subtitle and one toggle row (aria-expanded=false)', async () => {
    const { toggle, container } = await mount()
    expect(screen.getByText('La ciudad estos días')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mientras estás aquí' })).toBeInTheDocument()
    expect(screen.getByText('Lo que pasa en la ciudad este mes y el próximo, elegido por quien la vive.')).toBeInTheDocument()
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
    expect(toggle()).toHaveTextContent('Ver la agenda de la ciudad')
    expect(container.querySelectorAll('button[aria-pressed], article')).toHaveLength(0) // nothing else is rendered
  })

  test('the summary is computed after mount, in Mexico City time', async () => {
    const { toggle } = await mount()
    expect(toggle()).toHaveTextContent('OCTUBRE · 6 PLANES · NOVIEMBRE · 9 PLANES')
  })

  test('the month rolls over at midnight in Mexico City, not in UTC', async () => {
    freeze('2026-11-01T05:30:00Z') // still Oct 31 23:30 in CDMX
    const a = await mount()
    expect(a.toggle()).toHaveTextContent(/^Ver la agenda de la ciudadOCTUBRE/)
    a.unmount()
    freeze('2026-11-01T06:30:00Z') // Nov 1 00:30 in CDMX → "this month" is November
    const b = await mount()
    expect(b.toggle()).toHaveTextContent(/NOVIEMBRE · \d+ PLANES · DICIEMBRE · 0 PLANES/)
  })

  test('open: 4 pills, featured card, 4 compact cards, "Ver los 6 planes"', async () => {
    const { open, toggle, pills, cards, container } = await mount()
    await open()
    expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    expect(pills().map((p) => p.textContent)).toEqual(['Octubre', 'Noviembre', 'Si te sobra un día', 'Siempre en la ciudad'])
    expect(pills()[0]).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelectorAll('[class*="agBadge"]')).toHaveLength(1)
    expect(screen.getByText('Gran Desfile de Día de Muertos')).toBeInTheDocument()
    expect(cards()).toHaveLength(4)
    expect(screen.getByRole('button', { name: 'Ver los 6 planes' })).toBeInTheDocument()
  })

  test('the first 4 cards mix categories (food, sport, culture…)', async () => {
    const { open, cards } = await mount()
    await open()
    const cats = cards().map((c) => c.querySelector('[class*="agMeta"]')!.textContent!.split(' · ')[0])
    expect(new Set(cats).size).toBeGreaterThanOrEqual(3)
  })

  test('"+" details: aria-expanded, aria-label with the title, one open at a time, content', async () => {
    const { open, cards } = await mount()
    await open()
    const plus = (i: number) => cards()[i].querySelector('button[aria-expanded]') as HTMLButtonElement
    expect(plus(0)).toHaveAttribute('aria-expanded', 'false')
    expect(plus(0).getAttribute('aria-label')).toBe('Ver detalles de Festival Cacao para Todos')
    await act(async () => { fireEvent.click(plus(0)) })
    expect(plus(0)).toHaveAttribute('aria-expanded', 'true')
    expect(plus(0).getAttribute('aria-label')).toBe('Ocultar detalles de Festival Cacao para Todos')
    expect(within(cards()[0]).getByText('10:00–19:00')).toBeInTheDocument()
    expect(within(cards()[0]).getByRole('link', { name: 'Sitio oficial →' })).toHaveAttribute('href', agenda.events.find((e) => e.id === 'cacao-para-todos')!.url)
    await act(async () => { fireEvent.click(plus(1)) }) // opening another closes the first
    expect(plus(0)).toHaveAttribute('aria-expanded', 'false')
    expect(plus(1)).toHaveAttribute('aria-expanded', 'true')
  })

  test('no cost row when the event has no sourced price (F1)', async () => {
    const { open, cards } = await mount()
    await open()
    const f1 = cards().find((c) => /Gran Premio de México/.test(c.textContent!))!
    await act(async () => { fireEvent.click(f1.querySelector('button[aria-expanded]')!) })
    expect(within(f1).queryByText(/Costo/i)).toBeNull()
    expect(f1.textContent).toMatch(/domingo 1 de noviembre/)
    expect(f1.textContent).not.toMatch(/\$/)
  })

  test('"Ver los N planes" shows everything, "Ver menos" collapses again', async () => {
    const { open, cards } = await mount()
    await open()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Ver los 6 planes' })) })
    expect(cards()).toHaveLength(5) // 6 plans = 1 featured + 5 cards
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Ver menos' })) })
    expect(cards()).toHaveLength(4)
  })

  test('November: crossing events appear too, no featured, 4 cards then "Ver los 9 planes"', async () => {
    const { open, pill, cards, container } = await mount()
    await open(); await pill(1)
    expect(container.querySelectorAll('[class*="agBadge"]')).toHaveLength(0)
    expect(cards()).toHaveLength(4)
    expect(screen.getByRole('button', { name: 'Ver los 9 planes' })).toBeInTheDocument()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Ver los 9 planes' })) })
    expect(screen.getByText('El Camino · iluminación de Día de Muertos')).toBeInTheDocument()
    expect(screen.getByText('Carrera del Ring')).toBeInTheDocument()
  })

  test('day trips: 4 cards, photo + link placeholders, never an invented link', async () => {
    const { open, pill, container } = await mount()
    await open(); await pill(2)
    expect(container.querySelectorAll('article[class*="agTrip"]')).toHaveLength(4)
    for (const t of ['Xochimilco', 'Teotihuacán', 'Los Dinamos', 'Tepoztlán']) expect(screen.getByText(t)).toBeInTheDocument()
    expect(screen.getAllByText('[foto]')).toHaveLength(4)
    expect(screen.getAllByText('[enlace]')).toHaveLength(4)
    expect(container.querySelectorAll('article[class*="agTrip"] a')).toHaveLength(0)
  })

  test('"Siempre en la ciudad" carries the weekly items, Muévete en Bici included', async () => {
    const { open, pill } = await mount()
    await open(); await pill(3)
    expect(screen.getByText('Muévete en Bici, Reforma')).toBeInTheDocument()
    expect(screen.getByText('Bazar Sábado, San Ángel')).toBeInTheDocument()
  })

  test('host pick: placeholder when guide.host_pick is missing, the text when present', async () => {
    const a = await mount()
    await a.open()
    expect(screen.getByText('La recomendación del anfitrión')).toBeInTheDocument()
    expect(screen.getByText('[recomendación del anfitrión]')).toBeInTheDocument()
    a.unmount()
    const b = await mount({ hostPick: { es: 'Un domingo en Reforma.', en: 'A Sunday on Reforma.' } })
    await b.open()
    expect(screen.getByText('Un domingo en Reforma.')).toBeInTheDocument()
    expect(screen.queryByText('[recomendación del anfitrión]')).toBeNull()
  })

  test('empty month: friendly message + a button to the day trips tab', async () => {
    freeze('2026-12-10T18:00:00Z')
    const { open, pills, toggle, container } = await mount()
    expect(toggle()).toHaveTextContent('DICIEMBRE · 0 PLANES · ENERO · 0 PLANES')
    await open()
    expect(pills().map((p) => p.textContent)[0]).toBe('Diciembre')
    expect(screen.getByText('Mes tranquilo en la ciudad')).toBeInTheDocument()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Ver «Si te sobra un día» →' })) })
    expect(container.querySelectorAll('article[class*="agTrip"]')).toHaveLength(4)
    expect(pills()[2]).toHaveAttribute('aria-pressed', 'true')
  })

  test('events that already ended are hidden (Nov 3: the Oct 29–Nov 2 ones are gone)', async () => {
    freeze('2026-11-03T18:00:00Z')
    const { open, toggle } = await mount()
    expect(toggle()).toHaveTextContent('NOVIEMBRE · 5 PLANES · DICIEMBRE · 0 PLANES')
    await open()
    expect(screen.queryByText('Festival Cacao para Todos')).toBeNull()
    expect(screen.queryByText('Mexico City F1 Grand Prix')).toBeNull()
    expect(screen.getByText('El Camino · iluminación de Día de Muertos')).toBeInTheDocument()
  })
})

describe('AgendaSection — Production vs Preview', () => {
  test('Preview/local: unverified events render with the "Por confirmar" pill; the verified one does not', async () => {
    const { open, cards, container } = await mount({ showUnverified: true })
    await open()
    const f1 = cards().find((c) => /Gran Premio de México/.test(c.textContent!))!
    expect(f1.querySelector('[class*="agPill"]')).toBeNull()
    expect(cards().filter((c) => c.querySelector('[class*="agPill"]')).length).toBe(cards().length - 1)
    expect(container.querySelector('article[class*="expCard"] [class*="agPill"]')).not.toBeNull() // featured parade is unverified too
  })

  test('Production: only verified events — the F1 weekend — no featured, no pills, honest counts', async () => {
    const { open, toggle, cards, container } = await mount({ showUnverified: false })
    expect(toggle()).toHaveTextContent('OCTUBRE · 1 PLAN · NOVIEMBRE · 1 PLAN')
    await open()
    expect(cards()).toHaveLength(1)
    expect(cards()[0]).toHaveTextContent('Gran Premio de México de F1')
    expect(container.querySelectorAll('[class*="agBadge"], [class*="agPill"]')).toHaveLength(0)
    expect(screen.queryByText('Gran Desfile de Día de Muertos')).toBeNull()
    expect(screen.queryByText('Festival Cacao para Todos')).toBeNull()
  })
})

describe('AgendaSection — ES / EN parity', () => {
  test('same structure in both languages; every visible string switches', async () => {
    const es = await mount({ lang: 'es' }); await es.open()
    const shape = (u: typeof es) => ({
      pills: u.pills().length, cards: u.cards().length, badges: u.container.querySelectorAll('[class*="agBadge"]').length,
      plus: u.container.querySelectorAll('button[aria-expanded][aria-label]').length, dates: [...u.container.querySelectorAll('[class*="agDay"]')].map((d) => d.textContent),
    })
    const esShape = shape(es); es.unmount()
    const en = await mount({ lang: 'en' }); await en.open()
    expect(shape(en)).toEqual(esShape)
    expect(screen.getByRole('heading', { name: "While you're here" })).toBeInTheDocument()
    expect(en.pills().map((p) => p.textContent)).toEqual(['October', 'November', 'If you have a spare day', 'Always in the city'])
    expect(screen.getByRole('button', { name: 'See all 6' })).toBeInTheDocument()
    expect(en.cards()[0].querySelector('button[aria-expanded]')!.getAttribute('aria-label')).toBe('Show details for Festival Cacao para Todos')
    expect(screen.getByText('Great Day of the Dead Parade')).toBeInTheDocument()
  })
})

describe('GuiaClient — opt-in, weekly section intact elsewhere', () => {
  const renderGuide = async (partner: any, extra: object = {}) => {
    let u!: ReturnType<typeof render>
    window.history.pushState({}, '', '/x')
    await act(async () => { u = render(<GuiaClient partner={partner} city={city} {...extra} />) })
    return u
  }

  test('a demo with display.agenda shows "While you\'re here" and no weekly section; the weather stays', async () => {
    ;(global as any).fetch = jest.fn(() => new Promise(() => {})) // weather still loading → its skeleton proves the component is mounted
    const demo = getDemoProspect('host-me-tender-agenda')!
    const { container } = await renderGuide(buildDemoPartner(demo), { demo: { slug: demo.slug, prospectName: 'Host Me Tender' }, agenda, showUnverified: true })
    expect(screen.getByRole('heading', { name: "While you're here" })).toBeInTheDocument()
    expect(container.textContent).not.toContain('Every week in Mexico City')
    expect(container.querySelector('[class*="weatherCard"]')).not.toBeNull()
  })

  test('the flag without data falls back to the weekly section (never a blank hole)', async () => {
    const demo = getDemoProspect('host-me-tender-agenda')!
    const { container } = await renderGuide(buildDemoPartner(demo), { demo: { slug: demo.slug, prospectName: 'x' } })
    expect(container.textContent).toContain('Every week in Mexico City')
  })

  test.each(['livin_condesa', 'livin_roma', 'livin_polanco'])('%s keeps the weekly section byte for byte of structure', async (slug) => {
    const { container } = await renderGuide(getPartner(slug)!, { agenda, showUnverified: true }) // even if data is passed
    expect(container.textContent).toContain('Every week in Mexico City')
    expect(container.textContent).not.toContain("While you're here")
  })

  test('host-me-tender and host-me-tender-alejandro (no flag) keep the weekly section', async () => {
    for (const slug of ['host-me-tender', 'host-me-tender-alejandro']) {
      const demo = getDemoProspect(slug)!
      const { container, unmount } = await renderGuide(buildDemoPartner(demo), { demo: { slug, prospectName: 'x' }, agenda, showUnverified: true })
      expect(container.textContent).toContain('Every week in Mexico City')
      expect(container.textContent).not.toContain("While you're here")
      unmount()
    }
  })
})
