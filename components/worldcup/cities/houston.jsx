"use client";
import { useState, useEffect } from "react";
import { es, en } from "../../../lib/worldcup/data/houston";
import { ui } from "../../../lib/worldcup/ui-strings";

const T = {
  pine:"#0F3A33", sage:"#6B8F86", sageLight:"#EAF2F0",
  sand:"#EDE7E1", sandLight:"#F7F4F1", sandDark:"#D9D2C9",
  coral:"#E1615B", coralLight:"#FCEEED",
  fjord:"#2D4F6C", fjordLight:"#E3EBF2",
  ink:"#1C1C1A", inkMid:"#5A5A56", inkFaint:"#9A9A94",
  white:"#FFFFFF", matchGold:"#B8860B", matchGoldLight:"#FBF5E0", bg:"#fff9f3",
};
const RADIUS = 8;
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";
const CITY_ACCENT = "#2D4F6C"; // Houston blue

const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>
    {children}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATION — Houston skyline + NRG Stadium with retractable roof
// ─────────────────────────────────────────────────────────────────────────────
const HouIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#F4E4D6" rx={RADIUS} />
    {/* Warm Texas sky */}
    <rect x="0" y="0" width="280" height="108" fill="#F4E4D6" />
    {/* Sun / warm glow */}
    <circle cx="220" cy="36" r="14" fill="#E89B6A" opacity="0.35" />
    {/* Downtown skyline — tall and dense */}
    <rect x="16" y="58" width="12" height="50" fill="#2D4F6C" opacity="0.5" rx={1} />
    <rect x="32" y="48" width="14" height="60" fill="#2D4F6C" opacity="0.55" rx={1} />
    {/* JP Morgan Chase Tower (tallest) */}
    <rect x="50" y="38" width="16" height="70" fill="#2D4F6C" opacity="0.62" rx={1} />
    <polygon points="58,38 52,46 64,46" fill="#2D4F6C" opacity="0.5" />
    <rect x="70" y="52" width="12" height="56" fill="#2D4F6C" opacity="0.5" rx={1} />
    <rect x="86" y="58" width="10" height="50" fill="#2D4F6C" opacity="0.42" rx={1} />
    {/* Wells Fargo / Heritage Plaza shapes */}
    <rect x="100" y="48" width="14" height="60" fill="#2D4F6C" opacity="0.55" rx={1} />
    <rect x="118" y="62" width="10" height="46" fill="#2D4F6C" opacity="0.4" rx={1} />
    {/* NRG Stadium — dome with retractable roof seam */}
    <ellipse cx="204" cy="96" rx="56" ry="14" fill="#2D4F6C" opacity="0.22" />
    <rect x="160" y="82" width="88" height="16" fill="#2D4F6C" opacity="0.18" rx={3} />
    <path d="M160,82 Q204,64 248,82" stroke="#2D4F6C" strokeWidth="1.5" fill="none" opacity="0.38" />
    {/* Retractable roof seam */}
    <line x1="204" y1="66" x2="204" y2="98" stroke="#E1615B" strokeWidth="1.3" opacity="0.6" />
    {/* Ground line */}
    <rect x="0" y="108" width="280" height="32" fill="#D9C7B5" />
    {/* METRORail hint */}
    <line x1="0" y1="120" x2="280" y2="120" stroke="#6B8F86" strokeWidth="1" opacity="0.35" strokeDasharray="4,3" />
    {/* Flag */}
    <text x="258" y="22" fontSize="16" textAnchor="middle">🇺🇸</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({ children, style={}, onClick, hover=false }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      style={{
        background:T.white, border:`1px solid rgba(28,28,26,0.09)`, borderRadius:RADIUS,
        boxShadow: isHovered?"0 4px 16px rgba(28,28,26,0.09), 0 1px 3px rgba(28,28,26,0.05)":CARD_SHADOW,
        transition:"box-shadow 0.22s, transform 0.22s",
        transform: isHovered?"translateY(-1px)":"none",
        cursor: onClick?"pointer":"default", ...style,
      }}>
      {children}
    </div>
  );
};

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom:28 }}>
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
      <span style={{ ...uf(9,500), letterSpacing:"0.18em", textTransform:"uppercase", color:T.inkFaint }}>{number}</span>
      <div style={{ flex:1, height:1, background:"rgba(28,28,26,0.08)" }} />
    </div>
    <h2 style={{ ...uf(25, 700), color:T.pine, lineHeight:1.05, marginBottom:subtitle?7:0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.6, margin:0, maxWidth:520 }}>{subtitle}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MATCH CARD
