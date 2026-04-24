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
const CITY_ACCENT = "#C41E3A";
const SECTION_ALT_BG = "#F4F0EB";
const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>{children}</span>
);

const TOR = {
  id:"tor", city:"Toronto", country:"Canadá", state:"Ontario", flag:"🇨🇦", accent:CITY_ACCENT,
  tags:["Primer Mundial 🇨🇦","Multicultural","Sede co-anfitriona"],
  stadium:{ name:"Toronto Stadium (BMO Field)", capacity:"~45,736", area:"Exhibition Place — a 4 km del CN Tower" },
  headline:"El estadio más pequeño del torneo también es el que pone al fanático más cerca del campo. No es una coincidencia.",
  description:"Toronto llega al Mundial con 6 partidos y un primer capítulo histórico: el 12 de junio de 2026, Canadá vs. Bosnia es el primer partido mundialista masculino en suelo canadiense. BMO Field es el estadio más pequeño del torneo (~45,736), con la logística de tránsito público más eficiente de las 16 sedes: el GO Train desde Union Station llega en cinco minutos.",
  scores:[
    { label:"Ambiente", value:5 }, { label:"Fútbol local", value:4 }, { label:"Gastronomía", value:5 },
    { label:"Transporte", value:5 }, { label:"Seguridad", value:5 }, { label:"Costo", value:2 },
  ],
  matches:[
    { id:"m1", date:"12 Jun", day:"Vie", time:"15:00 ET", teams:[{name:"Canadá",flag:"🇨🇦"},{name:"Bosnia",flag:"🇧🇦"}], stadium:"BMO Field", tag:"Grupo B · Histórico", highlight:true },
    { id:"m2", date:"17 Jun", day:"Mié", time:"19:00 ET", teams:[{name:"Ghana",flag:"🇬🇭"},{name:"Panamá",flag:"🇵🇦"}], stadium:"BMO Field", tag:"Grupo L", highlight:false },
    { id:"m3", date:"20 Jun", day:"Sáb", time:"16:00 ET", teams:[{name:"Alemania",flag:"🇩🇪"},{name:"Costa de Marfil",flag:"🇨🇮"}], stadium:"BMO Field", tag:"Grupo E", highlight:true },
    { id:"m4", date:"23 Jun", day:"Mar", time:"19:00 ET", teams:[{name:"Panamá",flag:"🇵🇦"},{name:"Croacia",flag:"🇭🇷"}], stadium:"BMO Field", tag:"Grupo L", highlight:false },
    { id:"m5", date:"26 Jun", day:"Vie", time:"15:00 ET", teams:[{name:"Senegal",flag:"🇸🇳"},{name:"Repechaje IC-2",flag:""}], stadium:"BMO Field", tag:"Grupo I", highlight:false },
    { id:"m6", date:"2 Jul",  day:"Jue", time:"TBD",      teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"BMO Field", tag:"2°K vs. 2°L", highlight:false },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"Toronto Stadium (BMO Field)" },
      { label:"Aforo", value:"~45,736 — configuración FIFA (expandido con 17,756 asientos temporales; el estadio más pequeño del torneo)" },
      { label:"Clima (jun–jul)", value:"Días: 18–26°C · Noches: 13–18°C · Posibilidad de lluvia; estadio al aire libre sin techo" },
      { label:"Partidos", value:"6 confirmados — 5 grupos + Ronda de 32" },
      { label:"Ubicación", value:"Exhibition Place — a 4 km del CN Tower. GO Train directo desde Union Station en 5 minutos." },
      { label:"Aeropuerto", value:"YYZ — Toronto Pearson International (~23 km del estadio). UP Express a Union Station en 25 min." },
      { label:"Visa", value:"Canadá requiere eTA (Electronic Travel Authorization) para muchos países — trámite en línea en canada.ca antes de volar." },
    ],
    body:"El 12 de junio de 2026 es un hecho sin precedente en la historia del deporte canadiense: el primer partido mundialista masculino en suelo de Canadá. Toronto ya vibra con eso meses antes de que empiece. BMO Field es el estadio más pequeño del torneo (~45,736 asientos), expandido con estructuras temporales — también es el que pone a cada fanático más cerca del campo. La logística es la ventaja: GO Train desde Union Station → Exhibition Station en cinco minutos. No hay equivalente más eficiente en las otras 15 ciudades anfitrionas.",
    lagomNote:"El 12 de junio (Canadá vs. Bosnia) es el partido de mayor demanda histórica de la sede. Los hoteles del centro desaparecen meses antes. Evalúa Airbnb en Roncesvalles, Leslieville o el East End — barrios bien conectados por TTC con precios más razonables.",
  },
  vibe:{
    body:"Toronto FC lleva dos décadas construyendo una base de fanáticos de MLS que hoy tiene criterio y volumen. Más del 50% de los residentes de Toronto nacieron fuera de Canadá — lo que significa que cada equipo visitante tiene una tribuna local propia. Una de las ciudades más diversas del mundo en términos culinarios: sin cocina local dominante, con todo lo demás representado: dim sum en Spadina, roti en Kensington, pho en Broadview, pizza napolitana en el centro.",
    lagomNote:"El 12 de junio es el partido más cargado de expectativa de la sede — y posiblemente del torneo para la afición canadiense. Si viajas ese día, reserva todo con meses de anticipación y llega a la ciudad con un día de margen para absorber el ambiente.",
  },
  stays:[
    { name:"The Drake Hotel", area:"Queen West", price:"$$$", priceCAD:"$350–550 CAD/noche (periodo mundialista)", tags:["Boutique","Queen West","Pantallas en restaurante"], note:"Ícono cultural de Toronto desde hace veinte años. Habitaciones con diseño de autor, restaurante propio con buena selección de pantallas para partidos y ubicación perfecta para acceder al GO Train desde Union Station. El hotel que mejor captura el espíritu de Queen West sin intentarlo demasiado.", best_for:"Carácter", url:"https://booking.stay22.com/lagomplan/3yt_JV4N4T" },
    { name:"HI Toronto", area:"Church-Wellesley Village", price:"$", priceCAD:"$60–130 CAD/noche según tipo de habitación", tags:["Presupuesto","HI oficial","Bien conectado TTC"], note:"El hostal oficial de Hostelling International en Toronto tiene habitaciones privadas y compartidas a precios honestos para los estándares de la ciudad. Buena conexión por TTC al centro y al estadio.", best_for:"Presupuesto", url:"https://kayak.stay22.com/lagomplan/SMg1RtvpiQ" },
    { name:"Fairmont Royal York", area:"Downtown / Union Station", price:"$$$$", priceCAD:"$650–1,100 CAD/noche (periodo mundialista)", tags:["Lujo histórico","Cruzando la calle de Union","Acceso GO Train directo"], note:"El gran hotel histórico de Toronto, a metros de Union Station. El acceso al GO Train para Exhibition Place es literalmente cruzando la calle. En un torneo donde la logística manda, esa ventaja es concreta.", best_for:"Lujo", url:"https://booking.stay22.com/lagomplan/UCCZqWSLYk" },
  ],
  logistics:{
    transport:[
      { icon:"🚆", title:"Ruta maestra — GO Train → Exhibition GO Station", text:"El GO Train que sale de Union Station llega a Exhibition GO Station en cinco minutos y el costo ronda los $4 CAD. La estación está literalmente dentro del complejo de Exhibition Place. Es la ruta más rápida, más barata y más predecible de cualquier sede del torneo. No hay equivalente más eficiente en las otras 15 ciudades anfitrionas." },
      { icon:"🚋", title:"Alternativa — TTC Streetcar 509 / 511 → Exhibition Place", text:"El streetcar sale de Union Station y recorre Lake Shore Boulevard West hasta Exhibition Place en unos 20 minutos. Más lento que el GO Train, más barato ($3.30 CAD con Presto), y con la ventaja de que pasa con alta frecuencia. Opción válida si estás cerca del corredor del lago." },
      { icon:"✈", title:"Desde YYZ — UP Express + GO Train", text:"UP Express desde YYZ (Toronto Pearson) a Union Station en 25 minutos por $12 CAD. Desde Union, GO Train al estadio en 5 minutos. Total del aeropuerto al estadio: ~35 minutos sin taxis ni Uber. La combinación más limpia entre aeropuerto y sede del torneo." },
      { icon:"⚠️", title:"Error crítico — ir en auto el 12 de junio", text:"El tráfico alrededor de Exhibition Place y Lake Shore Boulevard West en el partido inaugural de Canadá será de proporciones históricas. El Uber desde cualquier punto del centro tomará entre 45 y 90 minutos. El GO Train tarda cinco minutos desde Union Station — esa comparación dice todo.", isWarning:true },
    ],
    timings:[
      { label:"Union Station en GO Train", value:"~5 min" },
      { label:"Union Station en streetcar 509/511", value:"~20 min" },
      { label:"YYZ en UP Express + GO Train", value:"~35 min total" },
      { label:"Uber desde King West (normal / partido)", value:"10–20 min · impredecible" },
    ],
    matchDayCronologia:{
      matchName:"12 Jun · Canadá vs. Bosnia · 15:00 ET",
      steps:[
        { time:"H-3:00", text:"Desayuna / almuerza en tu barrio. El 12 de junio Toronto entera intenta llegar al mismo lugar." },
        { time:"H-2:30", text:"Dirígete a Union Station caminando o en streetcar." },
        { time:"H-2:00", text:"GO Train a Exhibition. Cinco minutos. Ya estás." },
        { time:"H-1:30", text:"Llegada al estadio. Las puertas abren 90 minutos antes." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo (sin papel)." },
        { time:"H+0:00", text:"Partido — y primer gol en suelo canadiense, si todo sale bien." },
        { time:"H+1:30", text:"GO Train de regreso desde Exhibition. Primera salida después del pitido." },
      ],
    },
    timing:"BMO Field está en Exhibition Place, a 4 kilómetros del CN Tower. Toronto tiene la mejor logística de tránsito público del torneo — sin excepción. El GO Train es la ruta más directa de las 16 sedes.",
    cost:"Ciudad cara en año normal; el Mundial multiplica el precio de hotel y transporte. Reserva con meses de anticipación o usa Airbnb en los barrios conectados por TTC — Roncesvalles, Leslieville, East End.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Fort York National Historic Site", type:"Fan fest oficial", typeColor:T.coral, desc:"El Fan Fest se instala en Fort York, el sitio histórico donde en 1813 se libró la Batalla de York. A diez minutos caminando de BMO Field, es el punto de reunión oficial con pantallas gigantes, activaciones culturales y comida local. Para el fan sin boleto que quiere el ambiente del partido sin estar dentro, es la opción más lógica de Toronto — y con el contexto histórico más interesante de cualquier Fan Fest del torneo.", tag:"Fort York" },
    { title:"Harbourfront Centre (Queens Quay)", type:"Centro cultural", typeColor:T.fjord, desc:"El complejo cultural a orillas del lago Ontario tiene terrazas al aire libre y un anfiteatro exterior que en verano opera como punto de reunión de la ciudad. Para los partidos de Canadá, la vista al lago y al skyline desde el Harbourfront convierte la experiencia en algo que no cabe en un bar.", tag:"Lake Ontario" },
    { title:"Yonge-Dundas Square", type:"Plaza masiva", typeColor:T.sage, desc:"La Times Square de Toronto — pantallas digitales permanentes, espacio peatonal y acceso desde el subway desde todos los puntos de la ciudad. Ruidosa, masiva y sin necesidad de instalación adicional. Para el partido del 12 de junio (Canadá vs. Bosnia), la plaza va a ser el segundo estadio de la ciudad.", tag:"Downtown" },
    { title:"Distillery District (Corktown)", type:"Barrio histórico", typeColor:T.pine, desc:"El complejo de arquitectura victoriana restaurada tiene patios al aire libre que durante el torneo instalan pantallas exteriores. Ambiente de barrio europeo con fanáticos internacionales — el punto más fotogénico de Toronto para ver un partido sin entrar en un bar.", tag:"Victorian" },
    { title:"Real Sports Bar & Grill", type:"Sports bar monumental", typeColor:"#C41E3A", desc:"El bar de deportes más grande de Canadá, con pantallas de formato monumental y capacidad para miles de personas. La experiencia en partidos de Canadá es de las más intensas de la ciudad. Reserva mesa con días de anticipación para el 12 de junio. La comida es de pub americano elevado.", tag:"Canadá HQ" },
    { title:"Fionn MacCool's (múltiples sedes)", type:"Pub irlandés", typeColor:"#2D6B47", desc:"La cadena de pubs irlandeses más confiable de Toronto para ver partidos. Pantallas en cada rincón, ambiente de barra de estadio en días de partido grande y menú de pub sólido. Para el partido de Canadá, cualquiera de sus sedes del downtown se llena dos horas antes del pitido.", tag:"Pub fiable" },
  ],
  food:[
    { dish:"Real Sports Bar & Grill", where:"Air Canada Centre — hamburguesa + cervezas artesanales de Ontario; el bar más grande de Canadá, formato monumental para el partido del 12 Jun", price:"$$", type:"Sports bar" },
    { dish:"Fionn MacCool's", where:"Múltiples sedes downtown — fish & chips + Guinness; pub irlandés confiable, cualquier sede se llena dos horas antes de Canadá", price:"$$", type:"Pub irlandés" },
    { dish:"Bar Raval", where:"Little Italy — pintxos vascos + txakoli; coctelería seria, comida a la altura, para partidos con menos densidad de afición", price:"$$$", type:"Gastro-bar" },
    { dish:"Dim sum en Spadina", where:"Chinatown — Pearl Harbourfront o Dim Sum King; una de las mejores comunidades chinas de Norteamérica", price:"$–$$", type:"Barrio" },
    { dish:"Roti en Kensington", where:"Kensington Market — Patty King o Bacchus Roti Shop; la diáspora caribeña de Toronto cocina roti como nadie fuera de Trinidad", price:"$", type:"Caribe" },
    { dish:"Pho en Broadview", where:"East Chinatown — Pho Hung o Pho 88; la mayor concentración de restaurantes vietnamitas de la ciudad", price:"$", type:"Vietnamita" },
  ],
  experiences:[
    { title:"ROM + Queen West + Barrio de las Artes", duration:"Medio día a día completo", desc:"El Royal Ontario Museum (ROM) en Bloor Street tiene una de las colecciones arqueológicas y de historia natural más importantes de Norteamérica, con secciones dedicadas a culturas mesoamericanas y africanas relevantes para un torneo con 48 naciones. Para la tarde, Queen West al oeste de Bathurst tiene galerías independientes, librerías de segunda mano y cafeterías que llevan décadas sin intentar ser trendy.", type:"Cultural", affiliateLink:"", affiliateLabel:"Ver ROM" },
    { title:"Toronto Islands (ferry desde el centro)", duration:"Día completo", desc:"A 13 minutos en ferry desde los muelles frente al CN Tower (Ferry Terminal, $9 CAD ida y vuelta), las islas ofrecen playas, senderos, alquiler de kayaks y la mejor vista al skyline de Toronto desde el agua. En un día de junio sin partido, no hay mejor plan en la ciudad. El ferry opera desde las 6:30am; en días de partido hay servicio extra.", type:"Agua", affiliateLink:"", affiliateLabel:"Ver ferry" },
    { title:"Kensington Market + Little Italy", duration:"Medio día", desc:"Kensington Market un sábado por la mañana es uno de los mejores mercados callejeros de Norteamérica: ropa vintage, quesos artesanales, frutas exóticas y cafeterías que no sirven café de cadena. Little Italy en College Street está a diez minutos caminando: terrazas, pastelerías italianas y restaurantes que llevan décadas en pie. Plan completo en menos de 3 kilómetros.", type:"Barrio", affiliateLink:"", affiliateLabel:"Ver mapa" },
    { title:"CN Tower + Ripley's Aquarium", duration:"Medio día", desc:"El CN Tower a 553 metros fue el edificio más alto del mundo durante 34 años. EdgeWalk, el paseo al borde de la plataforma abierta a 356 metros, es el atractivo extremo más conocido de la ciudad (con arnés, reserva previa, $225 CAD). A cien metros de la base, el Ripley's Aquarium of Canada tiene el túnel submarino más grande de Norteamérica y tiburones en exhibición permanente. Para familias con niños, combinación clásica.", type:"Icónico", affiliateLink:"", affiliateLabel:"Ver entradas" },
  ],
  lagomTips:[
    "GO Train desde Union Station a Exhibition Station: 5 minutos, $4 CAD. La mejor logística de tránsito público del torneo, sin excepción.",
    "Canadá requiere eTA — no es visa pero sí trámite obligatorio en canada.ca para muchos países. Arregla esto antes de comprar vuelo.",
    "El 12 de junio (Canadá vs. Bosnia) es el primer partido mundialista masculino en suelo canadiense. Los hoteles del centro se agotan meses antes — Roncesvalles y Leslieville son el margen.",
    "Más del 50% de residentes de Toronto nacieron fuera de Canadá. Cualquier selección del mundo tiene tribuna local — aprovecha los barrios de cada diáspora.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "eTA canadiense confirmada (internacionales)",
    "Tarjeta Presto cargada o pago sin contacto en GO/TTC",
    "Union Station identificada como punto de partida",
    "Bolso claro obligatorio",
    "Capa ligera — estadio al aire libre, noches frescas",
    "Reserva de hotel confirmada (con prioridad absoluta para el 12 de junio)",
    "Plan post-partido para celebrar si Canadá anota en casa",
  ],
  didYouKnow:"Toronto es una de las ciudades más diversas del mundo por porcentaje de residentes nacidos fuera del país: más del 50% de la población del área metropolitana nació en otro país. Es mayor proporción que Nueva York, Londres o París. En el Mundial, eso significa que cada partido tiene una tribuna local orgánica para la selección visitante.",
  closingNote:"Toronto llega al Mundial sin necesitar que el torneo le explique quién es. Es una ciudad que ya sabe cocinar cincuenta cocinas, hablar doscientas lenguas y aplaudir a cualquier selección del mundo desde sus propias tribunas. El 12 de junio de 2026 agrega un primer capítulo a la historia del soccer masculino en Canadá. BMO Field es el estadio más pequeño del torneo. También es el que pone a cada fanático más cerca del campo que cualquier otro recinto de las 16 sedes. LagomPlan no necesita agregar más.",
  closingSignature:"Lagomplan · Guía de campo · Toronto · Mundial 2026",
  plannerCTA:"Generar mi viaje a Toronto",
};

const TorIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#E8DCDC" rx={RADIUS} />
    <rect x="0" y="108" width="280" height="32" fill="#8A9EB5" />
    {/* Maple leaf (left, understated) */}
    <path d="M38 28 L42 34 L48 30 L46 38 L52 40 L46 46 L48 54 L42 50 L38 58 L34 50 L28 54 L30 46 L24 40 L30 38 L28 30 L34 34 Z" fill="#C41E3A" opacity="0.6" />
    {/* CN Tower */}
    <rect x="156" y="18" width="4" height="90" fill="#C41E3A" opacity="0.7" />
    <rect x="152" y="60" width="12" height="12" fill="#C41E3A" opacity="0.8" rx={2} />
    <rect x="155" y="18" width="6" height="6" fill="#C41E3A" opacity="0.75" rx={1} />
    {/* Toronto skyline */}
    <rect x="70"  y="66" width="14" height="42" fill="#2D4F6C" opacity="0.5" rx={1} />
    <rect x="88"  y="52" width="12" height="56" fill="#2D4F6C" opacity="0.55" rx={1} />
    <rect x="104" y="44" width="14" height="64" fill="#2D4F6C" opacity="0.6" rx={1} />
    <rect x="122" y="56" width="10" height="52" fill="#2D4F6C" opacity="0.5" rx={1} />
    <rect x="136" y="40" width="12" height="68" fill="#2D4F6C" opacity="0.6" rx={1} />
    <rect x="170" y="50" width="14" height="58" fill="#2D4F6C" opacity="0.55" rx={1} />
    <rect x="188" y="64" width="10" height="44" fill="#2D4F6C" opacity="0.45" rx={1} />
    <rect x="202" y="54" width="14" height="54" fill="#2D4F6C" opacity="0.55" rx={1} />
    <rect x="220" y="66" width="10" height="42" fill="#2D4F6C" opacity="0.4" rx={1} />
    {/* Ferry on lake */}
    <rect x="240" y="116" width="20" height="5" fill="#FFFFFF" opacity="0.7" rx={1} />
    <text x="258" y="22" fontSize="16" textAnchor="middle">🇨🇦</text>
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
      <TorIllustration />
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
      <GuideDetail guide={TOR} onBack={() => {}} />
    </>
  );
}
