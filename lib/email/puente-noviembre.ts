/**
 * lib/email/puente-noviembre.ts
 *
 * Delivery email for the "puente-noviembre" lead magnet (registered in
 * lib/lead-magnets.ts; subject + preheader come from there). No PDF: the four
 * escapadas are the content. Same shell, styles, footer and unsubscribe link
 * as lib/email/checklist-baby.ts; the route adds List-Unsubscribe.
 *
 * Links here are external (an inbox), so they carry UTMs. Each destination
 * name links to its pre-built plan (lib/puente-noviembre.ts).
 *
 *   greeting            → "Hola, {name}." / "Hola."
 *   postal address line → env LAGOMPLAN_POSTAL_ADDRESS (omitted when unset)
 *   unsubscribe link    → env MAILCHIMP_UNSUB_URL (omitted when unset)
 */

import { PUENTE_DESTINATIONS, puentePlannerPath } from '../puente-noviembre'

const SITE = 'https://www.lagomplan.com'
const UTM = { utm_source: 'email', utm_medium: 'leadmagnet', utm_campaign: 'w3_puente' }
const PLANNER_URL = `${SITE}/es/planificador?utm_source=email&utm_medium=leadmagnet&utm_campaign=w3_puente`
const SUBJECT = 'Las 4 escapadas para el puente de noviembre'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export interface PuenteEmailOptions {
  /** Hidden inbox preheader (from the magnet config). */
  preheader: string
  name?: string | null
  /** Defaults to env LAGOMPLAN_POSTAL_ADDRESS (line omitted when unset). */
  postalAddress?: string
  /** Defaults to env MAILCHIMP_UNSUB_URL (link omitted when unset). */
  unsubUrl?: string
}

export function renderPuenteNoviembreEmail(opts: PuenteEmailOptions): { html: string; text: string } {
  const PREHEADER = esc(opts.preheader)
  const name = (opts.name ?? '').trim()
  const address = (opts.postalAddress ?? process.env.LAGOMPLAN_POSTAL_ADDRESS ?? '').trim()
  const unsubUrl = (opts.unsubUrl ?? process.env.MAILCHIMP_UNSUB_URL ?? '').trim()

  const greeting = name ? `Hola, ${esc(name)}.` : 'Hola.'
  const footerLines =
    (address ? `              ${esc(address)}<br>\n` : '') +
    (unsubUrl
      ? `              <a href="${esc(unsubUrl)}" style="color:#7A9A8F; text-decoration:underline;">Darme de baja</a>`
      : '')

  const destinationRows = PUENTE_DESTINATIONS.map(d =>
    `            <p style="margin:0 0 12px 0;"><a href="${esc(SITE + puentePlannerPath(d, UTM))}" target="_blank" style="color:#0F3A33; font-weight:bold; text-decoration:underline;">${esc(d.name)}</a> &middot; ${esc(d.distance)} &mdash; ${esc(d.emailBlurb)}</p>`,
  ).join('\n')

  const html = `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${SUBJECT}</title>
<style>
  body { margin:0; padding:0; background:#FFF9F3; }
  table { border-collapse:collapse; }
  img { border:0; display:block; }
  a { color:#0F3A33; }
  @media only screen and (max-width:620px) {
    .container { width:100% !important; }
    .px { padding-left:24px !important; padding-right:24px !important; }
    .h1 { font-size:30px !important; line-height:36px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background:#FFF9F3;">

<!-- Preview text (hidden preheader) -->
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">${PREHEADER}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF9F3;">
  <tr>
    <td align="center" style="padding:32px 12px;">

      <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background:#FFF9F3;">

        <!-- Header: wordmark + series label -->
        <tr>
          <td class="px" style="padding:0 48px 20px 48px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left" style="font-family:'Courier New', Courier, monospace; font-size:13px; font-weight:bold; letter-spacing:4px; color:#0F3A33;">LAGOMPLAN</td>
                <td align="right" style="font-family:'Courier New', Courier, monospace; font-size:11px; letter-spacing:3px; color:#7A9A8F;">PUENTE DE NOVIEMBRE</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Headline -->
        <tr>
          <td class="px" style="padding:12px 48px 0 48px;">
            <h1 class="h1" style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-weight:normal; font-size:36px; line-height:42px; color:#0F3A33;">
              El puente de noviembre,<br><em>ya planeado.</em>
            </h1>
          </td>
        </tr>

        <!-- Rule -->
        <tr>
          <td class="px" style="padding:24px 48px 0 48px;">
            <div style="border-top:2px solid #0F3A33; font-size:0; line-height:0;">&nbsp;</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td class="px" style="padding:28px 48px 0 48px; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:26px; color:#2E4A44;">
            <p style="margin:0 0 16px 0;">${greeting}</p>
            <p style="margin:0 0 20px 0;">Aquí están las cuatro escapadas para el puente &mdash; sábado 14 a lunes 16 de noviembre:</p>
${destinationRows}
            <p style="margin:4px 0 24px 0;">Reenvíale este correo a tu pareja. Cuando elijan, el planner arma el plan completo en 60 segundos.</p>
          </td>
        </tr>

        <!-- Button -->
        <tr>
          <td class="px" align="left" style="padding:0 48px 28px 48px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" bgcolor="#0F3A33" style="border-radius:999px;">
                  <a href="${esc(PLANNER_URL)}" target="_blank"
                     style="display:inline-block; padding:15px 30px; font-family:Arial, Helvetica, sans-serif; font-size:16px; font-weight:bold; color:#FFF9F3; text-decoration:none; border-radius:999px;">
                    Planear nuestro puente &rarr;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Closing -->
        <tr>
          <td class="px" style="padding:0 48px 36px 48px; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:26px; color:#2E4A44;">
            <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-style:italic; font-size:18px; color:#0F3A33;">&mdash; Elena, Lagomplan</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="px" style="padding:24px 48px 0 48px; border-top:1px solid #D5DED9;">
            <p style="margin:0 0 10px 0; font-family:'Courier New', Courier, monospace; font-size:11px; letter-spacing:3px; color:#7A9A8F;">
              <span style="color:#E06456;">&#9679;</span>&nbsp; VIAJA BIEN &middot; PLANEA MENOS
            </p>
            <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:19px; color:#7A9A8F;">
              Recibes este correo porque pediste las escapadas del puente en lagomplan.com.<br>
${footerLines}
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
</body>
</html>
`

  const text = [
    name ? `Hola, ${name}.` : 'Hola.',
    '',
    'Aquí están las cuatro escapadas para el puente — sábado 14 a lunes 16 de noviembre:',
    '',
    ...PUENTE_DESTINATIONS.flatMap(d => [
      `${d.name} · ${d.distance} — ${d.emailBlurb}`,
      `  ${SITE}${puentePlannerPath(d, UTM)}`,
    ]),
    '',
    'Reenvíale este correo a tu pareja. Cuando elijan, el planner arma el plan completo en 60 segundos.',
    '',
    `Planear nuestro puente: ${PLANNER_URL}`,
    '',
    '— Elena, Lagomplan',
    '',
    '--',
    'Recibes este correo porque pediste las escapadas del puente en lagomplan.com.',
    ...(address ? [address] : []),
    ...(unsubUrl ? [`Darme de baja: ${unsubUrl}`] : []),
  ].join('\n')

  return { html, text }
}
