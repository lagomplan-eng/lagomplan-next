/**
 * tests/agenda-public.test.ts — the agenda page data. What a Server Component hands to GuiaClient is
 * serialized into the HTML of every visitor, so it must hold only what the page can show:
 *   Production → verified events only; every environment → none of the internal fields.
 * Fails if an unverified event or a note field reaches the props.   npx tsx tests/agenda-public.test.ts
 */
import fs from 'node:fs'
import { loadAgenda } from '../content/guia/agenda'
import { agendaPageProps, INTERNAL_EVENT_FIELDS, publicAgenda } from '../content/guia/agenda/public'

let failed = 0
const ok = (name: string, cond: boolean, extra?: unknown) => { if (!cond) { failed++; console.error(`FAIL ${name}${extra !== undefined ? '\n   ' + JSON.stringify(extra) : ''}`) } }

const raw = loadAgenda()
const unverified = raw.events.filter((e) => e.status !== 'verified')
const notes = raw.events.map((e) => e.checkNote).filter(Boolean) as string[]
ok('the seed has unverified events and notes to leak (otherwise this test proves nothing)', unverified.length > 0 && notes.length > 0)

/** Everything a page would serialize for the props. */
const serialized = (env: string | undefined) => JSON.stringify(agendaPageProps(raw, env))
// Events only: day trips legitimately carry a rendered "why".
const forbiddenKeys = (env: string | undefined) => { const ev = JSON.stringify(agendaPageProps(raw, env).agenda.events); return INTERNAL_EVENT_FIELDS.filter((k) => ev.includes(`"${k}"`)) }

for (const env of ['production', 'preview', 'development', undefined]) {
  const json = serialized(env)
  ok(`[${env}] no internal field in the page data (checkNote, verifiedAt, verifiedBy, why, hours, cost)`, forbiddenKeys(env).length === 0, forbiddenKeys(env))
  ok(`[${env}] no QA note text in the page data`, !notes.some((n) => json.includes(JSON.stringify(n).slice(1, -1))), notes.filter((n) => json.includes(JSON.stringify(n).slice(1, -1))))
  ok(`[${env}] "verifiedBy" names nobody`, !json.includes('Elena'))
}

// Production: verified only.
{
  const p = agendaPageProps(raw, 'production')
  const json = serialized('production')
  ok('production: showUnverified is false', p.showUnverified === false)
  ok('production: every event is verified', p.agenda.events.length > 0 && p.agenda.events.every((e) => e.status === 'verified'))
  ok('production: the count equals the verified events of the file', p.agenda.events.length === raw.events.length - unverified.length)
  ok('production: no unverified id, title or place anywhere in the page data', !unverified.some((e) => json.includes(`"${e.id}"`) || json.includes(JSON.stringify(e.title.es)) || json.includes(JSON.stringify(e.title.en))), unverified.filter((e) => json.includes(`"${e.id}"`)).map((e) => e.id))
  ok('production: the string "to_verify" is not in the page data', !json.includes('to_verify'))
  ok('production: displayed fields survive (title, dates, category, place, url) for a verified event', (() => { const e = p.agenda.events.find((x) => x.id === 'gp-mexico-f1')!; return !!(e.title.es && e.start && e.end && e.category && e.place && e.url) })())
  ok('production: recurring items and day trips are still sent (they are rendered)', p.agenda.recurring.length === raw.recurring.length && p.agenda.dayTrips.length === raw.dayTrips.length)
}

// Preview / local: unverified events stay (they render with the pill) but without notes.
{
  const p = agendaPageProps(raw, 'preview')
  ok('preview: showUnverified is true and the unverified events are there', p.showUnverified === true && p.agenda.events.length === raw.events.length)
  ok('preview: they keep status so the pill can render', p.agenda.events.filter((e) => e.status === 'to_verify').length === unverified.length)
}
ok('VERCEL_ENV unset (local) behaves like Preview', agendaPageProps(raw, undefined).showUnverified === true)

// publicAgenda on a hostile input: a note hidden in an unexpected place is still not an event field we keep.
{
  const evil = { ...raw, events: raw.events.map((e, i) => (i === 0 ? { ...e, checkNote: 'SECRET-NOTE', verifiedBy: 'Someone', why: { es: 'x', en: 'x' } } : e)) }
  const json = JSON.stringify(publicAgenda(evil, false))
  ok('publicAgenda strips internal fields even when set on the first event', !json.includes('SECRET-NOTE') && !json.includes('Someone'))
}
ok('publicAgenda does not mutate its input', raw.events.some((e) => e.checkNote) && raw.events.every((e) => e.status !== undefined))

// Regression guard: the page must go through agendaPageProps, never hand the loaded file to the client.
{
  const src = fs.readFileSync('app/demo/[prospect]/page.tsx', 'utf8')
  ok('the demo page builds the agenda props with agendaPageProps()', src.includes('agendaPageProps(loadAgenda()'))
  ok('the demo page never passes loadAgenda() straight through', !/agenda:\s*loadAgenda\(\)/.test(src))
  const other = ['app/guia/[partner]/page.tsx'].map((f) => fs.readFileSync(f, 'utf8')).join('\n')
  ok('the /guia page loads no agenda at all', !/loadAgenda|agenda/.test(other))
}

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('agenda-public: all passed')
