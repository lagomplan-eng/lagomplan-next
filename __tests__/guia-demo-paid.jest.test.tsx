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
    expect(html).not.toMatch(/wa\.me|tel:/)
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
})
