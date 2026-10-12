import type { Lang, Partner } from '../../../content/guia/types'
import { withPlaceholders } from './placeholders'
import { WhatsAppIcon } from './WhatsAppIcon'
import styles from './guia.module.css'

/**
 * "Your stay at a glance": a flat sand-coloured card (no shadow, 4px radius,
 * hairline-divided rows, mono labels) so it reads as a fact sheet and not as
 * one of the rounded white cards of "A calm start". The WhatsApp button is
 * disabled and shows a highlighted placeholder until a wa.me link exists.
 */
export default function StayGlance({ lang, glance, whatsapp }: {
  lang: Lang
  glance: NonNullable<Partner['stayGlance']>
  whatsapp?: { label: string; href?: string }
}) {
  const es = lang === 'es'
  return (
    <aside className={styles.stayCard} aria-label={es ? 'Tu estancia de un vistazo' : 'Your stay at a glance'}>
      <h3 className={styles.stayTitle}>{es ? 'Tu estancia de un vistazo' : 'Your stay at a glance'}</h3>

      {glance.rules && (
        <div className={styles.stayRow}>
          <span className={styles.stayLabel}>{es ? 'Reglas de la casa' : 'House rules'}</span>
          <p className={styles.stayValue}>{withPlaceholders(glance.rules)}</p>
        </div>
      )}

      {(whatsapp || glance.email || glance.instagram) && (
        <div className={styles.stayRow}>
          <span className={styles.stayLabel}>{es ? 'Contacto' : 'Contact'}</span>
          {whatsapp && (
            whatsapp.href ? (
              <a className={styles.stayWa} href={whatsapp.href} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className={styles.stayWaIcon} />WhatsApp
              </a>
            ) : (
              <button type="button" className={`${styles.stayWa} ${styles.stayWaOff}`} disabled aria-disabled="true">
                <WhatsAppIcon className={styles.stayWaIcon} />
                <span>{withPlaceholders(whatsapp.label)}</span>
              </button>
            )
          )}
          {glance.email && <a className={styles.stayLink} href={`mailto:${glance.email}`}>{glance.email}</a>}
          {glance.instagram && (
            <a className={styles.stayLink} href={glance.instagram.href} target="_blank" rel="noopener noreferrer">
              Instagram {glance.instagram.handle}
            </a>
          )}
        </div>
      )}
    </aside>
  )
}