// ─────────────────────────────────────────────────────────────────────────────
const MatchCard = ({ match, strings }) => {
  const isTBD = !match.teams[0].flag && !match.teams[1].flag;
  const bgColor = match.highlight ? T.matchGoldLight : T.white;
  const borderColor = match.highlight ? `${T.matchGold}50` : T.sandDark;
  const accentBar = match.highlight ? T.matchGold : isTBD ? T.sandDark : CITY_ACCENT;

  return (
    <Card style={{ overflow:"hidden", borderColor, opacity: isTBD ? 0.6 : 1 }}>
      <div style={{ height:3, background:accentBar }} />
      <div style={{ padding:"18px 20px", background:bgColor }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"center", minWidth:44, padding:"6px 10px", background:T.sand, borderRadius:6 }}>
              <div style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkFaint }}>{match.day}</div>
              <div style={{ ...df(18,700), color:T.pine, lineHeight:1.1 }}>{match.date.split(" ")[0]}</div>
              <div style={{ ...uf(9,500), color:T.inkFaint }}>{match.date.split(" ")[1]}</div>
            </div>
            <div>
              <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:2 }}>{match.stadium}</div>
              <div style={{ ...uf(12,500), color:T.inkFaint }}>{match.time} local</div>
            </div>
          </div>
          {match.tag && (
            <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
              color: match.highlight ? T.matchGold : CITY_ACCENT,
              background: match.highlight ? T.matchGoldLight : CITY_ACCENT+"18",
              border:`1px solid ${match.highlight ? T.matchGold : CITY_ACCENT}40`,
              padding:"3px 9px", borderRadius:40, flexShrink:0,
            }}>{match.tag}</span>
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16,
          padding:"14px 0", borderTop:`1px solid ${T.sandDark}`, borderBottom:`1px solid ${T.sandDark}`, marginBottom:14 }}>
          <div style={{ flex:1, textAlign:"right" }}>
            <div style={{ ...df(15,700), color:T.ink, marginBottom:2 }}>{match.teams[0].name}</div>
            {match.teams[0].flag && <div style={{ fontSize:24 }}>{match.teams[0].flag}</div>}
          </div>
          <div style={{ ...uf(12,600), color:T.inkFaint, letterSpacing:"0.1em", padding:"5px 12px", background:T.sand, borderRadius:6 }}>vs</div>
          <div style={{ flex:1, textAlign:"left" }}>
            <div style={{ ...df(15,700), color:T.ink, marginBottom:2 }}>{match.teams[1].name}</div>
            {match.teams[1].flag && <div style={{ fontSize:24 }}>{match.teams[1].flag}</div>}
          </div>
        </div>

        {isTBD && (
          <div style={{ ...uf(11,400), color:T.inkFaint, textAlign:"center", padding:"8px 0" }}>
            {strings.rivalTBD}
          </div>
        )}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ITINERARY DAY
