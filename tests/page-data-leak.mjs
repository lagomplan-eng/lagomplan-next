#!/usr/bin/env node
/**
 * tests/page-data-leak.mjs <baseUrl> [--production]
 *
 * Rendered-page check: fetches every guide page from a RUNNING server and fails if its HTML (which
 * includes the page data, i.e. the serialized props) contains an internal agenda field or, with
 * --production (a server built/started with VERCEL_ENV=production), any unverified event or QA note.
 *   VERCEL_ENV=production npx next build && VERCEL_ENV=production npx next start -p 3200
 *   node tests/page-data-leak.mjs http://localhost:3200 --production
 */
import fs from 'node:fs'
import path from 'node:path'

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const production = process.argv.includes('--production')
const agenda = JSON.parse(fs.readFileSync('content/guia/cdmx/agenda.json', 'utf8'))
const unverified = agenda.events.filter((e) => e.status !== 'verified')
const notes = agenda.events.map((e) => e.checkNote).filter(Boolean)

// Every guide page: /guia/<partner> (partners are code, so list the public ones) and every demo folder.
const demos = fs.readdirSync(path.join('content', 'demos'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `/demo/${d.name}`)
const guias = ['livin_condesa', 'livin_roma', 'livin_polanco', 'demo'].map((s) => `/guia/${s}`)

// The page data is JSON inside script tags: quotes appear escaped (\") there, so test both spellings.
const has = (html, needle) => html.includes(needle) || html.includes(needle.replace(/"/g, '\\"'))
const INTERNAL_KEYS = ['checkNote', 'verifiedAt', 'verifiedBy']

let failed = 0, checked = 0
for (const url of [...guias, ...demos]) {
  const res = await fetch(base + url)
  if (res.status === 404) { console.log(`skip ${url} (404 here)`); continue }
  const html = await res.text()
  checked++
  const problems = []
  for (const k of INTERNAL_KEYS) if (has(html, `"${k}"`)) problems.push(`internal field "${k}"`)
  if (production) {
    if (html.includes('to_verify')) problems.push('"to_verify"')
    for (const e of unverified) {
      if (has(html, `"${e.id}"`)) problems.push(`unverified event id ${e.id}`)
      if (html.includes(e.title.en) || html.includes(e.title.es)) problems.push(`unverified event title "${e.title.en}"`)
    }
    for (const n of notes) if (html.includes(n.slice(0, 40))) problems.push(`QA note "${n.slice(0, 40)}…"`)
  }
  if (problems.length) { failed++; console.error(`FAIL ${url}\n   ${[...new Set(problems)].slice(0, 8).join('\n   ')}`) } else console.log(`OK   ${url}`)
}
if (checked === 0) { console.error('no page checked'); process.exit(1) }
console.log(`\n${checked - failed}/${checked} ok${production ? ' (production mode: unverified events + notes checked)' : ''}`)
process.exit(failed ? 1 : 0)
