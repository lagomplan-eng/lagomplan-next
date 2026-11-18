/**
 * scripts/link-check/gyg-links.ts
 *
 * Library for the weekly GetYourGuide link check (run.ts is the entry point, .github/workflows/link-check.yml
 * the schedule). Reads the guides, NEVER writes them: the only output is the report files run.ts is told to write.
 *
 * What is checked: every GetYourGuide affiliateUrl of every experience in every guide, es + en, deduplicated
 * by URL (one URL can back several guides/experiences/languages; each is listed in the report).
 *
 * Two ways to look at a tour, tried in this order:
 *
 *  1. PAGE PROBE: GET the stored URL (no partner params, so no affiliate click is counted), follow redirects.
 *       404 / 410                              -> broken
 *       lands on a non-tour page               -> moved (a delisted tour redirects to its city / search page)
 *       2xx on a tour page                     -> ok
 *       403 / 429 / other 4xx / 5xx / network  -> blocked (inconclusive)
 *     GetYourGuide sits behind Cloudflare bot management and answers 403 to automated clients, so in practice
 *     this is often blind. If most probes are blocked, the page probe is declared unusable and:
 *
 *  2. SITEMAP PROBE: GetYourGuide's public sitemap-activity-N.xml files list every live, indexable tour. A tour
 *     id (-t<number>) that is missing from all of them is reported as "unlisted". Absence is weaker evidence than a
 *     404 (a tour can be live but unindexed), so ids a human already reviewed live in known-unlisted.json and are
 *     not reported again; only a NEW disappearance opens or updates the issue.
 *
 * Non-tour GetYourGuide URLs (search /s/?q=, location -l<n>, supplier -s<n>, category -tc<n>) cannot be checked by
 * either method and are listed as "not checked".
 */

import { getAllFlatGuides } from '../../lib/data/guides'
import { isGygTourUrl } from '../../lib/affiliate/gyg'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LinkRef {
  locale: 'es' | 'en'
  guide: string
  experienceId: string
  experienceName: string
}

export interface GygLink {
  /** The stored URL, exactly as it is in the guide. */
  url: string
  /** Tour id (the number in -t<id>) or null for a non-tour URL. */
  tourId: string | null
  refs: LinkRef[]
}

export type PageVerdict = 'ok' | 'broken' | 'moved' | 'blocked'

export interface PageResult {
  url: string
  verdict: PageVerdict
  status: number | null
  finalUrl: string | null
  detail?: string
}

export type FindingKind = 'broken' | 'moved' | 'unlisted'

export interface Finding {
  kind: FindingKind
  link: GygLink
  detail: string
}

export interface Report {
  checkedAt: string
  method: 'page' | 'sitemap'
  totals: { urls: number; tours: number; notChecked: number; refs: number }
  findings: Finding[]
  /** Reviewed-and-silenced tour ids that are still missing from the sitemap (informational). */
  knownUnlisted: GygLink[]
  notChecked: GygLink[]
  /** Page probe outcome, kept for the log even when the sitemap was used. */
  pageProbe: { blocked: number; probed: number }
}

// ── Collecting links from the guides ───────────────────────────────────────────

