/**
 * tests/agenda-schema.test.ts — content/guia/cdmx/agenda.json: strict Zod
 * schema, the build-failing loader, and the editorial rules the seed must keep.
 *   npx tsx tests/agenda-schema.test.ts
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { agendaSchema } from '../content/guia/agenda/schema'
import { loadAgenda, parseAgenda } from '../content/guia/agenda'

let failed = 0
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) { failed++; console.error(`FAIL ${name}${extra !== undefined ? '\n   ' + JSON.stringify(extra) : ''}`) }
}
const seed = () => JSON.parse(fs.readFileSync('content/guia/cdmx/agenda.json', 'utf8'))
const fails = (mutate: (a: any) => void) => { const a = seed(); mutate(a); return !agendaSchema.safeParse(a).success }
const errorsOf = (mutate: (a: any) => void) => { const a = seed(); mutate(a); const r = agendaSchema.safeParse(a); return r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`) }

// 1. The real file is valid.
ok('seed is valid', agendaSchema.safeParse(seed()).success, errorsOf(() => {}))
ok('loadAgenda reads the real file', loadAgenda().events.length === seed().events.length)

// 2. Strictness: typos fail instead of being ignored.
ok('unknown top-level key rejected', fails((a) => { a.extra = 1 }))
ok('unknown event key rejected', fails((a) => { a.events[0].featurd = true }))
ok('unknown day-trip key rejected', fails((a) => { a.dayTrips[0].photo = 'x.jpg' }))
ok('wrong schema_version rejected', fails((a) => { a.schema_version = 2 }))
ok('empty events rejected', fails((a) => { a.events = [] }))
ok('empty day trips rejected', fails((a) => { a.dayTrips = [] }))

// 3. Field rules.
ok('category must be food|culture|sport|outdoors|music|city', fails((a) => { a.events[0].category = 'nightlife' }))
ok('impossible date rejected', errorsOf((a) => { a.events[0].start = '2026-02-31' }).some((m) => m.includes('not a real date')))
ok('non-ISO date rejected', fails((a) => { a.events[0].end = '31/10/2026' }))
ok('end before start rejected', errorsOf((a) => { a.events[0].start = '2026-11-02'; a.events[0].end = '2026-11-01' }).some((m) => m.includes('ends before it starts')))
ok('both languages required (title)', fails((a) => { delete a.events[0].title.en }))
ok('both languages required (why)', fails((a) => { a.events[0].why = { es: 'solo español' } }))
ok('both languages required (dayTrip length)', fails((a) => { delete a.dayTrips[0].length.es }))
ok('empty text rejected', fails((a) => { a.events[0].place.es = '  ' }))
ok('event url must be https', fails((a) => { a.events[0].url = 'http://example.com' }))
ok('event url cannot be null', fails((a) => { a.events[0].url = null }))
ok('event url is optional', !fails((a) => { delete a.events[0].url }))
ok('place, why, hours, cost and time are optional', !fails((a) => { for (const k of ['place', 'why', 'hours', 'cost', 'time']) delete a.events[0][k] }))
ok('recurring is required and non-empty', fails((a) => { a.recurring = [] }) && fails((a) => { delete a.recurring }))
ok('recurring weekdays: 0–6 only, no repeats', fails((a) => { a.recurring[0].weekdays = [7] }) && fails((a) => { a.recurring[0].weekdays = [2, 2] }))
ok('recurring: unknown key rejected', fails((a) => { a.recurring[0].price = 1 }))
ok('duplicate id across events and recurring', errorsOf((a) => { a.recurring[0].id = a.events[0].id }).some((m) => m.includes('duplicate id')))
ok('day trip url may be null (placeholder link)', !fails((a) => { a.dayTrips[0].url = null }))
ok('day trip url, when set, must be https', fails((a) => { a.dayTrips[0].url = 'ftp://x' }))
ok('cost is optional (no price row)', !fails((a) => { delete a.events[1].cost }))
ok('status must be verified|to_verify', fails((a) => { a.events[0].status = 'maybe' }))
ok('verified needs verifiedAt', errorsOf((a) => { const e = a.events.find((x: any) => x.status === 'verified'); delete e.verifiedAt }).some((m) => m.includes('verifiedAt')))
ok('verified needs verifiedBy', errorsOf((a) => { const e = a.events.find((x: any) => x.status === 'verified'); delete e.verifiedBy }).some((m) => m.includes('verifiedBy')))
ok('to_verify does not need verifiedAt', !fails((a) => { delete a.events.find((e: any) => e.status === 'to_verify').verifiedAt }))
ok('id format', fails((a) => { a.events[0].id = 'Has Spaces' }))
ok('duplicate id inside events', errorsOf((a) => { a.events[1].id = a.events[0].id }).some((m) => m.includes('duplicate id')))
ok('duplicate id across events and day trips', errorsOf((a) => { a.dayTrips[0].id = a.events[0].id }).some((m) => m.includes('duplicate id')))
ok('featured must be a boolean', fails((a) => { a.events[0].featured = 'yes' }))

// 4. The loader fails the build with every problem listed.
{
  const bad = seed(); bad.events[0].category = 'nope'; bad.events[1].url = 'http://x'
  let msg = ''
  try { parseAgenda(bad) } catch (e) { msg = (e as Error).message }
  ok('parseAgenda throws', msg.startsWith('Invalid content/guia/cdmx/agenda.json'), msg)
  ok('…listing the path of each problem', msg.includes('events[0].category') && msg.includes('events[1].url'), msg)
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'agenda-')), 'agenda.json')
  fs.writeFileSync(tmp, JSON.stringify(bad))
  let thrown = false
  try { loadAgenda(tmp) } catch { thrown = true }
  ok('loadAgenda(file) throws on an invalid file', thrown)
  fs.writeFileSync(tmp, '{ not json')
  let msg2 = ''
  try { loadAgenda(tmp) } catch (e) { msg2 = (e as Error).message }
  ok('loadAgenda throws a readable error on broken JSON', msg2.startsWith('Cannot read'), msg2)
}

// 5. Editorial rules the seed must keep (Elena's decisions of 2026-10-28).
const a = seed()
const byId = (id: string) => a.events.find((e: any) => e.id === id)
const VERIFIED = ['desfile-dia-de-muertos', 'cacao-para-todos', 'gp-mexico-f1', 'ofrenda-monumental-zocalo', 'feria-no-estaban-muertos', 'el-camino-reforma', 'nba-mexico-city-game', 'corona-capital', 'karol-g', 'puente-de-la-revolucion', 'festival-chapultepec-dia-de-muertos', 'iluminacion-zocalo']
ok('verified events are the parade, F1 and the ten Elena approved on 2026-10-29', a.events.filter((e: any) => e.status === 'verified').map((e: any) => e.id).join() === VERIFIED.join(), a.events.filter((e: any) => e.status === 'verified').map((e: any) => e.id))
ok('still to_verify: Food & Wine, L\'Étape, Carrera del Ring + the 7 researched November events (none verified yet)', a.events.filter((e: any) => e.status === 'to_verify').map((e: any) => e.id).join() === 'food-wine-mirando-al-sur,letape-cdmx,carrera-del-ring,ultra-mexico,vitae-fest,garbage-zocalo,time-warp-mexico,nfl-mexico-city-game,flow-fest,aitana-auditorio')
ok('researched events carry their source in checkNote and add no unverified link', ['ultra-mexico', 'vitae-fest', 'garbage-zocalo', 'time-warp-mexico', 'nfl-mexico-city-game', 'flow-fest', 'aitana-auditorio'].every((id) => /^Source:/.test(byId(id).checkNote) && byId(id).url === undefined))
ok('parade: Sat 31 Oct, 14:00, Reforma (Diana Cazadora) → Zócalo, Chilango source', byId('desfile-dia-de-muertos').start === '2026-10-31' && byId('desfile-dia-de-muertos').end === '2026-10-31' && byId('desfile-dia-de-muertos').time.es === '14:00' && /Diana Cazadora\) → Zócalo/.test(byId('desfile-dia-de-muertos').place.es) && byId('desfile-dia-de-muertos').url.startsWith('https://www.chilango.com/'))
ok('Corona Capital: Curva 4 confirmed, no caveat left in the note', !/not on/.test(byId('corona-capital').checkNote) && /Curva 4.*confirmed/.test(byId('corona-capital').checkNote))
ok('every verified event has verifiedAt + verifiedBy', a.events.filter((e: any) => e.status === 'verified').every((e: any) => e.verifiedAt && e.verifiedBy))
ok('Cacao ends Nov 1 (not Nov 2)', byId('cacao-para-todos').end === '2026-11-01')
ok('NBA: tickets sold out / experience packages only is recorded', /agotados/.test(byId('nba-mexico-city-game').why.es) && /sold out/.test(byId('nba-mexico-city-game').why.en))
ok('the two new Día de Muertos events: Oct 29 → Nov 4, official source', ['festival-chapultepec-dia-de-muertos', 'iluminacion-zocalo'].every((id) => byId(id).start === '2026-10-29' && byId(id).end === '2026-11-04' && byId(id).url === 'https://mexicocity.cdmx.gob.mx/e/dia-de-muertos-en-la-ciudad-de-mexico/'))
ok('Chapultepec festival: culture, 2nd section; Zócalo lighting: city', byId('festival-chapultepec-dia-de-muertos').category === 'culture' && /2ª sección/.test(byId('festival-chapultepec-dia-de-muertos').place.es) && byId('iluminacion-zocalo').category === 'city')
ok('F1: verifiedAt + verifiedBy set', byId('gp-mexico-f1').verifiedAt === '2026-10-22' && byId('gp-mexico-f1').verifiedBy === 'Elena')
ok('F1: pricing removed (no cost row)', byId('gp-mexico-f1').cost === undefined)
ok('F1: only confirmed facts (race Sunday Nov 1), no placeholder', byId('gp-mexico-f1').hours.es === 'Carrera el domingo 1 de noviembre' && !/\[/.test(JSON.stringify(byId('gp-mexico-f1'))))
ok('no price amount anywhere in the file', !JSON.stringify(a).includes('$'))
const strings = (v: unknown): string[] => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []
ok('no "[placeholder]" in any string of the file', strings(a).filter((t) => /\[[^\]]+\]/.test(t)).length === 0, strings(a).filter((t) => /\[[^\]]+\]/.test(t)))
ok('featured events: the parade and Corona Capital only', a.events.filter((e: any) => e.featured).map((e: any) => e.id).join() === 'desfile-dia-de-muertos,corona-capital')
ok('Corona Capital: Nov 20–22, music, Curva 4 venue, link', byId('corona-capital').start === '2026-11-20' && byId('corona-capital').end === '2026-11-22' && byId('corona-capital').category === 'music' && /Curva 4/.test(byId('corona-capital').place.es) && byId('corona-capital').url.includes('record.com.mx'))
ok('Karol G: Nov 13, Estadio GNP Seguros, nmas link', byId('karol-g').start === '2026-11-13' && byId('karol-g').end === '2026-11-13' && byId('karol-g').place.es === 'Estadio GNP Seguros' && byId('karol-g').url.includes('nmas.com.mx'))
ok('Puente de la Revolución: Nov 14–16, city, no venue', byId('puente-de-la-revolucion').start === '2026-11-14' && byId('puente-de-la-revolucion').end === '2026-11-16' && byId('puente-de-la-revolucion').category === 'city' && byId('puente-de-la-revolucion').place === undefined)
ok('lucha libre: Tue + Fri, shown as Noche/Evening', JSON.stringify(a.recurring.find((r: any) => r.id === 'lucha-libre-arena-mexico').weekdays) === '[2,5]' && a.recurring.find((r: any) => r.id === 'lucha-libre-arena-mexico').time.es === 'Noche' && a.recurring.find((r: any) => r.id === 'lucha-libre-arena-mexico').time.en === 'Evening')
ok('the sunset viewpoint has no weekdays (weekly row only)', a.recurring.find((r: any) => r.id === 'mirador-torre-latinoamericana').weekdays.length === 0)
ok('the four weekly items live in recurring', a.recurring.map((r: any) => r.id).join() === 'muevete-en-bici,lucha-libre-arena-mexico,bazar-sabado-san-angel,mirador-torre-latinoamericana')
ok('day trips: Xochimilco, Teotihuacán, Los Dinamos, Tepoztlán — no invented links', a.dayTrips.map((t: any) => t.id).join() === 'xochimilco,teotihuacan,los-dinamos,tepoztlan' && a.dayTrips.every((t: any) => t.url === null))
ok('every to_verify event carries a QA note for agenda:check', a.events.filter((e: any) => e.status === 'to_verify').every((e: any) => e.checkNote))
ok('no event is dated outside 2026', a.events.every((e: any) => e.start.startsWith('2026') && e.end.startsWith('2026')))

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('agenda-schema: all passed')
