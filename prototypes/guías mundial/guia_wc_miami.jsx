"use client";
import { useState, useEffect } from "react";

const T = { pine:"#0F3A33", sage:"#6B8F86", sageLight:"#EAF2F0", sand:"#EDE7E1", sandLight:"#F7F4F1", sandDark:"#D9D2C9", coral:"#E1615B", coralLight:"#FCEEED", fjord:"#2D4F6C", fjordLight:"#E3EBF2", ink:"#1C1C1A", inkMid:"#5A5A56", inkFaint:"#9A9A94", white:"#FFFFFF", matchGold:"#B8860B", matchGoldLight:"#FBF5E0", bg:"#fff9f3" };
const RADIUS = 10;
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";
const CARD_BORDER = "rgba(28,28,26,0.09)";
const CITY_ACCENT = "#0E8B8B";
const SECTION_ALT_BG = "#F4F0EB";
const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>{children}</span>
);

const MIA = {
  id:"mia", city:"Miami", country:"Estados Unidos", state:"Florida", flag:"🇺🇸", accent:CITY_ACCENT,
  tags:["Fútbol","Playa","Gastronomía","Semifinal"],
  stadium:{ name:"Hard Rock Stadium", capacity:"~70,000", area:"Miami Gardens — a 30 km al norte de South Beach" },
  headline:"El calor en Miami no es el clima. Es el estado de ánimo permanente de la ciudad. El Mundial solo lo amplifica.",
  description:"El calor en Miami no es el clima. Es el estado de ánimo permanente de la ciudad. Miami recibe siete partidos, incluyendo una Semifinal el 11 de julio. La afición latinoamericana de Miami no necesita que vuele nadie: hay más comunidades de Suramérica, Centroamérica y el Caribe en esta ciudad que en ningún otro punto de Estados Unidos.",
  scores:[
    { label:"Ambiente", value:5 }, { label:"Fútbol local", value:4 }, { label:"Gastronomía", value:5 },
    { label:"Transporte", value:2 }, { label:"Seguridad", value:4 }, { label:"Costo", value:2 },
  ],
  matches:[
    { id:"m1", date:"15 Jun", day:"Lun", time:"19:00 ET", teams:[{name:"Uruguay",flag:"🇺🇾"},{name:"Arabia Saudita",flag:"🇸🇦"}], stadium:"Hard Rock Stadium", tag:"Grupo B", highlight:false },
    { id:"m2", date:"21 Jun", day:"Dom", time:"16:00 ET", teams:[{name:"Uruguay",flag:"🇺🇾"},{name:"Cabo Verde",flag:"🇨🇻"}], stadium:"Hard Rock Stadium", tag:"Grupo B", highlight:false },
    { id:"m3", date:"24 Jun", day:"Mié", time:"20:00 ET", teams:[{name:"Escocia",flag:"🏴"},{name:"Brasil",flag:"🇧🇷"}], stadium:"Hard Rock Stadium", tag:"Brasil en Miami", highlight:true },
    { id:"m4", date:"27 Jun", day:"Sáb", time:"15:00 ET", teams:[{name:"Colombia",flag:"🇨🇴"},{name:"Portugal",flag:"🇵🇹"}], stadium:"Hard Rock Stadium", tag:"Colombia vs Portugal", highlight:true },
    { id:"m5", date:"3 Jul", day:"Jue", time:"TBD", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Hard Rock Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m6", date:"11 Jul", day:"Vie", time:"TBD", teams:[{name:"Semifinal",flag:""},{name:"Por definir",flag:""}], stadium:"Hard Rock Stadium", tag:"Semifinal", highlight:true },
    { id:"m7", date:"18 Jul", day:"Sáb", time:"TBD", teams:[{name:"Tercer puesto",flag:""},{name:"Por definir",flag:""}], stadium:"Hard Rock Stadium", tag:"Tercer puesto", highlight:false },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"Hard Rock Stadium" },
      { label:"Aforo", value:"~70,000 — configuración FIFA" },
      { label:"Clima (jun–jul)", value:"Días: 32–36°C · Humedad tropical · Sin techo y sin A/C · Los partidos nocturnos son los únicos tolerables para el calor exterior" },
      { label:"Partidos", value:"7 confirmados — 5 grupos + 1 Ronda de 32 + 1 Semifinal + 1 Tercer puesto" },
      { label:"Transporte", value:"No hay metro al estadio. Brightline desde Brickell/Downtown (más limpio), Metrobus 297, o rideshare con margen extendido post-partido" },
      { label:"Aeropuerto", value:"MIA — Miami International · a 18 km del estadio · taxi/rideshare ~30 min sin tráfico" },
    ],
    body:"Miami es la ciudad del torneo con más latinoamericanos por metro cuadrado. Las comunidades de Colombia, Venezuela, Cuba, Brasil, Argentina y Uruguay tienen base real en el área metropolitana. Colombia vs. Portugal (27 junio) y Brasil vs. Escocia (24 junio) tienen tribuna local sin que nadie compre un vuelo desde Sudamérica. La Semifinal del 11 de julio convierte a Miami en la ciudad más caliente del torneo, en todos los sentidos.",
    lagomNote:"El calor de julio en Miami es diferente al de junio. Para la Semifinal, la temperatura exterior puede superar los 36°C con humedad del 80%. El Hard Rock Stadium no tiene A/C. Usa ropa técnica, hidratación constante y llega con tiempo para las filas de seguridad exteriores.",
  },
  vibe:{
    body:"La diáspora latinoamericana de Miami no espera el Mundial para tener cultura de fútbol. Calle Ocho en Little Havana transmite partidos desde los años 90 con la misma energía que los bares de Buenos Aires. El Wynwood Yard tiene food trucks con banderas de cada país. Para los partidos de Colombia y Brasil, el Design District y Brickell concentran afición que lleva viviendo aquí más tiempo que la mayoría de fanáticos que llegan desde el extranjero.",
    lagomNote:"Para la Semifinal del 11 de julio, los precios en Miami suben a los niveles más altos junto con Nueva York. Reserva hotel y transporte para Colombia-Portugal (27 Jun), Brasil-Escocia (24 Jun) y la Semifinal como un bloque, no por separado.",
  },
  stays:[
    { name:"The Goodtime Hotel", area:"South Beach / Collins Ave", price:"$$$$", priceCAD:"$320–600 USD/noche (periodo mundialista)", tags:["Diseño","Piscina","South Beach"], note:"El hotel de diseño más fotogénico de South Beach: dos piscinas, terraza de cócteles y el mejor ambiente de la zona. Para el fan que quiere South Beach con criterio. A 35 minutos del estadio vía Brightline + rideshare.", best_for:"Carácter" },
    { name:"Urbanica The Meridian", area:"South Beach / Art Déco District", price:"$$$", priceCAD:"$180–320 USD/noche (periodo mundialista)", tags:["Smart value","Art Déco","Playa"], note:"Hotel boutique en el distrito Art Déco con acceso directo a la playa en menos de cinco minutos a pie. La opción más honesta del rango medio en Miami: diseño con historia y precio calibrado.", best_for:"Smart value" },
    { name:"EDITION Miami", area:"Mid-Beach / 29th Street", price:"$$$$", priceCAD:"$500–1,000 USD/noche (periodo mundialista)", tags:["Lujo","Vista al océano","Spa"], note:"El hotel de lujo más completo de Miami Beach: spa, piscina con vistas al Atlántico y restaurante del chef Jean-Georges. Para la noche de la Semifinal, el rooftop del Edition es el punto de reunión de quienes entienden el torneo desde adentro.", best_for:"Lujo" },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Miami — MIA", text:"MIA — Miami International Airport está a 18 km del centro y a 30 km del estadio. El Brightline conecta MIA Airport con Brickell y Downtown, requiriendo combinación con rideshare para el estadio. Uber directo desde MIA al estadio: ~35 minutos y $35–55 sin tráfico." },
      { icon:"🚆", title:"Ruta maestra — Brightline + Metrobus 297", text:"La combinación más limpia: Brightline desde MIA Airport o Brickell Station hasta Aventura, luego Metrobus 297 directo al estadio. Total: ~55 minutos desde Brickell. El Brightline opera cada 15–30 minutos con tarjeta sin contacto." },
      { icon:"🚌", title:"Alternativa — Metrobus 297 directo", text:"El Metrobus 297 conecta el centro de Miami con Miami Gardens. Sale desde la estación Metrorail de Palmetto. Para el fan alojado en Coral Gables, Coconut Grove o Downtown, el 297 es la opción directa sin transbordo." },
      { icon:"⚠️", title:"Error crítico — Uber post-Semifinal", text:"Después de la Semifinal, 70,000 personas salen de una zona sin metro. Los tiempos de espera de Uber post-Semifinal en julio en Miami superan los 60–90 minutos con precios de surge de $80–150. Coordina el regreso en Brightline o Metrobus — o quédate en Miami Gardens hasta que pase el pico.", isWarning:true },
    ],
    timings:[
      { label:"Brickell → Hard Rock Stadium (Brightline + 297)", value:"~55 min" },
      { label:"MIA Airport → estadio (rideshare sin tráfico)", value:"~30 min · con tráfico: 55–75 min" },
      { label:"South Beach → estadio (rideshare)", value:"~40 min sin tráfico" },
      { label:"Downtown Miami → estadio (Metrobus 297)", value:"~50 min" },
    ],
    matchDayCronologia:{
      matchName:"11 Jul · Semifinal",
      steps:[
        { time:"H-4:00", text:"Almuerza antes del mediodía. El calor de julio en Miami a la tarde es el más intenso del torneo." },
        { time:"H-3:00", text:"Brightline desde Brickell hacia Aventura. Sale cada 15–30 minutos." },
        { time:"H-2:00", text:"Metrobus 297 hacia el estadio desde Palmetto. Llegada con margen para filas de seguridad." },
        { time:"H-1:30", text:"Entrada al estadio. Agua fría en los puestos interiores — el costo vale el alivio." },
        { time:"H+0:00", text:"Semifinal." },
        { time:"H+1:45", text:"Brightline o Metrobus de regreso. No uses rideshare post-Semifinal." },
      ],
    },
    timing:"Miami no tiene metro al estadio. El Brightline + Metrobus 297 es la combinación que resuelve el transporte con el mejor balance. Para la Semifinal, planifica el regreso antes del partido.",
    cost:"Miami es cara y el torneo lo confirma. Brickell o Coconut Grove como base alternativa a South Beach dan mejores precios con buena conexión al Brightline.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Bayfront Park", type:"Fan fest oficial", typeColor:T.coral, desc:"El Fan Fest de Miami se instala en el Bayfront Park del downtown, frente a la bahía de Biscayne. El telón de fondo — el skyline de Miami, el mar y las palmeras — es el más fotogénico de cualquier Fan Fest del torneo. Gratuito, con pantallas de gran formato y acceso por Metromover desde el Metrorail.", tag:"Sin boleto OK" },
    { title:"Calle Ocho (Little Havana)", type:"Barrio", typeColor:T.fjord, desc:"El epicentro cultural latinoamericano de Miami transmite fútbol en sus bares y ventanitas desde los años 90. En días de partido de Colombia, Venezuela o cualquier selección del Caribe, Calle Ocho se cierra informalmente. El ambiente más orgánico de la sede.", tag:"Auténtico" },
    { title:"Wynwood Yard", type:"Food park", typeColor:T.sage, desc:"El mercado al aire libre de Wynwood tiene food trucks con cocina de todos los países que juegan en el torneo, pantallas exteriores orientadas a la calle y la energía de barrio artístico que Wynwood proyecta en cualquier evento cultural.", tag:"Wynwood" },
    { title:"Doral Central Park (Doral)", type:"Watch party", typeColor:T.pine, desc:"El parque de Doral — municipio con la mayor comunidad venezolana de Estados Unidos — activa pantallas gigantes para los partidos de Venezuela y los clásicos latinoamericanos. Para Colombia-Portugal, la comunidad colombiana de Doral convierte el parque en algo que ningún Fan Fest oficial puede replicar.", tag:"Venezuela / Colombia" },
    { title:"American Social (Brickell)", type:"Sports bar", typeColor:"#1A3A5C", desc:"El sports bar de referencia de Brickell, con la mayor selección de cervezas artesanales del corredor financiero de Miami y pantallas en cada pared. Para los partidos europeos del torneo, es el punto de reunión de la comunidad anglosajona y europea que vive en Brickell. Qué pedir: Alitas + IPA de Florida.", tag:"Brickell" },
    { title:"Ball & Chain (Little Havana)", type:"Bar histórico", typeColor:"#5A3A2A", desc:"El bar histórico de Little Havana — abierto desde 1935 — combina música en vivo con transmisiones de los partidos del torneo. Para Colombia-Portugal y Brasil-Escocia, tiene afición colombiana y brasileña que viene a ver el partido como si estuviera en casa. Qué pedir: Mojito cubano + croquetas.", tag:"Little Havana" },
  ],
  food:[
    { dish:"Calle Ocho — ventanitas cubanas", where:"Little Havana — café cubano, croquetas y sándwich cubano desde las 7am; la cultura gastronómica más genuina de Miami", price:"$", type:"Ritual" },
    { dish:"Ball & Chain", where:"Little Havana — mojito cubano + croquetas; bar histórico desde 1935, música en vivo y pantalla en días de partido latinoamericano", price:"$$", type:"Pre-partido" },
    { dish:"Zak the Baker", where:"Wynwood — panadería de referencia para el desayuno antes del partido; croissants y café de especialidad", price:"$$", type:"Desayuno" },
    { dish:"KYU", where:"Wynwood — cocina asiática de autor con ahumados de leña; el restaurante más celebrado de Miami en los últimos cinco años", price:"$$$", type:"Autor" },
    { dish:"Versailles", where:"Little Havana — el restaurante cubano más famoso de Miami; ropa vieja, picadillo y arroz con frijoles que no ha cambiado en 50 años", price:"$$", type:"Local" },
    { dish:"Cocina venezolana", where:"Doral / Hialeah — hallacas, arepas y pabellón criollo en la mayor concentración venezolana de Estados Unidos", price:"$–$$", type:"Excursión" },
  ],
  experiences:[
    { title:"South Beach + Art Déco District", duration:"Mañana o tarde", desc:"El distrito Art Déco de South Beach tiene la mayor concentración de arquitectura Art Déco preservada del mundo: 800 edificios del período 1920–1940 entre Ocean Drive y Collins Avenue. Para el día libre entre el 15 y el 21 de junio, South Beach en bicicleta combina arquitectura histórica, playa y acceso a los mejores bares de la zona.", type:"Playa", affiliateLink:"", affiliateLabel:"Alquilar bicicleta" },
    { title:"Wynwood Art District", duration:"Tarde", desc:"El barrio de Wynwood tiene la mayor concentración de arte mural al aire libre de Norteamérica: más de 50 murales de artistas internacionales en un radio de diez cuadras. Para el día libre antes del partido de Colombia, Wynwood en la tarde es el mejor plan entre partidos.", type:"Arte", affiliateLink:"", affiliateLabel:"Ver información" },
    { title:"Everglades — excursión de día", duration:"Día completo", desc:"Los Everglades están a 45 minutos al oeste de Miami. El parque nacional tiene excursiones en hidrodeslizador, kayak y a pie entre caimanes, manatíes y más de 300 especies de aves. Para el fan con dos días libres entre el 15 y el 24 de junio, es la experiencia más radicalmente diferente al torneo.", type:"Naturaleza", affiliateLink:"", affiliateLabel:"Reservar airboat tour" },
    { title:"Key Biscayne + Rickenbacker Causeway", duration:"Tarde", desc:"La isla de Key Biscayne está a 15 minutos del centro de Miami. Tiene las playas más tranquilas y menos masificadas del área metropolitana. Para el fan que quiere playa sin la masividad de South Beach antes de la Semifinal.", type:"Playa tranquila", affiliateLink:"", affiliateLabel:"Ver opciones" },
  ],
  lagomTips:[
    "El Hard Rock Stadium no tiene aire acondicionado. Para la Semifinal de julio, temperatura exterior puede superar 36°C con humedad del 80%. Ropa técnica, hidratación desde la mañana y protector solar son obligatorios.",
    "Brightline + Metrobus 297 es la ruta correcta al estadio. El rideshare post-Semifinal tiene esperas de 60–90 minutos con precios de surge extremos — planifica el regreso antes de salir.",
    "Colombia-Portugal (27 Jun) y Brasil-Escocia (24 Jun) son los partidos con mayor demanda de afición latinoamericana local. Reserva transporte con anticipación.",
    "Calle Ocho en Little Havana y el parque de Doral dan el contexto cultural real de esta sede. Miami no es solo South Beach — es la capital latinoamericana de Estados Unidos.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Ruta Brightline + Metrobus 297 planificada",
    "Agua y electrolitos antes de salir del hotel",
    "Protector solar SPF 50+",
    "Ropa técnica ligera para humedad extrema",
    "Regreso planificado: Brightline, no rideshare post-Semifinal",
    "Reserva hotel para 24 Jun (Brasil), 27 Jun (Colombia) y 11 Jul (Semifinal)",
    "Llegada al estadio 90 min antes — filas exteriores bajo calor",
  ],
  didYouKnow:"Hard Rock Stadium ha albergado cuatro Super Bowls y tres finales de Copa América (1994, 2016, 2024). La Copa América 2024 se jugó aquí con Argentina campeón. El estadio conoce el peso de una final — y la afición latinoamericana de Miami también.",
  closingNote:"Miami recibe al torneo con siete partidos, una Semifinal y la colonia latinoamericana más densa de Estados Unidos como tribuna interna. Brasil y Colombia no viajan a Miami — ya viven ahí. La playa está a 30 minutos del estadio. Calle Ocho lleva 50 años sabiendo cómo celebrar. LagomPlan te da el Brightline correcto, el bar en Little Havana y la razón para llegar tres horas antes de la Semifinal. El Atlántico hace el resto.",
  closingSignature:"Lagomplan · Guía de campo · Miami · Mundial 2026",
  plannerCTA:"Generar mi viaje a Miami",
};

const MIAIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#E8F5F5" rx={RADIUS} />
    <rect x="0" y="100" width="280" height="40" fill="#B8E0E0" />
    <rect x="20" y="55" width="14" height="45" fill="#0E8B8B" opacity="0.35" rx={1} />
    <rect x="38" y="38" width="20" height="62" fill="#0E8B8B" opacity="0.45" rx={1} />
    <rect x="63" y="45" width="16" height="55" fill="#0E8B8B" opacity="0.3" rx={1} />
    <rect x="84" y="30" width="22" height="70" fill="#0E8B8B" opacity="0.5" rx={1} />
    <rect x="111" y="50" width="14" height="50" fill="#0E8B8B" opacity="0.3" rx={1} />
    <rect x="130" y="42" width="18" height="58" fill="#0E8B8B" opacity="0.4" rx={1} />
    <path d="M155,100 Q180,85 205,92 Q230,80 255,90" stroke="#0E8B8B" strokeWidth="1.5" fill="none" opacity="0.3" />
    <path d="M200,68 Q220,55 240,68" stroke="#0E8B8B" strokeWidth="1" fill="none" opacity="0.2" />
    <text x="258" y="30" fontSize="20" textAnchor="middle">🇺🇸</text>
  </svg>
);

const Card = ({ children, style={}, onClick, hover=false }) => { const [h,setH]=useState(false); return <div onClick={onClick} onMouseEnter={()=>hover&&setH(true)} onMouseLeave={()=>hover&&setH(false)} style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:h?"0 4px 16px rgba(28,28,26,0.09)":CARD_SHADOW, transition:"box-shadow 0.22s, transform 0.22s", transform:h?"translateY(-1px)":"none", cursor:onClick?"pointer":"default", ...style }}>{children}</div>; };
const SectionHeader = ({ number, title, subtitle }) => (<div style={{ marginBottom:32 }}><div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}><span style={{ ...uf(9,500), letterSpacing:"0.18em", textTransform:"uppercase", color:T.inkFaint }}>{number}</span><div style={{ flex:1, height:1, background:"rgba(28,28,26,0.08)" }} /></div><h2 style={{ ...df(27,700,"italic"), color:T.pine, lineHeight:1.05, marginBottom:subtitle?8:0 }}>{title}</h2>{subtitle&&<p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.65, margin:0, maxWidth:540 }}>{subtitle}</p>}</div>);
const LagomNote = ({ children }) => (<div style={{ display:"flex", gap:16, padding:"18px 22px", background:T.sandLight, borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}><span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.14em", textTransform:"uppercase", flexShrink:0, marginTop:3 }}>Lagom</span><p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:0 }}>{children}</p></div>);
const ShowMoreToggle = ({ expanded, onToggle }) => (<button onClick={onToggle} style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:16, background:"transparent", border:`1px solid ${T.sage}55`, borderRadius:40, ...uf(10,600), color:T.sage, cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 14px", transition:"all 0.18s" }} onMouseEnter={e=>{e.currentTarget.style.background=T.sageLight;e.currentTarget.style.borderColor=T.sage;e.currentTarget.style.color=T.pine;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=`${T.sage}55`;e.currentTarget.style.color=T.sage;}}>{expanded?"Ver menos ↑":"Ver más ↓"}</button>);
const CollapsibleVibeCard = ({ item }) => { const [open,setOpen]=useState(false); return (<Card hover style={{ overflow:"hidden", display:"flex", flexDirection:"row" }}><div style={{ width:3, flexShrink:0, background:item.typeColor, opacity:0.7 }} /><div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:9, flex:1 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:item.typeColor }}>{item.type}</span><span style={{ ...uf(9,500), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint }}>{item.tag}</span></div><div style={{ ...df(14,700), color:T.pine, lineHeight:1.25 }}>{item.title}</div><p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0, ...(open?{}:{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}) }}>{item.desc}</p><ShowMoreToggle expanded={open} onToggle={()=>setOpen(!open)} /></div></Card>); };
const StayCard = ({ stay }) => (<Card hover style={{ display:"flex", flexDirection:"column", height:"100%" }}><div style={{ padding:"22px 22px 0" }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}><span style={{ ...df(26,700), color:T.pine, letterSpacing:"-0.02em" }}>{stay.price}</span><Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label></div><div style={{ ...df(17,700), color:T.pine, lineHeight:1.2, marginBottom:4 }}>{stay.name}</div><div style={{ ...uf(12,500), color:T.inkFaint, marginBottom:10 }}>{stay.area}</div>{stay.priceCAD&&<div style={{ ...uf(12,600), color:CITY_ACCENT, marginBottom:14, letterSpacing:"0.02em" }}>{stay.priceCAD}</div>}<div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>{stay.tags.map(tag=><span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint, background:T.sand, padding:"3px 8px", borderRadius:5, border:`1px solid ${T.sandDark}` }}>{tag}</span>)}</div><p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7 }}>{stay.note}</p></div><div style={{ marginTop:"auto", padding:"14px 22px", borderTop:`1px solid ${T.sandDark}` }}>{stay.hotel_link?<a href={stay.hotel_link} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"block", width:"100%", padding:"11px", background:T.pine, borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, textDecoration:"none", textAlign:"center" }}>Ver opciones →</a>:<button style={{ width:"100%", padding:"11px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer" }}>Ver opciones →</button>}</div></Card>);
const FoodCard = ({ item }) => (<div style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:CARD_SHADOW, padding:"16px 18px", display:"flex", flexDirection:"column", gap:6 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}><span style={{ ...uf(13,600), color:T.pine, lineHeight:1.3 }}>{item.dish}</span><span style={{ ...uf(12,500), color:T.inkFaint, flexShrink:0 }}>{item.price}</span></div><p style={{ ...uf(12,400), color:T.inkFaint, lineHeight:1.55, margin:0 }}>{item.where}</p><div style={{ marginTop:4 }}><Label color={T.sage} bg={T.sageLight}>{item.type}</Label></div></div>);
const LogisticsCard = ({ item }) => (<Card style={{ display:"flex", gap:16, padding:"18px 22px", alignItems:"flex-start", borderColor:item.isWarning?`${T.coral}55`:T.sandDark, background:item.isWarning?T.coralLight:T.white }}><div style={{ width:40, height:40, flexShrink:0, background:item.isWarning?T.coral+"20":T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{item.icon}</div><div><div style={{ ...uf(13,700), color:item.isWarning?T.coral:T.pine, marginBottom:6 }}>{item.title}</div><p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{item.text}</p></div></Card>);
const GuideSidebar = ({ guide, onPlan }) => { const [checked,setChecked]=useState({}); return (<div style={{ display:"flex", flexDirection:"column", gap:16 }}><Card style={{ padding:"22px", background:T.sandLight, borderColor:T.sandDark }}><Label color={T.sage} style={{ marginBottom:10, display:"block" }}>Lagomplan · Planificador</Label><p style={{ ...df(16,700,"italic"), color:T.pine, lineHeight:1.4, marginBottom:16 }}>¿Listo para tu versión del Mundial? Convierte esta guía en un itinerario adaptado a tus tiempos y presupuesto.</p><button onClick={onPlan} style={{ width:"100%", padding:"11px 16px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer" }}>{guide.plannerCTA} →</button></Card><Card style={{ padding:"20px 22px" }}><div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}><div style={{ width:28, height:28, background:T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:13 }}>✦</span></div><Label color={T.pine} style={{ fontSize:11 }}>Notas Lagom</Label></div>{guide.lagomTips.map((tip,i)=>(<div key={i} style={{ display:"flex", gap:11, paddingTop:12, paddingBottom:12, borderBottom:i<guide.lagomTips.length-1?`1px solid ${T.sandDark}`:"none" }}><div style={{ width:5, height:5, borderRadius:"50%", background:T.sage, flexShrink:0, marginTop:7 }} /><p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{tip}</p></div>))}</Card><Card style={{ padding:"20px 22px" }}><div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}><div style={{ width:28, height:28, background:T.matchGoldLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:13 }}>☑</span></div><Label color={T.pine} style={{ fontSize:11 }}>Checklist día de partido</Label></div>{guide.matchDayChecklist.map((item,i)=>(<button key={i} onClick={()=>setChecked(p=>({...p,[i]:!p[i]}))} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderTop:i>0?`1px solid ${T.sandDark}`:"none", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%" }}><div style={{ width:16, height:16, flexShrink:0, marginTop:2, border:`1.5px solid ${checked[i]?T.sage:T.sandDark}`, borderRadius:4, background:checked[i]?T.sage:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>{checked[i]&&<span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}</div><span style={{ ...uf(12,400), color:checked[i]?T.inkFaint:T.inkMid, lineHeight:1.55, textDecoration:checked[i]?"line-through":"none" }}>{item}</span></button>))}</Card><Card style={{ padding:"20px 22px", background:T.fjordLight, borderColor:`${T.fjord}30` }}><Label color={T.fjord} style={{ marginBottom:10, display:"block" }}>¿Sabías que?</Label><p style={{ ...uf(13,400), color:T.fjord, lineHeight:1.72, margin:0 }}>{guide.didYouKnow}</p></Card><Card style={{ padding:"18px 22px", borderStyle:"dashed", borderColor:T.sandDark }}><div style={{ display:"flex", gap:12, alignItems:"flex-start" }}><span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>✦</span><div><div style={{ ...uf(12,700), color:T.pine, marginBottom:6 }}>Optimizar itinerario con IA</div><p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:"0 0 12px" }}>Dinos cuántos días tienes y cuáles partidos quieres ver.</p><button onClick={onPlan} style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2, padding:"7px 14px", cursor:"pointer" }}>Optimizar ruta →</button></div></div></Card></div>); };
const GuideHero = ({ guide }) => (<div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:56, alignItems:"center", padding:"72px 0 64px", borderBottom:`1px solid rgba(28,28,26,0.08)`, marginBottom:56 }}><div><div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, flexWrap:"wrap" }}><span style={{ fontSize:18 }}>{guide.flag}</span><Label color={T.inkFaint}>{guide.country} · {guide.state}</Label><span style={{ color:T.sandDark, fontSize:12 }}>·</span><Label color={T.inkFaint}>{guide.stadium.name}</Label><span style={{ color:T.sandDark, fontSize:12 }}>·</span><Label color={T.inkFaint}>{guide.stadium.capacity}</Label></div><h1 style={{ ...df("clamp(44px,5.5vw,72px)",900,"italic"), color:T.pine, lineHeight:0.92, letterSpacing:"-0.03em", marginBottom:22 }}>{guide.city}</h1><p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, maxWidth:500, marginBottom:32 }}>{guide.description}</p><div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>{guide.tags.map(tag=><span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`, padding:"5px 13px", borderRadius:40 }}>{tag}</span>)}<span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}35`, padding:"5px 13px", borderRadius:40 }}>⚽ {guide.matches.length} partidos</span></div><div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>{guide.scores.map(s=>(<div key={s.label} style={{ display:"flex", flexDirection:"column", gap:5 }}><Label color={T.inkFaint}>{s.label}</Label><div style={{ display:"flex", gap:3 }}>{[1,2,3,4,5].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:i<=s.value?T.sage:T.sandDark }} />)}</div></div>))}</div></div><div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}><MIAIllustration /></div></div>);
const MatchCard = ({ match }) => { const isTBD=!match.teams[0].flag&&!match.teams[1].flag; return (<Card style={{ overflow:"hidden", borderColor:match.highlight?`${T.matchGold}50`:T.sandDark, opacity:isTBD?0.55:1 }}><div style={{ height:4, background:match.highlight?T.matchGold:isTBD?T.sandDark:CITY_ACCENT }} /><div style={{ padding:"22px 24px" }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}><div style={{ display:"flex", alignItems:"center", gap:14 }}><div style={{ textAlign:"center", minWidth:48, padding:"8px 12px", background:T.sand, borderRadius:RADIUS-2, border:`1px solid ${T.sandDark}` }}><div style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkFaint }}>{match.day}</div><div style={{ ...df(20,700), color:T.pine, lineHeight:1.1, margin:"2px 0" }}>{match.date.split(" ")[0]}</div><div style={{ ...uf(9,500), color:T.inkFaint }}>{match.date.split(" ")[1]}</div></div><div><div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3 }}>{match.stadium}</div><div style={{ ...uf(13,500), color:T.inkMid }}>{match.time} local</div></div></div>{match.tag&&<span style={{ ...uf(9,700), letterSpacing:"0.08em", textTransform:"uppercase", color:match.highlight?T.matchGold:CITY_ACCENT, background:match.highlight?T.matchGoldLight:CITY_ACCENT+"15", border:`1px solid ${match.highlight?T.matchGold+"50":CITY_ACCENT+"35"}`, padding:"4px 10px", borderRadius:40, flexShrink:0, maxWidth:140, textAlign:"right" }}>{match.tag}</span>}</div><div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"18px 0", borderTop:`1px solid ${T.sandDark}`, borderBottom:`1px solid ${T.sandDark}`, marginBottom:18 }}><div style={{ flex:1, textAlign:"right" }}><div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[0].name}</div>{match.teams[0].flag&&<div style={{ fontSize:26, lineHeight:1 }}>{match.teams[0].flag}</div>}</div><div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.12em", padding:"6px 14px", background:T.sand, borderRadius:6, border:`1px solid ${T.sandDark}` }}>vs</div><div style={{ flex:1, textAlign:"left" }}><div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[1].name}</div>{match.teams[1].flag&&<div style={{ fontSize:26, lineHeight:1 }}>{match.teams[1].flag}</div>}</div></div>{isTBD?<div style={{ ...uf(12,400), color:T.inkFaint, textAlign:"center", padding:"8px 0", fontStyle:"italic" }}>Rival por definir al terminar fase de grupos</div>:<button style={{ width:"100%", padding:"10px", background:"transparent", border:`1px solid ${T.sandDark}`, borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkMid, cursor:"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }} onMouseEnter={e=>{e.currentTarget.style.borderColor=CITY_ACCENT;e.currentTarget.style.color=T.pine;e.currentTarget.style.background=T.sageLight;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.sandDark;e.currentTarget.style.color=T.inkMid;e.currentTarget.style.background="transparent";}}><span style={{ fontSize:12 }}>✦</span> Planear mi viaje alrededor de este partido</button>}</div></Card>); };
const NAV_ITEMS = [{id:"matches",label:"Partidos"},{id:"manifesto",label:"Manifiesto"},{id:"stays",label:"Dónde dormir"},{id:"vibe",label:"Ambiente"},{id:"logistics",label:"Logística"}];
const StickyNav = ({ active, onNavigate, onBack, city }) => (<div style={{ position:"sticky", top:0, zIndex:40, background:`${T.bg}F5`, backdropFilter:"blur(18px)", borderBottom:`1px solid ${T.sandDark}`, height:52, display:"flex", alignItems:"center", padding:"0 40px", gap:0, overflowX:"auto" }}><button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none", cursor:"pointer", padding:"0 14px 0 0", marginRight:14, borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em" }} onMouseEnter={e=>e.currentTarget.style.color=T.pine} onMouseLeave={e=>e.currentTarget.style.color=T.inkFaint}>← Guías</button><span style={{ ...df(14,700,"italic"), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>{city}</span><div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />{NAV_ITEMS.map(item=><button key={item.id} onClick={()=>onNavigate(item.id)} style={{ ...uf(10,active===item.id?700:500), letterSpacing:"0.08em", textTransform:"uppercase", color:active===item.id?T.pine:T.inkFaint, background:"none", border:"none", padding:"0 13px", height:"100%", cursor:"pointer", borderBottom:`2px solid ${active===item.id?T.coral:"transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0 }}>{item.label}</button>)}</div>);
const GuideDetail = ({ guide, onBack }) => {
  const [active,setActive]=useState("matches");
  const [showManifesto,setShowManifesto]=useState(false);
  const [showVibe,setShowVibe]=useState(false);
  const [showLogistics,setShowLogistics]=useState(false);
  const [showFood,setShowFood]=useState(false);
  const [showExp,setShowExp]=useState(false);
  useEffect(()=>{ const obs=[]; NAV_ITEMS.forEach(item=>{ const el=document.getElementById(item.id); if(!el)return; const o=new IntersectionObserver(([e])=>{ if(e.isIntersecting)setActive(item.id); },{rootMargin:"-30% 0px -65% 0px"}); o.observe(el); obs.push(o); }); return()=>obs.forEach(o=>o.disconnect()); },[]);
  const scrollTo=id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});};
  const renderExp=(exp,num)=>(<div key={num} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}><div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>{String(num).padStart(2,"0")}</div><div><div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}><span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span><Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label><span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span></div><p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p></div></div>);
  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <StickyNav active={active} onNavigate={scrollTo} onBack={onBack} city={guide.city} />
      <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 40px" }}>
        <GuideHero guide={guide} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:52, alignItems:"flex-start" }}>
          <div>
            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos" subtitle="7 partidos incluyendo Semifinal. Brasil-Escocia (24 Jun) y Colombia-Portugal (27 Jun) son los picos de afición latinoamericana." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>{guide.matches.map(m=><MatchCard key={m.id} match={m} />)}</div>
            </section>
            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title="Manifiesto de campo" subtitle="Lo que necesitas saber — especialmente el calor de julio sin A/C y la logística sin metro directo." />
              <Card style={{ marginBottom:24, overflow:"hidden" }}><div style={{ height:4, background:CITY_ACCENT }} /><div style={{ padding:"20px 24px" }}>{guide.manifesto.stadiumInfo.map((item,i)=>(<div key={i} style={{ display:"flex", gap:20, padding:"11px 0", borderBottom:i<guide.manifesto.stadiumInfo.length-1?`1px solid ${T.sandDark}`:"none" }}><span style={{ ...uf(11,600), color:T.inkFaint, minWidth:148, flexShrink:0, letterSpacing:"0.05em" }}>{item.label}</span><span style={{ ...uf(13,500), color:T.ink, lineHeight:1.6 }}>{item.value}</span></div>))}</div></Card>
              {showManifesto&&(<><p style={{ ...uf(15,400), color:T.ink, lineHeight:1.9, marginBottom:24, maxWidth:640 }}>{guide.manifesto.body}</p><LagomNote>{guide.manifesto.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showManifesto} onToggle={()=>setShowManifesto(!showManifesto)} />
            </section>
            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso" subtitle="South Beach, Mid-Beach y Brickell — cada una con lógica diferente para el torneo." />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}><div style={{ display:"flex", gap:10, alignItems:"flex-start" }}><span style={{ fontSize:14, flexShrink:0 }}>⚠️</span><p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>Los precios en Miami son de los más altos del torneo. La Semifinal (11 Jul) es el pico absoluto. Considera <strong>Brickell</strong> o <strong>Coconut Grove</strong> como alternativa a South Beach — mejores precios con buena conexión al Brightline.</p></div></div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>{guide.stays.map(stay=><StayCard key={stay.name} stay={stay} />)}</div>
            </section>
            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente" subtitle="Fan Fest en Bayfront Park, Calle Ocho, Wynwood y la comunidad latinoamericana más densa del torneo." />
              <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe?28:0, maxWidth:640, ...(showVibe?{}:{display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}) }}>{guide.vibe.body}</p>
              {showVibe&&(<><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>{guide.vibeCards.map(item=><CollapsibleVibeCard key={item.title} item={item} />)}</div><LagomNote>{guide.vibe.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showVibe} onToggle={()=>setShowVibe(!showVibe)} />
            </section>
            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio" subtitle="Brightline + Metrobus 297. Sin metro directo. Planifica el regreso antes del partido." />
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:showLogistics?24:0 }}>{guide.logistics.transport.slice(0,2).map((item,i)=><LogisticsCard key={i} item={item} />)}</div>
              {showLogistics&&(<><div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>{guide.logistics.transport.slice(2).map((item,i)=><LogisticsCard key={i} item={item} />)}</div><Card style={{ marginBottom:24 }}><div style={{ padding:"18px 24px" }}><div style={{ ...uf(10,700), letterSpacing:"0.16em", textTransform:"uppercase", color:T.inkFaint, marginBottom:14 }}>Tiempos reales de desplazamiento</div>{guide.logistics.timings.map((t,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:i<guide.logistics.timings.length-1?`1px solid ${T.sandDark}`:"none" }}><span style={{ ...uf(13,400), color:T.inkMid }}>{t.label}</span><span style={{ ...uf(13,700), color:T.pine }}>{t.value}</span></div>)}</div></Card><Card style={{ overflow:"hidden", marginBottom:16 }}><div style={{ height:4, background:T.matchGold }} /><div style={{ padding:"20px 24px" }}><div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}><span style={{ fontSize:16 }}>⚽</span><div style={{ ...uf(11,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.matchGold }}>Cronología recomendada</div><span style={{ ...uf(13,600), color:T.ink }}>{guide.logistics.matchDayCronologia.matchName}</span></div>{guide.logistics.matchDayCronologia.steps.map((step,i)=><div key={i} style={{ display:"flex", gap:16, paddingTop:i>0?14:0, paddingBottom:i<guide.logistics.matchDayCronologia.steps.length-1?14:0, borderBottom:i<guide.logistics.matchDayCronologia.steps.length-1?`1px solid ${T.sandDark}`:"none" }}><span style={{ ...uf(10,700), color:T.matchGold, minWidth:46, flexShrink:0, paddingTop:2 }}>{step.time}</span><p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{step.text}</p></div>)}</div></Card><div style={{ display:"flex", gap:12, padding:"14px 18px", background:T.sandLight, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS }}><span style={{ fontSize:15, flexShrink:0 }}>💡</span><p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{guide.logistics.timing}</p></div></>)}
              <ShowMoreToggle expanded={showLogistics} onToggle={()=>setShowLogistics(!showLogistics)} />
            </section>
            <section style={{ marginBottom:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista" subtitle="Calle Ocho, Wynwood, cocina cubana y la capital latinoamericana de la gastronomía en EE.UU." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>{guide.food.slice(0,3).map((f,i)=><FoodCard key={i} item={f} />)}{showFood&&guide.food.slice(3).map((f,i)=><FoodCard key={i+3} item={f} />)}</div>
              <ShowMoreToggle expanded={showFood} onToggle={()=>setShowFood(!showFood)} />
            </section>
            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio" subtitle="South Beach, Wynwood, los Everglades y Key Biscayne — lo que ninguna otra sede del torneo puede dar." />
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {guide.experiences.slice(0,1).map((exp,i)=>renderExp(exp,i+1))}
                {showExp&&guide.experiences.slice(1).map((exp,i)=>renderExp(exp,i+2))}
              </div>
              <ShowMoreToggle expanded={showExp} onToggle={()=>setShowExp(!showExp)} />
            </section>
            <section style={{ marginBottom:0 }}>
              <div style={{ background:T.pine, borderRadius:RADIUS+2, padding:"48px 44px 44px", overflow:"hidden" }}>
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Manrope:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html{scroll-behavior:smooth;}button{font-family:'Manrope',sans-serif;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.sandDark};border-radius:3px;}`}</style>
      <GuideDetail guide={MIA} onBack={()=>{}} />
    </>
  );
}
