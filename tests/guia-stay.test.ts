/**
 * tests/guia-stay.test.ts
 *
 * lib/guia/stay.ts — validation of the optional ?llegada/noches/adultos/ninos
 * params on /guia/[partner]. Invalid input must be ignored, never throw.
 *
 *   npx tsx tests/guia-stay.test.ts
 */

import { parseStay, stayHeading } from '../lib/guia/stay'

let failed = 0
function eq(name: string, got: unknown, expected: unknown) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  if (!pass) failed++
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${pass ? '' : `\n      got      ${JSON.stringify(got)}\n      expected ${JSON.stringify(expected)}`}`)
}

eq('no params → empty', parseStay(''), {})
eq('full family stay', parseStay('llegada=2026-11-05&noches=3&adultos=2&ninos=2'),
  { arrival: '2026-11-05', nights: 3, adults: 2, children: 2 })
eq('1 adult 14 nights', parseStay('noches=14&adultos=1'), { nights: 14, adults: 1 })
eq('ninos=0 is valid', parseStay('noches=2&ninos=0'), { nights: 2, children: 0 })
eq('accepts a URLSearchParams instance', parseStay(new URLSearchParams('noches=4')), { nights: 4 })

eq('nights=0 rejected', parseStay('noches=0'), {})
eq('nights=61 rejected', parseStay('noches=61'), {})
eq('nights=abc rejected', parseStay('noches=abc'), {})
eq('nights=3.5 rejected', parseStay('noches=3.5'), {})
eq('nights=-2 rejected', parseStay('noches=-2'), {})
eq('adultos=0 rejected', parseStay('adultos=0'), {})
eq('ninos=99 rejected', parseStay('ninos=99'), {})
eq('impossible date rejected', parseStay('llegada=2026-02-31'), {})
eq('bad date format rejected', parseStay('llegada=05-11-2026'), {})
eq('year out of range rejected', parseStay('llegada=1999-01-01'), {})
eq('one bad param does not drop the good ones', parseStay('llegada=nope&noches=3&adultos=2'),
  { nights: 3, adults: 2 })
eq('repeated param uses first', parseStay('noches=3&noches=9'), { nights: 3 })

eq('heading es plural', stayHeading('es', 3, 'Condesa'), 'Tus 3 noches en Condesa')
eq('heading en plural', stayHeading('en', 3, 'Condesa'), 'Your 3 nights in Condesa')
eq('heading es singular', stayHeading('es', 1, 'Condesa'), 'Tu noche en Condesa')
eq('heading en singular', stayHeading('en', 1, 'Condesa'), 'Your night in Condesa')

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('\nall passed')