// ─────────────────────────────────────────────────────────────────────────────
const ItineraryDay = ({ day, matchMap, strings }) => {
  const [open, setOpen] = useState(day.isMatchDay);
  const match = day.matchRef ? matchMap[day.matchRef] : null;

  return (
    <Card style={{ overflow:"hidden", borderColor: day.isMatchDay ? `${T.matchGold}50` : T.sandDark }} hover>
      {day.isMatchDay && <div style={{ height:3, background:T.matchGold }} />}
      <button onClick={() => setOpen(!open)} style={{ width:"100%", padding:"17px 20px", display:"flex", alignItems:"center", gap:14, background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
        <div style={{ width:34, height:34, background:day.isMatchDay?T.matchGold:T.sageLight, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ ...uf(12,700), color:day.isMatchDay?T.white:T.pine }}>{day.day}</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
            <span style={{ ...df(15,700), color:T.pine }}>{day.title}</span>
            {day.isMatchDay && (
              <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
                color:T.matchGold, background:T.matchGoldLight, padding:"2px 7px", borderRadius:40, border:`1px solid ${T.matchGold}40` }}>
                {strings.matchDayBadge}
              </span>
            )}
          </div>
          <span style={{ ...uf(11,400), color:T.inkFaint }}>{day.subtitle}</span>
        </div>
        <div style={{ width:26, height:26, border:`1px solid ${T.sandDark}`, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          transform:open?"rotate(180deg)":"none", transition:"transform 0.2s" }}>
          <span style={{ ...uf(11,600), color:T.inkMid, lineHeight:1 }}>↓</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop:`1px solid ${T.sandDark}`, padding:"4px 20px 18px" }}>
          {match && (
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 13px",
              background:T.matchGoldLight, border:`1px solid ${T.matchGold}40`, borderRadius:RADIUS-2, margin:"12px 0 18px" }}>
              <span style={{ fontSize:16 }}>⚽</span>
              <div>
                <div style={{ ...uf(10,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, marginBottom:1 }}>
                  {match.date} · {match.time}
                </div>
                <div style={{ ...uf(13,600), color:T.ink }}>
                  {match.teams[0].flag} {match.teams[0].name} vs {match.teams[1].flag} {match.teams[1].name}
                </div>
              </div>
            </div>
          )}
          {day.steps.map((step, i) => (
            <div key={i} style={{ display:"flex", gap:14,
              paddingTop:14, paddingBottom: i<day.steps.length-1?14:0,
              borderBottom: i<day.steps.length-1?`1px solid ${T.sandDark}`:"none" }}>
              <div style={{ width:74, flexShrink:0, paddingTop:2 }}>
                <span style={{ ...uf(10,600), color:T.inkFaint, letterSpacing:"0.04em" }}>{step.time}</span>
              </div>
              <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>{step.text}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAY CARD
// ─────────────────────────────────────────────────────────────────────────────
const StayCard = ({ stay, strings }) => (
  <Card hover style={{ display:"flex", flexDirection:"column", height:"100%" }}>
    <div style={{ padding:"18px 18px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ ...df(22,700), color:T.pine }}>{stay.price}</span>
        <Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label>
      </div>
      <div style={{ ...df(16,700), color:T.pine, lineHeight:1.2, marginBottom:3 }}>{stay.name}</div>
      <div style={{ ...uf(11,500), color:T.inkFaint, marginBottom:6 }}>{stay.area}</div>
      {stay.priceCAD && (
        <div style={{ ...uf(11,600), color:CITY_ACCENT, marginBottom:10, letterSpacing:"0.04em" }}>{stay.priceCAD}</div>
      )}
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
        {stay.tags.map(tag => (
          <span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase",
            color:T.inkFaint, background:T.sand, padding:"2px 7px", borderRadius:4 }}>{tag}</span>
        ))}
      </div>
      <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.6 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"12px 18px", borderTop:`1px solid ${T.sandDark}` }}>
      <a href={stay.url || "#"} target={stay.url ? "_blank" : undefined} rel="noopener noreferrer" style={{
        display:"block", textAlign:"center", width:"100%", padding:"9px", borderRadius:RADIUS-2,
        background: stay.url ? T.pine : T.sandDark,
        ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.white,
        textDecoration:"none", transition:"opacity 0.18s",
        pointerEvents: stay.url ? "auto" : "none", opacity: stay.url ? 1 : 0.45,
      }}
        onMouseEnter={e => { if (stay.url) e.currentTarget.style.opacity="0.85"; }}
        onMouseLeave={e => { if (stay.url) e.currentTarget.style.opacity="1"; }}>
        {strings.checkAvailability}
      </a>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// NEIGHBORHOOD PREAMBLE — appears above the stay cards when the guide
// supplies stayNeighborhoods. Compact collapsible rows so the section
// stays scannable across all 16 guides; click to expand a row's body.
// ─────────────────────────────────────────────────────────────────────────────
const NEIGHBORHOOD_STYLE = {
  recommended: { accent: T.sage,  badge: "✓"  },
  alternative: { accent: T.fjord, badge: "·"  },
  avoid:       { accent: T.coral, badge: "✕"  },
}

const NeighborhoodRow = ({ item }) => {
  const [open, setOpen] = useState(false)
  const style = NEIGHBORHOOD_STYLE[item.kind] || NEIGHBORHOOD_STYLE.alternative
  return (
    <div style={{ display:"flex", overflow:"hidden", background:T.white, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS, transition:"border-color 0.18s" }}>
      <div style={{ width:3, flexShrink:0, background:style.accent }} />
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          flex:1, textAlign:"left", background:"transparent", border:"none", cursor:"pointer", padding:"12px 16px",
          display:"flex", flexDirection:"column", gap:open ? 8 : 0, transition:"gap 0.18s",
        }}
      >
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
            <span style={{ ...uf(11,700), color:style.accent, flexShrink:0, width:14, textAlign:"center" }}>{style.badge}</span>
            <span style={{ ...uf(13,600), color:T.pine, lineHeight:1.35, overflow:"hidden", textOverflow:"ellipsis", whiteSpace: open ? "normal" : "nowrap" }}>{item.title}</span>
          </div>
          <span style={{ ...uf(11,500), color:T.inkFaint, flexShrink:0, transform: open ? "rotate(180deg)" : "none", transition:"transform 0.18s" }}>▾</span>
        </div>
        {open && (
          <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.7, margin:"4px 0 0 24px" }}>{item.body}</p>
        )}
      </button>
    </div>
  )
}

