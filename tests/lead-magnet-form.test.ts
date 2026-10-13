/**
 * tests/lead-magnet-form.test.ts
 *
 * The shared LeadMagnetForm renders the success-state "next step" block only
 * from the magnet's config (lib/lead-magnets.ts): present for checklist-baby,
 * hidden for a magnet with no `nextStep`. Also guards the config shape.
 *
 *   npx tsx tests/lead-magnet-form.test.ts
 */
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getLeadMagnet, toPublic } from '../lib/lead-magnets'

// tsx compiles JSX with the classic runtime (Next uses the automatic one), so
// the component needs a global React when rendered outside Next.
;(globalThis as any).React = React

let pass = 0, fail = 0
function eq(name: string, got: unknown, want: unknown) {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++
  else { fail++; console.error(`FAIL ${name}\n  got:  ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`) }
}

async function main() {
  const { default: LeadMagnetForm } = await import('../components/forms/LeadMagnetForm')
  const magnet = getLeadMagnet('checklist-baby')!
  const pub = toPublic(magnet)
  const render = (m: typeof pub) => renderToStaticMarkup(React.createElement(LeadMagnetForm, { magnet: m, position: 'hero' }))

  eq('checklist-baby has nextStep', !!pub.nextStep, true)
  eq('nextStep url keeps UTMs', pub.nextStep?.buttonUrl, '/es/planificador?utm_source=landing&utm_medium=success&utm_campaign=w3_bebe')
  eq('nextStep event', pub.nextStep?.analyticsEvent, 'planner_cta_click')

  const withNext = render(pub)
  eq('block rendered: button label', withNext.includes('Planea tu viaje gratis'), true)
  eq('block rendered: sent eyebrow', withNext.includes('Mientras llega tu checklist'), true)
  eq('block rendered: failed eyebrow', withNext.includes('Siguiente paso'), true)
  eq('block rendered: url', withNext.includes('utm_campaign=w3_bebe'), true)

  const without = render({ ...pub, nextStep: undefined })
  eq('no config: button hidden', without.includes('Planea tu viaje gratis'), false)
  eq('no config: eyebrows hidden', without.includes('Mientras llega') || without.includes('Siguiente paso'), false)
  eq('no config: planner url hidden', without.includes('planificador'), false)
  eq('no config: success message still there', without.includes('Listo. Revisa tu correo.'), true)

  eq('getLeadMagnet unknown slug', getLeadMagnet('nope'), undefined)
  eq('getLeadMagnet __proto__', getLeadMagnet('__proto__'), undefined)

  console.log(`\nlead-magnet-form: ${pass}/${pass + fail} passed`)
  process.exit(fail ? 1 : 0)

}
main()
