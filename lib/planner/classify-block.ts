/**
 * lib/planner/classify-block.ts
 *
 * Single source of truth for mapping a raw AI block (from the Edge
 * Function tool output, or from legacy stored trip data) to the
 * canonical client ItemType the renderer consumes.
 *
 * Order of preference:
 *   1. Trust the AI-emitted `type` if it's already one of the canonical
 *      semantic types ("hotel" / "restaurant" / "tour" / "transfer" /
 *      "free"). After the Edge Function moved to a semantic enum this
 *      is the common path.
 *   2. Map AI-side companion types ("culture" → "tour", "nature" → "free")
 *      so the renderer doesn't lose them.
 *   3. Keyword fallback on `type` → `title` → `description`. Catches:
 *        a) legacy stored trips written before the semantic-type
 *           rollout, and
 *        b) the occasional AI response that ignored the prompt and
 *           emitted an old-style generic type.
 *   4. Default to "free" so the renderer never crashes on a missing
 *      type — at the cost of putting the block in the Libre bucket.
 */

export type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer'

// Strong canonical types we trust outright when the AI emits them — these
// each carry an affiliate / booking surface and the AI deliberately picking
// one is high-signal.
//
// `free` is intentionally NOT in this set. It's both (a) the legitimate
// "free time" category and (b) the lazy/legacy default the AI falls back
// to when uncertain. We run keyword rescue on `free` so a block that's
// really a restaurant or transfer doesn't end up under Libre.
const TRUSTED_TYPES: Set<ItemType> = new Set([
  'hotel', 'tour', 'restaurant', 'transfer',
])

// AI-side companion types we accept and remap to the renderer's enum.
// `culture` is bookable surface (museums, guided experiences) → tour.
// `nature` is unbookable exploration (beach, parks) → free.
const COMPANION_MAP: Record<string, ItemType> = {
  culture: 'tour',
  nature:  'free',
}

interface RawBlock {
  type?:        unknown
  title?:       unknown
  name?:        unknown
  description?: unknown
  desc?:        unknown
}

/**
 * Maps a raw block to a canonical ItemType. Always returns a value —
 * never null, never undefined. Defaults to `'free'`.
 */
export function classifyBlock(raw: RawBlock | null | undefined): ItemType {
  if (!raw) return 'free'

  // 1. Trust a strong canonical type emitted by the AI (hotel /
  //    restaurant / tour / transfer). `free` is NOT in this set —
  //    see TRUSTED_TYPES comment.
  const rawType = String(raw.type ?? '').toLowerCase().trim()
  if (TRUSTED_TYPES.has(rawType as ItemType)) {
    return rawType as ItemType
  }

  // 2. Keyword rescue — scan type → title → desc. Runs BEFORE the
  //    companion remap so a 'culture' block whose title says
  //    "Check-in en X" upgrades to 'hotel' instead of getting
  //    permanently fixed at 'tour' via the companion map. Same
  //    rescue logic salvages restaurants from any non-trusted type.
  const detected =
    detectTypeFromText(String(raw.type ?? '')) ??
    detectTypeFromText(String(raw.title ?? raw.name ?? '')) ??
    detectTypeFromText(String(raw.description ?? raw.desc ?? ''))
  if (detected) return detected

  // 3. Companion remap — used when keyword rescue finds nothing.
  //    Lets AI 'culture' / 'nature' blocks reach a sensible bucket.
  if (rawType && COMPANION_MAP[rawType]) {
    return COMPANION_MAP[rawType]
  }

  // 4. Default.
  return 'free'
}

/**
 * Keyword-based detector. Exported for unit tests and legacy callers.
 * Returns null when no keyword bucket matches — caller decides the default.
 */
export function detectTypeFromText(text: string): ItemType | null {
  const t = text.toLowerCase()

  // Hotel — broad lodging coverage (ES + EN).
  if (
    t.includes('hotel') || t.includes('hosped') || t.includes('alojam') ||
    t.includes('lodg') || t.includes('accommod') ||
    t.includes('check-in') || t.includes('check in') || t.includes('checkin') ||
    t.includes('check-out') || t.includes('check out') || t.includes('checkout') ||
    t.includes('llegada al hotel') || t.includes('salida del hotel') ||
    t.includes('resort') || t.includes('hostal') || t.includes('airbnb') ||
    t.includes('inn ') || t.includes(' suites')
  ) return 'hotel'

  // Restaurant — narrow strong-signal keywords. Phase 1 expansion:
  // fonda / taquería / marisquería / parrilla / café / bakery /
  // and "<meal> en …" patterns in Spanish, which are the most
  // common AI phrasings that previously fell through to free.
  if (
    t.includes('restaur') ||
    t.includes(' bistro') ||
    t.includes('brunch') ||
    t.includes('fonda') ||
    t.includes('taquer') ||                  // taquería / taqueria
    t.includes('marisquer') ||               // marisquería / marisqueria
    t.includes('parrilla') ||
    t.includes('café') || t.includes(' cafe') ||
    t.includes('bakery') || t.includes('panader') ||
    t.includes('cena en ') ||
    t.includes('comida en ') ||
    t.includes('desayuno en ') ||
    t.includes('almuerzo en ')
  ) return 'restaurant'

  // Tour / activity.
  if (
    t.includes('tour') || t.includes('excurs') || t.includes('activid') ||
    t.includes('atraccion') || t.includes('activity') || t.includes('visita') ||
    t.includes('aventura') || t.includes('museo') || t.includes('museum')
  ) return 'tour'

  // Transfer / transport.
  if (
    t.includes('transfer') || t.includes('transport') || t.includes('traslad') ||
    t.includes('vuelo') || t.includes('flight') || t.includes('bus') ||
    t.includes('taxi') || t.includes('uber') || t.includes('lyft') ||
    t.includes('renta de auto') || t.includes('car rental')
  ) return 'transfer'

  // Free / rest.
  if (
    t.includes('relax') || t.includes('descanso') || t.includes('spa') ||
    t.includes('libre') || t.includes('playa') || t.includes('beach')
  ) return 'free'

  return null
}
