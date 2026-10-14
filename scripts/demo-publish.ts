// npm run demo:preview -- <slug> [--json <file>] [--logo <file>] [--dry-run]
// npm run demo:promote -- <slug> [--yes] [--allow-other] [--dry-run]
//
// Two steps, never automatic:
//   preview  validate → copy json/logo → commit on demo/<slug> → push → deploy to
//            PREVIEW → verify → print the Preview link. Stops there.
//   promote  needs a valid editorial review → asks for explicit confirmation →
//            PR → CI → merge to main → deploy main to PRODUCTION (once) →
//            verify on www.lagomplan.com → print /demo/<slug>?ref=<ref>.
//
// Nothing reaches Production unless it is in main. Env: COMMIT_TRAILER / PR_FOOTER
// are appended to the commit message / PR body (used by the /nueva-demo command).

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { formatReport, validateDemoFolder } from '../content/guia/demos/validate'
import {
  PROD_ORIGIN, assertSlug, branchFor, commitMessage, demoUrl, lastUrl, otherChanges, promoteBlockers, refFor, robotsOf,
} from './lib/demo-publish-core'

const [stage, ...rest] = process.argv.slice(2)
const flags = new Set(rest.filter((a) => a.startsWith('--') && !/^--(json|logo)$/.test(a)))
const opt = (name: string) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined }
const positional = rest.filter((a, i) => !a.startsWith('--') && !['--json', '--logo'].includes(rest[i - 1]))
const DRY = flags.has('--dry-run')

class Stop extends Error { constructor(msg: string, public code = 1) { super(msg) } }

function sh(cmd: string, opts: { quiet?: boolean; allowFail?: boolean; mutating?: boolean } = {}): string {
  if (DRY && opts.mutating) { console.log(`  [dry-run] ${cmd}`); return '' }
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 })
    if (!opts.quiet) process.stdout.write(out.length > 2000 ? out.slice(-2000) : out)
    return out
  } catch (e) {
    if (opts.allowFail) return ''
    const err = e as { stdout?: string; stderr?: string }
    throw new Stop(`command failed: ${cmd}\n${(err.stderr || err.stdout || '').toString().trim().split('\n').slice(-8).join('\n')}`)
  }
}
const step = (n: number, t: string) => console.log(`\n[${n}] ${t}`)
const say = (t: string) => console.log(`    ${t}`)

function validate(slug: string, production: boolean) {
  const report = validateDemoFolder(slug, { production })
  console.log(formatReport(report))
  return report
}

function preflight() {
  sh('git --version', { quiet: true }); sh('gh auth status', { quiet: true }); sh('vercel whoami', { quiet: true })
}

/** Tracked/untracked changes outside the demo folder block a branch switch. */
function assertCleanExcept(slug: string) {
  const dirty = sh('git status --porcelain', { quiet: true }).split('\n').filter(Boolean)
    .map((l) => l.slice(3)).filter((f) => !f.startsWith(`content/demos/${slug}/`) && f !== 'supabase/.temp/cli-latest')
  if (dirty.length) throw new Stop(`working tree has changes outside content/demos/${slug}/:\n  ${dirty.join('\n  ')}\ncommit or stash them first`)
}

