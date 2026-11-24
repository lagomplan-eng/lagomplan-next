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
  /** Contact button to the host. Without `href` it renders disabled (the demo never carries a real number). */
  contact: { label: Record<Lang, string>; href?: string }
}
