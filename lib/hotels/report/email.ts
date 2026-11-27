// lib/hotels/report/email.ts — the email-safe HTML of a report: the SAME structure and order as the page (band, what this tells
// you, numbered sections with bars, about these numbers, footer), within what email clients allow: tables, inline styles, system
// fonts, bars made of table cells with a background colour. No scripts, no <style>, no classes, no web fonts. Not sent in step 1.
import type { Block, Doc } from './doc'

export const PALETTE = { pine: '#0F3A33', soft: '#3E5F58', sand: '#EDE7E1', cream: '#FFF9F3', rule: '#C8BFB5' } as const
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const MONO = "'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace"
export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const safeColour = (c?: string) => (c && /^#[0-9a-fA-F]{6}$/.test(c) ? c : PALETTE.pine)
const P = PALETTE

const eyebrow = (t: string, colour: string) => `<div style="font-family:${MONO};font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:${colour};margin:0 0 8px;">${esc(t)}</div>`

function bar(pct: number): string {
  const w = Math.min(100, Math.max(pct > 0 ? 2 : 0, Math.round(pct)))
  const fill = `<td width="${w}%" height="10" bgcolor="${P.pine}" style="background:${P.pine};font-size:0;line-height:0;height:10px;">&nbsp;</td>`
  const rest = w < 100 ? `<td width="${100 - w}%" height="10" bgcolor="${P.sand}" style="background:${P.sand};font-size:0;line-height:0;height:10px;">&nbsp;</td>` : ''
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>${fill}${rest}</tr></table>`
}

function block(b: Block): string {
  const base = `font-family:${SANS};color:${P.pine};`
  switch (b.t) {
    case 'text': return b.paras.map((p) => `<p style="${base}font-size:20px;line-height:29px;font-weight:500;margin:0 0 12px;">${esc(p)}</p>`).join('')
    case 'figures': return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 8px;"><tr>${b.items.map((i) =>
      `<td valign="top" style="padding:0 32px 12px 0;"><div style="${base}font-size:44px;line-height:46px;font-weight:700;">${esc(i.value)}</div><div style="font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${P.soft};margin-top:8px;">${esc(i.label)}</div></td>`).join('')}</tr></table>`
    case 'bars': {
      const max = Math.max(1, ...b.rows.map((r) => r.value))
      const rows = b.rows.map((r) => `<tr>
<td valign="middle" width="36%" style="${base}font-size:15px;line-height:19px;padding:7px 12px 7px 0;">${esc(r.label)}${r.sub ? `<div style="font-size:12px;line-height:16px;color:${P.soft};margin-top:2px;">${esc(r.sub)}</div>` : ''}</td>
<td valign="middle" style="padding:7px 12px 7px 0;">${bar((r.value / max) * 100)}</td>
<td valign="middle" align="right" width="70" style="${base}font-size:15px;font-weight:700;padding:7px 0;white-space:nowrap;">${esc(r.text)}</td></tr>`).join('')
      return `${b.title ? `<div style="${base}font-size:13px;font-weight:700;color:${P.soft};margin:0 0 6px;">${esc(b.title)}</div>` : ''}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 6px;">${rows}</table>${b.moreText ? `<div style="${base}font-size:13px;color:${P.soft};margin:0 0 6px;">${esc(b.moreText)}</div>` : ''}<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>`
    }
    case 'grid': {
      const cell = (x: string, head: boolean, foot = false) => head
        ? `<th align="left" valign="bottom" style="font-family:${MONO};font-size:10px;letter-spacing:1px;text-transform:uppercase;color:${P.soft};font-weight:normal;padding:0 8px 8px 0;">${esc(x)}</th>`
        : `<td align="left" valign="top" style="${base}font-size:14px;${foot ? 'font-weight:700;' : ''}padding:9px 8px 9px 0;border-top:1px solid ${P.rule};">${esc(x)}</td>`
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 8px;"><tr>${b.head.map((h) => cell(h, true)).join('')}</tr>${b.rows.map((r) => `<tr>${r.map((x) => cell(x, false)).join('')}</tr>`).join('')}${b.foot ? `<tr>${b.foot.map((x) => cell(x, false, true)).join('')}</tr>` : ''}</table>`
    }
  }
}