async function preview(slug: string) {
  const dir = path.join('content', 'demos', slug)
  step(1, `Copy files into ${dir}/`)
  for (const [flag, name] of [['--json', 'demo.json'], ['--logo', null]] as const) {
    const src = opt(flag)
    if (!src) continue
    if (!fs.existsSync(src)) throw new Stop(`${flag} file not found: ${src}`)
    const dest = path.join(dir, name ?? `logo${path.extname(src).toLowerCase()}`)
    if (DRY) say(`[dry-run] copy ${src} → ${dest}`)
    else { fs.mkdirSync(dir, { recursive: true }); fs.copyFileSync(src, dest); say(`${src} → ${dest}`) }
  }
  if (!fs.existsSync(path.join(dir, 'demo.json'))) throw new Stop(`${dir}/demo.json doesn't exist — pass --json <file> or create it`)

  step(2, 'Validate (Preview: placeholders allowed, review not required)')
  const report = validate(slug, false)
  if (report.errors.length) throw new Stop('fix the errors above and run again', 1)

  step(3, `Branch ${branchFor(slug)} from origin/main`)
  assertCleanExcept(slug)
  sh('git fetch origin', { quiet: true })
  const exists = sh(`git rev-parse --verify --quiet ${branchFor(slug)}`, { quiet: true, allowFail: true }).trim()
  sh(exists ? `git checkout ${branchFor(slug)}` : `git checkout -b ${branchFor(slug)} origin/main`, { quiet: true, mutating: true })

  step(4, 'Commit (only this demo folder)')
  const existedInMain = !!sh(`git ls-tree -r --name-only origin/main -- ${dir}`, { quiet: true }).trim()
  sh(`git add ${dir}`, { quiet: true, mutating: true })
  const staged = DRY ? 'dry' : sh('git diff --cached --name-only', { quiet: true }).trim()
  if (!staged) say('nothing to commit (the folder already matches this branch) — deploying what is there')
  else {
    const msgFile = path.join(process.env.TMPDIR || '/tmp', `demo-commit-${slug}.txt`)
    if (!DRY) fs.writeFileSync(msgFile, commitMessage(slug, existedInMain, process.env.COMMIT_TRAILER))
    sh(`git commit -q -F ${msgFile}`, { mutating: true })
  }
  sh(`git push -u origin ${branchFor(slug)}`, { quiet: true, mutating: true })

  step(5, 'Deploy to PREVIEW')
  const out = sh('vercel deploy --yes', { quiet: true, mutating: true })
  const url = DRY ? 'https://<preview>.vercel.app' : lastUrl(out)
  if (!url) throw new Stop('could not read the Preview URL from vercel deploy')

  step(6, 'Verify the Preview')
  if (!DRY) {
    const html = sh(`vercel curl /demo/${slug} --deployment ${url} -- -s -w "\\n__HTTP__%{http_code}"`, { quiet: true, allowFail: true })
    const code = (html.match(/__HTTP__(\d{3})/) || [])[1]
    say(`HTTP ${code ?? 'unknown'}   robots: ${robotsOf(html) ?? 'missing'}`)
    if (code !== '200') throw new Stop(`Preview returned ${code ?? 'no response'} for /demo/${slug}`)
    if (!/noindex, nofollow/.test(robotsOf(html) ?? '')) throw new Stop('Preview is not noindex, nofollow')
  }

  console.log(`\n✔ PREVIEW ready (needs your Vercel session):\n  ${url}/demo/${slug}`)
  console.log(`  review: ${report.config?.review ? `${report.config.review.by} · ${report.config.review.date}` : 'none yet'}   placeholders pending: ${report.placeholders.length}`)
  console.log(`\nNothing is live. To publish to Production (after Pili's OK + review in demo.json):\n  npm run demo:promote -- ${slug}`)
}

async function confirm(slug: string): Promise<void> {
  if (flags.has('--yes')) return say('--yes given: confirmation was given explicitly outside this script')
  if (!process.stdin.isTTY) throw new Stop('no TTY to ask for confirmation. Re-run with --yes ONLY after the owner explicitly confirmed.', 5)
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const a = await rl.question(`\nType the slug "${slug}" to publish to PRODUCTION: `); rl.close()
  if (a.trim() !== slug) throw new Stop('confirmation did not match — nothing was published', 5)
}

function liveSha(): string | null {
  try {
    const j = JSON.parse(sh('vercel inspect www.lagomplan.com --json', { quiet: true, allowFail: true }) || '{}')
    if (j.meta?.lagomSha) return j.meta.lagomSha
  } catch { /* fall back to the tag */ }
  return sh('git rev-parse --verify --quiet refs/tags/production', { quiet: true, allowFail: true }).trim() || null
}

