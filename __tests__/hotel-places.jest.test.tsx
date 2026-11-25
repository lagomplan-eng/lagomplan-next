/**
 * @jest-environment node
 *
 * Stable place ids for the hotel guide + the events API that stores which place a tap belongs to and where in the guide.
 * Ids are pinned by fixtures/hotel-place-ids.json: renaming a place changes its id and fails this test on purpose.
 * Regenerate the list on purpose with: WRITE_BASELINE=1 npx jest __tests__/hotel-places
 */
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

const inserts: { table: string; row: Record<string, unknown> }[] = []
let hotelStatus: 'approved' | 'paused' = 'approved'
let insertError: { code: string } | null = null
let failOnceOnPlace = false
jest.mock('../lib/hotels/db', () => {
  const fake = () => ({
    from: (table: string) => ({
      select: () => ({ eq: () => ({ eq: (_c: string, status: string) => ({ maybeSingle: async () => ({ data: status === hotelStatus ? { id: 'hid-1' } : null, error: null }) }), maybeSingle: async () => ({ data: { id: 'hid-1', zone: 'condesa', status: hotelStatus }, error: null }) }) }),
      insert: async (row: Record<string, unknown>) => {
        if (failOnceOnPlace && ('place' in row || 'source' in row)) { failOnceOnPlace = false; return { error: { code: 'PGRST204' } } }
        inserts.push({ table, row })
        return { error: insertError }
      },
    }),
  })
  return { hotelsDb: fake, getHotelByCode: async () => null }
})

import { POST } from '../app/api/hotels/event/route'
import { GET as scanRoute } from '../app/g/[code]/route'
import { parseHotelEvent } from '../lib/hotels/events'
import { HOTEL_PLACES, KNOWN_PLACE_IDS } from '../content/guia/hotel/place-registry'
import { HOTEL_PLACE_SOURCES, PLACE_ID_PATTERN, SOURCE_PATTERN, moodSource, placeIdOf, slugPlace, zoneSource } from '../content/guia/hotel/places'
import { HOTEL_MOOD_ORDER } from '../content/guia/hotel/config'
import { ZONE_TAB_ORDER } from '../content/guia/hotel/zones'

