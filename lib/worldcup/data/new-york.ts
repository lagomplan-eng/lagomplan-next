import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#1A3B5C'

export const es: CityGuide = {
  id:"nyc", city:"Nueva York", country:"Estados Unidos", state:"NY & NJ", flag:"🇺🇸", accent:ACCENT,
  tags:["FINAL 🏆","Fútbol","Sede co-anfitriona"],
  stadium:{ name:"New York New Jersey Stadium (MetLife Stadium)", capacity:"~82,500", area:"East Rutherford, NJ — no está en la ciudad de Nueva York" },
  headline:"La ciudad que alberga la Final no necesita explicar por qué. Solo necesita que sepas llegar al estadio.",
  description:"Nueva York / Nueva Jersey es la sede que alberga el partido que cierra el torneo. El 19 de julio de 2026, MetLife Stadium en East Rutherford sirve de escenario para la Final del Mundial más grande de la historia. La ciudad no lo necesita para afirmar su centralidad — pero el torneo sí la necesita a ella para tener un cierre a la altura.",
  scores:[
    { label:"Ambiente", value:5 }, { label:"Fútbol local", value:4 }, { label:"Gastronomía", value:5 },
    { label:"Transporte", value:4 }, { label:"Seguridad", value:4 }, { label:"Costo", value:1 },
  ],
  matches:[
    { id:"m1", date:"13 Jun", day:"Sáb", time:"18:00 ET", teams:[{name:"Brasil",flag:"🇧🇷"},{name:"Marruecos",flag:"🇲🇦"}], stadium:"MetLife Stadium", tag:"Grupo C", highlight:true },
    { id:"m2", date:"16 Jun", day:"Mar", time:"15:00 ET", teams:[{name:"Francia",flag:"🇫🇷"},{name:"Senegal",flag:"🇸🇳"}], stadium:"MetLife Stadium", tag:"Grupo I", highlight:true },
    { id:"m3", date:"22 Jun", day:"Lun", time:"20:00 ET", teams:[{name:"Noruega",flag:"🇳🇴"},{name:"Senegal",flag:"🇸🇳"}], stadium:"MetLife Stadium", tag:"Grupo I", highlight:false },
    { id:"m4", date:"25 Jun", day:"Jue", time:"16:00 ET", teams:[{name:"Ecuador",flag:"🇪🇨"},{name:"Alemania",flag:"🇩🇪"}], stadium:"MetLife Stadium", tag:"Grupo E", highlight:false },
    { id:"m5", date:"27 Jun", day:"Sáb", time:"17:00 ET", teams:[{name:"Panamá",flag:"🇵🇦"},{name:"Inglaterra",flag:"🏴"}], stadium:"MetLife Stadium", tag:"Grupo L", highlight:false },
    { id:"m6", date:"30 Jun", day:"Lun", time:"17:00 ET", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"MetLife Stadium", tag:"Ronda de 32", highlight:false },
    { id:"m7", date:"5 Jul",  day:"Dom", time:"16:00 ET", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"MetLife Stadium", tag:"Ronda de 16", highlight:false },
    { id:"m8", date:"19 Jul", day:"Dom", time:"15:00 ET", teams:[{name:"FINAL 🏆",flag:""},{name:"Por definir",flag:""}], stadium:"MetLife Stadium", tag:"FINAL", highlight:true },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"New York New Jersey Stadium (MetLife Stadium)" },
      { label:"Aforo", value:"~82,500 — configuración FIFA (el estadio más grande del torneo)" },
      { label:"Clima (jun–jul)", value:"Días: 22–30°C · Julio: calor húmedo intenso · Estadio al aire libre y sin techo" },
      { label:"Partidos", value:"8 confirmados — el máximo del torneo: 5 grupos + Ronda de 32 + Ronda de 16 + FINAL 🏆" },
      { label:"Ubicación", value:"East Rutherford, NJ — no está en Nueva York. Sin subway al estadio. Solo NJ Transit desde Penn Station." },
      { label:"Aeropuertos", value:"EWR (Newark, el más cercano, NJ Transit directo) · JFK (~50 km) · LGA (~30 km)" },
    ],
    body:"MetLife Stadium está en East Rutherford, Nueva Jersey — no en la ciudad de Nueva York. El estadio no tiene acceso por subway. La única ruta de tránsito público es NJ Transit desde Penn Station. Este es el hecho más importante de la logística de esta sede — todo lo demás se desprende de él. Nueva York no necesita el Mundial para saber que es el centro del mundo — pero el Mundial sí la necesita a ella para tener Final digna. El 19 de julio de 2026, MetLife Stadium cierra el torneo más grande de la historia del fútbol.",
    lagomNote:"Los días del 13 de junio (Brasil vs. Marruecos) y el 19 de julio (Final) son las fechas de mayor demanda de toda la sede — y posiblemente del torneo completo. Si no tienes alojamiento confirmado para esas fechas, considera opciones en Newark, Hoboken o el norte de Brooklyn con conexión por subway + NJ Transit.",
  },
  vibe:{
    body:"La mayor comunidad latina de Estados Unidos vive en el área metropolitana de Nueva York. Cada partido en esta sede tiene tribunas enteras con banderas de Colombia, Ecuador, Senegal o Brasil que no viajaron desde sus países — son vecinos de Jackson Heights, el Bronx o Newark. En paralelo, Nueva York tiene más restaurantes con estrellas Michelin que cualquier otra ciudad de América, y su cocina de barrio es igualmente seria. El problema no es encontrar qué comer — es elegir el barrio donde comer.",
    lagomNote:"El 13 de junio (Brasil vs. Marruecos), el 16 de junio (Francia vs. Senegal) y el 19 de julio (Final) son las tres fechas de mayor demanda. Reserva alojamiento con meses de anticipación — y si no, considera Jersey City, Hoboken o Newark como bases alternativas a Manhattan.",
  },
  stayNeighborhoods:{
    intro:"MetLife Stadium está en East Rutherford, Nueva Jersey — a 30 minutos de Penn Station en NJ Transit. El planteamiento de base tiene que resolver dos cosas: acceso al estadio y acceso a la ciudad. Son tensiones reales.",
    items:[
      { kind:"recommended", title:"Base recomendada: Midtown Manhattan (Koreatown / Penn Station area)", body:"Estar en Midtown resuelve la logística del estadio con más elegancia que cualquier otra zona. La salida de NJ Transit desde Penn Station lleva directo al MetLife en 10-12 minutos. K-Town (32nd Street) tiene opciones de hospedaje a mejor precio que el promedio de Midtown y una escena de comida nocturna que no cierra. Para quien tiene varios partidos confirmados, esta es la base más funcional." },
      { kind:"alternative", title:"Opción con carácter: Brooklyn (Williamsburg / Park Slope)", body:"Brooklyn no está en Nueva Jersey, pero está en Nueva York — y eso es suficiente para justificarlo. Williamsburg tiene la mejor relación calidad de barrio / precio de hotel de la ciudad, con el subway L a Union Square y luego conexión a Penn Station. Para el fanático que quiere dormir en una ciudad que se siente habitada, no solo transitada. El tiempo de traslado al estadio es de 40-50 minutos total, que en términos de Nueva York es completamente normal." },
      { kind:"alternative", title:"Opción de presupuesto con lógica: Jersey City / Hoboken", body:"La alternativa más honesta para el fan con presupuesto ajustado. Jersey City y Hoboken están en Nueva Jersey, a 10-15 minutos de Penn Station en NJ Transit — lo que significa que para ir al estadio, básicamente ya estás en el camino correcto. Los hoteles son un 30-40% más baratos que en Manhattan. El PATH train conecta con el downtown de Manhattan en 10 minutos." },
    ],
  },
  stays:[
    { name:"The William Vale", area:"Williamsburg, Brooklyn", price:"$$$$", priceCAD:"$380–620 USD/noche (periodo mundialista)", tags:["Hotel boutique","Piscina en techo","Williamsburg"], note:"El hotel que cambió el perfil hotelero de Brooklyn. Piscina en el techo con vistas al skyline de Manhattan, restaurante Leuca (cocina costera italiana) y habitaciones con diseño que justifican el precio. Subway L a Union Square, luego NJ Transit al estadio.", best_for:"Carácter", url:"https://booking.stay22.com/lagomplan/dgKD67DxZm" },
    { name:"Freehand New York", area:"Gramercy / Midtown South", price:"$$", priceCAD:"$150–280 USD/noche según tipo de habitación", tags:["Precio honesto","Rooftop","Cerca Penn Station"], note:"El hostal-hotel de referencia en Nueva York para el rango intermedio: habitaciones privadas y tipo hostal, bar en el rooftop, diseño cuidado y ubicación óptima. A 15 minutos caminando de Penn Station.", best_for:"Precio honesto", url:"https://booking.stay22.com/lagomplan/atCMX1HEsJ" },
    { name:"The St. Regis New York", area:"Midtown / Fifth Avenue", price:"$$$$", priceCAD:"$900–2,000 USD/noche (periodo mundialista)", tags:["Lujo","Fifth Avenue","Desde 1904"], note:"Desde 1904, la dirección más cargada de historia y servicio en Nueva York. A cuatro cuadras de Penn Station. Para la Final del 19 de julio, esta es la única dirección que no requiere disculpa en la mañana siguiente.", best_for:"Lujo", url:"https://booking.stay22.com/lagomplan/vIe7v-l4Gl" },
  ],
  logistics:{
    transport:[
      { icon:"🚆", title:"Ruta maestra — NJ Transit desde Penn Station → MetLife", text:"NJ Transit opera trenes directos desde Penn Station (Manhattan) a la estación MetLife durante los días de partido. El trayecto dura entre 10 y 12 minutos y el costo es de aproximadamente $8–10 USD ida. El servicio de regreso opera hasta que el último fanático sale del estadio. No hay tren más directo, más rápido ni más simple para llegar al MetLife." },
      { icon:"✈", title:"Desde Newark (EWR) — la combinación ganadora", text:"El aeropuerto de Newark tiene conexión directa por NJ Transit a Penn Station (Newark-Penn Station → New York Penn Station, ~25 minutos). Desde ahí, el tren al MetLife. Si llegaste en vuelo, esta combinación te lleva del avión al estadio en menos de 45 minutos sin ningún taxi o Uber." },
      { icon:"🎟", title:"Boleto de tren", text:"NJ Transit se compra en taquilla, máquinas de Penn Station o en la app oficial. Los trenes especiales para MetLife usan tarifa estadio. Llega con tiempo — las filas en Penn Station en días de partido grande se multiplican." },
      { icon:"⚠️", title:"Error crítico — asumir que el subway llega al MetLife", text:"No hay ninguna línea del subway MTA que llegue a East Rutherford, Nueva Jersey. El único tránsito público que va al estadio es NJ Transit desde Penn Station. Cualquier aplicación de transporte que te sugiera rutas de subway al MetLife te está dando información incorrecta. Penn Station, NJ Transit, diez minutos. Ese es el camino.", isWarning:true },
    ],
    timings:[
      { label:"Penn Station (Manhattan) → MetLife en NJ Transit", value:"~10–12 min" },
      { label:"EWR (aeropuerto) → NY Penn → MetLife", value:"~40 min total" },
      { label:"JFK → AirTrain + subway + NJ Transit", value:"~75–90 min" },
      { label:"Uber desde Midtown Manhattan (con tráfico de partido)", value:"60–120 min · x2–3 precio" },
    ],
    matchDayCronologia:{
      matchName:"13 Jun · Brasil vs. Marruecos · 18:00 ET",
      steps:[
        { time:"H-3:00", text:"Almuerza en Midtown o cerca de Penn Station. Evita cruzar a Jersey en horas pico previas al partido." },
        { time:"H-2:00", text:"Dirígete a Penn Station. El tren al MetLife opera desde 4 horas antes del partido." },
        { time:"H-1:30", text:"Llegada al estadio. Las puertas abren ~90 minutos antes. Bolso claro obligatorio." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:30", text:"NJ Transit de regreso. El tren opera con frecuencia hasta que el estadio vacía — no hay prisa, pero tampoco hay razón para quedarse." },
      ],
    },
    timing:"MetLife Stadium no está en Nueva York. Está en East Rutherford, Nueva Jersey. Esta frase debe guiar todas las decisiones de transporte de esta guía.",
    cost:"Los precios en Manhattan durante los partidos grandes superan los $500 USD/noche en las opciones más básicas. La estrategia de alojamiento es la decisión más importante de este viaje. Jersey City, Hoboken y el norte de Brooklyn son las alternativas más honestas.",
  },
  vibeCards:[
    { title:"FIFA Fan Zone — USTA Billie Jean King Center (Queens)", type:"Fan fest oficial", typeColor:CORAL, desc:"Opera del 17 al 28 de junio en el complejo de tenis de Queens — durante la fase de grupos y la primera semana de eliminatorias. Pantallas gigantes, activaciones y el contexto del mayor complejo deportivo del barrio. Acceso por subway 7 (Flushing-Main Street) o LIRR desde Penn Station.", tag:"17–28 Jun" },
    { title:"Fan Village @ Rockefeller Center (Midtown)", type:"Fan fest oficial", typeColor:CORAL, desc:"Opera del 4 al 19 de julio — la fase final del torneo culminando con la Final. Rockefeller Center es el corazón de Midtown: pantallas de gran formato al aire libre en una de las plazas más reconocibles del mundo. Para el fan sin boleto a la Final del 19 de julio, este es el lugar.", tag:"4–19 Jul" },
    { title:"Brooklyn Bridge Park (DUMBO, Brooklyn)", type:"Pantalla exterior", typeColor:FJORD, desc:"Las terrazas del parque bajo el puente de Brooklyn con vista al skyline del lower Manhattan son el escenario natural más cinematográfico de la ciudad para ver un partido al aire libre. Sin infraestructura fija de pantallas, pero organizaciones locales activan transmisiones en los prados para los partidos más importantes.", tag:"DUMBO" },
    { title:"Jackson Heights (Queens, Roosevelt Avenue)", type:"Barrio latino", typeColor:SAGE, desc:"Para los partidos de Colombia, Ecuador, México o Argentina, la 74th Street en Jackson Heights — el barrio latinoamericano más denso de Nueva York — se convierte en estadio sin techo. No hay pantalla oficial: los negocios sacan las suyas a la calle y la calle hace el resto. El ambiente más auténtico de la sede, sin duda.", tag:"Latino NYC" },
    { title:"Nevada Smith's (East Village)", type:"Bar de soccer histórico", typeColor:PINE, desc:"El bar de soccer más antiguo de Manhattan, abierto desde 1999. Abre a las 6am para los partidos europeos de madrugada y mantiene ese espíritu durante el Mundial. Clientela con criterio, comida de pub decente y el ambiente más auténtico de fútbol de la ciudad — sin el branding corporativo de los sports bars nuevos.", tag:"Desde 1999" },
    { title:"Louis Armstrong Stadium (Flushing)", type:"Estadio con pantalla", typeColor:"#1A3A5C", desc:"Del 17 al 28 de junio, el estadio de tenis de la USTA en Queens se convierte en zona de transmisión oficial no-FIFA con pantallas de gran formato. El contexto — en el barrio más diverso de Nueva York, a cinco minutos caminando del Chinatown de Flushing — convierte cada partido en una reunión de las diásporas del mundo.", tag:"Flushing" },
  ],
  food:[
    { dish:"Nevada Smith's", where:"East Village — hamburguesa + cerveza de barril; el bar de fútbol más serio de Manhattan desde 1999, sin branding corporativo", price:"$$", type:"Bar de soccer" },
    { dish:"Elbow Room", where:"Williamsburg, Brooklyn — alitas + IPA local; el bar de referencia para la comunidad futbolera de Brooklyn, ruidoso en partidos europeos", price:"$$", type:"Sports bar" },
    { dish:"La Silhouette", where:"Hell's Kitchen — hamburguesa clásica + IPA de barril; a tres cuadras de Penn Station, pantalla de tamaño de teatro", price:"$$", type:"Pre-partido" },
    { dish:"Dim sum en Flushing", where:"Queens — el Chinatown más auténtico de Norteamérica, a 30 minutos en subway 7 desde Times Square", price:"$–$$", type:"Barrio" },
    { dish:"Pizza por rebanada", where:"Manhattan — el ritual obligatorio; Joe's en West Village y Prince Street Pizza son puntos de referencia", price:"$", type:"Ritual" },
    { dish:"Bagel con lox", where:"Upper West Side — Absolute Bagels o Zabar's; el desayuno de Nueva York sin disculpa", price:"$", type:"Local" },
  ],
  experiences:[
    { title:"MoMA + High Line + Chelsea", duration:"Medio día a día completo", desc:"El Museum of Modern Art en Midtown tiene la colección permanente de arte contemporáneo más importante del mundo — un Picasso, un Dalí y una Frida Kahlo en la misma sala. Entrada $30 USD; los viernes de 4 a 8pm es gratuita. Para la tarde, el High Line (el parque lineal elevado sobre las vías del tren en Chelsea) conecta el barrio de galerías con Hudson Yards en una caminata de 2.5 kilómetros.", type:"Arte", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver información" },
    { title:"Flushing (Queens) — Chinatown verdadero", duration:"Medio día", desc:"El Chinatown de Manhattan es turístico. El de Flushing, en Queens, es el más grande y más auténtico de Norteamérica: mercados cubiertos de cinco pisos, restaurantes de todas las regiones de China, tiendas de ingredientes importados y una energía de barrio que no tiene nada que vender al visitante casual. Subway 7 desde Times Square (30 minutos). Combina con el Fan Zone en el USTA Billie Jean King Center.", type:"Barrio", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver subway" },
    { title:"Staten Island Ferry + Smorgasburg", duration:"Mañana o día completo", desc:"El ferry a Staten Island es gratuito, opera 24 horas y ofrece la mejor vista a la Estatua de la Libertad y al skyline del lower Manhattan desde el agua — sin costo de entrada, sin reserva. Para el sábado entre partidos, el Smorgasburg en Williamsburg (9am–4pm) es el mercado de comida callejera más variado de la ciudad: 100 vendedores independientes en Marcy Avenue.", type:"Sin turismo", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver Smorgasburg" },
    { title:"Brooklyn — Williamsburg + Park Slope", duration:"Día completo", desc:"Brooklyn tiene la mejor relación calidad de barrio / precio de todo Nueva York. Williamsburg: Smorgasburg, tiendas de diseño independientes y el mejor café de la ciudad. Park Slope: brownstones, Prospect Park, cafés familiares. Subway L o F conecta con ambos.", type:"Barrio", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver opciones" },
  ],
  lagomTips:[
    "MetLife Stadium NO está en Nueva York. Está en East Rutherford, NJ. Solo NJ Transit desde Penn Station llega al estadio — no hay subway MTA.",
    "El 13 de junio (Brasil vs. Marruecos), el 16 de junio (Francia vs. Senegal) y el 19 de julio (Final) son las tres fechas de mayor demanda del torneo completo.",
    "Para la Final (19 Jul), los hoteles de tres estrellas en Manhattan superan los $800 USD/noche. Jersey City, Hoboken y Newark son las alternativas racionales.",
    "El ferry a Staten Island es gratuito y ofrece la mejor vista a la Estatua de la Libertad sin costo ni reserva. Opera 24 horas.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Boleto NJ Transit a MetLife Stadium",
    "Penn Station identificada como punto de partida",
    "Plan B previsto para sobrecostos de Uber en regreso",
    "Bolso claro obligatorio",
    "Capa ligera de lluvia — estadio al aire libre y sin techo",
    "Reserva de hotel confirmada para Jun 13, Jul 19 u otra fecha grande",
    "Plan de regreso: abordar NJ Transit dentro de los primeros 90 min tras el partido",
  ],
  didYouKnow:"MetLife Stadium será el estadio más grande del torneo (~82,500 asientos en configuración FIFA) y acogerá 8 partidos — el máximo de cualquier sede — incluyendo la Final del 19 de julio. Es también el único estadio del Mundial 2026 que NO está en la ciudad a la que da nombre: queda en East Rutherford, Nueva Jersey.",
  closingNote:"Nueva York / Nueva Jersey es la sede que alberga el partido que cierra el torneo. El 19 de julio de 2026, el MetLife Stadium en East Rutherford sirve de escenario para la Final del Mundial más grande de la historia. La ciudad no lo necesita para afirmar su centralidad — pero el torneo sí la necesita a ella para tener un cierre a la altura. Para el fan que llega en junio por Brasil vs. Marruecos o Francia vs. Senegal, el mismo estadio, la misma estación de tren y la misma ciudad estarán ahí seis semanas después cuando el trofeo cambie de manos. LagomPlan te da la ruta. El resto es historia.",
  closingSignature:"Lagomplan · Guía de campo · Nueva York / Nueva Jersey · Mundial 2026",
  plannerCTA:"Generar mi viaje a Nueva York",
}

export const en: CityGuide = {
  id:"nyc", city:"New York", country:"United States", state:"NY & NJ", flag:"🇺🇸", accent:ACCENT,
  tags:["FINAL 🏆","Football","Co-host city"],
  stadium:{ name:"New York New Jersey Stadium (MetLife Stadium)", capacity:"~82,500", area:"East Rutherford, NJ — not in New York City" },
  headline:"The city that hosts the Final doesn't need to explain why. It just needs you to know how to reach the stadium.",
  description:"New York / New Jersey is the host city for the match that closes the tournament. On July 19, 2026, MetLife Stadium in East Rutherford stages the Final of the largest World Cup in history. The city doesn't need it to assert its centrality — but the tournament needs it to land a finish worthy of the stage.",
  scores:[
    { label:"Atmosphere", value:5 }, { label:"Football", value:4 }, { label:"Food", value:5 },
    { label:"Transit", value:4 }, { label:"Safety", value:4 }, { label:"Cost", value:1 },
  ],
  matches:[
    { id:"m1", date:"Jun 13", day:"Sat", time:"18:00 ET", teams:[{name:"Brazil",flag:"🇧🇷"},{name:"Morocco",flag:"🇲🇦"}], stadium:"MetLife Stadium", tag:"Group C", highlight:true },
    { id:"m2", date:"Jun 16", day:"Tue", time:"15:00 ET", teams:[{name:"France",flag:"🇫🇷"},{name:"Senegal",flag:"🇸🇳"}], stadium:"MetLife Stadium", tag:"Group I", highlight:true },
    { id:"m3", date:"Jun 22", day:"Mon", time:"20:00 ET", teams:[{name:"Norway",flag:"🇳🇴"},{name:"Senegal",flag:"🇸🇳"}], stadium:"MetLife Stadium", tag:"Group I", highlight:false },
    { id:"m4", date:"Jun 25", day:"Thu", time:"16:00 ET", teams:[{name:"Ecuador",flag:"🇪🇨"},{name:"Germany",flag:"🇩🇪"}], stadium:"MetLife Stadium", tag:"Group E", highlight:false },
    { id:"m5", date:"Jun 27", day:"Sat", time:"17:00 ET", teams:[{name:"Panama",flag:"🇵🇦"},{name:"England",flag:"🏴"}], stadium:"MetLife Stadium", tag:"Group L", highlight:false },
    { id:"m6", date:"Jun 30", day:"Mon", time:"17:00 ET", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"MetLife Stadium", tag:"Round of 32", highlight:false },
    { id:"m7", date:"Jul 5",  day:"Sun", time:"16:00 ET", teams:[{name:"Round of 16",flag:""},{name:"TBD",flag:""}], stadium:"MetLife Stadium", tag:"Round of 16", highlight:false },
    { id:"m8", date:"Jul 19", day:"Sun", time:"15:00 ET", teams:[{name:"FINAL 🏆",flag:""},{name:"TBD",flag:""}], stadium:"MetLife Stadium", tag:"FINAL", highlight:true },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium", value:"New York New Jersey Stadium (MetLife Stadium)" },
      { label:"Capacity", value:"~82,500 — FIFA configuration (the tournament's largest stadium)" },
      { label:"Weather (Jun–Jul)", value:"Days: 22–30°C · July: intense humid heat · Open-air, no roof" },
      { label:"Matches", value:"8 confirmed — the tournament's max: 5 group stage + Round of 32 + Round of 16 + FINAL 🏆" },
      { label:"Location", value:"East Rutherford, NJ — not in New York. No subway to the stadium. Only NJ Transit from Penn Station." },
      { label:"Airports", value:"EWR (Newark, closest, direct NJ Transit) · JFK (~50 km) · LGA (~30 km)" },
    ],
    body:"MetLife Stadium is in East Rutherford, New Jersey — not in New York City. The stadium has no subway access. The only public-transit route is NJ Transit from Penn Station. This is the single most important fact of this host city's logistics — everything else flows from it. New York doesn't need the World Cup to know it's the center of the world — but the World Cup needs New York to land a Final worthy of the stage. On July 19, 2026, MetLife Stadium closes the largest tournament in football history.",
    lagomNote:"June 13 (Brazil vs. Morocco) and July 19 (Final) are the host city's peak-demand dates — and possibly the entire tournament's. If you don't have confirmed lodging for those dates, consider options in Newark, Hoboken, or north Brooklyn with subway + NJ Transit connection.",
  },
  vibe:{
    body:"The largest Latin community in the United States lives in the New York metro area. Every match at this host city has entire sections with flags of Colombia, Ecuador, Senegal, or Brazil carried by fans who didn't fly in — they're neighbors from Jackson Heights, the Bronx, or Newark. In parallel, New York has more Michelin-starred restaurants than any other city in the Americas, and its neighborhood cooking is just as serious. The problem isn't finding what to eat — it's choosing the neighborhood to eat in.",
    lagomNote:"June 13 (Brazil vs. Morocco), June 16 (France vs. Senegal), and July 19 (Final) are the three peak-demand dates. Book accommodation months ahead — if you can't, consider Jersey City, Hoboken, or Newark as alternative bases to Manhattan.",
  },
  stayNeighborhoods:{
    intro:"MetLife Stadium is in East Rutherford, New Jersey — 30 minutes from Penn Station on NJ Transit. Picking a base has to solve two things: stadium access and city access. Both are real tensions.",
    items:[
      { kind:"recommended", title:"Recommended base: Midtown Manhattan (Koreatown / Penn Station area)", body:"Staying in Midtown solves stadium logistics more elegantly than any other zone. NJ Transit out of Penn Station goes direct to MetLife in 10–12 minutes. K-Town (32nd Street) has lodging at better prices than Midtown average and a late-night food scene that doesn't close. For anyone with multiple matches confirmed, this is the most functional base." },
      { kind:"alternative", title:"Character pick: Brooklyn (Williamsburg / Park Slope)", body:"Brooklyn isn't in New Jersey, but it's in New York — and that's enough to justify it. Williamsburg has the best neighborhood-quality / hotel-price ratio in the city, with the L subway to Union Square and a transfer to Penn Station. For the fan who wants to sleep in a city that feels lived-in, not just transited. Travel time to the stadium is 40–50 minutes total — completely normal by NYC standards." },
      { kind:"alternative", title:"Budget option with logic: Jersey City / Hoboken", body:"The most honest alternative for the budget-conscious fan. Jersey City and Hoboken sit in New Jersey, 10–15 minutes from Penn Station on NJ Transit — which means going to the stadium puts you basically already on the right path. Hotels run 30–40% cheaper than Manhattan. The PATH train connects with downtown Manhattan in 10 minutes." },
    ],
  },
  stays:[
    { name:"The William Vale", area:"Williamsburg, Brooklyn", price:"$$$$", priceCAD:"$380–620 USD/night (World Cup period)", tags:["Boutique","Rooftop pool","Williamsburg"], note:"The hotel that reshaped Brooklyn's hospitality profile. Rooftop pool with Manhattan skyline views, Leuca restaurant (coastal Italian), and design-led rooms that justify the price. L train to Union Square, then NJ Transit to the stadium.", best_for:"Character", url:"https://booking.stay22.com/lagomplan/dgKD67DxZm" },
    { name:"Freehand New York", area:"Gramercy / Midtown South", price:"$$", priceCAD:"$150–280 USD/night by room type", tags:["Honest price","Rooftop","Near Penn Station"], note:"New York's reference hostel-hotel for the mid-range: private and hostel-style rooms, rooftop bar, careful design, and an optimal location. 15 minutes walking from Penn Station.", best_for:"Honest price", url:"https://booking.stay22.com/lagomplan/atCMX1HEsJ" },
    { name:"The St. Regis New York", area:"Midtown / Fifth Avenue", price:"$$$$", priceCAD:"$900–2,000 USD/night (World Cup period)", tags:["Luxury","Fifth Avenue","Since 1904"], note:"Since 1904, the address in New York most loaded with history and service. Four blocks from Penn Station. For the July 19 Final, this is the only address that requires no apology the morning after.", best_for:"Luxury", url:"https://booking.stay22.com/lagomplan/vIe7v-l4Gl" },
  ],
  logistics:{
    transport:[
      { icon:"🚆", title:"Master route — NJ Transit from Penn Station → MetLife", text:"NJ Transit runs direct trains from Penn Station (Manhattan) to MetLife station on match days. The trip takes 10–12 minutes and costs roughly $8–10 USD one way. Return service runs until the last fan leaves the stadium. There is no more direct, faster, or simpler train to the MetLife." },
      { icon:"✈", title:"From Newark (EWR) — the winning combo", text:"Newark Airport has a direct NJ Transit connection to Penn Station (Newark-Penn Station → New York Penn Station, ~25 minutes). From there, the train to MetLife. If you flew in, this combo gets you from plane to stadium in under 45 minutes without a single taxi or Uber." },
      { icon:"🎟", title:"Train ticket", text:"NJ Transit tickets at counter, Penn Station machines, or the official app. Special MetLife trains use stadium pricing. Arrive with time — Penn Station lines on big match days multiply." },
      { icon:"⚠️", title:"Critical error — assuming the subway reaches MetLife", text:"No MTA subway line reaches East Rutherford, New Jersey. The only public transit to the stadium is NJ Transit from Penn Station. Any routing app suggesting MTA subway routes to MetLife is giving you wrong information. Penn Station, NJ Transit, ten minutes. That's the way.", isWarning:true },
    ],
    timings:[
      { label:"Penn Station (Manhattan) → MetLife on NJ Transit", value:"~10–12 min" },
      { label:"EWR (airport) → NY Penn → MetLife", value:"~40 min total" },
      { label:"JFK → AirTrain + subway + NJ Transit", value:"~75–90 min" },
      { label:"Uber from Midtown Manhattan (match-day traffic)", value:"60–120 min · 2–3x fare" },
    ],
    matchDayCronologia:{
      matchName:"Jun 13 · Brazil vs. Morocco · 18:00 ET",
      steps:[
        { time:"H-3:00", text:"Eat lunch in Midtown or near Penn Station. Avoid crossing into Jersey at rush hour before the match." },
        { time:"H-2:00", text:"Head to Penn Station. The MetLife train starts 4 hours before kickoff." },
        { time:"H-1:30", text:"At the stadium. Gates open ~90 minutes ahead. Clear bag required." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:30", text:"NJ Transit back. The train runs frequently until the stadium empties — no rush, but no reason to linger either." },
      ],
    },
    timing:"MetLife Stadium is not in New York. It's in East Rutherford, New Jersey. That sentence should guide every transit decision in this guide.",
    cost:"Manhattan rates during big matches top $500 USD/night for the most basic options. Lodging strategy is the most important decision of this trip. Jersey City, Hoboken, and north Brooklyn are the most honest alternatives.",
  },
  vibeCards:[
    { title:"FIFA Fan Zone — USTA Billie Jean King Center (Queens)", type:"Official fan fest", typeColor:CORAL, desc:"Operates June 17–28 at the Queens tennis complex — during the group stage and first week of knockouts. Giant screens, activations, and the context of the borough's biggest sports complex. Access via subway 7 (Flushing-Main Street) or LIRR from Penn Station.", tag:"Jun 17–28" },
    { title:"Fan Village @ Rockefeller Center (Midtown)", type:"Official fan fest", typeColor:CORAL, desc:"Operates July 4–19 — the tournament's final stretch culminating in the Final. Rockefeller Center is the heart of Midtown: big-format outdoor screens in one of the world's most recognizable plazas. For the ticketless fan on the July 19 Final, this is the place.", tag:"Jul 4–19" },
    { title:"Brooklyn Bridge Park (DUMBO, Brooklyn)", type:"Outdoor screen", typeColor:FJORD, desc:"The park's terraces under the Brooklyn Bridge with views to the Lower Manhattan skyline are the city's most cinematic natural setting for an outdoor match. No fixed screen infrastructure, but local organizations activate broadcasts on the lawns for the biggest matches.", tag:"DUMBO" },
    { title:"Jackson Heights (Queens, Roosevelt Avenue)", type:"Latino neighborhood", typeColor:SAGE, desc:"For Colombia, Ecuador, Mexico, or Argentina matches, 74th Street in Jackson Heights — New York's densest Latin American neighborhood — becomes a stadium without a roof. No official screen: businesses drag their own out to the street and the street does the rest. The most authentic atmosphere in the host city, no contest.", tag:"Latino NYC" },
    { title:"Nevada Smith's (East Village)", type:"Historic soccer bar", typeColor:PINE, desc:"Manhattan's oldest soccer bar, open since 1999. Opens at 6am for European morning matches and holds that spirit through the World Cup. Sharp crowd, decent pub food, and the city's most authentic football atmosphere — without the corporate branding of newer sports bars.", tag:"Since 1999" },
    { title:"Louis Armstrong Stadium (Flushing)", type:"Stadium with screens", typeColor:"#1A3A5C", desc:"June 17–28, the USTA tennis stadium in Queens turns into an official non-FIFA broadcast zone with big-format screens. The context — in New York's most diverse borough, five minutes walking from Flushing Chinatown — turns every match into a global-diaspora gathering.", tag:"Flushing" },
  ],
  food:[
    { dish:"Nevada Smith's", where:"East Village — burger + draft beer; Manhattan's most serious football bar since 1999, no corporate branding", price:"$$", type:"Soccer bar" },
    { dish:"Elbow Room", where:"Williamsburg, Brooklyn — wings + local IPA; Brooklyn's reference football bar, loud during European matches", price:"$$", type:"Sports bar" },
    { dish:"La Silhouette", where:"Hell's Kitchen — classic burger + draft IPA; three blocks from Penn Station, theater-sized screen", price:"$$", type:"Pre-match" },
    { dish:"Dim sum in Flushing", where:"Queens — North America's most authentic Chinatown, 30 minutes on subway 7 from Times Square", price:"$–$$", type:"Neighborhood" },
    { dish:"Pizza by the slice", where:"Manhattan — the mandatory ritual; Joe's in the West Village and Prince Street Pizza are reference points", price:"$", type:"Ritual" },
    { dish:"Bagel with lox", where:"Upper West Side — Absolute Bagels or Zabar's; New York breakfast without apology", price:"$", type:"Local" },
  ],
  experiences:[
    { title:"MoMA + High Line + Chelsea", duration:"Half to full day", desc:"The Museum of Modern Art in Midtown holds the world's most important permanent contemporary-art collection — a Picasso, a Dalí, and a Frida Kahlo in the same room. Admission $30 USD; Fridays 4–8pm are free. For the afternoon, the High Line (the elevated linear park over the Chelsea rail tracks) connects the gallery district with Hudson Yards in a 2.5-kilometer walk.", type:"Art", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See info" },
    { title:"Flushing (Queens) — the real Chinatown", duration:"Half day", desc:"Manhattan's Chinatown is touristy. Flushing's, in Queens, is North America's largest and most authentic: five-floor covered markets, restaurants from every region of China, imported-ingredient stores, and a neighborhood energy with nothing to sell the casual visitor. Subway 7 from Times Square (30 minutes). Pair with the Fan Zone at the USTA Billie Jean King Center.", type:"Neighborhood", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See subway" },
    { title:"Staten Island Ferry + Smorgasburg", duration:"Morning or full day", desc:"The Staten Island ferry is free, runs 24 hours, and offers the best view of the Statue of Liberty and Lower Manhattan skyline from the water — no admission, no booking. For the Saturday between matches, Smorgasburg in Williamsburg (9am–4pm) is the city's most varied street-food market: 100 independent vendors on Marcy Avenue.", type:"No tourism", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See Smorgasburg" },
    { title:"Brooklyn — Williamsburg + Park Slope", duration:"Full day", desc:"Brooklyn has the best neighborhood-quality / price ratio in all of New York. Williamsburg: Smorgasburg, independent design shops, and the city's best coffee. Park Slope: brownstones, Prospect Park, family cafes. Subway L or F connects both.", type:"Neighborhood", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See options" },
  ],
  lagomTips:[
    "MetLife Stadium is NOT in New York. It's in East Rutherford, NJ. Only NJ Transit from Penn Station reaches the stadium — there is no MTA subway.",
    "June 13 (Brazil vs. Morocco), June 16 (France vs. Senegal), and July 19 (Final) are the tournament's three peak-demand dates.",
    "For the Final (Jul 19), three-star Manhattan hotels top $800 USD/night. Jersey City, Hoboken, and Newark are the rational alternatives.",
    "The Staten Island Ferry is free and offers the best view of the Statue of Liberty without cost or booking. Runs 24 hours.",
  ],
  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "NJ Transit ticket to MetLife Stadium",
    "Penn Station identified as your departure point",
    "Backup plan for post-match Uber surge pricing",
    "Clear bag required",
    "Light rain layer — open-air stadium, no roof",
    "Hotel reservation confirmed for Jun 13, Jul 19, or other peak date",
    "Return plan: board NJ Transit within the first 90 min post-match",
  ],
  didYouKnow:"MetLife Stadium will be the tournament's largest stadium (~82,500 seats in FIFA configuration) and host 8 matches — the most at any host city — including the July 19 Final. It's also the only 2026 World Cup stadium NOT located in the city that names it: it sits in East Rutherford, New Jersey.",
  closingNote:"New York / New Jersey is the host city for the match that closes the tournament. On July 19, 2026, MetLife Stadium in East Rutherford stages the Final of the largest World Cup in history. The city doesn't need it to assert its centrality — but the tournament needs it to land a finish worthy of the stage. For the fan arriving in June for Brazil vs. Morocco or France vs. Senegal, the same stadium, the same train station, and the same city will be there six weeks later when the trophy changes hands. LagomPlan gives you the route. The rest is history.",
  closingSignature:"Lagomplan · Field Guide · New York / New Jersey · World Cup 2026",
  plannerCTA:"Generate my New York trip",
}
