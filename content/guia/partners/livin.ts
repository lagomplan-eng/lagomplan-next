// content/guia/partners/livin.ts
//
// Partner layer for Livin — the first (and currently only) filled slot.
// Small and specific: everything reusable lives in the city layer.

import type { Partner } from '../types'

export const livin: Partner = {
  slug: 'livin',
  displayName: 'Livin',
  // Curator shown in the hero eyebrow ("Curated by …").
  hostName: 'Livin',
  city: 'cdmx',
  homeNeighborhood: 'Roma Norte',
  edition: {
    es: 'Edición Julio 2026',
    en: 'July 2026 Edition',
  },
  plannerCampaign: 'livin',
  hostLetterSignature: 'Livin',

  // No bespoke insider copy provided yet, so the Insiders section stays
  // unpublished — it unpublishes cleanly (no empty hole). Do NOT invent
  // experiences here; fill items[] + set publish: true when real copy arrives.
  insiders: {
    publish: false,
  },
}
