'use client'

/**
 * app/guia/[partner]/PracticalSection.tsx
 *
 * "The practical part" — one merged section replacing both the old
 * standalone "Before you arrive" section and the separate "During your
 * stay" FAQ module. Four chips select which source renders below:
 *   Before you arrive · Your stay · Everyday errands · Eating in and hosting
 *
 * The two data models stay separate on purpose — arrivalItems (CityCopy,
 * shared per city) and the FAQ groups (resolveFaqModule's Partner > Zone >
 * base override chain) are unrelated stores. This component only unifies
 * them for RENDERING: each item, from either source, is normalized into
 * PracticalCardItem (icon/title/body/links) so they can share one card
 * grid and one chip-selection state machine. `arrivalItems` arrives here
 * already filtered (Partner.arrivalItemsOmit) and interpolated by the
 * caller — this component does no data-model work of its own.
 *
 * Chips are lighter than the cards they filter (text-only pills, no
 * icons) — see .filterChip in guia.module.css. The interaction pattern
 * (row of toggle buttons, aria-pressed, one active class) mirrors "Explore
 * by mood" and "Your neighborhood", but the visual style is new: neither
 * existing chip style matched the spec here without changing those other
 * sections too.
 *
 * No-JS fallback: before the mount effect flips `hydrated`, every
 * populated panel renders stacked with its label, no chip row.
 *
 * Anchors: on mount, a matching #anchor in the URL selects that item's
 * panel and schedules a scroll + brief highlight on the target card.
 * Arrival items are only deep-linkable when they carry an `id` (most
 * don't yet); FAQ items always do (base.ts assigns one to all 17).
 */

import { useEffect, useState } from 'react'
import { Icon } from './GuiaClient'
import type { ArrivalItem, IconKey, InlineLink, Lang, Partner } from '../../../content/guia/types'
import type { FaqGroupId, FaqItemKey, ResolvedFaqGroup } from '../../../content/guia/faq/types'
import { trackOutboundLink } from '../../../lib/analytics/ga'
import { withPilotUtm } from '../../../lib/guia/links'
import styles from './guia.module.css'

const MODULE_COPY: Record<Lang, { eyebrow: string; heading: string; subhead: string; beforeChip: string }> = {
  en: {
    eyebrow: 'THE PRACTICAL PART',
    heading: 'A calm start to your trip',
    subhead: 'Before you arrive, during your stay, and the errands in between.',
    beforeChip: 'Before you arrive',
  },
  es: {
    eyebrow: 'LO PRÁCTICO',
    heading: 'Un comienzo tranquilo',
    subhead: 'Antes de llegar, durante tu estancia, y los pendientes de en medio.',
    beforeChip: 'Antes de llegar',
  },
}

const GLANCE_LABELS: Record<Lang, { checkIn: string; checkOut: string; luggage: string }> = {
  en: { checkIn: 'Check-in', checkOut: 'Check-out', luggage: 'Luggage' },
  es: { checkIn: 'Entrada', checkOut: 'Salida', luggage: 'Equipaje' },
}

// FAQ items don't carry their own icon (unlike ArrivalItem) — assigned here,
// presentation-only, no change to the FAQ data model. Every value below is
// unique across this whole map AND distinct from every icon arrivalItems
// uses (plane/car/cloudSun/banknote/wifi/shield/briefcase/droplet/moon/
// parking/mountain/cross) — the original 25-icon set didn't have enough
// distinct options left over, so a few new IconKeys were added for this
// (content/guia/types.ts + GuiaClient's ICONS map).
const FAQ_ITEM_ICONS: Record<FaqItemKey, IconKey> = {
  checkinCheckout: 'clock',
  earlyLate: 'compass',
  keys: 'keyRound',
  luggage: 'suitcase',
  cleaning: 'sparkles',
  towels: 'basket',
  lateReturn: 'doorOpen',
  laundry: 'shirt',
  supermarkets: 'cart',
  currencyExchange: 'wallet',
  cashAtms: 'landmark',
  oddHours: 'alarmClock',
  coworking: 'laptop',
  gyms: 'dumbbell',
  haircuts: 'scissors',
  groupRestaurants: 'utensils',
  chefsAtHome: 'chefHat',
  cateringDelivery: 'truck',
  wineLiquor: 'martini',
  privateEvents: 'partyPopper',
}

