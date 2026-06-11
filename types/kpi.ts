export interface KpiWeekly {
  id: string
  week_id: string
  week_start: string
  week_label: string
  sessions: number | null
  sessions_wc: number | null
  planner_uses: number | null
  planner_wc: number | null
  stay22_clicks: number | null
  stay22_wc: number | null
  social_reach: number | null
  reel_saves: number | null
  subs_new: number | null
  accounts_new: number | null
  returning_logins: number | null
}

export interface KpiMonthly {
  id: string
  month_id: string
  month_label: string
  month_start: string
  revenue_total: number | null
  email_total: number | null
  explorer_active: number | null
  guides_published: number | null
  ad_spend: number | null
  stay22_month: number | null
}
