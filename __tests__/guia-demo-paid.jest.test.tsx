/**
 * @jest-environment node
 *
 * __tests__/guia-demo-paid.jest.test.tsx — the paid white-label demo at /guia/demo ("Casa Lagom").
 * Replaces the old `demo` entry of guia-unchanged (the Livin clone). Locks: the server HTML (hash), the white label,
 * the sample labelling, the three switches, nothing of the Livin property in the page data, and that the free hotel
 * guide (a separate hash baseline in guia-frozen-pages) has none of the paid layer.
 * Regenerate the hash on purpose with: WRITE_BASELINE=1 npx jest __tests__/guia-demo-paid
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { CASA_LAGOM } from '../content/guia/paid/casa-lagom'
import { buildPaidGuideProps } from '../content/guia/paid/resolve'
import { buildHotelGuideProps } from '../content/guia/hotel/resolve'
import { getGuide } from '../content/guia'
import { paidShareHref, paidShareUrl } from '../content/guia/paid/share'
import { contactHref, whatsappHref } from '../content/guia/paid/links'
import { stayDates, welcomeLine } from '../content/guia/paid/dates'
import { hotelShareHref } from '../content/guia/hotel/share'
import type { PaidClient } from '../content/guia/paid/types'

const FIXTURE = path.join(__dirname, 'fixtures', 'guia-demo-paid.json')
const render = (client = CASA_LAGOM) => renderToStaticMarkup(<GuiaClient {...buildPaidGuideProps(client, 'condesa')!} />)
const sha = (s: string) => createHash('sha256').update(s).digest('hex')
const html = render()

describe('paid demo (Casa Lagom)', () => {
  if (process.env.WRITE_BASELINE) {
    test('baseline written', () => { fs.writeFileSync(FIXTURE, JSON.stringify({ demo_paid: sha(html) }, null, 2) + '\n') })
  } else {
    test('server HTML matches the approved baseline', () => {
      expect(sha(html)).toBe(JSON.parse(fs.readFileSync(FIXTURE, 'utf8')).demo_paid)
    })
  }

  test('white label: client logo and name in the header, brand colour as --brand, no Lagomplan logo in the header', () => {
    expect(html).toContain('src="/images/guia/paid/casa-lagom.svg"')
    expect(html).toContain('--brand:#3D4F7C')
    expect(html).not.toContain('src="/images/logo.png"')
    expect(html).toContain('Casa Lagom · Neighborhood guide')
  })

  test('letter from the host near the top, before the zones, with the contact button', () => {
    const letter = html.indexOf('data-paid-section="letter"')
    expect(letter).toBeGreaterThan(0)
    expect(letter).toBeLessThan(html.indexOf('data-hotel-section="neighborhoods"'))
    expect(letter).toBeGreaterThan(html.indexOf('data-hotel-section="hero"'))
    expect(html).toContain('A letter from your host')
    expect(html).toContain('Message the host')
  })

  test('everything the host supplies is labelled as sample, the button carries no real link, the demo has a banner', () => {
    expect(html).toContain('Casa Lagom is an invented hotel')
    expect((html.match(/>Sample</g) ?? []).length).toBeGreaterThanOrEqual(2)
    expect(html).toMatch(/<button[^>]*disabled[^>]*>Message the host/)
    expect(html).not.toMatch(/wa\.me\/\d|tel:/) // no number anywhere (the only wa.me link is the share link, wa.me/?text=)
  })

  test('footer: small "powered by Lagomplan", always', () => {
    expect(html).toContain('powered by Lagomplan')
    expect(render({ ...CASA_LAGOM, switches: { houseFacts: false, pmsLink: false, plannerInvite: false } })).toContain('powered by Lagomplan')
  })

  test('switch C: planner invitation on by default, gone when off (and the destination cards after it)', () => {
    expect(html).toContain('data-hotel-section="planner"')
    const off = render({ ...CASA_LAGOM, switches: { ...CASA_LAGOM.switches, plannerInvite: false } })
    expect(off).not.toContain('data-hotel-section="planner"')
    expect(off).not.toContain('data-hotel-section="discover"')
    expect(off).toContain('data-paid-section="letter"')
  })

  test('same place picks as the free hotel edition: the city data (zones, six moods, weekly rows) is identical', () => {
    expect(JSON.stringify(buildPaidGuideProps(CASA_LAGOM, 'condesa')!.city)).toBe(JSON.stringify(buildHotelGuideProps('condesa')!.city))
  })

  test('nothing of the Livin property in the page', () => {
    const livin = getGuide('livin_condesa')!.partner.yourHouse
    for (const s of ['Veracruz 85', 'Livin', livin.mapUrl, '525539149062']) expect(html).not.toContain(s)
  })

  test('the free hotel guide has none of the paid layer', () => {
    const free = renderToStaticMarkup(<GuiaClient {...buildHotelGuideProps('condesa')!} />)
    expect(free).not.toContain('data-paid-section')
    expect(free).not.toContain('--brand')
    expect(free).not.toContain('powered by Lagomplan')
  })

  // ── Preview 2 ────────────────────────────────────────────────────────────────────────────────────────────────
  const off = (over: Partial<PaidClient['switches']>) => render({ ...CASA_LAGOM, switches: { ...CASA_LAGOM.switches, ...over } })
  const pos = (h: string, needle: string) => h.indexOf(needle)

  test('Your house (switch A): one set of fixed facts, after the letter and before the zones, labelled sample', () => {
    const house = pos(html, 'data-paid-section="house"')
    expect(house).toBeGreaterThan(pos(html, 'data-paid-section="letter"'))
    expect(house).toBeLessThan(pos(html, 'data-hotel-section="neighborhoods"'))
    const part = html.slice(house, pos(html, 'data-hotel-section="neighborhoods"'))
    for (const label of ['Wi-Fi', 'Who to call', 'Keys and access', 'Check-in', 'Luggage', 'House rules', 'Check-out']) expect(part).toContain(label)
    expect(part).toContain('CasaLagom-Guests')
    expect(part).toContain('Sample')
    expect((part.match(/data-paid-section="house"/g) ?? []).length).toBe(1) // one set, no selector
  })

  test('review request sits right under check-out, inside Your house', () => {
    const co = pos(html, 'Check-out')
    const review = pos(html, 'data-paid-section="review"')
    expect(review).toBeGreaterThan(co)
    expect(review).toBeLessThan(pos(html, 'data-hotel-section="neighborhoods"'))
    expect(html.slice(co, review)).not.toContain('factLabel') // nothing but the check-out value in between
    expect(html).toContain('Leave a review')
    expect((html.match(/data-paid-section="review"/g) ?? []).length).toBe(1)
  })

  test('switch A off: no Your house, and the review request closes Good to know instead', () => {
    const h = off({ houseFacts: false })
    expect(h).not.toContain('data-paid-section="house"')
    expect(h).not.toContain('CasaLagom-Guests')
    expect(h).toContain('data-paid-section="review"')
    expect(pos(h, 'data-paid-section="review"')).toBeGreaterThan(pos(h, 'id="practico"'))
    expect(pos(h, 'data-paid-section="review"')).toBeLessThan(pos(h, 'data-hotel-section="planner"'))
  })

  test('switch B: the sample guest line in the banner; gone when off (the default for a client)', () => {
    expect(html).toContain('Welcome, María · 12–15 December')
    expect(html).toContain('Sample guest')
    expect(pos(html, 'data-paid-section="guest"')).toBeLessThan(pos(html, 'data-paid-section="letter"'))
    const h = off({ pmsLink: false })
    expect(h).not.toContain('data-paid-section="guest"')
    expect(h).not.toContain('María')
  })

  test('services: four, each with a request button that is disabled and sample, no number', () => {
    const a = pos(html, 'data-paid-section="services"')
    const part = html.slice(a, pos(html, 'data-hotel-section="experiences"'))
    for (const t of ['Late check-out', 'Airport transfer', 'Breakfast', 'In-room massage']) expect(part).toContain(t)
    expect((part.match(/Request on WhatsApp/g) ?? []).length).toBe(4)
    expect((part.match(/<button[^>]*disabled/g) ?? []).length).toBe(4)
    expect(part).not.toMatch(/href="https:\/\/wa\.me/)
    // services come after "Every week" and before the experiences
    expect(a).toBeGreaterThan(pos(html, 'data-hotel-section="rhythm"'))
  })

  test('share button is back, and it sends the property\'s own link, never the free zone link', () => {
    expect(html).toMatch(/href="https:\/\/wa\.me\/\?text=/)
    const own = paidShareHref({ code: null, ownUrl: CASA_LAGOM.shareUrl, lang: 'en', name: 'Casa Lagom' })!
    expect(decodeURIComponent(own)).toContain('https://www.lagomplan.com/guia/demo?lang=en&via=share')
    expect(own).not.toContain('guia%2Fcdmx')
    expect(html).toContain(own.replace(/&/g, '&amp;'))
    expect(html).not.toContain(hotelShareHref({ code: null, zone: 'condesa', lang: 'en' }).replace(/&/g, '&amp;'))
    // with the property's code (?h=) it is its short link with via=share
    expect(paidShareUrl({ code: 'abcd2345wx', ownUrl: CASA_LAGOM.shareUrl, lang: 'es' })).toBe('https://www.lagomplan.com/g/abcd2345wx?lang=es&via=share')
    // no code and no own address: no button rather than a free link
    expect(paidShareHref({ code: null, lang: 'en', name: 'X' })).toBeNull()
    expect(render({ ...CASA_LAGOM, shareUrl: undefined })).not.toMatch(/href="https:\/\/wa\.me\/\?text=/)
  })

  test('WhatsApp links: only a plausible number becomes a link; a real client number would light the buttons', () => {
    expect(whatsappHref(undefined)).toBeNull()
    expect(whatsappHref('12ab')).toBeNull()
    expect(whatsappHref('525500000000', 'Hi there')).toBe('https://wa.me/525500000000?text=Hi%20there')
    expect(contactHref(CASA_LAGOM)).toBeNull()
    expect(contactHref({ ...CASA_LAGOM, whatsapp: '525500000000' })).toBe('https://wa.me/525500000000')
    const live = render({ ...CASA_LAGOM, whatsapp: '525500000000' })
    expect(live).toContain('https://wa.me/525500000000?text=')
    expect(live).not.toMatch(/<button[^>]*disabled[^>]*>(Request on WhatsApp|Message the host)/)
  })

  test('dates are fixed text, same on server and browser', () => {
    expect(stayDates('2026-12-28', '2027-01-02', 'en')).toBe('28 December – 2 January')
    expect(stayDates('2026-12-12', '2026-12-15', 'es')).toBe('12–15 de diciembre')
    expect(stayDates('nope', '2026-12-15', 'en')).toBeNull()
  })

  test('coral stays off the brand layer except the service request buttons', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'app/guia/[partner]/paid.module.css'), 'utf8')
    const coralLines = css.split('\n').filter((l) => /coral/.test(l) && !l.trim().startsWith('/*'))
    expect(coralLines.every((l) => /requestBtn/.test(l) || /color: var\(--coral\); border: 1px solid var\(--coral\)/.test(l))).toBe(true)
  })
})
