/** tests/demo-review.test.ts — recording the editorial review. Run: npx tsx tests/demo-review.test.ts */
import fs from 'node:fs'
import { applyReview } from '../scripts/lib/demo-review-core'

let failed = 0
const eq = (n: string, g: unknown, w: unknown) => { if (JSON.stringify(g) !== JSON.stringify(w)) { failed++; console.error(`FAIL ${n}\n  got:  ${JSON.stringify(g)}\n  want: ${JSON.stringify(w)}`) } }
const raw = () => JSON.parse(fs.readFileSync('content/demos/host-me-tender/demo.json', 'utf8'))
const R = ['Pili']

const ok = applyReview(raw(), 'Pili', '2026-10-14', R)
eq('valid review applies', ok.ok, true)
eq('only review changes', Object.keys(ok.next!).filter((k) => JSON.stringify((ok.next as any)[k]) !== JSON.stringify(raw()[k])), ['review'])
eq('review value', (ok.next as any).review, { by: 'Pili', date: '2026-10-14' })
eq('unknown reviewer', applyReview(raw(), 'Elena', '2026-10-14', R).errors[0].startsWith('review.by'), true)
eq('bad date format', applyReview(raw(), 'Pili', '14/10/2026', R).errors[0].includes('YYYY-MM-DD'), true)
eq('future date', applyReview(raw(), 'Pili', '2099-01-01', R).errors[0].includes('future'), true)
eq('impossible date', applyReview(raw(), 'Pili', '2026-02-31', R).errors[0].includes('not a real date'), true)
const reviewed = { ...raw(), review: { by: 'Pili', date: '2026-10-01' } }
eq('refuses to overwrite', applyReview(reviewed, 'Pili', '2026-10-14', R).errors[0].includes('--replace'), true)
eq('--replace overwrites', (applyReview(reviewed, 'Pili', '2026-10-14', R, true).next as any).review.date, '2026-10-14')
eq('input is not mutated', raw().review, null)

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('demo-review: all passed')
