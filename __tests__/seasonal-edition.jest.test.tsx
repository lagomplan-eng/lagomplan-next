/**
 * @jest-environment node
 *
 * __tests__/seasonal-edition.jest.test.tsx — the seasonal edition is SERVER-rendered (react-dom/server: no
 * browser, no effects): the text is in the HTML a plain fetch receives, in both states and both languages.
 * Layout rules asserted here: rules only (no panel/boxes), the hero's content column, an 8/4 top area, a
 * borderless day strip whose columns are whole links, and green used for links only.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { SeasonalEdition } from '../components/guides/SeasonalEdition'
import { Itinerary } from '../components/guides/Itinerary'
import { adaptFlatGuide } from '../lib/data/guides/adapter'
import { guide as hEs } from '../lib/data/guides/houston/es'
import { guide as hEn } from '../lib/data/guides/houston/en'
import type { FlatSeasonalEdition } from '../lib/data/guides/types'

const props = (g: typeof hEs, state: 'active' | 'expired', now: string) => {
  const d = adaptFlatGuide(g, new Date(now))
  return {
    edition: d.seasonal!.edition,
    state,
    locale: g.locale,
    days: d.itinerary.days.map((x) => ({ dayNumber: x.dayNumber, title: x.title })),
    hotels: d.hotels.items.map((h) => ({ name: h.name, bookingUrl: h.bookingUrl })),
  }
}
const HTML = {
  es: renderToStaticMarkup(<SeasonalEdition {...props(hEs, 'active', '2026-11-26T18:00:00Z')} />),
  en: renderToStaticMarkup(<SeasonalEdition {...props(hEn, 'active', '2026-11-26T18:00:00Z')} />),
  expired: renderToStaticMarkup(<SeasonalEdition {...props(hEs, 'expired', '2026-12-01T18:00:00Z')} />),
}
const tags = (h: string) => h.split('<').slice(1).map((t) => '<' + t.split('>')[0] + '>')

describe('SeasonalEdition, active (server HTML)', () => {
  const h = HTML.es

  test('container: no panel, no outer box; rules only (1px Pale Sage top and bottom); the hero content column', () => {
    expect(h).toContain('max-w-[1200px] mx-auto px-8 max-[768px]:px-5')
    expect(h).toContain('border-y')
    expect(h).toContain('border-color:#C8D9D3')
    expect(h).not.toMatch(/background|bg-\[|bg-white|rounded|box-shadow|shadow-/)
  })

  test('band label, then an 8/4 top area (stacks on mobile) with a vertical Pale Sage rule between', () => {
    expect(h).toContain('EDICIÓN THANKSGIVING 2026 — 25/30 NOV — VERIFICADO 23 OCT')
    expect(h).toContain('grid-cols-1 lg:grid-cols-12')
    expect(h).toContain('lg:col-span-8')
    expect(h).toContain('lg:col-span-4')
    expect(h).toMatch(/lg:col-span-4[^"]*lg:border-l/)
  })

  test('left (8): "Lo esencial antes de reservar" as H3 in Fraunces, bullets at most 68ch', () => {
    expect(h).toMatch(/<h3 class="font-display[^"]*"[^>]*>Lo esencial antes de reservar<\/h3>/)
    expect(h).toContain('max-w-[68ch]')
    for (const t of ['Todos necesitan pasaporte', 'Calendario SEP', 'muchos restaurantes cierran']) expect(h).toContain(t)
  })

  test('right (4): "TODA LA TEMPORADA" label + each item as title and ONE detail line', () => {
    expect(h).toContain('TODA LA TEMPORADA')
    for (const t of ['Zoo Lights', 'Galaxy Lights en Space Center Houston', 'El Cascanueces, Houston Ballet']) expect(h).toContain(t)
    expect(h).toContain('19 nov–3 ene · abre en Thanksgiving · desde US$24.95')
    expect(h).toContain('14 nov–3 ene')
    expect(h).toContain('27 nov–28 dic · estreno en Black Friday')
  })

  test('day strip: six whole-column links to #dia-0N; "01 · MIÉ 25" on one line; the itinerary day title; no boxes', () => {
    const lis = h.split('<li class="border-t').slice(1)
    expect(lis).toHaveLength(6)
    ;['01', '02', '03', '04', '05', '06'].forEach((n, i) => expect(lis[i]).toContain(`href="#dia-${n}"`))
    expect(h).toContain('01 · MIÉ 25')
    expect(h).toContain('06 · LUN 30')
    for (const t of hEs.itinerary.map((d) => d.title)) expect(h).toContain(t)
    expect(h).toContain('border-[#C8D9D3] sm:border-[#0F1A16]') // 1px rule above each column: strong from sm up
    expect(h).toContain('lg:border-l-[#C8D9D3]') // thin Pale Sage dividers between columns
    expect(h).toContain('group-hover:underline')
    expect(h).toContain('decoration-[#1B4D3E]') // hover underline in Forest Green
    expect(h).not.toMatch(/<li class="[^"]*\bborder\b(?!-)/) // never a full border on a cell
  })

  test('at most ONE event line per day, in the muted body colour; days with no event have none (never an empty cell)', () => {
    const lis = h.split('<li class="border-t').slice(1)
    expect(lis.map((c) => (c.match(/text-\[13px\]/g) ?? []).length)).toEqual([1, 1, 1, 0, 1, 0])
    for (const t of ['Rockets vs Suns, Toyota Center', 'Desfile H-E-B 9:00, gratis', 'Galleria desde 7:00 (horario 2025)', 'Texans vs Ravens 12:00, NRG Park']) expect(h).toContain(t)
    for (const c of lis) expect(c.replace(/<[^>]*>/g, '').trim().length).toBeGreaterThan(8) // every column has its number/date and title
  })

  test('dedupe: Zoo Lights and the Nutcracker are in the season list only, never as a day event line', () => {
    const eventLines = [...h.matchAll(/<span class="block mt-1[^>]*>([^<]*)<\/span>/g)].map((m) => m[1])
    expect(eventLines).toHaveLength(4)
    expect(eventLines.join(' | ')).not.toMatch(/Zoo Lights|Cascanueces/)
    const season = h.slice(h.indexOf('TODA LA TEMPORADA'), h.indexOf('<ol'))
    expect((season.match(/Zoo Lights/g) ?? []).length).toBe(1)
    expect((season.match(/El Cascanueces/g) ?? []).length).toBe(1)
  })

  test('colour: green only on links; detail and body text in Near Black or the muted body token; no Muted Green', () => {
    expect(h).not.toContain('#2D6B57')
    for (const t of tags(h)) if (/color:#1B4D3E/i.test(t)) expect(t.startsWith('<a ')).toBe(true)
    expect(h).toContain('color:#575C58')
    expect(h).toContain('color:#0F1A16')
    expect(h).not.toMatch(/#000(?![0-9a-f])|#fff(?![0-9a-f])|#ffffff|#000000/i)
  })

  test('the booking line stays below the strip: muted label + green links with the suggested dates', () => {
    expect(h.indexOf('Reserva con las fechas sugeridas:')).toBeGreaterThan(h.lastIndexOf('href="#dia-06"'))
    expect((h.match(/checkin=2026-11-25&amp;checkout=2026-11-30/g) ?? []).length).toBe(3)
  })

  test('the old three-column table is gone', () => {
    for (const t of ['Qué pasa', 'Cuándo ir', '<table']) expect(h).not.toContain(t)
  })

  test('English mirror', () => {
    const e = HTML.en
    expect(e).toContain('THANKSGIVING 2026 EDITION — 25/30 NOV — VERIFIED 23 OCT')
    expect(e).toContain('The essentials before you book')
    expect(e).toContain('ALL SEASON LONG')
    expect(e).toContain('01 · WED 25')
    expect(e).toContain('Nov 19–Jan 3 · open on Thanksgiving · from US$24.95')
    expect(e).toContain('Galleria from 7:00 am (2025 hours)')
    expect(e).not.toMatch(/Cuándo|Esta edición|TODA LA/)
  })
})

describe('SeasonalEdition, expired (server HTML)', () => {
  const h = HTML.expired
  test('one compact band between rules, in the hero column: the edition has passed + the note + a green link to #newsletter', () => {
    expect(h).toContain('max-w-[1200px] mx-auto px-8 max-[768px]:px-5')
    expect(h).toContain('Esta edición ya pasó.')
    expect(h).toContain('La de 2027 sale en octubre.')
    expect(h).toContain('href="#newsletter"')
    expect(h).not.toMatch(/background|rounded|shadow/)
    for (const t of tags(h)) if (/color:#1B4D3E/i.test(t)) expect(t.startsWith('<a ')).toBe(true)
  })
  test('no day strip, no essentials, no season list, no dated hotel line, no signup form', () => {
    for (const t of ['dia-01', 'TODA LA TEMPORADA', 'Lo esencial', 'Reserva con las fechas', '<form', '<input']) expect(h).not.toContain(t)
  })
  test('without a next-edition note an expired edition renders nothing (empty > invented)', () => {
    const bare: FlatSeasonalEdition = { ...hEs.seasonalEdition!, nextEditionNote: undefined }
    expect(renderToStaticMarkup(<SeasonalEdition {...props(hEs, 'expired', '2026-12-01T18:00:00Z')} edition={bare} />)).toBe('')
  })
})

describe('empty fields render nothing', () => {
  test('an active edition with no essentials, events or season list shows only the band and the strip (no empty cells, no labels)', () => {
    const min: FlatSeasonalEdition = { label: 'Edición Navidad 2026', windowStart: '2026-12-20', windowEnd: '2026-12-27', verifiedAt: '2026-11-01', timezone: 'America/Mexico_City' }
    const h = renderToStaticMarkup(<SeasonalEdition edition={min} state="active" locale="es" days={[]} hotels={[]} />)
    expect(h).toContain('EDICIÓN NAVIDAD 2026 — 20/27 DIC — VERIFICADO 1 NOV')
    for (const t of ['Lo esencial', 'TODA LA TEMPORADA', 'Reserva con las fechas', '<li', 'lg:col-span']) expect(h).not.toContain(t)
  })
  test('a season-only edition (no essentials) does not draw a divider with nothing on its left', () => {
    const only: FlatSeasonalEdition = { label: 'Edición X', windowStart: '2026-12-20', windowEnd: '2026-12-21', verifiedAt: '2026-11-01', timezone: 'America/Mexico_City', seasonLong: [{ title: 'Luces', dateRange: '1 dic–6 ene' }] }
    const h = renderToStaticMarkup(<SeasonalEdition edition={only} state="active" locale="es" days={[]} hotels={[]} />)
    expect(h).toContain('Luces')
    expect(h).not.toContain('lg:border-l lg:pl-8')
  })
})

describe('Itinerary day ids', () => {
  test('every day card has id dia-NN (the anchors of the day strip)', () => {
    const d = adaptFlatGuide(hEs, new Date('2026-11-26T18:00:00Z'))
    const html = renderToStaticMarkup(<Itinerary data={d.itinerary} locale="es" />)
    for (const n of ['01', '02', '03', '04', '05', '06']) expect(html).toContain(`id="dia-${n}"`)
  })
})
