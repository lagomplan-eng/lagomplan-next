// content/guia/paid/types.ts
//
// The paid white-label edition: the free hotel guide (GuiaClient + the `hotel` prop) plus a client layer.
// Everything here is plain data (a prop of a client component), one object per client.
//
// A client is white-labelled on OUR fixed design: name, logo and ONE brand colour. No custom layout.
// Coral stays reserved for booking buttons; the brand colour is its own variable (--brand), never coral.

import type { Lang } from '../types'

/** The three per-client switches. */
export interface PaidSwitches {
  /** A. "Your house": the property's own facts (default on). */
  houseFacts: boolean
  /** B. A personal link per reservation (default off). */
  pmsLink: boolean
  /** C. The Lagomplan planner invitation at the end (default on). */
  plannerInvite: boolean
}

export const DEFAULT_PAID_SWITCHES: PaidSwitches = { houseFacts: true, pmsLink: false, plannerInvite: true }

export interface PaidLetter {
  eyebrow: string
  paragraphs: string[]
  signature: string
  roleLabel: string
}

/** "Your house": the property's own facts, FIXED fields only (no free-form sections). One set per property (one QR and link each). */
export interface HouseFacts {
  wifi: { network: string; password: string }
  /** Times as the guest reads them, e.g. "15:00". */
  checkIn: string
  checkOut: string
  /** Keys or access: how the guest gets in. */
  access: Record<Lang, string>
  luggage: Record<Lang, string>
  rules: Record<Lang, string>
  /** Who to call, and when. */
  whoToCall: Record<Lang, string>
}

/** A service the host offers (late check-out, airport transfer, breakfast, massage...). */
export interface PaidService {
  id: string
  title: Record<Lang, string>
  /** One or two short sentences. */
  text: Record<Lang, string>
  /** The message the WhatsApp button pre-fills. */
  request: Record<Lang, string>
}

/** PMS link (switch B): what a personal, per-reservation link would add. Sample data only in the demo; no PMS connection exists. */
export interface PaidGuest {
  name: string
  /** ISO dates (YYYY-MM-DD). */
  arrive: string
  depart: string
}

export interface PaidClient {
  /** Client id (the demo is 'casa-lagom'). */
  id: string
  /** Brand name, shown in the header, banner and letter. */
  name: string
  /** Public path of the logo. Without it the header shows the name. */
  logo?: string
  /** One brand colour (hex). Used for the paid layer's accents; never for booking buttons. */
  brandColor: string
  switches: PaidSwitches
  /** True while ALL host-supplied content on the page is sample content (the demo): it is labelled as such. */
  sample: boolean
  letter: Record<Lang, PaidLetter>
  /** Contact button to the host. Without `href` or `whatsapp` it renders disabled (the demo never carries a real number). */
  contact: { label: Record<Lang, string>; href?: string }
  /** The host's WhatsApp number, digits only with country code. Powers the contact button and the service requests. Absent in the demo. */
  whatsapp?: string
  /** Switch A: the property's own facts. */
  house?: HouseFacts
  /** Services and upsells. */
  services: PaidService[]
  /** Review request link (Google, TripAdvisor...). Absent = the button is disabled / sample. */
  review?: { href?: string }
  /** Switch B: the guest this link is for (PMS). Only used when switches.pmsLink is on. */
  guest?: PaidGuest
  /** The property's own address, used by "Send this guide to my phone" when the page has no ?h= code. Never the free zone link. */
  shareUrl?: string
}
