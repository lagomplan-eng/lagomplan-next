import type { CityGuide } from '../types'

// Color tokens — inlined so the data file is self-contained (no jsx imports).
const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#1A6B5A'

export const es: CityGuide = {
  id:"cdmx",
  city:"Ciudad de México",
  country:"México",
  state:"CDMX",
  flag:"🇲🇽",
  accent: ACCENT,

  tags:["Fútbol","Gastronomía","Historia","Sede inaugural"],

  stadium:{ name:"Estadio Azteca", capacity:"~72,766", area:"Tlalpan — Santa Úrsula Coapa" },

  headline:"El Azteca no necesita presentación. Lo que sí necesita, y mucho, es una estrategia de transporte.",
  description:"El Azteca no necesita presentación. Lo que sí necesita es una estrategia de transporte. Ciudad de México llega al Mundial con cinco partidos — incluyendo el partido inaugural del torneo, el primero en la historia del Azteca. México juega en casa el 11 y el 24 de junio. El estadio que vio la Mano de Dios y el Gol del Siglo escribe su tercer capítulo mundialista.",

  scores:[
    { label:"Ambiente",     value:5 },
    { label:"Fútbol local", value:5 },
    { label:"Gastronomía",  value:5 },
    { label:"Transporte",   value:4 },
    { label:"Seguridad",    value:3 },
    { label:"Costo",        value:3 },
  ],

  matches:[
    { id:"m1", date:"11 Jun", day:"Jue", time:"14:00 CT", teams:[{name:"México",flag:"🇲🇽"},{name:"Sudáfrica",flag:"🇿🇦"}], stadium:"Estadio Azteca", tag:"Partido Inaugural — primer Mundial en el Azteca desde 1986", highlight:true },
    { id:"m2", date:"17 Jun", day:"Mié", time:"21:00 CT", teams:[{name:"Uzbekistán",flag:"🇺🇿"},{name:"Colombia",flag:"🇨🇴"}], stadium:"Estadio Azteca", tag:"Grupo F", highlight:false },
    { id:"m3", date:"24 Jun", day:"Mié", time:"20:00 CT", teams:[{name:"Rep. Checa",flag:"🇨🇿"},{name:"México",flag:"🇲🇽"}], stadium:"Estadio Azteca", tag:"Grupo A — partido definitorio del grupo", highlight:true },
    { id:"m4", date:"30 Jun", day:"Mar", time:"20:00 CT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Estadio Azteca", tag:"Fase eliminatoria", highlight:false },
    { id:"m5", date:"5 Jul",  day:"Dom", time:"19:00 CT", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"Estadio Azteca", tag:"Fase eliminatoria", highlight:false },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",          value:"Mexico City Stadium (Estadio Azteca/Banorte)" },
      { label:"Aforo",                 value:"~72,766 — configuración FIFA" },
      { label:"Techo",                 value:"Abierto — estadio sin techo" },
      { label:"Clima (jun–jul)",       value:"17–24°C · Tardes con lluvia · Altitud: 2,240 msnm — el estadio más alto del torneo" },
      { label:"Partidos",              value:"5 confirmados — incluyendo el partido inaugural y 2 con México" },
      { label:"Aeropuerto principal",  value:"AICM — Benito Juárez International (MEX), nororiente de la ciudad. Metro desde Terminal Aérea (~75 min al estadio via Metro + Tren Ligero)." },
      { label:"Aeropuerto alternativo",value:"AIFA — Felipe Ángeles (ZMO), Santa Lucía, Estado de México — a ~80 km del estadio. Solo si tu vuelo opera desde ahí; llega con dos días de margen." },
      { label:"Visa",                  value:"México no requiere visa para la mayoría de países latinoamericanos ni para muchos países europeos. Verificar en embajada o consulado antes de volar." },
    ],
    body:"La Ciudad de México no llega al Mundial — el Mundial regresa a donde siempre estuvo. El Estadio Azteca albergó la final de 1970 y la de 1986. En 2026 se convierte en el único recinto del planeta con tres ediciones de la Copa del Mundo. El 11 de junio, además, el estadio recibirá el partido inaugural del torneo por primera vez en su historia — 72,000 personas, México en casa, y el sonido más cargado de expectativa de cualquier ciudad del torneo. El estadio conoce el peso. La ciudad también.",
    lagomNote:"CDMX requiere planificación logística real. El tráfico no distingue entre día de partido y día normal — lo que cambia es que 70,000 personas intentan hacer lo mismo que tú, al mismo tiempo. Metro + Tren Ligero es la única ruta que no depende del tráfico. Tarifa total: $10 MXN. Si llegaste a AIFA, necesitas al menos dos días de margen antes del partido.",
  },

  vibe:{
    body:"El país anfitrión juega dos partidos en este estadio. El 11 de junio, el Azteca recibe el partido inaugural del torneo por primera vez en su historia. No hay ciudad en México que vaya a superar eso. Este estadio vio la Mano de Dios y el Gol del Siglo. En 2026 escribe su tercer capítulo mundialista. El peso histórico de la sede es único en el torneo. La ciudad suma la gastronomía con más diversidad de América Latina — más de 150 tipos de chile, 70 formas de preparar el maíz, y una escena que la UNESCO reconoció como Patrimonio Cultural Inmaterial. El costo es el límite: la más cara de las tres sedes mexicanas, y el Mundial la encarece aún más.",
    lagomNote:"El 11 de junio (México vs. Sudáfrica, partido inaugural) y el 24 de junio (Rep. Checa vs. México, definitorio del Grupo A) son las fechas más críticas. Reserva alojamiento con meses de anticipación — el Mundial inaugural en el Azteca desde 1986 no tiene precedente en turismo de la ciudad.",
  },

  stays:[
    { name:"Ignacia Guest House", area:"Roma Norte", price:"$$$", priceCAD:"Precio estimado en periodo mundialista: $200–320 USD/noche", tags:["Boutique","Casona porfiriana","11 habitaciones"], note:"Once habitaciones en una casona porfiriana restaurada. Sin lobby monumental, sin conserje corporativo: diseño serio, jardín interior y una ubicación que pone al huésped a una cuadra de los mejores restaurantes de la ciudad.", best_for:"Hotel boutique", url:"https://hotelscom.stay22.com/lagomplan/-3nIgm0dd7" },
    { name:"Hostel Home", area:"Roma Norte", price:"$", priceCAD:"Precio estimado en periodo mundialista: $25–60 USD/noche según tipo de habitación", tags:["Presupuesto","Habitaciones privadas","Terraza comunitaria"], note:"Una de las pocas opciones de calidad real para viajeros con presupuesto ajustado en CDMX. Camas en dormitorio y habitaciones privadas, terraza comunitaria y conexión de metro a dos cuadras.", best_for:"Presupuesto", url:"" },
    { name:"St. Regis Mexico City", area:"Paseo de la Reforma", price:"$$$$", priceCAD:"Precio estimado en periodo mundialista: $400–700 USD/noche", tags:["Vista a Chapultepec","Metro Insurgentes","Reforma"], note:"Vista directa al Bosque de Chapultepec y a la Columna de la Independencia. Acceso rápido al Metro Insurgentes. Uno de los hoteles con mejor relación posición-servicio de la ciudad.", best_for:"Lujo", url:"https://booking.stay22.com/lagomplan/dDSl_dn7B8" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Ciudad de México — AICM", text:"AICM — Benito Juárez International (MEX) está en el nororiente de la ciudad. Metro desde Terminal Aérea (Línea 5) → Pantitlán → Línea 1 hacia Condesa / Roma Norte. El recorrido completo AICM → Estadio Azteca via Metro + Tren Ligero toma ~75 minutos. Costo total: ~$10 MXN." },
      { icon:"🚇", title:"Del aeropuerto al barrio base", text:"Metro desde Terminal Aérea → Pantitlán → Línea 1 → Insurgentes o Pino Suárez (para Condesa / Roma Norte). El sistema opera con Tarjeta CDMX recargable. Tarifa: $5 MXN por viaje. Uber desde AICM a Roma Norte: ~$150–250 MXN sin tráfico, hasta $500 MXN en hora punta." },
      { icon:"🏟", title:"Al estadio el día del partido — ruta maestra", text:"Metro Línea 1 o 2 → Tasqueña → Tren Ligero → Estadio Azteca. El Tren Ligero opera con derecho de vía propio desde Tasqueña hasta la estación Estadio Azteca en ~15 minutos. Desde Condesa o Roma Norte, el recorrido completo toma entre 45 y 55 minutos. Tarifa total: $10 MXN ($5 Metro + $5 Tren Ligero). Lleva Tarjeta CDMX cargada." },
      { icon:"⚠️", title:"Error crítico — AIFA no es opción", text:"AIFA (Felipe Ángeles, Santa Lucía) está en el Estado de México, a más de 80 kilómetros al norte del Estadio Azteca. Si tu aerolínea opera desde AIFA, llega a CDMX con al menos dos días de margen antes del partido. La conexión al sur de la ciudad en día de partido es un ejercicio de paciencia que no todos sobreviven con buen humor.", isWarning:true },
    ],
    timings:[
      { label:"Desde Condesa en transporte público",           value:"~50 min" },
      { label:"Desde Centro Histórico en Metro",               value:"~30 min" },
      { label:"Desde AICM (Metro + Tren Ligero)",              value:"~75 min" },
      { label:"Uber desde Roma Norte (con tráfico de partido)",value:"40–80 min — precio x2–3" },
    ],
    matchDayCronologia:{
      matchName:"11 Jun · México vs. Sudáfrica · 14:00 CT",
      steps:[
        { time:"H-3:00", text:"Almuerza en el barrio. El Azteca no tiene gastronomía que valga la pena; come bien antes de salir." },
        { time:"H-2:30", text:"Desplázate al Metro. Línea 1 o 2 hacia Tasqueña. Sin prisa, sin correr." },
        { time:"H-1:30", text:"Llegada a Tasqueña. Toma el Tren Ligero — la única ruta que no depende del tráfico de CDMX." },
        { time:"H-1:00", text:"Llegada al estadio. Puertas abiertas. El primer partido inaugural del Azteca en su historia." },
        { time:"H-0:30", text:"Ya en tu asiento. Boleto digital listo en el móvil — sin versión en papel." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:30", text:"Toma el Tren Ligero de regreso inmediatamente. La espera en Tasqueña se multiplica cada 15 minutos que pasan." },
      ],
    },
    timing:"En CDMX, el tráfico no distingue entre día de partido y día normal. Lo que cambia es que 70,000 personas intentan hacer lo mismo que tú, al mismo tiempo. Metro + Tren Ligero es la única ruta que no depende del tráfico. Hay una sola instrucción que importa más que cualquier otra: Tasqueña → Tren Ligero, siempre.",
    cost:"La más cara de las tres sedes mexicanas en año sin Mundial. El torneo confirma lo que el mercado inmobiliario ya había establecido. Reserva con meses de anticipación para las fechas de México.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ @ Zócalo", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest oficial toma la plaza más grande de México con pantallas de gran formato, zonas culturales y una instalación temática sobre el juego de pelota mesoamericano. El cartel de pre-apertura (9 y 10 de junio) incluye a Alejandro Fernández, Carin León y Timbiriche. Nota: no se vende alcohol en el recinto oficial. Metro Línea 2 (Zócalo). Operación prevista del 11 de junio al 19 de julio.", tag:"Sin boleto OK" },
    { title:"Campo Marte (Polanco)", type:"Pantalla exterior", typeColor:FJORD, desc:"El espacio al aire libre frente al Bosque de Chapultepec se transforma en zona de transmisión masiva con pantallas de formato estadio, activaciones en vivo y capacidad para miles de personas. El contexto — entre los Pinos y el Castillo de Chapultepec — no tiene equivalente en ninguna otra sede del torneo.", tag:"Icónico" },
    { title:"Foro Indie Rocks! (Roma Norte)", type:"Recinto cultural", typeColor:SAGE, desc:"Recinto de conciertos que habilita sus pantallas y su espacio exterior para el Mundial. Convoca a una multitud que no necesariamente se define como fanática del fútbol, pero que celebra igual — y en Roma Norte, eso es suficiente para definir la noche.", tag:"Roma Norte" },
    { title:"Estadio Olímpico Universitario (UNAM)", type:"Transmisión universitaria", typeColor:PINE, desc:"La UNAM confirmó transmisiones en el campus universitario para estudiantes y público general. Ver el partido de México en el estadio olímpico donde Pelé jugó en 1968 — aunque sea en pantalla — tiene un peso histórico que el Zócalo no puede replicar.", tag:"Histórico" },
    { title:"La Polar (Azcapotzalco)", type:"Cantina histórica", typeColor:"#5A3A2A", desc:"Cantina histórica de 1938 con ambiente de tribuna y clientela que sabe de fútbol. El menú de botanas sin cargo — chicharrón, cacahuates enchilados, quesadillas — viene incluido con el consumo de cervezas. Las pantallas llevan décadas transmitiendo Liga MX y partidos internacionales. Para el partido de México, La Polar es el estadio alterno de la ciudad.", tag:"Cantina clásica" },
    { title:"Salón Corona (Centro Histórico)", type:"Cantina histórica", typeColor:"#8B2635", desc:"Desde 1928, esta cantina del centro transmite todo lo que se puede transmitir. Pantallas en cada rincón, cerveza de barril, botanas sin cargo y acceso al Metro Zócalo para llegar al Fan Fest sin rodeos. La clientela mezcla oficinistas del centro con turistas que acaban de descubrir que existe una cantina mejor que cualquier cosa en su país.", tag:"Centro Histórico" },
    { title:"El Paisa (Condesa)", type:"Bar de barrio", typeColor:"#2D6B4A", desc:"Bar de barrio con terrazas exteriores y pantallas orientadas a la calle. En días de partido de México o de la UEFA, la terraza se convierte en el punto de reunión del vecindario de Condesa. Comida de pub mexicano honesta, precios más bajos que el promedio del barrio y una actitud que no intenta ser otra cosa de lo que es.", tag:"Condesa" },
  ],

  food:[
    { dish:"La Polar",                   where:"Azcapotzalco — cerveza de barril + botanas sin cargo; cantina de 1938, el estadio alterno de la ciudad en días de México",     price:"$",  type:"Pre-partido" },
    { dish:"Salón Corona",               where:"Centro Histórico — tostadas de pata + lo que haya de barril; desde 1928, pantalla siempre encendida",                          price:"$",  type:"Cantina clásica" },
    { dish:"El Paisa",                   where:"Condesa — tacos de canasta + michelada; terraza a la calle, precios honestos",                                                 price:"$",  type:"De barrio" },
    { dish:"Mercado de Coyoacán",        where:"Coyoacán — antojitos del mercado; el almuerzo más auténtico antes de una tarde en el barrio bohemio",                          price:"$",  type:"Mercado" },
    { dish:"Taquería El Califa de León", where:"San Rafael — el taco de bistec que ganó una estrella Michelin en 2024; cuatro opciones, sin exceso de carta",                 price:"$",  type:"Imperdible" },
    { dish:"Restaurantes de Roma Norte", where:"Roma Norte — gastronomía de autor con identidad; el barrio con mejor concentración de cocina de calidad de la ciudad",         price:"$$", type:"Autor" },
  ],

  experiences:[
    { title:"Teotihuacán + Museo Nacional de Antropología", duration:"Día completo", desc:"La zona arqueológica de Teotihuacán está a 50 kilómetros al noreste y se puede llegar en camión desde la Terminal del Norte en menos de una hora. Recomendación: llegada antes de las 9am para evitar el calor y los grupos de tour. Para la tarde, el Museo Nacional de Antropología en Chapultepec tiene la colección arqueológica prehispánica más completa del continente — la Sala Mexica justifica la visita por sí sola.", type:"Histórico", affiliateLink:"AFFILIATE_LINK_CDMX_TEOTIHUACAN", affiliateLabel:"Ver tours a Teotihuacán" },
    { title:"Xochimilco + Coyoacán", duration:"Día completo", desc:"Trajinera por la mañana, Mercado de Coyoacán al mediodía, Museo Frida Kahlo por la tarde (reserva en línea con anticipación — el acceso en puerta siempre está agotado). El Tren Ligero conecta Coyoacán con la ciudad central, lo que hace de este plan el día libre más lógico para quien también tiene partido en el Azteca.", type:"Cultural", affiliateLink:"AFFILIATE_LINK_CDMX_XOCHIMILCO", affiliateLabel:"Reservar trajinera en Xochimilco" },
    { title:"Mercado de Jamaica + La Merced", duration:"Medio día", desc:"El Mercado de Jamaica es el mayoreo de flores más grande de México — llega al amanecer. La Merced es el corazón comercial del oriente de la ciudad: bulliciosa, fotogénica y poco visitada por el fan internacional. Ninguno de los dos está en el itinerario estándar. Por eso merecen estar aquí.", type:"Local", affiliateLink:"AFFILIATE_LINK_CDMX_MERCADOS", affiliateLabel:"Tour de mercados en CDMX" },
    { title:"Bosque de Chapultepec", duration:"Mañana o tarde", desc:"El parque urbano más grande de América Latina rodea el Castillo de Chapultepec en más de 680 hectáreas. El lago, los museos del perímetro — Rufino Tamayo, Arte Moderno, Historia Natural — y la vista del Castillo desde la segunda sección hacen de Chapultepec el respiro necesario entre partidos. Entrada libre los domingos.", type:"Ciudad", affiliateLink:"AFFILIATE_LINK_CDMX_CHAPULTEPEC", affiliateLabel:"Tour cultural en Chapultepec" },
  ],

  lagomTips:[
    "El 11 de junio (México vs. Sudáfrica, partido inaugural) y el 24 de junio (Rep. Checa vs. México, definitorio del Grupo A) son las fechas más críticas. Reserva alojamiento con meses de anticipación — el Mundial inaugural en el Azteca desde 1986 no tiene precedente en turismo de la ciudad.",
    "La ruta correcta al estadio es Metro + Tren Ligero, siempre. El tráfico de CDMX no distingue entre día de partido y día laboral — la diferencia es que 70,000 personas intentan hacer lo mismo que tú, al mismo tiempo. Línea 1 o 2 → Tasqueña → Tren Ligero.",
    "Si tu vuelo llega a AIFA (Felipe Ángeles, Santa Lucía), llegas a 80 km al norte del Azteca con conectividad limitada al sur. Si tienes opción, vuela siempre a AICM (Benito Juárez, MEX). Si no hay opción, llega con dos días de margen antes del partido.",
    "CDMX tiene más de 150 tipos de chile y 70 formas de preparar el maíz. La cocina mexicana es Patrimonio Cultural Inmaterial de la Humanidad. El reto no es encontrar dónde comer bien — es aceptar que una semana no alcanza.",
  ],

  matchDayChecklist:[
    "Boleto digital del partido — app FIFA (sin versión en papel)",
    "Tarjeta CDMX cargada para Metro + Tren Ligero ($10 MXN total)",
    "Ruta: Metro Línea 1 o 2 → Tasqueña → Tren Ligero → Estadio Azteca",
    "Almuerza antes de salir — sin gastronomía de calidad en el estadio",
    "Llegada al estadio 90 min antes — puertas abren H-1:30",
    "Documentación válida para ingresar a México si aplica",
    "Reserva de hotel confirmada para 11 jun y 24 jun",
    "Efectivo MXN para transporte y botanas en cantinas",
  ],

  didYouKnow:"El Estadio Azteca es el único recinto del mundo que ha albergado dos finales de Copa del Mundo (1970 y 1986) y en 2026 se convierte en el primero en recibir tres ediciones del torneo. Además, el 11 de junio de 2026 recibirá el partido inaugural del torneo por primera vez en sus 60 años de historia.",
  closingNote:"La Ciudad de México no es la sede más fácil del torneo. Es la más densa, la más ruidosa, la más contradictoria — y, para El Tri, la más cargada de expectativa. El Azteca lleva 60 años viendo al mundo venir a jugar aquí. El 11 de junio de 2026, lo hace de nuevo. LagomPlan no te da el boleto ni la emoción. Te da la ruta para que cuando el estadio explote en gol, tú ya estés dentro.",
  closingSignature:"Lagomplan · Guía de campo · Ciudad de México · Mundial 2026",
  plannerCTA:"Generar mi viaje a CDMX",
}