const TOUR_ID = /-t(\d+)\/?(?:[?#].*)?$/

export function tourIdOf(url: string): string | null {
  if (!isGygTourUrl(url)) return null
  return TOUR_ID.exec(url)?.[1] ?? null
}

function isGygHost(url: string): boolean {
  try {
    const h = new URL(url).host.toLowerCase()
    return h === 'www.getyourguide.com' || h === 'getyourguide.com'
  } catch {
    return false
  }
}

export interface GuideExperience { id: string; name: string; affiliateUrl: string }
export interface GuideInput { canonical: string; experiences: GuideExperience[] }

/** Pure core of collectGygLinks, so tests can feed it fixtures. */
export function collectFromGuides(byLocale: Record<'es' | 'en', GuideInput[]>): GygLink[] {
  const byUrl = new Map<string, GygLink>()
  for (const locale of ['es', 'en'] as const) {
    for (const g of byLocale[locale]) {
      for (const e of g.experiences) {
        if (!e.affiliateUrl || !isGygHost(e.affiliateUrl)) continue
        let link = byUrl.get(e.affiliateUrl)
        if (!link) {
          link = { url: e.affiliateUrl, tourId: tourIdOf(e.affiliateUrl), refs: [] }
          byUrl.set(e.affiliateUrl, link)
        }
        if (!link.refs.some(r => r.locale === locale && r.guide === g.canonical && r.experienceId === e.id)) {
          link.refs.push({ locale, guide: g.canonical, experienceId: e.id, experienceName: e.name })
        }
      }
    }
  }
  return [...byUrl.values()]
}

export function collectGygLinks(): GygLink[] {
  const pick = (locale: 'es' | 'en'): GuideInput[] =>
    getAllFlatGuides(locale).map(({ canonical, flat }) => ({
      canonical,
      experiences: flat.experiences.map(e => ({ id: e.id, name: e.name, affiliateUrl: e.affiliateUrl })),
    }))
  return collectFromGuides({ es: pick('es'), en: pick('en') })
}

// ── Page probe ─────────────────────────────────────────────────────────────────

/** Turns an HTTP outcome into a verdict. Pure. */
export function classifyPage(url: string, status: number | null, finalUrl: string | null, error?: string): PageResult {
  if (status === null) return { url, verdict: 'blocked', status, finalUrl, detail: error ?? 'network error' }
  if (status === 404 || status === 410) return { url, verdict: 'broken', status, finalUrl, detail: `HTTP ${status}` }
  if (status >= 200 && status < 300) {
    if (finalUrl && !isGygTourUrl(finalUrl)) {
      return { url, verdict: 'moved', status, finalUrl, detail: `redirects to a non-tour page: ${finalUrl}` }
    }
    return { url, verdict: 'ok', status, finalUrl }
  }
  // 3xx that fetch could not follow, 401/403/429 (bot protection), other 4xx, 5xx: say nothing about the tour.
  return { url, verdict: 'blocked', status, finalUrl, detail: `HTTP ${status}` }
}

const UA = 'Mozilla/5.0 (compatible; lagomplan-linkcheck/1.0; +https://www.lagomplan.com)'

export async function probePage(url: string, fetchImpl: typeof fetch = fetch, retries = 2): Promise<PageResult> {
  let last: PageResult = classifyPage(url, null, null, 'not attempted')
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchImpl(url, {
        redirect: 'follow',
        headers: { 'user-agent': UA, 'accept-language': 'en', accept: 'text/html' },
        signal: AbortSignal.timeout(20_000),
      })
      await res.body?.cancel().catch(() => {})
      last = classifyPage(url, res.status, res.url || null)
      // Only transient server errors are worth another try; 403/404/410 are answers.
      if (res.status < 500) return last
    } catch (err) {
      last = classifyPage(url, null, null, err instanceof Error ? err.message : String(err))
    }
    await new Promise(r => setTimeout(r, 1500 * (attempt + 1)))
  }
  return last
}

export async function probePages(links: GygLink[], fetchImpl: typeof fetch = fetch, concurrency = 4): Promise<PageResult[]> {
  const out: PageResult[] = new Array(links.length)
  let next = 0
  await Promise.all(Array.from({ length: Math.min(concurrency, links.length) }, async () => {
    while (next < links.length) {
      const i = next++
      out[i] = await probePage(links[i].url, fetchImpl)
    }
  }))
  return out
}

/** The page probe is unusable when most answers are "blocked". */
export function pageProbeUsable(results: PageResult[]): boolean {
  if (results.length === 0) return true
  return results.filter(r => r.verdict === 'blocked').length / results.length < 0.5
}

