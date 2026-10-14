// npm run demo:review -- <slug> --by <Reviewer> --date YYYY-MM-DD [--replace]
//
// Records the editorial review in content/demos/<slug>/demo.json (only the
// `review` field changes), then runs the Production validation. It does NOT
// commit, push or deploy: `demo:preview` commits the folder, `demo:promote`
// publishes (after your explicit confirmation).

import fs from 'node:fs'
import path from 'node:path'
import { DEMOS_DIR, formatReport, loadReviewers, validateDemoFolder } from '../content/guia/demos/validate'
import { assertSlug } from './lib/demo-publish-core'
import { applyReview } from './lib/demo-review-core'

const args = process.argv.slice(2)
const opt = (n: string) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined }
const slug = args.find((a, i) => !a.startsWith('--') && !['--by', '--date'].includes(args[i - 1]))
const by = opt('--by'); const date = opt('--date')

try {
  assertSlug(slug)
  if (!by || !date) throw new Error('usage: npm run demo:review -- <slug> --by <Reviewer> --date YYYY-MM-DD [--replace]')
  const file = path.join(DEMOS_DIR, slug!, 'demo.json')
  if (!fs.existsSync(file)) throw new Error(`${file} doesn't exist`)
  const res = applyReview(JSON.parse(fs.readFileSync(file, 'utf8')), by, date, loadReviewers(), args.includes('--replace'))
  if (!res.ok) { console.error(`✖ review not recorded:\n  - ${res.errors.join('\n  - ')}`); process.exit(1) }
  fs.writeFileSync(file, JSON.stringify(res.next, null, 2) + '\n')
  console.log(`✔ review recorded in content/demos/${slug}/demo.json: ${by} · ${date}\n`)
  const report = validateDemoFolder(slug!, { production: true })
  console.log(formatReport(report))
  console.log(`\nNext (nothing is committed or live yet):\n  npm run demo:preview -- ${slug}   # commits the folder, deploys a Preview\n  npm run demo:promote -- ${slug}   # asks for confirmation, then publishes`)
  process.exit(report.errors.length ? 1 : 0)
} catch (e) { console.error('✖', (e as Error).message); process.exit(2) }
