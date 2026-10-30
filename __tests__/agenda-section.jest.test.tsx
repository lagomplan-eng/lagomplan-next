/**
 * __tests__/agenda-section.jest.test.tsx
 *
 * "Mientras estás aquí" / "While you're here", stay-window version:
 *   - AgendaSection: tabs (Your stay + checkout month + next month, empty months hidden), the
 *     "Your stay" list (featured first, cap 6 + "See all N →", "All through your stay" group),
 *     compact month rows, link rows vs plain rows, "Por confirmar" pill, day trips, ES/EN.
 *   - GuiaClient: agenda opt-in + kill switch; mood tiles → anchors; practical tabs (first 4
 *     cards + "Show N more"); alternating backgrounds; weather inline.
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
  const tabs = () => [...u.container.querySelectorAll('button[aria-pressed]')] as HTMLButtonElement[]
  const rows = () => [...u.container.querySelectorAll('ul[class*="agList"] > li')] as HTMLElement[]
  const titles = () => rows().map((r) => r.querySelector('[class*="agItemTitle"]')!.textContent)
  const click = async (el: Element) => { await act(async () => { fireEvent.click(el) }) }
  return { ...u, tabs, rows, titles, click }
}

describe('AgendaSection — tabs and lists', () => {
  test('header: title, subtitle, weather inline (one mono line under the subtitle), no collapse toggle', async () => {
    ;(global as any).fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ current: { weather_code: 2 }, daily: { temperature_2m_max: [24], temperature_2m_min: [14], precipitation_probability_max: [10] } }) }))
    const { container } = await mount()
    expect(screen.getByRole('heading', { name: 'Mientras estás aquí' })).toBeInTheDocument()
    expect(screen.getByText('Lo que pasa en la ciudad durante tu estancia.')).toBeInTheDocument()
    expect(container.querySelector('[class*="weatherCard"]')).toBeNull()
    expect(container.querySelector('[class*="wxInline"]')).not.toBeNull()
    expect(container.querySelectorAll('button[aria-expanded]')).toHaveLength(1) // only "Escapadas de un día"
  })

  test('tabs: "Tu estancia" first and selected, then the checkout month; December (no event) is hidden', async () => {
    const { tabs } = await mount()
    expect(tabs().map((t) => t.textContent)).toEqual(['Tu estancia', 'Noviembre'])
    expect(tabs().map((t) => t.getAttribute('aria-pressed'))).toEqual(['true', 'false'])
  })

  test('Your stay: featured first with the highlight label, then dated events; ≥6 rows would be capped', async () => {
    const { titles, rows } = await mount()
    expect(titles()).toEqual(['Gran Desfile de Día de Muertos', 'Festival Cacao para Todos', 'Gran Premio de México de F1'])
    expect(rows()[0]).toHaveTextContent('lo más grande de tu estancia')
    expect(rows()[0]).toHaveTextContent('SÁB 31')
    expect(rows()[0]).toHaveTextContent('14:00')
    expect(rows().filter((r) => /lo más grande/.test(r.textContent!))).toHaveLength(1)
  })

  test('Your stay: "All through your stay" group = the events that cover every night, as title · area lines', async () => {
    const { container } = await mount()
    const group = container.querySelector('[class*="agThrough"]') as HTMLElement
    expect(group).toHaveTextContent('Durante toda tu estancia')
    const lines = [...group.querySelectorAll('li')].map((l) => l.textContent)
    expect(lines).toHaveLength(5)
    expect(lines[0]).toContain('Ofrenda monumental del Zócalo · Centro Histórico')
    expect(lines.join('|')).toContain('El Camino · iluminación de Día de Muertos · Paseo de la Reforma')
  })

  test('no event renders twice in one tab (stay tab: rows + group; month tab)', async () => {
    const { container, tabs, titles, click } = await mount({ showUnverified: true })
    const stayTitles = [...titles(), ...[...container.querySelectorAll('[class*="agThrough"] li')].map((l) => l.textContent!.replace(/ ·.*/, ''))]
    expect(new Set(stayTitles).size).toBe(stayTitles.length)
    await click(tabs()[1])
    expect(new Set(titles()).size).toBe(titles().length)
  })

  test('recurring items NEVER appear inside "Your stay" or the month tabs; they live in their own group "Cada semana en la ciudad"', async () => {
    const { container, tabs, rows, click } = await mount({ showUnverified: true })
    const RECURRING = ['Lucha libre', 'Bazar Sábado', 'Muévete en Bici', 'Mirador']
    const dated = () => [...rows().map((r) => r.textContent!), ...[...container.querySelectorAll('[class*="agThrough"] li')].map((l) => l.textContent!)].join('|')
    for (const t of RECURRING) expect(dated()).not.toContain(t)
    await click(tabs()[1])
    for (const t of RECURRING) expect(dated()).not.toContain(t)
    // …and the group exists, outside the lists, with all four
    const weekly = container.querySelector('[class*="agWeeklyWrap"]') as HTMLElement
    expect(weekly).toHaveTextContent('Cada semana en la ciudad')
    expect(weekly.querySelectorAll('[class*="agWeeklyCard"]')).toHaveLength(4)
    for (const t of RECURRING) expect(weekly).toHaveTextContent(t)
    expect(weekly.closest('ul[class*="agList"]')).toBeNull()
    expect(container.querySelectorAll('ul[class*="agList"] [class*="agWeeklyCard"]')).toHaveLength(0)
  })


  test('cap: 6 rows, then "Ver todos los N →" expands the rest (Preview, a stay with many events)', async () => {
    const { rows, click } = await mount({ showUnverified: true, stay: { arrival: '2026-11-06', nights: 20 } })
    expect(rows()).toHaveLength(6)
    const more = screen.getByRole('button', { name: /^Ver todos los \d+ →$/ })
    const n = Number(more.textContent!.match(/\d+/)![0])
    expect(n).toBeGreaterThan(6)
    await click(more)
    expect(rows()).toHaveLength(n)
    expect(screen.queryByRole('button', { name: /^Ver todos/ })).toBeNull()
  })

  test('no "Ver todos" when there are 6 or fewer rows', async () => {
    await mount()
    expect(screen.queryByRole('button', { name: /^Ver todos/ })).toBeNull()
  })

  test('month tab: compact rows (full date range, title, category — no venue), sorted by start, "after your stay" tag', async () => {
    const { tabs, rows, click } = await mount()
    await click(tabs()[1])
    expect(tabs().map((t) => t.getAttribute('aria-pressed'))).toEqual(['false', 'true'])
    const first = rows()[0]
    expect(first).toHaveTextContent('23 OCT – 8 NOV')
    expect(first).toHaveTextContent('Cultura')
    expect(first).not.toHaveTextContent('Paseo de la Reforma') // no venue line
    const karol = rows().find((r) => /Karol G/.test(r.textContent!))!
    expect(karol).toHaveTextContent('Música')
    expect(karol).not.toHaveTextContent('Estadio')
    expect(karol).toHaveTextContent('después de tu estancia')
    expect(rows().find((r) => /Gran Premio/.test(r.textContent!))).not.toHaveTextContent('después de tu estancia')
  })

  test('month tab (Production): the verified events only; Preview adds the researched ones with the neutral pill', async () => {
    const p = await mount({ showUnverified: false })
    await p.click(p.tabs()[1])
    expect(p.rows()).toHaveLength(11)
    expect(p.container.querySelectorAll('[class*="agPill"]')).toHaveLength(0)
    p.unmount()
    const v = await mount({ showUnverified: true })
    await v.click(v.tabs()[1])
    expect(v.rows()).toHaveLength(21)
    expect(v.container.querySelectorAll('[class*="agPill"]')).toHaveLength(10)
    expect(v.container.textContent).not.toMatch(/Host Me Tender|Livin/)
  })

  test('a row with an official URL is one link (new tab, ↗, sr-only hint); one without is plain', async () => {
    const { rows, tabs, click } = await mount()
    const f1 = rows().find((r) => /Gran Premio de México/.test(r.textContent!))!
    const a = f1.querySelector('a')!
    expect(a).toHaveAttribute('href', agenda.events.find((e) => e.id === 'gp-mexico-f1')!.url)
    expect(a).toHaveAttribute('target', '_blank')
    expect(a.getAttribute('rel')).toContain('noopener')
    expect(a.textContent).toContain('↗')
    await click(tabs()[1])
    const puente = rows().find((r) => /Puente de la Revolución/.test(r.textContent!))!
    expect(puente.querySelector('a')).toBeNull()
    expect(rows().every((r) => !r.querySelector('button'))).toBe(true)
  })

  test('the stay changing resets the tab to "Tu estancia"', async () => {
    const { tabs, click, rerender } = await mount()
    await click(tabs()[1])
    await act(async () => { rerender(<AgendaSection lang="es" agenda={agenda} showUnverified stay={{ arrival: '2026-11-02', nights: 10 }} />) })
    expect(tabs()[0]).toHaveAttribute('aria-pressed', 'true')
  })

  test('quiet stay (December): the quiet card, no month tab, day trips still there', async () => {
    const { container, tabs } = await mount({ stay: { arrival: '2026-12-09', nights: 1 } })
    expect(tabs().map((t) => t.textContent)).toEqual(['Tu estancia'])
    expect(screen.getByText('Días tranquilos en la ciudad')).toBeInTheDocument()
    expect(container.querySelector('[class*="agThrough"]')).toBeNull()
    expect(screen.getByRole('button', { name: 'Escapadas de un día →' })).toBeInTheDocument()
  })

  test('no params → today … today+13: a stay tab and the month tabs', async () => {
    const { tabs } = await mount({ stay: {} })
    expect(tabs()[0]).toHaveTextContent('Tu estancia')
    expect(tabs().length).toBeGreaterThanOrEqual(2)
  })

  test('the "Próximamente en {mes}" button is gone; "Escapadas de un día →" opens the day trips (text only), toggles', async () => {
    const { container, click } = await mount()
    expect(screen.queryByRole('button', { name: /Próximamente|Más adelante/ })).toBeNull()
    const btn = screen.getByRole('button', { name: 'Escapadas de un día →' })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await click(btn)
    const panel = document.getElementById(btn.getAttribute('aria-controls')!)!
    for (const t of ['Xochimilco', 'Teotihuacán', 'Los Dinamos', 'Tepoztlán']) expect(panel).toHaveTextContent(t)
    expect(panel.querySelectorAll('a, img, [class*="agPill"]')).toHaveLength(0)
    await click(btn)
    expect(container.querySelector(`[id$="-trips"]`)).toBeNull()
  })

  test('the list column is capped at 720px (class on the body)', async () => {
    const { container } = await mount()
    expect(container.querySelector('[class*="agBody"]')).not.toBeNull()
  })
})

