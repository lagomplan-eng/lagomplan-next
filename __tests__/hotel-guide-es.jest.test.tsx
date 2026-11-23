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
    const quickEs = ['Solo unas horas', 'Cuatro paradas, una tarde.', 'Arte moderno mexicano y un jardín de esculturas, dentro de Chapultepec.', 'Café de Chiapas y pan recién horneado en una calle tranquila y arbolada, a una cuadra de Reforma.', 'Una copa frente al Parque México. Arriba está Lucky, el bar de la azotea.', 'No en lunes. Trayectos cortos al inicio; las dos últimas paradas están a unos pasos.']
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
  test('how much time: Condesa picks between two plans in the same dark band (short plan first), others show 48 horas directly', () => {
    const { view } = open()
    const timeEl = () => view.container.querySelector('[data-hotel-section="time"], [data-hotel-section="time"]')!
    const bandEl = () => [...view.container.querySelectorAll('[data-hotel-section="time"] section[class*="sectionPine"]')].find((el) => !el.closest('[aria-hidden="true"]'))!
    const tabs = [...timeEl().querySelectorAll('[role="tab"]')] as HTMLElement[]
    if (zone !== 'condesa') {
      expect(tabs).toHaveLength(0)
      expect(bandEl().textContent).toContain('48 horas')
      expect(view.container.textContent).not.toContain('Solo unas horas')
      return
    }
    expect(tabs.map((t) => [t.textContent, t.getAttribute('aria-selected')])).toEqual([['Solo unas horas', 'true'], ['48 horas', 'false']])
    const band = () => bandEl().textContent ?? ''
    expect(band()).toContain('Unas horas')
    expect(band()).toContain('Cuatro paradas, una tarde.')
    for (const n of ['Museo de Arte Moderno', 'Niddo', 'Avenida Ámsterdam', 'Lindy']) expect(band()).toContain(n)
    expect(band()).toContain('La avenida ovalada bajo los árboles, trazada sobre un antiguo hipódromo. Camina una vuelta al atardecer.')
    expect(band()).toContain('No en lunes. Trayectos cortos al inicio; las dos últimas paradas están a unos pasos.')
    expect(band()).not.toContain('Maleza')
    expect([...bandEl().querySelectorAll('[class*="itinTime"]')].map((x) => x.textContent)).toEqual(['01', '02', '03', '04'])
    act(() => { fireEvent.click(tabs[1]) })
    expect(band()).toContain('48 horas')
    expect(band()).not.toContain('Lindy')
    act(() => { fireEvent.click(tabs[0]) })
    expect(band()).toContain('Lindy')
    // one band is visible at a time; the other is hidden but keeps the section's height
    expect(timeEl().querySelectorAll('[aria-hidden="true"] section[class*="sectionPine"]')).toHaveLength(1)
  })
  test('the share message ends with the guide address: the hotel short link in the guest\'s language, or the zone page', () => {
    // a hotel code starts the section/click tracking, which needs IntersectionObserver (not in jsdom)
    ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }
    window.history.pushState({}, '', `/guia/cdmx/${zone}?lang=es&h=abcd2345wxyz`)
    const { container } = render(<GuiaClient {...buildHotelGuideProps(zone)!} />)
    const link = container.querySelector('a[href^="https://wa.me/"]') as HTMLAnchorElement
    const msg = decodeURIComponent(link.getAttribute('href')!.replace('https://wa.me/?text=', ''))
    expect(msg).toMatch(/https?:\/\/\S+$/)
    expect(msg).toBe(`Mi guía de barrio de ${ZONE_LABEL[zone]}, de Lagomplan: https://www.lagomplan.com/g/abcd2345wxyz?lang=es&via=share`)
    expect(link.getAttribute('href')).not.toMatch(/localhost|vercel\.app/)
  })
  test('the two new zones: Spanish text; the map link names the open zone and links to the owner\'s list', () => {
    const { view } = open()
    const zonesEl = () => view.container.querySelector('[data-hotel-section="neighborhoods"]')!
    const tab = (name: string) => ([...zonesEl().querySelectorAll('[role="tab"]')] as HTMLElement[]).find((t) => t.firstChild?.textContent === name)!
    const link = () => zonesEl().querySelector('a[class*="hotelMapLink"]') as HTMLAnchorElement
    expect(link().textContent).toBe(`Mapa de ${ZONE_NEIGHBORHOOD[zone]} →`)
    act(() => { fireEvent.click(tab('San Miguel Chapultepec')) })
    expect(link().getAttribute('href')).toBe('https://maps.app.goo.gl/ZFKMj2iBMeL7fxHK7')
    expect(link().textContent).toBe('Mapa de San Miguel Chapultepec →')
    expect(zonesEl().textContent).not.toMatch(/Ver los lugares|Lista de Google Maps|Ver los \d+ lugares/)
    expect(zonesEl().querySelector('a[class*="nbMapCard"]')).toBeNull()
    expect(zonesEl().textContent).toContain('Galerías tras muros antiguos, una casa de Barragán, la orilla del bosque.')
    expect(zonesEl().textContent).toContain('La última casa de Luis Barragán: color, luz y una alberca interior. Solo con cita.')
    expect(zonesEl().textContent).toContain(zone === 'condesa' ? 'Junto a la Condesa; casi todo queda a una caminata corta.' : 'A un trayecto corto; combínalo con Chapultepec.')
    act(() => { fireEvent.click(tab('Coyoacán')) })
    expect(link().getAttribute('href')).toBe('https://maps.app.goo.gl/fHKhCCToYVaqFmrEA')
    expect(link().textContent).toBe('Mapa de Coyoacán →')
    expect(zonesEl().textContent).toContain('Un trayecto largo al sur; planea medio día.')
    expect(zonesEl().textContent).toContain('Jardín Centenario y Plaza Hidalgo')
    expect(zonesEl().textContent).toContain('De lote pequeño, sin prisa.') // Café Avellaneda, reused word for word
  })
  test('moods in Spanish: A special dinner first (Michelin label, zone, address, Map link); every pick has a Map link', () => {
    const { view } = open()
    const buttons = ([...view.container.querySelectorAll('[class*="moodBtn"]')] as HTMLElement[])
    expect(buttons.map((b) => b.textContent)).toEqual(['Una cena especial', 'Quiero ir de compras', 'Quiero cultura', 'Lugares escondidos', 'Tengo hambre', 'Quiero vida nocturna'])
    act(() => { fireEvent.click(buttons[0]) })
    const panel = view.container.querySelector('[class*="moodPanel"]') as HTMLElement
    const text = panel.textContent ?? ''
    for (const t of ['Una estrella Michelin', 'Dos estrellas Michelin', 'Gaba', 'Esquina Común', 'Em', 'Máximo', 'Rosetta', 'Quintonil', 'Pujol', 'Condesa · Av. Mazatlán 190', 'Roma Norte · Av. Álvaro Obregón 65 Bis', 'Polanco · Tennyson 133',
      'El menú degustación de Lucho Martínez en una casa pequeña sobre Ámsterdam. Reserva con tiempo.',
      'El menú degustación de Enrique Olvera, la mesa más conocida de la ciudad. Reserva con semanas de anticipación.']) expect(text).toContain(t)
    const links = [...panel.querySelectorAll('a')].map((a) => [a.textContent, decodeURIComponent(a.getAttribute('href')!)])
    expect(links).toHaveLength(7)
    for (const [label] of links) expect(label).toBe('Mapa')
    expect(links[3][1]).toContain('Máximo, Av. Álvaro Obregón 65 Bis, Roma Norte, Ciudad de México')
    expect(view.container.textContent).not.toContain('Viajo con niños')
    // every panel: one Map link per pick, and the size the plan says
    const sizes = [7, 7, 5, 6, 6, 7]
    for (const [i, b] of buttons.entries()) {
      act(() => { fireEvent.click(b) })
      const p = view.container.querySelector('[class*="moodPanel"]') as HTMLElement
      expect(p.querySelectorAll('[class*="moodItemName"]')).toHaveLength(sizes[i])
      expect(p.querySelectorAll('a')).toHaveLength(sizes[i])
    }
  })
  test.each(['es', 'en'] as const)('%s: no Hidden gem mark inside the "Hidden places" panel; elsewhere quiet and at most once per panel', (lang) => {
    window.history.pushState({}, '', `/guia/cdmx/${zone}?lang=${lang}`)
    const view = render(<GuiaClient {...buildHotelGuideProps(zone)!} />)
    const label = lang === 'es' ? 'Joya escondida' : 'Hidden gem'
    const button = (name: string) => ([...view.container.querySelectorAll('[class*="moodBtn"]')] as HTMLElement[]).find((b) => b.textContent === name)!
    act(() => { fireEvent.click(button(lang === 'es' ? 'Lugares escondidos' : 'Hidden places')) })
    const hidden = view.container.querySelector('[class*="moodPanel"]') as HTMLElement
    expect(hidden.textContent).toContain(lang === 'es' ? 'Foro Shakespeare' : 'Foro Shakespeare')
    expect(hidden.textContent).not.toContain(label)
    expect(hidden.querySelectorAll('[class*="moodItemName"]')).toHaveLength(6)
    // other panels: the mark sits inside the name line, soft green, at most once per place
    for (const name of lang === 'es' ? ['Quiero ir de compras', 'Tengo hambre', 'Una cena especial', 'Quiero cultura', 'Quiero vida nocturna'] : ["I want to shop", "I'm hungry", 'A special dinner', 'I want culture', 'I want nightlife']) {
      act(() => { fireEvent.click(button(name)) })
      const panel = view.container.querySelector('[class*="moodPanel"]') as HTMLElement
      for (const item of panel.querySelectorAll('[class*="moodItemName"]')) {
        const marks = [...item.querySelectorAll('span')].filter((x) => x.textContent === label)
        expect(marks.length).toBeLessThanOrEqual(1)
        for (const m of marks) expect((m as HTMLElement).style.color).toBe('rgb(62, 95, 88)') // #3E5F58
      }
      if (name === (lang === 'es' ? 'Tengo hambre' : "I'm hungry")) {
        // Maleza's label already says it: no inline mark on top
        const maleza = [...panel.querySelectorAll('[class*="moodItemName"]')].find((x) => x.textContent?.startsWith('Maleza'))!
        expect(maleza.textContent).toBe('Maleza')
      }
      if (name === (lang === 'es' ? 'Quiero ir de compras' : 'I want to shop')) expect(panel.textContent).toContain(label) // Proyecto Rufina
    }
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
