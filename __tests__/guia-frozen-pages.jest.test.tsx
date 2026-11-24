/**
 * @jest-environment node
 *
 * __tests__/guia-frozen-pages.jest.test.tsx — pages that the paid hotel edition must never change: the free hotel
 * guide (three zones) and the two Host Me Tender demos. The server HTML of each is hashed and compared with the
 * hash taken on main BEFORE the paid work started (fixtures/guia-frozen-pages.json). The Livin guides are
 * covered by guia-unchanged.jest.test.tsx.
 * If a change to one of these pages is intentional, regenerate with: WRITE_BASELINE=1 npx jest __tests__/guia-frozen-pages
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { getCity } from '../content/guia'
import { buildDemoPartner, getDemoProspect } from '../content/guia/demos'
import { buildHotelGuideProps } from '../content/guia/hotel/resolve'
import { HOTEL_ZONES } from '../content/guia/hotel/zones'

const FIXTURE = path.join(__dirname, 'fixtures', 'guia-frozen-pages.json')
const sha = (html: string) => createHash('sha256').update(html).digest('hex')

const DEMOS = ['host-me-tender', 'host-me-tender-alejandro']

const current: Record<string, string> = {}
for (const z of HOTEL_ZONES) current[`hotel_free_${z}`] = sha(renderToStaticMarkup(<GuiaClient {...buildHotelGuideProps(z)!} />))
for (const slug of DEMOS) {
  const prospect = getDemoProspect(slug)!
  current[`demo_${slug}`] = sha(renderToStaticMarkup(
    <GuiaClient partner={buildDemoPartner(prospect)} city={getCity('cdmx')!} demo={{ slug, prospectName: prospect.partner.name }} />,
  ))
}

describe('free hotel guide and Host Me Tender demos render unchanged', () => {
  if (process.env.WRITE_BASELINE) {
    test('baseline written', () => {
      fs.writeFileSync(FIXTURE, JSON.stringify(current, null, 2) + '\n')
    })
  } else {
    const baseline = JSON.parse(fs.readFileSync(FIXTURE, 'utf8')) as Record<string, string>
    test.each(Object.keys(current))('%s HTML is byte-identical to main', (key) => {
      expect(current[key]).toBe(baseline[key])
    })
  }
})
