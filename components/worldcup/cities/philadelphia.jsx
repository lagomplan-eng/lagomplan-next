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
const CITY_ACCENT = "#004C54";
const SECTION_ALT_BG = "#F4F0EB";
const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>{children}</span>
);

const PHI = {
  id:"phi", city:"Filadelfia", country:"Estados Unidos", state:"Pennsylvania", flag:"🇺🇸", accent:CITY_ACCENT,
  tags:["250° Independencia","Historia","Ronda de 16","Sede co-anfitriona"],
  stadium:{ name:"Philadelphia Stadium (Lincoln Financial Field)", capacity:"~67,594", area:"South Philadelphia — a 6 km del centro histórico" },
  headline:"El 4 de julio de 2026, Filadelfia celebra 250 años de independencia y un partido de Ronda de 16. El orden de las prioridades lo decide cada quien.",
  description:"Filadelfia tiene 6 partidos, el aeropuerto más cercano a un estadio mundialista del torneo (5 km) y el metro más directo desde el centro. El 4 de julio coincide con el 250° aniversario de la independencia de EE.UU. — la ciudad donde se firmó en 1776 es el epicentro nacional de esa fecha, y un partido de Ronda de 16 se juega en el mismo estadio de los Eagles.",
  scores:[
    { label:"Ambiente", value:4 }, { label:"Fútbol local", value:3 }, { label:"Gastronomía", value:4 },
    { label:"Transporte", value:5 }, { label:"Seguridad", value:4 }, { label:"Costo", value:3 },
  ],
  matches:[
    { id:"m1", date:"14 Jun", day:"Dom", time:"19:00 ET", teams:[{name:"Costa de Marfil",flag:"🇨🇮"},{name:"Ecuador",flag:"🇪🇨"}], stadium:"Lincoln Financial Field", tag:"Grupo E", highlight:false },
    { id:"m2", date:"19 Jun", day:"Vie", time:"21:00 ET", teams:[{name:"Brasil",flag:"🇧🇷"},{name:"Haití",flag:"🇭🇹"}], stadium:"Lincoln Financial Field", tag:"Grupo C · Brasil", highlight:true },
    { id:"m3", date:"22 Jun", day:"Lun", time:"17:00 ET", teams:[{name:"Francia",flag:"🇫🇷"},{name:"Playoff IC-2",flag:""}], stadium:"Lincoln Financial Field", tag:"Grupo I", highlight:true },
    { id:"m4", date:"25 Jun", day:"Jue", time:"16:00 ET", teams:[{name:"Curazao",flag:"🇨🇼"},{name:"Costa de Marfil",flag:"🇨🇮"}], stadium:"Lincoln Financial Field", tag:"Grupo E", highlight:false },
    { id:"m5", date:"27 Jun", day:"Sáb", time:"17:00 ET", teams:[{name:"Croacia",flag:"🇭🇷"},{name:"Ghana",flag:"🇬🇭"}], stadium:"Lincoln Financial Field", tag:"Grupo L", highlight:false },
    { id:"m6", date:"4 Jul",  day:"Sáb", time:"17:00 ET", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"Lincoln Financial Field", tag:"250° Indep. · R16", highlight:true },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"Philadelphia Stadium (Lincoln Financial Field)" },
      { label:"Aforo", value:"~67,594 — configuración FIFA (estadio al aire libre, sin techo)" },
      { label:"Clima (jun–jul)", value:"Días: 24–30°C · Humedad moderada-alta · Los partidos nocturnos tienen condiciones más agradables" },
      { label:"Partidos", value:"6 confirmados — 5 grupos + Ronda de 16 el 4 de julio" },
      { label:"Ubicación", value:"South Philadelphia — a 6 km del centro histórico. En el mismo complejo deportivo de los Eagles, Phillies y Sixers. SEPTA Broad Street Line directo." },
      { label:"Aeropuerto", value:"PHL — Philadelphia International · el aeropuerto más cercano a un estadio mundialista del torneo (~5 km, ~10 min en auto)" },
    ],
    body:"Filadelfia tiene la ventaja logística más clara de cualquier sede del torneo en la Costa Este: el estadio está en South Philadelphia, conectado al centro por el metro más directo del país, y el aeropuerto está a cinco kilómetros del estadio. La ciudad se orienta sola. Brasil el 19 de junio a las 9pm y el 4 de julio con la ciudad entera de celebración son los dos momentos que definen la sede. Filadelfia es la ciudad más apasionada en términos deportivos de Estados Unidos — y la menos interesada en disimularlo.",
    lagomNote:"El 4 de julio de 2026 es la fecha más compleja de gestionar. El 250° aniversario convierte a Filadelfia en el destino nacional de esa fecha — millones de visitantes para los eventos del Independence Mall, fuegos artificiales sobre el río y conciertos en el Parkway. El partido de Ronda de 16 agrega un tercer flujo encima. Reserva alojamiento con meses de anticipación y llega con un día de margen.",
  },
  vibe:{
    body:"Filadelfia es la ciudad más apasionada en términos deportivos de Estados Unidos — y la menos interesada en disimularlo. Una base de fanáticos que va al partido con intención. El Philadelphia Union tiene una hinchada de las más ruidosas de la MLS y el Sons of Ben — su barra organizada — lleva años siendo referencia en el fútbol norteamericano. El Mundial la multiplica por las diásporas del Caribe, África Occidental y Europa del Este. Filadelfia tiene uno de los revival gastronómicos más serios de la última década: el Italian Market en South Philly, el Reading Terminal Market en el centro y los restaurantes de autor en Fishtown y Northern Liberties.",
    lagomNote:"El 4 de julio coincide con las celebraciones del 250 aniversario. Independence Mall tiene acceso limitado y tráfico cerrado — visita el día anterior. El Broad Street Line va desde City Hall al estadio en 18 minutos, esquivando todo el caos del centro.",
  },
  stays:[
    { name:"The Rittenhouse Hotel", area:"Rittenhouse Square / Center City", price:"$$$$", priceCAD:"$350–580 USD/noche (periodo mundialista)", tags:["Hotel boutique","Spa","Broad Street Line"], note:"El hotel de referencia de Filadelfia desde los 90: vistas a la plaza, spa, restaurante de nivel y habitaciones que no necesitan actualizar el diseño porque el clásico funciona. A tres cuadras del Broad Street Line y a veinte minutos del estadio en metro.", best_for:"Carácter", url:"https://booking.stay22.com/lagomplan/MyXircbGCg" },
    { name:"Apple Hostels of Philadelphia", area:"Old City / Cristo Rey", price:"$", priceCAD:"$60–130 USD/noche según tipo de habitación", tags:["Presupuesto","Zona histórica","Cerca Liberty Bell"], note:"El hostal más bien valorado de Filadelfia, en el barrio histórico a dos cuadras del Liberty Bell y del Independence Hall. Habitaciones privadas y compartidas, cocina comunitaria y terraza con vistas. Para el viajero con presupuesto que quiere la ciudad, no solo el partido.", best_for:"Presupuesto", url:"https://booking.stay22.com/lagomplan/jMbVoUSYQC" },
    { name:"Four Seasons Philadelphia", area:"Center City / Comcast Tower", price:"$$$$", priceCAD:"$650–1,100 USD/noche (periodo mundialista)", tags:["Piso 57","Vistas al Schuylkill","Jean-Georges"], note:"En el piso 57 del rascacielos más alto de Filadelfia — la única dirección de la ciudad con vistas completas al río Schuylkill y al Delaware. Piscina en el piso 57, restaurante Jean-Georges Vongerichten y acceso a todas las líneas de SEPTA desde el nivel de calle.", best_for:"Lujo", url:"https://booking.stay22.com/lagomplan/1ZZSzLZttO" },
  ],
  logistics:{
    transport:[
      { icon:"🚇", title:"Ruta maestra — SEPTA Broad Street Line → AT&T Station", text:"La línea naranja del metro de Filadelfia va desde City Hall hasta AT&T Station directamente — la estación está dentro del complejo deportivo de South Philly. El estadio queda a tres minutos caminando de la salida del metro. Frecuencia habitual: cada 8–12 minutos. En días de partido: servicio ampliado con frecuencia de 4–6 minutos. Tarifa: $2.50 con tarjeta SEPTA Key o pago sin contacto." },
      { icon:"✈", title:"Desde PHL (aeropuerto) — el más cercano del torneo", text:"El aeropuerto de Filadelfia está a cinco kilómetros del estadio — la distancia más corta de cualquier aeropuerto a cualquier estadio mundialista en el torneo. En Uber o taxi: 10 minutos y menos de $20. En SEPTA Airport Line hasta Center City + Broad Street Line al estadio: ~35 minutos, $6.75." },
      { icon:"🚋", title:"Alternativa — SEPTA desde Fishtown / Northern Liberties", text:"Desde Fishtown al estadio: Market-Frankford Line hasta City Hall, transbordo a Broad Street Line, ~35 minutos total. Opción válida si tu base es el barrio con más ambiente de la nueva Filadelfia." },
      { icon:"⚠️", title:"Error crítico — ir en auto el 4 de julio", text:"El Broad Street desde el centro hasta el puente South está cortado al tráfico por los eventos de la independencia desde primera hora. Los accesos por la I-76 y la I-95 convergen con el flujo de los eventos del Parkway. Cualquier ruta en auto ese día tarda el doble de lo habitual. El metro va directo, sale desde City Hall y llega en 18 minutos. No existe decisión más clara en esta guía.", isWarning:true },
    ],
    timings:[
      { label:"Rittenhouse Square en Broad Street Line", value:"~18 min" },
      { label:"Old City / histórico (desde City Hall BSL)", value:"~22 min" },
      { label:"PHL (aeropuerto) en Uber directo", value:"~10 min · <$20" },
      { label:"Fishtown en SEPTA + BSL (transbordo)", value:"~35 min" },
      { label:"Auto desde Center City (día normal / 4 Jul)", value:"15–25 min · 45–60 min" },
    ],
    matchDayCronologia:{
      matchName:"4 Jul · Ronda de 16 · 17:00 ET",
      steps:[
        { time:"H-5:00", text:"El 4 de julio, la ciudad entera sale a la calle desde la mañana. Desayuna temprano antes de que Independence Mall esté cerrado al tráfico." },
        { time:"H-3:00", text:"Toma el Broad Street Line desde City Hall. La Independence Day crowd ya estará en el centro — salir con margen es no salir tarde." },
        { time:"H-2:00", text:"Llegada al estadio. Puertas abiertas 90 minutos antes." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:30", text:"BSL de regreso. Los fuegos artificiales del 4 de julio sobre el río empiezan a las 9:30pm — si el partido termina a las 7:15pm tienes dos horas para ubicarte en el Parkway o el Delaware Waterfront." },
      ],
    },
    timing:"Filadelfia tiene la mejor logística de tránsito público del torneo en EE.UU. después del GO Train de Toronto. Broad Street Line es una línea de metro recta entre City Hall y el estadio — sin transbordos, 18 minutos.",
    cost:"Filadelfia es la más accesible de las sedes de la Costa Este. Más barata que Nueva York y Boston. El 4 de julio encarece el alojamiento notablemente — tres eventos simultáneos (250° aniversario + fuegos + partido) compiten por el mismo inventario.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Penn's Landing / Delaware Waterfront", type:"Fan fest oficial", typeColor:T.coral, desc:"El Fan Fest se instala en Penn's Landing, el frente marítimo del río Delaware con vistas al puente Ben Franklin. Filadelfia fundó aquí los primeros muelles de la colonia en el siglo XVII. Pantallas de gran formato, programación cultural y acceso desde Old City a pie o desde Center City por el SEPTA Market-Frankford Line (estación 2nd Street). Operación: todo el período mundialista.", tag:"Waterfront" },
    { title:"Xfinity Live! (South Philadelphia)", type:"Complejo deportivo", typeColor:T.fjord, desc:"El complejo de entretenimiento junto a los estadios deportivos de South Philly — a cuatro cuadras del Lincoln Financial Field — tiene plazas exteriores y pantallas permanentes. Para el fan que quiere el ambiente del estadio sin el boleto, Xfinity Live! es el punto de concentración natural del barrio deportivo de Filadelfia.", tag:"South Philly" },
    { title:"Lemon Hill (East Fairmount Park)", type:"Parque con pantalla", typeColor:T.sage, desc:"Lemon Hill tiene las mejores vistas del río Schuylkill y del skyline desde cualquier punto verde de la ciudad. Las colinas del parque son el escenario natural para transmisiones informales que coexisten con el evento oficial del Fan Fest de Penn's Landing.", tag:"Schuylkill" },
    { title:"McGillin's Olde Ale House (Center City)", type:"Pub histórico", typeColor:T.pine, desc:"El bar más antiguo de Filadelfia en operación continua desde 1860. Pantallas en todos los espacios, menú de pub americano clásico y una historia en las paredes que convierte cada visita en algo más que ver un partido. Para los días de Croacia y Ghana — grupos con diásporas europeas activas en Filadelfia — McGillin's es el punto de reunión natural.", tag:"Desde 1860" },
    { title:"Pizzata Pompette (South Philly)", type:"Italiano con pantalla", typeColor:"#004C54", desc:"Restaurante-bar en el barrio italiano con pantallas, cocina napolitana honesta y una clientela local que incluye a los mismos empleados del Lincoln Financial Field que viven a cuatro cuadras. Para Croacia vs. Ghana (27 de junio), Pizzata Pompette tiene el ambiente de barrio correcto.", tag:"Italian Market" },
    { title:"Independence Hall + Liberty Bell", type:"Histórico", typeColor:"#B8860B", desc:"No es un bar, pero es la razón por la que Filadelfia existe en el calendario mundial del 4 de julio de 2026. El complejo donde se firmó la Constitución en 1787 y donde suena la campana de la independencia. Gratuito, acceso sin reserva. Visita el día ANTES del 4 de julio — ese día el Mall tiene acceso limitado.", tag:"Sin boleto" },
  ],
  food:[
    { dish:"McGillin's Olde Ale House", where:"Center City — pretzel blando + cerveza local; el bar más antiguo de Filadelfia (1860), siempre con partido en pantalla", price:"$$", type:"Pub histórico" },
    { dish:"Xfinity Live!", where:"South Philadelphia — el complejo junto al estadio con pantallas monumentales y terrazas; segundo estadio del barrio deportivo", price:"$$", type:"Complejo" },
    { dish:"Pizzata Pompette", where:"South Philly — pizza margarita + vino natural; italiano honesto con pantallas, sin turismo calculado", price:"$$", type:"Italiano" },
    { dish:"Pat's / Geno's (cheesesteak)", where:"Passyunk Avenue — el ritual obligatorio de Filadelfia; la guerra fría más vieja de la ciudad entre dos locales enfrentados", price:"$", type:"Ritual" },
    { dish:"Reading Terminal Market", where:"Center City — el mercado cubierto más antiguo del país (1893); DiNic's para sándwich de puerco, Beiler's para donuts Amish", price:"$", type:"Mercado" },
    { dish:"Italian Market", where:"South Philly / 9th Street — el mercado al aire libre más antiguo de EE.UU. (1884); martes de junio es día completo", price:"$", type:"Barrio" },
  ],
  experiences:[
    { title:"Independence Mall + Liberty Bell + Eastern State Penitentiary", duration:"Medio día a día completo", desc:"El Independence Mall es el complejo histórico más cargado de simbolismo de EE.UU.: el Independence Hall (donde se firmó la Constitución), el Liberty Bell y el National Constitution Center están en el mismo radio de tres cuadras. Gratuito, acceso sin reserva. Eastern State Penitentiary, a dos kilómetros al noroeste, es una prisión del siglo XIX parcialmente en ruinas convertida en museo: una de las visitas más originales del torneo.", type:"Histórico", affiliateLink:"", affiliateLabel:"Ver info" },
    { title:"Philadelphia Museum of Art + Barnes Foundation", duration:"Medio día", desc:"El Philadelphia Museum of Art (el del final de Rocky, con las escaleras) tiene una de las colecciones más importantes del mundo: Duchamp, Cézanne, Van Gogh y una sección de arte africano relevante para Costa de Marfil o Ghana. Acceso desde el Centro: autobús 32 por Walnut. La Barnes Foundation, a dos cuadras, tiene la mayor colección de Renoir del mundo.", type:"Arte", affiliateLink:"", affiliateLabel:"Ver museos" },
    { title:"Please Touch Museum + Franklin Institute", duration:"Día completo", desc:"El Please Touch Museum en Fairmount Park es el museo de niños más premiado de Pensilvania: exhibiciones interactivas para menores de 7 años, réplica de carrusel de 1908 que opera dentro del edificio ($22 por persona). A tres cuadras, el Franklin Institute tiene el planetario más grande de la Costa Este, exposición sobre el corazón humano que se puede caminar por dentro y el Fels Planetarium ($25 adultos).", type:"Familiar", affiliateLink:"", affiliateLabel:"Ver entradas" },
    { title:"Delaware Waterfront + Adventure Aquarium (Camden)", duration:"Medio día", desc:"El Adventure Aquarium en Camden, NJ — al otro lado del Delaware desde Penn's Landing, accesible en ferry de 10 minutos ($12 ida y vuelta) — tiene tiburones, hipopótamos y el único pingüino africano de Nueva Jersey. El ferry en sí ya es el plan: vistas al skyline de Filadelfia desde el agua.", type:"Agua", affiliateLink:"", affiliateLabel:"Ver ferry" },
  ],
  lagomTips:[
    "PHL es el aeropuerto más cercano a un estadio mundialista del torneo completo (~5 km, ~10 min en auto). Si tu itinerario es Philly-céntrico, vuela ahí directo.",
    "Broad Street Line desde City Hall al estadio: 18 minutos sin transbordos. La mejor logística del torneo en EE.UU. después de Toronto.",
    "El 4 de julio tiene tres eventos simultáneos: 250° aniversario + fuegos sobre el río + Ronda de 16. Reserva con meses; llega con un día de margen.",
    "Visita Independence Mall el día ANTES del 4 de julio. Ese día está cerrado al tráfico y con acceso limitado por los eventos oficiales.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Tarjeta SEPTA Key cargada o pago sin contacto",
    "Estación objetivo: AT&T (Broad Street Line)",
    "Bolso claro obligatorio",
    "Capa / paraguas si junio trae tormenta — humedad alta",
    "Plan de cheesesteak previo confirmado (Pat's / Geno's / Jim's)",
    "Reserva de hotel para el 4 de julio con anticipación extrema",
    "Plan post-partido para fuegos (Parkway o Delaware Waterfront)",
  ],
  didYouKnow:"El Lincoln Financial Field es el único estadio del torneo ubicado en el mismo complejo que otros tres estadios profesionales: Citizens Bank Park (Phillies), Wells Fargo Center (76ers + Flyers) y el mismo Lincoln. Los cuatro están conectados por pasarelas peatonales, haciendo de South Philly el único distrito deportivo norteamericano con cuatro estadios profesionales en un radio de 400 metros.",
  closingNote:"Filadelfia tiene seis partidos, el aeropuerto más cercano a un estadio mundialista del torneo y el metro más directo del conjunto de sedes norteamericanas — exceptuando el GO Train de Toronto. El 4 de julio de 2026, la ciudad donde nació la democracia americana celebra su 250° aniversario con un partido de Ronda de 16 en el mismo estadio donde los Eagles ganan Super Bowls. Es una coincidencia que ninguna otra sede podría replicar. LagomPlan te da el metro correcto, el barrio adecuado y las escaleras del museo donde Rocky entrenó. El resto es historia — literalmente.",
  closingSignature:"Lagomplan · Guía de campo · Filadelfia · Mundial 2026",
  plannerCTA:"Generar mi viaje a Filadelfia",
};

const PhiIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#DDE6E3" rx={RADIUS} />
    <rect x="0" y="108" width="280" height="32" fill="#8FAFA7" />
    {/* Liberty Bell silhouette (left) */}
    <path d="M30 50 L54 50 L52 82 L32 82 Z" fill="#004C54" opacity="0.55" />
    <rect x="38" y="42" width="8" height="9" fill="#004C54" opacity="0.55" rx={1} />
    <path d="M28 82 L56 82 L54 88 L30 88 Z" fill="#004C54" opacity="0.6" />
    <line x1="42" y1="55" x2="42" y2="78" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
    {/* Philadelphia skyline */}
    <rect x="78"  y="64" width="12" height="44" fill="#004C54" opacity="0.5" rx={1} />
    <rect x="94"  y="48" width="16" height="60" fill="#004C54" opacity="0.6" rx={1} />
    <rect x="114" y="36" width="14" height="72" fill="#004C54" opacity="0.65" rx={1} />
    <rect x="132" y="54" width="12" height="54" fill="#004C54" opacity="0.5" rx={1} />
    <rect x="148" y="42" width="18" height="66" fill="#004C54" opacity="0.6" rx={1} />
    <rect x="170" y="58" width="12" height="50" fill="#004C54" opacity="0.45" rx={1} />
    <rect x="186" y="48" width="14" height="60" fill="#004C54" opacity="0.55" rx={1} />
    {/* City Hall tower with William Penn statue (pointy top) */}
    <rect x="120" y="36" width="2" height="8" fill="#004C54" opacity="0.8" />
    <circle cx="121" cy="33" r="2" fill="#004C54" opacity="0.75" />
    {/* Independence Hall silhouette (right) */}
    <rect x="218" y="64" width="36" height="44" fill="#004C54" opacity="0.55" rx={1} />
    <rect x="232" y="50" width="8" height="14" fill="#004C54" opacity="0.65" rx={1} />
    <path d="M228 50 L244 50 L236 38 Z" fill="#004C54" opacity="0.6" />
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
      <PhiIllustration />
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
      <GuideDetail guide={PHI} onBack={() => {}} />
    </>
  );
}
