/**
 * scripts/experiences/build-links.ts
 *
 * Phase 2, step 1 of the Experiencias hub. Builds the link table Elena fills in:
 *
 *   scripts/experiences/links.csv              one row per experience (123), region → guide → index
 *   scripts/experiences/links-resolution-log.csv  raw redirect evidence for the Stay22 links
 *
 * Network: ONE request per getyourguide.stay22.com URL (redirect: 'manual'), reading only the
 * status line and Location header (the GYG tour URL is the `link` param of that Location). No response body is read or stored; direct www
 * getyourguide.com URLs are classified from the URL alone, no request is made.
 *
 * Elena fills `new_url` (rules in apply-links.ts). This script never writes guide files.
 *
 * Run: npx tsx scripts/experiences/build-links.ts
 */

import fs from 'fs'
import path from 'path'
import { getAllFlatGuides, GUIDE_META } from '../../lib/data/guides/index'

const OUT = __dirname
const REGION_ORDER = ['mexico', 'latam', 'norteamerica', 'europa', 'asia', 'africa', 'oceania']

type CurrentType =
  | 'gyg_direct' | 'gyg_stay22' | 'gyg_search' | 'gyg_location' | 'gyg_supplier'
  | 'opentable' | 'viator' | 'venue' | 'empty'

const GYG_HOST = 'www.getyourguide.com'
const STAY22_GYG_HOST = 'getyourguide.stay22.com'
const TOUR_PATH = /-t\d+\/?$/

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const csvRow = (cells: unknown[]) => cells.map(csvCell).join(',')

/** URL without query string or fragment. */
function stripParams(u: string): string {
  const x = new URL(u)
  return `${x.protocol}//${x.host}${x.pathname}`
}

function classify(url: string): { type: CurrentType; note?: string } {
  if (!url) return { type: 'empty' }
  let u: URL
  try { u = new URL(url) } catch { return { type: 'venue', note: 'unparseable URL' } }
  const host = u.host.toLowerCase()
  if (host === STAY22_GYG_HOST) return { type: 'gyg_stay22' }
  if (host === GYG_HOST || host === 'getyourguide.com') {
    const p = u.pathname
    if (TOUR_PATH.test(p)) return { type: 'gyg_direct' }
    if (/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?s\/?$/i.test(p) || u.searchParams.has('q')) return { type: 'gyg_search' }
    if (/-l\d+\/?$/.test(p)) return { type: 'gyg_location' }
    if (/-s\d+\/?$/.test(p)) return { type: 'gyg_supplier' }
    // A GYG page that is none of the above: not a tour. Surface it honestly.
    return { type: 'gyg_location', note: `unclassified GYG path ${p}` }
  }
  if (/(^|\.)opentable\.com$/.test(host)) return { type: 'opentable' }
  if (/(^|\.)viator\.com$/.test(host)) return { type: 'viator' }
  return { type: 'venue' }
}

// ── one redirect hop, status + Location only ───────────────────────────────────

type Hop = { httpStatus: number | null; location: string; error: string }
async function oneHop(url: string): Promise<Hop> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; LagomplanLinkCheck/1.0; +https://www.lagomplan.com)' },
        signal: AbortSignal.timeout(15000),
      })
      const location = res.headers.get('location') ?? ''
      await res.body?.cancel() // never read or keep the body
      return { httpStatus: res.status, location, error: '' }
    } catch (e: any) {
      if (attempt === 2) return { httpStatus: null, location: '', error: String(e?.cause?.code ?? e?.message ?? e) }
      await new Promise(r => setTimeout(r, 800))
    }
  }
  return { httpStatus: null, location: '', error: 'unreachable' }
}

