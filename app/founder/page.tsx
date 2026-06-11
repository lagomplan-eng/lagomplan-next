import { redirect } from 'next/navigation'
import { getSupabaseServer } from '../../lib/supabase/server'
import type { KpiWeekly, KpiMonthly } from '../../types/kpi'
import FounderDashboard from './FounderDashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Founder Dashboard — Lagomplan',
  robots: { index: false, follow: false },
}

export default async function FounderPage() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/es/login')

  const [{ data: weeklyRows }, { data: monthlyRows }] = await Promise.all([
    supabase
      .from('kpi_weekly')
      .select('*')
      .order('week_start', { ascending: true }),
    supabase
      .from('kpi_monthly')
      .select('*')
      .order('month_start', { ascending: true }),
  ])

  return (
    <FounderDashboard
      weeklyRows={(weeklyRows ?? []) as KpiWeekly[]}
      monthlyRows={(monthlyRows ?? []) as KpiMonthly[]}
    />
  )
}
