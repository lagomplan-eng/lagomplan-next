import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — LagomPlan canonical (Pine/Sage/Sand/Coral/Fjord)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  pine:      "#0F3A33",
  sage:      "#6B8F86",
  sageLight: "#EAF2F0",
  sand:      "#EDE7E1",
  sandLight: "#F7F4F1",
  sandDark:  "#D9D2C9",
  coral:     "#E1615B",
  coralLight:"#FCEEED",
  fjord:     "#2D4F6C",
  fjordLight:"#E3EBF2",
  ink:       "#1C1C1A",
  inkMid:    "#5A5A56",
  inkFaint:  "#9A9A94",
  white:     "#FFFFFF",
  // WC-specific (used sparingly, never dominant)
  matchGold: "#B8860B",
  matchGoldLight: "#FBF5E0",
};

const RADIUS = 8;                        // card border radius — consistent everywhere
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";

// Typography helpers
const df = (size, weight = 400, style = "normal") => ({
  fontFamily: "'Fraunces', serif",
  fontSize: size,
  fontWeight: weight,
  fontStyle: style,
});
const uf = (size, weight = 400) => ({
  fontFamily: "'Manrope', sans-serif",
  fontSize: size,
  fontWeight: weight,
});

const Label = ({ children, color = T.inkFaint, bg = "transparent", style = {} }) => (
  <span style={{
    ...uf(10, 600),
    letterSpacing: "0.13em",
    textTransform: "uppercase",
    color,
    background: bg,
    padding: bg !== "transparent" ? "3px 9px" : 0,
    borderRadius: bg !== "transparent" ? 40 : 0,
    ...style,
  }}>
    {children}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE DATA — Vancouver (canonical demo, all 16 use same schema)
// ─────────────────────────────────────────────────────────────────────────────
const VANCOUVER = {
  id: "van",
  city: "Vancouver",
  country: "Canadá",
  state: "British Columbia",
  flag: "🇨🇦",

  tags: ["Fútbol", "Cultura", "Gastronomía", "Naturaleza"],

  stadium: { name: "BC Place", capacity: "54,500", area: "Downtown" },

  // Editorial hero content
  headline: "La ciudad más bella del torneo.",
  description: "Montañas nevadas, océano Pacífico y un bosque de 400 hectáreas dentro de la ciudad. Vancouver no necesita el Mundial para ser el destino — el Mundial necesita a Vancouver.",

  matches: [
    {
      id: "m1",
      date: "12 Jun",
      day: "Jue",
      time: "19:00",
      teams: [
        { name: "Alemania",       flag: "🇩🇪" },
        { name: "Arabia Saudita", flag: "🇸🇦" },
      ],
      stadium: "BC Place",
      tag: null,
      highlight: false,
    },
    {
      id: "m2",
      date: "17 Jun",
      day: "Mar",
      time: "18:00",
      teams: [
        { name: "Canadá",  flag: "🇨🇦" },
        { name: "Uruguay", flag: "🇺🇾" },
      ],
      stadium: "BC Place",
      tag: "Local",
      highlight: true,
    },
    {
      id: "m3",
      date: "22 Jun",
      day: "Dom",
      time: "21:00",
      teams: [
        { name: "España",   flag: "🇪🇸" },
        { name: "Alemania", flag: "🇩🇪" },
      ],
      stadium: "BC Place",
      tag: "Partido clave",
      highlight: false,
    },
  ],

  scores: [
    { label: "Ambiente",    value: 4 },
    { label: "Cultura",     value: 5 },
    { label: "Gastronomía", value: 5 },
    { label: "Transporte",  value: 5 },
    { label: "Seguridad",   value: 5 },
    { label: "Costo",       value: 2 },
  ],

  // 5-day itinerary (match-day aware)
  itinerary: [
    {
      day: 1,
      title: "Llegada y primer pulso",
      subtitle: "Gastown · False Creek · Granville Island",
      isMatchDay: false,
      steps: [
        { time: "Mañana",  text: "Canada Line desde el aeropuerto hasta Waterfront Station (26 min, $11 CAD). Deja el equipaje, sal a caminar." },
        { time: "Mediodía", text: "Desayuno tardío en Granville Island Market. Ostras del Pacífico en los puestos exteriores, $2–3 CAD cada una." },
        { time: "Tarde",   text: "Recorrido a pie por Gastown: el reloj de vapor, las galerías independientes, el café de especialidad de Revolver." },
        { time: "Noche",   text: "Cena en Yaletown. La ruta del False Creek de noche, con el BC Place iluminado al fondo." },
      ],
    },
    {
      day: 2,
      title: "Día de partido — Canadá vs Uruguay",
      subtitle: "BC Place · Jun 17",
      isMatchDay: true,
      matchRef: "m2",
      steps: [
        { time: "10:00",   text: "Desayuno en Pike Place (equivalente local en el Granville Market). Sin prisa — el partido es de noche." },
        { time: "14:00",   text: "Pre-partido en Steamworks Brew Pub (Gastown). Tres pisos, cerveza artesanal, pantallas en todos lados." },
        { time: "17:00",   text: "Camina al estadio desde Waterfront (18 min por el puerto). Evita la estación Stadium-Chinatown — colapsa en días de partido." },
        { time: "18:00",   text: "Entrada al BC Place. El estadio tiene techo retráctil y pantalla de 360°. Llegar una hora antes vale la pena." },
        { time: "Post",    text: "Post-partido en Yaletown. Los bares de Mainland Street están abiertos hasta las 2am." },
      ],
    },
    {
      day: 3,
      title: "Stanley Park y el mar",
      subtitle: "Stanley Park · Coal Harbour · West End",
      isMatchDay: false,
      steps: [
        { time: "Mañana",  text: "Alquiler de bici en English Bay ($12 CAD/hora). Los 10 km del seawall junto al océano son el recorrido más fotogénico del torneo." },
        { time: "Mediodía", text: "Almuerzo en The Fish House en Stanley Park. Salmón del Pacífico recién capturado." },
        { time: "Tarde",   text: "Kayak en Indian Arm con Deep Cove Kayak ($75 CAD). Delfines, águilas, montañas glaciares." },
        { time: "Noche",   text: "Cena en Hawksworth (Rosewood Hotel Georgia). La mejor cocina canadiense de la ciudad." },
      ],
    },
    {
      day: 4,
      title: "Día de partido — España vs Alemania",
      subtitle: "BC Place · Jun 22",
      isMatchDay: true,
      matchRef: "m3",
      steps: [
        { time: "Mañana",  text: "Kensington Market a pie. El barrio más multicultural de Vancouver — 50 cocinas en 5 cuadras." },
        { time: "13:00",   text: "Almuerzo temprano. El partido es de noche — come bien antes." },
        { time: "17:00",   text: "Pre-partido en la zona de Gastown con la afición española. Los bares de Water Street van a estar llenos desde las 5pm." },
        { time: "20:00",   text: "España vs Alemania. Probablemente el partido técnicamente más interesante de la fase de grupos en Vancouver." },
      ],
    },
    {
      day: 5,
      title: "Ferry a Bowen Island",
      subtitle: "Horseshoe Bay · Bowen Island",
      isMatchDay: false,
      steps: [
        { time: "09:00",   text: "Ferry desde Horseshoe Bay ($13 CAD ida y vuelta). 35 minutos con el Monte Rainier al fondo." },
        { time: "Mañana",  text: "El pueblo de Bowen Island tiene una sola calle principal. Restaurante de pescado fresco, panadería artesanal." },
        { time: "Tarde",   text: "Regreso en el ferry de las 4pm. La imagen del skyline de Vancouver desde el agua al atardecer es la foto del viaje." },
        { time: "Noche",   text: "Última cena en Vancouver. Bao Bei en Chinatown — pequeños platos chino-canadienses, lista de vinos natural." },
      ],
    },
  ],

  stays: [
    {
      name: "Rosewood Hotel Georgia",
      area: "Downtown",
      price: "$$$$",
      tags: ["Histórico", "Restaurante"],
      note: "Abierto en 1927. El Hawksworth Restaurant abajo. El hotel de la ciudad.",
      best_for: "Pareja",
    },
    {
      name: "Loden Hotel",
      area: "Coal Harbour",
      price: "$$$",
      tags: ["Boutique", "Vista al puerto"],
      note: "Criterio europeo. Bicicletas para huéspedes. A 20 min del estadio caminando.",
      best_for: "Pareja",
    },
    {
      name: "Westin Bayshore",
      area: "Coal Harbour",
      price: "$$$",
      tags: ["Alberca", "Familiar"],
      note: "Junto a Stanley Park. La mejor alberca del torneo para familia.",
      best_for: "Familia",
    },
    {
      name: "Granville Island Hotel",
      area: "False Creek",
      price: "$$",
      tags: ["Sobre el agua", "Único"],
      note: "La ubicación más especial de la ciudad. A 20 min del estadio en SkyTrain.",
      best_for: "Pareja",
    },
    {
      name: "Sutton Place Hotel",
      area: "West End",
      price: "$$",
      tags: ["Confiable"],
      note: "Bar activo en noches de partido. Bien ubicado para el SkyTrain.",
      best_for: "Fan WC",
    },
  ],

  vibeCards: [
    {
      title: "Gastown",
      type: "Fan zone histórico",
      typeColor: T.fjord,
      desc: "Adoquines, pubs victorianos, reloj de vapor. La afición europea llega aquí 3 horas antes del partido. El ambiente correcto.",
      tag: "Pre-partido",
    },
    {
      title: "BC Place Plaza",
      type: "Fan fest oficial",
      typeColor: T.coral,
      desc: "Abre 4 horas antes. Escenarios en vivo, pantallas gigantes, zona gastronómica. El más grande de las sedes canadienses.",
      tag: "Familia OK",
    },
    {
      title: "False Creek Waterfront",
      type: "Ruta caminable",
      typeColor: T.sage,
      desc: "Desde Granville Island hasta Yaletown con el BC Place al fondo. Pre-partido para pareja o familia. Sin multitudes.",
      tag: "Tranquilo",
    },
    {
      title: "Steamworks Brew Pub",
      type: "Bar",
      typeColor: T.pine,
      desc: "El punto de reunión más consistente de la ciudad. Tres pisos, cerveza artesanal, pantallas. A 15 min del estadio caminando.",
      tag: "Punto de encuentro",
    },
    {
      title: "Kensington Market",
      type: "Barrio",
      typeColor: T.fjord,
      desc: "El barrio más multicultural de Vancouver. Comida de 50 países en 5 cuadras. Pre-partido para los que quieren algo diferente.",
      tag: "Cultural",
    },
    {
      title: "Coal Harbour",
      type: "Marina",
      typeColor: T.sage,
      desc: "Vista a los hidroaviones y las montañas North Shore. Bares con terraza. El plan tranquilo para quien no quiere el caos.",
      tag: "Pareja",
    },
  ],

  logistics: {
    transport: [
      {
        icon: "✈",
        title: "Llegar a Vancouver",
        text: "Escala en LAX o SFO desde CDMX. 7–9 horas total. eTA canadiense obligatoria ($7 CAD — tramítala en línea con 6 semanas de anticipación).",
      },
      {
        icon: "🚇",
        title: "Del aeropuerto a la ciudad",
        text: "Canada Line SkyTrain desde YVR. $11.25 CAD. 26 minutos hasta Waterfront Station. Elevadores en todas las estaciones.",
      },
      {
        icon: "🏟",
        title: "Al estadio el día del partido",
        text: "SkyTrain hasta Stadium–Chinatown Station. 2 minutos caminando al BC Place. La opción correcta — no uses Uber.",
      },
      {
        icon: "⚠️",
        title: "Error crítico a evitar",
        text: "No uses la estación Stadium-Chinatown en día de partido — colapsa. Baja en Waterfront y camina 18 min por el puerto. Evitas la congestión y llegas por el waterfront.",
        isWarning: true,
      },
    ],
    timing: "Llega al estadio 90 minutos antes. El ambiente exterior del BC Place vale la espera.",
    cost: "Presupuesto diario estimado: $120–200 CAD (hotel económico, comida casual, transporte).",
  },

  lagomTips: [
    "Reserva el hotel para el partido de Canadá (17 Jun) con meses de anticipación — es el evento del año.",
    "El SkyTrain es tu mejor amigo. La tarjeta PRESTO ($3.30 CAD por viaje) funciona en todo el sistema.",
    "Vancouver en junio tiene los días más largos del año — sol hasta las 9:30pm. Planifica actividades tarde.",
    "El ferry a Bowen Island ($13 CAD) es la experiencia más barata y memorable del torneo.",
  ],

  matchDayChecklist: [
    "eTA o visa canadiense válida",
    "Boleto del partido (digital, en la app de FIFA)",
    "Tarjeta PRESTO cargada para el SkyTrain",
    "Ropa en capas — Vancouver puede estar fresca de noche",
    "Paraguas ligero — el tiempo puede cambiar",
    "Efectivo CAD para puestos del mercado",
    "Reserva de hotel confirmada",
    "Número de emergencia: 911 (gratis desde cualquier teléfono)",
  ],

  didYouKnow: "BC Place tiene el récord del techo retráctil más grande del mundo cuando fue inaugurado en 1983. El estadio completo puede llenarse o vaciarse en 10 minutos.",

  manifesto: {
    lagomNote: "Vancouver es cara. Un café specialty cuesta $7 CAD, un hotel decente empieza en $180 CAD. Presupuesta con honestidad — pero lo que obtienes a cambio es el destino más bello del torneo.",
  },

  closingNote: "Llegas por el fútbol. Te quedas por el resto. Y al volver, la pregunta no es '¿fue bueno?' — es '¿cuándo regreso?'",
  plannerCTA: "Planear mi viaje a Vancouver",
};

const GUIDES = { van: VANCOUVER };

// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATIONS — abstract SVG, one per city
// ─────────────────────────────────────────────────────────────────────────────
const CityIllustration = ({ city }) => {
  // Abstract geometric illustration — each city gets unique geometry
  const illustrations = {
    van: (
      // Mountains + water + city silhouette
      <svg viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
        <rect width="240" height="120" fill={T.sageLight} rx={RADIUS} />
        {/* Water */}
        <rect x="0" y="80" width="240" height="40" fill={T.fjordLight} rx="0" />
        {/* Mountains */}
        <polygon points="20,80 60,30 100,80" fill={T.sage} opacity="0.6" />
        <polygon points="60,80 100,20 140,80" fill={T.pine} opacity="0.45" />
        <polygon points="100,80 145,35 190,80" fill={T.sage} opacity="0.55" />
        {/* Snow caps */}
        <polygon points="100,20 112,38 88,38" fill={T.white} opacity="0.8" />
        <polygon points="60,30 70,46 50,46" fill={T.white} opacity="0.6" />
        {/* City skyline */}
        <rect x="20" y="62" width="6" height="18" fill={T.pine} opacity="0.25" rx={1} />
        <rect x="30" y="55" width="8" height="25" fill={T.pine} opacity="0.3" rx={1} />
        <rect x="42" y="60" width="5" height="20" fill={T.pine} opacity="0.2" rx={1} />
        {/* Stadium dome hint */}
        <ellipse cx="195" cy="75" rx="24" ry="10" fill={T.fjord} opacity="0.2" />
        <rect x="171" y="65" width="48" height="10" fill={T.fjord} opacity="0.15" rx={2} />
        {/* Flag */}
        <text x="214" y="60" fontSize="18" textAnchor="middle">🇨🇦</text>
      </svg>
    ),
  };
  return illustrations[city] || illustrations["van"];
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED CARD SHELL — base for all cards
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {}, onClick, hover = false }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: T.white,
        border: `1px solid ${T.sandDark}`,
        borderRadius: RADIUS,
        boxShadow: hovered ? "0 3px 12px rgba(28,28,26,0.09)" : CARD_SHADOW,
        transition: "box-shadow 0.18s, transform 0.18s",
        transform: hovered ? "translateY(-1px)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE HERO — aligned with regular guide hero
// ─────────────────────────────────────────────────────────────────────────────
const GuideHero = ({ guide }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: 40,
    alignItems: "center",
    padding: "48px 0 40px",
    borderBottom: `1px solid ${T.sandDark}`,
    marginBottom: 40,
  }}>
    <div>
      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>{guide.flag}</span>
        <Label color={T.inkFaint}>{guide.country} · {guide.state}</Label>
        <span style={{ color: T.sandDark }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.name}</Label>
      </div>

      {/* City name */}
      <h1 style={{
        ...df("clamp(44px,6vw,72px)", 900, "italic"),
        color: T.pine,
        lineHeight: 0.95,
        letterSpacing: "-0.03em",
        marginBottom: 20,
      }}>
        {guide.city}
      </h1>

      {/* Editorial description */}
      <p style={{
        ...uf(16, 400),
        color: T.inkMid,
        lineHeight: 1.7,
        maxWidth: 480,
        marginBottom: 24,
      }}>
        {guide.description}
      </p>

      {/* Tag pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {guide.tags.map(tag => (
          <span key={tag} style={{
            ...uf(11, 600),
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.pine,
            background: T.sageLight,
            border: `1px solid ${T.sage}30`,
            padding: "5px 12px",
            borderRadius: 40,
          }}>
            {tag}
          </span>
        ))}
        {/* Match count badge */}
        <span style={{
          ...uf(11, 600),
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: T.matchGold,
          background: T.matchGoldLight,
          border: `1px solid ${T.matchGold}30`,
          padding: "5px 12px",
          borderRadius: 40,
        }}>
          ⚽ {guide.matches.length} partidos
        </span>
      </div>

      {/* Score row */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display: "flex", gap: 2 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i <= s.value ? T.sage : T.sandDark }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Illustration */}
    <div style={{ height: 200, borderRadius: RADIUS, overflow: "hidden" }}>
      <CityIllustration city={guide.id} />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MATCH CARD — replaces dense match table
