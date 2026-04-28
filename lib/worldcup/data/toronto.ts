import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#C41E3A'

export const es: CityGuide = {
  id:"tor",
  city:"Toronto",
  country:"Canadá",
  state:"Ontario",
  flag:"🇨🇦",
  accent: ACCENT,

  tags:["Primer Mundial 🇨🇦","Multicultural","Sede co-anfitriona"],

  stadium:{ name:"Toronto Stadium (BMO Field)", capacity:"~45,736", area:"Exhibition Place — a 4 km del CN Tower" },

  headline:"El estadio más pequeño del torneo también es el que pone al fanático más cerca del campo. No es una coincidencia.",
  description:"Toronto llega al Mundial con 6 partidos y un primer capítulo histórico: el 12 de junio de 2026, Canadá vs. Bosnia es el primer partido mundialista masculino en suelo canadiense. BMO Field es el estadio más pequeño del torneo (~45,736), con la logística de tránsito público más eficiente de las 16 sedes: el GO Train desde Union Station llega en cinco minutos.",

  scores:[
    { label:"Ambiente",     value:5 },
    { label:"Fútbol local", value:4 },
    { label:"Gastronomía",  value:5 },
    { label:"Transporte",   value:5 },
    { label:"Seguridad",    value:5 },
    { label:"Costo",        value:2 },
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
      { label:"Estadio FIFA",   value:"Toronto Stadium (BMO Field)" },
      { label:"Aforo",          value:"~45,736 — configuración FIFA (expandido con 17,756 asientos temporales; el estadio más pequeño del torneo)" },
      { label:"Clima (jun–jul)",value:"Días: 18–26°C · Noches: 13–18°C · Posibilidad de lluvia; estadio al aire libre sin techo" },
      { label:"Partidos",       value:"6 confirmados — 5 grupos + Ronda de 32" },
      { label:"Ubicación",      value:"Exhibition Place — a 4 km del CN Tower. GO Train directo desde Union Station en 5 minutos." },
      { label:"Aeropuerto",     value:"YYZ — Toronto Pearson International (~23 km del estadio). UP Express a Union Station en 25 min." },
      { label:"Visa",           value:"Canadá requiere eTA (Electronic Travel Authorization) para muchos países — trámite en línea en canada.ca antes de volar." },
    ],
    body:"El 12 de junio de 2026 es un hecho sin precedente en la historia del deporte canadiense: el primer partido mundialista masculino en suelo de Canadá. Toronto ya vibra con eso meses antes de que empiece. BMO Field es el estadio más pequeño del torneo (~45,736 asientos), expandido con estructuras temporales — también es el que pone a cada fanático más cerca del campo. La logística es la ventaja: GO Train desde Union Station → Exhibition Station en cinco minutos. No hay equivalente más eficiente en las otras 15 ciudades anfitrionas.",
    lagomNote:"El 12 de junio (Canadá vs. Bosnia) es el partido de mayor demanda histórica de la sede. Los hoteles del centro desaparecen meses antes. Evalúa Airbnb en Roncesvalles, Leslieville o el East End — barrios bien conectados por TTC con precios más razonables.",
  },

  vibe:{
    body:"Toronto FC lleva dos décadas construyendo una base de fanáticos de MLS que hoy tiene criterio y volumen. Más del 50% de los residentes de Toronto nacieron fuera de Canadá — lo que significa que cada equipo visitante tiene una tribuna local propia. Una de las ciudades más diversas del mundo en términos culinarios: sin cocina local dominante, con todo lo demás representado: dim sum en Spadina, roti en Kensington, pho en Broadview, pizza napolitana en el centro.",
    lagomNote:"El 12 de junio es el partido más cargado de expectativa de la sede — y posiblemente del torneo para la afición canadiense. Si viajas ese día, reserva todo con meses de anticipación y llega a la ciudad con un día de margen para absorber el ambiente.",
  },

  stayNeighborhoods:{
    intro:"Toronto no es una ciudad difícil de orientar. El estadio está en Exhibition Place, al suroeste del centro — una ubicación que combina bien con los barrios más interesantes de la ciudad sin estar lejos de nada.",
    items:[
      { kind:"recommended", title:"Base recomendada: King West / Queen West", body:"El corredor de King Street West combina hoteles boutique, restaurantes serios y bares con pantalla sin llegar a ser turístico en exceso. Desde aquí, el GO Train a Exhibition Station tarda cinco minutos desde Union Station (que está a 10 minutos en streetcar por King). Es la zona con mejor relación calidad-logística-ambiente de la ciudad para el fan del Mundial." },
      { kind:"alternative", title:"Opción con carácter: Distillery District", body:"Complejo de arquitectura victoriana restaurada con galerías, bares artesanales y restaurantes de calidad. Más tranquilo que King West, igual de bien conectado. A quince minutos del estadio en GO Train. Para el viajero que quiere ambiente de barrio histórico entre partidos." },
      { kind:"alternative", title:"Presupuesto con criterio: Kensington Market / Little Portugal", body:"Al oeste del downtown, Kensington Market es el barrio más ecléctico de la ciudad: tiendas vintage, restaurantes económicos de casi todas las cocinas del mundo y una energía de barrio que no se fabrica. Más alejado del estadio, pero servido por streetcar y accesible por TTC. Para quien prioriza precio sobre tiempo de traslado." },
      { kind:"avoid", title:"Evitar como base: Midtown / North York", body:"Cómodo para otras cosas, pero logísticamente alejado de Exhibition Place y sin la densidad de opciones gastronómicas y culturales de los barrios del sur. En días de partido con El Tri o Canadá, el TTC desde Midtown puede ser una trampa de tiempo." },
    ],
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
      { label:"Union Station en GO Train",                   value:"~5 min" },
      { label:"Union Station en streetcar 509/511",          value:"~20 min" },
      { label:"YYZ en UP Express + GO Train",                value:"~35 min total" },
      { label:"Uber desde King West (normal / partido)",     value:"10–20 min · impredecible" },
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
    { title:"FIFA Fan Festival™ — Fort York National Historic Site", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest se instala en Fort York, el sitio histórico donde en 1813 se libró la Batalla de York. A diez minutos caminando de BMO Field, es el punto de reunión oficial con pantallas gigantes, activaciones culturales y comida local. Para el fan sin boleto que quiere el ambiente del partido sin estar dentro, es la opción más lógica de Toronto — y con el contexto histórico más interesante de cualquier Fan Fest del torneo.", tag:"Fort York" },
    { title:"Harbourfront Centre (Queens Quay)", type:"Centro cultural", typeColor:FJORD, desc:"El complejo cultural a orillas del lago Ontario tiene terrazas al aire libre y un anfiteatro exterior que en verano opera como punto de reunión de la ciudad. Para los partidos de Canadá, la vista al lago y al skyline desde el Harbourfront convierte la experiencia en algo que no cabe en un bar.", tag:"Lake Ontario" },
    { title:"Yonge-Dundas Square", type:"Plaza masiva", typeColor:SAGE, desc:"La Times Square de Toronto — pantallas digitales permanentes, espacio peatonal y acceso desde el subway desde todos los puntos de la ciudad. Ruidosa, masiva y sin necesidad de instalación adicional. Para el partido del 12 de junio (Canadá vs. Bosnia), la plaza va a ser el segundo estadio de la ciudad.", tag:"Downtown" },
    { title:"Distillery District (Corktown)", type:"Barrio histórico", typeColor:PINE, desc:"El complejo de arquitectura victoriana restaurada tiene patios al aire libre que durante el torneo instalan pantallas exteriores. Ambiente de barrio europeo con fanáticos internacionales — el punto más fotogénico de Toronto para ver un partido sin entrar en un bar.", tag:"Victorian" },
    { title:"Real Sports Bar & Grill", type:"Sports bar monumental", typeColor:"#C41E3A", desc:"El bar de deportes más grande de Canadá, con pantallas de formato monumental y capacidad para miles de personas. La experiencia en partidos de Canadá es de las más intensas de la ciudad. Reserva mesa con días de anticipación para el 12 de junio. La comida es de pub americano elevado.", tag:"Canadá HQ" },
    { title:"Fionn MacCool's (múltiples sedes)", type:"Pub irlandés", typeColor:"#2D6B47", desc:"La cadena de pubs irlandeses más confiable de Toronto para ver partidos. Pantallas en cada rincón, ambiente de barra de estadio en días de partido grande y menú de pub sólido. Para el partido de Canadá, cualquiera de sus sedes del downtown se llena dos horas antes del pitido.", tag:"Pub fiable" },
  ],

  food:[
    { dish:"Real Sports Bar & Grill", where:"Air Canada Centre — hamburguesa + cervezas artesanales de Ontario; el bar más grande de Canadá, formato monumental para el partido del 12 Jun", price:"$$",  type:"Sports bar" },
    { dish:"Fionn MacCool's",          where:"Múltiples sedes downtown — fish & chips + Guinness; pub irlandés confiable, cualquier sede se llena dos horas antes de Canadá",             price:"$$",  type:"Pub irlandés" },
    { dish:"Bar Raval",                where:"Little Italy — pintxos vascos + txakoli; coctelería seria, comida a la altura, para partidos con menos densidad de afición",                price:"$$$", type:"Gastro-bar" },
    { dish:"Dim sum en Spadina",       where:"Chinatown — Pearl Harbourfront o Dim Sum King; una de las mejores comunidades chinas de Norteamérica",                                      price:"$–$$",type:"Barrio" },
    { dish:"Roti en Kensington",       where:"Kensington Market — Patty King o Bacchus Roti Shop; la diáspora caribeña de Toronto cocina roti como nadie fuera de Trinidad",              price:"$",   type:"Caribe" },
    { dish:"Pho en Broadview",         where:"East Chinatown — Pho Hung o Pho 88; la mayor concentración de restaurantes vietnamitas de la ciudad",                                        price:"$",   type:"Vietnamita" },
  ],

  experiences:[
    { title:"ROM + Queen West + Barrio de las Artes", duration:"Medio día a día completo", desc:"El Royal Ontario Museum (ROM) en Bloor Street tiene una de las colecciones arqueológicas y de historia natural más importantes de Norteamérica, con secciones dedicadas a culturas mesoamericanas y africanas relevantes para un torneo con 48 naciones. Para la tarde, Queen West al oeste de Bathurst tiene galerías independientes, librerías de segunda mano y cafeterías que llevan décadas sin intentar ser trendy.", type:"Cultural", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver ROM" },
    { title:"Toronto Islands (ferry desde el centro)", duration:"Día completo", desc:"A 13 minutos en ferry desde los muelles frente al CN Tower (Ferry Terminal, $9 CAD ida y vuelta), las islas ofrecen playas, senderos, alquiler de kayaks y la mejor vista al skyline de Toronto desde el agua. En un día de junio sin partido, no hay mejor plan en la ciudad. El ferry opera desde las 6:30am; en días de partido hay servicio extra.", type:"Agua", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver ferry" },
    { title:"Kensington Market + Little Italy", duration:"Medio día", desc:"Kensington Market un sábado por la mañana es uno de los mejores mercados callejeros de Norteamérica: ropa vintage, quesos artesanales, frutas exóticas y cafeterías que no sirven café de cadena. Little Italy en College Street está a diez minutos caminando: terrazas, pastelerías italianas y restaurantes que llevan décadas en pie. Plan completo en menos de 3 kilómetros.", type:"Barrio", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver mapa" },
    { title:"CN Tower + Ripley's Aquarium", duration:"Medio día", desc:"El CN Tower a 553 metros fue el edificio más alto del mundo durante 34 años. EdgeWalk, el paseo al borde de la plataforma abierta a 356 metros, es el atractivo extremo más conocido de la ciudad (con arnés, reserva previa, $225 CAD). A cien metros de la base, el Ripley's Aquarium of Canada tiene el túnel submarino más grande de Norteamérica y tiburones en exhibición permanente. Para familias con niños, combinación clásica.", type:"Icónico", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver entradas" },
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

  sectionSubtitles:{
    matches:"6 partidos en BMO Field — Canadá vs. Bosnia el 12 de junio (primer partido mundialista masculino en Canadá) y la Ronda de 32 el 2 de julio.",
    vibe:"Fan Fest oficial en Fort York, pantallas en Harbourfront y Yonge-Dundas Square, y los pubs irlandeses del downtown.",
    logistics:"GO Train desde Union Station a Exhibition Station en 5 minutos — la mejor logística de tránsito público del torneo, sin excepción.",
    food:"Dim sum en Spadina, roti en Kensington, pho en Broadview — la ciudad con más del 50% de residentes nacidos fuera del país.",
  },
  staysWarning:"Los precios son estimaciones para el periodo mundialista. El 12 de junio (Canadá vs. Bosnia, primer partido mundialista masculino en Canadá) es la fecha más crítica — los hoteles del centro se agotan meses antes. Roncesvalles, Leslieville y el East End son alternativas razonables con buena conexión por TTC.",
}

export const en: CityGuide = {
  id:"tor",
  city:"Toronto",
  country:"Canada",
  state:"Ontario",
  flag:"🇨🇦",
  accent: ACCENT,

  tags:["First World Cup 🇨🇦","Multicultural","Co-host city"],

  stadium:{ name:"Toronto Stadium (BMO Field)", capacity:"~45,736", area:"Exhibition Place — 4 km from the CN Tower" },

  headline:"The tournament's smallest stadium also puts the fan closest to the pitch. That's not a coincidence.",
  description:"Toronto arrives at the World Cup with 6 matches and a first historic chapter: on June 12, 2026, Canada vs. Bosnia is the first men's World Cup match on Canadian soil. BMO Field is the smallest stadium in the tournament (~45,736), with the most efficient public-transit logistics of any of the 16 host cities: the GO Train from Union Station arrives in five minutes.",

  scores:[
    { label:"Atmosphere", value:5 },
    { label:"Football",   value:4 },
    { label:"Food",       value:5 },
    { label:"Transit",    value:5 },
    { label:"Safety",     value:5 },
    { label:"Cost",       value:2 },
  ],

  matches:[
    { id:"m1", date:"Jun 12", day:"Fri", time:"15:00 ET", teams:[{name:"Canada",flag:"🇨🇦"},{name:"Bosnia",flag:"🇧🇦"}], stadium:"BMO Field", tag:"Group B · Historic", highlight:true },
    { id:"m2", date:"Jun 17", day:"Wed", time:"19:00 ET", teams:[{name:"Ghana",flag:"🇬🇭"},{name:"Panama",flag:"🇵🇦"}], stadium:"BMO Field", tag:"Group L", highlight:false },
    { id:"m3", date:"Jun 20", day:"Sat", time:"16:00 ET", teams:[{name:"Germany",flag:"🇩🇪"},{name:"Côte d'Ivoire",flag:"🇨🇮"}], stadium:"BMO Field", tag:"Group E", highlight:true },
    { id:"m4", date:"Jun 23", day:"Tue", time:"19:00 ET", teams:[{name:"Panama",flag:"🇵🇦"},{name:"Croatia",flag:"🇭🇷"}], stadium:"BMO Field", tag:"Group L", highlight:false },
    { id:"m5", date:"Jun 26", day:"Fri", time:"15:00 ET", teams:[{name:"Senegal",flag:"🇸🇳"},{name:"IC Playoff 2",flag:""}], stadium:"BMO Field", tag:"Group I", highlight:false },
    { id:"m6", date:"Jul 2",  day:"Thu", time:"TBD",      teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"BMO Field", tag:"2°K vs. 2°L", highlight:false },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",      value:"Toronto Stadium (BMO Field)" },
      { label:"Capacity",          value:"~45,736 — FIFA configuration (expanded with 17,756 temporary seats; the smallest stadium in the tournament)" },
      { label:"Weather (Jun–Jul)", value:"Days: 18–26°C · Nights: 13–18°C · Chance of rain; open-air stadium with no roof" },
      { label:"Matches",           value:"6 confirmed — 5 group + Round of 32" },
      { label:"Location",          value:"Exhibition Place — 4 km from the CN Tower. GO Train direct from Union Station in 5 minutes." },
      { label:"Airport",           value:"YYZ — Toronto Pearson International (~23 km from the stadium). UP Express to Union Station in 25 min." },
      { label:"Visa",              value:"Canada requires an eTA (Electronic Travel Authorization) for many countries — apply online at canada.ca before flying." },
    ],
    body:"June 12, 2026 is an unprecedented event in Canadian sports history: the first men's World Cup match on Canadian soil. Toronto has been buzzing about it for months before kickoff. BMO Field is the smallest stadium in the tournament (~45,736 seats), expanded with temporary structures — and also the one that puts every fan closest to the pitch. The logistics are the advantage: GO Train from Union Station → Exhibition Station in five minutes. No equivalent exists in the other 15 host cities.",
    lagomNote:"June 12 (Canada vs. Bosnia) is the highest-demand date in the venue's history. Downtown hotels vanish months ahead. Consider Airbnb in Roncesvalles, Leslieville, or the East End — neighborhoods well-connected by TTC with more reasonable prices.",
  },

  vibe:{
    body:"Toronto FC has spent two decades building an MLS fan base that now has both criterion and volume. More than 50% of Toronto residents were born outside Canada — which means every visiting team has its own local crowd. One of the most diverse cities in the world in culinary terms: no dominant local cuisine, with everything else represented: dim sum on Spadina, roti in Kensington, pho in Broadview, Neapolitan pizza downtown.",
    lagomNote:"June 12 is the most expectation-loaded match in the venue — and possibly in the tournament for Canadian fans. If you're traveling that day, book everything months ahead and arrive in the city with a day of buffer to soak up the atmosphere.",
  },

  stays:[
    { name:"The Drake Hotel", area:"Queen West", price:"$$$", priceCAD:"$350–550 CAD/night (World Cup period)", tags:["Boutique","Queen West","Restaurant screens"], note:"A Toronto cultural icon for twenty years. Designer rooms, an in-house restaurant with a solid selection of screens for matches, and a perfect location for accessing the GO Train from Union Station. The hotel that best captures the spirit of Queen West without trying too hard.", best_for:"Character", url:"https://booking.stay22.com/lagomplan/3yt_JV4N4T" },
    { name:"HI Toronto", area:"Church-Wellesley Village", price:"$", priceCAD:"$60–130 CAD/night by room type", tags:["Budget","Official HI","Well-connected by TTC"], note:"Toronto's official Hostelling International outpost has private and shared rooms at honest prices by the city's standards. Good TTC connectivity to downtown and the stadium.", best_for:"Budget", url:"https://kayak.stay22.com/lagomplan/SMg1RtvpiQ" },
    { name:"Fairmont Royal York", area:"Downtown / Union Station", price:"$$$$", priceCAD:"$650–1,100 CAD/night (World Cup period)", tags:["Historic luxury","Across the street from Union","Direct GO Train access"], note:"Toronto's grand historic hotel, steps from Union Station. GO Train access to Exhibition Place is literally across the street. In a tournament where logistics rule, that advantage is concrete.", best_for:"Luxury", url:"https://booking.stay22.com/lagomplan/UCCZqWSLYk" },
  ],

  logistics:{
    transport:[
      { icon:"🚆", title:"Master route — GO Train → Exhibition GO Station", text:"The GO Train from Union Station arrives at Exhibition GO Station in five minutes and costs about $4 CAD. The station is literally inside the Exhibition Place complex. It's the fastest, cheapest, and most predictable route of any host city in the tournament. No equivalent exists in the other 15 host cities." },
      { icon:"🚋", title:"Alternative — TTC Streetcar 509 / 511 → Exhibition Place", text:"The streetcar leaves from Union Station and runs along Lake Shore Boulevard West to Exhibition Place in about 20 minutes. Slower than the GO Train, cheaper ($3.30 CAD with Presto), and with the advantage of high frequency. A valid option if you're near the lakeshore corridor." },
      { icon:"✈", title:"From YYZ — UP Express + GO Train", text:"UP Express from YYZ (Toronto Pearson) to Union Station in 25 minutes for $12 CAD. From Union, GO Train to the stadium in 5 minutes. Total from airport to stadium: ~35 minutes, no taxi or Uber. The cleanest airport-to-venue combination in the tournament." },
      { icon:"⚠️", title:"Critical error — driving on June 12", text:"Traffic around Exhibition Place and Lake Shore Boulevard West on Canada's opening match will be historic in scale. Uber from any downtown point will take between 45 and 90 minutes. The GO Train takes five minutes from Union Station — that comparison says everything.", isWarning:true },
    ],
    timings:[
      { label:"Union Station on GO Train",                    value:"~5 min" },
      { label:"Union Station on streetcar 509/511",           value:"~20 min" },
      { label:"YYZ on UP Express + GO Train",                 value:"~35 min total" },
      { label:"Uber from King West (normal / match day)",     value:"10–20 min · unpredictable" },
    ],
    matchDayCronologia:{
      matchName:"Jun 12 · Canada vs. Bosnia · 15:00 ET",
      steps:[
        { time:"H-3:00", text:"Breakfast / lunch in your neighborhood. On June 12, all of Toronto tries to reach the same place." },
        { time:"H-2:30", text:"Head to Union Station on foot or by streetcar." },
        { time:"H-2:00", text:"GO Train to Exhibition. Five minutes. Done." },
        { time:"H-1:30", text:"Arrive at the stadium. Gates open 90 minutes before kickoff." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready (no paper)." },
        { time:"H+0:00", text:"Kickoff — and the first goal on Canadian soil, if all goes well." },
        { time:"H+1:30", text:"GO Train back from Exhibition. First departure after the whistle." },
      ],
    },
    timing:"BMO Field is in Exhibition Place, 4 kilometers from the CN Tower. Toronto has the best public-transit logistics in the tournament — no exceptions. The GO Train is the most direct route of any of the 16 host cities.",
    cost:"An expensive city in a normal year; the World Cup multiplies hotel and transit prices. Book months ahead or use Airbnb in the TTC-connected neighborhoods — Roncesvalles, Leslieville, East End.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Fort York National Historic Site", type:"Official fan fest", typeColor:CORAL, desc:"The Fan Fest sets up at Fort York, the historic site where the Battle of York was fought in 1813. Ten minutes on foot from BMO Field, it's the official gathering point with giant screens, cultural activations, and local food. For the fan without a ticket who wants the match atmosphere without being inside, it's Toronto's most logical option — and the Fan Fest with the most interesting historical context in the tournament.", tag:"Fort York" },
    { title:"Harbourfront Centre (Queens Quay)", type:"Cultural center", typeColor:FJORD, desc:"The cultural complex on the edge of Lake Ontario has outdoor terraces and an open-air amphitheater that functions as a city gathering point in summer. For Canada matches, the lake and skyline views from Harbourfront turn the experience into something no bar can match.", tag:"Lake Ontario" },
    { title:"Yonge-Dundas Square", type:"Massive plaza", typeColor:SAGE, desc:"Toronto's Times Square — permanent digital screens, pedestrian space, and subway access from every point in the city. Loud, massive, and with no additional installation required. For June 12 (Canada vs. Bosnia), the plaza will be the city's second stadium.", tag:"Downtown" },
    { title:"Distillery District (Corktown)", type:"Historic district", typeColor:PINE, desc:"The complex of restored Victorian architecture has outdoor patios that install outdoor screens during the tournament. European neighborhood atmosphere with international fans — Toronto's most photogenic spot for watching a match without going into a bar.", tag:"Victorian" },
    { title:"Real Sports Bar & Grill", type:"Monumental sports bar", typeColor:"#C41E3A", desc:"Canada's largest sports bar, with monumental-format screens and capacity for thousands. The Canada match experience is among the most intense in the city. Book a table days ahead for June 12. The food is elevated American pub.", tag:"Canada HQ" },
    { title:"Fionn MacCool's (multiple locations)", type:"Irish pub", typeColor:"#2D6B47", desc:"Toronto's most reliable Irish pub chain for watching matches. Screens in every corner, stadium-bar atmosphere on big match days, and a solid pub menu. For the Canada match, any downtown location fills up two hours before kickoff.", tag:"Reliable pub" },
  ],

  food:[
    { dish:"Real Sports Bar & Grill", where:"Air Canada Centre — burger + Ontario craft beer; Canada's largest bar, monumental format for the June 12 match",                  price:"$$",   type:"Sports bar" },
    { dish:"Fionn MacCool's",          where:"Multiple downtown locations — fish & chips + Guinness; reliable Irish pub, any location fills two hours before Canada",            price:"$$",   type:"Irish pub" },
    { dish:"Bar Raval",                where:"Little Italy — Basque pintxos + txakoli; serious cocktails, food to match, for matches with less dense crowds",                     price:"$$$",  type:"Gastro-bar" },
    { dish:"Dim sum on Spadina",       where:"Chinatown — Pearl Harbourfront or Dim Sum King; one of the best Chinese communities in North America",                            price:"$–$$", type:"Neighborhood" },
    { dish:"Roti in Kensington",       where:"Kensington Market — Patty King or Bacchus Roti Shop; Toronto's Caribbean diaspora cooks roti like no one outside Trinidad",       price:"$",    type:"Caribbean" },
    { dish:"Pho in Broadview",         where:"East Chinatown — Pho Hung or Pho 88; the city's highest concentration of Vietnamese restaurants",                                  price:"$",    type:"Vietnamese" },
  ],

  experiences:[
    { title:"ROM + Queen West + Arts District", duration:"Half to full day", desc:"The Royal Ontario Museum (ROM) on Bloor Street has one of the most important archaeological and natural history collections in North America, with sections dedicated to Mesoamerican and African cultures relevant to a 48-nation tournament. For the afternoon, Queen West west of Bathurst has independent galleries, used bookstores, and coffee shops that have spent decades not trying to be trendy.", type:"Cultural", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See ROM" },
    { title:"Toronto Islands (ferry from downtown)", duration:"Full day", desc:"Thirteen minutes by ferry from the docks across from the CN Tower (Ferry Terminal, $9 CAD round trip), the islands offer beaches, trails, kayak rentals, and the best skyline views of Toronto from the water. On a June day with no match, there's no better plan in the city. The ferry operates from 6:30am; match days have extra service.", type:"Water", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See ferry" },
    { title:"Kensington Market + Little Italy", duration:"Half day", desc:"Kensington Market on a Saturday morning is one of the best street markets in North America: vintage clothing, artisan cheese, exotic fruit, and coffee shops that don't serve chain coffee. Little Italy on College Street is a ten-minute walk away: terraces, Italian pastry shops, and restaurants that have been around for decades. A complete plan in less than 3 kilometers.", type:"Neighborhood", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See map" },
    { title:"CN Tower + Ripley's Aquarium", duration:"Half day", desc:"The CN Tower at 553 meters was the tallest building in the world for 34 years. EdgeWalk, the open-platform walk around the outside at 356 meters, is the city's best-known extreme attraction (harness, advance reservation, $225 CAD). A hundred meters from the base, Ripley's Aquarium of Canada has the largest underwater tunnel in North America and permanent shark exhibits. For families with kids, a classic combo.", type:"Iconic", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See tickets" },
  ],

  lagomTips:[
    "GO Train from Union Station to Exhibition Station: 5 minutes, $4 CAD. The best public-transit logistics in the tournament, without exception.",
    "Canada requires an eTA — not a visa, but a mandatory online form at canada.ca for many countries. Handle this before buying the flight.",
    "June 12 (Canada vs. Bosnia) is the first men's World Cup match on Canadian soil. Downtown hotels sell out months ahead — Roncesvalles and Leslieville are the margin.",
    "More than 50% of Toronto residents were born outside Canada. Any national team in the world has a local crowd — use the neighborhoods of each diaspora.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "Canadian eTA confirmed (international travelers)",
    "Presto card loaded or contactless payment for GO/TTC",
    "Union Station identified as departure point",
    "Clear bag required",
    "Light layer — open-air stadium, cool evenings",
    "Hotel reservation confirmed (top priority for June 12)",
    "Post-match plan to celebrate if Canada scores at home",
  ],

  didYouKnow:"Toronto is one of the most diverse cities in the world by percentage of residents born outside the country: more than 50% of the metro area's population was born in another country. That's a higher proportion than New York, London, or Paris. At the World Cup, that means every match has an organic local crowd for the visiting national team.",
  closingNote:"Toronto arrives at the World Cup without needing the tournament to explain who it is. It's a city that already knows how to cook fifty cuisines, speak two hundred languages, and cheer for any national team in the world from its own stands. June 12, 2026 adds a first chapter to the history of men's soccer in Canada. BMO Field is the smallest stadium in the tournament. It's also the one that puts every fan closer to the pitch than any other venue of the 16 hosts. LagomPlan doesn't need to add more.",
  closingSignature:"Lagomplan · Field Guide · Toronto · World Cup 2026",
  plannerCTA:"Generate my Toronto trip",

  sectionSubtitles:{
    matches:"6 matches at BMO Field — Canada vs. Bosnia on June 12 (the first men's World Cup match on Canadian soil) and the Round of 32 on July 2.",
    vibe:"Official Fan Fest at Fort York, screens at Harbourfront and Yonge-Dundas Square, and the Irish pubs of downtown.",
    logistics:"GO Train from Union Station to Exhibition Station in 5 minutes — the best public-transit logistics in the tournament, without exception.",
    food:"Dim sum on Spadina, roti in Kensington, pho in Broadview — the city with more than 50% of residents born outside the country.",
  },
  staysWarning:"Prices are estimates for the World Cup period. June 12 (Canada vs. Bosnia, the first men's World Cup match on Canadian soil) is the critical date — downtown hotels sell out months ahead. Roncesvalles, Leslieville, and the East End are reasonable alternatives with good TTC connectivity.",
}
