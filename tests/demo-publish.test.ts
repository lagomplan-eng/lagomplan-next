/**
 * tests/demo-publish.test.ts — pure helpers behind /nueva-demo.
 * Run: npx tsx tests/demo-publish.test.ts
 */
import {
  assertSlug, branchFor, commitMessage, demoUrl, lastUrl, otherChanges, promoteBlockers, refFor, robotsOf, PROD_ORIGIN,
} from '../scripts/lib/demo-publish-core'

let failed = 0
const eq = (name: string, got: unknown, want: unknown) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { failed++; console.error(`FAIL ${name}\n  got:  ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`) }
}
const throws = (name: string, fn: () => unknown, frag: string) => {
  try { fn(); failed++; console.error(`FAIL ${name}: did not throw`) } catch (e) { if (!String((e as Error).message).includes(frag)) { failed++; console.error(`FAIL ${name}: ${(e as Error).message}`) } }
}

// slug
eq('valid slug', assertSlug('kasava-homes'), 'kasava-homes')
throws('uppercase', () => assertSlug('Kasava'), 'not valid')
throws('space', () => assertSlug('a b'), 'not valid')
throws('leading hyphen', () => assertSlug('-a'), 'not valid')
throws('empty', () => assertSlug(''), 'not valid')
throws('undefined', () => assertSlug(undefined), 'not valid')

// ref + link: ref must satisfy demo_visits CHECK ^[a-z0-9_-]{1,32}$
eq('ref = slug', refFor('kasava-homes'), 'kasava-homes')
eq('long ref cut to 32', refFor('a'.repeat(31) + '-bbbbbb'), 'a'.repeat(31))
eq('no trailing hyphen', refFor('a'.repeat(31) + '-bb').endsWith('-'), false)
for (const s of ['host-me-tender', 'x', 'a'.repeat(64), 'abc-' + 'd'.repeat(60)]) eq(`ref valid for ${s.slice(0, 12)}…`, /^[a-z0-9_-]{1,32}$/.test(refFor(s)), true)
eq('full link', demoUrl(PROD_ORIGIN, 'kasava-homes'), 'https://www.lagomplan.com/demo/kasava-homes?ref=kasava-homes')
eq('custom ref', demoUrl(PROD_ORIGIN, 'kasava-homes', 'qr'), 'https://www.lagomplan.com/demo/kasava-homes?ref=qr')
eq('branch', branchFor('kasava-homes'), 'demo/kasava-homes')

// what else would go live
eq('only the demo', otherChanges(['content/demos/kasava-homes/demo.json', 'content/demos/kasava-homes/logo.png'], 'kasava-homes'), [])
eq('other demo is "other"', otherChanges(['content/demos/dave-nat/demo.json'], 'kasava-homes'), ['content/demos/dave-nat/demo.json'])
eq('code is "other"', otherChanges(['app/x.tsx', 'content/demos/kasava-homes/demo.json', ''], 'kasava-homes'), ['app/x.tsx'])
eq('prefix trick', otherChanges(['content/demos/kasava-homes-2/demo.json'], 'kasava-homes'), ['content/demos/kasava-homes-2/demo.json'])

// production gate
const review = { by: 'Pili', date: '2026-10-14' }
eq('ok', promoteBlockers({ review, errors: 0 }), [])
eq('ok with both envs', promoteBlockers({ review, errors: 0, environments: ['preview', 'production'] }), [])
eq('no review', promoteBlockers({ review: null, errors: 0 }).length, 1)
eq('preview-only', promoteBlockers({ review, errors: 0, environments: ['preview'] }).length, 1)
eq('errors + no review', promoteBlockers({ review: null, errors: 2, environments: ['preview'] }).length, 3)

// misc
eq('commit add', commitMessage('a', false), 'feat(demo): add a demo')
eq('commit update + trailer', commitMessage('a', true, 'Co-Authored-By: X'), 'feat(demo): update a demo\n\nCo-Authored-By: X')
eq('last url', lastUrl('Inspect: https://vercel.com/x/y/abc\nPreview: https://lagomplan-next-aaa-team.vercel.app\nDone https://lagomplan-next-bbb-team.vercel.app'), 'https://lagomplan-next-bbb-team.vercel.app')
eq('no url', lastUrl('nothing'), null)
eq('robots', robotsOf('<meta name="robots" content="noindex, nofollow"/>'), 'noindex, nofollow')
eq('no robots', robotsOf('<html></html>'), null)

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('demo-publish: all passed')
