/**
 * tests/gyg-link-check.test.ts
 *
 *   npx tsx tests/gyg-link-check.test.ts
 *
 * Offline tests for scripts/link-check/gyg-links.ts (no network: fetch is stubbed) and the workflow wiring.
 */

import fs from 'fs'
import path from 'path'
import {
  activitySitemapsFromIndex, buildReport, classifyPage, collectFromGuides, collectGygLinks, idsInSitemap,
  pageProbeUsable, probePage, renderIssueBody, tourIdOf, type GygLink, type PageResult,
} from '../scripts/link-check/gyg-links'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
const ok = (name: string, pass: boolean, detail?: string) => results.push({ name, pass, detail: pass ? undefined : detail })
const eq = <T,>(name: string, got: T, want: T) => ok(name, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`)

const TOUR = 'https://www.getyourguide.com/cancun-l150/xcaret-t980056/'
const TOUR2 = 'https://www.getyourguide.com/rome-l33/colosseum-t42/'
const SEARCH = 'https://www.getyourguide.com/s/?q=Torres+del+Paine'

async function main() {
  // ── collecting ────────────────────────────────────────────────────────────
  const links = collectFromGuides({
    es: [{ canonical: 'cancun', experiences: [{ id: 'xcaret', name: 'Xcaret', affiliateUrl: TOUR }, { id: 'sin-link', name: 'X', affiliateUrl: '' }, { id: 'ot', name: 'OT', affiliateUrl: 'https://www.opentable.com/' }] }],
    en: [{ canonical: 'cancun', experiences: [{ id: 'xcaret', name: 'Xcaret Park', affiliateUrl: TOUR }] }, { canonical: 'roma', experiences: [{ id: 'colosseo', name: 'Colosseum', affiliateUrl: TOUR2 }, { id: 'xcaret', name: 'Same URL, other guide', affiliateUrl: TOUR }, { id: 'search', name: 'Search', affiliateUrl: SEARCH }] }],
  })
  eq('dedupes by URL (3 distinct GYG URLs; empty and non-GYG links ignored)', links.map(l => l.url).sort(), [SEARCH, TOUR, TOUR2].sort())
  const xcaret = links.find(l => l.url === TOUR)!
  eq('one URL keeps every guide / experience / locale that uses it', xcaret.refs.map(r => `${r.locale}:${r.guide}/${r.experienceId}`), ['es:cancun/xcaret', 'en:cancun/xcaret', 'en:roma/xcaret'])
  eq('tour id parsed', tourIdOf(TOUR), '980056')
  eq('non-tour URL has no tour id', tourIdOf(SEARCH), null)
  eq('tour id survives a query string and a locale prefix', tourIdOf('https://www.getyourguide.com/es-mx/cancun-l150/xcaret-t980056/?ranking_uuid=a'), '980056')

  // the real registry
  const real = collectGygLinks()
  ok('real guides: finds GYG links, es + en refs', real.length > 50 && real.some(l => l.refs.some(r => r.locale === 'en')) && real.some(l => l.refs.some(r => r.locale === 'es')))
  ok('real guides: every tour URL has a tour id', real.filter(l => /-t\d+\/?$/.test(l.url)).every(l => l.tourId))

  // ── page verdicts ─────────────────────────────────────────────────────────
  eq('404 -> broken', classifyPage(TOUR, 404, TOUR).verdict, 'broken')
  eq('410 -> broken', classifyPage(TOUR, 410, TOUR).verdict, 'broken')
  eq('200 on a tour -> ok', classifyPage(TOUR, 200, TOUR).verdict, 'ok')
  eq('200 on a locale-prefixed tour (normal GYG redirect) -> ok', classifyPage(TOUR, 200, 'https://www.getyourguide.com/es-mx/cancun-l150/xcaret-t980056/').verdict, 'ok')
  eq('redirect to a location page -> moved', classifyPage(TOUR, 200, 'https://www.getyourguide.com/cancun-l150/').verdict, 'moved')
  eq('redirect to search -> moved', classifyPage(TOUR, 200, 'https://www.getyourguide.com/s/?q=cancun').verdict, 'moved')
  eq('redirect to the home page -> moved', classifyPage(TOUR, 200, 'https://www.getyourguide.com/').verdict, 'moved')
  eq('403 (bot protection) -> blocked, never broken', classifyPage(TOUR, 403, TOUR).verdict, 'blocked')
  eq('429 -> blocked', classifyPage(TOUR, 429, TOUR).verdict, 'blocked')
  eq('500 -> blocked', classifyPage(TOUR, 500, TOUR).verdict, 'blocked')
  eq('network error -> blocked', classifyPage(TOUR, null, null, 'ECONNRESET').verdict, 'blocked')

  const mk = (verdict: PageResult['verdict'], url = TOUR): PageResult => ({ url, verdict, status: null, finalUrl: null })
  ok('page probe usable when most answers are real', pageProbeUsable([mk('ok'), mk('ok'), mk('blocked')]))
  ok('page probe unusable when most are blocked', !pageProbeUsable([mk('blocked'), mk('blocked'), mk('ok')]))

  // probePage follows redirects through fetch and retries only on 5xx / errors
  let calls = 0
  const flaky = (async () => { calls++; return calls < 3 ? new Response('x', { status: 503 }) : Object.assign(new Response('ok', { status: 200 }), { }) }) as unknown as typeof fetch
  const r1 = await probePage(TOUR, flaky, 2)
  ok('retries a 503 and then succeeds', calls === 3 && r1.status === 200, `calls=${calls} status=${r1.status}`)
  let c403 = 0
  const blockedFetch = (async () => { c403++; return new Response('no', { status: 403 }) }) as unknown as typeof fetch
  const r2 = await probePage(TOUR, blockedFetch, 2)
  ok('a 403 is an answer: no retry, blocked', c403 === 1 && r2.verdict === 'blocked')

  // ── report ────────────────────────────────────────────────────────────────
  const L: GygLink[] = [
    { url: TOUR, tourId: '980056', refs: [{ locale: 'es', guide: 'cancun', experienceId: 'xcaret', experienceName: 'Xcaret' }, { locale: 'en', guide: 'cancun', experienceId: 'xcaret', experienceName: 'Xcaret Park' }] },
    { url: TOUR2, tourId: '42', refs: [{ locale: 'en', guide: 'roma', experienceId: 'colosseo', experienceName: 'Colosseum' }] },
    { url: SEARCH, tourId: null, refs: [{ locale: 'en', guide: 'torres-del-paine', experienceId: 'w-trek', experienceName: 'W Trek' }] },
  ]
  const now = new Date('2026-11-23T06:17:00Z')

  // page method: usable probe, 404 and a moved tour are findings, ok ones are not, non-tour is "not checked"
  const pageReport = buildReport({ links: L, pageResults: [{ url: TOUR, verdict: 'broken', status: 404, finalUrl: TOUR, detail: 'HTTP 404' }, { url: TOUR2, verdict: 'ok', status: 200, finalUrl: TOUR2 }], sitemapIds: null, known: {}, now })
  eq('page method: only the 404 is a finding', pageReport.findings.map(f => [f.kind, f.link.url]), [['broken', TOUR]])
  eq('non-tour URLs are listed as not checked, never as findings', pageReport.notChecked.map(l => l.url), [SEARCH])
  eq('totals', pageReport.totals, { urls: 3, tours: 2, notChecked: 1, refs: 4 })

  // sitemap method: blocked probe -> missing id is a finding unless reviewed
  const blocked = [mk('blocked', TOUR), mk('blocked', TOUR2)]
  const smReport = buildReport({ links: L, pageResults: blocked, sitemapIds: new Set(['42']), known: {}, now })
  eq('sitemap method: a tour missing from the sitemap is reported', smReport.findings.map(f => [f.kind, f.link.tourId]), [['unlisted', '980056']])
  const smKnown = buildReport({ links: L, pageResults: blocked, sitemapIds: new Set(['42']), known: { '980056': 'reviewed' }, now })
  eq('sitemap method: a reviewed id is not reported again', [smKnown.findings.length, smKnown.knownUnlisted.length], [0, 1])
  let threw = false
  try { buildReport({ links: L, pageResults: blocked, sitemapIds: null, known: {}, now }) } catch { threw = true }
  ok('blocked page probe with no sitemap result throws (the run goes red instead of reporting "all clear")', threw)

  // ── issue body ────────────────────────────────────────────────────────────
  const body = renderIssueBody(pageReport)
  ok('issue body lists guide, experience and URL for every reference', body.includes('`cancun` (es) · `xcaret` · Xcaret') && body.includes('`cancun` (en) · `xcaret` · Xcaret Park') && body.includes(TOUR))
  ok('issue body does not list healthy links', !body.includes(TOUR2))
  ok('issue body says it never edits the guides', /never edits the guides/.test(body))
  ok('sitemap issue body tells the reader how to silence a reviewed id', renderIssueBody(smReport).includes('known-unlisted.json'))

  // ── sitemap parsing ───────────────────────────────────────────────────────
  eq('sitemap index -> activity sitemaps only', activitySitemapsFromIndex('<sitemap><loc>https://www.getyourguide.com/sitemap-activity-0.xml</loc></sitemap><sitemap><loc>https://www.getyourguide.com/sitemap-city-1.xml</loc></sitemap><sitemap><loc>https://www.getyourguide.com/sitemap-activity-10.xml</loc></sitemap>'), ['https://www.getyourguide.com/sitemap-activity-0.xml', 'https://www.getyourguide.com/sitemap-activity-10.xml'])
  // a <loc> split across two stream chunks must still be found; hreflang alternates (not <loc>) must not count
  const xml = `<url><loc>${TOUR}</loc><xhtml:link rel="alternate" href="https://www.getyourguide.com/es-es/x/other-t777/"/></url><url><loc>${TOUR2}</loc></url>`
  const cut = xml.indexOf('t980056') + 3
  const enc = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({ start(c) { c.enqueue(enc.encode(xml.slice(0, cut))); c.enqueue(enc.encode(xml.slice(cut))); c.close() } })
  const sitemapFetch = (async () => new Response(stream, { status: 200 })) as unknown as typeof fetch
  const found = await idsInSitemap('https://x/sitemap-activity-0.xml', new Set(['980056', '42', '777', '1']), sitemapFetch)
  eq('sitemap stream: finds tours even when a <loc> straddles two chunks; ignores hreflang alternates', [...found].sort(), ['42', '980056'])

  // ── safety: never edits guides, workflow wiring ───────────────────────────
  const root = path.join(__dirname, '..')
  const sources = ['scripts/link-check/gyg-links.ts', 'scripts/link-check/run.ts'].map(f => fs.readFileSync(path.join(root, f), 'utf-8'))
  ok('link-check code has no write to anything but the output dir', sources.every(s => !/writeFile(Sync)?\([^)]*lib\/data|appendFile(Sync)?\([^)]*lib\/data/.test(s)) && !sources[0].includes('writeFile'))
  const wf = fs.readFileSync(path.join(root, '.github/workflows/link-check.yml'), 'utf-8')
  ok('workflow: weekly schedule', /cron: '\d+ \d+ \* \* 1'/.test(wf))
  ok('workflow: manual trigger with dry_run', /workflow_dispatch:/.test(wf) && /dry_run:/.test(wf))
  ok('workflow: only issues:write + contents:read (cannot push to guides)', /permissions:\s*\n\s+contents: read\s*\n\s+issues: write/.test(wf) && !/contents: write/.test(wf))
  ok('workflow: issue step runs only on success and never on a dry run', /if: \$\{\{ success\(\) && env\.DRY_RUN != 'true' \}\}/.test(wf))
  ok('workflow: PRs touching the check run it as a dry run', /pull_request:/.test(wf) && /github\.event_name == 'pull_request'/.test(wf))
  const known = JSON.parse(fs.readFileSync(path.join(root, 'scripts/link-check/known-unlisted.json'), 'utf-8'))
  ok('known-unlisted.json is valid and keyed by numeric tour ids', Object.keys(known.reviewed).every(k => /^\d+$/.test(k)))

  const failed = results.filter(r => !r.pass)
  for (const r of failed) console.log(`FAIL ${r.name}: ${r.detail}`)
  console.log(`gyg-link-check: ${results.length - failed.length}/${results.length} passed`)
  process.exit(failed.length ? 1 : 0)
}
main()
