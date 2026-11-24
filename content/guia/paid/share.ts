// content/guia/paid/share.ts
//
// "Send this guide to my phone" in the paid edition: the WhatsApp message carries the PROPERTY's own link, with ?via=share
// (a link the guest shared is not a new scan: lib/hotels/bots.ts, isShareOpen). Never the free zone link.
//   with a property code   https://www.lagomplan.com/g/{code}?lang={lang}&via=share
//   without a code         {client.shareUrl}?lang={lang}&via=share   (the demo)
//   neither                null: the button is not shown (there is no honest link to send)
// Pure, no window.

import type { Lang } from '../types'
import { SHARE_HOST } from '../hotel/share'

export function paidShareUrl(a: { code: string | null; ownUrl?: string; lang: Lang }): string | null {
  if (a.code) return `${SHARE_HOST}/g/${a.code}?lang=${a.lang}&via=share`
  if (a.ownUrl) return `${a.ownUrl}${a.ownUrl.includes('?') ? '&' : '?'}lang=${a.lang}&via=share`
  return null
}

export function paidShareText(name: string, lang: Lang): string {
  return lang === 'es' ? `La guía de barrio de ${name}:` : `The ${name} neighborhood guide:`
}

/** The whole message (text, a space, the address) encoded once for wa.me; null when there is no own link. */
export function paidShareHref(a: { code: string | null; ownUrl?: string; lang: Lang; name: string }): string | null {
  const url = paidShareUrl(a)
  return url ? `https://wa.me/?text=${encodeURIComponent(`${paidShareText(a.name, a.lang)} ${url}`)}` : null
}
