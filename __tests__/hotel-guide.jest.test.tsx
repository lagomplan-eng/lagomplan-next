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
import { HOTEL_EXPERIENCES } from '../content/guia/hotel/experiences'
import { HOTEL_PARTNER_SLUG, buildHotelGuideProps } from '../content/guia/hotel/resolve'
import { HOTEL_REWORDS, hotelReword, zonesHeading } from '../content/guia/hotel/rewords'
import { HOTEL_ZONES, ZONE_LABEL, ZONE_NEIGHBORHOOD, type HotelZone } from '../content/guia/hotel/zones'
import { GYG_PARTNER_ID, isGygTourUrl } from '../lib/affiliate/gyg'
import { CHEF_WHATSAPP_NUMBER } from '../lib/guia/links'

const hotel = (zone: HotelZone) => renderToStaticMarkup(<GuiaClient {...buildHotelGuideProps(zone)!} />)
const livin = (zone: HotelZone) => {
  const g = getGuide(HOTEL_PARTNER_SLUG[zone])!
  return renderToStaticMarkup(<GuiaClient partner={g.partner} city={g.city} />)
}
const headings = (html: string) => [...html.matchAll(/<h[12][^>]*>([^<]*)</g)].map((m) => m[1])
const tabs = (html: string) => [...html.matchAll(/role="tab" aria-selected="(true|false)"[^>]*>([^<]*)</g)].map((m) => ({ selected: m[1] === 'true', label: m[2] }))
const visibleText = (html: string) => html.replace(/<[^>]+>/g, '\n').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').split('\n').map((x) => x.trim()).filter(Boolean).join('\n')
const LIVIN_HEADING_4 = 'Four zones, four ways to experience the city'
const LIVIN_HEADING_5 = 'Five zones, five ways to experience the city'

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

  test('same sections in the same order as the Livin guide (welcome banner and the zones title aside)', () => {
    const norm = (h: string[]) => h.slice(1).map((x) => (x === LIVIN_HEADING_4 ? LIVIN_HEADING_5 : x))
    expect(norm(headings(html))).toEqual(norm(headings(base)))
  })
  test('opens with the hotel welcome banner: "Your guide to {zone}", share button kept', () => {
    expect(headings(html)[0]).toBe(`Your guide to ${ZONE_LABEL[zone]}`)
    expect(html).toContain('Send this guide to my phone')
    expect(html).toContain('Neighborhood guide · Lagomplan')
  })
  test('the zones section: four tabs, no "Your house", the hotel zone open, and a title that says four', () => {
    const t = tabs(html)
    expect(t.map((x) => x.label)).toEqual(['Roma Norte', 'Condesa', 'Polanco', 'Centro'])
    expect(t.filter((x) => x.selected).map((x) => x.label)).toEqual([ZONE_NEIGHBORHOOD[zone]])
    expect(headings(html)).toContain(LIVIN_HEADING_4)
    expect(html).not.toMatch(/Your house|Tu casa|Your area|Tu zona/)
  })
  test('no check-out strip, no host letter, no newsletter', () => {
    if (zone === 'condesa') expect(base).toContain('Check-out') // the Livin Condesa guide has it, so the check below means something
    expect(html).not.toMatch(/Check-out|Check-in/i)
    expect(html).not.toContain('type="email"')
    expect(html).not.toContain('/api/subscribe')
  })
  test('no private chefs and no massages', () => {
    for (const bad of ['Chefs at home', 'Chef Adán', 'di Monaco', 'Take a Chef', 'takeachef', 'Massages', 'Casa Ancestras', 'acuityscheduling', '525611224292', CHEF_WHATSAPP_NUMBER])
      expect(html).not.toContain(bad)
  })
  test('the airport, earthquakes and cash and ATMs answers show, like in the Livin guide', () => {
    for (const shown of ['Most flights land at AICM', 'Earthquakes', 'Cash and ATMs']) {
      expect(html).toContain(shown)
      expect(base).toContain(shown)
    }
  })
  test('the Transportation card keeps no Insider sentence', () => {
    expect(html).toContain('Use Uber, cheaper and safer than hailing on the street.')
    expect(html).not.toContain('private transport')
  })
  test('nothing that belongs to the property: no "your host", "the apartment", "your unit", "the property", "your own street"', () => {
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
  test('every tracked section is marked, in guide order', () => {
    const at = HOTEL_SECTION_IDS.map((id) => html.indexOf(`data-hotel-section="${id}"`))
    expect(at.every((i) => i >= 0)).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
  })
  test('the Livin guide itself carries no hotel markers', () => {
    expect(base).not.toContain('data-hotel-section')
  })
})

