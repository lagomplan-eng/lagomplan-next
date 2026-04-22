'use client'

import { useState, useEffect } from 'react'
import type { WorldcupGuide } from '../../lib/worldcup-guides'
import { Link } from '../../lib/navigation'

const T = {
  pine: '#0F3A33', sage: '#6B8F86', sand: '#EDE7E1',
  sandLight: '#F7F4F1', sandDark: '#D9D2C9',
  coral: '#E1615B', fjord: '#2D4F6C',
  ink: '#1C1C1A', inkMid: '#5A5A56', inkFaint: '#9A9A94',
  white: '#FFFFFF',
}

const uf = { fontFamily: "'Manrope',sans-serif" } as const
const df = { fontFamily: "'Fraunces',serif" } as const
const lbl = (c = T.inkFaint) =>
  ({ ...uf, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: c, fontWeight: 600 })

const NAV_ITEMS = [
  { id: 'manifesto',    label: 'Manifiesto' },
  { id: 'vibra',        label: 'Vibra' },
  { id: 'barrios',      label: 'Barrios' },
  { id: 'hoteles',      label: 'Hoteles' },
  { id: 'logistica',    label: 'Logística' },
  { id: 'encuentro',    label: 'Encuentro' },
  { id: 'comida',       label: 'Comida' },
  { id: 'experiencias', label: 'Actividades' },
]

function Divider({ my = 40 }: { my?: number }) {
  return <div style={{ height: 1, background: T.sandDark, margin: `${my}px 0` }} />
}

function SectionEyebrow({ number, title, id }: { number: string; title: string; id: string }) {
  return (
    <div id={id} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, scrollMarginTop: 160 }}>
      <span style={{ ...uf, fontSize: 11, letterSpacing: '0.2em', color: T.sage, fontWeight: 700, textTransform: 'uppercase' }}>{number}</span>
      <div style={{ flex: 1, height: 1, background: T.sandDark }} />
      <span style={{ ...lbl() }}>{title}</span>
    </div>
  )
}

function LagomNote({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div style={{ display: 'flex', gap: 16, padding: '18px 20px', background: T.sandLight, borderLeft: `3px solid ${T.sage}`, margin: '24px 0' }}>
      <span style={{ ...uf, fontSize: 10, color: T.sage, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0, marginTop: 2 }}>Lagom</span>
      <p style={{ ...uf, fontSize: 13, color: T.inkMid, lineHeight: 1.75, margin: 0 }}>{text}</p>
    </div>
  )
}