export const en: CityGuide = {
  id:"cdmx",
  city:"Mexico City",
  country:"Mexico",
  state:"CDMX",
  flag:"🇲🇽",
  accent: ACCENT,

  tags:["Football","Food","History","Opening match"],

  stadium:{ name:"Estadio Azteca", capacity:"~72,766", area:"Tlalpan — Santa Úrsula Coapa" },

  headline:"The Azteca needs no introduction. What it does need — badly — is a transit plan.",
  description:"The Azteca needs no introduction. What it needs is a transit plan. Mexico City arrives at the World Cup with five matches — including the tournament's opening match, the Azteca's first ever. Mexico plays at home on June 11 and June 24. The stadium that saw the Hand of God and the Goal of the Century writes its third World Cup chapter.",

  scores:[
    { label:"Atmosphere",  value:5 },
    { label:"Football",    value:5 },
    { label:"Food",        value:5 },
    { label:"Transit",     value:4 },
    { label:"Safety",      value:3 },
    { label:"Cost",        value:3 },
  ],

  matches:[
    { id:"m1", date:"Jun 11", day:"Thu", time:"14:00 CT", teams:[{name:"Mexico",flag:"🇲🇽"},{name:"South Africa",flag:"🇿🇦"}], stadium:"Estadio Azteca", tag:"Opening Match — first World Cup at the Azteca since 1986", highlight:true },
    { id:"m2", date:"Jun 17", day:"Wed", time:"21:00 CT", teams:[{name:"Uzbekistan",flag:"🇺🇿"},{name:"Colombia",flag:"🇨🇴"}], stadium:"Estadio Azteca", tag:"Group F", highlight:false },
    { id:"m3", date:"Jun 24", day:"Wed", time:"20:00 CT", teams:[{name:"Czech Rep.",flag:"🇨🇿"},{name:"Mexico",flag:"🇲🇽"}], stadium:"Estadio Azteca", tag:"Group A — decisive group match", highlight:true },
    { id:"m4", date:"Jun 30", day:"Tue", time:"20:00 CT", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"Estadio Azteca", tag:"Knockout stage", highlight:false },
    { id:"m5", date:"Jul 5",  day:"Sun", time:"19:00 CT", teams:[{name:"Round of 16",flag:""},{name:"TBD",flag:""}], stadium:"Estadio Azteca", tag:"Knockout stage", highlight:false },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",        value:"Mexico City Stadium (Estadio Azteca/Banorte)" },
      { label:"Capacity",            value:"~72,766 — FIFA configuration" },
      { label:"Roof",                value:"Open — no roof" },
      { label:"Weather (Jun–Jul)",   value:"17–24°C · Afternoon rain · Altitude: 2,240 m — the highest stadium in the tournament" },
      { label:"Matches",             value:"5 confirmed — including the opening match and 2 Mexico games" },
      { label:"Primary airport",     value:"AICM — Benito Juárez International (MEX), northeast of the city. Metro from Terminal Aérea (~75 min to the stadium via Metro + Light Rail)." },
      { label:"Alternate airport",   value:"AIFA — Felipe Ángeles (ZMO), Santa Lucía, State of Mexico — ~80 km from the stadium. Only if your flight operates there; arrive with two days of margin." },
      { label:"Visa",                value:"Mexico requires no visa for most Latin American countries or many European ones. Check your embassy or consulate before flying." },
    ],
    body:"Mexico City doesn't travel to the World Cup — the World Cup returns to where it's always been. The Estadio Azteca hosted the 1970 and 1986 finals. In 2026 it becomes the only venue on the planet with three editions of the World Cup. On June 11 it also hosts the tournament's opening match for the first time in its history — 72,000 people, Mexico at home, and the most charged atmosphere of any city in the tournament. The stadium knows the weight. The city does too.",
    lagomNote:"CDMX demands real logistical planning. Traffic doesn't care whether it's a match day or a weekday — what changes is that 70,000 people are trying to do the same thing you are, at the same time. Metro + Light Rail is the only route that doesn't depend on traffic. Total fare: $10 MXN. If you flew into AIFA, you need at least two days of buffer before the match.",
  },

  vibe:{
    body:"The host nation plays twice here. On June 11, the Azteca hosts the opening match for the first time in its history. No other Mexican city is going to top that. This stadium saw the Hand of God and the Goal of the Century. In 2026 it writes its third World Cup chapter. The historical weight is unique in the tournament. The city adds the most diverse food scene in Latin America — more than 150 chile varieties, 70 ways to prepare corn, and a culinary tradition that UNESCO recognized as Intangible Cultural Heritage. Cost is the ceiling: the priciest of Mexico's three host cities, and the World Cup pushes it further.",
    lagomNote:"June 11 (Mexico vs. South Africa, opening match) and June 24 (Czech Rep. vs. Mexico, Group A decider) are the critical dates. Book accommodation months ahead — an opening World Cup match at the Azteca since 1986 has no precedent in the city's tourism history.",
  },

  stays:[
    { name:"Ignacia Guest House", area:"Roma Norte", price:"$$$", priceCAD:"World Cup rates: $200–320 USD/night", tags:["Boutique","Porfirian mansion","11 rooms"], note:"Eleven rooms in a restored Porfirian mansion. No monumental lobby, no corporate concierge — just considered design, an interior garden, and an address that puts you a block from the city's best restaurants.", best_for:"Boutique", url:"https://hotelscom.stay22.com/lagomplan/-3nIgm0dd7" },
    { name:"Hostel Home", area:"Roma Norte", price:"$", priceCAD:"World Cup rates: $25–60 USD/night by room type", tags:["Budget","Private rooms","Rooftop terrace"], note:"One of the few genuinely good options in CDMX for budget travelers. Dorm beds and private rooms, a shared rooftop, and a Metro station two blocks away.", best_for:"Budget", url:"" },
    { name:"St. Regis Mexico City", area:"Paseo de la Reforma", price:"$$$$", priceCAD:"World Cup rates: $400–700 USD/night", tags:["Chapultepec view","Metro Insurgentes","Reforma"], note:"Direct views of Chapultepec Park and the Angel of Independence. Fast access to Metro Insurgentes. One of the city's best position-to-service ratios.", best_for:"Luxury", url:"https://booking.stay22.com/lagomplan/dDSl_dn7B8" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Mexico City — AICM", text:"AICM — Benito Juárez International (MEX) sits northeast of the city. Take the Metro from Terminal Aérea (Line 5) → Pantitlán → Line 1 toward Condesa / Roma Norte. The full AICM → Estadio Azteca trip via Metro + Light Rail runs ~75 minutes. Total cost: ~$10 MXN." },
      { icon:"🚇", title:"Airport to base neighborhood", text:"Metro from Terminal Aérea → Pantitlán → Line 1 → Insurgentes or Pino Suárez (for Condesa / Roma Norte). The system runs on a rechargeable Tarjeta CDMX. Fare: $5 MXN per ride. Uber AICM to Roma Norte: ~$150–250 MXN without traffic, up to $500 MXN at rush hour." },
      { icon:"🏟", title:"To the stadium on match day — master route", text:"Metro Line 1 or 2 → Tasqueña → Light Rail → Estadio Azteca. The Light Rail runs in its own right-of-way from Tasqueña to the Estadio Azteca stop in ~15 minutes. From Condesa or Roma Norte, the full trip is 45–55 minutes. Total fare: $10 MXN ($5 Metro + $5 Light Rail). Carry a loaded Tarjeta CDMX." },
      { icon:"⚠️", title:"Critical error — AIFA is not an option", text:"AIFA (Felipe Ángeles, Santa Lucía) sits in the State of Mexico, more than 80 km north of the Estadio Azteca. If your airline flies into AIFA, arrive in CDMX with at least two days of buffer before the match. Getting to the south of the city on match day is a patience exercise not everyone survives in good humor.", isWarning:true },
    ],
    timings:[
      { label:"From Condesa via public transit",            value:"~50 min" },
      { label:"From Centro Histórico via Metro",            value:"~30 min" },
      { label:"From AICM (Metro + Light Rail)",             value:"~75 min" },
      { label:"Uber from Roma Norte (match-day traffic)",   value:"40–80 min — fare 2–3x" },
    ],
    matchDayCronologia:{
      matchName:"Jun 11 · Mexico vs. South Africa · 14:00 CT",
      steps:[
        { time:"H-3:00", text:"Eat in your neighborhood. The Azteca has no food worth the detour; eat well before you leave." },
        { time:"H-2:30", text:"Head to the Metro. Line 1 or 2 toward Tasqueña. No rush, no running." },
        { time:"H-1:30", text:"Arrive at Tasqueña. Board the Light Rail — the only route that doesn't depend on CDMX traffic." },
        { time:"H-1:00", text:"At the stadium. Gates open. The Azteca's first-ever opening match in its history." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready on your phone — no paper version." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:30", text:"Take the Light Rail back immediately. The Tasqueña wait multiplies every 15 minutes you delay." },
      ],
    },
    timing:"In CDMX, traffic doesn't distinguish between match day and any other day. What changes is that 70,000 people are trying to do the same thing you are, at the same time. Metro + Light Rail is the only route independent of traffic. One instruction matters more than any other: Tasqueña → Light Rail, always.",
    cost:"The priciest of Mexico's three host cities in a non–World Cup year. The tournament just confirms what the real estate market already established. Book months ahead for Mexico's match dates.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ @ Zócalo", type:"Official fan fest", typeColor:CORAL, desc:"The official Fan Fest takes over Mexico's largest plaza with big-format screens, cultural zones, and an installation on the Mesoamerican ballgame. The pre-opening lineup (June 9–10) includes Alejandro Fernández, Carin León, and Timbiriche. Note: no alcohol is sold inside the official site. Metro Line 2 (Zócalo). Operating June 11 – July 19.", tag:"No ticket needed" },
    { title:"Campo Marte (Polanco)", type:"Outdoor screen", typeColor:FJORD, desc:"The open space in front of Chapultepec Park turns into a mass-viewing zone with stadium-format screens, live activations, and capacity for thousands. The setting — between Los Pinos and Chapultepec Castle — has no equivalent at any other host city.", tag:"Iconic" },
    { title:"Foro Indie Rocks! (Roma Norte)", type:"Cultural venue", typeColor:SAGE, desc:"A concert venue that activates its screens and outdoor space for the World Cup. It draws a crowd that doesn't necessarily identify as football fans but celebrates anyway — and in Roma Norte, that's enough to define the night.", tag:"Roma Norte" },
    { title:"Estadio Olímpico Universitario (UNAM)", type:"University screening", typeColor:PINE, desc:"UNAM confirmed campus screenings for students and the general public. Watching Mexico's match in the Olympic stadium where Pelé played in 1968 — even on screen — carries a historical weight the Zócalo can't replicate.", tag:"Historic" },
    { title:"La Polar (Azcapotzalco)", type:"Historic cantina", typeColor:"#5A3A2A", desc:"A historic cantina from 1938 with the atmosphere of a tribune and a crowd that knows football. The free botana menu — chicharrón, spiced peanuts, quesadillas — comes with your beers. The screens have broadcast Liga MX and international matches for decades. On Mexico match days, La Polar is the city's second stadium.", tag:"Classic cantina" },
    { title:"Salón Corona (Centro Histórico)", type:"Historic cantina", typeColor:"#8B2635", desc:"Since 1928, this downtown cantina has broadcast everything broadcastable. Screens in every corner, draft beer, free botanas, and direct Metro Zócalo access to the Fan Fest. The crowd mixes downtown office workers with tourists who just realized a better cantina exists than anything back home.", tag:"Centro Histórico" },
    { title:"El Paisa (Condesa)", type:"Neighborhood bar", typeColor:"#2D6B4A", desc:"A neighborhood bar with street-facing terraces and screens angled toward the sidewalk. On Mexico or UEFA match days, the terrace becomes the Condesa neighborhood's meeting point. Honest Mexican pub food, prices below the neighborhood average, and an attitude that doesn't try to be anything other than what it is.", tag:"Condesa" },
  ],

  food:[
    { dish:"La Polar",                   where:"Azcapotzalco — draft beer + free botanas; a 1938 cantina, the city's second stadium on Mexico match days", price:"$",  type:"Pre-match" },
    { dish:"Salón Corona",               where:"Centro Histórico — tostadas de pata + whatever's on tap; since 1928, screens always on",                    price:"$",  type:"Classic cantina" },
    { dish:"El Paisa",                   where:"Condesa — tacos de canasta + michelada; street-side terrace, honest prices",                                price:"$",  type:"Neighborhood" },
    { dish:"Mercado de Coyoacán",        where:"Coyoacán — market snacks; the most authentic lunch before an afternoon in the bohemian neighborhood",        price:"$",  type:"Market" },
    { dish:"Taquería El Califa de León", where:"San Rafael — the bistec taco that earned a Michelin star in 2024; four options, no bloated menu",           price:"$",  type:"Must try" },
    { dish:"Roma Norte restaurants",     where:"Roma Norte — chef-driven food with identity; the neighborhood with the city's best concentration of quality", price:"$$", type:"Chef-driven" },
  ],

  experiences:[
    { title:"Teotihuacán + National Museum of Anthropology", duration:"Full day", desc:"The Teotihuacán archaeological zone is 50 km northeast and reachable by bus from the Terminal del Norte in under an hour. Recommendation: arrive before 9am to skip the heat and tour groups. For the afternoon, the National Museum of Anthropology in Chapultepec holds the most complete pre-Hispanic archaeological collection on the continent — the Mexica Hall alone justifies the visit.", type:"Historic", affiliateLink:"AFFILIATE_LINK_CDMX_TEOTIHUACAN", affiliateLabel:"See Teotihuacán tours" },
    { title:"Xochimilco + Coyoacán", duration:"Full day", desc:"Trajinera boat in the morning, Mercado de Coyoacán at midday, Frida Kahlo Museum in the afternoon (book online ahead — door access is always sold out). The Light Rail connects Coyoacán with central CDMX, which makes this the most logical off-day for anyone who also has a match at the Azteca.", type:"Cultural", affiliateLink:"AFFILIATE_LINK_CDMX_XOCHIMILCO", affiliateLabel:"Book Xochimilco boat" },
    { title:"Mercado de Jamaica + La Merced", duration:"Half day", desc:"Mercado de Jamaica is Mexico's largest wholesale flower market — arrive at dawn. La Merced is the commercial heart of the city's east side: loud, photogenic, rarely visited by international fans. Neither is on the standard itinerary. That's exactly why they're here.", type:"Local", affiliateLink:"AFFILIATE_LINK_CDMX_MERCADOS", affiliateLabel:"CDMX market tours" },
    { title:"Bosque de Chapultepec", duration:"Morning or afternoon", desc:"Latin America's largest urban park wraps Chapultepec Castle across more than 680 hectares. The lake, the perimeter museums — Rufino Tamayo, Modern Art, Natural History — and the view of the Castle from the second section make Chapultepec the necessary breath between matches. Free on Sundays.", type:"City", affiliateLink:"AFFILIATE_LINK_CDMX_CHAPULTEPEC", affiliateLabel:"Chapultepec cultural tours" },
  ],

  lagomTips:[
    "June 11 (Mexico vs. South Africa, opening match) and June 24 (Czech Rep. vs. Mexico, Group A decider) are the critical dates. Book accommodation months ahead — an opening World Cup match at the Azteca since 1986 has no precedent in the city's tourism history.",
    "The correct route to the stadium is Metro + Light Rail, always. CDMX traffic doesn't distinguish between a match day and a weekday — the difference is that 70,000 people are trying to do the same thing you are. Line 1 or 2 → Tasqueña → Light Rail.",
    "If your flight lands at AIFA (Felipe Ángeles, Santa Lucía), you're 80 km north of the Azteca with limited connectivity south. If you have the choice, always fly into AICM (Benito Juárez, MEX). If not, arrive with two days of buffer before the match.",
    "CDMX has more than 150 varieties of chile and 70 ways to prepare corn. Mexican cuisine is UNESCO Intangible Cultural Heritage. The challenge isn't finding where to eat well — it's accepting that a week isn't enough.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app (no paper version)",
    "Tarjeta CDMX loaded for Metro + Light Rail ($10 MXN total)",
    "Route: Metro Line 1 or 2 → Tasqueña → Light Rail → Estadio Azteca",
    "Eat before leaving — no quality food at the stadium",
    "Arrive at the stadium 90 min ahead — gates open at H-1:30",
    "Valid documentation for entry to Mexico if applicable",
    "Hotel reservation confirmed for Jun 11 and Jun 24",
    "MXN cash for transit and cantina botanas",
  ],

  didYouKnow:"The Estadio Azteca is the only venue in the world to have hosted two World Cup finals (1970 and 1986), and in 2026 it becomes the first to host three editions of the tournament. It will also receive the opening match for the first time in its 60-year history on June 11, 2026.",
  closingNote:"Mexico City isn't the tournament's easiest venue. It's the densest, the loudest, the most contradictory — and for El Tri, the one carrying the most expectation. The Azteca has spent 60 years watching the world come here to play. On June 11, 2026, it happens again. LagomPlan doesn't hand you the ticket or the emotion. It hands you the route, so that when the stadium erupts in a goal, you're already inside.",
  closingSignature:"Lagomplan · Field Guide · Mexico City · World Cup 2026",
  plannerCTA:"Generate my CDMX trip",
}
