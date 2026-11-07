/**
 * @jest-environment node
 *
 * __tests__/guide-timely.jest.test.tsx — the dated block is SERVER-rendered: its text is in the HTML that
 * react-dom/server produces (no browser, no effects), which is what a plain fetch of the page receives.
 * Whether a block is current is the adapter's job (tests/guide-timely.test.ts).
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { GuideTimely } from '../components/guides/GuideTimely'
import type { FlatTimely } from '../lib/data/guides/types'

const DATA: FlatTimely = {
  validUntil: '2026-11-30',
  eyebrow: 'Esta temporada',
  title: 'Semana de Thanksgiving 2026',
  verifiedNote: 'Datos verificados el 23 de octubre de 2026.',
  essentialsTitle: 'Lo esencial antes de reservar',
  essentials: ['El jueves muchos restaurantes cierran.'],
  whenTitle: 'Cuándo ir',
  window: 'Ventana sugerida: del miércoles 25 al lunes 30 de noviembre de 2026.',
  table: { headers: ['Qué pasa', 'Fechas 2026', 'Qué cambia para tu viaje'], rows: [
    { what: 'Desfile', when: 'Jueves 26 de noviembre', impact: 'Gratuito' },
  ] },
  booking: { label: 'Reserva con las fechas sugeridas:', links: [{ name: 'The Post Oak Hotel', url: 'https://www.booking.com/hotel/us/the-post-oak.html?checkin=2026-11-25&checkout=2026-11-30&ref=lagomplan' }] },
}

describe('GuideTimely (server render)', () => {
  const html = renderToStaticMarkup(<GuideTimely data={DATA} />)

  test('the text is in the server HTML: title, verified note, essentials, window, calendar, booking line', () => {
    for (const t of ['Semana de Thanksgiving 2026', 'Datos verificados el 23 de octubre de 2026.', 'El jueves muchos restaurantes cierran.', 'Ventana sugerida', 'Desfile', 'Jueves 26 de noviembre', 'Reserva con las fechas sugeridas:']) expect(html).toContain(t)
  })

  test('the booking link is a real anchor with the dated url, opening in a new tab', () => {
    expect(html).toMatch(/<a [^>]*href="https:\/\/www\.booking\.com\/hotel\/us\/the-post-oak\.html\?checkin=2026-11-25&amp;checkout=2026-11-30&amp;ref=lagomplan"/)
    expect(html).toContain('target="_blank"')
    expect(html).toContain('noopener')
  })

  test('it marks itself for tests and for print/anchors', () => {
    expect(html).toContain('data-guide="timely"')
  })
})
