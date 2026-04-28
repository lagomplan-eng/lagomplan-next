"use client";

import { useState, useEffect } from "react";
import { es, en } from "../../../lib/worldcup/data/cdmx";
import { ui } from "../../../lib/worldcup/ui-strings";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — LagomPlan canonical
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
const CITY_ACCENT = "#1A6B5A";
const SECTION_ALT_BG = "#F4F0EB";

const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>
    {children}
  </span>
);


// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATION — Ciudad de México
// ─────────────────────────────────────────────────────────────────────────────
const CdmxIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#EBF0E8" rx={RADIUS} />
    <rect x="0" y="0" width="280" height="80" fill="#F5F0E8" opacity="0.5" />
    {/* Popocatépetl volcano */}
    <polygon points="148,90 188,25 228,90" fill="#2D5A3A" opacity="0.42" />
    <polygon points="185,90 218,36 251,90" fill="#3A6B4A" opacity="0.35" />
    {/* Snow caps */}
    <polygon points="188,25 200,46 176,46" fill="white" opacity="0.82" />
    <polygon points="218,36 228,52 208,52" fill="white" opacity="0.65" />
    {/* City skyline */}
    <rect x="10" y="66" width="6"  height="24" fill="#1A6B5A" opacity="0.28" rx={1} />
    <rect x="19" y="58" width="8"  height="32" fill="#1A6B5A" opacity="0.32" rx={1} />
    <rect x="31" y="63" width="5"  height="27" fill="#1A6B5A" opacity="0.22" rx={1} />
    <rect x="39" y="52" width="10" height="38" fill="#1A6B5A" opacity="0.30" rx={1} />
    <rect x="53" y="60" width="7"  height="30" fill="#1A6B5A" opacity="0.20" rx={1} />
    <rect x="64" y="56" width="6"  height="34" fill="#1A6B5A" opacity="0.25" rx={1} />
    {/* Torre Latinoamericana — tall spire */}
    <rect x="74" y="40" width="4"  height="50" fill="#1A6B5A" opacity="0.35" rx={1} />
    <polygon points="76,40 73,47 79,47" fill="#1A6B5A" opacity="0.4" />
    {/* Estadio Azteca oval */}
    <ellipse cx="110" cy="110" rx="36" ry="13" fill="#1A6B5A" opacity="0.16" />
    <ellipse cx="110" cy="110" rx="26" ry="9"  fill="#1A6B5A" opacity="0.10" />
    {/* Ángel de la Independencia column */}
    <rect x="33" y="42" width="2.5" height="24" fill="#C4622A" opacity="0.55" />
    <polygon points="34.25,42 31.5,49 37,49" fill="#C4622A" opacity="0.5" />
    {/* Flag */}
    <text x="258" y="50" fontSize="20" textAnchor="middle">🇲🇽</text>
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
        background:T.white,
        border:`1px solid ${CARD_BORDER}`,
        borderRadius:RADIUS,
        boxShadow: isHovered ? "0 4px 16px rgba(28,28,26,0.09), 0 1px 3px rgba(28,28,26,0.05)" : CARD_SHADOW,
        transition:"box-shadow 0.22s, transform 0.22s",
        transform: isHovered ? "translateY(-1px)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>
      {children}
    </div>
  );
};

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom:32 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
      <span style={{ ...uf(9,500), letterSpacing:"0.18em", textTransform:"uppercase", color:T.inkFaint }}>{number}</span>
      <div style={{ flex:1, height:1, background:"rgba(28,28,26,0.08)" }} />
    </div>
    <h2 style={{ ...uf(27, 700), color:T.pine, lineHeight:1.05, marginBottom:subtitle ? 8 : 0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.65, margin:0, maxWidth:540 }}>{subtitle}</p>}
  </div>
);

