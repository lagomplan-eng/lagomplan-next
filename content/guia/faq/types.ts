// content/guia/faq/types.ts
//
// Types for the "During your stay" FAQ module. The tier boundary is
// enforced by two separate key unions, not a comment: PropertyFaqKey is
// partner-only (e.g. checkout — must never be inheritable by neighborhood)
// and ZoneFaqKey is destination-level, shared by every partner in a zone.

import type { Lang, InlineLink } from '../types'

/** Tier A — property policy. Set only on Partner.faqAnswers. */
export type PropertyFaqKey =
  | 'checkinCheckout' | 'earlyLate' | 'keys' | 'luggage'
  | 'cleaning' | 'towels' | 'lateReturn'

/** Tier B — destination services. Set on Zone.answers, owned by Lagomplan. */
export type ZoneFaqKey =
  | 'laundry' | 'supermarkets' | 'currencyExchange' | 'cashAtms' | 'oddHours'
  | 'coworking' | 'gyms' | 'haircuts'
  | 'groupRestaurants' | 'chefsAtHome' | 'cateringDelivery'
  | 'wineLiquor' | 'privateEvents'

export type FaqItemKey = PropertyFaqKey | ZoneFaqKey

export type FaqGroupId = 'stay' | 'errands' | 'eating'

export interface FaqAnswer {
  body?: Partial<Record<Lang, string>>
  links?: Partial<Record<Lang, InlineLink[]>>
}

export interface FaqItemDef {
  key: FaqItemKey
  group: FaqGroupId
  /** Spanish slug, used as the anchor id in both locales. */
  anchor: string
  label: Record<Lang, string>
}

export interface FaqGroupDef {
  id: FaqGroupId
  label: Record<Lang, string>
}

/**
 * The canonical schema: keys, order, labels, anchors. Edited in exactly one
 * place (content/guia/faq/base.ts) and read by every partner via
 * getFaqBase() — this is what "editing demo propagates to every guide"
 * means structurally.
 */
export interface FaqBase {
  groups: FaqGroupDef[]
  items: FaqItemDef[]
  /** Answers true everywhere. Rare — most fields ship empty. */
  defaults?: Partial<Record<FaqItemKey, FaqAnswer>>
}

export interface ResolvedFaqItem {
  key: FaqItemKey
  anchor: string
  label: string
  body: string
  links?: InlineLink[]
}

export interface ResolvedFaqGroup {
  id: FaqGroupId
  label: string
  items: ResolvedFaqItem[]
}
