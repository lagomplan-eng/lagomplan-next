/**
 * tests/hotel-middleware.test.ts — the QR link is printed on paper: /g/{code} and /g/{code}/tarjeta must reach their
 * route untouched on www.lagomplan.com. They must NOT get the locale redirect/rewrite (/es/g/{code} 404s), which is what
 * main does today because it has no /g bypass. Run: npx tsx tests/hotel-middleware.test.ts
 */
import { NextRequest } from 'next/server'
import middleware from '../middleware'

let failed = 0
const eq = (n: string, g: unknown, w: unknown) => { if (JSON.stringify(g) !== JSON.stringify(w)) { failed++; console.error(`FAIL ${n}: got ${JSON.stringify(g)}, want ${JSON.stringify(w)}`) } }

const run = (path: string, headers: Record<string, string> = {}) =>
  middleware(new NextRequest(`https://www.lagomplan.com${path}`, { headers })) as Response

for (const path of ['/g/mnqn9bc7sy', '/g/mnqn9bc7sy/tarjeta', '/g/mnqn9bc7sy/tarjeta/', '/admin/hoteles', '/guia/cdmx/roma-norte?h=mnqn9bc7sy&lang=es']) {
  for (const al of ['es-MX,es;q=0.9', 'en-US,en;q=0.9']) {
    const res = run(path, { 'accept-language': al })
    // NextResponse.next() = pass through: no redirect status, no location, no rewrite to another path.
    eq(`${path} (${al}) is not redirected`, [res.status, res.headers.get('location')], [200, null])
    eq(`${path} (${al}) is passed through`, res.headers.get('x-middleware-next'), '1')
    eq(`${path} (${al}) is not rewritten`, res.headers.get('x-middleware-rewrite'), null)
  }
}

// control: a normal marketing path IS handled by the locale middleware (redirected or rewritten under /es|/en)
const ctrl = run('/precios', { 'accept-language': 'es-MX' })
eq('control: /precios is locale-handled', ctrl.headers.get('x-middleware-next') === '1' && !ctrl.headers.get('location') && !ctrl.headers.get('x-middleware-rewrite'), false)

// signup page is NOT bypassed (it needs the locale layout: nav, footer, cookie banner)
eq('/para-hoteles redirects to /es/para-hoteles', [run('/para-hoteles').status, new URL(run('/para-hoteles').headers.get('location') ?? 'x:/').pathname], [301, '/es/para-hoteles'])

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('hotel-middleware: all passed')
