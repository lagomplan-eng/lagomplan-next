import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#2D4F6C'

export const es: CityGuide = {
  id:"bos",
  city:"Boston",
  country:"Estados Unidos",
  state:"Massachusetts",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Fútbol","Historia","Gastronomía","Sede co-anfitriona"],

  stadium:{ name:"Boston Stadium (Gillette Stadium)", capacity:"~63,815", area:"Foxborough, MA — a 35 km al sur de Boston" },

  headline:"El estadio no está en Boston. El partido sí. Esa distinción vale un tren.",
  description:"El estadio no está en Boston. El partido sí. Esa distinción vale un tren. Boston recibe siete partidos, incluyendo un Cuartos de Final, en una ciudad que se enorgullece de haberle dado al mundo la democracia moderna, la universidad más antigua del hemisferio occidental y el mejor clam chowder del continente. La primera decisión no es qué ver: es cómo llegar a Foxborough.",

  scores:[
    { label:"Ambiente",     value:4 },
    { label:"Fútbol local", value:3 },
    { label:"Gastronomía",  value:4 },
    { label:"Transporte",   value:3 },
    { label:"Seguridad",    value:5 },
    { label:"Costo",        value:2 },
  ],

  matches:[
    { id:"m1", date:"13 Jun", day:"Sáb", time:"21:00 ET", teams:[{name:"Haití",flag:"🇭🇹"},{name:"Escocia",flag:"🏴"}], stadium:"Boston Stadium", tag:"Grupo C", highlight:false },
    { id:"m2", date:"16 Jun", day:"Mar", time:"18:00 ET", teams:[{name:"Playoff IC-2",flag:""},{name:"Noruega",flag:"🇳🇴"}], stadium:"Boston Stadium", tag:"Grupo I", highlight:false },
    { id:"m3", date:"19 Jun", day:"Vie", time:"18:00 ET", teams:[{name:"Escocia",flag:"🏴"},{name:"Marruecos",flag:"🇲🇦"}], stadium:"Boston Stadium", tag:"Grupo C", highlight:false },
    { id:"m4", date:"23 Jun", day:"Mar", time:"16:00 ET", teams:[{name:"Inglaterra",flag:"🏴"},{name:"Ghana",flag:"🇬🇭"}], stadium:"Boston Stadium", tag:"Grupo L", highlight:true },
    { id:"m5", date:"26 Jun", day:"Vie", time:"15:00 ET", teams:[{name:"Noruega",flag:"🇳🇴"},{name:"Francia",flag:"🇫🇷"}], stadium:"Boston Stadium", tag:"Haaland vs. Mbappé", highlight:true },
    { id:"m6", date:"29 Jun", day:"Lun", time:"16:30 ET", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Boston Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m7", date:"9 Jul",  day:"Jue", time:"16:00 ET", teams:[{name:"Cuartos de Final",flag:""},{name:"Por definir",flag:""}], stadium:"Boston Stadium", tag:"Cuartos de Final", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",   value:"Boston Stadium (Gillette Stadium)" },
      { label:"Aforo",          value:"~63,815 — configuración FIFA" },
      { label:"Clima (jun–jul)",value:"Días: 20–28°C · Noches: 14–18°C · Posibilidad de lluvia · Estadio al aire libre y sin techo" },
      { label:"Partidos",       value:"7 confirmados — 5 grupos + 1 Ronda de 32 + 1 Cuartos de Final" },
      { label:"Ubicación",      value:"Foxborough, MA — a 35 km al sur de Boston. No está en la ciudad. El transporte es la primera decisión de este viaje." },
      { label:"Aeropuerto",     value:"BOS — Logan International Airport · en Boston · Silver Line SL1 gratis a South Station en ~20 min" },
    ],
    body:"Boston es una de las cuatro sedes del torneo con Cuartos de Final. La sede recibe a Inglaterra, Francia, Noruega, Escocia, Marruecos, Ghana y Haití. El partido más anticipado es el 26 de junio: Noruega vs. Francia, Haaland vs. Mbappé. Todo lo demás en esta guía parte de una advertencia: Foxborough no es Boston. El estadio está a 35 kilómetros al sur, sin subway, sin bus regular y sin acceso práctico en Uber durante y después del partido.",
    lagomNote:"Boston es cara. El torneo — más Sail Boston 2026 y las celebraciones del 250 aniversario de la ciudad — convierte junio y julio en temporada de precios máximos. Si aún no tienes alojamiento confirmado para julio, Cambridge y Somerville tienen opciones más económicas con acceso por Red Line.",
  },

  vibe:{
    body:"Una de las ciudades más fervientes en términos deportivos de toda Norteamérica recibe a Inglaterra, Francia, Noruega y Escocia. La diáspora anglosajona e irlandesa de Nueva Inglaterra convierte cada uno de esos partidos en una invasión organizada desde el interior. Boston es primero béisbol, luego hockey, luego fútbol americano — el soccer llega en cuarto lugar. El New England Revolution existe y tiene aficionados serios, pero la cultura de fútbol de esta ciudad se construye principalmente sobre comunidades inmigrantes. El Mundial la cambia temporalmente. En comida, Boston es ciudad de cocina seria: el mejor marisco de la Costa Este, una comunidad italiana en el North End con décadas de historia, dim sum en Chinatown y una escena de restaurantes de autor en el South End que compite con cualquier ciudad del país.",
    lagomNote:"El 26 de junio (Noruega vs. Francia), el 23 de junio (Inglaterra vs. Ghana) y el 9 de julio (Cuartos de Final) son las tres fechas de mayor demanda en Boston. Compra el tren y reserva hotel con la misma seriedad que el boleto del partido.",
  },

  stayNeighborhoods:{
    intro:"La clave de esta guía es una sola dirección: South Station. Desde ahí salen los trenes a Foxborough en día de partido. El barrio base ideal es el que te pone más cerca de South Station sin sacrificar la experiencia de la ciudad.",
    items:[
      { kind:"recommended", title:"Base recomendada: Back Bay / South End", body:"Back Bay tiene la mejor infraestructura hotelera de Boston y conecta con South Station por la Línea Naranja (Back Bay Station → South Station: 4 minutos). El South End, contiguo, tiene la mayor concentración de restaurantes de autor de la ciudad y una arquitectura de rowhouses victorianas que hace que caminar sea parte del plan. Para el fan que quiere vivir Boston entre partidos y llegar al tren sin prisa, este corredor es la base correcta." },
      { kind:"alternative", title:"Opción con carácter: North End", body:"El barrio italiano de Boston — el más denso y el más habitado del área central — tiene las mejores pastelerías, las mejores trattorias y el ambiente más de barrio europeo de cualquier ciudad americana. A veinte minutos caminando de South Station o a diez minutos en el Blue Line desde Aquarium. Para el fan europeo que quiere sentirse en casa entre partidos de Inglaterra o Escocia, el North End es el lugar." },
      { kind:"alternative", title:"Opción con presupuesto: Cambridge (Central Square / Inman Square)", body:"Al otro lado del río Charles, Cambridge tiene precios de hotel más bajos que Boston central, una escena de bares y restaurantes genuinamente local y el mismo acceso al Red Line de la MBTA. Desde Harvard Square, el Red Line llega a Downtown Crossing en 12 minutos; desde ahí, 5 minutos a South Station en el Silver Line o caminando. Para el fan con presupuesto ajustado que no quiere el hostal." },
      { kind:"avoid", title:"Evitar como base: Foxborough / entorno del estadio", body:"No hay opciones de hospedaje de calidad en Foxborough. Los hoteles de cadena en la Ruta 1 alrededor del estadio existen para las noches de partido de los Patriots y no tienen nada que ofrecer entre partidos. Quedarse ahí es resolver la logística del estadio a costa de no tener ciudad." },
    ],
  },
  stays:[
    { name:"The Newbury Boston", area:"Back Bay / Newbury Street", price:"$$$$", priceCAD:"$380–650 USD/noche (periodo mundialista)", tags:["Hotel boutique","Rooftop","Back Bay"], note:"El hotel más elegante de Newbury Street, inaugurado en 2021 en la histórica sede del Ritz-Carlton de Boston. Rooftop con vistas a toda la ciudad, restaurante de nivel y la dirección más conveniente de Back Bay para tomar el Orange Line hacia South Station.", best_for:"Carácter", url:"https://booking.stay22.com/lagomplan/q9nnXSH38k" },
    { name:"HI Boston", area:"Back Bay / Stuart Street", price:"$", priceCAD:"$60–140 USD/noche según tipo de habitación", tags:["Presupuesto","Habitaciones privadas","Internacional"], note:"El hostal oficial de Hostelling International en Boston, bien ubicado a cuatro cuadras de Back Bay Station. Habitaciones privadas y compartidas disponibles, cocina comunitaria y ambiente de mezcla internacional que encaja perfectamente con el perfil del torneo.", best_for:"Presupuesto", url:"https://booking.stay22.com/lagomplan/KnbVYGzJA5" },
    { name:"Mandarin Oriental Boston", area:"Back Bay / Boylston Street", price:"$$$$", priceCAD:"$650–1,200 USD/noche (periodo mundialista)", tags:["Lujo","Spa","Copley Station cerca"], note:"La dirección de lujo más conveniente de Boston para el perfil mundialista: a dos cuadras de Copley Station (Green Line) y a diez minutos de South Station. Spa, restaurante de referencia y habitaciones que no necesitan disculpa la mañana del partido.", best_for:"Lujo", url:"https://booking.stay22.com/lagomplan/dEGj0szNAR" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Boston — BOS", text:"BOS — Logan International Airport está en Boston. Silver Line SL1 es gratis desde el aeropuerto hasta South Station y tarda aproximadamente 20 minutos. Desde ahí se toma el MBTA Boston Stadium Train hasta Foxboro. Total desde el avión hasta el estadio: aproximadamente 80 minutos, sin taxis ni Uber." },
      { icon:"🚆", title:"Ruta maestra — MBTA Boston Stadium Train", text:"South Station → Foxboro Station directo, sin paradas. El MBTA opera trenes especiales expresos hasta Foxboro Station, a pasos del estadio. El trayecto dura aproximadamente una hora. Son 14 trenes por partido, con una capacidad combinada de ~20,000 pasajeros." },
      { icon:"🎟", title:"Regla de compra del tren", text:"El boleto de ida y vuelta cuesta $80 USD y se compra exclusivamente a través de la aplicación mTicket de la MBTA. No puedes comprar el boleto de tren sin tener primero tu boleto de partido. La MBTA verifica la coincidencia de fecha. Los boletos se agotan y no se venden el día del partido en la estación." },
      { icon:"⚠️", title:"Error crítico — perder el último tren de regreso", text:"Los trenes salen a partir de 30 minutos después del pitido final. Quien no aborda en los primeros 60 minutos tras el final del partido queda en una zona suburbana sin tránsito regular, con Ubers en modo surge (60–90 minutos de espera y precios de $80–150 USD) y la Ruta 1 completamente paralizada.", isWarning:true },
    ],
    timings:[
      { label:"South Station → Foxboro Station",                 value:"~60 min" },
      { label:"Back Bay Station → South Station + Stadium Train",value:"~65 min puerta a puerta" },
      { label:"BOS Logan → Silver Line + Stadium Train",         value:"~80 min total" },
      { label:"Auto desde Boston por I-95 / Ruta 1",             value:"45 min sin tráfico · 90–150 min con tráfico de partido" },
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
    { title:"FIFA Fan Festival™ — Boston City Hall Plaza", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest de Boston se instala en la plaza del Ayuntamiento, en el corazón del centro histórico de la ciudad. Gratuito, con pantallas de gran formato, activaciones culturales y programación durante todo el torneo. Accesible por Green Line y Blue Line hasta Government Center o por Orange Line hasta State. No requiere tren especial ni reserva anticipada.", tag:"Sin boleto OK" },
    { title:"Christopher Columbus Park (North End / Waterfront)", type:"Pantalla exterior", typeColor:FJORD, desc:"El parque al borde del puerto de Boston, en el límite entre el North End y el waterfront, tiene vistas directas al puerto y acceso peatonal desde Faneuil Hall. Para los partidos de Francia e Inglaterra — con las comunidades francesa e irlandesa del North End en plena actividad — el ambiente nocturno en el parque es de barrio europeo.", tag:"Waterfront" },
    { title:"Harvard Stadium (Cambridge)", type:"Estadio histórico", typeColor:SAGE, desc:"El estadio universitario más antiguo de los Estados Unidos — construido en 1903, el primero de hormigón armado del mundo — abre sus instalaciones para transmisiones públicas durante eventos deportivos de gran escala. Para el partido de Francia vs. Noruega del 26 de junio, el contexto histórico añade una capa que no tienen los sports bars de Fenway.", tag:"Histórico" },
    { title:"The Banshee (Dorchester)", type:"Pub irlandés", typeColor:PINE, desc:"El pub irlandés más grande de Boston, con capacidad para más de 500 personas y un ambiente en partidos de Escocia, Inglaterra o Irlanda que transforma el local en algo muy parecido a Dublín en noche de partido. Para el 13 de junio (Haití vs. Escocia) y el 23 de junio (Inglaterra vs. Ghana), The Banshee es el estadio alterno de la ciudad. Qué pedir: Fish & chips + Guinness de barril.", tag:"Dorchester" },
    { title:"The Fours (Downtown)", type:"Sports bar histórico", typeColor:"#1A3A5C", desc:"El bar deportivo de referencia de la ciudad desde 1976, con memorabilia de los Celtics, Bruins y Red Sox por todas las paredes y pantallas en cada ángulo. Para Noruega vs. Francia (26 de junio — Haaland vs. Mbappé), The Fours es donde ver ese partido sin que nadie a tu alrededor esté mirando el teléfono. Qué pedir: Sándwich Reuben + cerveza local de Massachusetts.", tag:"Downtown" },
    { title:"McGann's Irish Pub (North End)", type:"Pub", typeColor:"#5A3A2A", desc:"Pub irlandés en el barrio italiano de Boston. Pantallas en la barra y en el salón principal, menú de pub con opciones razonables y una clientela que mezcla la diáspora irlandesa del North End con turistas que acaban de salir de Neptune Oyster. Para los partidos nocturnos del Grupo L, el ambiente es exactamente el que se espera. Qué pedir: Clam chowder + pinta de Guinness.", tag:"North End" },
  ],

  food:[
    { dish:"The Banshee",              where:"Dorchester — fish & chips + Guinness de barril; pub irlandés sin disculpa, el más ruidoso de Boston en días de partido anglosajón", price:"$$",    type:"Pre-partido" },
    { dish:"The Fours",                where:"Downtown — sándwich Reuben + cerveza local de Massachusetts; deportivo serio, histórico, para el partido que importa",              price:"$$",    type:"Sports bar" },
    { dish:"McGann's Irish Pub",       where:"North End — clam chowder + pinta de Guinness; Boston genuino, sin esfuerzo turístico",                                              price:"$$",    type:"Pub" },
    { dish:"Cannoli",                  where:"North End — Mike's Pastry y Modern Pastry llevan décadas en guerra fría por el mejor cannoli de Boston",                            price:"$",     type:"Ritual" },
    { dish:"Marisco de la Costa Este", where:"Boston — clam chowder, ostras y cocina de puerto que supera cualquier comida dentro del estadio",                                   price:"$$–$$$",type:"Local" },
    { dish:"Dim sum",                  where:"Chinatown — una de las paradas útiles entre South Station y los días sin partido",                                                  price:"$–$$",  type:"Barrio" },
  ],

  experiences:[
    { title:"Freedom Trail", duration:"2 horas a día completo", desc:"El Freedom Trail es un recorrido de 4 kilómetros marcado en rojo en el pavimento que conecta 16 sitios históricos de la Revolución Americana: la Old South Meeting House donde se organizó el Boston Tea Party, el cementerio donde descansan Paul Revere y Samuel Adams, el USS Constitution en Charlestown. Se puede hacer a pie desde el North End en dos horas o en un día completo con desvíos. Gratuito en su mayor parte, sin reserva.", type:"Historia", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver información" },
    { title:"Cambridge — Harvard + MIT", duration:"Medio día", desc:"El campus de Harvard en Cambridge tiene acceso libre a sus patios interiores, museos y la arquitectura georgiana de Harvard Yard. A quince minutos en Red Line desde Downtown Crossing. MIT está a diez minutos caminando de Harvard, con el Media Lab abierto a visitantes los días de semana y la arquitectura de Gehry y Saarinen como atracciones en sí mismas.", type:"Académico", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver museos" },
    { title:"Cape Cod — excursión de día", duration:"Día completo", desc:"El Cape Cod está a 90 kilómetros al sur de Boston — accesible por autobús desde South Station (Greyhound/Peter Pan, ~2 horas hasta Hyannis) o por auto por la I-6. Las playas de Cape Cod Bay tienen aguas más calmadas que el Atlántico abierto; las de Provincetown, en la punta del cabo, son las más dramáticas. Para el fan que tiene un día libre antes del tramo intenso del calendario de junio.", type:"Costa", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver opciones de transporte" },
    { title:"North End + Waterfront", duration:"Mañana o tarde", desc:"El North End tiene más de 90 restaurantes italianos en menos de un kilómetro cuadrado. Mike's Pastry y Modern Pastry llevan décadas en guerra fría por el mejor cannoli de Boston. Combínalo con Christopher Columbus Park y el waterfront para un día de ciudad sin logística pesada.", type:"Barrio", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver opciones" },
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

  sectionSubtitles:{
    matches:"7 partidos en Gillette Stadium — Noruega vs. Francia (Haaland vs. Mbappé) el 26 de junio y un Cuartos de Final el 9 de julio.",
    vibe:"Fan Fest oficial en City Hall Plaza, pantallas en Christopher Columbus Park y los pubs irlandeses que llevan décadas transmitiendo fútbol europeo.",
    logistics:"Foxborough no es Boston. El MBTA Boston Stadium Train desde South Station es la única ruta práctica — el pase se compra en mTicket y exige boleto de partido.",
    food:"Clam chowder, cannolis del North End, marisco del puerto y los pubs irlandeses de Dorchester y el centro.",
  },
  staysWarning:"Los precios son estimaciones para el periodo mundialista. El 23 de junio (Inglaterra vs. Ghana), el 26 de junio (Noruega vs. Francia) y el 9 de julio (Cuartos de Final) son las fechas más críticas. Sail Boston 2026 y las celebraciones del 250 aniversario añaden demanda. Cambridge y Somerville, bien conectados por Red Line, son las alternativas razonables.",
}

export const en: CityGuide = {
  id:"bos",
  city:"Boston",
  country:"United States",
  state:"Massachusetts",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Football","History","Food","Co-host city"],

  stadium:{ name:"Boston Stadium (Gillette Stadium)", capacity:"~63,815", area:"Foxborough, MA — 35 km south of Boston" },

  headline:"The stadium isn't in Boston. The match is. That distinction is worth a train ride.",
  description:"The stadium isn't in Boston. The match is. That distinction is worth a train ride. Boston hosts seven matches, including a Quarterfinal, in a city that takes pride in having given the world modern democracy, the Western Hemisphere's oldest university, and the continent's best clam chowder. The first decision isn't what to see: it's how to get to Foxborough.",

  scores:[
    { label:"Atmosphere", value:4 },
    { label:"Football",   value:3 },
    { label:"Food",       value:4 },
    { label:"Transit",    value:3 },
    { label:"Safety",     value:5 },
    { label:"Cost",       value:2 },
  ],

  matches:[
    { id:"m1", date:"Jun 13", day:"Sat", time:"21:00 ET", teams:[{name:"Haiti",flag:"🇭🇹"},{name:"Scotland",flag:"🏴"}], stadium:"Boston Stadium", tag:"Group C", highlight:false },
    { id:"m2", date:"Jun 16", day:"Tue", time:"18:00 ET", teams:[{name:"IC Playoff 2",flag:""},{name:"Norway",flag:"🇳🇴"}], stadium:"Boston Stadium", tag:"Group I", highlight:false },
    { id:"m3", date:"Jun 19", day:"Fri", time:"18:00 ET", teams:[{name:"Scotland",flag:"🏴"},{name:"Morocco",flag:"🇲🇦"}], stadium:"Boston Stadium", tag:"Group C", highlight:false },
    { id:"m4", date:"Jun 23", day:"Tue", time:"16:00 ET", teams:[{name:"England",flag:"🏴"},{name:"Ghana",flag:"🇬🇭"}], stadium:"Boston Stadium", tag:"Group L", highlight:true },
    { id:"m5", date:"Jun 26", day:"Fri", time:"15:00 ET", teams:[{name:"Norway",flag:"🇳🇴"},{name:"France",flag:"🇫🇷"}], stadium:"Boston Stadium", tag:"Haaland vs. Mbappé", highlight:true },
    { id:"m6", date:"Jun 29", day:"Mon", time:"16:30 ET", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"Boston Stadium", tag:"Knockout stage", highlight:false },
    { id:"m7", date:"Jul 9",  day:"Thu", time:"16:00 ET", teams:[{name:"Quarterfinal",flag:""},{name:"TBD",flag:""}], stadium:"Boston Stadium", tag:"Quarterfinal", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",      value:"Boston Stadium (Gillette Stadium)" },
      { label:"Capacity",          value:"~63,815 — FIFA configuration" },
      { label:"Weather (Jun–Jul)", value:"Days: 20–28°C · Nights: 14–18°C · Chance of rain · Open-air stadium, no roof" },
      { label:"Matches",           value:"7 confirmed — 5 group + 1 Round of 32 + 1 Quarterfinal" },
      { label:"Location",          value:"Foxborough, MA — 35 km south of Boston. Not in the city. Transport is the first decision of this trip." },
      { label:"Airport",           value:"BOS — Logan International Airport · in Boston · Silver Line SL1 free to South Station in ~20 min" },
    ],
    body:"Boston is one of only four host cities with a Quarterfinal. The venue hosts England, France, Norway, Scotland, Morocco, Ghana, and Haiti. The most anticipated match is June 26: Norway vs. France, Haaland vs. Mbappé. Everything else in this guide starts from a warning: Foxborough isn't Boston. The stadium sits 35 kilometers south, with no subway, no regular bus, and no practical Uber access during or after the match.",
    lagomNote:"Boston is expensive. The tournament — plus Sail Boston 2026 and the city's 250th anniversary celebrations — turns June and July into peak-price season. If you don't have July lodging confirmed yet, Cambridge and Somerville have cheaper options with Red Line access.",
  },

  vibe:{
    body:"One of the most fervent sports cities in all of North America hosts England, France, Norway, and Scotland. The Anglo-Saxon and Irish diasporas of New England turn each of those matches into an organized invasion from the inside. Boston is baseball first, then hockey, then American football — soccer lands in fourth. The New England Revolution exists and has serious fans, but the city's football culture is built mainly on immigrant communities. The World Cup changes that temporarily. On the food side, Boston is a serious kitchen city: the best seafood on the East Coast, an Italian community in the North End with decades of history, dim sum in Chinatown, and a chef-driven restaurant scene in the South End that holds its own against any city in the country.",
    lagomNote:"June 26 (Norway vs. France), June 23 (England vs. Ghana), and July 9 (Quarterfinal) are the three highest-demand dates in Boston. Buy the train and book the hotel with the same seriousness as the match ticket.",
  },

  stayNeighborhoods:{
    intro:"The key to this guide is a single address: South Station. Trains to Foxborough leave from there on match days. The ideal base neighborhood is the one that puts you closest to South Station without sacrificing the city experience.",
    items:[
      { kind:"recommended", title:"Recommended base: Back Bay / South End", body:"Back Bay has Boston's best hotel infrastructure and connects to South Station via the Orange Line (Back Bay Station → South Station: 4 minutes). The South End, adjacent, holds the city's highest concentration of chef-driven restaurants and Victorian rowhouse architecture that makes walking part of the plan. For the fan who wants to live Boston between matches and reach the train without rushing, this corridor is the right base." },
      { kind:"alternative", title:"Character pick: North End", body:"Boston's Italian neighborhood — the densest and most lived-in part of the central area — has the best pastry shops, the best trattorias, and the most European-feeling neighborhood vibe in any American city. Twenty minutes on foot from South Station, or ten on the Blue Line from Aquarium. For the European fan who wants to feel at home between England or Scotland matches, the North End is the place." },
      { kind:"alternative", title:"Budget option: Cambridge (Central Square / Inman Square)", body:"Across the Charles, Cambridge has lower hotel prices than central Boston, a genuinely local bar and restaurant scene, and the same Red Line access. From Harvard Square, the Red Line reaches Downtown Crossing in 12 minutes; from there, 5 minutes to South Station on the Silver Line or on foot. For the budget-conscious fan who doesn't want a hostel." },
      { kind:"avoid", title:"Avoid as a base: Foxborough / around the stadium", body:"There are no quality lodging options in Foxborough. Chain hotels along Route 1 around the stadium exist for Patriots match nights and have nothing to offer between matches. Staying there solves stadium logistics at the cost of having no city." },
    ],
  },
  stays:[
    { name:"The Newbury Boston", area:"Back Bay / Newbury Street", price:"$$$$", priceCAD:"$380–650 USD/night (World Cup period)", tags:["Boutique hotel","Rooftop","Back Bay"], note:"Newbury Street's most elegant hotel, opened in 2021 in the historic Boston Ritz-Carlton building. Rooftop with citywide views, a high-caliber restaurant, and the most convenient Back Bay address to catch the Orange Line toward South Station.", best_for:"Character", url:"https://booking.stay22.com/lagomplan/q9nnXSH38k" },
    { name:"HI Boston", area:"Back Bay / Stuart Street", price:"$", priceCAD:"$60–140 USD/night by room type", tags:["Budget","Private rooms","International"], note:"Boston's official Hostelling International outpost, four blocks from Back Bay Station. Private and shared rooms, communal kitchen, and an international mix that fits the tournament profile perfectly.", best_for:"Budget", url:"https://booking.stay22.com/lagomplan/KnbVYGzJA5" },
    { name:"Mandarin Oriental Boston", area:"Back Bay / Boylston Street", price:"$$$$", priceCAD:"$650–1,200 USD/night (World Cup period)", tags:["Luxury","Spa","Near Copley Station"], note:"Boston's most convenient luxury address for the World Cup profile: two blocks from Copley Station (Green Line) and ten minutes from South Station. Spa, reference restaurant, and rooms that need no apology on match morning.", best_for:"Luxury", url:"https://booking.stay22.com/lagomplan/dEGj0szNAR" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Boston — BOS", text:"BOS — Logan International Airport is in Boston. The Silver Line SL1 is free from the airport to South Station and takes about 20 minutes. From there you catch the MBTA Boston Stadium Train to Foxboro. Total from the plane to the stadium: about 80 minutes, no taxi or Uber." },
      { icon:"🚆", title:"Master route — MBTA Boston Stadium Train", text:"South Station → Foxboro Station direct, no stops. The MBTA runs special express trains to Foxboro Station, steps from the stadium. The trip takes about an hour. It's 14 trains per match, with combined capacity of ~20,000 passengers." },
      { icon:"🎟", title:"Train ticketing rule", text:"The round-trip fare is $80 USD and is sold exclusively via the MBTA's mTicket app. You can't buy the train ticket without first holding your match ticket. MBTA verifies the date match. Tickets sell out and aren't sold at the station on match day." },
      { icon:"⚠️", title:"Critical error — missing the last return train", text:"Return trains depart starting 30 minutes after the final whistle. Anyone who doesn't board within the first 60 minutes after the match ends is stranded in a suburban zone with no regular transit, surge-mode Ubers (60–90 minute waits and $80–150 USD fares), and Route 1 fully gridlocked.", isWarning:true },
    ],
    timings:[
      { label:"South Station → Foxboro Station",                    value:"~60 min" },
      { label:"Back Bay Station → South Station + Stadium Train",   value:"~65 min door-to-door" },
      { label:"BOS Logan → Silver Line + Stadium Train",            value:"~80 min total" },
      { label:"Car from Boston via I-95 / Route 1",                 value:"45 min without traffic · 90–150 min with match traffic" },
    ],
    matchDayCronologia:{
      matchName:"Jun 26 · Norway vs. France · 15:00 ET",
      steps:[
        { time:"H-4:00", text:"Lunch in your neighborhood. Mbappé vs. Haaland day is not the day to improvise food in Foxborough." },
        { time:"H-3:00", text:"Head to South Station. Boarding groups have assigned times — respect them." },
        { time:"H-2:30", text:"Board the train. Exactly one hour direct to Foxboro Station." },
        { time:"H-1:30", text:"Arrive at the stadium. Gates open ~90 minutes before kickoff. Clear bag required." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+0:30", text:"Return trains leave 30 minutes after the final whistle. First train, first exit." },
      ],
    },
    timing:"Foxborough isn't Boston. That sentence should guide every transport decision in this guide. The stadium sits 35 kilometers south, with no subway, no regular bus, and no practical Uber access during or after the match.",
    cost:"Boston is expensive. June and July combine the World Cup, Sail Boston 2026, and 250th anniversary celebrations. For July, Cambridge and Somerville are usually the savings margin with a useful Red Line.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Boston City Hall Plaza", type:"Official fan fest", typeColor:CORAL, desc:"Boston's Fan Fest sets up on City Hall Plaza, in the heart of the historic downtown. Free, with big-format screens, cultural activations, and programming throughout the tournament. Accessible via the Green and Blue lines to Government Center or via the Orange Line to State. No special train, no advance reservation.", tag:"No ticket needed" },
    { title:"Christopher Columbus Park (North End / Waterfront)", type:"Outdoor screen", typeColor:FJORD, desc:"The park at the edge of Boston Harbor, on the line between the North End and the waterfront, has direct harbor views and foot access from Faneuil Hall. For France and England matches — with the North End's French and Irish communities fully active — the evening atmosphere at the park reads as European neighborhood.", tag:"Waterfront" },
    { title:"Harvard Stadium (Cambridge)", type:"Historic stadium", typeColor:SAGE, desc:"The oldest collegiate stadium in the United States — built in 1903, the world's first reinforced concrete stadium — opens its grounds for public broadcasts during major sporting events. For France vs. Norway on June 26, the historical setting adds a layer no Fenway sports bar can offer.", tag:"Historic" },
    { title:"The Banshee (Dorchester)", type:"Irish pub", typeColor:PINE, desc:"The largest Irish pub in Boston, with capacity for over 500 people and an atmosphere on Scotland, England, or Ireland match days that turns the place into something very close to Dublin on matchnight. For June 13 (Haiti vs. Scotland) and June 23 (England vs. Ghana), The Banshee is the city's second stadium. What to order: Fish & chips + Guinness on tap.", tag:"Dorchester" },
    { title:"The Fours (Downtown)", type:"Historic sports bar", typeColor:"#1A3A5C", desc:"The city's reference sports bar since 1976, with Celtics, Bruins, and Red Sox memorabilia across every wall and screens at every angle. For Norway vs. France (June 26 — Haaland vs. Mbappé), The Fours is where you watch that match without anyone around you staring at their phone. What to order: Reuben sandwich + Massachusetts local beer.", tag:"Downtown" },
    { title:"McGann's Irish Pub (North End)", type:"Pub", typeColor:"#5A3A2A", desc:"An Irish pub in Boston's Italian neighborhood. Screens at the bar and in the main room, a pub menu with reasonable options, and a crowd that mixes the North End's Irish diaspora with tourists who just left Neptune Oyster. For Group L evening matches, the atmosphere is exactly what you'd expect. What to order: Clam chowder + pint of Guinness.", tag:"North End" },
  ],

  food:[
    { dish:"The Banshee",         where:"Dorchester — fish & chips + Guinness on tap; an unapologetic Irish pub, Boston's loudest on Anglo-Saxon match days", price:"$$",    type:"Pre-match" },
    { dish:"The Fours",           where:"Downtown — Reuben sandwich + Massachusetts local beer; serious, historic sports bar for the match that matters",     price:"$$",    type:"Sports bar" },
    { dish:"McGann's Irish Pub",  where:"North End — clam chowder + pint of Guinness; genuine Boston, no tourist effort",                                     price:"$$",    type:"Pub" },
    { dish:"Cannoli",             where:"North End — Mike's Pastry and Modern Pastry have had a decades-long cold war over the best cannoli in Boston",      price:"$",     type:"Ritual" },
    { dish:"East Coast seafood",  where:"Boston — clam chowder, oysters, and harbor cooking that beats anything inside the stadium",                          price:"$$–$$$",type:"Local" },
    { dish:"Dim sum",             where:"Chinatown — one of the useful stops between South Station and off-days",                                             price:"$–$$",  type:"Neighborhood" },
  ],

  experiences:[
    { title:"Freedom Trail", duration:"2 hours to full day", desc:"The Freedom Trail is a 4-kilometer path marked in red on the pavement connecting 16 historic sites of the American Revolution: the Old South Meeting House where the Boston Tea Party was organized, the cemetery where Paul Revere and Samuel Adams rest, the USS Constitution in Charlestown. It can be walked from the North End in two hours or spun into a full day with detours. Mostly free, no reservation.", type:"History", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See info" },
    { title:"Cambridge — Harvard + MIT", duration:"Half day", desc:"The Harvard campus in Cambridge offers free access to its interior courtyards, museums, and the Georgian architecture of Harvard Yard. Fifteen minutes by Red Line from Downtown Crossing. MIT is a ten-minute walk from Harvard, with the Media Lab open to visitors on weekdays and Gehry and Saarinen architecture as attractions in themselves.", type:"Academic", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See museums" },
    { title:"Cape Cod — day trip", duration:"Full day", desc:"Cape Cod sits 90 kilometers south of Boston — reachable by bus from South Station (Greyhound/Peter Pan, ~2 hours to Hyannis) or by car on I-6. The Cape Cod Bay beaches have calmer water than the open Atlantic; Provincetown, at the tip of the cape, has the most dramatic ones. For the fan with an open day before June's intense stretch.", type:"Coast", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See transport options" },
    { title:"North End + Waterfront", duration:"Morning or afternoon", desc:"The North End has 90+ Italian restaurants in less than a square kilometer. Mike's Pastry and Modern Pastry have had a decades-long cold war over the best cannoli in Boston. Combine it with Christopher Columbus Park and the waterfront for a city day with no heavy logistics.", type:"Neighborhood", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See options" },
  ],

  lagomTips:[
    "Foxborough isn't Boston. The stadium is 35 kilometers south, with no subway, no regular bus, and no practical Uber access during or after the match.",
    "The MBTA Boston Stadium Train is sold on mTicket, costs $80 USD round-trip, and requires a match ticket. It's not sold at the station on match day.",
    "June 26 (Norway vs. France), June 23 (England vs. Ghana), and July 9 (Quarterfinal) are the three highest-demand dates in Boston.",
    "The North End has 90+ Italian restaurants in less than a square kilometer. Mike's Pastry and Modern Pastry beat any meal inside the stadium.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "MBTA Stadium Train ticket purchased on mTicket",
    "Boarding time confirmed",
    "South Station as departure point",
    "Clear bag required",
    "Light rain layer — open-air stadium with no roof",
    "Hotel reservation confirmed for Jun 23, Jun 26, or Jul 9",
    "Return plan: board within the first 60 min after the match",
  ],

  didYouKnow:"Harvard Stadium, in Cambridge, is the oldest collegiate stadium in the United States. Built in 1903, it was the world's first reinforced concrete stadium and functions as a historic public-viewing site during major sporting events.",
  closingNote:"Boston hosts seven matches in a city that takes pride in having given the world modern democracy, the Western Hemisphere's oldest university, and the continent's best clam chowder. The stadium is in Foxborough, an hour by train. The Fan Fest is at City Hall Plaza, ten minutes by subway. The city in between is rich enough in history, food, and character that off-days aren't lost days. LagomPlan doesn't ask you to fall in love with Boston — just to buy the train ticket with time to spare.",
  closingSignature:"Lagomplan · Field Guide · Boston · World Cup 2026",
  plannerCTA:"Generate my Boston trip",

  sectionSubtitles:{
    matches:"7 matches at Gillette Stadium — Norway vs. France (Haaland vs. Mbappé) on June 26 and a Quarterfinal on July 9.",
    vibe:"Official Fan Fest at City Hall Plaza, screens at Christopher Columbus Park, and the Irish pubs that have been showing European football for decades.",
    logistics:"Foxborough isn't Boston. The MBTA Boston Stadium Train from South Station is the only practical route — the pass is sold on mTicket and requires a match ticket.",
    food:"Clam chowder, North End cannoli, harbor seafood, and the Irish pubs of Dorchester and downtown.",
  },
  staysWarning:"Prices are estimates for the World Cup period. June 23 (England vs. Ghana), June 26 (Norway vs. France), and July 9 (Quarterfinal) are the critical dates. Sail Boston 2026 and the 250th anniversary celebrations add demand. Cambridge and Somerville, well-connected by the Red Line, are the reasonable alternatives.",
}
