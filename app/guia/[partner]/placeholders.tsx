import type { ReactNode } from 'react'
import styles from './guia.module.css'

/**
 * Renders "[like this]" tokens as a highlighted <mark>. Demo configs keep
 * unconfirmed facts (price, check-out, operator WhatsApp) as bracketed
 * placeholders so they can't be mistaken for real data. Text without
 * brackets is returned unchanged, so real partners are unaffected.
 */
export function withPlaceholders(text: string): ReactNode {
  if (!text.includes('[')) return text
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    /^\[[^\]]+\]$/.test(part)
      ? <mark key={i} className={styles.placeholder}>{part}</mark>
      : part,
  )
}
