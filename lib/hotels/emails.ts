// lib/hotels/emails.ts
//
// Transactional emails for the hotel guide, via Resend (already in the repo). Resend is instantiated
// inside the function, never at module level. Failures are returned, never thrown: a failed email must
// not fail a signup or an approval. Sender: elena@lagomplan.com. Strings are bilingual by the hotel's
// signup language; sentence case, no exclamation marks.

import { Resend } from 'resend'
import { ZONE_LABEL } from '../../content/guia/hotel/zones'
import { adminHotelUrl, hotelCardUrl, hotelQrUrl } from './links'
import type { HotelRow } from './types'

const FROM = 'Elena de Lagomplan <elena@lagomplan.com>'

export const notifyRecipient = () => process.env.HOTEL_SIGNUP_NOTIFY_TO || 'elena@lagomplan.com'

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function send(to: string, subject: string, paragraphs: string[], cta?: { label: string; href: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) return { ok: false as const, error: 'RESEND_API_KEY missing' }
  try {
    const html = `<div style="font-family:Manrope,Arial,sans-serif;max-width:520px;margin:0 auto;color:#0F3A33;line-height:1.55">
${paragraphs.map((p) => `<p style="margin:0 0 14px">${p}</p>`).join('\n')}
${cta ? `<p style="margin:22px 0"><a href="${esc(cta.href)}" style="background:#0F3A33;color:#FFF9F3;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">${esc(cta.label)}</a></p>` : ''}
<p style="margin:24px 0 0;color:#6B8F86;font-size:13px">Lagomplan</p></div>`
    const text = paragraphs.map((p) => p.replace(/<[^>]+>/g, '')).join('\n\n') + (cta ? `\n\n${cta.label}: ${cta.href}` : '')
    const resend = new Resend(key)
    const { error } = await resend.emails.send({ from: FROM, to, subject, html, text })
    return error ? { ok: false as const, error: error.message } : { ok: true as const }
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : 'send failed' }
  }
}

const zoneText = (h: HotelRow) => (h.zone ? ZONE_LABEL[h.zone] : `${h.requested_zone ?? '—'} (lista de espera)`)

/** To Elena: a new signup, with a link to the hotel in the dashboard. */
export function sendSignupNotification(h: HotelRow) {
  return send(
    notifyRecipient(),
    `Nuevo hotel: ${h.hotel_name} · ${h.zone ? ZONE_LABEL[h.zone] : 'lista de espera'}`,
    [
      `<strong>${esc(h.hotel_name)}</strong> pidió la guía de barrio.`,
      `Zona: ${esc(zoneText(h))}<br>Contacto: ${esc(h.contact_name)}${h.contact_role ? ` (${esc(h.contact_role)})` : ''} · ${esc(h.contact_email)}${h.contact_phone ? ` · ${esc(h.contact_phone)}` : ''}${h.rooms ? `<br>Habitaciones: ${h.rooms}` : ''}${h.maps_url ? `<br>Maps: ${esc(h.maps_url)}` : ''}`,
    ],
    { label: 'Abrir en el panel', href: adminHotelUrl(h.id) },
  )
}

/** To the hotel, waitlist only: a confirmation, nothing else. */
export function sendWaitlistConfirmation(h: HotelRow) {
  return h.lang === 'en'
    ? send(h.contact_email, 'We got your request', [
        `Hi ${esc(h.contact_name)}, thank you for writing to us.`,
        `For now the neighborhood guide covers Condesa, Roma Norte and Polanco. We saved ${esc(h.hotel_name)} on our list for ${esc(h.requested_zone ?? 'your area')} and we will write to you when we get there.`,
      ])
    : send(h.contact_email, 'Recibimos tu solicitud', [
        `Hola ${esc(h.contact_name)}, gracias por escribirnos.`,
        `Por ahora la guía de barrio cubre Condesa, Roma Norte y Polanco. Guardamos a ${esc(h.hotel_name)} en nuestra lista para ${esc(h.requested_zone ?? 'tu zona')} y te escribimos cuando lleguemos.`,
      ])
}

/** To the hotel, on approval: a short thank-you, the printable card, and the guide link. */
export function sendApprovalEmail(h: HotelRow) {
  const card = hotelCardUrl(h.code)
  const guide = hotelQrUrl(h.code)
  return h.lang === 'en'
    ? send(h.contact_email, 'Your Lagomplan neighborhood guide is ready', [
        `Hi ${esc(h.contact_name)}, thank you for joining.`,
        `Your printable card is ready. It opens on a page where you can print it or save it as a PDF (A6, portrait).`,
        `This is the guide your guests will see when they scan the QR: <a href="${esc(guide)}">${esc(guide)}</a>`,
        `If something does not look right, reply to this email.`,
      ], { label: 'Open the printable card', href: card })
    : send(h.contact_email, 'Tu guía de barrio de Lagomplan está lista', [
        `Hola ${esc(h.contact_name)}, gracias por sumarte.`,
        `Tu tarjeta ya está lista. Se abre en una página donde puedes imprimirla o guardarla como PDF (A6, vertical).`,
        `Esta es la guía que verán tus huéspedes al escanear el QR: <a href="${esc(guide)}">${esc(guide)}</a>`,
        `Si algo no se ve bien, responde a este correo.`,
      ], { label: 'Abrir la tarjeta para imprimir', href: card })
}

/** To the hotel, on rejection: short and polite. */
export function sendRejectionEmail(h: HotelRow) {
  return h.lang === 'en'
    ? send(h.contact_email, 'About your neighborhood guide request', [
        `Hi ${esc(h.contact_name)}, thank you for your interest.`,
        `For now we cannot activate the guide for ${esc(h.hotel_name)}. If that changes, we will write to you. Thank you for your time.`,
      ])
    : send(h.contact_email, 'Sobre tu solicitud de guía de barrio', [
        `Hola ${esc(h.contact_name)}, gracias por tu interés.`,
        `Por ahora no podemos activar la guía para ${esc(h.hotel_name)}. Si eso cambia, te escribimos. Gracias por tu tiempo.`,
      ])
}
