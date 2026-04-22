"use client";

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — identical to Vancouver template
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  pine:"#0F3A33", sage:"#6B8F86", sageLight:"#EAF2F0",
  sand:"#EDE7E1", sandLight:"#F7F4F1", sandDark:"#D9D2C9",
  coral:"#E1615B", coralLight:"#FCEEED",
  fjord:"#2D4F6C", fjordLight:"#E3EBF2",
  ink:"#1C1C1A", inkMid:"#5A5A56", inkFaint:"#9A9A94",
  white:"#FFFFFF",
  matchGold:"#B8860B", matchGoldLight:"#FBF5E0",
  bg:"#fff9f3",
};

const RADIUS = 10;
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";
const CARD_BORDER = "rgba(28,28,26,0.09)";
const SECTION_ALT_BG = "#F4F0EB";

const df = (size, weight = 400, style = "normal") => ({
  fontFamily: "'Fraunces',serif", fontSize: size, fontWeight: weight, fontStyle: style,
});
const uf = (size, weight = 400) => ({
  fontFamily: "'Manrope',sans-serif", fontSize: size, fontWeight: weight,
});

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES — identical to Vancouver template
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {}, onClick, hover = false }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: T.white, border: `1px solid ${CARD_BORDER}`,
        borderRadius: RADIUS,
        boxShadow: hov ? "0 4px 16px rgba(28,28,26,0.09), 0 1px 3px rgba(28,28,26,0.05)" : CARD_SHADOW,
        transition: "box-shadow 0.22s, transform 0.22s",
        transform: hov ? "translateY(-1px)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Label = ({ children, color = T.inkFaint, bg = "transparent", style = {} }) => (
  <span style={{
    ...uf(10, 600), letterSpacing: "0.13em", textTransform: "uppercase",
    color, background: bg,
    padding: bg !== "transparent" ? "3px 9px" : 0,
    borderRadius: bg !== "transparent" ? 40 : 0,
    ...style,
  }}>
    {children}
  </span>
);

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <span style={{ ...uf(9, 500), letterSpacing: "0.18em", textTransform: "uppercase", color: T.inkFaint }}>{number}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(28,28,26,0.08)" }} />
    </div>
    <h2 style={{ ...uf(27, 700), color: T.pine, lineHeight: 1.05, marginBottom: subtitle ? 8 : 0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(14, 400), color: T.inkMid, lineHeight: 1.65, margin: 0, maxWidth: 540 }}>{subtitle}</p>}
  </div>
);

const LagomNote = ({ children }) => (
  <div style={{
    display: "flex", gap: 16, padding: "18px 22px",
    background: T.sandLight, borderLeft: `3px solid ${T.sage}`,
    borderRadius: `0 ${RADIUS}px ${RADIUS}px 0`,
  }}>
    <span style={{ ...uf(9, 700), color: T.sage, letterSpacing: "0.14em", textTransform: "uppercase", flexShrink: 0, marginTop: 3 }}>Lagom</span>
    <p style={{ ...uf(13, 400), color: T.inkMid, lineHeight: 1.8, margin: 0 }}>{children}</p>
  </div>
);

