/**
 * @jest-environment node
 *
 * __tests__/guia-unchanged.jest.test.tsx — the hotel edition must not change how the Livin guides or the
 * `demo` partner render. The server HTML of each is hashed and compared with the hash taken on `main`
 * before the hotel edition existed (fixtures/guia-unchanged.json). If a content change here is intentional,
 * regenerate with: WRITE_BASELINE=1 npx jest __tests__/guia-unchanged
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import GuiaClient from '../app/guia/[partner]/GuiaClient'
import { getGuide } from '../content/guia'

const FIXTURE = path.join(__dirname, 'fixtures', 'guia-unchanged.json')
const SLUGS = ['livin_condesa', 'livin_roma', 'livin_polanco', 'demo']

function htmlHash(slug: string): string {
  const g = getGuide(slug)!
  const html = renderToStaticMarkup(<GuiaClient partner={g.partner} city={g.city} />)
  return createHash('sha256').update(html).digest('hex')
}

describe('Livin guides and demo render unchanged', () => {
  const current: Record<string, string> = Object.fromEntries(SLUGS.map((s) => [s, htmlHash(s)]))

  if (process.env.WRITE_BASELINE) {
    test('baseline written', () => {
      fs.writeFileSync(FIXTURE, JSON.stringify(current, null, 2) + '\n')
    })
  } else {
    const baseline = JSON.parse(fs.readFileSync(FIXTURE, 'utf8')) as Record<string, string>
    test.each(SLUGS)('%s HTML is byte-identical to main', (slug) => {
      expect(current[slug]).toBe(baseline[slug])
    })
  }
})
