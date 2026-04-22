"use client";
import { useState, useEffect } from "react";

const T = { pine:"#0F3A33", sage:"#6B8F86", sageLight:"#EAF2F0", sand:"#EDE7E1", sandLight:"#F7F4F1", sandDark:"#D9D2C9", coral:"#E1615B", coralLight:"#FCEEED", fjord:"#2D4F6C", fjordLight:"#E3EBF2", ink:"#1C1C1A", inkMid:"#5A5A56", inkFaint:"#9A9A94", white:"#FFFFFF", matchGold:"#B8860B", matchGoldLight:"#FBF5E0", bg:"#fff9f3" };
const RADIUS = 10;
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";
const CARD_BORDER = "rgba(28,28,26,0.09)";
const CITY_ACCENT = "#C4622A";
const SECTION_ALT_BG = "#F4F0EB";
const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>{children}</span>
);

const LA = {
  id:"la", city:"Los Ángeles", country:"Estados Unidos", state:"California", flag:"🇺🇸", accent:CITY_ACCENT,
  tags:["Fútbol","Gastronomía","Cultura","Sede inaugural"],
  stadium:{ name:"SoFi Stadium", capacity:"~70,240", area:"Inglewood — a 30 km al suroeste de DTLA" },
  headline:"El estadio más caro jamás construido alberga el partido inaugural del torneo. En Los Ángeles, hasta las distancias son de película.",
  description:"El estadio más caro jamás construido alberga el partido inaugural del torneo. Los Ángeles no es una ciudad — es una región de diez millones de personas conectada por autopistas. Para el fan mundialista, eso significa una sola cosa: el transporte no se improvisa. La recompensa es una ciudad con la gastronomía más diversa de Norteamérica, playas a treinta minutos del estadio y una afición latinoamericana que hace que los partidos de México suenen como partidos de local.",
  scores:[
    { label:"Ambiente", value:5 }, { label:"Fútbol local", value:4 }, { label:"Gastronomía", value:5 },
    { label:"Transporte", value:2 }, { label:"Seguridad", value:3 }, { label:"Costo", value:2 },
  ],
  matches:[
    { id:"m1", date:"12 Jun", day:"Vie", time:"20:00 PT", teams:[{name:"EUA",flag:"🇺🇸"},{name:"Paraguay",flag:"🇵🇾"}], stadium:"SoFi Stadium", tag:"Partido inaugural del torneo", highlight:true },
    { id:"m2", date:"15 Jun", day:"Dom", time:"16:00 PT", teams:[{name:"Irán",flag:"🇮🇷"},{name:"Nueva Zelanda",flag:"🇳🇿"}], stadium:"SoFi Stadium", tag:"Grupo F", highlight:false },
    { id:"m3", date:"18 Jun", day:"Mié", time:"19:00 PT", teams:[{name:"Suiza",flag:"🇨🇭"},{name:"Bosnia y Herz.",flag:"🇧🇦"}], stadium:"SoFi Stadium", tag:"Grupo D", highlight:false },
    { id:"m4", date:"21 Jun", day:"Sáb", time:"12:00 PT", teams:[{name:"México",flag:"🇲🇽"},{name:"Ecuador",flag:"🇪🇨"}], stadium:"SoFi Stadium", tag:"Grupo G — El Tri en LA", highlight:true },
    { id:"m5", date:"25 Jun", day:"Mié", time:"18:00 PT", teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Grupo H",flag:""}], stadium:"SoFi Stadium", tag:"Grupo H", highlight:false },
    { id:"m6", date:"28 Jun", day:"Sáb", time:"16:00 PT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"SoFi Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m7", date:"2 Jul", day:"Jue", time:"TBD", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"SoFi Stadium", tag:"Fase eliminatoria", highlight:false },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"SoFi Stadium" },
      { label:"Aforo", value:"~70,240 — configuración FIFA" },
      { label:"Techo", value:"Cubierto — el estadio tiene cubierta fija translúcida sin climatización. Protege del sol, no del calor." },
      { label:"Clima (jun–jul)", value:"Días: 24–30°C · Noches: 17–22°C · Seco · El estadio no tiene A/C — lleva ropa ligera" },
      { label:"Partidos", value:"7 confirmados — 5 grupos + 1 Ronda de 32 + 1 Ronda de 16, incluyendo el partido inaugural del torneo" },
      { label:"Aeropuerto", value:"LAX — Los Angeles International · a 8 km del estadio · sin metro directo · taxi/rideshare ~20 min sin tráfico" },
    ],
    body:"SoFi Stadium abre el torneo con el partido inaugural de Estados Unidos. Es el estadio más caro jamás construido — $5.5 mil millones — y está a 8 kilómetros del aeropuerto internacional de Los Ángeles, en el corredor de Inglewood que conecta LAX con el Forum. No tiene metro directo. La ciudad de Los Ángeles tiene más de diez millones de personas, 150 idiomas y la mayor comunidad mexicana fuera de México. Para los partidos de El Tri, el SoFi se convierte en una extensión del Azteca.",
    lagomNote:"Los Ángeles no tiene metro al estadio. El tren de la ciudad (Metro C Line) llega hasta la estación Inglewood, a una caminata de ~20 minutos del SoFi. En días de partido la zona se cierra al auto — la única opción práctica es el shuttle oficial de la FIFA desde el Fan Fest de Hollywood o el Park & Ride en el Forum. Reserva el shuttle con anticipación para el partido inaugural.",
  },
  vibe:{
    body:"La mayor comunidad mexicana de Estados Unidos convierte los partidos de El Tri en eventos de dimensión diferente. La comunidad de la diáspora latinoamericana en Los Ángeles tiene profundidad real: mexicanos, guatemaltecos, salvadoreños, colombianos — todos con clubes y tradiciones en la misma ciudad. Los Angeles FC y LA Galaxy tienen bases de afición organizadas que funcionan bien antes y después de los partidos del torneo. Fuera del fútbol, Los Ángeles tiene la cocina callejera más diversa del continente, playas a treinta minutos del estadio y museos de clase mundial gratuitos los martes.",
    lagomNote:"El partido inaugural (EUA vs Paraguay, 12 de junio) y el de México (21 de junio) generan la mayor demanda de transporte de la sede. Para ambas fechas: reserva shuttle con una semana de anticipación mínimo. El tráfico de Los Ángeles no tiene escala de comparación con ninguna otra ciudad del torneo.",
  },
  stays:[
    { name:"The Line Hotel", area:"Koreatown / Mid-City", price:"$$$", priceCAD:"$200–350 USD/noche (periodo mundialista)", tags:["Diseño","Restaurante de autor","Metro Vermont-Beverly"], note:"El hotel con más personalidad del corredor de Koreatown: arquitectura de los años 60 reformada, restaurantes de Roy Choi y acceso al metro Red Line (Vermont-Beverly a 5 min a pie). Desde ahí, shuttle o Uber al SoFi en 20 minutos. La mejor combinación de carácter y logística mundialista.", best_for:"Carácter", hotel_link:"https://booking.stay22.com/lagomplan/N1JmtuyYd4" },
    { name:"Freehand Los Angeles", area:"Downtown LA / Koreatown", price:"$$", priceCAD:"$120–250 USD/noche (periodo mundialista)", tags:["Smart value","Bar de referencia","Metro cerca"], note:"El hotel de referencia para el viajero con criterio y presupuesto calibrado. Bar en el rooftop, habitaciones privadas bien diseñadas y acceso al metro Red Line desde Wilshire/Vermont. La opción más honesta del torneo para quien quiere ciudad y no solo precio.", best_for:"Smart value", hotel_link:"https://booking.stay22.com/lagomplan/5V1vJ0yXDt" },
    { name:"The West Hollywood Edition", area:"West Hollywood / Sunset Strip", price:"$$$$", priceCAD:"$600–1,200 USD/noche (periodo mundialista)", tags:["Lujo","Piscina en techo","Sunset Strip"], note:"La dirección más impresionante del torneo en Los Ángeles: piscina de diseño con vistas al Hollywood Sign, restaurante del chef John Fraser y ambiente de quienes vienen a LA a hacer algo importante. Para el partido inaugural, la imagen del 12 de junio en West Hollywood no tiene equivalente en ninguna otra sede.", best_for:"Lujo", hotel_link:"https://booking.stay22.com/lagomplan/CF6RTkXV2M" },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Los Ángeles — LAX", text:"LAX está a 8 km del SoFi Stadium y a 25 km del centro de Los Ángeles. El FlyAway bus conecta LAX con el centro (Union Station) en ~50 minutos. El Uber desde LAX al centro cuesta $35–55 sin tráfico; con tráfico de partido puede duplicarse. No hay metro directo desde LAX al centro — la conexión requiere autobús LAX-C/E + Metro." },
      { icon:"🚌", title:"Ruta maestra — Shuttle oficial FIFA", text:"La FIFA opera shuttles desde el Fan Fest de Hollywood Park (junto al SoFi) y desde puntos de Park & Ride en toda la ciudad. El shuttle es la opción más directa para días de partido — sin atascos, sin problema de parking. Reserva en la app oficial con mínimo 5 días de anticipación para el partido inaugural y los partidos de México." },
      { icon:"🚇", title:"Alternativa en metro — Metro C Line", text:"El Metro C Line llega hasta la estación Inglewood, a ~20 minutos caminando del SoFi. Desde el centro (7th St/Metro Center) hasta Inglewood: ~35 minutos. No es la ruta más directa pero funciona con equipaje ligero y es la opción más económica ($1.75). Evítala post-partido de México — las estaciones se saturan." },
      { icon:"⚠️", title:"Error crítico — subestimar las distancias de LA", text:"Los Ángeles no es una ciudad compacta. Lo que en Google Maps parece '30 minutos' puede ser 90 minutos con tráfico de partido. El SoFi está en Inglewood, no en el centro de LA. El centro de LA está a 30 km de West Hollywood. West Hollywood está a 15 km de Santa Mónica. Planifica cada trayecto como si el tráfico fuera doble de lo esperado — porque lo será.", isWarning:true },
    ],
    timings:[
      { label:"LAX → SoFi Stadium (shuttle día de partido)", value:"~25 min" },
      { label:"Downtown LA → SoFi (Metro C Line + caminata)", value:"~55 min" },
      { label:"West Hollywood → SoFi (Uber sin tráfico)", value:"~30 min · con tráfico: 60–90 min" },
      { label:"Hollywood → SoFi (Uber sin tráfico)", value:"~35 min · con tráfico: 70–100 min" },
    ],
    matchDayCronologia:{
      matchName:"12 Jun · EUA vs Paraguay · 20:00 PT — Partido inaugural",
      steps:[
        { time:"H-4:00", text:"Almuerza temprano. El partido inaugural de la noche es el evento más masivo del año en Los Ángeles." },
        { time:"H-3:00", text:"Aborda el shuttle desde Hollywood Park Fan Fest o desde tu Park & Ride asignado." },
        { time:"H-2:00", text:"Llegada al SoFi. Puertas abiertas 2 horas antes del inaugural. El estadio vale llegar antes del partido." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo. La ceremonia inaugural comienza antes del partido." },
        { time:"H+0:00", text:"Partido inaugural." },
        { time:"H+1:45", text:"Shuttle de regreso. No uses Uber post-inaugural — la espera puede ser de 60–90 minutos con surge." },
      ],
    },
    timing:"Los Ángeles no tiene metro al estadio. El shuttle oficial es la única opción que garantiza tiempo de llegada controlado. El tráfico de LA en día de partido grande no tiene parangón con ninguna otra ciudad del torneo.",
    cost:"Una de las ciudades más caras del torneo. El periodo mundialista coincide con la temporada alta de LA. Considera Airbnb en Culver City, Mid-City o Silver Lake — barrios bien comunicados y a precios más razonables que West Hollywood o Santa Mónica.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Hollywood Park", type:"Fan fest oficial", typeColor:T.coral, desc:"El Fan Fest de Los Ángeles se instala en Hollywood Park, el complejo de entretenimiento adyacente al SoFi Stadium. Pantallas de gran formato, programación con artistas locales y activaciones culturales en un recinto diseñado para eventos masivos. La ventaja estratégica: el shuttle al estadio sale desde ahí. Para el fan sin boleto en días de partido de México o EUA, llega con 3 horas de anticipación — se llena.", tag:"Sin boleto OK" },
    { title:"Grand Central Market (Downtown)", type:"Mercado histórico", typeColor:T.fjord, desc:"El mercado cubierto más antiguo de Los Ángeles, en el centro histórico desde 1917, tiene más de 40 puestos de cocina del mundo en un solo espacio: pupusas salvadoreñas, tacos de guisado, pho vietnamita, pizza de masa madre y jugos de fruta tropical. Para el día libre entre el 12 y el 15 de junio, este es el almuerzo más honesto de la sede.", tag:"Centro histórico" },
    { title:"The Rose Bowl (Pasadena)", type:"Estadio histórico", typeColor:T.sage, desc:"El estadio donde se jugó la final del Mundial 1994 — Alemania-Italia, Suecia-Bulgaria, Brasil campeón — tiene transmisiones públicas en su campo interior durante el torneo. Para el fan que quiere ver un partido de la Ronda de 16 en el mismo estadio que albergó la final del Mundial más exitoso de la historia.", tag:"Histórico" },
    { title:"Koreatown — partidos de Corea del Sur", type:"Barrio", typeColor:T.pine, desc:"El Koreatown de Los Ángeles es la comunidad coreana más grande fuera de Korea. Cuando juega Corea del Sur, las calles de Wilshire y Vermont se cierran informalmente — bares, restaurantes y karaokes transmiten en simultáneo y la comunidad corea desde las ventanas. El ambiente más orgánico de la sede, sin Fan Fest ni pantallas organizadas.", tag:"Auténtico" },
    { title:"Dodger Stadium — watch party", type:"Pantalla exterior", typeColor:"#1A3A5C", desc:"La organización de los Dodgers activa el estadio para watch parties de los partidos más grandes del torneo, con pantalla en el marcador exterior. Para los partidos de México y EUA, Dodger Stadium tiene capacidad para 56,000 personas y el contexto visual — las colinas de Chavez Ravine, el skyline al fondo — no existe en ninguna otra ciudad de la sede.", tag:"Chavez Ravine" },
    { title:"El Cholo (Western Ave)", type:"Restaurante histórico", typeColor:"#5A3A2A", desc:"El restaurante mexicano más antiguo de Los Ángeles, abierto desde 1923. Margaritas clásicas, enchiladas del estilo que los angelinos conocen de toda la vida y el ambiente de cantina que ninguna versión de LA para turistas puede fabricar. Para el fan que llega por el partido de México y quiere entender por qué esta ciudad tiene la mejor cocina mexicana fuera de México.", tag:"Western Ave" },
  ],
  food:[
    { dish:"Grand Central Market", where:"Downtown LA — 40 puestos de cocina internacional desde 1917; tacos, pupusas, pho y café de especialidad bajo el mismo techo histórico", price:"$–$$", type:"Mercado" },
    { dish:"Guerrilla Tacos", where:"Arts District — el chef Wes Avila lleva el taco callejero a nivel de alta cocina; los mejores tacos modernos de Los Ángeles", price:"$$", type:"Imperdible" },
    { dish:"Broken Spanish", where:"Downtown LA — cocina mexicana de autor, la más técnica de la ciudad; reserva con anticipación para noches de partido", price:"$$$", type:"Autor" },
    { dish:"Night + Market", where:"West Hollywood — cocina tailandesa sin filtros, la más auténtica de la Costa Oeste y la más interesante para el fan con hambre después del partido", price:"$$", type:"Tailandesa" },
    { dish:"Tacos de canasta en MacArthur Park", where:"Westlake — el epicentro del LA mexicano popular: tacos de $1.50, agua de jamaica y el ambiente más auténtico de la sede", price:"$", type:"Local" },
    { dish:"Pizzeria Mozza", where:"Hollywood — Nancy Silverton, la mejor pizza de masa madre del Oeste americano; reserva obligatoria para noches sin partido", price:"$$$", type:"Referencia" },
  ],
  experiences:[
    { title:"The Getty Center", duration:"Medio día", desc:"El museo en lo alto de las colinas de Brentwood tiene una colección permanente de primera categoría, jardines de diseño y las mejores vistas de Los Ángeles — el océano Pacífico, el Valle de San Fernando y el skyline de Downtown desde una misma terraza. Entrada gratuita (solo se paga el estacionamiento). El tram desde el parking hasta el museo es parte de la experiencia. Para el día libre entre el partido inaugural y el del 15 de junio.", type:"Arte", affiliateLink:"", affiliateLabel:"Ver horarios" },
    { title:"Santa Mónica + Venice Beach", duration:"Tarde completa", desc:"La playa de Santa Mónica está a 30 minutos del centro de Los Ángeles y tiene el corredor de tiendas y restaurantes de la Third Street Promenade, el muelle con la noria histórica y el acceso en bici hacia Venice. En Venice, el paseo marítimo tiene músicos callejeros, artistas de body painting y el ambiente menos parecido a cualquier otra ciudad del torneo. Para el día libre antes del partido de México, esta es la tarde que LA puede dar que ninguna otra sede del torneo puede replicar.", type:"Playa", affiliateLink:"", affiliateLabel:"Alquilar bicicleta" },
    { title:"Griffith Observatory + Hollywood Sign", duration:"Mañana", desc:"El observatorio en las colinas de Griffith Park tiene planetario, telescopios abiertos al público y el sendero más fotografiado de Los Ángeles — el que lleva al frente del Hollywood Sign. La vista desde el observatorio al amanecer, con el Pacífico al fondo y el skyline de DTLA a la izquierda, justifica madrugar. Entrada gratuita al edificio; planetario con tarifa mínima.", type:"Ciudad", affiliateLink:"", affiliateLabel:"Ver información" },
    { title:"Mercado La Paloma (Exposition Park)", duration:"Medio día", desc:"El mercado cultural a dos cuadras del Natural History Museum, adyacente al Coliseum y al SoFi en Exposition Park, tiene cocina oaxaqueña, guatemalteca y mexicana en un espacio diseñado por y para la comunidad latinoamericana de Los Ángeles. Combínalo con el Natural History Museum (dinosaurios, meteoritos, colección de minerales de clase mundial) y el California Science Center para un día sin auto y sin tráfico.", type:"Cultura", affiliateLink:"", affiliateLabel:"Ver opciones" },
  ],
  lagomTips:[
    "El partido inaugural (EUA vs Paraguay, 12 junio) y el de México (21 junio) son las dos fechas de mayor demanda en toda la sede. Para ambos: shuttle oficial reservado con 5 días mínimo, hotel a precio de temporada alta y no planees Uber post-partido.",
    "Los Ángeles no tiene metro directo al SoFi Stadium. Las opciones son: shuttle oficial (recomendado), Metro C Line hasta Inglewood + caminata, o Uber desde tu hotel con margen de 90 minutos para el tráfico.",
    "El costo de vida en LA es el más alto del torneo después de Nueva York. Considera Airbnb en Culver City, Mid-City o Silver Lake — mejor precio con buena conexión al metro.",
    "La gastronomía de LA es la más diversa de todo el torneo: cocina mexicana auténtica, tailandesa de primera, sushi de acceso al Pacífico y mercados callejeros sin equivalente. No comas dos veces en el mismo sitio.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Shuttle oficial reservado con anticipación",
    "Protector solar — el estadio tiene cubierta pero sin A/C",
    "Ropa ligera para calor seco (24–30°C en junio)",
    "Agua antes de salir — el SoFi no tiene climatización",
    "Sin plan de Uber post-partido — espera de 60–90 min en surge",
    "Reserva hotel para 12 junio (inaugural) y 21 junio (México) con anticipación máxima",
    "Llegada al estadio 90 min antes — puertas abren H-2:00 para el inaugural",
  ],
  didYouKnow:"SoFi Stadium costó $5.5 mil millones de dólares — el estadio más caro jamás construido en la historia. Inaugurado en 2020, fue diseñado por HKS Architects con una cubierta traslúcida que permite ver el cielo desde el interior sin exponer a los espectadores al sol directo. Tiene el marcador de pantalla más grande del mundo: 70 metros de largo.",
  closingNote:"Los Ángeles no es una ciudad que se deja agotar en una semana. El Mundial le da siete partidos, incluyendo el inaugural y potencialmente el de México en casa. Lo que LA hace con eso depende de si sabes usar el shuttle, elegir el barrio correcto y no confundir '30 minutos en Google Maps' con '30 minutos en la realidad'. LagomPlan te da la ruta, el hotel en el barrio indicado y la taquería donde los ángeles comen de verdad. El Pacífico hace el resto.",
  closingSignature:"Lagomplan · Guía de campo · Los Ángeles · Mundial 2026",
  plannerCTA:"Generar mi viaje a Los Ángeles",
};

const LAIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#F5EDE5" rx={RADIUS} />
    <rect x="0" y="105" width="280" height="35" fill="#E8D4C0" />
    <rect x="16" y="65" width="10" height="40" fill="#C4622A" opacity="0.3" rx={1} />
    <rect x="30" y="50" width="16" height="55" fill="#C4622A" opacity="0.4" rx={1} />
    <rect x="50" y="42" width="20" height="63" fill="#C4622A" opacity="0.45" rx={1} />
    <rect x="75" y="55" width="14" height="50" fill="#C4622A" opacity="0.3" rx={1} />
    <rect x="94" y="38" width="18" height="67" fill="#C4622A" opacity="0.5" rx={1} />
    <rect x="117" y="58" width="12" height="47" fill="#C4622A" opacity="0.25" rx={1} />
    <path d="M155,105 Q175,88 195,95 Q210,80 230,90 Q250,78 270,88" stroke="#E8D4C0" strokeWidth="2" fill="none" opacity="0.6" />
    <circle cx="210" cy="65" r="22" fill="none" stroke="#C4622A" strokeWidth="1" opacity="0.15" />
    <rect x="198" y="43" width="24" height="5" fill="#C4622A" opacity="0.2" rx={1} />
    <path d="M198,48 L222,48 L222,65 L198,65 Z" fill="#C4622A" opacity="0.08" />
    <text x="258" y="30" fontSize="20" textAnchor="middle">🇺🇸</text>
  </svg>
);

