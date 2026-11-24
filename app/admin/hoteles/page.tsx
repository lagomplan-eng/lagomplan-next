// app/admin/hoteles/page.tsx — every hotel, its links and its numbers. Admin only.
import { notFound, redirect } from 'next/navigation'
import { getSupabaseServer } from '../../../lib/supabase/server'
import { getAdminEmail } from '../../../lib/hotels/admin'
import { loadDashboard } from '../../../lib/hotels/stats'
import { experiencesArePlaceholders, HOTEL_EXPERIENCES } from '../../../content/guia/hotel/experiences'
import HotelsTable from './HotelsTable'

export const dynamic = 'force-dynamic'

export default async function AdminHotelsPage() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/es/login')
  if (!(await getAdminEmail())) notFound()

  const { hotels, totals } = await loadDashboard()
  return (
    <main style={{ maxWidth: 1600, margin: '0 auto', padding: '32px 24px 80px' }}>
      <h1 style={{ fontSize: 28, margin: '0 0 4px' }}>Hoteles · guía de barrio</h1>
      <p style={{ margin: '0 0 24px', color: '#6B8F86' }}>Edición gratuita con QR.</p>
      {experiencesArePlaceholders() && (
        <div role="alert" style={{ background: '#FFF1D6', border: '1px solid #E5B85C', borderRadius: 10, padding: '12px 16px', margin: '0 0 24px' }}>
          Las experiencias de la guía de hoteles son provisionales (placeholders): los {HOTEL_EXPERIENCES.items.length} botones «Reservar en GetYourGuide»
          abren una búsqueda de GetYourGuide, no un tour concreto (content/guia/hotel/experiences.ts).
        </div>
      )}
      <HotelsTable hotels={hotels} totals={totals} />
    </main>
  )
}
