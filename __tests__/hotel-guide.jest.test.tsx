/**
 * @jest-environment node
 *
 * The hotel edition: held items never render, no Insider link or number anywhere, config-driven block order.
 * (Livin and demo staying byte-identical is guia-unchanged.jest.test.tsx.)
 */
import { renderToStaticMarkup } from 'react-dom/server'
import HotelGuideClient from '../app/guia/cdmx/[zone]/HotelGuideClient'
import { getCity } from '../content/guia'
import { HOTEL_FREE_EDITION } from '../content/guia/hotel/config'
import { buildHotelGuideProps, resolveHotelPractical } from '../content/guia/hotel/resolve'
import { HOTEL_ZONES, type HotelZone } from '../content/guia/hotel/zones'
import { getZone } from '../content/guia/zones'
import type { Lang } from '../content/guia/types'

const city = getCity('cdmx')!
const LANGS: Lang[] = ['es', 'en']
const render = (zone: HotelZone) => renderToStaticMarkup(<HotelGuideClient {...buildHotelGuideProps(city, zone)} />)
const titles = (zone: HotelZone, lang: Lang) => resolveHotelPractical(city, zone, lang).map((c) => c.title)

describe('held items do not render in the hotel edition', () => {
  const heldArrival = city.copy.es.arrivalItems.concat(city.copy.en.arrivalItems).filter((i) => i.hold)

  test('the arrival cards held today are Airport and Earthquakes, in both languages', () => {
    expect(heldArrival.map((i) => i.id ?? i.icon).sort()).toEqual(['earthquakes', 'earthquakes', 'plane', 'plane'])
  })

  test.each(HOTEL_ZONES.flatMap((z) => LANGS.map((l) => [z, l] as const)))('%s/%s: no held arrival card', (zone, lang) => {
    const resolved = titles(zone, lang)
    for (const item of city.copy[lang].arrivalItems.filter((i) => i.hold)) expect(resolved).not.toContain(item.title)
  })

  test.each(HOTEL_ZONES.flatMap((z) => LANGS.map((l) => [z, l] as const)))('%s/%s: a held FAQ answer is skipped, others stay', (zone, lang) => {
    const held = !!getZone(zone)?.answers?.cashAtms?.hold
    const resolved = resolveHotelPractical(city, zone, lang).map((c) => c.key)
    expect(resolved.includes('cashAtms')).toBe(!held)
    expect(resolved).toContain('oddHours')
  })

  test('Cash & ATMs is held in Roma and Polanco (Banamex TODO) and shows in Condesa', () => {
    expect(getZone('roma')?.answers?.cashAtms?.hold).toBe('confirm')
    expect(getZone('polanco')?.answers?.cashAtms?.hold).toBe('confirm')
    expect(getZone('condesa')?.answers?.cashAtms?.hold).toBeUndefined()
  })

  test('releasing a hold is the only thing that shows the item (config already lists it)', () => {
    const plane = city.copy.en.arrivalItems.find((i) => i.icon === 'plane')!
    expect(HOTEL_FREE_EDITION.practical.arrival).toContain('plane')
    const released = { ...city, copy: { ...city.copy, en: { ...city.copy.en, arrivalItems: city.copy.en.arrivalItems.map((i) => (i === plane ? { ...i, hold: undefined } : i)) } } }
    expect(resolveHotelPractical(released, 'condesa', 'en').map((c) => c.title)).toContain(plane.title)
  })
})

describe('what the practical part shows', () => {
  test('Money, Safety, Tap water, Altitude, Connectivity, Health once, Transportation, Cash (Condesa), Odd hours', () => {
    const cards = resolveHotelPractical(city, 'condesa', 'en').map((c) => c.key)
    expect(cards).toEqual(['car', 'banknote', 'wifi', 'shield', 'droplet', 'mountain', 'health-pharmacies', 'cashAtms', 'oddHours'])
  })
  test('weather, luggage, late return, parking, laundry, supermarkets, exchange, coworking, haircuts, gyms are off', () => {
    const keys = HOTEL_ZONES.flatMap((z) => resolveHotelPractical(city, z, 'en').map((c) => c.key))
    for (const off of ['cloudSun', 'briefcase', 'coming-back-late', 'parking', 'laundry', 'supermarkets', 'currencyExchange', 'coworking', 'haircuts', 'gyms', 'massages'])
      expect(keys).not.toContain(off)
  })
  test('Transportation keeps its complete sentences and loses the Insider link', () => {
    for (const lang of LANGS) {
      const car = resolveHotelPractical(city, 'roma', lang).find((c) => c.key === 'car')!
      expect(car.links).toBeUndefined()
      expect(car.body.trim().endsWith('.')).toBe(true)
      expect(car.body).not.toMatch(/Insider|recomendamos\s*$|recommend\s*$/i)
    }
  })
  test('Connectivity keeps the Airalo link', () => {
    const wifi = resolveHotelPractical(city, 'condesa', 'en').find((c) => c.key === 'wifi')!
    expect(wifi.links?.[0].href).toContain('airalo')
  })
})

describe.each(HOTEL_ZONES)('%s guide HTML', (zone) => {
  const html = render(zone)
  test('the props serialized to the browser (RSC payload) carry no Insider link, number or name either', () => {
    const payload = JSON.stringify(buildHotelGuideProps(city, zone))
    for (const bad of ['Insider', '525539149062', 'wa.me/', 'Livin', 'hostLetter'.length ? 'Veracruz 85' : ''])
      expect(payload).not.toContain(bad)
  })
  test('no Insider, no Insider WhatsApp number, no partner name, no host letter', () => {
    for (const bad of ['Insider', '525539149062', 'wa.me/52553', 'Livin', 'Veracruz 85', 'Curated by', 'Curado por', 'Your own plan', 'Tu propio plan'])
      expect(html).not.toContain(bad)
  })
  test('the page really rendered the shown content (guards the negative checks above)', () => {
    for (const must of ['Tap water', 'airalo.tpm.li', 'data-hotel-section="practical"']) expect(html).toContain(must)
  })
  test('placeholder experiences have no booking button', () => {
    expect(html).not.toMatch(/Book via WhatsApp|Reservar por WhatsApp/)
    expect(html).not.toContain('expBookLink')
  })
  test('blocks render in the configured order, hero first', () => {
    const at = HOTEL_FREE_EDITION.blocks.map((b) => html.indexOf(`data-hotel-section="${b}"`))
    expect(at.every((i) => i >= 0)).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
  })
  test('off blocks are absent: no stay-glance, no discover-more, no sticky planner CTA, no "your house" tab', () => {
    expect(html).not.toContain('stickyCta')
    expect(html).not.toContain('discoverGrid')
    expect(html).not.toMatch(/Your house|Tu casa/)
  })
  test('the hotel zone tab comes first and is the selected one', () => {
    expect(html).toMatch(/role="tab"[^>]*aria-selected="true"/)
    const first = html.match(/role="tab" aria-selected="(true|false)"/)
    expect(first?.[1]).toBe('true')
  })
  test('the share button and Lagomplan eyebrow are there', () => {
    expect(html).toContain('Send this guide to my phone')
    expect(html).toContain('Neighborhood guide · Lagomplan')
  })
})
