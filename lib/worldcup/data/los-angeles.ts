import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#C4622A'

export const es: CityGuide = {
  id:"la", city:"Los Ángeles", country:"Estados Unidos", state:"California", flag:"🇺🇸", accent:ACCENT,
  tags:["Fútbol","Gastronomía","Cultura","Sede inaugural"],
  stadium:{ name:"Los Angeles Stadium (SoFi Stadium)", capacity:"~70,000", area:"Inglewood — a 20 km del downtown de Los Ángeles" },
  headline:"El estadio más caro jamás construido está a tres millas del aeropuerto más cercano a cualquier estadio mundialista. En Los Ángeles, hasta las distancias son de película.",
  description:"El estadio más caro jamás construido alberga el partido del USMNT en casa. Los Ángeles no es una ciudad — es una región de diez millones de personas conectada por autopistas. Para el fan mundialista, eso significa una sola cosa: el transporte no se improvisa. La recompensa es una ciudad con la gastronomía más diversa de Norteamérica, playas a treinta minutos del estadio y una afición latinoamericana que hace que los partidos de México suenen como partidos de local.",
  scores:[
    { label:"Ambiente",          value:5 },
    { label:"Cultura futbolera", value:5 },
    { label:"Gastronomía",       value:5 },
    { label:"Costo",             value:1 },
  ],
  matches:[
    { id:"m1", date:"12 Jun", day:"Vie", time:"18:00 PT", teams:[{name:"Estados Unidos",flag:"🇺🇸"},{name:"Paraguay",flag:"🇵🇾"}], stadium:"SoFi Stadium", tag:"Grupo D — partido inaugural del USMNT en casa", highlight:true },
    { id:"m2", date:"15 Jun", day:"Dom", time:"18:00 PT", teams:[{name:"Irán",flag:"🇮🇷"},{name:"Nueva Zelanda",flag:"🇳🇿"}], stadium:"SoFi Stadium", tag:"Grupo G", highlight:false },
    { id:"m3", date:"18 Jun", day:"Jue", time:"12:00 PT", teams:[{name:"Suiza",flag:"🇨🇭"},{name:"Bosnia y Herzegovina",flag:"🇧🇦"}], stadium:"SoFi Stadium", tag:"Grupo B", highlight:false },
    { id:"m4", date:"21 Jun", day:"Dom", time:"12:00 PT", teams:[{name:"Bélgica",flag:"🇧🇪"},{name:"Irán",flag:"🇮🇷"}], stadium:"SoFi Stadium", tag:"Grupo G", highlight:false },
    { id:"m5", date:"25 Jun", day:"Jue", time:"19:00 PT", teams:[{name:"Estados Unidos",flag:"🇺🇸"},{name:"Türkiye",flag:"🇹🇷"}], stadium:"SoFi Stadium", tag:"Grupo D — USMNT necesita resultado para avanzar", highlight:true },
    { id:"m6", date:"28 Jun", day:"Dom", time:"09:00 PT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"SoFi Stadium", tag:"Ronda de 32 — 2°A vs. 2°B", highlight:false },
    { id:"m7", date:"2 Jul",  day:"Jue", time:"TBD",      teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"SoFi Stadium", tag:"Ronda de 32 — 1°H vs. 2°J", highlight:false },
    { id:"m8", date:"10 Jul", day:"Vie", time:"12:00 PT", teams:[{name:"Cuartos de Final",flag:""},{name:"Por definir",flag:""}], stadium:"SoFi Stadium", tag:"Cuartos de Final", highlight:true },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",          value:"Los Angeles Stadium (SoFi Stadium)" },
      { label:"Aforo",                 value:"~70,000 — configuración FIFA (el estadio más caro del mundo: $5,500 millones; techo translúcido de paneles ETFE que permite luz natural sin ser totalmente abierto)" },
      { label:"Clima (jun–jul)",       value:"Días: 22–27°C · Sin lluvia prácticamente garantizada · Noches: 15–18°C · Inglewood tiene un microclima más seco y cálido que Santa Mónica" },
      { label:"Partidos",              value:"8 confirmados — 5 grupos + 2 Rondas de 32 + 1 Cuartos de Final. El USMNT juega aquí el 12 y el 25 de junio." },
      { label:"Aeropuerto principal",  value:"LAX — Los Angeles International (a solo 5 km del estadio, el más cercano de todo el torneo; sin enlace Metro directo — K Line y shuttles son las opciones)" },
      { label:"Aeropuertos alternativos", value:"BUR — Hollywood Burbank (25 km) · LGB — Long Beach Municipal (35 km) · ONT — Ontario International (55 km, el más económico desde muchos mercados)" },
    ],
    body:"SoFi Stadium abre el torneo con el primer partido del USMNT en casa — el 12 de junio. Es el estadio más caro jamás construido — $5,500 millones — y está a 5 kilómetros del aeropuerto internacional de Los Ángeles, en el corredor de Inglewood. La ciudad de Los Ángeles tiene más de diez millones de personas, 150 idiomas y la mayor comunidad mexicana fuera de México.",
    // ⚠️ EDITORIAL NOTE: este body no existe en el .docx fuente — es contenido generado. Requiere validación o reemplazo por texto aprobado.
    lagomNote:"El 12 de junio (USMNT vs. Paraguay) y el 25 de junio (USMNT vs. Türkiye) son las dos fechas de mayor demanda. La ruta correcta al estadio es el Metro K Line (Crenshaw) → estación Downtown Inglewood → shuttle oficial. Para el partido inaugural del USMNT, reserva el transporte con anticipación.",
  },
  vibe:{
    body:"La mayor comunidad mexicana de Estados Unidos convierte los partidos de El Tri en eventos de dimensión diferente. La comunidad de la diáspora latinoamericana en Los Ángeles tiene profundidad real: mexicanos, guatemaltecos, salvadoreños, colombianos — todos con clubes y tradiciones en la misma ciudad. Los Angeles FC y LA Galaxy tienen bases de afición organizadas que funcionan bien antes y después de los partidos del torneo. Fuera del fútbol, Los Ángeles tiene la cocina callejera más diversa del continente, playas a treinta minutos del estadio y museos de clase mundial gratuitos los martes.",
    lagomNote:"El partido inaugural del USMNT (12 de junio, 18:00 PT) y el partido decisivo contra Türkiye (25 de junio, 19:00 PT) son las dos fechas de mayor demanda de la sede. Para ambas: K Line reservado con anticipación, hotel confirmado y no planees Uber post-partido.",
  },
  stayNeighborhoods:{
    intro:"Los Ángeles es la ciudad más extensa del torneo — y la que menos necesita que el fan se quede en un solo barrio. El estadio está en Inglewood, al suroeste. El Metro K Line conecta el corredor central con el área del estadio. La elección de base define cuánto tiempo pasas en el carro.",
    items:[
      { kind:"recommended", title:"Base recomendada: Culver City", body:"El punto de equilibrio del viaje mundialista en LA. Está a mitad de camino entre el estadio (Inglewood, al sur), la playa (Santa Mónica, al oeste) y el downtown (al este). El Metro E Line lo conecta con Expo/Crenshaw, desde donde el K Line baja hacia el área del estadio. Los hoteles como The Shay (Hyatt) tienen diseño, logística y una escena gastronómica que explotó en los últimos cinco años. Para el fan que quiere moverse sin auto y tener ciudad entre partidos, Culver City funciona." },
      { kind:"alternative", title:"Días sin partido: Silver Lake / Echo Park", body:"El LA que no vive en el poster de Hollywood. Murales, cafeterías de especialidad, mercados de productores y la mejor escena de tacos del este de la ciudad. Para el fan que quiere ver LA de verdad entre partidos de Bélgica y el USMNT. Conecta por Metro D Line." },
      { kind:"alternative", title:"Zona con criterio: Inglewood (Hollywood Park District)", body:"Quedarse en Inglewood es la opción más conveniente para los partidos, pero con matices. El Hollywood Park District — la zona inmediata al estadio — es nuevo, seguro y tiene restaurantes y hoteles de cadena bien posicionados. Para el fan con varios partidos que quiere minimizar el tiempo de traslado y no necesita vivir la ciudad entre fechas, funciona." },
      { kind:"alternative", title:"Para el partido del 12 de junio solamente: LAX Corridor (El Segundo / Manhattan Beach)", body:"Si el plan es llegar el día del USMNT, ver el partido y seguir viaje, El Segundo o Manhattan Beach tienen hoteles a quince minutos en auto del estadio, acceso a LAX para la salida y precios más razonables que el corredor de Santa Mónica. No hay vida de barrio equiparable al west side, pero la logística es limpia." },
    ],
  },
  stays:[
    { name:"The Line Hotel", area:"Koreatown / Mid-City", price:"$$$", priceCAD:"$200–350 USD/noche (periodo mundialista)", tags:["Diseño","Restaurante de autor","Metro Vermont-Beverly"], note:"El hotel con más personalidad del corredor de Koreatown: arquitectura de los años 60 reformada, restaurantes de Roy Choi y acceso al metro Red Line (Vermont-Beverly a 5 min a pie). Desde ahí, shuttle o Uber al SoFi en 20 minutos. La mejor combinación de carácter y logística mundialista.", best_for:"Carácter", hotel_link:"https://booking.stay22.com/lagomplan/6sr9_HBZR0", archetypes: [] },
    { name:"Freehand Los Angeles", area:"Downtown LA / Koreatown", price:"$$", priceCAD:"$120–250 USD/noche (periodo mundialista)", tags:["Smart value","Bar de referencia","Metro cerca"], note:"El hotel de referencia para el viajero con criterio y presupuesto calibrado. Bar en el rooftop, habitaciones privadas bien diseñadas y acceso al metro Red Line desde Wilshire/Vermont. La opción más honesta del torneo para quien quiere ciudad y no solo precio.", best_for:"Smart value", hotel_link:"https://expedia.stay22.com/lagomplan/9h1rXGSH11", archetypes: ['Parejas'] },
    { name:"The West Hollywood Edition", area:"West Hollywood / Sunset Strip", price:"$$$$", priceCAD:"$600–1,200 USD/noche (periodo mundialista)", tags:["Lujo","Piscina en techo","Sunset Strip"], note:"La dirección más impresionante del torneo en Los Ángeles: piscina de diseño con vistas al Hollywood Sign, restaurante del chef John Fraser y ambiente de quienes vienen a LA a hacer algo importante. Para el partido inaugural, la imagen del 12 de junio en West Hollywood no tiene equivalente en ninguna otra sede.", best_for:"Lujo", hotel_link:"https://hotelscom.stay22.com/lagomplan/idtJtZYsk8", archetypes: ['Parejas'] },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Los Ángeles — LAX", text:"LAX está a solo 5 km del SoFi Stadium — el aeropuerto más cercano a cualquier estadio de todo el torneo. Pero no hay Metro directo. El FlyAway Bus conecta LAX con el Metro Green/C Line (Aviation/LAX), luego K Line al estadio. O el shuttle gratuito del LAX al Metro Transit Center y desde ahí el K Line. Uber desde LAX al estadio: 10–20 minutos sin tráfico de partido; 30–60 con él." },
      { icon:"🚇", title:"Ruta maestra — Metro K Line → Downtown Inglewood → shuttle", text:"Metro K Line (Crenshaw) → estación Downtown Inglewood → shuttle oficial cada 3–5 min o caminata de ~15 min al estadio. Desde Culver City: E Line hasta Expo/Crenshaw, transbordo al K Line hasta Downtown Inglewood. Total: 20–30 minutos. Desde Downtown LA: A Line o E Line hasta 7th/Metro Center, luego E Line hasta Expo/Crenshaw y K Line. Total: 40–50 minutos. Tarifa: $1.75 con TAP card." },
      { icon:"🚌", title:"Desde LAX — la ruta más corta del torneo", text:"LAX está a 5 km del estadio. Las opciones: LAX FlyAway Bus al Metro Green/C Line (estación Aviation/LAX), luego K Line al estadio. O shuttle gratuito LAX al Metro Transit Center, luego K Line. Total: 25–40 minutos. La combinación más eficiente aeropuerto-estadio del torneo completo." },
      { icon:"⚠️", title:"Error crítico — ir en auto el 12 o el 25 de junio", text:"La I-405 entre la I-10 y el LAX es, en día de partido grande en SoFi, una de las congestiones más predecibles de la ciudad más congestionada de Estados Unidos. La Century Blvd — la única entrada directa a Hollywood Park — queda cortada por zonas de seguridad FIFA. El parking oficial el 12 de junio cuesta entre $80 y $250 por vehículo. El K Line va directo, cuesta $1.75 y no se detiene por el tráfico. La comparación es definitiva.", isWarning:true },
    ],
    timings:[
      { label:"Desde Culver City (Metro E+K)",               value:"~25 minutos" },
      { label:"Desde Santa Mónica (Metro E+K)",              value:"~45 minutos" },
      { label:"Desde Downtown LA (Metro E+K)",               value:"~50 minutos" },
      { label:"Desde LAX en Metro (FlyAway + C Line + K Line)", value:"~35 minutos" },
      { label:"Uber desde Beverly Hills / West Hollywood",   value:"50–90 min con tráfico mundialista · x3–5 precio" },
    ],
    matchDayCronologia:{
      matchName:"12 Jun · USMNT vs. Paraguay · 18:00 PT",
      steps:[
        { time:"H-4:00", text:"Almuerza en tu barrio base. Los alrededores del estadio no tienen la oferta gastronómica que justifica comer ahí." },
        { time:"H-3:00", text:"Sale hacia el Metro. El 12 de junio, el área de Inglewood empieza a saturarse desde el mediodía." },
        { time:"H-2:00", text:"K Line desde Expo/Crenshaw. Shuttle al estadio desde Downtown Inglewood. Llega con margen para la seguridad exterior." },
        { time:"H-1:30", text:"Dentro del estadio. Puertas abiertas. El techo translúcido de SoFi atrapa el calor de la tarde — lleva una capa para la noche." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Partido — el primero del USMNT en casa, en el estadio más caro del mundo." },
        { time:"H+1:45", text:"K Line de regreso desde Downtown Inglewood. Primera salida disponible. No pidas Uber frente al estadio — la espera supera los 45 minutos y el precio es de otro torneo." },
      ],
    },
    timing:"SoFi Stadium está en Inglewood, a 5 km de LAX y a 20 km del downtown de Los Ángeles. El Metro K Line (Crenshaw) → Downtown Inglewood Station es la ruta más confiable. El tráfico de LA en día de partido grande no tiene parangón con ninguna otra ciudad del torneo.",
    cost:"Una de las ciudades más caras del torneo. El periodo mundialista coincide con la temporada alta de LA. Considera Airbnb en Culver City, Mid-City o Silver Lake — barrios bien comunicados y a precios más razonables que West Hollywood o Santa Mónica.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Los Angeles Memorial Coliseum", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest de LA toma el Coliseum olímpico — el mismo estadio donde se celebraron los Juegos Olímpicos de 1932 y 1984. El contexto es histórico en sí mismo. Pantallas gigantes en el interior, conciertos durante el período mundialista y acceso por Metro E Line (estación Expo Park/USC). Para el 12 de junio, el Fan Fest es el segundo estadio de la ciudad — presente sin boleto.", tag:"Sin boleto OK" },
    { title:"Venice Beach (boardwalk / pantalla oficial)", type:"Pantalla exterior", typeColor:FJORD, desc:"Confirmado como zona fan oficial de la ciudad, el paseo marítimo de Venice tiene pantallas exteriores para los partidos de la sede. Ver el partido del USMNT del 12 de junio con el Pacífico de fondo y los artistas callejeros de Venice como telón es el plan mundialista más californiano disponible.", tag:"Pacífico" },
    { title:"LA Plaza de Cultura y Artes (Downtown / Olvera Street)", type:"Zona fan histórica", typeColor:SAGE, desc:"El museo y espacio cultural mexicano-americano junto a la calle Olvera — la más antigua de Los Ángeles, activa desde 1781 — tiene confirmada actividad mundialista como zona fan de la ciudad. Para los partidos de México (aunque se jueguen en otras sedes), LA Plaza convoca a la comunidad mexicana del downtown con el contexto histórico correcto.", tag:"Olvera Street" },
    { title:"Grand Park (Downtown)", type:"Parque cívico", typeColor:PINE, desc:"El parque entre el Ayuntamiento y el Music Center — el 'parque de todos' de Los Ángeles — instala pantallas para eventos cívicos de alto perfil. Para el 12 de junio (USMNT vs. Paraguay), el parque activa sus pantallas como extensión natural del Fan Fest del Coliseum.", tag:"Civic Center" },
    { title:"Koreatown — partidos de Corea del Sur", type:"Barrio", typeColor:"#1A3A5C", desc:"El Koreatown de Los Ángeles es la comunidad coreana más grande fuera de Korea. Cuando juega Corea del Sur, las calles de Wilshire y Vermont se cierran informalmente — bares, restaurantes y karaokes transmiten en simultáneo y la comunidad corea desde las ventanas. El ambiente más orgánico de la sede, sin Fan Fest ni pantallas organizadas.", tag:"Auténtico" },
    { title:"Guelaguetza (Koreatown)", type:"Restaurante histórico", typeColor:"#5A3A2A", desc:"Una institución de LA (James Beard Award). Sus pantallas son enormes y el ambiente durante los partidos de México o del USMNT es de estadio. Para el 12 de junio, la comunidad mexicana de Koreatown convierte Guelaguetza en el punto de reunión más ruidoso y más sabroso de la ciudad.", tag:"Oaxaqueño" },
  ],
  food:[
    { dish:"Guelaguetza",                where:"Koreatown — festival de moles + mezcal; institución James Beard Award, pantallas enormes, estadio en partidos de México y USMNT", price:"$$–$$$", type:"Oaxaqueño" },
    { dish:"The Greyhound",              where:"Highland Park — alitas + cerveza artesanal de California; gastropub europeo más honesto del este de LA, con sonido de estadio activado", price:"$$",   type:"Gastropub" },
    { dish:"Wirtshaus",                  where:"La Brea — schnitzel + pretzel gigante + cerveza alemana de barril; mesas comunales, siempre transmiten fútbol internacional", price:"$$",   type:"Alemán" },
    { dish:"Grand Central Market",       where:"Downtown LA — 40 puestos desde 1917; tacos de guisado, pupusas, pho y café de especialidad bajo el mismo techo histórico", price:"$–$$", type:"Mercado" },
    { dish:"Taquerías de East LA",       where:"Boyle Heights / El Sereno — carnitas, birria y machaca a $3; el argumento más repetido de cualquier fan latinoamericano que visita la sede", price:"$",    type:"Local" },
    { dish:"Trucks del Mercado El Sereno", where:"El Sereno — el mejor mercado callejero del condado; cocina regional mexicana sin adaptación para el turista", price:"$",    type:"Sin turismo" },
  ],
  experiences:[
    { title:"Griffith Observatory + LACMA + Urban Light", duration:"Tarde completa", desc:"El Griffith Observatory en los cerros de Los Feliz tiene la mejor vista del skyline de LA — desde el Hollywood Sign hasta el Pacífico en días despejados — sin costo de entrada a las áreas exteriores. Para la tarde, el Museo de Arte del Condado de Los Ángeles (LACMA) en Wilshire tiene la mayor colección de arte latinoamericano de Occidente. La instalación 'Urban Light' de Chris Burden en la entrada — 202 farolas de hierro fundido — es gratuita y la fotografía más replicada de la ciudad. Acceso por Metro D Line (estación Wilshire/Fairfax).", type:"Arte", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver información" },
    { title:"Venice Beach + Abbot Kinney + Santa Mónica", duration:"Tarde completa", desc:"El paseo marítimo de Venice es el carnaval permanente de LA: patinadores, artistas callejeros, Muscle Beach y la mezcla humana más democrática de la ciudad. A tres calles de la playa, Abbot Kinney Boulevard tiene tiendas de diseño independiente y restaurantes que justifican el desvío. El atardecer desde el muelle de Santa Mónica cierra el día con el Pacífico como telón. Metro E Line llega a los dos extremos.", type:"Playa", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Alquilar bicicleta" },
    { title:"Universal Studios + California Science Center + Expo Park", duration:"Día completo", desc:"Para familias con niños, Universal Studios Hollywood (Metro B/D Line a Universal City/Studio City) ofrece el parque de atracciones más completo de la Costa Oeste. La opción gratuita y más subestimada: el California Science Center en Exposition Park, junto al Memorial Coliseum donde está el Fan Fest. Admisión general gratuita, con el único transbordador espacial completo del mundo — el Endeavour — como pieza central desde 2023. Perfecto como plan en cualquier día sin partido entre el 12 y el 28 de junio.", type:"Familiar", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver entradas" },
    { title:"Mercado de El Sereno + Boyle Heights", duration:"Mañana", desc:"Para el fan latinoamericano que quiere salir del circuito del west side: El Sereno y Boyle Heights tienen la mayor concentración de familias mexicanas de Los Ángeles, los mejores carnitas del condado y murales que documentan décadas de historia política y cultural que no aparecen en ninguna guía de turismo mainstream. A 25 minutos del downtown en Metro L Line (Gold Line). Este plan no tiene App ni mapa turístico — solo colonia, tortillería y taco.", type:"Sin turismo", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver opciones" },
  ],
  lagomTips:[
    "El 12 de junio (USMNT vs. Paraguay, 18:00 PT) y el 25 de junio (USMNT vs. Türkiye, 19:00 PT) son las dos fechas de mayor demanda de la sede. Para ambos: K Line planificado con anticipación, hotel confirmado meses antes y no planees Uber post-partido.",
    "La ruta correcta al estadio: Metro K Line (Crenshaw) → estación Downtown Inglewood → shuttle oficial o caminata de ~15 min. No hay C Line en LA Metro — es el K Line. Cuesta $1.75 con TAP card.",
    "El costo de LA en temporada mundialista es el más alto del torneo después de Nueva York. Considera Airbnb en Hawthorne, Lawndale o Gardena — barrios bien conectados por bus al área del estadio con precios significativamente más bajos.",
    "La gastronomía de LA es la más diversa de todo el torneo. Guelaguetza en Koreatown, las taquerías de Boyle Heights y el Grand Central Market son el punto de partida — el resto lo define el barrio desde el que estés operando.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Ruta K Line planificada: E Line → Expo/Crenshaw → K Line → Downtown Inglewood → shuttle",
    "Protector solar — el techo translúcido de SoFi protege del sol pero no del calor",
    "Ropa ligera para Inglewood (microclima más cálido que el west side)",
    "Agua antes de salir — stadium no tiene A/C",
    "Sin plan de Uber post-partido — espera de 45–90 min en surge",
    "Reserva hotel para 12 junio (USMNT inaugural) y 25 junio (USMNT vs. Türkiye) con máxima anticipación",
    "Llegada al estadio 90 min antes — puertas abren H-1:30",
  ],
  didYouKnow:"SoFi Stadium costó $5,500 millones de dólares — el estadio más caro jamás construido en la historia. Su techo translúcido de paneles ETFE permite la luz natural sin ser totalmente abierto — protege del sol sin cerrar el estadio al exterior. Está a solo 5 kilómetros del LAX, la distancia más corta entre aeropuerto y estadio de todo el torneo. Los Ángeles fue sede de la Final del Mundial 1994 en el Rose Bowl — este torneo regresa a la misma ciudad, en un estadio completamente diferente.",
  closingNote:"Los Ángeles no es una ciudad que se deja agotar en una semana. El Mundial le da siete partidos, incluyendo el inaugural y potencialmente el de México en casa. Lo que LA hace con eso depende de si sabes usar el shuttle, elegir el barrio correcto y no confundir '30 minutos en Google Maps' con '30 minutos en la realidad'. LagomPlan te da la ruta, el hotel en el barrio indicado y la taquería donde los ángeles comen de verdad. El Pacífico hace el resto.",
  closingSignature:"Lagomplan · Guía de campo · Los Ángeles · Mundial 2026",
  plannerCTA:"Generar mi viaje a Los Ángeles",
}

export const en: CityGuide = {
  id:"la", city:"Los Angeles", country:"United States", state:"California", flag:"🇺🇸", accent:ACCENT,
  tags:["Football","Food","Culture","Opening host"],
  stadium:{ name:"Los Angeles Stadium (SoFi Stadium)", capacity:"~70,000", area:"Inglewood — 20 km from downtown Los Angeles" },
  headline:"The most expensive stadium ever built hosts the USMNT's first home match. In Los Angeles, even the distances are cinematic.",
  description:"The most expensive stadium ever built hosts the USMNT's first home match. Los Angeles isn't a city — it's a ten-million-person region stitched together by freeways. For the World Cup fan, that means one thing: transit can't be improvised. The reward is North America's most diverse food scene, beaches thirty minutes from the stadium, and a Latin American community that turns Mexico matches into home games.",
  scores:[
    { label:"Atmosphere",       value:5 },
    { label:"Football culture", value:5 },
    { label:"Food",             value:5 },
    { label:"Cost",             value:1 },
  ],
  matches:[
    { id:"m1", date:"Jun 12", day:"Fri", time:"18:00 PT", teams:[{name:"United States",flag:"🇺🇸"},{name:"Paraguay",flag:"🇵🇾"}], stadium:"SoFi Stadium", tag:"Group D — USMNT home opener", highlight:true },
    { id:"m2", date:"Jun 15", day:"Sun", time:"18:00 PT", teams:[{name:"Iran",flag:"🇮🇷"},{name:"New Zealand",flag:"🇳🇿"}], stadium:"SoFi Stadium", tag:"Group G", highlight:false },
    { id:"m3", date:"Jun 18", day:"Thu", time:"12:00 PT", teams:[{name:"Switzerland",flag:"🇨🇭"},{name:"Bosnia & Herzegovina",flag:"🇧🇦"}], stadium:"SoFi Stadium", tag:"Group B", highlight:false },
    { id:"m4", date:"Jun 21", day:"Sun", time:"12:00 PT", teams:[{name:"Belgium",flag:"🇧🇪"},{name:"Iran",flag:"🇮🇷"}], stadium:"SoFi Stadium", tag:"Group G", highlight:false },
    { id:"m5", date:"Jun 25", day:"Thu", time:"19:00 PT", teams:[{name:"United States",flag:"🇺🇸"},{name:"Türkiye",flag:"🇹🇷"}], stadium:"SoFi Stadium", tag:"Group D — USMNT needs result to advance", highlight:true },
    { id:"m6", date:"Jun 28", day:"Sun", time:"09:00 PT", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"SoFi Stadium", tag:"Round of 32 — 2°A vs. 2°B", highlight:false },
    { id:"m7", date:"Jul 2",  day:"Thu", time:"TBD",      teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"SoFi Stadium", tag:"Round of 32 — 1°H vs. 2°J", highlight:false },
    { id:"m8", date:"Jul 10", day:"Fri", time:"12:00 PT", teams:[{name:"Quarterfinal",flag:""},{name:"TBD",flag:""}], stadium:"SoFi Stadium", tag:"Quarterfinal", highlight:true },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",              value:"Los Angeles Stadium (SoFi Stadium)" },
      { label:"Capacity",                  value:"~70,000 — FIFA configuration (the world's most expensive stadium: $5.5 billion; translucent ETFE-panel roof that lets natural light in without being fully open)" },
      { label:"Weather (Jun–Jul)",         value:"Days: 22–27°C · Virtually no rain · Nights: 15–18°C · Inglewood has a drier, warmer microclimate than Santa Monica or the west side" },
      { label:"Matches",                   value:"8 confirmed — 5 group stage + 2 Rounds of 32 + 1 Quarterfinal. USMNT plays here on June 12 and June 25." },
      { label:"Primary airport",           value:"LAX — Los Angeles International (just 5 km from the stadium — the closest airport-to-stadium distance in the entire tournament; no direct Metro link — K Line and shuttles are the options)" },
      { label:"Alternative airports",      value:"BUR — Hollywood Burbank (25 km) · LGB — Long Beach Municipal (35 km) · ONT — Ontario International (55 km, cheapest from many markets)" },
    ],
    body:"SoFi Stadium opens the USMNT's home schedule on June 12. It's the most expensive stadium ever built — $5.5 billion — and sits 5 kilometers from Los Angeles' international airport, in the Inglewood corridor. The city has more than ten million people, 150 languages, and the largest Mexican community outside Mexico.",
    // ⚠️ EDITORIAL NOTE: this body does not exist in the source .docx — it is generated content. Requires validation or replacement with approved text.
    lagomNote:"June 12 (USMNT vs. Paraguay) and June 25 (USMNT vs. Türkiye) are the host city's two peak-demand dates. The correct route to the stadium is Metro K Line (Crenshaw) → Downtown Inglewood Station → FIFA shuttle. Book transit in advance for the USMNT opener.",
  },
  vibe:{
    body:"The largest Mexican community in the United States turns El Tri matches into a different scale of event. The Latin American diaspora in Los Angeles has real depth: Mexicans, Guatemalans, Salvadorans, Colombians — all with clubs and traditions in the same city. Los Angeles FC and LA Galaxy have organized supporter bases that work well before and after tournament matches. Beyond football, Los Angeles has the most diverse street food on the continent, beaches thirty minutes from the stadium, and world-class museums that are free on Tuesdays.",
    lagomNote:"The USMNT opener (June 12, 18:00 PT) and the decisive Group D match against Türkiye (June 25, 19:00 PT) are the host city's two peak-demand dates. For both: K Line planned ahead, hotel confirmed months out, and no post-match Uber plan.",
  },
  stayNeighborhoods:{
    intro:"Los Angeles is the largest city in the tournament — and the one that least requires a fan to stay in a single neighborhood. The stadium is in Inglewood, to the southwest. The Metro K Line connects the central corridor with the stadium area. Picking a base defines how much time you spend in the car.",
    items:[
      { kind:"recommended", title:"Recommended base: Culver City", body:"The balance point of the LA World Cup trip. Halfway between the stadium (Inglewood, south), the beach (Santa Monica, west), and downtown (east). The Metro E Line connects it with Expo/Crenshaw, where the K Line drops south toward the stadium area. Hotels like The Shay (Hyatt) bring design, logistics, and a food scene that exploded in the last five years. For the fan who wants to move without a car and have a city between matches, Culver City works." },
      { kind:"alternative", title:"Off-match days: Silver Lake / Echo Park", body:"The LA that doesn't live on the Hollywood poster. Murals, specialty coffee, farmers' markets, and the best taco scene on the city's east side. For the fan who wants real LA between Belgium and USMNT matches. Connects via Metro D Line." },
      { kind:"alternative", title:"A judgment call: Inglewood (Hollywood Park District)", body:"Staying in Inglewood is the most convenient option for matches, with caveats. The Hollywood Park District — the area immediately next to the stadium — is new, safe, and has well-positioned chain hotels and restaurants. For the fan with multiple matches who wants to minimize transit time and doesn't need to live the city between dates, it works." },
      { kind:"alternative", title:"For the June 12 match only: LAX Corridor (El Segundo / Manhattan Beach)", body:"If the plan is to land for the USMNT match, watch it, and continue traveling, El Segundo or Manhattan Beach have hotels fifteen minutes by car from the stadium, LAX access for the departure, and more reasonable prices than the Santa Monica corridor. No neighborhood life comparable to the west side, but the logistics are clean." },
    ],
  },
  stays:[
    { name:"The Line Hotel", area:"Koreatown / Mid-City", price:"$$$", priceCAD:"$200–350 USD/night (World Cup period)", tags:["Design","Chef-driven restaurant","Metro Vermont-Beverly"], note:"The most characterful hotel in the Koreatown corridor: renovated 1960s architecture, restaurants by Roy Choi, and Red Line access (Vermont-Beverly, 5 min on foot). From there, shuttle or Uber to SoFi in 20 minutes. The best combination of character and World Cup logistics.", best_for:"Character", hotel_link:"https://booking.stay22.com/lagomplan/6sr9_HBZR0" },
    { name:"Freehand Los Angeles", area:"Downtown LA / Koreatown", price:"$$", priceCAD:"$120–250 USD/night (World Cup period)", tags:["Smart value","Notable bar","Metro close"], note:"The reference hotel for the traveler with judgment and a measured budget. Rooftop bar, well-designed private rooms, and Red Line access from Wilshire/Vermont. The most honest option in the tournament for anyone who wants city, not just price.", best_for:"Smart value", hotel_link:"https://expedia.stay22.com/lagomplan/9h1rXGSH11" },
    { name:"The West Hollywood Edition", area:"West Hollywood / Sunset Strip", price:"$$$$", priceCAD:"$600–1,200 USD/night (World Cup period)", tags:["Luxury","Rooftop pool","Sunset Strip"], note:"The tournament's most impressive address in Los Angeles: design pool with Hollywood Sign views, chef John Fraser's restaurant, and the crowd of people who come to LA to do something important. For the opening match, the image of June 12 in West Hollywood has no equivalent in any other host city.", best_for:"Luxury", hotel_link:"https://hotelscom.stay22.com/lagomplan/idtJtZYsk8" },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Los Angeles — LAX", text:"LAX sits just 5 km from SoFi Stadium — the closest airport-to-stadium distance in the entire tournament. But there's no direct Metro link. Options: LAX FlyAway Bus to the Metro Green/C Line (Aviation/LAX stop), then K Line to the stadium. Or the free LAX shuttle to the Metro Transit Center, then K Line. Uber from LAX to the stadium: 10–20 minutes without match-day traffic; 30–60 with it." },
      { icon:"🚇", title:"Master route — Metro K Line → Downtown Inglewood → shuttle", text:"Metro K Line (Crenshaw) → Downtown Inglewood Station → official FIFA shuttle every 3–5 min or a ~15-minute walk to the stadium. From Culver City: E Line to Expo/Crenshaw, transfer to K Line to Downtown Inglewood. Total: 20–30 minutes. From downtown LA: A Line or E Line to 7th/Metro Center, then E Line to Expo/Crenshaw and K Line. Total: 40–50 minutes. Fare: $1.75 with TAP card." },
      { icon:"🚌", title:"From LAX — the shortest airport-to-stadium route in the tournament", text:"LAX is 5 km from the stadium. Options: LAX FlyAway Bus to Metro Green/C Line (Aviation/LAX), then K Line to the stadium. Or free LAX shuttle to Metro Transit Center, then K Line. Total: 25–40 minutes. The most efficient airport-to-venue combination of the entire tournament." },
      { icon:"⚠️", title:"Critical error — driving on June 12 or June 25", text:"The I-405 between the I-10 and LAX is, on a major SoFi match day, one of the most predictably congested roads in the most congested city in the United States. Century Blvd — the only direct access to Hollywood Park — is cut off by FIFA security zones. Official parking on June 12 starts at $80 and reaches $250 per vehicle. The K Line is direct, costs $1.75, and isn't affected by traffic. The comparison is decisive.", isWarning:true },
    ],
    timings:[
      { label:"From Culver City (Metro E+K)",                   value:"~25 minutes" },
      { label:"From Santa Monica (Metro E+K)",                  value:"~45 minutes" },
      { label:"From Downtown LA (Metro E+K)",                   value:"~50 minutes" },
      { label:"From LAX via Metro (FlyAway + C Line + K Line)", value:"~35 minutes" },
      { label:"Uber from Beverly Hills / West Hollywood",       value:"50–90 min with World Cup traffic · 3–5x surge" },
    ],
    matchDayCronologia:{
      matchName:"Jun 12 · USMNT vs. Paraguay · 18:00 PT",
      steps:[
        { time:"H-4:00", text:"Eat in your base neighborhood. The areas around the stadium don't have the food options that justify eating there." },
        { time:"H-3:00", text:"Head to the Metro. On June 12, the Inglewood area starts saturating from midday." },
        { time:"H-2:00", text:"K Line from Expo/Crenshaw. Shuttle to the stadium from Downtown Inglewood. Arrive with buffer for exterior security." },
        { time:"H-1:30", text:"Inside the stadium. Gates open. The SoFi translucent roof traps afternoon heat — bring a layer for the evening." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready." },
        { time:"H+0:00", text:"Match — the USMNT's first home game, in the world's most expensive stadium." },
        { time:"H+1:45", text:"K Line back from Downtown Inglewood. First available departure. Don't request Uber at the stadium — the wait tops 45 minutes and the price is from another tournament." },
      ],
    },
    timing:"SoFi Stadium is in Inglewood, 5 km from LAX and 20 km from downtown Los Angeles. Metro K Line (Crenshaw) → Downtown Inglewood Station is the most reliable route. LA traffic on a major match day is unparalleled by any other city in the tournament.",
    cost:"One of the tournament's most expensive cities. The World Cup period overlaps with LA's high season. Consider Airbnb in Culver City, Mid-City, or Silver Lake — well-connected neighborhoods at rates more reasonable than West Hollywood or Santa Monica.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Los Angeles Memorial Coliseum", type:"Official fan fest", typeColor:CORAL, desc:"LA's Fan Fest takes over the Olympic Coliseum — the same stadium that hosted the 1932 and 1984 Olympic Games. The context is historic in itself. Giant screens inside, concerts scheduled throughout the World Cup period, and access via Metro E Line (Expo Park/USC station). For June 12, the Fan Fest becomes the city's second stadium — no ticket needed.", tag:"No ticket needed" },
    { title:"Venice Beach (boardwalk / official screen)", type:"Outdoor screen", typeColor:FJORD, desc:"Confirmed as an official fan zone for the city, Venice's boardwalk has outdoor screens for the host city's matches. Watching the USMNT on June 12 with the Pacific as backdrop and Venice's street performers as the support act is the most Californian World Cup plan available.", tag:"Pacific" },
    { title:"LA Plaza de Cultura y Artes (Downtown / Olvera Street)", type:"Fan zone", typeColor:SAGE, desc:"The Mexican-American cultural museum and space next to Olvera Street — the oldest in Los Angeles, active since 1781 — has confirmed World Cup fan-zone programming. For Mexico matches (even when played elsewhere), LA Plaza draws the downtown Mexican community with the historically right context.", tag:"Olvera Street" },
    { title:"Grand Park (Downtown)", type:"Civic park", typeColor:PINE, desc:"The park between City Hall and the Music Center — LA's 'park for everyone' — activates screens for high-profile civic events. For June 12 (USMNT vs. Paraguay), the park runs its screens as a natural extension of the Coliseum Fan Fest.", tag:"Civic Center" },
    { title:"Koreatown — South Korea matches", type:"Neighborhood", typeColor:"#1A3A5C", desc:"LA's Koreatown is the largest Korean community outside Korea. When South Korea plays, the streets of Wilshire and Vermont informally shut down — bars, restaurants, and karaoke rooms broadcast in sync and the community cheers from the windows. The most organic atmosphere in the host city, no Fan Fest, no organized screens.", tag:"Authentic" },
    { title:"Guelaguetza (Koreatown)", type:"Historic restaurant", typeColor:"#5A3A2A", desc:"A Los Angeles institution (James Beard Award). Its screens are enormous and the atmosphere during Mexico or USMNT matches is stadium-level. For June 12, the Koreatown Mexican community turns Guelaguetza into the loudest and most flavorful gathering point in the city.", tag:"Oaxacan" },
  ],
  food:[
    { dish:"Guelaguetza",                where:"Koreatown — festival de moles + mezcal; James Beard Award institution, enormous screens, stadium atmosphere for Mexico and USMNT matches", price:"$$–$$$", type:"Oaxacan" },
    { dish:"The Greyhound",              where:"Highland Park — wings + California craft beer; the most honest European-style gastropub on the east side of LA, with stadium sound on big matches", price:"$$",   type:"Gastropub" },
    { dish:"Wirtshaus",                  where:"La Brea — schnitzel + giant pretzel + German draft beer; long communal tables, always showing international football", price:"$$",   type:"German" },
    { dish:"Grand Central Market",       where:"Downtown LA — 40 stalls since 1917; guisado tacos, pupusas, pho, and specialty coffee under the same historic roof", price:"$–$$", type:"Market" },
    { dish:"East LA taquerías",          where:"Boyle Heights / El Sereno — carnitas, birria, and machaca at $3; the most repeated argument of any Latin American fan who visits the host city", price:"$",    type:"Local" },
    { dish:"El Sereno market trucks",    where:"El Sereno — the county's best street market; regional Mexican cooking without adaptation for the tourist", price:"$",    type:"No tourism" },
  ],
  experiences:[
    { title:"Griffith Observatory + LACMA + Urban Light", duration:"Full afternoon", desc:"The Griffith Observatory in the Los Feliz hills has the best view of the LA skyline — from the Hollywood Sign to the Pacific on clear days — with no entry fee for the outdoor areas. For the afternoon, the Los Angeles County Museum of Art (LACMA) on Wilshire holds the Western world's largest Latin American art collection. Chris Burden's 'Urban Light' installation at the entrance — 202 cast-iron streetlamps — is free and the city's most replicated photograph. Access via Metro D Line (Wilshire/Fairfax station).", type:"Art", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See info" },
    { title:"Venice Beach + Abbot Kinney + Santa Monica", duration:"Full afternoon", desc:"Venice's boardwalk is LA's permanent carnival: skaters, street artists, Muscle Beach, and the city's most democratic human mix. Three blocks from the beach, Abbot Kinney Boulevard has independent design shops and restaurants worth the detour. The sunset from Santa Monica Pier closes the day with the Pacific as backdrop. Metro E Line reaches both ends.", type:"Beach", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Rent a bike" },
    { title:"Universal Studios + California Science Center + Expo Park", duration:"Full day", desc:"For families with children, Universal Studios Hollywood (Metro B/D Line to Universal City/Studio City) is the West Coast's most complete theme park. The free, most underrated option: the California Science Center in Exposition Park, next to the Memorial Coliseum where the Fan Fest is held. Free general admission, with the world's only complete space shuttle — the Endeavour — as the centerpiece since 2023. A perfect plan on any match-free day between June 12 and 28.", type:"Family", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See tickets" },
    { title:"El Sereno Market + Boyle Heights", duration:"Morning", desc:"For the Latin American fan who wants to step outside the west-side circuit and see the city behind the billboard: El Sereno and Boyle Heights have the county's highest concentration of Mexican families, the best carnitas in the county, and murals documenting decades of political and cultural history that appear in no mainstream travel guide. 25 minutes from downtown on Metro L Line (Gold Line). No app, no tourist map — just colonia, tortillería, and taco.", type:"No tourism", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See options" },
  ],
  lagomTips:[
    "June 12 (USMNT vs. Paraguay, 18:00 PT) and June 25 (USMNT vs. Türkiye, 19:00 PT) are the host city's two peak-demand dates. For both: K Line planned ahead, hotel confirmed months out, no post-match Uber plan.",
    "The correct route to the stadium: Metro K Line (Crenshaw) → Downtown Inglewood Station → FIFA shuttle or ~15-min walk. There is no 'C Line' in LA Metro — it's the K Line. Fare: $1.75 with TAP card.",
    "LA's cost of living is the tournament's highest after New York. Consider Airbnb in Hawthorne, Lawndale, or Gardena — neighborhoods well connected by bus to the stadium area with significantly lower prices.",
    "LA's food scene is the most diverse in the entire tournament. Guelaguetza in Koreatown, Boyle Heights taquerías, and the trucks of El Sereno are the starting point — the rest is defined by whichever neighborhood you're operating from.",
  ],
  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "K Line route planned: E Line → Expo/Crenshaw → K Line → Downtown Inglewood → shuttle",
    "Sunscreen — the translucent roof protects from sun but not from heat",
    "Light clothing for Inglewood microclimate (warmer than the west side)",
    "Water before leaving — SoFi has no A/C",
    "No post-match Uber plan — 45–90 min surge waits",
    "Hotel booked for June 12 (USMNT opener) and June 25 (USMNT vs. Türkiye) as early as possible",
    "Arrive at the stadium 90 min ahead — gates open at H-1:30",
  ],
  didYouKnow:"SoFi Stadium cost $5.5 billion — the most expensive stadium ever built. Its translucent ETFE-panel roof lets natural light through without being fully open — protecting from direct sun without closing the stadium to the outside. It sits just 5 kilometers from LAX, the shortest airport-to-stadium distance in the entire tournament. Los Angeles hosted the 1994 World Cup final at the Rose Bowl — the tournament returns to the same city, in a completely different stadium.",
  closingNote:"Los Angeles isn't a city you can exhaust in a week. The World Cup gives it seven matches, including the opener and potentially Mexico at home. What LA does with that depends on whether you know how to use the shuttle, pick the right neighborhood, and not confuse '30 minutes on Google Maps' with '30 minutes in real life.' LagomPlan gives you the route, the hotel in the right neighborhood, and the taquería where Angelenos actually eat. The Pacific does the rest.",
  closingSignature:"Lagomplan · Field Guide · Los Angeles · World Cup 2026",
  plannerCTA:"Generate my Los Angeles trip",
}