// npm run demo:check -- <slug | --all> [--strict] [--production]
//
// Validates content/demos/<slug>/demo.json with readable errors, lists the
// "[placeholders]" still pending, and exits 1 on any error.
//   --strict      placeholders are errors (always on for kind "partner")
//   --production  also requires a valid review { by, date } (Preview doesn't)

import { formatReport, listDemoFolders, validateDemoFolder } from '../content/guia/demos/validate'

const args = process.argv.slice(2)
const flags = new Set(args.filter((a) => a.startsWith('--')))
const slugs = args.filter((a) => !a.startsWith('--'))
const targets = flags.has('--all') ? listDemoFolders() : slugs

if (!targets.length) {
  console.error('usage: npm run demo:check -- <slug | --all> [--strict] [--production]')
  process.exit(2)
}

let bad = 0
for (const slug of targets) {
  const report = validateDemoFolder(slug, { strict: flags.has('--strict'), production: flags.has('--production') })
  console.log(formatReport(report))
  if (report.errors.length) bad++
}
console.log(bad ? `\n${bad} of ${targets.length} demo(s) failed` : `\n${targets.length} demo(s) OK`)
process.exit(bad ? 1 : 0)