const Card = ({ children, style={}, onClick, hover=false }) => {
  const [h, setH] = useState(false);
  return <div onClick={onClick} onMouseEnter={() => hover&&setH(true)} onMouseLeave={() => hover&&setH(false)} style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:h?"0 4px 16px rgba(28,28,26,0.09)":CARD_SHADOW, transition:"box-shadow 0.22s, transform 0.22s", transform:h?"translateY(-1px)":"none", cursor:onClick?"pointer":"default", ...style }}>{children}</div>;
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
    onMouseEnter={e=>{e.currentTarget.style.background=T.sageLight;e.currentTarget.style.borderColor=T.sage;e.currentTarget.style.color=T.pine;}}
    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=`${T.sage}55`;e.currentTarget.style.color=T.sage;}}>
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
        <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0, ...(open?{}:{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}) }}>{item.desc}</p>
        <ShowMoreToggle expanded={open} onToggle={()=>setOpen(!open)} />
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
        {stay.tags.map(tag=><span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint, background:T.sand, padding:"3px 8px", borderRadius:5, border:`1px solid ${T.sandDark}` }}>{tag}</span>)}
      </div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"14px 22px", borderTop:`1px solid ${T.sandDark}` }}>
      {stay.hotel_link
        ? <a href={stay.hotel_link} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"block", width:"100%", padding:"11px", background:T.pine, borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, textDecoration:"none", textAlign:"center", transition:"opacity 0.18s" }} onMouseEnter={e=>e.currentTarget.style.opacity="0.82"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Ver opciones →</a>
        : <button style={{ width:"100%", padding:"11px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }} onMouseEnter={e=>e.currentTarget.style.opacity="0.82"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Ver opciones →</button>}
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
        <button onClick={onPlan} style={{ width:"100%", padding:"11px 16px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }} onMouseEnter={e=>e.currentTarget.style.opacity="0.82"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{guide.plannerCTA} →</button>
      </Card>
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:13 }}>✦</span></div>
          <Label color={T.pine} style={{ fontSize:11 }}>Notas Lagom</Label>
        </div>
        {guide.lagomTips.map((tip,i)=>(
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
        {guide.matchDayChecklist.map((item,i)=>(
          <button key={i} onClick={()=>setChecked(p=>({...p,[i]:!p[i]}))} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderTop:i>0?`1px solid ${T.sandDark}`:"none", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%" }}>
            <div style={{ width:16, height:16, flexShrink:0, marginTop:2, border:`1.5px solid ${checked[i]?T.sage:T.sandDark}`, borderRadius:4, background:checked[i]?T.sage:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>{checked[i]&&<span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}</div>
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
            <button onClick={onPlan} style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2, padding:"7px 14px", cursor:"pointer", transition:"all 0.18s" }} onMouseEnter={e=>{e.currentTarget.style.background=T.pine;e.currentTarget.style.color=T.white;}} onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=T.pine;}}>Optimizar ruta →</button>
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
        {guide.tags.map(tag=><span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`, padding:"5px 13px", borderRadius:40 }}>{tag}</span>)}
        <span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}35`, padding:"5px 13px", borderRadius:40 }}>⚽ {guide.matches.length} partidos</span>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        {guide.scores.map(s=>(
          <div key={s.label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:3 }}>{[1,2,3,4,5].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:i<=s.value?T.sage:T.sandDark }} />)}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}><LAIllustration /></div>
  </div>
);
const MatchCard = ({ match }) => {
  const isTBD = !match.teams[0].flag && !match.teams[1].flag;
  return (
    <Card style={{ overflow:"hidden", borderColor:match.highlight?`${T.matchGold}50`:T.sandDark, opacity:isTBD?0.55:1 }}>
      <div style={{ height:4, background:match.highlight?T.matchGold:isTBD?T.sandDark:CITY_ACCENT }} />
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
          {match.tag&&<span style={{ ...uf(9,700), letterSpacing:"0.08em", textTransform:"uppercase", color:match.highlight?T.matchGold:CITY_ACCENT, background:match.highlight?T.matchGoldLight:CITY_ACCENT+"15", border:`1px solid ${match.highlight?T.matchGold+"50":CITY_ACCENT+"35"}`, padding:"4px 10px", borderRadius:40, flexShrink:0, maxWidth:140, textAlign:"right" }}>{match.tag}</span>}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"18px 0", borderTop:`1px solid ${T.sandDark}`, borderBottom:`1px solid ${T.sandDark}`, marginBottom:18 }}>
          <div style={{ flex:1, textAlign:"right" }}><div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[0].name}</div>{match.teams[0].flag&&<div style={{ fontSize:26, lineHeight:1 }}>{match.teams[0].flag}</div>}</div>
          <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.12em", padding:"6px 14px", background:T.sand, borderRadius:6, border:`1px solid ${T.sandDark}` }}>vs</div>
          <div style={{ flex:1, textAlign:"left" }}><div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[1].name}</div>{match.teams[1].flag&&<div style={{ fontSize:26, lineHeight:1 }}>{match.teams[1].flag}</div>}</div>
        </div>
        {isTBD?<div style={{ ...uf(12,400), color:T.inkFaint, textAlign:"center", padding:"8px 0", fontStyle:"italic" }}>Rival por definir al terminar fase de grupos</div>
        :<button style={{ width:"100%", padding:"10px", background:"transparent", border:`1px solid ${T.sandDark}`, borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkMid, cursor:"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }} onMouseEnter={e=>{e.currentTarget.style.borderColor=CITY_ACCENT;e.currentTarget.style.color=T.pine;e.currentTarget.style.background=T.sageLight;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.sandDark;e.currentTarget.style.color=T.inkMid;e.currentTarget.style.background="transparent";}}>
          <span style={{ fontSize:12 }}>✦</span> Planear mi viaje alrededor de este partido
        </button>}
      </div>
    </Card>
  );
};
const NAV_ITEMS = [{id:"matches",label:"Partidos"},{id:"manifesto",label:"Manifiesto"},{id:"stays",label:"Dónde dormir"},{id:"vibe",label:"Ambiente"},{id:"logistics",label:"Logística"}];
const StickyNav = ({ active, onNavigate, onBack, city }) => (
  <div style={{ position:"sticky", top:0, zIndex:40, background:`${T.bg}F5`, backdropFilter:"blur(18px)", borderBottom:`1px solid ${T.sandDark}`, height:52, display:"flex", alignItems:"center", padding:"0 40px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none", cursor:"pointer", padding:"0 14px 0 0", marginRight:14, borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em", transition:"color 0.15s" }} onMouseEnter={e=>e.currentTarget.style.color=T.pine} onMouseLeave={e=>e.currentTarget.style.color=T.inkFaint}>← Guías</button>
    <span style={{ ...df(14,700,"italic"), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>{city}</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />
    {NAV_ITEMS.map(item=><button key={item.id} onClick={()=>onNavigate(item.id)} style={{ ...uf(10,active===item.id?700:500), letterSpacing:"0.08em", textTransform:"uppercase", color:active===item.id?T.pine:T.inkFaint, background:"none", border:"none", padding:"0 13px", height:"100%", cursor:"pointer", borderBottom:`2px solid ${active===item.id?T.coral:"transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0 }}>{item.label}</button>)}
  </div>
);
const GuideDetail = ({ guide, onBack }) => {
  const [active, setActive] = useState("matches");
  const [showManifesto, setShowManifesto] = useState(false);
  const [showVibe, setShowVibe] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [showExp, setShowExp] = useState(false);
  useEffect(()=>{
    const obs=[];
    NAV_ITEMS.forEach(item=>{
      const el=document.getElementById(item.id);
      if(!el)return;
      const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setActive(item.id);},{rootMargin:"-30% 0px -65% 0px"});
      o.observe(el);obs.push(o);
    });
    return()=>obs.forEach(o=>o.disconnect());
  },[]);
  const scrollTo=id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});};
  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <StickyNav active={active} onNavigate={scrollTo} onBack={onBack} city={guide.city} />
      <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 40px" }}>
        <GuideHero guide={guide} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:52, alignItems:"flex-start" }}>
          <div>
            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos" subtitle="7 partidos en SoFi Stadium incluyendo el partido inaugural del torneo. El de México — 21 de junio — es el pico de demanda de la sede." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {guide.matches.map(m=><MatchCard key={m.id} match={m} />)}
              </div>
            </section>
            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title="Manifiesto de campo" subtitle="Lo que necesitas saber antes de llegar — y la instrucción que define todo: el transporte no se improvisa en LA." />
              <Card style={{ marginBottom:24, overflow:"hidden" }}>
                <div style={{ height:4, background:CITY_ACCENT }} />
                <div style={{ padding:"20px 24px" }}>
                  {guide.manifesto.stadiumInfo.map((item,i)=>(
                    <div key={i} style={{ display:"flex", gap:20, padding:"11px 0", borderBottom:i<guide.manifesto.stadiumInfo.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(11,600), color:T.inkFaint, minWidth:148, flexShrink:0, letterSpacing:"0.05em" }}>{item.label}</span>
                      <span style={{ ...uf(13,500), color:T.ink, lineHeight:1.6 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              {showManifesto&&(<><p style={{ ...uf(15,400), color:T.ink, lineHeight:1.9, marginBottom:24, maxWidth:640 }}>{guide.manifesto.body}</p><LagomNote>{guide.manifesto.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showManifesto} onToggle={()=>setShowManifesto(!showManifesto)} />
            </section>
            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso" subtitle="Refugios seleccionados con acceso al metro y a los mejores barrios de la ciudad." />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>Los precios en Los Ángeles son los más altos del torneo fuera de Nueva York. El partido inaugural (12 junio) y el de México (21 junio) son las fechas de mayor demanda. Considera Airbnb en <strong>Culver City</strong>, <strong>Mid-City</strong> o <strong>Silver Lake</strong> como alternativa más económica.</p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay=><StayCard key={stay.name} stay={stay} />)}
              </div>
            </section>
            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente" subtitle="Fan Fest en Hollywood Park, Koreatown, Dodger Stadium y el mercado más histórico del centro." />
              <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe?28:0, maxWidth:640, ...(showVibe?{}:{display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}) }}>{guide.vibe.body}</p>
              {showVibe&&(<><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>{guide.vibeCards.map(item=><CollapsibleVibeCard key={item.title} item={item} />)}</div><LagomNote>{guide.vibe.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showVibe} onToggle={()=>setShowVibe(!showVibe)} />
            </section>
            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio" subtitle="Shuttle oficial desde Hollywood Park o Metro C Line hasta Inglewood. Sin plan de transporte, sin partido." />
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:showLogistics?24:0 }}>
                {guide.logistics.transport.slice(0,2).map((item,i)=><LogisticsCard key={i} item={item} />)}
              </div>
              {showLogistics&&(<>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                  {guide.logistics.transport.slice(2).map((item,i)=><LogisticsCard key={i} item={item} />)}
                </div>
                <Card style={{ marginBottom:24 }}>
                  <div style={{ padding:"18px 24px" }}>
                    <div style={{ ...uf(10,700), letterSpacing:"0.16em", textTransform:"uppercase", color:T.inkFaint, marginBottom:14 }}>Tiempos reales de desplazamiento</div>
                    {guide.logistics.timings.map((t,i)=>(
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
                    {guide.logistics.matchDayCronologia.steps.map((step,i)=>(
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
              <ShowMoreToggle expanded={showLogistics} onToggle={()=>setShowLogistics(!showLogistics)} />
            </section>
            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista" subtitle="La gastronomía más diversa del torneo: tacos auténticos, cocina tailandesa, mercados históricos y sushi del Pacífico." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                {guide.food.slice(0,3).map((f,i)=><FoodCard key={i} item={f} />)}
                {showFood&&guide.food.slice(3).map((f,i)=><FoodCard key={i+3} item={f} />)}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={()=>setShowFood(!showFood)} />
            </section>
            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio" subtitle="El entretiempo ideal en la ciudad con más capas culturales, más playa y más diversidad gastronómica del torneo." />
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {guide.experiences.slice(0,1).map((exp,i)=>(
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
                {showExp&&guide.experiences.slice(1).map((exp,i)=>(
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
              <ShowMoreToggle expanded={showExp} onToggle={()=>setShowExp(!showExp)} />
            </section>
            <section style={{ marginBottom:0 }}>
              <div style={{ background:T.pine, borderRadius:RADIUS+2, padding:"48px 44px 44px", position:"relative", overflow:"hidden" }}>
                <div style={{ width:32, height:2, background:T.coral, marginBottom:28, opacity:0.85 }} />
                <blockquote style={{ ...df("clamp(18px,2.4vw,24px)",400,"italic"), color:T.sand, lineHeight:1.75, margin:"0 0 24px", maxWidth:540 }}>"{guide.closingNote}"</blockquote>
                <Label color={`${T.sage}`} style={{ opacity:0.7 }}>{guide.closingSignature}</Label>
              </div>
            </section>
          </div>
          <div style={{ position:"sticky", top:64, alignSelf:"flex-start", paddingBottom:48 }}>
            <GuideSidebar guide={guide} onPlan={()=>alert(`Planificador: ${guide.city}`)} />
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Manrope:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html{scroll-behavior:smooth;}button{font-family:'Manrope',sans-serif;}button:focus-visible{outline:2px solid ${T.coral};outline-offset:2px;}::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:${T.bg};}::-webkit-scrollbar-thumb{background:${T.sandDark};border-radius:3px;}`}</style>
      <GuideDetail guide={LA} onBack={()=>{}} />
    </>
  );
}
