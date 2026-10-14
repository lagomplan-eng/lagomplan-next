/** tests/demo-visits.test.ts — the read rules of `npm run demo:visits`. Run: npx tsx tests/demo-visits.test.ts */
import { aggregate, assertColumns, buildPath, device, keep, render, COLUMNS, TABLES, type Row } from '../scripts/lib/visits-core'

let failed = 0
const eq = (n: string, g: unknown, w: unknown) => { if (JSON.stringify(g) !== JSON.stringify(w)) { failed++; console.error(`FAIL ${n}\n  got:  ${JSON.stringify(g)}\n  want: ${JSON.stringify(w)}`) } }
const throws = (n: string, fn: () => unknown, frag: string) => { try { fn(); failed++; console.error(`FAIL ${n}: no throw`) } catch (e) { if (!String((e as Error).message).includes(frag)) { failed++; console.error(`FAIL ${n}: ${(e as Error).message}`) } } }

// whitelist: only the two visit tables, only five columns
eq('tables', Object.values(TABLES), ['demo_visits', 'guide_visits'])
eq('columns', [...COLUMNS], ['slug', 'ref', 'lang', 'ua_summary', 'created_at'])
for (const t of ['profiles', 'trips', 'demo_visits; drop', 'auth.users', '']) throws(`blocks table ${JSON.stringify(t)}`, () => buildPath(t, '2026-10-01T00:00:00Z', 0), 'not allowed')
const p = buildPath('demo_visits', '2026-10-01T00:00:00.000Z', 1000, 'host-me-tender')
eq('select is the fixed column list', p.includes('select=slug,ref,lang,ua_summary,created_at&'), true)
eq('excludes bots server-side', p.includes('ua_summary=not.like.bot:*'), true)
eq('keeps NULL refs, drops qa-elena/pili', p.includes('or=(ref.is.null,ref.not.in.(qa-elena,pili))'), true)
eq('paging', [p.includes('limit=1000'), p.includes('offset=1000')], [true, true])
eq('slug filter', p.includes('slug=eq.host-me-tender'), true)
eq('no select=*', p.includes('select=*'), false)
throws('bad slug filter', () => buildPath('demo_visits', 'x', 0, "a' or 1=1"), 'invalid slug')

// defense in depth
const row = (o: Partial<Row>): Row => ({ slug: 'host-me-tender', ref: null, lang: 'en', ua_summary: 'desktop:chrome', created_at: '2026-10-14T10:00:00Z', ...o })
eq('keeps a normal visit', keep(row({})), true)
eq('keeps NULL ref', keep(row({ ref: null })), true)
eq('drops qa-elena', keep(row({ ref: 'qa-elena' })), false)
eq('drops pili', keep(row({ ref: 'pili' })), false)
eq('keeps similar refs', keep(row({ ref: 'qa-elena2' })) && keep(row({ ref: 'pilis' })), true)
eq('drops bot:*', keep(row({ ua_summary: 'bot:other' })), false)
throws('extra column refused', () => assertColumns({ slug: 'a', ref: null, ip: '1.2.3.4' }), 'unexpected columns')
assertColumns({ slug: 'a', ref: null, lang: 'es', ua_summary: 'x', created_at: 'y' })

// aggregation: counts only
const rows = [
  row({}), row({ ref: 'qr', lang: 'es', ua_summary: 'mobile:safari' }), row({ ref: 'qr', lang: 'es', ua_summary: 'mobile:safari', created_at: '2026-10-13T23:00:00Z' }),
  row({ ref: 'qa-elena' }), row({ ref: 'pili' }), row({ ua_summary: 'bot:other' }), row({ slug: 'dave-nat', ref: 'qr', ua_summary: 'tablet:chrome' }), row({ ua_summary: 'unknown:other' }),
]
const a = aggregate(rows)
eq('total excludes qa/pili/bot', a.total, 5)
eq('groups', a.groups.map((g) => [g.slug, g.ref, g.visits, g.es, g.en, g.mobile, g.desktop, g.tablet, g.other]), [
  ['dave-nat', 'qr', 1, 0, 1, 0, 0, 1, 0], ['host-me-tender', '(none)', 2, 0, 2, 0, 1, 0, 1], ['host-me-tender', 'qr', 2, 2, 0, 2, 0, 0, 0]])
eq('days (UTC, newest first)', a.days.map((d) => `${d.day} ${d.slug} ${d.ref} ${d.visits}`), [
  '2026-10-14 dave-nat qr 1', '2026-10-14 host-me-tender (none) 2', '2026-10-14 host-me-tender qr 1', '2026-10-13 host-me-tender qr 1'])
eq('device', [device('mobile:safari'), device('unknown:other'), device('bot:other')], ['mobile', 'other', 'other'])
const out = render('demo_visits', 30, a)
eq('output has no row-level data', /\d{4}-\d{2}-\d{2}T/.test(out) || out.includes('ua_summary'), false)
eq('empty output', render('demo_visits', 7, aggregate([])).includes('(no visits)'), true)

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('demo-visits: all passed')
