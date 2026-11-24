/**
 * app/guia/[partner]/PaidLayer.tsx
 *
 * The paid edition's own sections, rendered by GuiaClient only when it receives the `paid` prop. GuiaClient has a few
 * insertion points; everything about the white-label layer lives here and in paid.module.css, so the free hotel guide,
 * the Livin guides and the Host Me Tender demos cannot be touched by it.
 */

import type { ReactNode } from 'react'
import type { Lang } from '../../../content/guia/types'
import type { PaidClient } from '../../../content/guia/paid/types'
import { PAID_SAMPLE_BANNER, PAID_SAMPLE_LABEL } from '../../../content/guia/paid/edition'
import { contactHref, whatsappHref } from '../../../content/guia/paid/links'
import { welcomeLine } from '../../../content/guia/paid/dates'
import { WhatsAppIcon } from './WhatsAppIcon'
import styles from './paid.module.css'

const samplePill = (paid: PaidClient, lang: Lang, cls = styles.samplePill) =>
  paid.sample ? <span className={cls}>{PAID_SAMPLE_LABEL[lang]}</span> : null

/** What the switches leave on the page: "Your house" needs switch A and its facts. Used by GuiaClient to place the review request. */
export const showsHouse = (paid: PaidClient) => paid.switches.houseFacts && !!paid.house
export const showsGuest = (paid: PaidClient) => paid.switches.pmsLink && !!paid.guest

/** The 4px brand bar and, while the content is sample, the demo banner. First thing on the page. */
export function PaidTopBars({ paid, lang }: { paid: PaidClient; lang: Lang }) {
  return (
    <>
      <div className={styles.brandBar} aria-hidden="true" />
      {paid.sample && <div className={styles.sampleBanner} role="note">{PAID_SAMPLE_BANNER[lang]}</div>}
    </>
  )
}

/** The client's logo (or its name) in the header, where the Lagomplan logo sits on the free guide. */
export function PaidBrandMark({ paid }: { paid: PaidClient }) {
  return (
    <span className={styles.mark}>
      {paid.logo
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={paid.logo} alt={paid.name} className={styles.markLogo} />
        : paid.name}
    </span>
  )
}

/** Letter from the host, with the contact button right under it. */
export function PaidLetter({ paid, lang }: { paid: PaidClient; lang: Lang }) {
  const letter = paid.letter[lang]
  const sample = samplePill(paid, lang)
  const href = contactHref(paid)
  return (
    <section className={styles.letterSection} data-paid-section="letter">
      <div className={styles.letterWrap}>
        <span className={styles.letterEyebrow}>{letter.eyebrow} {sample}</span>
        {letter.paragraphs.map((p, i) => <p className={styles.letterP} key={i}>{p}</p>)}
        <div className={styles.sig}>
          <span className={styles.sigName}>{letter.signature}</span>
          <span className={styles.sigRole}>{letter.roleLabel}</span>
        </div>
        <div className={styles.contactRow}>
          {href
            ? <a className={styles.contactBtn} href={href} target="_blank" rel="noopener noreferrer">{paid.contact.label[lang]}</a>
            : <button type="button" className={styles.contactBtn} aria-disabled="true" disabled>{paid.contact.label[lang]}</button>}
          {!href && sample}
        </div>
      </div>
    </section>
  )
}

// ── Preview 2 ──────────────────────────────────────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    guestSample: 'Sample guest',
    houseEyebrow: 'Your house', houseTitle: 'Everything for your stay at {name}',
    wifi: 'Wi-Fi', network: 'Network', password: 'Password', whoToCall: 'Who to call', access: 'Keys and access', checkIn: 'Check-in',
    luggage: 'Luggage', rules: 'House rules', checkOut: 'Check-out',
    reviewText: 'Enjoyed your stay? A short review helps us more than you think.', reviewBtn: 'Leave a review',
    servicesEyebrow: 'Services from your host', servicesTitle: 'Anything we can arrange for you', request: 'Request on WhatsApp',
  },
  es: {
    guestSample: 'Huésped de ejemplo',
    houseEyebrow: 'Tu casa', houseTitle: 'Todo para tu estancia en {name}',
    wifi: 'Wi-Fi', network: 'Red', password: 'Contraseña', whoToCall: 'A quién llamar', access: 'Llaves y acceso', checkIn: 'Check-in',
    luggage: 'Equipaje', rules: 'Reglas de la casa', checkOut: 'Check-out',
    reviewText: '¿Disfrutaste tu estancia? Una reseña breve nos ayuda más de lo que imaginas.', reviewBtn: 'Dejar una reseña',
    servicesEyebrow: 'Servicios de tu anfitrión', servicesTitle: 'Todo lo que podemos arreglar por ti', request: 'Pedir por WhatsApp',
  },
} as const

