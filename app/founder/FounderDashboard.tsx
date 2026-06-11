'use client'

import { useState, useRef } from 'react'
import { getSupabaseBrowser } from '../../lib/supabase/client'
import type { KpiWeekly, KpiMonthly } from '../../types/kpi'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  pine:   '#0F3A33',
  sage:   '#6B8F86',
  sand:   '#EDE7E1',
  coral:  '#E1615B',
  fjord:  '#2D4F6C',
  paper:  '#F6F2EC',
  muted:  '#8A8275',
  line:   '#DCD3C8',
  chip:   '#E4DCD1',
  amber:  '#B07A1E',
  purple: '#534AB7',
  green:  '#1A6B47',
} as const

const MONO = "var(--font-mono, 'DM Mono', 'Courier New', monospace)"
const SANS = "var(--font-sans, 'Manrope', system-ui, sans-serif)"

// ─── Edit field shapes ────────────────────────────────────────────────────────
type WeekEditFields = {
  sessions: string; sessions_wc: string; planner_uses: string; planner_wc: string
  stay22_clicks: string; stay22_wc: string; social_reach: string; reel_saves: string
  subs_new: string; accounts_new: string; returning_logins: string
}
type MonthEditFields = {
  revenue_total: string; email_total: string; explorer_active: string
  guides_published: string; ad_spend: string; stay22_month: string
}

// ─── Actions data ─────────────────────────────────────────────────────────────
const ACTIONS_DATA = [
  {
    weekId: 'W24', label: 'W24', tag: 'Arreglar las fugas', month: 'Junio',
    ventas: ['Pitch deck sponsor con prueba alcance 24K +279%', 'Shortlist 5 marcas seguros gear fintech'],
    marketing: ['Repuntar campana pagada + reels top hacia guias sede', 'Iniciar serie Errores del Mundial gancho de follow'],
    producto: ['Captura de email en 16 guias sede', 'Activar boton mapa movil Stay22 en guias sede 4x conv'],
  },
  {
    weekId: 'W25', label: 'W25', tag: 'Torneo en marcha', month: 'Junio',
    ventas: ['Enviar pitch 5 sponsors + primera llamada', 'Email a lista oferta lanzamiento Explorer'],
    marketing: ['Match-day guia sede semana + email cada 48h', 'Daily Stories calendario partidos'],
    producto: ['Deep-link Guia al Planificador en guias sede', 'Medir tasa captura tras fixes W24'],
  },
  {
    weekId: 'W26', label: 'W26', tag: 'Empujar conversion', month: 'Junio',
    ventas: ['Cerrar Sponsor #1 1000-1500 por mes 3 meses', 'A/B upgrade prompt Explorer'],
    marketing: ['A/B captions emocion vs utilidad doblar ganador', 'Carruseles logisticos por sede'],
    producto: ['Stay22 ListView en planner + copy contextual', 'Boton Continuar planeando en Mis Viajes'],
  },
  {
    weekId: 'W27', label: 'W27', tag: 'Bisagra', month: 'Junio',
    ventas: ['Outreach Sponsor #2 con #1 firmado + datos junio', 'Evaluar WC Kit digital si captura funciona'],
    marketing: ['Pico match-day guias octavos de final', 'Reels resultados + proxima sede'],
    producto: ['Si captura >=3 arrancar mobile trip view', 'Si no seguir iterando captura no nuevas features'],
  },
  {
    weekId: 'W28', label: 'W28', tag: 'Acumular base Explorer', month: 'Julio',
    ventas: ['Campana Explorer email lista + prompt in-app', 'Confirmar Sponsor #2'],
    marketing: ['Contenido cuartos semis + emails sedes', 'Guias hoteles last-minute por sede'],
    producto: ['Explorer descarga PDF + progress tracking', 'Auditar embudo donde se pierde el sub'],
  },
  {
    weekId: 'W29', label: 'W29', tag: 'Asegurar el piso', month: 'Julio',
    ventas: ['Renovar sponsors 3 meses ago-oct ANTES del 19 Jul', 'Check Explorer pagando vs meta mes'],
    marketing: ['Final Mundial wrap-up + arranque evergreen', 'Email cierre torneo a toda la lista'],
    producto: ['Confirmar todos los streams del piso activos', 'Doblar densidad links afiliados top guias'],
  },
  {
    weekId: 'W30', label: 'W30', tag: 'Pivote de contenido', month: 'Julio',
    ventas: ['Cerrar 1ra brand partnership post-WC gear-seguros', 'Proyeccion agosto vs piso 10K'],
    marketing: ['Pivote audiencia Roberto hacia Valentina-Andrea', 'Iniciar 6 guias evergreen Q4'],
    producto: ['Refinar captura y onboarding trafico evergreen', 'Notificaciones viaje retencion Explorer'],
  },
  {
    weekId: 'W31', label: 'W31', tag: 'Cierre de mes', month: 'Julio',
    ventas: ['Revision mensual + pipeline sponsors Q4', 'Sostener push Explorer'],
    marketing: ['Publicar guias evergreen SEO oct-dic', 'Plan editorial agosto'],
    producto: ['El Brief SI captura >=3 si no diferir', 'Retro captura mejoro vs junio'],
  },
  {
    weekId: 'W32', label: 'W32', tag: 'Sostener el piso', month: 'Agosto',
    ventas: ['Sostener 2 sponsors + brand partnership activa', 'Cohorts retencion Explorer'],
    marketing: ['11 guias mes evergreen SEO busquedas Q4', 'Doble densidad afiliados top performers'],
    producto: ['Retencion Explorer favoritos + notificaciones churn <15%', 'Continuar mobile trip view'],
  },
  {
    weekId: 'W33', label: 'W33', tag: 'Amplificar', month: 'Agosto',
    ventas: ['Activar microinfluencers compuertas estables', 'Negociar extensiones sponsor Q4'],
    marketing: ['Briefs microinfluencers + UGC', 'Optimizar top guias evergreen'],
    producto: ['Medir impacto microinfluencers en tasa captura', 'Iterar onboarding evergreen'],
  },
  {
    weekId: 'W34', label: 'W34', tag: 'Optimizar', month: 'Agosto',
    ventas: ['Revisar churn Explorer campana anti-churn', 'Confirmar piso sostenido mes a mes'],
    marketing: ['A/B de captura en guias evergreen', 'Pinterest + Facebook groups organico'],
    producto: ['PWA shell prep si piso estable', 'Backlog forma rediseñada planificador Sep'],
  },
  {
    weekId: 'W35', label: 'W35', tag: 'Lock + plan Q4', month: 'Agosto',
    ventas: ['Confirmar piso 10K sostenido pipeline Q4 sponsors', 'Cierre mes + proyeccion septiembre'],
    marketing: ['Plan editorial Q4 navidad año nuevo', 'Retro marketing que formato convirtio'],
    producto: ['Retro trimestral + plan producto septiembre', 'Priorizar El Brief Atlas segun datos retencion'],
  },
]

