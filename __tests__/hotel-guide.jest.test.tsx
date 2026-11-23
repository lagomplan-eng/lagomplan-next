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
import { HOTEL_ZONES, ZONE_LABEL, ZONE_NEIGHBORHOOD, ZONE_TAB_ORDER, type HotelZone } from '../content/guia/hotel/zones'
import { HIDDEN_GEMS, HIDDEN_GEM_LABEL, isHiddenGem } from '../content/guia/hotel/themes'
import fs from 'fs'
import path from 'path'
import { EXTRA_ZONES, VERIFY } from '../content/guia/hotel/extra-zones'
import { HOTEL_EXTRA_ZONES_ON, HOTEL_ORIENTATION, HOTEL_PICK_ZONES } from '../content/guia/hotel/config'
import { HOTEL_JUMP, HOTEL_MOOD_ORDER } from '../content/guia/hotel/config'
import { GYG_PARTNER_ID, isGygUrl, isGygTourUrl } from '../lib/affiliate/gyg'
import { CHEF_WHATSAPP_NUMBER } from '../lib/guia/links'

const hotel = (zone: HotelZone) => renderToStaticMarkup(<GuiaClient {...buildHotelGuideProps(zone)!} />)
const livin = (zone: HotelZone) => {
  const g = getGuide(HOTEL_PARTNER_SLUG[zone])!
  return renderToStaticMarkup(<GuiaClient partner={g.partner} city={g.city} />)
}
const headings = (html: string) => [...html.matchAll(/<h[12][^>]*>([^<]*)</g)].map((m) => m[1])
// Zone tabs only: the plan buttons in "How much time" are tabs too.
const zonesPart = (html: string) => { const a = html.indexOf('data-hotel-section="neighborhoods"'); const b = html.indexOf('data-hotel-section="time"'); return a >= 0 && b > a ? html.slice(a, b) : html }
const tabs = (html: string) => [...zonesPart(html).matchAll(/role="tab" aria-selected="(true|false)"[^>]*>([^<]*)</g)].map((m) => ({ selected: m[1] === 'true', label: m[2] }))
const visibleText = (html: string) => html.replace(/<[^>]+>/g, '\n').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').split('\n').map((x) => x.trim()).filter(Boolean).join('\n')
const HEADING_6 = 'Six zones, six ways to experience the city'
const HEADING_4 = 'Four zones, four ways to experience the city'
const HEADING_5 = 'Five zones, five ways to experience the city'
const cardTitles = (html: string) => { const a = html.indexOf('id="practico"'); return [...html.slice(a).matchAll(/<h4[^>]*>([^<]*)<\/h4>/g)].map((m) => m[1].replace(/&#x27;/g, "'").replace(/&amp;/g, '&')) }
const NOT_FOR_A_HOTEL = ['Laundry and dry cleaning', 'Restaurants that take groups', 'Catering and delivery', 'Coming back late']
const LIVIN_PROPERTY = ['Chefs at home', 'Massages']
// Condesa opens on its short plan, so the 48 hours heading is not on screen until that button is chosen.
const orderEn = (zone: HotelZone) => ['Your guide to {zone}', HEADING_6, 'How much time do you have?', ...(zone === 'condesa' ? [] : ['48 hours']), 'What are you in the mood for?', 'Every week in Mexico City', 'Worth the time', 'Good to know', 'Ready to explore beyond your stay?']
const css = fs.readFileSync(path.join(process.cwd(), 'app/guia/[partner]/guia.module.css'), 'utf8')
const classOf = (html: string, id: string) => html.match(new RegExp(`<section class="([^"]*)"[^>]*data-hotel-section="${id}"`))?.[1] ?? null
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
    expect(headings(html)).toEqual(orderEn(zone).map((h) => h.replace('{zone}', ZONE_LABEL[zone])))
    const ids = HOTEL_SECTION_IDS.filter((id) => !(zone === 'condesa' && id === 'itinerary'))
    const at = ids.map((id) => html.indexOf(`data-hotel-section="${id}"`))
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
  test('the zones section: own zone first and open, the others nearest to farthest; title says six; no "Your house"', () => {
    const t = tabs(html)
    expect(t.map((x) => x.label)).toEqual(ZONE_TAB_ORDER[zone])
    expect(t[0].label).toBe(ZONE_NEIGHBORHOOD[zone])
    expect(t.filter((x) => x.selected).map((x) => x.label)).toEqual([ZONE_NEIGHBORHOOD[zone]])
    expect(headings(html)).toContain(HEADING_6)
    expect(html).not.toMatch(/Your house|Tu casa|Your area|Tu zona/)
  })
  test('zone chips show only the zone name; a compact map link on the same row replaces the map card', () => {
    const z = zonesPart(html)
    expect(z).not.toMatch(/On foot|Short ride|Half a day/)
    for (const chip of z.matchAll(/role="tab"[^>]*>(.*?)<\/button>/g)) expect(chip[1]).not.toContain('<span')
    expect(css).toMatch(/\.hotelCalm \.tabRow\s*{[^}]*flex-wrap:\s*nowrap[^}]*overflow-x:\s*auto/)
    // the old card (title, subtitle, dotted thumbnail) is gone in this edition
    for (const gone of ['nbMapCard', 'nbMapThumb', 'See all', 'Google Maps list']) expect(z).not.toContain(gone)
    // one link, after the chips and before the places, to the open zone's own list, named after it
    const links = [...z.matchAll(/<a class="hotelMapLink" href="([^"]*)"[^>]*>([^<]*)</g)]
    expect(links).toHaveLength(1)
    const own = buildHotelGuideProps(zone)!.city.neighborhoods[ZONE_NEIGHBORHOOD[zone]]
    expect(links[0][1]).toBe(own.mapUrl)
    expect(links[0][2]).toBe(`Map of ${ZONE_NEIGHBORHOOD[zone]} →`)
    expect(z.indexOf('hotelMapLink')).toBeGreaterThan(z.lastIndexOf('role="tab"'))
    expect(z.indexOf('hotelMapLink')).toBeLessThan(z.indexOf('class="spotList"'))
    // same row as the chips, pushed right; drops to the next line when it does not fit; plain text link on phones
    expect(css).toMatch(/\.hotelCalm \.nbControls\s*{[^}]*flex-direction:\s*row[^}]*flex-wrap:\s*wrap/)
    expect(css).toMatch(/\.hotelMapLink\s*{[^}]*margin-left:\s*auto[^}]*}/)
    expect(css).toMatch(/\.hotelMapLink\s*{[^}]*background:\s*transparent/)
    expect(css).not.toMatch(/\.hotelMapLink\s*{[^}]*box-shadow/)
    expect(css).toMatch(/max-width: 768px\)\s*{\s*\.hotelMapLink\s*{[^}]*margin-left:\s*0[^}]*flex:\s*0 0 100%[^}]*border:\s*0/)
  })
  test('the distance sentence of each tab, from the hotel zone\'s point of view', () => {
    const nbs = buildHotelGuideProps(zone)!.city.neighborhoods
    const says = (k: string) => nbs[k].orientation.en
    if (zone === 'polanco') {
      expect(says('Polanco')).toBe('Your own neighbourhood; most of these are a short walk.')
      expect(says('Condesa')).toBe('A short ride south; pair it with Roma Norte.')
      expect(says('Roma Norte')).toBe('A short ride; best combined with Condesa in one outing.')
      expect(says('Centro')).toBe('The historic core; plan half a day.')
      expect(says('San Miguel Chapultepec')).toBe('A short ride away; pair it with Chapultepec.')
    } else {
      expect(says('Roma Norte')).toBe('One of your closest zones; most of these are a 10-minute walk or less.')
      expect(says('Condesa')).toBe('One of your closest zones; most of these are a 10-minute walk or less.')
      expect(says('Centro')).toContain('plan half a day') // unchanged from the city layer
      expect(says('San Miguel Chapultepec')).toBe(zone === 'condesa' ? 'Next door to Condesa; most of it is a short walk.' : 'A short ride away; pair it with Chapultepec.')
    }
    expect(says('Coyoacán')).toBe('A long ride south; plan half a day.')
    expect(JSON.stringify(nbs)).not.toContain('two closest zones')
  })
  test('jump links live in the header (where "Guest Stay" was) and in a scrollable row for phones; no chip strip under the banner', () => {
    const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'))
    const links = [...header.matchAll(/<a href="#([a-z-]+)" class="eyebrowMono"[^>]*>([^<]*)</g)].map((m) => [m[1], m[2]])
    expect(links).toEqual(HOTEL_JUMP.map((j) => [j.id, j.label.en]))
    expect(links.map((l) => l[1])).toEqual(['Near me', 'Plans', 'Experiences', 'Good to know'])
    expect(header).not.toMatch(/Guest Stay|Tu estancia/)
    expect(header.indexOf('hotelJumpDesktop')).toBeLessThan(header.indexOf('langGroup')) // left of the ES / EN switch
    const mobile = html.slice(html.indexOf('hotelJumpMobile'), html.indexOf('class="hero"'))
    expect([...mobile.matchAll(/href="#([a-z-]+)"/g)].map((m) => m[1])).toEqual(HOTEL_JUMP.map((j) => j.id))
    expect(html).not.toMatch(/class="tab"[^>]*style="[^"]*inline-block/)
    for (const j of HOTEL_JUMP) expect(html).toContain(`id="${j.id}"`)
    expect(css).toMatch(/\.hotelJumpMobile\s*{\s*display:\s*none/)
    expect(css).toMatch(/position:\s*sticky;\s*top:\s*68px/)
  })
  test('how much time: Condesa has two buttons and opens the short plan; Roma Norte and Polanco show 48 hours directly, no buttons', () => {
    const quick = ['Museo de Arte Moderno', 'Niddo', 'Maleza', 'Best Wednesday to Saturday. Take a short ride between stops.']
    if (zone === 'condesa') {
      const plans = [...html.slice(html.indexOf('data-hotel-section="time"'), html.indexOf('data-hotel-section="moods"')).matchAll(/role="tab" aria-selected="(true|false)"[^>]*>([^<]*)</g)].map((m) => [m[2], m[1] === 'true'])
      expect(plans).toEqual([['Only a few hours', true], ['48 hours', false]])
      for (const q of quick) expect(html).toContain(q)
      expect(headings(html)).not.toContain('48 hours') // only the selected plan is visible
      const maps = [...html.matchAll(/href="(https:\/\/www\.google\.com\/maps\/search\/[^"]*)"/g)].map((m) => m[1])
      for (const stop of HOTEL_QUICK_PLAN.stops) expect(maps.some((m) => decodeURIComponent(m).includes(stop.name))).toBe(true)
    } else {
      expect(headings(html)).toContain('48 hours')
      for (const q of [...quick, 'Only a few hours']) expect(html).not.toContain(q)
      const timeBlock = html.slice(html.indexOf('data-hotel-section="time"'), html.indexOf('data-hotel-section="moods"'))
      expect(timeBlock).not.toContain('role="tab"')
    }
  })
  test('mood buttons in the agreed order; "Only a few hours" is not one of them', () => {
    const buttons = [...html.matchAll(/aria-pressed="false" class="moodBtn[^"]*"[^>]*>.*?<div class="moodLabel">([^<]*)</g)].map((m) => m[1])
    expect(buttons).toEqual(["I'm hungry".replace("'", '&#x27;'), 'I want culture', 'Hidden places', 'I want to shop', 'I want nightlife', 'Traveling with kids'])
  })
  test('the weekly rhythm has a Monday row; the footer has the "we checked them" line', () => {
    expect(text).toContain('Monday')
    expect(text).toContain('Most museums are closed.')
    expect(text).toContain('A good day for parks, markets and food.')
    expect(text).toContain('We recommend places because we checked them. Nobody pays to be listed.')
    expect(html.indexOf('We recommend places because')).toBeGreaterThan(html.indexOf('data-hotel-section="discover"'))
  })
  test('Hidden gem is the only mark, on the same line as the place name and address; Art and Food and drink are gone', () => {
    expect(html).not.toMatch(/>(Art|Food and drink)</)
    const heads = [...html.matchAll(/<div class="spotHead">(.*?)<\/div>/g)].map((m) => m[1])
    for (const h of heads) {
      const name = h.match(/<h5[^>]*>([^<]*)</)?.[1].replace(/&#x27;/g, "'") ?? ''
      expect(h.includes(`>${HIDDEN_GEM_LABEL.en}<`)).toBe(isHiddenGem(name))
    }
    if (zone === 'condesa') expect(heads.some((h) => h.includes('Proyecto Rufina') && h.includes('Hidden gem'))).toBe(true)
    if (zone === 'condesa') expect(heads.some((h) => h.includes('Maleza') && h.includes('Hidden gem'))).toBe(true)
  })
  test('quiet colour: coral only on the booking button; every section label in the same green; backgrounds alternate', () => {
    expect(html).not.toContain('var(--coral)')
    expect(css).toMatch(/\.hotelCalm \.eyebrow\s*{\s*color:\s*var\(--pine\)/)
    expect(css).toMatch(/\.hotelCalm \.link\s*{\s*color:\s*var\(--pine\)/)
    expect(css).toMatch(/\.hotelCalm \.itinTime\s*{\s*color:\s*var\(--sage-soft\)/)
    const alt = (id: string) => /sectionAlt/.test(classOf(html, id) ?? '')
    expect([alt('neighborhoods'), alt('moods'), alt('rhythm'), alt('experiences'), alt('practical')]).toEqual([true, true, false, true, false])
    const timeHeader = html.slice(html.indexOf('data-hotel-section="time"')).match(/<section class="([^"]*)"/)![1]
    expect(timeHeader).not.toContain('sectionAlt') // Plans: cream, between two sand sections
    // the section labels all use the one label style; the practical one too
    expect(html.match(/class="eyebrow"[^>]*>(Plans|Explore by mood|The city&#x27;s weekly rhythm|Experiences|Where next\?|THE PRACTICAL PART|City zones)</g)?.length).toBe(7)
  })
  test('spacing: one vertical padding for every section, and the how-much-time block has no big gaps', () => {
    expect(css).toMatch(/\.hotelCalm \.section\s*{\s*padding:\s*88px 0/)
    for (const id of ['experiences', 'moods', 'rhythm', 'planner']) {
      const open = html.match(new RegExp(`<section[^>]*data-hotel-section="${id}"[^>]*>`))![0]
      const pad = open.match(/padding-top:(\d+)px;padding-bottom:(\d+)px/)
      expect(pad && [pad[1], pad[2]]).toEqual(['88', '88'])
    }
    if (zone === 'condesa') expect(html).toMatch(/<p class="spotNote" style="margin-top:18px">Best Wednesday to Saturday\. Take a short ride between stops\.<\/p>/)
    expect(html).not.toMatch(/class="nbTagline"[^>]*>Best Wednesday/)
  })
  test('widths: six mood cards three per row (two on phones); weather card as wide as the weekly list', () => {
    expect(css).toMatch(/\.hotelCalm \.moodGrid\s*{\s*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/)
    expect(css).toMatch(/max-width: 640px\)\s*{\s*\.hotelCalm \.moodGrid\s*{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/)
    expect(css).toMatch(/\.hotelCalm \.weatherCard\s*{\s*max-width:\s*860px/)
    expect(css).toMatch(/\.spotList\s*{[^}]*max-width:\s*860px/)
  })
  test('weekly order: Monday, Tues & Fri, Saturday, Sunday, Sunset; footer line', () => {
    const rows = buildHotelGuideProps(zone)!.city.copy.en.todayItems.map((t) => t.tag)
    expect(rows).toEqual(['Monday', 'Tues & Fri', 'Saturday', 'Sunday', 'Sunset'])
    const at = ['Most museums are closed.', 'Lucha libre, Arena México', 'Bazar Sábado, San Ángel', 'Muévete en Bici, Reforma', 'Mirador Torre Latinoamericana'].map((x) => html.indexOf(x.replace('é', 'é')))
    expect(at.every((i) => i > 0)).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
    expect(text).toContain('lagomplan · neighborhood guide')
    expect(text).not.toContain('guest stay experience')
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
    // Gyms and studios sits in Before you arrive (after the arrival cards, before Everyday errands); no Take care tab
    const gyms = html.indexOf('Gyms and studios')
    expect(gyms).toBeGreaterThan(html.indexOf('Before you arrive'))
    expect(gyms).toBeLessThan(errands)
    expect(html).not.toContain('Take care')
  })
  test('the airport, earthquakes and cash and ATMs answers show, like in the Livin guide', () => {
    for (const shown of ['Most flights land at AICM', 'Earthquakes', 'Cash and ATMs']) { expect(html).toContain(shown); expect(base).toContain(shown) }
  })
  test('lagomplan: the invitation, then the destination cards (images and links) under "Where next?"; no floating or footer planner button', () => {
    expect(headings(html)).toContain('Ready to explore beyond your stay?')
    expect(text).toContain('Plan my next trip')
    expect(text).toContain('Where next?')
    expect(html.indexOf('Where next?')).toBeGreaterThan(html.indexOf('Plan my next trip'))
    const grid = html.slice(html.indexOf('class="discoverGrid"'))
    for (const d of ['Oaxaca', 'Tulum', 'San Miguel de Allende', 'Valle de Bravo', 'Mérida']) expect(grid).toMatch(new RegExp(`<a class="discoverCard" href="[^"]*"[^>]*><img class="discoverImg" src="[^"]+" alt="${d}"/>`))
    expect(grid.match(/class="discoverCard"/g)).toHaveLength(5)
    expect(html).not.toContain('Lagomplan goes further than this city')
    expect(html).not.toContain('Personalize my trip in 60 seconds')
    expect(html).not.toContain('stickyWrap')
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
    const noPlan = (x: string[]) => x.filter((h) => h !== '48 hours') // Condesa opens on its short plan
    const [a, ...rest] = HOTEL_ZONES.map((z) => noPlan(headings(pages[z]).slice(1)))
    for (const r of rest) expect(r).toEqual(a)
    const noIt = (x: string[]) => x.filter((id) => id !== 'itinerary')
    const [m, ...others] = HOTEL_ZONES.map((z) => noIt(sections(pages[z])))
    expect(m).toEqual(noIt([...HOTEL_SECTION_IDS]))
    for (const r of others) expect(r).toEqual(m)
  })
  test('same four zones as tabs, each in its own order', () => {
    for (const z of HOTEL_ZONES) expect(tabs(pages[z]).map((t) => t.label).sort()).toEqual([...ZONE_TAB_ORDER[z]].sort())
  })
  // Differences that come from the content files, not from this edition. Listed so a change shows up here.
  test('the practical groups each zone has (documented, not padded)', () => {
    expect(Object.fromEntries(HOTEL_ZONES.map((z) => [z, groups(pages[z])]))).toEqual({
      condesa: ['Before you arrive', 'Everyday errands'],
      roma: ['Before you arrive', 'Everyday errands'],
      polanco: ['Before you arrive', 'Everyday errands'],
    })
  })
  test('the only difference in how much time: Condesa has the short plan', () => {
    const h = (z: HotelZone) => headings(pages[z]).filter((x) => x !== '48 hours').join('|')
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
    expect(moods).toHaveLength(g.city.copy[lang].moods.length) // one removed (short), one added (shop)
    expect(moods.find((m) => m.id === 'culture')!.items.map((i) => i.name)).not.toContain('Kurimanzutto') // its card is in San Miguel Chapultepec
    const hungry = moods.find((m) => m.id === 'hungry')!
    const picks = ['El Vilsito', 'Quintonil', 'Café Nin', 'Nevería Roxy'] // Café Avellaneda has its own card in Coyoacán now
    const added = hungry.items.slice(g.city.copy[lang].moods.find((m) => m.id === 'hungry')!.items.length)
    expect(added.map((i) => i.name)).toEqual(picks)
    for (const i of added) {
      const src = g.city.copy[lang].foodCollections.find((c) => c.name === i.name)!
      expect({ note: i.note, tag: i.tag }).toEqual({ note: src.note, tag: src.tag })
    }
    const leftOut = g.city.copy[lang].foodCollections.map((c) => c.name).filter((n) => !picks.includes(n))
    expect(leftOut).toEqual(['Panadería Rosetta', 'Café Avellaneda', 'Licorería Limantour', 'El Turix']) // already elsewhere in the guide
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

describe('moods, theme marks and zone names', () => {
  const g = getGuide('livin_condesa')!
  test.each(['en', 'es'] as const)('%s: moods in the agreed order, the new shopping mood reuses four places word for word', (lang) => {
    const moods = buildHotelGuideProps('condesa')!.city.copy[lang].moods
    expect(moods.map((m) => m.id)).toEqual(HOTEL_MOOD_ORDER)
    const shop = moods.find((m) => m.id === 'shop')!
    expect(shop.items.map((i) => i.name)).toEqual(['Proyecto Rufina', 'Librería El Péndulo', 'LAGO', 'Bazar Sábado'])
    const allSpots = Object.values(g.city.neighborhoods).flatMap((n) => n.spots[lang])
    for (const it of shop.items.slice(0, 3)) expect(allSpots.find((s) => s.name === it.name)!.note).toBe(it.note)
    const bazar = g.city.copy[lang].todayItems.find((t) => t.title.startsWith('Bazar Sábado'))!
    expect(shop.items[3].note).toBe(bazar.body)
    expect(shop.items[3].zone).toBe('San Ángel')
  })
  test('zone names under picks: the owner\'s list, plus the zone tabs that list a place; the rest blank', () => {
    const moods = buildHotelGuideProps('condesa')!.city.copy.en.moods
    const zones = Object.fromEntries(moods.flatMap((m) => m.items.map((i) => [i.name, i.zone ?? null])))
    for (const [place, zone] of Object.entries(HOTEL_PICK_ZONES)) if (place in zones) expect(zones[place]).toBe(zone)
    expect(zones).toMatchObject({
      'Lalo!': 'Roma Norte', 'Taquería Orinoco': 'Roma Norte', 'El Vilsito': 'Narvarte', 'Quintonil': 'Polanco', 'Café Nin': 'Juárez',
      'Nevería Roxy': 'Condesa', 'Museo Tamayo': 'Chapultepec', 'Papalote Museo del Niño': 'Chapultepec', 'Chapultepec Zoo': 'Chapultepec',
      'Casa Luis Barragán': 'Tacubaya', 'Departamento': 'Roma Norte', 'Foro Shakespeare': 'Condesa', 'Bósforo': 'Centro',
      'Proyecto Rufina': 'Condesa', 'Librería El Péndulo': 'Roma Norte', 'LAGO': 'Polanco', 'Bazar Sábado': 'San Ángel',
      'Parque México': 'Condesa', 'Licorería Limantour': 'Roma Norte',
    })
    const blank = Object.entries(zones).filter(([, z]) => z === null).map(([n]) => n).sort()
    expect(blank).toEqual(['Bar Federalista', 'Casa Franca', 'Masala y Maíz'])
  })
  test('hidden gem is exactly the seven agreed places, and nothing else is marked', () => {
    expect([...HIDDEN_GEMS].sort()).toEqual(['Bósforo', 'Café Nin', 'Casa Franca', 'Foro Shakespeare', 'Maleza', 'Mercado de San Juan', 'Proyecto Rufina'])
    const names = new Set<string>()
    for (const nb of Object.values(buildHotelGuideProps('condesa')!.city.neighborhoods)) nb.spots.en.forEach((s) => names.add(s.name))
    buildHotelGuideProps('condesa')!.city.copy.en.moods.forEach((m) => m.items.forEach((i) => names.add(i.name)))
    HOTEL_QUICK_PLAN.stops.forEach((s) => names.add(s.name))
    for (const n of names) expect(isHiddenGem(n)).toBe(HIDDEN_GEMS.includes(n))
  })
})

describe('the two hotel-only zones: San Miguel Chapultepec and Coyoacán', () => {
  const nbs = (zone: HotelZone = 'condesa') => buildHotelGuideProps(zone)!.city.neighborhoods
  test('map lists, taglines and the six places of each, in both languages', () => {
    const smc = nbs()['San Miguel Chapultepec'], coy = nbs()['Coyoacán']
    expect(smc.mapUrl).toBe('https://maps.app.goo.gl/ZFKMj2iBMeL7fxHK7')
    expect(coy.mapUrl).toBe('https://maps.app.goo.gl/fHKhCCToYVaqFmrEA')
    expect(smc.tagline.en).toBe('Galleries behind old walls, a Barragán house, the edge of the park.')
    expect(smc.tagline.es).toBe('Galerías tras muros antiguos, una casa de Barragán, la orilla del bosque.')
    expect(coy.tagline.es).toBe('Calles empedradas, dos plazas, la casa azul de Frida.')
    expect(smc.spots.en.map((x) => [x.name, x.distance])).toEqual([
      ['Mesa', 'Gobernador Protasio Tagle 132'], ['Madereros', 'General Antonio León 72'], ['Bosque de Chapultepec', 'Nearest entrance from the neighbourhood'],
      ['Kurimanzutto', 'Gobernador Rafael Rebollar 94'], ['Casa Gilardi', 'General Antonio León 82'], ['El Mirador de Chapultepec', 'Avenida Chapultepec 606'],
    ])
    expect(coy.spots.en.map((x) => [x.name, x.distance])).toEqual([
      ['Café Avellaneda', 'Higuera 40-A'], ['Mercado de Coyoacán', 'Ignacio Allende'], ['Jardín Centenario and Plaza Hidalgo', ''],
      ['Museo Frida Kahlo (Casa Azul)', 'Londres 247'], ['Museo Casa de León Trotsky', 'Río Churubusco 410'], ['La Coyoacana', 'Higuera 14'],
    ])
    expect(coy.spots.es[2].name).toBe('Jardín Centenario y Plaza Hidalgo')
  })
  test('Kurimanzutto and Café Avellaneda reuse their existing text word for word, and appear once', () => {
    const g = getGuide('livin_condesa')!
    for (const lang of ['en', 'es'] as const) {
      const kuri = g.city.copy[lang].moods.find((m) => m.id === 'culture')!.items.find((i) => i.name === 'Kurimanzutto')!.note
      const avel = g.city.copy[lang].foodCollections.find((c) => c.name === 'Café Avellaneda')!.note
      expect(nbs()['San Miguel Chapultepec'].spots[lang].find((x) => x.name === 'Kurimanzutto')!.note).toBe(kuri)
      expect(nbs()['Coyoacán'].spots[lang].find((x) => x.name === 'Café Avellaneda')!.note).toBe(avel)
      const copy = buildHotelGuideProps('condesa')!.city.copy[lang]
      const inMoods = copy.moods.flatMap((m) => m.items).map((i) => i.name)
      expect(inMoods).not.toContain('Kurimanzutto')
      expect(inMoods).not.toContain('Café Avellaneda')
    }
  })
  test('every new place is flagged "to verify: address, opening days and hours"; no hours, prices or Hidden gem marks', () => {
    expect(VERIFY).toBe('to verify: address, opening days and hours')
    const places = EXTRA_ZONES.flatMap((z) => z.places)
    expect(places).toHaveLength(12)
    for (const p of places) expect(p.verify).toBe(VERIFY)
    for (const p of places) for (const n of [p.name.en, p.name.es]) expect(isHiddenGem(n)).toBe(false)
    expect(JSON.stringify(EXTRA_ZONES)).not.toMatch(/\d{1,2}[:.]\d{2}|\$|pesos|MXN|USD/i)
  })
  test('switches: a zone turned off drops its tab, the number in the title, and gives its moved place back', () => {
    const was = { ...HOTEL_EXTRA_ZONES_ON }
    try {
      HOTEL_EXTRA_ZONES_ON['Coyoacán'] = false
      let html = hotel('condesa')
      expect(headings(html)).toContain('Five zones, five ways to experience the city')
      expect(tabs(html).map((t) => t.label)).toEqual(['Condesa', 'Roma Norte', 'San Miguel Chapultepec', 'Polanco', 'Centro'])
      expect(buildHotelGuideProps('condesa')!.city.copy.en.moods.find((m) => m.id === 'hungry')!.items.map((i) => i.name)).toContain('Café Avellaneda')
      HOTEL_EXTRA_ZONES_ON['San Miguel Chapultepec'] = false
      html = hotel('polanco')
      expect(headings(html)).toContain(HEADING_4)
      expect(tabs(html).map((t) => t.label)).toEqual(['Polanco', 'Condesa', 'Roma Norte', 'Centro'])
      expect(buildHotelGuideProps('polanco')!.city.copy.en.moods.find((m) => m.id === 'culture')!.items.map((i) => i.name)).toContain('Kurimanzutto')
    } finally { Object.assign(HOTEL_EXTRA_ZONES_ON, was) }
  })
})
