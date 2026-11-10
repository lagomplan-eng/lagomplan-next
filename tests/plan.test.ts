/**
 * tests/plan.test.ts — run: npx tsx tests/plan.test.ts
 *
 * The shared plan (experiences + hotels): storage format, v1 migration, grouping and the
 * planner handoff destination.
 */
import { parsePlan, serializePlan, resolvePlan, togglePlan, planDestination, groupPlan, PLAN_MAX, type PlanEntry, type PlanRef } from '../lib/plan'
import { getPlanCatalog } from '../lib/plan-catalog'

let pass = 0, fail = 0
function eq(a: unknown, b: unknown, msg: string) {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++
  else { fail++; console.error(`FAIL ${msg}\n  got      ${JSON.stringify(a)}\n  expected ${JSON.stringify(b)}`) }
}
const x = (id: string): PlanRef => ({ type: 'experience', id })
const h = (id: string): PlanRef => ({ type: 'hotel', id })

// parse: tolerant
eq(parsePlan(null), [], 'null')
eq(parsePlan(''), [], 'empty')
eq(parsePlan('not json'), [], 'garbage')
eq(parsePlan('{"v":2}'), [], 'no items')
eq(parsePlan('{"v":2,"items":"x"}'), [], 'items not array')
eq(parsePlan('{"v":2,"items":[{"type":"hotel","id":"a"},{"type":"spa","id":"b"},{"type":"experience"},null,3,{"type":"experience","id":""}]}'), [h('a')], 'drops unknown types, missing ids, junk')
eq(parsePlan('{"v":2,"items":[{"type":"hotel","id":"a"},{"type":"hotel","id":"a"},{"type":"experience","id":"a"}]}'), [h('a'), x('a')], 'dedupes per type: same id may exist as hotel and experience')

// migration from v1 (experiences only) and bare arrays
eq(parsePlan('{"v":1,"ids":["a",3,"","b","a",null]}'), [x('a'), x('b')], 'v1 ids become experiences')
eq(parsePlan('["a","b"]'), [x('a'), x('b')], 'bare array of ids → experiences')
eq(parsePlan('[{"type":"hotel","id":"z"},"a"]'), [h('z'), x('a')], 'mixed bare array')
eq(parsePlan(serializePlan([x('a'), h('b')])), [x('a'), h('b')], 'v2 round trip')
eq(JSON.parse(serializePlan([x('a')])), { v: 2, items: [{ type: 'experience', id: 'a' }] }, 'v2 shape')
eq(parsePlan(serializePlan(Array.from({ length: 50 }, (_, i) => x(`id${i}`)))).length, PLAN_MAX, 'capped')

// toggle
eq(togglePlan([], x('a')), [x('a')], 'add')
eq(togglePlan([x('a'), h('b')], x('a')), [h('b')], 'remove')
eq(togglePlan([x('a')], h('a')), [x('a'), h('a')], 'same id, other type = another item')
const full = Array.from({ length: PLAN_MAX }, (_, i) => x(`id${i}`))
eq(togglePlan(full, h('new')), full, 'cap blocks add')
eq(togglePlan(full, x('id0')).length, PLAN_MAX - 1, 'cap still allows remove')

// resolve + destination + grouping, against real data
const es = getPlanCatalog('es')
const en = getPlanCatalog('en')
const exps = es.filter(e => e.type === 'experience')
const hotels = es.filter(e => e.type === 'hotel')
eq([exps.length, hotels.length], [67, 186], 'catalog: 67 experiences + 186 hotels')
eq(new Set(es.map(e => `${e.type}:${e.id}`)).size, es.length, 'catalog keys are unique')
const byDest = (list: PlanEntry[]) => { const m = new Map<string, PlanEntry[]>(); for (const e of list) m.set(e.destinationSlug, [...(m.get(e.destinationSlug) ?? []), e]); return Array.from(m.values()) }
const A = byDest(exps).find(d => d.length >= 2)!
const B = byDest(exps).find(d => d !== A)!

eq(resolvePlan([x('nope'), x(A[0].id)], es).map(e => e.id), [A[0].id], 'unknown ids dropped')
eq(resolvePlan([h('nope')], es), [], 'unknown hotel dropped')
eq(resolvePlan([x(A[1].id), x(A[0].id)], es).map(e => e.id), [A[1].id, A[0].id], 'plan order kept')
eq(resolvePlan([{ type: 'hotel', id: A[0].id }], es), [], 'an experience id is not a hotel id')
eq(planDestination([]), null, 'empty plan')

const one = planDestination([A[0]])!
eq([one.slug, one.count, one.mixed], [A[0].destinationSlug, 1, false], 'single destination')
eq(one.name, A[0].destinationName, 'uses the locale short name')
const mixedMajority = planDestination([B[0], A[0], A[1]])!
eq([mixedMajority.slug, mixedMajority.count, mixedMajority.mixed], [A[0].destinationSlug, 2, true], 'most items wins even if added later')
const tie = planDestination([B[0], A[0]])!
eq(tie.slug, B[0].destinationSlug, 'tie goes to the destination added first')
eq([tie.mixed, tie.tied], [true, true], 'tie is mixed and flagged')
eq([mixedMajority.tied, one.tied], [false, false], 'no tie for a majority / a single destination')

// hotels and experiences at the same place share a destination key and name
const sharedHotel = hotels.find(hh => exps.some(e => e.destinationSlug === hh.destinationSlug))!
const sharedExp = exps.find(e => e.destinationSlug === sharedHotel.destinationSlug)!
eq(sharedHotel.destinationName, sharedExp.destinationName, 'hotel and experience at one place: same destination name')
const together = planDestination([sharedExp, sharedHotel])!
eq([together.count, together.mixed], [2, false], 'an experience and a hotel at one place are one destination')

// grouping for the panel
const g = groupPlan([hotels[0], exps[0], hotels[1]])
eq(g.map(x => [x.type, x.items.length]), [['experience', 1], ['hotel', 2]], 'experiences first, then hotels')
eq(groupPlan([hotels[0]]).map(x => x.type), ['hotel'], 'empty groups are omitted')

// locale: the same plan hands the planner the EN name in EN
const enA = en.find(e => e.type === 'experience' && e.id === A[0].id)!
eq(planDestination([enA])!.name, enA.destinationName, 'EN name')
eq(es.map(e => `${e.type}:${e.id}`), en.map(e => `${e.type}:${e.id}`), 'same plan keys in ES and EN')

console.log(`${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