const MONTHS_ORDER = ['Junio', 'Julio', 'Agosto']
const TOTAL_ACTIONS = ACTIONS_DATA.length * 6

// ─── Helpers ──────────────────────────────────────────────────────────────────
type KpiStatus = 'up' | 'base' | 'low' | 'none'

function kpiStatus(v: number | null, base: number, up: number): KpiStatus {
  if (v == null) return 'none'
  if (v >= up) return 'up'
  if (v >= base) return 'base'
  return 'low'
}

const STATUS_COLOR: Record<KpiStatus, string> = {
  up: '#1A6B47', base: '#B07A1E', low: '#E1615B', none: '#B0A899',
}
const STATUS_LABEL: Record<KpiStatus, string> = {
  up: 'en rango', base: 'base', low: 'bajo', none: '—',
}

function fmtVal(v: number | null, isMoney = false): string {
  if (v == null) return '—'
  if (isMoney) return `$${Number(v).toLocaleString('es-MX')}`
  return Number(v).toLocaleString('es-MX')
}

function fmtCompact(v: number): string {
  if (v >= 10000) return `${(v / 1000).toFixed(0)}k`
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(v)
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function weekToEditFields(w: KpiWeekly): WeekEditFields {
  return {
    sessions:        w.sessions?.toString() ?? '',
    sessions_wc:     w.sessions_wc?.toString() ?? '',
    planner_uses:    w.planner_uses?.toString() ?? '',
    planner_wc:      w.planner_wc?.toString() ?? '',
    stay22_clicks:   w.stay22_clicks?.toString() ?? '',
    stay22_wc:       w.stay22_wc?.toString() ?? '',
    social_reach:    w.social_reach?.toString() ?? '',
    reel_saves:      w.reel_saves?.toString() ?? '',
    subs_new:        w.subs_new?.toString() ?? '',
    accounts_new:    w.accounts_new?.toString() ?? '',
    returning_logins: w.returning_logins?.toString() ?? '',
  }
}

function monthToEditFields(m: KpiMonthly): MonthEditFields {
  return {
    revenue_total:  m.revenue_total?.toString() ?? '',
    email_total:    m.email_total?.toString() ?? '',
    explorer_active: m.explorer_active?.toString() ?? '',
    guides_published: m.guides_published?.toString() ?? '',
    ad_spend:       m.ad_spend?.toString() ?? '',
    stay22_month:   m.stay22_month?.toString() ?? '',
  }
}

function parseIntField(s: string): number | null {
  const n = parseInt(s, 10)
  return isNaN(n) ? null : n
}

function parseFloatField(s: string): number | null {
  const n = parseFloat(s)
  return isNaN(n) ? null : n
}

// ─── WC Badge ─────────────────────────────────────────────────────────────────
function WcBadge() {
  const now = new Date()
  const wcStart = new Date('2026-06-11')
  const wcEnd   = new Date('2026-07-19')
  let bg: string = C.pine
  let text = ''
  if (now < wcStart) {
    const days = Math.ceil((wcStart.getTime() - now.getTime()) / 86400000)
    bg = C.pine
    text = `WC Arranca en ${days} dia${days === 1 ? '' : 's'}`
  } else if (now <= wcEnd) {
    const day = Math.floor((now.getTime() - wcStart.getTime()) / 86400000) + 1
    bg = C.coral
    text = `WC Dia ${day} de 39`
  } else {
    bg = C.muted
    text = 'WC Finalizado'
  }
  return (
    <div style={{
      fontFamily: MONO, fontSize: 11, background: bg, color: C.sand,
      padding: '5px 13px', borderRadius: 20, whiteSpace: 'nowrap',
    }}>
      {text}
    </div>
  )
}

// ─── Sparklines ───────────────────────────────────────────────────────────────
function WeekSparkline({ rows, selectedWeekId }: { rows: KpiWeekly[], selectedWeekId: string }) {
  const last6 = [...rows].sort((a, b) => a.week_start.localeCompare(b.week_start)).slice(-6)
  const maxVal = Math.max(...last6.map(r => r.sessions ?? 0), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28 }}>
      {last6.map(r => {
        const v = r.sessions ?? 0
        const h = v > 0 ? Math.max(2, Math.round((v / maxVal) * 28)) : 0
        return (
          <div key={r.week_id} style={{
            width: 8, height: h || 2,
            background: r.week_id === selectedWeekId ? C.coral : C.sage,
            opacity: v === 0 ? 0.3 : 1,
            borderRadius: 2, alignSelf: 'flex-end',
          }} />
        )
      })}
    </div>
  )
}

