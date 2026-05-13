import { useState, useRef } from "react";

// ─── CANONICAL DESIGN TOKENS (from production site) ──────────────────────────
const PINE   = "#0F3A33";   // Primary — nav, CTAs, headings
const SAGE   = "#6B8F86";   // Secondary — labels, muted accents
const SAND   = "#EDE7E1";   // Page background
const LIGHT  = "#F7F3EE";   // Slightly lighter — card section bg
const WHITE  = "#FFFFFF";   // Card backgrounds
const NK     = "#131313";   // Near black — primary text
const MU     = "#8A8480";   // Muted — secondary text, descriptions
const BD     = "#DDD8D2";   // Border / dividers
const SAGE_L = "#E8F0EE";   // Light sage — step badges, chips bg
const AMBER  = "#D97706";   // Stars

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { background: ${SAND}; }
  body { background: ${SAND}; color: ${NK}; font-family: 'Manrope', sans-serif; -webkit-font-smoothing: antialiased; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: 'Manrope', sans-serif; }
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }
  input, input:focus { outline: none; font-family: 'Manrope', sans-serif; }
`;

// ─── HOTEL PHOTO GRADIENTS (illustrated-sky aesthetic) ───────────────────────
const HOTEL_GRAD = {
  "Lujo":         "linear-gradient(170deg, #1a4a6e 0%, #2d7a8a 40%, #3a9a8a 70%, #2d6a5a 100%)",
  "Boutique":     "linear-gradient(170deg, #1B4D3E 0%, #2d7a5a 40%, #4a9a6a 70%, #2d5a44 100%)",
  "Familiar":     "linear-gradient(170deg, #5a3a1a 0%, #8a5a2a 40%, #b4803a 70%, #8a6030 100%)",
  "Design Hotel": "linear-gradient(170deg, #1a2a5e 0%, #2d4a8a 40%, #4a6aaa 70%, #2d3a6a 100%)",
  "Budget":       "linear-gradient(170deg, #2d4a3a 0%, #4a7a5a 40%, #6a9a7a 70%, #4a6a5a 100%)",
};

const DEST_GRAD = {
  cdmx:   "linear-gradient(170deg, #8a2a1a 0%, #c04a2a 40%, #d46a3a 70%, #b04a30 100%)",
  cancun: "linear-gradient(170deg, #0a3a5e 0%, #1a5a8a 40%, #2a7aaa 70%, #1a5a8a 100%)",
  oaxaca: "linear-gradient(170deg, #4a2a0a 0%, #7a4a1a 40%, #a06a2a 70%, #7a4a1a 100%)",
  gdl:    "linear-gradient(170deg, #5a2a0a 0%, #8a4a1a 40%, #b06a2a 70%, #8a5020 100%)",
  nyc:    "linear-gradient(170deg, #0a1020 0%, #1a2040 40%, #2a3060 70%, #1a2040 100%)",
  miami:  "linear-gradient(170deg, #0a3a2a 0%, #1a6a4a 40%, #2a8a5a 70%, #1a6a4a 100%)",
  dallas: "linear-gradient(170deg, #3a1a00 0%, #6a3a00 40%, #8a5010 70%, #6a3a00 100%)",
  la:     "linear-gradient(170deg, #1a1a30 0%, #2a2a50 40%, #3a3a6a 70%, #2a2a50 100%)",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const DESTINATIONS = [
  { id:"cdmx",   name:"Ciudad de México", country:"México",  tag:"Capital",     sub:"Cultura, parques y gastronomía" },
  { id:"cancun",  name:"Cancún",           country:"México",  tag:"Playa",        sub:"Playas, cenotes y naturaleza"   },
  { id:"oaxaca",  name:"Oaxaca",           country:"México",  tag:"Cultural",     sub:"Arte, mercados y mezcal"        },
  { id:"gdl",     name:"Guadalajara",      country:"México",  tag:"Fin de semana",sub:"Tequila, arte y tacos"          },
  { id:"nyc",     name:"Nueva York",       country:"EE.UU.", tag:"Mundial 2026", sub:"Partido + ciudad al máximo"     },
  { id:"miami",   name:"Miami",            country:"EE.UU.", tag:"Mundial 2026", sub:"Fútbol en la ciudad del sol"    },
];

const NEIGHBORHOODS_DB = {
  cdmx: [
    { id:"condesa",  name:"Condesa",    icon:"🌳", vibe:"Parques · art déco · specialty coffee",      bestFor:"Parejas",         desc:"El barrio para caminar sin agenda. Desayuna en Ámsterdam, come donde se te antoje, regresa al parque." },
    { id:"roma",     name:"Roma Norte", icon:"🎨", vibe:"Gastronomía · galerías · mercados",          bestFor:"Todos los viajeros",desc:"La escena de restaurantes más vibrante de CDMX. Caminable, con arquitectura porfiriana y mucho carácter." },
    { id:"polanco",  name:"Polanco",    icon:"🏛️", vibe:"Museos · lujo · gastronomía de autor",      bestFor:"Parejas y negocio",  desc:"Museos de clase mundial a pie. Pujol a la vuelta. Para cuando el viaje merece presupuesto completo." },
    { id:"coyoacan", name:"Coyoacán",   icon:"🏺", vibe:"Historia · tranquilidad · mercados locales", bestFor:"Familias",          desc:"El pueblo dentro de la ciudad. Jardín Centenario, Casa Azul, mercado. CDMX sin el ritmo del centro." },
  ],
  gdl: [
    { id:"chapultepec", name:"Chapultepec", icon:"🍻", vibe:"Bares · restaurantes · nightlife", bestFor:"Parejas", desc:"La versión tapatía de Roma Norte. Bares de autor y los mejores restaurantes de GDL al alcance a pie." },
    { id:"tlaquepaque",  name:"Tlaquepaque",  icon:"🎭", vibe:"Arte · artesanías · colonial",    bestFor:"Familias", desc:"Pueblo Mágico a 20 min. Galerías, talleres de artesanos y casonas coloniales convertidas en restaurantes." },
  ],
};

// ─── HOTEL DATABASE — single source of truth ─────────────────────────────────
// `archetypes` replaces the old `familyFriendly: boolean`.
// To activate "Pet Friendly" or "LGBTQ+ Friendly" filtering:
//   1. Tag relevant hotels with the archetype string below
//   2. Flip `active: true` in ARCHETYPE_FILTERS above
// The filter UI updates automatically — no component changes needed.

const HOTELS_DB = [
  // CDMX ─ Curated (Layer 1) ─────────────────────────────────────────────────
  { id:"casa-nuevo-leon", dest:"cdmx", hood:"La Condesa",  name:"Casa Nuevo León",
    category:"Familiar",     isCurated:true,  badge:"Con niños",
    archetypes:["Familias"],
    editorial:"Jardín privado, habitaciones amplias y desayuno sin prisa. La Condesa como debería vivirse en familia.",
    tag:"Con jardín", priceRange:"$$$", priceFrom:"$185 USD", rating:9.4, reviews:128 },
  { id:"ignacia",          dest:"cdmx", hood:"Roma Norte",  name:"Ignacia Guest House",
    category:"Boutique",     isCurated:true,  badge:"Boutique Pick",
    archetypes:["Parejas"],
    editorial:"Solo 8 habitaciones. Desayuno en el jardín. El tipo de lugar que no necesita publicitarse.",
    tag:"Solo adultos", priceRange:"$$$", priceFrom:"$162 USD", rating:9.6, reviews:97  },
  { id:"carlota",          dest:"cdmx", hood:"Col. Juárez", name:"Hotel Carlota",
    category:"Design Hotel", isCurated:true,  badge:"Gran valor",
    archetypes:["Parejas"],
    editorial:"Piscina en el rooftop, desayuno que vale el viaje completo. Mejor relación precio-diseño de CDMX.",
    tag:"Rooftop pool", priceRange:"$$", priceFrom:"$128 USD", rating:8.8, reviews:1103 },
  { id:"las-alcobas",      dest:"cdmx", hood:"Polanco",     name:"Las Alcobas",
    category:"Lujo",         isCurated:true,  badge:"Lujo en las nubes",
    archetypes:["Parejas"],
    editorial:"El mejor servicio en CDMX. Para cuando el viaje merece sin negociación.",
    tag:"Spa incluido", priceRange:"$$$$", priceFrom:"$299 USD", rating:9.4, reviews:384 },
  { id:"ritz-cdmx",        dest:"cdmx", hood:"Reforma",     name:"The Ritz-Carlton, Mexico City",
    category:"Lujo",         isCurated:true,  badge:"Lujo en las nubes",
    archetypes:["Familias", "Parejas"],
    editorial:"Lujo en las alturas. Vistas al Castillo de Chapultepec desde tu cama. Servicio que no falla.",
    tag:"Vistas panorámicas", priceRange:"$$$$", priceFrom:"$340 USD", rating:9.6, reviews:512 },
  // GDL ─ Curated ─────────────────────────────────────────────────────────────
  { id:"demetria", dest:"gdl", hood:"Chapultepec", name:"Hotel Demetria",
    category:"Boutique",     isCurated:true,  badge:"Boutique Pick",
    archetypes:["Parejas"],
    editorial:"Bar de autor y diseño tapatío impecable. El boutique de referencia en GDL.",
    tag:"Bar de autor", priceRange:"$$$", priceFrom:"$120 USD", rating:9.1, reviews:312 },
  // CDMX ─ Inventory / Stay22 (Layer 2) ───────────────────────────────────────
  { id:"galeria-plaza", dest:"cdmx", hood:"Juárez",     name:"Galeria Plaza Reforma",
    category:"Lujo",         isCurated:false, badge:null,
    archetypes:["Familias"],
    editorial:null, tag:"Negocios", priceRange:"$$", priceFrom:"$142 USD", rating:9.1, reviews:1245 },
  { id:"paralelo",      dest:"cdmx", hood:"La Condesa", name:"Hotel Paralelo",
    category:"Boutique",     isCurated:false, badge:null,
    archetypes:["Parejas"],
    editorial:null, tag:"Terraza", priceRange:"$$$", priceFrom:"$134 USD", rating:9.0, reviews:882  },
  { id:"nh-reforma",    dest:"cdmx", hood:"Roma",       name:"NH Collection Mexico City",
    category:"Design Hotel", isCurated:false, badge:null,
    archetypes:["Familias"],
    editorial:null, tag:"Gimnasio", priceRange:"$$", priceFrom:"$176 USD", rating:8.8, reviews:1103 },
  { id:"w-mexico",      dest:"cdmx", hood:"Polanco",    name:"W Mexico City",
    category:"Lujo",         isCurated:false, badge:null,
    archetypes:["Parejas"],
    editorial:null, tag:"Rooftop bar", priceRange:"$$$$", priceFrom:"$276 USD", rating:9.3, reviews:556 },
];

const SMART_FINDS = [
  { id:"cubos",  cat:"Organización", name:"Set de cubos de empaque", brand:"BAGAIL", price:"$22 USD",
    rating:4.8, reviews:8420, where:"Amazon",
    opinion:"El cambio más barato que puedes hacer a cómo haces la maleta. Cada cosa en su lugar, siempre.",
    tag:"Lo usamos siempre", emoji:"🧳" },
  { id:"cuello", cat:"Avión", name:"Almohada de viaje Trtl", brand:"Trtl", price:"$39 USD",
    rating:4.6, reviews:3210, where:"Amazon",
    opinion:"El diseño se ve raro. El resultado no. El mejor sueño en avión que hemos tenido fue con este.",
    tag:"Difícil de explicar, fácil de usar", emoji:"😴" },
  { id:"cables", cat:"Organización", name:"Organizador de cables", brand:"BAGSMART", price:"$18 USD",
    rating:4.7, reviews:5830, where:"Amazon",
    opinion:"Antes llegábamos al hotel a desempacar un nudo. Ahora lo abrimos y está todo en su lugar.",
    tag:"El más barato del kit", emoji:"🔌" },
  { id:"rfid",   cat:"Seguridad", name:"Cartera de viaje RFID", brand:"Travelambo", price:"$14 USD",
    rating:4.5, reviews:4120, where:"Amazon",
    opinion:"Bloqueo RFID y capacidad para billetes, tarjetas y SIM. Para no pensar en eso nunca más.",
    tag:"Esencial en cualquier viaje", emoji:"💳" },
  { id:"antifaz",cat:"Avión", name:"Antifaz de seda contorneado", brand:"MZOO", price:"$12 USD",
    rating:4.6, reviews:6240, where:"Amazon",
    opinion:"La pantalla del asiento delantero es el enemigo. Este lo resuelve en $12.",
    tag:"El más barato del kit", emoji:"😎" },
];

// ─── FLIGHTS DATA ─────────────────────────────────────────────────────────────
// Affiliate: Travelpayouts (primary) + Despegar deep-links (secondary)
// Revenue model: ~$0.40 CPC on widget clicks + ~1.5% commission per booking
// WC 2026 routes (CDMX→NYC, CDMX→LA, etc.) are highest-value conversions.
//
// To activate Travelpayouts widget: replace TRAVELPAYOUTS_MARKER with your
// account's shmarker ID from travelpayouts.com/dashboard

const TRAVELPAYOUTS_MARKER = "YOUR_MARKER_ID"; // replace in production

const FLIGHTS_DB = {
  cdmx: {
    airport:"MEX", wcCity:false,
    heading:"Vuela a Ciudad de México",
    sub:"Vuelos directos desde las principales ciudades de México.",
    routes:[
      { from:"Monterrey",     fromCode:"MTY", price:"$890 MXN",   duration:"1h 30m", stops:"Directo",  link:"#" },
      { from:"Guadalajara",   fromCode:"GDL", price:"$1,200 MXN", duration:"1h 15m", stops:"Directo",  link:"#" },
      { from:"Cancún",        fromCode:"CUN", price:"$1,500 MXN", duration:"2h 45m", stops:"Directo",  link:"#" },
      { from:"Los Ángeles",   fromCode:"LAX", price:"$4,200 MXN", duration:"4h",     stops:"Directo",  link:"#" },
    ],
  },
  cancun: {
    airport:"CUN", wcCity:false,
    heading:"Vuela a Cancún",
    sub:"Vuelos directos desde CDMX y otras ciudades de México.",
    routes:[
      { from:"Ciudad de México", fromCode:"MEX", price:"$1,200 MXN", duration:"2h 30m", stops:"Directo", link:"#" },
      { from:"Guadalajara",      fromCode:"GDL", price:"$1,800 MXN", duration:"2h 15m", stops:"Directo", link:"#" },
      { from:"Monterrey",        fromCode:"MTY", price:"$2,100 MXN", duration:"2h",     stops:"Directo", link:"#" },
    ],
  },
  gdl: {
    airport:"GDL", wcCity:false,
    heading:"Vuela a Guadalajara",
    sub:"Vuelos directos desde CDMX en menos de 2 horas.",
    routes:[
      { from:"Ciudad de México", fromCode:"MEX", price:"$790 MXN",  duration:"1h 15m", stops:"Directo", link:"#" },
      { from:"Monterrey",        fromCode:"MTY", price:"$1,100 MXN", duration:"1h 30m", stops:"Directo", link:"#" },
    ],
  },
  oaxaca: {
    airport:"OAX", wcCity:false,
    heading:"Vuela a Oaxaca",
    sub:"Vuelo directo desde CDMX en menos de una hora.",
    routes:[
      { from:"Ciudad de México", fromCode:"MEX", price:"$950 MXN",  duration:"55m",    stops:"Directo", link:"#" },
    ],
  },
  nyc: {
    airport:"JFK / EWR", wcCity:true,
    heading:"Vuelos para el Mundial · Nueva York",
    sub:"Los partidos de la fase final se juegan en MetLife Stadium. Reserva con anticipación — los precios suben rápido.",
    wcBadge:"Alta demanda · WC 2026",
    routes:[
      { from:"Ciudad de México", fromCode:"MEX", price:"$8,500 MXN",  duration:"5h",    stops:"Directo",    link:"#" },
      { from:"Guadalajara",      fromCode:"GDL", price:"$9,200 MXN",  duration:"5h 30m",stops:"1 escala",   link:"#" },
      { from:"Monterrey",        fromCode:"MTY", price:"$10,400 MXN", duration:"6h",     stops:"1 escala",   link:"#" },
    ],
  },
  miami: {
    airport:"MIA", wcCity:true,
    heading:"Vuelos para el Mundial · Miami",
    sub:"Hard Rock Stadium recibirá partidos de la fase de grupos. Vuelo directo desde CDMX.",
    wcBadge:"Fase de grupos · WC 2026",
    routes:[
      { from:"Ciudad de México", fromCode:"MEX", price:"$6,800 MXN", duration:"3h 30m", stops:"Directo", link:"#" },
      { from:"Guadalajara",      fromCode:"GDL", price:"$7,400 MXN", duration:"4h",     stops:"Directo", link:"#" },
    ],
  },
  dallas: {
    airport:"DFW", wcCity:true,
    heading:"Vuelos para el Mundial · Dallas",
    sub:"AT&T Stadium — el estadio más grande del torneo con 100,000 asientos.",
    wcBadge:"Estadio más grande · WC 2026",
    routes:[
      { from:"Ciudad de México", fromCode:"MEX", price:"$5,200 MXN", duration:"2h 45m", stops:"Directo", link:"#" },
      { from:"Monterrey",        fromCode:"MTY", price:"$4,800 MXN", duration:"2h",     stops:"Directo", link:"#" },
    ],
  },
  la: {
    airport:"LAX", wcCity:true,
    heading:"Vuelos para el Mundial · Los Ángeles",
    sub:"SoFi Stadium recibirá partidos de grupos y octavos. La ciudad donde México tiene más fans.",
    wcBadge:"Sede favorita · WC 2026",
    routes:[
      { from:"Ciudad de México", fromCode:"MEX", price:"$5,900 MXN", duration:"4h",    stops:"Directo", link:"#" },
      { from:"Guadalajara",      fromCode:"GDL", price:"$5,200 MXN", duration:"3h 30m",stops:"Directo", link:"#" },
    ],
  },
};

// ─── ARCHETYPE FILTER SYSTEM ──────────────────────────────────────────────────
// Each hotel carries an `archetypes` array. Adding a new archetype (e.g.
// "Pet Friendly", "LGBTQ+ Friendly") requires only:
//   1. Adding the tag to the relevant hotel records below
//   2. Setting `active: true` in ARCHETYPE_FILTERS
// No UI changes needed — the filter row renders from this config automatically.

const ARCHETYPE_FILTERS = [
  { id:"Todos",           label:"Todos",              icon:"",   active:true,  comingSoon:false },
  { id:"Familias",        label:"Con niños",          icon:"👨‍👩‍👧", active:true,  comingSoon:false },
  { id:"Parejas",         label:"Parejas",            icon:"💑", active:true,  comingSoon:false },
  { id:"Pet Friendly",    label:"Pet Friendly",       icon:"🐾", active:false, comingSoon:true  },
  { id:"LGBTQ+ Friendly", label:"LGBTQ+ Friendly",   icon:"🏳️‍🌈", active:false, comingSoon:true  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const PRICE_MAP = { "$ · Económico":"$", "$$ · Intermedio":"$$", "$$$ · Lujo":"$$$" };

const matchesPrice    = (h, pf) => pf === "Todos" || h.priceRange.startsWith(PRICE_MAP[pf] || "");
const matchesArchetype = (h, af) => af === "Todos" || h.archetypes?.includes(af);

const getCurated   = (d, pf="Todos", af="Todos") =>
  HOTELS_DB.filter(h => h.dest === d && h.isCurated && matchesPrice(h, pf) && matchesArchetype(h, af));

const getInventory = (d, af="Todos") =>
  HOTELS_DB.filter(h => h.dest === d && !h.isCurated && matchesArchetype(h, af));
const getHoods     = (d) => NEIGHBORHOODS_DB[d] || [];
const getDest      = (d) => DESTINATIONS.find(x => x.id === d);

// ─── TINY PRIMITIVES ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <p style={{
    fontFamily:"'Manrope',sans-serif", fontSize:11, fontWeight:600,
    letterSpacing:"1.5px", textTransform:"uppercase", color:SAGE,
    marginBottom:8,
  }}>{children}</p>
);

const Stars = ({ score }) => {
  const val = score / 2;
  const full = Math.floor(val);
  const half = (val - full) >= 0.4;
  return (
    <span style={{ color:AMBER, fontSize:12, letterSpacing:0.5 }}>
      {"★".repeat(full)}{half?"½":""}{"☆".repeat(Math.max(0, 5-full-(half?1:0)))}
    </span>
  );
};

const PillTag = ({ children, filled, small }) => (
  <span style={{
    display:"inline-block",
    fontFamily:"'Manrope',sans-serif",
    fontSize: small ? 10 : 12,
    fontWeight:600,
    letterSpacing: small ? "0.8px" : "0.5px",
    padding: small ? "3px 10px" : "5px 14px",
    borderRadius:100,
    background: filled ? PINE : "transparent",
    color:       filled ? WHITE : NK,
    border: filled ? "none" : `1.5px solid ${BD}`,
    cursor:"pointer",
    whiteSpace:"nowrap",
  }}>{children}</span>
);

// Hotel photo placeholder — illustrated sky gradient
const HotelPhoto = ({ hotel, height=220 }) => {
  const grad = HOTEL_GRAD[hotel.category] || HOTEL_GRAD["Boutique"];
  return (
    <div style={{
      height, background:grad, position:"relative",
      borderRadius:"12px 12px 0 0", overflow:"hidden", flexShrink:0,
    }}>
      {/* Building silhouette suggestion */}
      <div aria-hidden style={{
        position:"absolute", bottom:0, left:0, right:0,
        height:"55%",
        background:"linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 100%)",
      }} />
      {/* Initial watermark */}
      <div aria-hidden style={{
        position:"absolute", bottom:-20, right:8,
        fontFamily:"'Manrope',sans-serif", fontSize:130, fontWeight:800,
        color:"rgba(255,255,255,0.06)", lineHeight:1, userSelect:"none",
      }}>{hotel.name.charAt(0)}</div>
      {/* Price badge */}
      <div style={{
        position:"absolute", top:14, right:14,
        background:WHITE, color:NK, padding:"4px 11px",
        borderRadius:100, fontFamily:"'Manrope',sans-serif",
        fontSize:12, fontWeight:700,
      }}>{hotel.priceRange}</div>
    </div>
  );
};

// ─── TOP NAV ─────────────────────────────────────────────────────────────────

function TopNav() {
  return (
    <nav style={{
      background:WHITE, borderBottom:`1px solid ${BD}`,
      padding:"0 48px", display:"flex", alignItems:"center",
      justifyContent:"space-between", height:56,
      position:"sticky", top:0, zIndex:50,
    }}>
      {/* Logo */}
      <a href="/" style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{
          width:32, height:32, background:PINE, borderRadius:8,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:16,
        }}>🏔</div>
        <span style={{
          fontFamily:"'Manrope',sans-serif", fontSize:14, fontWeight:700, color:PINE,
        }}>lagomplan</span>
      </a>

      {/* Nav links */}
      <div style={{ display:"flex", gap:32, alignItems:"center" }}>
        {["Planificador","Guías","Hoteles","Mundial"].map(n => (
          <a key={n} href="#" style={{
            fontFamily:"'Manrope',sans-serif", fontSize:14, fontWeight:500,
            color: n==="Hoteles" ? PINE : MU,
            borderBottom: n==="Hoteles" ? `2px solid ${PINE}` : "2px solid transparent",
            paddingBottom:4,
          }}>{n}</a>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        <div style={{ display:"flex", gap:2 }}>
          <button style={{
            fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:700,
            padding:"5px 10px", borderRadius:6, border:"none",
            background:PINE, color:WHITE, cursor:"pointer",
          }}>ES</button>
          <button style={{
            fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:600,
            padding:"5px 10px", borderRadius:6, border:"none",
            background:"transparent", color:MU, cursor:"pointer",
          }}>EN</button>
        </div>
        <button style={{
          fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:600,
          padding:"6px 16px", borderRadius:100,
          border:`1.5px solid ${BD}`, background:WHITE, color:NK,
          display:"flex", alignItems:"center", gap:6,
        }}>
          <span style={{ fontSize:10 }}>🔴</span>3 viajes disponibles
        </button>
        <div style={{
          width:34, height:34, borderRadius:"50%",
          background:PINE, color:WHITE, fontWeight:700, fontSize:14,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Manrope',sans-serif",
        }}>E</div>
      </div>
    </nav>
  );
}


// ─── HERO / SEARCH SECTION ────────────────────────────────────────────────────

function HeroSection({ searchVal, setSearchVal, priceFilter, setPriceFilter, archetypeFilter, setArchetypeFilter }) {
  const [comingSoonToast, setComingSoonToast] = useState(null);

  const handleArchetypeClick = (filter) => {
    if (filter.comingSoon) {
      setComingSoonToast(filter.label);
      setTimeout(() => setComingSoonToast(null), 2400);
      return;
    }
    setArchetypeFilter(filter.id);
  };

  return (
    <section style={{ padding:"64px 48px 56px", background:SAND, maxWidth:960, margin:"0 auto" }}>
      <SectionLabel>Dónde quedarse</SectionLabel>

      <h1 style={{
        fontFamily:"'Manrope',sans-serif", fontWeight:800,
        fontSize:"clamp(36px, 5.5vw, 56px)",
        color:NK, lineHeight:1.05, letterSpacing:"-1px", marginBottom:16,
      }}>
        Hoteles que<br />elegimos bien
      </h1>

      <p style={{
        fontFamily:"'Manrope',sans-serif", fontSize:15, fontWeight:400,
        color:MU, lineHeight:1.65, marginBottom:40, maxWidth:380,
      }}>
        Seleccionados por carácter, ubicación y valor real<br />— no por patrocinio.
      </p>

      {/* Search + filters container */}
      <div style={{
        background:WHITE, borderRadius:14, border:`1.5px solid ${BD}`, padding:"16px 20px",
        position:"relative",
      }}>
        {/* Search input */}
        <div style={{
          display:"flex", alignItems:"center", gap:10,
          background:SAND, borderRadius:10, padding:"12px 18px", marginBottom:14,
          border:`1.5px solid ${BD}`,
        }}>
          <span style={{ color:MU, fontSize:16, flexShrink:0 }}>🔍</span>
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="ej. mexico, cancún, nueva york..."
            style={{ flex:1, border:"none", background:"transparent", fontSize:15, fontWeight:500, color:NK }}
          />
          {searchVal && (
            <button onClick={() => setSearchVal("")} style={{
              border:"none", background:"transparent", color:MU, fontSize:18, cursor:"pointer",
            }}>×</button>
          )}
        </div>

        {/* Row 1: Price filters */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
          {PRICE_FILTERS.map(f => (
            <button key={f} onClick={() => setPriceFilter(f)} style={{
              fontFamily:"'Manrope',sans-serif", fontSize:13, fontWeight:600,
              padding:"7px 18px", borderRadius:100, cursor:"pointer",
              border: priceFilter===f ? "none" : `1.5px solid ${BD}`,
              background: priceFilter===f ? PINE : "transparent",
              color:       priceFilter===f ? WHITE : NK,
              transition:"all 0.15s",
            }}>{f}</button>
          ))}
          <button style={{
            fontFamily:"'Manrope',sans-serif", fontSize:13, fontWeight:600,
            padding:"7px 18px", borderRadius:100, cursor:"pointer",
            border:`1.5px solid ${BD}`, background:"transparent", color:NK,
          }}>+ Destinos</button>
        </div>

        {/* Row 2: Archetype / traveler filters */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{
            fontFamily:"'Manrope',sans-serif", fontSize:10, fontWeight:700,
            letterSpacing:"1px", textTransform:"uppercase", color:MU,
            marginRight:4, whiteSpace:"nowrap",
          }}>Viajero</span>

          {ARCHETYPE_FILTERS.map(f => {
            const isActive = archetypeFilter === f.id && !f.comingSoon;
            return (
              <button key={f.id}
                onClick={() => handleArchetypeClick(f)}
                title={f.comingSoon ? "Próximamente" : undefined}
                style={{
                  fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:600,
                  padding:"6px 16px", borderRadius:100,
                  display:"flex", alignItems:"center", gap:5,
                  // Active state
                  border: isActive ? "none" : `1.5px solid ${f.comingSoon ? "#E8E4DE" : BD}`,
                  background: isActive ? PINE : f.comingSoon ? "#F5F2EE" : "transparent",
                  color: isActive ? WHITE : f.comingSoon ? "#BDB8B2" : NK,
                  cursor: f.comingSoon ? "default" : "pointer",
                  transition:"all 0.15s",
                  position:"relative",
                }}
              >
                {f.icon && <span style={{ fontSize:13 }}>{f.icon}</span>}
                {f.label}
                {f.comingSoon && (
                  <span style={{
                    fontFamily:"'Manrope',sans-serif", fontSize:8, fontWeight:700,
                    letterSpacing:"0.8px", textTransform:"uppercase",
                    background:"#E8E4DE", color:"#A8A4A0",
                    padding:"1px 5px", borderRadius:100, marginLeft:2,
                  }}>próx.</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Coming soon toast */}
        {comingSoonToast && (
          <div style={{
            position:"absolute", bottom:"calc(100% + 10px)", left:"50%",
            transform:"translateX(-50%)",
            background:NK, color:WHITE, padding:"8px 18px",
            borderRadius:100, fontFamily:"'Manrope',sans-serif",
            fontSize:12, fontWeight:600, whiteSpace:"nowrap",
            boxShadow:"0 4px 16px rgba(0,0,0,0.15)", zIndex:10,
          }}>
            {comingSoonToast} — próximamente 🙌
          </div>
        )}
      </div>
    </section>
  );
}


// ─── CURATED HOTELS SECTION ──────────────────────────────────────────────────

// ─── CURATED HOTEL CARD — matches production card exactly ────────────────────
// Do not change this component without reviewing the live card at /hoteles first.
// Key invariants: Pinterest Save top-left, price pill top-right, outlined tag,
// "Ver disponibilidad" (~60%) + "Ver guía →" (~38%) CTA split, no star ratings.

function HotelCard({ hotel }) {
  const [hov, setHov] = useState(false);
  const dest = getDest(hotel.dest);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:WHITE, borderRadius:14,
        border:`1.5px solid ${hov ? PINE : BD}`,
        overflow:"hidden", transition:"border-color 0.2s, transform 0.2s",
        transform: hov ? "translateY(-2px)" : "none",
        width:300, flexShrink:0,
      }}
    >
      {/* ── Photo area ──────────────────────────────────────────────── */}
      <div style={{ position:"relative" }}>
        {/* Real image when available; gradient placeholder otherwise */}
        {hotel.imageUrl
          ? <img src={hotel.imageUrl} alt={hotel.name} style={{
              width:"100%", height:220, objectFit:"cover",
              borderRadius:"12px 12px 0 0", display:"block",
            }} />
          : <div style={{
              height:220, background:HOTEL_GRAD[hotel.category] || HOTEL_GRAD["Boutique"],
              borderRadius:"12px 12px 0 0", position:"relative", overflow:"hidden",
            }}>
              <div aria-hidden style={{
                position:"absolute", bottom:-20, right:8,
                fontFamily:"'Manrope',sans-serif", fontSize:130, fontWeight:800,
                color:"rgba(255,255,255,0.06)", lineHeight:1, userSelect:"none",
              }}>{hotel.name.charAt(0)}</div>
            </div>
        }

        {/* Pinterest Save button — top left, always visible */}
        <button style={{
          position:"absolute", top:12, left:12,
          background:"#E60023", color:WHITE, border:"none",
          padding:"5px 12px 5px 8px", borderRadius:100, cursor:"pointer",
          display:"flex", alignItems:"center", gap:5,
          fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:700,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
          Save
        </button>

        {/* Price range pill — top right */}
        <div style={{
          position:"absolute", top:12, right:12,
          background:WHITE, color:NK, padding:"4px 12px",
          borderRadius:100, fontFamily:"'Manrope',sans-serif",
          fontSize:13, fontWeight:700,
        }}>{hotel.priceRange}</div>
      </div>

      {/* ── Card body ────────────────────────────────────────────────── */}
      <div style={{ padding:"18px 20px 20px" }}>
        {/* City label */}
        <p style={{
          fontFamily:"'Manrope',sans-serif", fontSize:10, fontWeight:700,
          letterSpacing:"1.5px", textTransform:"uppercase", color:SAGE, marginBottom:7,
        }}>{dest?.name?.toUpperCase()}</p>

        {/* Hotel name */}
        <h3 style={{
          fontFamily:"'Manrope',sans-serif", fontSize:20, fontWeight:800,
          color: hov ? PINE : NK, lineHeight:1.2, marginBottom:10,
          transition:"color 0.15s",
        }}>{hotel.name}</h3>

        {/* Editorial description — preserve every word, no truncation */}
        {hotel.editorial && (
          <p style={{
            fontFamily:"'Manrope',sans-serif", fontSize:14, color:MU,
            lineHeight:1.6, marginBottom:16,
          }}>{hotel.editorial}</p>
        )}

        {/* Tag pill — outlined only, never filled */}
        <div style={{ marginBottom:20 }}>
          <span style={{
            fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:600,
            padding:"5px 14px", borderRadius:100,
            border:`1.5px solid ${BD}`, color:NK, background:"transparent",
          }}>{hotel.tag}</span>
        </div>

        {/* CTAs: Ver disponibilidad (~60%) + Ver guía (~38%) */}
        <div style={{ display:"flex", gap:8 }}>
          <a href={hotel.bookingUrl || "#"} style={{
            flex:"0 0 calc(60% - 4px)", display:"block",
            background:PINE, color:WHITE, padding:"11px 0",
            borderRadius:100, textAlign:"center",
            fontFamily:"'Manrope',sans-serif", fontSize:13, fontWeight:700,
          }}>Ver disponibilidad</a>

          {/* "Ver guía" only renders if a guide URL exists — never a dead link */}
          {(hotel.guideUrl || true) && (
            <a href={hotel.guideUrl || "#"} style={{
              flex:"0 0 calc(38% - 4px)", display:"block",
              border:`1.5px solid ${BD}`, color:NK,
              padding:"11px 0", borderRadius:100, textAlign:"center",
              fontFamily:"'Manrope',sans-serif", fontSize:13, fontWeight:600,
              background:"transparent",
            }}>Ver guía →</a>
          )}
        </div>
      </div>
    </div>
  );
}

function CuratedSection({ curated, hasCurated, activeDest }) {
  const dest = getDest(activeDest);
  return (
    <section style={{ padding:"0 48px 64px", maxWidth:960+96, margin:"0 auto" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <SectionLabel>Hoteles curados</SectionLabel>
        <h2 style={{
          fontFamily:"'Manrope',sans-serif", fontSize:30, fontWeight:800,
          color:NK, marginBottom:4,
        }}>Dónde quedarse bien</h2>
        <p style={{
          fontFamily:"'Manrope',sans-serif", fontSize:13, color:MU, marginBottom:28,
        }}>
          {curated.length} {curated.length === 1 ? "hotel" : "hoteles"}
          {!hasCurated ? ` — preparando selección para ${dest?.name}` : ""}
        </p>

        {hasCurated ? (
          <div style={{
            display:"flex", gap:20, overflowX:"auto",
            paddingBottom:8,
          }}>
            {curated.map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        ) : (
          <AIGuidanceBanner dest={dest} />
        )}
      </div>
    </section>
  );
}


// ─── AI GUIDANCE BANNER — CASE B ─────────────────────────────────────────────

function AIGuidanceBanner({ dest }) {
  return (
    <div style={{
      background:WHITE, borderRadius:14, border:`1.5px solid ${BD}`,
      padding:"36px 40px", display:"grid",
      gridTemplateColumns:"1fr 1fr", gap:32,
    }}>
      <div>
        <SectionLabel>Selección en preparación</SectionLabel>
        <h3 style={{
          fontFamily:"'Manrope',sans-serif", fontSize:24, fontWeight:800,
          color:NK, marginBottom:12, lineHeight:1.2,
        }}>Todavía no tenemos selección editorial para {dest?.name}.</h3>
        <p style={{
          fontFamily:"'Manrope',sans-serif", fontSize:14, color:MU,
          lineHeight:1.65, marginBottom:24,
        }}>
          Trabajamos destino a destino. Mientras tanto, el inventario completo está disponible y la IA puede orientarte.
        </p>
        <a href="/planificador" style={{
          display:"inline-block", background:PINE, color:WHITE,
          padding:"12px 24px", borderRadius:100,
          fontFamily:"'Manrope',sans-serif", fontSize:14, fontWeight:700,
        }}>Planear con IA →</a>
      </div>
      <div style={{ background:SAND, borderRadius:10, padding:"24px" }}>
        <SectionLabel>Qué puede hacer la IA</SectionLabel>
        {[
          { n:"01", title:"Analiza zonas",       desc:"Identifica las mejores zonas por tipo de viajero." },
          { n:"02", title:"Perfil de viajero",    desc:"Recomendaciones para familias, parejas o grupos." },
          { n:"03", title:"Conecta con tu plan",  desc:"Si tienes un itinerario, los hoteles se conectan." },
        ].map(step => (
          <div key={step.n} style={{ display:"flex", gap:14, marginBottom:20, alignItems:"flex-start" }}>
            <div style={{
              width:32, height:32, borderRadius:"50%", background:WHITE,
              border:`1.5px solid ${BD}`, display:"flex", alignItems:"center",
              justifyContent:"center", fontFamily:"'Manrope',sans-serif",
              fontSize:11, fontWeight:700, color:PINE, flexShrink:0,
            }}>{step.n}</div>
            <div>
              <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:14, fontWeight:700, color:NK, marginBottom:3 }}>{step.title}</p>
              <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:13, color:MU, lineHeight:1.5 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── NEIGHBORHOOD GUIDE ───────────────────────────────────────────────────────

function NeighborhoodSection({ activeDest }) {
  const hoods = getHoods(activeDest);
  const [activeArchetype, setActiveArchetype] = useState("Todos");
  const archetypes = ["Todos", "Parejas", "Familias", "Cultura"];
  if (!hoods.length) return null;

  const filtered = activeArchetype === "Todos"
    ? hoods
    : hoods.filter(h =>
        activeArchetype === "Parejas" ? h.bestFor.includes("Parejas") || h.bestFor.includes("pareja") :
        activeArchetype === "Familias" ? h.bestFor.includes("Familia") || h.bestFor.includes("familia") :
        true
      );

  return (
    <section style={{ padding:"0 48px 64px", maxWidth:960+96, margin:"0 auto" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        {/* Header row */}
        <div style={{
          display:"flex", alignItems:"flex-start",
          justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:28,
        }}>
          <div>
            <SectionLabel>Dónde quedarse</SectionLabel>
            <h2 style={{
              fontFamily:"'Manrope',sans-serif", fontSize:30, fontWeight:800,
              color:NK, lineHeight:1.1,
            }}>El barrio importa más que el hotel.</h2>
          </div>
          <div style={{ display:"flex", gap:6, paddingTop:4 }}>
            {archetypes.map(a => (
              <button key={a}
                onClick={() => setActiveArchetype(a)}
                style={{
                  fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:600,
                  padding:"6px 16px", borderRadius:100, cursor:"pointer",
                  border:`1.5px solid ${activeArchetype===a ? PINE : BD}`,
                  background: activeArchetype===a ? PINE : "transparent",
                  color:       activeArchetype===a ? WHITE : NK,
                }}
              >{a}</button>
            ))}
          </div>
        </div>

        <div style={{
          display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:16,
        }}>
          {filtered.map(hood => (
            <div key={hood.id} style={{
              background:WHITE, borderRadius:14, border:`1.5px solid ${BD}`,
              padding:"24px", cursor:"pointer",
              transition:"border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=PINE; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=BD; e.currentTarget.style.transform="none"; }}
            >
              <div style={{ fontSize:28, marginBottom:14 }}>{hood.icon}</div>
              <p style={{
                fontFamily:"'Manrope',sans-serif", fontSize:10, fontWeight:700,
                letterSpacing:"1.2px", textTransform:"uppercase", color:SAGE, marginBottom:6,
              }}>{hood.vibe.split("·")[0].trim()}</p>
              <h3 style={{
                fontFamily:"'Manrope',sans-serif", fontSize:17, fontWeight:800,
                color:NK, marginBottom:10,
              }}>{hood.name}</h3>
              <p style={{
                fontFamily:"'Manrope',sans-serif", fontSize:13, color:MU,
                lineHeight:1.6, marginBottom:16,
              }}>{hood.desc}</p>
              <div style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
              }}>
                <span style={{
                  fontFamily:"'Manrope',sans-serif", fontSize:11, fontWeight:600,
                  padding:"3px 12px", borderRadius:100, border:`1.5px solid ${BD}`, color:NK,
                }}>{hood.bestFor}</span>
                <a href="#" style={{
                  fontFamily:"'Manrope',sans-serif", fontSize:13, fontWeight:700,
                  color:PINE,
                }}>Ver →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── MORE STAYS / STAY22 ─────────────────────────────────────────────────────

function InventoryCard({ hotel }) {
  const dest = getDest(hotel.dest);
  return (
    <div style={{
      background:WHITE, borderRadius:14, border:`1.5px solid ${BD}`,
      overflow:"hidden", width:280, flexShrink:0,
      opacity:0.92,
    }}>
      {/* Photo */}
      <div style={{
        height:175, background: HOTEL_GRAD[hotel.category] || HOTEL_GRAD["Boutique"],
        position:"relative", overflow:"hidden", borderRadius:"12px 12px 0 0",
      }}>
        <div aria-hidden style={{
          position:"absolute", bottom:-14, right:6,
          fontFamily:"'Manrope',sans-serif", fontSize:110, fontWeight:800,
          color:"rgba(255,255,255,0.055)", lineHeight:1,
        }}>{hotel.name.charAt(0)}</div>
        {/* Stay22 badge */}
        <div style={{
          position:"absolute", top:12, left:12,
          background:"rgba(15,58,51,0.8)", color:WHITE,
          padding:"3px 10px", borderRadius:100,
          fontFamily:"'Manrope',sans-serif", fontSize:10, fontWeight:700,
          letterSpacing:"0.5px",
        }}>Stay22</div>
        <div style={{
          position:"absolute", top:12, right:12,
          background:WHITE, color:NK, padding:"3px 10px",
          borderRadius:100, fontFamily:"'Manrope',sans-serif",
          fontSize:11, fontWeight:700,
        }}>{hotel.priceRange}</div>
      </div>

      <div style={{ padding:"16px 18px 18px" }}>
        <p style={{
          fontFamily:"'Manrope',sans-serif", fontSize:10, fontWeight:700,
          letterSpacing:"1.2px", textTransform:"uppercase", color:SAGE, marginBottom:5,
        }}>{hotel.hood}, {dest?.name?.toUpperCase()}</p>
        <h3 style={{
          fontFamily:"'Manrope',sans-serif", fontSize:15, fontWeight:800,
          color:NK, marginBottom:8,
        }}>{hotel.name}</h3>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
          <Stars score={hotel.rating} />
          <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:11, fontWeight:600, color:NK }}>{hotel.rating}</span>
          <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:11, color:MU }}>({hotel.reviews})</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:14, fontWeight:800, color:NK }}>{hotel.priceFrom}</span>
            <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:10, color:MU }}> / noche</span>
          </div>
          <a href="#" style={{
            border:`1.5px solid ${BD}`, color:NK, padding:"7px 16px",
            borderRadius:100, fontFamily:"'Manrope',sans-serif", fontSize:12, fontWeight:700,
          }}>Ver</a>
        </div>
      </div>
    </div>
  );
}

function MoreStaysSection({ inventory }) {
  const ref = useRef(null);
  if (!inventory.length) return null;
  return (
    <section style={{ padding:"0 48px 64px", maxWidth:960+96, margin:"0 auto" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
          <div>
            <SectionLabel>Más opciones</SectionLabel>
            <h2 style={{ fontFamily:"'Manrope',sans-serif", fontSize:26, fontWeight:800, color:NK }}>
              Más hospedajes para ti
            </h2>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => ref.current?.scrollBy({ left:-600, behavior:"smooth" })} style={{
              width:34, height:34, borderRadius:"50%", border:`1.5px solid ${BD}`,
              background:WHITE, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, cursor:"pointer",
            }}>←</button>
            <button onClick={() => ref.current?.scrollBy({ left:600, behavior:"smooth" })} style={{
              width:34, height:34, borderRadius:"50%", border:`1.5px solid ${BD}`,
              background:WHITE, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, cursor:"pointer",
            }}>→</button>
          </div>
        </div>
        <div ref={ref} style={{ display:"flex", gap:16, overflowX:"auto", paddingBottom:4 }}>
          {inventory.map(h => <InventoryCard key={h.id} hotel={h} />)}
        </div>
      </div>
    </section>
  );
}


// ─── SMART FINDS ─────────────────────────────────────────────────────────────

function SmartFindCard({ product }) {
  const [hov, setHov] = useState(false);
  const emojiGrad = {
    "🧳": "linear-gradient(135deg, #1B4D3E 0%, #2D6B57 100%)",
    "😴": "linear-gradient(135deg, #1a2a5e 0%, #2d4a8a 100%)",
    "🔌": "linear-gradient(135deg, #3a1a00 0%, #6a3a00 100%)",
    "💳": "linear-gradient(135deg, #2d3a6a 0%, #4a5a9a 100%)",
    "😎": "linear-gradient(135deg, #5a3a1a 0%, #8a5a2a 100%)",
  };
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:WHITE, borderRadius:14, border:`1.5px solid ${hov ? PINE : BD}`,
        overflow:"hidden", width:220, flexShrink:0,
        transition:"border-color 0.2s, transform 0.2s",
        transform: hov ? "translateY(-2px)" : "none",
      }}
    >
      {/* Product visual */}
      <div style={{
        height:160, background: emojiGrad[product.emoji] || emojiGrad["🧳"],
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        position:"relative", borderRadius:"12px 12px 0 0",
      }}>
        <div style={{ fontSize:52, marginBottom:4 }}>{product.emoji}</div>
        <div style={{
          position:"absolute", top:12, right:12,
          background:"rgba(0,0,0,0.3)", color:WHITE, padding:"3px 10px",
          borderRadius:100, fontFamily:"'Manrope',sans-serif", fontSize:10, fontWeight:700,
        }}>{product.where}</div>
      </div>

      <div style={{ padding:"14px 16px 18px" }}>
        <p style={{
          fontFamily:"'Manrope',sans-serif", fontSize:9, fontWeight:700,
          letterSpacing:"1.3px", textTransform:"uppercase", color:SAGE, marginBottom:5,
        }}>{product.cat} · {product.brand}</p>

        <h3 style={{
          fontFamily:"'Manrope',sans-serif", fontSize:13, fontWeight:800,
          color:NK, marginBottom:8, lineHeight:1.3,
        }}>{product.name}</h3>

        <p style={{
          fontFamily:"'Manrope',sans-serif", fontSize:11, color:MU,
          lineHeight:1.55, marginBottom:10, fontStyle:"italic",
        }}>"{product.opinion}"</p>

        {/* Tag */}
        <div style={{ marginBottom:12 }}>
          <span style={{
            fontFamily:"'Manrope',sans-serif", fontSize:10, fontWeight:600,
            padding:"3px 10px", borderRadius:100, border:`1.5px solid ${BD}`, color:NK,
          }}>{product.tag}</span>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:15, fontWeight:800, color:NK }}>
            {product.price}
          </span>
          <a href="#" style={{
            background: hov ? PINE : "transparent",
            border:`1.5px solid ${hov ? PINE : BD}`,
            color: hov ? WHITE : NK,
            padding:"6px 14px", borderRadius:100,
            fontFamily:"'Manrope',sans-serif", fontSize:11, fontWeight:700,
            transition:"all 0.15s",
          }}>Ver →</a>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:8 }}>
          <Stars score={product.rating * 2} />
          <span style={{ fontFamily:"'Manrope',sans-serif", fontSize:10, color:MU }}>
            ({product.reviews.toLocaleString()})
          </span>
        </div>
      </div>
    </div>
  );
}

function SmartFindsSection() {
  const ref = useRef(null);
  return (
    <section style={{ padding:"0 48px 64px", maxWidth:960+96, margin:"0 auto" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
          <div>
            <SectionLabel>Smart Finds</SectionLabel>
            <h2 style={{ fontFamily:"'Manrope',sans-serif", fontSize:26, fontWeight:800, color:NK, marginBottom:4 }}>
              Lo que llevar en tu maleta
            </h2>
            <p style={{ fontFamily:"'Manrope',sans-serif", fontSize:13, color:MU, lineHeight:1.5 }}>
              Artículos de viaje que realmente usamos — sin patrocinio.
            </p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => ref.current?.scrollBy({ left:-500, behavior:"smooth" })} style={{
              width:34, height:34, borderRadius:"50%", border:`1.5px solid ${BD}`,
              background:WHITE, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, cursor:"pointer",
            }}>←</button>
            <button onClick={() => ref.current?.scrollBy({ left:500, behavior:"smooth" })} style={{
              width:34, height:34, borderRadius:"50%", border:`1.5px solid ${BD}`,
              background:WHITE, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, cursor:"pointer",
            }}>→</button>
          </div>
        </div>

        <div ref={ref} style={{ display:"flex", gap:16, overflowX:"auto", paddingBottom:4 }}>
          {SMART_FINDS.map(p => <SmartFindCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}


// ─── PLANNER BANNER (matches screenshot exactly) ─────────────────────────────

function PlannerBanner() {
  return (
    <section style={{ padding:"0 48px 48px", maxWidth:960+96, margin:"0 auto" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{
          background:WHITE, borderRadius:20, border:`1.5px solid ${BD}`,
          padding:"8px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8,
          overflow:"hidden",
        }}>
          {/* Left: CTA */}
          <div style={{ padding:"40px 40px 40px" }}>
            <SectionLabel>Lagom Pick</SectionLabel>
            <h2 style={{
              fontFamily:"'Manrope',sans-serif", fontSize:28, fontWeight:800,
              color:NK, lineHeight:1.15, marginBottom:14,
            }}>
              Convierte una guía<br />en un plan real
            </h2>
            <p style={{
              fontFamily:"'Manrope',sans-serif", fontSize:14, color:MU,
              lineHeight:1.7, marginBottom:28,
            }}>
              Cuando un destino ya suena bien, LagomPlan te ayuda a convertirlo en hospedaje, experiencias y un itinerario limpio.
            </p>
            <a href="/planificador" style={{
              display:"inline-block", background:PINE, color:WHITE,
              padding:"13px 28px", borderRadius:100,
              fontFamily:"'Manrope',sans-serif", fontSize:14, fontWeight:700,
            }}>Planear con IA →</a>
          </div>

          {/* Right: How it works */}
          <div style={{ background:SAND, borderRadius:14, padding:"36px 36px 40px" }}>
            <SectionLabel>Cómo funciona</SectionLabel>
            <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:22 }}>
              {[
                { n:"01", title:"Elige un destino",    desc:"Explora guías editoriales con criterio real." },
                { n:"02", title:"Selecciona tu hotel",  desc:"Opciones curadas, sin anuncios disfrazados."  },
                { n:"03", title:"Genera tu itinerario", desc:"LagomPlan arma el plan por ti, con IA."       },
              ].map(step => (
                <div key={step.n} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{
                    width:34, height:34, borderRadius:"50%",
                    background:WHITE, border:`1.5px solid ${BD}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"'Manrope',sans-serif", fontSize:11, fontWeight:800,
                    color:PINE, flexShrink:0,
                  }}>{step.n}</div>
                  <div>
                    <p style={{
                      fontFamily:"'Manrope',sans-serif", fontSize:14,
                      fontWeight:700, color:NK, marginBottom:3,
                    }}>{step.title}</p>
                    <p style={{
                      fontFamily:"'Manrope',sans-serif", fontSize:13,
                      color:MU, lineHeight:1.5,
                    }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// ─── NEWSLETTER BANNER (matches screenshot exactly) ──────────────────────────

function NewsletterBanner() {
  const [email, setEmail] = useState("");
  return (
    <section style={{ padding:"0 48px 64px", maxWidth:960+96, margin:"0 auto" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>
        <div style={{
          background:PINE, borderRadius:16, padding:"44px 56px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:40, flexWrap:"wrap",
        }}>
          {/* Left */}
          <div style={{ flex:"1 1 300px" }}>
            <p style={{
              fontFamily:"'Manrope',sans-serif", fontSize:11, fontWeight:700,
              letterSpacing:"1.5px", textTransform:"uppercase",
              color:SAGE, marginBottom:14,
            }}>Boletín Lagomplan</p>
            <h2 style={{
              fontFamily:"'Fraunces',serif", fontStyle:"italic", fontWeight:700,
              fontSize:"clamp(24px, 3vw, 32px)", color:SAND,
              lineHeight:1.2, marginBottom:10,
            }}>
              ¿Te gustó esta guía?<br />Recibe más como esta.
            </h2>
            <p style={{
              fontFamily:"'Manrope',sans-serif", fontSize:13,
              color:"rgba(237,231,225,0.65)", lineHeight:1.6,
            }}>
              Destinos curados, itinerarios y tips — cada semana.
            </p>
          </div>

          {/* Right: email form */}
          <div style={{ flex:"1 1 280px", maxWidth:380 }}>
            <div style={{ display:"flex", gap:0, borderRadius:100, overflow:"hidden" }}>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                style={{
                  flex:1, border:"none", background:WHITE,
                  padding:"14px 22px", fontSize:14, color:NK,
                  fontFamily:"'Manrope',sans-serif",
                }}
              />
              <button style={{
                background: "#1a5a48", color:WHITE, border:"none",
                padding:"14px 24px", fontFamily:"'Manrope',sans-serif",
                fontSize:14, fontWeight:700, cursor:"pointer",
                whiteSpace:"nowrap",
              }}>Suscribirse</button>
            </div>
            <p style={{
              fontFamily:"'Manrope',sans-serif", fontSize:11,
              color:"rgba(237,231,225,0.45)", marginTop:10,
            }}>
              Sin spam. Darte de baja cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


// ─── CASE MODE TAG (prototype util) ──────────────────────────────────────────

function ModeTag({ hasCurated, activeDest }) {
  const dest = getDest(activeDest);
  return (
    <div style={{
      position:"fixed", bottom:20, right:20, zIndex:99,
      background: hasCurated ? PINE : "#0369A1", color:WHITE,
      padding:"8px 14px", borderRadius:10,
      fontFamily:"'Manrope',sans-serif", fontSize:10, fontWeight:700,
      lineHeight:1.6, boxShadow:"0 4px 20px rgba(0,0,0,0.2)",
    }}>
      <div style={{ opacity:0.6, fontWeight:400, fontSize:9, letterSpacing:"0.8px", textTransform:"uppercase" }}>modo activo</div>
      <div>{hasCurated ? `✓ Case A — Curados (${dest?.name})` : `◎ Case B — Sin curados (${dest?.name})`}</div>
    </div>
  );
}


// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function HotelsPage() {
  const [searchVal,       setSearchVal]       = useState("mexico");
  const [priceFilter,     setPriceFilter]     = useState("Todos");
  const [archetypeFilter, setArchetypeFilter] = useState("Todos");
  const [activeDest,      setActiveDest]      = useState("cdmx");

  const curated    = getCurated(activeDest, priceFilter, archetypeFilter);
  const inventory  = getInventory(activeDest, archetypeFilter);
  const hasCurated = getCurated(activeDest, "Todos", "Todos").length > 0;

  return (
    <>
      <style>{FONTS}</style>

      {/* Nav */}
      <TopNav />

      {/* Hero + search + both filter rows */}
      <HeroSection
        searchVal={searchVal}           setSearchVal={setSearchVal}
        priceFilter={priceFilter}       setPriceFilter={setPriceFilter}
        archetypeFilter={archetypeFilter} setArchetypeFilter={setArchetypeFilter}
      />

      {/* Curated hotels — Case A: editorial cards, Case B: AI guidance */}
      <CuratedSection curated={curated} hasCurated={hasCurated} activeDest={activeDest} />

      {/* Neighborhood guide */}
      {getHoods(activeDest).length > 0 && <NeighborhoodSection activeDest={activeDest} />}

      {/* More stays — Stay22 inventory, filtered by archetype */}
      {inventory.length > 0 && <MoreStaysSection inventory={inventory} />}

      {/* Smart Finds */}
      <SmartFindsSection />

      {/* Planner CTA banner */}
      <PlannerBanner />

      {/* Newsletter banner */}
      <NewsletterBanner />

      {/* Prototype mode indicator */}
      <ModeTag hasCurated={hasCurated} activeDest={activeDest} archetypeFilter={archetypeFilter} />
    </>
  );
}
