/**
 * app/guia/[partner]/PaidLayer.tsx
 *
 * The paid edition's own sections, rendered by GuiaClient only when it receives the `paid` prop. GuiaClient has a few
 * insertion points; everything about the white-label layer lives here and in paid.module.css, so the free hotel guide,
 * the Livin guides and the Host Me Tender demos cannot be touched by it.
 */

import type { Lang } from '../../../content/guia/types'
import type { PaidClient } from '../../../content/guia/paid/types'
import { PAID_SAMPLE_BANNER, PAID_SAMPLE_LABEL } from '../../../content/guia/paid/edition'
import styles from './paid.module.css'

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
  const sample = paid.sample ? <span className={styles.samplePill}>{PAID_SAMPLE_LABEL[lang]}</span> : null
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
          {paid.contact.href
            ? <a className={styles.contactBtn} href={paid.contact.href} target="_blank" rel="noopener noreferrer">{paid.contact.label[lang]}</a>
            : <button type="button" className={styles.contactBtn} aria-disabled="true" disabled>{paid.contact.label[lang]}</button>}
          {!paid.contact.href && sample}
        </div>
      </div>
    </section>
  )
}