async function promote(slug: string) {
  step(1, 'Validate for PRODUCTION (needs a valid review)')
  const report = validate(slug, true)
  const blockers = promoteBlockers({ environments: report.config?.environments, review: report.config?.review ?? null, errors: report.errors.filter((e) => e.path !== 'review').length })
  if (blockers.length || report.errors.length) throw new Stop(`not publishable:\n  - ${[...blockers, ...report.errors.filter((e) => e.path !== 'review').map((e) => `${e.path}: ${e.message}`)].join('\n  - ')}`, 2)

  step(2, 'What would reach Production')
  sh('git fetch origin --tags', { quiet: true })
  const live = liveSha()
  if (!live) throw new Stop('cannot tell which commit is live (no deploy meta, no "production" tag). Tag it first: git tag production <sha> && git push origin production', 3)
  const files = sh(`git diff --name-only ${live}..origin/main`, { quiet: true }).split('\n').filter(Boolean)
  const branchFiles = sh(`git diff --name-only origin/main...${branchFor(slug)}`, { quiet: true, allowFail: true }).split('\n').filter(Boolean)
  const other = otherChanges([...new Set([...files, ...branchFiles])], slug)
  say(`live: ${live.slice(0, 7)}   commits not yet live: ${sh(`git rev-list --count ${live}..origin/main`, { quiet: true }).trim()}`)
  if (other.length) {
    say(`${other.length} file(s) outside content/demos/${slug}/ would ALSO go live:`)
    other.slice(0, 40).forEach((f) => say(`  ${f}`))
    if (!flags.has('--allow-other')) throw new Stop('stopping: show these to the owner; re-run with --allow-other only if they accept them', 3)
  } else say('only this demo\'s files')

  await confirm(slug)

  step(3, `PR ${branchFor(slug)} → main, CI, merge`)
  let pr = sh(`gh pr list --head ${branchFor(slug)} --state open --json number -q '.[0].number'`, { quiet: true, allowFail: true }).trim()
  if (!pr && !DRY) {
    const body = `Demo \`${slug}\` (review: ${report.config!.review!.by}, ${report.config!.review!.date}).\n\n${process.env.PR_FOOTER ?? ''}`
    const f = path.join(process.env.TMPDIR || '/tmp', `demo-pr-${slug}.md`); fs.writeFileSync(f, body)
    pr = sh(`gh pr create --base main --head ${branchFor(slug)} --title "feat(demo): ${slug}" --body-file ${f}`, { quiet: true }).trim().split('/').pop() ?? ''
  }
  say(`PR #${pr || '(dry-run)'}`)
  if (!DRY) {
    for (let i = 0; i < 40; i++) {
      const checks = sh(`gh pr checks ${pr}`, { quiet: true, allowFail: true })
      if (/\tfail\t/.test(checks)) throw new Stop(`a CI check failed:\n${checks}\n(rerun a flaky job with: gh run rerun <id> --failed), then run promote again`, 4)
      if (checks && !/\tpending\t/.test(checks)) break
      await new Promise((r) => setTimeout(r, 30_000))
    }
  }
  sh(`gh pr merge ${pr} --merge`, { quiet: true, mutating: true })
  sh('git checkout main', { quiet: true, mutating: true })
  sh('git pull --ff-only origin main', { quiet: true, mutating: true })

  step(4, 'Deploy main to PRODUCTION (one deploy only)')
  const sha = DRY ? '<main-sha>' : sh('git rev-parse HEAD', { quiet: true }).trim()
  try { sh(`vercel deploy --prod --yes --meta lagomSha=${sha}`, { quiet: true, mutating: true }) } catch (e) {
    // The CLI can lose its connection while polling although the build goes on. Never re-run blindly.
    say('the CLI reported an error; checking whether the deploy went through (will NOT deploy again)…')
    for (let i = 0; i < 12 && liveSha() !== sha; i++) await new Promise((r) => setTimeout(r, 15_000))
    if (liveSha() !== sha) throw new Stop(`${(e as Error).message}\nproduction is not at ${sha.slice(0, 7)} yet — check the Vercel dashboard before retrying`, 6)
  }
  sh(`git tag -f production ${sha}`, { quiet: true, mutating: true })
  sh('git push -f origin refs/tags/production', { quiet: true, mutating: true })

  step(5, 'Verify on www.lagomplan.com')
  if (!DRY) {
    const get = async (p: string) => { const r = await fetch(PROD_ORIGIN + p, { redirect: 'manual' }); return { s: r.status, h: await r.text() } }
    const d = await get(`/demo/${slug}`); const g = await get('/guia/livin_condesa')
    say(`/demo/${slug}: HTTP ${d.s}, robots ${robotsOf(d.h)}`)
    say(`/guia/livin_condesa: HTTP ${g.s}, robots ${robotsOf(g.h)}`)
    if (d.s !== 200 || !/noindex, nofollow/.test(robotsOf(d.h) ?? '')) throw new Stop('the demo is not serving 200 + noindex, nofollow on Production', 6)
    if (g.s !== 200 || !/index, follow/.test(robotsOf(g.h) ?? '')) throw new Stop('livin_condesa changed on Production', 6)
  }
  console.log(`\n✔ LIVE (noindex): ${demoUrl(PROD_ORIGIN, slug)}\n  (not shared yet — send it only after approval; visits log with ref=${refFor(slug)})`)
}

async function main() {
  if (!['preview', 'promote'].includes(stage ?? '') || positional.length !== 1) {
    console.error('usage:\n  npm run demo:preview -- <slug> [--json <file>] [--logo <file>] [--dry-run]\n  npm run demo:promote -- <slug> [--yes] [--allow-other] [--dry-run]')
    process.exit(2)
  }
  let slug: string
  try { slug = assertSlug(positional[0]) } catch (e) { throw new Stop((e as Error).message, 2) }
  preflight()
  if (DRY) console.log('DRY RUN: nothing is changed; mutating commands are only printed.')
  await (stage === 'preview' ? preview(slug) : promote(slug))
}

main().catch((e) => {
  if (e instanceof Stop) { console.error(`\n✖ ${e.message}`); process.exit(e.code) }
  console.error(e); process.exit(1)
})
