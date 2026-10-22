/**
 * lib/guia/arrival.ts
 *
 * Per-partner text overrides for the city-level "before you arrive" cards.
 * Keyed by the card's icon (unique per arrival item, see PracticalSection) so
 * no `id` has to be added to the shared city copy — an id renders as a DOM
 * anchor and would change every other partner's page. Pure.
 */

import type { ArrivalItem, IconKey, Lang, Partner } from '../../content/guia/types'

export type ArrivalOverrides = NonNullable<Partner['arrivalItemOverrides']>

export function applyArrivalOverride(
  item: ArrivalItem,
  overrides: ArrivalOverrides | undefined,
  lang: Lang,
): ArrivalItem {
  const o = overrides?.[item.icon as IconKey]?.[lang]
  if (!o) return item
  const { link, ...rest } = item
  const next: ArrivalItem = { ...rest, body: o.body ?? item.body }
  if (o.link) next.link = o.link
  else if (link && o.link !== null) next.link = o.linkAfter !== undefined ? { ...link, after: o.linkAfter } : link
  return next
}