function MonthSparkline({ rows, selectedMonthId }: { rows: KpiMonthly[], selectedMonthId: string }) {
  const last6 = [...rows].sort((a, b) => a.month_start.localeCompare(b.month_start)).slice(-6)
  const maxVal = Math.max(...last6.map(r => Number(r.revenue_total ?? 0)), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28 }}>
      {last6.map(r => {
        const v = Number(r.revenue_total ?? 0)
        const h = v > 0 ? Math.max(2, Math.round((v / maxVal) * 28)) : 0
        return (
          <div key={r.month_id} style={{
            width: 8, height: h || 2,
            background: r.month_id === selectedMonthId ? C.coral : C.sage,
            opacity: v === 0 ? 0.3 : 1,
            borderRadius: 2, alignSelf: 'flex-end',
          }} />
        )
      })}
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, base, up, isMoney = false }: {
  label: string; value: number | null; base: number; up: number; isMoney?: boolean
}) {
  const s = kpiStatus(value, base, up)
  const fillPct = value != null ? Math.min(100, Math.round((Number(value) / up) * 100)) : 0
  return (
    <div style={{
      background: 'white', border: `1px solid ${C.line}`, borderRadius: 12, padding: 16,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 4, letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 22, color: value != null ? C.pine : '#B0A899', marginBottom: 7, lineHeight: 1.1 }}>
        {fmtVal(value, isMoney)}
      </div>
      <div style={{
        display: 'inline-block', background: STATUS_COLOR[s] + '22',
        color: STATUS_COLOR[s], fontSize: 9.5, padding: '2px 7px', borderRadius: 20, marginBottom: 8,
      }}>
        {STATUS_LABEL[s]}
      </div>
      <div style={{ height: 4, background: C.sand, borderRadius: 2, marginBottom: 6 }}>
        <div style={{ height: '100%', width: `${fillPct}%`, background: STATUS_COLOR[s], borderRadius: 2 }} />
      </div>
      <div style={{ fontFamily: MONO, fontSize: 8.5, color: C.muted }}>
        {isMoney
          ? `$${base.toLocaleString('es-MX')} — $${up.toLocaleString('es-MX')}`
          : `${base.toLocaleString('es-MX')} — ${up.toLocaleString('es-MX')}`}
      </div>
    </div>
  )
}

// ─── Hero Card ────────────────────────────────────────────────────────────────
function HeroCard({ label, cadence, value, base, up, isMoney = false, sparkline }: {
  label: string; cadence: 'SEMANA' | 'MES'; value: number | null
  base: number; up: number; isMoney?: boolean; sparkline: React.ReactNode
}) {
  const s = kpiStatus(value, base, up)
  const fillPct = value != null ? Math.min(100, Math.round((Number(value) / up) * 100)) : 0
  return (
    <div style={{
      background: 'white', border: `1px solid ${C.line}`, borderRadius: 13, padding: 20, flex: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 11.5, color: C.muted }}>{label}</span>
        <span style={{
          fontFamily: MONO, fontSize: 9, padding: '2px 7px', borderRadius: 20,
          background: cadence === 'SEMANA' ? C.fjord : C.pine, color: 'white',
        }}>
          {cadence}
        </span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 32, color: value != null ? C.pine : '#B0A899', marginBottom: 6, lineHeight: 1.1 }}>
        {fmtVal(value, isMoney)}
      </div>
      <div style={{
        display: 'inline-block', background: STATUS_COLOR[s] + '22',
        color: STATUS_COLOR[s], fontSize: 9.5, padding: '2px 7px', borderRadius: 20, marginBottom: 12,
      }}>
        {STATUS_LABEL[s]}
      </div>
      <div style={{ marginBottom: 10 }}>{sparkline}</div>
      <div style={{ height: 6, background: C.sand, borderRadius: 3, marginBottom: 6 }}>
        <div style={{ height: '100%', width: `${fillPct}%`, background: STATUS_COLOR[s], borderRadius: 3 }} />
      </div>
      <div style={{ fontFamily: MONO, fontSize: 8.5, color: C.muted }}>
        {isMoney
          ? `$${base.toLocaleString('es-MX')} — $${up.toLocaleString('es-MX')}`
          : `${base.toLocaleString('es-MX')} — ${up.toLocaleString('es-MX')}`}
      </div>
    </div>
  )
}

// ─── Pills ────────────────────────────────────────────────────────────────────
function WeekPills({ rows, selected, onSelect, currentWeekId }: {
  rows: KpiWeekly[]; selected: string; onSelect: (id: string) => void; currentWeekId: string | undefined
}) {
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
      {rows.map(r => {
        const isSel = r.week_id === selected
        const isCurrent = r.week_id === currentWeekId
        return (
          <button
            key={r.week_id}
            onClick={() => onSelect(r.week_id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: MONO, fontSize: 11, whiteSpace: 'nowrap',
              background: isSel ? C.pine : C.chip,
              color: isSel ? C.sand : C.muted,
              border: 'none', borderRadius: 20, padding: '5px 12px',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            {isCurrent && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.coral, display: 'inline-block' }} />
            )}
            {r.week_id}
          </button>
        )
      })}
    </div>
  )
}

function MonthPills({ rows, selected, onSelect }: {
  rows: KpiMonthly[]; selected: string; onSelect: (id: string) => void
}) {
  const shortLabel = (label: string) => label.replace('2026', '').trim().slice(0, 3)
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
      {rows.map(r => {
        const isSel = r.month_id === selected
        return (
          <button
            key={r.month_id}
            onClick={() => onSelect(r.month_id)}
            style={{
              fontFamily: MONO, fontSize: 11, whiteSpace: 'nowrap',
              background: isSel ? C.pine : C.chip,
              color: isSel ? C.sand : C.muted,
              border: 'none', borderRadius: 20, padding: '5px 12px',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            {shortLabel(r.month_label)}
          </button>
        )
      })}
    </div>
  )
}

// ─── Number input ─────────────────────────────────────────────────────────────
function NumInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase' as const, color: C.muted, letterSpacing: '0.05em' }}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          fontFamily: MONO, fontSize: 13, color: C.pine,
          border: `1px solid ${C.line}`, borderRadius: 7, padding: '6px 10px',
          background: 'white', outline: 'none', width: '100%', boxSizing: 'border-box' as const,
        }}
      />
    </div>
  )
}

