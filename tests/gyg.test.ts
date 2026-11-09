/**
 * tests/gyg.test.ts
 *
 * Unit tests for lib/affiliate/gyg.ts — isGygTourUrl, normalizeGygTourUrl,
 * buildGygBookingUrl — plus a guard that the partner ID is defined in exactly
 * one source file.
 *
 *   npx tsx tests/gyg.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import fs from 'fs'
import path from 'path'
import { GYG_PARTNER_ID, isGygTourUrl, normalizeGygTourUrl, buildGygBookingUrl } from '../lib/affiliate/gyg'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectTrue(name: string, got: boolean, detail?: string) {
  results.push({ name, pass: got, detail: got ? undefined : (detail ?? 'expected true') })
}
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}

const TOUR = 'https://www.getyourguide.com/mexico-city-l194/casa-luis-barragan-t12345/'

// ── isGygTourUrl ────────────────────────────────────────────────────────────────

expectTrue('tour URL', isGygTourUrl(TOUR))
expectTrue('tour URL without trailing slash', isGygTourUrl('https://www.getyourguide.com/rome-l33/vatican-t999'))
expectTrue('tour URL with query params', isGygTourUrl(`${TOUR}?ranking_uuid=abc&adults=2`))
expectTrue('tour URL with es-mx locale prefix', isGygTourUrl('https://www.getyourguide.com/es-mx/rome-l33/vatican-t999/'))
expectTrue('tour URL with en-gb locale prefix', isGygTourUrl('https://www.getyourguide.com/en-gb/rome-l33/vatican-t999/'))
expectTrue('tour URL with es-es locale prefix', isGygTourUrl('https://www.getyourguide.com/es-es/rome-l33/vatican-t999/'))
expectTrue('tour URL with bare two-letter prefix', isGygTourUrl('https://www.getyourguide.com/de/rome-l33/vatican-t999/'))
expectTrue('http scheme is accepted (normalized to https later)', isGygTourUrl('http://www.getyourguide.com/rome-l33/vatican-t999/'))

expectTrue('search page is not a tour', !isGygTourUrl('https://www.getyourguide.com/s/?q=Torres%20del%20Paine'))
expectTrue('localized search page is not a tour', !isGygTourUrl('https://www.getyourguide.com/es-mx/s/'))
expectTrue('location page (-l) is not a tour', !isGygTourUrl('https://www.getyourguide.com/hong-kong-l174/'))
expectTrue('supplier page (-s) is not a tour', !isGygTourUrl('https://www.getyourguide.com/azores-whale-watching-terra-azul-s9545/'))
expectTrue('category page (-tc) is not a tour', !isGygTourUrl('https://www.getyourguide.com/oaxaca-l779/talleres-de-alebrijes-tc2440/'))
expectTrue('stay22 redirector is not a tour', !isGygTourUrl('https://getyourguide.stay22.com/lagomplan/YC8OoqqWnR'))
expectTrue('a tour-looking path on another host is not a tour', !isGygTourUrl('https://example.com/rome-l33/vatican-t999/'))
expectTrue('bare getyourguide.com (no www) is not accepted', !isGygTourUrl('https://getyourguide.com/rome-l33/vatican-t999/'))
expectTrue('OpenTable is not a tour', !isGygTourUrl('https://www.opentable.com/'))
expectTrue('empty string', !isGygTourUrl(''))
expectTrue('undefined', !isGygTourUrl(undefined))
expectTrue('null', !isGygTourUrl(null))
expectTrue('garbage', !isGygTourUrl('not a url'))
expectTrue('t<number> inside the path but not at its end is not a tour', !isGygTourUrl('https://www.getyourguide.com/rome-l33/vatican-t999/extra/'))

// ── normalizeGygTourUrl ─────────────────────────────────────────────────────────

expectEq('normalize: strips params', normalizeGygTourUrl(`${TOUR}?ranking_uuid=abc`), TOUR)
expectEq('normalize: strips es-mx prefix', normalizeGygTourUrl('https://www.getyourguide.com/es-mx/mexico-city-l194/casa-luis-barragan-t12345/'), TOUR)
expectEq('normalize: strips en-gb prefix and params together', normalizeGygTourUrl('https://www.getyourguide.com/en-gb/mexico-city-l194/casa-luis-barragan-t12345/?partner_id=OLD'), TOUR)
expectEq('normalize: upgrades http to https', normalizeGygTourUrl('http://www.getyourguide.com/mexico-city-l194/casa-luis-barragan-t12345/'), TOUR)
expectEq('normalize: strips fragment', normalizeGygTourUrl(`${TOUR}#reviews`), TOUR)
expectEq('normalize: idempotent', normalizeGygTourUrl(normalizeGygTourUrl(TOUR)!), TOUR)
expectEq('normalize: non-tour → null', normalizeGygTourUrl('https://www.getyourguide.com/hong-kong-l174/'), null)
expectEq('normalize: non-GYG → null', normalizeGygTourUrl('https://www.opentable.com/'), null)

// ── buildGygBookingUrl ──────────────────────────────────────────────────────────

const built = buildGygBookingUrl(TOUR, { cmp: 'guia-ciudad-de-mexico' })
const builtUrl = new URL(built)
expectEq('build: exact output', built, `${TOUR}?partner_id=${GYG_PARTNER_ID}&cmp=guia-ciudad-de-mexico`)
expectEq('build: partner_id present', builtUrl.searchParams.get('partner_id'), GYG_PARTNER_ID)
expectEq('build: cmp present', builtUrl.searchParams.get('cmp'), 'guia-ciudad-de-mexico')
expectEq('build: no other params', [...builtUrl.searchParams.keys()].sort(), ['cmp', 'partner_id'])

const dirty = buildGygBookingUrl(`${TOUR}?ranking_uuid=abc&adults=2&utm_source=x`, { cmp: 'experiencias-roma' })
expectEq('build: existing params are stripped', [...new URL(dirty).searchParams.keys()].sort(), ['cmp', 'partner_id'])
expectEq('build: ranking_uuid is gone', new URL(dirty).searchParams.get('ranking_uuid'), null)

const withOtherPartner = buildGygBookingUrl(`${TOUR}?partner_id=SOMEONE_ELSE&cmp=old`, { cmp: 'experiencias-roma' })
expectEq('build: a foreign partner_id is replaced, never kept', new URL(withOtherPartner).searchParams.getAll('partner_id'), [GYG_PARTNER_ID])
expectEq('build: an old cmp is replaced, never duplicated', new URL(withOtherPartner).searchParams.getAll('cmp'), ['experiencias-roma'])

const twice = buildGygBookingUrl(built, { cmp: 'guia-ciudad-de-mexico' })
expectEq('build: idempotent (partner_id never duplicated)', twice, built)
expectEq('build: partner_id appears exactly once in the string', (twice.match(/partner_id=/g) ?? []).length, 1)

expectEq('build: locale prefix is stripped', buildGygBookingUrl('https://www.getyourguide.com/es-mx/mexico-city-l194/casa-luis-barragan-t12345/', { cmp: 'x' }),
  `${TOUR}?partner_id=${GYG_PARTNER_ID}&cmp=x`)
expectEq('build: cmp is URL-encoded', new URL(buildGygBookingUrl(TOUR, { cmp: 'a b&c' })).searchParams.get('cmp'), 'a b&c')
expectEq('build: unparseable input is returned unchanged', buildGygBookingUrl('not a url', { cmp: 'x' }), 'not a url')

// ── the partner ID is defined in exactly one source file ─────────────────────────

const ROOT = path.resolve(__dirname, '..')
function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(e.name)) out.push(p)
  }
  return out
}
const holders = ['app', 'components', 'lib', 'scripts', 'content', 'hooks', 'middleware.ts']
  .map(d => path.join(ROOT, d))
  .filter(p => fs.existsSync(p))
  .flatMap(p => (fs.statSync(p).isDirectory() ? walk(p) : [p]))
  .filter(f => fs.readFileSync(f, 'utf8').includes(GYG_PARTNER_ID))
  .map(f => path.relative(ROOT, f))
expectEq('GYG partner ID literal appears in exactly one source file', holders, ['lib/affiliate/gyg.ts'])

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\ngyg: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
