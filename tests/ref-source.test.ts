/**
 * tests/ref-source.test.ts
 *
 * Regression suite for lib/attribution/ref-source.sanitizeRefSource — the
 * validator that gates what lands in trips.ref_source (partner payout data,
 * so junk/injection must be rejected). Run with:
 *
 *   npx tsx tests/ref-source.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import { sanitizeRefSource } from '../lib/attribution/ref-source'

type Case = readonly [label: string, input: string | undefined | null, expected: string | null]

const cases: Case[] = [
  ['valid lupito',            'host:lupito',            'host:lupito'],
  ['uppercase normalized',    'HOST:LUPITO',            'host:lupito'],
  ['whitespace trimmed',      '  host:lupito  ',        'host:lupito'],
  ['slug with dash/underscore', 'host:casa_azul-2',     'host:casa_azul-2'],
  ['empty → null',            '',                       null],
  ['undefined → null',        undefined,                null],
  ['null → null',             null,                     null],
  ['missing host prefix',     'lupito',                 null],
  ['wrong prefix',            'partner:lupito',         null],
  ['empty slug',              'host:',                  null],
  ['slug starts with dash',   'host:-bad',              null],
  ['injection attempt',       "host:x'; DROP TABLE trips;--", null],
  ['spaces in slug',          'host:lupito partners',   null],
  ['too long (>40 slug)',     'host:' + 'a'.repeat(41), null],
  ['url-ish junk',            'https://evil.com',       null],
]

let passed = 0
let failed = 0
const failures: string[] = []

for (const [label, input, expected] of cases) {
  const got = sanitizeRefSource(input)
  if (got === expected) {
    passed++
  } else {
    failed++
    failures.push(`  ✗ ${label}\n      input    ${JSON.stringify(input)}\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(got)}`)
  }
}

const total = passed + failed
console.log(`\nref-source: ${passed}/${total} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failures.length) {
  console.log(failures.join('\n\n'))
  console.log()
  process.exit(1)
}
process.exit(0)
