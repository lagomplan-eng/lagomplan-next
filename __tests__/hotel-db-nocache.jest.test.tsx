/**
 * @jest-environment node
 *
 * Production incident: after a hotel was approved, /g/{code} kept redirecting without ?h= and no scan was written, because
 * Next.js answered the hotel lookup from its Data Cache (a GET fetch is cached for up to a year, across deployments).
 * Every hotel database request must therefore bypass that cache. This fails if any of them can be cached again.
 */
import fs from 'fs'
import path from 'path'
import { hotelsDb, noStoreFetch } from '../lib/hotels/db'

const root = process.cwd()
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8')
const walk = (dir: string): string[] => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(dir, e.name)] : [])

describe('hotel database requests are never cached', () => {
  const OLD = { ...process.env }
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:1'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service'
  })
  afterEach(() => { process.env = { ...OLD }; jest.restoreAllMocks() })

  test('the client sends cache: "no-store" on reads (the hotel status lookup) and on writes (the scan insert)', async () => {
    const calls: { url: string; method: string; cache: unknown }[] = []
    jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      calls.push({ url: String(input), method: String(init?.method ?? 'GET'), cache: init?.cache })
      return new Response(JSON.stringify({ id: 'h1', zone: 'condesa', status: 'approved' }), { status: 200, headers: { 'content-type': 'application/json' } })
    })
    const db = hotelsDb()
    await db.from('hotel_partners').select('id, zone, status').eq('code', 'mnqn9bc7sy').maybeSingle()
    await db.from('hotel_guide_events').insert({ hotel_id: 'h1', event_type: 'scan', lang: 'en' })
    await db.from('hotel_partners').select('id', { count: 'exact', head: true })
    expect(calls.length).toBeGreaterThanOrEqual(3)
    expect(calls.map((c) => c.method)).toEqual(expect.arrayContaining(['GET', 'POST', 'HEAD']))
    for (const c of calls) expect({ url: c.url, cache: c.cache }).toEqual({ url: c.url, cache: 'no-store' })
  })

  test('noStoreFetch keeps the caller\'s options and adds no-store', async () => {
    const spy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'))
    await noStoreFetch('http://127.0.0.1:1/x', { method: 'POST', headers: { a: 'b' } })
    expect(spy).toHaveBeenCalledWith('http://127.0.0.1:1/x', { method: 'POST', headers: { a: 'b' }, cache: 'no-store' })
  })

  test('no hotel code talks to the database any other way (the shared admin client is cacheable)', () => {
    const files = [...walk('app/g'), ...walk('app/api/hotels'), ...walk('app/api/admin/hotels'), ...walk('app/admin/hoteles'), ...walk('lib/hotels')]
    expect(files.length).toBeGreaterThan(8)
    for (const f of files) expect({ f, usesSharedAdminClient: /getSupabaseAdmin/.test(read(f)) }).toEqual({ f, usesSharedAdminClient: false })
  })

  test('every hotel route and page that reads the hotel tables also opts out of the Data Cache', () => {
    for (const f of [
      'app/g/[code]/route.ts', 'app/g/[code]/tarjeta/page.tsx', 'app/api/hotels/event/route.ts', 'app/api/hotels/signup/route.ts',
      'app/api/admin/hotels/export/route.ts', 'app/api/admin/hotels/[id]/action/route.ts', 'app/admin/hoteles/page.tsx', 'app/admin/hoteles/[id]/page.tsx',
    ]) {
      const src = read(f)
      expect({ f, dynamic: /export const dynamic = 'force-dynamic'/.test(src), noStore: /export const fetchCache = 'force-no-store'/.test(src) }).toEqual({ f, dynamic: true, noStore: true })
    }
  })
})