const LagomNote = ({ children }) => (
  <div style={{ display:"flex", gap:16, padding:"18px 22px", background:T.sandLight, borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
    <span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.14em", textTransform:"uppercase", flexShrink:0, marginTop:3 }}>Lagom</span>
    <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:0 }}>{children}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MATCH CARD
// ─────────────────────────────────────────────────────────────────────────────
const MatchCard = ({ match, onPlanAround, strings }) => {
  const isTBD = !match.teams[0].flag && !match.teams[1].flag;
  const borderColor = match.highlight ? `${T.matchGold}50` : T.sandDark;
  const accentBar = match.highlight ? T.matchGold : isTBD ? T.sandDark : CITY_ACCENT;

  return (
    <Card style={{ overflow:"hidden", borderColor, opacity: isTBD ? 0.55 : 1 }}>
      <div style={{ height:4, background:accentBar }} />
      <div style={{ padding:"22px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ textAlign:"center", minWidth:48, padding:"8px 12px", background:T.sand, borderRadius:RADIUS-2, border:`1px solid ${T.sandDark}` }}>
              <div style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkFaint }}>{match.day}</div>
              <div style={{ ...df(20,700), color:T.pine, lineHeight:1.1, margin:"2px 0" }}>{match.date.split(" ")[0]}</div>
              <div style={{ ...uf(9,500), color:T.inkFaint }}>{match.date.split(" ")[1]}</div>
            </div>
            <div>
              <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3 }}>{match.stadium}</div>
              <div style={{ ...uf(13,500), color:T.inkMid }}>{match.time} local</div>
            </div>
          </div>
          {match.tag && (
            <span style={{
              ...uf(9,700), letterSpacing:"0.08em", textTransform:"uppercase",
              color: match.highlight ? T.matchGold : CITY_ACCENT,
              background: match.highlight ? T.matchGoldLight : CITY_ACCENT+"15",
              border:`1px solid ${match.highlight ? T.matchGold+"50" : CITY_ACCENT+"35"}`,
              padding:"4px 10px", borderRadius:40, flexShrink:0, maxWidth:160, textAlign:"right",
            }}>{match.tag}</span>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"18px 0", borderTop:`1px solid ${T.sandDark}`, borderBottom:`1px solid ${T.sandDark}`, marginBottom:18 }}>
          <div style={{ flex:1, textAlign:"right" }}>
            <div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[0].name}</div>
            {match.teams[0].flag && <div style={{ fontSize:26, lineHeight:1 }}>{match.teams[0].flag}</div>}
          </div>
          <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.12em", padding:"6px 14px", background:T.sand, borderRadius:6, border:`1px solid ${T.sandDark}` }}>vs</div>
          <div style={{ flex:1, textAlign:"left" }}>
            <div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[1].name}</div>
            {match.teams[1].flag && <div style={{ fontSize:26, lineHeight:1 }}>{match.teams[1].flag}</div>}
          </div>
        </div>
        {!isTBD && (
          null
        )}
        {isTBD && (
          <div style={{ ...uf(12,400), color:T.inkFaint, textAlign:"center", padding:"8px 0" }}>
            {strings.rivalTBD}
          </div>
        )}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESSIVE DISCLOSURE
// ─────────────────────────────────────────────────────────────────────────────
const ShowMoreToggle = ({ expanded, onToggle, strings }) => (
  <button onClick={onToggle} style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:16, background:"transparent", border:`1px solid ${T.sage}55`, borderRadius:40, ...uf(10,600), color:T.sage, cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 14px", transition:"all 0.18s" }}
    onMouseEnter={e => { e.currentTarget.style.background=T.sageLight; e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.color=T.pine; }}
    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`${T.sage}55`; e.currentTarget.style.color=T.sage; }}>
    {expanded ? strings.showLess : strings.showMore}
  </button>
);

