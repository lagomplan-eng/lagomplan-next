/**
 * @jest-environment node
 *
 * The hotel edition IS the Livin guide (GuiaClient) with a short list of differences, and nothing in it may belong
 * to the Livin property. This file locks that for the three zones (English; the Spanish pass is
 * hotel-guide-es.jest.test.tsx).
 * (Livin and demo staying byte-identical is guia-unchanged.jest.test.tsx.)
 */
import { renderToStaticMarkup } from 'react-dom/server'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { getGuide } from '../content/guia'
import { HOTEL_FREE_EDITION, HOTEL_SECTION_IDS } from '../content/guia/hotel/config'
import { HOTEL_EXPERIENCES, HOTEL_BOOK_LABEL, experiencesArePlaceholders } from '../content/guia/hotel/experiences'
import { HOTEL_CONTENT_UPDATED, hotelUpdatedLine } from '../content/guia/hotel/config'
import { HOTEL_QUICK_PLAN } from '../content/guia/hotel/time'
import { HOTEL_PARTNER_SLUG, buildHotelGuideProps } from '../content/guia/hotel/resolve'
import { HOTEL_REWORDS, hotelReword, zonesHeading } from '../content/guia/hotel/rewords'
import { HOTEL_ZONES, ZONE_LABEL, ZONE_NEIGHBORHOOD, type HotelZone } from '../content/guia/hotel/zones'
import { GYG_PARTNER_ID, isGygUrl, isGygTourUrl } from '../lib/affiliate/gyg'
import { CHEF_WHATSAPP_NUMBER } from '../lib/guia/links'

