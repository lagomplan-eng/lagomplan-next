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
const CITY_ACCENT = "#2D4F6C";
const SECTION_ALT_BG = "#F4F0EB";
const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>{children}</span>
);

const BOS = {
  id:"bos", city:"Boston", country:"Estados Unidos", state:"Massachusetts", flag:"🇺🇸", accent:CITY_ACCENT,
  tags:["Fútbol","Historia","Gastronomía","Sede co-anfitriona"],
  stadium:{ name:"Boston Stadium (Gillette Stadium)", capacity:"~63,815", area:"Foxborough, MA — a 35 km al sur de Boston" },
  headline:"El estadio no está en Boston. El partido sí. Esa distinción vale un tren.",
  description:"El estadio no está en Boston. El partido sí. Esa distinción vale un tren. Boston recibe siete partidos, incluyendo un Cuartos de Final, en una ciudad que se enorgullece de haberle dado al mundo la democracia moderna, la universidad más antigua del hemisferio occidental y el mejor clam chowder del continente. La primera decisión no es qué ver: es cómo llegar a Foxborough.",
  scores:[
    { label:"Ambiente", value:4 }, { label:"Fútbol local", value:3 }, { label:"Gastronomía", value:4 },
    { label:"Transporte", value:3 }, { label:"Seguridad", value:5 }, { label:"Costo", value:2 },
  ],
  matches:[
    { id:"m1", date:"13 Jun", day:"Sáb", time:"21:00 ET", teams:[{name:"Haití",flag:"🇭🇹"},{name:"Escocia",flag:"🏴"}], stadium:"Boston Stadium", tag:"Grupo C", highlight:false },
    { id:"m2", date:"16 Jun", day:"Mar", time:"18:00 ET", teams:[{name:"Playoff IC-2",flag:""},{name:"Noruega",flag:"🇳🇴"}], stadium:"Boston Stadium", tag:"Grupo I", highlight:false },
    { id:"m3", date:"19 Jun", day:"Vie", time:"18:00 ET", teams:[{name:"Escocia",flag:"🏴"},{name:"Marruecos",flag:"🇲🇦"}], stadium:"Boston Stadium", tag:"Grupo C", highlight:false },
    { id:"m4", date:"23 Jun", day:"Mar", time:"16:00 ET", teams:[{name:"Inglaterra",flag:"🏴"},{name:"Ghana",flag:"🇬🇭"}], stadium:"Boston Stadium", tag:"Grupo L", highlight:true },
    { id:"m5", date:"26 Jun", day:"Vie", time:"15:00 ET", teams:[{name:"Noruega",flag:"🇳🇴"},{name:"Francia",flag:"🇫🇷"}], stadium:"Boston Stadium", tag:"Haaland vs. Mbappé", highlight:true },
    { id:"m6", date:"29 Jun", day:"Lun", time:"16:30 ET", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Boston Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m7", date:"9 Jul", day:"Jue", time:"16:00 ET", teams:[{name:"Cuartos de Final",flag:""},{name:"Por definir",flag:""}], stadium:"Boston Stadium", tag:"Cuartos de Final", highlight:true },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"Boston Stadium (Gillette Stadium)" },
      { label:"Aforo", value:"~63,815 — configuración FIFA" },
      { label:"Clima (jun–jul)", value:"Días: 20–28°C · Noches: 14–18°C · Posibilidad de lluvia · Estadio al aire libre y sin techo" },
      { label:"Partidos", value:"7 confirmados — 5 grupos + 1 Ronda de 32 + 1 Cuartos de Final" },
      { label:"Ubicación", value:"Foxborough, MA — a 35 km al sur de Boston. No está en la ciudad. El transporte es la primera decisión de este viaje." },
      { label:"Aeropuerto", value:"BOS — Logan International Airport · en Boston · Silver Line SL1 gratis a South Station en ~20 min" },
    ],
    body:"Boston es una de las cuatro sedes del torneo con Cuartos de Final. La sede recibe a Inglaterra, Francia, Noruega, Escocia, Marruecos, Ghana y Haití. El partido más anticipado es el 26 de junio: Noruega vs. Francia, Haaland vs. Mbappé. Todo lo demás en esta guía parte de una advertencia: Foxborough no es Boston. El estadio está a 35 kilómetros al sur, sin subway, sin bus regular y sin acceso práctico en Uber durante y después del partido.",
    lagomNote:"Boston es cara. El torneo — más Sail Boston 2026 y las celebraciones del 250 aniversario de la ciudad — convierte junio y julio en temporada de precios máximos. Si aún no tienes alojamiento confirmado para julio, Cambridge y Somerville tienen opciones más económicas con acceso por Red Line.",
  },
  vibe:{
    body:"Una de las ciudades más fervientes en términos deportivos de toda Norteamérica recibe a Inglaterra, Francia, Noruega y Escocia. La diáspora anglosajona e irlandesa de Nueva Inglaterra convierte cada uno de esos partidos en una invasión organizada desde el interior. Boston es primero béisbol, luego hockey, luego fútbol americano — el soccer llega en cuarto lugar. El New England Revolution existe y tiene aficionados serios, pero la cultura de fútbol de esta ciudad se construye principalmente sobre comunidades inmigrantes. El Mundial la cambia temporalmente. En comida, Boston es ciudad de cocina seria: el mejor marisco de la Costa Este, una comunidad italiana en el North End con décadas de historia, dim sum en Chinatown y una escena de restaurantes de autor en el South End que compite con cualquier ciudad del país.",
    lagomNote:"El 26 de junio (Noruega vs. Francia), el 23 de junio (Inglaterra vs. Ghana) y el 9 de julio (Cuartos de Final) son las tres fechas de mayor demanda en Boston. Compra el tren y reserva hotel con la misma seriedad que el boleto del partido.",
  },
  stays:[
    { name:"The Newbury Boston", area:"Back Bay / Newbury Street", price:"$$$$", priceCAD:"$380–650 USD/noche (periodo mundialista)", tags:["Hotel boutique","Rooftop","Back Bay"], note:"El hotel más elegante de Newbury Street, inaugurado en 2021 en la histórica sede del Ritz-Carlton de Boston. Rooftop con vistas a toda la ciudad, restaurante de nivel y la dirección más conveniente de Back Bay para tomar el Orange Line hacia South Station.", best_for:"Carácter" },
    { name:"HI Boston", area:"Back Bay / Stuart Street", price:"$", priceCAD:"$60–140 USD/noche según tipo de habitación", tags:["Presupuesto","Habitaciones privadas","Internacional"], note:"El hostal oficial de Hostelling International en Boston, bien ubicado a cuatro cuadras de Back Bay Station. Habitaciones privadas y compartidas disponibles, cocina comunitaria y ambiente de mezcla internacional que encaja perfectamente con el perfil del torneo.", best_for:"Presupuesto" },
    { name:"Mandarin Oriental Boston", area:"Back Bay / Boylston Street", price:"$$$$", priceCAD:"$650–1,200 USD/noche (periodo mundialista)", tags:["Lujo","Spa","Copley Station cerca"], note:"La dirección de lujo más conveniente de Boston para el perfil mundialista: a dos cuadras de Copley Station (Green Line) y a diez minutos de South Station. Spa, restaurante de referencia y habitaciones que no necesitan disculpa la mañana del partido.", best_for:"Lujo" },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Boston — BOS", text:"BOS — Logan International Airport está en Boston. Silver Line SL1 es gratis desde el aeropuerto hasta South Station y tarda aproximadamente 20 minutos. Desde ahí se toma el MBTA Boston Stadium Train hasta Foxboro. Total desde el avión hasta el estadio: aproximadamente 80 minutos, sin taxis ni Uber." },
      { icon:"🚆", title:"Ruta maestra — MBTA Boston Stadium Train", text:"South Station → Foxboro Station directo, sin paradas. El MBTA opera trenes especiales expresos hasta Foxboro Station, a pasos del estadio. El trayecto dura aproximadamente una hora. Son 14 trenes por partido, con una capacidad combinada de ~20,000 pasajeros." },
      { icon:"🎟", title:"Regla de compra del tren", text:"El boleto de ida y vuelta cuesta $80 USD y se compra exclusivamente a través de la aplicación mTicket de la MBTA. No puedes comprar el boleto de tren sin tener primero tu boleto de partido. La MBTA verifica la coincidencia de fecha. Los boletos se agotan y no se venden el día del partido en la estación.", },
      { icon:"⚠️", title:"Error crítico — perder el último tren de regreso", text:"Los trenes salen a partir de 30 minutos después del pitido final. Quien no aborda en los primeros 60 minutos tras el final del partido queda en una zona suburbana sin tránsito regular, con Ubers en modo surge (60–90 minutos de espera y precios de $80–150 USD) y la Ruta 1 completamente paralizada.", isWarning:true },
    ],
    timings:[
      { label:"South Station → Foxboro Station", value:"~60 min" },
      { label:"Back Bay Station → South Station + Stadium Train", value:"~65 min puerta a puerta" },
      { label:"BOS Logan → Silver Line + Stadium Train", value:"~80 min total" },
      { label:"Auto desde Boston por I-95 / Ruta 1", value:"45 min sin tráfico · 90–150 min con tráfico de partido" },
    ],
    matchDayCronologia:{
      matchName:"26 Jun · Noruega vs. Francia · 15:00 ET",
      steps:[
        { time:"H-4:00", text:"Almuerza en tu barrio. El día de Mbappé vs. Haaland no es día para resolver la comida en Foxborough." },
        { time:"H-3:00", text:"Dirígete a South Station. Los grupos de boarding tienen horarios asignados — respétalos." },
        { time:"H-2:30", text:"Aborda el tren. Exactamente una hora de trayecto directo a Foxboro Station." },
        { time:"H-1:30", text:"Llegada al estadio. Las puertas abren ~90 minutos antes. Bolso claro obligatorio." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+0:30", text:"Los trenes de regreso salen 30 minutos después del pitido final. Primer tren, primera salida." },
      ],
    },
    timing:"Foxborough no es Boston. Esta frase debe guiar todas las decisiones de transporte de esta guía. El estadio está a 35 kilómetros al sur, sin subway, sin bus regular, sin acceso práctico en Uber durante y después del partido.",
    cost:"Boston es cara. Junio y julio combinan Mundial, Sail Boston 2026 y celebraciones del 250 aniversario de la ciudad. Para julio, Cambridge y Somerville suelen ser el margen de ahorro con Red Line útil.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Boston City Hall Plaza", type:"Fan fest oficial", typeColor:T.coral, desc:"El Fan Fest de Boston se instala en la plaza del Ayuntamiento, en el corazón del centro histórico de la ciudad. Gratuito, con pantallas de gran formato, activaciones culturales y programación durante todo el torneo. Accesible por Green Line y Blue Line hasta Government Center o por Orange Line hasta State. No requiere tren especial ni reserva anticipada.", tag:"Sin boleto OK" },
    { title:"Christopher Columbus Park (North End / Waterfront)", type:"Pantalla exterior", typeColor:T.fjord, desc:"El parque al borde del puerto de Boston, en el límite entre el North End y el waterfront, tiene vistas directas al puerto y acceso peatonal desde Faneuil Hall. Para los partidos de Francia e Inglaterra — con las comunidades francesa e irlandesa del North End en plena actividad — el ambiente nocturno en el parque es de barrio europeo.", tag:"Waterfront" },
    { title:"Harvard Stadium (Cambridge)", type:"Estadio histórico", typeColor:T.sage, desc:"El estadio universitario más antiguo de los Estados Unidos — construido en 1903, el primero de hormigón armado del mundo — abre sus instalaciones para transmisiones públicas durante eventos deportivos de gran escala. Para el partido de Francia vs. Noruega del 26 de junio, el contexto histórico añade una capa que no tienen los sports bars de Fenway.", tag:"Histórico" },
    { title:"The Banshee (Dorchester)", type:"Pub irlandés", typeColor:T.pine, desc:"El pub irlandés más grande de Boston, con capacidad para más de 500 personas y un ambiente en partidos de Escocia, Inglaterra o Irlanda que transforma el local en algo muy parecido a Dublín en noche de partido. Para el 13 de junio (Haití vs. Escocia) y el 23 de junio (Inglaterra vs. Ghana), The Banshee es el estadio alterno de la ciudad. Qué pedir: Fish & chips + Guinness de barril.", tag:"Dorchester" },
    { title:"The Fours (Downtown)", type:"Sports bar histórico", typeColor:"#1A3A5C", desc:"El bar deportivo de referencia de la ciudad desde 1976, con memorabilia de los Celtics, Bruins y Red Sox por todas las paredes y pantallas en cada ángulo. Para Noruega vs. Francia (26 de junio — Haaland vs. Mbappé), The Fours es donde ver ese partido sin que nadie a tu alrededor esté mirando el teléfono. Qué pedir: Sándwich Reuben + cerveza local de Massachusetts.", tag:"Downtown" },
    { title:"McGann's Irish Pub (North End)", type:"Pub", typeColor:"#5A3A2A", desc:"Pub irlandés en el barrio italiano de Boston. Pantallas en la barra y en el salón principal, menú de pub con opciones razonables y una clientela que mezcla la diáspora irlandesa del North End con turistas que acaban de salir de Neptune Oyster. Para los partidos nocturnos del Grupo L, el ambiente es exactamente el que se espera. Qué pedir: Clam chowder + pinta de Guinness.", tag:"North End" },
  ],
  food:[
    { dish:"The Banshee", where:"Dorchester — fish & chips + Guinness de barril; pub irlandés sin disculpa, el más ruidoso de Boston en días de partido anglosajón", price:"$$", type:"Pre-partido" },
    { dish:"The Fours", where:"Downtown — sándwich Reuben + cerveza local de Massachusetts; deportivo serio, histórico, para el partido que importa", price:"$$", type:"Sports bar" },
    { dish:"McGann's Irish Pub", where:"North End — clam chowder + pinta de Guinness; Boston genuino, sin esfuerzo turístico", price:"$$", type:"Pub" },
    { dish:"Cannoli", where:"North End — Mike's Pastry y Modern Pastry llevan décadas en guerra fría por el mejor cannoli de Boston", price:"$", type:"Ritual" },
    { dish:"Marisco de la Costa Este", where:"Boston — clam chowder, ostras y cocina de puerto que supera cualquier comida dentro del estadio", price:"$$–$$$", type:"Local" },
    { dish:"Dim sum", where:"Chinatown — una de las paradas útiles entre South Station y los días sin partido", price:"$–$$", type:"Barrio" },
  ],
  experiences:[
    { title:"Freedom Trail", duration:"2 horas a día completo", desc:"El Freedom Trail es un recorrido de 4 kilómetros marcado en rojo en el pavimento que conecta 16 sitios históricos de la Revolución Americana: la Old South Meeting House donde se organizó el Boston Tea Party, el cementerio donde descansan Paul Revere y Samuel Adams, el USS Constitution en Charlestown. Se puede hacer a pie desde el North End en dos horas o en un día completo con desvíos. Gratuito en su mayor parte, sin reserva.", type:"Historia", affiliateLink:"", affiliateLabel:"Ver información" },
    { title:"Cambridge — Harvard + MIT", duration:"Medio día", desc:"El campus de Harvard en Cambridge tiene acceso libre a sus patios interiores, museos y la arquitectura georgiana de Harvard Yard. A quince minutos en Red Line desde Downtown Crossing. MIT está a diez minutos caminando de Harvard, con el Media Lab abierto a visitantes los días de semana y la arquitectura de Gehry y Saarinen como atracciones en sí mismas.", type:"Académico", affiliateLink:"", affiliateLabel:"Ver museos" },
    { title:"Cape Cod — excursión de día", duration:"Día completo", desc:"El Cape Cod está a 90 kilómetros al sur de Boston — accesible por autobús desde South Station (Greyhound/Peter Pan, ~2 horas hasta Hyannis) o por auto por la I-6. Las playas de Cape Cod Bay tienen aguas más calmadas que el Atlántico abierto; las de Provincetown, en la punta del cabo, son las más dramáticas. Para el fan que tiene un día libre antes del tramo intenso del calendario de junio.", type:"Costa", affiliateLink:"", affiliateLabel:"Ver opciones de transporte" },
    { title:"North End + Waterfront", duration:"Mañana o tarde", desc:"El North End tiene más de 90 restaurantes italianos en menos de un kilómetro cuadrado. Mike's Pastry y Modern Pastry llevan décadas en guerra fría por el mejor cannoli de Boston. Combínalo con Christopher Columbus Park y el waterfront para un día de ciudad sin logística pesada.", type:"Barrio", affiliateLink:"", affiliateLabel:"Ver opciones" },
  ],
  lagomTips:[
    "Foxborough no es Boston. El estadio está a 35 kilómetros al sur, sin subway, sin bus regular y sin acceso práctico en Uber durante y después del partido.",
    "El MBTA Boston Stadium Train se compra en mTicket, cuesta $80 USD ida y vuelta y exige boleto de partido. No se vende el día del partido en la estación.",
    "El 26 de junio (Noruega vs. Francia), el 23 de junio (Inglaterra vs. Ghana) y el 9 de julio (Cuartos de Final) son las tres fechas de mayor demanda en Boston.",
    "El North End tiene más de 90 restaurantes italianos en menos de un kilómetro cuadrado. Mike's Pastry y Modern Pastry superan cualquier comida dentro del estadio.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Boleto MBTA Stadium Train comprado en mTicket",
    "Horario de boarding del tren confirmado",
    "South Station como punto de salida",
    "Bolso claro obligatorio",
    "Capa ligera de lluvia — estadio al aire libre y sin techo",
    "Reserva de hotel confirmada para Jun 23, Jun 26 o Jul 9",
    "Plan de regreso: abordar dentro de los primeros 60 min tras el partido",
  ],
  didYouKnow:"Harvard Stadium, en Cambridge, es el estadio universitario más antiguo de Estados Unidos. Construido en 1903, fue el primero de hormigón armado del mundo y funciona como punto histórico de pantallas públicas durante eventos deportivos de gran escala.",
  closingNote:"Boston recibe siete partidos en una ciudad que se enorgullece de haberle dado al mundo la democracia moderna, la universidad más antigua del hemisferio occidental y el mejor clam chowder del continente. El estadio está en Foxborough, a una hora en tren. El Fan Fest está en City Hall Plaza, a diez minutos en subway. La ciudad de por medio es lo suficientemente rica en historia, comida y carácter como para que los días sin partido no sean días perdidos. LagomPlan no te pide que te enamores de Boston — solo que compres el boleto del tren con tiempo.",
  closingSignature:"Lagomplan · Guía de campo · Boston · Mundial 2026",
  plannerCTA:"Generar mi viaje a Boston",
};

const BosIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#E8EFF5" rx={RADIUS} />
    <rect x="0" y="98" width="280" height="42" fill="#C8D8E8" />
    <rect x="20" y="60" width="14" height="38" fill="#2D4F6C" opacity="0.4" rx={1} />
    <rect x="38" y="45" width="20" height="53" fill="#2D4F6C" opacity="0.5" rx={1} />
    <rect x="63" y="52" width="16" height="46" fill="#2D4F6C" opacity="0.35" rx={1} />
    <rect x="84" y="40" width="18" height="58" fill="#2D4F6C" opacity="0.45" rx={1} />
    <rect x="107" y="55" width="12" height="43" fill="#2D4F6C" opacity="0.3" rx={1} />
    <rect x="124" y="35" width="16" height="63" fill="#2D4F6C" opacity="0.4" rx={1} />
    <circle cx="220" cy="62" r="18" fill="none" stroke="#2D4F6C" strokeWidth="1.5" opacity="0.25" />
    <rect x="218" y="42" width="4" height="20" fill="#2D4F6C" opacity="0.3" rx={1} />
    <polygon points="212,42 226,42 219,30" fill="#2D4F6C" opacity="0.25" />
    <path d="M155,98 Q180,78 205,95 Q230,78 255,95" stroke="#2D4F6C" strokeWidth="1" fill="none" opacity="0.2" />
    <text x="258" y="30" fontSize="20" textAnchor="middle">🇺🇸</text>
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
    <h2 style={{ ...df(27,700,"italic"), color:T.pine, lineHeight:1.05, marginBottom:subtitle?8:0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.65, margin:0, maxWidth:540 }}>{subtitle}</p>}
  </div>
);
const LagomNote = ({ children }) => (
  <div style={{ display:"flex", gap:16, padding:"18px 22px", background:T.sandLight, borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
    <span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.14em", textTransform:"uppercase", flexShrink:0, marginTop:3 }}>Lagom</span>
    <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:0 }}>{children}</p>
  </div>
);
const ShowMoreToggle = ({ expanded, onToggle }) => (
  <button onClick={onToggle} style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:16, background:"transparent", border:`1px solid ${T.sage}55`, borderRadius:40, ...uf(10,600), color:T.sage, cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 14px", transition:"all 0.18s" }}
    onMouseEnter={e => { e.currentTarget.style.background=T.sageLight; e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.color=T.pine; }}
    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`${T.sage}55`; e.currentTarget.style.color=T.sage; }}>
    {expanded?"Ver menos ↑":"Ver más ↓"}
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
        <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0, ...(open?{}:{ display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{item.desc}</p>
        <ShowMoreToggle expanded={open} onToggle={() => setOpen(!open)} />
      </div>
    </Card>
  );
};
const StayCard = ({ stay }) => (
  <Card hover style={{ display:"flex", flexDirection:"column", height:"100%" }}>
    <div style={{ padding:"22px 22px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ ...df(26,700), color:T.pine, letterSpacing:"-0.02em" }}>{stay.price}</span>
        <Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label>
      </div>
      <div style={{ ...df(17,700), color:T.pine, lineHeight:1.2, marginBottom:4 }}>{stay.name}</div>
      <div style={{ ...uf(12,500), color:T.inkFaint, marginBottom:10 }}>{stay.area}</div>
      {stay.priceCAD && <div style={{ ...uf(12,600), color:CITY_ACCENT, marginBottom:14, letterSpacing:"0.02em" }}>{stay.priceCAD}</div>}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
        {stay.tags.map(tag => <span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint, background:T.sand, padding:"3px 8px", borderRadius:5, border:`1px solid ${T.sandDark}` }}>{tag}</span>)}
      </div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"14px 22px", borderTop:`1px solid ${T.sandDark}` }}>
      <button style={{ width:"100%", padding:"11px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }}
        onMouseEnter={e => e.currentTarget.style.opacity="0.82"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
        Ver opciones →
      </button>
    </div>
  </Card>
);
const FoodCard = ({ item }) => (
  <div style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:CARD_SHADOW, padding:"16px 18px", display:"flex", flexDirection:"column", gap:6 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
      <span style={{ ...uf(13,600), color:T.pine, lineHeight:1.3 }}>{item.dish}</span>
      <span style={{ ...uf(12,500), color:T.inkFaint, flexShrink:0 }}>{item.price}</span>
    </div>
    <p style={{ ...uf(12,400), color:T.inkFaint, lineHeight:1.55, margin:0 }}>{item.where}</p>
    <div style={{ marginTop:4 }}><Label color={T.sage} bg={T.sageLight}>{item.type}</Label></div>
  </div>
);
const LogisticsCard = ({ item }) => (
  <Card style={{ display:"flex", gap:16, padding:"18px 22px", alignItems:"flex-start", borderColor:item.isWarning?`${T.coral}55`:T.sandDark, background:item.isWarning?T.coralLight:T.white }}>
    <div style={{ width:40, height:40, flexShrink:0, background:item.isWarning?T.coral+"20":T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{item.icon}</div>
    <div>
      <div style={{ ...uf(13,700), color:item.isWarning?T.coral:T.pine, marginBottom:6 }}>{item.title}</div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{item.text}</p>
    </div>
  </Card>
);
const GuideSidebar = ({ guide, onPlan }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Card style={{ padding:"22px", background:T.sandLight, borderColor:T.sandDark }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...df(16,700,"italic"), color:T.pine, lineHeight:1.4, marginBottom:16 }}>¿Listo para tu versión del Mundial? Convierte esta guía en un itinerario adaptado a tus tiempos y presupuesto.</p>
        <button onClick={onPlan} style={{ width:"100%", padding:"11px 16px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.82"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          {guide.plannerCTA} →
        </button>
      </Card>
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:13 }}>✦</span></div>
          <Label color={T.pine} style={{ fontSize:11 }}>Notas Lagom</Label>
        </div>
        {guide.lagomTips.map((tip, i) => (
          <div key={i} style={{ display:"flex", gap:11, paddingTop:12, paddingBottom:12, borderBottom:i<guide.lagomTips.length-1?`1px solid ${T.sandDark}`:"none" }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:T.sage, flexShrink:0, marginTop:7 }} />
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{tip}</p>
          </div>
        ))}
      </Card>
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.matchGoldLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:13 }}>☑</span></div>
          <Label color={T.pine} style={{ fontSize:11 }}>Checklist día de partido</Label>
        </div>
        {guide.matchDayChecklist.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => ({...p,[i]:!p[i]}))} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderTop:i>0?`1px solid ${T.sandDark}`:"none", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%" }}>
            <div style={{ width:16, height:16, flexShrink:0, marginTop:2, border:`1.5px solid ${checked[i]?T.sage:T.sandDark}`, borderRadius:4, background:checked[i]?T.sage:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
              {checked[i] && <span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ ...uf(12,400), color:checked[i]?T.inkFaint:T.inkMid, lineHeight:1.55, textDecoration:checked[i]?"line-through":"none", transition:"all 0.15s" }}>{item}</span>
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
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:"0 0 12px" }}>Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.</p>
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
      <h1 style={{ ...df("clamp(44px,5.5vw,72px)",900,"italic"), color:T.pine, lineHeight:0.92, letterSpacing:"-0.03em", marginBottom:22 }}>{guide.city}</h1>
      <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, maxWidth:500, marginBottom:32 }}>{guide.description}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
        {guide.tags.map(tag => <span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`, padding:"5px 13px", borderRadius:40 }}>{tag}</span>)}
        <span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}35`, padding:"5px 13px", borderRadius:40 }}>⚽ {guide.matches.length} partidos</span>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:3 }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:i<=s.value?T.sage:T.sandDark }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}><BosIllustration /></div>
  </div>
);
const MatchCard = ({ match, onPlanAround }) => {
  const isTBD = !match.teams[0].flag && !match.teams[1].flag;
  const borderColor = match.highlight?`${T.matchGold}50`:T.sandDark;
  const accentBar = match.highlight?T.matchGold:isTBD?T.sandDark:CITY_ACCENT;
  return (
    <Card style={{ overflow:"hidden", borderColor, opacity:isTBD?0.55:1 }}>
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
          {match.tag && <span style={{ ...uf(9,700), letterSpacing:"0.08em", textTransform:"uppercase", color:match.highlight?T.matchGold:CITY_ACCENT, background:match.highlight?T.matchGoldLight:CITY_ACCENT+"15", border:`1px solid ${match.highlight?T.matchGold+"50":CITY_ACCENT+"35"}`, padding:"4px 10px", borderRadius:40, flexShrink:0, maxWidth:140, textAlign:"right" }}>{match.tag}</span>}
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
        {!isTBD ? (
          <button onClick={() => onPlanAround && onPlanAround(match)} style={{ width:"100%", padding:"10px", background:"transparent", border:`1px solid ${T.sandDark}`, borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkMid, cursor:"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=CITY_ACCENT; e.currentTarget.style.color=T.pine; e.currentTarget.style.background=T.sageLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=T.sandDark; e.currentTarget.style.color=T.inkMid; e.currentTarget.style.background="transparent"; }}>
            <span style={{ fontSize:12 }}>✦</span> Planear mi viaje alrededor de este partido
          </button>
        ) : (
          <div style={{ ...uf(12,400), color:T.inkFaint, textAlign:"center", padding:"8px 0", fontStyle:"italic" }}>Rival por definir al terminar fase de grupos</div>
        )}
      </div>
    </Card>
  );
};
const NAV_ITEMS = [
  {id:"matches", label:"Partidos"},
  {id:"manifesto", label:"Manifiesto"},
  {id:"stays", label:"Dónde dormir"},
  {id:"vibe", label:"Ambiente"},
  {id:"logistics", label:"Logística"},
];
const StickyNav = ({ active, onNavigate, onBack, city }) => (
  <div style={{ position:"sticky", top:0, zIndex:40, background:`${T.bg}F5`, backdropFilter:"blur(18px)", borderBottom:`1px solid ${T.sandDark}`, height:52, display:"flex", alignItems:"center", padding:"0 40px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none", cursor:"pointer", padding:"0 14px 0 0", marginRight:14, borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em", transition:"color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color=T.pine} onMouseLeave={e => e.currentTarget.style.color=T.inkFaint}>
      ← Guías
    </button>
    <span style={{ ...df(14,700,"italic"), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>{city}</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{ ...uf(10,active===item.id?700:500), letterSpacing:"0.08em", textTransform:"uppercase", color:active===item.id?T.pine:T.inkFaint, background:"none", border:"none", padding:"0 13px", height:"100%", cursor:"pointer", borderBottom:`2px solid ${active===item.id?T.coral:"transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0 }}>{item.label}</button>
    ))}
  </div>
);
const GuideDetail = ({ guide, onBack }) => {
  const [active, setActive] = useState("matches");
  const [showManifesto, setShowManifesto] = useState(false);
  const [showVibe, setShowVibe] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [showExp, setShowExp] = useState(false);
  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(item.id); }, { rootMargin:"-30% 0px -65% 0px" });
      obs.observe(el); observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);
  const scrollTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:"smooth", block:"start" }); };
  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <StickyNav active={active} onNavigate={scrollTo} onBack={onBack} city={guide.city} />
      <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 40px" }}>
        <GuideHero guide={guide} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:52, alignItems:"flex-start" }}>
          <div>
            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos" subtitle="7 partidos confirmados en Boston Stadium. Noruega vs. Francia (26 Jun) y el Cuartos de Final del 9 de julio son los de mayor demanda." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {guide.matches.map(match => <MatchCard key={match.id} match={match} onPlanAround={() => {}} />)}
              </div>
            </section>
            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title="Manifiesto de campo" subtitle="Lo que necesitas saber antes de llegar — y la instrucción que define todo: Foxborough no es Boston." />
              <Card style={{ marginBottom:24, overflow:"hidden" }}>
                <div style={{ height:4, background:CITY_ACCENT }} />
                <div style={{ padding:"20px 24px" }}>
                  {guide.manifesto.stadiumInfo.map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:20, padding:"11px 0", borderBottom:i<guide.manifesto.stadiumInfo.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(11,600), color:T.inkFaint, minWidth:148, flexShrink:0, letterSpacing:"0.05em" }}>{item.label}</span>
                      <span style={{ ...uf(13,500), color:T.ink, lineHeight:1.6 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              {showManifesto && (<><p style={{ ...uf(15,400), color:T.ink, lineHeight:1.9, marginBottom:24, maxWidth:640 }}>{guide.manifesto.body}</p><LagomNote>{guide.manifesto.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showManifesto} onToggle={() => setShowManifesto(!showManifesto)} />
            </section>
            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso" subtitle="Refugios seleccionados cerca de South Station y Back Bay — la logística correcta empieza con la base." />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>Los precios indicados son estimaciones para el periodo mundialista. El 26 de junio (Noruega vs. Francia), el 23 de junio (Inglaterra vs. Ghana) y el 9 de julio (Cuartos de Final) son las tres fechas de mayor demanda. <strong>Cambridge</strong> y <strong>Somerville</strong> tienen alternativas más económicas con Red Line.</p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay => <StayCard key={stay.name} stay={stay} />)}
              </div>
            </section>
            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente" subtitle="Fan Fest en City Hall Plaza, pubs irlandeses históricos y el puerto de Boston en días de partido de Europa." />
              <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe?28:0, maxWidth:640, ...(showVibe?{}:{ display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{guide.vibe.body}</p>
              {showVibe && (<><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>{guide.vibeCards.map(item => <CollapsibleVibeCard key={item.title} item={item} />)}</div><LagomNote>{guide.vibe.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} />
            </section>
            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio" subtitle="MBTA Boston Stadium Train desde South Station. Boleto en mTicket. Primera salida de regreso." />
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:showLogistics?24:0 }}>
                {guide.logistics.transport.slice(0,2).map((item, i) => <LogisticsCard key={i} item={item} />)}
              </div>
              {showLogistics && (<>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                  {guide.logistics.transport.slice(2).map((item, i) => <LogisticsCard key={i} item={item} />)}
                </div>
                <Card style={{ marginBottom:24 }}>
                  <div style={{ padding:"18px 24px" }}>
                    <div style={{ ...uf(10,700), letterSpacing:"0.16em", textTransform:"uppercase", color:T.inkFaint, marginBottom:14 }}>Tiempos reales de desplazamiento</div>
                    {guide.logistics.timings.map((t, i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:i<guide.logistics.timings.length-1?`1px solid ${T.sandDark}`:"none" }}>
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
                      <div key={i} style={{ display:"flex", gap:16, paddingTop:i>0?14:0, paddingBottom:i<guide.logistics.matchDayCronologia.steps.length-1?14:0, borderBottom:i<guide.logistics.matchDayCronologia.steps.length-1?`1px solid ${T.sandDark}`:"none" }}>
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
              </>)}
              <ShowMoreToggle expanded={showLogistics} onToggle={() => setShowLogistics(!showLogistics)} />
            </section>
            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista" subtitle="El mejor marisco de la Costa Este, cannoli del North End, pubs irlandeses y dim sum en Chinatown." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                {guide.food.slice(0,3).map((f, i) => <FoodCard key={i} item={f} />)}
                {showFood && guide.food.slice(3).map((f, i) => <FoodCard key={i+3} item={f} />)}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} />
            </section>
            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio" subtitle="Freedom Trail, Harvard, Cape Cod y el barrio italiano más denso de Norteamérica." />
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {guide.experiences.slice(0,1).map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>{String(i+1).padStart(2,"0")}</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                    </div>
                  </div>
                ))}
                {showExp && guide.experiences.slice(1).map((exp, i) => (
                  <div key={i+1} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>{String(i+2).padStart(2,"0")}</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <ShowMoreToggle expanded={showExp} onToggle={() => setShowExp(!showExp)} />
            </section>
            <section style={{ marginBottom:0, scrollMarginTop:64 }}>
              <div style={{ background:T.pine, borderRadius:RADIUS+2, padding:"48px 44px 44px", position:"relative", overflow:"hidden" }}>
                <div style={{ width:32, height:2, background:T.coral, marginBottom:28, opacity:0.85 }} />
                <blockquote style={{ ...df("clamp(18px,2.4vw,24px)",400,"italic"), color:T.sand, lineHeight:1.75, margin:"0 0 24px", maxWidth:540 }}>"{guide.closingNote}"</blockquote>
                <Label color={`${T.sage}`} style={{ opacity:0.7 }}>{guide.closingSignature}</Label>
              </div>
            </section>
          </div>
          <div style={{ position:"sticky", top:64, alignSelf:"flex-start", paddingBottom:48 }}>
            <GuideSidebar guide={guide} onPlan={() => alert(`Planificador: ${guide.city}`)} />
          </div>
        </div>
        <div style={{ height:96 }} />
      </div>
    </div>
  );
};
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
      <GuideDetail guide={BOS} onBack={() => {}} />
    </>
  );
}