describe('the three zones cannot drift apart', () => {
  const pages = Object.fromEntries(HOTEL_ZONES.map((z) => [z, hotel(z)])) as Record<HotelZone, string>
  const groups = (html: string) => ['Before you arrive', 'Everyday errands', 'Eating in', 'Take care'].filter((g) => html.includes(g))
  const sections = (html: string) => [...html.matchAll(/data-hotel-section="([a-z]+)"/g)].map((m) => m[1])

  test('same section headings in the same order, apart from the welcome headline', () => {
    const [a, ...rest] = HOTEL_ZONES.map((z) => headings(pages[z]).slice(1))
    for (const r of rest) expect(r).toEqual(a)
  })
  test('same tracked sections in the same order', () => {
    const [a, ...rest] = HOTEL_ZONES.map((z) => sections(pages[z]))
    expect(a).toEqual([...HOTEL_SECTION_IDS])
    for (const r of rest) expect(r).toEqual(a)
  })
  test('same four zone tabs', () => {
    const [a, ...rest] = HOTEL_ZONES.map((z) => tabs(pages[z]).map((t) => t.label))
    for (const r of rest) expect(r).toEqual(a)
  })
  // Differences that come from the zone files, not from this edition. Listed so a change shows up here.
  // Take care: the Livin guides only had it through the chefs/massages partner answers (Condesa, Roma); with those
  // removed no zone has a Take care group. Nothing was invented to fill it.
  test('the practical groups each zone has (documented, not padded)', () => {
    expect(Object.fromEntries(HOTEL_ZONES.map((z) => [z, groups(pages[z])]))).toEqual({
      condesa: ['Before you arrive', 'Everyday errands', 'Eating in'],
      roma: ['Before you arrive', 'Everyday errands', 'Eating in'],
      polanco: ['Before you arrive', 'Everyday errands', 'Eating in'],
    })
  })
})

describe('rewording for a hotel', () => {
  test('the number in the zones title follows the number of tabs', () => {
    expect(zonesHeading('en', 4)).toBe(LIVIN_HEADING_4)
    expect(zonesHeading('es', 4)).toBe('Cuatro zonas, cuatro maneras de vivir la ciudad')
    expect(zonesHeading('en', 5)).toBe(LIVIN_HEADING_5)
    expect(zonesHeading('es', 5)).toBe('Cinco zonas, cinco maneras de vivir la ciudad')
  })
  test('every reword has something to change in the copy, and removes its "before"', () => {
    const g = getGuide('livin_condesa')!
    const zoneFiles = HOTEL_ZONES.map((z) => JSON.stringify(require('../content/guia/zones').getZone(z)))
    const source = JSON.stringify(g.city.copy) + JSON.stringify(require('../content/guia/faq/base').faqBase) + zoneFiles.join('')
    // the source stores long strings joined with "' +", so compare on the evaluated text
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

describe('experiences: the GetYourGuide tours on this branch', () => {
  const html = hotel('condesa')
  test('only Casa Luis Barragán, with a booking button, in a width-capped grid', () => {
    expect(HOTEL_EXPERIENCES.items.map((e) => e.id)).toEqual(['casa-luis-barragan'])
    expect(html.match(/expBookLink/g)?.length).toBe(1)
    expect(html).toMatch(/class="expGrid" style="max-width:400px"/)
    for (const gone of ["Val'Quirico", 'Val&#x27;Quirico', 'Day of the Dead']) expect(html).not.toContain(gone)
  })
  test.each(HOTEL_EXPERIENCES.items.map((e) => [e.id, e] as const))('%s: a repo tour URL with the partner ID', (_id, e) => {
    expect(isGygTourUrl(e.tourUrl)).toBe(true)
    const u = new URL(e.bookUrl)
    expect(u.searchParams.getAll('partner_id')).toEqual([GYG_PARTNER_ID])
    expect(u.searchParams.get('cmp')).toBe('hotel-guide')
    expect(html).toContain(e.bookUrl.replace(/&/g, '&amp;'))
  })
})

describe('hotel zone to Livin guide', () => {
  test('each zone uses the matching Livin guide as its base', () => {
    expect(HOTEL_PARTNER_SLUG).toEqual({ condesa: 'livin_condesa', roma: 'livin_roma', polanco: 'livin_polanco' })
  })
  test('the edition config only holds the banner and tracking settings', () => {
    expect(HOTEL_FREE_EDITION.zoneHeadline.es.replace('{zone}', 'Roma Norte')).toBe('Tu guía de Roma Norte')
    expect(HOTEL_FREE_EDITION.zoneHeadline.en.replace('{zone}', 'Polanco')).toBe('Your guide to Polanco')
  })
})
