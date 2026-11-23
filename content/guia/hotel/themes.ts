// content/guia/hotel/themes.ts
//
// Theme mark on place cards (hotel edition): Art / Food and drink / Hidden gem.
//   Art            museums, galleries, theatres, architecture
//   Food and drink restaurants, cafés, bakeries, bars, markets
//   Hidden gem     exactly the places in HIDDEN_GEMS, no others
// Parks and shops get no mark unless they are on the hidden gem list. A place can carry Hidden gem plus one other.
// Every place that appears on a card is listed below, including the ones with no mark, so nothing is left to chance
// (a test fails when a card shows a place that is not here).

import type { Lang } from '../types'

export type Theme = 'art' | 'food' | 'gem'

export const THEME_LABEL: Record<Theme, Record<Lang, string>> = {
  art: { en: 'Art', es: 'Arte' },
  food: { en: 'Food and drink', es: 'Comida y bebida' },
  gem: { en: 'Hidden gem', es: 'Joya escondida' },
}

export const HIDDEN_GEMS = ['Maleza', 'Café Nin', 'Foro Shakespeare', 'Bósforo', 'Casa Franca', 'Proyecto Rufina', 'Mercado de San Juan']

/** place -> Art | Food and drink | null (no mark besides Hidden gem) */
export const PLACE_THEME: Record<string, 'art' | 'food' | null> = {
  // Zone tabs: Roma Norte
  'Panadería Gala': 'food', 'Contramar': 'food', 'Plaza Río de Janeiro': null,
  'MODO, Museo del Objeto del Objeto': 'art', 'Librería El Péndulo': null, 'Licorería Limantour': 'food',
  // Condesa
  'Lardo': 'food', 'Ciena': 'food', 'Parque México': null,
  'Centro Cultural Bella Época / Librería Rosario Castellanos': null, // art deco cinema turned bookstore: a shop, so no mark (could be Art)
  'Proyecto Rufina': null, 'La Botica Mezcalería': 'food',
  // Polanco
  'ENO': 'food', 'El Turix': 'food', 'Parque Lincoln': null, 'Soumaya + Jumex': 'art', 'LAGO': null, 'Ticuchi': 'food',
  // Centro
  'Café de Tacuba': 'food', 'Azul Histórico': 'food', 'Alameda Central': null, 'Templo Mayor + Bellas Artes': 'art',
  'Mercado de San Juan': 'food', 'Bar La Ópera': 'food',
  // Mood panels
  'Lalo!': 'food', 'Masala y Maíz': 'food', 'Taquería Orinoco': 'food', 'El Vilsito': 'food', 'Café Avellaneda': 'food',
  'Quintonil': 'food', 'Café Nin': 'food', 'Nevería Roxy': 'food',
  'Museo Tamayo': 'art', 'Casa Luis Barragán': 'art', 'Kurimanzutto': 'art',
  'Foro Shakespeare': 'art', 'Bósforo': 'food', 'Casa Franca': 'food',
  'Bazar Sábado': null,
  'Departamento': 'food', 'Bar Federalista': 'food',
  'Papalote Museo del Niño': 'art', 'Chapultepec Zoo': null,
  // San Miguel Chapultepec (Kurimanzutto is above)
  'Mesa': 'food', 'Madereros': 'food', 'Bosque de Chapultepec': null, 'Casa Gilardi': 'art', 'El Mirador de Chapultepec': 'food',
  // Coyoacán (Café Avellaneda is above)
  'Mercado de Coyoacán': 'food', 'Jardín Centenario and Plaza Hidalgo': null, 'Jardín Centenario y Plaza Hidalgo': null,
  'Museo Frida Kahlo (Casa Azul)': 'art', 'Museo Casa de León Trotsky': 'art', 'La Coyoacana': 'food',
  // How much time: only a few hours (Condesa)
  'Museo de Arte Moderno': 'art', 'Niddo': 'food', 'Maleza': 'food',
}

/** Marks for a place, in display order: its theme first, then Hidden gem. Unknown places get none. */
export function placeThemes(name: string): Theme[] {
  const base = PLACE_THEME[name]
  return [...(base ? [base] : []), ...(HIDDEN_GEMS.includes(name) ? (['gem'] as Theme[]) : [])]
}
