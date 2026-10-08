#!/usr/bin/env node
/**
 * tests/seo-validate.mjs
 *
 * End-to-end SEO check against a RUNNING production build. Reads the rendered
 * HTML and verifies, for a sample of pages plus the whole sitemap:
 *   1. exactly one <link rel="canonical">, equal to the page's own URL
 *      (https://www.lagomplan.com + path), never the home page (except home);
 *   2. hreflang es/en point to pages that return 200, are reciprocal, and are
 *      the same content in the other language (html lang differs);
 *   3. x-default = the Spanish version;
 *   4. og:url = canonical;
 *   5. wrong-locale / alias slugs 301 to the real one (roma→rome, ...);
 *   6. private routes (trips/share, demos) are noindex with no canonical to home;
 *   7. /guia/[partner] robots stay per-partner (unchanged);
 *   8. every sitemap <loc> is 200, self-canonical, unique, with full alternates.
 *
 * Run (see docs/seo-validation.md):
 *   npx next build && npx next start -p 3200 &
 *   node tests/seo-validate.mjs http://localhost:3200 [--share=/es/trips/share/<realShareId>]
 *
 * Exit 0 when nothing failed; routes absent on the current branch report n/a.
 */
const args = process.argv.slice(2)
const BASE = args.find((a) => !a.startsWith('--')) || 'http://localhost:3200'
const SHARE = (args.find((a) => a.startsWith('--share=')) || '').slice(8)
const PROD = 'https://www.lagomplan.com'

async function get(path, opts = {}) {
  const res = await fetch(BASE + path, { redirect: 'manual', ...opts })
  const body = res.status === 200 ? await res.text() : ''
  return { status: res.status, loc: res.headers.get('location'), body }
}
const tags = (html, re) => [...html.matchAll(re)].map((m) => m[0])
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1]

function parse(html) {
  const canon = tags(html, /<link[^>]+rel="canonical"[^>]*>/g).map((t) => attr(t, 'href'))
  const alts = {}
  for (const t of tags(html, /<link[^>]+rel="alternate"[^>]*hrefLang="[^"]*"[^>]*>|<link[^>]+hrefLang="[^"]*"[^>]*rel="alternate"[^>]*>/gi)) {
    alts[attr(t, 'hrefLang') || attr(t, 'hreflang')] = attr(t, 'href')
  }
  const og = tags(html, /<meta[^>]+property="og:url"[^>]*>/g).map((t) => attr(t, 'content'))
  const robots = tags(html, /<meta[^>]+name="robots"[^>]*>/g).map((t) => attr(t, 'content'))
  const lang = (html.match(/<html[^>]*lang="([^"]*)"/) || [])[1]
  return { canon, alts, og, robots, lang }
}
const toLocal = (u) => (u && u.startsWith(PROD) ? u.slice(PROD.length) || '/' : u)

const rows = []
function row(name, ok, detail) { rows.push({ name, ok, detail }) }

// ---------- indexable pages: self-canonical + reciprocal hreflang ----------
async function checkIndexable(path, { expectRedirect } = {}) {
  const r = await get(path)
  if (expectRedirect) {
    const ok = r.status === 301 && toLocal(r.loc?.replace(BASE, '')) === expectRedirect
    return rows.push({ name: path, ok, detail: `expect 301 → ${expectRedirect}; got ${r.status} → ${r.loc}`, kind: 'redirect' })
  }
  if (r.status !== 200) return rows.push({ name: path, ok: false, detail: `HTTP ${r.status}` })
  const p = parse(r.body)
  const self = PROD + path
  const errs = []
  if (p.canon.length !== 1) errs.push(`canonical count=${p.canon.length}`)
  if (p.canon[0] !== self) errs.push(`canonical=${p.canon[0]} (expected ${self})`)
  if (p.og.length !== 1 || p.og[0] !== p.canon[0]) errs.push(`og:url=${JSON.stringify(p.og)} != canonical`)
  if (p.alts['x-default'] !== p.alts.es) errs.push(`x-default=${p.alts['x-default']} != es=${p.alts.es}`)
  if (p.alts.es !== self && p.alts.en !== self) errs.push('neither hreflang equals self')
  if (p.robots.some((x) => /noindex/.test(x))) errs.push(`robots=${p.robots}`)
  // hreflang targets exist, and are the same page in the other language
  for (const l of ['es', 'en']) {
    const t = p.alts[l]
    if (!t) { errs.push(`no hreflang ${l}`); continue }
    const rr = await get(toLocal(t))
    if (rr.status !== 200) { errs.push(`hreflang ${l} → HTTP ${rr.status}`); continue }
    const q = parse(rr.body)
    if (q.canon[0] !== t) errs.push(`hreflang ${l} target canonical=${q.canon[0]}`)
    if (q.alts.es !== p.alts.es || q.alts.en !== p.alts.en) errs.push(`hreflang ${l} target not reciprocal`)
    if (q.lang !== l) errs.push(`hreflang ${l} target html lang=${q.lang}`)
  }
  rows.push({ name: path, ok: errs.length === 0, detail: errs.join('; ') || `canon ✓ es=${toLocal(p.alts.es)} en=${toLocal(p.alts.en)} x-default=es og ✓`, kind: 'page' })
}


async function checkRobots(path, re, label) {
  const r = await get(path)
  if (r.status !== 200) return rows.push({ name: path, ok: false, detail: `HTTP ${r.status}`, kind: 'robots' })
  const p = parse(r.body)
  const robots = p.robots.join(',')
  // "noindex, follow" also contains "index, follow", so index-expecting rows must exclude noindex explicitly.
  const ok = /^(no)?index/.test(robots) && re.test(robots) && (label.startsWith('noindex') || !/noindex/.test(robots))
  rows.push({ name: path, ok, detail: ok ? `robots="${robots}" — ${label}` : `robots="${robots}", expected ${label}`, kind: 'robots' })
}