const CollapsibleVibeCard = ({ item, strings }) => {
  const [open, setOpen] = useState(false);
  return (
    <Card hover style={{ overflow:"hidden", display:"flex", flexDirection:"row" }}>
      <div style={{ width:3, flexShrink:0, background:item.typeColor, opacity:0.7 }} />
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:9, flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:item.typeColor }}>{item.type}</span>
          <span style={{ ...uf(9,500), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint }}>{item.tag}</span>
        </div>
        <div style={{ ...df(14,700), color:T.pine, lineHeight:1.25 }}>{item.title}</div>
        <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0, ...(open ? {} : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{item.desc}</p>
        <ShowMoreToggle expanded={open} onToggle={() => setOpen(!open)} strings={strings} />
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAY CARD
// ─────────────────────────────────────────────────────────────────────────────
const StayCard = ({ stay, strings }) => (
  <Card hover style={{ display:"flex", flexDirection:"column", height:"100%" }}>
    <div style={{ padding:"22px 22px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ ...df(26,700), color:T.pine, letterSpacing:"-0.02em" }}>{stay.price}</span>
        <Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label>
      </div>
      <div style={{ ...df(17,700), color:T.pine, lineHeight:1.2, marginBottom:4 }}>{stay.name}</div>
      <div style={{ ...uf(12,500), color:T.inkFaint, marginBottom:10 }}>{stay.area}</div>
      {stay.priceCAD && (
        <div style={{ ...uf(12,600), color:CITY_ACCENT, marginBottom:14, letterSpacing:"0.02em" }}>{stay.priceCAD}</div>
      )}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
        {stay.tags.map(tag => (
          <span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint, background:T.sand, padding:"3px 8px", borderRadius:5, border:`1px solid ${T.sandDark}` }}>{tag}</span>
        ))}
      </div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"14px 22px", borderTop:`1px solid ${T.sandDark}` }}>
      <a href={stay.url || "#"} target={stay.url ? "_blank" : undefined} rel="noopener noreferrer" style={{ display:"block", textAlign:"center", width:"100%", padding:"11px", borderRadius:RADIUS-2, background: stay.url ? T.pine : T.sandDark, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, textDecoration:"none", transition:"opacity 0.18s", pointerEvents: stay.url ? "auto" : "none", opacity: stay.url ? 1 : 0.45 }}
        onMouseEnter={e => { if (stay.url) e.currentTarget.style.opacity="0.82"; }}
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
        <p style={{ ...uf(12,400), color:T.inkFaint, lineHeight:1.7, margin:"0 0 12px", fontStyle:"normal" }}>{data.intro}</p>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {data.items.map((n, i) => <NeighborhoodRow key={i} item={n} />)}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOD CARD
// ─────────────────────────────────────────────────────────────────────────────
// Splits the description on "Qué pedir:" and "Vibe:" (or English equivalents)
// so we can render the main description as a paragraph and the practical hints
// as visually distinct rows. Falls back to a single paragraph if no markers
// match — older entries that don't follow the rich format still render fine.
function parseFoodDescription(text) {
  if (!text) return { body: '', whatToOrder: null, vibe: null }
  // Match either ES "Qué pedir:" or EN "What to order:"
  const orderRe = /(Qué pedir|What to order):\s*/i
  const vibeRe  = /Vibe:\s*/i
  const orderMatch = text.match(orderRe)
  const vibeMatch  = text.match(vibeRe)
  if (!orderMatch && !vibeMatch) return { body: text.trim(), whatToOrder: null, vibe: null }

  let body = text
  let whatToOrder = null
  let vibe = null

  if (vibeMatch) {
    vibe = text.slice(vibeMatch.index + vibeMatch[0].length).trim().replace(/\s+$/, '')
    body = text.slice(0, vibeMatch.index)
  }
  if (orderMatch) {
    const after = body.slice(orderMatch.index + orderMatch[0].length)
    // Strip any leading punctuation/whitespace after the marker
    whatToOrder = after.trim().replace(/^[.\s]+/, '')
    body = body.slice(0, orderMatch.index)
  }
  return { body: body.trim(), whatToOrder, vibe }
}

