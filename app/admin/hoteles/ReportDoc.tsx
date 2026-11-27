// app/admin/hoteles/ReportDoc.tsx — draws a report Doc as a clean page that also prints to A4. Server component.
// Same visual language as the hotel guide: a dark pine band, small mono eyebrows, generous spacing, horizontal bars.
import type { Block, Doc } from '../../../lib/hotels/report/doc'
import { PALETTE } from '../../../lib/hotels/report/email'

const accentOf = (c?: string) => (c && /^#[0-9a-fA-F]{6}$/.test(c) ? c : PALETTE.pine)

function Blk({ b }: { b: Block }) {
  switch (b.t) {
    case 'text': return <div className="rp-tells">{b.paras.map((p, i) => <p key={i}>{p}</p>)}</div>
    case 'figures': return (
      <div className="rp-figs rp-figs-dark">{b.items.map((i) => <div key={i.label} className="rp-fig"><div className="rp-num">{i.value}</div><div className="rp-lab">{i.label}</div></div>)}</div>
    )
    case 'bars': {
      const max = Math.max(1, ...b.rows.map((r) => r.value))
      return (
        <div className="rp-group">
          {b.title && <p className="rp-gtitle">{b.title}</p>}
          {b.rows.map((r, i) => (
            <div key={i} className="rp-row">
              <div className="rp-rl">{r.label}{r.sub && <span className="rp-sub">{r.sub}</span>}</div>
              <div className="rp-track" aria-hidden="true"><div className="rp-fill" style={{ width: `${Math.max(r.value > 0 ? 2 : 0, (r.value / max) * 100)}%` }} /></div>
              <div className="rp-rc">{r.text}</div>
            </div>
          ))}
          {b.moreText && <p className="rp-more">{b.moreText}</p>}
        </div>
      )
    }
    case 'grid': return (
      <table className="rp-grid">
        <thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((x, j) => <td key={j}>{x}</td>)}</tr>)}</tbody>
        {b.foot && <tfoot><tr>{b.foot.map((x, j) => <td key={j}>{x}</td>)}</tr></tfoot>}
      </table>
    )
  }
}

export default function ReportDoc({ doc }: { doc: Doc }) {
  const accent = accentOf(doc.brand?.colour)
  return (
    <article className="rp" lang={doc.lang}>
      <style>{CSS}</style>
      {doc.sample && <p className="rp-sample">{doc.sample}</p>}
      <header className="rp-band" style={{ borderBottomColor: doc.brand ? accent : PALETTE.pine }}>
        <div className="rp-top">
          {doc.brand?.logoUrl
            ? <><span className="rp-chip">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={doc.brand.logoUrl} alt={doc.brand.name} height={30} /></span>{doc.poweredBy && <span className="rp-powered">{doc.poweredBy}</span>}</>
            : /* eslint-disable-next-line @next/next/no-img-element */ <img src="/images/report/lagomplan-logo-light.png" alt="Lagomplan" height={52} className="rp-logo" />}
        </div>
        <p className="rp-eyebrow">{doc.eyebrow}</p>
        <h1>{doc.hotel}</h1>
        <p className="rp-month">{doc.monthLabel}</p>
        {doc.figures.length > 0 && (
          <div className="rp-figs">{doc.figures.map((f) => (
            <div key={f.label} className="rp-fig"><div className="rp-num rp-num-band">{f.value}</div><div className="rp-lab rp-lab-band">{f.label}</div>{f.sub && <div className="rp-fsub">{f.sub}</div>}</div>
          ))}</div>
        )}
        {doc.partial && <p className="rp-partial">{doc.partial}</p>}
      </header>
      <div className="rp-body">
        {doc.sections.map((s) => (
          <section key={s.id} className="rp-sec" data-section={s.id}>
            <p className="rp-eyebrow rp-eyebrow-s">{s.num}</p>
            <h2>{s.title}</h2>
            {s.blocks.map((b, i) => <Blk key={i} b={b} />)}
          </section>
        ))}
        {doc.about && (
          <section className="rp-about" data-section="about">
            <p className="rp-eyebrow rp-eyebrow-s">{doc.about.title}</p>
            {doc.about.lines.map((l, i) => <p key={i}>{l}</p>)}
          </section>
        )}
        {doc.invite && (
          <section className="rp-invite" data-section="invite">
            <h3>{doc.invite.title}</h3>
            <p>{doc.invite.text}</p>
            <a href={doc.invite.link.href}>{doc.invite.link.label} →</a>
          </section>
        )}
        <footer className="rp-foot"><p>{doc.preparedBy}</p><p>{doc.verified}</p></footer>
      </div>
    </article>
  )
}

