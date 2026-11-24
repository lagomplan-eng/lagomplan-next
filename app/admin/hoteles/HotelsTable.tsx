'use client'

import { Fragment, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { HotelWithStats } from '../../../lib/hotels/stats'
import { filterHotels } from '../../../lib/hotels/csv'
import { hotelCardPath, hotelShownUrl } from '../../../lib/hotels/links'
import { HOTEL_STATUSES } from '../../../lib/hotels/types'
import { EDITION_LABEL, STATUS_LABEL } from '../../../lib/hotels/labels'
import { ZONE_LABEL } from '../../../content/guia/hotel/zones'

const th: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', fontSize: 12, fontFamily: 'var(--font-mono, monospace)', whiteSpace: 'nowrap', borderBottom: '1px solid #cfd8d3' }
const td: React.CSSProperties = { padding: '10px', fontSize: 14, verticalAlign: 'top', borderBottom: '1px solid #e4e8e4' }
const btn: React.CSSProperties = { font: 'inherit', fontSize: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid #0F3A33', background: '#fff', color: '#0F3A33', cursor: 'pointer', marginRight: 6, marginBottom: 6 }
const date = (iso: string | null) => (iso ? iso.slice(0, 10) : '—')

export default function HotelsTable({ hotels, totals }: {
  hotels: HotelWithStats[]
  totals: { live: number; pending: number; waitlist: number; scansThisMonth: number }
}) {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [zone, setZone] = useState('')
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [editing, setEditing] = useState<{ id: string; notes: string } | null>(null)

  const rows = useMemo(() => filterHotels(hotels, { status, zone, q }), [hotels, status, zone, q])
  const exportHref = `/api/admin/hotels/export?${new URLSearchParams({ ...(status && { status }), ...(zone && { zone }), ...(q && { q }) })}`

  async function act(id: string, action: string, notes?: string) {
    setBusy(id + action); setMsg(null)
    try {
      const res = await fetch(`/api/admin/hotels/${id}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, notes }) })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) setMsg(`No se pudo: ${j.error ?? res.status}`)
      else {
        setMsg(j.email === 'sent' ? 'Hecho. Correo enviado.' : j.email === 'failed' ? 'Hecho, pero el correo falló.' : 'Hecho.')
        router.refresh()
      }
    } finally { setBusy(null); setEditing(null) }
  }

  const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); setMsg('Enlace copiado.') } catch { setMsg(t) } }
  const stat = (label: string, n: number) => (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', minWidth: 150 }}>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 13, color: '#6B8F86' }}>{label}</div>
    </div>
  )

  return (
    <>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {stat('Hoteles activos', totals.live)}{stat('Pendientes de aprobar', totals.pending)}
        {stat('En lista de espera', totals.waitlist)}{stat('Escaneos este mes', totals.scansThisMonth)}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
        <input aria-label="Buscar hotel" placeholder="Buscar hotel" value={q} onChange={(e) => setQ(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #cfd8d3' }} />
        <select aria-label="Estado" value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 8 }}>
          <option value="">Todos los estados</option>{HOTEL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <select aria-label="Zona" value={zone} onChange={(e) => setZone(e.target.value)} style={{ padding: 8 }}>
          <option value="">Todas las zonas</option>
          {(Object.keys(ZONE_LABEL) as (keyof typeof ZONE_LABEL)[]).map((z) => <option key={z} value={z}>{ZONE_LABEL[z]}</option>)}
          <option value="other">Otra zona (lista de espera)</option>
        </select>
        <a href={exportHref} style={{ ...btn, textDecoration: 'none', padding: '8px 12px' }}>Exportar CSV</a>
        <span role="status" style={{ fontSize: 13 }}>{msg}</span>
      </div>
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 900 }}>
          <thead><tr>
            {['Hotel', 'Zona', 'Estado', 'Edición', 'Contacto', 'Alta', 'Aprobación', 'Escaneos 30 d', 'Escaneos total', 'Último escaneo'].map((h) => <th key={h} style={th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td style={td} colSpan={10}>Sin resultados.</td></tr>}
            {rows.map((h) => (
              <Fragment key={h.id}>
                <tr>
                  <td style={{ ...td, borderBottom: 'none' }}><a href={`/admin/hoteles/${h.id}`} style={{ color: '#0F3A33', fontWeight: 700 }}>{h.hotel_name}</a>{h.rooms ? <div style={{ fontSize: 12, color: '#6B8F86' }}>{h.rooms} habitaciones</div> : null}</td>
                  <td style={{ ...td, borderBottom: 'none' }}>{h.zone ? ZONE_LABEL[h.zone] : <em>{h.requested_zone ?? '—'}</em>}</td>
                  <td style={{ ...td, borderBottom: 'none' }}>{STATUS_LABEL[h.status] ?? h.status}</td>
                  <td style={{ ...td, borderBottom: 'none' }}>{EDITION_LABEL[h.edition] ?? h.edition}</td>
                  <td style={{ ...td, borderBottom: 'none' }}>
                    {h.contact_name}{h.contact_role ? <span style={{ color: '#6B8F86' }}> · {h.contact_role}</span> : null}
                    <br /><span style={{ color: '#6B8F86' }}>{h.contact_email}</span>
                    {h.contact_phone ? <><br /><span style={{ color: '#6B8F86' }}>{h.contact_phone}</span></> : null}
                  </td>
                  <td style={{ ...td, borderBottom: 'none' }}>{date(h.created_at)}</td>
                  <td style={{ ...td, borderBottom: 'none' }}>{date(h.approved_at)}</td>
                  <td style={{ ...td, borderBottom: 'none' }}>{h.scans_30d}</td>
                  <td style={{ ...td, borderBottom: 'none' }}>{h.scans_total}</td>
                  <td style={{ ...td, borderBottom: 'none' }}>{date(h.last_scan)}</td>
                </tr>
                {/* Actions sit on their own row under the hotel, so no button depends on how wide the screen is. */}
                <tr>
                  <td colSpan={10} style={{ ...td, paddingTop: 0 }}>
                    <button style={btn} onClick={() => copy(hotelShownUrl(h.code))}>Copiar enlace</button>
                    <a style={{ ...btn, textDecoration: 'none', display: 'inline-block' }} href={hotelCardPath(h.code)} target="_blank" rel="noopener noreferrer">Abrir tarjeta</a>
                    {h.maps_url && <a style={{ ...btn, textDecoration: 'none', display: 'inline-block' }} href={h.maps_url} target="_blank" rel="noopener noreferrer">Maps</a>}
                    {h.zone && h.status !== 'approved' && <button style={btn} disabled={!!busy} onClick={() => act(h.id, 'approve')}>Aprobar</button>}
                    {h.status !== 'rejected' && <button style={btn} disabled={!!busy} onClick={() => confirm(`¿Rechazar ${h.hotel_name}?`) && act(h.id, 'reject')}>Rechazar</button>}
                    {h.status === 'approved' && <button style={btn} disabled={!!busy} onClick={() => act(h.id, 'pause')}>Pausar</button>}
                    {h.status === 'approved' && <button style={btn} disabled={!!busy} onClick={() => act(h.id, 'resend')}>Reenviar correo</button>}
                    <button style={btn} onClick={() => setEditing({ id: h.id, notes: h.notes ?? '' })}>Notas</button>
                    {editing?.id === h.id && (
                      <div style={{ marginTop: 6, maxWidth: 560 }}>
                        <textarea aria-label="Notas" rows={3} value={editing.notes} onChange={(e) => setEditing({ id: h.id, notes: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} />
                        <button style={btn} onClick={() => act(h.id, 'notes', editing.notes)}>Guardar</button>
                        <button style={btn} onClick={() => setEditing(null)}>Cancelar</button>
                      </div>
                    )}
                    {h.notes && editing?.id !== h.id && <span style={{ fontSize: 12, color: '#6B8F86', marginLeft: 6 }}>{h.notes}</span>}
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
