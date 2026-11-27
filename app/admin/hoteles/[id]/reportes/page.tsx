// app/admin/hoteles/[id]/reportes/page.tsx — the monthly report of one hotel, for any month. Admin only. Nothing is sent from here.
// {id} is the hotel's uuid, its random code or its readable alias.
import { notFound, redirect } from 'next/navigation'
import { getSupabaseServer } from '../../../../../lib/supabase/server'
import { getAdminEmail } from '../../../../../lib/hotels/admin'
import { findHotel, loadHotelReport } from '../../../../../lib/hotels/report/load'
import { toDoc, monthLabel } from '../../../../../lib/hotels/report/doc'
import { renderEmail } from '../../../../../lib/hotels/report/email'
import { dateOfMx, isMonth, monthOf } from '../../../../../lib/hotels/report/period'
import ReportDoc from '../../ReportDoc'
import ReportToolbar from '../../ReportToolbar'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // never serve a hotel lookup from the Data Cache (see lib/hotels/db.ts)
export const revalidate = 0

export default async function HotelReportPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ m?: string; lang?: string; v?: string }> }) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/es/login')
  if (!(await getAdminEmail())) notFound()
  const { id } = await params
  const q = await searchParams
  const hotel = await findHotel(id)
  if (!hotel) notFound()

  const lang = q.lang === 'en' ? 'en' : 'es'
  const view = q.v === 'email' ? 'email' : 'page'
  const now = Date.now()
  const thisMonth = monthOf(now)
  const first = hotel.approved_at ? monthOf(Date.parse(hotel.approved_at)) : thisMonth
  const months: { value: string; label: string }[] = []
  for (let [y, m] = first.split('-').map(Number); `${y}-${String(m).padStart(2, '0')}` <= thisMonth; m === 12 ? (y++, (m = 1)) : m++) {
    const v = `${y}-${String(m).padStart(2, '0')}`
    months.push({ value: v, label: monthLabel(v, lang) })
  }
  months.reverse()
  const month = isMonth(q.m) ? q.m : (months[1]?.value ?? thisMonth)
  if (!months.some((x) => x.value === month)) months.unshift({ value: month, label: monthLabel(month, lang) })

  const report = await loadHotelReport(hotel, month, lang)
  const doc = toDoc(report)
  const countFrom = hotel.count_from ?? null
  return (
    <main style={{ padding: '24px 16px 80px', background: '#EDE7E1', minHeight: '100vh' }}>
      <p className="rp-noprint" style={{ maxWidth: 780, margin: '0 auto 12px' }}><a href="/admin/hoteles" style={{ color: '#0F3A33' }}>← Todos los hoteles</a></p>
      <ReportToolbar base={`/admin/hoteles/${id}/reportes`} month={month} months={months} lang={lang} view={view} hotelId={hotel.id} countFrom={countFrom} approvedDate={hotel.approved_at ? dateOfMx(Date.parse(hotel.approved_at)) : null} />
      {view === 'email'
        ? <iframe title="Versión para correo" srcDoc={renderEmail(doc)} style={{ display: 'block', width: '100%', maxWidth: 780, height: 1500, margin: '0 auto', border: '1px solid #C8BFB5', background: '#fff' }} />
        : <ReportDoc doc={doc} />}
    </main>
  )
}
