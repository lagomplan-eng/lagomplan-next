// app/admin/hoteles/ReportDoc.tsx — draws a report Doc as a clean page (prints to PDF from the browser). Server component.
import type { Block, Doc } from '../../../lib/hotels/report/doc'
import { PALETTE } from '../../../lib/hotels/report/email'

const safe = (c?: string) => (c && /^#[0-9a-fA-F]{6}$/.test(c) ? c : PALETTE.pine)

function Blk({ b, accent }: { b: Block; accent: string }) {
  switch (b.t) {
    case 'p': return <p className="rp-p">{b.text}</p>
    case 'note': return <p className="rp-note">{b.text}</p>
    case 'h': return <p className="rp-h">{b.text}</p>
    case 'stats': return (
      <div className="rp-stats">{b.items.map((i) => (
        <div key={i.label}><div className="rp-big" style={{ color: accent }}>{i.value}</div><div className="rp-small">{i.label}</div></div>
      ))}</div>
    )
    case 'table': return (
      <table className="rp-table">
        <thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((x, j) => <td key={j}>{x}</td>)}</tr>)}</tbody>
        {b.foot && <tfoot><tr>{b.foot.map((x, j) => <td key={j}>{x}</td>)}</tr></tfoot>}
      </table>
    )
  }
}

export default function ReportDoc({ doc }: { doc: Doc }) {
  const accent = safe(doc.brand?.colour)
  return (
    <article className="rp" lang={doc.lang}>
      <style>{CSS}</style>
      {doc.sample && <p className="rp-sample">{doc.sample}</p>}
      <header className="rp-head" style={{ borderBottomColor: accent }}>
        {doc.brand?.logoUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={doc.brand.logoUrl} alt={doc.brand.name} height={40} className="rp-logo" />}
        <p className="rp-kicker">{doc.title}</p>
        <h1 style={{ color: accent }}>{doc.hotel}</h1>
        <p className="rp-month">{doc.monthLabel}</p>
        <p className="rp-small">{doc.preparedBy}</p>
      </header>
      {doc.sections.map((s) => (
        <section key={s.id} className="rp-sec" data-section={s.id}>
          <h2>{s.title}</h2>
          {s.blocks.map((b, i) => <Blk key={i} b={b} accent={accent} />)}
        </section>
      ))}
      <footer className="rp-foot">{doc.poweredBy ? `${doc.preparedBy} · ${doc.poweredBy}` : doc.preparedBy}</footer>
    </article>
  )
}

const CSS = `
.rp{font-family:var(--font-sans),system-ui,sans-serif;color:${PALETTE.pine};background:${PALETTE.cream};max-width:780px;margin:0 auto;padding:36px 40px;border:1px solid ${PALETTE.rule}}
.rp h1{font-size:30px;line-height:1.15;margin:0 0 4px}
.rp h2{font-size:18px;margin:0 0 10px;padding:0 0 6px;border-bottom:1px solid ${PALETTE.rule}}
.rp-head{padding-bottom:16px;border-bottom:2px solid ${PALETTE.pine};margin-bottom:8px}
.rp-logo{display:block;height:40px;margin:0 0 12px}
.rp-kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${PALETTE.soft};margin:0 0 6px}
.rp-month{font-size:17px;margin:0 0 4px}
.rp-small{font-size:12px;color:${PALETTE.soft};margin:0}
.rp-sec{margin:26px 0 0;break-inside:avoid}
.rp-p{font-size:15px;line-height:1.55;margin:0 0 10px}
.rp-note{font-size:13px;line-height:1.5;margin:0 0 10px;color:${PALETTE.soft};font-style:italic}
.rp-h{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${PALETTE.soft};margin:14px 0 6px}
.rp-stats{display:flex;gap:28px;flex-wrap:wrap;margin:0 0 12px}
.rp-big{font-size:32px;font-weight:700;line-height:1.1}
.rp-table{width:100%;border-collapse:collapse;margin:0 0 12px}
.rp-table th,.rp-table td{text-align:left;font-size:14px;padding:7px 10px 7px 0;border-bottom:1px solid ${PALETTE.rule};vertical-align:top}
.rp-table th{font-size:12px;color:${PALETTE.soft}}
.rp-table tfoot td{font-weight:700}
.rp-sample{font-size:12px;font-weight:700;letter-spacing:.04em;margin:0 0 18px;padding:8px 10px;border:1px solid ${PALETTE.rule};background:${PALETTE.sand}}
.rp-foot{margin-top:28px;padding-top:12px;border-top:1px solid ${PALETTE.rule};font-size:12px;color:${PALETTE.soft}}
@media print{body{background:#fff}.rp{border:0;padding:0;max-width:none}.rp-noprint{display:none!important}.rp-table tr{break-inside:avoid}}
`