// ── Sitemap probe ──────────────────────────────────────────────────────────────

const SITEMAP_INDEX = 'https://www.getyourguide.com/sitemap.xml'
const ACTIVITY_SITEMAP = /<loc>(https:\/\/www\.getyourguide\.com\/sitemap-activity-\d+\.xml)<\/loc>/g
/** A tour entry: <loc>…-t<id>/</loc> (the hreflang alternates are not <loc>, so they are ignored). */
const TOUR_LOC = /<loc>[^<]*-t(\d+)\/<\/loc>/g

export function activitySitemapsFromIndex(indexXml: string): string[] {
  return [...indexXml.matchAll(ACTIVITY_SITEMAP)].map(m => m[1])
}

/** Streams one sitemap (tens of MB) and returns which of `wanted` it lists. Keeps a small rolling buffer. */
export async function idsInSitemap(url: string, wanted: Set<string>, fetchImpl: typeof fetch = fetch): Promise<Set<string>> {
  const res = await fetchImpl(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(240_000) })
  if (!res.ok || !res.body) throw new Error(`${url}: HTTP ${res.status}`)
  const found = new Set<string>()
  const decoder = new TextDecoder()
  let tail = ''
  for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
    const text = tail + decoder.decode(chunk, { stream: true })
    for (const m of text.matchAll(TOUR_LOC)) if (wanted.has(m[1])) found.add(m[1])
    tail = text.slice(-300) // longer than any single <loc>, so a match split across chunks is still seen
  }
  return found
}

/** Returns the ids found across every activity sitemap. Throws if any file cannot be read (a partial scan proves nothing). */
export async function idsInActivitySitemaps(wanted: Set<string>, fetchImpl: typeof fetch = fetch, concurrency = 6): Promise<Set<string>> {
  const idx = await fetchImpl(SITEMAP_INDEX, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(60_000) })
  if (!idx.ok) throw new Error(`sitemap index: HTTP ${idx.status}`)
  const files = activitySitemapsFromIndex(await idx.text())
  if (files.length === 0) throw new Error('sitemap index lists no activity sitemaps (format changed?)')
  const found = new Set<string>()
  let next = 0
  await Promise.all(Array.from({ length: Math.min(concurrency, files.length) }, async () => {
    while (next < files.length) {
      const f = files[next++]
      for (const id of await idsInSitemap(f, wanted, fetchImpl)) found.add(id)
    }
  }))
  return found
}

// ── Building the report ────────────────────────────────────────────────────────

export interface KnownUnlisted { [tourId: string]: string }

export function buildReport(opts: {
  links: GygLink[]
  pageResults: PageResult[]
  sitemapIds: Set<string> | null
  known: KnownUnlisted
  now?: Date
}): Report {
  const { links, pageResults, sitemapIds, known } = opts
  const tours = links.filter(l => l.tourId)
  const notChecked = links.filter(l => !l.tourId)
  const blocked = pageResults.filter(r => r.verdict === 'blocked').length
  const usable = pageProbeUsable(pageResults)
  const findings: Finding[] = []
  const knownUnlisted: GygLink[] = []

  if (usable) {
    const byUrl = new Map(pageResults.map(r => [r.url, r]))
    for (const link of tours) {
      const r = byUrl.get(link.url)
      if (r && (r.verdict === 'broken' || r.verdict === 'moved')) findings.push({ kind: r.verdict, link, detail: r.detail ?? '' })
    }
  } else {
    if (!sitemapIds) throw new Error('page probe unusable and no sitemap result to fall back on')
    for (const link of tours) {
      if (sitemapIds.has(link.tourId!)) continue
      if (known[link.tourId!]) knownUnlisted.push(link)
      else findings.push({ kind: 'unlisted', link, detail: 'not in GetYourGuide\'s public sitemap-activity files' })
    }
  }

  return {
    checkedAt: (opts.now ?? new Date()).toISOString(),
    method: usable ? 'page' : 'sitemap',
    totals: { urls: links.length, tours: tours.length, notChecked: notChecked.length, refs: links.reduce((n, l) => n + l.refs.length, 0) },
    findings,
    knownUnlisted,
    notChecked,
    pageProbe: { blocked, probed: pageResults.length },
  }
}

