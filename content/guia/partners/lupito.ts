// content/guia/partners/lupito.ts
//
// Partner layer for Lupito Partners — the first (and currently only) filled
// slot. Small and specific: everything reusable lives in the city layer.

import type { Partner } from '../types'

export const lupito: Partner = {
  slug: 'lupito',
  displayName: 'Lupito Partners',
  // Curator shown in the hero eyebrow ("Curado por …"). Lupito supplied no
  // individual host name, so the partner brand curates.
  hostName: 'Lupito Partners',
  city: 'cdmx',
  homeNeighborhood: 'Roma Norte',
  edition: {
    es: 'Edición Julio 2026',
    en: 'July 2026 Edition',
  },
  plannerCampaign: 'lupito',

  // No bespoke insider copy was provided for Lupito, so the Insiders section
  // stays unpublished — it unpublishes cleanly (no empty hole), per spec.
  // Do NOT invent experiences here; fill items[] + set publish: true only when
  // the partner delivers real copy.
  insiders: {
    publish: false,
  },
}