// ─────────────────────────────────────────────────────────────────────────────
const MatchCard = ({ match, onPlanAround }) => {
  const bgColor = match.highlight ? T.matchGoldLight : T.sandLight;
  const borderColor = match.highlight ? `${T.matchGold}50` : T.sandDark;
  const accentBar = match.highlight ? T.matchGold : T.sandDark;

  return (
    <Card style={{ overflow: "hidden", borderColor }}>
      {/* Accent bar top */}
      <div style={{ height: 3, background: accentBar }} />

      <div style={{ padding: "20px 24px" }}>
        {/* Date row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "center", minWidth: 44, padding: "6px 10px", background: T.sand, borderRadius: 6 }}>
              <div style={{ ...uf(9, 600), letterSpacing: "0.12em", textTransform: "uppercase", color: T.inkFaint }}>{match.day}</div>
              <div style={{ ...df(18, 700), color: T.pine, lineHeight: 1.1 }}>{match.date.split(" ")[0]}</div>
              <div style={{ ...uf(9, 600), color: T.inkFaint }}>{match.date.split(" ")[1]}</div>
            </div>
            <div>
              <div style={{ ...uf(11, 600), color: T.inkFaint, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                {match.stadium}
              </div>
              <div style={{ ...uf(12, 500), color: T.inkFaint }}>{match.time} hs local</div>
            </div>
          </div>

          {/* Tag */}
          {match.tag && (
            <span style={{
              ...uf(10, 700),
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: match.highlight ? T.matchGold : T.fjord,
              background: match.highlight ? T.matchGoldLight : T.fjordLight,
              border: `1px solid ${match.highlight ? T.matchGold : T.fjord}40`,
              padding: "4px 10px",
              borderRadius: 40,
            }}>
              {match.tag}
            </span>
          )}
        </div>

        {/* Teams */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "16px 0", borderTop: `1px solid ${T.sandDark}`, borderBottom: `1px solid ${T.sandDark}`, marginBottom: 16 }}>
          {/* Team A */}
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ ...df(16, 700), color: T.ink, marginBottom: 2 }}>{match.teams[0].name}</div>
            <div style={{ fontSize: 26 }}>{match.teams[0].flag}</div>
          </div>

          <div style={{ ...uf(13, 600), color: T.inkFaint, letterSpacing: "0.12em", padding: "6px 14px", background: T.sand, borderRadius: 6 }}>
            vs
          </div>

          {/* Team B */}
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ ...df(16, 700), color: T.ink, marginBottom: 2 }}>{match.teams[1].name}</div>
            <div style={{ fontSize: 26 }}>{match.teams[1].flag}</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onPlanAround && onPlanAround(match)}
          style={{
            width: "100%",
            padding: "10px",
            background: "transparent",
            border: `1px solid ${T.sandDark}`,
            borderRadius: RADIUS - 2,
            ...uf(11, 600),
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.inkMid,
            cursor: "pointer",
            transition: "all 0.18s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.sage; e.currentTarget.style.color = T.pine; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.sandDark; e.currentTarget.style.color = T.inkMid; }}
        >
          <span style={{ fontSize: 14 }}>✦</span>
          Planear mi viaje alrededor de este partido
        </button>
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ITINERARY ACCORDION — match-day aware
// ─────────────────────────────────────────────────────────────────────────────
const ItineraryDay = ({ day, matchMap }) => {
  const [open, setOpen] = useState(day.isMatchDay); // match days open by default
  const match = day.matchRef ? matchMap[day.matchRef] : null;

  return (
    <Card
      style={{ overflow: "hidden", borderColor: day.isMatchDay ? `${T.matchGold}50` : T.sandDark }}
      hover
    >
      {/* Match day accent */}
      {day.isMatchDay && <div style={{ height: 3, background: T.matchGold }} />}

      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Day number */}
        <div style={{
          width: 36, height: 36,
          background: day.isMatchDay ? T.matchGold : T.sageLight,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ ...uf(13, 700), color: day.isMatchDay ? T.white : T.pine }}>{day.day}</span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ ...df(16, 700), color: T.pine }}>{day.title}</span>
            {day.isMatchDay && (
              <span style={{
                ...uf(9, 700), letterSpacing: "0.12em", textTransform: "uppercase",
                color: T.matchGold, background: T.matchGoldLight,
                padding: "2px 8px", borderRadius: 40,
                border: `1px solid ${T.matchGold}40`,
              }}>
                Día de partido
              </span>
            )}
          </div>
          <span style={{ ...uf(12, 400), color: T.inkFaint }}>{day.subtitle}</span>
        </div>

        <div style={{
          width: 28, height: 28,
          border: `1px solid ${T.sandDark}`,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "none",
        }}>
          <span style={{ ...uf(11, 600), color: T.inkMid, lineHeight: 1 }}>↓</span>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div style={{ borderTop: `1px solid ${T.sandDark}`, padding: "4px 22px 20px" }}>
          {/* Match context if match day */}
          {match && (
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px",
              background: T.matchGoldLight,
              border: `1px solid ${T.matchGold}40`,
              borderRadius: RADIUS - 2,
              margin: "14px 0 20px",
            }}>
              <span style={{ fontSize: 18 }}>⚽</span>
              <div>
                <div style={{ ...uf(11, 700), letterSpacing: "0.1em", textTransform: "uppercase", color: T.matchGold, marginBottom: 2 }}>
                  {match.date} · {match.time}hs
                </div>
                <div style={{ ...uf(13, 600), color: T.ink }}>
                  {match.teams[0].flag} {match.teams[0].name} vs {match.teams[1].flag} {match.teams[1].name}
                </div>
              </div>
            </div>
          )}

          {/* Steps */}
          {day.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 14, paddingTop: 14, paddingBottom: i < day.steps.length - 1 ? 14 : 0, borderBottom: i < day.steps.length - 1 ? `1px solid ${T.sandDark}` : "none" }}>
              <div style={{ width: 64, flexShrink: 0, paddingTop: 2 }}>
                <span style={{ ...uf(11, 600), color: T.inkFaint, letterSpacing: "0.06em" }}>{step.time}</span>
              </div>
              <p style={{ ...uf(13, 400), color: T.inkMid, lineHeight: 1.7, margin: 0 }}>{step.text}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAY CARD — identical to regular guides
