/**
 * tests/trips-policies.test.ts — E14-1 (R1): replays supabase/migrations in order and checks
 * which policies exist on public.trips once they have all run.
 *   npx tsx tests/trips-policies.test.ts
 */
import fs from 'node:fs'
import path from 'node:path'

let failed = 0
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) { failed++; console.error(`FAIL ${name}`, extra ?? '') }
}

const dir = path.join(process.cwd(), 'supabase', 'migrations')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
const policies = new Map<string, string>() // name → statement (the last CREATE seen)

for (const f of files) {
  // Drop SQL comments first: older migrations keep commented-out CREATE POLICY lines.
  const sql = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter((l) => !l.trim().startsWith('--')).join('\n')
  for (const m of sql.matchAll(/CREATE POLICY\s+"([^"]+)"\s+ON\s+(?:"?public"?\.)?"?trips"?\b([^;]*);/gi)) policies.set(m[1], m[2].replace(/\s+/g, ' ').trim())
  for (const m of sql.matchAll(/DROP POLICY(?:\s+IF EXISTS)?\s+"([^"]+)"\s+ON\s+(?:"?public"?\.)?"?trips"?/gi)) policies.delete(m[1])
}

const names = [...policies.keys()].sort()
ok('the broad shared-trips read policy is gone after every migration has run', !policies.has('authenticated_read_shared_trips'), names)
ok('the world-readable "Public can read trips by slug" policy is gone', !policies.has('Public can read trips by slug'), names)
ok('no remaining policy on trips reads rows by is_shared', [...policies.values()].every((s) => !/is_shared/i.test(s)), [...policies.entries()])
ok('no remaining SELECT policy on trips is USING (true)', [...policies.values()].every((s) => !/USING\s*\(\s*true\s*\)/i.test(s)), [...policies.entries()])
ok('the owner can still read their own trips', policies.has('trips_select_own'), names)

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log(`trips-policies: all passed (remaining policies: ${names.join(', ')})`)
