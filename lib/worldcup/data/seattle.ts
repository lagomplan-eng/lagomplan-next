import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#4A7C7E'

export const es: CityGuide = {
  id:"sea",
  city:"Seattle",
  country:"Estados Unidos",
  state:"Washington",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["USMNT","Pacific NW","Ciudad compacta","Sede co-anfitriona"],

  stadium:{ name:"Seattle Stadium (Lumen Field)", capacity:"~69,000", area:"South Downtown — a 10 min caminando del Pike Place Market" },

  headline:"La única sede del torneo donde el estadio está a diez minutos caminando del mercado de pescado más famoso de Norteamérica. Aprovéchalo antes del partido.",
  description:"Seattle llega al Mundial con 6 partidos, el estadio más ruidoso de la NFL y el USMNT en casa el 19 de junio. Lumen Field amplifica el sonido por diseño — para USA vs. Australia, esa acústica va a demostrar por qué Seattle tiene la reputación de fanáticos que tiene. El Link Light Rail conecta el aeropuerto, Capitol Hill y el estadio sin transbordo.",

  scores:[
    { label:"Ambiente",     value:5 },
    { label:"Fútbol local", value:4 },
    { label:"Gastronomía",  value:5 },
    { label:"Transporte",   value:4 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:2 },
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
      { label:"Estadio FIFA",   value:"Seattle Stadium (Lumen Field)" },
      { label:"Aforo",          value:"~69,000 — configuración FIFA (el diseño de cubierta parcial amplifica el ruido; considerado el estadio más ruidoso de la NFL)" },
      { label:"Clima (jun–jul)",value:"Días: 18–24°C · Noches: 12–15°C · La sede más fresca del torneo en EE.UU. — chaqueta ligera para partidos nocturnos" },
      { label:"Partidos",       value:"6 confirmados — 4 grupos + Ronda de 32 + Ronda de 16. Tres de los cuatro de grupos arrancan al mediodía PT." },
      { label:"Ubicación",      value:"South Downtown — a 10 min caminando del Pike Place Market y 15 de Pioneer Square. Link Light Rail directo desde aeropuerto y Capitol Hill." },
      { label:"Aeropuerto",     value:"SEA — Seattle-Tacoma International · Link Light Rail directo al centro en ~40 min (misma línea que llega al estadio)" },
    ],
    body:"Seattle es compacta para su impacto. Lumen Field está en el extremo sur del downtown, a diez minutos caminando del Pike Place Market y a quince de Pioneer Square. El 19 de junio, Estados Unidos vs. Australia va a ser el partido más ruidoso del torneo — Lumen Field tiene una acústica diseñada para amplificar al fanático, y 69,000 personas van a usarla. La ciudad más fría del torneo norteamericano tiene también el café más serio, el marisco más fresco y las montañas más cinematográficas a dos horas.",
    lagomNote:"El 19 de junio (USMNT vs. Australia) es el partido de mayor demanda de la sede. Los hoteles en downtown y Capitol Hill para esa fecha se agotan con meses de anticipación. Airbnb en Beacon Hill (10 min en Link del estadio) o Columbia City son alternativas razonables con buena conexión.",
  },

  vibe:{
    body:"Seattle Sounders tiene la mayor asistencia promedio de la MLS desde hace más de una década. La Emerald City Supporters y los grupos organizados han construido una cultura de tribuna comparable a cualquier barra latinoamericana o europea. El 19 de junio no es solo un partido de fútbol — es la ciudad entera que lleva años esperando este momento. Paralelamente, café de especialidad de nivel internacional, marisco del Pacífico Norte más fresco del continente y una de las mejores escenas de cocina japonesa fuera de Japón. Seattle come bien y bebe mejor.",
    lagomNote:"Subestimar el frío nocturno es el error recurrente. Junio en Seattle tiene días de 22°C pero noches de 12°C — y Lumen Field es al aire libre. Con el viento del Puget Sound, la temperatura percibida puede bajar hasta los 8–9°C. Una chaqueta ligera no es opcional para los partidos de las 8pm.",
  },

  stayNeighborhoods:{
    intro:"Seattle es compacta para su impacto. Lumen Field está en el extremo sur del downtown, a diez minutos caminando del Pike Place Market y a quince del Pioneer Square. La lógica de barrio base es sencilla: más cerca del downtown, más cerca de todo.",
    items:[
      { kind:"recommended", title:"Base recomendada: Capitol Hill", body:"El barrio más activo de Seattle: cafeterías de especialidad, bares de autor, restaurantes que cambian el menú según la cosecha del día y la mejor vida nocturna de la ciudad. A quince minutos caminando del estadio por la 1st Avenue o a cinco minutos en Link Light Rail desde Capitol Hill Station. Para el fan que quiere vivir Seattle entre partidos sin depender de un auto." },
      { kind:"alternative", title:"Opción central: Pioneer Square / Waterfront", body:"El barrio histórico de Seattle — ladrillo, galerías, bares de madera oscura — está a diez minutos caminando del estadio. El Waterfront renovado (la nueva orilla del Puget Sound tras el derribo de la autopista elevada) ofrece vistas directas a las montañas Olympic y al Sound. Para el fan que quiere llegar caminando el 19 de junio, Pioneer Square es la base más lógica." },
      { kind:"alternative", title:"Con diseño y carácter: Fremont / South Lake Union", body:"Fremont se autodenomina 'el centro del universo' y tiene la concentración de cervecerías artesanales más alta de Seattle. South Lake Union, adyacente, tiene los hoteles más nuevos de la ciudad y acceso al Streetcar hacia el downtown en 10 minutos. Para el fan de Bélgica que busca un barrio con ambiente de pub europeo, Fremont es el lugar." },
    ],
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
      { label:"Capitol Hill Station en Link",                        value:"~5 min" },
      { label:"Downtown (University Street) en Link",                value:"~8 min" },
      { label:"SEA (aeropuerto) en Link directo",                    value:"~40 min" },
      { label:"Pioneer Square caminando por 1st Ave",                value:"~10 min" },
      { label:"Uber desde Capitol Hill (normal / post-USMNT)",       value:"10–15 min · 25–40 min" },
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
    { title:"FIFA Fan Festival™ — Seattle Center", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest se instala en el complejo cultural construido para la Exposición Universal de 1962 que incluye la Space Needle, el MoPOP y el Chihuly Garden and Glass. Pantallas de gran formato en los prados centrales, programación musical y el contexto más cinematográfico de cualquier Fan Fest del torneo norteamericano. Acceso por Monorail desde Westlake Center en 2 minutos.", tag:"Seattle Center" },
    { title:"Occidental Square (Pioneer Square)", type:"Plaza histórica", typeColor:FJORD, desc:"La plaza empedrada del barrio más antiguo de Seattle activa transmisiones para partidos de alta demanda desde sus pantallas exteriores. Para el partido de USMNT del 19 de junio, Pioneer Square va a ser el segundo punto de concentración de la ciudad — a diez minutos caminando del estadio y sin necesidad de registro.", tag:"Pioneer Sq" },
    { title:"Cal Anderson Park (Capitol Hill)", type:"Parque de barrio", typeColor:SAGE, desc:"El parque más activo de Capitol Hill tiene canchas de fútbol — con historia de ligas locales que llevan jugando ahí desde los 90 — y espacio para transmisiones informales. La comunidad de fanáticos del Sounders usa Cal Anderson como punto de reunión orgánico. Para Bélgica vs. Egipto o Egipto vs. Irán, el parque convoca a las diásporas del barrio.", tag:"Capitol Hill" },
    { title:"Fuel Sports (First Hill)", type:"Sports bar", typeColor:PINE, desc:"El bar de deportes más serio de Seattle, con pantallas en cada ángulo y la mayor concentración de aficionados al fútbol por metro cuadrado de la ciudad. Para el partido de USMNT, llega dos horas antes — se llena rápido y sin aviso. Cocina de bar americana con buenas opciones y sin pretensiones de otra cosa.", tag:"USMNT" },
    { title:"The George & Dragon Pub (Fremont)", type:"Pub inglés", typeColor:"#1A3A5C", desc:"El pub inglés más auténtico de Seattle, con una clientela que va desde los fans del Arsenal hasta los de la selección belga. Para el partido del 15 de junio (Bélgica vs. Egipto), Fremont tiene el ambiente correcto. La cocina es de pub inglés honesto — sin complicaciones, sin precios de hotel.", tag:"Fremont" },
    { title:"Rhein Haus (Capitol Hill)", type:"Cervecería alemana", typeColor:"#4A7C7E", desc:"Salón de curling convertido en bar alemán con cerveza de barril y pantallas para cada partido. Para los aficionados de países germanoparlantes y los que prefieren ver el partido con una Hefeweizen en la mano y espacio para sentarse. El lugar más inusual y más funcional de Capitol Hill para ver el Mundial.", tag:"Curling bar" },
  ],

  food:[
    { dish:"Fuel Sports",             where:"First Hill — alitas + cerveza local del noroeste; el bar más futbolero de Seattle, el primero que se llena en días de USMNT", price:"$$",  type:"Sports bar" },
    { dish:"The George & Dragon",     where:"Fremont — bangers & mash + pinta inglesa; el pub europeo más auténtico del norte de Seattle",                                 price:"$$",  type:"Pub inglés" },
    { dish:"Rhein Haus",              where:"Capitol Hill — pretzel gigante + Hefeweizen; curling bar convertido en cervecería alemana con espacio para sentarse",         price:"$$",  type:"Cervecería" },
    { dish:"Pike Place Chowder",      where:"Pike Place Market — clam chowder de referencia; la fila vale la pena antes del partido de mediodía",                          price:"$",   type:"Local" },
    { dish:"Café de especialidad",    where:"Victrola (Capitol Hill) / Lighthouse Roasters (Fremont) / Caffe Vita; Seattle tiene la 2ª mayor concentración de cafés de especialidad del mundo", price:"$",   type:"Ritual" },
    { dish:"Marisco del Pacífico NW", where:"Taylor Shellfish en Capitol Hill — ostras frescas sin intermediarios; el marisco más fresco del continente",                  price:"$$",  type:"Pacific NW" },
  ],

  experiences:[
    { title:"Pike Place Market + Olympic Sculpture Park + Waterfront", duration:"Medio día a día completo", desc:"El Pike Place Market en su versión completa — no solo el puesto de los lanzadores de pescado, sino el laberinto de tres plantas de importadores de especias, quesos locales, flores y artesanía — merece dos horas sin prisa. A cuatro cuadras al norte, el Olympic Sculpture Park del Seattle Art Museum tiene esculturas de Richard Serra y Alexander Calder al borde del Puget Sound con vistas a las montañas Olympic — entrada gratuita. El Waterfront renovado completa el itinerario con el Ferry Terminal.", type:"Ciudad", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver Market" },
    { title:"Seattle Center — Pacific Science + MoPOP + Space Needle", duration:"Día completo", desc:"El Pacific Science Center tiene el planetario más moderno del Noroeste, exposiciones interactivas para todas las edades y mariposas tropicales vivas ($26 adultos). A cien metros, el Museum of Pop Culture (MoPOP) — diseñado por Frank Gehry — tiene colecciones sobre Jimi Hendrix, Nirvana y Star Wars ($30 adultos). La Space Needle, enfrente, tiene el mirador más famoso de la ciudad. El día más completo de cualquier sede del torneo para familias.", type:"Familiar", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver entradas" },
    { title:"Mount Rainier National Park (excursión de día)", duration:"Día completo", desc:"A 90 kilómetros al sureste de Seattle, el Monte Rainier es el volcán activo más alto de EE.UU. En junio hay campos de flores silvestres en Sunrise y Paradise — los dos centros de visitantes del parque. El drive desde Seattle toma 90 minutos; desde el parque, el Rainier a 4,392 metros crea un telón de fondo que ninguna otra sede del torneo puede ofrecer.", type:"Naturaleza", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver info" },
    { title:"Ferry a Bainbridge Island", duration:"Medio día", desc:"El ferry desde el Colman Dock sale cada 35 minutos hacia Bainbridge Island — 35 minutos de travesía con vistas al skyline de Seattle y a las montañas Olympic. La isla tiene el pueblo más fotogénico del Puget Sound: galerías, cafés y senderos costeros. Ferry: $9 ida. Plan perfecto para las mañanas previas a partidos de mediodía.", type:"Agua", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver horarios" },
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

  sectionSubtitles:{
    matches:"6 partidos confirmados en Lumen Field — incluyendo USMNT vs. Australia el 19 de junio, el partido de mayor demanda de la sede.",
    vibe:"Fan Fest oficial en el Seattle Center con la Space Needle de fondo, plazas históricas con pantallas y los pubs que el Sounders convirtió en referencia.",
    logistics:"Link Light Rail conecta aeropuerto, downtown, Capitol Hill y estadio sin transbordo. Stadium Station está en la puerta norte.",
    food:"Café de especialidad de referencia mundial, marisco del Pacífico Noroeste más fresco del continente y los pubs que funcionan cuando llega el partido.",
  },
  staysWarning:"Los precios son estimaciones para el periodo mundialista. El 19 de junio (USMNT vs. Australia) es la fecha más crítica de Seattle — downtown y Capitol Hill se agotan con meses de anticipación. Si no tienes reserva, considera Airbnb en Beacon Hill o Columbia City, ambos a 10–15 min en Link del estadio.",
}

export const en: CityGuide = {
  id:"sea",
  city:"Seattle",
  country:"United States",
  state:"Washington",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["USMNT","Pacific NW","Compact city","Co-host city"],

  stadium:{ name:"Seattle Stadium (Lumen Field)", capacity:"~69,000", area:"South Downtown — 10 min walk from Pike Place Market" },

  headline:"The only host city where the stadium is a ten-minute walk from North America's most famous fish market. Use that time before kickoff.",
  description:"Seattle arrives at the World Cup with 6 matches, the loudest stadium in the NFL, and USMNT at home on June 19. Lumen Field amplifies sound by design — for USA vs. Australia, that acoustic is going to prove why Seattle has the fan reputation it has. Link Light Rail links the airport, Capitol Hill, and the stadium without a transfer.",

  scores:[
    { label:"Atmosphere", value:5 },
    { label:"Football",   value:4 },
    { label:"Food",       value:5 },
    { label:"Transit",    value:4 },
    { label:"Safety",     value:4 },
    { label:"Cost",       value:2 },
  ],

  matches:[
    { id:"m1", date:"Jun 15", day:"Sun", time:"12:00 PT", teams:[{name:"Belgium",flag:"🇧🇪"},{name:"Egypt",flag:"🇪🇬"}], stadium:"Lumen Field", tag:"Group G · Opener", highlight:false },
    { id:"m2", date:"Jun 19", day:"Fri", time:"12:00 PT", teams:[{name:"United States",flag:"🇺🇸"},{name:"Australia",flag:"🇦🇺"}], stadium:"Lumen Field", tag:"Group D · USMNT", highlight:true },
    { id:"m3", date:"Jun 24", day:"Wed", time:"12:00 PT", teams:[{name:"Bosnia",flag:"🇧🇦"},{name:"Qatar",flag:"🇶🇦"}], stadium:"Lumen Field", tag:"Group B", highlight:false },
    { id:"m4", date:"Jun 26", day:"Fri", time:"20:00 PT", teams:[{name:"Egypt",flag:"🇪🇬"},{name:"Iran",flag:"🇮🇷"}], stadium:"Lumen Field", tag:"Group G", highlight:false },
    { id:"m5", date:"Jun 29", day:"Mon", time:"TBD",      teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"Lumen Field", tag:"Round of 32", highlight:false },
    { id:"m6", date:"Jul 6",  day:"Mon", time:"20:00 PT", teams:[{name:"Round of 16",flag:""},{name:"TBD",flag:""}], stadium:"Lumen Field", tag:"Round of 16", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",      value:"Seattle Stadium (Lumen Field)" },
      { label:"Capacity",          value:"~69,000 — FIFA configuration (the partial-roof design amplifies noise; considered the loudest stadium in the NFL)" },
      { label:"Weather (Jun–Jul)", value:"Days: 18–24°C · Nights: 12–15°C · The coolest U.S. host city in the tournament — light jacket required for night matches" },
      { label:"Matches",           value:"6 confirmed — 4 group + Round of 32 + Round of 16. Three of the four group matches kick off at noon PT." },
      { label:"Location",          value:"South Downtown — 10 min walk from Pike Place Market and 15 from Pioneer Square. Link Light Rail direct from airport and Capitol Hill." },
      { label:"Airport",           value:"SEA — Seattle-Tacoma International · Link Light Rail direct to downtown in ~40 min (same line that reaches the stadium)" },
    ],
    body:"Seattle is compact for its impact. Lumen Field sits at the south end of downtown, a ten-minute walk from Pike Place Market and fifteen from Pioneer Square. On June 19, United States vs. Australia is going to be the loudest match of the tournament — Lumen Field has an acoustic designed to amplify the fan, and 69,000 people are going to use it. The coolest city in the North American tournament also has the most serious coffee, the freshest seafood, and the most cinematic mountains two hours away.",
    lagomNote:"June 19 (USMNT vs. Australia) is the highest-demand date in the venue. Downtown and Capitol Hill hotels for that night sell out months ahead. Airbnb in Beacon Hill (10 min on Link from the stadium) or Columbia City are reasonable alternatives with good transit.",
  },

  vibe:{
    body:"Seattle Sounders has had the highest average MLS attendance for more than a decade. The Emerald City Supporters and organized groups have built a terrace culture comparable to any Latin American or European barra. June 19 isn't just a match — it's an entire city that has been waiting years for this moment. In parallel: world-class specialty coffee, the freshest Pacific Northwest seafood on the continent, and one of the best Japanese food scenes outside Japan. Seattle eats well and drinks better.",
    lagomNote:"Underestimating the night chill is the recurring mistake. June in Seattle has 22°C days but 12°C nights — and Lumen Field is open-air. With wind off Puget Sound, the perceived temperature can drop to 8–9°C. A light jacket is not optional for 8pm matches.",
  },

  stays:[
    { name:"Hotel Theodore", area:"Downtown / 2nd Avenue", price:"$$$", priceCAD:"$260–450 USD/night (World Cup period)", tags:["Boutique","Pacific NW","6 blocks to stadium"], note:"One of the most coherent design hotels in downtown Seattle: rooms that reference Pacific Northwest culture, an active bar with a Washington State whisky selection, and six blocks on foot from the stadium. The most comfortable option for noon matches.", best_for:"Character", url:"https://booking.stay22.com/lagomplan/gsXS841AN9" },
    { name:"Green Tortoise Hostel", area:"Pike Place Market / Post Alley", price:"$", priceCAD:"$65–140 USD/night by room type", tags:["Budget","Next to the Market","International vibe"], note:"Seattle's best-located hostel: in the Post Alley building, literally next to Pike Place Market. Private and shared rooms, an international feel from day one, and the most enviable position of any budget accommodation in the city.", best_for:"Budget", url:"https://booking.stay22.com/lagomplan/F3ruuST9Kf" },
    { name:"Fairmont Olympic Hotel", area:"Downtown / 4th Avenue", price:"$$$$", priceCAD:"$420–750 USD/night (World Cup period)", tags:["Luxury since 1924","Historic","9 blocks to stadium"], note:"Seattle's grand historic hotel since 1924: marble halls, a concierge service that actually works, and rooms that don't need to apologize. Nine blocks from the stadium on foot down 1st Avenue — the most direct route on match day.", best_for:"Luxury", url:"https://booking.stay22.com/lagomplan/Hx62afpwq-" },
  ],

  logistics:{
    transport:[
      { icon:"🚈", title:"Master route — Link Light Rail → Stadium Station", text:"Stadium Station on the Link Light Rail is at Lumen Field's north gate. From Capitol Hill Station: 5 minutes. From University Street Station (downtown): 8 minutes. From SEA (Sea-Tac airport): 40 minutes direct, no transfer, on the same Line 1. Fare varies by distance: Capitol Hill to the stadium, ~$2.75. From the airport: $3.50." },
      { icon:"🚶", title:"Walking from Pioneer Square", text:"The stadium is a 10-minute walk down 1st Avenue from Pioneer Square. For fans based downtown, walking is the simplest route — and the one that avoids Stadium Station saturation on the post-match crush." },
      { icon:"🌙", title:"Night matches — Link until midnight", text:"Link runs until midnight. Return from the stadium: service available until ~00:30. For matches ending past 10pm, Link is the only predictable option — post-match Uber surge in Pioneer Square can take 30–50 minutes at peak demand." },
      { icon:"⚠️", title:"Critical error — underestimating the night chill", text:"Seattle in June has 22°C days but 12°C nights — and Lumen Field is open-air. The 8pm match (Jun 26, Egypt vs. Iran) ends past 10pm. With wind off Puget Sound, perceived temperature can drop to 8–9°C. A light jacket is not optional for stadium nights, regardless of how the day looked.", isWarning:true },
    ],
    timings:[
      { label:"Capitol Hill Station on Link",                      value:"~5 min" },
      { label:"Downtown (University Street) on Link",              value:"~8 min" },
      { label:"SEA (airport) on Link direct",                      value:"~40 min" },
      { label:"Pioneer Square on foot via 1st Ave",                value:"~10 min" },
      { label:"Uber from Capitol Hill (normal / post-USMNT)",      value:"10–15 min · 25–40 min" },
    ],
    matchDayCronologia:{
      matchName:"Jun 19 · USMNT vs. Australia · 12:00 PT",
      steps:[
        { time:"H-4:00", text:"Breakfast at Pike Place Market before it fills with pre-match crowds. At 8am you can still find a table in the interior gallery." },
        { time:"H-3:00", text:"The streets around the stadium start filling up. If you're walking from Pioneer Square, head out unhurried." },
        { time:"H-2:00", text:"Link from your station or walk from Pioneer Square. Arrive before the lines form." },
        { time:"H-1:30", text:"Inside the stadium. Lumen Field's noise starts long before kickoff." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready. Prepare your ears." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:30", text:"Link back immediately or walk to Pioneer Square. Stadium Station saturates — be patient or wait 15 minutes inside the venue." },
      ],
    },
    timing:"Lumen Field has the cleanest public-transit logistics of any U.S. venue in the tournament, alongside Toronto's GO Train. One decision: Link. Stadium, airport, and Capitol Hill share the line.",
    cost:"Seattle is expensive — partly for the same reason as Vancouver: a tech city with permanent pressure on housing and hospitality. The World Cup period pushes that ceiling even higher, especially for the USMNT match. Airbnb in Capitol Hill, Fremont, or Beacon Hill is the savings margin.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Seattle Center", type:"Official fan fest", typeColor:CORAL, desc:"The Fan Fest sets up in the cultural complex built for the 1962 World's Fair — including the Space Needle, MoPOP, and Chihuly Garden and Glass. Big-format screens on the central lawns, musical programming, and the most cinematic setting of any Fan Fest in the North American tournament. Access by Monorail from Westlake Center in 2 minutes.", tag:"Seattle Center" },
    { title:"Occidental Square (Pioneer Square)", type:"Historic plaza", typeColor:FJORD, desc:"The cobbled plaza in Seattle's oldest neighborhood activates outdoor screens for high-demand matches. For the USMNT match on June 19, Pioneer Square will be the city's second gathering point — a ten-minute walk from the stadium, no registration needed.", tag:"Pioneer Sq" },
    { title:"Cal Anderson Park (Capitol Hill)", type:"Neighborhood park", typeColor:SAGE, desc:"Capitol Hill's most active park has football pitches — with a history of local leagues that have played there since the 90s — and space for informal broadcasts. The Sounders fan community uses Cal Anderson as an organic meeting point. For Belgium vs. Egypt or Egypt vs. Iran, the park draws the neighborhood's diasporas.", tag:"Capitol Hill" },
    { title:"Fuel Sports (First Hill)", type:"Sports bar", typeColor:PINE, desc:"Seattle's most serious sports bar, with screens at every angle and the city's highest concentration of football fans per square meter. For the USMNT match, arrive two hours early — it fills fast and without warning. Honest American pub food with solid options and zero pretension.", tag:"USMNT" },
    { title:"The George & Dragon Pub (Fremont)", type:"English pub", typeColor:"#1A3A5C", desc:"Seattle's most authentic English pub, with a crowd that ranges from Arsenal fans to Belgian national-team supporters. For the June 15 match (Belgium vs. Egypt), Fremont has the right atmosphere. The kitchen is honest English pub food — no complications, no hotel prices.", tag:"Fremont" },
    { title:"Rhein Haus (Capitol Hill)", type:"German beer hall", typeColor:"#4A7C7E", desc:"A curling hall converted into a German beer bar with draft beer and screens for every match. For German-speaking national-team fans and anyone who prefers to watch the match with a Hefeweizen in hand and room to sit. The most unusual and most functional Capitol Hill venue for the World Cup.", tag:"Curling bar" },
  ],

  food:[
    { dish:"Fuel Sports",             where:"First Hill — wings + Pacific Northwest local beer; Seattle's most football-focused bar, the first to fill on USMNT days", price:"$$",  type:"Sports bar" },
    { dish:"The George & Dragon",     where:"Fremont — bangers & mash + English pint; the most authentic European pub in north Seattle",                               price:"$$",  type:"English pub" },
    { dish:"Rhein Haus",              where:"Capitol Hill — giant pretzel + Hefeweizen; a curling bar reborn as a German beer hall with room to sit",                  price:"$$",  type:"Beer hall" },
    { dish:"Pike Place Chowder",      where:"Pike Place Market — reference clam chowder; the line is worth it before a noon match",                                    price:"$",   type:"Local" },
    { dish:"Specialty coffee",        where:"Victrola (Capitol Hill) / Lighthouse Roasters (Fremont) / Caffe Vita; Seattle has the world's 2nd-highest concentration of specialty coffee shops", price:"$",   type:"Ritual" },
    { dish:"Pacific NW seafood",      where:"Taylor Shellfish in Capitol Hill — fresh oysters with no intermediaries; the freshest seafood on the continent",          price:"$$",  type:"Pacific NW" },
  ],

  experiences:[
    { title:"Pike Place Market + Olympic Sculpture Park + Waterfront", duration:"Half to full day", desc:"Pike Place Market in its full form — not just the fish-throwing stall, but the three-story maze of spice importers, local cheesemakers, florists, and craft — deserves two unhurried hours. Four blocks north, the Seattle Art Museum's Olympic Sculpture Park has Richard Serra and Alexander Calder pieces along Puget Sound with Olympic Mountain views — free admission. The renovated Waterfront rounds out the route with the Ferry Terminal.", type:"City", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See Market" },
    { title:"Seattle Center — Pacific Science + MoPOP + Space Needle", duration:"Full day", desc:"The Pacific Science Center has the most modern planetarium in the Northwest, interactive exhibits for all ages, and live tropical butterflies ($26 adults). A hundred meters away, the Museum of Pop Culture (MoPOP) — designed by Frank Gehry — holds collections on Jimi Hendrix, Nirvana, and Star Wars ($30 adults). The Space Needle, across the way, has the city's most famous observation deck. The most complete day at any host city for families.", type:"Family", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See tickets" },
    { title:"Mount Rainier National Park (day trip)", duration:"Full day", desc:"90 km southeast of Seattle, Mount Rainier is the highest active volcano in the U.S. In June there are wildflower fields at Sunrise and Paradise — the park's two visitor centers. The drive from Seattle takes 90 minutes; from the park, Rainier at 4,392 meters creates a backdrop no other tournament host city can offer.", type:"Nature", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See info" },
    { title:"Ferry to Bainbridge Island", duration:"Half day", desc:"The ferry from Colman Dock leaves every 35 minutes for Bainbridge Island — a 35-minute crossing with views of the Seattle skyline and the Olympic Mountains. The island has the most photogenic town on Puget Sound: galleries, cafés, and coastal trails. Ferry: $9 one way. Perfect for mornings ahead of noon matches.", type:"Water", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See schedule" },
  ],

  lagomTips:[
    "Link Light Rail is the only decision: it connects airport, Capitol Hill, and Lumen Field without a transfer. Stadium Station is at the north gate.",
    "June 19 (USMNT vs. Australia) is the venue's highest-demand match. Hotels sell out months ahead — Beacon Hill and Columbia City are the reasonable alternatives.",
    "Light jacket mandatory for night matches. June in Seattle: 22°C days, 12°C nights, wind off Puget Sound — real feel 8–9°C.",
    "Pike Place Market before 9am gets you a table in the interior gallery. By 10am it's saturated and doesn't empty until post-match.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "ORCA card loaded or contactless payment ready for Link",
    "Light jacket (mandatory for 20:00 PT matches)",
    "Clear bag required",
    "Water — Seattle June is cool but the stadium heats up in a sunny match",
    "Hotel reservation confirmed for June 19 if it's USMNT",
    "Last Link time written down if the match is at night",
    "Pre-match plan for Pike Place Market or Pioneer Square",
  ],

  didYouKnow:"Lumen Field is considered the loudest stadium in the NFL — the partial-roof design traps and channels sound back onto the pitch. When the Seattle Sounders fill the venue, roars of 136+ decibels have been recorded — equivalent to a jet takeoff from ten meters away.",
  closingNote:"Seattle arrives at the World Cup with six matches and the loudest USMNT match of the entire tournament. Lumen Field has an acoustic designed to amplify the fan — and on June 19, 69,000 people are going to use it. The coolest city in the North American tournament also has the most serious coffee, the freshest seafood, and the most cinematic mountains two hours away. Link Light Rail goes straight to the stadium from the airport, from Capitol Hill, and from downtown without a transfer. LagomPlan gives you the right station, the jacket for the June 26 night, and the noon oyster before kickoff. Rainier handles the backdrop.",
  closingSignature:"Lagomplan · Field Guide · Seattle · World Cup 2026",
  plannerCTA:"Generate my Seattle trip",

  sectionSubtitles:{
    matches:"6 matches confirmed at Lumen Field — including USMNT vs. Australia on June 19, the venue's highest-demand date.",
    vibe:"Official Fan Fest at Seattle Center with the Space Needle as backdrop, historic plazas with screens, and the pubs the Sounders turned into the reference.",
    logistics:"Link Light Rail connects airport, downtown, Capitol Hill, and the stadium without a transfer. Stadium Station is at the north gate.",
    food:"World-class specialty coffee, the freshest Pacific Northwest seafood on the continent, and the pubs that deliver when kickoff arrives.",
  },
  staysWarning:"Prices are estimates for the World Cup period. June 19 (USMNT vs. Australia) is Seattle's critical date — downtown and Capitol Hill sell out months ahead. If you don't have a reservation, consider Airbnb in Beacon Hill or Columbia City, both 10–15 min on Link from the stadium.",
}