// ---------- noindex pages: robots noindex, no canonical to home ----------
async function checkNoindex(path, { follow } = {}) {
  const r = await get(path)
  if (r.status !== 200) return rows.push({ name: path, ok: false, detail: `HTTP ${r.status}`, kind: 'noindex' })
  const p = parse(r.body)
  const errs = []
  const robots = p.robots.join(',')
  if (!/noindex/.test(robots)) errs.push(`robots="${robots}" (not noindex)`)
  if (follow === true && /nofollow/.test(robots)) errs.push(`expected follow, got "${robots}"`)
  if (follow === false && !/nofollow/.test(robots)) errs.push(`expected nofollow, got "${robots}"`)
  for (const c of p.canon) if (/^https:\/\/www\.lagomplan\.com\/(es|en)?\/?$/.test(c)) errs.push(`canonical points to home: ${c}`)
  rows.push({ name: path, ok: errs.length === 0, detail: errs.join('; ') || `robots="${robots}" canonical=${JSON.stringify(p.canon)}`, kind: 'noindex' })
}

const sm = await get('/sitemap.xml')
const locs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toLocal(m[1]))
console.log(`sitemap: HTTP ${sm.status}, ${locs.length} URLs`)

// sample (named by the user)
const sample = [
  '/es', '/en',
  '/es/guias/roma', '/en/guides/rome',
  '/es/guias/mauricio', '/en/guides/mauritius',
  '/es/guias/kioto-osaka', '/en/guides/kioto-osaka',
  '/es/guias/oaxaca', '/en/guides/oaxaca',
  '/es/guias', '/en/guides',
]
for (const l of locs.filter((l) => /smart-finds\/(familias|families)$/.test(l))) sample.push(l)
for (const p of sample) await checkIndexable(p)

// mismatched slug per locale must redirect to the real one, not serve a duplicate
await checkIndexable('/en/guides/roma', { expectRedirect: '/en/guides/rome' })
await checkIndexable('/es/guias/rome', { expectRedirect: '/es/guias/roma' })
await checkIndexable('/en/guides/mauricio', { expectRedirect: '/en/guides/mauritius' })
await checkIndexable('/es/guias/oaxaca-guia-esencial', { expectRedirect: '/es/guias/oaxaca' })
await checkIndexable('/en/guides/oaxaca-essential-guide', { expectRedirect: '/en/guides/oaxaca' })

// private / non-indexable routes
if (SHARE) await checkNoindex(SHARE)
else rows.push({ name: '/{es,en}/trips/share/<id>', ok: null, detail: 'n/a — pass a real link: --share=/es/trips/share/<shareId> (unknown ids redirect home)', kind: 'noindex' })

// /guia/[partner]: robots are per-partner (Partner.noindex), unchanged from main
await checkRobots('/guia/livin_condesa', /index, follow/, 'index, follow (per-partner default)')
await checkRobots('/guia/livin_roma', /index, follow/, 'index, follow (per-partner default)')
await checkRobots('/guia/demo', /noindex, nofollow/, 'noindex, nofollow (Partner.noindex)')

for (const d of ['/demo/host-me-tender', '/demo/dave-nat']) {
  const r = await get(d)
  if (r.status !== 200) rows.push({ name: d, ok: null, detail: `n/a — route not present on this branch (HTTP ${r.status})`, kind: 'noindex' })
  else await checkNoindex(d, { follow: false })
}

// ---------- whole sitemap ----------
let smBad = 0
const smErrs = []
const seen = new Set()
for (const l of locs) {
  if (seen.has(l)) { smBad++; smErrs.push(`duplicate ${l}`); continue }
  seen.add(l)
  const r = await get(l)
  if (r.status !== 200) { smBad++; smErrs.push(`${l} → HTTP ${r.status}`); continue }
  const p = parse(r.body)
  if (p.canon.length !== 1 || p.canon[0] !== PROD + l) { smBad++; smErrs.push(`${l} canonical=${p.canon}`) }
}
const smXml = sm.body
const entries = [...smXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1])
let altBad = 0
for (const e of entries) {
  const loc = (e.match(/<loc>([^<]+)<\/loc>/) || [])[1]
  const alts = [...e.matchAll(/hreflang="([^"]+)"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*hreflang="([^"]+)"/g)].map((m) => ({ l: m[1] || m[4], h: m[2] || m[3] }))
  const has = (l) => alts.find((a) => a.l === l)
  if (!has('es') || !has('en') || !has('x-default') || !alts.some((a) => a.h === loc)) { altBad++; if (altBad <= 5) smErrs.push(`alternates incomplete: ${loc}`) }
}
rows.push({ name: `sitemap (${locs.length} URLs)`, ok: smBad === 0 && altBad === 0, detail: smBad || altBad ? `${smBad} url problems, ${altBad} incomplete alternates; ${smErrs.slice(0, 5).join(' | ')}` : 'every <loc> 200 + self-canonical, unique, each with es/en/x-default incl. itself', kind: 'sitemap' })

// ---------- report ----------
const mark = (ok) => (ok === null ? 'n/a ' : ok ? 'OK  ' : 'FAIL')
for (const r of rows) console.log(`${mark(r.ok)} ${r.name}\n       ${r.detail}`)
const fails = rows.filter((r) => r.ok === false).length
console.log(`\n${rows.length - fails}/${rows.length} ok, ${fails} failed`)
process.exit(fails ? 1 : 0)