function ScoreBars({ scores }: { scores: WorldcupGuide['scores'] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px 28px' }}>
      {Object.values(scores).map(({ value, label }) => (
        <div key={label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ ...uf, fontSize: 11, color: T.inkMid, fontWeight: 500 }}>{label}</span>
            <span style={{ ...uf, fontSize: 11, color: T.inkFaint }}>{value}/5</span>
          </div>
          <div style={{ height: 3, background: T.sandDark, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(value / 5) * 100}%`,
              background: value >= 4 ? T.sage : value === 3 ? T.fjord : T.coral,
              borderRadius: 2,
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function MatchSchedule({ matches, accent }: { matches: WorldcupGuide['matches']; accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {matches.map((m, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '12px 16px',
          background: m.highlight ? accent + '12' : T.sandLight,
          border: `1px solid ${m.highlight ? accent + '40' : T.sandDark}`,
          borderLeft: `3px solid ${m.highlight ? accent : T.sandDark}`,
        }}>
          <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 44 }}>
            <div style={{ ...uf, fontSize: 9, color: T.inkFaint, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{m.day}</div>
            <div style={{ ...df, fontSize: 16, fontWeight: 700, color: T.pine, lineHeight: 1.2 }}>{m.date}</div>
          </div>
          <div style={{ width: 1, height: 28, background: T.sandDark, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ ...uf, fontSize: 13, color: T.ink, fontWeight: 500 }}>{m.teams[0]}</span>
            <span style={{ ...uf, fontSize: 11, color: T.inkFaint, margin: '0 8px' }}>vs</span>
            <span style={{ ...uf, fontSize: 13, color: T.ink, fontWeight: 500 }}>{m.teams[2]}</span>
          </div>
          {m.highlight && <span style={{ ...lbl(accent), background: accent + '18', padding: '3px 8px', flexShrink: 0 }}>Local</span>}
        </div>
      ))}
    </div>
  )
}

function GuideHero({ guide }: { guide: WorldcupGuide }) {
  return (
    <div style={{ paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 22 }}>{guide.flag}</span>
        <span style={{ ...lbl() }}>{guide.country} · {guide.state}</span>
        <span style={{ ...lbl() }}>·</span>
        <span style={{ ...lbl() }}>{guide.stadium.name} · {guide.stadium.capacity} plazas</span>
      </div>
      <h1 style={{ ...uf, fontSize: 'clamp(48px,8vw,82px)', fontWeight: 900, color: T.pine, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 24 }}>
        {guide.city}
      </h1>
      <p style={{ ...uf, fontSize: 20, fontWeight: 400, color: T.inkMid, lineHeight: 1.55, maxWidth: 560, marginBottom: 40 }}>
        &ldquo;{guide.manifesto.headline}&rdquo;
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ ...lbl(), marginBottom: 16 }}>Índice de destino</div>
          <ScoreBars scores={guide.scores} />
        </div>
        <div>
          <div style={{ ...lbl(), marginBottom: 16 }}>Partidos</div>
          <MatchSchedule matches={guide.matches} accent={guide.accent} />
        </div>
      </div>
    </div>
  )
}

function StickyNav({ activeSection, onNavigate, city }: { activeSection: string; onNavigate: (id: string) => void; city: string }) {
  return (
    <div style={{
      position: 'sticky', top: 88, zIndex: 40,
      background: T.sand + 'F5', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${T.sandDark}`,
      display: 'flex', alignItems: 'center',
      padding: '0 32px', height: 48,
      overflowX: 'auto', gap: 0,
    }}>
      <span style={{ ...df, fontSize: 14, color: T.pine, marginRight: 20, flexShrink: 0 }}>lagomplan</span>
      <div style={{ width: 1, height: 20, background: T.sandDark, marginRight: 20, flexShrink: 0 }} />
      <span style={{ ...uf, fontSize: 11, color: T.inkFaint, marginRight: 20, flexShrink: 0 }}>{city}</span>
      <div style={{ width: 1, height: 20, background: T.sandDark, marginRight: 4, flexShrink: 0 }} />
      {NAV_ITEMS.map(item => {
        const active = activeSection === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              ...uf, fontSize: 11, fontWeight: active ? 700 : 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: active ? T.pine : T.inkFaint,
              background: 'none', border: 'none',
              padding: '0 12px', height: '100%', cursor: 'pointer',
              borderBottom: `2px solid ${active ? T.coral : 'transparent'}`,
              transition: 'all 0.18s', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default function WorldcupDetailClient({ guide, locale }: { guide: WorldcupGuide; locale: string }) {
  const [activeSection, setActiveSection] = useState('manifesto')
  const isES = locale === 'es'

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(item.id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [guide])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const plannerHref = isES ? `/es/planificador` : `/en/planner`

  return (
    <div>
      <StickyNav activeSection={activeSection} onNavigate={scrollTo} city={guide.city} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 0' }}>
        {/* Back */}
        <Link
          href="/worldcup"
          style={{ ...uf, fontSize: 11, color: T.inkFaint, textDecoration: 'none', display: 'inline-block', marginBottom: 32, letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          ← {isES ? 'Todas las guías' : 'All guides'}
        </Link>

        <GuideHero guide={guide} />
        <Divider my={48} />

        {/* 01 MANIFIESTO */}
        <section>
          <SectionEyebrow number="01" title="Manifiesto de Campo" id="manifesto" />
          <p style={{ ...uf, fontSize: 15, color: T.ink, lineHeight: 1.85, marginBottom: 24 }}>{guide.manifesto.body}</p>
          <LagomNote text={guide.manifesto.lagomNote} />
        </section>
        <Divider />

        {/* 02 VIBRA */}
        <section>
          <SectionEyebrow number="02" title="Vibra Mundialista" id="vibra" />
          <p style={{ ...uf, fontSize: 15, color: T.ink, lineHeight: 1.85, marginBottom: 28 }}>{guide.vibe.body}</p>
          <div style={{ marginBottom: 24 }}>
            {guide.vibe.zones.map((z, i) => (
              <div key={i} style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                padding: '16px 0',
                borderBottom: i < guide.vibe.zones.length - 1 ? `1px solid ${T.sandDark}` : 'none',
              }}>
                <span style={{ ...lbl(T.coral), background: T.coral + '18', padding: '2px 8px', flexShrink: 0 }}>{z.type}</span>
                <div>
                  <div style={{ ...uf, fontSize: 14, fontWeight: 600, color: T.pine, marginBottom: 4 }}>{z.name}</div>
                  <p style={{ ...uf, fontSize: 13, color: T.inkMid, lineHeight: 1.65, margin: 0 }}>{z.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <LagomNote text={guide.vibe.lagomNote} />
        </section>
        <Divider />

        {/* 03 HOJA DE RUTA */}
        <section>
          <SectionEyebrow number="03" title="Hoja de Ruta" id="barrios" />

          <h3 style={{ ...uf, fontSize: 20, fontWeight: 700, color: T.pine, marginBottom: 20 }}>3.1 · Barrios</h3>
          <div style={{ marginBottom: 44 }}>
            {guide.neighborhoods.map((n, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                padding: '16px 0', borderBottom: `1px solid ${T.sandDark}`,
                gap: 16, alignItems: 'start',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ ...uf, fontSize: 15, fontWeight: 600, color: T.pine }}>{n.name}</span>
                    <span style={{ ...lbl(T.sage), background: T.sage + '18', padding: '2px 7px' }}>{n.best_for}</span>
                  </div>
                  <p style={{ ...uf, fontSize: 13, color: T.inkMid, lineHeight: 1.6, margin: 0 }}>{n.vibe}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ ...lbl(), marginBottom: 2 }}>Al estadio</div>
                  <div style={{ ...uf, fontSize: 12, color: T.inkMid }}>{n.walk_to_stadium}</div>
                </div>
              </div>
            ))}
          </div>

          <div id="hoteles" style={{ scrollMarginTop: 160 }}>
            <h3 style={{ ...uf, fontSize: 20, fontWeight: 700, color: T.pine, marginBottom: 20 }}>3.2 · Hoteles</h3>
            <div style={{ marginBottom: 44 }}>
              {guide.hotels.map((h, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  padding: '14px 0', borderBottom: `1px solid ${T.sandDark}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                      <span style={{ ...uf, fontSize: 14, fontWeight: 600, color: T.pine }}>{h.name}</span>
                      <span style={{ ...uf, fontSize: 11, color: T.inkFaint }}>{h.area}</span>
                    </div>
                    <p style={{ ...uf, fontSize: 12, color: T.inkMid, lineHeight: 1.6, margin: 0 }}>{h.note}</p>
                  </div>
                  <div style={{ ...uf, fontSize: 13, color: T.coral, fontWeight: 600, flexShrink: 0, paddingTop: 2 }}>{h.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div id="logistica" style={{ scrollMarginTop: 160 }}>
            <h3 style={{ ...uf, fontSize: 20, fontWeight: 700, color: T.pine, marginBottom: 20 }}>3.3 · Logística</h3>
            <div>
              {[
                { icon: '✈', label: 'Cómo llegar',         text: guide.logistics.arrival },
                { icon: '🚇', label: 'Aeropuerto → Ciudad', text: guide.logistics.airport_to_city },
                { icon: '🏟', label: 'Al estadio',          text: guide.logistics.stadium_transport },
                { icon: '📋', label: 'Visa / entrada',       text: guide.logistics.visa },
              ].map((item, i, arr) => (
                <div key={i} style={{
                  display: 'flex', gap: 16, padding: '18px 0',
                  borderBottom: i < arr.length - 1 ? `1px solid ${T.sandDark}` : 'none',
                }}>
                  <div style={{ width: 36, height: 36, background: T.sandLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ ...lbl(T.sage), marginBottom: 5 }}>{item.label}</div>
                    <p style={{ ...uf, fontSize: 13, color: T.ink, lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                  </div>
                </div>
              ))}
              <LagomNote text={guide.logistics.lagomNote} />
            </div>
          </div>

          <div id="encuentro" style={{ marginTop: 44, scrollMarginTop: 160 }}>
            <h3 style={{ ...uf, fontSize: 20, fontWeight: 700, color: T.pine, marginBottom: 20 }}>3.4 · Puntos de encuentro</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {guide.meetingPoints.map((p, i) => (
                <div key={i} style={{ padding: '16px 18px', background: T.sandLight, border: `1px solid ${T.sandDark}` }}>
                  <div style={{ ...uf, fontSize: 13, fontWeight: 600, color: T.pine, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ ...lbl(), marginBottom: 6 }}>{p.area}</div>
                  <p style={{ ...uf, fontSize: 12, color: T.inkMid, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Divider />

        {/* COMIDA */}
        <section>
          <SectionEyebrow number="03.5" title="Restaurantes" id="comida" />
          <div>
            {guide.food.map((f, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto',
                alignItems: 'center', gap: 16, padding: '13px 0',
                borderBottom: i < guide.food.length - 1 ? `1px solid ${T.sandDark}` : 'none',
              }}>
                <div>
                  <span style={{ ...uf, fontSize: 14, fontWeight: 600, color: T.pine }}>{f.dish}</span>
                  <span style={{ ...uf, fontSize: 12, color: T.inkFaint, marginLeft: 10 }}>— {f.where}</span>
                </div>
                <span style={{ ...lbl(T.sage), background: T.sage + '18', padding: '2px 8px', whiteSpace: 'nowrap' }}>{f.type}</span>
                <span style={{ ...uf, fontSize: 12, color: T.inkFaint, textAlign: 'right', whiteSpace: 'nowrap' }}>{f.price}</span>
              </div>
            ))}
          </div>
        </section>
        <Divider />

        {/* EXPERIENCIAS */}
        <section>
          <SectionEyebrow number="03.6" title="Actividades" id="experiencias" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {guide.experiences.map((exp, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0 24px' }}>
                <div style={{ ...df, fontSize: 32, fontWeight: 900, color: T.sandDark, lineHeight: 1, userSelect: 'none', paddingTop: 4, width: 40, textAlign: 'right' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ ...uf, fontSize: 15, fontWeight: 600, color: T.pine }}>{exp.title}</span>
                    <span style={{ ...lbl(T.fjord), background: T.fjord + '18', padding: '2px 8px' }}>{exp.type}</span>
                    <span style={{ ...uf, fontSize: 11, color: T.inkFaint }}>{exp.duration}</span>
                  </div>
                  <p style={{ ...uf, fontSize: 13, color: T.inkMid, lineHeight: 1.75, margin: 0 }}>{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Divider my={56} />

        {/* 04 NOTA DE SALIDA */}
        <section style={{ paddingBottom: 0 }}>
          <SectionEyebrow number="04" title="Nota de Salida" id="nota" />
          <blockquote style={{
            ...df, fontSize: 22, fontWeight: 400,
            color: T.pine, lineHeight: 1.65, margin: '0 0 16px',
            borderLeft: `3px solid ${T.coral}`, paddingLeft: 24,
          }}>
            &ldquo;{guide.closingNote}&rdquo;
          </blockquote>
          <p style={{ ...lbl(), paddingLeft: 24 }}>{guide.closingSignature}</p>
        </section>
      </div>

      {/* CTA Planner */}
      <div style={{ maxWidth: 720, margin: '64px auto 0' }}>
        <div style={{ padding: '48px 40px', background: T.pine, textAlign: 'center', marginTop: 64 }}>
          <div style={{ ...lbl(T.sage), marginBottom: 16 }}>Lagomplan · Planificador Mundial 2026</div>
          <h3 style={{ ...uf, fontSize: 28, fontWeight: 700, color: T.sand, lineHeight: 1.2, maxWidth: 420, margin: '0 auto 16px' }}>
            Ya leíste la guía. Ahora arma el viaje.
          </h3>
          <p style={{ ...uf, fontSize: 13, color: T.sage, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 32px' }}>
            El planificador genera una ruta personalizada según tu selección, fechas y personas que viajan.
          </p>
          <a
            href={plannerHref}
            style={{
              display: 'inline-block',
              background: T.coral, color: T.white,
              ...uf, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '16px 36px', textDecoration: 'none',
            }}
          >
            {guide.plannerCTA} →
          </a>
        </div>
      </div>
      <div style={{ height: 80 }} />
    </div>
  )
}
