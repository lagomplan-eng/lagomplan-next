// lib/hotels/report/email.ts — the email-safe HTML of a report: tables and inline styles only, no scripts, no web fonts, no CSS
// classes, 600 px wide. Drawn from the same Doc as the page, so the two always say the same thing. Not sent in step 1.
import type { Block, Doc } from './doc'

export const PALETTE = { pine: '#0F3A33', soft: '#3E5F58', sand: '#EDE7E1', cream: '#FFF9F3', rule: '#C8BFB5' } as const
const FONT = "Manrope, 'Helvetica Neue', Helvetica, Arial, sans-serif"
export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const safeColour = (c?: string) => (c && /^#[0-9a-fA-F]{6}$/.test(c) ? c : PALETTE.pine)

function block(b: Block, accent: string): string {
  const base = `font-family:${FONT};color:${PALETTE.pine};`
  switch (b.t) {
    case 'p': return `<p style="${base}font-size:15px;line-height:1.55;margin:0 0 10px;">${esc(b.text)}</p>`
    case 'note': return `<p style="${base}font-size:13px;line-height:1.5;margin:0 0 10px;color:${PALETTE.soft};font-style:italic;">${esc(b.text)}</p>`
    case 'h': return `<p style="${base}font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin:14px 0 6px;color:${PALETTE.soft};">${esc(b.text)}</p>`
    case 'stats': return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;"><tr>${b.items.map((i) =>
      `<td valign="top" style="padding:0 12px 0 0;"><div style="${base}font-size:30px;font-weight:700;line-height:1.1;color:${accent};">${esc(i.value)}</div><div style="${base}font-size:12px;color:${PALETTE.soft};">${esc(i.label)}</div></td>`).join('')}</tr></table>`
    case 'table': {
      const cell = (x: string, i: number, head: boolean, foot = false) => `<${head ? 'th' : 'td'} align="left" valign="top" style="${base}font-size:14px;padding:7px 10px 7px 0;border-bottom:1px solid ${PALETTE.rule};${head ? `font-size:12px;font-weight:700;color:${PALETTE.soft};` : ''}${foot ? 'font-weight:700;' : ''}">${esc(x)}</${head ? 'th' : 'td'}>`
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;border-collapse:collapse;"><tr>${b.head.map((h, i) => cell(h, i, true)).join('')}</tr>${b.rows.map((r) => `<tr>${r.map((x, i) => cell(x, i, false)).join('')}</tr>`).join('')}${b.foot ? `<tr>${b.foot.map((x, i) => cell(x, i, false, true)).join('')}</tr>` : ''}</table>`
    }
  }
}

export function renderEmail(d: Doc): string {
  const accent = safeColour(d.brand?.colour)
  const base = `font-family:${FONT};color:${PALETTE.pine};`
  const logo = d.brand?.logoUrl ? `<img src="${esc(d.brand.logoUrl)}" alt="${esc(d.brand.name)}" height="40" style="display:block;height:40px;margin:0 0 12px;border:0;">` : ''
  return `<!doctype html>
<html lang="${d.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(`${d.title} · ${d.hotel} · ${d.monthLabel}`)}</title></head>
<body style="margin:0;padding:0;background:${PALETTE.sand};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PALETTE.sand};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${PALETTE.cream};border:1px solid ${PALETTE.rule};"><tr><td style="padding:28px 28px 8px;">
${d.sample ? `<p style="${base}font-size:12px;font-weight:700;letter-spacing:.04em;margin:0 0 16px;padding:8px 10px;border:1px solid ${PALETTE.rule};background:${PALETTE.sand};">${esc(d.sample)}</p>` : ''}
${logo}<p style="${base}font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 6px;color:${PALETTE.soft};">${esc(d.title)}</p>
<h1 style="${base}font-size:26px;line-height:1.2;margin:0 0 4px;color:${accent};">${esc(d.hotel)}</h1>
<p style="${base}font-size:16px;margin:0 0 4px;">${esc(d.monthLabel)}</p>
<p style="${base}font-size:12px;margin:0 0 8px;color:${PALETTE.soft};">${esc(d.preparedBy)}</p>
<div style="height:2px;background:${accent};margin:14px 0 0;line-height:2px;font-size:2px;">&nbsp;</div>
</td></tr>
${d.sections.map((s) => `<tr><td style="padding:20px 28px 4px;"><h2 style="${base}font-size:17px;margin:0 0 10px;padding:0 0 6px;border-bottom:1px solid ${PALETTE.rule};">${esc(s.title)}</h2>${s.blocks.map((b) => block(b, accent)).join('')}</td></tr>`).join('\n')}
<tr><td style="padding:20px 28px 28px;"><p style="${base}font-size:12px;color:${PALETTE.soft};margin:0;border-top:1px solid ${PALETTE.rule};padding-top:12px;">${esc(d.poweredBy ? `${d.preparedBy} · ${d.poweredBy}` : d.preparedBy)}</p></td></tr>
</table></td></tr></table></body></html>`
}
