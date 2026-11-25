/**
 * @jest-environment node
 *
 * /g/casa-cuenca must behave exactly like /g/tjc9ckzteq: same hotel, same guide, same scan, same card; the QR and the share
 * link keep the random code. An unknown alias still goes to the home page. (Database faked; the route and the card page are real.)
 */
import { NextRequest } from 'next/server'
import { renderToStaticMarkup } from 'react-dom/server'
import QRCode from 'qrcode'

const lookups: string[] = []
const inserts: Record<string, unknown>[] = []
jest.mock('../lib/hotels/db', () => {
  const approved = { id: 'hid-1', zone: 'condesa', status: 'approved' }
  const fake = () => ({
    from: (table: string) => ({
      select: () => ({ eq: (_col: string, code: string) => ({ maybeSingle: async () => { lookups.push(code); return { data: code === 'tjc9ckzteq' ? approved : null, error: null } } }) }),
      insert: async (row: Record<string, unknown>) => { if (table === 'hotel_guide_events') inserts.push(row); return { error: null } },
    }),
  })
  return { hotelsDb: fake, getHotelByCode: async (code: string) => (code === 'tjc9ckzteq' ? { ...approved, code } : null) }
})

import { GET } from '../app/g/[code]/route'
import HotelCardPage from '../app/g/[code]/tarjeta/page'
import { HOTEL_ALIASES, resolveHotelCode } from '../lib/hotels/aliases'
import { isValidHotelCode } from '../lib/hotels/codes'
import { hotelShareUrl } from '../content/guia/hotel/share'
import { hotelQrUrl } from '../lib/hotels/links'

const CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const visit = (pathAndQuery: string, ua = CHROME) =>
  GET(new NextRequest(`https://www.lagomplan.com${pathAndQuery}`, { headers: { 'user-agent': ua, 'accept-language': 'en-US,en;q=0.9' } }), { params: Promise.resolve({ code: pathAndQuery.split('?')[0].split('/')[2] }) })
const where = (res: Response) => { const l = new URL(res.headers.get('location')!); return l.pathname + l.search }

beforeEach(() => { lookups.length = 0; inserts.length = 0 })

describe('hotel alias: /g/casa-cuenca', () => {
  test('the alias list: alias -> random code, one small list', () => {
    expect(HOTEL_ALIASES).toEqual({ 'casa-cuenca': 'tjc9ckzteq' })
    for (const [alias, code] of Object.entries(HOTEL_ALIASES)) {
      expect(alias).toMatch(/^[a-z0-9-]+$/)
      expect(isValidHotelCode(alias)).toBe(false) // an alias can never be mistaken for, or shadow, a random code
      expect(isValidHotelCode(code)).toBe(true)
      expect(['tarjeta', 'admin', 'api']).not.toContain(alias)
    }
    expect(resolveHotelCode('casa-cuenca')).toBe('tjc9ckzteq')
    expect(resolveHotelCode('Casa-Cuenca')).toBe('tjc9ckzteq')
    expect(resolveHotelCode('tjc9ckzteq')).toBe('tjc9ckzteq') // a random code is returned as it came
    expect(resolveHotelCode('casa-nada')).toBe('casa-nada')
    expect(resolveHotelCode('constructor')).toBe('constructor') // nothing inherited from Object
  })

  test('the alias resolves to the right code and records a scan for that hotel, exactly like the code', async () => {
    const viaAlias = await visit('/g/casa-cuenca')
    const viaCode = await visit('/g/tjc9ckzteq')
    expect(viaAlias.status).toBe(307)
    expect(where(viaAlias)).toBe('/guia/cdmx/condesa?h=tjc9ckzteq&lang=en') // the guide carries the random code, not the alias
    expect(where(viaAlias)).toBe(where(viaCode))
    expect(lookups).toEqual(['tjc9ckzteq', 'tjc9ckzteq'])
    expect(inserts).toEqual([{ hotel_id: 'hid-1', event_type: 'scan', lang: 'en' }, { hotel_id: 'hid-1', event_type: 'scan', lang: 'en' }])
    expect(viaAlias.headers.get('cache-control')).toBe('no-store')
  })

  test('query parameters work as with the code: ?lang=es picks Spanish, ?via=share records no scan', async () => {
    const es = await visit('/g/casa-cuenca?lang=es')
    expect(where(es)).toBe('/guia/cdmx/condesa?h=tjc9ckzteq&lang=es')
    expect(inserts).toEqual([{ hotel_id: 'hid-1', event_type: 'scan', lang: 'es' }])
    inserts.length = 0
    const shared = await visit('/g/casa-cuenca?lang=es&via=share')
    expect(where(shared)).toBe('/guia/cdmx/condesa?h=tjc9ckzteq&lang=es')
    expect(inserts).toEqual([])
    const sharedCode = await visit('/g/tjc9ckzteq?lang=es&via=share')
    expect(where(sharedCode)).toBe(where(shared))
    expect(inserts).toEqual([])
  })

  test('bots, link previews and HEAD are filtered through the alias too', async () => {
    await visit('/g/casa-cuenca', 'WhatsApp/2.24.1 A')
    await visit('/g/casa-cuenca', 'facebookexternalhit/1.1')
    expect(inserts).toEqual([])
  })

  test('an unknown alias still goes to the home page, with no scan', async () => {
    const res = await visit('/g/casa-nada')
    expect(res.status).toBe(307)
    expect(where(res)).toBe('/')
    expect(lookups).toEqual([]) // not even a database lookup: it is not a valid code
    expect(inserts).toEqual([])
    const unknownCode = await visit('/g/zzzzzzzzzz')
    expect(where(unknownCode)).toBe('/')
  })

  test('the card at /g/casa-cuenca/tarjeta is the card of the code, and its QR keeps the random code', async () => {
    const render = async (code: string) => renderToStaticMarkup(await HotelCardPage({ params: Promise.resolve({ code }) }))
    const viaAlias = await render('casa-cuenca')
    const viaCode = await render('tjc9ckzteq')
    expect(viaAlias).toBe(viaCode)
    expect(viaAlias).toContain('Tu guía de Condesa')
    expect(viaAlias).not.toContain('casa-cuenca')
    const qrPath = (svg: string) => [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]).sort((a, b) => b.length - a.length)[0]
    const expected = qrPath(await QRCode.toString(hotelQrUrl('tjc9ckzteq'), { type: 'svg', margin: 0, errorCorrectionLevel: 'M' }))
    const readable = qrPath(await QRCode.toString('https://www.lagomplan.com/g/casa-cuenca', { type: 'svg', margin: 0, errorCorrectionLevel: 'M' }))
    expect(viaAlias).toContain(expected)
    expect(viaAlias).not.toContain(readable)
  })

  test('"Send this guide to my phone" keeps the random code', () => {
    // the guide a visitor lands on carries ?h=<random code> (see the redirect above); the share link is built from it
    const link = hotelShareUrl({ code: 'tjc9ckzteq', zone: 'condesa', lang: 'es' })
    expect(link).toBe('https://www.lagomplan.com/g/tjc9ckzteq?lang=es&via=share')
    expect(link).not.toContain('casa-cuenca')
  })
})
