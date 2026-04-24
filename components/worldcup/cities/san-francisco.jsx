"use client";
import { useState, useEffect } from "react";

const T = {
  pine:"#0F3A33", sage:"#6B8F86", sageLight:"#EAF2F0",
  sand:"#EDE7E1", sandLight:"#F7F4F1", sandDark:"#D9D2C9",
  coral:"#E1615B", coralLight:"#FCEEED",
  fjord:"#2D4F6C", fjordLight:"#E3EBF2",
  ink:"#1C1C1A", inkMid:"#5A5A56", inkFaint:"#9A9A94",
  white:"#FFFFFF", matchGold:"#B8860B", matchGoldLight:"#FBF5E0", bg:"#fff9f3",
};
const RADIUS = 10;
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";
const CARD_BORDER = "rgba(28,28,26,0.09)";
const CITY_ACCENT = "#B85C3E";
const SECTION_ALT_BG = "#F4F0EB";
const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>{children}</span>
);

const SF = {
  id:"sf", city:"San Francisco / Bay Area", country:"Estados Unidos", state:"California", flag:"🇺🇸", accent:CITY_ACCENT,
  tags:["Pacífico","Gastronomía","Tech","Sede co-anfitriona"],
  stadium:{ name:"San Francisco Bay Area Stadium (Levi's Stadium)", capacity:"~69,391", area:"Santa Clara, CA — a 70 km al sur de San Francisco" },
  headline:"El estadio está en Santa Clara. El fan fest está en San Francisco. La distancia entre ambos define el viaje.",
  description:"La Bay Area recibe 6 partidos del Mundial 2026 en Levi's Stadium — ubicado en Santa Clara, a 70 kilómetros al sur del centro de San Francisco. La decisión de base (SF, San José u Oakland) es tan importante como el boleto del partido. Cuatro de cinco partidos de grupos arrancan a las 21:00 PT, lo que complica el regreso nocturno en Caltrain.",
  scores:[
    { label:"Ambiente", value:4 }, { label:"Fútbol local", value:3 }, { label:"Gastronomía", value:5 },
    { label:"Transporte", value:3 }, { label:"Seguridad", value:4 }, { label:"Costo", value:1 },
  ],
  matches:[
    { id:"m1", date:"13 Jun", day:"Sáb", time:"12:00 PT", teams:[{name:"Qatar",flag:"🇶🇦"},{name:"Suiza",flag:"🇨🇭"}], stadium:"Levi's Stadium", tag:"Grupo B · Diurno", highlight:true },
    { id:"m2", date:"16 Jun", day:"Mar", time:"21:00 PT", teams:[{name:"Austria",flag:"🇦🇹"},{name:"Jordania",flag:"🇯🇴"}], stadium:"Levi's Stadium", tag:"Grupo J", highlight:false },
    { id:"m3", date:"19 Jun", day:"Vie", time:"21:00 PT", teams:[{name:"Türkiye",flag:"🇹🇷"},{name:"Paraguay",flag:"🇵🇾"}], stadium:"Levi's Stadium", tag:"Grupo D", highlight:true },
    { id:"m4", date:"22 Jun", day:"Lun", time:"20:00 PT", teams:[{name:"Jordania",flag:"🇯🇴"},{name:"Argelia",flag:"🇩🇿"}], stadium:"Levi's Stadium", tag:"Grupo J", highlight:false },
    { id:"m5", date:"25 Jun", day:"Jue", time:"19:00 PT", teams:[{name:"Paraguay",flag:"🇵🇾"},{name:"Australia",flag:"🇦🇺"}], stadium:"Levi's Stadium", tag:"Grupo D", highlight:false },
    { id:"m6", date:"1 Jul",  day:"Mié", time:"17:00 PT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Levi's Stadium", tag:"Ronda de 32", highlight:true },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"San Francisco Bay Area Stadium (Levi's Stadium)" },
      { label:"Aforo", value:"~69,391 — configuración FIFA (el único estadio del torneo con paneles solares que generan más energía de la que consume)" },
      { label:"Clima (jun–jul)", value:"Días: 18–26°C · Noches: 12–15°C · Microclimas: SF puede tener niebla y 15°C mientras Santa Clara tiene 28°C el mismo día" },
      { label:"Partidos", value:"6 confirmados — 5 grupos + 1 Ronda de 32. Cuatro de cinco grupos arrancan a las 21:00 PT." },
      { label:"Ubicación", value:"Santa Clara — a 70 km al sur de SF. Acceso por VTA Light Rail (desde San José) o Caltrain (desde SF/Peninsula)." },
      { label:"Aeropuertos", value:"SJC (San José — el más cercano al estadio, ~8 km) · SFO (SF, BART al centro) · OAK (Oakland, BART, económico)" },
    ],
    body:"Levi's Stadium está en Santa Clara, al sur de la Bay Area — no en la ciudad de San Francisco. La decisión de base más importante de esta guía: quedarse cerca del estadio en Santa Clara/San José, o quedarse en San Francisco y asumir el desplazamiento de 70 kilómetros. Ambas tienen lógica según el itinerario. Si tienes varios partidos, San José gana. Si vienes por el único partido diurno del 13 de junio, SF como destino en sí mismo es el mejor plan.",
    lagomNote:"Cuatro de los cinco partidos de grupos arrancan a las 21:00 PT — la hora más tardía de cualquier sede del torneo. El pitido final llega pasadas las 23:00. El Caltrain hacia SF tiene servicio hasta las 00:30, pero no es continuo. Verifica el último tren antes del partido o ten Uber como plan B.",
  },
  vibe:{
    body:"La Bay Area tiene una comunidad futbolera más profunda de lo que el estereotipo tech sugiere: la comunidad latinoamericana del este de la bahía llena los estadios del San José Earthquakes y el Oakland Roots, y las diásporas de Turquía, Austria y Suiza tienen representación orgánica en la región. Los partidos de Paraguay generan además una comunidad paraguaya de California que no tiene representación equivalente en ninguna otra sede del torneo. La Bay Area tiene la escena de restaurantes más sofisticada y más cara de Estados Unidos fuera de Nueva York.",
    lagomNote:"Planifica el alojamiento con meses de anticipación y evalúa alternativas en San José, Oakland o Santa Clara. San Francisco tiene los hoteles más caros de California, y el área metropolitana en su conjunto responde a una economía tech que no ajusta tarifas por el calendario futbolístico.",
  },
  stays:[
    { name:"Hotel Zephyr", area:"San Francisco / Fisherman's Wharf", price:"$$$", priceCAD:"$280–480 USD/noche (periodo mundialista)", tags:["Boutique","Muelle histórico","Vistas a Alcatraz"], note:"En el muelle histórico de SF con vistas a la bahía y al Alcatraz, el Zephyr tiene habitaciones con diseño náutico-contemporáneo, patio exterior con fuegos artificiales y acceso al Embarcadero en 5 minutos a pie. Para el fan que quiere SF completo — con el entendimiento de que el estadio está a 70 km.", best_for:"SF completo", url:"https://booking.stay22.com/lagomplan/4eYFj7a3ys" },
    { name:"Marriott San José", area:"Downtown San José", price:"$$", priceCAD:"$200–350 USD/noche (periodo mundialista)", tags:["Cerca Caltrain","Piscina","Downtown"], note:"Para el fan con varios partidos, el Marriott del downtown de San José tiene acceso al Caltrain (estación San José Diridon, a tres cuadras) y piscina. La opción más eficiente del triángulo SF–SJ–estadio.", best_for:"Varios partidos", url:"https://booking.stay22.com/lagomplan/niw-b1kZGi" },
    { name:"Oakland Marriott City Center", area:"Downtown Oakland / Lake Merritt BART", price:"$$", priceCAD:"$160–280 USD/noche (periodo mundialista)", tags:["BART Lake Merritt","Económico","Mejor precio-posición"], note:"A una cuadra de la estación Lake Merritt del BART — que conecta con el centro de SF en 15 minutos y con la estación de Caltrain de Millbrae (para bajar al sur) en 40. El mejor precio-posición de la Bay Area para el fan que quiere opciones en ambas ciudades.", best_for:"Presupuesto", url:"https://booking.stay22.com/lagomplan/LWLsKjRLvN" },
  ],
  logistics:{
    transport:[
      { icon:"🚈", title:"Desde San José — VTA Light Rail (la ruta más directa)", text:"VTA Light Rail línea Mountain View–Winchester → parada Santa Clara → caminata de 1 km o shuttle de matchday al estadio. Desde Downtown San José (estación San José Diridon): ~20 minutos en Light Rail. Tarifa: $2.50. Esta es la ruta más directa de todas las de la Bay Area para llegar al Levi's." },
      { icon:"🚆", title:"Desde San Francisco — Caltrain expreso", text:"Caltrain desde SF Caltrain Station (4th & King) hasta Santa Clara Station → VTA Light Rail o shuttle al estadio. El Caltrain tiene servicio expreso en días de partido que reduce el trayecto a 45–50 minutos. Total desde SF centro: aproximadamente 70 minutos." },
      { icon:"🚊", title:"Desde Oakland — BART + Caltrain", text:"BART desde Oakland a Millbrae Station → Caltrain a Santa Clara → VTA al estadio. Total: ~75–85 minutos. Alternativa: BART a San José Diridon (no todas las líneas) → VTA al estadio." },
      { icon:"⚠️", title:"Error crítico — Uber desde SF en partido nocturno", text:"Ir en Uber desde San Francisco al estadio en partido nocturno sin haber calculado el precio de regreso. El viaje de ida puede costar $60–80 USD con tráfico. El de regreso a las 23:30, con 69,000 personas saliendo al mismo tiempo, puede superar los $120–150 USD con precio surge y 40–60 minutos de espera. Si sales desde SF, el Caltrain es la única ruta de regreso predecible. Verifica el horario del último tren antes de entrar al estadio.", isWarning:true },
    ],
    timings:[
      { label:"Downtown San José (VTA)", value:"~20 min" },
      { label:"SJC (aeropuerto San José) → Levi's", value:"~15–20 min (el más corto de la Bay)" },
      { label:"SF Caltrain Station (tren expreso)", value:"~55 min" },
      { label:"SFO → BART a Millbrae + Caltrain", value:"~65 min" },
      { label:"Uber desde SF en día de partido", value:"60–90 min · $70–120 USD" },
    ],
    matchDayCronologia:{
      matchName:"19 Jun · Türkiye vs. Paraguay · 21:00 PT",
      steps:[
        { time:"H-4:00", text:"Cena en tu barrio base antes de las 17:30. El Caltrain expreso de noche tiene plaza limitada." },
        { time:"H-2:30", text:"Sale hacia la estación de Caltrain o VTA. Los partidos de noche llenan el tren." },
        { time:"H-1:30", text:"Llegada al estadio. Puertas abiertas 90 minutos antes. El clima de Santa Clara puede diferir del de SF — lleva una capa." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:45", text:"Caltrain de regreso. Verifica el último tren con anticipación. El de las 00:15 desde Santa Clara es el límite para llegar a SF." },
      ],
    },
    timing:"Levi's está en Santa Clara. El Fan Fest está en SF. La distancia entre ambos define el viaje — y la decisión de base condiciona la logística de cada partido. Si tienes varios, San José elimina el problema. Si vienes por uno, SF como destino funciona.",
    cost:"San Francisco tiene los hoteles más caros de California. San José y Oakland son 30–40% más económicos sin renunciar a acceso transit. Los cuatro partidos nocturnos (21:00 PT) hacen que dormir en SF requiera plan de regreso en Caltrain confirmado.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Civic Center Plaza (SF)", type:"Fan fest oficial", typeColor:T.coral, desc:"El Fan Fest de la sede se instala en el Civic Center Plaza frente al Ayuntamiento de San Francisco — uno de los edificios de cúpula dorada más fotografiados de California. Pantallas gigantes, programación cultural y acceso desde cualquier barrio de SF por BART (estación Civic Center/UN Plaza) o a pie desde Hayes Valley. Para los partidos nocturnos en el estadio, el Fan Fest es el punto de reunión previo antes de tomar el Caltrain hacia el sur.", tag:"Civic Center" },
    { title:"Thrive City / Chase Center (Mission Bay, SF)", type:"Plaza con pantalla", typeColor:T.fjord, desc:"La plaza exterior del Chase Center — el estadio de los Golden State Warriors — tiene pantallas permanentes y ya fue sede de la watch party oficial del sorteo del torneo. Con capacidad para miles de personas, acceso por ferry desde el Embarcadero y programación confirmada para el Mundial, es el espacio al aire libre con mayor infraestructura de la región.", tag:"Mission Bay" },
    { title:"Oakland City Hall Plaza", type:"Plaza cívica", typeColor:T.sage, desc:"La plaza cívica frente al Ayuntamiento de Oakland activa transmisiones públicas para eventos deportivos internacionales. La comunidad latinoamericana de Oakland — la segunda mayor del Bay Area — convierte los partidos de sus selecciones en reuniones de barrio que no necesitan convocatoria oficial.", tag:"Oakland" },
    { title:"San José City Hall Plaza (Downtown SJ)", type:"Plaza cívica", typeColor:T.pine, desc:"El gobierno de San José tiene confirmada actividad mundialista en la plaza del Ayuntamiento, a tres cuadras de la estación de Caltrain Diridon. Para el fan con base en el sur de la bahía que quiere ambiente de ciudad sin el desplazamiento a SF.", tag:"South Bay" },
    { title:"Mad Dog in the Fog (Hayes Valley, SF)", type:"Pub inglés", typeColor:"#1A3A5C", desc:"Pub inglés de referencia para el fútbol europeo, abierto desde 1993. Transmite todos los partidos del torneo sin excepción, con pantallas en cada rincón y una clientela que lleva treinta años madrugando para ver la Premier League. Para los partidos de Türkiye, Austria y Paraguay, Mad Dog tiene el ambiente más apropiado de SF.", tag:"Desde 1993" },
    { title:"Kindred (Campbell, South Bay)", type:"Sports bar", typeColor:"#B85C3E", desc:"El sports bar más bien valorado del sur del Bay Area para ver fútbol — pantallas en todos los ángulos, cocina de pub seria y una clientela que incluye a la comunidad de San José Earthquakes. Para el fan con base en San José que no quiere viajar a SF para ver el partido de Paraguay vs. Australia o la Ronda de 32.", tag:"Campbell" },
  ],
  food:[
    { dish:"Mad Dog in the Fog", where:"Hayes Valley, SF — fish & chips + pinta inglesa; pub de fútbol europeo desde 1993, sin rival en criterio", price:"$$", type:"Pub fútbol" },
    { dish:"Thrive City Plaza", where:"Mission Bay, SF — food trucks + cerveza; pantalla al aire libre junto al Chase Center, con brisa de la bahía", price:"$$", type:"Al aire libre" },
    { dish:"Kindred (Campbell)", where:"South Bay — hamburguesa gourmet + cerveza de Silicon Valley; el sports bar mejor valorado del sur de la bahía", price:"$$", type:"South Bay" },
    { dish:"La Taqueria (Mission)", where:"SF Mission District — el burrito de referencia; una cola disciplinada antes del partido diurno del sábado 13", price:"$", type:"Ritual" },
    { dish:"Koi Palace / Yank Sing", where:"Dim sum — Koi Palace en Sunset (el de locales), Yank Sing en Embarcadero (el del centro); ambos antes de la hora punta", price:"$$", type:"Chino" },
    { dish:"Swan Oyster Depot", where:"Polk Street — mariscos de la Costa Oeste sin reservas, en barra; el mejor marisco de SF sin pretensión", price:"$$–$$$", type:"Local" },
  ],
  experiences:[
    { title:"Golden Gate + Marin Headlands + Sausalito", duration:"Medio día a día completo", desc:"El Golden Gate no necesita presentación, pero sí una estrategia: cruzarlo a pie desde el lado de SF en la mañana (sin niebla antes de las 11am) y continuar en bicicleta hasta Sausalito — un recorrido de 12 kilómetros con vistas a la bahía y a la ciudad. El ferry de regreso desde Sausalito a SF dura 30 minutos y llega al Ferry Building. Para el día libre entre el partido del 13 y el del 16 de junio.", type:"Icónico", affiliateLink:"", affiliateLabel:"Ver ferry" },
    { title:"Exploratorium + Aquarium + Academy of Sciences", duration:"Día completo", desc:"Tres museos de primera línea: el Exploratorium en el Embarcadero (650 exhibiciones interactivas de física y biología), el Aquarium of the Bay en Pier 39 (tiburones, rayas y túnel acrílico), y la California Academy of Sciences en Golden Gate Park (planetario de 30 metros, bosque tropical bajo techo y el arrecife más grande del mundo en espacio de museo).", type:"Familiar", affiliateLink:"", affiliateLabel:"Ver entradas" },
    { title:"Napa / Sonoma (excursión de día)", duration:"Día completo", desc:"Napa Valley está a 90 kilómetros al norte de SF por la Highway 29 — accesible en auto en 90 minutos o en tour organizado. Sonoma está a 70 kilómetros al noroeste. Los meses de junio y julio corresponden al período de crecimiento de la vid — no es época de vendimia, pero las bodegas operan con visitas y degustaciones sin la saturación de octubre.", type:"Vino", affiliateLink:"", affiliateLabel:"Ver tours" },
    { title:"Mission District — burritos + murales + bares", duration:"Medio día", desc:"El Mission District tiene la mayor concentración de comunidad latinoamericana de la ciudad, los murales de Balmy Alley y Clarion Alley, y las taquerías de referencia: La Taqueria para el burrito canónico, Tartine Bakery para el pan del día. Por la tarde, 20th Street tiene la mejor escena de bares de barrio de SF sin perder identidad.", type:"Barrio", affiliateLink:"", affiliateLabel:"Ver mapa" },
  ],
  lagomTips:[
    "Levi's Stadium está en Santa Clara — a 70 km al sur de SF. Para varios partidos, la base en San José o Santa Clara elimina el desplazamiento.",
    "Cuatro de los cinco partidos de grupos arrancan a las 21:00 PT. Verifica el horario del último Caltrain antes de entrar al estadio.",
    "El partido del 13 de junio (Qatar vs. Suiza) es el único diurno (12:00 PT). Es el día para hacer SF como destino: burrito en La Taqueria, partido, Fan Fest por la tarde.",
    "SJC es el aeropuerto más cercano al estadio (~15–20 minutos). Si tu itinerario es Mundial-céntrico, vuela ahí en lugar de SFO.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Boleto Caltrain o VTA confirmado",
    "Último tren de regreso anotado (especial si es partido nocturno)",
    "Capa ligera — microclima Santa Clara puede ser frío o caluroso",
    "Bolso claro obligatorio",
    "Uber surge como plan B con presupuesto previsto",
    "Reserva de hotel confirmada según la base (SF / SJ / Oakland)",
    "Hidratación previa — el estadio al aire libre se calienta por la tarde",
  ],
  didYouKnow:"Levi's Stadium es el único estadio del torneo con paneles solares en el techo que generan más energía de la que el estadio consume. Cuando hay partido nocturno, parte de la iluminación viene directamente de la energía acumulada durante el día.",
  closingNote:"San Francisco / Bay Area es la sede más cara, la más geográficamente fragmentada y la más difícil de resolver en términos logísticos. También es la que tiene la gastronomía más sofisticada, el entorno natural más cinematográfico y el viaje en ferry desde el Embarcadero al estadio más pintoresco del torneo — si se confirma esa opción para algunos partidos. Levi's está en Santa Clara. El Fan Fest está en SF. La distancia entre ambos define el viaje. LagomPlan te dice desde qué ciudad quedarte según cuántos partidos tienes, a qué hora toma el Caltrain y por qué el burrito de La Taqueria merece la cola antes del partido diurno del sábado 13 de junio.",
  closingSignature:"Lagomplan · Guía de campo · San Francisco / Bay Area · Mundial 2026",
  plannerCTA:"Generar mi viaje a la Bay Area",
};

const SfIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#E6DAD0" rx={RADIUS} />
    <rect x="0" y="108" width="280" height="32" fill="#8AA7B5" />
    {/* Golden Gate towers */}
    <rect x="42"  y="24" width="10" height="84" fill="#B85C3E" opacity="0.7" rx={1} />
    <rect x="210" y="24" width="10" height="84" fill="#B85C3E" opacity="0.7" rx={1} />
    {/* Bridge deck */}
    <rect x="28"  y="74" width="224" height="5" fill="#B85C3E" opacity="0.55" />
    {/* Suspension cables */}
    <path d="M47,24 Q131,90 215,24" stroke="#B85C3E" strokeWidth="1.5" fill="none" opacity="0.55" />
    <path d="M47,28 Q131,84 215,28" stroke="#B85C3E" strokeWidth="1"   fill="none" opacity="0.4" />
    {/* SF skyline behind (small) */}
    <rect x="62"  y="56" width="10" height="18" fill="#2D4F6C" opacity="0.35" rx={1} />
    <rect x="76"  y="48" width="14" height="26" fill="#2D4F6C" opacity="0.4"  rx={1} />
    <rect x="94"  y="40" width="10" height="34" fill="#2D4F6C" opacity="0.45" rx={1} />
    <rect x="108" y="52" width="12" height="22" fill="#2D4F6C" opacity="0.35" rx={1} />
    <rect x="124" y="34" width="10" height="40" fill="#2D4F6C" opacity="0.5"  rx={1} />
    <rect x="138" y="46" width="14" height="28" fill="#2D4F6C" opacity="0.4"  rx={1} />
    <rect x="156" y="54" width="10" height="20" fill="#2D4F6C" opacity="0.35" rx={1} />
    <rect x="170" y="42" width="14" height="32" fill="#2D4F6C" opacity="0.45" rx={1} />
    <rect x="188" y="56" width="10" height="18" fill="#2D4F6C" opacity="0.35" rx={1} />
    {/* Fog line */}
    <path d="M0,90 Q70,82 140,90 Q210,82 280,90" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.3" />
    <text x="258" y="22" fontSize="16" textAnchor="middle">🇺🇸</text>
  </svg>
);

