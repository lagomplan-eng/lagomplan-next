/**
 * scripts/link-check/run.ts
 *
 *   npx tsx scripts/link-check/run.ts            # real check (network)
 *
 * Entry point for .github/workflows/link-check.yml. Reads the guides, writes ONLY into LINK_CHECK_OUT
 * (default ./link-check-out): report.json, issue.md, summary.md. Exit 0 = the check reached a conclusion
 * (findings or not); exit 1 = it could not (network, format change), so the workflow goes red and does
 * not touch the issue. Sets `findings=<n>` in $GITHUB_OUTPUT.
 */

import fs from 'fs'
import path from 'path'
import {
  buildReport, collectGygLinks, idsInActivitySitemaps, pageProbeUsable, probePages,
  renderIssueBody, renderSummary, type KnownUnlisted,
} from './gyg-links'

async function main() {
  const out = process.env.LINK_CHECK_OUT ?? 'link-check-out'
  fs.mkdirSync(out, { recursive: true })

  const known: KnownUnlisted = JSON.parse(fs.readFileSync(path.join(__dirname, 'known-unlisted.json'), 'utf-8')).reviewed ?? {}
  const links = collectGygLinks()
  const tours = links.filter(l => l.tourId)
  console.log(`${links.length} GetYourGuide URLs (${tours.length} tours) from ${links.reduce((n, l) => n + l.refs.length, 0)} references`)

  // Probe a small sample first. If GetYourGuide blocks it (it usually does: Cloudflare 403), skip hammering it.
  const sample = await probePages(tours.slice(0, 8))
  let pageResults = sample
  if (pageProbeUsable(sample)) pageResults = [...sample, ...(await probePages(tours.slice(8)))]
  console.log(`page probe: ${pageResults.filter(r => r.verdict === 'blocked').length}/${pageResults.length} blocked`)

  let sitemapIds: Set<string> | null = null
  if (!pageProbeUsable(pageResults)) {
    console.log('page probe unusable, scanning GetYourGuide sitemap-activity files…')
    sitemapIds = await idsInActivitySitemaps(new Set(tours.map(l => l.tourId!)))
    console.log(`sitemap lists ${sitemapIds.size} of ${tours.length} tour ids`)
  }

  const report = buildReport({ links, pageResults, sitemapIds, known })
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2))
  fs.writeFileSync(path.join(out, 'issue.md'), renderIssueBody(report))
  fs.writeFileSync(path.join(out, 'summary.md'), renderSummary(report))
  console.log(renderSummary(report))
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `findings=${report.findings.length}\n`)
}

main().catch(err => { console.error('link check could not reach a conclusion:', err); process.exit(1) })
