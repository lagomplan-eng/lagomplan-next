// app/admin/hoteles/reporte-muestra/page.tsx — a SAMPLE paid report for the invented Casa Lagom. Invented data, labelled as such. Admin only.
import { notFound, redirect } from 'next/navigation'
import { getSupabaseServer } from '../../../../lib/supabase/server'
import { getAdminEmail } from '../../../../lib/hotels/admin'
import { sampleReport } from '../../../../lib/hotels/report/sample'
import { toDoc } from '../../../../lib/hotels/report/doc'
import { renderEmail } from '../../../../lib/hotels/report/email'
import ReportDoc from '../ReportDoc'
import ReportToolbar from '../ReportToolbar'

export const dynamic = 'force-dynamic'

export default async function SampleReportPage({ searchParams }: { searchParams: Promise<{ lang?: string; v?: string }> }) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/es/login')
  if (!(await getAdminEmail())) notFound()
  const q = await searchParams
  const lang = q.lang === 'en' ? 'en' : 'es'
  const view = q.v === 'email' ? 'email' : 'page'
  const doc = toDoc(sampleReport(lang), { sample: true })
  return (
    <main style={{ padding: '24px 16px 80px', background: '#EDE7E1', minHeight: '100vh' }}>
      <p className="rp-noprint" style={{ maxWidth: 780, margin: '0 auto 12px' }}><a href="/admin/hoteles" style={{ color: '#0F3A33' }}>← Todos los hoteles</a></p>
      <ReportToolbar base="/admin/hoteles/reporte-muestra" lang={lang} view={view} />
      {view === 'email'
        ? <iframe title="Versión para correo (muestra)" srcDoc={renderEmail(doc)} style={{ display: 'block', width: '100%', maxWidth: 780, height: 1700, margin: '0 auto', border: '1px solid #C8BFB5', background: '#fff' }} />
        : <ReportDoc doc={doc} />}
    </main>
  )
}
