/**
 * @jest-environment node
 *
 * The hotel edition IS the Livin guide (GuiaClient) with five differences: no host letter, GetYourGuide experiences
 * (no Insider), no newsletter, the hotel welcome banner, and the hotel's zone as the default five-zones tab.
 * Standing rules on top: held items never render, no Insider link or number anywhere.
 * (Livin and demo staying byte-identical is guia-unchanged.jest.test.tsx.)
 */
import { renderToStaticMarkup } from 'react-dom/server'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { getGuide } from '../content/guia'
import { HOTEL_FREE_EDITION, HOTEL_SECTION_IDS } from '../content/guia/hotel/config'
import { HOTEL_EXPERIENCES } from '../content/guia/hotel/experiences'
import { HOTEL_PARTNER_SLUG, buildHotelGuideProps } from '../content/guia/hotel/resolve'
import { HOTEL_ZONES, ZONE_LABEL, ZONE_NEIGHBORHOOD, type HotelZone } from '../content/guia/hotel/zones'
import { GYG_PARTNER_ID, isGygTourUrl } from '../lib/affiliate/gyg'

const hotel = (zone: HotelZone) => renderToStaticMarkup(<GuiaClient {...buildHotelGuideProps(zone)!} />)
const livin = (zone: HotelZone) => {
  const g = getGuide(HOTEL_PARTNER_SLUG[zone])!
  return renderToStaticMarkup(<GuiaClient partner={g.partner} city={g.city} />)
}
const headings = (html: string) => [...html.matchAll(/<h[12][^>]*>([^<]*)</g)].map((m) => m[1])
const tabs = (html: string) => [...html.matchAll(/role="tab" aria-selected="(true|false)"[^>]*>([^<]*)</g)].map((m) => ({ selected: m[1] === 'true', label: m[2] }))

describe.each(HOTEL_ZONES)('%s hotel guide', (zone) => {
  const html = hotel(zone)
  const base = livin(zone)

  test('same sections in the same order as the Livin guide (welcome banner aside)', () => {
    expect(headings(html).slice(1)).toEqual(headings(base).slice(1))
  })
  test('opens with the hotel welcome banner: "Your guide to {zone}", share button kept', () => {
    expect(headings(html)[0]).toBe(`Your guide to ${ZONE_LABEL[zone]}`)
    expect(html).not.toContain('Welcome to Mexico City.')
    expect(html).toContain('Send this guide to my phone')
    expect(html).toContain('Neighborhood guide · Lagomplan')
  })
  test('the practical part is the Livin one, with the same groups', () => {
    expect(html).toContain('A calm start to your trip')
    const groups = ['Before you arrive', 'Everyday errands', 'Eating in', 'Take care']
    expect(groups.filter((g) => html.includes(g))).toEqual(groups.filter((g) => base.includes(g)))
    if (zone === 'condesa') for (const g of groups) expect(html).toContain(g)
  })
  test('five zones: the same five tabs as the Livin guide, and the hotel zone is the one selected', () => {
    const t = tabs(html)
    expect(t.map((x) => x.label)).toEqual(tabs(base).map((x) => x.label))
    expect(t).toHaveLength(5)
    const selected = t.filter((x) => x.selected)
    expect(selected).toHaveLength(1)
    expect(selected[0].label).toBe(ZONE_NEIGHBORHOOD[zone])
  })
  test('no separate "your zone" block', () => {
    expect(html).not.toMatch(/Your area|Tu zona/)
  })
  test('the 48 hours section is there', () => {
    expect(html).toContain('48 hours')
  })
  test('differences: no host letter, no newsletter form', () => {
    expect(html).not.toContain('type="email"')
    expect(html).not.toContain('/api/subscribe')
    expect(base).toContain('type="email"') // the Livin guide has them, so the check above means something
  })
  test('no Insider link, number or entry anywhere (page source included)', () => {
    for (const bad of ['Insider', '525539149062', 'wa.me/52553', 'Book via WhatsApp', 'Reservar por WhatsApp', 'Your own plan', 'Tu propio plan'])
      expect(html).not.toContain(bad)
    expect(JSON.stringify(buildHotelGuideProps(zone))).not.toMatch(/Insider|525539149062/)
  })
  test('held items never render (airport and earthquakes cards)', () => {
    for (const held of ['Most flights land at AICM', 'seismic alert', 'La mayoría de los vuelos llegan al AICM'])
      expect(html).not.toContain(held)
    expect(base).toContain('Most flights land at AICM') // Livin still shows them
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
  test('each zone uses the matching Livin guide', () => {
    expect(HOTEL_PARTNER_SLUG).toEqual({ condesa: 'livin_condesa', roma: 'livin_roma', polanco: 'livin_polanco' })
  })
  test('the edition config only holds the banner and tracking settings', () => {
    expect(HOTEL_FREE_EDITION.zoneHeadline.es.replace('{zone}', 'Roma Norte')).toBe('Tu guía de Roma Norte')
    expect(HOTEL_FREE_EDITION.zoneHeadline.en.replace('{zone}', 'Polanco')).toBe('Your guide to Polanco')
  })
  test('held FAQ answers are listed for the zones that have them (Roma, Polanco: cash and ATMs)', () => {
    expect(buildHotelGuideProps('roma')!.hotel.heldFaqKeys).toContain('cashAtms')
    expect(buildHotelGuideProps('polanco')!.hotel.heldFaqKeys).toContain('cashAtms')
  })
})