/** Switch B, the PMS line in the banner: how a guest's name and dates would appear. Sample data only; there is no PMS connection. */
export function PaidGuestLine({ paid, lang }: { paid: PaidClient; lang: Lang }) {
  if (!paid.guest) return null
  return (
    <p className={styles.guestLine} data-paid-section="guest">
      <span>{welcomeLine(paid.guest.name, paid.guest.arrive, paid.guest.depart, lang)}</span>
      {paid.sample && <span className={styles.guestPill}>{COPY[lang].guestSample}</span>}
    </p>
  )
}

/** The review request. In "Your house" it sits right under check-out; with "Your house" off it closes Good to know. */
export function PaidReview({ paid, lang }: { paid: PaidClient; lang: Lang }) {
  const c = COPY[lang]
  const href = paid.review?.href
  return (
    <div className={styles.review} data-paid-section="review">
      <p className={styles.reviewText}>{c.reviewText}</p>
      <div className={styles.reviewActions}>
        {href
          ? <a className={styles.reviewBtn} href={href} target="_blank" rel="noopener noreferrer">{c.reviewBtn}</a>
          : <button type="button" className={styles.reviewBtn} aria-disabled="true" disabled>{c.reviewBtn}</button>}
        {!href && samplePill(paid, lang)}
      </div>
    </div>
  )
}

/** Review request on its own (switch A off): after Good to know. */
export function PaidReviewStandalone({ paid, lang }: { paid: PaidClient; lang: Lang }) {
  return (
    <section className={styles.reviewStandalone}>
      <div className={styles.houseWrap}><PaidReview paid={paid} lang={lang} /></div>
    </section>
  )
}

/** Switch A, "Your house": the property's own facts in FIXED fields, one set per property. Check-out comes last, with the review request under it. */
export function PaidHouse({ paid, lang }: { paid: PaidClient; lang: Lang }) {
  const h = paid.house
  if (!h) return null
  const c = COPY[lang]
  const row = (label: string, value: ReactNode) => (
    <div className={styles.fact}><span className={styles.factLabel}>{label}</span><p className={styles.factValue}>{value}</p></div>
  )
  return (
    <section className={styles.houseSection} data-paid-section="house">
      <div className={styles.houseWrap}>
        <span className={styles.eyebrowBrand}>{c.houseEyebrow} {samplePill(paid, lang)}</span>
        <h2 className={styles.h2}>{c.houseTitle.replace('{name}', paid.name)}</h2>
        <div className={styles.facts}>
          {row(c.wifi, <>{c.network}: <strong>{h.wifi.network}</strong><br />{c.password}: <strong>{h.wifi.password}</strong></>)}
          {row(c.whoToCall, h.whoToCall[lang])}
          {row(c.access, h.access[lang])}
          {row(c.checkIn, <strong>{h.checkIn}</strong>)}
          {row(c.luggage, h.luggage[lang])}
          {row(c.rules, h.rules[lang])}
          {row(c.checkOut, <strong>{h.checkOut}</strong>)}
        </div>
        <PaidReview paid={paid} lang={lang} />
      </div>
    </section>
  )
}

/** Services and upsells from the host: a short text and a "Request on WhatsApp" button each. Without a number the buttons are disabled (and sample). */
export function PaidServices({ paid, lang }: { paid: PaidClient; lang: Lang }) {
  if (paid.services.length === 0) return null
  const c = COPY[lang]
  return (
    <section className={styles.servicesSection} data-paid-section="services">
      <div className={styles.servicesWrap}>
        <span className={styles.eyebrowBrand}>{c.servicesEyebrow} {samplePill(paid, lang)}</span>
        <h2 className={styles.h2}>{c.servicesTitle}</h2>
        <div className={styles.serviceGrid}>
          {paid.services.map((s) => {
            const href = whatsappHref(paid.whatsapp, s.request[lang])
            const label = <><WhatsAppIcon /> {c.request}</>
            return (
              <div className={styles.service} key={s.id}>
                <h3 className={styles.serviceTitle}>{s.title[lang]}</h3>
                <p className={styles.serviceText}>{s.text[lang]}</p>
                <div className={styles.requestRow}>
                  {href
                    ? <a className={styles.requestBtn} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
                    : <button type="button" className={styles.requestBtn} aria-disabled="true" disabled>{label}</button>}
                  {!href && samplePill(paid, lang)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
