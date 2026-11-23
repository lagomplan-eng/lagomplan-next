/**
 * The hotel edition in Spanish, in the browser (?lang=es), with every practical chip opened: same rules as the English
 * pass in hotel-guide.jest.test.tsx. Nothing may belong to the Livin property.
 */
import { render, fireEvent, act } from '@testing-library/react'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { buildHotelGuideProps } from '../content/guia/hotel/resolve'
import { HOTEL_ZONES, ZONE_LABEL, ZONE_NEIGHBORHOOD, type HotelZone } from '../content/guia/hotel/zones'
import { CHEF_WHATSAPP_NUMBER } from '../lib/guia/links'

beforeEach(() => { (global as { fetch?: unknown }).fetch = jest.fn(() => Promise.reject(new Error('offline'))) })

function openEverything(zone: HotelZone) {
  window.history.pushState({}, '', `/guia/cdmx/${zone}?lang=es`)
  const view = render(<GuiaClient {...buildHotelGuideProps(zone)!} />)
  const practical = view.container.querySelector('#practico')!
  const seen: string[] = []
  const grab = () => seen.push(practical.textContent ?? '')
  grab()
  // The chip row appears after hydration; open each chip so every panel's text is on screen once.
  practical.querySelectorAll('button[aria-pressed]').forEach((chip) => { act(() => { fireEvent.click(chip) }); grab() })
  return { view, practicalText: seen.join('\n'), pageText: () => view.container.textContent ?? '' }
}

describe.each(HOTEL_ZONES)('%s hotel guide, Spanish', (zone) => {
  // Rendered inside each test: Testing Library unmounts after every test.
  const open = () => { const o = openEverything(zone); return { view: o.view, text: o.pageText() + '\n' + o.practicalText } }

  test('new order content: banner text and updated line, how much time, good to know, where next, GetYourGuide buttons', () => {
    const { view, text } = open()
    expect(text).toContain('Preparada como la prepararía un amigo, no un buscador. Solo lugares verificados.')
    expect(text).toContain('Actualizada en noviembre de 2026')
    expect(text).toContain('¿Cuánto tiempo tienes?')
    expect(text).toContain('Bueno saber')
    expect(text).not.toContain('Un comienzo tranquilo para tu viaje')
    expect(text).toContain('¿Cuál es tu próximo destino?')
    expect(text).not.toContain('Personalizar mi viaje en 60 segundos')
    expect(text).not.toContain('Lagomplan va más allá de esta ciudad')
    expect(text).not.toContain('Los imperdibles')
    expect(view.container.querySelectorAll('a.expBookLink, a[class*="expBookLink"]')).toHaveLength(4)
    expect((text.match(/Reservar en GetYourGuide/g) ?? []).length).toBe(4)
    const quickEs = ['Solo unas horas', 'Arte moderno mexicano y un jardín de esculturas, dentro de Chapultepec.', 'Café de Chiapas y pan recién horneado en una calle tranquila y arbolada, a una cuadra de Reforma.', 'Cocina con ingredientes de pequeños productores del Valle de México y buenos tragos. Una joya escondida en la Condesa.', 'Mejor de miércoles a sábado. Entre paradas, un trayecto corto.']
    for (const q of quickEs) zone === 'condesa' ? expect(text).toContain(q) : expect(text).not.toContain(q)
    expect(view.container.querySelectorAll('.moodGrid button, [class*="moodBtn"]').length).toBe(5)
    for (const hidden of ['Lavandería y tintorería', 'Restaurantes que reciben grupos', 'Catering y entrega a domicilio', 'Llegar tarde']) expect(text).not.toContain(hidden)
    expect(text).toContain('Vino y licores')
  })
  test('welcome banner and the zones title', () => {
    const { view, text } = open()
    expect(view.container.querySelector('h1')!.textContent).toBe(`Tu guía de ${ZONE_LABEL[zone]}`)
    expect(text).toContain('Cuatro zonas, cuatro maneras de vivir la ciudad')
    expect(text).toContain('Enviar esta guía a mi teléfono')
  })
  test('four tabs, no "Tu casa", the hotel zone open', () => {
    const { view, text } = open()
    const tabs = [...view.container.querySelectorAll('[role="tab"]')] as HTMLElement[]
    expect(tabs.map((t) => t.textContent)).toEqual(['Roma Norte', 'Condesa', 'Polanco', 'Centro'])
    expect(tabs.filter((t) => t.getAttribute('aria-selected') === 'true').map((t) => t.textContent)).toEqual([ZONE_NEIGHBORHOOD[zone]])
    expect(text).not.toMatch(/Tu casa/)
  })
  test('no check-out strip, no chefs, no massages', () => {
    const { view, text } = open()
    for (const bad of [/Check-out|Salida\b/, /Chef Adán|di Monaco|Take a Chef|Chefs a domicilio|Chefs en casa/, /Masajes|Casa Ancestras/]) expect(text).not.toMatch(bad)
  })
  test('airport, earthquakes and cash answers show', () => {
    const { view, text } = open()
    for (const shown of ['La mayoría de los vuelos llegan al AICM', 'Sismos', 'Banamex']) expect(text).toContain(shown)
  })
  test('copy is for a hotel: reception, not "tu anfitrión"; nothing about "el departamento", "la propiedad" or "tu misma calle"', () => {
    const { view, text } = open()
    expect(text).toContain('pregunta en recepción por una clínica cercana')
    for (const bad of [/anfitri/i, /tu departamento/i, /la propiedad/i, /misma calle/i, /el wifi es confiable en la propiedad/i]) expect(text).not.toMatch(bad)
  })
  test('LOCK: no Livin, no Livin address, no WhatsApp link but the share button, no pilot id', () => {
    const { view, text } = open()
    const html = view.container.innerHTML
    for (const where of [text, html]) {
      expect(where).not.toMatch(/\bLivin\b/i)
      expect(where).not.toMatch(/livin_/i)
      expect(where).not.toContain('Veracruz 85')
      expect(where).not.toContain('mxcity_pilot')
    }
    for (const a of [...view.container.querySelectorAll('a[href*="wa.me"]')]) expect(a.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\?text=/)
    for (const n of ['525539149062', '525611224292', CHEF_WHATSAPP_NUMBER]) expect(html).not.toContain(n)
  })
})
