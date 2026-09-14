// content/guia/faq/resolve.ts
//
// Resolves the "During your stay" module for one partner: Partner > Zone >
// base.defaults, on the same key. Resolved independently per language —
// picking one layer for the whole item would drop a body that exists at a
// lower layer just because a higher layer has the key in the other
// language, which will happen constantly since content is populated ES
// first. Links are always read from the same layer that supplied the body,
// so a link never ends up attached to another layer's answer.
//
// Safety gate: the module renders only when EITHER layer has real content —
// the partner's own property-layer answers (faqAnswers), or its zone's
// destination-layer answers. Written originally as faqAnswers-only, back
// when property content was the only way to populate the module; once zone
// files got real content, that blocked the case it was never meant to
// block (a partner with zone content but no property answers yet, e.g.
// livin_condesa). The intent is unchanged — never render an empty module —
// it still returns null when neither layer resolves (e.g. livin_roma,
// which has no zone file yet). Reviewing content before it goes live is a
// preview-process concern, not the resolver's.

import type { Lang, Partner } from '../types'
import type { Zone } from '../zones/types'
import type { FaqAnswer, FaqItemKey, ResolvedFaqGroup, ResolvedFaqItem } from './types'
import { faqBase } from './base'

export function getFaqBase() {
  return faqBase
}

export function resolveFaqModule(
  partner: Partner,
  zone: Zone | null,
  lang: Lang,
): ResolvedFaqGroup[] | null {
  const hasProperty = partner.faqAnswers && Object.keys(partner.faqAnswers).length > 0
  const hasZone = zone?.answers && Object.keys(zone.answers).length > 0
  if (!hasProperty && !hasZone) {
    return null
  }

  const base = faqBase
  const groups: ResolvedFaqGroup[] = []

  for (const groupDef of base.groups) {
    const items: ResolvedFaqItem[] = []

    for (const itemDef of base.items) {
      if (itemDef.group !== groupDef.id) continue

      const layers: Array<Partial<Record<FaqItemKey, FaqAnswer>> | undefined> = [
        partner.faqAnswers,
        zone?.answers,
        base.defaults,
      ]
      const source = layers.find((l) => l?.[itemDef.key]?.body?.[lang])
      const answer = source?.[itemDef.key]
      const body = answer?.body?.[lang]
      if (!answer || !body) continue // missing at all three layers → skip, no trace

      items.push({
        key: itemDef.key,
        anchor: itemDef.anchor,
        label: itemDef.label[lang],
        body,
        links: answer.links?.[lang],
      })
    }

    if (items.length === 0) continue // group absent from the DOM, not collapsed-empty
    groups.push({ id: groupDef.id, label: groupDef.label[lang], items })
  }

  return groups.length > 0 ? groups : null
}