const FoodCard = ({ item, strings }) => {
  const parsed = parseFoodDescription(item.where || '')
  const [open, setOpen] = useState(false)
  const hasDetails = parsed.body || parsed.whatToOrder || parsed.vibe
  return (
    <div style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:CARD_SHADOW, padding:"18px 20px", display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
        <span style={{ ...uf(14,700), color:T.pine, lineHeight:1.3 }}>{item.dish}</span>
        <span style={{ ...uf(12,500), color:T.inkFaint, flexShrink:0 }}>{item.price}</span>
      </div>
      <div style={{ marginTop:2 }}>
        <Label color={T.sage} bg={T.sageLight}>{item.type}</Label>
      </div>
      {open && parsed.body && (
        <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.7, margin:0, marginTop:4 }}>{parsed.body}</p>
      )}
      {open && (parsed.whatToOrder || parsed.vibe) && (
        <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:2, paddingTop:10, borderTop:`1px solid ${T.sandDark}` }}>
          {parsed.whatToOrder && (
            <div style={{ display:"flex", gap:8, alignItems:"baseline" }}>
              <span style={{ ...uf(10,700), letterSpacing:"0.06em", textTransform:"uppercase", color:T.sage, flexShrink:0 }}>{strings?.foodWhatToOrder ?? 'Qué pedir'}</span>
              <span style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.55 }}>{parsed.whatToOrder}</span>
            </div>
          )}
          {parsed.vibe && (
            <div style={{ display:"flex", gap:8, alignItems:"baseline" }}>
              <span style={{ ...uf(10,700), letterSpacing:"0.06em", textTransform:"uppercase", color:T.sage, flexShrink:0 }}>{strings?.foodVibe ?? 'Vibe'}</span>
              <span style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.55 }}>{parsed.vibe}</span>
            </div>
          )}
        </div>
      )}
      {hasDetails && (
        <ShowMoreToggle expanded={open} onToggle={() => setOpen(!open)} strings={strings} />
      )}
    </div>
  )
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGISTICS CARD
// ─────────────────────────────────────────────────────────────────────────────
const LogisticsCard = ({ item }) => (
  <Card style={{ display:"flex", gap:16, padding:"18px 22px", alignItems:"flex-start", borderColor: item.isWarning ? `${T.coral}55` : T.sandDark, background: item.isWarning ? T.coralLight : T.white }}>
    <div style={{ width:40, height:40, flexShrink:0, background:item.isWarning ? T.coral+"20" : T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
      {item.icon}
    </div>
    <div>
      <div style={{ ...uf(13,700), color:item.isWarning ? T.coral : T.pine, marginBottom:6 }}>{item.title}</div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{item.text}</p>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const GuideSidebar = ({ guide, onPlan, strings }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      <Card style={{ padding:"22px 22px", background:T.sandLight, borderColor:T.sandDark }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>{strings.plannerKicker}</Label>
        <p style={{ ...uf(16, 700), color:T.pine, lineHeight:1.4, marginBottom:16 }}>
          {strings.plannerPitch}
        </p>
        <button onClick={onPlan} style={{ width:"100%", padding:"11px 16px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.82"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          {guide.plannerCTA} →
        </button>
      </Card>

      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>✦</span>
          </div>
          <Label color={T.pine} style={{ fontSize:11 }}>{strings.lagomNotes}</Label>
        </div>
        {guide.lagomTips.map((tip, i) => (
          <div key={i} style={{ display:"flex", gap:11, paddingTop:12, paddingBottom:12, borderBottom: i < guide.lagomTips.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:T.sage, flexShrink:0, marginTop:7 }} />
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{tip}</p>
          </div>
        ))}
      </Card>

      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.matchGoldLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>☑</span>
          </div>
          <Label color={T.pine} style={{ fontSize:11 }}>{strings.matchDayChecklist}</Label>
        </div>
        {guide.matchDayChecklist.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => ({...p,[i]:!p[i]}))} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderTop: i > 0 ? `1px solid ${T.sandDark}` : "none", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%" }}>
            <div style={{ width:16, height:16, flexShrink:0, marginTop:2, border:`1.5px solid ${checked[i] ? T.sage : T.sandDark}`, borderRadius:4, background:checked[i] ? T.sage : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
              {checked[i] && <span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ ...uf(12,400), color:checked[i] ? T.inkFaint : T.inkMid, lineHeight:1.55, textDecoration:checked[i] ? "line-through" : "none", transition:"all 0.15s" }}>{item}</span>
          </button>
        ))}
      </Card>

      <Card style={{ padding:"20px 22px", background:T.fjordLight, borderColor:`${T.fjord}30` }}>
        <Label color={T.fjord} style={{ marginBottom:10, display:"block" }}>{strings.didYouKnow}</Label>
        <p style={{ ...uf(13,400), color:T.fjord, lineHeight:1.72, margin:0 }}>{guide.didYouKnow}</p>
      </Card>

      <Card style={{ padding:"18px 22px", borderStyle:"dashed", borderColor:T.sandDark }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>✦</span>
          <div>
            <div style={{ ...uf(12,700), color:T.pine, marginBottom:6 }}>{strings.optimizeAi}</div>
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:"0 0 12px" }}>
              {strings.optimizeAiPitch}
            </p>
            <button onClick={onPlan} style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2, padding:"7px 14px", cursor:"pointer", transition:"all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.background=T.pine; e.currentTarget.style.color=T.white; }}
              onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color=T.pine; }}>
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
  <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:56, alignItems:"center", padding:"72px 0 64px", borderBottom:`1px solid rgba(28,28,26,0.08)`, marginBottom:56 }}>
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <span style={{ fontSize:18 }}>{guide.flag}</span>
        <Label color={T.inkFaint}>{guide.country} · {guide.state}</Label>
        <span style={{ color:T.sandDark, fontSize:12 }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.name}</Label>
        <span style={{ color:T.sandDark, fontSize:12 }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.capacity}</Label>
      </div>
      <h1 style={{ ...uf("clamp(44px,5.5vw,72px)", 900), color:T.pine, lineHeight:0.92, letterSpacing:"-0.03em", marginBottom:22 }}>
        {guide.city}
      </h1>
      <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, maxWidth:500, marginBottom:32 }}>
        {guide.description}
      </p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
        {guide.tags.map(tag => (
          <span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`, padding:"5px 13px", borderRadius:40 }}>{tag}</span>
        ))}
        <span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}35`, padding:"5px 13px", borderRadius:40 }}>
          ⚽ {guide.matches.length} {strings.matchesLabel}
        </span>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:3 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width:6, height:6, borderRadius:"50%", background: i <= s.value ? T.sage : T.sandDark }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}>
      <CdmxIllustration />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STICKY NAV