const CODE = 'tjc9ckzteq'
const FIXTURE = path.join(__dirname, 'fixtures', 'hotel-place-ids.json')
const post = (body: unknown) => POST(new NextRequest('https://www.lagomplan.com/api/hotels/event', { method: 'POST', body: JSON.stringify(body), headers: { 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 250)}` } }))
const tap = (extra: Record<string, unknown> = {}) => ({ code: CODE, type: 'outbound_click', section: 'map', lang: 'en', ...extra })

beforeEach(() => { inserts.length = 0; hotelStatus = 'approved'; insertError = null; failOnceOnPlace = false })

describe('place ids', () => {
  const ids = HOTEL_PLACES.map((p) => p.id)

  if (process.env.WRITE_BASELINE) {
    test('ids written', () => { fs.writeFileSync(FIXTURE, JSON.stringify(HOTEL_PLACES.map((p) => ({ id: p.id, name: p.name })), null, 2) + '\n') })
  } else {
    test('the list of ids is pinned (a renamed place is a decision, not an accident)', () => {
      expect(HOTEL_PLACES.map((p) => ({ id: p.id, name: p.name }))).toEqual(JSON.parse(fs.readFileSync(FIXTURE, 'utf8')))
    })
  }

  test('every id is a valid slug, unique, and made from our own content', () => {
    expect(ids.length).toBeGreaterThanOrEqual(80)
    for (const id of ids) { expect(id).toMatch(PLACE_ID_PATTERN) }
    expect(new Set(ids).size).toBe(ids.length)
    expect(KNOWN_PLACE_IDS.has('maleza')).toBe(true)
    expect(KNOWN_PLACE_IDS.has('taqueria_orinoco')).toBe(true)
  })

  test('a place in two spots has ONE id; source tells the spots apart', () => {
    const pendulo = HOTEL_PLACES.find((p) => p.id === 'libreria_el_pendulo')!
    expect(pendulo.spots).toEqual(expect.arrayContaining(['mood:shop', 'zone:Roma Norte']))
    const ciudadela = HOTEL_PLACES.find((p) => p.id === 'mercado_de_artesanias_la_ciudadela')!
    expect(ciudadela.spots).toEqual(expect.arrayContaining(['mood:shop', 'zone:Centro']))
    // both spellings of a place that differs between languages give the same id
    expect(placeIdOf('Jardín Centenario and Plaza Hidalgo')).toBe(placeIdOf('Jardín Centenario y Plaza Hidalgo'))
    expect(slugPlace('Taquería Orinoco')).toBe('taqueria_orinoco')
  })

  test('every mood pick, zone tab card and short-plan stop has an id', () => {
    for (const id of ['maleza', 'baldio', 'plonk', 'pujol', 'museo_tamayo', 'contramar', 'parque_mexico', 'niddo', 'lindy', 'avenida_amsterdam', 'museo_de_arte_moderno', 'los_danzantes', 'kurimanzutto']) {
      expect(KNOWN_PLACE_IDS.has(id)).toBe(true)
    }
    const spots = new Set(HOTEL_PLACES.flatMap((p) => p.spots))
    for (const m of HOTEL_MOOD_ORDER) expect(spots.has(`mood:${m}`)).toBe(true)
    for (const z of new Set(Object.values(ZONE_TAB_ORDER).flat())) expect(spots.has(`zone:${z}`)).toBe(true)
    expect(spots.has('plan:quick')).toBe(true)
  })

  test('the fixed list of sources', () => {
    expect(HOTEL_PLACE_SOURCES).toEqual(expect.arrayContaining(['mood_hungry', 'mood_shop', 'zone_roma_norte', 'zone_san_miguel_chapultepec', 'plan_quick', 'plan_48h']))
    for (const s of HOTEL_PLACE_SOURCES) expect(s).toMatch(SOURCE_PATTERN)
    expect(moodSource('hungry')).toBe('mood_hungry')
    expect(zoneSource('Roma Norte')).toBe('zone_roma_norte')
  })
})

describe('parseHotelEvent with place and source', () => {
  test('a known place and source are kept; neither is required', () => {
    expect(parseHotelEvent(tap({ place: 'maleza', source: 'mood_hungry' }))).toEqual({ code: CODE, type: 'outbound_click', section: 'map', lang: 'en', place: 'maleza', source: 'mood_hungry' })
    expect(Object.keys(parseHotelEvent(tap())!).sort()).toEqual(['code', 'lang', 'section', 'type']) // as today
    expect(parseHotelEvent(tap({ source: 'plan_quick' }))?.source).toBe('plan_quick')
  })
  test('an unknown or malformed place or source refuses the whole event', () => {
    for (const bad of ['Maleza', 'nope', "maleza'; drop table x;--", '', 'x'.repeat(65)]) expect(parseHotelEvent(tap({ place: bad }))).toBeNull()
    for (const bad of [1, null, {}, ['maleza']]) expect(parseHotelEvent(tap({ place: bad }))).toBeNull()
    for (const bad of ['mood_unknown', 'free text', '']) expect(parseHotelEvent(tap({ place: 'maleza', source: bad }))).toBeNull()
  })
  test('only a tap on a link has a place; a section_open with one is refused; no other field is kept', () => {
    expect(parseHotelEvent({ code: CODE, type: 'section_open', section: 'time', lang: 'en', place: 'maleza' })).toBeNull()
    expect(Object.keys(parseHotelEvent(tap({ place: 'maleza', ip: '1.1.1.1', ua: 'x', id: 'abc' }))!).sort()).toEqual(['code', 'lang', 'place', 'section', 'type'])
  })
})

describe('POST /api/hotels/event', () => {
  test('a tap on Maleza\'s Map link in "I\'m hungry" is stored with place "maleza" and source "mood_hungry"', async () => {
    const res = await post(tap({ place: 'maleza', source: 'mood_hungry' }))
    expect(res.status).toBe(204)
    expect(inserts).toEqual([{ table: 'hotel_guide_events', row: { hotel_id: 'hid-1', event_type: 'outbound_click', section: 'map', lang: 'en', place: 'maleza', source: 'mood_hungry' } }])
  })
  test('the same place from another spot: same id, other source', async () => {
    await post(tap({ place: 'libreria_el_pendulo', source: 'mood_shop' }))
    await post(tap({ place: 'libreria_el_pendulo', source: 'zone_roma_norte' }))
    expect(inserts.map((i) => [i.row.place, i.row.source])).toEqual([['libreria_el_pendulo', 'mood_shop'], ['libreria_el_pendulo', 'zone_roma_norte']])
  })
  test('an unknown place id is rejected and nothing is stored', async () => {
    expect((await post(tap({ place: 'not_a_place', source: 'mood_hungry' }))).status).toBe(400)
    expect((await post(tap({ place: 'maleza', source: 'invented' }))).status).toBe(400)
    expect(inserts).toEqual([])
  })
  test('a link with no place still records exactly as today', async () => {
    expect((await post(tap({ section: 'airalo' }))).status).toBe(204)
    expect(inserts).toEqual([{ table: 'hotel_guide_events', row: { hotel_id: 'hid-1', event_type: 'outbound_click', section: 'airalo', lang: 'en' } }])
  })
  test('a paused hotel records nothing, with or without a place', async () => {
    hotelStatus = 'paused'
    expect((await post(tap({ place: 'maleza', source: 'mood_hungry' }))).status).toBe(204)
    expect((await post(tap())).status).toBe(204)
    expect(inserts).toEqual([])
  })
  test('via=share records no scan (the scan route), paused or approved', async () => {
    const hit = (q: string) => scanRoute(new NextRequest(`https://www.lagomplan.com/g/${CODE}${q}`, { headers: { 'user-agent': 'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36' } }), { params: Promise.resolve({ code: CODE }) })
    await hit('?lang=es&via=share')
    expect(inserts).toEqual([])
    hotelStatus = 'paused'
    await hit('?lang=es')
    expect(inserts).toEqual([])
  })
  test('code live before the migration: the click is still stored, without place and source', async () => {
    failOnceOnPlace = true
    expect((await post(tap({ place: 'maleza', source: 'mood_hungry' }))).status).toBe(204)
    expect(inserts).toEqual([{ table: 'hotel_guide_events', row: { hotel_id: 'hid-1', event_type: 'outbound_click', section: 'map', lang: 'en' } }])
  })
  test('nothing about the guest is stored: the row has only the allowed columns', async () => {
    await post(tap({ place: 'maleza', source: 'mood_hungry', ip: '9.9.9.9', ua: 'x', cookie: 'y', guest: 'z' }))
    expect(Object.keys(inserts[0].row).sort()).toEqual(['event_type', 'hotel_id', 'lang', 'place', 'section', 'source'])
  })
})