const Card = ({ children, style={}, onClick, hover=false }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => hover && setIsHovered(true)} onMouseLeave={() => hover && setIsHovered(false)}
      style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:isHovered?"0 4px 16px rgba(28,28,26,0.09), 0 1px 3px rgba(28,28,26,0.05)":CARD_SHADOW, transition:"box-shadow 0.22s, transform 0.22s", transform:isHovered?"translateY(-1px)":"none", cursor:onClick?"pointer":"default", ...style }}>
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
    <h2 style={{ ...uf(27, 700), color:T.pine, lineHeight:1.05, marginBottom:subtitle?8:0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.65, margin:0, maxWidth:540 }}>{subtitle}</p>}
  </div>
);
const LagomNote = ({ children }) => (
  <div style={{ display:"flex", gap:16, padding:"18px 22px", background:T.sandLight, borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
    <span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.14em", textTransform:"uppercase", flexShrink:0, marginTop:3 }}>Lagom</span>
    <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:0 }}>{children}</p>
  </div>
);
const MatchCard = ({ match, onPlanAround }) => {
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
            Rival por definir al terminar fase de grupos
          </div>
        )}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESSIVE DISCLOSURE
// ─────────────────────────────────────────────────────────────────────────────
const ShowMoreToggle = ({ expanded, onToggle }) => (
  <button onClick={onToggle} style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:16, background:"transparent", border:`1px solid ${T.sage}55`, borderRadius:40, ...uf(10,600), color:T.sage, cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 14px", transition:"all 0.18s" }}
    onMouseEnter={e => { e.currentTarget.style.background=T.sageLight; e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.color=T.pine; }}
    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`${T.sage}55`; e.currentTarget.style.color=T.sage; }}>
    {expanded ? "Ver menos ↑" : "Ver más ↓"}
  </button>
);