// ── Rendering ──────────────────────────────────────────────────────────────────

export const ISSUE_TITLE = 'GetYourGuide experience links need attention'
export const ISSUE_LABEL = 'link-check'

const KIND_LABEL: Record<FindingKind, string> = {
  broken: '404 / 410 (gone)',
  moved: 'redirects to a non-tour page',
  unlisted: 'missing from GetYourGuide\'s public sitemap (verify by hand)',
}

function refLine(r: LinkRef): string {
  return `\`${r.guide}\` (${r.locale}) · \`${r.experienceId}\` · ${r.experienceName}`
}

export function renderIssueBody(report: Report): string {
  const lines: string[] = []
  lines.push(`Weekly link check, ${report.checkedAt.slice(0, 10)}. This issue is opened and updated by \`.github/workflows/link-check.yml\`; it never edits the guides.`)
  lines.push('')
  lines.push(`**${report.findings.length}** link${report.findings.length === 1 ? '' : 's'} to look at, out of ${report.totals.tours} GetYourGuide tour URLs (${report.totals.refs} guide/experience references).`)
  lines.push('')
  for (const kind of ['broken', 'moved', 'unlisted'] as FindingKind[]) {
    const items = report.findings.filter(f => f.kind === kind)
    if (items.length === 0) continue
    lines.push(`### ${KIND_LABEL[kind]} (${items.length})`)
    lines.push('')
    lines.push('| Guide / experience | URL |')
    lines.push('|---|---|')
    for (const f of items) {
      lines.push(`| ${f.link.refs.map(refLine).join('<br>')} | ${f.link.url} |`)
    }
    lines.push('')
  }
  lines.push('<details><summary>How this was checked</summary>')
  lines.push('')
  if (report.method === 'page') {
    lines.push('Each tour URL was requested and redirects followed. A 404/410, or a redirect to a page that is not a tour, is listed above.')
  } else {
    lines.push(`GetYourGuide answers automated page requests with 403 (${report.pageProbe.blocked} of ${report.pageProbe.probed} blocked), so the check fell back to GetYourGuide's public \`sitemap-activity-*.xml\` files, which list live tours. A tour missing from all of them is listed above. That is weaker evidence than a 404: open the URL in a browser, and if the tour is fine add its id to \`scripts/link-check/known-unlisted.json\` so it is not reported again.`)
  }
  if (report.knownUnlisted.length) lines.push('', `${report.knownUnlisted.length} already-reviewed tours are still missing from the sitemap and are not listed.`)
  if (report.notChecked.length) lines.push('', `${report.notChecked.length} non-tour GetYourGuide URLs (search, location, supplier, category) cannot be checked automatically.`)
  lines.push('', '</details>')
  return lines.join('\n')
}

export function renderSummary(report: Report): string {
  const lines = [
    `## GetYourGuide link check (${report.method} probe)`,
    '',
    `- URLs: ${report.totals.urls} (${report.totals.tours} tours, ${report.totals.notChecked} not checkable), references: ${report.totals.refs}`,
    `- Page probe: ${report.pageProbe.blocked} of ${report.pageProbe.probed} blocked`,
    `- Findings: **${report.findings.length}**, already-reviewed unlisted: ${report.knownUnlisted.length}`,
  ]
  for (const f of report.findings) lines.push(`  - ${f.kind}: ${f.link.refs.map(r => `${r.guide}/${r.experienceId} (${r.locale})`).join(', ')} -> ${f.link.url}`)
  return lines.join('\n')
}