const NeighborhoodList = ({ data }) => {
  if (!data || !Array.isArray(data.items) || data.items.length === 0) return null
  return (
    <div style={{ marginBottom:20 }}>
      {data.intro && (
        <p style={{ ...uf(12,400), color:T.inkFaint, lineHeight:1.7, margin:"0 0 12px" }}>{data.intro}</p>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {data.items.map((n, i) => <NeighborhoodRow key={i} item={n} />)}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// VIBE CARD
// ─────────────────────────────────────────────────────────────────────────────
const VibeCardView = ({ item }) => (
  <Card hover style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:9 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
        color:item.typeColor, background:item.typeColor+"18", padding:"3px 8px", borderRadius:40 }}>
        {item.type}
      </span>
      <span style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase",
        color:T.inkFaint, background:T.sand, padding:"3px 7px", borderRadius:40 }}>
        {item.tag}
      </span>
    </div>
    <div style={{ ...df(15,700), color:T.pine, lineHeight:1.2 }}>{item.title}</div>
    <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{item.desc}</p>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGISTICS CARD
// ─────────────────────────────────────────────────────────────────────────────
const LogisticsCard = ({ item }) => (
  <Card style={{ display:"flex", gap:14, padding:"14px 18px", alignItems:"flex-start",
    borderColor: item.isWarning?`${T.coral}50`:T.sandDark,
    background: item.isWarning?T.coralLight:T.white }}>
    <div style={{ width:36, height:36, flexShrink:0, background:item.isWarning?T.coral+"20":T.sageLight,
      borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>
      {item.icon}
    </div>
    <div>
      <div style={{ ...uf(13,700), color:item.isWarning?T.coral:T.pine, marginBottom:4 }}>{item.title}</div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{item.text}</p>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const GuideSidebar = ({ guide, onPlan, strings }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      <Card style={{ padding:"22px", background:T.pine, border:"none" }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>{strings.plannerKicker}</Label>
        <p style={{ ...uf(17, 700), color:T.sand, lineHeight:1.3, marginBottom:14 }}>
          {strings.plannerPitch}
        </p>
        <button onClick={onPlan} style={{ width:"100%", padding:"12px", background:T.coral, border:"none",
          borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase",
          color:T.white, cursor:"pointer" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          {guide.plannerCTA} →
        </button>
      </Card>

      <Card style={{ padding:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:26, height:26, background:T.sageLight, borderRadius:RADIUS-2,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>✦</span>
          </div>
          <Label color={T.pine}>{strings.lagomNotes}</Label>
        </div>
        {guide.lagomTips.map((tip, i) => (
          <div key={i} style={{ display:"flex", gap:9,
            paddingTop:10, paddingBottom:10,
            borderBottom: i<guide.lagomTips.length-1?`1px solid ${T.sandDark}`:"none" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:T.sage, flexShrink:0, marginTop:6 }} />
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{tip}</p>
          </div>
        ))}
      </Card>

      <Card style={{ padding:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:26, height:26, background:T.matchGoldLight, borderRadius:RADIUS-2,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>☑</span>
          </div>
          <Label color={T.pine}>{strings.matchDayChecklist}</Label>
        </div>
        {guide.matchDayChecklist.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => ({...p,[i]:!p[i]}))} style={{
            display:"flex", alignItems:"flex-start", gap:9, padding:"7px 0",
            borderTop: i>0?`1px solid ${T.sandDark}`:"none",
            background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%",
          }}>
            <div style={{ width:15, height:15, flexShrink:0, marginTop:2,
              border:`1.5px solid ${checked[i]?T.sage:T.sandDark}`, borderRadius:3,
              background:checked[i]?T.sage:"transparent",
              display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
              {checked[i] && <span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ ...uf(12,400), color:checked[i]?T.inkFaint:T.inkMid, lineHeight:1.5,
              textDecoration:checked[i]?"line-through":"none", transition:"all 0.15s" }}>
              {item}
            </span>
          </button>
        ))}
      </Card>

      <Card style={{ padding:"16px 18px", background:T.fjordLight, borderColor:`${T.fjord}30` }}>
        <Label color={T.fjord} style={{ marginBottom:8, display:"block" }}>{strings.didYouKnow}</Label>
        <p style={{ ...uf(12,400), color:T.fjord, lineHeight:1.65, margin:0 }}>{guide.didYouKnow}</p>
      </Card>

      <Card style={{ padding:"14px 18px", borderStyle:"dashed" }}>
        <div style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>✦</span>
          <div>
            <div style={{ ...uf(11,700), color:T.pine, marginBottom:4 }}>{strings.optimizeAi}</div>
            <p style={{ ...uf(11,400), color:T.inkMid, lineHeight:1.6, margin:"0 0 9px" }}>
              {strings.optimizeAiPitch}
            </p>
            <button onClick={onPlan} style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
              color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2,
              padding:"6px 12px", cursor:"pointer" }}>
              {strings.optimizeAiCta}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE HERO
// ─────────────────────────────────────────────────────────────────────────────
const GuideHero = ({ guide, strings }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:36, alignItems:"center",
    padding:"44px 0 36px", borderBottom:`1px solid ${T.sandDark}`, marginBottom:36 }}>
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:20 }}>{guide.flag}</span>
        <Label color={T.inkFaint}>{guide.country} · {guide.state}</Label>
        <span style={{ color:T.sandDark }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.name}</Label>
        <span style={{ color:T.sandDark }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.capacity}</Label>
      </div>
      <h1 style={{ ...uf("clamp(40px,5.5vw,68px)", 900), color:T.pine, lineHeight:0.95,
        letterSpacing:"-0.03em", marginBottom:18 }}>
        {guide.city}
      </h1>
      <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.7, maxWidth:460, marginBottom:22 }}>
        {guide.description}
      </p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:22 }}>
        {guide.tags.map(tag => (
          <span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase",
            color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`,
            padding:"5px 12px", borderRadius:40 }}>{tag}</span>
        ))}
        <span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase",
          color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}30`,
          padding:"5px 12px", borderRadius:40 }}>
          ⚽ {guide.matches.length} {strings.matchesLabel}
        </span>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:2 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width:5, height:5, borderRadius:"50%",
                  background: i<=s.value ? T.sage : T.sandDark }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ height:190, borderRadius:RADIUS, overflow:"hidden" }}>
      <HouIllustration />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STICKY NAV
