// npm run demo:visits -- [--days 30] [--slug <slug>] [--table demo|guide|both]
//
// Aggregated visits to demos (demo_visits) and guides (guide_visits).
// READ-ONLY and deliberately narrow:
//   - only SELECT on those two tables, only slug, ref, lang, ua_summary, created_at
//   - always without ref=qa-elena|pili and without ua_summary "bot:*"
//   - prints counts by slug, ref and day — never individual rows
//   - the service role key is read from .env.local and is never printed

import fs from 'node:fs'
import path from 'node:path'
import { MAX_DAYS, MAX_PAGES, PAGE, TABLES, aggregate, assertColumns, buildPath, render, type Row, type TableKey } from './lib/visits-core'

function readEnvLocal(): Record<string, string> {
  const file = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(file)) { console.error('✖ .env.local not found'); process.exit(2) }
  const env: Record<string, string> = {}
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = /^(NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY)=(.*)$/.exec(line.trim())
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return env
}

const args = process.argv.slice(2)
const opt = (n: string) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined }
const days = Math.min(Math.max(parseInt(opt('--days') ?? '30', 10) || 30, 1), MAX_DAYS)
const slug = opt('--slug')
const which = (opt('--table') ?? 'both') as 'demo' | 'guide' | 'both'
if (!['demo', 'guide', 'both'].includes(which)) { console.error('✖ --table must be demo, guide or both'); process.exit(2) }

async function main() {
  const env = readEnvLocal()
  const base = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) { console.error('✖ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env.local'); process.exit(2) }

  const since = new Date(Date.now() - days * 864e5).toISOString()
  const keys: TableKey[] = which === 'both' ? ['demo', 'guide'] : [which]
  for (const k of keys) {
    const table = TABLES[k]
    const rows: Row[] = []
    for (let page = 0; page < MAX_PAGES; page++) {
      const res = await fetch(base + buildPath(table, since, page * PAGE, slug), { headers: { apikey: key, Authorization: `Bearer ${key}` } })
      if (!res.ok) {
        // Status + PostgREST message only: never headers, never the key.
        const body = await res.json().catch(() => ({})) as { message?: string }
        console.error(`✖ ${table}: HTTP ${res.status}${body.message ? ` — ${body.message}` : ''}`); process.exit(1)
      }
      const batch = await res.json() as Record<string, unknown>[]
      batch.forEach(assertColumns)
      rows.push(...(batch as unknown as Row[]))
      if (batch.length < PAGE) break
      if (page === MAX_PAGES - 1) console.error(`⚠ ${table}: stopped at ${MAX_PAGES * PAGE} rows — narrow with --days or --slug`)
    }
    console.log(render(table, days, aggregate(rows)) + '\n')
  }
}
main().catch((e) => { console.error('✖', (e as Error).message); process.exit(1) })
