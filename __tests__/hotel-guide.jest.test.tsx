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
import { hotelShareHref, hotelShareText, hotelShareUrl, SHARE_HOST } from '../content/guia/hotel/share'
import { ADDRESSES, HOTEL_RANKINGS, MOODS_PLAN, MOOD_SIZE, NEW_PLACES, SKIPPED_NEW_PLACES, VERIFY as MOOD_VERIFY, VERIFY_HOURS, VERIFY_OPEN, type MoodId } from '../content/guia/hotel/mood-picks'
import { CENTRO_ADDITION, POLANCO_SWAP, VERIFY as TAB_VERIFY } from '../content/guia/hotel/tab-spots'
import { isShareOpen } from '../lib/hotels/bots'
import { BASE_URL } from '../lib/seo'
import { GYG_PARTNER_ID, isGygUrl, isGygTourUrl } from '../lib/affiliate/gyg'
import { CHEF_WHATSAPP_NUMBER } from '../lib/guia/links'

const hotel = (zone: HotelZone) => renderToStaticMarkup(<GuiaClient {...buildHotelGuideProps(zone)!} />)
const livin = (zone: HotelZone) => {
  const g = getGuide(HOTEL_PARTNER_SLUG[zone])!
  return renderToStaticMarkup(<GuiaClient partner={g.partner} city={g.city} />)
}
// With two plans both bands are in the page and only the selected one is visible (the other layer is hidden and aria-hidden).
const stripHidden = (html: string) => html.replace(/<div class="hotelBandLayer"[^>]*data-hidden[^>]*>[\s\S]*?<\/section><\/div>/g, '')
const headings = (html: string) => [...stripHidden(html).matchAll(/<h[12][^>]*>([^<]*)</g)].map((m) => m[1])
// Zone tabs only: the plan buttons in "How much time" are tabs too.
const zonesPart = (html: string) => { const a = html.indexOf('data-hotel-section="neighborhoods"'); const b = html.indexOf('data-hotel-section="time"'); return a >= 0 && b > a ? html.slice(a, b) : html }
const tabs = (html: string) => [...zonesPart(html).matchAll(/role="tab" aria-selected="(true|false)"[^>]*>([^<]*)</g)].map((m) => ({ selected: m[1] === 'true', label: m[2] }))
const visibleText = (html: string) => stripHidden(html).replace(/<[^>]+>/g, '\n').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').split('\n').map((x) => x.trim()).filter(Boolean).join('\n')
const HEADING_6 = 'Six zones, six ways to experience the city'
const HEADING_4 = 'Four zones, four ways to experience the city'
const HEADING_5 = 'Five zones, five ways to experience the city'
const cardTitles = (html: string) => { const a = html.indexOf('id="practico"'); return [...html.slice(a).matchAll(/<h4[^>]*>([^<]*)<\/h4>/g)].map((m) => m[1].replace(/&#x27;/g, "'").replace(/&amp;/g, '&')) }
const NOT_FOR_A_HOTEL = ['Laundry and dry cleaning', 'Restaurants that take groups', 'Catering and delivery', 'Coming back late']
const LIVIN_PROPERTY = ['Chefs at home', 'Massages']
// Condesa opens on its short plan, so the 48 hours heading is not on screen until that button is chosen.
// The plans band has one heading; the plan buttons and the short line sit under it (no second heading inside).
const orderEn = (_zone: HotelZone) => ['Your guide to {zone}', HEADING_6, 'How much time do you have?', 'What are you in the mood for?', 'Every week in Mexico City', 'Worth the time', 'Good to know', 'Ready to explore beyond your stay?']
const css = fs.readFileSync(path.join(process.cwd(), 'app/guia/[partner]/guia.module.css'), 'utf8')
const classOf = (html: string, id: string) => html.match(new RegExp(`<section class="([^"]*)"[^>]*data-hotel-section="${id}"`))?.[1] ?? null
// Everything that identifies the Livin property: the three "Your house" addresses and map links, plus the spots that
// only exist in a "Your house" list (a venue the city layer also names, such as Panadería Rosetta, is not Livin's).
const livinAddresses = HOTEL_ZONES.flatMap((z) => {
  const g = getGuide(HOTEL_PARTNER_SLUG[z])!
  const cityText = JSON.stringify(g.city)
  const own = [...g.partner.yourHouse.spots.en, ...g.partner.yourHouse.spots.es].map((s) => s.name).filter((n) => !cityText.includes(n) && !(n in NEW_PLACES))
  return [g.partner.yourHouse.name, g.partner.yourHouse.mapUrl, ...own]
})


describe.each(HOTEL_ZONES)('%s hotel guide', (zone) => {
  const html = hotel(zone)
  const base = livin(zone)
  const text = visibleText(html)
  const props = JSON.stringify(buildHotelGuideProps(zone))

  test('sections in the agreed order: welcome, zones, how much time, mood, weekly rhythm, experiences, good to know, Lagomplan block', () => {
    expect(headings(html)).toEqual(orderEn(zone).map((h) => h.replace('{zone}', ZONE_LABEL[zone])))
    const ids = [...HOTEL_SECTION_IDS]
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
    // the old card (title, subtitle, dotted thumbnail) is gone in this edition
    for (const gone of ['nbMapCard', 'nbMapThumb', 'See all', 'Google Maps list']) expect(z).not.toContain(gone)
    // one link, "Map →", in the same row as the chips (inside the one-line row), at its right end, named after the open zone in its aria-label
    const links = [...z.matchAll(/<a class="hotelMapLink" href="([^"]*)" target="_blank" rel="noopener noreferrer" aria-label="([^"]*)"[^>]*>([^<]*)</g)]
    expect(links).toHaveLength(1)
    const own = buildHotelGuideProps(zone)!.city.neighborhoods[ZONE_NEIGHBORHOOD[zone]]
    expect(links[0][1]).toBe(own.mapUrl)
    expect(links[0][2]).toBe(`Map of ${ZONE_NEIGHBORHOOD[zone]}`)
    expect(links[0][3]).toBe('Map →')
    expect(z.indexOf('hotelMapLink')).toBeGreaterThan(z.lastIndexOf('role="tab"'))
    expect(z.indexOf('hotelMapLink')).toBeLessThan(z.indexOf('class="spotList"'))
    expect(z.slice(z.indexOf('class="nbControls"'), z.indexOf('class="spotList"'))).toContain('hotelMapLink') // same row container
    // one line, never wrapping on desktop; the whole row scrolls on phones with the link as its last item
    expect(css).toMatch(/\.hotelCalm \.nbControls\s*{[^}]*flex-direction:\s*row[^}]*flex-wrap:\s*nowrap[^}]*overflow-x:\s*auto/)
    expect(css).toMatch(/\.hotelMapLink\s*{[^}]*margin-left:\s*auto[^}]*flex:\s*none[^}]*white-space:\s*nowrap/)
    expect(css).toMatch(/\.hotelMapLink\s*{[^}]*background:\s*transparent/)
    expect(css).not.toMatch(/\.hotelMapLink\s*{[^}]*box-shadow/)
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
  test('plans: ONE dark band with the eyebrow, the title, the two buttons (Condesa) and the short line, then the stops; no cream block, no second heading', () => {
    const block = html.slice(html.indexOf('data-hotel-section="time"'), html.indexOf('data-hotel-section="moods"'))
    const visible = stripHidden(block)
    // the first section of the block is the dark band (nothing cream above it)
    expect(block.match(/<section class="([^"]*)"/)![1]).toBe('section sectionPine')
    expect(visible).toContain('>Plans<') // shown uppercase by the label style
    expect(visible).toContain('>How much time do you have?<')
    expect(visible).not.toMatch(/>(ITINERARY|Itinerary)</)
    expect(visible).not.toContain('>48 hours</h2>')
    expect(visible).not.toContain('>A few hours<')
    if (zone === 'condesa') {
      const plans = [...visible.matchAll(/role="tab" aria-selected="(true|false)"[^>]*>([^<]*)</g)].map((m) => [m[2], m[1] === 'true'])
      expect(plans).toEqual([['Only a few hours', true], ['48 hours', false]])
      // selected: light fill with dark text; unselected: outline in light text
      expect(visible).toMatch(/aria-selected="true"[^>]*style="[^"]*background:var\(--cream\);color:var\(--pine\)/)
      expect(visible).toMatch(/aria-selected="false"[^>]*style="[^"]*background:transparent;color:var\(--cream\)/)
      expect(visible).toContain('Four stops, one afternoon.')
      expect([...visible.matchAll(/class="eyebrowMono itinTime">(\d\d)</g)].map((m) => m[1])).toEqual(['01', '02', '03', '04'])
      for (const n of HOTEL_QUICK_PLAN.stops.map((x) => x.name)) expect(visible).toContain(n)
      expect(visible).not.toContain('Maleza')
      expect(visible).toContain('<p class="itinNote">Not on Mondays. Short rides at the start; the last two stops are a walk apart.</p>')
      const maps = [...visible.matchAll(/href="(https:\/\/www\.google\.com\/maps\/search\/[^"]*)"[^>]*>Map</g)].map((m) => decodeURIComponent(m[1]))
      expect(maps).toHaveLength(4)
      // the 48 hours band is in the page but hidden (desktop keeps one height; phones drop it)
      expect(block).toContain('data-hidden')
      expect(block).toContain('aria-hidden="true"')
      expect(css).toMatch(/\.hotelBandLayer\[data-hidden\]\s*{\s*visibility:\s*hidden/)
      expect(css).toMatch(/max-width: 768px\)\s*{\s*\.hotelBandLayer\[data-hidden\]\s*{\s*display:\s*none/)
    } else {
      expect(visible).toContain('Two days, walked and checked.') // the short line
      expect(visible).not.toContain('role="tab"')
      expect(block).not.toContain('data-hidden')
      for (const q of ['Only a few hours', 'Four stops']) expect(html).not.toContain(q)
    }
  })
  test('mood buttons in the agreed order; kids and "Only a few hours" are not among them', () => {
    const buttons = [...html.matchAll(/aria-pressed="false" class="moodBtn[^"]*"[^>]*>.*?<div class="moodLabel">([^<]*)</g)].map((m) => m[1])
    expect(buttons).toEqual(['A special dinner', 'I want to shop', 'I want culture', 'Hidden places', "I'm hungry".replace("'", '&#x27;'), 'I want nightlife'])
    expect(html).not.toContain('Traveling with kids') // the Livin guides keep it; the hotel edition has A special dinner instead
  })
  test('the weekly rhythm has a Monday row; the footer has the "we checked them" line', () => {
    expect(text).toContain('Monday')
    expect(text).toContain('Most museums are closed.')
    expect(text).toContain('A good day for parks, markets and food.')
    expect(text).toContain('We recommend places because we checked them. Nobody pays to be listed.')
    expect(html.indexOf('We recommend places because')).toBeGreaterThan(html.indexOf('data-hotel-section="discover"'))
  })
  test('Hidden gem is the only mark: quiet, right after the place name on its line, soft green, no pill or coral; Art and Food and drink are gone', () => {
    expect(html).not.toMatch(/>(Art|Food and drink)</)
    const heads = [...html.matchAll(/<div class="spotHead">(.*?)<\/div>/g)].map((m) => m[1])
    for (const h of heads) {
      const name = h.match(/<h5[^>]*>([^<]*)</)?.[1].replace(/&#x27;/g, "'") ?? ''
      expect(h.includes(`>${HIDDEN_GEM_LABEL.en}<`)).toBe(isHiddenGem(name))
    }
    for (const m of html.matchAll(/<h5 class="h5">[^<]*<span style="([^"]*)">Hidden gem<\/span><\/h5>/g)) {
      expect(m[1]).toContain('color:#3E5F58')
      expect(m[1]).not.toMatch(/coral|background|border|padding/)
    }
    expect(html).not.toMatch(/class="eyebrow"[^>]*>Hidden gem</) // no longer a section-label style
    if (zone === 'condesa') expect(html).toMatch(/<h5 class="h5">Proyecto Rufina<span style="[^"]*">Hidden gem<\/span><\/h5>/)
  })
  test('quiet colour: coral only on the booking button; every section label in the same green; backgrounds alternate', () => {
    expect(html).not.toContain('var(--coral)')
    expect(css).toMatch(/\.hotelCalm \.eyebrow\s*{\s*color:\s*var\(--pine\)/)
    expect(css).toMatch(/\.hotelCalm \.link\s*{\s*color:\s*var\(--pine\)/)
    expect(css).toMatch(/\.hotelCalm \.itinTime\s*{\s*color:\s*var\(--sage-soft\)/)
    const alt = (id: string) => /sectionAlt/.test(classOf(html, id) ?? '')
    expect([alt('neighborhoods'), alt('moods'), alt('rhythm'), alt('experiences'), alt('practical')]).toEqual([true, true, false, true, false])
    const timeFirst = html.slice(html.indexOf('data-hotel-section="time"')).match(/<section class="([^"]*)"/)![1]
    expect(timeFirst).toBe('section sectionPine') // Plans: one dark band between the two sand sections, no strip of another colour
    // the section labels all use the one label style; the practical one too
    expect(html.match(/class="eyebrow"[^>]*>(Explore by mood|The city&#x27;s weekly rhythm|Experiences|Where next\?|THE PRACTICAL PART|City zones)</g)?.length).toBe(6)
  })
  test('spacing: one vertical padding for every section, and the how-much-time block has no big gaps', () => {
    expect(css).toMatch(/\.hotelCalm \.section\s*{\s*padding:\s*88px 0/)
    for (const id of ['experiences', 'moods', 'rhythm', 'planner']) {
      const open = html.match(new RegExp(`<section[^>]*data-hotel-section="${id}"[^>]*>`))![0]
      const pad = open.match(/padding-top:(\d+)px;padding-bottom:(\d+)px/)
      expect(pad && [pad[1], pad[2]]).toEqual(['88', '88'])
    }
    expect(html).not.toMatch(/class="nbTagline"[^>]*>(Best Wednesday|Not on Mondays)/)
  })
  test('widths: six mood cards three per row (two on phones); weather card as wide as the weekly list', () => {
    expect(css).toMatch(/\.hotelCalm \.moodGrid\s*{\s*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/)
    expect(css).toMatch(/max-width: 640px\)\s*{\s*\.hotelCalm \.moodGrid\s*{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/)
    expect(css).toMatch(/\.hotelCalm \.weatherCard\s*{\s*max-width:\s*860px/)
    expect(css).toMatch(/\.spotList\s*{[^}]*max-width:\s*860px/)
  })
  test('mood panel: two columns on desktop with a generous gap, one on phones; a thin #C8BFB5 rule between places and none after the last', () => {
    expect(css).toMatch(/\.hotelCalm \.hotelMoodItems\s*{[^}]*grid-auto-flow:\s*column[^}]*repeat\(var\(--rows, 4\), auto\)[^}]*column-gap:\s*64px/)
    expect(css).toMatch(/\.hotelCalm \.hotelMoodItem\s*{[^}]*border-top:\s*1px solid #C8BFB5[^}]*padding:\s*22px 0/)
    expect(css).not.toMatch(/\.hotelMoodItem[^{]*{[^}]*border-bottom/)
    expect(css).toMatch(/\.hotelCalm \.hotelMoodItem\[data-colfirst\]\s*{[^}]*border-top:\s*0/)
    expect(css).toMatch(/\.hotelCalm \.hotelMoodItem:last-child\s*{[^}]*padding-bottom:\s*0/)
    expect(css).toMatch(/max-width: 768px\)\s*{[^@]*\.hotelCalm \.hotelMoodItems\s*{[^}]*grid-auto-flow:\s*row[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/)
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
    const noPlan = (x: string[]) => x.filter((h) => h !== '48 hours' && h !== 'A few hours') // Condesa opens on its short plan
    const [a, ...rest] = HOTEL_ZONES.map((z) => noPlan(headings(pages[z]).slice(1)))
    for (const r of rest) expect(r).toEqual(a)
    const [m, ...others] = HOTEL_ZONES.map((z) => sections(pages[z]))
    expect(m).toEqual([...HOTEL_SECTION_IDS])
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
    const h = (z: HotelZone) => headings(pages[z]).filter((x) => x !== '48 hours' && x !== 'A few hours').join('|')
    expect(h('condesa')).toBe(h('roma').replace('Roma Norte', 'Condesa'))
    expect(pages.condesa.includes('Museo de Arte Moderno')).toBe(true)
    expect(pages.roma.includes('Museo de Arte Moderno') || pages.polanco.includes('Museo de Arte Moderno')).toBe(false)
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
  test('hidden gem is exactly the six places left on the list, and nothing else is marked', () => {
    expect([...HIDDEN_GEMS].sort()).toEqual(['Bósforo', 'Casa Franca', 'Foro Shakespeare', 'Maleza', 'Mercado de San Juan', 'Proyecto Rufina'])
    expect(HIDDEN_GEMS).not.toContain('Café Nin')
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
      ['Museo Frida Kahlo (Casa Azul)', 'Londres 247'], ['Museo Casa de León Trotsky', 'Río Churubusco 410'], ['Los Danzantes', 'Plaza Jardín Centenario 12'],
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

describe('Maleza and the four stops', () => {
  test('Maleza is in "I\'m hungry" with "Hidden gem" as its craving label, text and zone as given; Café Nin is "Brunch"', () => {
    const en = buildHotelGuideProps('condesa')!.city.copy.en.moods.find((m) => m.id === 'hungry')!.items
    const es = buildHotelGuideProps('condesa')!.city.copy.es.moods.find((m) => m.id === 'hungry')!.items
    expect(en.find((i) => i.name === 'Maleza')).toEqual({ name: 'Maleza', tag: 'Hidden gem', note: 'Locally sourced cooking from small producers of the Valley of Mexico, and good drinks.', zone: 'Condesa', address: 'Cuernavaca 4' })
    expect(es.find((i) => i.name === 'Maleza')).toEqual({ name: 'Maleza', tag: 'Joya escondida', note: 'Cocina con ingredientes de pequeños productores del Valle de México y buenos tragos.', zone: 'Condesa', address: 'Cuernavaca 4' })
    expect(en.find((i) => i.name === 'Café Nin')!.tag).toBe('Brunch')
    expect(es.find((i) => i.name === 'Café Nin')!.tag).toBe('Brunch')
    // one hidden gem label in the panel
    expect([...en, ...es].filter((i) => i.tag === 'Hidden gem' || i.tag === 'Joya escondida')).toHaveLength(2) // Maleza, once per language
  })
  test('Maleza appears once in the guide', () => {
    for (const zone of HOTEL_ZONES) {
      const p = buildHotelGuideProps(zone)!
      for (const lang of ['en', 'es'] as const) {
        const places = [
          ...p.city.copy[lang].moods.flatMap((m) => m.items.map((i) => i.name)),
          ...Object.values(p.city.neighborhoods).flatMap((n) => n.spots[lang].map((x) => x.name)),
          ...HOTEL_QUICK_PLAN.stops.map((x) => x.name),
        ].filter((n) => n === 'Maleza')
        expect(places).toHaveLength(1)
      }
    }
    expect(HOTEL_QUICK_PLAN.stops.map((x) => x.name)).not.toContain('Maleza')
  })
  test('four stops with the given text; Lindy replaced Baltra Bar; the new ones are flagged to verify address, opening days and hours', () => {
    const [a, b, c, d] = HOTEL_QUICK_PLAN.stops
    expect([a.name, b.name, c.name, d.name]).toEqual(['Museo de Arte Moderno', 'Niddo', 'Avenida Ámsterdam', 'Lindy'])
    expect(HOTEL_QUICK_PLAN.stops.map((x) => x.name)).not.toContain('Baltra Bar') // Baltra Bar is a nightlife pick now, not a stop
    expect(c.note.en).toBe('The oval avenue under the trees, laid out on an old racetrack. Walk a loop at golden hour.')
    expect(d.where).toBe('Av. México 31, Condesa')
    expect(d.note.en).toBe('A drink across from Parque México. Lucky, the rooftop bar, is upstairs.')
    expect(d.note.es).toBe('Una copa frente al Parque México. Arriba está Lucky, el bar de la azotea.')
    expect(c.verify).toBe('to verify: address, opening days and hours')
    expect(d.verify).toBe('to verify: address, opening days and hours')
    expect(HOTEL_QUICK_PLAN.band.line).toEqual({ en: 'Four stops, one afternoon.', es: 'Cuatro paradas, una tarde.' })
    expect(HOTEL_QUICK_PLAN.note.en).toBe('Not on Mondays. Short rides at the start; the last two stops are a walk apart.')
    expect(HOTEL_QUICK_PLAN.note.es).toBe('No en lunes. Trayectos cortos al inicio; las dos últimas paradas están a unos pasos.')
  })
})

describe('"Send this guide to my phone" always ends with the guide\'s address', () => {
  const decode = (href: string) => decodeURIComponent(href.replace('https://wa.me/?text=', ''))
  test('the production host is the site\'s own host', () => { expect(SHARE_HOST).toBe(BASE_URL) })
  test.each(HOTEL_ZONES)('%s: the message in the page ends with an http address on the production host (no code)', (zone) => {
    const html = hotel(zone)
    const hrefs = [...html.matchAll(/href="(https:\/\/wa\.me\/\?text=[^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, '&'))
    expect(hrefs).toHaveLength(1)
    const msg = decode(hrefs[0])
    expect(msg).toMatch(/https?:\/\/\S+$/) // fails if the message carries no link
    expect(msg).toBe(`${hotelShareText(zone, 'en')} https://www.lagomplan.com/guia/cdmx/${zone === 'roma' ? 'roma-norte' : zone}?lang=en&via=share`)
    expect(msg).not.toContain('vercel.app')
    expect(hrefs[0]).not.toMatch(/[ ]|\?lang|&lang/) // everything after text= is percent-encoded, nothing raw
  })
  test.each(HOTEL_ZONES.flatMap((z) => (['en', 'es'] as const).flatMap((l) => [[z, l, null], [z, l, 'abcd2345wxyz']] as const)))('%s %s code=%s: text and address, encoded for WhatsApp', (zone, lang, code) => {
    const href = hotelShareHref({ code, zone, lang })
    const msg = decode(href)
    expect(msg).toMatch(/https?:\/\/\S+$/)
    expect(msg.startsWith(hotelShareText(zone, lang))).toBe(true)
    expect(msg.endsWith(hotelShareUrl({ code, zone, lang }))).toBe(true)
    expect(hotelShareUrl({ code, zone, lang })).toBe(code ? `https://www.lagomplan.com/g/${code}?lang=${lang}&via=share` : `https://www.lagomplan.com/guia/cdmx/${zone === 'roma' ? 'roma-norte' : zone}?lang=${lang}&via=share`)
    expect(href.slice('https://wa.me/?text='.length)).toBe(encodeURIComponent(msg)) // encoded exactly once
    expect(href).not.toMatch(/[ <>"]/)
  })
})

describe('moods: order, places, size, addresses', () => {
  const g = getGuide('livin_condesa')!
  const moodsOf = (lang: 'en' | 'es', z: HotelZone = 'condesa') => buildHotelGuideProps(z)!.city.copy[lang].moods

  test.each(['en', 'es'] as const)('%s: six moods in the agreed order; kids and "Only a few hours" are gone', (lang) => {
    expect(moodsOf(lang).map((m) => m.id)).toEqual(['dinner', 'shop', 'culture', 'hidden', 'hungry', 'nightlife'])
    expect(moodsOf(lang).map((m) => m.id)).toEqual(HOTEL_MOOD_ORDER)
    expect(moodsOf(lang).find((m) => m.id === 'dinner')!.icon).toBe('chefHat')
    expect(moodsOf(lang).find((m) => m.id === 'dinner')!.label).toBe(lang === 'en' ? 'A special dinner' : 'Una cena especial')
  })
  test('each panel has exactly 7 places, in all three hotel zones and both languages, every one with an address and a zone', () => {
    for (const z of HOTEL_ZONES) for (const lang of ['en', 'es'] as const) for (const m of moodsOf(lang, z)) {
      expect(MOOD_SIZE).toBe(7)
      expect(m.items).toHaveLength(7)
      expect(new Set(m.items.map((i) => i.name)).size).toBe(7) // seven different places
      expect(m.items.map((i) => i.name)).toEqual(MOODS_PLAN[m.id as MoodId])
      for (const it of m.items) { expect(it.address).toBeTruthy(); expect(it.zone).toBeTruthy() }
    }
  })
  test('the places of each panel, in order', () => {
    const names = (id: string) => moodsOf('en').find((m) => m.id === id)!.items.map((i) => i.name)
    expect(names('dinner')).toEqual(['Gaba', 'Esquina Común', 'Em', 'Máximo', 'Rosetta', 'Quintonil', 'Pujol'])
    expect(names('shop')).toEqual(['Proyecto Rufina', 'Librería El Péndulo', 'Bazar Sábado', 'Onora', 'Carla Fernández', 'Utilitario Mexicano', 'Mercado de Artesanías La Ciudadela'])
    expect(names('culture')).toEqual(['Museo Tamayo', 'Casa Luis Barragán', 'Castillo de Chapultepec', 'OMR', 'Casa Lamm', 'Museo de Arte Popular', 'Museo Franz Mayer'])
    expect(names('hidden')).toEqual(['Foro Shakespeare', 'Bósforo', 'Casa Franca', 'Audiorama', 'Museo Anahuacalli', 'Kiosko Morisco', 'Fonoteca Nacional'])
    expect(names('hungry')).toEqual(['Maleza', 'Baldío', 'Plonk', 'Botánico', 'Mi Compa Chava', 'Taquería Orinoco', 'Café Nin'])
    expect(names('nightlife')).toEqual(['Licorería Limantour', 'Departamento', 'Baltra Bar', 'Tlecān', 'Bar Mauro', 'Hanky Panky', 'Handshake Speakeasy'])
  })
  test('removed places are gone from the moods; LAGO left "I want to shop" but keeps its Polanco tab card', () => {
    const all = moodsOf('en').flatMap((m) => m.items.map((i) => i.name))
    for (const gone of ['Lalo!', 'Masala y Maíz', 'El Vilsito', 'Nevería Roxy', 'Bar Federalista', 'LAGO', 'Parque México', 'Papalote Museo del Niño', 'Chapultepec Zoo']) expect(all).not.toContain(gone)
    expect(buildHotelGuideProps('condesa')!.city.neighborhoods.Polanco.spots.en.map((x) => x.name)).toContain('LAGO')
  })
  test('new places that were already in a zone tab or a plan were not added, and the report can say where they are', () => {
    const all = moodsOf('en').flatMap((m) => m.items.map((i) => i.name))
    expect(SKIPPED_NEW_PLACES.map((x) => x.name).sort()).toEqual(['Casa Gilardi', 'Expendio de Maíz', 'Museo Jumex', 'Palacio de Bellas Artes'])
    for (const sk of SKIPPED_NEW_PLACES) expect(all).not.toContain(sk.name)
    const p = buildHotelGuideProps('condesa')!
    const tabs = Object.values(p.city.neighborhoods).flatMap((n) => n.spots.en.map((x) => x.name)).join(' | ')
    expect(tabs).toContain('Casa Gilardi')
    expect(tabs).toContain('Soumaya + Jumex')
    expect(tabs).toContain('Templo Mayor + Bellas Artes')
    expect(JSON.stringify(p.city.itinerary.en)).toContain('Expendio de Maíz')
    // and no other NEW place is already in a tab or a plan (so none was skipped by mistake)
    const plan = JSON.stringify(p.city.itinerary.en) + JSON.stringify(HOTEL_QUICK_PLAN.stops.map((x) => x.name))
    // (the places added in earlier rounds, such as Máximo and Rosetta, are named in the 48 hours plan on purpose)
    const newThisRound = Object.keys(NEW_PLACES).filter((n) => NEW_PLACES[n].verify.includes(VERIFY_HOURS))
    for (const n of newThisRound) if (!SKIPPED_NEW_PLACES.some((x) => x.name === n)) {
      expect(tabs.split(' | ').includes(n)).toBe(false)
      if (n.length > 3) expect(plan).not.toContain(n)
    }
  })
  test.each(['en', 'es'] as const)('%s: labels in the small slot: Michelin, Green Star, Bib Gourmand, Hidden gem, Brunch', (lang) => {
    const item = (mood: string, name: string) => moodsOf(lang).find((m) => m.id === mood)!.items.find((i) => i.name === name)!
    const L = HOTEL_RANKINGS.michelin.labels
    for (const n of ['Gaba', 'Esquina Común', 'Em', 'Máximo', 'Rosetta']) expect(item('dinner', n).tag).toBe(L.one[lang])
    for (const n of ['Quintonil', 'Pujol']) expect(item('dinner', n).tag).toBe(L.two[lang])
    expect(item('hungry', 'Baldío').tag).toBe(lang === 'en' ? 'Michelin Green Star' : 'Estrella Verde Michelin')
    expect(item('hungry', 'Plonk').tag).toBe('Bib Gourmand')
    expect(item('hungry', 'Maleza').tag).toBe(lang === 'en' ? 'Hidden gem' : 'Joya escondida')
    expect(item('hungry', 'Café Nin').tag).toBe('Brunch')
    expect(item('hungry', 'Mi Compa Chava').tag).toBeUndefined()
    // Quintonil keeps its existing text word for word
    expect(item('dinner', 'Quintonil').note).toBe(g.city.copy[lang].foodCollections.find((c) => c.name === 'Quintonil')!.note)
  })
  test('rankings and their years live in one place; the year in a text comes from there', () => {
    expect(HOTEL_RANKINGS.michelin.year).toBe(2026)
    expect(HOTEL_RANKINGS.mentions).toEqual({ Gaba: 2026, 'Tlecān': 2026, 'Bar Mauro': 2026, 'Handshake Speakeasy': 2024 })
    const night = moodsOf('en').find((m) => m.id === 'nightlife')!.items
    expect(night.find((i) => i.name === 'Tlecān')!.note).toBe("A mezcal bar, ranked 5 in North America's 50 Best Bars 2026.")
    expect(night.find((i) => i.name === 'Bar Mauro')!.note).toBe('An Italian-style aperitivo bar, named the best bar in Mexico in 2026 by 50 Best.')
    expect(night.find((i) => i.name === 'Handshake Speakeasy')!.note).toBe("Named the world's best bar in 2024. Book well ahead.")
    expect(moodsOf('es').find((m) => m.id === 'dinner')!.items[0].note).toBe('El restaurante con estrella de la Condesa, reconocido en 2026. Reserva con tiempo.')
    for (const m of [...moodsOf('en'), ...moodsOf('es')]) for (const i of m.items) expect(i.note).not.toContain('{year}')
  })
  test('texts, addresses and zones of the new places, as given', () => {
    const en = (m: string, n: string) => moodsOf('en').find((x) => x.id === m)!.items.find((i) => i.name === n)!
    const es = (m: string, n: string) => moodsOf('es').find((x) => x.id === m)!.items.find((i) => i.name === n)!
    expect(en('dinner', 'Gaba')).toMatchObject({ address: 'Av. Mazatlán 190', zone: 'Condesa' })
    expect(en('dinner', 'Em')).toMatchObject({ address: 'Ámsterdam 76', zone: 'Hipódromo Condesa', note: "Lucho Martínez's tasting menu in a small house on Ámsterdam. Book ahead." })
    expect(en('shop', 'Utilitario Mexicano')).toMatchObject({ address: 'Marsella 3A', zone: 'Juárez' })
    expect(es('culture', 'Castillo de Chapultepec').note).toBe('El castillo en lo alto de Chapultepec, con el museo nacional de historia y una gran vista de la ciudad.')
    expect(en('culture', 'Casa Lamm')).toMatchObject({ address: 'Av. Álvaro Obregón 99', zone: 'Roma Norte' })
    expect(en('culture', 'Museo de Arte Popular')).toMatchObject({ address: 'Revillagigedo 11', zone: 'Centro', note: 'Mexican folk art from every region: masks, textiles, ceramics and alebrijes.' })
    expect(es('culture', 'Museo Franz Mayer')).toMatchObject({ address: 'Av. Hidalgo 45', note: 'Artes decorativas y diseño en un antiguo hospital con un patio tranquilo.' })
    expect(en('hidden', 'Fonoteca Nacional')).toMatchObject({ address: 'Av. Francisco Sosa 383', zone: 'Coyoacán', note: 'The national sound archive, in an old house with a quiet garden. Weekdays only.' })
    expect(es('hungry', 'Botánico')).toMatchObject({ address: 'Alfonso Reyes 217', zone: 'Condesa', note: 'Un restaurante con jardín en la Condesa, para una cena larga.' })
    expect(moodsOf('en').find((m) => m.id === 'culture')!.items.map((i) => i.name)).toContain('OMR')
    expect(es('hidden', 'Kiosko Morisco').note).toBe('Un pabellón de hierro de estilo morisco en la alameda de Santa María la Ribera.')
    expect(en('hungry', 'Mi Compa Chava').note).toBe('Sinaloa-style seafood for a long lunch. Expect a wait.')
    expect(es('nightlife', 'Hanky Panky').note).toBe('Un speakeasy escondido detrás de una taquería. Reserva con tiempo.')
    expect(en('nightlife', 'Baltra Bar')).toMatchObject({ address: 'Iztaccíhuatl 36D', zone: 'Condesa' })
    expect(en('hungry', 'Café Nin').zone).toBe('Juárez')
    expect(en('hidden', 'Casa Franca').zone).toBe('Roma Norte') // Roma Norte everywhere it appears
  })
  test('every new place is flagged to verify opening days and hours; Casa Lamm also whether it is still open to the public', () => {
    expect(VERIFY_HOURS).toBe('to verify: opening days and hours')
    expect(VERIFY_OPEN).toBe('to verify: still open to the public')
    expect(MOOD_VERIFY).toBe('to verify: address, opening days and hours')
    for (const p of Object.values(NEW_PLACES)) expect(p.verify.length).toBeGreaterThan(0)
    for (const n of ['Museo de Arte Popular', 'Museo Franz Mayer', 'Fonoteca Nacional', 'Botánico', 'Esquina Común', 'Em', 'Castillo de Chapultepec', 'OMR', 'Audiorama', 'Museo Anahuacalli', 'Kiosko Morisco', 'Baldío', 'Plonk', 'Mi Compa Chava', 'Baltra Bar', 'Tlecān', 'Bar Mauro', 'Hanky Panky', 'Handshake Speakeasy', 'Gaba', 'Maleza', 'Utilitario Mexicano'])
      expect(NEW_PLACES[n].verify).toContain(VERIFY_HOURS)
    expect(NEW_PLACES['Casa Lamm'].verify).toEqual([VERIFY_HOURS, VERIFY_OPEN])
    expect(Object.entries(ADDRESSES).filter(([, a]) => a.repo).map(([n]) => n).sort()).toEqual(['Foro Shakespeare', 'Museo Tamayo'])
  })
  test('within the moods, a place is in one panel only; a place may also have a card in a zone tab', () => {
    const names = moodsOf('en').flatMap((m) => m.items.map((i) => i.name))
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([])
    const tabs = Object.values(buildHotelGuideProps('condesa')!.city.neighborhoods).flatMap((n) => n.spots.en.map((x) => x.name))
    for (const n of ['Proyecto Rufina', 'Librería El Péndulo', 'Licorería Limantour', 'Mercado de Artesanías La Ciudadela']) { expect(names).toContain(n); expect(tabs).toContain(n) }
  })
  test('LOCK: no mood text, label or address mentions Livin', () => {
    expect(JSON.stringify(moodsOf('en')) + JSON.stringify(moodsOf('es'))).not.toMatch(/\bLivin\b/)
  })
})

describe('tab edits for the hotel edition', () => {
  const spots = (z: HotelZone, tab: string, lang: 'en' | 'es' = 'en') => buildHotelGuideProps(z)!.city.neighborhoods[tab].spots[lang].map((s) => s.name)
  test('Polanco tab: Siembra Tortillería replaces El Turix for Condesa and Roma Norte hotels; the Polanco hotel keeps El Turix', () => {
    for (const z of ['condesa', 'roma'] as const) {
      expect(spots(z, 'Polanco')).toContain('Siembra Tortillería')
      expect(spots(z, 'Polanco')).not.toContain('El Turix')
    }
    expect(spots('polanco', 'Polanco')).toContain('El Turix')
    expect(spots('polanco', 'Polanco')).not.toContain('Siembra Tortillería')
    const siembra = buildHotelGuideProps('condesa')!.city.neighborhoods.Polanco.spots
    expect(siembra.en.find((s) => s.name === 'Siembra Tortillería')).toMatchObject({ distance: 'Av. Isaac Newton 256', note: 'Tacos and tortillas made with native Mexican corn.' })
    expect(siembra.es.find((s) => s.name === 'Siembra Tortillería')!.note).toBe('Tacos y tortillas de maíz nativo mexicano.')
    expect(POLANCO_SWAP.spot.verify).toBe(TAB_VERIFY)
    // El Turix is not on the tab in the replaced position: same slot
    expect(spots('condesa', 'Polanco').indexOf('Siembra Tortillería')).toBe(spots('polanco', 'Polanco').indexOf('El Turix'))
  })
  test('Centro tab: La Ciudadela right after Mercado de San Juan (both stay), in every hotel; also in "I want to shop"', () => {
    for (const z of HOTEL_ZONES) {
      const c = spots(z, 'Centro')
      expect(c.indexOf('Mercado de Artesanías La Ciudadela')).toBe(c.indexOf('Mercado de San Juan') + 1)
      expect(c).toHaveLength(7)
      expect(buildHotelGuideProps(z)!.city.copy.en.moods.find((m) => m.id === 'shop')!.items.map((i) => i.name)).toContain('Mercado de Artesanías La Ciudadela')
    }
    expect(buildHotelGuideProps('condesa')!.city.neighborhoods.Centro.spots.es.find((s) => s.name === 'Mercado de Artesanías La Ciudadela')).toMatchObject({
      distance: 'Balderas', note: 'El mercado de artesanías de la ciudad, con puestos de todo México.',
    })
    expect(CENTRO_ADDITION.spot.verify).toBe(TAB_VERIFY)
  })
  test('Coyoacán tab: Los Danzantes replaces La Coyoacana; Mercado de Coyoacán stays', () => {
    const c = spots('condesa', 'Coyoacán')
    expect(c).toContain('Los Danzantes')
    expect(c).toContain('Mercado de Coyoacán')
    expect(c).not.toContain('La Coyoacana')
    expect(buildHotelGuideProps('condesa')!.city.neighborhoods['Coyoacán'].spots.en.find((s) => s.name === 'Los Danzantes')).toMatchObject({
      distance: 'Plaza Jardín Centenario 12', note: 'Oaxacan-inspired cooking and mezcal on the terrace over the plaza.',
    })
    expect(JSON.stringify(EXTRA_ZONES)).not.toContain('La Coyoacana')
  })
})

describe('a shared link is not a scan', () => {
  test('?via=share is recognised; nothing else counts as a share', () => {
    expect(isShareOpen(new URLSearchParams('lang=es&via=share'))).toBe(true)
    expect(isShareOpen(new URLSearchParams('lang=es'))).toBe(false)
    expect(isShareOpen(new URLSearchParams('via=qr'))).toBe(false)
  })
  test('the WhatsApp link carries ?via=share, with and without a hotel code', () => {
    for (const code of [null, 'abcd2345wxyz'])
      for (const lang of ['en', 'es'] as const) expect(hotelShareUrl({ code, zone: 'condesa', lang })).toContain(`?lang=${lang}&via=share`)
  })
  test('the /g route skips the scan when the marker is present (and only then)', () => {
    const route = fs.readFileSync(path.join(process.cwd(), 'app/g/[code]/route.ts'), 'utf8')
    expect(route).toMatch(/isCountableScan\(req\) && !isShareOpen\(req\.nextUrl\.searchParams\)/)
    // the redirect: same target with ?h and ?lang; a shared link also keeps ?via=share so the guide records no opens (hotel-opens-api test)
    expect(route).toMatch(/zoneGuidePath\(hotel\.zone, \{ h: code, lang, \.\.\.\(isShareOpen\(req\.nextUrl\.searchParams\) \? \{ via: 'share' \} : \{\}\) \}\)/)
  })
})
