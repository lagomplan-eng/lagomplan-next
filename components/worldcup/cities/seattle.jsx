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
const CITY_ACCENT = "#4A7C7E";
const SECTION_ALT_BG = "#F4F0EB";
const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>{children}</span>
);

const SEA = {
  id:"sea", city:"Seattle", country:"Estados Unidos", state:"Washington", flag:"🇺🇸", accent:CITY_ACCENT,
  tags:["USMNT","Pacific NW","Ciudad compacta","Sede co-anfitriona"],
  stadium:{ name:"Seattle Stadium (Lumen Field)", capacity:"~69,000", area:"South Downtown — a 10 min caminando del Pike Place Market" },
  headline:"La única sede del torneo donde el estadio está a diez minutos caminando del mercado de pescado más famoso de Norteamérica. Aprovéchalo antes del partido.",
  description:"Seattle llega al Mundial con 6 partidos, el estadio más ruidoso de la NFL y el USMNT en casa el 19 de junio. Lumen Field amplifica el sonido por diseño — para USA vs. Australia, esa acústica va a demostrar por qué Seattle tiene la reputación de fanáticos que tiene. El Link Light Rail conecta el aeropuerto, Capitol Hill y el estadio sin transbordo.",
  scores:[
    { label:"Ambiente", value:5 }, { label:"Fútbol local", value:4 }, { label:"Gastronomía", value:5 },
    { label:"Transporte", value:4 }, { label:"Seguridad", value:4 }, { label:"Costo", value:2 },
  ],
  matches:[
    { id:"m1", date:"15 Jun", day:"Dom", time:"12:00 PT", teams:[{name:"Bélgica",flag:"🇧🇪"},{name:"Egipto",flag:"🇪🇬"}], stadium:"Lumen Field", tag:"Grupo G · Apertura", highlight:false },
    { id:"m2", date:"19 Jun", day:"Vie", time:"12:00 PT", teams:[{name:"Estados Unidos",flag:"🇺🇸"},{name:"Australia",flag:"🇦🇺"}], stadium:"Lumen Field", tag:"Grupo D · USMNT", highlight:true },
    { id:"m3", date:"24 Jun", day:"Mié", time:"12:00 PT", teams:[{name:"Bosnia",flag:"🇧🇦"},{name:"Qatar",flag:"🇶🇦"}], stadium:"Lumen Field", tag:"Grupo B", highlight:false },
    { id:"m4", date:"26 Jun", day:"Vie", time:"20:00 PT", teams:[{name:"Egipto",flag:"🇪🇬"},{name:"Irán",flag:"🇮🇷"}], stadium:"Lumen Field", tag:"Grupo G", highlight:false },
    { id:"m5", date:"29 Jun", day:"Lun", time:"TBD",      teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Lumen Field", tag:"Ronda de 32", highlight:false },
    { id:"m6", date:"6 Jul",  day:"Lun", time:"20:00 PT", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"Lumen Field", tag:"Ronda de 16", highlight:true },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"Seattle Stadium (Lumen Field)" },
      { label:"Aforo", value:"~69,000 — configuración FIFA (el diseño de cubierta parcial amplifica el ruido; considerado el estadio más ruidoso de la NFL)" },
      { label:"Clima (jun–jul)", value:"Días: 18–24°C · Noches: 12–15°C · La sede más fresca del torneo en EE.UU. — chaqueta ligera para partidos nocturnos" },
      { label:"Partidos", value:"6 confirmados — 4 grupos + Ronda de 32 + Ronda de 16. Tres de los cuatro de grupos arrancan al mediodía PT." },
      { label:"Ubicación", value:"South Downtown — a 10 min caminando del Pike Place Market y 15 de Pioneer Square. Link Light Rail directo desde aeropuerto y Capitol Hill." },
      { label:"Aeropuerto", value:"SEA — Seattle-Tacoma International · Link Light Rail directo al centro en ~40 min (misma línea que llega al estadio)" },
    ],
    body:"Seattle es compacta para su impacto. Lumen Field está en el extremo sur del downtown, a diez minutos caminando del Pike Place Market y a quince de Pioneer Square. El 19 de junio, Estados Unidos vs. Australia va a ser el partido más ruidoso del torneo — Lumen Field tiene una acústica diseñada para amplificar al fanático, y 69,000 personas van a usarla. La ciudad más fría del torneo norteamericano tiene también el café más serio, el marisco más fresco y las montañas más cinematográficas a dos horas.",
    lagomNote:"El 19 de junio (USMNT vs. Australia) es el partido de mayor demanda de la sede. Los hoteles en downtown y Capitol Hill para esa fecha se agotan con meses de anticipación. Airbnb en Beacon Hill (10 min en Link del estadio) o Columbia City son alternativas razonables con buena conexión.",
  },
  vibe:{
    body:"Seattle Sounders tiene la mayor asistencia promedio de la MLS desde hace más de una década. La Emerald City Supporters y los grupos organizados han construido una cultura de tribuna comparable a cualquier barra latinoamericana o europea. El 19 de junio no es solo un partido de fútbol — es la ciudad entera que lleva años esperando este momento. Paralelamente, café de especialidad de nivel internacional, marisco del Pacífico Norte más fresco del continente y una de las mejores escenas de cocina japonesa fuera de Japón. Seattle come bien y bebe mejor.",
    lagomNote:"Subestimar el frío nocturno es el error recurrente. Junio en Seattle tiene días de 22°C pero noches de 12°C — y Lumen Field es al aire libre. Con el viento del Puget Sound, la temperatura percibida puede bajar hasta los 8–9°C. Una chaqueta ligera no es opcional para los partidos de las 8pm.",
  },
  stays:[
    { name:"Hotel Theodore", area:"Downtown / 2nd Avenue", price:"$$$", priceCAD:"$260–450 USD/noche (periodo mundialista)", tags:["Boutique","Pacific NW","6 cuadras al estadio"], note:"Uno de los hoteles de diseño más coherentes del downtown de Seattle: habitaciones con referencia a la cultura del Pacífico Noroeste, bar activo con selección de whisky de Washington State y a seis cuadras del estadio caminando. La opción más cómoda para los partidos de mediodía.", best_for:"Carácter", url:"https://booking.stay22.com/lagomplan/gsXS841AN9" },
    { name:"Green Tortoise Hostel", area:"Pike Place Market / Post Alley", price:"$", priceCAD:"$65–140 USD/noche según tipo de habitación", tags:["Presupuesto","Al lado del Market","Ambiente internacional"], note:"El hostal más bien ubicado de Seattle: en el edificio de Post Alley, literalmente al lado del Pike Place Market. Habitaciones privadas y compartidas, ambiente internacional desde el primer día y la posición más envidiable de cualquier alojamiento económico de la ciudad.", best_for:"Presupuesto", url:"https://booking.stay22.com/lagomplan/F3ruuST9Kf" },
    { name:"Fairmont Olympic Hotel", area:"Downtown / 4th Avenue", price:"$$$$", priceCAD:"$420–750 USD/noche (periodo mundialista)", tags:["Lujo desde 1924","Histórico","9 cuadras al estadio"], note:"El gran hotel histórico de Seattle desde 1924: salones de mármol, servicio de concierge que funciona y habitaciones que no necesitan disculpa. A nueve cuadras del estadio caminando por 1st Avenue — la ruta más directa en días de partido.", best_for:"Lujo", url:"https://booking.stay22.com/lagomplan/Hx62afpwq-" },
  ],
  logistics:{
    transport:[
      { icon:"🚈", title:"Ruta maestra — Link Light Rail → Stadium Station", text:"La Stadium Station del Link Light Rail está en la puerta norte de Lumen Field. Desde Capitol Hill Station: 5 minutos. Desde University Street Station (downtown): 8 minutos. Desde SEA (aeropuerto Sea-Tac): 40 minutos directos, sin transbordo, en la misma línea 1. La tarifa varía por distancia: desde Capitol Hill al estadio, ~$2.75. Desde el aeropuerto: $3.50." },
      { icon:"🚶", title:"Caminando desde Pioneer Square", text:"El estadio está a 10 minutos caminando por la 1st Avenue desde Pioneer Square. Para el fan con base en el centro, la caminata es la ruta más simple — y la que evita la saturación de la estación Stadium en el post-partido." },
      { icon:"🌙", title:"Partidos nocturnos — Link hasta medianoche", text:"El Link opera hasta la medianoche. Regreso desde el estadio: servicio disponible hasta ~00:30. Para partidos que terminan pasadas las 10pm, el Link es la única opción predecible — el Uber en surge post-partido en Pioneer Square puede tardar 30–50 minutos en alta demanda." },
      { icon:"⚠️", title:"Error crítico — subestimar el frío nocturno", text:"Seattle en junio tiene días de 22°C pero noches de 12°C — y Lumen Field es al aire libre. El partido de las 8pm (26 Jun, Egipto vs. Irán) termina pasadas las 10pm. Con el viento del Puget Sound, la temperatura percibida puede bajar hasta los 8–9°C. Una chaqueta ligera no es opcional para las noches en el estadio, independientemente de cómo sea el día.", isWarning:true },
    ],
    timings:[
      { label:"Capitol Hill Station en Link", value:"~5 min" },
      { label:"Downtown (University Street) en Link", value:"~8 min" },
      { label:"SEA (aeropuerto) en Link directo", value:"~40 min" },
      { label:"Pioneer Square caminando por 1st Ave", value:"~10 min" },
      { label:"Uber desde Capitol Hill (normal / post-USMNT)", value:"10–15 min · 25–40 min" },
    ],
    matchDayCronologia:{
      matchName:"19 Jun · USMNT vs. Australia · 12:00 PT",
      steps:[
        { time:"H-4:00", text:"Desayuna en el Pike Place Market antes de que se llene de pre-partido. A las 8am todavía puedes encontrar mesa en los locales de la galería interior." },
        { time:"H-3:00", text:"Las calles alrededor del estadio empiezan a llenarse. Si vas caminando desde Pioneer Square, sal sin prisa." },
        { time:"H-2:00", text:"Link desde tu estación o caminata desde Pioneer Square. Llega antes de que se formen las colas." },
        { time:"H-1:30", text:"Dentro del estadio. El ruido de Lumen Field empieza mucho antes del pitido inicial." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo. Prepara los oídos." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:30", text:"Link de regreso inmediatamente o caminata hasta Pioneer Square. La estación Stadium se satura — ten paciencia o espera 15 minutos dentro del recinto." },
      ],
    },
    timing:"Lumen Field tiene la logística de tránsito público más limpia de cualquier sede del torneo en EE.UU., junto con el GO Train de Toronto. Una sola decisión: Link. El estadio, el aeropuerto y Capitol Hill comparten línea.",
    cost:"Seattle es cara — en parte por el mismo fenómeno que Vancouver: ciudad tech con vivienda y hostelería en tensión permanente. El período mundialista empuja ese techo aún más arriba, especialmente para el partido de USMNT. Airbnb en Capitol Hill, Fremont o Beacon Hill es el margen de ahorro.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Seattle Center", type:"Fan fest oficial", typeColor:T.coral, desc:"El Fan Fest se instala en el complejo cultural construido para la Exposición Universal de 1962 que incluye la Space Needle, el MoPOP y el Chihuly Garden and Glass. Pantallas de gran formato en los prados centrales, programación musical y el contexto más cinematográfico de cualquier Fan Fest del torneo norteamericano. Acceso por Monorail desde Westlake Center en 2 minutos.", tag:"Seattle Center" },
    { title:"Occidental Square (Pioneer Square)", type:"Plaza histórica", typeColor:T.fjord, desc:"La plaza empedrada del barrio más antiguo de Seattle activa transmisiones para partidos de alta demanda desde sus pantallas exteriores. Para el partido de USMNT del 19 de junio, Pioneer Square va a ser el segundo punto de concentración de la ciudad — a diez minutos caminando del estadio y sin necesidad de registro.", tag:"Pioneer Sq" },
    { title:"Cal Anderson Park (Capitol Hill)", type:"Parque de barrio", typeColor:T.sage, desc:"El parque más activo de Capitol Hill tiene canchas de fútbol — con historia de ligas locales que llevan jugando ahí desde los 90 — y espacio para transmisiones informales. La comunidad de fanáticos del Sounders usa Cal Anderson como punto de reunión orgánico. Para Bélgica vs. Egipto o Egipto vs. Irán, el parque convoca a las diásporas del barrio.", tag:"Capitol Hill" },
    { title:"Fuel Sports (First Hill)", type:"Sports bar", typeColor:T.pine, desc:"El bar de deportes más serio de Seattle, con pantallas en cada ángulo y la mayor concentración de aficionados al fútbol por metro cuadrado de la ciudad. Para el partido de USMNT, llega dos horas antes — se llena rápido y sin aviso. Cocina de bar americana con buenas opciones y sin pretensiones de otra cosa.", tag:"USMNT" },
    { title:"The George & Dragon Pub (Fremont)", type:"Pub inglés", typeColor:"#1A3A5C", desc:"El pub inglés más auténtico de Seattle, con una clientela que va desde los fans del Arsenal hasta los de la selección belga. Para el partido del 15 de junio (Bélgica vs. Egipto), Fremont tiene el ambiente correcto. La cocina es de pub inglés honesto — sin complicaciones, sin precios de hotel.", tag:"Fremont" },
    { title:"Rhein Haus (Capitol Hill)", type:"Cervecería alemana", typeColor:"#4A7C7E", desc:"Salón de curling convertido en bar alemán con cerveza de barril y pantallas para cada partido. Para los aficionados de países germanoparlantes y los que prefieren ver el partido con una Hefeweizen en la mano y espacio para sentarse. El lugar más inusual y más funcional de Capitol Hill para ver el Mundial.", tag:"Curling bar" },
  ],
  food:[
    { dish:"Fuel Sports", where:"First Hill — alitas + cerveza local del noroeste; el bar más futbolero de Seattle, el primero que se llena en días de USMNT", price:"$$", type:"Sports bar" },
    { dish:"The George & Dragon", where:"Fremont — bangers & mash + pinta inglesa; el pub europeo más auténtico del norte de Seattle", price:"$$", type:"Pub inglés" },
    { dish:"Rhein Haus", where:"Capitol Hill — pretzel gigante + Hefeweizen; curling bar convertido en cervecería alemana con espacio para sentarse", price:"$$", type:"Cervecería" },
    { dish:"Pike Place Chowder", where:"Pike Place Market — clam chowder de referencia; la fila vale la pena antes del partido de mediodía", price:"$", type:"Local" },
    { dish:"Café de especialidad", where:"Victrola (Capitol Hill) / Lighthouse Roasters (Fremont) / Caffe Vita; Seattle tiene la 2ª mayor concentración de cafés de especialidad del mundo", price:"$", type:"Ritual" },
    { dish:"Marisco del Pacífico NW", where:"Taylor Shellfish en Capitol Hill — ostras frescas sin intermediarios; el marisco más fresco del continente", price:"$$", type:"Pacific NW" },
  ],
  experiences:[
    { title:"Pike Place Market + Olympic Sculpture Park + Waterfront", duration:"Medio día a día completo", desc:"El Pike Place Market en su versión completa — no solo el puesto de los lanzadores de pescado, sino el laberinto de tres plantas de importadores de especias, quesos locales, flores y artesanía — merece dos horas sin prisa. A cuatro cuadras al norte, el Olympic Sculpture Park del Seattle Art Museum tiene esculturas de Richard Serra y Alexander Calder al borde del Puget Sound con vistas a las montañas Olympic — entrada gratuita. El Waterfront renovado completa el itinerario con el Ferry Terminal.", type:"Ciudad", affiliateLink:"", affiliateLabel:"Ver Market" },
    { title:"Seattle Center — Pacific Science + MoPOP + Space Needle", duration:"Día completo", desc:"El Pacific Science Center tiene el planetario más moderno del Noroeste, exposiciones interactivas para todas las edades y mariposas tropicales vivas ($26 adultos). A cien metros, el Museum of Pop Culture (MoPOP) — diseñado por Frank Gehry — tiene colecciones sobre Jimi Hendrix, Nirvana y Star Wars ($30 adultos). La Space Needle, enfrente, tiene el mirador más famoso de la ciudad. El día más completo de cualquier sede del torneo para familias.", type:"Familiar", affiliateLink:"", affiliateLabel:"Ver entradas" },
    { title:"Mount Rainier National Park (excursión de día)", duration:"Día completo", desc:"A 90 kilómetros al sureste de Seattle, el Monte Rainier es el volcán activo más alto de EE.UU. En junio hay campos de flores silvestres en Sunrise y Paradise — los dos centros de visitantes del parque. El drive desde Seattle toma 90 minutos; desde el parque, el Rainier a 4,392 metros crea un telón de fondo que ninguna otra sede del torneo puede ofrecer.", type:"Naturaleza", affiliateLink:"", affiliateLabel:"Ver info" },
    { title:"Ferry a Bainbridge Island", duration:"Medio día", desc:"El ferry desde el Colman Dock sale cada 35 minutos hacia Bainbridge Island — 35 minutos de travesía con vistas al skyline de Seattle y a las montañas Olympic. La isla tiene el pueblo más fotogénico del Puget Sound: galerías, cafés y senderos costeros. Ferry: $9 ida. Plan perfecto para las mañanas previas a partidos de mediodía.", type:"Agua", affiliateLink:"", affiliateLabel:"Ver horarios" },
  ],
  lagomTips:[
    "Link Light Rail es la única decisión: conecta el aeropuerto, Capitol Hill y Lumen Field sin transbordo. Stadium Station está en la puerta norte.",
    "El 19 de junio (USMNT vs. Australia) es el partido de mayor demanda de la sede. Los hoteles se agotan con meses de anticipación — Beacon Hill y Columbia City son las alternativas razonables.",
    "Chaqueta ligera obligatoria para partidos nocturnos. Junio en Seattle: días 22°C, noches 12°C, viento del Puget Sound — percepción real de 8–9°C.",
    "Pike Place Market antes de las 9am te da mesa en la galería interior. A las 10am ya está saturado y hasta el post-partido no se vacía.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Tarjeta ORCA cargada o pago sin contacto en Link",
    "Chaqueta ligera (obligatoria para partidos de las 20:00 PT)",
    "Bolso claro obligatorio",
    "Agua — Seattle junio es fresco pero el estadio se calienta en partido soleado",
    "Reserva de hotel confirmada para el 19 de junio si es USMNT",
    "Horario del último Link anotado si el partido es nocturno",
    "Plan para Pike Place Market o Pioneer Square pre-partido",
  ],
  didYouKnow:"Lumen Field es considerado el estadio más ruidoso de la NFL — el diseño de cubierta parcial atrapa y canaliza el sonido hacia el campo. Cuando la afición de los Seattle Sounders llena el estadio, se registran ovaciones de más de 136 decibeles — equivalente al despegue de un avión a diez metros.",
  closingNote:"Seattle llega al Mundial con seis partidos y el partido del USMNT más ruidoso del torneo completo. Lumen Field tiene una acústica diseñada para amplificar al fanático — y el 19 de junio, 69,000 personas van a usarla. La ciudad más fría del torneo norteamericano tiene también el café más serio, el marisco más fresco y las montañas más cinematográficas a dos horas. El Link Light Rail va directo al estadio desde el aeropuerto, desde Capitol Hill y desde el downtown sin transbordo. LagomPlan te da la estación correcta, la chaqueta para la noche del 26 de junio y la ostra del mediodía antes del partido. El resto lo hace el Rainier de fondo.",
  closingSignature:"Lagomplan · Guía de campo · Seattle · Mundial 2026",
  plannerCTA:"Generar mi viaje a Seattle",
};

const SeaIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#D8E4E0" rx={RADIUS} />
    {/* Mount Rainier silhouette in back */}
    <path d="M0,108 L60,72 L100,56 L130,72 L180,52 L220,72 L280,108 Z" fill="#A8BFB8" opacity="0.55" />
    <path d="M90,62 L100,56 L110,62 Z" fill="#FFFFFF" opacity="0.8" />
    <path d="M172,58 L180,52 L188,58 Z" fill="#FFFFFF" opacity="0.7" />
    {/* Water */}
    <rect x="0" y="108" width="280" height="32" fill="#7A9CA8" />
    {/* Space Needle */}
    <rect x="50" y="52" width="3" height="56" fill="#4A7C7E" opacity="0.75" />
    <ellipse cx="51.5" cy="48" rx="11" ry="4" fill="#4A7C7E" opacity="0.75" />
    <path d="M47 48 L56 48 L52 42 Z" fill="#4A7C7E" opacity="0.7" />
    {/* Seattle skyline */}
    <rect x="82"  y="64" width="12" height="44" fill="#2D4F6C" opacity="0.5" rx={1} />
    <rect x="98"  y="54" width="14" height="54" fill="#2D4F6C" opacity="0.55" rx={1} />
    <rect x="116" y="46" width="16" height="62" fill="#2D4F6C" opacity="0.6" rx={1} />
    <rect x="136" y="58" width="12" height="50" fill="#2D4F6C" opacity="0.5" rx={1} />
    <rect x="152" y="48" width="14" height="60" fill="#2D4F6C" opacity="0.55" rx={1} />
    <rect x="170" y="64" width="10" height="44" fill="#2D4F6C" opacity="0.45" rx={1} />
    {/* Ferry on water */}
    <rect x="218" y="114" width="26" height="6" fill="#FFFFFF" opacity="0.7" rx={1} />
    <rect x="224" y="110" width="14" height="4" fill="#FFFFFF" opacity="0.65" rx={1} />
    <text x="258" y="24" fontSize="16" textAnchor="middle">🇺🇸</text>
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
      <SeaIllustration />
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
      <GuideDetail guide={SEA} onBack={() => {}} />
    </>
  );
}