type PanelId = 'before' | FaqGroupId

interface PracticalCardItem {
  key: string
  anchor?: string
  icon: IconKey
  title: string
  body: string
  links?: InlineLink[]
}

interface Panel {
  id: PanelId
  chipLabel: string
  items: PracticalCardItem[]
}

function PracticalCard({
  item,
  highlighted,
  partnerSlug,
  zone,
  pilotId,
  lang,
}: {
  item: PracticalCardItem
  highlighted?: boolean
  partnerSlug: string
  zone?: string
  pilotId: string
  lang: Lang
}) {
  return (
    <div
      className={`${styles.card} ${highlighted ? styles.faqItemHighlight : ''}`}
      id={item.anchor || undefined}
    >
      <div className={styles.iconChip}><Icon name={item.icon} color="var(--cream)" /></div>
      <h4 className={styles.h4}>{item.title}</h4>
      <p className={styles.cardBody}>
        {item.body}
        {item.links?.map((link, i) => {
          // Insider gets UTMs; Airalo is a live affiliate short-link and
          // stays untouched. Both still fire partner_link_click.
          const href = link.linkName === 'insider' ? withPilotUtm(link.href, pilotId, partnerSlug) : link.href
          return (
            <span key={i}>
              {' '}
              <a
                className={styles.link}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={link.linkName ? () => trackOutboundLink({
                  linkName: link.linkName!,
                  href,
                  partnerSlug,
                  zone,
                  lang,
                  section: 'before_you_arrive',
                }) : undefined}
              >{link.text}</a>
              {link.after}
            </span>
          )
        })}
      </p>
    </div>
  )
}

