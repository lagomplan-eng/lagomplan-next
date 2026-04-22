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
const CITY_ACCENT = "#E1615B";
const SECTION_ALT_BG = "#F4F0EB";
const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>{children}</span>
);

const ATL = {
  id:"atl", city:"Atlanta", country:"Estados Unidos", state:"Georgia", flag:"🇺🇸", accent:CITY_ACCENT,
  tags:["Fútbol","Cultura","Gastronomía","Sede co-anfitriona"],
  stadium:{ name:"Atlanta Stadium (Mercedes-Benz Stadium)", capacity:"~75,000", area:"Downtown — junto al Centennial Olympic Park" },
  headline:"El único estadio mundialista con techo retráctil y aire acondicionado en Estados Unidos. En julio en Georgia, eso no es un lujo — es una política de salud pública.",
  description:"El único estadio mundialista con techo retráctil y aire acondicionado en Estados Unidos. En julio en Georgia, eso no es un lujo — es una política de salud pública. Atlanta llega al Mundial con ocho partidos, dos presentaciones de España, una Semifinal y una ciudad que lleva dos décadas construyendo la cultura de soccer más seria del sur del país.",
  scores:[
    { label:"Ambiente", value:4 }, { label:"Fútbol local", value:4 }, { label:"Gastronomía", value:4 },
    { label:"Transporte", value:4 }, { label:"Seguridad", value:4 }, { label:"Costo", value:3 },
  ],
  matches:[
    { id:"m1", date:"15 Jun", day:"Lun", time:"12:00 ET", teams:[{name:"España",flag:"🇪🇸"},{name:"Cabo Verde",flag:"🇨🇻"}], stadium:"Atlanta Stadium", tag:"Grupo H — apertura de la sede", highlight:true },
    { id:"m2", date:"18 Jun", day:"Jue", time:"12:00 ET", teams:[{name:"Sudáfrica",flag:"🇿🇦"},{name:"Repechaje UEFA D",flag:""}], stadium:"Atlanta Stadium", tag:"Grupo A", highlight:false },
    { id:"m3", date:"21 Jun", day:"Dom", time:"12:00 ET", teams:[{name:"España",flag:"🇪🇸"},{name:"Arabia Saudita",flag:"🇸🇦"}], stadium:"Atlanta Stadium", tag:"Grupo H — España confirma el grupo", highlight:true },
    { id:"m4", date:"24 Jun", day:"Mié", time:"18:00 ET", teams:[{name:"Marruecos",flag:"🇲🇦"},{name:"Haití",flag:"🇭🇹"}], stadium:"Atlanta Stadium", tag:"Grupo C", highlight:false },
    { id:"m5", date:"27 Jun", day:"Sáb", time:"19:30 ET", teams:[{name:"RD Congo",flag:"🇨🇩"},{name:"Uzbekistán",flag:"🇺🇿"}], stadium:"Atlanta Stadium", tag:"Grupo K", highlight:false },
    { id:"m6", date:"1 Jul", day:"Mié", time:"12:00 ET", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Atlanta Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m7", date:"7 Jul", day:"Mar", time:"12:00 ET", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"Atlanta Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m8", date:"15 Jul", day:"Mié", time:"15:00 ET", teams:[{name:"Semifinal",flag:""},{name:"Por definir",flag:""}], stadium:"Atlanta Stadium", tag:"Semifinal", highlight:true },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"Atlanta Stadium (Mercedes-Benz Stadium)" },
      { label:"Aforo", value:"~75,000 — configuración FIFA" },
      { label:"Clima", value:"Días: 30–34°C · Humedad alta · Interior climatizado con techo retráctil y temperatura controlada" },
      { label:"Partidos", value:"8 confirmados — 5 grupos + 1 Ronda de 32 + 1 Ronda de 16 + 1 Semifinal" },
      { label:"Nota del estadio", value:"Mercedes-Benz Stadium: primer estadio profesional con certificación LEED Platinum en EE.UU. Los precios de comida dentro son deliberadamente más bajos que en cualquier otro estadio de la NFL." },
      { label:"Aeropuerto", value:"ATL — Hartsfield-Jackson Atlanta International · el aeropuerto más transitado del mundo · MARTA directo al centro en ~20 min" },
    ],
    body:"Atlanta llega al Mundial con ocho partidos, el único estadio climatizado de Estados Unidos en el torneo y una ciudad que lleva dos décadas construyendo la cultura de soccer más seria del sur del país. España juega dos de sus tres partidos de grupos en Atlanta. Si avanza — lo que el sorteo sugiere fuertemente — los aficionados españoles tienen una base fija aquí durante dos semanas. La diáspora africana llena las tribunas de Marruecos y RD Congo desde adentro de la ciudad; y el 15 de julio, una Semifinal llega al mismo recinto donde Atlanta United gana sus títulos.",
    lagomNote:"España juega dos partidos en Atlanta (15 y 21 de junio). Para la Semifinal del 15 de julio, los precios de hotel en Midtown suben a niveles de Super Bowl. Reserva ambas fechas simultáneamente o busca Airbnb en Decatur o Virginia-Highland, barrios bien conectados por MARTA con precios más razonables.",
  },
  vibe:{
    body:"Atlanta tiene una de las comunidades africanas más grandes de Estados Unidos — las diásporas de Ghana, Nigeria, Etiopía y Senegal dan a los partidos de Cabo Verde, Marruecos y RD Congo una tribuna local que nadie tuvo que comprar un vuelo para estar ahí. España suma una comunidad hispanohablante de más de 800,000 personas en el área metropolitana. El Atlanta United fue el equipo que demostró que el sur de Estados Unidos podía sostener una cultura de soccer seria. Los Five Stripes promedian 45,000 espectadores por partido en el mismo estadio del Mundial — la mayor asistencia de la MLS. La capital culinaria del sur de Estados Unidos suma chicken and waffles, cocina coreana en Doraville, la mejor escena de restaurantes de autor del sureste del país y el Sweet Auburn Curb Market con décadas de historia.",
    lagomNote:"Más accesible que las sedes de la Costa Este. Los precios suben en las fechas de España y la Semifinal, pero el margen de aumento es manejable comparado con Nueva York o Miami.",
  },
  stays:[
    { name:"Hotel Clermont", area:"Ponce de Leon / Midtown-Inman Park", price:"$$$", priceCAD:"$220–380 USD/noche (periodo mundialista)", tags:["Hotel boutique","Rooftop","Ponce City Market cerca"], note:"El hotel que revivió el Ponce de Leon corridor de Atlanta: rooftop bar con vistas al skyline, restaurante propio y habitaciones con diseño deliberado en un edificio de los años 20. A dos cuadras del Ponce City Market y a quince minutos del estadio en MARTA.", best_for:"Carácter", url:"" },
    { name:"Loews Atlanta Hotel", area:"Midtown", price:"$$$", priceCAD:"$190–320 USD/noche (periodo mundialista)", tags:["Valor","MARTA cerca","Habitaciones amplias"], note:"La mejor relación posición-precio-servicio de Midtown: habitaciones amplias, gimnasio, pool y acceso caminando a la estación de MARTA Midtown. Cuatro cuadras de Peachtree Street.", best_for:"Fan WC", url:"" },
    { name:"Four Seasons Atlanta", area:"Midtown / 14th Street", price:"$$$$", priceCAD:"$480–850 USD/noche (periodo mundialista)", tags:["Lujo","Piedmont Park","Spa"], note:"La dirección de referencia en Atlanta: vistas al parque Piedmont, restaurante Park 75 y spa de piso completo. A tres cuadras de la estación de MARTA Arts Center.", best_for:"Lujo", url:"" },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Atlanta — ATL", text:"ATL — Hartsfield-Jackson Atlanta International es el aeropuerto más transitado del mundo. El MARTA Gold Line sale del aeropuerto directamente al centro de Atlanta en veinte minutos. Desde el avión hasta la puerta del Mercedes-Benz Stadium en menos de 35 minutos, sin taxi." },
      { icon:"🚇", title:"Ruta maestra — MARTA Roja o Dorada", text:"MARTA línea Roja o Dorada → Vine City Station o GWCC/CNN Center Station. Desde Midtown (Arts Center o Midtown Station) hasta Vine City: dos o tres paradas sin transbordo, en ocho a doce minutos. Tarifa: $2.50 con tarjeta Breeze." },
      { icon:"🏟", title:"Al estadio el día del partido", text:"El MARTA conecta directamente con el complejo del estadio desde múltiples puntos de la ciudad. Es el tránsito público más limpio y directo de cualquier sede del sur del país. Desde Inman Park, transbordo en Five Points y llegada al complejo del estadio en aproximadamente veinte minutos." },
      { icon:"⚠️", title:"Error crítico — subestimar el calor exterior", text:"El trayecto entre la estación de MARTA y la entrada del estadio, las filas de seguridad exteriores y las zonas de espera al aire libre pueden sumar 20–30 minutos bajo el sol de julio en Atlanta con humedad alta. Lleva agua, protector solar y ropa que permita sudar.", isWarning:true },
    ],
    timings:[
      { label:"Desde Midtown (Arts Center) en MARTA", value:"~12 min" },
      { label:"Desde ATL (aeropuerto) en MARTA Gold Line", value:"~30 min puerta a puerta" },
      { label:"Desde Inman Park en MARTA", value:"~20 min con transbordo en Five Points" },
      { label:"Uber desde Midtown", value:"10–20 min · regreso post-partido con espera larga" },
    ],
    matchDayCronologia:{
      matchName:"15 Jul · Semifinal · 15:00 ET",
      steps:[
        { time:"H-3:00", text:"Almuerza en Midtown o Inman Park. La Semifinal arranca a las 3pm — el mediodía tiene el calor más intenso del día." },
        { time:"H-2:30", text:"MARTA desde tu estación hacia Vine City o GWCC/CNN Center Station." },
        { time:"H-1:30", text:"Llegada al estadio. El aire acondicionado entra en funcionamiento en cuanto cruzas el acceso." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:45", text:"MARTA de regreso. Servicio ampliado post-partido." },
      ],
    },
    timing:"Mercedes-Benz Stadium tiene lo que no tiene ningún otro estadio mundialista norteamericano, salvo el BC Place de Vancouver: un techo que se cierra y aire acondicionado. El calor de julio en Georgia deja de ser un problema en el momento en que cruzas la puerta del estadio.",
    cost:"Más accesible que las sedes de la Costa Este. Los precios suben en las fechas de España y la Semifinal, pero el margen de aumento es manejable comparado con Nueva York o Miami.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Centennial Olympic Park", type:"Fan fest oficial", typeColor:T.coral, desc:"El Fan Fest de Atlanta se instala en el Centennial Olympic Park — el parque construido para los Juegos Olímpicos de 1996 en el corazón del downtown, a cinco minutos caminando del estadio. Pantallas gigantes, programación musical y acceso gratuito desde el MARTA. Para los partidos de España en especial, el parque acumula una multitud que mezcla la diáspora hispanohablante de Atlanta con aficionados internacionales.", tag:"Sin boleto OK" },
    { title:"Centennial Olympic Park — exterior", type:"Pantalla exterior", typeColor:T.fjord, desc:"Las dimensiones del Centennial son tan generosas que el perímetro exterior del parque, con pantallas orientadas hacia las calles adyacentes, funciona como segundo anillo de transmisión. Para el fan que llega tarde al Fan Fest oficial, el exterior tiene ambiente sin necesidad de registro.", tag:"Icónico" },
    { title:"Decatur Square — WatchFest 26", type:"WatchFest 26", typeColor:T.sage, desc:"El ayuntamiento del municipio de Decatur, a 10 km del downtown de Atlanta por la línea MARTA, organiza WatchFest 26: 34 días de transmisiones al aire libre en la plaza principal con conciertos incluidos. Para el fan que quiere el ambiente sin la masividad del Fan Fest central.", tag:"Local" },
    { title:"Piedmont Park (Midtown)", type:"Parque urbano", typeColor:T.pine, desc:"El parque urbano más grande de Atlanta activa su gran prado central con pantallas para partidos de alta demanda. La comunidad de fanáticos de Atlanta United — los más organizados de la ciudad — usa Piedmont como punto de reunión orgánico para los partidos que no tienen pantalla en el Centennial.", tag:"Comunidad" },
    { title:"The Midway Pub", type:"Bar de barrio", typeColor:"#1A3A5C", desc:"Bar de barrio con pantallas en todos los ángulos y una clientela mixta que va desde los aficionados del Atlanta United hasta quienes siguen la Premier League con criterio. Para los partidos de Marruecos y España, The Midway es de los pocos lugares en Atlanta donde la afición del equipo visitante también encuentra su comunidad. Qué pedir: Alitas + cerveza artesanal de Georgia. Vibe: Bar auténtico, el más futbolero de Atlanta fuera del Centennial.", tag:"Little Five Points" },
    { title:"Fado Irish Pub", type:"Pub irlandés", typeColor:"#093b12", desc:"El pub irlandés de referencia de Atlanta, con pantallas de gran formato y una tradición establecida de transmitir fútbol europeo desde antes de que la MLS existiera en la ciudad. Para el partido de España vs. Arabia Saudita (21 de junio), la afición española de Atlanta convierte Fado en un punto de concentración. Qué pedir: Shepherd's pie + Guinness de barril. Vibe: Pub europeo, historial de fútbol serio.", tag:"Buckhead" },
    { title:"Stats Brewpub", type:"Cervecería", typeColor:"#5A3A2A", desc:"Cervecería con el mayor número de pantallas de cualquier local del downtown de Atlanta y una selección de cervezas artesanales de Georgia seria. A cinco minutos caminando del Mercedes-Benz Stadium. Para los partidos sin afición masiva, Stats tiene el ambiente correcto sin el caos del Fan Fest. Qué pedir: Lo que esté de temporada en el taproom + pizza de masa madre. Vibe: Cervecero, pantallas serias.", tag:"Downtown" },
  ],
  food:[
    { dish:"The Midway Pub", where:"Little Five Points — alitas + cerveza artesanal de Georgia; bar de barrio auténtico, el más futbolero de Atlanta fuera del Centennial", price:"$$", type:"Pre-partido" },
    { dish:"Fado Irish Pub", where:"Buckhead — shepherd's pie + Guinness de barril; pub europeo con historial de fútbol serio", price:"$$", type:"Pub europeo" },
    { dish:"Stats Brewpub", where:"Downtown — cerveza de temporada + pizza de masa madre; pantallas serias a cinco minutos del estadio", price:"$$", type:"Pantallas" },
    { dish:"Sweet Auburn Curb Market", where:"Sweet Auburn — mercado histórico desde 1918 en el barrio donde nació Martin Luther King Jr.; cocina sureña y ambiente auténtico", price:"$–$$", type:"Mercado" },
    { dish:"Cocina coreana, vietnamita y etíope", where:"Doraville / Buford Highway — la mayor diversidad gastronómica de la ciudad en un radio de diez kilómetros", price:"$–$$", type:"Excursión" },
    { dish:"Chicken and waffles", where:"Atlanta — capital culinaria del sur de Estados Unidos, con argumento gastronómico propio y serio", price:"$$", type:"Local" },
  ],
  experiences:[
    { title:"Martin Luther King Jr. National Historic Site", duration:"Medio día", desc:"El complejo del National Park Service en Sweet Auburn incluye la casa natal de King, la iglesia Ebenezer Baptist Church donde predicó y su tumba junto a Coretta Scott King — todo en el mismo radio de cuatro cuadras. Entrada gratuita, acceso por MARTA (estación King Memorial). El Centro Internacional de los Derechos Civiles y los Derechos Humanos, a diez minutos caminando del Centennial Olympic Park, complementa el recorrido con una exposición sobre el movimiento global.", type:"Historia", affiliateLink:"", affiliateLabel:"Ver información" },
    { title:"Georgia Aquarium + World of Coca-Cola", duration:"Día completo", desc:"El Georgia Aquarium en el downtown es el más grande del hemisferio occidental: cuatro millones de galones de agua, tiburones ballena, belugas y delfines. A cien metros, el World of Coca-Cola tiene degustación de más de cien sabores de la marca desde todo el mundo. Los dos en el mismo radio de tres cuadras, con aire acondicionado — un día completo sin auto y sin sol directo.", type:"Familia", affiliateLink:"", affiliateLabel:"Ver entradas" },
    { title:"Piedmont Park + BeltLine", duration:"Mañana o tarde", desc:"Piedmont Park en Midtown tiene 185 acres de parque urbano con lago, senderos y los mejores atardeceres de la ciudad. Conecta con el Atlanta BeltLine — corredor peatonal y ciclista de 35 kilómetros alrededor del núcleo de la ciudad. El tramo Eastside Trail, desde Inman Park hasta Ponce City Market, es el más activo y tiene acceso a mercados, restaurantes y galerías. Para el día libre entre el 21 y el 24 de junio, el BeltLine en bicicleta es el plan más completo de Atlanta.", type:"Ciudad", affiliateLink:"", affiliateLabel:"Alquilar bicicleta" },
    { title:"Ponce City Market + Eastside Trail", duration:"Medio día", desc:"El Ponce City Market ocupa un antiguo edificio de distribución de Sears con más de cien tiendas y restaurantes en un solo recinto. Conectado al BeltLine, funciona como punto de entrada natural a Inman Park, al corredor gastronómico del Eastside Trail y a la Atlanta que se entiende mejor caminando que desde un auto.", type:"Gastronomía", affiliateLink:"", affiliateLabel:"Ver opciones" },
  ],
  lagomTips:[
    "España juega dos de sus tres partidos de grupos en Atlanta. Si avanza — lo que el sorteo sugiere fuertemente — los aficionados españoles tienen una base fija aquí durante dos semanas.",
    "MARTA línea Roja o Dorada hacia Vine City Station o GWCC/CNN Center Station es la ruta maestra. Desde Midtown son dos o tres paradas sin transbordo, en ocho a doce minutos.",
    "No subestimes el calor exterior. El estadio está climatizado, pero filas, caminatas y zonas de espera pueden sumar 20–30 minutos bajo sol de julio con humedad alta.",
    "Reserva simultáneamente fechas de España y Semifinal. Para el 15 de julio, Midtown puede subir a niveles de Super Bowl; Decatur y Virginia-Highland son alternativas razonables.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Tarjeta Breeze o pago sin contacto para MARTA",
    "Ruta MARTA definida: Vine City o GWCC/CNN Center",
    "Agua para el trayecto exterior",
    "Protector solar",
    "Ropa ligera que permita sudar",
    "Reserva de hotel confirmada para 15 y 21 de junio (España) y 15 de julio (Semifinal)",
    "Llegada al estadio 90 min antes — el A/C empieza al cruzar el acceso",
  ],
  didYouKnow:"Mercedes-Benz Stadium es el primer estadio deportivo profesional en obtener la certificación LEED Platinum en Estados Unidos. Los precios de comida dentro del recinto son notablemente más bajos que en cualquier otro estadio de la NFL — política deliberada del propietario.",
  closingNote:"Atlanta llega al Mundial con ocho partidos, el único estadio climatizado de Estados Unidos en el torneo y una ciudad que lleva dos décadas construyendo la cultura de soccer más seria del sur del país. España juega aquí dos veces seguidas; la diáspora africana llena las tribunas de Marruecos y RD Congo desde adentro de la ciudad; y el 15 de julio, una Semifinal en el mismo recinto donde Atlanta United gana sus títulos. El MARTA llega directo. El aire acondicionado funciona. LagomPlan te da la estación y el barrio. La ciudad pone el resto.",
  closingSignature:"Lagomplan · Guía de campo · Atlanta · Mundial 2026",
  plannerCTA:"Generar mi viaje a Atlanta",
};

const AtlIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#F0EDE8" rx={RADIUS} />
    <rect x="0" y="100" width="280" height="40" fill="#E8D8CC" />
    <rect x="18" y="55" width="12" height="45" fill="#C4622A" opacity="0.35" rx={1} />
    <rect x="35" y="40" width="18" height="60" fill="#C4622A" opacity="0.45" rx={1} />
    <rect x="58" y="48" width="14" height="52" fill="#C4622A" opacity="0.3" rx={1} />
    <rect x="77" y="30" width="22" height="70" fill="#C4622A" opacity="0.5" rx={1} />
    <rect x="104" y="43" width="16" height="57" fill="#C4622A" opacity="0.35" rx={1} />
    <rect x="125" y="35" width="20" height="65" fill="#C4622A" opacity="0.4" rx={1} />
    <ellipse cx="195" cy="92" rx="42" ry="14" fill="#2D2D2D" opacity="0.12" />
    <rect x="153" y="78" width="84" height="14" fill="#3A3A3A" opacity="0.1" rx={2} />
    <path d="M153,78 Q195,55 237,78" stroke="#2D2D2D" strokeWidth="1.5" fill="none" opacity="0.2" />
    <circle cx="195" cy="78" r="5" fill="#2D2D2D" opacity="0.15" />
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
const Divider = ({ my=48 }) => <div style={{ height:1, background:T.sandDark, margin:`${my}px 0` }} />;
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
      <a href={stay.url || "#"} target={stay.url ? "_blank" : undefined} rel="noopener noreferrer" style={{ display:"block", textAlign:"center", width:"100%", padding:"11px", borderRadius:RADIUS-2, background: stay.url ? T.pine : T.sandDark, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, textDecoration:"none", transition:"opacity 0.18s", pointerEvents: stay.url ? "auto" : "none", opacity: stay.url ? 1 : 0.45 }}
        onMouseEnter={e => { if (stay.url) e.currentTarget.style.opacity="0.82"; }}
        onMouseLeave={e => { if (stay.url) e.currentTarget.style.opacity="1"; }}>
        Ver opciones →
      </a>
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
        <p style={{ ...uf(16, 700), color:T.pine, lineHeight:1.4, marginBottom:16 }}>¿Listo para tu versión del Mundial? Convierte esta guía en un itinerario adaptado a tus tiempos y presupuesto.</p>
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
      <h1 style={{ ...uf("clamp(44px,5.5vw,72px)", 900), color:T.pine, lineHeight:0.92, letterSpacing:"-0.03em", marginBottom:22 }}>{guide.city}</h1>
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
    <div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}><AtlIllustration /></div>
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
    <span style={{ ...uf(14, 700), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>{city}</span>
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
            {/* 01 — PARTIDOS */}
            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos" subtitle="8 partidos confirmados en Atlanta Stadium. Los de España — 15 y 21 de junio — son los de mayor demanda. La Semifinal del 15 de julio es el pico absoluto." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {guide.matches.map(match => <MatchCard key={match.id} match={match} onPlanAround={() => {}} />)}
              </div>
            </section>
            {/* 02 — MANIFIESTO */}
            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title="Manifiesto de campo" subtitle="Lo que necesitas saber antes de llegar." />
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
            {/* 03 — STAYS */}
            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso" subtitle="Refugios seleccionados con acceso directo al MARTA y a los mejores barrios entre partidos." />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>Los precios indicados son estimaciones para el periodo mundialista. Los partidos de España (15 y 21 de junio) y la Semifinal del 15 de julio son las fechas de mayor demanda. Reserva simultáneamente o busca Airbnb en <strong>Decatur</strong> o <strong>Virginia-Highland</strong>, bien conectados por MARTA.</p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay => <StayCard key={stay.name} stay={stay} />)}
              </div>
            </section>
            {/* 04 — VIBE */}
            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente" subtitle="Fan Fest en el Olympic Park, Decatur WatchFest y los bares de barrio donde el fútbol lleva décadas." />
              <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe?28:0, maxWidth:640, ...(showVibe?{}:{ display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{guide.vibe.body}</p>
              {showVibe && (<><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>{guide.vibeCards.map(item => <CollapsibleVibeCard key={item.title} item={item} />)}</div><LagomNote>{guide.vibe.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} />
            </section>
            {/* 05 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio" subtitle="MARTA línea Roja o Dorada → Vine City. La instrucción más importante de esta guía." />
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
            {/* 06 — FOOD */}
            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista" subtitle="La capital culinaria del sur: chicken and waffles, Sweet Auburn Market, Buford Highway y cocina de todo el mundo." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                {guide.food.slice(0,3).map((f, i) => <FoodCard key={i} item={f} />)}
                {showFood && guide.food.slice(3).map((f, i) => <FoodCard key={i+3} item={f} />)}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} />
            </section>
            {/* 07 — EXPERIENCES */}
            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio" subtitle="El entretiempo ideal en una ciudad con capas históricas, culturales y gastronómicas que el fútbol no agota." />
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
            {/* 08 — CIERRE */}
            <section style={{ marginBottom:0, scrollMarginTop:64 }}>
              <div style={{ background:T.pine, borderRadius:RADIUS+2, padding:"48px 44px 44px", position:"relative", overflow:"hidden" }}>
                <div style={{ width:32, height:2, background:T.coral, marginBottom:28, opacity:0.85 }} />
                <blockquote style={{ ...df("clamp(18px,2.4vw,24px)",400,"italic"), color:T.sand, lineHeight:1.75, margin:"0 0 24px", maxWidth:540 }}>"{guide.closingNote}"</blockquote>
                <Label color={`${T.sage}`} style={{ opacity:0.7 }}>{guide.closingSignature}</Label>
              </div>
            </section>
          </div>
          {/* SIDEBAR */}
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
      <GuideDetail guide={ATL} onBack={() => {}} />
    </>
  );
}
