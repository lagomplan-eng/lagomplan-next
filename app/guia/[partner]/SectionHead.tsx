/**
 * app/guia/[partner]/SectionHead.tsx
 *
 * Section header: eyebrow + heading + optional lede. `eyebrowColor` overrides
 * the default coral eyebrow (applies to both languages — it's just styling).
 * Moved out of GuiaClient unchanged (same markup, same classes) so new
 * sections can reuse it without importing GuiaClient back.
 */

import styles from './guia.module.css'

export default function SectionHead({ eyebrow, title, lede, eyebrowColor }: { eyebrow: string; title?: string; lede?: string; eyebrowColor?: string }) {
  return (
    <div className={styles.secHead}>
      <span className={styles.eyebrow} style={eyebrowColor ? { color: eyebrowColor } : undefined}>{eyebrow}</span>
      {title && <h2 className={styles.h2}>{title}</h2>}
      {lede && <p className={styles.lede}>{lede}</p>}
    </div>
  )
}