export default function PracticalSection({
  arrivalItems,
  faqGroups,
  atAGlance,
  practicalSubhead,
  partnerSlug,
  zone,
  pilotId,
  lang,
}: {
  arrivalItems: ArrivalItem[]
  faqGroups: ResolvedFaqGroup[] | null
  atAGlance: Partner['atAGlance']
  practicalSubhead: Partner['practicalSubhead']
  partnerSlug: string
  zone?: string
  pilotId: string
  lang: Lang
}) {
  const copy = MODULE_COPY[lang]
  const subhead = practicalSubhead?.[lang] ?? copy.subhead

  const beforeItems: PracticalCardItem[] = arrivalItems.map((item, i) => ({
    key: item.id ?? `before-${i}`,
    anchor: item.id,
    icon: item.icon,
    title: item.title,
    body: item.body,
    links: item.link ? [item.link] : undefined,
  }))

  const allPanels: Panel[] = []
  if (beforeItems.length > 0) {
    allPanels.push({ id: 'before', chipLabel: copy.beforeChip, items: beforeItems })
  }
  if (faqGroups) {
    for (const g of faqGroups) {
      allPanels.push({
        id: g.id,
        chipLabel: g.label,
        items: g.items.map((it) => ({
          key: it.key,
          anchor: it.anchor,
          icon: FAQ_ITEM_ICONS[it.key],
          title: it.label,
          body: it.body,
          links: it.links,
        })),
      })
    }
  }
  // A single item isn't worth its own browsable chip — it reads as a
  // near-empty tab, especially when that one fact is already surfaced in
  // the at-a-glance strip (e.g. checkinCheckout / checkout time). Its
  // content still lives in the underlying data (and the strip, if
  // applicable) — it just doesn't get a dedicated panel until there's
  // enough there to justify one.
  const panels: Panel[] = allPanels.filter((p) => p.items.length >= 2)

  const [hydrated, setHydrated] = useState(false)
  const [activePanel, setActivePanel] = useState<PanelId | null>(panels[0]?.id ?? null)
  const [highlightAnchor, setHighlightAnchor] = useState<string | null>(null)

  // Mount: flip to the chip UI, and resolve any landing anchor to its panel
  // before the first interactive paint.
  useEffect(() => {
    setHydrated(true)
    if (panels.length === 0) return
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      const match = panels.find((p) => p.items.some((it) => it.anchor === hash))
      if (match) {
        setActivePanel(match.id)
        setHighlightAnchor(hash)
        return
      }
    }
    setActivePanel(panels[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Once the target's panel is active (and its card is in the DOM), scroll
  // to it. The highlight itself is driven by `highlighted={item.anchor ===
  // highlightAnchor}` on PracticalCard below — declaratively, via React
  // state — rather than classList.add/remove: an imperative class survives
  // only until the next re-render (any parent state change reconciles the
  // DOM back to the plain className in the JSX), which silently erased the
  // highlight within ~100ms in practice. Clearing highlightAnchor here
  // removes the class the same declarative way.
  useEffect(() => {
    if (!highlightAnchor) return
    const scrollTimer = window.setTimeout(() => {
      document.getElementById(highlightAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 60)
    const clearTimer = window.setTimeout(() => setHighlightAnchor(null), 1260)
    return () => {
      window.clearTimeout(scrollTimer)
      window.clearTimeout(clearTimer)
    }
  }, [highlightAnchor, activePanel])

  if (panels.length === 0) return null

  const glanceLabels = GLANCE_LABELS[lang]
  const glanceBadges: { key: string; label: string; value: string }[] = []
  if (atAGlance?.checkIn) glanceBadges.push({ key: 'checkIn', label: glanceLabels.checkIn, value: atAGlance.checkIn })
  if (atAGlance?.checkOut) glanceBadges.push({ key: 'checkOut', label: glanceLabels.checkOut, value: atAGlance.checkOut })
  if (atAGlance?.luggage?.[lang]) glanceBadges.push({ key: 'luggage', label: glanceLabels.luggage, value: atAGlance.luggage[lang]! })

  const activePanelData = panels.find((p) => p.id === activePanel) ?? panels[0]

  return (
    <section id="practico" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.secGrid}>
          <div className={styles.secHead}>
            <span className={styles.eyebrowMono} style={{ color: 'var(--pine)', display: 'block', marginBottom: 12 }}>{copy.eyebrow}</span>
            <h2 className={styles.h2}>{copy.heading}</h2>
            <p className={styles.lede}>{subhead}</p>
            {glanceBadges.length > 0 && (
              <div className={styles.glanceRow}>
                {glanceBadges.map((b) => (
                  <span className={styles.glanceBadge} key={b.key}>{b.label} · {b.value}</span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.secBody}>
            {!hydrated ? (
              panels.map((panel) => (
                <div className={styles.faqStackedGroup} key={panel.id}>
                  <span className={`${styles.eyebrowMono} ${styles.faqStackedLabel}`} style={{ color: 'var(--pine)' }}>{panel.chipLabel}</span>
                  <div className={styles.cardGrid}>
                    {panel.items.map((item) => (
                      <PracticalCard item={item} partnerSlug={partnerSlug} zone={zone} pilotId={pilotId} lang={lang} key={item.key} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <>
                {panels.length > 1 && (
                  <div className={styles.filterChips}>
                    {panels.map((panel) => (
                      <button
                        key={panel.id}
                        type="button"
                        aria-pressed={activePanel === panel.id}
                        className={`${styles.filterChip} ${activePanel === panel.id ? styles.filterChipActive : ''}`}
                        onClick={() => setActivePanel(panel.id)}
                      >{panel.chipLabel}</button>
                    ))}
                  </div>
                )}
                {activePanelData && (
                  <div className={`${styles.cardGrid} ${styles.fade}`} key={activePanelData.id}>
                    {activePanelData.items.map((item) => (
                      <PracticalCard
                        item={item}
                        highlighted={item.anchor === highlightAnchor}
                        partnerSlug={partnerSlug}
                        zone={zone}
                        pilotId={pilotId}
                        lang={lang}
                        key={item.key}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
