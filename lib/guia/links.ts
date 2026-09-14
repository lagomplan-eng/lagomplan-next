/**
 * lib/guia/links.ts
 *
 * UTM-tagging for outbound Insider links only. Airalo is a live
 * affiliate short-link (airalo.tpm.li) — do not run it through this or
 * any other href transform until the redirect has been tested manually.
 */

/** Appends utm_source=lagomplan&utm_medium=guide&utm_campaign=<pilotId>
 *  &utm_content=<partnerSlug> to an Insider (wa.me) href — pilotId for the
 *  pilot-level campaign (matches the planner CTA's utm_campaign), slug for
 *  per-building attribution Insider couldn't otherwise see. utm_content is
 *  free here — the partner doc's inbound distribution links are separate
 *  URLs, so there's no collision. Re-serializes the existing `text` query
 *  param through URLSearchParams, so the output is semantically
 *  equivalent (WhatsApp decodes it the same way) but not necessarily
 *  byte-identical to the original percent-encoding. */
export function withPilotUtm(href: string, pilotId: string, partnerSlug: string): string {
  try {
    const url = new URL(href)
    url.searchParams.set('utm_source', 'lagomplan')
    url.searchParams.set('utm_medium', 'guide')
    url.searchParams.set('utm_campaign', pilotId)
    url.searchParams.set('utm_content', partnerSlug)
    return url.toString()
  } catch {
    return href
  }
}
