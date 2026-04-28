import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#C4622A'

export const es: CityGuide = {
  id:"la", city:"Los Ángeles", country:"Estados Unidos", state:"California", flag:"🇺🇸", accent:ACCENT,
  tags:["Fútbol","Gastronomía","Cultura","Sede inaugural"],
  stadium:{ name:"SoFi Stadium", capacity:"~70,240", area:"Inglewood — a 30 km al suroeste de DTLA" },
  headline:"El estadio más caro jamás construido alberga el partido inaugural del torneo. En Los Ángeles, hasta las distancias son de película.",
  description:"El estadio más caro jamás construido alberga el partido inaugural del torneo. Los Ángeles no es una ciudad — es una región de diez millones de personas conectada por autopistas. Para el fan mundialista, eso significa una sola cosa: el transporte no se improvisa. La recompensa es una ciudad con la gastronomía más diversa de Norteamérica, playas a treinta minutos del estadio y una afición latinoamericana que hace que los partidos de México suenen como partidos de local.",
  scores:[
    { label:"Ambiente", value:5 }, { label:"Fútbol local", value:4 }, { label:"Gastronomía", value:5 },
    { label:"Transporte", value:2 }, { label:"Seguridad", value:3 }, { label:"Costo", value:2 },
  ],
  matches:[
    { id:"m1", date:"12 Jun", day:"Vie", time:"20:00 PT", teams:[{name:"EUA",flag:"🇺🇸"},{name:"Paraguay",flag:"🇵🇾"}], stadium:"SoFi Stadium", tag:"Partido inaugural del torneo", highlight:true },
    { id:"m2", date:"15 Jun", day:"Dom", time:"16:00 PT", teams:[{name:"Irán",flag:"🇮🇷"},{name:"Nueva Zelanda",flag:"🇳🇿"}], stadium:"SoFi Stadium", tag:"Grupo F", highlight:false },
    { id:"m3", date:"18 Jun", day:"Mié", time:"19:00 PT", teams:[{name:"Suiza",flag:"🇨🇭"},{name:"Bosnia y Herz.",flag:"🇧🇦"}], stadium:"SoFi Stadium", tag:"Grupo D", highlight:false },
    { id:"m4", date:"21 Jun", day:"Sáb", time:"12:00 PT", teams:[{name:"México",flag:"🇲🇽"},{name:"Ecuador",flag:"🇪🇨"}], stadium:"SoFi Stadium", tag:"Grupo G — El Tri en LA", highlight:true },
    { id:"m5", date:"25 Jun", day:"Mié", time:"18:00 PT", teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Grupo H",flag:""}], stadium:"SoFi Stadium", tag:"Grupo H", highlight:false },
    { id:"m6", date:"28 Jun", day:"Sáb", time:"16:00 PT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"SoFi Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m7", date:"2 Jul", day:"Jue", time:"TBD", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"SoFi Stadium", tag:"Fase eliminatoria", highlight:false },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"SoFi Stadium" },
      { label:"Aforo", value:"~70,240 — configuración FIFA" },
      { label:"Techo", value:"Cubierto — el estadio tiene cubierta fija translúcida sin climatización. Protege del sol, no del calor." },
      { label:"Clima (jun–jul)", value:"Días: 24–30°C · Noches: 17–22°C · Seco · El estadio no tiene A/C — lleva ropa ligera" },
      { label:"Partidos", value:"7 confirmados — 5 grupos + 1 Ronda de 32 + 1 Ronda de 16, incluyendo el partido inaugural del torneo" },
      { label:"Aeropuerto", value:"LAX — Los Angeles International · a 8 km del estadio · sin metro directo · taxi/rideshare ~20 min sin tráfico" },
    ],
    body:"SoFi Stadium abre el torneo con el partido inaugural de Estados Unidos. Es el estadio más caro jamás construido — $5.5 mil millones — y está a 8 kilómetros del aeropuerto internacional de Los Ángeles, en el corredor de Inglewood que conecta LAX con el Forum. No tiene metro directo. La ciudad de Los Ángeles tiene más de diez millones de personas, 150 idiomas y la mayor comunidad mexicana fuera de México. Para los partidos de El Tri, el SoFi se convierte en una extensión del Azteca.",
    lagomNote:"Los Ángeles no tiene metro al estadio. El tren de la ciudad (Metro C Line) llega hasta la estación Inglewood, a una caminata de ~20 minutos del SoFi. En días de partido la zona se cierra al auto — la única opción práctica es el shuttle oficial de la FIFA desde el Fan Fest de Hollywood o el Park & Ride en el Forum. Reserva el shuttle con anticipación para el partido inaugural.",
  },
  vibe:{
    body:"La mayor comunidad mexicana de Estados Unidos convierte los partidos de El Tri en eventos de dimensión diferente. La comunidad de la diáspora latinoamericana en Los Ángeles tiene profundidad real: mexicanos, guatemaltecos, salvadoreños, colombianos — todos con clubes y tradiciones en la misma ciudad. Los Angeles FC y LA Galaxy tienen bases de afición organizadas que funcionan bien antes y después de los partidos del torneo. Fuera del fútbol, Los Ángeles tiene la cocina callejera más diversa del continente, playas a treinta minutos del estadio y museos de clase mundial gratuitos los martes.",
    lagomNote:"El partido inaugural (EUA vs Paraguay, 12 de junio) y el de México (21 de junio) generan la mayor demanda de transporte de la sede. Para ambas fechas: reserva shuttle con una semana de anticipación mínimo. El tráfico de Los Ángeles no tiene escala de comparación con ninguna otra ciudad del torneo.",
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
    { name:"The Line Hotel", area:"Koreatown / Mid-City", price:"$$$", priceCAD:"$200–350 USD/noche (periodo mundialista)", tags:["Diseño","Restaurante de autor","Metro Vermont-Beverly"], note:"El hotel con más personalidad del corredor de Koreatown: arquitectura de los años 60 reformada, restaurantes de Roy Choi y acceso al metro Red Line (Vermont-Beverly a 5 min a pie). Desde ahí, shuttle o Uber al SoFi en 20 minutos. La mejor combinación de carácter y logística mundialista.", best_for:"Carácter", hotel_link:"https://booking.stay22.com/lagomplan/E1TixIFa9H" },
    { name:"Freehand Los Angeles", area:"Downtown LA / Koreatown", price:"$$", priceCAD:"$120–250 USD/noche (periodo mundialista)", tags:["Smart value","Bar de referencia","Metro cerca"], note:"El hotel de referencia para el viajero con criterio y presupuesto calibrado. Bar en el rooftop, habitaciones privadas bien diseñadas y acceso al metro Red Line desde Wilshire/Vermont. La opción más honesta del torneo para quien quiere ciudad y no solo precio.", best_for:"Smart value", hotel_link:"https://booking.stay22.com/lagomplan/WMW12RtAON" },
    { name:"The West Hollywood Edition", area:"West Hollywood / Sunset Strip", price:"$$$$", priceCAD:"$600–1,200 USD/noche (periodo mundialista)", tags:["Lujo","Piscina en techo","Sunset Strip"], note:"La dirección más impresionante del torneo en Los Ángeles: piscina de diseño con vistas al Hollywood Sign, restaurante del chef John Fraser y ambiente de quienes vienen a LA a hacer algo importante. Para el partido inaugural, la imagen del 12 de junio en West Hollywood no tiene equivalente en ninguna otra sede.", best_for:"Lujo", hotel_link:"https://booking.stay22.com/lagomplan/o4AM5-gzHj" },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Los Ángeles — LAX", text:"LAX está a 8 km del SoFi Stadium y a 25 km del centro de Los Ángeles. El FlyAway bus conecta LAX con el centro (Union Station) en ~50 minutos. El Uber desde LAX al centro cuesta $35–55 sin tráfico; con tráfico de partido puede duplicarse. No hay metro directo desde LAX al centro — la conexión requiere autobús LAX-C/E + Metro." },
      { icon:"🚌", title:"Ruta maestra — Shuttle oficial FIFA", text:"La FIFA opera shuttles desde el Fan Fest de Hollywood Park (junto al SoFi) y desde puntos de Park & Ride en toda la ciudad. El shuttle es la opción más directa para días de partido — sin atascos, sin problema de parking. Reserva en la app oficial con mínimo 5 días de anticipación para el partido inaugural y los partidos de México." },
      { icon:"🚇", title:"Alternativa en metro — Metro C Line", text:"El Metro C Line llega hasta la estación Inglewood, a ~20 minutos caminando del SoFi. Desde el centro (7th St/Metro Center) hasta Inglewood: ~35 minutos. No es la ruta más directa pero funciona con equipaje ligero y es la opción más económica ($1.75). Evítala post-partido de México — las estaciones se saturan." },
      { icon:"⚠️", title:"Error crítico — subestimar las distancias de LA", text:"Los Ángeles no es una ciudad compacta. Lo que en Google Maps parece '30 minutos' puede ser 90 minutos con tráfico de partido. El SoFi está en Inglewood, no en el centro de LA. El centro de LA está a 30 km de West Hollywood. West Hollywood está a 15 km de Santa Mónica. Planifica cada trayecto como si el tráfico fuera doble de lo esperado — porque lo será.", isWarning:true },
    ],
    timings:[
      { label:"LAX → SoFi Stadium (shuttle día de partido)", value:"~25 min" },
      { label:"Downtown LA → SoFi (Metro C Line + caminata)", value:"~55 min" },
      { label:"West Hollywood → SoFi (Uber sin tráfico)", value:"~30 min · con tráfico: 60–90 min" },
      { label:"Hollywood → SoFi (Uber sin tráfico)", value:"~35 min · con tráfico: 70–100 min" },
    ],
    matchDayCronologia:{
      matchName:"12 Jun · EUA vs Paraguay · 20:00 PT — Partido inaugural",
      steps:[
        { time:"H-4:00", text:"Almuerza temprano. El partido inaugural de la noche es el evento más masivo del año en Los Ángeles." },
        { time:"H-3:00", text:"Aborda el shuttle desde Hollywood Park Fan Fest o desde tu Park & Ride asignado." },
        { time:"H-2:00", text:"Llegada al SoFi. Puertas abiertas 2 horas antes del inaugural. El estadio vale llegar antes del partido." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo. La ceremonia inaugural comienza antes del partido." },
        { time:"H+0:00", text:"Partido inaugural." },
        { time:"H+1:45", text:"Shuttle de regreso. No uses Uber post-inaugural — la espera puede ser de 60–90 minutos con surge." },
      ],
    },
    timing:"Los Ángeles no tiene metro al estadio. El shuttle oficial es la única opción que garantiza tiempo de llegada controlado. El tráfico de LA en día de partido grande no tiene parangón con ninguna otra ciudad del torneo.",
    cost:"Una de las ciudades más caras del torneo. El periodo mundialista coincide con la temporada alta de LA. Considera Airbnb en Culver City, Mid-City o Silver Lake — barrios bien comunicados y a precios más razonables que West Hollywood o Santa Mónica.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Hollywood Park", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest de Los Ángeles se instala en Hollywood Park, el complejo de entretenimiento adyacente al SoFi Stadium. Pantallas de gran formato, programación con artistas locales y activaciones culturales en un recinto diseñado para eventos masivos. La ventaja estratégica: el shuttle al estadio sale desde ahí. Para el fan sin boleto en días de partido de México o EUA, llega con 3 horas de anticipación — se llena.", tag:"Sin boleto OK" },
    { title:"Grand Central Market (Downtown)", type:"Mercado histórico", typeColor:FJORD, desc:"El mercado cubierto más antiguo de Los Ángeles, en el centro histórico desde 1917, tiene más de 40 puestos de cocina del mundo en un solo espacio: pupusas salvadoreñas, tacos de guisado, pho vietnamita, pizza de masa madre y jugos de fruta tropical. Para el día libre entre el 12 y el 15 de junio, este es el almuerzo más honesto de la sede.", tag:"Centro histórico" },
    { title:"The Rose Bowl (Pasadena)", type:"Estadio histórico", typeColor:SAGE, desc:"El estadio donde se jugó la final del Mundial 1994 — Alemania-Italia, Suecia-Bulgaria, Brasil campeón — tiene transmisiones públicas en su campo interior durante el torneo. Para el fan que quiere ver un partido de la Ronda de 16 en el mismo estadio que albergó la final del Mundial más exitoso de la historia.", tag:"Histórico" },
    { title:"Koreatown — partidos de Corea del Sur", type:"Barrio", typeColor:PINE, desc:"El Koreatown de Los Ángeles es la comunidad coreana más grande fuera de Korea. Cuando juega Corea del Sur, las calles de Wilshire y Vermont se cierran informalmente — bares, restaurantes y karaokes transmiten en simultáneo y la comunidad corea desde las ventanas. El ambiente más orgánico de la sede, sin Fan Fest ni pantallas organizadas.", tag:"Auténtico" },
    { title:"Dodger Stadium — watch party", type:"Pantalla exterior", typeColor:"#1A3A5C", desc:"La organización de los Dodgers activa el estadio para watch parties de los partidos más grandes del torneo, con pantalla en el marcador exterior. Para los partidos de México y EUA, Dodger Stadium tiene capacidad para 56,000 personas y el contexto visual — las colinas de Chavez Ravine, el skyline al fondo — no existe en ninguna otra ciudad de la sede.", tag:"Chavez Ravine" },
    { title:"El Cholo (Western Ave)", type:"Restaurante histórico", typeColor:"#5A3A2A", desc:"El restaurante mexicano más antiguo de Los Ángeles, abierto desde 1923. Margaritas clásicas, enchiladas del estilo que los angelinos conocen de toda la vida y el ambiente de cantina que ninguna versión de LA para turistas puede fabricar. Para el fan que llega por el partido de México y quiere entender por qué esta ciudad tiene la mejor cocina mexicana fuera de México.", tag:"Western Ave" },
  ],
  food:[
    { dish:"Grand Central Market", where:"Downtown LA — 40 puestos de cocina internacional desde 1917; tacos, pupusas, pho y café de especialidad bajo el mismo techo histórico", price:"$–$$", type:"Mercado" },
    { dish:"Guerrilla Tacos", where:"Arts District — el chef Wes Avila lleva el taco callejero a nivel de alta cocina; los mejores tacos modernos de Los Ángeles", price:"$$", type:"Imperdible" },
    { dish:"Broken Spanish", where:"Downtown LA — cocina mexicana de autor, la más técnica de la ciudad; reserva con anticipación para noches de partido", price:"$$$", type:"Autor" },
    { dish:"Night + Market", where:"West Hollywood — cocina tailandesa sin filtros, la más auténtica de la Costa Oeste y la más interesante para el fan con hambre después del partido", price:"$$", type:"Tailandesa" },
    { dish:"Tacos de canasta en MacArthur Park", where:"Westlake — el epicentro del LA mexicano popular: tacos de $1.50, agua de jamaica y el ambiente más auténtico de la sede", price:"$", type:"Local" },
    { dish:"Pizzeria Mozza", where:"Hollywood — Nancy Silverton, la mejor pizza de masa madre del Oeste americano; reserva obligatoria para noches sin partido", price:"$$$", type:"Referencia" },
  ],
  experiences:[
    { title:"The Getty Center", duration:"Medio día", desc:"El museo en lo alto de las colinas de Brentwood tiene una colección permanente de primera categoría, jardines de diseño y las mejores vistas de Los Ángeles — el océano Pacífico, el Valle de San Fernando y el skyline de Downtown desde una misma terraza. Entrada gratuita (solo se paga el estacionamiento). El tram desde el parking hasta el museo es parte de la experiencia. Para el día libre entre el partido inaugural y el del 15 de junio.", type:"Arte", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver horarios" },
    { title:"Santa Mónica + Venice Beach", duration:"Tarde completa", desc:"La playa de Santa Mónica está a 30 minutos del centro de Los Ángeles y tiene el corredor de tiendas y restaurantes de la Third Street Promenade, el muelle con la noria histórica y el acceso en bici hacia Venice. En Venice, el paseo marítimo tiene músicos callejeros, artistas de body painting y el ambiente menos parecido a cualquier otra ciudad del torneo. Para el día libre antes del partido de México, esta es la tarde que LA puede dar que ninguna otra sede del torneo puede replicar.", type:"Playa", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Alquilar bicicleta" },
    { title:"Griffith Observatory + Hollywood Sign", duration:"Mañana", desc:"El observatorio en las colinas de Griffith Park tiene planetario, telescopios abiertos al público y el sendero más fotografiado de Los Ángeles — el que lleva al frente del Hollywood Sign. La vista desde el observatorio al amanecer, con el Pacífico al fondo y el skyline de DTLA a la izquierda, justifica madrugar. Entrada gratuita al edificio; planetario con tarifa mínima.", type:"Ciudad", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver información" },
    { title:"Mercado La Paloma (Exposition Park)", duration:"Medio día", desc:"El mercado cultural a dos cuadras del Natural History Museum, adyacente al Coliseum y al SoFi en Exposition Park, tiene cocina oaxaqueña, guatemalteca y mexicana en un espacio diseñado por y para la comunidad latinoamericana de Los Ángeles. Combínalo con el Natural History Museum (dinosaurios, meteoritos, colección de minerales de clase mundial) y el California Science Center para un día sin auto y sin tráfico.", type:"Cultura", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver opciones" },
  ],
  lagomTips:[
    "El partido inaugural (EUA vs Paraguay, 12 junio) y el de México (21 junio) son las dos fechas de mayor demanda en toda la sede. Para ambos: shuttle oficial reservado con 5 días mínimo, hotel a precio de temporada alta y no planees Uber post-partido.",
    "Los Ángeles no tiene metro directo al SoFi Stadium. Las opciones son: shuttle oficial (recomendado), Metro C Line hasta Inglewood + caminata, o Uber desde tu hotel con margen de 90 minutos para el tráfico.",
    "El costo de vida en LA es el más alto del torneo después de Nueva York. Considera Airbnb en Culver City, Mid-City o Silver Lake — mejor precio con buena conexión al metro.",
    "La gastronomía de LA es la más diversa de todo el torneo: cocina mexicana auténtica, tailandesa de primera, sushi de acceso al Pacífico y mercados callejeros sin equivalente. No comas dos veces en el mismo sitio.",
  ],
  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Shuttle oficial reservado con anticipación",
    "Protector solar — el estadio tiene cubierta pero sin A/C",
    "Ropa ligera para calor seco (24–30°C en junio)",
    "Agua antes de salir — el SoFi no tiene climatización",
    "Sin plan de Uber post-partido — espera de 60–90 min en surge",
    "Reserva hotel para 12 junio (inaugural) y 21 junio (México) con anticipación máxima",
    "Llegada al estadio 90 min antes — puertas abren H-2:00 para el inaugural",
  ],
  didYouKnow:"SoFi Stadium costó $5.5 mil millones de dólares — el estadio más caro jamás construido en la historia. Inaugurado en 2020, fue diseñado por HKS Architects con una cubierta traslúcida que permite ver el cielo desde el interior sin exponer a los espectadores al sol directo. Tiene el marcador de pantalla más grande del mundo: 70 metros de largo.",
  closingNote:"Los Ángeles no es una ciudad que se deja agotar en una semana. El Mundial le da siete partidos, incluyendo el inaugural y potencialmente el de México en casa. Lo que LA hace con eso depende de si sabes usar el shuttle, elegir el barrio correcto y no confundir '30 minutos en Google Maps' con '30 minutos en la realidad'. LagomPlan te da la ruta, el hotel en el barrio indicado y la taquería donde los ángeles comen de verdad. El Pacífico hace el resto.",
  closingSignature:"Lagomplan · Guía de campo · Los Ángeles · Mundial 2026",
  plannerCTA:"Generar mi viaje a Los Ángeles",
}

export const en: CityGuide = {
  id:"la", city:"Los Angeles", country:"United States", state:"California", flag:"🇺🇸", accent:ACCENT,
  tags:["Football","Food","Culture","Opening host"],
  stadium:{ name:"SoFi Stadium", capacity:"~70,240", area:"Inglewood — 30 km southwest of DTLA" },
  headline:"The most expensive stadium ever built hosts the tournament's opening match. In Los Angeles, even the distances are cinematic.",
  description:"The most expensive stadium ever built hosts the tournament's opening match. Los Angeles isn't a city — it's a ten-million-person region stitched together by freeways. For the World Cup fan, that means one thing: transit can't be improvised. The reward is North America's most diverse food scene, beaches thirty minutes from the stadium, and a Latin American community that turns Mexico matches into home games.",
  scores:[
    { label:"Atmosphere", value:5 }, { label:"Football", value:4 }, { label:"Food", value:5 },
    { label:"Transit", value:2 }, { label:"Safety", value:3 }, { label:"Cost", value:2 },
  ],
  matches:[
    { id:"m1", date:"Jun 12", day:"Fri", time:"20:00 PT", teams:[{name:"USA",flag:"🇺🇸"},{name:"Paraguay",flag:"🇵🇾"}], stadium:"SoFi Stadium", tag:"Tournament opening match", highlight:true },
    { id:"m2", date:"Jun 15", day:"Sun", time:"16:00 PT", teams:[{name:"Iran",flag:"🇮🇷"},{name:"New Zealand",flag:"🇳🇿"}], stadium:"SoFi Stadium", tag:"Group F", highlight:false },
    { id:"m3", date:"Jun 18", day:"Wed", time:"19:00 PT", teams:[{name:"Switzerland",flag:"🇨🇭"},{name:"Bosnia & Herz.",flag:"🇧🇦"}], stadium:"SoFi Stadium", tag:"Group D", highlight:false },
    { id:"m4", date:"Jun 21", day:"Sat", time:"12:00 PT", teams:[{name:"Mexico",flag:"🇲🇽"},{name:"Ecuador",flag:"🇪🇨"}], stadium:"SoFi Stadium", tag:"Group G — El Tri in LA", highlight:true },
    { id:"m5", date:"Jun 25", day:"Wed", time:"18:00 PT", teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Group H",flag:""}], stadium:"SoFi Stadium", tag:"Group H", highlight:false },
    { id:"m6", date:"Jun 28", day:"Sat", time:"16:00 PT", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"SoFi Stadium", tag:"Knockout stage", highlight:false },
    { id:"m7", date:"Jul 2", day:"Thu", time:"TBD", teams:[{name:"Round of 16",flag:""},{name:"TBD",flag:""}], stadium:"SoFi Stadium", tag:"Knockout stage", highlight:false },
  ],
  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium", value:"SoFi Stadium" },
      { label:"Capacity", value:"~70,240 — FIFA configuration" },
      { label:"Roof", value:"Covered — fixed translucent canopy, no climate control. Protects from sun, not heat." },
      { label:"Weather (Jun–Jul)", value:"Days: 24–30°C · Nights: 17–22°C · Dry · The stadium has no A/C — pack light" },
      { label:"Matches", value:"7 confirmed — 5 group stage + 1 Round of 32 + 1 Round of 16, including the tournament's opening match" },
      { label:"Airport", value:"LAX — Los Angeles International · 8 km from the stadium · no direct metro · taxi/rideshare ~20 min without traffic" },
    ],
    body:"SoFi Stadium opens the tournament with the United States' opening match. It's the most expensive stadium ever built — $5.5 billion — and sits 8 kilometers from Los Angeles' international airport, in the Inglewood corridor connecting LAX with the Forum. It has no direct metro link. The city of Los Angeles has more than ten million people, 150 languages, and the largest Mexican community outside Mexico. For El Tri's matches, SoFi becomes an extension of the Azteca.",
    lagomNote:"Los Angeles has no metro to the stadium. The city's Metro C Line reaches Inglewood station, a ~20-minute walk from SoFi. On match days the area closes to cars — the only practical option is FIFA's official shuttle from the Hollywood Fan Fest or a Park & Ride at the Forum. Book the shuttle in advance for the opening match.",
  },
  vibe:{
    body:"The largest Mexican community in the United States turns El Tri matches into a different scale of event. The Latin American diaspora in Los Angeles has real depth: Mexicans, Guatemalans, Salvadorans, Colombians — all with clubs and traditions in the same city. Los Angeles FC and LA Galaxy have organized supporter bases that work well before and after tournament matches. Beyond football, Los Angeles has the most diverse street food on the continent, beaches thirty minutes from the stadium, and world-class museums that are free on Tuesdays.",
    lagomNote:"The opening match (USA vs. Paraguay, June 12) and Mexico's match (June 21) generate the host city's peak transit demand. For both dates: book the shuttle a minimum of one week ahead. LA traffic doesn't compare to any other city in the tournament.",
  },
  stays:[
    { name:"The Line Hotel", area:"Koreatown / Mid-City", price:"$$$", priceCAD:"$200–350 USD/night (World Cup period)", tags:["Design","Chef-driven restaurant","Metro Vermont-Beverly"], note:"The most characterful hotel in the Koreatown corridor: renovated 1960s architecture, restaurants by Roy Choi, and Red Line access (Vermont-Beverly, 5 min on foot). From there, shuttle or Uber to SoFi in 20 minutes. The best combination of character and World Cup logistics.", best_for:"Character", hotel_link:"https://booking.stay22.com/lagomplan/E1TixIFa9H" },
    { name:"Freehand Los Angeles", area:"Downtown LA / Koreatown", price:"$$", priceCAD:"$120–250 USD/night (World Cup period)", tags:["Smart value","Notable bar","Metro close"], note:"The reference hotel for the traveler with judgment and a measured budget. Rooftop bar, well-designed private rooms, and Red Line access from Wilshire/Vermont. The most honest option in the tournament for anyone who wants city, not just price.", best_for:"Smart value", hotel_link:"https://booking.stay22.com/lagomplan/WMW12RtAON" },
    { name:"The West Hollywood Edition", area:"West Hollywood / Sunset Strip", price:"$$$$", priceCAD:"$600–1,200 USD/night (World Cup period)", tags:["Luxury","Rooftop pool","Sunset Strip"], note:"The tournament's most impressive address in Los Angeles: design pool with Hollywood Sign views, chef John Fraser's restaurant, and the crowd of people who come to LA to do something important. For the opening match, the image of June 12 in West Hollywood has no equivalent in any other host city.", best_for:"Luxury", hotel_link:"https://booking.stay22.com/lagomplan/o4AM5-gzHj" },
  ],
  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Los Angeles — LAX", text:"LAX sits 8 km from SoFi Stadium and 25 km from downtown Los Angeles. The FlyAway bus connects LAX with downtown (Union Station) in ~50 minutes. Uber from LAX to downtown costs $35–55 without traffic; with match-day traffic it can double. There's no direct metro from LAX to downtown — the connection requires the LAX-C/E bus + Metro." },
      { icon:"🚌", title:"Master route — Official FIFA shuttle", text:"FIFA operates shuttles from the Hollywood Park Fan Fest (adjacent to SoFi) and from Park & Ride points across the city. The shuttle is the most direct option on match days — no jams, no parking headache. Book on the official app at least 5 days ahead for the opening match and Mexico's matches." },
      { icon:"🚇", title:"Metro alternative — Metro C Line", text:"The Metro C Line reaches Inglewood station, ~20 minutes walking from SoFi. From downtown (7th St/Metro Center) to Inglewood: ~35 minutes. Not the most direct route but works with light luggage and is the cheapest option ($1.75). Avoid it post-Mexico match — stations saturate.", },
      { icon:"⚠️", title:"Critical error — underestimating LA distances", text:"Los Angeles isn't a compact city. What Google Maps shows as '30 minutes' can be 90 with match-day traffic. SoFi is in Inglewood, not in central LA. Central LA is 30 km from West Hollywood. West Hollywood is 15 km from Santa Monica. Plan every leg as if traffic will be double — because it will be.", isWarning:true },
    ],
    timings:[
      { label:"LAX → SoFi Stadium (match-day shuttle)", value:"~25 min" },
      { label:"Downtown LA → SoFi (Metro C Line + walk)", value:"~55 min" },
      { label:"West Hollywood → SoFi (Uber, no traffic)", value:"~30 min · with traffic: 60–90 min" },
      { label:"Hollywood → SoFi (Uber, no traffic)", value:"~35 min · with traffic: 70–100 min" },
    ],
    matchDayCronologia:{
      matchName:"Jun 12 · USA vs. Paraguay · 20:00 PT — Opening match",
      steps:[
        { time:"H-4:00", text:"Eat lunch early. The opening night match is the biggest event of the year in Los Angeles." },
        { time:"H-3:00", text:"Board the shuttle from Hollywood Park Fan Fest or your assigned Park & Ride." },
        { time:"H-2:00", text:"Arrive at SoFi. Gates open 2 hours ahead for the opener. The stadium is worth arriving early for." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready. The opening ceremony starts before kickoff." },
        { time:"H+0:00", text:"Opening match." },
        { time:"H+1:45", text:"Shuttle back. Don't use Uber post-opener — the wait can be 60–90 minutes with surge pricing." },
      ],
    },
    timing:"Los Angeles has no metro to the stadium. The official shuttle is the only option that guarantees controlled arrival time. LA traffic on a major match day is unparalleled by any other city in the tournament.",
    cost:"One of the tournament's most expensive cities. The World Cup period overlaps with LA's high season. Consider Airbnb in Culver City, Mid-City, or Silver Lake — well-connected neighborhoods at rates more reasonable than West Hollywood or Santa Monica.",
  },
  vibeCards:[
    { title:"FIFA Fan Festival™ — Hollywood Park", type:"Official fan fest", typeColor:CORAL, desc:"Los Angeles' Fan Fest sets up at Hollywood Park, the entertainment complex next to SoFi Stadium. Big-format screens, local-artist programming, and cultural activations in a venue built for mass events. The strategic advantage: the stadium shuttle leaves from here. For the ticketless fan on Mexico or USA match days, arrive 3 hours early — it fills up.", tag:"No ticket needed" },
    { title:"Grand Central Market (Downtown)", type:"Historic market", typeColor:FJORD, desc:"Los Angeles' oldest covered market, in the historic center since 1917, has more than 40 global-cuisine stalls under one roof: Salvadoran pupusas, guisado tacos, Vietnamese pho, sourdough pizza, tropical-fruit juices. For the off day between June 12 and 15, this is the host city's most honest lunch.", tag:"Historic downtown" },
    { title:"The Rose Bowl (Pasadena)", type:"Historic stadium", typeColor:SAGE, desc:"The stadium that hosted the 1994 World Cup final — Germany-Italy, Sweden-Bulgaria, Brazil champion — will run public broadcasts on its inner field during the tournament. For the fan who wants to watch a Round of 16 match in the same stadium that hosted the most successful World Cup final in history.", tag:"Historic" },
    { title:"Koreatown — South Korea matches", type:"Neighborhood", typeColor:PINE, desc:"Los Angeles' Koreatown is the largest Korean community outside Korea. When South Korea plays, the streets of Wilshire and Vermont informally shut down — bars, restaurants, and karaoke rooms broadcast in sync and the community cheers from the windows. The most organic atmosphere in the host city, without a Fan Fest or organized screens.", tag:"Authentic" },
    { title:"Dodger Stadium — watch party", type:"Outdoor screen", typeColor:"#1A3A5C", desc:"The Dodgers organization will activate the stadium for watch parties of the tournament's biggest matches, using the outer scoreboard. For Mexico and USA matches, Dodger Stadium holds 56,000 and the visual context — the Chavez Ravine hills, skyline behind you — doesn't exist at any other venue in the host city.", tag:"Chavez Ravine" },
    { title:"El Cholo (Western Ave)", type:"Historic restaurant", typeColor:"#5A3A2A", desc:"Los Angeles' oldest Mexican restaurant, open since 1923. Classic margaritas, enchiladas in the style Angelenos have known all their lives, and the cantina feel no tourist-facing LA version can fake. For the fan coming for Mexico's match who wants to understand why this city has the best Mexican cooking outside Mexico.", tag:"Western Ave" },
  ],
  food:[
    { dish:"Grand Central Market", where:"Downtown LA — 40 international food stalls since 1917; tacos, pupusas, pho, and specialty coffee under the same historic roof", price:"$–$$", type:"Market" },
    { dish:"Guerrilla Tacos", where:"Arts District — chef Wes Avila brings the street taco to fine-dining technique; LA's best modern tacos", price:"$$", type:"Must try" },
    { dish:"Broken Spanish", where:"Downtown LA — chef-driven Mexican cuisine, the city's most technical; book ahead on match nights", price:"$$$", type:"Chef-driven" },
    { dish:"Night + Market", where:"West Hollywood — unfiltered Thai cooking, the West Coast's most authentic and the most interesting for the hungry fan post-match", price:"$$", type:"Thai" },
    { dish:"MacArthur Park basket tacos", where:"Westlake — the epicenter of working-class Mexican LA: $1.50 tacos, jamaica water, the host city's most authentic atmosphere", price:"$", type:"Local" },
    { dish:"Pizzeria Mozza", where:"Hollywood — Nancy Silverton, the American West's best sourdough pizza; booking required on non-match nights", price:"$$$", type:"Benchmark" },
  ],
  experiences:[
    { title:"The Getty Center", duration:"Half day", desc:"The museum atop the Brentwood hills has a first-class permanent collection, designed gardens, and the best views in Los Angeles — Pacific Ocean, San Fernando Valley, and downtown skyline from a single terrace. Free admission (you only pay for parking). The tram from the parking lot to the museum is part of the experience. For the off day between the opening match and the June 15 match.", type:"Art", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See hours" },
    { title:"Santa Monica + Venice Beach", duration:"Full afternoon", desc:"Santa Monica Beach is 30 minutes from central LA and has the Third Street Promenade shopping strip, the historic pier Ferris wheel, and bike access to Venice. In Venice, the boardwalk has street musicians, body-painting artists, and the least-like-anywhere-else atmosphere of any host city. For the off day before Mexico's match, this is the afternoon only LA can offer.", type:"Beach", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Rent a bike" },
    { title:"Griffith Observatory + Hollywood Sign", duration:"Morning", desc:"The observatory in the Griffith Park hills has a planetarium, public telescopes, and Los Angeles' most photographed trail — the one to the face of the Hollywood Sign. The sunrise view from the observatory, Pacific behind you and DTLA skyline to your left, justifies the early wake-up. Building entry free; planetarium at minimal fee.", type:"City", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See info" },
    { title:"Mercado La Paloma (Exposition Park)", duration:"Half day", desc:"The cultural market two blocks from the Natural History Museum, next to the Coliseum and SoFi in Exposition Park, serves Oaxacan, Guatemalan, and Mexican cooking in a space designed by and for LA's Latin American community. Pair it with the Natural History Museum (dinosaurs, meteorites, world-class mineral collection) and the California Science Center for a car-free, traffic-free day.", type:"Culture", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See options" },
  ],
  lagomTips:[
    "The opening match (USA vs. Paraguay, June 12) and Mexico's (June 21) are the host city's two peak-demand dates. For both: official shuttle booked 5 days minimum, hotel at high-season pricing, and no post-match Uber plan.",
    "Los Angeles has no direct metro to SoFi Stadium. Options: official shuttle (recommended), Metro C Line to Inglewood + walk, or Uber from your hotel with a 90-minute traffic buffer.",
    "LA's cost of living is the tournament's highest after New York. Consider Airbnb in Culver City, Mid-City, or Silver Lake — better rates with good metro access.",
    "LA's food scene is the most diverse in the entire tournament: authentic Mexican, first-rate Thai, Pacific-sourced sushi, and street markets with no equivalent. Don't eat at the same place twice.",
  ],
  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "Official shuttle booked ahead",
    "Sunscreen — the stadium has a canopy but no A/C",
    "Light clothing for dry heat (24–30°C in June)",
    "Water before leaving — SoFi has no climate control",
    "No post-match Uber plan — 60–90 min surge waits",
    "Book hotels for June 12 (opener) and June 21 (Mexico) as early as possible",
    "Arrive at the stadium 90 min ahead — gates open at H-2:00 for the opener",
  ],
  didYouKnow:"SoFi Stadium cost $5.5 billion — the most expensive stadium ever built. Opened in 2020, it was designed by HKS Architects with a translucent canopy that lets you see the sky from inside without exposing spectators to direct sun. It has the world's largest screen scoreboard: 70 meters long.",
  closingNote:"Los Angeles isn't a city you can exhaust in a week. The World Cup gives it seven matches, including the opener and potentially Mexico at home. What LA does with that depends on whether you know how to use the shuttle, pick the right neighborhood, and not confuse '30 minutes on Google Maps' with '30 minutes in real life.' LagomPlan gives you the route, the hotel in the right neighborhood, and the taquería where Angelenos actually eat. The Pacific does the rest.",
  closingSignature:"Lagomplan · Field Guide · Los Angeles · World Cup 2026",
  plannerCTA:"Generate my Los Angeles trip",
}