// ─── TAB 1: TABLERO ───────────────────────────────────────────────────────────
interface TableroProps {
  weeklyData: KpiWeekly[]
  monthlyData: KpiMonthly[]
  selectedWeekId: string
  selectedMonthId: string
  onSelectWeek: (id: string) => void
  onSelectMonth: (id: string) => void
  editing: boolean
  editSubTab: 'semana' | 'mes'
  setEditSubTab: (t: 'semana' | 'mes') => void
  weekEditFields: WeekEditFields
  monthEditFields: MonthEditFields
  onWeekFieldChange: (k: keyof WeekEditFields, v: string) => void
  onMonthFieldChange: (k: keyof MonthEditFields, v: string) => void
  onToggleEdit: () => void
  onSaveWeek: () => Promise<void>
  onSaveMonth: () => Promise<void>
}

function Tablero({
  weeklyData, monthlyData, selectedWeekId, selectedMonthId,
  onSelectWeek, onSelectMonth, editing, editSubTab, setEditSubTab,
  weekEditFields, monthEditFields, onWeekFieldChange, onMonthFieldChange,
  onToggleEdit, onSaveWeek, onSaveMonth,
}: TableroProps) {
  const today = todayStr()
  const currentWeek = weeklyData.find((r, i) => {
    const next = weeklyData[i + 1]
    return r.week_start <= today && (!next || next.week_start > today)
  })
  const curWeek  = weeklyData.find(r => r.week_id === selectedWeekId)
  const curMonth = monthlyData.find(r => r.month_id === selectedMonthId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Hero row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {/* Diagnosis card */}
        <div style={{
          background: C.pine, borderRadius: 13, padding: 20, color: C.sand,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.sage, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Diagnostico
          </div>
          <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>
            El alcance ya funciona. Falta capturarlo.
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.sage, lineHeight: 1.6 }}>
            24K alcance, +279% en 28 dias. Fuga 1: 0.9% hace click. Fuga 2: 0 capturas. Junio cierra las dos.
          </div>
        </div>

        {/* Sessions hero */}
        <HeroCard
          label="Sesiones esta semana"
          cadence="SEMANA"
          value={curWeek?.sessions ?? null}
          base={600} up={1200}
          sparkline={<WeekSparkline rows={weeklyData} selectedWeekId={selectedWeekId} />}
        />

        {/* Revenue hero */}
        <HeroCard
          label="Ingresos este mes"
          cadence="MES"
          value={curMonth?.revenue_total ?? null}
          base={500} up={2500}
          isMoney
          sparkline={<MonthSparkline rows={monthlyData} selectedMonthId={selectedMonthId} />}
        />
      </div>

      {/* Week selector */}
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 8, letterSpacing: '0.06em' }}>
          Semana
        </div>
        <WeekPills rows={weeklyData} selected={selectedWeekId} onSelect={onSelectWeek} currentWeekId={currentWeek?.week_id} />
      </div>

      {/* Month selector */}
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 8, letterSpacing: '0.06em' }}>
          Mes
        </div>
        <MonthPills rows={monthlyData} selected={selectedMonthId} onSelect={onSelectMonth} />
      </div>

      {/* Embudo */}
      <div style={{ background: 'white', border: `1px solid ${C.line}`, borderRadius: 13, padding: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 16, letterSpacing: '0.06em' }}>
          Embudo de Conversion
        </div>
        {[
          { label: 'Alcance social', value: '24K', pct: 100, color: C.green },
          { label: 'Clicks al sitio', value: '214', pct: 34, color: C.amber, fuga: 'Fuga 1' },
          { label: 'Captura email-cuenta', value: '0', pct: 4, color: C.coral, fuga: 'Fuga 2' },
          { label: 'Explorer pagando', value: '0', pct: 2, color: C.purple },
        ].map(row => (
          <div key={row.label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.pine, minWidth: 180 }}>{row.label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: row.color }}>{row.value}</span>
              {row.fuga && (
                <span style={{ fontFamily: MONO, fontSize: 9.5, color: C.coral, background: C.coral + '18', padding: '2px 8px', borderRadius: 20 }}>
                  {row.fuga}
                </span>
              )}
            </div>
            <div style={{ height: 10, background: C.sand, borderRadius: 5 }}>
              <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 5 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Ventana Mundial */}
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 10, letterSpacing: '0.06em' }}>
          Ventana Mundial — semana
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          <KpiCard label="Sesiones WC" value={curWeek?.sessions_wc ?? null} base={350} up={800} />
          <KpiCard label="Stay22 WC" value={curWeek?.stay22_wc ?? null} base={20} up={70} />
          <KpiCard label="Planner WC" value={curWeek?.planner_wc ?? null} base={40} up={120} />
          <KpiCard label="Explorer activo" value={curMonth?.explorer_active ?? null} base={4} up={18} />
        </div>
      </div>

      {/* Framework semanal */}
      <div style={{ background: C.fjord + '12', border: `1px solid ${C.fjord}30`, borderRadius: 13, padding: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.fjord, marginBottom: 16, letterSpacing: '0.06em' }}>
          Framework Semanal
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.fjord, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Estrellas Polares
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
            <KpiCard label="Sesiones" value={curWeek?.sessions ?? null} base={600} up={1200} />
            <KpiCard label="Planner uses" value={curWeek?.planner_uses ?? null} base={120} up={400} />
            <KpiCard label="Alcance social" value={curWeek?.social_reach ?? null} base={5000} up={20000} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.fjord, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Leads Calientes
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
            <KpiCard label="Subs nuevos" value={curWeek?.subs_new ?? null} base={25} up={120} />
            <KpiCard label="Cuentas nuevas" value={curWeek?.accounts_new ?? null} base={30} up={140} />
            <KpiCard label="Logins ret." value={curWeek?.returning_logins ?? null} base={15} up={90} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.fjord, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Palancas
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
            <KpiCard label="Stay22 clicks" value={curWeek?.stay22_clicks ?? null} base={30} up={130} />
            <KpiCard label="Reel saves" value={curWeek?.reel_saves ?? null} base={80} up={400} />
          </div>
        </div>
      </div>

      {/* Framework mensual */}
      <div style={{ background: C.pine + '10', border: `1px solid ${C.pine}25`, borderRadius: 13, padding: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.pine, marginBottom: 16, letterSpacing: '0.06em' }}>
          Framework Mensual
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.pine, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Estrellas Polares
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
            <KpiCard label="Ingresos" value={curMonth?.revenue_total ?? null} base={500} up={2500} isMoney />
            <KpiCard label="Email total" value={curMonth?.email_total ?? null} base={900} up={1500} />
            <KpiCard label="Guias publ." value={curMonth?.guides_published ?? null} base={4} up={8} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: C.pine, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Palancas
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
            <KpiCard label="Explorer activo" value={curMonth?.explorer_active ?? null} base={4} up={18} />
            <KpiCard label="Stay22 mes" value={curMonth?.stay22_month ?? null} base={120} up={520} />
            <KpiCard label="Ad spend" value={curMonth?.ad_spend ?? null} base={500} up={1500} isMoney />
          </div>
        </div>
      </div>

      {/* Top creativo */}
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 10, letterSpacing: '0.06em' }}>
          Top Creativo — este mes
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { title: 'La carpeta que duele un poco', views: 207 },
            { title: 'Error caro: Miami Beach', views: 145 },
            { title: 'Hotel del torneo: Dallas', views: 108 },
          ].map(item => (
            <div key={item.title} style={{
              background: 'white', border: `1px solid ${C.line}`, borderRadius: 11,
              padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.pine, flex: 1, paddingRight: 12 }}>{item.title}</span>
              <span style={{ fontFamily: MONO, fontSize: 14, color: C.fjord, whiteSpace: 'nowrap' }}>{item.views} views</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit panel */}
      <div>
        <button
          onClick={onToggleEdit}
          style={{
            fontFamily: MONO, fontSize: 12, background: editing ? C.chip : C.pine,
            color: editing ? C.muted : C.sand, border: 'none', borderRadius: 8,
            padding: '8px 18px', cursor: 'pointer',
          }}
        >
          {editing ? 'Cerrar editor' : 'Editar datos'}
        </button>

        {editing && (
          <div style={{
            marginTop: 16, background: 'white', border: `1px solid ${C.line}`, borderRadius: 13, padding: 20,
          }}>
            {/* Sub-tab buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: `1px solid ${C.line}`, paddingBottom: 0 }}>
              {(['semana', 'mes'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setEditSubTab(t)}
                  style={{
                    fontFamily: MONO, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer',
                    color: editSubTab === t ? C.pine : C.muted,
                    padding: '6px 0', marginRight: 16,
                    borderBottom: `2px solid ${editSubTab === t ? C.coral : 'transparent'}`,
                  }}
                >
                  {t === 'semana' ? 'Esta semana' : 'Este mes'}
                </button>
              ))}
            </div>

            {editSubTab === 'semana' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
                  <NumInput label="Sessions" value={weekEditFields.sessions} onChange={v => onWeekFieldChange('sessions', v)} />
                  <NumInput label="Sessions WC" value={weekEditFields.sessions_wc} onChange={v => onWeekFieldChange('sessions_wc', v)} />
                  <NumInput label="Planner uses" value={weekEditFields.planner_uses} onChange={v => onWeekFieldChange('planner_uses', v)} />
                  <NumInput label="Planner WC" value={weekEditFields.planner_wc} onChange={v => onWeekFieldChange('planner_wc', v)} />
                  <NumInput label="Stay22 clicks" value={weekEditFields.stay22_clicks} onChange={v => onWeekFieldChange('stay22_clicks', v)} />
                  <NumInput label="Stay22 WC" value={weekEditFields.stay22_wc} onChange={v => onWeekFieldChange('stay22_wc', v)} />
                  <NumInput label="Social reach" value={weekEditFields.social_reach} onChange={v => onWeekFieldChange('social_reach', v)} />
                  <NumInput label="Reel saves" value={weekEditFields.reel_saves} onChange={v => onWeekFieldChange('reel_saves', v)} />
                  <NumInput label="Subs nuevos" value={weekEditFields.subs_new} onChange={v => onWeekFieldChange('subs_new', v)} />
                  <NumInput label="Cuentas nuevas" value={weekEditFields.accounts_new} onChange={v => onWeekFieldChange('accounts_new', v)} />
                  <NumInput label="Returning logins" value={weekEditFields.returning_logins} onChange={v => onWeekFieldChange('returning_logins', v)} />
                </div>
                <button
                  onClick={onSaveWeek}
                  style={{
                    fontFamily: MONO, fontSize: 12, background: C.pine, color: C.sand,
                    border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer',
                  }}
                >
                  Guardar semana
                </button>
              </>
            )}

            {editSubTab === 'mes' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
                  <NumInput label="Ingresos ($)" value={monthEditFields.revenue_total} onChange={v => onMonthFieldChange('revenue_total', v)} />
                  <NumInput label="Email total" value={monthEditFields.email_total} onChange={v => onMonthFieldChange('email_total', v)} />
                  <NumInput label="Explorer activo" value={monthEditFields.explorer_active} onChange={v => onMonthFieldChange('explorer_active', v)} />
                  <NumInput label="Guias publ." value={monthEditFields.guides_published} onChange={v => onMonthFieldChange('guides_published', v)} />
                  <NumInput label="Ad spend ($)" value={monthEditFields.ad_spend} onChange={v => onMonthFieldChange('ad_spend', v)} />
                  <NumInput label="Stay22 mes" value={monthEditFields.stay22_month} onChange={v => onMonthFieldChange('stay22_month', v)} />
                </div>
                <button
                  onClick={onSaveMonth}
                  style={{
                    fontFamily: MONO, fontSize: 12, background: C.pine, color: C.sand,
                    border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer',
                  }}
                >
                  Guardar mes
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TAB 2: ROADMAP ───────────────────────────────────────────────────────────
const CHART_DATA = [
  { month: 'Mar', val: 80 },
  { month: 'Abr', val: 730 },
  { month: 'May', val: 2200 },
  { month: 'Jun', val: 7200, isHere: true },
  { month: 'Jul', val: 8700 },
  { month: 'Ago', val: 10000, isFloor: true },
  { month: 'Sep', val: 9400 },
  { month: 'Oct', val: 9900 },
  { month: 'Nov', val: 10400 },
  { month: 'Dic', val: 10700 },
]
const CHART_MAX_H = 140
const CHART_MAX_V = 10700
const FLOOR_H = Math.round((10000 / CHART_MAX_V) * CHART_MAX_H)

function Roadmap() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Revenue trajectory */}
      <div style={{ background: 'white', border: `1px solid ${C.line}`, borderRadius: 13, padding: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 20, letterSpacing: '0.06em' }}>
          Trayectoria de Ingresos
        </div>
        <div style={{ position: 'relative', paddingBottom: 24 }}>
          {/* Floor dashed line */}
          <div style={{
            position: 'absolute', left: 0, right: 0,
            bottom: 24 + FLOOR_H,
            borderTop: `1.5px dashed ${C.coral}`,
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          }}>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.coral, background: 'white', padding: '0 4px', marginTop: -8 }}>
              $10K floor
            </span>
          </div>
          {/* Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: CHART_MAX_H }}>
            {CHART_DATA.map(d => {
              const h = Math.max(2, Math.round((d.val / CHART_MAX_V) * CHART_MAX_H))
              const bg = d.isHere ? C.coral : d.isFloor ? C.green : C.sage
              const opacity = d.isHere || d.isFloor ? 1 : 0.6
              return (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: d.isHere ? C.coral : C.muted }}>
                    {fmtCompact(d.val)}
                  </div>
                  <div style={{
                    width: '100%', height: h, background: bg, opacity, borderRadius: '3px 3px 0 0',
                    marginTop: 'auto',
                  }} />
                </div>
              )
            })}
          </div>
          {/* Month labels */}
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {CHART_DATA.map(d => (
              <div key={d.month} style={{ flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: 9, color: C.muted }}>
                {d.month}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fases */}
      <div>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 12, letterSpacing: '0.06em' }}>
          Fases
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {[
            {
              period: 'JUN', badge: 'CONVERSION', accent: C.coral, isHere: true,
              items: [
                'Repuntar trafico pagado a guias sede',
                'Captura email en 16 guias sede',
                'Cerrar Sponsor #1 con prueba alcance 24K',
                'Contenido match-day + email cada 48h',
              ],
            },
            {
              period: 'JUL', badge: 'FLOOR LOCK', accent: C.green, isHere: false,
              items: [
                'Renovar/cerrar 2do sponsor antes 19 Jul',
                'Campana Explorer email+prompt',
                'Explorer PDF+progress',
                'Pivote WC hacia evergreen',
              ],
            },
            {
              period: 'AGO', badge: 'COMPOUND', accent: C.purple, isHere: false,
              items: [
                '11 guias/mes evergreen SEO Q4',
                'Retencion Explorer churn <15%',
                'Activar microinfluencers si compuertas OK',
                'El Brief solo si captura >=3%',
              ],
            },
            {
              period: 'SEP-DIC', badge: 'SCALE', accent: C.fjord, isHere: false,
              items: [
                'Contenido Q4 navidad+año nuevo',
                'Brand partnerships',
                'PWA shell hacia app nativa',
                'Forma rediseñada del planificador',
              ],
            },
          ].map(fase => (
            <div key={fase.period} style={{
              background: 'white', border: `2px solid ${fase.isHere ? fase.accent : C.line}`,
              borderRadius: 13, padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: fase.accent }}>{fase.period}</span>
                <span style={{
                  fontFamily: MONO, fontSize: 8.5, background: fase.accent + '20',
                  color: fase.accent, padding: '2px 8px', borderRadius: 20,
                }}>
                  {fase.badge}
                </span>
                {fase.isHere && (
                  <span style={{ fontFamily: MONO, fontSize: 8, color: fase.accent }}>← aqui</span>
                )}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {fase.items.map(item => (
                  <li key={item} style={{ fontFamily: SANS, fontSize: 11.5, color: C.pine, display: 'flex', gap: 6 }}>
                    <span style={{ color: fase.accent, flexShrink: 0 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Cadena de dependencias */}
      <div style={{ background: 'white', border: `1px solid ${C.line}`, borderRadius: 13, padding: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 16, letterSpacing: '0.06em' }}>
          Cadena de Dependencias
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[
            { label: 'Alcance', color: C.green },
            { label: 'Fix captura', color: C.coral },
            { label: 'Sponsor #1', color: C.amber },
            { label: 'Explorer sube', color: C.purple },
            { label: 'Sponsor #2', color: C.amber },
            { label: 'PISO $10K', color: C.green },
          ].map((node, i) => (
            <div key={node.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ color: C.muted, fontSize: 14 }}>→</span>}
              <span style={{
                fontFamily: MONO, fontSize: 11, background: node.color + '20',
                color: node.color, padding: '5px 12px', borderRadius: 20,
                border: `1px solid ${node.color}40`,
              }}>
                {node.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Compuertas */}
      <div style={{ background: 'white', border: `1px solid ${C.line}`, borderRadius: 13, padding: 20 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 16, letterSpacing: '0.06em' }}>
          Compuertas de Escala
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              gate: 'Escalar pagado',
              condition: 'cuando costo por email < meta',
              status: 'hoy: infinito (0 capturas)',
              ok: false,
            },
            {
              gate: 'Construir El Brief',
              condition: 'cuando captura >=3% + base cuentas',
              status: 'hoy: captura 0%',
              ok: false,
            },
            {
              gate: 'Microinfluencers',
              condition: 'cuando captura + seguidores subiendo 2+ sem',
              status: 'hoy: seguidores planos',
              ok: false,
            },
          ].map(row => (
            <div key={row.gate} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 14px', background: C.paper, borderRadius: 9,
              border: `1px solid ${C.line}`,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', marginTop: 3, flexShrink: 0,
                background: row.ok ? C.green : C.coral,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.pine, marginBottom: 2 }}>
                  {row.gate}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted, marginBottom: 3 }}>
                  {row.condition}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: C.coral }}>
                  {row.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TAB 3: ACCIONES ─────────────────────────────────────────────────────────
function Acciones({ currentWeekId }: { currentWeekId: string | undefined }) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set())

  function toggle(key: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      return next
    })
  }

  const totalChecked = checked.size
  const globalPct = Math.round((totalChecked / TOTAL_ACTIONS) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Global progress */}
      <div style={{ background: 'white', border: `1px solid ${C.line}`, borderRadius: 13, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>Progreso global</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.pine }}>{totalChecked} / {TOTAL_ACTIONS}</span>
        </div>
        <div style={{ height: 6, background: C.sand, borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${globalPct}%`, background: C.pine, borderRadius: 3, transition: 'width 0.3s' }} />
        </div>
      </div>

      {MONTHS_ORDER.map(month => {
        const weeks = ACTIONS_DATA.filter(w => w.month === month)
        const monthItems = weeks.length * 6
        const monthChecked = weeks.reduce((acc, w) => {
          return acc + ['ventas', 'marketing', 'producto'].reduce((a, lane) => {
            return a + [0, 1].filter(i => checked.has(`${w.weekId}-${lane}-${i}`)).length
          }, 0)
        }, 0)
        const monthPct = Math.round((monthChecked / monthItems) * 100)

        return (
          <div key={month}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h2 style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: C.pine, margin: 0 }}>{month}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>{monthChecked}/{monthItems}</span>
                <div style={{ width: 80, height: 4, background: C.sand, borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${monthPct}%`, background: C.sage, borderRadius: 2 }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {weeks.map(week => {
                const isCurrent = week.weekId === currentWeekId
                return (
                  <div
                    key={week.weekId}
                    style={{
                      background: 'white',
                      border: `1px solid ${isCurrent ? C.coral : C.line}`,
                      borderRadius: 12,
                      padding: 16,
                      boxShadow: isCurrent ? `0 2px 12px ${C.coral}25` : undefined,
                    }}
                  >
                    {/* Week header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{
                        fontFamily: MONO, fontSize: 10,
                        background: isCurrent ? C.coral : C.chip,
                        color: isCurrent ? 'white' : C.muted,
                        padding: '3px 10px', borderRadius: 20,
                      }}>
                        {week.label}
                      </span>
                      <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.pine }}>
                        {week.tag}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginLeft: 'auto' }}>
                        {['ventas', 'marketing', 'producto'].reduce((a, lane) =>
                          a + [0, 1].filter(i => checked.has(`${week.weekId}-${lane}-${i}`)).length, 0
                        )}/6
                      </span>
                    </div>

                    {/* 3-column grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                      {(
                        [
                          { key: 'ventas', label: 'Ventas', items: week.ventas },
                          { key: 'marketing', label: 'Marketing', items: week.marketing },
                          { key: 'producto', label: 'Producto', items: week.producto },
                        ] as const
                      ).map(lane => (
                        <div key={lane.key}>
                          <div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', color: C.muted, marginBottom: 8, letterSpacing: '0.05em' }}>
                            {lane.label}
                          </div>
                          {lane.items.map((item, i) => {
                            const key = `${week.weekId}-${lane.key}-${i}`
                            const done = checked.has(key)
                            return (
                              <label
                                key={key}
                                style={{ display: 'flex', gap: 8, cursor: 'pointer', marginBottom: 8, alignItems: 'flex-start' }}
                              >
                                <input
                                  type="checkbox"
                                  checked={done}
                                  onChange={() => toggle(key)}
                                  style={{ marginTop: 2, accentColor: C.pine, flexShrink: 0 }}
                                />
                                <span style={{
                                  fontFamily: SANS, fontSize: 12, lineHeight: 1.45,
                                  color: done ? C.muted : C.pine,
                                  textDecoration: done ? 'line-through' : 'none',
                                }}>
                                  {item}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message }: { message: string }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: C.pine, color: C.sand,
      fontFamily: MONO, fontSize: 12,
      padding: '10px 18px', borderRadius: 20,
      zIndex: 9999, pointerEvents: 'none',
    }}>
      {message}
    </div>
  )
}

// ─── KPI table client ─────────────────────────────────────────────────────────
// kpi_weekly and kpi_monthly are not yet in the generated Database type.
// Cast to a narrow interface that covers only the operations used here.
type KpiTableRow = Record<string, number | null>
type KpiOps = {
  from(table: 'kpi_weekly' | 'kpi_monthly'): {
    update(data: KpiTableRow): {
      eq(col: string, val: string): Promise<{ error: { message: string } | null }>
    }
  }
}
function kpiSupabase(): KpiOps {
  return getSupabaseBrowser() as unknown as KpiOps
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props {
  weeklyRows: KpiWeekly[]
  monthlyRows: KpiMonthly[]
}

export default function FounderDashboard({ weeklyRows, monthlyRows }: Props) {
  const today = todayStr()

  const [weeklyData, setWeeklyData] = useState<KpiWeekly[]>(weeklyRows)
  const [monthlyData, setMonthlyData] = useState<KpiMonthly[]>(monthlyRows)

  const [selectedWeekId, setSelectedWeekId] = useState<string>(() => {
    const sorted = [...weeklyRows].filter(r => r.week_start <= today).sort((a, b) => b.week_start.localeCompare(a.week_start))
    return sorted[0]?.week_id ?? weeklyRows[weeklyRows.length - 1]?.week_id ?? ''
  })

  const [selectedMonthId, setSelectedMonthId] = useState<string>(() => {
    const sorted = [...monthlyRows].filter(r => r.month_start <= today).sort((a, b) => b.month_start.localeCompare(a.month_start))
    return sorted[0]?.month_id ?? monthlyRows[monthlyRows.length - 1]?.month_id ?? ''
  })

  const [activeTab, setActiveTab] = useState<'tablero' | 'roadmap' | 'acciones'>('tablero')
  const [editing, setEditing] = useState(false)
  const [editSubTab, setEditSubTab] = useState<'semana' | 'mes'>('semana')
  const [toast, setToast] = useState<string | null>(null)

  const curWeek  = weeklyData.find(r => r.week_id === selectedWeekId)
  const curMonth = monthlyData.find(r => r.month_id === selectedMonthId)

  const [weekEditFields, setWeekEditFields] = useState<WeekEditFields>(() =>
    curWeek ? weekToEditFields(curWeek) : {
      sessions: '', sessions_wc: '', planner_uses: '', planner_wc: '',
      stay22_clicks: '', stay22_wc: '', social_reach: '', reel_saves: '',
      subs_new: '', accounts_new: '', returning_logins: '',
    }
  )
  const [monthEditFields, setMonthEditFields] = useState<MonthEditFields>(() =>
    curMonth ? monthToEditFields(curMonth) : {
      revenue_total: '', email_total: '', explorer_active: '',
      guides_published: '', ad_spend: '', stay22_month: '',
    }
  )

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2000)
  }

  function handleToggleEdit() {
    if (!editing) {
      if (curWeek)  setWeekEditFields(weekToEditFields(curWeek))
      if (curMonth) setMonthEditFields(monthToEditFields(curMonth))
    }
    setEditing(e => !e)
  }

  function handleWeekFieldChange(k: keyof WeekEditFields, v: string) {
    setWeekEditFields(prev => ({ ...prev, [k]: v }))
  }

  function handleMonthFieldChange(k: keyof MonthEditFields, v: string) {
    setMonthEditFields(prev => ({ ...prev, [k]: v }))
  }

  async function handleSaveWeek() {
    if (!curWeek) return
    const updates = {
      sessions:        parseIntField(weekEditFields.sessions),
      sessions_wc:     parseIntField(weekEditFields.sessions_wc),
      planner_uses:    parseIntField(weekEditFields.planner_uses),
      planner_wc:      parseIntField(weekEditFields.planner_wc),
      stay22_clicks:   parseIntField(weekEditFields.stay22_clicks),
      stay22_wc:       parseIntField(weekEditFields.stay22_wc),
      social_reach:    parseIntField(weekEditFields.social_reach),
      reel_saves:      parseIntField(weekEditFields.reel_saves),
      subs_new:        parseIntField(weekEditFields.subs_new),
      accounts_new:    parseIntField(weekEditFields.accounts_new),
      returning_logins: parseIntField(weekEditFields.returning_logins),
    }
    const prevData = weeklyData
    setWeeklyData(prev => prev.map(r => r.id === curWeek.id ? { ...r, ...updates } : r))
    const { error } = await kpiSupabase().from('kpi_weekly').update(updates).eq('id', curWeek.id)
    if (error) {
      setWeeklyData(prevData)
      showToast('Error al guardar')
    } else {
      showToast('Guardado')
    }
  }

  async function handleSaveMonth() {
    if (!curMonth) return
    const updates = {
      revenue_total:    parseFloatField(monthEditFields.revenue_total),
      email_total:      parseIntField(monthEditFields.email_total),
      explorer_active:  parseIntField(monthEditFields.explorer_active),
      guides_published: parseIntField(monthEditFields.guides_published),
      ad_spend:         parseFloatField(monthEditFields.ad_spend),
      stay22_month:     parseIntField(monthEditFields.stay22_month),
    }
    const prevData = monthlyData
    setMonthlyData(prev => prev.map(r => r.id === curMonth.id ? { ...r, ...updates } : r))
    const { error } = await kpiSupabase().from('kpi_monthly').update(updates).eq('id', curMonth.id)
    if (error) {
      setMonthlyData(prevData)
      showToast('Error al guardar')
    } else {
      showToast('Guardado')
    }
  }

  const currentWeekId = (() => {
    const sorted = [...weeklyData]
    return sorted.find((r, i) => {
      const next = sorted[i + 1]
      return r.week_start <= today && (!next || next.week_start > today)
    })?.week_id
  })()

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 60px', fontFamily: SANS }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: C.pine, margin: 0 }}>
            Lagomplan HQ
          </h1>
          <p style={{ fontFamily: MONO, fontSize: 11, color: C.muted, margin: '4px 0 0' }}>
            Founder Dashboard
          </p>
        </div>
        <WcBadge />
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.line}`, marginBottom: 28 }}>
        {(['tablero', 'roadmap', 'acciones'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontFamily: SANS, fontSize: 13, fontWeight: 500,
              color: activeTab === tab ? C.pine : C.muted,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 0', marginRight: 24,
              borderBottom: `2px solid ${activeTab === tab ? C.coral : 'transparent'}`,
              transition: 'color 0.15s',
            }}
          >
            {tab === 'tablero' ? 'Tablero' : tab === 'roadmap' ? 'Roadmap' : 'Acciones'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'tablero' && (
        <Tablero
          weeklyData={weeklyData}
          monthlyData={monthlyData}
          selectedWeekId={selectedWeekId}
          selectedMonthId={selectedMonthId}
          onSelectWeek={setSelectedWeekId}
          onSelectMonth={setSelectedMonthId}
          editing={editing}
          editSubTab={editSubTab}
          setEditSubTab={setEditSubTab}
          weekEditFields={weekEditFields}
          monthEditFields={monthEditFields}
          onWeekFieldChange={handleWeekFieldChange}
          onMonthFieldChange={handleMonthFieldChange}
          onToggleEdit={handleToggleEdit}
          onSaveWeek={handleSaveWeek}
          onSaveMonth={handleSaveMonth}
        />
      )}
      {activeTab === 'roadmap' && <Roadmap />}
      {activeTab === 'acciones' && <Acciones currentWeekId={currentWeekId} />}

      {toast && <Toast message={toast} />}
    </div>
  )
}