async function main() {
  const es = getAllFlatGuides('es')
  const en = new Map(getAllFlatGuides('en').map(g => [g.canonical, g.flat]))

  type Row = {
    id: string; guide: string; region: string; es_name: string; en_name: string; category: string
    current_url: string; current_type: CurrentType; classNote?: string
    resolved_gyg_url: string; status: 'ok' | 'review' | 'no_gyg'
  }
  const rows: Row[] = []
  for (const { canonical, flat } of es) {
    const enFlat = en.get(canonical)!
    flat.experiences.forEach((e, i) => {
      const c = classify(e.affiliateUrl)
      rows.push({
        id: e.id, guide: canonical, region: GUIDE_META[canonical].region,
        es_name: e.name, en_name: enFlat.experiences[i].name, category: e.category ?? '',
        current_url: e.affiliateUrl, current_type: c.type, classNote: c.note,
        resolved_gyg_url: '', status: 'no_gyg',
      })
    })
  }

  // direct GYG: classify from the URL alone
  for (const r of rows) {
    if (r.current_type === 'gyg_direct') { r.resolved_gyg_url = stripParams(r.current_url); r.status = 'ok' }
    else if (['gyg_search', 'gyg_location', 'gyg_supplier'].includes(r.current_type)) r.status = 'review'
  }

  // Stay22: one hop each
  const log: string[][] = [['id', 'guide', 'stay22_url', 'http_status', 'location', 'error', 'landing_host', 'landing_is_tour']]
  const stay = rows.filter(r => r.current_type === 'gyg_stay22')
  let next = 0
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < stay.length) {
      const r = stay[next++]
      const hop = await oneHop(r.current_url)
      let landing = ''
      if (hop.location) {
        try {
          const loc = new URL(hop.location, r.current_url)
          // Stay22 answers with www.stay22.com/allez/getyourguide?link=<encoded GYG URL>;
          // the destination is that `link` param. Reading it needs no second request.
          const link = /(^|\.)stay22\.com$/.test(loc.host) ? loc.searchParams.get('link') : null
          landing = (link ? new URL(link) : loc).toString()
        } catch { /* leave blank */ }
      }
      let host = ''
      try { host = landing ? new URL(landing).host : '' } catch { /* */ }
      const onGyg = host === GYG_HOST
      const isTour = onGyg && TOUR_PATH.test(new URL(landing).pathname)
      if (onGyg) r.resolved_gyg_url = stripParams(landing)
      r.status = isTour ? 'ok' : 'review'
      log.push([r.id, r.guide, r.current_url, String(hop.httpStatus ?? ''), hop.location, hop.error, host, String(isTour)])
    }
  }))

  rows.sort((a, b) =>
    REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region) ||
    es.findIndex(g => g.canonical === a.guide) - es.findIndex(g => g.canonical === b.guide) ||
    es.find(g => g.canonical === a.guide)!.flat.experiences.findIndex(e => e.id === a.id) -
    es.find(g => g.canonical === b.guide)!.flat.experiences.findIndex(e => e.id === b.id))

  const header = ['id', 'guide', 'region', 'es_name', 'en_name', 'category', 'current_url', 'current_type', 'resolved_gyg_url', 'status', 'new_url', 'notes']
  const lines = [csvRow(header)]
  for (const r of rows) {
    lines.push(csvRow([r.id, r.guide, r.region, r.es_name, r.en_name, r.category, r.current_url, r.current_type, r.resolved_gyg_url, r.status, '', '']))
  }
  fs.writeFileSync(path.join(OUT, 'links.csv'), lines.join('\n') + '\n')
  fs.writeFileSync(path.join(OUT, 'links-resolution-log.csv'), log.map(csvRow).join('\n') + '\n')

  const count = (f: (r: Row) => string) => rows.reduce((m: Record<string, number>, r) => ((m[f(r)] = (m[f(r)] || 0) + 1), m), {})
  console.log(JSON.stringify({
    rows: rows.length,
    byType: count(r => r.current_type),
    byStatus: count(r => r.status),
    unclassifiedGyg: rows.filter(r => r.classNote).map(r => `${r.id}: ${r.classNote}`),
    stay22Hops: log.length - 1,
  }, null, 1))
}

main().catch(e => { console.error(e); process.exit(1) })
