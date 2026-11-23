// content/guia/hotel/themes.ts
//
// Place cards in the hotel edition carry one mark only: "Hidden gem" / "Joya escondida", on exactly the places in
// HIDDEN_GEMS and no others. (The Art and Food and drink marks were removed for a quieter page.)

import type { Lang } from '../types'

export const HIDDEN_GEM_LABEL: Record<Lang, string> = { en: 'Hidden gem', es: 'Joya escondida' }

// Café Nin was on this list only through its craving label; its label is now "Brunch" (Maleza carries "Hidden gem").
export const HIDDEN_GEMS = ['Maleza', 'Foro Shakespeare', 'Bósforo', 'Casa Franca', 'Proyecto Rufina', 'Mercado de San Juan']

export function isHiddenGem(name: string): boolean {
  return HIDDEN_GEMS.includes(name)
}