const ShowMoreToggle = ({ expanded, onToggle }) => (
  <button onClick={onToggle} style={{
    display: "inline-flex", alignItems: "center", gap: 5, marginTop: 16,
    background: "transparent", border: `1px solid ${T.sage}55`, borderRadius: 40,
    ...uf(10, 600), color: T.sage, cursor: "pointer",
    letterSpacing: "0.08em", textTransform: "uppercase",
    padding: "5px 14px", transition: "all 0.18s",
  }}
    onMouseEnter={e => { e.currentTarget.style.background = T.sageLight; e.currentTarget.style.borderColor = T.sage; e.currentTarget.style.color = T.pine; }}
    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${T.sage}55`; e.currentTarget.style.color = T.sage; }}
  >
    {expanded ? "Ver menos ↑" : "Ver más ↓"}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// HERO — two-column, dot scores, tags in sageLight (Vancouver style)
// ─────────────────────────────────────────────────────────────────────────────
const CityIllustration = ({ accent }) => (
  <svg viewBox="0 0 280 210" style={{ width: "100%", height: "100%" }} aria-hidden>
    <rect width="280" height="210" fill={accent + "12"} />
    <rect x="20"  y="90"  width="30" height="120" fill={accent} opacity="0.25" rx="2" />
    <rect x="60"  y="60"  width="40" height="150" fill={accent} opacity="0.35" rx="2" />
    <rect x="110" y="40"  width="50" height="170" fill={accent} opacity="0.45" rx="2" />
    <rect x="170" y="70"  width="35" height="140" fill={accent} opacity="0.3"  rx="2" />
    <rect x="215" y="100" width="45" height="110" fill={accent} opacity="0.2"  rx="2" />
    <line x1="0" y1="200" x2="280" y2="200" stroke={accent} strokeWidth="1.5" opacity="0.4" />
    <circle cx="140" cy="25" r="10" fill={accent} opacity="0.15" />
  </svg>
);

const GuideHero = ({ guide }) => {
  const scores = Object.values(guide.scores);
  const accent = guide.accent;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 280px", gap: 56, alignItems: "center",
      padding: "72px 0 64px", borderBottom: `1px solid rgba(28,28,26,0.08)`, marginBottom: 56,
    }}>
      <div>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          <span style={{ fontSize: 18 }}>{guide.flag}</span>
          <Label color={T.inkFaint}>{guide.country} · {guide.state}</Label>
          <span style={{ color: T.sandDark, fontSize: 12 }}>·</span>
          <Label color={T.inkFaint}>{guide.stadium.name}</Label>
          <span style={{ color: T.sandDark, fontSize: 12 }}>·</span>
          <Label color={T.inkFaint}>{guide.stadium.capacity}</Label>
        </div>

        {/* City name — Vancouver uses df italic */}
        <h1 style={{
          ...uf("clamp(44px,5.5vw,72px)", 900),
          color: T.pine, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 22,
        }}>
          {guide.city}
        </h1>

        {/* Description */}
        <p style={{ ...uf(15, 400), color: T.inkMid, lineHeight: 1.85, maxWidth: 500, marginBottom: 32 }}>
          {guide.manifesto.headline}
        </p>

        {/* Tags — sageLight background like Vancouver */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
          {guide.tags && guide.tags.map(tag => (
            <span key={tag} style={{
              ...uf(10, 600), letterSpacing: "0.1em", textTransform: "uppercase",
              color: T.pine, background: T.sageLight, border: `1px solid ${T.sage}30`,
              padding: "5px 13px", borderRadius: 40,
            }}>{tag}</span>
          ))}
          <span style={{
            ...uf(10, 600), letterSpacing: "0.1em", textTransform: "uppercase",
            color: T.matchGold, background: T.matchGoldLight, border: `1px solid ${T.matchGold}35`,
            padding: "5px 13px", borderRadius: 40,
          }}>
            ⚽ {guide.matches.length} partidos
          </span>
        </div>

        {/* Scores — dot indicators like Vancouver */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {scores.map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <Label color={T.inkFaint}>{s.label}</Label>
              <div style={{ display: "flex", gap: 3 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: i <= s.value ? T.sage : T.sandDark,
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Illustration panel */}
      <div style={{ height: 210, borderRadius: RADIUS + 2, overflow: "hidden", boxShadow: CARD_SHADOW }}>
        <CityIllustration accent={accent} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STICKY NAV — Vancouver: top:0, height 52, back button, 5 items
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "matches",   label: "Partidos"    },
  { id: "manifesto", label: "Manifiesto"  },
  { id: "stays",     label: "Dónde dormir"},
  { id: "vibe",      label: "Ambiente"    },
  { id: "logistics", label: "Logística"   },
];

const StickyNav = ({ active, onNavigate, city }) => (
  <div style={{
    position: "sticky", top: 0, zIndex: 40,
    background: `${T.bg}F5`, backdropFilter: "blur(18px)",
    borderBottom: `1px solid ${T.sandDark}`, height: 52,
    display: "flex", alignItems: "center", padding: "0 40px", gap: 0, overflowX: "auto",
  }}>
    <a href="../worldcup" style={{
      ...uf(11, 500), color: T.inkFaint, textDecoration: "none",
      padding: "0 14px 0 0", marginRight: 14,
      borderRight: `1px solid ${T.sandDark}`, whiteSpace: "nowrap", letterSpacing: "0.06em",
      transition: "color 0.15s", flexShrink: 0,
    }}
      onMouseEnter={e => e.currentTarget.style.color = T.pine}
      onMouseLeave={e => e.currentTarget.style.color = T.inkFaint}
    >
      ← Guías
    </a>
    <span style={{ ...uf(14, 700), color: T.pine, marginRight: 20, whiteSpace: "nowrap", flexShrink: 0 }}>
      {city}
    </span>
    <div style={{ width: 1, height: 20, background: T.sandDark, marginRight: 4, flexShrink: 0 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{
        ...uf(10, active === item.id ? 700 : 500),
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: active === item.id ? T.pine : T.inkFaint,
        background: "none", border: "none", padding: "0 13px", height: "100%",
        cursor: "pointer",
        borderBottom: `2px solid ${active === item.id ? T.coral : "transparent"}`,
        transition: "all 0.18s", whiteSpace: "nowrap", flexShrink: 0,
      }}>{item.label}</button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MATCH CARD — identical to Vancouver template
// worldcup-guides.ts teams: ["Team A", "vs", "Team B"]
// ─────────────────────────────────────────────────────────────────────────────
const MatchCard = ({ match, accent, stadiumName }) => {
  const teamA = match.teams[0];
  const teamB = match.teams[2];
  const accentBar = match.highlight ? T.matchGold : accent;
  const borderColor = match.highlight ? `${T.matchGold}50` : T.sandDark;

  return (
    <Card style={{ overflow: "hidden", borderColor }}>
      <div style={{ height: 4, background: accentBar }} />
      <div style={{ padding: "22px 24px" }}>
        {/* Date + tag row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              textAlign: "center", minWidth: 48, padding: "8px 12px",
              background: T.sand, borderRadius: RADIUS - 2, border: `1px solid ${T.sandDark}`,
            }}>
              <div style={{ ...uf(9, 600), letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkFaint }}>{match.day}</div>
              <div style={{ ...df(20, 700), color: T.pine, lineHeight: 1.1, margin: "2px 0" }}>{match.date.split(" ")[0]}</div>
              <div style={{ ...uf(9, 500), color: T.inkFaint }}>{match.date.split(" ")[1]}</div>
            </div>
            <div>
              <div style={{ ...uf(11, 600), color: T.inkFaint, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>
                {stadiumName}
              </div>
            </div>
          </div>
          {match.highlight && (
            <span style={{
              ...uf(9, 700), letterSpacing: "0.08em", textTransform: "uppercase",
              color: T.matchGold, background: T.matchGoldLight,
              border: `1px solid ${T.matchGold}50`,
              padding: "4px 10px", borderRadius: 40, flexShrink: 0,
            }}>Destacado</span>
          )}
        </div>

        {/* Teams */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
          padding: "18px 0",
          borderTop: `1px solid ${T.sandDark}`,
          borderBottom: `1px solid ${T.sandDark}`,
          marginBottom: 18,
        }}>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ ...df(16, 700), color: T.ink, lineHeight: 1.2 }}>{teamA}</div>
          </div>
          <div style={{
            ...uf(11, 600), color: T.inkFaint, letterSpacing: "0.12em",
            padding: "6px 14px", background: T.sand, borderRadius: 6, border: `1px solid ${T.sandDark}`,
          }}>vs</div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ ...df(16, 700), color: T.ink, lineHeight: 1.2 }}>{teamB}</div>
          </div>
        </div>

        {/* CTA */}
        <button style={{
          width: "100%", padding: "10px", background: "transparent",
          border: `1px solid ${T.sandDark}`, borderRadius: RADIUS - 2,
          ...uf(10, 600), letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkMid,
          cursor: "pointer", transition: "all 0.18s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = T.pine; e.currentTarget.style.background = T.sageLight; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.sandDark; e.currentTarget.style.color = T.inkMid; e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ fontSize: 12 }}>✦</span> Planear mi viaje alrededor de este partido
        </button>
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FOOD CARD — card grid (not table rows) like Vancouver
// ─────────────────────────────────────────────────────────────────────────────
const FoodCard = ({ item }) => (
  <div style={{
    background: T.white, border: `1px solid ${CARD_BORDER}`,
    borderRadius: RADIUS, boxShadow: CARD_SHADOW,
    padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
      <span style={{ ...uf(13, 600), color: T.pine, lineHeight: 1.3 }}>{item.dish}</span>
      <span style={{ ...uf(12, 500), color: T.inkFaint, flexShrink: 0 }}>{item.price}</span>
    </div>
    <p style={{ ...uf(12, 400), color: T.inkFaint, lineHeight: 1.55, margin: 0 }}>{item.where}</p>
    <div style={{ marginTop: 4 }}>
      <Label color={T.sage} bg={T.sageLight}>{item.type}</Label>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGISTICS CARD — icon-box (40×40) like Vancouver
// ─────────────────────────────────────────────────────────────────────────────
const LogisticsCard = ({ item }) => (
  <Card style={{
    display: "flex", gap: 16, padding: "18px 22px", alignItems: "flex-start",
    borderColor: item.isWarning ? `${T.coral}55` : T.sandDark,
    background: item.isWarning ? T.coralLight : T.white,
  }}>
    <div style={{
      width: 40, height: 40, flexShrink: 0,
      background: item.isWarning ? T.coral + "20" : T.sageLight,
      borderRadius: RADIUS - 2,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
    }}>
      {item.icon}
    </div>
    <div>
      <div style={{ ...uf(13, 700), color: item.isWarning ? T.coral : T.pine, marginBottom: 6 }}>{item.title}</div>
      <p style={{ ...uf(13, 400), color: T.inkMid, lineHeight: 1.75, margin: 0 }}>{item.text}</p>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR — matches Vancouver: CTA, Lagom Notes, Checklist, ¿Sabías que?, AI
// ─────────────────────────────────────────────────────────────────────────────
const GuideSidebar = ({ guide }) => {
  const [checked, setChecked] = useState({});
  const plannerHref = `/es/planificador?destino=${encodeURIComponent(guide.city)}`;

  // Derive lagom tips from available lagomNotes across the guide
  const lagomTips = [
    guide.manifesto.lagomNote,
    guide.vibe.lagomNote,
    guide.logistics.lagomNote,
  ].filter(Boolean);

  const checklist = [
    "Boleto digital descargado y con batería",
    "Ruta al estadio verificada con antelación",
    "Hotel confirmado para noches de partido",
    "Efectivo local para transporte y comida",
    "Cargador portátil para el teléfono",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* CTA primario */}
      <Card style={{ padding: "22px 22px", background: T.sandLight, borderColor: T.sandDark }}>
        <Label color={T.sage} style={{ marginBottom: 10, display: "block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...uf(16, 700), color: T.pine, lineHeight: 1.4, marginBottom: 16 }}>
          {guide.plannerCTA || `Convierte esta guía en un itinerario para ${guide.city}.`}
        </p>
        <a href={plannerHref} style={{
          display: "block", textAlign: "center",
          width: "100%", padding: "11px 16px",
          background: T.pine, border: "none",
          borderRadius: RADIUS - 2, ...uf(10, 600), letterSpacing: "0.12em", textTransform: "uppercase",
          color: T.white, textDecoration: "none", transition: "opacity 0.18s",
          boxSizing: "border-box",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Planificar →
        </a>
      </Card>

      {/* Notas Lagom */}
      {lagomTips.length > 0 && (
        <Card style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.sandDark}` }}>
            <div style={{ width: 28, height: 28, background: T.sageLight, borderRadius: RADIUS - 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13 }}>✦</span>
            </div>
            <Label color={T.pine} style={{ fontSize: 11 }}>Notas Lagom</Label>
          </div>
          {lagomTips.map((tip, i) => (
            <div key={i} style={{
              display: "flex", gap: 11,
              paddingTop: 12, paddingBottom: 12,
              borderBottom: i < lagomTips.length - 1 ? `1px solid ${T.sandDark}` : "none",
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.sage, flexShrink: 0, marginTop: 7 }} />
              <p style={{ ...uf(12, 400), color: T.inkMid, lineHeight: 1.72, margin: 0 }}>{tip}</p>
            </div>
          ))}
        </Card>
      )}

      {/* Checklist día de partido */}
      <Card style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.sandDark}` }}>
          <div style={{ width: 28, height: 28, background: T.matchGoldLight, borderRadius: RADIUS - 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 13 }}>☑</span>
          </div>
          <Label color={T.pine} style={{ fontSize: 11 }}>Checklist día de partido</Label>
        </div>
        {checklist.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => ({ ...p, [i]: !p[i] }))} style={{
            display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0",
            borderTop: i > 0 ? `1px solid ${T.sandDark}` : "none",
            background: "transparent", border: "none", cursor: "pointer", textAlign: "left", width: "100%",
          }}>
            <div style={{
              width: 16, height: 16, flexShrink: 0, marginTop: 2,
              border: `1.5px solid ${checked[i] ? T.sage : T.sandDark}`, borderRadius: 4,
              background: checked[i] ? T.sage : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
            }}>
              {checked[i] && <span style={{ color: T.white, fontSize: 9, lineHeight: 1 }}>✓</span>}
            </div>
            <span style={{
              ...uf(12, 400), color: checked[i] ? T.inkFaint : T.inkMid, lineHeight: 1.55,
              textDecoration: checked[i] ? "line-through" : "none", transition: "all 0.15s",
            }}>
              {item}
            </span>
          </button>
        ))}
      </Card>

      {/* ¿Sabías que? */}
      <Card style={{ padding: "20px 22px", background: T.fjordLight, borderColor: `${T.fjord}30` }}>
        <Label color={T.fjord} style={{ marginBottom: 10, display: "block" }}>¿Sabías que?</Label>
        <p style={{ ...uf(13, 400), color: T.fjord, lineHeight: 1.72, margin: 0 }}>
          {guide.manifesto.body}
        </p>
      </Card>

      {/* IA — optimizar */}
      <Card style={{ padding: "18px 22px", borderStyle: "dashed", borderColor: T.sandDark }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>✦</span>
          <div>
            <div style={{ ...uf(12, 700), color: T.pine, marginBottom: 6 }}>Optimizar itinerario con IA</div>
            <p style={{ ...uf(12, 400), color: T.inkMid, lineHeight: 1.65, margin: "0 0 12px" }}>
              Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.
            </p>
            <a href={plannerHref} style={{
              display: "inline-block",
              ...uf(9, 700), letterSpacing: "0.1em", textTransform: "uppercase",
              color: T.pine, background: "none", border: `1px solid ${T.pine}`, borderRadius: RADIUS - 2,
              padding: "7px 14px", textDecoration: "none", transition: "all 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = T.pine; e.currentTarget.style.color = T.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = T.pine; }}
            >
              Optimizar ruta →
            </a>
          </div>
        </div>
      </Card>

    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function WorldcupCityPage({ guide }) {
  const accent = guide.accent;
  const scores = Object.values(guide.scores);
  const [active, setActive] = useState("matches");
  const [showManifesto, setShowManifesto] = useState(false);
  const [showVibe,      setShowVibe]      = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [showFood,      setShowFood]      = useState(false);
  const [showExp,       setShowExp]       = useState(false);

  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(item.id); },
        { rootMargin: "-30% 0px -65% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [guide]);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const logisticsItems = [
    { icon: "✈",  title: "Cómo llegar",          text: guide.logistics.arrival },
    { icon: "🚇", title: "Aeropuerto → Ciudad",   text: guide.logistics.airport_to_city },
    { icon: "🏟", title: "Al estadio",             text: guide.logistics.stadium_transport },
    { icon: "📋", title: "Visa / entrada",          text: guide.logistics.visa },
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Manrope:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        button{font-family:'Manrope',sans-serif;}
        button:focus-visible{outline:2px solid ${T.coral};outline-offset:2px;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${T.bg};}
        ::-webkit-scrollbar-thumb{background:${T.sandDark};border-radius:3px;}
      `}</style>

      <StickyNav active={active} onNavigate={scrollTo} city={guide.city} />

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 40px" }}>
        <GuideHero guide={guide} />

        {/* TWO-COLUMN LAYOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 316px", gap: 52, alignItems: "flex-start" }}>

          {/* ── MAIN ── */}
          <div>

            {/* 01 — MATCHES */}
            <section id="matches" style={{ marginBottom: 64, scrollMarginTop: 64 }}>
              <SectionHeader number="01" title="Tus partidos"
                subtitle={`${guide.matches.length} partidos confirmados en ${guide.stadium.name}.`} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                {guide.matches.map((match, i) => (
                  <MatchCard key={i} match={match} accent={accent} stadiumName={guide.stadium.name} />
                ))}
              </div>
            </section>

            {/* 02 — MANIFIESTO */}
            <section id="manifesto" style={{
              marginBottom: 64, scrollMarginTop: 64,
              background: SECTION_ALT_BG, borderRadius: RADIUS + 2,
              padding: "32px 28px 28px", marginLeft: -4, marginRight: -4,
            }}>
              <SectionHeader number="02" title="Manifiesto de campo"
                subtitle="Lo que necesitas saber antes de llegar." />

              {/* Stadium info card */}
              <Card style={{ marginBottom: 24, overflow: "hidden" }}>
                <div style={{ height: 4, background: accent }} />
                <div style={{ padding: "20px 24px" }}>
                  {[
                    { label: "Estadio FIFA",        value: `${guide.stadium.name} · ${guide.stadium.capacity} plazas` },
                    { label: "Cómo llegar",          value: guide.logistics.arrival },
                    { label: "Aeropuerto → Ciudad", value: guide.logistics.airport_to_city },
                    { label: "Al estadio",           value: guide.logistics.stadium_transport },
                    { label: "Visa / entrada",        value: guide.logistics.visa },
                  ].map((item, i, arr) => (
                    <div key={i} style={{
                      display: "flex", gap: 20, padding: "11px 0",
                      borderBottom: i < arr.length - 1 ? `1px solid ${T.sandDark}` : "none",
                    }}>
                      <span style={{ ...uf(11, 600), color: T.inkFaint, minWidth: 148, flexShrink: 0, letterSpacing: "0.05em" }}>{item.label}</span>
                      <span style={{ ...uf(13, 500), color: T.ink, lineHeight: 1.6 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {showManifesto && (
                <>
                  <p style={{ ...uf(15, 400), color: T.ink, lineHeight: 1.9, marginBottom: 24, maxWidth: 640 }}>
                    {guide.manifesto.body}
                  </p>
                  <LagomNote>{guide.manifesto.lagomNote}</LagomNote>
                </>
              )}
              <ShowMoreToggle expanded={showManifesto} onToggle={() => setShowManifesto(!showManifesto)} />
            </section>

            {/* 03 — DÓNDE DORMIR */}
            <section id="stays" style={{ marginBottom: 64, scrollMarginTop: 64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso"
                subtitle="Opciones seleccionadas por ubicación, valor y conexión al estadio." />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(256px,1fr))", gap: 16 }}>
                {guide.hotels.map((h, i) => (
                  <Card key={i} hover style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ padding: "22px 22px 0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <span style={{ ...df(26, 700), color: T.pine, letterSpacing: "-0.02em" }}>{h.price}</span>
                        <Label color={T.sage} bg={T.sageLight}>{h.area}</Label>
                      </div>
                      <div style={{ ...df(17, 700), color: T.pine, lineHeight: 1.2, marginBottom: 4 }}>{h.name}</div>
                      <p style={{ ...uf(13, 400), color: T.inkMid, lineHeight: 1.7, marginBottom: 16 }}>{h.note}</p>
                    </div>
                    <div style={{ marginTop: "auto", padding: "14px 22px", borderTop: `1px solid ${T.sandDark}` }}>
                      <a href={h.url || "#"} target={h.url ? "_blank" : undefined} rel="noopener noreferrer" style={{
                        display: "block", textAlign: "center",
                        width: "100%", padding: "11px", borderRadius: RADIUS - 2,
                        background: h.url ? T.pine : T.sandDark,
                        ...uf(10, 700), letterSpacing: "0.12em", textTransform: "uppercase", color: T.white,
                        textDecoration: "none", transition: "opacity 0.18s",
                        pointerEvents: h.url ? "auto" : "none", opacity: h.url ? 1 : 0.45,
                        boxSizing: "border-box",
                      }}
                        onMouseEnter={e => { if (h.url) e.currentTarget.style.opacity = "0.82"; }}
                        onMouseLeave={e => { if (h.url) e.currentTarget.style.opacity = "1"; }}
                      >
                        Ver opciones →
                      </a>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Neighborhoods below hotels */}
              {guide.neighborhoods && guide.neighborhoods.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ ...uf(10, 700), letterSpacing: "0.14em", textTransform: "uppercase", color: T.inkFaint, marginBottom: 14 }}>
                    Barrios recomendados
                  </div>
                  {guide.neighborhoods.map((n, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "1fr auto",
                      padding: "14px 0", gap: 16, alignItems: "start",
                      borderBottom: i < guide.neighborhoods.length - 1 ? `1px solid ${T.sandDark}` : "none",
                    }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ ...uf(14, 600), color: T.pine }}>{n.name}</span>
                          <Label color={T.sage} bg={T.sageLight}>{n.best_for}</Label>
                        </div>
                        <p style={{ ...uf(13, 400), color: T.inkMid, lineHeight: 1.6, margin: 0 }}>{n.vibe}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ ...uf(9, 600), letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkFaint, marginBottom: 2 }}>Al estadio</div>
                        <div style={{ ...uf(12, 500), color: T.inkMid }}>{n.walk_to_stadium}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 04 — VIBRA */}
            <section id="vibe" style={{
              marginBottom: 64, scrollMarginTop: 64,
              background: SECTION_ALT_BG, borderRadius: RADIUS + 2,
              padding: "32px 28px 28px", marginLeft: -4, marginRight: -4,
            }}>
              <SectionHeader number="04" title="Siente el ambiente"
                subtitle={guide.vibe.zones?.length ? "Fan fest oficial, pantallas en la ciudad y los barrios que ya viven el fútbol." : undefined} />
              <p style={{
                ...uf(15, 400), color: T.inkMid, lineHeight: 1.85,
                marginBottom: showVibe ? 28 : 0, maxWidth: 640,
                ...(showVibe ? {} : { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }),
              }}>
                {guide.vibe.body}
              </p>
              {showVibe && (
                <>
                  {guide.vibe.zones && guide.vibe.zones.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                      {guide.vibe.zones.map((z, i) => (
                        <Card key={i} hover style={{ overflow: "hidden", display: "flex", flexDirection: "row" }}>
                          <div style={{ width: 3, flexShrink: 0, background: T.sage, opacity: 0.7 }} />
                          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                            <span style={{ ...uf(9, 600), letterSpacing: "0.1em", textTransform: "uppercase", color: T.sage }}>
                              {z.type}
                            </span>
                            <div style={{ ...df(14, 700), color: T.pine, lineHeight: 1.25 }}>{z.name}</div>
                            <p style={{ ...uf(12, 400), color: T.inkMid, lineHeight: 1.72, margin: 0 }}>{z.desc}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                  <LagomNote>{guide.vibe.lagomNote}</LagomNote>
                </>
              )}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} />
            </section>

            {/* 05 — LOGÍSTICA */}
            <section id="logistics" style={{ marginBottom: 64, scrollMarginTop: 64 }}>
              <SectionHeader number="05" title="Llegar al estadio"
                subtitle="Cómo moverse sin improvisar el día del partido." />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: showLogistics ? 24 : 0 }}>
                {logisticsItems.slice(0, 2).map((item, i) => (
                  <LogisticsCard key={i} item={item} />
                ))}
              </div>
              {showLogistics && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {logisticsItems.slice(2).map((item, i) => (
                      <LogisticsCard key={i} item={item} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 12, padding: "14px 18px", background: T.sandLight, border: `1px solid ${T.sandDark}`, borderRadius: RADIUS }}>
                    <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
                    <p style={{ ...uf(13, 400), color: T.inkMid, lineHeight: 1.72, margin: 0 }}>{guide.logistics.lagomNote}</p>
                  </div>
                </>
              )}
              <ShowMoreToggle expanded={showLogistics} onToggle={() => setShowLogistics(!showLogistics)} />
            </section>

            {/* 06 — COMIDA */}
            <section style={{ marginBottom: 64, scrollMarginTop: 64, background: SECTION_ALT_BG, borderRadius: RADIUS + 2, padding: "32px 28px 28px", marginLeft: -4, marginRight: -4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                {guide.food.slice(0, 3).map((f, i) => <FoodCard key={i} item={f} />)}
                {showFood && guide.food.slice(3).map((f, i) => <FoodCard key={i + 3} item={f} />)}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} />
            </section>

            {/* 07 — EXPERIENCIAS */}
            <section style={{ marginBottom: 64 }}>
              <SectionHeader number="07" title="Fuera del estadio"
                subtitle="El programa paralelo para cuando el partido termina." />
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {guide.experiences.slice(0, 1).map((exp, i) => (
                  <ExperienceItem key={i} exp={exp} index={i + 1} />
                ))}
                {showExp && guide.experiences.slice(1).map((exp, i) => (
                  <ExperienceItem key={i + 1} exp={exp} index={i + 2} />
                ))}
              </div>
              <ShowMoreToggle expanded={showExp} onToggle={() => setShowExp(!showExp)} />
            </section>

            {/* 08 — CIERRE */}
            <section style={{ marginBottom: 0 }}>
              <div style={{
                background: T.pine, borderRadius: RADIUS + 2,
                padding: "48px 44px 44px", position: "relative", overflow: "hidden",
              }}>
                <div style={{ width: 32, height: 2, background: T.coral, marginBottom: 28, opacity: 0.85 }} />
                <blockquote style={{
                  ...df("clamp(18px,2.4vw,24px)", 400, "italic"),
                  color: T.sand, lineHeight: 1.75, margin: "0 0 24px", maxWidth: 540,
                }}>
                  "{guide.closingNote}"
                </blockquote>
                <Label color={T.sage} style={{ opacity: 0.7 }}>{guide.closingSignature}</Label>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position: "sticky", top: 64, alignSelf: "flex-start", paddingBottom: 48 }}>
            <GuideSidebar guide={guide} />
          </div>

        </div>

        <div style={{ height: 96 }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE ITEM
// ─────────────────────────────────────────────────────────────────────────────
function ExperienceItem({ exp, index }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0 24px" }}>
      <div style={{
        ...df(32, 900), color: T.sandDark, lineHeight: 1,
        userSelect: "none", paddingTop: 4, width: 40, textAlign: "right", flexShrink: 0,
      }}>
        {String(index).padStart(2, "0")}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ ...uf(15, 600), color: T.pine }}>{exp.title}</span>
          <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
          <span style={{ ...uf(11, 400), color: T.inkFaint }}>{exp.duration}</span>
        </div>
        <p style={{ ...uf(13, 400), color: T.inkMid, lineHeight: 1.8, margin: "0 0 12px", maxWidth: 580 }}>{exp.desc}</p>
      </div>
    </div>
  );
}
