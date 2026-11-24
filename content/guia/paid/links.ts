// content/guia/paid/links.ts — WhatsApp links of a paid client. Pure.
import type { PaidClient } from './types'

/** wa.me link for a host number (digits, country code), optionally with a pre-filled message; null if the number is not plausible. */
export function whatsappHref(number: string | undefined, text?: string): string | null {
  if (!number || !/^\d{8,15}$/.test(number)) return null
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

/** The contact button's link: an explicit href (e.g. reception's page), else the host's WhatsApp, else none (button disabled). */
export function contactHref(c: PaidClient): string | null {
  return c.contact.href ?? whatsappHref(c.whatsapp)
}
