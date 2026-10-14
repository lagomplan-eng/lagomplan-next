/**
 * tests/lead-magnet-form.test.ts
 *
 * The shared LeadMagnetForm renders the success-state "next step" block only
 * from the magnet's config (lib/lead-magnets.ts): present for checklist-baby,
 * hidden for a magnet with no `nextStep`. Also guards the config shape, the
 * optional PDF (puente-noviembre has none: no download link) and the
 * puente-noviembre email (UTMs only on its external links, unsubscribe).
 *
 *   npx tsx tests/lead-magnet-form.test.ts
 */
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getLeadMagnet, toPublic } from '../lib/lead-magnets'
import { PUENTE_DESTINATIONS, puentePlannerPath } from '../lib/puente-noviembre'

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
  eq('nextStep url is internal with no UTMs', pub.nextStep?.buttonUrl, '/es/planificador')
  eq('no magnet nextStep url carries utm_ params unless external', Object.values({ ...{ x: pub.nextStep } }).every(n => !n || /^https?:\/\//.test(n.buttonUrl) || !/utm_/.test(n.buttonUrl)), true)
  eq('nextStep event', pub.nextStep?.analyticsEvent, 'planner_cta_click')

  const withNext = render(pub)
  eq('block rendered: button label', withNext.includes('Planea tu viaje gratis'), true)
  eq('block rendered: sent eyebrow', withNext.includes('Mientras llega tu checklist'), true)
  eq('block rendered: failed eyebrow', withNext.includes('Siguiente paso'), true)
  eq('block rendered: url', withNext.includes('href="/es/planificador"'), true)
  eq('block rendered: no utm in html', withNext.includes('utm_'), false)
  const noEvent = render({ ...pub, nextStep: { ...pub.nextStep!, analyticsEvent: undefined } })
  eq('analyticsEvent optional: block still renders', noEvent.includes('Planea tu viaje gratis'), true)

  const without = render({ ...pub, nextStep: undefined })
  eq('no config: button hidden', without.includes('Planea tu viaje gratis'), false)
  eq('no config: eyebrows hidden', without.includes('Mientras llega') || without.includes('Siguiente paso'), false)
  eq('no config: planner url hidden', without.includes('planificador'), false)
  eq('no config: success message still there', without.includes('Listo. Revisa tu correo.'), true)

  // checklist-baby copy is unchanged now that it lives in the config
  eq('checklist: submit label', withNext.includes('Recibir el checklist gratis →'), true)
  eq('checklist: microcopy', withNext.includes('Un PDF de 12 páginas, para imprimir o guardar en tu celular. Sin spam — puedes darte de baja cuando quieras.'), true)
  eq('checklist: success copy', withNext.includes('Si no llega en 5 minutos, revisa promociones o spam.'), true)
  eq('checklist: failed headline', withNext.includes('Listo. Aquí está tu checklist.'), true)
  eq('checklist: download links', (withNext.match(/href="\/downloads\/checklist-hotel-bebe\.pdf"/g) ?? []).length >= 2, true)

  // ── puente-noviembre: no PDF ───────────────────────────────────────────
  const puente = getLeadMagnet('puente-noviembre')!
  eq('puente: config', [puente.slug, puente.analyticsId, puente.mailchimpTags], ['puente-noviembre', 'puente_noviembre', ['magnet_puente', 'persona_couple']])
  eq('puente: no pdf', [puente.pdfPath, puente.pdfUrl], [undefined, undefined])
  eq('puente: subject', puente.emailSubject, 'Las 4 escapadas para el puente de noviembre')
  eq('puente: preheader', puente.emailPreheader, 'Sábado 14 a lunes 16. Elijan una y el plan sale en 60 segundos.')
  const ppub = toPublic(puente)
  eq('puente: nextStep', [ppub.nextStep?.eyebrowSent, ppub.nextStep?.text, ppub.nextStep?.buttonLabel, ppub.nextStep?.buttonUrl, ppub.nextStep?.analyticsEvent],
    ['MIENTRAS TANTO', 'Elige una y arma el plan en 60 segundos.', 'Planear nuestro puente →', '/es/planificador', 'planner_cta_click'])
  const ph = render(ppub)
  eq('puente: submit label', ph.includes('Mandármelas →'), true)
  eq('puente: microcopy', ph.includes('Un correo, sin spam. Puedes darte de baja cuando quieras.'), true)
  eq('puente: success headline', ph.includes('Listo. Revisa tu correo.'), true)
  eq('puente: success copy', ph.includes('Te mandamos las cuatro escapadas a') && ph.includes('Reenvíaselo a quien siempre dice &quot;tú decide&quot;.'), true)
  eq('puente: no download link', ph.includes('Descargar') || ph.includes('.pdf') || ph.includes('checklist'), false)
  eq('puente: no utm in html', ph.includes('utm_'), false)

  // ── puente-noviembre email ─────────────────────────────────────────────
  const mail = puente.render({ name: 'Ana <b>', preheader: puente.emailPreheader })
  const plannerUtm = 'https://www.lagomplan.com/es/planificador?utm_source=email&amp;utm_medium=leadmagnet&amp;utm_campaign=w3_puente'
  eq('email: greeting escaped', mail.html.includes('Hola, Ana &lt;b&gt;.'), true)
  eq('email: preheader', mail.html.includes(puente.emailPreheader), true)
  eq('email: button url', mail.html.includes(`href="${plannerUtm}"`), true)
  eq('email: every link to the site carries the campaign', (mail.html.match(/href="https:\/\/www\.lagomplan\.com[^"]*"/g) ?? []).every(h => h.includes('utm_campaign=w3_puente')), true)
  eq('email: destinations bold', PUENTE_DESTINATIONS.every(d => mail.html.includes(`font-weight:bold; text-decoration:underline;">${d.name}</a>`)), true)
  eq('email: text body', mail.text.includes('Reenvíale este correo a tu pareja.') && mail.text.includes('— Elena, Lagomplan'), true)
  eq('email: no name', puente.render({ name: '', preheader: 'x' }).text.startsWith('Hola.\n'), true)
  const withUnsub = (await import('../lib/email/puente-noviembre')).renderPuenteNoviembreEmail({ preheader: 'x', unsubUrl: 'https://u.example/unsub', postalAddress: 'Calle 1' })
  eq('email: unsubscribe link', withUnsub.html.includes('href="https://u.example/unsub"') && withUnsub.text.includes('Darme de baja: https://u.example/unsub'), true)
  eq('email: postal address', withUnsub.html.includes('Calle 1'), true)

  // ── planner links ──────────────────────────────────────────────────────
  const q = new URL('https://x' + puentePlannerPath(PUENTE_DESTINATIONS[0])).searchParams
  eq('planner link: couple, 14–16 Nov, 3 days', [q.get('destination'), q.get('traveler'), q.get('start'), q.get('end'), q.get('nights'), q.get('adults'), q.get('children')],
    ['Oaxaca, México', 'pareja', '2026-11-14', '2026-11-16', '3', null, null])
  eq('planner link: no utm on site links', PUENTE_DESTINATIONS.every(d => !puentePlannerPath(d).includes('utm_')), true)

  eq('getLeadMagnet unknown slug', getLeadMagnet('nope'), undefined)
  eq('getLeadMagnet __proto__', getLeadMagnet('__proto__'), undefined)

  console.log(`\nlead-magnet-form: ${pass}/${pass + fail} passed`)
  process.exit(fail ? 1 : 0)

}
main()