const hotel = (zone: HotelZone) => renderToStaticMarkup(<GuiaClient {...buildHotelGuideProps(zone)!} />)
const livin = (zone: HotelZone) => {
  const g = getGuide(HOTEL_PARTNER_SLUG[zone])!
  return renderToStaticMarkup(<GuiaClient partner={g.partner} city={g.city} />)
}
const headings = (html: string) => [...html.matchAll(/<h[12][^>]*>([^<]*)</g)].map((m) => m[1])
const tabs = (html: string) => [...html.matchAll(/role="tab" aria-selected="(true|false)"[^>]*>([^<]*)</g)].map((m) => ({ selected: m[1] === 'true', label: m[2] }))
const visibleText = (html: string) => html.replace(/<[^>]+>/g, '\n').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').split('\n').map((x) => x.trim()).filter(Boolean).join('\n')
const HEADING_4 = 'Four zones, four ways to experience the city'
const HEADING_5 = 'Five zones, five ways to experience the city'
const cardTitles = (html: string) => { const a = html.indexOf('id="practico"'); return [...html.slice(a).matchAll(/<h4[^>]*>([^<]*)<\/h4>/g)].map((m) => m[1].replace(/&#x27;/g, "'").replace(/&amp;/g, '&')) }
const NOT_FOR_A_HOTEL = ['Laundry and dry cleaning', 'Restaurants that take groups', 'Catering and delivery', 'Coming back late']
const LIVIN_PROPERTY = ['Chefs at home', 'Massages']
const ORDER_EN = ['Your guide to {zone}', HEADING_4, 'How much time do you have?', '48 hours', 'What are you in the mood for?', 'Every week in Mexico City', 'Worth the time', 'Good to know', 'Ready to explore beyond your stay?']

// Everything that identifies the Livin property: the three "Your house" addresses and map links, plus the spots that
// only exist in a "Your house" list (a venue the city layer also names, such as Panadería Rosetta, is not Livin's).
const livinAddresses = HOTEL_ZONES.flatMap((z) => {
  const g = getGuide(HOTEL_PARTNER_SLUG[z])!
  const cityText = JSON.stringify(g.city)
  const own = [...g.partner.yourHouse.spots.en, ...g.partner.yourHouse.spots.es].map((s) => s.name).filter((n) => !cityText.includes(n))
  return [g.partner.yourHouse.name, g.partner.yourHouse.mapUrl, ...own]
})


describe.each(HOTEL_ZONES)('%s hotel guide', (zone) => {
  const html = hotel(zone)
  const base = livin(zone)
  const text = visibleText(html)
  const props = JSON.stringify(buildHotelGuideProps(zone))

  test('sections in the agreed order: welcome, zones, how much time, mood, weekly rhythm, experiences, good to know, Lagomplan block', () => {
    expect(headings(html)).toEqual(ORDER_EN.map((h) => h.replace('{zone}', ZONE_LABEL[zone])))
    const at = HOTEL_SECTION_IDS.map((id) => html.indexOf(`data-hotel-section="${id}"`))
    expect(at.every((i) => i >= 0)).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
    expect(html.indexOf('class="footer"')).toBeGreaterThan(html.indexOf('data-hotel-section="planner"'))
  })
  test('sections that are gone: must-sees, "Lagomplan goes further", the Livin letter, the newsletter', () => {
    for (const gone of ['The must-sees', 'One pick per craving', 'Lagomplan goes further than this city', 'A letter from your host', 'The Itinerary', 'type="email"']) expect(html).not.toContain(gone)
  })
  test('banner: new text, the updated line from one stored month, both buttons kept', () => {
    expect(headings(html)[0]).toBe(`Your guide to ${ZONE_LABEL[zone]}`)
    expect(text).toContain('Prepared like a friend would prepare it, not a search engine. Verified places only.')
    expect(text).toContain(hotelUpdatedLine('en', HOTEL_CONTENT_UPDATED))
    expect(text).toContain('Updated November 2026')
    expect(text).toContain('Begin exploring')
    expect(text).toContain('Send this guide to my phone')
    expect(html).not.toContain('Everything you need for your stay')
  })
  test('the zones section: four tabs, no "Your house", the hotel zone open, title says four', () => {
    const t = tabs(html)
    expect(t.map((x) => x.label)).toEqual(['Roma Norte', 'Condesa', 'Polanco', 'Centro'])
    expect(t.filter((x) => x.selected).map((x) => x.label)).toEqual([ZONE_NEIGHBORHOOD[zone]])
    expect(headings(html)).toContain(HEADING_4)
    expect(html).not.toMatch(/Your house|Tu casa|Your area|Tu zona/)
  })
  test('how much time: 48 hours everywhere; the short plan only in Condesa, never reused elsewhere', () => {
    expect(headings(html)).toContain('48 hours')
    const quick = ['Only a few hours', 'Museo de Arte Moderno', 'Niddo', 'Maleza', 'Best Wednesday to Saturday. Take a short ride between stops.']
    for (const q of quick) zone === 'condesa' ? expect(html).toContain(q) : expect(html).not.toContain(q)
    if (zone === 'condesa') {
      const maps = [...html.matchAll(/href="(https:\/\/www\.google\.com\/maps\/search\/[^"]*)"/g)].map((m) => m[1])
      expect(maps.length).toBeGreaterThanOrEqual(3)
      for (const stop of HOTEL_QUICK_PLAN.stops) expect(maps.some((m) => decodeURIComponent(m).includes(stop.name))).toBe(true)
    }
  })
  test('"Only a few hours" is not a mood button', () => {
    const buttons = [...html.matchAll(/aria-pressed="false" class="moodBtn[^"]*"[^>]*>.*?<div class="moodLabel">([^<]*)</g)].map((m) => m[1])
    expect(buttons.length).toBe(5)
    expect(buttons).not.toContain('Only a few hours')
  })
  test('good to know: new title, the four hidden items gone, nothing else lost, Wine and liquor under Everyday errands', () => {
    expect(headings(html)).toContain('Good to know')
    expect(html).not.toContain('A calm start to your trip')
    const mine = cardTitles(html), theirs = cardTitles(base)
    for (const h of NOT_FOR_A_HOTEL) expect(mine).not.toContain(h)
    for (const h of LIVIN_PROPERTY) expect(mine).not.toContain(h)
    // nothing disappeared that was not asked for: everything else the Livin guide shows is still here
    const expected = theirs.filter((x) => ![...NOT_FOR_A_HOTEL, ...LIVIN_PROPERTY].includes(x))
    // (Livin Polanco never showed "Gyms and studios": a one-item group gets no tab there. The hotel edition keeps it.)
    const extra = mine.filter((x) => !expected.includes(x))
    expect(extra).toEqual(zone === 'polanco' ? ['Gyms and studios'] : [])
    expect(expected.filter((x) => !mine.includes(x))).toEqual([])
    const errands = html.indexOf('Everyday errands'), wine = html.indexOf('Wine and liquor'), eating = html.indexOf('Eating in')
    expect(eating).toBe(-1)
    expect(wine).toBeGreaterThan(errands)
    expect(mine).toContain('Gyms and studios')
  })
  test('the airport, earthquakes and cash and ATMs answers show, like in the Livin guide', () => {
    for (const shown of ['Most flights land at AICM', 'Earthquakes', 'Cash and ATMs']) { expect(html).toContain(shown); expect(base).toContain(shown) }
  })
  test('lagomplan: one invitation with the five destinations under "Where next?"; no floating or footer planner button', () => {
    expect(headings(html)).toContain('Ready to explore beyond your stay?')
    expect(text).toContain('Plan my next trip')
    expect(text).toContain('Where next?')
    for (const d of ['Oaxaca', 'Tulum', 'San Miguel de Allende', 'Valle de Bravo', 'Mérida']) expect(html).toMatch(new RegExp(`<a class="link" href="[^"]*"[^>]*>${d}</a>`))
    expect(html).not.toContain('Personalize my trip in 60 seconds')
    expect(html).not.toContain('stickyWrap')
    expect(html).not.toContain('discoverGrid')
  })
  test('experiences: the four cards, each opening a GetYourGuide search with the partner ID; no Insider, no tour, no Barragán', () => {
    const cards = html.slice(html.indexOf('data-hotel-section="experiences"'), html.indexOf('id="practico"'))
    for (const title of ['Teotihuacán: Beyond the Pyramids', 'Lucha Libre at Arena México', 'Frida Kahlo &amp; Coyoacán', 'Mexico City Through Tacos']) expect(cards).toContain(title)
    expect(cards).not.toContain('Casa Luis Barragán')
    expect(cards.match(/class="expBookLink"/g)).toHaveLength(4)
    expect(cards.match(new RegExp(HOTEL_BOOK_LABEL.en, 'g'))).toHaveLength(4)
    for (const e of HOTEL_EXPERIENCES.items) {
      const u = new URL(e.bookUrl)
      expect(isGygUrl(e.bookUrl)).toBe(true)
      expect(isGygTourUrl(e.bookUrl)).toBe(false) // a search, not a tour
      expect(u.pathname).toBe('/s/')
      expect(u.searchParams.get('q')).toMatch(/Mexico City$/)
      expect(u.searchParams.getAll('partner_id')).toEqual([GYG_PARTNER_ID])
      expect(u.searchParams.get('cmp')).toBe('hotel-guide')
      expect(cards).toContain(e.bookUrl.replace(/&/g, '&amp;'))
    }
    expect(experiencesArePlaceholders()).toBe(true)
  })
  test('no check-out strip, no chefs, no massages, no host letter', () => {
    if (zone === 'condesa') expect(base).toContain('Check-out')
    expect(html).not.toMatch(/Check-out|Check-in/i)
    for (const bad of ['Chefs at home', 'Chef Adán', 'di Monaco', 'Take a Chef', 'Massages', 'Casa Ancestras', 'acuityscheduling', '525611224292', CHEF_WHATSAPP_NUMBER]) expect(html).not.toContain(bad)
  })
  test('the Transportation card keeps no Insider sentence', () => {
    expect(html).toContain('Use Uber, cheaper and safer than hailing on the street.')
    expect(html).not.toContain('private transport')
  })
  test('nothing that belongs to the property', () => {
    for (const bad of [/your host/i, /apartment/i, /your unit/i, /at the property/i, /own street/i]) expect(text).not.toMatch(bad)
  })
  test('LOCK: no Livin, no Livin address, no WhatsApp link but the share button, no pilot id (page and page source)', () => {
    for (const where of [text, html, props]) {
      expect(where).not.toMatch(/\bLivin\b/i)
      expect(where).not.toMatch(/livin_/i)
      expect(where).not.toContain('Veracruz 85')
      expect(where).not.toContain('mxcity_pilot')
      for (const a of livinAddresses) expect(where).not.toContain(a)
    }
    const waLinks = [...html.matchAll(/https?:\/\/wa\.me\/[^"\s]*/g)].map((m) => m[0])
    expect(waLinks.length).toBeGreaterThan(0)
    for (const l of waLinks) expect(l).toMatch(/^https:\/\/wa\.me\/\?text=/)
    for (const n of ['525539149062', '525611224292', CHEF_WHATSAPP_NUMBER]) { expect(html).not.toContain(n); expect(props).not.toContain(n) }
  })
  test('no Insider link, number or entry anywhere (page and page source)', () => {
    for (const where of [html, props])
      for (const bad of ['Insider', '525539149062', 'Book via WhatsApp', 'Reservar por WhatsApp', 'Your own plan', 'Tu propio plan']) expect(where).not.toContain(bad)
  })
  test('the Livin guide itself carries no hotel markers', () => {
    expect(base).not.toContain('data-hotel-section')
  })
})

describe('the three zones cannot drift apart', () => {
  const pages = Object.fromEntries(HOTEL_ZONES.map((z) => [z, hotel(z)])) as Record<HotelZone, string>
  const groups = (html: string) => ['Before you arrive', 'Everyday errands', 'Eating in', 'Take care'].filter((g) => html.includes(g))
  const sections = (html: string) => [...html.matchAll(/data-hotel-section="([a-z]+)"/g)].map((m) => m[1])
  test('same sections in the same order (apart from the welcome headline)', () => {
    const [a, ...rest] = HOTEL_ZONES.map((z) => headings(pages[z]).slice(1))
    for (const r of rest) expect(r).toEqual(a)
    const [m, ...others] = HOTEL_ZONES.map((z) => sections(pages[z]))
    expect(m).toEqual([...HOTEL_SECTION_IDS])
    for (const r of others) expect(r).toEqual(m)
  })
  test('same four zone tabs', () => {
    const [a, ...rest] = HOTEL_ZONES.map((z) => tabs(pages[z]).map((t) => t.label))
    for (const r of rest) expect(r).toEqual(a)
  })
  // Differences that come from the content files, not from this edition. Listed so a change shows up here.
  test('the practical groups each zone has (documented, not padded)', () => {
    expect(Object.fromEntries(HOTEL_ZONES.map((z) => [z, groups(pages[z])]))).toEqual({
      condesa: ['Before you arrive', 'Everyday errands', 'Take care'],
      roma: ['Before you arrive', 'Everyday errands', 'Take care'],
      polanco: ['Before you arrive', 'Everyday errands', 'Take care'],
    })
  })
  test('the only difference in how much time: Condesa has the short plan', () => {
    const h = (z: HotelZone) => headings(pages[z]).join('|')
    expect(h('condesa')).toBe(h('roma').replace('Roma Norte', 'Condesa'))
    expect(pages.condesa.includes('Museo de Arte Moderno')).toBe(true)
    expect(pages.roma.includes('Museo de Arte Moderno') || pages.polanco.includes('Museo de Arte Moderno')).toBe(false)
  })
})

describe('"I\'m hungry" and the moods', () => {
  test.each(['en', 'es'] as const)('%s: "short" is gone; the five must-sees join "hungry" with their label and exact text; the other three stay put', (lang) => {
    const city = buildHotelGuideProps('condesa')!.city
    const g = getGuide('livin_condesa')!
    const moods = city.copy[lang].moods
    expect(moods.map((m) => m.id)).not.toContain('short')
    expect(moods).toHaveLength(g.city.copy[lang].moods.length - 1)
    const hungry = moods.find((m) => m.id === 'hungry')!
    const picks = ['El Vilsito', 'Café Avellaneda', 'Quintonil', 'Café Nin', 'Nevería Roxy']
    const added = hungry.items.slice(g.city.copy[lang].moods.find((m) => m.id === 'hungry')!.items.length)
    expect(added.map((i) => i.name)).toEqual(picks)
    for (const i of added) {
      const src = g.city.copy[lang].foodCollections.find((c) => c.name === i.name)!
      expect({ note: i.note, tag: i.tag }).toEqual({ note: src.note, tag: src.tag })
    }
    const leftOut = g.city.copy[lang].foodCollections.map((c) => c.name).filter((n) => !picks.includes(n))
    expect(leftOut).toEqual(['Panadería Rosetta', 'Licorería Limantour', 'El Turix']) // already elsewhere in the guide
  })
})

describe('rewording for a hotel', () => {
  test('the number in the zones title follows the number of tabs', () => {
    expect(zonesHeading('en', 4)).toBe(HEADING_4)
    expect(zonesHeading('es', 4)).toBe('Cuatro zonas, cuatro maneras de vivir la ciudad')
    expect(zonesHeading('en', 5)).toBe(HEADING_5)
    expect(zonesHeading('es', 5)).toBe('Cinco zonas, cinco maneras de vivir la ciudad')
  })
  test('the updated line comes from one stored month, in both languages', () => {
    expect(hotelUpdatedLine('en', '2026-11')).toBe('Updated November 2026')
    expect(hotelUpdatedLine('es', '2026-11')).toBe('Actualizada en noviembre de 2026')
    expect(hotelUpdatedLine('en', '2027-03')).toBe('Updated March 2027')
  })
  test('every reword has something to change in the copy, and removes its "before"', () => {
    const g = getGuide('livin_condesa')!
    const zoneFiles = HOTEL_ZONES.map((z) => JSON.stringify(require('../content/guia/zones').getZone(z)))
    const source = JSON.stringify(g.city.copy) + JSON.stringify(require('../content/guia/faq/base').faqBase) + zoneFiles.join('')
    for (const r of HOTEL_REWORDS) {
      expect(source).toContain(r.before)
      expect(hotelReword(r.before, r.lang)).toBe(r.after)
      expect(r.after).not.toContain(r.before)
    }
  })
  test('the Livin guide keeps its own text (the rewording is hotel-only)', () => {
    expect(livin('condesa')).toMatch(/ask your host for a nearby clinic|Check-out/)
  })
})

describe('hotel zone to Livin guide', () => {
  test('each zone uses the matching Livin guide as its base', () => {
    expect(HOTEL_PARTNER_SLUG).toEqual({ condesa: 'livin_condesa', roma: 'livin_roma', polanco: 'livin_polanco' })
  })
  test('the edition config only holds the banner and tracking settings', () => {
    expect(HOTEL_FREE_EDITION.zoneHeadline.es.replace('{zone}', 'Roma Norte')).toBe('Tu guía de Roma Norte')
    expect(HOTEL_FREE_EDITION.zoneHeadline.en.replace('{zone}', 'Polanco')).toBe('Your guide to Polanco')
    expect(HOTEL_FREE_EDITION.heroSub.es).toBe('Preparada como la prepararía un amigo, no un buscador. Solo lugares verificados.')
  })
})