// ─────────────────────────────────────────────────────────────────────────────
const getNavItems = (strings) => [
  {id:"matches",    label:strings.navMatches},
  {id:"manifesto",  label:strings.navManifesto},
  {id:"itinerary",  label:strings.navItinerary},
  {id:"stays",      label:strings.navStays},
  {id:"vibe",       label:strings.navVibe},
  {id:"logistics",  label:strings.navLogistics},
];

const StickyNav = ({ active, onNavigate, onBack, guide, strings }) => (
  <div style={{ position:"sticky", top:0, zIndex:40,
    background:`${T.bg}F2`, backdropFilter:"blur(16px)",
    borderBottom:`1px solid ${T.sandDark}`, height:50,
    display:"flex", alignItems:"center", padding:"0 32px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none",
      cursor:"pointer", padding:"0 12px 0 0", marginRight:12,
      borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em" }}>
      {strings.navBeyond === "Beyond the stadium" ? "← Guides" : "← Guías"}
    </button>
    <span style={{ ...uf(14, 700), color:T.pine, marginRight:18, whiteSpace:"nowrap" }}>{guide.city}</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4 }} />
    {getNavItems(strings).map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{
        ...uf(10, active===item.id?700:500),
        letterSpacing:"0.08em", textTransform:"uppercase",
        color: active===item.id?T.pine:T.inkFaint,
        background:"none", border:"none", padding:"0 12px", height:"100%",
        cursor:"pointer",
        borderBottom:`2px solid ${active===item.id?T.coral:"transparent"}`,
        transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0,
      }}>{item.label}</button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE DETAIL — main layout
// ─────────────────────────────────────────────────────────────────────────────
const GuideDetail = ({ guide, onBack, strings }) => {
  const [active, setActive] = useState("matches");
  const matchMap = Object.fromEntries(guide.matches.map(m => [m.id, m]));

  useEffect(() => {
    const observers = [];
    getNavItems(strings).forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(item.id); },
        { rootMargin:"-30% 0px -65% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [strings]);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <StickyNav active={active} onNavigate={scrollTo} onBack={onBack} guide={guide} strings={strings} />

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px" }}>
        <GuideHero guide={guide} strings={strings} />

        <div style={{ display:"grid", gridTemplateColumns:"1fr 304px", gap:44, alignItems:"flex-start" }}>

          {/* ── MAIN ── */}
          <div>

            {/* 01 — MATCHES */}
            <section id="matches" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="01" title={strings.section01Title}
                subtitle={guide.sectionSubtitles?.matches} />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:14 }}>
                {guide.matches.map(match => (
                  <MatchCard key={match.id} match={match} strings={strings} />
                ))}
              </div>
            </section>

            {/* 02 — MANIFIESTO */}
            <section id="manifesto" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="02" title={strings.section02Title}
                subtitle={strings.section02Subtitle} />

              <Card style={{ marginBottom:20, overflow:"hidden" }}>
                <div style={{ height:3, background:CITY_ACCENT }} />
                <div style={{ padding:"18px 20px" }}>
                  {guide.manifesto.stadiumInfo.map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:16, padding:"9px 0",
                      borderBottom: i<guide.manifesto.stadiumInfo.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(11,600), color:T.inkFaint, minWidth:140, flexShrink:0,
                        letterSpacing:"0.06em" }}>{item.label}</span>
                      <span style={{ ...uf(13,500), color:T.ink, lineHeight:1.5 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <p style={{ ...uf(15,400), color:T.ink, lineHeight:1.85, marginBottom:20 }}>
                {guide.manifesto.body}
              </p>

              <div style={{ display:"flex", gap:14, padding:"16px 18px", background:T.sandLight,
                borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
                <span style={{ ...uf(9,700), color:T.sage, fontWeight:700, letterSpacing:"0.12em",
                  textTransform:"uppercase", flexShrink:0, marginTop:2 }}>Lagom</span>
                <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>
                  {guide.manifesto.lagomNote}
                </p>
              </div>
            </section>

            {/* 03 — ITINERARY */}
            {guide.itinerary && (
              <section id="itinerary" style={{ marginBottom:52, scrollMarginTop:60 }}>
                <SectionHeader number="03" title={strings.sectionItineraryTitle}
                  subtitle={guide.sectionSubtitles?.itinerary} />
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {guide.itinerary.map(day => (
                    <ItineraryDay key={day.day} day={day} matchMap={matchMap} strings={strings} />
                  ))}
                </div>
              </section>
            )}

            {/* 04 — STAYS */}
            <section id="stays" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="04" title={strings.section03Title}
                subtitle={guide.sectionSubtitles?.stays ?? strings.section03Subtitle} />
              {guide.staysWarning && (
                <div style={{ marginBottom:14, padding:"12px 16px", background:T.coralLight,
                  border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                  <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                    <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                    <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.6, margin:0 }}>
                      {guide.staysWarning}
                    </p>
                  </div>
                </div>
              )}
              {guide.stayNeighborhoods && (
                <NeighborhoodList data={guide.stayNeighborhoods} />
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:14 }}>
                {guide.stays.map(stay => (
                  <StayCard key={stay.name} stay={stay} strings={strings} />
                ))}
              </div>
            </section>

            {/* 05 — VIBE / AMBIENTE */}
            <section id="vibe" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="05" title={strings.section04Title}
                subtitle={guide.sectionSubtitles?.vibe} />

              <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.8, marginBottom:20 }}>
                {guide.vibe.body}
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                {guide.vibeCards.map(item => (
                  <VibeCardView key={item.title} item={item} />
                ))}
              </div>

              <div style={{ display:"flex", gap:14, padding:"16px 18px", background:T.sandLight,
                borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
                <span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.12em", textTransform:"uppercase",
                  flexShrink:0, marginTop:2 }}>Lagom</span>
                <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{guide.vibe.lagomNote}</p>
              </div>
            </section>

            {/* 06 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="06" title={strings.section05Title}
                subtitle={guide.sectionSubtitles?.logistics} />

              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                {guide.logistics.transport.map((item, i) => (
                  <LogisticsCard key={i} item={item} />
                ))}
              </div>

              <Card style={{ marginBottom:20 }}>
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ ...uf(10,700), letterSpacing:"0.14em", textTransform:"uppercase",
                    color:T.inkFaint, marginBottom:12 }}>{strings.section05RealTimes}</div>
                  {guide.logistics.timings.map((t, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"9px 0", borderBottom: i<guide.logistics.timings.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(12,400), color:T.inkMid }}>{t.label}</span>
                      <span style={{ ...uf(12,600), color:T.pine }}>{t.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ overflow:"hidden" }}>
                <div style={{ height:3, background:T.matchGold }} />
                <div style={{ padding:"18px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:16 }}>
                    <span style={{ fontSize:16 }}>⚽</span>
                    <div style={{ ...uf(11,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.matchGold }}>
                      {strings.section05Timeline}
                    </div>
                    <span style={{ ...uf(12,600), color:T.ink }}>{guide.logistics.matchDayCronologia.matchName}</span>
                  </div>
                  {guide.logistics.matchDayCronologia.steps.map((step, i) => (
                    <div key={i} style={{ display:"flex", gap:14,
                      paddingTop: i>0?12:0, paddingBottom: i<guide.logistics.matchDayCronologia.steps.length-1?12:0,
                      borderBottom: i<guide.logistics.matchDayCronologia.steps.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(10,700), color:T.matchGold, minWidth:44, flexShrink:0,
                        letterSpacing:"0.04em", paddingTop:1 }}>{step.time}</span>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{step.text}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div style={{ display:"flex", gap:10, marginTop:14, padding:"12px 16px",
                background:T.sandLight, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS }}>
                <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
                <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>
                  {guide.logistics.timing}
                </p>
              </div>
            </section>

            {/* 07 — FOOD */}
            <section style={{ marginBottom:52 }}>
              <SectionHeader number="07" title={strings.section06Title}
                subtitle={guide.sectionSubtitles?.food} />
              <div style={{ display:"flex", flexDirection:"column" }}>
                {guide.food.map((f, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr auto auto",
                    alignItems:"center", gap:14, padding:"13px 0",
                    borderBottom: i<guide.food.length-1?`1px solid ${T.sandDark}`:"none" }}>
                    <div>
                      <span style={{ ...uf(13,600), color:T.pine }}>{f.dish}</span>
                      <span style={{ ...uf(12,400), color:T.inkFaint, marginLeft:8 }}>— {f.where}</span>
                    </div>
                    <Label bg={T.sageLight} color={T.sage}>{f.type}</Label>
                    <span style={{ ...uf(12,500), color:T.inkFaint, textAlign:"right" }}>{f.price}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 08 — EXPERIENCES */}
            <section style={{ marginBottom:52 }}>
              <SectionHeader number="08" title={strings.section07Title}
                subtitle={guide.sectionSubtitles?.experiences ?? strings.section07Subtitle} />
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                {guide.experiences.map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 20px" }}>
                    <div style={{ ...df(30,900), color:T.sandDark, lineHeight:1, userSelect:"none",
                      paddingTop:3, width:36, textAlign:"right" }}>
                      {String(i+1).padStart(2,"0")}
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:5 }}>
                        <span style={{ ...uf(14,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 09 — CIERRE */}
            <section style={{ paddingBottom:0 }}>
              <div style={{ width:36, height:3, background:T.coral, marginBottom:22 }} />
              <blockquote style={{ ...uf(21, 400), color:T.pine, lineHeight:1.65,
                margin:"0 0 14px", maxWidth:560, borderLeft:`3px solid ${T.coral}`, paddingLeft:22 }}>
                "{guide.closingNote}"
              </blockquote>
              <Label color={T.inkFaint} style={{ paddingLeft:22 }}>{guide.closingSignature}</Label>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position:"sticky", top:60, alignSelf:"flex-start", paddingBottom:40 }}>
            <GuideSidebar guide={guide} strings={strings} onPlan={() => { if (typeof window !== "undefined") window.location.href = (window.location.pathname.startsWith("/en/") ? "/en/planner" : "/es/planificador") + "?destination=" + encodeURIComponent(guide.city) }} />
          </div>
        </div>

        <div style={{ height:80 }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App({ locale = "es" }) {
  const guide = (locale === "en" && en) ? en : es;
  const strings = locale === "en" ? ui.en : ui.es;
  return (
    <>
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
      <GuideDetail guide={guide} strings={strings} onBack={() => {}} />
    </>
  );
}