const CSS = `
.rp{--pine:${PALETTE.pine};--soft:${PALETTE.soft};--sand:${PALETTE.sand};--cream:${PALETTE.cream};--rule:${PALETTE.rule};font-family:var(--font-sans),system-ui,sans-serif;color:var(--pine);background:var(--cream);max-width:720px;margin:0 auto;border:1px solid var(--rule);font-size:16px;line-height:1.5}
.rp p{margin:0}
.rp-sample{font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:.06em;padding:10px 44px;background:var(--sand);border-bottom:1px solid var(--rule)}
.rp-band{background:var(--pine);color:var(--cream);padding:36px 44px 40px;border-bottom:4px solid var(--pine)}
.rp-top{display:flex;align-items:center;gap:14px;margin:0 0 40px;min-height:40px}
.rp-logo{display:block;height:52px;width:auto}
.rp-chip{display:inline-flex;background:var(--cream);padding:6px 12px;border-radius:6px}.rp-chip img{display:block;height:30px;width:auto}
.rp-powered{font-size:12px;color:var(--rule)}
.rp-eyebrow{font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--rule);margin:0 0 10px!important}
.rp-eyebrow-s{color:var(--soft);margin:0 0 6px!important}
.rp-band h1{font-size:44px;line-height:1.1;font-weight:700;margin:0 0 8px;color:var(--cream)}
.rp-month{font-size:18px;color:var(--rule)}
.rp-figs{display:flex;flex-wrap:wrap;gap:28px;margin:36px 0 0}
.rp-fig{flex:0 0 132px;min-width:0}
.rp-num{font-size:46px;line-height:1;font-weight:700;letter-spacing:-.01em}
.rp-num-band{color:var(--cream)}
.rp-lab{font-family:var(--font-mono),monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-top:8px;color:var(--soft)}
.rp-lab-band{color:var(--rule)}
.rp-fsub{font-size:15px;line-height:1.25;font-weight:700;margin-top:4px;color:var(--cream)}
.rp-partial{font-size:13px;font-style:italic;color:var(--rule);margin-top:26px!important}
.rp-body{padding:12px 44px 40px}
.rp-sec{padding:34px 0 0;break-inside:avoid;page-break-inside:avoid}
.rp-sec h2{font-size:24px;line-height:1.2;font-weight:700;margin:0 0 18px}
.rp-tells p{font-size:21px;line-height:1.45;font-weight:500;margin:0 0 12px}
.rp-group{margin:0 0 24px}
.rp-gtitle{font-size:13px;font-weight:700;color:var(--soft);margin:0 0 10px!important}
.rp-row{display:grid;grid-template-columns:minmax(120px,36%) 1fr 76px;align-items:center;gap:6px 14px;padding:7px 0;break-inside:avoid}
.rp-rl{font-size:15px;line-height:1.3}
.rp-sub{display:block;font-size:12px;color:var(--soft);margin-top:2px}
.rp-track{height:10px;background:var(--sand);border-radius:5px;overflow:hidden}
.rp-fill{height:100%;background:var(--pine);border-radius:5px}
.rp-rc{font-size:15px;font-weight:700;text-align:right;white-space:nowrap}
.rp-more{font-size:13px;color:var(--soft);margin-top:6px!important}
.rp-figs-dark{margin:6px 0 0}
.rp-figs-dark .rp-fig{flex:0 0 auto;max-width:190px;margin-right:8px}
.rp-figs-dark + .rp-group{margin-top:26px}
.rp-figs-dark .rp-num{color:var(--pine)}
.rp-figs-dark .rp-lab{color:var(--soft)}
.rp-grid{width:100%;border-collapse:collapse;font-size:14px}
.rp-grid th{font-family:var(--font-mono),monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--soft);text-align:left;font-weight:400;padding:0 8px 8px 0}
.rp-grid td{padding:9px 8px 9px 0;border-top:1px solid var(--rule);vertical-align:top}
.rp-grid tfoot td{font-weight:700}
.rp-about{margin:40px 0 0;padding:18px 0 0;border-top:1px solid var(--rule);break-inside:avoid}
.rp-about p:not(.rp-eyebrow){font-size:13px;line-height:1.55;color:var(--soft);margin:0 0 4px}
.rp-invite{margin:32px 0 0;padding:24px 26px;background:var(--sand);border-radius:10px;break-inside:avoid}
.rp-invite h3{font-size:18px;margin:0 0 6px}
.rp-invite p{font-size:15px;margin:0 0 10px}
.rp-invite a{color:var(--pine);font-weight:700;text-decoration:underline;text-underline-offset:3px}
.rp-foot{margin-top:40px;padding-top:14px;border-top:1px solid var(--rule);break-inside:avoid}
.rp-foot p{font-size:12px;color:var(--soft)}
@media (max-width:600px){
  .rp{border-left:0;border-right:0}
  .rp-band{padding:26px 22px 30px}.rp-body{padding:4px 22px 30px}.rp-sample{padding:10px 22px}
  .rp-top{margin-bottom:32px}.rp-band h1{font-size:34px}
  .rp-figs{gap:24px 16px}.rp-fig,.rp-figs-dark .rp-fig{flex:0 0 calc(50% - 8px);max-width:none;margin-right:0}.rp-num{font-size:42px}
  .rp-tells p{font-size:19px}
  .rp-row{grid-template-columns:1fr auto;gap:6px 12px}.rp-track{grid-column:1 / -1;grid-row:2}.rp-rc{grid-row:1;grid-column:2}
  .rp-grid{font-size:13px}
}
@page{size:A4;margin:12mm}
@media print{
  html,body{background:#fff!important}
  .rp-page{padding:0!important;background:#fff!important;min-height:0!important}
  .rp-noprint{display:none!important}
  .rp{max-width:none;border:0;font-size:14px}
  .rp,.rp *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .rp-band{padding:26px 30px 28px}.rp-body{padding:4px 30px 0}.rp-top{margin-bottom:26px}
  .rp-band h1{font-size:36px}.rp-figs{margin-top:24px}.rp-num{font-size:40px}
  .rp-sec{padding-top:22px}.rp-sec h2{font-size:20px;margin-bottom:12px}.rp-tells p{font-size:18px}
  .rp-row{padding:4px 0}.rp-group{margin-bottom:14px}
  .rp-about{margin-top:26px}.rp-foot{margin-top:26px}
}
`
