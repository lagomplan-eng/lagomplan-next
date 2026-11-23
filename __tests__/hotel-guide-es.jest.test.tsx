/**
 * The hotel edition in Spanish, in the browser (?lang=es), with every practical chip opened: same rules as the English
 * pass in hotel-guide.jest.test.tsx. Nothing may belong to the Livin property.
 */
import { render, fireEvent, act } from '@testing-library/react'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { buildHotelGuideProps } from '../content/guia/hotel/resolve'
import { HOTEL_ZONES, ZONE_LABEL, ZONE_NEIGHBORHOOD, ZONE_TAB_ORDER, type HotelZone } from '../content/guia/hotel/zones'
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
    expect(view.container.querySelectorAll('.moodGrid button, [class*="moodBtn"]').length).toBe(6)
    for (const hidden of ['Lavandería y tintorería', 'Restaurantes que reciben grupos', 'Catering y entrega a domicilio', 'Llegar tarde']) expect(text).not.toContain(hidden)
    expect(text).toContain('Vino y licores')
  })
  test('welcome banner and the zones title', () => {
    const { view, text } = open()
    expect(view.container.querySelector('h1')!.textContent).toBe(`Tu guía de ${ZONE_LABEL[zone]}`)
    expect(text).toContain('Seis zonas, seis maneras de vivir la ciudad')
    expect(text).toContain('Enviar esta guía a mi teléfono')
  })
  test('zone tabs: own zone first and open, the others in order, no "Tu casa"; how far labels in Spanish', () => {
    const { view, text } = open()
    const zonesEl = view.container.querySelector('[data-hotel-section="neighborhoods"]')!
    const tabs = [...zonesEl.querySelectorAll('[role="tab"]')] as HTMLElement[]
    expect(tabs.map((t) => t.firstChild?.textContent)).toEqual(ZONE_TAB_ORDER[zone])
    expect(tabs.filter((t) => t.getAttribute('aria-selected') === 'true').map((t) => t.firstChild?.textContent)).toEqual([ZONE_NEIGHBORHOOD[zone]])
    for (const t of tabs) expect(t.querySelector('span')).toBeNull() // zone name only: no how-far label on the chips
    expect(text).not.toMatch(/A pie|Trayecto corto|Medio día/)
    expect(text).not.toMatch(/Tu casa/)
  })
  test('how much time: Condesa picks between two plans (short plan first), others show 48 horas directly', () => {
    const { view } = open()
    const timeEl = () => view.container.querySelector('[data-hotel-section="time"]')!
    const tabs = [...timeEl().querySelectorAll('[role="tab"]')] as HTMLElement[]
    if (zone !== 'condesa') {
      expect(tabs).toHaveLength(0)
      expect(view.container.textContent).toContain('48 horas')
      expect(view.container.textContent).not.toContain('Solo unas horas')
      return
    }
    expect(tabs.map((t) => [t.textContent, t.getAttribute('aria-selected')])).toEqual([['Solo unas horas', 'true'], ['48 horas', 'false']])
    expect(timeEl().textContent).toContain('Museo de Arte Moderno')
    expect(view.container.querySelector('[data-hotel-section="itinerary"]')).toBeNull()
    act(() => { fireEvent.click(tabs[1]) })
    expect(timeEl().textContent).not.toContain('Museo de Arte Moderno')
    expect(view.container.querySelector('[data-hotel-section="itinerary"]')).not.toBeNull()
    expect(view.container.textContent).toContain('48 horas')
    act(() => { fireEvent.click(tabs[0]) })
    expect(timeEl().textContent).toContain('Museo de Arte Moderno')
  })
  test('the two new zones: Spanish text, map card without a number, link to the owner\'s list', () => {
    const { view } = open()
    const zonesEl = () => view.container.querySelector('[data-hotel-section="neighborhoods"]')!
    const tab = (name: string) => ([...zonesEl().querySelectorAll('[role="tab"]')] as HTMLElement[]).find((t) => t.firstChild?.textContent === name)!
    act(() => { fireEvent.click(tab('San Miguel Chapultepec')) })
    let card = zonesEl().querySelector('a[href^="https://maps.app.goo.gl"]') as HTMLAnchorElement
    expect(card.getAttribute('href')).toBe('https://maps.app.goo.gl/ZFKMj2iBMeL7fxHK7')
    expect(card.textContent).toContain('Ver los lugares en el mapa')
    expect(card.textContent).not.toMatch(/\d/)
    expect(card.textContent).toContain('Lista de Google Maps · San Miguel Chapultepec')
    expect(zonesEl().textContent).toContain('Galerías tras muros antiguos, una casa de Barragán, la orilla del bosque.')
    expect(zonesEl().textContent).toContain('La última casa de Luis Barragán: color, luz y una alberca interior. Solo con cita.')
    expect(zonesEl().textContent).toContain(zone === 'condesa' ? 'Junto a la Condesa; casi todo queda a una caminata corta.' : 'A un trayecto corto; combínalo con Chapultepec.')
    act(() => { fireEvent.click(tab('Coyoacán')) })
    card = zonesEl().querySelector('a[href^="https://maps.app.goo.gl"]') as HTMLAnchorElement
    expect(card.getAttribute('href')).toBe('https://maps.app.goo.gl/fHKhCCToYVaqFmrEA')
    expect(card.textContent).toContain('Ver los lugares en el mapa')
    expect(zonesEl().textContent).toContain('Un trayecto largo al sur; planea medio día.')
    expect(zonesEl().textContent).toContain('Jardín Centenario y Plaza Hidalgo')
    expect(zonesEl().textContent).toContain('De lote pequeño, sin prisa.') // Café Avellaneda, reused word for word
  })
  test('Hidden gem / Joya escondida sits on the place name line in the mood panel', () => {
    const { view } = open()
    const btn = ([...view.container.querySelectorAll('[class*="moodBtn"]')] as HTMLElement[]).find((b) => b.textContent === 'Lugares escondidos')!
    act(() => { fireEvent.click(btn) })
    const names = [...view.container.querySelectorAll('[class*="moodItemName"]')]
    expect(names).toHaveLength(3)
    for (const n of names) expect(n.textContent).toContain('Joya escondida')
    expect(view.container.textContent).not.toMatch(/Arte\b(?! )|Comida y bebida/)
  })
  test('jump menu, monday row, shop mood, footer line, destination cards (Spanish)', () => {
    const { view, text } = open()
    const links = [...view.container.querySelectorAll('header nav a')].map((a) => [a.getAttribute('href'), a.textContent])
    expect(links).toEqual([['#zonas', 'Cerca de mí'], ['#planes', 'Planes'], ['#experiencias', 'Experiencias'], ['#bueno-saber', 'Bueno saber']])
    expect(view.container.querySelector('header')!.textContent).not.toMatch(/Tu estancia|Guest Stay/)
    expect([...view.container.querySelectorAll('nav[class*="hotelJumpMobile"] a')].map((a) => a.textContent)).toEqual(['Cerca de mí', 'Planes', 'Experiencias', 'Bueno saber'])
    expect(text).toContain('lagomplan · guía de barrio')
    expect(text).not.toContain('experiencia de huéspedes')
    expect(text).not.toContain('Cuídate') // Take care is gone; Gyms and studios moved to Before you arrive
    expect(text).toContain('Gyms and studios')
    const rows = [...view.container.querySelectorAll('[class*="todayTitle"]')].map((x) => x.textContent)
    expect(rows).toEqual(['La mayoría de los museos cierra.', 'Lucha libre, Arena México', 'Bazar Sábado, San Ángel', 'Muévete en Bici, Reforma', 'Mirador Torre Latinoamericana'])
    expect(text).toContain('Lunes')
    expect(text).toContain('La mayoría de los museos cierra.')
    expect(text).toContain('Buen día para parques, mercados y comer.')
    expect(text).toContain('Recomendamos lugares porque los revisamos. Nadie paga por aparecer.')
    expect(text).toContain('Quiero ir de compras')
    expect(text).not.toContain('Solo tengo unas horas')
    expect(view.container.querySelectorAll('.discoverCard, [class*="discoverCard"]')).toHaveLength(5)
    expect(text).toContain('¿Cuál es tu próximo destino?')
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