// ─────────────────────────────────────────────────────────────────────────────
const StayCard = ({ stay }) => (
  <Card hover style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ padding: "20px 20px 0" }}>
      {/* Price + best for */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ ...df(24, 700), color: T.pine, letterSpacing: "0.05em" }}>{stay.price}</span>
        <Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label>
      </div>

      <div style={{ ...df(17, 700), color: T.pine, lineHeight: 1.2, marginBottom: 4 }}>{stay.name}</div>
      <div style={{ ...uf(12, 500), color: T.inkFaint, marginBottom: 12 }}>{stay.area}</div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {stay.tags.map(tag => (
          <span key={tag} style={{ ...uf(10, 600), letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkFaint, background: T.sand, padding: "2px 8px", borderRadius: 4 }}>
            {tag}
          </span>
        ))}
      </div>

      <p style={{ ...uf(12, 400), color: T.inkMid, lineHeight: 1.6, marginBottom: 0 }}>{stay.note}</p>
    </div>

    {/* CTA */}
    <div style={{ marginTop: "auto", padding: "14px 20px", borderTop: `1px solid ${T.sandDark}` }}>
      <button style={{
        width: "100%", padding: "9px",
        background: T.pine, border: "none",
        borderRadius: RADIUS - 2,
        ...uf(10, 700), letterSpacing: "0.1em", textTransform: "uppercase",
        color: T.white, cursor: "pointer",
        transition: "opacity 0.18s",
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Ver opciones →
      </button>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE CARD — same as regular guides (used for vibe/fan zones)
// ─────────────────────────────────────────────────────────────────────────────
const ExperienceCard = ({ item }) => (
  <Card hover style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ ...uf(10, 700), letterSpacing: "0.12em", textTransform: "uppercase", color: item.typeColor, background: item.typeColor + "18", padding: "3px 9px", borderRadius: 40 }}>
        {item.type}
      </span>
      <span style={{ ...uf(10, 600), letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkFaint, background: T.sand, padding: "3px 8px", borderRadius: 40 }}>
        {item.tag}
      </span>
    </div>
    <div style={{ ...df(16, 700), color: T.pine, lineHeight: 1.2 }}>{item.title}</div>
    <p style={{ ...uf(13, 400), color: T.inkMid, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGISTICS CARD — clean, icon + text
// ─────────────────────────────────────────────────────────────────────────────
const LogisticsCard = ({ item }) => (
  <Card style={{
    display: "flex", gap: 16, padding: "16px 20px", alignItems: "flex-start",
    borderColor: item.isWarning ? `${T.coral}50` : T.sandDark,
    background: item.isWarning ? T.coralLight : T.white,
  }}>
    <div style={{
      width: 38, height: 38, flexShrink: 0,
      background: item.isWarning ? T.coral + "20" : T.sageLight,
      borderRadius: RADIUS - 2,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18,
    }}>
      {item.icon}
    </div>
    <div>
      <div style={{ ...uf(13, 700), color: item.isWarning ? T.coral : T.pine, marginBottom: 4 }}>{item.title}</div>
      <p style={{ ...uf(13, 400), color: T.inkMid, lineHeight: 1.65, margin: 0 }}>{item.text}</p>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR — identical pattern to regular guides
// ─────────────────────────────────────────────────────────────────────────────
const GuideSidebar = ({ guide, onPlan }) => {
  const [checked, setChecked] = useState({});
  const toggleCheck = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* CTA Card — primary */}
      <Card style={{ padding: "24px", background: T.pine, border: "none" }}>
        <Label color={T.sage} style={{ marginBottom: 12, display: "block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...df(18, 700, "italic"), color: T.sand, lineHeight: 1.3, marginBottom: 16 }}>
          Arma tu ruta alrededor de los partidos.
        </p>
        <button
          onClick={onPlan}
          style={{
            width: "100%", padding: "13px",
            background: T.coral, border: "none",
            borderRadius: RADIUS - 2,
            ...uf(11, 700), letterSpacing: "0.12em", textTransform: "uppercase",
            color: T.white, cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {guide.plannerCTA} →
        </button>
      </Card>

      {/* Lagom Tips */}
      <Card style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, background: T.sageLight, borderRadius: RADIUS - 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>✦</span>
          </div>
          <Label color={T.pine}>Notas Lagom</Label>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {guide.lagomTips.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 10, paddingTop: 10, paddingBottom: 10, borderBottom: i < guide.lagomTips.length - 1 ? `1px solid ${T.sandDark}` : "none" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.sage, flexShrink: 0, marginTop: 7 }} />
              <p style={{ ...uf(12, 400), color: T.inkMid, lineHeight: 1.65, margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Match-day checklist */}
      <Card style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, background: T.matchGoldLight, borderRadius: RADIUS - 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>☑</span>
          </div>
          <Label color={T.pine}>Checklist día de partido</Label>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {guide.matchDayChecklist.map((item, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "8px 0",
                borderTop: i > 0 ? `1px solid ${T.sandDark}` : "none",
                background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{
                width: 16, height: 16, flexShrink: 0, marginTop: 2,
                border: `1.5px solid ${checked[i] ? T.sage : T.sandDark}`,
                borderRadius: 4,
                background: checked[i] ? T.sage : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}>
                {checked[i] && <span style={{ color: T.white, fontSize: 10, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ ...uf(12, 400), color: checked[i] ? T.inkFaint : T.inkMid, lineHeight: 1.5, textDecoration: checked[i] ? "line-through" : "none", transition: "all 0.15s" }}>
                {item}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Did you know */}
      <Card style={{ padding: "18px 20px", background: T.fjordLight, borderColor: `${T.fjord}30` }}>
        <Label color={T.fjord} style={{ marginBottom: 8, display: "block" }}>¿Sabías que?</Label>
        <p style={{ ...uf(13, 400), color: T.fjord, lineHeight: 1.65, margin: 0 }}>{guide.didYouKnow}</p>
      </Card>

      {/* AI optimize */}
      <Card style={{ padding: "16px 20px", borderStyle: "dashed" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>✦</span>
          <div>
            <div style={{ ...uf(12, 700), color: T.pine, marginBottom: 4 }}>Optimizar itinerario con IA</div>
            <p style={{ ...uf(12, 400), color: T.inkMid, lineHeight: 1.6, margin: "0 0 10px" }}>
              Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.
            </p>
            <button
              onClick={onPlan}
              style={{
                ...uf(10, 700), letterSpacing: "0.1em", textTransform: "uppercase",
                color: T.pine, background: "none", border: `1px solid ${T.pine}`,
                borderRadius: RADIUS - 2, padding: "7px 14px", cursor: "pointer",
              }}
            >
              Optimizar ruta →
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER — consistent across all sections
// ─────────────────────────────────────────────────────────────────────────────
const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
      <span style={{ ...uf(10, 700), letterSpacing: "0.18em", textTransform: "uppercase", color: T.coral }}>
        {number}
      </span>
      <div style={{ flex: 1, height: 1, background: T.sandDark }} />
    </div>
    <h2 style={{ ...df(26, 700, "italic"), color: T.pine, lineHeight: 1.1, marginBottom: subtitle ? 6 : 0 }}>
      {title}
    </h2>
    {subtitle && (
      <p style={{ ...uf(14, 400), color: T.inkMid, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>{subtitle}</p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STICKY NAV — minimal, aligned with regular guides
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "matches",    label: "Partidos" },
  { id: "itinerary",  label: "Itinerario" },
  { id: "stays",      label: "Dónde dormir" },
  { id: "vibe",       label: "Ambiente" },
  { id: "logistics",  label: "Logística" },
];

const StickyNav = ({ active, onNavigate, city, onBack }) => (
  <div style={{
    position: "sticky", top: 0, zIndex: 40,
    background: `${T.sand}F2`,
    backdropFilter: "blur(16px)",
    borderBottom: `1px solid ${T.sandDark}`,
    height: 50,
    display: "flex", alignItems: "center",
    padding: "0 40px",
    gap: 0,
    overflowX: "auto",
  }}>
    <button onClick={onBack} style={{ ...uf(11, 500), color: T.inkFaint, background: "none", border: "none", cursor: "pointer", padding: "0 12px 0 0", marginRight: 12, borderRight: `1px solid ${T.sandDark}`, whiteSpace: "nowrap", letterSpacing: "0.06em" }}>
      ← Guías
    </button>
    <span style={{ ...df(14, 700, "italic"), color: T.pine, marginRight: 20, whiteSpace: "nowrap" }}>
      {city}
    </span>
    <div style={{ width: 1, height: 20, background: T.sandDark, marginRight: 4 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{
        ...uf(11, active === item.id ? 700 : 500),
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: active === item.id ? T.pine : T.inkFaint,
        background: "none", border: "none",
        padding: "0 14px", height: "100%",
        cursor: "pointer",
        borderBottom: `2px solid ${active === item.id ? T.coral : "transparent"}`,
        transition: "all 0.18s",
        whiteSpace: "nowrap", flexShrink: 0,
      }}>
        {item.label}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FOOD SECTION — inline list, same as regular guides
// ─────────────────────────────────────────────────────────────────────────────
const FoodList = ({ food }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {food.map((f, i) => (
      <div key={i} style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        alignItems: "center",
        gap: 16,
        padding: "14px 0",
        borderBottom: i < food.length - 1 ? `1px solid ${T.sandDark}` : "none",
      }}>
        <div>
          <span style={{ ...uf(14, 600), color: T.pine }}>{f.dish}</span>
          <span style={{ ...uf(12, 400), color: T.inkFaint, marginLeft: 10 }}>— {f.where}</span>
        </div>
        <Label bg={T.sageLight} color={T.sage}>{f.type}</Label>
        <span style={{ ...uf(12, 500), color: T.inkFaint, textAlign: "right" }}>{f.price}</span>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CLOSING NOTE
// ─────────────────────────────────────────────────────────────────────────────
const ClosingNote = ({ note, signature }) => (
  <div style={{ padding: "40px 0 56px" }}>
    <div style={{ width: 40, height: 3, background: T.coral, marginBottom: 24 }} />
    <blockquote style={{ ...df(22, 400, "italic"), color: T.pine, lineHeight: 1.65, margin: "0 0 16px", maxWidth: 580 }}>
      "{note}"
    </blockquote>
    <Label color={T.inkFaint}>{signature}</Label>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE DETAIL PAGE — main layout
// ─────────────────────────────────────────────────────────────────────────────
const GuideDetail = ({ guide, onBack, onPlan }) => {
  const [activeSection, setActiveSection] = useState("matches");

  // Build match lookup for itinerary
  const matchMap = Object.fromEntries(guide.matches.map(m => [m.id, m]));

  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(item.id); },
        { rootMargin: "-30% 0px -65% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [guide]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <StickyNav active={activeSection} onNavigate={scrollTo} city={guide.city} onBack={onBack} />

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>

        {/* HERO */}
        <GuideHero guide={guide} />

        {/* TWO-COLUMN LAYOUT — main + sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 48, alignItems: "flex-start" }}>

          {/* ── MAIN COLUMN ── */}
          <div>

            {/* SECTION 1 — MATCHES */}
            <section id="matches" style={{ marginBottom: 56, scrollMarginTop: 64 }}>
              <SectionHeader
                number="01"
                title="Tus partidos"
                subtitle="Tres partidos en BC Place. El de Canadá el 17 de junio es el evento del año en la ciudad."
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {guide.matches.map(match => (
                  <MatchCard key={match.id} match={match} onPlanAround={onPlan} />
                ))}
              </div>
            </section>

            {/* SECTION 2 — ITINERARY */}
            <section id="itinerary" style={{ marginBottom: 56, scrollMarginTop: 64 }}>
              <SectionHeader
                number="02"
                title="Ruta de 5 días"
                subtitle="Los días de partido están expandidos. Ajusta según tus fechas."
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {guide.itinerary.map(day => (
                  <ItineraryDay key={day.day} day={day} matchMap={matchMap} />
                ))}
              </div>
            </section>

            {/* SECTION 3 — STAYS */}
            <section id="stays" style={{ marginBottom: 56, scrollMarginTop: 64 }}>
              <SectionHeader
                number="03"
                title="Dónde dormir"
                subtitle="Cinco opciones por presupuesto y estilo de viaje."
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {guide.stays.map(stay => (
                  <StayCard key={stay.name} stay={stay} />
                ))}
              </div>
            </section>

            {/* SECTION 4 — VIBE */}
            <section id="vibe" style={{ marginBottom: 56, scrollMarginTop: 64 }}>
              <SectionHeader
                number="04"
                title="Siente el ambiente"
                subtitle="Dónde se vive el Mundial fuera del estadio — fan zones, barrios, bares."
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {guide.vibeCards.map(item => (
                  <ExperienceCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            {/* SECTION 5 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom: 56, scrollMarginTop: 64 }}>
              <SectionHeader
                number="05"
                title="Llegar al estadio"
                subtitle="Transporte, tiempos y el único error que no puedes cometer."
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {guide.logistics.transport.map((item, i) => (
                  <LogisticsCard key={i} item={item} />
                ))}
              </div>

              {/* Timing + cost pills */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { icon: "⏱", text: guide.logistics.timing },
                  { icon: "💰", text: guide.logistics.cost },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: T.sandLight, border: `1px solid ${T.sandDark}`, borderRadius: RADIUS, flex: 1, minWidth: 220 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    <p style={{ ...uf(12, 400), color: T.inkMid, lineHeight: 1.6, margin: 0 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CLOSING */}
            <ClosingNote note={guide.closingNote} signature="Lagomplan · Guía de campo, Mundial 2026" />
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position: "sticky", top: 64, alignSelf: "flex-start", paddingBottom: 40 }}>
            <GuideSidebar guide={guide} onPlan={onPlan} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PERSONA DISPLAY CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const PERSONAS_CFG = {
  roberto:   { label:"Fan WC",  emoji:"⚽", color:T.coral,  bg:T.coralLight },
  valentina: { label:"Familia", emoji:"👨‍👩‍👧", color:"#1A6B5A", bg:"#D8EEE9"   },
  andrea:    { label:"Pareja",  emoji:"💑", color:T.fjord,  bg:T.fjordLight },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROSTER — rich display data for all 16 cities, with per-city accent color
// ─────────────────────────────────────────────────────────────────────────────
const ROSTER = [
  {
    id:"cdmx", city:"Ciudad de México", short:"CDX", country:"México", flag:"🇲🇽", region:"mx",
    accent:"#1A6B5A", persona:"roberto", stadium:"Estadio Azteca", ready:true,
    tagline:"El Azteca no necesita presentación. Lo que sí necesita, y mucho, es una estrategia de transporte.",
    intro:"Roberto, esto es para ti. El Azteca fue tuyo antes de que nacieras — y ahora va a ser tuyo de nuevo, en el Mundial más importante desde el 86.",
    matches:[
      {date:"Jue 11 Jun", teamA:"México",        flagA:"🇲🇽", teamB:"Sudáfrica",    flagB:"🇿🇦"},
      {date:"Mié 17 Jun", teamA:"Uzbekistán",    flagA:"🇺🇿", teamB:"Colombia",     flagB:"🇨🇴"},
      {date:"Mié 24 Jun", teamA:"Rep. Checa",    flagA:"🇨🇿", teamB:"México",       flagB:"🇲🇽"},
    ],
  },
  {
    id:"gdl", city:"Guadalajara", short:"GDL", country:"México", flag:"🇲🇽", region:"mx",
    accent:"#8B2635", persona:"valentina", stadium:"Estadio Akron", ready:true,
    tagline:"Aquí no se pregunta de qué equipo eres. Se nota antes de que abras la boca.",
    intro:"Valentina, este es tu partido. Guadalajara es la ciudad más amable de México para viajar con bebé — barrios tranquilos, comida extraordinaria, mucho espacio.",
    matches:[
      {date:"Jue 11 Jun", teamA:"Corea del Sur", flagA:"🇰🇷", teamB:"Rep. Checa",   flagB:"🇨🇿"},
      {date:"Jue 18 Jun", teamA:"México",        flagA:"🇲🇽", teamB:"Corea del Sur",flagB:"🇰🇷"},
      {date:"Mar 23 Jun", teamA:"Colombia",      flagA:"🇨🇴", teamB:"RD Congo",     flagB:"🇨🇩"},
    ],
  },
  {
    id:"mty", city:"Monterrey", short:"MTY", country:"México", flag:"🇲🇽", region:"mx",
    accent:"#2D4F6C", persona:"andrea", stadium:"Estadio BBVA", ready:true,
    tagline:"La ciudad más trabajadora de México recibe el Mundial con la misma actitud con la que construyó sus industrias: sin exceso de ornamento.",
    intro:"Andrea, Monterrey va a sorprenderte. El estadio BBVA es probablemente el más fotogénico del torneo. Y la escena de restaurantes se convirtió en referencia nacional.",
    matches:[
      {date:"Dom 14 Jun", teamA:"Túnez",         flagA:"🇹🇳", teamB:"Rep. UEFA B",  flagB:""},
      {date:"Vie 19 Jun", teamA:"Túnez",         flagA:"🇹🇳", teamB:"Japón",        flagB:"🇯🇵"},
      {date:"Mié 24 Jun", teamA:"Sudáfrica",     flagA:"🇿🇦", teamB:"Corea del Sur",flagB:"🇰🇷"},
    ],
  },
  {
    id:"la", city:"Los Ángeles", short:"LA", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#C4622A", persona:"roberto", stadium:"SoFi Stadium", ready:true,
    tagline:"El estadio más caro jamás construido está a tres millas del aeropuerto más cercano a cualquier estadio mundialista. En Los Ángeles, hasta las distancias son de película.",
    intro:"Roberto, LA es tu partido de visita que se siente de local. Hay más afición mexicana en Los Ángeles que en Guadalajara. El SoFi Stadium va a parecer el Azteca.",
    matches:[
      {date:"Vie 12 Jun", teamA:"EUA",           flagA:"🇺🇸", teamB:"Paraguay",     flagB:"🇵🇾"},
      {date:"Dom 15 Jun", teamA:"Irán",          flagA:"🇮🇷", teamB:"Nueva Zelanda",flagB:"🇳🇿"},
      {date:"Jue 18 Jun", teamA:"Suiza",         flagA:"🇨🇭", teamB:"Bosnia",       flagB:"🇧🇦"},
    ],
  },
  {
    id:"mia", city:"Miami", short:"MIA", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#0E8B8B", persona:"andrea", stadium:"Hard Rock Stadium", ready:true,
    tagline:"El calor en Miami no es el clima. Es el estado de ánimo permanente de la ciudad.",
    intro:"Andrea, Miami para una pareja que sabe viajar es el destino del torneo. No porque el fútbol sea lo principal — sino porque todo lo que rodea el partido es extraordinario.",
    matches:[
      {date:"Lun 15 Jun", teamA:"Arabia Saudita",flagA:"🇸🇦", teamB:"Uruguay",      flagB:"🇺🇾"},
      {date:"Dom 21 Jun", teamA:"Uruguay",       flagA:"🇺🇾", teamB:"Cabo Verde",   flagB:"🇨🇻"},
      {date:"Mié 24 Jun", teamA:"Escocia",       flagA:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", teamB:"Brasil",       flagB:"🇧🇷"},
    ],
  },
  {
    id:"nyc", city:"Nueva York", short:"NYC", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#1A3A5C", persona:"roberto", stadium:"MetLife Stadium", ready:true,
    tagline:"La ciudad que alberga la Final no necesita explicar por qué. Solo necesita que sepas llegar al estadio.",
    intro:"Roberto, escúchame. La final del Mundial 2026 se juega en MetLife Stadium. Si Argentina llega — y hay buenas razones para creerlo — el partido más importante del siglo se va a jugar a 30 minutos de Manhattan.",
    matches:[
      {date:"Sáb 13 Jun", teamA:"Brasil",        flagA:"🇧🇷", teamB:"Marruecos",    flagB:"🇲🇦"},
      {date:"Mar 16 Jun", teamA:"Francia",       flagA:"🇫🇷", teamB:"Senegal",      flagB:"🇸🇳"},
      {date:"Lun 22 Jun", teamA:"Noruega",       flagA:"🇳🇴", teamB:"Senegal",      flagB:"🇸🇳"},
    ],
  },
  {
    id:"dal", city:"Dallas", short:"DAL", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#8B2635", persona:"andrea", stadium:"AT&T Stadium", ready:true,
    tagline:"El estadio más grande del torneo está en Arlington. No en Dallas. Y no hay metro que llegue ahí.",
    intro:"Andrea, Dallas no es el destino obvio — y esa es la razón para ir. El AT&T Stadium es la experiencia deportiva más espectacular del torneo: pantalla de 60 metros, 80 mil personas.",
    matches:[
      {date:"Jue 11 Jun", teamA:"México",        flagA:"🇲🇽", teamB:"Sudáfrica",    flagB:"🇿🇦"},
      {date:"Mié 18 Jun", teamA:"España",        flagA:"🇪🇸", teamB:"Brasil",       flagB:"🇧🇷"},
      {date:"Jue 26 Jun", teamA:"México",        flagA:"🇲🇽", teamB:"Uruguay",      flagB:"🇺🇾"},
    ],
  },
  {
    id:"sf", city:"San Francisco", short:"SF", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#4A6B9E", persona:"roberto", stadium:"Levi's Stadium", ready:true,
    tagline:"Brasil y Alemania juegan aquí. Y México podría avanzar a octavos aquí también.",
    intro:"Roberto, Mission District es el barrio latino más auténtico de EE.UU. en la costa oeste. Murales de Diego Rivera en las paredes, taquería El Farolito abierta hasta las 3am.",
    matches:[
      {date:"Dom 14 Jun", teamA:"Países Bajos",  flagA:"🇳🇱", teamB:"Japón",        flagB:"🇯🇵"},
      {date:"Mar 17 Jun", teamA:"Inglaterra",    flagA:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", teamB:"Croacia",      flagB:"🇭🇷"},
      {date:"Lun 22 Jun", teamA:"Argentina",     flagA:"🇦🇷", teamB:"Austria",      flagB:"🇦🇹"},
    ],
  },
  {
    id:"hou", city:"Houston", short:"HOU", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#6B4226", persona:"valentina", stadium:"NRG Stadium", ready:true,
    tagline:"La ciudad más diversa de Texas recibe al torneo más diverso de la historia. La aritmética tiene sentido.",
    intro:"Valentina, Houston es probablemente la sede más amable del torneo para viajar con bebé. La ciudad es enorme y tiene todo — barrios tranquilos, mucho espacio.",
    matches:[
      {date:"Dom 14 Jun", teamA:"Alemania",      flagA:"🇩🇪", teamB:"Curazao",      flagB:"🇨🇼"},
      {date:"Mié 17 Jun", teamA:"Portugal",      flagA:"🇵🇹", teamB:"Playoff IC-1", flagB:""},
      {date:"Sáb 20 Jun", teamA:"Países Bajos",  flagA:"🇳🇱", teamB:"Rep. UEFA B",  flagB:""},
    ],
  },
  {
    id:"sea", city:"Seattle", short:"SEA", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#2D6E4E", persona:"andrea", stadium:"Lumen Field", ready:true,
    tagline:"La única sede del torneo donde el estadio está a diez minutos caminando del mercado de pescado más famoso de Norteamérica. Aprovéchalo antes del partido.",
    intro:"Andrea, Seattle es el destino del torneo para la pareja que quiere hacer algo diferente de verdad. No es la ciudad obvia — y esa es exactamente el punto.",
    matches:[
      {date:"Dom 15 Jun", teamA:"Bélgica",       flagA:"🇧🇪", teamB:"Egipto",       flagB:"🇪🇬"},
      {date:"Vie 19 Jun", teamA:"EUA",           flagA:"🇺🇸", teamB:"Australia",    flagB:"🇦🇺"},
      {date:"Mié 24 Jun", teamA:"Bosnia y Herz.", flagA:"🇧🇦", teamB:"Qatar",       flagB:"🇶🇦"},
    ],
  },
  {
    id:"kc", city:"Kansas City", short:"KC", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#7B3F8C", persona:"valentina", stadium:"Arrowhead Stadium", ready:true,
    tagline:"El estadio más ruidoso del mundo al aire libre recibe al campeón defensor. Trae tapones para los oídos — y úsalos solo si los necesitas.",
    intro:"Valentina, Kansas City es probablemente la sede más amable del torneo para familia con bebé: precios razonables, espacios amplios, sin la densidad agobiante de NYC o LA.",
    matches:[
      {date:"Mar 16 Jun", teamA:"Argentina",     flagA:"🇦🇷", teamB:"Argelia",      flagB:"🇩🇿"},
      {date:"Sáb 20 Jun", teamA:"Ecuador",       flagA:"🇪🇨", teamB:"Curazao",      flagB:"🇨🇼"},
      {date:"Jue 25 Jun", teamA:"Túnez",         flagA:"🇹🇳", teamB:"Países Bajos", flagB:"🇳🇱"},
    ],
  },
  {
    id:"atl", city:"Atlanta", short:"ATL", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#B5451B", persona:"roberto", stadium:"Mercedes-Benz Stadium", ready:true,
    tagline:"El único estadio mundialista con techo retráctil y aire acondicionado en Estados Unidos. En julio en Georgia, eso no es un lujo — es una política de salud pública.",
    intro:"Roberto, Atlanta tiene dos cosas que no combinan en ninguna otra sede del torneo: el estadio más moderno del mundo y una de las comunidades latinoamericanas de crecimiento más rápido de EE.UU.",
    matches:[
      {date:"Lun 15 Jun", teamA:"España",        flagA:"🇪🇸", teamB:"Cabo Verde",   flagB:"🇨🇻"},
      {date:"Jue 18 Jun", teamA:"Sudáfrica",     flagA:"🇿🇦", teamB:"Rep. UEFA D",  flagB:""},
      {date:"Dom 21 Jun", teamA:"España",        flagA:"🇪🇸", teamB:"Arabia Saudita",flagB:"🇸🇦"},
    ],
  },
  {
    id:"phi", city:"Filadelfia", short:"PHI", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#2A5F8F", persona:"roberto", stadium:"Lincoln Financial Field", ready:true,
    tagline:"El 4 de julio de 2026, Filadelfia celebra 250 años de independencia y un partido de Ronda de 16. El orden de las prioridades lo decide cada quien.",
    intro:"Roberto, la afición local ya vive el fútbol desde dentro. La comunidad mexicana de South Philly lleva 30 años convirtiendo el barrio en un pedazo de México.",
    matches:[
      {date:"Dom 14 Jun", teamA:"Costa de Marfil",flagA:"🇨🇮",teamB:"Ecuador",      flagB:"🇪🇨"},
      {date:"Vie 19 Jun", teamA:"Brasil",        flagA:"🇧🇷", teamB:"Haití",        flagB:"🇭🇹"},
      {date:"Lun 22 Jun", teamA:"Francia",       flagA:"🇫🇷", teamB:"Playoff IC-2", flagB:""},
    ],
  },
  {
    id:"bos", city:"Boston", short:"BOS", country:"EE.UU.", flag:"🇺🇸", region:"us",
    accent:"#8B1A1A", persona:"andrea", stadium:"Gillette Stadium", ready:true,
    tagline:"El estadio no está en Boston. El partido sí. Esa distinción vale un tren.",
    intro:"Andrea, Boston es la ciudad del torneo más parecida a Europa sin salir de América del Norte. Y el 27 de junio, Argentina vs Brasil en Gillette Stadium.",
    matches:[
      {date:"Sáb 13 Jun", teamA:"Haití",         flagA:"🇭🇹", teamB:"Escocia",      flagB:"🏴󠁧󠁢󠁳󠁣󠁴󠁿"},
      {date:"Mar 16 Jun", teamA:"Playoff IC-2",  flagA:"",    teamB:"Noruega",      flagB:"🇳🇴"},
      {date:"Vie 19 Jun", teamA:"Escocia",       flagA:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", teamB:"Marruecos",    flagB:"🇲🇦"},
    ],
  },
  {
    id:"tor", city:"Toronto", short:"TOR", country:"Canadá", flag:"🇨🇦", region:"ca",
    accent:"#C41E3A", persona:"andrea", stadium:"BMO Field", ready:true,
    tagline:"El estadio más pequeño del torneo también es el que pone al fanático más cerca del campo. No es una coincidencia.",
    intro:"Andrea, Toronto no te pide que la ames. Solo te da 200 idiomas, 50 cocinas, y un ferry al atardecer — y espera a ver qué haces con eso.",
    matches:[
      {date:"Vie 12 Jun", teamA:"Canadá",        flagA:"🇨🇦", teamB:"Bosnia y Herz.",flagB:"🇧🇦"},
      {date:"Mié 17 Jun", teamA:"Ghana",         flagA:"🇬🇭", teamB:"Panamá",       flagB:"🇵🇦"},
      {date:"Sáb 20 Jun", teamA:"Alemania",      flagA:"🇩🇪", teamB:"Costa de Marfil",flagB:"🇨🇮"},
    ],
  },
  {
    id:"van", city:"Vancouver", short:"VAN", country:"Canadá", flag:"🇨🇦", region:"ca",
    accent:"#2D4F6C", persona:"valentina", stadium:"BC Place", ready:true,
    tagline:"La única sede del torneo donde el estadio comparte el horizonte con montañas nevadas. No hace falta que sea metáfora.",
    intro:"Valentina, Vancouver con bebé en junio es un plan sorprendentemente cómodo. La ciudad está cubierta de parques, la temperatura es fresca y agradable, y tiene museos infantiles de primer nivel.",
    matches:[
      {date:"Sáb 13 Jun", teamA:"Australia",     flagA:"🇦🇺", teamB:"Türkiye",      flagB:"🇹🇷"},
      {date:"Jue 18 Jun", teamA:"Canadá",        flagA:"🇨🇦", teamB:"Qatar",        flagB:"🇶🇦"},
      {date:"Dom 21 Jun", teamA:"Nueva Zelanda", flagA:"🇳🇿", teamB:"Egipto",       flagB:"🇪🇬"},
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE INDEX — rich editorial card list
// ─────────────────────────────────────────────────────────────────────────────
const GuideIndex = ({ onOpen }) => {
  const [filter, setFilter] = useState("all");
  const [hovered, setHovered] = useState(null);

  const filtered = ROSTER.filter(g =>
    filter === "all" ? true :
    filter === "mx"  ? g.region === "mx" :
    filter === "us"  ? g.region === "us" :
    filter === "ca"  ? g.region === "ca" : true
  );

  return (
    <div style={{ background:"#fff9f3", minHeight:"100vh" }}>

      {/* PAGE HEADER */}
      <div style={{ maxWidth: 1020, margin:"0 auto", padding:"40px 32px 0" }}>

        {/* Top row: eyebrow + persona legend */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: 18, flexWrap:"wrap", gap: 10 }}>
          <span style={{ ...uf(10, 600), letterSpacing:"0.14em", textTransform:"uppercase", color: T.inkFaint }}>
            16 guías editoriales · Mundial 2026 · Completo
          </span>
          <div style={{ display:"flex", gap: 16, flexWrap:"wrap" }}>
            {Object.values(PERSONAS_CFG).map(p => (
              <div key={p.label} style={{ display:"flex", alignItems:"center", gap: 5 }}>
                <span style={{ ...uf(9, 700), letterSpacing:"0.1em", textTransform:"uppercase", color: p.color, background: p.bg, padding:"2px 8px", borderRadius: 40, flexShrink:0 }}>
                  {p.label}
                </span>
                <span style={{ ...uf(10, 400), color: T.inkFaint }}>
                  {p.label === "Fan WC"  ? "Para el que viajó por el fútbol, no por el turismo." :
                   p.label === "Familia" ? "Para la que organiza todo y necesita que funcione." :
                   "Para la pareja que quiere vivir algo, no solo verlo."}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <h1 style={{ ...df("clamp(38px,5.5vw,60px)", 900, "italic"), color: T.pine, lineHeight: 1, letterSpacing:"-0.03em", marginBottom: 14 }}>
          Guías para el fanático
        </h1>
        <p style={{ ...uf(14, 400), color: T.inkMid, lineHeight: 1.7, maxWidth: 600, marginBottom: 28 }}>
          No una guía turística. Una guía escrita desde adentro — para la pareja que quiere vivir algo, para la familia que lo va a planear todo, y para el fanático que fue por el fútbol.
        </p>

        {/* Filters */}
        <div style={{ display:"flex", gap: 6, alignItems:"center", marginBottom: 28 }}>
          <span style={{ ...uf(10, 600), letterSpacing:"0.1em", textTransform:"uppercase", color: T.inkFaint, marginRight: 4 }}>
            Filtrar:
          </span>
          {[{id:"all",label:"Todas"},{id:"mx",label:"México"},{id:"us",label:"EE.UU."},{id:"ca",label:"Canadá"}].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              ...uf(10, filter===f.id ? 700 : 500),
              letterSpacing:"0.09em", textTransform:"uppercase",
              padding:"5px 14px", borderRadius: 40,
              border:`1px solid ${filter===f.id ? T.pine : T.sandDark}`,
              background: filter===f.id ? T.pine : "transparent",
              color: filter===f.id ? T.white : T.inkMid,
              cursor:"pointer", transition:"all 0.18s",
            }}>{f.label}</button>
          ))}
          <span style={{ ...uf(11, 400), color: T.inkFaint, marginLeft: 6 }}>
            {filtered.length} guías
          </span>
        </div>
      </div>

      {/* CARDS */}
      <div style={{ maxWidth: 1020, margin:"0 auto", padding:"0 32px 80px", display:"flex", flexDirection:"column", gap: 10 }}>
        {filtered.map((item) => {
          const persona = PERSONAS_CFG[item.persona];
          const isHovered = hovered === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onOpen(item.id)}
              style={{
                background: T.white,
                border: `1px solid ${T.sandDark}`,
                borderLeft: `4px solid ${item.accent}`,
                borderRadius: RADIUS,
                boxShadow: isHovered
                  ? "0 4px 16px rgba(28,28,26,0.09)"
                  : "0 1px 4px rgba(28,28,26,0.05)",
                transition: "box-shadow 0.2s, transform 0.2s",
                transform: isHovered ? "translateY(-1px)" : "none",
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: "1fr 204px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Ghost abbreviation */}
              <div style={{
                position:"absolute", right: 218, top:"50%",
                transform:"translateY(-50%)",
                ...df("clamp(72px,9vw,108px)", 900, "italic"),
                color: item.accent, opacity: 0.06,
                lineHeight: 1, userSelect:"none", pointerEvents:"none",
                letterSpacing:"-0.04em",
              }}>
                {item.short}
              </div>

              {/* LEFT — editorial content */}
              <div style={{ padding:"22px 28px 22px 24px", position:"relative" }}>

                {/* Eyebrow */}
                <div style={{ display:"flex", alignItems:"center", gap: 7, marginBottom: 9 }}>
                  <span style={{ fontSize: 15 }}>{item.flag}</span>
                  <span style={{
                    ...uf(9, 700), letterSpacing:"0.12em", textTransform:"uppercase",
                    color: item.accent, background: item.accent+"18",
                    padding:"2px 8px", borderRadius: 40,
                  }}>
                    {item.country}
                  </span>
                  <span style={{
                    ...uf(9, 700), letterSpacing:"0.12em", textTransform:"uppercase",
                    color: persona.color, background: persona.bg,
                    padding:"2px 8px", borderRadius: 40,
                  }}>
                    {persona.label}
                  </span>
                  <span style={{ ...uf(10, 400), color: T.inkFaint }}>{item.stadium}</span>
                </div>

                {/* City name */}
                <h2 style={{
                  ...df("clamp(26px,3.5vw,38px)", 900, "italic"),
                  color: T.pine, lineHeight: 1, letterSpacing:"-0.025em", marginBottom: 7,
                }}>
                  {item.city}
                </h2>

                {/* Tagline */}
                <p style={{ ...uf(13, 500), color: T.inkMid, lineHeight: 1.5, marginBottom: 6, maxWidth: 500 }}>
                  {item.tagline}
                </p>

                {/* Intro excerpt — 2 lines */}
                <p style={{
                  ...uf(12, 400), color: T.inkFaint, lineHeight: 1.65, maxWidth: 500, marginBottom: 18,
                  display:"-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient:"vertical", overflow:"hidden",
                }}>
                  {item.intro}
                </p>

                {/* CTAs */}
                <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
                  <button
                    onClick={e => { e.stopPropagation(); onOpen(item.id); }}
                    style={{
                      background: item.accent, border:"none", color: T.white,
                      borderRadius: 5,
                      ...uf(9, 700), letterSpacing:"0.12em", textTransform:"uppercase",
                      padding:"8px 16px", cursor:"pointer", transition:"opacity 0.18s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity="1"}
                  >
                    Planificar →
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); onOpen(item.id); }}
                    style={{
                      background:"transparent", border:"none", color: T.inkFaint,
                      cursor:"pointer", ...uf(11, 400), letterSpacing:"0.02em",
                      padding:"8px 4px", transition:"color 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color=T.pine}
                    onMouseLeave={e => e.currentTarget.style.color=T.inkFaint}
                  >
                    ver guía →
                  </button>
                </div>
              </div>

              {/* RIGHT — match panel */}
              <div style={{
                borderLeft: `1px solid ${T.sandDark}`,
                background: T.sandLight,
                padding: "20px 18px",
                display: "flex", flexDirection:"column", justifyContent:"center",
                gap: 0,
              }}>
                <span style={{
                  ...uf(9, 700), letterSpacing:"0.14em", textTransform:"uppercase",
                  color: T.inkFaint, marginBottom: 12, display:"block",
                }}>
                  Partidos
                </span>

                {item.matches.map((m, i) => (
                  <div key={i} style={{
                    paddingTop: i > 0 ? 10 : 0,
                    paddingBottom: i < item.matches.length - 1 ? 10 : 0,
                    borderBottom: i < item.matches.length - 1 ? `1px solid ${T.sandDark}` : "none",
                  }}>
                    {/* Date */}
                    <div style={{ ...uf(10, 600), color: T.inkFaint, letterSpacing:"0.08em", marginBottom: 5 }}>
                      {m.date}
                    </div>
                    {/* Team chips */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap: 4 }}>
                      <span style={{
                        ...uf(10, 600),
                        color: item.accent,
                        background: item.accent + "16",
                        border: `1px solid ${item.accent}30`,
                        padding: "2px 7px", borderRadius: 4,
                        display:"flex", alignItems:"center", gap: 3,
                      }}>
                        {m.flagA} {m.teamA}
                      </span>
                      <span style={{ ...uf(9, 400), color: T.inkFaint, alignSelf:"center" }}>vs</span>
                      <span style={{
                        ...uf(10, 600),
                        color: item.accent,
                        background: item.accent + "16",
                        border: `1px solid ${item.accent}30`,
                        padding: "2px 7px", borderRadius: 4,
                        display:"flex", alignItems:"center", gap: 3,
                      }}>
                        {m.flagB} {m.teamB}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [current, setCurrent] = useState(null);
  const guide = current ? GUIDES[current] : null;

  const open = (id) => { setCurrent(id); window.scrollTo(0, 0); };
  const back = ()    => { setCurrent(null); window.scrollTo(0, 0); };
  const plan = (matchOrNull) => {
    // Hook into planificador — pass guide.id + optional matchId as context
    console.log("Plan trip:", current, matchOrNull?.id);
    alert(`Planificador: ${current}${matchOrNull ? ` · Partido: ${matchOrNull.teams[0].name} vs ${matchOrNull.teams[1].name}` : ""}`);
  };

  return (
    <div style={{ background: current ? T.sand : "#fff9f3", minHeight: "100vh", fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Manrope:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        button { font-family: 'Manrope', sans-serif; }
        button:focus-visible { outline: 2px solid ${T.coral}; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #fff9f3; }
        ::-webkit-scrollbar-thumb { background: ${T.sandDark}; border-radius: 3px; }
      `}</style>

      {!current && (
        <header style={{ position: "sticky", top: 0, zIndex: 50, background: T.pine, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 52 }}>
          <span style={{ ...df(17, 700, "italic"), color: T.sand }}>lagomplan</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Label color={T.sage}>Guías · Mundial 2026</Label>
            <button style={{ background: T.coral, border: "none", color: T.white, ...uf(10, 700), letterSpacing: "0.1em", textTransform: "uppercase", padding: "7px 16px", borderRadius: RADIUS - 2, cursor: "pointer" }}>
              Planificador →
            </button>
          </div>
        </header>
      )}

      {current && guide
        ? <GuideDetail guide={guide} onBack={back} onPlan={plan} />
        : <GuideIndex onOpen={open} />
      }
    </div>
  );
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT BREAKDOWN — guias_wc_v3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<GuideHero />      — City name, description, tag pills, score dots, illustration.
                     Identical to regular guides. WC adds: match count badge, score row.

<MatchCard />      — NEW. Date chip + teams + stadium + tag (Local/Clave).
                     Replaces dense tables. AI hook: "Planear mi viaje alrededor de este partido".

<ItineraryDay />   — Expandable accordion, same as regular guides.
                     WC adds: isMatchDay flag (gold accent, auto-expanded), matchRef context block.

<StayCard />       — IDENTICAL to regular guides. No WC-specific changes.

<ExperienceCard /> — IDENTICAL to regular guides. Used for fan zones, bars, neighborhoods.

<LogisticsCard />  — NEW. Icon + title + text. isWarning variant (coral bg) for critical notes.
                     Replaces wall of text with scannable cards.

<GuideSidebar />   — Same structure as regular guides:
                     CTA (pine bg, coral button) + LagomTips + MatchDayChecklist + DidYouKnow + AI block.
                     Checklist is interactive (checkboxes).

<StickyNav />      — Minimal, same as regular guides. 5 nav items, coral active indicator.

<CityIllustration /> — Abstract SVG per city. Soft colors, geometric. Never photographic.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATA SCHEMA ADDITIONS vs v2 (add to each guide JSON)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

tags:            string[]   — Tag pills in hero (Football, Cultura, Gastronomía…)
headline:        string     — Short editorial hero headline
description:     string     — 2-sentence editorial description

matches[].id:    string     — For itinerary cross-reference
matches[].time:  string     — Match kickoff time
matches[].teams: { name, flag }[]  — Team objects (not string array)

itinerary:       DayItem[]  — 5-day match-aware itinerary
  .isMatchDay:   boolean    — Drives gold accent + auto-expand
  .matchRef:     string     — links to matches[].id

stays[].tags:    string[]   — Tags on StayCard (Alberca, Boutique, etc.)
stays[].best_for: string    — Audience label

vibeCards:       VibeItem[] — Fan zones / bars / neighborhoods as cards
  .typeColor:    string     — Token color for type label

logistics.transport: TransportItem[]  — Array of icon+title+text cards
logistics.timing:    string
logistics.cost:      string

lagomTips:            string[]  — Sidebar tips (4 items)
matchDayChecklist:    string[]  — Interactive sidebar checklist
didYouKnow:           string    — Sidebar factoid

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN DECISIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. matchGold (#B8860B) used SPARINGLY — only on match accents, never dominant.
   Pine/Sage/Sand remain the primary palette. The guide doesn't feel like a
   sports app because gold is < 5% of visible surface area.

2. Two-column layout (main + sticky sidebar) mirrors regular guides exactly.
   WC guides get the same information architecture, not a different product.

3. ItineraryDay auto-expands match days — subtle UX: the important days
   are visible without any user action. Non-match days start collapsed.

4. MatchCard CTA ("Planear mi viaje alrededor de este partido") passes the
   match object to the planificador. This is the primary conversion hook —
   it feels native, not marketing.

5. LogisticsCard with isWarning=true uses coral accent to visually
   distinguish critical notes (e.g. wrong station) from informational items.
   Same component, different semantic weight.

6. Checklist in sidebar is interactive — users can tick items as they prepare.
   Storage hook ready (window.storage) if needed for persistence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCALING TO 16 CITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each city needs the new schema fields added to its v2 JSON object:
  + tags, headline, description
  + matches[].id, matches[].time, matches[].teams as { name, flag }
  + itinerary (5 days)
  + stays[].tags, stays[].best_for
  + vibeCards (replaces vibe.zones + meetingPoints)
  + logistics.transport as array
  + lagomTips, matchDayChecklist, didYouKnow

No component changes needed. Add city to GUIDES registry + ROSTER.
*/
