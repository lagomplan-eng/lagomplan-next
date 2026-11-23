/**
 * components/guides/GuideTimely.tsx
 *
 * The dated block at the bottom of a guide (verified-on note, essentials, "when to go" calendar,
 * dated booking links). Presentational and server-rendered: whether it is still current is decided by
 * the adapter on the server (lib/data/guides/adapter.ts) every time the page is rebuilt, and guide pages
 * revalidate hourly, so the text is in the HTML and an expired block disappears without a deploy.
 */

import type { FlatTimely } from '../../lib/data/guides/types'
import { CardTitle, Eyebrow, InfoCard } from '../design'

export function GuideTimely({ data }: { data: FlatTimely }) {
  const t = data

  return (
    <InfoCard
      as="section"
      size="flush"
      data-guide="timely"
      aria-labelledby="guide-timely-title"
      className="mb-10"
    >
      <div className="px-6 pb-4 pt-5">
        <Eyebrow data-pl="timely-eyebrow">{t.eyebrow}</Eyebrow>
        <CardTitle as="h2" id="guide-timely-title" data-pl="timely-title">
          {t.title}
        </CardTitle>
        <p data-pl="timely-note" className="m-0 mt-2 text-tiny text-label">{t.verifiedNote}</p>
      </div>
      <div className="border-t border-line-soft" />

      <div data-pl="timely-body" className="px-6 pb-5 pt-4 font-sans text-body text-ink-2">
        {t.essentials && t.essentials.length > 0 && (
          <div className="mb-5">
            {t.essentialsTitle && <h3 className="m-0 mb-1.5 font-sans text-body font-bold text-pine">{t.essentialsTitle}</h3>}
            <ul className="list-disc pl-5 space-y-1">
              {t.essentials.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        <h3 className="m-0 mb-1.5 font-sans text-body font-bold text-pine">{t.whenTitle}</h3>
        {t.whenIntro && <p className="m-0 mb-2">{t.whenIntro}</p>}
        {t.window && <p className="m-0 mb-3 font-semibold text-pine">{t.window}</p>}

        {t.table && t.table.rows.length > 0 && (
          <div className="overflow-hidden rounded-info border border-line-soft">
            <div data-pl="timely-thead" className="hidden md:grid grid-cols-[1.1fr_1.1fr_1.6fr] gap-4 px-4 py-2.5 bg-cream font-sans text-eyebrow uppercase text-sage-text">
              {t.table.headers.map((h) => <div key={h}>{h}</div>)}
            </div>
            <ul className="m-0 list-none p-0">
              {t.table.rows.map((r, i) => (
                <li key={i} className="grid grid-cols-1 md:grid-cols-[1.1fr_1.1fr_1.6fr] gap-x-4 gap-y-1 px-4 py-3 border-t border-line-soft first:border-t-0 md:first:border-t">
                  <div className="font-semibold text-pine">{r.what}</div>
                  <div>{r.when}</div>
                  <div className="text-ink-2">{r.impact}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {t.booking && t.booking.links.length > 0 && (
          <p className="m-0 mt-4">
            <span className="font-semibold text-pine">{t.booking.label} </span>
            {t.booking.links.map((l, i) => (
              <span key={l.url}>
                {i > 0 && ' · '}
                <a href={l.url} target="_blank" rel="noopener noreferrer sponsored" className="text-pine underline underline-offset-2 decoration-sage/60 hover:decoration-pine">{l.name}</a>
              </span>
            ))}
          </p>
        )}
      </div>
    </InfoCard>
  )
}
