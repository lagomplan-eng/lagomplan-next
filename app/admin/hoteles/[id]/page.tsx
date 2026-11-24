// app/admin/hoteles/[id]/page.tsx — one hotel: scans per week and the sections its guests open most. Admin only.
import { notFound, redirect } from 'next/navigation'
import { getSupabaseServer } from '../../../../lib/supabase/server'
import { getAdminEmail } from '../../../../lib/hotels/admin'
import { getHotelById } from '../../../../lib/hotels/db'
import { loadHotelDetail } from '../../../../lib/hotels/stats'
import { hotelCardPath, hotelQrUrl } from '../../../../lib/hotels/links'
import { ZONE_LABEL } from '../../../../content/guia/hotel/zones'
import { EDITION_LABEL, STATUS_LABEL } from '../../../../lib/hotels/labels'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // never serve a hotel lookup from the Data Cache (see lib/hotels/db.ts)
export const revalidate = 0

export default async function AdminHotelDetail({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/es/login')
  if (!(await getAdminEmail())) notFound()
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const hotel = await getHotelById(id)
  if (!hotel) notFound()
  const stats = await loadHotelDetail(id)
  const max = Math.max(1, ...stats.weeks.map((w) => w.scans))
  const card = { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20 } as const

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>
      <p><a href="/admin/hoteles" style={{ color: '#0F3A33' }}>← Todos los hoteles</a></p>
      <h1 style={{ margin: '0 0 4px' }}>{hotel.hotel_name}</h1>
      <p style={{ margin: '0 0 20px', color: '#6B8F86' }}>
        {hotel.zone ? ZONE_LABEL[hotel.zone] : `Lista de espera: ${hotel.requested_zone ?? '—'}`} · {STATUS_LABEL[hotel.status] ?? hotel.status} · {EDITION_LABEL[hotel.edition] ?? hotel.edition}
      </p>
      <section style={card}>
        <p style={{ margin: 0 }}>{hotel.contact_name}{hotel.contact_role ? ` (${hotel.contact_role})` : ''} · {hotel.contact_email}{hotel.contact_phone ? ` · ${hotel.contact_phone}` : ''}{hotel.rooms ? ` · ${hotel.rooms} habitaciones` : ''}</p>
        <p style={{ margin: '8px 0 0', fontSize: 14 }}>
          Enlace del QR: <code>{hotelQrUrl(hotel.code)}</code> · <a href={hotelCardPath(hotel.code)}>tarjeta</a>
          {hotel.maps_url && <> · <a href={hotel.maps_url} target="_blank" rel="noopener noreferrer">Maps</a></>}
        </p>
        {hotel.notes && <p style={{ margin: '8px 0 0', fontSize: 14 }}>Notas: {hotel.notes}</p>}
      </section>
      <section style={card}>
        <h2 style={{ fontSize: 18, margin: '0 0 12px' }}>Escaneos por semana (últimas 12)</h2>
        {stats.weeks.map((w) => (
          <div key={w.weekStart} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, marginBottom: 4 }}>
            <span style={{ width: 90, fontFamily: 'var(--font-mono, monospace)' }}>{w.weekStart}</span>
            <span style={{ background: '#0F3A33', height: 12, width: `${(w.scans / max) * 60}%`, minWidth: w.scans ? 3 : 0, borderRadius: 3 }} />
            <span>{w.scans}</span>
          </div>
        ))}
      </section>
      <section style={card}>
        <h2 style={{ fontSize: 18, margin: '0 0 12px' }}>Secciones más abiertas</h2>
        {stats.topSections.length === 0 ? <p style={{ margin: 0 }}>Aún sin datos.</p> : (
          <ol style={{ margin: 0, paddingLeft: 20 }}>{stats.topSections.map((s) => <li key={s.section}>{s.section}: {s.opens}</li>)}</ol>
        )}
        {stats.outbound.length > 0 && (
          <>
            <h3 style={{ fontSize: 15, margin: '16px 0 8px' }}>Clics salientes</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>{stats.outbound.map((s) => <li key={s.section}>{s.section}: {s.clicks}</li>)}</ul>
          </>
        )}
      </section>
    </main>
  )
}
