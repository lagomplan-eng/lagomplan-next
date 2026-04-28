import type { CityGuide } from '../types'

// Color tokens — inlined so the data file is self-contained (no jsx imports).
const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#B85C3E'

export const es: CityGuide = {
  id:"sf",
  city:"San Francisco / Bay Area",
  country:"Estados Unidos",
  state:"California",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Pacífico","Gastronomía","Tech","Sede co-anfitriona"],

  stadium:{ name:"San Francisco Bay Area Stadium (Levi's Stadium)", capacity:"~69,391", area:"Santa Clara, CA — a 70 km al sur de San Francisco" },

  headline:"El estadio está en Santa Clara. El fan fest está en San Francisco. La distancia entre ambos define el viaje.",
  description:"La Bay Area recibe 6 partidos del Mundial 2026 en Levi's Stadium — ubicado en Santa Clara, a 70 kilómetros al sur del centro de San Francisco. La decisión de base (SF, San José u Oakland) es tan importante como el boleto del partido. Cuatro de cinco partidos de grupos arrancan a las 21:00 PT, lo que complica el regreso nocturno en Caltrain.",

  scores:[
    { label:"Ambiente",     value:4 },
    { label:"Fútbol local", value:3 },
    { label:"Gastronomía",  value:5 },
    { label:"Transporte",   value:3 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:1 },
  ],

  matches:[
    { id:"m1", date:"13 Jun", day:"Sáb", time:"12:00 PT", teams:[{name:"Qatar",flag:"🇶🇦"},{name:"Suiza",flag:"🇨🇭"}], stadium:"Levi's Stadium", tag:"Grupo B · Diurno", highlight:true },
    { id:"m2", date:"16 Jun", day:"Mar", time:"21:00 PT", teams:[{name:"Austria",flag:"🇦🇹"},{name:"Jordania",flag:"🇯🇴"}], stadium:"Levi's Stadium", tag:"Grupo J", highlight:false },
    { id:"m3", date:"19 Jun", day:"Vie", time:"21:00 PT", teams:[{name:"Türkiye",flag:"🇹🇷"},{name:"Paraguay",flag:"🇵🇾"}], stadium:"Levi's Stadium", tag:"Grupo D", highlight:true },
    { id:"m4", date:"22 Jun", day:"Lun", time:"20:00 PT", teams:[{name:"Jordania",flag:"🇯🇴"},{name:"Argelia",flag:"🇩🇿"}], stadium:"Levi's Stadium", tag:"Grupo J", highlight:false },
    { id:"m5", date:"25 Jun", day:"Jue", time:"19:00 PT", teams:[{name:"Paraguay",flag:"🇵🇾"},{name:"Australia",flag:"🇦🇺"}], stadium:"Levi's Stadium", tag:"Grupo D", highlight:false },
    { id:"m6", date:"1 Jul",  day:"Mié", time:"17:00 PT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Levi's Stadium", tag:"Ronda de 32", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"San Francisco Bay Area Stadium (Levi's Stadium)" },
      { label:"Aforo", value:"~69,391 — configuración FIFA (el único estadio del torneo con paneles solares que generan más energía de la que consume)" },
      { label:"Clima (jun–jul)", value:"Días: 18–26°C · Noches: 12–15°C · Microclimas: SF puede tener niebla y 15°C mientras Santa Clara tiene 28°C el mismo día" },
      { label:"Partidos", value:"6 confirmados — 5 grupos + 1 Ronda de 32. Cuatro de cinco grupos arrancan a las 21:00 PT." },
      { label:"Ubicación", value:"Santa Clara — a 70 km al sur de SF. Acceso por VTA Light Rail (desde San José) o Caltrain (desde SF/Peninsula)." },
      { label:"Aeropuertos", value:"SJC (San José — el más cercano al estadio, ~8 km) · SFO (SF, BART al centro) · OAK (Oakland, BART, económico)" },
    ],
    body:"Levi's Stadium está en Santa Clara, al sur de la Bay Area — no en la ciudad de San Francisco. La decisión de base más importante de esta guía: quedarse cerca del estadio en Santa Clara/San José, o quedarse en San Francisco y asumir el desplazamiento de 70 kilómetros. Ambas tienen lógica según el itinerario. Si tienes varios partidos, San José gana. Si vienes por el único partido diurno del 13 de junio, SF como destino en sí mismo es el mejor plan.",
    lagomNote:"Cuatro de los cinco partidos de grupos arrancan a las 21:00 PT — la hora más tardía de cualquier sede del torneo. El pitido final llega pasadas las 23:00. El Caltrain hacia SF tiene servicio hasta las 00:30, pero no es continuo. Verifica el último tren antes del partido o ten Uber como plan B.",
  },

  vibe:{
    body:"La Bay Area tiene una comunidad futbolera más profunda de lo que el estereotipo tech sugiere: la comunidad latinoamericana del este de la bahía llena los estadios del San José Earthquakes y el Oakland Roots, y las diásporas de Turquía, Austria y Suiza tienen representación orgánica en la región. Los partidos de Paraguay generan además una comunidad paraguaya de California que no tiene representación equivalente en ninguna otra sede del torneo. La Bay Area tiene la escena de restaurantes más sofisticada y más cara de Estados Unidos fuera de Nueva York.",
    lagomNote:"Planifica el alojamiento con meses de anticipación y evalúa alternativas en San José, Oakland o Santa Clara. San Francisco tiene los hoteles más caros de California, y el área metropolitana en su conjunto responde a una economía tech que no ajusta tarifas por el calendario futbolístico.",
  },

  stayNeighborhoods:{
    intro:"Levi's Stadium está en Santa Clara — al sur de la bahía, a 70 kilómetros de San Francisco. La decisión de base más importante de esta guía: quedarse cerca del estadio en Santa Clara/San José, o quedarse en San Francisco y asumir el desplazamiento. Ambas tienen lógica según el itinerario.",
    items:[
      { kind:"recommended", title:"Base recomendada (varios partidos): San José — Downtown / Santana Row", body:"Para el fan con varios partidos en el calendario, San José elimina el problema del desplazamiento de 70 kilómetros. Santana Row — el corredor comercial y gastronómico de San José — tiene hoteles boutique, restaurantes de autor y acceso al VTA Light Rail (línea Mountain View–Winchester, parada Santa Clara, con caminata o shuttle de 1 km al estadio). Downtown San José tiene opciones más económicas con acceso al Caltrain. El precio de hotel es un 30–40% más bajo que San Francisco." },
      { kind:"alternative", title:"Base con experiencia de ciudad: San Francisco — Mission District / Hayes Valley", body:"Para el fan que viene principalmente por el partido único del 13 de junio (el único diurno) y quiere vivir la ciudad como destino, el Mission District es el barrio más auténtico de SF: murales, taquería de referencia, bares de barrio y la mayor concentración de comunidad latinoamericana de la ciudad. Hayes Valley, contiguo, tiene los restaurantes de autor más interesantes. El desplazamiento al estadio requiere Caltrain o Uber." },
      { kind:"alternative", title:"Opción económica con criterio: Oakland — Uptown / Lake Merritt", body:"Oakland tiene precios de hotel significativamente más bajos que San Francisco, una escena de restaurantes y bares más interesante por metro cuadrado, y acceso por BART tanto al centro de SF (15 minutos) como al sur de la bahía para tomar el Caltrain. Para el fan con presupuesto ajustado que no quiere dormirse en una cadena de carretera de Santa Clara." },
      { kind:"alternative", title:"Solo para partidos nocturnos: Santa Clara / Milpitas", body:"Para los cuatro partidos de las 9pm, quedarse en Santa Clara o Milpitas elimina el problema del regreso nocturno. No hay vida de barrio equivalente a SF u Oakland, pero la eficiencia logística es máxima. Hoteles de cadena con transporte al estadio disponible." },
    ],
  },
  stays:[
    { name:"Hotel Zephyr", area:"San Francisco / Fisherman's Wharf", price:"$$$", priceCAD:"$280–480 USD/noche (periodo mundialista)", tags:["Boutique","Muelle histórico","Vistas a Alcatraz"], note:"En el muelle histórico de SF con vistas a la bahía y al Alcatraz, el Zephyr tiene habitaciones con diseño náutico-contemporáneo, patio exterior con fuegos artificiales y acceso al Embarcadero en 5 minutos a pie. Para el fan que quiere SF completo — con el entendimiento de que el estadio está a 70 km.", best_for:"SF completo", url:"https://booking.stay22.com/lagomplan/4eYFj7a3ys" },
    { name:"Marriott San José", area:"Downtown San José", price:"$$", priceCAD:"$200–350 USD/noche (periodo mundialista)", tags:["Cerca Caltrain","Piscina","Downtown"], note:"Para el fan con varios partidos, el Marriott del downtown de San José tiene acceso al Caltrain (estación San José Diridon, a tres cuadras) y piscina. La opción más eficiente del triángulo SF–SJ–estadio.", best_for:"Varios partidos", url:"https://booking.stay22.com/lagomplan/niw-b1kZGi" },
    { name:"Oakland Marriott City Center", area:"Downtown Oakland / Lake Merritt BART", price:"$$", priceCAD:"$160–280 USD/noche (periodo mundialista)", tags:["BART Lake Merritt","Económico","Mejor precio-posición"], note:"A una cuadra de la estación Lake Merritt del BART — que conecta con el centro de SF en 15 minutos y con la estación de Caltrain de Millbrae (para bajar al sur) en 40. El mejor precio-posición de la Bay Area para el fan que quiere opciones en ambas ciudades.", best_for:"Presupuesto", url:"https://booking.stay22.com/lagomplan/LWLsKjRLvN" },
  ],

  logistics:{
    transport:[
      { icon:"🚈", title:"Desde San José — VTA Light Rail (la ruta más directa)", text:"VTA Light Rail línea Mountain View–Winchester → parada Santa Clara → caminata de 1 km o shuttle de matchday al estadio. Desde Downtown San José (estación San José Diridon): ~20 minutos en Light Rail. Tarifa: $2.50. Esta es la ruta más directa de todas las de la Bay Area para llegar al Levi's." },
      { icon:"🚆", title:"Desde San Francisco — Caltrain expreso", text:"Caltrain desde SF Caltrain Station (4th & King) hasta Santa Clara Station → VTA Light Rail o shuttle al estadio. El Caltrain tiene servicio expreso en días de partido que reduce el trayecto a 45–50 minutos. Total desde SF centro: aproximadamente 70 minutos." },
      { icon:"🚊", title:"Desde Oakland — BART + Caltrain", text:"BART desde Oakland a Millbrae Station → Caltrain a Santa Clara → VTA al estadio. Total: ~75–85 minutos. Alternativa: BART a San José Diridon (no todas las líneas) → VTA al estadio." },
      { icon:"⚠️", title:"Error crítico — Uber desde SF en partido nocturno", text:"Ir en Uber desde San Francisco al estadio en partido nocturno sin haber calculado el precio de regreso. El viaje de ida puede costar $60–80 USD con tráfico. El de regreso a las 23:30, con 69,000 personas saliendo al mismo tiempo, puede superar los $120–150 USD con precio surge y 40–60 minutos de espera. Si sales desde SF, el Caltrain es la única ruta de regreso predecible. Verifica el horario del último tren antes de entrar al estadio.", isWarning:true },
    ],
    timings:[
      { label:"Downtown San José (VTA)", value:"~20 min" },
      { label:"SJC (aeropuerto San José) → Levi's", value:"~15–20 min (el más corto de la Bay)" },
      { label:"SF Caltrain Station (tren expreso)", value:"~55 min" },
      { label:"SFO → BART a Millbrae + Caltrain", value:"~65 min" },
      { label:"Uber desde SF en día de partido", value:"60–90 min · $70–120 USD" },
    ],
    matchDayCronologia:{
      matchName:"19 Jun · Türkiye vs. Paraguay · 21:00 PT",
      steps:[
        { time:"H-4:00", text:"Cena en tu barrio base antes de las 17:30. El Caltrain expreso de noche tiene plaza limitada." },
        { time:"H-2:30", text:"Sale hacia la estación de Caltrain o VTA. Los partidos de noche llenan el tren." },
        { time:"H-1:30", text:"Llegada al estadio. Puertas abiertas 90 minutos antes. El clima de Santa Clara puede diferir del de SF — lleva una capa." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:45", text:"Caltrain de regreso. Verifica el último tren con anticipación. El de las 00:15 desde Santa Clara es el límite para llegar a SF." },
      ],
    },
    timing:"Levi's está en Santa Clara. El Fan Fest está en SF. La distancia entre ambos define el viaje — y la decisión de base condiciona la logística de cada partido. Si tienes varios, San José elimina el problema. Si vienes por uno, SF como destino funciona.",
    cost:"San Francisco tiene los hoteles más caros de California. San José y Oakland son 30–40% más económicos sin renunciar a acceso transit. Los cuatro partidos nocturnos (21:00 PT) hacen que dormir en SF requiera plan de regreso en Caltrain confirmado.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Civic Center Plaza (SF)", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest de la sede se instala en el Civic Center Plaza frente al Ayuntamiento de San Francisco — uno de los edificios de cúpula dorada más fotografiados de California. Pantallas gigantes, programación cultural y acceso desde cualquier barrio de SF por BART (estación Civic Center/UN Plaza) o a pie desde Hayes Valley. Para los partidos nocturnos en el estadio, el Fan Fest es el punto de reunión previo antes de tomar el Caltrain hacia el sur.", tag:"Civic Center" },
    { title:"Thrive City / Chase Center (Mission Bay, SF)", type:"Plaza con pantalla", typeColor:FJORD, desc:"La plaza exterior del Chase Center — el estadio de los Golden State Warriors — tiene pantallas permanentes y ya fue sede de la watch party oficial del sorteo del torneo. Con capacidad para miles de personas, acceso por ferry desde el Embarcadero y programación confirmada para el Mundial, es el espacio al aire libre con mayor infraestructura de la región.", tag:"Mission Bay" },
    { title:"Oakland City Hall Plaza", type:"Plaza cívica", typeColor:SAGE, desc:"La plaza cívica frente al Ayuntamiento de Oakland activa transmisiones públicas para eventos deportivos internacionales. La comunidad latinoamericana de Oakland — la segunda mayor del Bay Area — convierte los partidos de sus selecciones en reuniones de barrio que no necesitan convocatoria oficial.", tag:"Oakland" },
    { title:"San José City Hall Plaza (Downtown SJ)", type:"Plaza cívica", typeColor:PINE, desc:"El gobierno de San José tiene confirmada actividad mundialista en la plaza del Ayuntamiento, a tres cuadras de la estación de Caltrain Diridon. Para el fan con base en el sur de la bahía que quiere ambiente de ciudad sin el desplazamiento a SF.", tag:"South Bay" },
    { title:"Mad Dog in the Fog (Hayes Valley, SF)", type:"Pub inglés", typeColor:"#1A3A5C", desc:"Pub inglés de referencia para el fútbol europeo, abierto desde 1993. Transmite todos los partidos del torneo sin excepción, con pantallas en cada rincón y una clientela que lleva treinta años madrugando para ver la Premier League. Para los partidos de Türkiye, Austria y Paraguay, Mad Dog tiene el ambiente más apropiado de SF.", tag:"Desde 1993" },
    { title:"Kindred (Campbell, South Bay)", type:"Sports bar", typeColor:"#B85C3E", desc:"El sports bar más bien valorado del sur del Bay Area para ver fútbol — pantallas en todos los ángulos, cocina de pub seria y una clientela que incluye a la comunidad de San José Earthquakes. Para el fan con base en San José que no quiere viajar a SF para ver el partido de Paraguay vs. Australia o la Ronda de 32.", tag:"Campbell" },
  ],

  food:[
    { dish:"Mad Dog in the Fog", where:"Hayes Valley, SF — fish & chips + pinta inglesa; pub de fútbol europeo desde 1993, sin rival en criterio", price:"$$", type:"Pub fútbol" },
    { dish:"Thrive City Plaza", where:"Mission Bay, SF — food trucks + cerveza; pantalla al aire libre junto al Chase Center, con brisa de la bahía", price:"$$", type:"Al aire libre" },
    { dish:"Kindred (Campbell)", where:"South Bay — hamburguesa gourmet + cerveza de Silicon Valley; el sports bar mejor valorado del sur de la bahía", price:"$$", type:"South Bay" },
    { dish:"La Taqueria (Mission)", where:"SF Mission District — el burrito de referencia; una cola disciplinada antes del partido diurno del sábado 13", price:"$", type:"Ritual" },
    { dish:"Koi Palace / Yank Sing", where:"Dim sum — Koi Palace en Sunset (el de locales), Yank Sing en Embarcadero (el del centro); ambos antes de la hora punta", price:"$$", type:"Chino" },
    { dish:"Swan Oyster Depot", where:"Polk Street — mariscos de la Costa Oeste sin reservas, en barra; el mejor marisco de SF sin pretensión", price:"$$–$$$", type:"Local" },
  ],

  experiences:[
    { title:"Golden Gate + Marin Headlands + Sausalito", duration:"Medio día a día completo", desc:"El Golden Gate no necesita presentación, pero sí una estrategia: cruzarlo a pie desde el lado de SF en la mañana (sin niebla antes de las 11am) y continuar en bicicleta hasta Sausalito — un recorrido de 12 kilómetros con vistas a la bahía y a la ciudad. El ferry de regreso desde Sausalito a SF dura 30 minutos y llega al Ferry Building. Para el día libre entre el partido del 13 y el del 16 de junio.", type:"Icónico", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver ferry" },
    { title:"Exploratorium + Aquarium + Academy of Sciences", duration:"Día completo", desc:"Tres museos de primera línea: el Exploratorium en el Embarcadero (650 exhibiciones interactivas de física y biología), el Aquarium of the Bay en Pier 39 (tiburones, rayas y túnel acrílico), y la California Academy of Sciences en Golden Gate Park (planetario de 30 metros, bosque tropical bajo techo y el arrecife más grande del mundo en espacio de museo).", type:"Familiar", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver entradas" },
    { title:"Napa / Sonoma (excursión de día)", duration:"Día completo", desc:"Napa Valley está a 90 kilómetros al norte de SF por la Highway 29 — accesible en auto en 90 minutos o en tour organizado. Sonoma está a 70 kilómetros al noroeste. Los meses de junio y julio corresponden al período de crecimiento de la vid — no es época de vendimia, pero las bodegas operan con visitas y degustaciones sin la saturación de octubre.", type:"Vino", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver tours" },
    { title:"Mission District — burritos + murales + bares", duration:"Medio día", desc:"El Mission District tiene la mayor concentración de comunidad latinoamericana de la ciudad, los murales de Balmy Alley y Clarion Alley, y las taquerías de referencia: La Taqueria para el burrito canónico, Tartine Bakery para el pan del día. Por la tarde, 20th Street tiene la mejor escena de bares de barrio de SF sin perder identidad.", type:"Barrio", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver mapa" },
  ],

  lagomTips:[
    "Levi's Stadium está en Santa Clara — a 70 km al sur de SF. Para varios partidos, la base en San José o Santa Clara elimina el desplazamiento.",
    "Cuatro de los cinco partidos de grupos arrancan a las 21:00 PT. Verifica el horario del último Caltrain antes de entrar al estadio.",
    "El partido del 13 de junio (Qatar vs. Suiza) es el único diurno (12:00 PT). Es el día para hacer SF como destino: burrito en La Taqueria, partido, Fan Fest por la tarde.",
    "SJC es el aeropuerto más cercano al estadio (~15–20 minutos). Si tu itinerario es Mundial-céntrico, vuela ahí en lugar de SFO.",
  ],

  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Boleto Caltrain o VTA confirmado",
    "Último tren de regreso anotado (especial si es partido nocturno)",
    "Capa ligera — microclima Santa Clara puede ser frío o caluroso",
    "Bolso claro obligatorio",
    "Uber surge como plan B con presupuesto previsto",
    "Reserva de hotel confirmada según la base (SF / SJ / Oakland)",
    "Hidratación previa — el estadio al aire libre se calienta por la tarde",
  ],

  didYouKnow:"Levi's Stadium es el único estadio del torneo con paneles solares en el techo que generan más energía de la que el estadio consume. Cuando hay partido nocturno, parte de la iluminación viene directamente de la energía acumulada durante el día.",
  closingNote:"San Francisco / Bay Area es la sede más cara, la más geográficamente fragmentada y la más difícil de resolver en términos logísticos. También es la que tiene la gastronomía más sofisticada, el entorno natural más cinematográfico y el viaje en ferry desde el Embarcadero al estadio más pintoresco del torneo — si se confirma esa opción para algunos partidos. Levi's está en Santa Clara. El Fan Fest está en SF. La distancia entre ambos define el viaje. LagomPlan te dice desde qué ciudad quedarte según cuántos partidos tienes, a qué hora toma el Caltrain y por qué el burrito de La Taqueria merece la cola antes del partido diurno del sábado 13 de junio.",
  closingSignature:"Lagomplan · Guía de campo · San Francisco / Bay Area · Mundial 2026",
  plannerCTA:"Generar mi viaje a la Bay Area",

  sectionSubtitles:{
    matches:"6 partidos confirmados en Levi's Stadium (Santa Clara). Cuatro de cinco partidos de grupos arrancan a las 21:00 PT — el regreso en Caltrain es la variable crítica del viaje.",
    vibe:"Fan Fest oficial en Civic Center Plaza (SF), pantallas en Chase Center y plazas cívicas, y los pubs que llevan décadas transmitiendo fútbol europeo.",
    logistics:"Levi's está en Santa Clara, a 70 km al sur de SF. Caltrain y VTA son las rutas sin tráfico — confirma el último tren antes de entrar al estadio.",
    food:"La Bay Area tiene la escena de restaurantes más sofisticada de la Costa Oeste y los pubs de fútbol más curados de California — el reto es elegir entre el burrito de La Taqueria y el fish & chips de Mad Dog.",
  },
  staysWarning:"Los precios son estimaciones para el periodo mundialista. San Francisco tiene los hoteles más caros de California; San José y Oakland son 30–40% más económicos sin renunciar a acceso transit. Para partidos nocturnos, prioriza base en Santa Clara o San José si no quieres depender del último Caltrain a SF.",
}

export const en: CityGuide = {
  id:"sf",
  city:"San Francisco / Bay Area",
  country:"United States",
  state:"California",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Pacific","Food","Tech","Co-host city"],

  stadium:{ name:"San Francisco Bay Area Stadium (Levi's Stadium)", capacity:"~69,391", area:"Santa Clara, CA — 70 km south of San Francisco" },

  headline:"The stadium is in Santa Clara. The Fan Fest is in San Francisco. The distance between them defines the trip.",
  description:"The Bay Area hosts 6 matches of the 2026 World Cup at Levi's Stadium — in Santa Clara, 70 km south of downtown San Francisco. Your base city decision (SF, San José, or Oakland) matters as much as the match ticket. Four of five group matches kick off at 21:00 PT, which complicates the late-night Caltrain return.",

  scores:[
    { label:"Atmosphere", value:4 },
    { label:"Football",   value:3 },
    { label:"Food",       value:5 },
    { label:"Transit",    value:3 },
    { label:"Safety",     value:4 },
    { label:"Cost",       value:1 },
  ],

  matches:[
    { id:"m1", date:"Jun 13", day:"Sat", time:"12:00 PT", teams:[{name:"Qatar",flag:"🇶🇦"},{name:"Switzerland",flag:"🇨🇭"}], stadium:"Levi's Stadium", tag:"Group B · Daytime", highlight:true },
    { id:"m2", date:"Jun 16", day:"Tue", time:"21:00 PT", teams:[{name:"Austria",flag:"🇦🇹"},{name:"Jordan",flag:"🇯🇴"}], stadium:"Levi's Stadium", tag:"Group J", highlight:false },
    { id:"m3", date:"Jun 19", day:"Fri", time:"21:00 PT", teams:[{name:"Türkiye",flag:"🇹🇷"},{name:"Paraguay",flag:"🇵🇾"}], stadium:"Levi's Stadium", tag:"Group D", highlight:true },
    { id:"m4", date:"Jun 22", day:"Mon", time:"20:00 PT", teams:[{name:"Jordan",flag:"🇯🇴"},{name:"Algeria",flag:"🇩🇿"}], stadium:"Levi's Stadium", tag:"Group J", highlight:false },
    { id:"m5", date:"Jun 25", day:"Thu", time:"19:00 PT", teams:[{name:"Paraguay",flag:"🇵🇾"},{name:"Australia",flag:"🇦🇺"}], stadium:"Levi's Stadium", tag:"Group D", highlight:false },
    { id:"m6", date:"Jul 1",  day:"Wed", time:"17:00 PT", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"Levi's Stadium", tag:"Round of 32", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",      value:"San Francisco Bay Area Stadium (Levi's Stadium)" },
      { label:"Capacity",          value:"~69,391 — FIFA configuration (the only tournament stadium with solar panels that generate more power than it consumes)" },
      { label:"Weather (Jun–Jul)", value:"Days: 18–26°C · Nights: 12–15°C · Microclimates: SF can be foggy and 15°C while Santa Clara hits 28°C the same day" },
      { label:"Matches",           value:"6 confirmed — 5 group + 1 Round of 32. Four of five group matches kick off at 21:00 PT." },
      { label:"Location",          value:"Santa Clara — 70 km south of SF. Access via VTA Light Rail (from San José) or Caltrain (from SF/Peninsula)." },
      { label:"Airports",          value:"SJC (San José — closest to the stadium, ~8 km) · SFO (SF, BART to downtown) · OAK (Oakland, BART, budget)" },
    ],
    body:"Levi's Stadium sits in Santa Clara, at the south end of the Bay Area — not in the city of San Francisco. The most important base decision in this guide: stay close to the stadium in Santa Clara/San José, or stay in San Francisco and absorb the 70 km commute. Both make sense depending on the itinerary. If you have multiple matches, San José wins. If you came for the lone daytime match on June 13, SF as a destination in itself is the better plan.",
    lagomNote:"Four of the five group matches kick off at 21:00 PT — the latest starting time of any host city in the tournament. The final whistle comes after 23:00. Caltrain to SF runs until 00:30, but service isn't continuous. Check the last train before the match or have Uber as a plan B.",
  },

  vibe:{
    body:"The Bay Area has a deeper football community than the tech stereotype suggests: the Latin American community on the east side of the bay fills San José Earthquakes and Oakland Roots stadiums, and the Turkish, Austrian, and Swiss diasporas all have organic representation in the region. Paraguay's matches also draw a California Paraguayan community with no equivalent at any other host city. The Bay Area has the most sophisticated and most expensive restaurant scene in the U.S. outside New York.",
    lagomNote:"Plan accommodation months ahead and consider alternatives in San José, Oakland, or Santa Clara. San Francisco has California's most expensive hotels, and the metro area as a whole responds to a tech economy that doesn't adjust rates for the football calendar.",
  },

  stayNeighborhoods:{
    intro:"Levi's Stadium is in Santa Clara — at the south end of the bay, 70 kilometers from San Francisco. The most important base decision in this guide: stay near the stadium in Santa Clara/San Jose, or stay in San Francisco and accept the commute. Both have logic depending on the itinerary.",
    items:[
      { kind:"recommended", title:"Recommended base (multiple matches): San Jose — Downtown / Santana Row", body:"For the fan with multiple matches scheduled, San Jose eliminates the 70-kilometer commute problem. Santana Row — San Jose's commercial and dining corridor — has boutique hotels, chef-driven restaurants, and access to the VTA Light Rail (Mountain View–Winchester line, Santa Clara stop, with a 1 km walk or shuttle to the stadium). Downtown San Jose has more economical options with Caltrain access. Hotel prices run 30–40% below San Francisco." },
      { kind:"alternative", title:"City-experience base: San Francisco — Mission District / Hayes Valley", body:"For the fan coming primarily for the single June 13 match (the only daytime one) and wanting to live the city as a destination, the Mission District is SF's most authentic neighborhood: murals, landmark taquerías, neighborhood bars, and the city's largest Latin American community. Hayes Valley, adjacent, has the most interesting chef-driven restaurants. The stadium commute requires Caltrain or Uber." },
      { kind:"alternative", title:"Considered budget: Oakland — Uptown / Lake Merritt", body:"Oakland has hotel prices significantly below San Francisco, a more interesting per-block restaurant and bar scene, and BART access to both downtown SF (15 minutes) and the south bay for the Caltrain. For the budget-conscious fan who doesn't want to sleep at a Santa Clara highway chain." },
      { kind:"alternative", title:"For night matches only: Santa Clara / Milpitas", body:"For the four 9pm matches, staying in Santa Clara or Milpitas eliminates the late-night return problem. No neighborhood life equivalent to SF or Oakland, but maximum logistical efficiency. Chain hotels with available stadium transport." },
    ],
  },
  stays:[
    { name:"Hotel Zephyr", area:"San Francisco / Fisherman's Wharf", price:"$$$", priceCAD:"$280–480 USD/night (World Cup period)", tags:["Boutique","Historic pier","Alcatraz views"], note:"On SF's historic waterfront with views of the bay and Alcatraz, the Zephyr has nautical-contemporary rooms, an outdoor fire-pit courtyard, and a 5-minute walk to the Embarcadero. For the fan who wants the full SF experience — with the understanding that the stadium is 70 km away.", best_for:"Full SF", url:"https://booking.stay22.com/lagomplan/4eYFj7a3ys" },
    { name:"Marriott San José", area:"Downtown San José", price:"$$", priceCAD:"$200–350 USD/night (World Cup period)", tags:["Near Caltrain","Pool","Downtown"], note:"For the fan with multiple matches, the downtown San José Marriott has Caltrain access (San José Diridon station, three blocks away) and a pool. The most efficient option in the SF–SJ–stadium triangle.", best_for:"Multiple matches", url:"https://booking.stay22.com/lagomplan/niw-b1kZGi" },
    { name:"Oakland Marriott City Center", area:"Downtown Oakland / Lake Merritt BART", price:"$$", priceCAD:"$160–280 USD/night (World Cup period)", tags:["BART Lake Merritt","Budget","Best value"], note:"One block from the Lake Merritt BART station — which connects to downtown SF in 15 minutes and to Millbrae Caltrain (for heading south) in 40. The best price-to-position ratio in the Bay Area for fans who want options in both cities.", best_for:"Budget", url:"https://booking.stay22.com/lagomplan/LWLsKjRLvN" },
  ],

  logistics:{
    transport:[
      { icon:"🚈", title:"From San José — VTA Light Rail (the most direct route)", text:"VTA Light Rail Mountain View–Winchester line → Santa Clara stop → 1 km walk or match-day shuttle to the stadium. From Downtown San José (San José Diridon station): ~20 minutes on Light Rail. Fare: $2.50. This is the most direct Bay Area route to Levi's." },
      { icon:"🚆", title:"From San Francisco — Caltrain express", text:"Caltrain from SF Caltrain Station (4th & King) to Santa Clara Station → VTA Light Rail or shuttle to the stadium. Caltrain runs match-day express service that cuts the trip to 45–50 minutes. Total from downtown SF: about 70 minutes." },
      { icon:"🚊", title:"From Oakland — BART + Caltrain", text:"BART from Oakland to Millbrae Station → Caltrain to Santa Clara → VTA to the stadium. Total: ~75–85 minutes. Alternative: BART to San José Diridon (not all lines) → VTA to the stadium." },
      { icon:"⚠️", title:"Critical error — Uber from SF for a night match", text:"Taking an Uber from San Francisco to the stadium for a night match without calculating the return fare. The outbound trip can run $60–80 USD with traffic. The 23:30 return, with 69,000 people leaving at once, can exceed $120–150 USD at surge pricing with a 40–60 minute wait. If you're based in SF, Caltrain is the only predictable return route. Check the last-train time before you enter the stadium.", isWarning:true },
    ],
    timings:[
      { label:"Downtown San José (VTA)", value:"~20 min" },
      { label:"SJC (San José airport) → Levi's", value:"~15–20 min (shortest in the Bay)" },
      { label:"SF Caltrain Station (express)", value:"~55 min" },
      { label:"SFO → BART to Millbrae + Caltrain", value:"~65 min" },
      { label:"Uber from SF on match day", value:"60–90 min · $70–120 USD" },
    ],
    matchDayCronologia:{
      matchName:"Jun 19 · Türkiye vs. Paraguay · 21:00 PT",
      steps:[
        { time:"H-4:00", text:"Dinner in your base neighborhood before 17:30. Night-match Caltrain expresses have limited seating." },
        { time:"H-2:30", text:"Head to the Caltrain or VTA station. Night matches fill the train." },
        { time:"H-1:30", text:"Arrive at the stadium. Gates open 90 minutes before kickoff. Santa Clara's climate can differ from SF's — bring a layer." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:45", text:"Caltrain back. Check the last train in advance. The 00:15 out of Santa Clara is the cutoff for getting back to SF." },
      ],
    },
    timing:"Levi's is in Santa Clara. The Fan Fest is in SF. The distance between them defines the trip — and the base decision conditions the logistics of every match. If you have multiple, San José eliminates the problem. If you came for one, SF as a destination works.",
    cost:"San Francisco has California's most expensive hotels. San José and Oakland run 30–40% cheaper without giving up transit access. The four night matches (21:00 PT) mean sleeping in SF requires a confirmed Caltrain return plan.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Civic Center Plaza (SF)", type:"Official fan fest", typeColor:CORAL, desc:"The host city's Fan Fest sets up in Civic Center Plaza in front of San Francisco's City Hall — one of California's most photographed gold-domed buildings. Giant screens, cultural programming, and access from any SF neighborhood via BART (Civic Center/UN Plaza station) or on foot from Hayes Valley. For night matches at the stadium, the Fan Fest is the pre-match gathering point before catching the Caltrain south.", tag:"Civic Center" },
    { title:"Thrive City / Chase Center (Mission Bay, SF)", type:"Plaza with screen", typeColor:FJORD, desc:"The outdoor plaza at Chase Center — home of the Golden State Warriors — has permanent screens and already hosted the official watch party for the tournament draw. With capacity for thousands, ferry access from the Embarcadero, and confirmed World Cup programming, it's the open-air space with the most infrastructure in the region.", tag:"Mission Bay" },
    { title:"Oakland City Hall Plaza", type:"Civic plaza", typeColor:SAGE, desc:"The civic plaza in front of Oakland City Hall activates public broadcasts for international sporting events. Oakland's Latin American community — the second largest in the Bay Area — turns their national-team matches into neighborhood gatherings that don't need an official invite.", tag:"Oakland" },
    { title:"San José City Hall Plaza (Downtown SJ)", type:"Civic plaza", typeColor:PINE, desc:"The San José city government has confirmed World Cup programming at City Hall Plaza, three blocks from the Caltrain Diridon station. For the fan based in the South Bay who wants a city atmosphere without commuting to SF.", tag:"South Bay" },
    { title:"Mad Dog in the Fog (Hayes Valley, SF)", type:"English pub", typeColor:"#1A3A5C", desc:"The reference English pub for European football, open since 1993. Broadcasts every tournament match without exception, with screens in every corner and a crowd that has been waking up early to watch the Premier League for thirty years. For Türkiye, Austria, and Paraguay matches, Mad Dog has the most appropriate atmosphere in SF.", tag:"Since 1993" },
    { title:"Kindred (Campbell, South Bay)", type:"Sports bar", typeColor:"#B85C3E", desc:"The highest-rated sports bar in the South Bay for football — screens at every angle, serious pub kitchen, and a crowd that includes San José Earthquakes regulars. For the San José–based fan who doesn't want to travel to SF to watch Paraguay vs. Australia or the Round of 32.", tag:"Campbell" },
  ],

  food:[
    { dish:"Mad Dog in the Fog", where:"Hayes Valley, SF — fish & chips + English pint; European football pub since 1993, unrivaled for curation", price:"$$", type:"Football pub" },
    { dish:"Thrive City Plaza", where:"Mission Bay, SF — food trucks + beer; outdoor screen next to Chase Center, with a bay breeze", price:"$$", type:"Outdoor" },
    { dish:"Kindred (Campbell)", where:"South Bay — gourmet burger + Silicon Valley brews; the highest-rated sports bar in the South Bay", price:"$$", type:"South Bay" },
    { dish:"La Taqueria (Mission)", where:"SF Mission District — the reference burrito; a disciplined line before the Saturday 13 daytime match", price:"$", type:"Ritual" },
    { dish:"Koi Palace / Yank Sing", where:"Dim sum — Koi Palace in Sunset (the locals' spot), Yank Sing at the Embarcadero (the downtown one); both before the rush", price:"$$", type:"Chinese" },
    { dish:"Swan Oyster Depot", where:"Polk Street — West Coast seafood, no reservations, counter only; the best seafood in SF with zero pretension", price:"$$–$$$", type:"Local" },
  ],

  experiences:[
    { title:"Golden Gate + Marin Headlands + Sausalito", duration:"Half to full day", desc:"The Golden Gate needs no introduction, but it does need a plan: cross on foot from the SF side in the morning (no fog before 11am) and continue by bike to Sausalito — a 12 km ride with views of the bay and the city. The return ferry from Sausalito to SF takes 30 minutes and lands at the Ferry Building. Perfect for the off-day between the June 13 and June 16 matches.", type:"Iconic", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See ferry" },
    { title:"Exploratorium + Aquarium + Academy of Sciences", duration:"Full day", desc:"Three top-tier museums: the Exploratorium on the Embarcadero (650 interactive physics and biology exhibits), the Aquarium of the Bay at Pier 39 (sharks, rays, and an acrylic tunnel), and the California Academy of Sciences in Golden Gate Park (a 30-meter planetarium, an indoor rainforest, and the largest reef on display in any museum).", type:"Family", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See tickets" },
    { title:"Napa / Sonoma (day trip)", duration:"Full day", desc:"Napa Valley is 90 km north of SF on Highway 29 — reachable by car in 90 minutes or by organized tour. Sonoma sits 70 km northwest. June and July fall during the growing season — not harvest time, but wineries run tastings and tours without the October crowds.", type:"Wine", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See tours" },
    { title:"Mission District — burritos + murals + bars", duration:"Half day", desc:"The Mission District holds the city's highest concentration of Latin American community, the Balmy Alley and Clarion Alley murals, and the reference taquerías: La Taqueria for the canonical burrito, Tartine Bakery for the bread of the day. By the afternoon, 20th Street has SF's best neighborhood bar scene without losing its identity.", type:"Neighborhood", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See map" },
  ],

  lagomTips:[
    "Levi's Stadium is in Santa Clara — 70 km south of SF. For multiple matches, basing in San José or Santa Clara eliminates the commute.",
    "Four of the five group matches kick off at 21:00 PT. Check the last-Caltrain schedule before entering the stadium.",
    "The June 13 match (Qatar vs. Switzerland) is the only daytime one (12:00 PT). That's the day to treat SF as the destination: burrito at La Taqueria, match, Fan Fest in the afternoon.",
    "SJC is the closest airport to the stadium (~15–20 minutes). If your itinerary is World Cup–centric, fly there instead of SFO.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "Caltrain or VTA ticket confirmed",
    "Last return train written down (especially for a night match)",
    "Light layer — Santa Clara microclimate can run cold or hot",
    "Clear bag required",
    "Uber surge priced as a plan B in your budget",
    "Hotel reservation confirmed for your chosen base (SF / SJ / Oakland)",
    "Hydrate ahead — the open-air stadium heats up in the afternoon",
  ],

  didYouKnow:"Levi's Stadium is the only tournament venue with rooftop solar panels that generate more power than the stadium consumes. On night matches, part of the lighting runs directly on energy stored during the day.",
  closingNote:"San Francisco / Bay Area is the most expensive host city, the most geographically fragmented, and the hardest to solve logistically. It also has the most sophisticated food scene, the most cinematic natural surroundings, and — if the option gets confirmed for some matches — the most scenic ferry ride to a stadium in the tournament from the Embarcadero. Levi's is in Santa Clara. The Fan Fest is in SF. The distance between them defines the trip. LagomPlan tells you which city to stay in depending on how many matches you have, when to catch the Caltrain, and why La Taqueria's burrito earns its line before the Saturday June 13 daytime match.",
  closingSignature:"Lagomplan · Field Guide · San Francisco / Bay Area · World Cup 2026",
  plannerCTA:"Generate my Bay Area trip",

  sectionSubtitles:{
    matches:"6 matches confirmed at Levi's Stadium (Santa Clara). Four of five group matches kick off at 21:00 PT — the Caltrain return is the trip's critical variable.",
    vibe:"Official Fan Fest at Civic Center Plaza (SF), screens at Chase Center and civic plazas, and pubs that have been showing European football for decades.",
    logistics:"Levi's is in Santa Clara, 70 km south of SF. Caltrain and VTA are the traffic-free routes — check the last train before you enter the stadium.",
    food:"The Bay Area has the most sophisticated restaurant scene on the West Coast and California's best-curated football pubs — the challenge is choosing between La Taqueria's burrito and Mad Dog's fish & chips.",
  },
  staysWarning:"Prices are estimates for the World Cup period. San Francisco has California's most expensive hotels; San José and Oakland run 30–40% cheaper without giving up transit access. For night matches, base yourself in Santa Clara or San José if you don't want to depend on the last Caltrain back to SF.",
}