/** `assetBase` is put in front of site-relative image paths: '' inside the admin preview, the site's address when it is sent. */
export function renderEmail(d: Doc, o: { assetBase?: string } = {}): string {
  const asset = (u: string) => (u.startsWith('/') ? `${o.assetBase ?? 'https://www.lagomplan.com'}${u}` : u)
  const accent = safeColour(d.brand?.colour)
  const base = `font-family:${SANS};color:${P.pine};`
  const light = `font-family:${SANS};color:${P.rule};`
  const top = d.brand?.logoUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="${P.cream}" style="background:${P.cream};padding:6px 12px;border-radius:6px;"><img src="${esc(asset(d.brand.logoUrl))}" alt="${esc(d.brand.name)}" height="30" style="display:block;height:30px;border:0;"></td>${d.poweredBy ? `<td style="${light}font-size:12px;padding-left:14px;">${esc(d.poweredBy)}</td>` : ''}</tr></table>`
    : `<img src="${esc(asset('/images/report/lagomplan-logo-light.png'))}" alt="Lagomplan" height="52" style="display:block;height:52px;border:0;">`
  const figs = d.figures.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:34px 0 0;"><tr>${d.figures.map((f) =>
    `<td valign="top" style="padding:0 36px 8px 0;"><div style="font-family:${SANS};font-size:44px;line-height:46px;font-weight:700;color:${P.cream};">${esc(f.value)}</div><div style="font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${P.rule};margin-top:8px;">${esc(f.label)}</div>${f.sub ? `<div style="font-family:${SANS};font-size:15px;font-weight:700;color:${P.cream};margin-top:3px;">${esc(f.sub)}</div>` : ''}</td>`).join('')}</tr></table>` : ''
  const section = (s: Doc['sections'][number]) => `<tr><td style="padding:30px 40px 0;">${eyebrow(s.num, P.soft)}<h2 style="${base}font-size:23px;line-height:28px;margin:0 0 16px;">${esc(s.title)}</h2>${s.blocks.map(block).join('')}</td></tr>`
  return `<!doctype html>
<html lang="${d.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(`${d.eyebrow} · ${d.hotel} · ${d.monthLabel}`)}</title></head>
<body style="margin:0;padding:0;background:${P.sand};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${P.sand}" style="background:${P.sand};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" bgcolor="${P.cream}" style="width:100%;max-width:640px;background:${P.cream};border:1px solid ${P.rule};">
${d.sample ? `<tr><td bgcolor="${P.sand}" style="background:${P.sand};padding:10px 40px;border-bottom:1px solid ${P.rule};font-family:${MONO};font-size:11px;letter-spacing:.6px;color:${P.pine};">${esc(d.sample)}</td></tr>` : ''}
<tr><td bgcolor="${P.pine}" style="background:${P.pine};padding:34px 40px 38px;border-bottom:4px solid ${accent};">
${top}
<div style="height:38px;line-height:38px;font-size:0;">&nbsp;</div>
${eyebrow(d.eyebrow, P.rule)}
<h1 style="font-family:${SANS};font-size:40px;line-height:44px;font-weight:700;color:${P.cream};margin:0 0 8px;">${esc(d.hotel)}</h1>
<div style="${light}font-size:18px;">${esc(d.monthLabel)}</div>
${figs}
${d.partial ? `<div style="${light}font-size:13px;font-style:italic;margin-top:22px;">${esc(d.partial)}</div>` : ''}
</td></tr>
${d.sections.map(section).join('\n')}
${d.about ? `<tr><td style="padding:34px 40px 0;"><div style="border-top:1px solid ${P.rule};padding-top:16px;">${eyebrow(d.about.title, P.soft)}${d.about.lines.map((l) => `<p style="${base}font-size:13px;line-height:20px;color:${P.soft};margin:0 0 4px;">${esc(l)}</p>`).join('')}</div></td></tr>` : ''}
${d.invite ? `<tr><td style="padding:28px 40px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td bgcolor="${P.sand}" style="background:${P.sand};padding:22px 24px;border-radius:10px;"><div style="${base}font-size:18px;font-weight:700;margin:0 0 6px;">${esc(d.invite.title)}</div><div style="${base}font-size:15px;line-height:22px;margin:0 0 10px;">${esc(d.invite.text)}</div><a href="${esc(d.invite.link.href)}" style="${base}font-size:15px;font-weight:700;text-decoration:underline;">${esc(d.invite.link.label)} →</a></td></tr></table></td></tr>` : ''}
<tr><td style="padding:34px 40px 32px;"><div style="border-top:1px solid ${P.rule};padding-top:14px;${base}font-size:12px;line-height:18px;color:${P.soft};">${esc(d.preparedBy)}<br>${esc(d.verified)}</div></td></tr>
</table></td></tr></table></body></html>`
}
