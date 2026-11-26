/**
 * @jest-environment node
 *
 * Which mood, zone tab or plan a guest opened: the events API. Stored as section_open with
 * section = mood | zone | plan and source = the id from a fixed list. Existing columns only (no migration).
 */
import { NextRequest } from 'next/server'

const inserts: { table: string; row: Record<string, unknown> }[] = []
let hotelStatus: 'approved' | 'paused' = 'approved'
jest.mock('../lib/hotels/db', () => {
  const fake = () => ({
    from: (table: string) => ({
      select: () => ({ eq: () => ({ eq: (_c: string, status: string) => ({ maybeSingle: async () => ({ data: status === hotelStatus ? { id: 'hid-1' } : null, error: null }) }), maybeSingle: async () => ({ data: { id: 'hid-1', zone: 'condesa', status: hotelStatus }, error: null }) }) }),
      insert: async (row: Record<string, unknown>) => { inserts.push({ table, row }); return { error: null } },
    }),
  })
  return { hotelsDb: fake, getHotelByCode: async () => null }
})

import { POST } from '../app/api/hotels/event/route'
import { parseHotelEvent } from '../lib/hotels/events'
import { HOTEL_OPEN_SOURCES, OPEN_KINDS } from '../content/guia/hotel/places'

const CODE = 'tjc9ckzteq'
const CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
let n = 0
const post = (body: unknown, ua: string | null = CHROME) =>
  POST(new NextRequest('https://www.lagomplan.com/api/hotels/event', { method: 'POST', body: JSON.stringify(body), headers: { 'x-forwarded-for': `10.1.${Math.floor(n / 250)}.${n++ % 250}`, ...(ua ? { 'user-agent': ua } : {}) } }))
const open = (section: string, source: unknown, extra: Record<string, unknown> = {}) => ({ code: CODE, type: 'section_open', section, source, lang: 'en', ...extra })

beforeEach(() => { inserts.length = 0; hotelStatus = 'approved' })

describe('the fixed lists', () => {
  test('moods, zones and plans, with the same ids as the place clicks', () => {
    expect(OPEN_KINDS).toEqual(['mood', 'zone', 'plan'])
    expect(HOTEL_OPEN_SOURCES.mood).toEqual(['mood_dinner', 'mood_shop', 'mood_culture', 'mood_hidden', 'mood_hungry', 'mood_nightlife'])
    expect(HOTEL_OPEN_SOURCES.zone).toEqual(expect.arrayContaining(['zone_condesa', 'zone_roma_norte', 'zone_polanco', 'zone_centro', 'zone_coyoacan', 'zone_san_miguel_chapultepec']))
    expect(HOTEL_OPEN_SOURCES.plan).toEqual(['plan_quick', 'plan_48h'])
  })
  test('every id fits the existing columns (section: letters and underscores; source: letters, digits, underscores, up to 32)', () => {
    for (const k of OPEN_KINDS) expect(k).toMatch(/^[a-z_]{1,32}$/)
    for (const s of Object.values(HOTEL_OPEN_SOURCES).flat()) expect(s).toMatch(/^[a-z0-9_]{1,32}$/)
  })
})

describe('parseHotelEvent: opens', () => {
  test('a known id of the right kind is kept', () => {
    expect(parseHotelEvent(open('mood', 'mood_hungry'))).toEqual({ code: CODE, type: 'section_open', section: 'mood', lang: 'en', source: 'mood_hungry' })
    expect(parseHotelEvent(open('zone', 'zone_roma_norte'))?.source).toBe('zone_roma_norte')
    expect(parseHotelEvent(open('plan', 'plan_48h'))?.source).toBe('plan_48h')
  })
  test('an id of the wrong kind, an unknown one, none, or a place is refused', () => {
    for (const b of [open('mood', 'zone_condesa'), open('zone', 'mood_hungry'), open('plan', 'plan_72h'), open('mood', 'free text'), open('mood', undefined), open('mood', 1), open('mood', 'mood_hungry', { place: 'maleza' })]) expect(parseHotelEvent(b)).toBeNull()
  })
  test('an open is only a section_open: as an outbound_click, mood is not an outbound id', () => {
    expect(parseHotelEvent({ code: CODE, type: 'outbound_click', section: 'mood', source: 'mood_hungry', lang: 'en' })).toBeNull()
  })
  test('the page sections still work as before, with no source', () => {
    expect(parseHotelEvent({ code: CODE, type: 'section_open', section: 'time', lang: 'en' })?.section).toBe('time')
    expect(parseHotelEvent({ code: CODE, type: 'section_open', section: 'time', lang: 'en', source: 'mood_hungry' })).toBeNull()
  })
})

describe('POST /api/hotels/event: opens', () => {
  test('example rows: a mood, a zone and a plan', async () => {
    for (const [section, source] of [['mood', 'mood_hungry'], ['zone', 'zone_roma_norte'], ['plan', 'plan_48h']]) expect((await post(open(section, source))).status).toBe(204)
    expect(inserts.map((i) => i.row)).toEqual([
      { hotel_id: 'hid-1', event_type: 'section_open', section: 'mood', lang: 'en', source: 'mood_hungry' },
      { hotel_id: 'hid-1', event_type: 'section_open', section: 'zone', lang: 'en', source: 'zone_roma_norte' },
      { hotel_id: 'hid-1', event_type: 'section_open', section: 'plan', lang: 'en', source: 'plan_48h' },
    ])
    expect(inserts.every((i) => i.table === 'hotel_guide_events')).toBe(true)
  })
  test('an unknown id is refused and nothing is stored', async () => {
    expect((await post(open('mood', 'mood_invented'))).status).toBe(400)
    expect(inserts).toEqual([])
  })
  test('a paused (or unknown) hotel records nothing', async () => {
    hotelStatus = 'paused'
    expect((await post(open('mood', 'mood_hungry'))).status).toBe(204)
    expect(inserts).toEqual([])
  })
  test('bots, monitors and requests with no user agent record no opens', async () => {
    for (const ua of ['Googlebot/2.1', 'Mozilla/5.0 HeadlessChrome/131', 'WhatsApp/2.24.1 A', 'curl/8.4.0', null]) expect((await post(open('mood', 'mood_hungry'), ua)).status).toBe(204)
    expect(inserts).toEqual([])
  })
  test('nothing about the guest is stored', async () => {
    await post(open('mood', 'mood_hungry', { ip: '9.9.9.9', ua: 'x', cookie: 'y' }))
    expect(Object.keys(inserts[0].row).sort()).toEqual(['event_type', 'hotel_id', 'lang', 'section', 'source'])
  })
})