describe('AgendaSection — ES / EN', () => {
  test('same structure in both languages; every visible string switches', async () => {
    const es = await mount({ lang: 'es' })
    const shape = (u: typeof es) => ({ tabs: u.tabs().length, rows: u.rows().length, links: u.container.querySelectorAll('a').length, group: u.container.querySelectorAll('[class*="agThrough"] li').length })
    const esShape = shape(es); es.unmount()
    const en = await mount({ lang: 'en' })
    expect(shape(en)).toEqual(esShape)
    expect(screen.getByRole('heading', { name: "While you're here" })).toBeInTheDocument()
    expect(en.tabs().map((t) => t.textContent)).toEqual(['Your stay', 'November'])
    expect(screen.getByText("What's happening in the city during your stay.")).toBeInTheDocument()
    expect(screen.getByText('All through your stay')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Day trips →' })).toBeInTheDocument()
    expect(screen.getByText('Great Day of the Dead Parade')).toBeInTheDocument()
    expect(en.container.textContent).toMatch(/the highlight of your stay/)
    expect(screen.getByText('Every week in the city')).toBeInTheDocument()
    expect(en.container.textContent).not.toMatch(/Por confirmar|Durante toda|estancia|Cada semana|Domingos|Martes|Sábados|Al atardecer/)
  })

  test('English: month tab shows "after your stay"; Preview shows "To confirm"', async () => {
    const { tabs, container, click } = await mount({ lang: 'en', showUnverified: true })
    await click(tabs()[1])
    expect(container.textContent).toContain('after your stay')
    expect(screen.getAllByText('To confirm').length).toBeGreaterThan(0)
  })

  test('quiet stay in English', async () => {
    await mount({ lang: 'en', stay: { arrival: '2026-12-09', nights: 1 } })
    expect(screen.getByText('Quiet days in the city')).toBeInTheDocument()
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

  test.each(['host-me-tender-alejandro', 'host-me-tender-agenda'])('%s (display.agenda) shows "While you\'re here" and no weekly section; weather inline, no standalone card', async (slug) => {
    ;(global as any).fetch = jest.fn(() => new Promise(() => {}))
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    expect(screen.getByRole('heading', { name: "While you're here" })).toBeInTheDocument()
    expect(container.textContent).not.toContain('Every week in Mexico City')
    expect(container.querySelector('[class*="weatherCard"]')).toBeNull()
    expect(container.querySelector('#aqui [class*="wxInline"]')).not.toBeNull()
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
  })

  test('demo guides — practical: always open (no show/hide button), "Before you arrive" is the default tab', async () => {
    const slug = 'host-me-tender-alejandro'
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    expect(screen.queryByRole('button', { name: /practical details|lo práctico/i })).toBeNull()
    expect(container.querySelector('#practico [hidden]')).toBeNull()
    const tabs = [...container.querySelectorAll('#practico button[aria-pressed]')] as HTMLButtonElement[]
    expect(tabs[0]).toHaveTextContent('Before you arrive')
    expect(tabs[0]).toHaveAttribute('aria-pressed', 'true')
  })

  test('demo guides — practical: first 4 cards (Airport, Transportation, Money, Connectivity), then "Show N more ↓" / "Show less ↑" as a text link', async () => {
    const slug = 'host-me-tender'
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    const cards = () => [...container.querySelectorAll('#practico [class*="cardGrid"] > *')] as HTMLElement[]
    expect(cards()).toHaveLength(4)
    expect(cards().map((c) => c.querySelector('h4, h3, h5')?.textContent)).toEqual(['Airport', 'Transportation', 'Money', 'Connectivity'])
    const more = screen.getByRole('button', { name: /^Show \d+ more ↓$/ })
    const n = Number(more.textContent!.match(/\d+/)![0])
    expect(more.className).toMatch(/practicalMore/)
    await act(async () => { fireEvent.click(more) })
    expect(cards()).toHaveLength(4 + n)
    expect(cards()[4].querySelector('h4, h3, h5')?.textContent).toBe('Weather') // the rest keep their order
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Show less ↑' })) })
    expect(cards()).toHaveLength(4)
  })

  test('demo guides — mood tiles are anchors; "Traveling with kids" → #ninos; "Only a few hours" → #itinerario; no-target tiles (nightlife) hidden', async () => {
    const slug = 'host-me-tender'
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    const tiles = [...container.querySelectorAll('a[class*="moodBtn"]')] as HTMLAnchorElement[]
    expect(tiles.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ["I'm hungry", '#comer'], ['I want culture', '#itinerario'], ['Traveling with kids', '#ninos'], ['Hidden places', '#zonas'], ['Only a few hours', '#itinerario'],
    ])
    for (const a of tiles) expect(container.querySelector(a.getAttribute('href')!)).not.toBeNull() // every target exists
    expect(container.textContent).not.toMatch(/I want nightlife/)
    expect(container.querySelector('[class*="moodPanel"]')).toBeNull()
  })

  test('demo guides — kids block inside Must-sees: "With kids" / "Con niños", the kids picks of the city layer, same cards, anchor #ninos', async () => {
    const slug = 'host-me-tender'
    const { container, unmount } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    const block = container.querySelector('#comer #ninos') as HTMLElement
    expect(block).not.toBeNull()
    expect(block.querySelector('h3')).toHaveTextContent('With kids')
    const cards = [...block.querySelectorAll('[class*="foodCard"]')]
    expect(cards.map((c) => c.querySelector('h5')!.textContent)).toEqual(['Parque México', 'Papalote Museo del Niño', 'Chapultepec Zoo']) // = the kids mood picks; no new content
    expect(cards.length).toBeLessThanOrEqual(6)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'ES' })) })
    expect(container.querySelector('#ninos h3')).toHaveTextContent('Con niños')
    expect(container.querySelector('a[href="#ninos"]')).toHaveTextContent('Viajo con niños')
    expect([...container.querySelectorAll('#ninos [class*="foodCard"] h5')].map((e) => e.textContent)).toEqual(['Parque México', 'Papalote Museo del Niño', 'Zoológico de Chapultepec'])
    unmount()
  })

  test('demo guides — no kids picks → both the block and the tile are hidden', async () => {
    const slug = 'host-me-tender'
    const withMoods = (f: (m: any[]) => any[]) => ({ ...city, copy: { es: { ...city.copy.es, moods: f(city.copy.es.moods) }, en: { ...city.copy.en, moods: f(city.copy.en.moods) } } })
    const noKids = withMoods((ms) => ms.filter((m) => m.id !== 'kids'))
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), { ...demoProps(slug), city: noKids })
    expect(container.querySelector('#ninos')).toBeNull()
    expect(container.querySelector('a[href="#ninos"]')).toBeNull()
    const emptyKids = withMoods((ms) => ms.map((m) => (m.id === 'kids' ? { ...m, items: [] } : m)))
    const { container: c2 } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), { ...demoProps(slug), city: emptyKids })
    expect(c2.querySelector('#ninos')).toBeNull()
  })

  test('Livin and other non-demo guides stay exactly as before: original mood tiles + picks panel, original practical, standalone weather card, inline paddings, Pine bands, original order', async () => {
    ;(global as any).fetch = jest.fn(() => new Promise(() => {})) // weather still loading → the card's skeleton is in the DOM
    const { container } = await renderGuide(getPartner('livin_condesa')!, { agenda, showUnverified: true })
    // mood: buttons with the picks panel, kids/nightlife tiles present, after the 48-hour itinerary
    expect(container.querySelectorAll('a[class*="moodBtn"]')).toHaveLength(0)
    const tiles = [...container.querySelectorAll('button[class*="moodBtn"]')]
    expect(tiles.map((t) => t.textContent)).toContain('Traveling with kids')
    await act(async () => { fireEvent.click(tiles[0]) })
    expect(container.querySelector('[class*="moodPanel"]')).not.toBeNull()
    const heads = [...container.querySelectorAll('section h2')].map((h) => h.textContent)
    expect(heads.indexOf('48 hours')).toBeLessThan(heads.indexOf('What are you in the mood for?'))
    expect(heads.indexOf('A calm start to your trip')).toBeLessThan(heads.indexOf('What are you in the mood for?'))
    // practical: all cards of the tab, no "Show N more", original card order
    expect(screen.queryByRole('button', { name: /Show \d+ more/ })).toBeNull()
    expect(container.querySelectorAll('#practico [class*="cardGrid"] > *').length).toBeGreaterThan(10)
    expect([...container.querySelectorAll('#practico [class*="cardGrid"] h4, #practico [class*="cardGrid"] h3, #practico [class*="cardGrid"] h5')].slice(0, 3).map((e) => e.textContent)).toEqual(['Airport', 'Transportation', 'Weather'])
    // no ids, no kids block, no rhythm classes, inline paddings and Pine bands kept, weather card standalone
    expect(container.querySelector('#zonas, #itinerario, #comer, #ninos, #experiencias, #aqui')).toBeNull()
    expect(container.querySelector('[class*="rhythm"], [class*="lightBand"]')).toBeNull()
    expect(container.querySelector('[class*="sectionPine"]')).not.toBeNull()
    expect([...container.querySelectorAll('section')].filter((x) => /padding-top: 88px/.test(x.getAttribute('style') ?? '')).length).toBeGreaterThan(3)
    expect(container.querySelector('[class*="weatherCard"]')).not.toBeNull()
    expect(container.querySelector('[class*="wxInline"]')).toBeNull()
  })

  test('demo guides — backgrounds alternate grey/cream from the mood section on (agenda layout and weekly layout)', async () => {
    for (const [slug, expected] of [
      ['host-me-tender-alejandro', ['mood', 'practical', 'zones', 'itin', 'exp', 'agenda', 'food', 'beyond', 'discover']],
      ['host-me-tender', ['mood', 'practical', 'zones', 'itin', 'weekly', 'exp', 'food', 'beyond', 'discover']],
    ] as const) {
      const { container, unmount } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
      const secs = [...container.querySelectorAll('section')].filter((x) => x.querySelector('h2'))
      const from = secs.findIndex((x) => /What are you in the mood for\?/.test(x.textContent!))
      const tones = secs.slice(from, from + expected.length).map((x) => (/sectionAlt/.test(x.className) ? 'grey' : 'cream'))
      expect(tones).toEqual(expected.map((_, i) => (i % 2 === 0 ? 'grey' : 'cream')))
      unmount()
    }
  })

  test('demo guides — one padding class everywhere, no inline paddings, no dark Pine bands, weather inline', async () => {
    const slug = 'host-me-tender'
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    expect([...container.querySelectorAll('section')].filter((x) => /padding/.test(x.getAttribute('style') ?? ''))).toHaveLength(0)
    expect(container.querySelector('[class*="sectionPine"]')).toBeNull()
    expect(container.querySelector('[class*="weatherCard"]')).toBeNull()
  })

  test('demo guides (agenda layout): the weekly group "Every week in the city" comes right after the agenda lists, in English', async () => {
    const slug = 'host-me-tender-alejandro'
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    const weekly = container.querySelector('#aqui [class*="agWeeklyWrap"]') as HTMLElement
    expect(weekly).toHaveTextContent('Every week in the city')
    expect(weekly).toHaveTextContent('Sundays · 8am–2pm')
    expect(weekly).not.toHaveTextContent(/Cada semana|Domingos|Martes y viernes|Sábados|Al atardecer/)
  })
})
