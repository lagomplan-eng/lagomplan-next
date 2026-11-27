'use client'
// Toolbar of the report pages: month, language, page / email version, print, and the hotel's "count from" date. Hidden when printing.
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const sel: React.CSSProperties = { padding: 8, borderRadius: 6, border: '1px solid #C8BFB5', font: 'inherit', background: '#fff' }
const btn: React.CSSProperties = { font: 'inherit', fontSize: 13, padding: '8px 12px', borderRadius: 6, border: '1px solid #0F3A33', background: '#fff', color: '#0F3A33', cursor: 'pointer', textDecoration: 'none' }

export default function ReportToolbar({ base, month, months, lang, view, hotelId, countFrom, approvedDate }: {
  base: string; month?: string; months?: { value: string; label: string }[]; lang: 'es' | 'en'; view: 'page' | 'email'
  hotelId?: string; countFrom?: string | null; approvedDate?: string | null
}) {
  const router = useRouter()
  const [cf, setCf] = useState(countFrom ?? '')
  const [msg, setMsg] = useState<string | null>(null)
  const go = (o: { m?: string; lang?: string; v?: string }) => {
    const q = new URLSearchParams({ ...(month ? { m: o.m ?? month } : {}), lang: o.lang ?? lang, v: o.v ?? view })
    router.push(`${base}?${q}`)
  }
  async function saveCountFrom(value: string) {
    if (!hotelId) return
    setMsg(null)
    const res = await fetch(`/api/admin/hotels/${hotelId}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'count_from', count_from: value }) })
    const j = await res.json().catch(() => ({}))
    if (res.ok) { setMsg(value ? 'Guardado.' : 'Quitado: se cuenta desde la aprobación.'); router.refresh() }
    else setMsg(j.error === 'migration_missing' ? 'Primero aplica la migración 20261127000000 (columna count_from).' : `No se pudo: ${j.error ?? res.status}`)
  }
  return (
    <div className="rp-noprint" style={{ maxWidth: 780, margin: '0 auto 20px', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {months && month && (
          <select aria-label="Mes" value={month} onChange={(e) => go({ m: e.target.value })} style={sel}>
            {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        )}
        <select aria-label="Idioma" value={lang} onChange={(e) => go({ lang: e.target.value })} style={sel}>
          <option value="es">Español</option><option value="en">English</option>
        </select>
        <button style={{ ...btn, ...(view === 'page' ? { background: '#0F3A33', color: '#fff' } : {}) }} onClick={() => go({ v: 'page' })}>Informe</button>
        <button style={{ ...btn, ...(view === 'email' ? { background: '#0F3A33', color: '#fff' } : {}) }} onClick={() => go({ v: 'email' })}>Versión para correo</button>
        <button style={btn} onClick={() => window.print()}>Imprimir / guardar PDF</button>
      </div>
      {hotelId && (
        <div style={{ marginTop: 12, fontSize: 13, color: '#3E5F58', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <label>Contar desde <input type="date" value={cf} onChange={(e) => setCf(e.target.value)} style={{ ...sel, padding: 6 }} /></label>
          <button style={btn} onClick={() => saveCountFrom(cf)} disabled={!cf}>Guardar</button>
          {countFrom && <button style={btn} onClick={() => { setCf(''); saveCountFrom('') }}>Quitar</button>}
          <span>{countFrom ? `Fecha propia: ${countFrom}.` : `Sin fecha propia: se cuenta desde la aprobación${approvedDate ? ` (${approvedDate})` : ''}.`}</span>
          <span role="status">{msg}</span>
        </div>
      )}
      <p style={{ fontSize: 12, color: '#3E5F58', margin: '12px 0 0' }}>No se envía nada desde aquí. Es solo una vista previa.</p>
    </div>
  )
}
