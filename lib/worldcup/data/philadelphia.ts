import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#004C54'

export const es: CityGuide = {
  id:"phi",
  city:"Filadelfia",
  country:"Estados Unidos",
  state:"Pennsylvania",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["250° Independencia","Historia","Ronda de 16","Sede co-anfitriona"],

  stadium:{ name:"Philadelphia Stadium (Lincoln Financial Field)", capacity:"~67,594", area:"South Philadelphia — a 6 km del centro histórico" },

  headline:"El 4 de julio de 2026, Filadelfia celebra 250 años de independencia y un partido de Ronda de 16. El orden de las prioridades lo decide cada quien.",
  description:"Filadelfia tiene 6 partidos, el aeropuerto más cercano a un estadio mundialista del torneo (5 km) y el metro más directo desde el centro. El 4 de julio coincide con el 250° aniversario de la independencia de EE.UU. — la ciudad donde se firmó en 1776 es el epicentro nacional de esa fecha, y un partido de Ronda de 16 se juega en el mismo estadio de los Eagles.",

  scores:[
    { label:"Ambiente",     value:4 },
    { label:"Fútbol local", value:3 },
    { label:"Gastronomía",  value:4 },
    { label:"Transporte",   value:5 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:3 },
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
      { label:"Estadio FIFA",   value:"Philadelphia Stadium (Lincoln Financial Field)" },
      { label:"Aforo",          value:"~67,594 — configuración FIFA (estadio al aire libre, sin techo)" },
      { label:"Clima (jun–jul)",value:"Días: 24–30°C · Humedad moderada-alta · Los partidos nocturnos tienen condiciones más agradables" },
      { label:"Partidos",       value:"6 confirmados — 5 grupos + Ronda de 16 el 4 de julio" },
      { label:"Ubicación",      value:"South Philadelphia — a 6 km del centro histórico. En el mismo complejo deportivo de los Eagles, Phillies y Sixers. SEPTA Broad Street Line directo." },
      { label:"Aeropuerto",     value:"PHL — Philadelphia International · el aeropuerto más cercano a un estadio mundialista del torneo (~5 km, ~10 min en auto)" },
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
      { label:"Rittenhouse Square en Broad Street Line",       value:"~18 min" },
      { label:"Old City / histórico (desde City Hall BSL)",     value:"~22 min" },
      { label:"PHL (aeropuerto) en Uber directo",               value:"~10 min · <$20" },
      { label:"Fishtown en SEPTA + BSL (transbordo)",           value:"~35 min" },
      { label:"Auto desde Center City (día normal / 4 Jul)",    value:"15–25 min · 45–60 min" },
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
    { title:"FIFA Fan Festival™ — Penn's Landing / Delaware Waterfront", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest se instala en Penn's Landing, el frente marítimo del río Delaware con vistas al puente Ben Franklin. Filadelfia fundó aquí los primeros muelles de la colonia en el siglo XVII. Pantallas de gran formato, programación cultural y acceso desde Old City a pie o desde Center City por el SEPTA Market-Frankford Line (estación 2nd Street). Operación: todo el período mundialista.", tag:"Waterfront" },
    { title:"Xfinity Live! (South Philadelphia)", type:"Complejo deportivo", typeColor:FJORD, desc:"El complejo de entretenimiento junto a los estadios deportivos de South Philly — a cuatro cuadras del Lincoln Financial Field — tiene plazas exteriores y pantallas permanentes. Para el fan que quiere el ambiente del estadio sin el boleto, Xfinity Live! es el punto de concentración natural del barrio deportivo de Filadelfia.", tag:"South Philly" },
    { title:"Lemon Hill (East Fairmount Park)", type:"Parque con pantalla", typeColor:SAGE, desc:"Lemon Hill tiene las mejores vistas del río Schuylkill y del skyline desde cualquier punto verde de la ciudad. Las colinas del parque son el escenario natural para transmisiones informales que coexisten con el evento oficial del Fan Fest de Penn's Landing.", tag:"Schuylkill" },
    { title:"McGillin's Olde Ale House (Center City)", type:"Pub histórico", typeColor:PINE, desc:"El bar más antiguo de Filadelfia en operación continua desde 1860. Pantallas en todos los espacios, menú de pub americano clásico y una historia en las paredes que convierte cada visita en algo más que ver un partido. Para los días de Croacia y Ghana — grupos con diásporas europeas activas en Filadelfia — McGillin's es el punto de reunión natural.", tag:"Desde 1860" },
    { title:"Pizzata Pompette (South Philly)", type:"Italiano con pantalla", typeColor:"#004C54", desc:"Restaurante-bar en el barrio italiano con pantallas, cocina napolitana honesta y una clientela local que incluye a los mismos empleados del Lincoln Financial Field que viven a cuatro cuadras. Para Croacia vs. Ghana (27 de junio), Pizzata Pompette tiene el ambiente de barrio correcto.", tag:"Italian Market" },
    { title:"Independence Hall + Liberty Bell", type:"Histórico", typeColor:"#B8860B", desc:"No es un bar, pero es la razón por la que Filadelfia existe en el calendario mundial del 4 de julio de 2026. El complejo donde se firmó la Constitución en 1787 y donde suena la campana de la independencia. Gratuito, acceso sin reserva. Visita el día ANTES del 4 de julio — ese día el Mall tiene acceso limitado.", tag:"Sin boleto" },
  ],

  food:[
    { dish:"McGillin's Olde Ale House",  where:"Center City — pretzel blando + cerveza local; el bar más antiguo de Filadelfia (1860), siempre con partido en pantalla",          price:"$$", type:"Pub histórico" },
    { dish:"Xfinity Live!",               where:"South Philadelphia — el complejo junto al estadio con pantallas monumentales y terrazas; segundo estadio del barrio deportivo",    price:"$$", type:"Complejo" },
    { dish:"Pizzata Pompette",            where:"South Philly — pizza margarita + vino natural; italiano honesto con pantallas, sin turismo calculado",                             price:"$$", type:"Italiano" },
    { dish:"Pat's / Geno's (cheesesteak)",where:"Passyunk Avenue — el ritual obligatorio de Filadelfia; la guerra fría más vieja de la ciudad entre dos locales enfrentados",       price:"$",  type:"Ritual" },
    { dish:"Reading Terminal Market",     where:"Center City — el mercado cubierto más antiguo del país (1893); DiNic's para sándwich de puerco, Beiler's para donuts Amish",       price:"$",  type:"Mercado" },
    { dish:"Italian Market",              where:"South Philly / 9th Street — el mercado al aire libre más antiguo de EE.UU. (1884); martes de junio es día completo",               price:"$",  type:"Barrio" },
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

  sectionSubtitles:{
    matches:"6 partidos en Lincoln Financial Field — Brasil el 19 de junio y la Ronda de 16 del 4 de julio (250° aniversario).",
    vibe:"Fan Fest oficial en Penn's Landing, pantallas en Xfinity Live! y los pubs históricos que llevan décadas transmitiendo fútbol europeo.",
    logistics:"SEPTA Broad Street Line directo de City Hall al estadio en 18 minutos. PHL es el aeropuerto más cercano del torneo — 5 km, 10 min en Uber.",
    food:"Cheesesteaks de Passyunk, Reading Terminal Market, el Italian Market de South Philly y los pubs históricos del centro.",
  },
  staysWarning:"Los precios son estimaciones para el periodo mundialista. El 4 de julio de 2026 es la fecha más crítica — el 250° aniversario trae tres eventos simultáneos (celebraciones del Independence Mall + fuegos sobre el río + Ronda de 16). Reserva con meses de anticipación y llega con un día de margen.",
}

export const en: CityGuide = {
  id:"phi",
  city:"Philadelphia",
  country:"United States",
  state:"Pennsylvania",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["250th Independence","History","Round of 16","Co-host city"],

  stadium:{ name:"Philadelphia Stadium (Lincoln Financial Field)", capacity:"~67,594", area:"South Philadelphia — 6 km from the historic center" },

  headline:"On July 4, 2026, Philadelphia celebrates 250 years of independence and a Round of 16 match. Everyone orders their own priorities.",
  description:"Philadelphia has 6 matches, the closest airport to any World Cup stadium in the tournament (5 km), and the most direct subway from downtown. July 4 coincides with the 250th anniversary of U.S. independence — the city where it was signed in 1776 is the national epicenter of that date, and a Round of 16 match is played at the same Eagles stadium.",

  scores:[
    { label:"Atmosphere", value:4 },
    { label:"Football",   value:3 },
    { label:"Food",       value:4 },
    { label:"Transit",    value:5 },
    { label:"Safety",     value:4 },
    { label:"Cost",       value:3 },
  ],

  matches:[
    { id:"m1", date:"Jun 14", day:"Sun", time:"19:00 ET", teams:[{name:"Côte d'Ivoire",flag:"🇨🇮"},{name:"Ecuador",flag:"🇪🇨"}], stadium:"Lincoln Financial Field", tag:"Group E", highlight:false },
    { id:"m2", date:"Jun 19", day:"Fri", time:"21:00 ET", teams:[{name:"Brazil",flag:"🇧🇷"},{name:"Haiti",flag:"🇭🇹"}], stadium:"Lincoln Financial Field", tag:"Group C · Brazil", highlight:true },
    { id:"m3", date:"Jun 22", day:"Mon", time:"17:00 ET", teams:[{name:"France",flag:"🇫🇷"},{name:"IC Playoff 2",flag:""}], stadium:"Lincoln Financial Field", tag:"Group I", highlight:true },
    { id:"m4", date:"Jun 25", day:"Thu", time:"16:00 ET", teams:[{name:"Curaçao",flag:"🇨🇼"},{name:"Côte d'Ivoire",flag:"🇨🇮"}], stadium:"Lincoln Financial Field", tag:"Group E", highlight:false },
    { id:"m5", date:"Jun 27", day:"Sat", time:"17:00 ET", teams:[{name:"Croatia",flag:"🇭🇷"},{name:"Ghana",flag:"🇬🇭"}], stadium:"Lincoln Financial Field", tag:"Group L", highlight:false },
    { id:"m6", date:"Jul 4",  day:"Sat", time:"17:00 ET", teams:[{name:"Round of 16",flag:""},{name:"TBD",flag:""}], stadium:"Lincoln Financial Field", tag:"250th Indep. · R16", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",      value:"Philadelphia Stadium (Lincoln Financial Field)" },
      { label:"Capacity",          value:"~67,594 — FIFA configuration (open-air stadium, no roof)" },
      { label:"Weather (Jun–Jul)", value:"Days: 24–30°C · Moderate-to-high humidity · Night matches bring more pleasant conditions" },
      { label:"Matches",           value:"6 confirmed — 5 group + Round of 16 on July 4" },
      { label:"Location",          value:"South Philadelphia — 6 km from the historic center. In the same sports complex as the Eagles, Phillies, and Sixers. SEPTA Broad Street Line direct." },
      { label:"Airport",           value:"PHL — Philadelphia International · the closest airport to any World Cup stadium in the tournament (~5 km, ~10 min by car)" },
    ],
    body:"Philadelphia has the clearest logistical advantage of any host city on the East Coast: the stadium sits in South Philadelphia, linked to downtown by the country's most direct subway, and the airport is five kilometers from the stadium. The city navigates itself. Brazil on June 19 at 9pm and July 4 with the whole city celebrating are the two moments that define the venue. Philadelphia is the most passionate sports city in the United States — and the least interested in hiding it.",
    lagomNote:"July 4, 2026 is the most complex date to manage. The 250th anniversary turns Philadelphia into the national destination for that date — millions of visitors for the Independence Mall events, fireworks over the river, and concerts on the Parkway. The Round of 16 match adds a third flow on top. Book accommodation months ahead and arrive with a day of buffer.",
  },

  vibe:{
    body:"Philadelphia is the most passionate sports city in the United States — and the least interested in hiding it. A fan base that arrives at the match with intent. Philadelphia Union has one of the loudest fan bases in MLS, and Sons of Ben — their organized supporter group — has been a reference in North American football for years. The World Cup multiplies it via the Caribbean, West African, and Eastern European diasporas. Philadelphia has had one of the most serious food-scene revivals of the last decade: the Italian Market in South Philly, the Reading Terminal Market downtown, and chef-driven restaurants in Fishtown and Northern Liberties.",
    lagomNote:"July 4 coincides with the 250th anniversary celebrations. Independence Mall has limited access and closed traffic — visit the day before. The Broad Street Line runs from City Hall to the stadium in 18 minutes, dodging all the downtown chaos.",
  },

  stays:[
    { name:"The Rittenhouse Hotel", area:"Rittenhouse Square / Center City", price:"$$$$", priceCAD:"$350–580 USD/night (World Cup period)", tags:["Boutique hotel","Spa","Broad Street Line"], note:"Philadelphia's reference hotel since the 90s: square views, spa, a high-caliber restaurant, and rooms that don't need a design refresh because the classic works. Three blocks from the Broad Street Line and twenty minutes from the stadium by subway.", best_for:"Character", url:"https://booking.stay22.com/lagomplan/MyXircbGCg" },
    { name:"Apple Hostels of Philadelphia", area:"Old City / Cristo Rey", price:"$", priceCAD:"$60–130 USD/night by room type", tags:["Budget","Historic district","Near Liberty Bell"], note:"Philadelphia's best-rated hostel, in the historic district two blocks from the Liberty Bell and Independence Hall. Private and shared rooms, communal kitchen, and a rooftop with views. For the budget traveler who wants the city, not just the match.", best_for:"Budget", url:"https://booking.stay22.com/lagomplan/jMbVoUSYQC" },
    { name:"Four Seasons Philadelphia", area:"Center City / Comcast Tower", price:"$$$$", priceCAD:"$650–1,100 USD/night (World Cup period)", tags:["57th floor","Schuylkill views","Jean-Georges"], note:"On the 57th floor of Philadelphia's tallest skyscraper — the only address in the city with full views of the Schuylkill and Delaware rivers. A pool on the 57th floor, Jean-Georges Vongerichten's restaurant, and access to every SEPTA line from street level.", best_for:"Luxury", url:"https://booking.stay22.com/lagomplan/1ZZSzLZttO" },
  ],

  logistics:{
    transport:[
      { icon:"🚇", title:"Master route — SEPTA Broad Street Line → AT&T Station", text:"Philadelphia's orange subway line runs from City Hall directly to AT&T Station — the station sits inside the South Philly sports complex. The stadium is a three-minute walk from the subway exit. Regular frequency: every 8–12 minutes. Match days: expanded service at 4–6 minute frequency. Fare: $2.50 with a SEPTA Key card or contactless payment." },
      { icon:"✈", title:"From PHL (airport) — the closest in the tournament", text:"Philadelphia's airport is five kilometers from the stadium — the shortest distance from any airport to any World Cup stadium in the tournament. By Uber or taxi: 10 minutes and under $20. By SEPTA Airport Line to Center City + Broad Street Line to the stadium: ~35 minutes, $6.75." },
      { icon:"🚋", title:"Alternative — SEPTA from Fishtown / Northern Liberties", text:"From Fishtown to the stadium: Market-Frankford Line to City Hall, transfer to Broad Street Line, ~35 minutes total. A valid option if your base is the most atmospheric neighborhood in new Philadelphia.", },
      { icon:"⚠️", title:"Critical error — driving on July 4", text:"Broad Street from downtown to the South bridge is closed to traffic by the independence events from early in the day. The I-76 and I-95 approaches converge with the Parkway events' flow. Any car route that day takes twice the usual time. The subway goes direct, leaves from City Hall, and arrives in 18 minutes. There's no clearer decision in this guide.", isWarning:true },
    ],
    timings:[
      { label:"Rittenhouse Square on Broad Street Line",       value:"~18 min" },
      { label:"Old City / historic (from City Hall via BSL)",  value:"~22 min" },
      { label:"PHL (airport) by Uber direct",                  value:"~10 min · <$20" },
      { label:"Fishtown on SEPTA + BSL (transfer)",            value:"~35 min" },
      { label:"Car from Center City (normal day / Jul 4)",     value:"15–25 min · 45–60 min" },
    ],
    matchDayCronologia:{
      matchName:"Jul 4 · Round of 16 · 17:00 ET",
      steps:[
        { time:"H-5:00", text:"On July 4, the whole city is out from morning on. Eat breakfast early before Independence Mall is closed to traffic." },
        { time:"H-3:00", text:"Take the Broad Street Line from City Hall. The Independence Day crowd will already be downtown — leaving with margin means not leaving late." },
        { time:"H-2:00", text:"Arrive at the stadium. Gates open 90 minutes before kickoff." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:30", text:"BSL back. The July 4 fireworks over the river start at 9:30pm — if the match ends at 7:15pm you have two hours to post up on the Parkway or the Delaware Waterfront." },
      ],
    },
    timing:"Philadelphia has the best public-transit logistics of any U.S. host city after Toronto's GO Train. The Broad Street Line is a straight subway shot between City Hall and the stadium — no transfers, 18 minutes.",
    cost:"Philadelphia is the most affordable East Coast host city. Cheaper than New York and Boston. July 4 pushes accommodation notably higher — three simultaneous events (250th anniversary + fireworks + match) compete for the same inventory.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Penn's Landing / Delaware Waterfront", type:"Official fan fest", typeColor:CORAL, desc:"The Fan Fest sets up at Penn's Landing, the Delaware River waterfront with views of the Ben Franklin Bridge. Philadelphia built its first colonial docks here in the 17th century. Big-format screens, cultural programming, and access from Old City on foot or from Center City via the SEPTA Market-Frankford Line (2nd Street station). Operating: the entire World Cup period.", tag:"Waterfront" },
    { title:"Xfinity Live! (South Philadelphia)", type:"Sports complex", typeColor:FJORD, desc:"The entertainment complex next to the South Philly sports stadiums — four blocks from Lincoln Financial Field — has outdoor plazas and permanent screens. For fans who want the stadium atmosphere without the ticket, Xfinity Live! is the natural gathering point in Philadelphia's sports district.", tag:"South Philly" },
    { title:"Lemon Hill (East Fairmount Park)", type:"Park with screen", typeColor:SAGE, desc:"Lemon Hill has the best views of the Schuylkill River and the skyline from any green space in the city. The park's hills are the natural setting for informal broadcasts that coexist with the official Fan Fest at Penn's Landing.", tag:"Schuylkill" },
    { title:"McGillin's Olde Ale House (Center City)", type:"Historic pub", typeColor:PINE, desc:"Philadelphia's oldest bar in continuous operation since 1860. Screens everywhere, a classic American pub menu, and a history on the walls that turns each visit into more than watching a match. For Croatia and Ghana days — groups with active European diasporas in Philadelphia — McGillin's is the natural gathering point.", tag:"Since 1860" },
    { title:"Pizzata Pompette (South Philly)", type:"Italian with screens", typeColor:"#004C54", desc:"A bar-restaurant in the Italian neighborhood with screens, honest Neapolitan cooking, and a local crowd that includes Lincoln Financial Field employees who live four blocks away. For Croatia vs. Ghana (June 27), Pizzata Pompette has the right neighborhood atmosphere.", tag:"Italian Market" },
    { title:"Independence Hall + Liberty Bell", type:"Historic", typeColor:"#B8860B", desc:"Not a bar, but the reason Philadelphia exists on the world calendar of July 4, 2026. The complex where the Constitution was signed in 1787 and where the independence bell hangs. Free, no reservation needed. Visit the day BEFORE July 4 — that day the Mall has limited access.", tag:"No ticket" },
  ],

  food:[
    { dish:"McGillin's Olde Ale House",    where:"Center City — soft pretzel + local beer; Philadelphia's oldest bar (1860), always with a match on screen",                   price:"$$", type:"Historic pub" },
    { dish:"Xfinity Live!",                 where:"South Philadelphia — the complex next to the stadium with monumental screens and terraces; second stadium of the sports district", price:"$$", type:"Complex" },
    { dish:"Pizzata Pompette",              where:"South Philly — margherita pizza + natural wine; honest Italian with screens, no calculated tourism",                          price:"$$", type:"Italian" },
    { dish:"Pat's / Geno's (cheesesteak)",  where:"Passyunk Avenue — Philadelphia's mandatory ritual; the oldest cold war in the city between two head-to-head spots",           price:"$",  type:"Ritual" },
    { dish:"Reading Terminal Market",       where:"Center City — the country's oldest indoor market (1893); DiNic's for the pork sandwich, Beiler's for Amish donuts",            price:"$",  type:"Market" },
    { dish:"Italian Market",                where:"South Philly / 9th Street — the oldest open-air market in the U.S. (1884); Tuesdays in June are full-day affairs",            price:"$",  type:"Neighborhood" },
  ],

  experiences:[
    { title:"Independence Mall + Liberty Bell + Eastern State Penitentiary", duration:"Half to full day", desc:"Independence Mall is the most symbolically loaded historic complex in the U.S.: Independence Hall (where the Constitution was signed), the Liberty Bell, and the National Constitution Center within a three-block radius. Free, no reservation needed. Eastern State Penitentiary, two kilometers northwest, is a partially ruined 19th-century prison turned museum: one of the most original visits in the tournament.", type:"Historic", affiliateLink:"", affiliateLabel:"See info" },
    { title:"Philadelphia Museum of Art + Barnes Foundation", duration:"Half day", desc:"The Philadelphia Museum of Art (the one from the Rocky finale, with the stairs) has one of the world's most important collections: Duchamp, Cézanne, Van Gogh, and an African art section relevant to Côte d'Ivoire or Ghana. Access from Center City: the 32 bus on Walnut. The Barnes Foundation, two blocks away, holds the world's largest Renoir collection.", type:"Art", affiliateLink:"", affiliateLabel:"See museums" },
    { title:"Please Touch Museum + Franklin Institute", duration:"Full day", desc:"The Please Touch Museum in Fairmount Park is Pennsylvania's most-awarded children's museum: interactive exhibits for kids under 7, a working 1908 carousel replica inside the building ($22 per person). Three blocks away, the Franklin Institute has the largest planetarium on the East Coast, a walk-through human heart exhibit, and the Fels Planetarium ($25 adults).", type:"Family", affiliateLink:"", affiliateLabel:"See tickets" },
    { title:"Delaware Waterfront + Adventure Aquarium (Camden)", duration:"Half day", desc:"The Adventure Aquarium in Camden, NJ — across the Delaware from Penn's Landing, reachable by a 10-minute ferry ($12 round trip) — has sharks, hippos, and the only African penguin in New Jersey. The ferry itself is part of the plan: skyline views of Philadelphia from the water.", type:"Water", affiliateLink:"", affiliateLabel:"See ferry" },
  ],

  lagomTips:[
    "PHL is the closest airport to any World Cup stadium in the entire tournament (~5 km, ~10 min by car). If your itinerary is Philly-centric, fly there direct.",
    "Broad Street Line from City Hall to the stadium: 18 minutes with no transfers. The best U.S. tournament logistics after Toronto.",
    "July 4 has three simultaneous events: 250th anniversary + fireworks over the river + Round of 16. Book months ahead; arrive with a day of buffer.",
    "Visit Independence Mall the day BEFORE July 4. That day it's closed to traffic and access is restricted for official events.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "SEPTA Key card loaded or contactless payment",
    "Target station: AT&T (Broad Street Line)",
    "Clear bag required",
    "Light layer / umbrella if June brings a storm — high humidity",
    "Pre-match cheesesteak plan confirmed (Pat's / Geno's / Jim's)",
    "Hotel reservation for July 4 booked far in advance",
    "Post-match plan for fireworks (Parkway or Delaware Waterfront)",
  ],

  didYouKnow:"Lincoln Financial Field is the only tournament stadium located in the same complex as three other professional stadiums: Citizens Bank Park (Phillies), Wells Fargo Center (76ers + Flyers), and Lincoln itself. All four are connected by pedestrian walkways, making South Philly the only North American sports district with four professional stadiums within a 400-meter radius.",
  closingNote:"Philadelphia has six matches, the closest airport to any World Cup stadium in the tournament, and the most direct subway of any North American host — except Toronto's GO Train. On July 4, 2026, the city where American democracy was born celebrates its 250th anniversary with a Round of 16 match at the same stadium where the Eagles win Super Bowls. It's a coincidence no other host city could replicate. LagomPlan gives you the right subway, the right neighborhood, and the museum steps where Rocky trained. The rest is history — literally.",
  closingSignature:"Lagomplan · Field Guide · Philadelphia · World Cup 2026",
  plannerCTA:"Generate my Philadelphia trip",

  sectionSubtitles:{
    matches:"6 matches at Lincoln Financial Field — Brazil on June 19 and the Round of 16 on July 4 (250th anniversary).",
    vibe:"Official Fan Fest at Penn's Landing, screens at Xfinity Live!, and historic pubs that have been showing European football for decades.",
    logistics:"SEPTA Broad Street Line direct from City Hall to the stadium in 18 minutes. PHL is the closest airport in the tournament — 5 km, 10 min by Uber.",
    food:"Passyunk Avenue cheesesteaks, Reading Terminal Market, the South Philly Italian Market, and downtown's historic pubs.",
  },
  staysWarning:"Prices are estimates for the World Cup period. July 4, 2026 is the critical date — the 250th anniversary brings three simultaneous events (Independence Mall celebrations + fireworks over the river + Round of 16). Book months ahead and arrive with a day of buffer.",
}
