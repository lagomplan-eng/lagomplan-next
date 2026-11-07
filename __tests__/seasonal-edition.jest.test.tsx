/**
 * @jest-environment node
 *
 * __tests__/seasonal-edition.jest.test.tsx — the seasonal edition is SERVER-rendered (react-dom/server: no
 * browser, no effects): the text is in the HTML a plain fetch receives, in both states.
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
    dayNumbers: d.itinerary.days.map((x) => x.dayNumber),
    hotels: d.hotels.items.map((h) => ({ name: h.name, bookingUrl: h.bookingUrl })),
  }
}
const HTML = {
  es: renderToStaticMarkup(<SeasonalEdition {...props(hEs, 'active', '2026-11-26T18:00:00Z')} />),
  en: renderToStaticMarkup(<SeasonalEdition {...props(hEn, 'active', '2026-11-26T18:00:00Z')} />),
  expired: renderToStaticMarkup(<SeasonalEdition {...props(hEs, 'expired', '2026-12-01T18:00:00Z')} />),
}

describe('SeasonalEdition, active (server HTML)', () => {
  const h = HTML.es
  test('band, essentials heading and the three essentials', () => {
    expect(h).toContain('EDICIÓN THANKSGIVING 2026 — 25/30 NOV — VERIFICADO 23 OCT')
    expect(h).toContain('Lo esencial antes de reservar')
    for (const t of ['Todos necesitan pasaporte', 'Calendario SEP', 'muchos restaurantes cierran']) expect(h).toContain(t)
  })
  test('six day columns with leading zeros, weekday + date, each linking to its itinerary day', () => {
    for (const n of ['01', '02', '03', '04', '05', '06']) {
      expect(h).toContain(`href="#dia-${n}"`)
      expect(h).toMatch(new RegExp(`>${n}</span>`))
    }
    expect(h).toContain('MIÉ 25 NOV')
    expect(h).toContain('LUN 30 NOV')
    expect((h.match(/<li class="snap-start/g) ?? []).length).toBe(6)
  })
  test('events sit in their day, nothing is invented for empty days', () => {
    for (const t of ['Houston Rockets contra Phoenix Suns', 'Desfile de Thanksgiving H-E-B', 'Black Friday', 'El Cascanueces, Houston Ballet', 'Houston Texans contra Baltimore Ravens']) expect(h).toContain(t)
    const cols = h.split('<li class="snap-start').slice(1)
    const eventBlocks = (c: string) => (c.match(/text-\[13px\]/g) ?? []).length
    expect(cols.map(eventBlocks)).toEqual([1, 2, 2, 0, 1, 0]) // days 04 and 06 have no event block
  })
  test('"TODA LA TEMPORADA" with the three season-long lines', () => {
    expect(h).toContain('TODA LA TEMPORADA')
    for (const t of ['Zoo Lights', 'Galaxy Lights en Space Center Houston', '19 nov–3 ene', '27 nov–28 dic']) expect(h).toContain(t)
  })
  test('the old three-column table is gone', () => {
    expect(h).not.toContain('Qué pasa')
    expect(h).not.toContain('Cuándo ir')
    expect(h).not.toContain('<table')
  })
  test('the dated booking line: real anchors with checkin/checkout', () => {
    expect(h).toContain('Reserva con las fechas sugeridas:')
    expect((h.match(/checkin=2026-11-25&amp;checkout=2026-11-30/g) ?? []).length).toBe(3)
  })
  test('brand rules: tokens only, radius ≤ 4px, no shadows, no pure black/white', () => {
    expect(h).not.toMatch(/box-shadow|shadow-/)
    expect(h).not.toMatch(/#000(?![0-9a-f])|#fff(?![0-9a-f])|#ffffff|#000000/i)
    expect(h).not.toMatch(/rounded-(md|lg|xl|2xl|3xl|full)/)
    for (const t of ['#1B4D3E', '#F4F0E8', '#0F1A16', '#2D6B57', '#C8D9D3']) expect(h.toLowerCase()).toContain(t.toLowerCase())
  })
  test('English mirror', () => {
    const e = HTML.en
    expect(e).toContain('THANKSGIVING 2026 EDITION — 25/30 NOV — VERIFIED 23 OCT')
    expect(e).toContain('The essentials before you book')
    expect(e).toContain('ALL SEASON LONG')
    expect(e).toContain('WED 25 NOV')
    expect(e).toContain('Book with the suggested dates:')
    expect(e).not.toMatch(/Cuándo|Esta edición|TODA LA/)
  })
})

describe('SeasonalEdition, expired (server HTML)', () => {
  const h = HTML.expired
  test('one compact band: the edition has passed + the next-edition note + a link to the existing newsletter block', () => {
    expect(h).toContain('Esta edición ya pasó.')
    expect(h).toContain('La de 2027 sale en octubre.')
    expect(h).toContain('href="#newsletter"')
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
  test('an active edition with no essentials, events or season list shows only the band (+ empty columns)', () => {
    const min: FlatSeasonalEdition = { label: 'Edición Navidad 2026', windowStart: '2026-12-20', windowEnd: '2026-12-27', verifiedAt: '2026-11-01', timezone: 'America/Mexico_City' }
    const h = renderToStaticMarkup(<SeasonalEdition edition={min} state="active" locale="es" dayNumbers={[]} hotels={[]} />)
    expect(h).toContain('EDICIÓN NAVIDAD 2026 — 20/27 DIC — VERIFICADO 1 NOV')
    for (const t of ['Lo esencial', 'TODA LA TEMPORADA', 'Reserva con las fechas', '<li']) expect(h).not.toContain(t)
  })
})

describe('Itinerary day ids', () => {
  test('every day card has id dia-NN (the anchors of the day strip)', () => {
    const d = adaptFlatGuide(hEs, new Date('2026-11-26T18:00:00Z'))
    const html = renderToStaticMarkup(<Itinerary data={d.itinerary} locale="es" />)
    for (const n of ['01', '02', '03', '04', '05', '06']) expect(html).toContain(`id="dia-${n}"`)
  })
})
