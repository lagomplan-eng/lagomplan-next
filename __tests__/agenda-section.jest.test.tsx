/**
 * __tests__/agenda-section.jest.test.tsx
 *
 * "Mientras estás aquí" / "While you're here", month-tab version:
 *   - AgendaSection: tabs (current month + next month, empty months hidden), compact rows from
 *     today on, link rows vs plain rows, "Por confirmar" pill, the two card groups (weekly and
 *     day trips, one layout), ES/EN.
 *   - GuiaClient: agenda opt-in + kill switch; mood tiles → anchors; practical tabs (first 4
 *     cards + "Show N more"); alternating backgrounds; weather inline.
 * Only Date is faked; the clock is frozen to Thursday 5 Nov 2026 in Mexico City.
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

beforeEach(() => {
  mockEnabled = true
  window.localStorage.clear()
  ;(global as any).fetch = jest.fn(() => Promise.reject(new Error('offline'))) // WeatherCard hides itself
  ;(window as any).IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} }
  freeze('2026-11-05T18:00:00Z') // Thu 5 Nov 2026, 12:00 in Mexico City
})
afterEach(() => jest.useRealTimers())

async function mount(over: Partial<React.ComponentProps<typeof AgendaSection>> = {}) {
  let u!: ReturnType<typeof render>
  await act(async () => { u = render(<AgendaSection lang="es" agenda={agenda} showUnverified {...over} />) })
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
    expect(screen.getByText('Lo que pasa en la ciudad este mes y el siguiente.')).toBeInTheDocument()
    expect(container.querySelector('[class*="weatherCard"]')).toBeNull()
    expect(container.querySelector('[class*="wxInline"]')).not.toBeNull()
    expect(container.querySelectorAll('button[aria-expanded]')).toHaveLength(0) // nothing collapses any more
  })

  test('tabs: the current month first and selected, then the next one (Preview: Noviembre, Diciembre); no "Tu estancia"', async () => {
    const { tabs } = await mount()
    expect(tabs().map((t) => t.textContent)).toEqual(['Noviembre', 'Diciembre'])
    expect(tabs().map((t) => t.getAttribute('aria-pressed'))).toEqual(['true', 'false'])
  })

  test('Production: November and December tabs, the verified events only (no "Por confirmar" pill anywhere)', async () => {
    const { tabs, container, click, rows } = await mount({ showUnverified: false })
    expect(tabs().map((t) => t.textContent)).toEqual(['Noviembre', 'Diciembre'])
    expect(rows()).toHaveLength(6)
    expect(container.querySelectorAll('[class*="agPill"]')).toHaveLength(0)
    await click(tabs()[1])
    expect(rows()).toHaveLength(10)
    expect(container.querySelectorAll('[class*="agPill"]')).toHaveLength(0)
  })

  test('November: every event from today on (the ones already over are hidden), compact rows sorted by start', async () => {
    const { titles, rows } = await mount()
    expect(rows()).toHaveLength(16)
    expect(titles()).not.toContain('Gran Desfile de Día de Muertos') // Oct 31, over
    expect(titles()).not.toContain('Festival Cacao para Todos') // ends Nov 1, over
    const first = rows()[0]
    expect(first).toHaveTextContent('23 OCT – 8 NOV')
    expect(first).toHaveTextContent('Cultura')
    expect(first).not.toHaveTextContent('Paseo de la Reforma') // no venue line
    const karol = rows().find((r) => /Karol G/.test(r.textContent!))!
    expect(karol).toHaveTextContent('Música')
    expect(karol).not.toHaveTextContent('Estadio')
  })

  test('December tab: the ten verified December events, no pill', async () => {
    const { tabs, rows, titles, click, container } = await mount()
    await click(tabs()[1])
    expect(tabs().map((t) => t.getAttribute('aria-pressed'))).toEqual(['false', 'true'])
    expect(rows()).toHaveLength(10)
    expect(titles()).toEqual(expect.arrayContaining(['Maná', 'Santa Run', 'Marvel Run 2026']))
    expect(container.querySelectorAll('ul[class*="agList"] [class*="agPill"]')).toHaveLength(0)
  })

  test('recurring items NEVER appear inside a month tab; they live in their own group "Cada semana en la ciudad"', async () => {
    const { container, tabs, rows, click } = await mount({ showUnverified: true })
    const RECURRING = ['Lucha libre', 'Bazar Sábado', 'Muévete en Bici', 'Mirador']
    const dated = () => rows().map((r) => r.textContent!).join('|')
    for (const t of RECURRING) expect(dated()).not.toContain(t)
    await click(tabs()[1])
    for (const t of RECURRING) expect(dated()).not.toContain(t)
    const weekly = [...container.querySelectorAll('div[class*="agGroup"]')].find((g) => /Cada semana en la ciudad/.test(g.textContent!)) as HTMLElement
    expect(weekly.querySelectorAll('li[class*="agCard"]')).toHaveLength(4)
    for (const t of RECURRING) expect(weekly).toHaveTextContent(t)
    expect(container.querySelectorAll('ul[class*="agList"] [class*="agCard"]')).toHaveLength(0)
  })

  test('no event renders twice in one tab (two shows of one artist on different dates are two rows with different dates)', async () => {
    const { tabs, rows, click } = await mount({ showUnverified: true })
    for (const i of [0, 1]) {
      await click(tabs()[i])
      const keys = rows().map((r) => r.textContent)
      expect(new Set(keys).size).toBe(keys.length)
    }
  })

  test('the real data has no links: no row is a link, none shows the ↗', async () => {
    const { rows, container } = await mount({ showUnverified: true })
    expect(rows().length).toBeGreaterThan(0)
    expect(container.querySelectorAll('ul[class*="agList"] a')).toHaveLength(0)
    expect(container.querySelector('ul[class*="agList"]')!.textContent).not.toContain('↗')
  })

  test('a row WITH a url (the component still supports it) is one link (new tab, ↗, sr-only hint); one without is plain', async () => {
    const withUrl = { ...agenda, events: agenda.events.map((e) => (e.id === 'el-camino-reforma' ? { ...e, url: 'https://example.com/camino' } : e)) }
    const { rows } = await mount({ agenda: withUrl })
    const a = rows().find((r) => /El Camino/.test(r.textContent!))!.querySelector('a')!
    expect(a).toHaveAttribute('href', 'https://example.com/camino')
    expect(a).toHaveAttribute('target', '_blank')
    expect(a.getAttribute('rel')).toContain('noopener')
    expect(a.textContent).toContain('↗')
    expect(rows().find((r) => /Karol G/.test(r.textContent!))!.querySelector('a')).toBeNull()
    expect(rows().every((r) => !r.querySelector('button'))).toBe(true)
  })

  test('the day trips are always visible, in the same card layout as "Every week in the city" (text only, no links)', async () => {
    const { container } = await mount()
    const groups = [...container.querySelectorAll('div[class*="agGroup"]')] as HTMLElement[]
    expect(groups.map((g) => g.querySelector('h3')!.textContent)).toEqual(['Cada semana en la ciudad', 'Escapadas de un día'])
    // identical markup shape: title h3 + ul.agCards of li.agCard (when · title · line)
    for (const g of groups) {
      expect(g.querySelector('ul[class*="agCards"]')).not.toBeNull()
      for (const li of g.querySelectorAll('li')) {
        expect(li.className).toMatch(/agCard/)
        expect(li.querySelectorAll('span')).toHaveLength(3)
      }
    }
    const trips = groups[1]
    for (const t of ['Xochimilco', 'Teotihuacán', 'Los Dinamos', 'Tepoztlán']) expect(trips).toHaveTextContent(t)
    expect(trips.querySelectorAll('a, img, button, [class*="agPill"]')).toHaveLength(0)
  })

  test('quiet state: no month with an event → the quiet card and no tabs, the two groups still there', async () => {
    freeze('2027-03-10T18:00:00Z')
    const { container, tabs } = await mount()
    expect(tabs()).toHaveLength(0)
    expect(screen.getByText('Días tranquilos en la ciudad')).toBeInTheDocument()
    expect(container.querySelectorAll('div[class*="agGroup"]')).toHaveLength(2)
  })

  test('the list column is capped at 720px (class on the body)', async () => {
    const { container } = await mount()
    expect(container.querySelector('[class*="agBody"]')).not.toBeNull()
  })
})

describe('AgendaSection — ES / EN', () => {
  test('same structure in both languages; every visible string switches', async () => {
    const es = await mount({ lang: 'es' })
    const shape = (u: typeof es) => ({ tabs: u.tabs().length, rows: u.rows().length, links: u.container.querySelectorAll('a').length, cards: u.container.querySelectorAll('[class*="agCard"]').length })
    const esShape = shape(es); es.unmount()
    const en = await mount({ lang: 'en' })
    expect(shape(en)).toEqual(esShape)
    expect(screen.getByRole('heading', { name: "While you're here" })).toBeInTheDocument()
    expect(en.tabs().map((t) => t.textContent)).toEqual(['November', 'December'])
    expect(screen.getByText("What's happening in the city this month and next.")).toBeInTheDocument()
    expect(screen.getByText('Every week in the city')).toBeInTheDocument()
    expect(screen.getByText('Day trips')).toBeInTheDocument()
    expect(en.container.textContent).not.toMatch(/Cada semana|Escapadas|Domingos|Martes|Sábados|Al atardecer|estancia/)
  })

  test('English: Preview shows "To confirm" on the still-unverified November events', async () => {
    await mount({ lang: 'en', showUnverified: true })
    expect(screen.getAllByText('To confirm').length).toBeGreaterThan(0)
  })

  test('quiet state in English', async () => {
    freeze('2027-03-10T18:00:00Z')
    await mount({ lang: 'en' })
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

  test('agenda layout: "Explore by mood" sits right below "Worth the time" and above the agenda, and no longer under the host letter', async () => {
    const slug = 'host-me-tender-agenda'
    await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    const exp = screen.getByRole('heading', { name: 'Worth the time' })
    const mood = screen.getByRole('heading', { name: 'What are you in the mood for?' })
    const practical = document.getElementById('practico')!
    expect(before(exp, mood)).toBe(true)
    expect(before(mood, screen.getByRole('heading', { name: "While you're here" }))).toBe(true)
    expect(before(practical, mood)).toBe(true) // it was above the practical section before
  })

  test('other demo guides keep "Explore by mood" above the practical section', async () => {
    const slug = 'host-me-tender'
    await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    const mood = screen.getByRole('heading', { name: 'What are you in the mood for?' })
    expect(before(mood, document.getElementById('practico')!)).toBe(true)
    expect(before(mood, screen.getByRole('heading', { name: 'Worth the time' }))).toBe(true)
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
      ['host-me-tender-agenda', ['practical', 'zones', 'itin', 'exp', 'mood', 'agenda', 'food', 'beyond', 'discover']],
      ['host-me-tender', ['mood', 'practical', 'zones', 'itin', 'weekly', 'exp', 'food', 'beyond', 'discover']],
    ] as const) {
      const { container, unmount } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
      const secs = [...container.querySelectorAll('section')].filter((x) => x.querySelector('h2'))
      const from = secs.findIndex((x) => (slug === 'host-me-tender-agenda' ? x.id === 'practico' : /What are you in the mood for\?/.test(x.textContent!)))
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

  test('demo guides (agenda layout): the weekly group "Every week in the city" comes right after the agenda list, in English', async () => {
    const slug = 'host-me-tender-alejandro'
    const { container } = await renderGuide(buildDemoPartner(getDemoProspect(slug)!), demoProps(slug))
    const weekly = container.querySelector('#aqui [class*="agGroup"]') as HTMLElement
    expect(weekly).toHaveTextContent('Every week in the city')
    expect(weekly).toHaveTextContent('Sundays · 8am–2pm')
    expect(weekly).not.toHaveTextContent(/Cada semana|Domingos|Martes y viernes|Sábados|Al atardecer/)
  })
})