// ─────────────────────────────────────────────────────────────────────────────
const getNavItems = (strings) => [
  {id:"matches",   label:strings.navMatches},
  {id:"manifesto", label:strings.navManifesto},
  {id:"stays",     label:strings.navStays},
  {id:"vibe",      label:strings.navVibe},
  {id:"logistics", label:strings.navLogistics},
];

const StickyNav = ({ active, onNavigate, onBack, guide, strings }) => (
  <div style={{ position:"sticky", top:0, zIndex:40, background:`${T.bg}F5`, backdropFilter:"blur(18px)", borderBottom:`1px solid ${T.sandDark}`, height:52, display:"flex", alignItems:"center", padding:"0 40px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none", cursor:"pointer", padding:"0 14px 0 0", marginRight:14, borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em", transition:"color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color=T.pine}
      onMouseLeave={e => e.currentTarget.style.color=T.inkFaint}>
      {strings.navBeyond === "Beyond the stadium" ? "← Guides" : "← Guías"}
    </button>
    <span style={{ ...uf(14, 700), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>{guide.city}</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />
    {getNavItems(strings).map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{ ...uf(10, active===item.id ? 700 : 500), letterSpacing:"0.08em", textTransform:"uppercase", color: active===item.id ? T.pine : T.inkFaint, background:"none", border:"none", padding:"0 13px", height:"100%", cursor:"pointer", borderBottom:`2px solid ${active===item.id ? T.coral : "transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0 }}>{item.label}</button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE DETAIL
// ─────────────────────────────────────────────────────────────────────────────
const GuideDetail = ({ guide, onBack, strings }) => {
  const [active,        setActive]        = useState("matches");
  const [showManifesto, setShowManifesto] = useState(false);
  const [showVibe,      setShowVibe]      = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [showFood,      setShowFood]      = useState(false);
  const [showExp,       setShowExp]       = useState(false);

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

      <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 40px" }}>
        <GuideHero guide={guide} strings={strings} />

        <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:52, alignItems:"flex-start" }}>

          {/* ── MAIN ── */}
          <div>

            {/* 01 — MATCHES */}
            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title={strings.section01Title}
                subtitle="5 partidos confirmados en el Estadio Azteca. México juega el 11 y el 24 de junio — las dos fechas de mayor demanda del torneo en la ciudad." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {guide.matches.map(match => (
                  <MatchCard key={match.id} match={match} onPlanAround={() => {}} strings={strings} />
                ))}
              </div>
            </section>

            {/* 02 — MANIFIESTO */}
            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title={strings.section02Title}
                subtitle={strings.section02Subtitle} />
              <Card style={{ marginBottom:24, overflow:"hidden" }}>
                <div style={{ height:4, background:CITY_ACCENT }} />
                <div style={{ padding:"20px 24px" }}>
                  {guide.manifesto.stadiumInfo.map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:20, padding:"11px 0", borderBottom: i < guide.manifesto.stadiumInfo.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
                      <span style={{ ...uf(11,600), color:T.inkFaint, minWidth:148, flexShrink:0, letterSpacing:"0.05em" }}>{item.label}</span>
                      <span style={{ ...uf(13,500), color:T.ink, lineHeight:1.6 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              {showManifesto && (
                <>
                  <p style={{ ...uf(15,400), color:T.ink, lineHeight:1.9, marginBottom:24, maxWidth:640 }}>
                    {guide.manifesto.body}
                  </p>
                  <LagomNote>{guide.manifesto.lagomNote}</LagomNote>
                </>
              )}
              <ShowMoreToggle expanded={showManifesto} onToggle={() => setShowManifesto(!showManifesto)} strings={strings} />
            </section>

            {/* 03 — STAYS */}
            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title={strings.section03Title}
                subtitle={strings.section03Subtitle} />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>
                    Los precios son estimaciones para el periodo mundialista. El 11 de junio (México vs. Sudáfrica, partido inaugural) y el 24 de junio (Rep. Checa vs. México) son las fechas más críticas.
                    Si aún no tienes alojamiento, prioriza Airbnb en <strong>Coyoacán</strong> antes de considerar hoteles de cadena en zonas sobredemandadas. AIFA NO es una opción cercana al estadio — está a 80 km al norte.
                  </p>
                </div>
              </div>
              {guide.stayNeighborhoods && (
                <NeighborhoodList data={guide.stayNeighborhoods} />
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay => <StayCard key={stay.name} stay={stay} strings={strings} />)}
              </div>
            </section>

            {/* 04 — VIBE */}
            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title={strings.section04Title}
                subtitle="Fan Fest oficial en el Zócalo, pantallas en el Bosque de Chapultepec y las cantinas que llevan décadas transmitiendo fútbol." />
              <p style={{
                ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe ? 28 : 0, maxWidth:640,
                ...(showVibe ? {} : { display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }),
              }}>
                {guide.vibe.body}
              </p>
              {showVibe && (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
                    {guide.vibeCards.map(item => <CollapsibleVibeCard key={item.title} item={item} strings={strings} />)}
                  </div>
                </>
              )}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} strings={strings} />
            </section>

            {/* 05 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title={strings.section05Title}
                subtitle="Metro + Tren Ligero es la única ruta que no depende del tráfico de CDMX." />
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom: showLogistics ? 24 : 0 }}>
                {guide.logistics.transport.slice(0, 2).map((item, i) => <LogisticsCard key={i} item={item} />)}
              </div>
              {showLogistics && (
                <>
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                    {guide.logistics.transport.slice(2).map((item, i) => <LogisticsCard key={i} item={item} />)}
                  </div>
                  <Card style={{ marginBottom:24 }}>
                    <div style={{ padding:"18px 24px" }}>
                      <div style={{ ...uf(10,700), letterSpacing:"0.16em", textTransform:"uppercase", color:T.inkFaint, marginBottom:14 }}>{strings.section05RealTimes}</div>
                      {guide.logistics.timings.map((t, i) => (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom: i < guide.logistics.timings.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
                          <span style={{ ...uf(13,400), color:T.inkMid }}>{t.label}</span>
                          <span style={{ ...uf(13,700), color:T.pine }}>{t.value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card style={{ overflow:"hidden", marginBottom:16 }}>
                    <div style={{ height:4, background:T.matchGold }} />
                    <div style={{ padding:"20px 24px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                        <span style={{ fontSize:16 }}>⚽</span>
                        <div style={{ ...uf(11,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.matchGold }}>{strings.section05Timeline}</div>
                        <span style={{ ...uf(13,600), color:T.ink }}>{guide.logistics.matchDayCronologia.matchName}</span>
                      </div>
                      {guide.logistics.matchDayCronologia.steps.map((step, i) => (
                        <div key={i} style={{ display:"flex", gap:16, paddingTop: i > 0 ? 14 : 0, paddingBottom: i < guide.logistics.matchDayCronologia.steps.length-1 ? 14 : 0, borderBottom: i < guide.logistics.matchDayCronologia.steps.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
                          <span style={{ ...uf(10,700), color:T.matchGold, minWidth:46, flexShrink:0, letterSpacing:"0.04em", paddingTop:2 }}>{step.time}</span>
                          <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{step.text}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <div style={{ display:"flex", gap:12, padding:"14px 18px", background:T.sandLight, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS }}>
                    <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
                    <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{guide.logistics.timing}</p>
                  </div>
                </>
              )}
              <ShowMoreToggle expanded={showLogistics} onToggle={() => setShowLogistics(!showLogistics)} strings={strings} />
            </section>

            {/* 06 — FOOD */}
            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title={strings.section06Title}
                subtitle="CDMX tiene la gastronomía con más diversidad de América Latina — más de 150 tipos de chile y una cocina reconocida por la UNESCO. El reto no es encontrar dónde comer bien, sino elegir." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                {guide.food.slice(0, 3).map((f, i) => <FoodCard key={i} item={f} strings={strings} />)}
                {showFood && guide.food.slice(3).map((f, i) => <FoodCard key={i+3} item={f} strings={strings} />)}
              </div>
              {guide.food.length > 3 && (
                <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} strings={strings} />
              )}
            </section>

            {/* 07 — EXPERIENCES */}
            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title={strings.section07Title}
                subtitle={strings.section07Subtitle} />
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {guide.experiences.slice(0, 1).map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>
                      {String(i+1).padStart(2,"0")}
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                      {exp.affiliateLink && (
                        <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"inline-flex", alignItems:"center", gap:6, ...uf(11,600), color:T.sage, letterSpacing:"0.05em", textDecoration:"none", borderBottom:`1px solid ${T.sage}50`, paddingBottom:1, transition:"color 0.15s, border-color 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.color=T.pine; e.currentTarget.style.borderColor=T.pine; }}
                          onMouseLeave={e => { e.currentTarget.style.color=T.sage; e.currentTarget.style.borderColor=`${T.sage}50`; }}>
                          {exp.affiliateLabel} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {showExp && guide.experiences.slice(1).map((exp, i) => (
                  <div key={i+1} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>
                      {String(i+2).padStart(2,"0")}
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                      {exp.affiliateLink && (
                        <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"inline-flex", alignItems:"center", gap:6, ...uf(11,600), color:T.sage, letterSpacing:"0.05em", textDecoration:"none", borderBottom:`1px solid ${T.sage}50`, paddingBottom:1, transition:"color 0.15s, border-color 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.color=T.pine; e.currentTarget.style.borderColor=T.pine; }}
                          onMouseLeave={e => { e.currentTarget.style.color=T.sage; e.currentTarget.style.borderColor=`${T.sage}50`; }}>
                          {exp.affiliateLabel} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <ShowMoreToggle expanded={showExp} onToggle={() => setShowExp(!showExp)} strings={strings} />
            </section>

            {/* 08 — CIERRE */}
            <section style={{ marginBottom:0 }}>
              <div style={{ background:T.pine, borderRadius:RADIUS+2, padding:"48px 44px 44px", overflow:"hidden" }}>
                <div style={{ width:32, height:2, background:T.coral, marginBottom:28, opacity:0.85 }} />
                <blockquote style={{ ...df("clamp(18px,2.4vw,24px)",400,"normal"), color:T.sand, lineHeight:1.75, margin:"0 0 24px", maxWidth:540 }}>
                  "{guide.closingNote}"
                </blockquote>
                <Label color={`${T.sage}`} style={{ opacity:0.7 }}>{guide.closingSignature}</Label>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position:"sticky", top:64, alignSelf:"flex-start", paddingBottom:48 }}>
            <GuideSidebar guide={guide} strings={strings} onPlan={() => { if (typeof window !== "undefined") window.location.href = (window.location.pathname.startsWith("/en/") ? "/en/planner" : "/es/planificador") + "?destination=" + encodeURIComponent(guide.city) }} />
          </div>
        </div>

        <div style={{ height:96 }} />
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