const CollapsibleVibeCard = ({ item }) => {
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
        <ShowMoreToggle expanded={open} onToggle={() => setOpen(!open)} />
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAY CARD
// ─────────────────────────────────────────────────────────────────────────────
const StayCard = ({ stay }) => (
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
        Ver disponibilidad
      </a>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// FOOD CARD
// ─────────────────────────────────────────────────────────────────────────────
const FoodCard = ({ item }) => (
  <div style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:CARD_SHADOW, padding:"16px 18px", display:"flex", flexDirection:"column", gap:6 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
      <span style={{ ...uf(13,600), color:T.pine, lineHeight:1.3 }}>{item.dish}</span>
      <span style={{ ...uf(12,500), color:T.inkFaint, flexShrink:0 }}>{item.price}</span>
    </div>
    <p style={{ ...uf(12,400), color:T.inkFaint, lineHeight:1.55, margin:0 }}>{item.where}</p>
    <div style={{ marginTop:4 }}>
      <Label color={T.sage} bg={T.sageLight}>{item.type}</Label>
    </div>
  </div>
);

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
const GuideSidebar = ({ guide, onPlan }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      <Card style={{ padding:"22px 22px", background:T.sandLight, borderColor:T.sandDark }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...uf(16, 700), color:T.pine, lineHeight:1.4, marginBottom:16 }}>
          ¿Listo para tu versión del Mundial? Convierte esta guía en un itinerario adaptado a tus tiempos y presupuesto.
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
          <Label color={T.pine} style={{ fontSize:11 }}>Notas Lagom</Label>
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
          <Label color={T.pine} style={{ fontSize:11 }}>Checklist día de partido</Label>
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
        <Label color={T.fjord} style={{ marginBottom:10, display:"block" }}>¿Sabías que?</Label>
        <p style={{ ...uf(13,400), color:T.fjord, lineHeight:1.72, margin:0 }}>{guide.didYouKnow}</p>
      </Card>

      <Card style={{ padding:"18px 22px", borderStyle:"dashed", borderColor:T.sandDark }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>✦</span>
          <div>
            <div style={{ ...uf(12,700), color:T.pine, marginBottom:6 }}>Optimizar itinerario con IA</div>
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:"0 0 12px" }}>
              Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.
            </p>
            <button onClick={onPlan} style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2, padding:"7px 14px", cursor:"pointer", transition:"all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.background=T.pine; e.currentTarget.style.color=T.white; }}
              onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color=T.pine; }}>
              Optimizar ruta →
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
const GuideHero = ({ guide }) => (
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
          ⚽ {guide.matches.length} partidos
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
      <SfIllustration />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STICKY NAV
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {id:"matches",   label:"Partidos"},
  {id:"manifesto", label:"Manifiesto"},
  {id:"stays",     label:"Dónde dormir"},
  {id:"vibe",      label:"Ambiente"},
  {id:"logistics", label:"Logística"},
];

const StickyNav = ({ active, onNavigate, onBack }) => (
  <div style={{ position:"sticky", top:0, zIndex:40, background:`${T.bg}F5`, backdropFilter:"blur(18px)", borderBottom:`1px solid ${T.sandDark}`, height:52, display:"flex", alignItems:"center", padding:"0 40px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none", cursor:"pointer", padding:"0 14px 0 0", marginRight:14, borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em", transition:"color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color=T.pine}
      onMouseLeave={e => e.currentTarget.style.color=T.inkFaint}>
      ← Guías
    </button>
    <span style={{ ...uf(14, 700), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>Ciudad de México</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{ ...uf(10, active===item.id ? 700 : 500), letterSpacing:"0.08em", textTransform:"uppercase", color: active===item.id ? T.pine : T.inkFaint, background:"none", border:"none", padding:"0 13px", height:"100%", cursor:"pointer", borderBottom:`2px solid ${active===item.id ? T.coral : "transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0 }}>{item.label}</button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE DETAIL
// ─────────────────────────────────────────────────────────────────────────────
const GuideDetail = ({ guide, onBack }) => {
  const [active,        setActive]        = useState("matches");
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
        { rootMargin:"-30% 0px -65% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <StickyNav active={active} onNavigate={scrollTo} onBack={onBack} />

      <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 40px" }}>
        <GuideHero guide={guide} />

        <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:52, alignItems:"flex-start" }}>

          {/* ── MAIN ── */}
          <div>

            {/* 01 — MATCHES */}
            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos"
                subtitle="5 partidos confirmados en el Estadio Azteca. México juega el 11 y el 24 de junio — las dos fechas de mayor demanda del torneo en la ciudad." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {guide.matches.map(match => (
                  <MatchCard key={match.id} match={match} onPlanAround={() => {}} />
                ))}
              </div>
            </section>

            {/* 02 — MANIFIESTO */}
            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title="Manifiesto de campo"
                subtitle="Lo que necesitas saber antes de llegar." />
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
              <ShowMoreToggle expanded={showManifesto} onToggle={() => setShowManifesto(!showManifesto)} />
            </section>

            {/* 03 — STAYS */}
            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso"
                subtitle="Refugios seleccionados para recargar energías entre diseño de autor y confort estratégico." />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>
                    Los precios son estimaciones para el periodo mundialista. El 11 de junio (México vs. Sudáfrica, partido inaugural) y el 24 de junio (Rep. Checa vs. México) son las fechas más críticas.
                    Si aún no tienes alojamiento, prioriza Airbnb en <strong>Coyoacán</strong> antes de considerar hoteles de cadena en zonas sobredemandadas. AIFA NO es una opción cercana al estadio — está a 80 km al norte.
                  </p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay => <StayCard key={stay.name} stay={stay} />)}
              </div>
            </section>

            {/* 04 — VIBE */}
            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente"
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
                    {guide.vibeCards.map(item => <CollapsibleVibeCard key={item.title} item={item} />)}
                  </div>
                  <LagomNote>{guide.vibe.lagomNote}</LagomNote>
                </>
              )}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} />
            </section>

            {/* 05 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio"
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
                      <div style={{ ...uf(10,700), letterSpacing:"0.16em", textTransform:"uppercase", color:T.inkFaint, marginBottom:14 }}>Tiempos reales de desplazamiento</div>
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
                        <div style={{ ...uf(11,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.matchGold }}>Cronología recomendada</div>
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
              <ShowMoreToggle expanded={showLogistics} onToggle={() => setShowLogistics(!showLogistics)} />
            </section>

            {/* 06 — FOOD */}
            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista"
                subtitle="CDMX tiene la gastronomía con más diversidad de América Latina — más de 150 tipos de chile y una cocina reconocida por la UNESCO. El reto no es encontrar dónde comer bien, sino elegir." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                {guide.food.slice(0, 3).map((f, i) => <FoodCard key={i} item={f} />)}
                {showFood && guide.food.slice(3).map((f, i) => <FoodCard key={i+3} item={f} />)}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} />
            </section>

            {/* 07 — EXPERIENCES */}
            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio"
                subtitle="El entretiempo ideal para descubrir que hay vida — y mucha cultura — más allá de los 90 minutos." />
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
              <ShowMoreToggle expanded={showExp} onToggle={() => setShowExp(!showExp)} />
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
            <GuideSidebar guide={guide} onPlan={() => { if (typeof window !== "undefined") window.location.href = "/es/planificador?destination=" + encodeURIComponent(guide.city) }} />
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
export default function App() {
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
      <GuideDetail guide={SF} onBack={() => {}} />
    </>
  );
}
