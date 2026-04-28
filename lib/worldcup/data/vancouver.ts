import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#2D4F6C'

export const es: CityGuide = {
  id:"van",
  city:"Vancouver",
  country:"Canadá",
  state:"Columbia Británica",
  flag:"🇨🇦",
  accent: ACCENT,

  tags:["Fútbol","Gastronomía","Naturaleza","Sede co-anfitriona"],

  stadium:{ name:"BC Place", capacity:"~54,500", area:"Downtown — junto al False Creek" },

  headline:"La única sede del torneo donde el estadio comparte el horizonte con montañas nevadas. No hace falta que sea metáfora.",
  description:"La única sede del torneo donde el estadio comparte el horizonte con montañas nevadas. No hace falta que sea metáfora. Vancouver llega al Mundial con siete partidos, un techo retráctil — el único estadio techado de Canadá en el torneo — y Canadá jugando dos veces aquí. La segunda, el 24 de junio contra Suiza, puede ser la más importante para el país.",

  scores:[
    { label:"Ambiente",     value:4 },
    { label:"Fútbol local", value:4 },
    { label:"Gastronomía",  value:5 },
    { label:"Transporte",   value:5 },
    { label:"Seguridad",    value:5 },
    { label:"Costo",        value:2 },
  ],

  matches:[
    { id:"m1", date:"13 Jun", day:"Sáb", time:"21:00 PT", teams:[{name:"Australia",flag:"🇦🇺"},{name:"Türkiye",flag:"🇹🇷"}], stadium:"BC Place", tag:"Grupo D — apertura nocturna de la sede", highlight:false },
    { id:"m2", date:"18 Jun", day:"Jue", time:"12:00 PT", teams:[{name:"Canadá",flag:"🇨🇦"},{name:"Qatar",flag:"🇶🇦"}], stadium:"BC Place", tag:"Grupo B — Canadá en casa", highlight:true },
    { id:"m3", date:"21 Jun", day:"Dom", time:"18:00 PT", teams:[{name:"Nueva Zelanda",flag:"🇳🇿"},{name:"Egipto",flag:"🇪🇬"}], stadium:"BC Place", tag:"Grupo F", highlight:false },
    { id:"m4", date:"24 Jun", day:"Mié", time:"12:00 PT", teams:[{name:"Suiza",flag:"🇨🇭"},{name:"Canadá",flag:"🇨🇦"}], stadium:"BC Place", tag:"Grupo B — partido definitorio del grupo", highlight:true },
    { id:"m5", date:"26 Jun", day:"Vie", time:"20:00 PT", teams:[{name:"Nueva Zelanda",flag:"🇳🇿"},{name:"Bélgica",flag:"🇧🇪"}], stadium:"BC Place", tag:"Grupo F", highlight:false },
    { id:"m6", date:"2 Jul",  day:"Jue", time:"TBD",      teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"BC Place", tag:"Fase eliminatoria", highlight:false },
    { id:"m7", date:"7 Jul",  day:"Mar", time:"13:00 PT", teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}], stadium:"BC Place", tag:"Fase eliminatoria", highlight:false },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",         value:"Vancouver Stadium (BC Place)" },
      { label:"Aforo",                value:"~54,500 — configuración FIFA — con techo retráctil, el único estadio techado de Canadá en el torneo" },
      { label:"Techo",                value:"Retráctil — único estadio techado de Canadá en el torneo" },
      { label:"Clima (jun–jul)",      value:"18–24°C · Lluvia ocasional · El techo cubre al fanático cuando el Pacífico decide opinar" },
      { label:"Partidos",             value:"7 confirmados (5 grupos + 1 Ronda de 32 + 1 Ronda de 16)" },
      { label:"Aeropuerto principal", value:"YVR — Vancouver International (a ~12 km del estadio, accesible por SkyTrain Canada Line en ~25 minutos)" },
      { label:"Visa",                 value:"Canadá requiere eTA para ciudadanos de muchos países — se tramita en línea en canada.ca. No confundir con visa estadounidense; son requisitos independientes." },
    ],
    body:"Vancouver no necesitaba el Mundial para ser un destino. Lo que el torneo le da es contexto: siete partidos, el sueño de Canadá de avanzar jugándose aquí, y la confirmación de que el BC Place — donde se jugó la final de la Copa del Mundo Femenina 2015 — sabe lo que es un partido grande. El estadio conoce el peso. La ciudad también.",
    lagomNote:"Canadá requiere eTA (Electronic Travel Authorization) para ciudadanos de muchos países. Se tramita en canada.ca — no confundir con la visa estadounidense, son requisitos independientes. Tramítala antes de comprar el vuelo.",
  },

  vibe:{
    body:"Canadá juega aquí dos veces — incluyendo el partido decisivo del Grupo B el 24 de junio contra Suiza. Vancouver es donde el sueño canadiense de avanzar se define. Si Canadá pasa la fase de grupos, esta ciudad lo vive antes que nadie. El Vancouver Whitecaps tiene una de las bases de fanáticos más activas de MLS en el país. El BC Place ya albergó la final de la Copa del Mundo Femenina 2015 — el estadio conoce el peso de un partido grande. La ciudad suma la mejor escena de sushi fuera de Japón, dim sum que rivaliza con Hong Kong, izakaya de referencia internacional y mercados con acceso directo al Pacífico. Para comer, Vancouver no necesita justificarse. El costo es el límite: una de las ciudades más caras de Norteamérica en año sin Mundial, y el torneo no hace más que confirmar lo que el mercado inmobiliario ya había establecido.",
    lagomNote:"Para el 24 de junio (Suiza vs. Canadá, partido definitorio del Grupo B) y el 18 de junio (Canadá vs. Qatar), el PNE se llena antes del mediodía. Los dos partidos de Canadá en esta sede generan una demanda sin precedente en la historia del turismo de la ciudad.",
  },

  neighborhoods:[
    { name:"Gastown / Downtown", vibe:"Dónde situarse: barrios clave. Vancouver es compacta para su tamaño. BC Place está en el centro de la ciudad, junto al False Creek — lo que significa que la mayoría de los barrios interesantes están a quince o veinte minutos del estadio a pie o en SkyTrain. Base recomendada: Gastown / Downtown. Gastown es el barrio histórico de Vancouver: adoquines, arquitectura de almacén restaurada y la mejor concentración de bares y restaurantes de la ciudad en radio corto. A diez minutos caminando de BC Place. El acceso al SkyTrain desde Waterfront Station conecta con el aeropuerto y con Main Street-Science World (la estación para ir al estadio en día de partido). Para el fanático que quiere estar en el corazón de la ciudad y llegar al partido caminando.", best_for:"Fan WC", walk_to_stadium:"10 min a pie · Waterfront Station (SkyTrain)", lagomNote:null },
    { name:"Yaletown", vibe:"Opción con diseño: Yaletown. Antiguo distrito industrial reconvertido en barrio residencial de alta gama con restaurantes de autor, patios de cerveza artesanal y bares donde la Premier League se ve con pantalla de tamaño correcto. También a diez minutos caminando del estadio. Más tranquilo que Gastown, con mejor calidad promedio de restaurantes.", best_for:"Pareja", walk_to_stadium:"10 min a pie · False Creek waterfront", lagomNote:null },
    { name:"Mount Pleasant / Main Street", vibe:"Presupuesto con criterio: Mount Pleasant / Main Street. Al sur del centro, Mount Pleasant tiene el mayor número de cafeterías independientes, librerías y restaurantes de costo razonable de Vancouver. Está en la Expo Line (Main Street-Science World), que es exactamente la estación que se usa para llegar al estadio en días de partido. La logística no podría ser más limpia.", best_for:"Presupuesto", walk_to_stadium:"Main Street-Science World + ruta peatonal (~15 min)", lagomNote:null },
  ],

  stayNeighborhoods:{
    intro:"Vancouver es compacta para su tamaño. BC Place está en el centro de la ciudad, junto al False Creek — lo que significa que la mayoría de los barrios interesantes están a quince o veinte minutos del estadio a pie o en SkyTrain.",
    items:[
      { kind:"recommended", title:"Base recomendada: Gastown / Downtown", body:"Gastown es el barrio histórico de Vancouver: adoquines, arquitectura de almacén restaurada y la mejor concentración de bares y restaurantes de la ciudad en radio corto. A diez minutos caminando de BC Place. El acceso al SkyTrain desde Waterfront Station conecta con el aeropuerto y con Main Street-Science World (la estación para ir al estadio en día de partido). Para el fanático que quiere estar en el corazón de la ciudad y llegar al partido caminando." },
      { kind:"alternative", title:"Opción con diseño: Yaletown", body:"Antiguo distrito industrial reconvertido en barrio residencial de alta gama con restaurantes de autor, patios de cerveza artesanal y bares donde la Premier League se ve con pantalla de tamaño correcto. También a diez minutos caminando del estadio. Más tranquilo que Gastown, con mejor calidad promedio de restaurantes." },
      { kind:"alternative", title:"Presupuesto con criterio: Mount Pleasant / Main Street", body:"Al sur del centro, Mount Pleasant tiene el mayor número de cafeterías independientes, librerías y restaurantes de costo razonable de Vancouver. Está en la Expo Line (Main Street-Science World), que es exactamente la estación que se usa para llegar al estadio en días de partido. La logística no podría ser más limpia." },
    ],
  },
  stays:[
    { name:"Burrard Hotel", area:"Downtown", price:"$$$", priceCAD:"$300–480 CAD/noche (periodo mundialista)", tags:["Diseño honesto","Boutique","Robson cerca"], note:"Hotel de mediados del siglo XX con reforma contemporánea inteligente. Piscina en el techo, habitaciones con diseño honesto y ubicación a cuatro cuadras de Robson Street. A quince minutos caminando del estadio.", best_for:"Hotel boutique", url:"https://booking.stay22.com/lagomplan/D7ruOYHXD-" },
    { name:"HI Vancouver Central", area:"Downtown", price:"$", priceCAD:"$55–120 CAD/noche según tipo de habitación", tags:["Presupuesto","Habitaciones privadas","SkyTrain cerca"], note:"El hostal de referencia en Vancouver para el viajero con presupuesto ajustado. Instalaciones actualizadas, habitaciones privadas disponibles y conexión directa al SkyTrain a dos cuadras.", best_for:"Presupuesto / hostal", url:"https://booking.stay22.com/lagomplan/ZgKZumDd-f" },
    { name:"Fairmont Pacific Rim", area:"Coal Harbour / Waterfront", price:"$$$$", priceCAD:"$600–1,200 CAD/noche (periodo mundialista)", tags:["Vistas a las montañas","Spa","Piscina en techo"], note:"Vistas directas a las montañas y a la bahía de Coal Harbour desde el mismo hotel. Spa, piscina en el techo, restaurante de referencia. La dirección más impresionante de Vancouver para el viajero que también puede pagarlo.", best_for:"Lujo de cadena", url:"https://booking.stay22.com/lagomplan/imm_Upe4Mm" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Vancouver — YVR", text:"YVR — Vancouver International está a ~12 km del estadio y es accesible por SkyTrain Canada Line en ~25 minutos. Canadá requiere eTA (Electronic Travel Authorization) para ciudadanos de muchos países — se tramita en línea en canada.ca. No confundir con visa estadounidense; son requisitos independientes." },
      { icon:"🚇", title:"Del aeropuerto a la ciudad", text:"Canada Line SkyTrain desde YVR hasta Waterfront Station: ~25 minutos. Desde ahí puedes conectar con la Expo Line hacia Main Street-Science World. TransLink opera todo el SkyTrain — usa Compass Card o pago sin contacto." },
      { icon:"🏟", title:"Al estadio el día del partido — ruta maestra", text:"SkyTrain Expo Line → Main Street-Science World → ruta peatonal designada. La estación Main Street-Science World está a unos 10-15 minutos caminando del estadio por la ruta peatonal mundialista que pasa por Concord Lands. Es la estación oficial para BC Place durante el Mundial. Desde Gastown o Yaletown, el trayecto desde Waterfront Station o Granville Station toma entre 8 y 12 minutos en SkyTrain." },
      { icon:"⚠️", title:"Error crítico — Stadium-Chinatown CERRADA", text:"Usar la estación Stadium-Chinatown del SkyTrain en días de partido es el error crítico. TransLink ha confirmado que esta estación estará CERRADA para fans mundialistas en todos los días de partido en BC Place. No importa lo que diga tu aplicación de tránsito o cualquier otra guía — no puedes entrar por ahí. La estación correcta es Main Street-Science World, siempre.", isWarning:true },
    ],
    timings:[
      { label:"YVR → Waterfront (Canada Line)",                  value:"~25 min" },
      { label:"Desde Gastown (Waterfront + SkyTrain + caminata)",value:"~25 min total" },
      { label:"YVR → Waterfront + Expo Line a Main St",          value:"~40 min total" },
      { label:"Desde Yaletown (caminando por False Creek)",      value:"~15 min a pie" },
      { label:"Uber desde Downtown (sin tráfico)",               value:"10 min — imprevisible con tráfico de partido" },
    ],
    matchDayCronologia:{
      matchName:"24 Jun · Suiza vs. Canadá · 12:00 PT",
      steps:[
        { time:"H-2:30", text:"Desayuna en Gastown o Yaletown. Los partidos de mediodía son los mejores para empezar bien el día." },
        { time:"H-2:00", text:"Toma el SkyTrain desde tu estación más cercana hacia Main Street-Science World." },
        { time:"H-1:30", text:"Llegada al estadio. Las puertas abren 90 minutos antes." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo. El BC Place tiene techo — si llueve, ya estás adentro." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:30", text:"SkyTrain de regreso por la misma ruta. El BC Place tiene techo — si llueve después del partido, ya estás adentro hasta que pase." },
      ],
    },
    timing:"BC Place está en el centro de la ciudad — literalmente. El desafío no es la distancia, sino saber qué estación de SkyTrain usar. Aquí hay una sola instrucción que importa más que cualquier otra en esta guía: Main Street-Science World, siempre.",
    cost:"Una de las ciudades más caras de Norteamérica en año sin Mundial. El torneo confirma lo que el mercado inmobiliario ya había establecido. Reserva con anticipación.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — PNE / Hastings Park", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest de Vancouver se instala en el Hastings Park (PNE — Pacific National Exhibition), el gran recinto ferial del este de la ciudad. Pantallas de gran formato, programación cultural y activaciones en un espacio que tiene capacidad para decenas de miles de fanáticos. Acceso por SkyTrain Expo Line hasta Commercial-Broadway, luego autobús hacia Hastings. Para el fan sin boleto en días de partido de Canadá, llega temprano: el PNE se llena.", tag:"Sin boleto OK" },
    { title:"Plaza Canada Place", type:"Pantalla exterior", typeColor:FJORD, desc:"El emblemático edificio de velas blancas sobre el puerto de Burrard Inlet tiene una explanada exterior orientada al agua que en eventos internacionales opera como pantalla de facto de la ciudad. Para los partidos de Canadá, el contexto — Puerto de Vancouver, montañas North Shore, skyline — es el mejor telón de fondo mundialista del país.", tag:"Icónico" },
    { title:"Robson Square", type:"Plaza peatonal", typeColor:SAGE, desc:"La plaza peatonal techada frente al Tribunal de Justicia Provincial y la Galería de Arte de BC fue el escenario de las celebraciones del oro en hockey de los Juegos Olímpicos de 2010. Vancouver la activa para eventos masivos con cierta regularidad — el torneo justifica hacerlo de nuevo.", tag:"Familiar" },
    { title:"Commercial Drive — La Drive", type:"Barrio italiano", typeColor:PINE, desc:"El corredor italiano de Vancouver lleva transmitiendo calcio en sus cafeterías y terrazas desde los años 90. En días de partido de Italia (cuando clasifican), Argentina o Brasil, la Drive se convierte en un estadio al aire libre sin que nadie lo haya convocado formalmente. La historia futbolera más orgánica de cualquier calle de Canadá.", tag:"Auténtico" },
    { title:"Shark Club Bar & Grill", type:"Sports bar", typeColor:"#1A3A5C", desc:"El bar de deportes de referencia en Vancouver, con pantallas en cada ángulo y la mayor concentración de aficionados al fútbol por metro cuadrado de la ciudad en días de partido de Canadá. Para el 24 de junio (Suiza vs. Canadá), llega dos horas antes — se llena y no espera. Qué pedir: Alitas + cerveza local de BC. Vibe: Sports bar serio, el más animado de Vancouver en partidos internacionales.", tag:"Alta demanda" },
    { title:"The Cambie", type:"Pub histórico", typeColor:"#5A3A2A", desc:"Pub histórico con precios razonables y un ambiente de mezcla internacional que encaja perfectamente con el perfil del torneo. La clientela es tan diversa como el partido que esté en pantalla — para la sede con Australia, Bélgica, Nueva Zelanda y Qatar en el mismo calendario, The Cambie tiene a alguien de cada selección sentado en la barra. Qué pedir: Poutine + cerveza local de barril. Vibe: De barrio, con historia, sin pretensiones.", tag:"Gastown" },
    { title:"Score on Davie", type:"Sports bar", typeColor:"#093b12", desc:"El sports bar más activo del barrio de Davie, con múltiples pantallas, terraza exterior y una tradición establecida de transmitir fútbol internacional desde la era de la Champions en los años 2000. Para los partidos de Bélgica y Nueva Zelanda — con diásporas activas en Vancouver — Score es el punto de reunión natural. Qué pedir: Nachos de la casa + lo que esté de barril. Vibe: Barrio, activo, pantalla siempre encendida.", tag:"Davie Village" },
  ],

  food:[
    { dish:"Shark Club Bar & Grill", where:"Downtown — alitas + cerveza local de BC; sports bar serio, el más animado de Vancouver en partidos internacionales", price:"$$",    type:"Pre-partido" },
    { dish:"The Cambie",              where:"Gastown — poutine + cerveza local de barril; pub histórico, precios razonables y ambiente mezclado",                 price:"$",     type:"De barrio" },
    { dish:"Score on Davie",          where:"Davie Village — nachos de la casa + lo que esté de barril; barrio activo, terraza y pantalla siempre encendida",    price:"$$",    type:"Sports bar" },
    { dish:"Ramen de referencia",     where:"Robson Street — la mayor densidad de ramen de Norteamérica fuera de Japón",                                           price:"$–$$", type:"Imperdible" },
    { dish:"Sushi del Pacífico",      where:"Robson o Coal Harbour — sushi con acceso directo al Pacífico",                                                        price:"$$",   type:"Local" },
    { dish:"Curry sikh",               where:"Surrey, a 30 min en SkyTrain — la mejor comunidad sikh de Columbia Británica",                                       price:"$",    type:"Excursión" },
  ],

  experiences:[
    { title:"Whistler — excursión de día", duration:"Día completo", desc:"El entretiempo ideal para entender por qué Vancouver tiene una lista de espera de inmigración que el Mundial no va a achicar. A dos horas de Vancouver por la Sea-to-Sky Highway — una de las carreteras más espectaculares de Norteamérica. En junio, Whistler tiene senderismo de alta montaña, tirolesas, el Whistler Mountain Bike Park y vistas a glaciares. El autobús Whistler Mountaineer opera desde el centro de Vancouver. Para el fan con un día completo libre entre el 13 y el 18 de junio, no hay mejor excursión en el torneo.", type:"Excursión", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver tours a Whistler" },
    { title:"Deep Cove + Indian Arm — kayak", duration:"Medio día", desc:"A 30 minutos en auto o transporte privado al norte de Vancouver, Deep Cove es un pueblo de kayak en el Indian Arm. Alquiler de kayaks y paddleboards disponibles por hora o por día. El recorrido hacia el fiordo tiene aguas tranquilas, cascadas y vistas que explican por qué la gente paga $2 millones por vivir cerca.", type:"Aventura", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Reservar kayak en Deep Cove" },
    { title:"Stanley Park + English Bay", duration:"Mañana o tarde", desc:"El parque urbano más grande de Norteamérica rodea la parte norte de la península de Vancouver en 405 hectáreas de bosque costero. La ruta en bicicleta del Seawall (22 km de circuito) recorre la costa del parque con vistas al estrecho de Georgia. El alquiler de bicicletas está disponible en English Bay y junto al parque. Al atardecer, English Bay es el punto de reunión de la ciudad: el mejor sitio para ver el ocaso del Pacífico antes de un partido nocturno.", type:"Ciudad", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Alquilar bicicleta en English Bay" },
    { title:"BC Place — el estadio antes del partido", duration:"1–2 horas", desc:"El BC Place tiene techo retráctil y fue sede de la final de la Copa del Mundo Femenina 2015. Llegar 90 minutos antes del partido no es logística — es el espectáculo. La explanada exterior, el False Creek a pasos, y las montañas North Shore al fondo son la foto previa al partido.", type:"Imperdible", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver entradas disponibles" },
  ],

  itinerary:[
    { day:1, title:"Llegada y primer pulso", subtitle:"Gastown · Yaletown · False Creek", isMatchDay:false, steps:[
      { time:"Llegada",   text:"Canada Line SkyTrain desde YVR hasta Waterfront Station. ~25 minutos. Directo, sin trasbordos, con elevadores." },
      { time:"Tarde",     text:"Deja el equipaje y camina hacia Gastown. El reloj de vapor, las galerías en Water Street, el café de especialidad en Revolver Coffee." },
      { time:"Atardecer", text:"Ruta a pie por el False Creek hacia Yaletown. El BC Place iluminado al fondo del canal es la bienvenida al torneo." },
      { time:"Noche",     text:"Cena en Yaletown. Bares de Mainland Street para cerrar el día. Vancouver tiene sol hasta las 9:30pm en junio." },
    ]},
    { day:2, title:"Día de partido — Australia vs. Türkiye", subtitle:"BC Place · Sáb 13 Jun · 21:00 PT", isMatchDay:true, matchRef:"m1", steps:[
      { time:"Mañana", text:"Sin prisa — el partido es nocturno. Granville Island Market para desayunar. Puesto de ostras del Pacífico ($2–3 CAD cada una)." },
      { time:"Tarde",  text:"Stanley Park en bici. Alquiler en English Bay ($12 CAD/hora). El Seawall con vistas al estrecho de Georgia justifica el día libre." },
      { time:"18:00",  text:"Pre-partido en The Cambie (Gastown) o Shark Club. La afición australiana y turca estará activa en la ciudad desde las 5pm." },
      { time:"20:30",  text:"Camina al BC Place desde Gastown: 10 minutos por el waterfront. O SkyTrain desde Waterfront → Main Street-Science World." },
      { time:"21:00",  text:"Apertura nocturna de la sede. Australia vs. Türkiye. El techo retráctil estará abierto si el clima lo permite." },
    ]},
    { day:3, title:"Día de partido — Canadá vs. Qatar", subtitle:"BC Place · Jue 18 Jun · 12:00 PT", isMatchDay:true, matchRef:"m2", steps:[
      { time:"H-2:30", text:"Desayuno temprano en Gastown o Mount Pleasant. Los partidos de mediodía piden empezar el día bien." },
      { time:"H-2:00", text:"Plaza Canada Place para absorber el ambiente antes del partido. El Fan Fest del PNE abre desde la mañana en días de Canadá." },
      { time:"H-1:30", text:"SkyTrain Expo Line → Main Street-Science World. La estación correcta. Stadium-Chinatown estará cerrada." },
      { time:"12:00",  text:"Canadá vs. Qatar en casa. Si Canadá gana, el 24 de junio se convierte en el partido más importante del país." },
      { time:"Post",   text:"Post-partido en Robson Square o Commercial Drive. La Drive celebra independientemente del resultado." },
    ]},
    { day:4, title:"Día de partido — Suiza vs. Canadá", subtitle:"BC Place · Mié 24 Jun · 12:00 PT — Partido definitorio del Grupo B", isMatchDay:true, matchRef:"m4", steps:[
      { time:"H-2:30", text:"Desayuna en Gastown o Yaletown. Este es el partido que define si Canadá avanza. El día empieza con calma calculada." },
      { time:"H-2:00", text:"SkyTrain Expo Line desde tu estación hacia Main Street-Science World. Compra el Compass Card con anticipación." },
      { time:"H-1:30", text:"Puertas abiertas. BC Place con techo cerrado si hay lluvia. La afición canadiense llega desde temprano — el estadio va a estar lleno antes del warmup." },
      { time:"H-0:30", text:"En tu asiento. Boleto digital en la app FIFA listo. Suiza es un rival serio — el partido puede ir a cualquier lado." },
      { time:"Post",   text:"Si Canadá pasa: Commercial Drive y Robson Square van a estar imposibles — de la mejor manera posible. SkyTrain de regreso desde Main Street-Science World." },
    ]},
    { day:5, title:"Excursión — Whistler o Deep Cove", subtitle:"Sea-to-Sky Highway · Indian Arm", isMatchDay:false, steps:[
      { time:"Opción A", text:"Whistler: 2 horas por la Sea-to-Sky Highway. Senderismo de alta montaña, tirolesas, Whistler Mountain Bike Park. El autobús Whistler Mountaineer sale del centro de Vancouver. Para el día libre entre el 13 y el 21 de junio." },
      { time:"Opción B", text:"Deep Cove: 30 minutos al norte. Kayak en el Indian Arm desde Deep Cove Kayak. Aguas tranquilas, cascadas, vistas glaciares. La excursión más accesible de la ciudad." },
      { time:"Regreso",  text:"De vuelta a Vancouver antes del atardecer. English Bay para ver el ocaso del Pacífico — el mejor final de día de cualquier sede del torneo." },
      { time:"Noche",    text:"Cena final en Vancouver. Score on Davie para el partido de la noche si hay uno, o sushi en Robson Street para cerrar el capítulo." },
    ]},
  ],

  lagomTips:[
    "El 24 de junio (Suiza vs. Canadá, partido definitorio del Grupo B) y el 18 de junio (Canadá vs. Qatar) son las fechas de mayor demanda en Vancouver. Los dos partidos de Canadá en esta sede generan una demanda de hospedaje sin precedente en la historia del turismo de la ciudad.",
    "La estación correcta para BC Place es Main Street-Science World. Stadium-Chinatown estará CERRADA para fans mundialistas en todos los días de partido. Ninguna app te va a actualizar esto en tiempo real.",
    "eTA canadiense obligatoria antes de volar — tramítala en canada.ca. No confundir con visa estadounidense: son requisitos completamente independientes.",
    "Vancouver tiene la mejor escena de ramen de Norteamérica fuera de Japón, sushi con acceso directo al Pacífico y dim sum que rivaliza con Hong Kong. No comas dos veces en el mismo lugar.",
  ],

  matchDayChecklist:[
    "eTA canadiense válida (canada.ca)",
    "Boleto digital del partido — app FIFA",
    "SkyTrain: Main Street-Science World (no Stadium-Chinatown)",
    "Compass Card cargada para TransLink",
    "Ropa en capas — 18-24°C, lluvia posible",
    "Paraguas ligero (el techo del BC Place cubre, pero la caminata no)",
    "Reserva de hotel confirmada para Jun 18 y Jun 24",
    "Llegada al estadio 90 min antes — puertas abren H-1:30",
  ],

  didYouKnow:"BC Place albergó la final de la Copa del Mundo Femenina 2015. Es el único estadio techado de Canadá en el torneo. El techo retráctil — el más grande del mundo cuando se inauguró en 1983 — le permite a Vancouver garantizar el partido independientemente del clima del Pacífico.",
  closingNote:"Vancouver llega al Mundial con siete partidos, un techo retráctil y las montañas North Shore de fondo. Canadá juega aquí dos veces y la segunda vez — el 24 de junio contra Suiza — puede ser la más importante del torneo para el país. Antes de ese partido, y después de él, hay una ciudad que sabe recibir al mundo porque lleva décadas siendo el punto de llegada de todos. LagomPlan te da la estación de SkyTrain correcta, el barrio indicado y la razón para quedarte un día más. El resto lo hace el Pacífico.",
  closingSignature:"Lagomplan · Guía de campo · Vancouver · Mundial 2026",
  plannerCTA:"Generar mi viaje a Vancouver",

  sectionSubtitles:{
    matches:"7 partidos confirmados en BC Place. Los dos de Canadá — 18 y 24 de junio — son los de mayor demanda.",
    vibe:"Fan fest oficial, pantallas en la ciudad y el barrio italiano que lleva 30 años transmitiendo calcio.",
    logistics:"Una sola instrucción importa más que cualquier otra en esta guía.",
    food:"Vancouver no tiene una gastronomía nacional — tiene el Pacífico a la puerta y una comunidad asiática que lleva décadas redefiniendo lo que significa comer bien en Norteamérica.",
  },
  staysWarning:"Los precios son estimaciones para el periodo mundialista. El 24 de junio (Suiza vs. Canadá, partido definitorio del Grupo B) y el 18 de junio (Canadá vs. Qatar) son las fechas de mayor demanda en Vancouver. Si no tienes reserva confirmada, Airbnb en Kitsilano, Commercial Drive o East Vancouver tienen buena conexión de SkyTrain.",
}

export const en: CityGuide = {
  id:"van",
  city:"Vancouver",
  country:"Canada",
  state:"British Columbia",
  flag:"🇨🇦",
  accent: ACCENT,

  tags:["Football","Food","Nature","Co-host city"],

  stadium:{ name:"BC Place", capacity:"~54,500", area:"Downtown — next to False Creek" },

  headline:"The only host city in the tournament where the stadium shares its skyline with snow-capped mountains. No need to make a metaphor of it.",
  description:"The only host city in the tournament where the stadium shares its skyline with snow-capped mountains. No need to make a metaphor of it. Vancouver arrives at the World Cup with seven matches, a retractable roof — the only covered stadium in Canada in the tournament — and Canada playing twice here. The second one, June 24 against Switzerland, may be the most important for the country.",

  scores:[
    { label:"Atmosphere", value:4 },
    { label:"Football",   value:4 },
    { label:"Food",       value:5 },
    { label:"Transit",    value:5 },
    { label:"Safety",     value:5 },
    { label:"Cost",       value:2 },
  ],

  matches:[
    { id:"m1", date:"Jun 13", day:"Sat", time:"21:00 PT", teams:[{name:"Australia",flag:"🇦🇺"},{name:"Türkiye",flag:"🇹🇷"}], stadium:"BC Place", tag:"Group D — venue evening opener", highlight:false },
    { id:"m2", date:"Jun 18", day:"Thu", time:"12:00 PT", teams:[{name:"Canada",flag:"🇨🇦"},{name:"Qatar",flag:"🇶🇦"}], stadium:"BC Place", tag:"Group B — Canada at home", highlight:true },
    { id:"m3", date:"Jun 21", day:"Sun", time:"18:00 PT", teams:[{name:"New Zealand",flag:"🇳🇿"},{name:"Egypt",flag:"🇪🇬"}], stadium:"BC Place", tag:"Group F", highlight:false },
    { id:"m4", date:"Jun 24", day:"Wed", time:"12:00 PT", teams:[{name:"Switzerland",flag:"🇨🇭"},{name:"Canada",flag:"🇨🇦"}], stadium:"BC Place", tag:"Group B — decisive group match", highlight:true },
    { id:"m5", date:"Jun 26", day:"Fri", time:"20:00 PT", teams:[{name:"New Zealand",flag:"🇳🇿"},{name:"Belgium",flag:"🇧🇪"}], stadium:"BC Place", tag:"Group F", highlight:false },
    { id:"m6", date:"Jul 2",  day:"Thu", time:"TBD",      teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"BC Place", tag:"Knockout stage", highlight:false },
    { id:"m7", date:"Jul 7",  day:"Tue", time:"13:00 PT", teams:[{name:"Round of 16",flag:""},{name:"TBD",flag:""}], stadium:"BC Place", tag:"Knockout stage", highlight:false },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",      value:"Vancouver Stadium (BC Place)" },
      { label:"Capacity",          value:"~54,500 — FIFA configuration — with a retractable roof, the only covered stadium in Canada in the tournament" },
      { label:"Roof",               value:"Retractable — the only covered stadium in Canada in the tournament" },
      { label:"Weather (Jun–Jul)",  value:"18–24°C · Occasional rain · The roof covers fans when the Pacific decides to weigh in" },
      { label:"Matches",            value:"7 confirmed (5 group + 1 Round of 32 + 1 Round of 16)" },
      { label:"Primary airport",    value:"YVR — Vancouver International (~12 km from the stadium, accessible via SkyTrain Canada Line in ~25 minutes)" },
      { label:"Visa",               value:"Canada requires an eTA for citizens of many countries — apply online at canada.ca. Don't confuse with a U.S. visa; they're independent requirements." },
    ],
    body:"Vancouver didn't need the World Cup to be a destination. What the tournament gives it is context: seven matches, Canada's dream of advancing being played out here, and confirmation that BC Place — where the 2015 Women's World Cup Final was played — knows what a big match feels like. The stadium knows the weight. The city does too.",
    lagomNote:"Canada requires an eTA (Electronic Travel Authorization) for citizens of many countries. Apply at canada.ca — don't confuse it with a U.S. visa, they're independent requirements. Handle it before buying the flight.",
  },

  vibe:{
    body:"Canada plays here twice — including the decisive Group B match on June 24 against Switzerland. Vancouver is where Canada's dream of advancing will be defined. If Canada makes it out of the group stage, this city lives it first. Vancouver Whitecaps has one of the most active MLS fan bases in the country. BC Place already hosted the 2015 Women's World Cup Final — the stadium knows the weight of a big match. The city adds the best sushi scene outside Japan, dim sum that rivals Hong Kong, internationally known izakaya, and markets with direct Pacific access. For eating, Vancouver doesn't need to justify itself. Cost is the ceiling: one of the most expensive cities in North America in a non–World Cup year, and the tournament just confirms what the real estate market had already established.",
    lagomNote:"For June 24 (Switzerland vs. Canada, Group B decider) and June 18 (Canada vs. Qatar), the PNE fills before noon. Canada's two matches here generate a demand with no precedent in the city's tourism history.",
  },

  neighborhoods:[
    { name:"Gastown / Downtown", vibe:"Where to base yourself: key neighborhoods. Vancouver is compact for its size. BC Place sits in the center of the city, next to False Creek — which means most interesting neighborhoods are fifteen or twenty minutes from the stadium on foot or by SkyTrain. Recommended base: Gastown / Downtown. Gastown is Vancouver's historic neighborhood: cobblestones, restored warehouse architecture, and the densest concentration of bars and restaurants in the city within a short radius. Ten minutes on foot from BC Place. SkyTrain access from Waterfront Station connects to the airport and to Main Street-Science World (the match-day station for the stadium). For the fan who wants to be in the heart of the city and walk to the match.", best_for:"WC fan", walk_to_stadium:"10 min on foot · Waterfront Station (SkyTrain)", lagomNote:null },
    { name:"Yaletown", vibe:"Design option: Yaletown. A former industrial district reborn as a high-end residential neighborhood with chef-driven restaurants, craft-beer patios, and bars where the Premier League plays on correctly-sized screens. Also ten minutes on foot from the stadium. Quieter than Gastown, with a higher average restaurant quality.", best_for:"Couple", walk_to_stadium:"10 min on foot · False Creek waterfront", lagomNote:null },
    { name:"Mount Pleasant / Main Street", vibe:"Budget with standards: Mount Pleasant / Main Street. South of downtown, Mount Pleasant has the highest concentration of independent coffee shops, bookstores, and reasonably priced restaurants in Vancouver. It's on the Expo Line (Main Street-Science World), which is exactly the station used to reach the stadium on match days. The logistics couldn't be cleaner.", best_for:"Budget", walk_to_stadium:"Main Street-Science World + pedestrian route (~15 min)", lagomNote:null },
  ],

  stays:[
    { name:"Burrard Hotel", area:"Downtown", price:"$$$", priceCAD:"$300–480 CAD/night (World Cup period)", tags:["Honest design","Boutique","Near Robson"], note:"A mid-20th-century hotel with a smart contemporary reno. Rooftop pool, rooms with honest design, and a location four blocks from Robson Street. Fifteen minutes on foot from the stadium.", best_for:"Boutique", url:"https://booking.stay22.com/lagomplan/D7ruOYHXD-" },
    { name:"HI Vancouver Central", area:"Downtown", price:"$", priceCAD:"$55–120 CAD/night by room type", tags:["Budget","Private rooms","Near SkyTrain"], note:"Vancouver's reference hostel for budget travelers. Updated facilities, private rooms available, and direct SkyTrain access two blocks away.", best_for:"Budget / hostel", url:"https://booking.stay22.com/lagomplan/ZgKZumDd-f" },
    { name:"Fairmont Pacific Rim", area:"Coal Harbour / Waterfront", price:"$$$$", priceCAD:"$600–1,200 CAD/night (World Cup period)", tags:["Mountain views","Spa","Rooftop pool"], note:"Direct views of the mountains and Coal Harbour from the hotel itself. Spa, rooftop pool, reference restaurant. The most impressive address in Vancouver for the traveler who can also afford it.", best_for:"Chain luxury", url:"https://booking.stay22.com/lagomplan/imm_Upe4Mm" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Vancouver — YVR", text:"YVR — Vancouver International is ~12 km from the stadium and accessible by SkyTrain Canada Line in ~25 minutes. Canada requires an eTA (Electronic Travel Authorization) for citizens of many countries — apply online at canada.ca. Don't confuse it with a U.S. visa; they're independent requirements." },
      { icon:"🚇", title:"Airport to the city", text:"Canada Line SkyTrain from YVR to Waterfront Station: ~25 minutes. From there you connect to the Expo Line toward Main Street-Science World. TransLink operates the full SkyTrain — use a Compass Card or contactless payment." },
      { icon:"🏟", title:"To the stadium on match day — master route", text:"SkyTrain Expo Line → Main Street-Science World → designated pedestrian route. The Main Street-Science World station is about 10–15 minutes on foot from the stadium via the World Cup pedestrian route through Concord Lands. It's the official station for BC Place during the tournament. From Gastown or Yaletown, the trip from Waterfront Station or Granville Station runs 8–12 minutes on SkyTrain." },
      { icon:"⚠️", title:"Critical error — Stadium-Chinatown is CLOSED", text:"Using the Stadium-Chinatown SkyTrain station on match days is the critical error. TransLink has confirmed this station will be CLOSED to World Cup fans on every match day at BC Place. No matter what your transit app or any other guide says — you can't enter through there. The correct station is Main Street-Science World, always.", isWarning:true },
    ],
    timings:[
      { label:"YVR → Waterfront (Canada Line)",                   value:"~25 min" },
      { label:"From Gastown (Waterfront + SkyTrain + walk)",      value:"~25 min total" },
      { label:"YVR → Waterfront + Expo Line to Main St",          value:"~40 min total" },
      { label:"From Yaletown (walking via False Creek)",           value:"~15 min on foot" },
      { label:"Uber from Downtown (no traffic)",                   value:"10 min — unpredictable with match traffic" },
    ],
    matchDayCronologia:{
      matchName:"Jun 24 · Switzerland vs. Canada · 12:00 PT",
      steps:[
        { time:"H-2:30", text:"Breakfast in Gastown or Yaletown. Noon matches are the best ones for starting the day right." },
        { time:"H-2:00", text:"Take the SkyTrain from your closest station toward Main Street-Science World." },
        { time:"H-1:30", text:"Arrive at the stadium. Gates open 90 minutes before kickoff." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready. BC Place has a roof — if it rains, you're already inside." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:30", text:"SkyTrain back via the same route. BC Place has a roof — if it rains after the match, you're already inside until it passes." },
      ],
    },
    timing:"BC Place is in the center of the city — literally. The challenge isn't the distance, it's knowing which SkyTrain station to use. There's one instruction here that matters more than any other in this guide: Main Street-Science World, always.",
    cost:"One of the most expensive cities in North America in a non–World Cup year. The tournament confirms what the real estate market had already established. Book ahead.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — PNE / Hastings Park", type:"Official fan fest", typeColor:CORAL, desc:"Vancouver's Fan Fest sets up at Hastings Park (PNE — Pacific National Exhibition), the big fairgrounds on the east side of the city. Big-format screens, cultural programming, and activations in a space with capacity for tens of thousands of fans. Access via SkyTrain Expo Line to Commercial-Broadway, then a bus toward Hastings. For the fan without a ticket on Canada match days, arrive early: the PNE fills up.", tag:"No ticket needed" },
    { title:"Canada Place Plaza", type:"Outdoor screen", typeColor:FJORD, desc:"The iconic white-sails building on Burrard Inlet has an outdoor esplanade facing the water that becomes the city's de facto screen during international events. For Canada matches, the context — the Port of Vancouver, the North Shore mountains, the skyline — is the best World Cup backdrop in the country.", tag:"Iconic" },
    { title:"Robson Square", type:"Pedestrian plaza", typeColor:SAGE, desc:"The covered pedestrian plaza in front of the Provincial Law Courts and the BC Art Gallery was the site of the hockey-gold celebrations at the 2010 Olympic Games. Vancouver activates it for mass events with some regularity — the tournament justifies doing it again.", tag:"Family" },
    { title:"Commercial Drive — La Drive", type:"Italian neighborhood", typeColor:PINE, desc:"Vancouver's Italian corridor has been broadcasting calcio in its coffee shops and terraces since the 90s. On Italy match days (when they qualify), Argentina, or Brazil, La Drive turns into an open-air stadium without anyone officially organizing it. The most organic football history of any street in Canada.", tag:"Authentic" },
    { title:"Shark Club Bar & Grill", type:"Sports bar", typeColor:"#1A3A5C", desc:"Vancouver's reference sports bar, with screens at every angle and the city's highest concentration of football fans per square meter on Canada match days. For June 24 (Switzerland vs. Canada), arrive two hours early — it fills and doesn't wait. What to order: Wings + BC local beer. Vibe: serious sports bar, the liveliest in Vancouver on international matches.", tag:"High demand" },
    { title:"The Cambie", type:"Historic pub", typeColor:"#5A3A2A", desc:"A historic pub with reasonable prices and an international-mix atmosphere that fits the tournament's profile perfectly. The crowd is as diverse as the match on screen — for a venue with Australia, Belgium, New Zealand, and Qatar on the same calendar, The Cambie has someone from each national team at the bar. What to order: Poutine + local draft beer. Vibe: neighborhood, with history, no pretension.", tag:"Gastown" },
    { title:"Score on Davie", type:"Sports bar", typeColor:"#093b12", desc:"The most active sports bar in the Davie neighborhood, with multiple screens, an outdoor terrace, and an established tradition of broadcasting international football since the Champions era in the 2000s. For Belgium and New Zealand matches — with active diasporas in Vancouver — Score is the natural gathering point. What to order: house nachos + whatever's on tap. Vibe: neighborhood, active, screen always on.", tag:"Davie Village" },
  ],

  food:[
    { dish:"Shark Club Bar & Grill", where:"Downtown — wings + BC local beer; serious sports bar, the liveliest in Vancouver on international matches",   price:"$$",   type:"Pre-match" },
    { dish:"The Cambie",              where:"Gastown — poutine + local draft beer; historic pub with reasonable prices and a mixed crowd",                  price:"$",    type:"Neighborhood" },
    { dish:"Score on Davie",          where:"Davie Village — house nachos + whatever's on tap; active neighborhood, terrace, and always-on screen",         price:"$$",   type:"Sports bar" },
    { dish:"Reference ramen",         where:"Robson Street — the highest density of ramen in North America outside Japan",                                   price:"$–$$",type:"Must try" },
    { dish:"Pacific sushi",           where:"Robson or Coal Harbour — sushi with direct Pacific access",                                                     price:"$$",   type:"Local" },
    { dish:"Sikh curry",               where:"Surrey, 30 min on SkyTrain — the best Sikh community in British Columbia",                                     price:"$",    type:"Excursion" },
  ],

  experiences:[
    { title:"Whistler — day trip", duration:"Full day", desc:"The perfect halftime to understand why Vancouver has an immigration waiting list the World Cup isn't going to shrink. Two hours from Vancouver on the Sea-to-Sky Highway — one of the most spectacular roads in North America. In June, Whistler has alpine hiking, ziplines, the Whistler Mountain Bike Park, and glacier views. The Whistler Mountaineer bus runs from downtown Vancouver. For the fan with a full free day between June 13 and 18, there's no better excursion in the tournament.", type:"Day trip", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See Whistler tours" },
    { title:"Deep Cove + Indian Arm — kayaking", duration:"Half day", desc:"30 minutes by car or private transport north of Vancouver, Deep Cove is a kayaking village on Indian Arm. Kayak and paddleboard rentals available by the hour or the day. The route into the fjord has calm waters, waterfalls, and views that explain why people pay $2 million to live nearby.", type:"Adventure", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Book kayak in Deep Cove" },
    { title:"Stanley Park + English Bay", duration:"Morning or afternoon", desc:"The largest urban park in North America wraps the northern part of the Vancouver peninsula across 405 hectares of coastal forest. The Seawall bike route (22 km loop) runs the park's coastline with views of the Strait of Georgia. Bike rentals are available at English Bay and next to the park. At sunset, English Bay is the city's gathering point: the best place to watch the Pacific sunset before an evening match.", type:"City", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Rent a bike at English Bay" },
    { title:"BC Place — the stadium before the match", duration:"1–2 hours", desc:"BC Place has a retractable roof and hosted the 2015 Women's World Cup Final. Arriving 90 minutes before kickoff isn't logistics — it's the show. The outdoor esplanade, False Creek a few steps away, and the North Shore mountains in the background are the pre-match photo.", type:"Must try", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See available tickets" },
  ],

  itinerary:[
    { day:1, title:"Arrival and first pulse", subtitle:"Gastown · Yaletown · False Creek", isMatchDay:false, steps:[
      { time:"Arrival",  text:"Canada Line SkyTrain from YVR to Waterfront Station. ~25 minutes. Direct, no transfers, elevators." },
      { time:"Afternoon",text:"Drop the luggage and walk to Gastown. The steam clock, the galleries on Water Street, the specialty coffee at Revolver Coffee." },
      { time:"Evening",  text:"On-foot route along False Creek to Yaletown. BC Place lit up at the end of the channel is the tournament's welcome." },
      { time:"Night",    text:"Dinner in Yaletown. Bars on Mainland Street to close the day. Vancouver has daylight until 9:30pm in June." },
    ]},
    { day:2, title:"Match day — Australia vs. Türkiye", subtitle:"BC Place · Sat Jun 13 · 21:00 PT", isMatchDay:true, matchRef:"m1", steps:[
      { time:"Morning",   text:"No rush — the match is at night. Granville Island Market for breakfast. Pacific oyster stand ($2–3 CAD each)." },
      { time:"Afternoon", text:"Stanley Park by bike. Rental at English Bay ($12 CAD/hour). The Seawall with views of the Strait of Georgia justifies the day." },
      { time:"18:00",     text:"Pre-match at The Cambie (Gastown) or Shark Club. The Australian and Turkish crowds will be active in the city from 5pm." },
      { time:"20:30",     text:"Walk to BC Place from Gastown: 10 minutes along the waterfront. Or SkyTrain from Waterfront → Main Street-Science World." },
      { time:"21:00",     text:"Venue evening opener. Australia vs. Türkiye. The retractable roof will be open if the weather allows." },
    ]},
    { day:3, title:"Match day — Canada vs. Qatar", subtitle:"BC Place · Thu Jun 18 · 12:00 PT", isMatchDay:true, matchRef:"m2", steps:[
      { time:"H-2:30", text:"Early breakfast in Gastown or Mount Pleasant. Noon matches demand starting the day right." },
      { time:"H-2:00", text:"Canada Place Plaza to soak up the atmosphere before the match. The PNE Fan Fest opens from the morning on Canada days." },
      { time:"H-1:30", text:"SkyTrain Expo Line → Main Street-Science World. The correct station. Stadium-Chinatown will be closed." },
      { time:"12:00",  text:"Canada vs. Qatar at home. If Canada wins, June 24 becomes the most important match of the country." },
      { time:"Post",   text:"Post-match at Robson Square or Commercial Drive. La Drive celebrates regardless of the result." },
    ]},
    { day:4, title:"Match day — Switzerland vs. Canada", subtitle:"BC Place · Wed Jun 24 · 12:00 PT — Group B decider", isMatchDay:true, matchRef:"m4", steps:[
      { time:"H-2:30", text:"Breakfast in Gastown or Yaletown. This is the match that decides if Canada advances. The day starts with calculated calm." },
      { time:"H-2:00", text:"SkyTrain Expo Line from your station toward Main Street-Science World. Buy the Compass Card ahead." },
      { time:"H-1:30", text:"Gates open. BC Place with the roof closed if it's raining. Canadian fans arrive early — the stadium will be full before warmups." },
      { time:"H-0:30", text:"In your seat. Digital ticket in the FIFA app ready. Switzerland is a serious opponent — the match can go either way." },
      { time:"Post",   text:"If Canada advances: Commercial Drive and Robson Square will be impossible — in the best way possible. SkyTrain back from Main Street-Science World." },
    ]},
    { day:5, title:"Excursion — Whistler or Deep Cove", subtitle:"Sea-to-Sky Highway · Indian Arm", isMatchDay:false, steps:[
      { time:"Option A", text:"Whistler: 2 hours on the Sea-to-Sky Highway. Alpine hiking, ziplines, Whistler Mountain Bike Park. The Whistler Mountaineer bus leaves downtown Vancouver. For the free day between June 13 and 21." },
      { time:"Option B", text:"Deep Cove: 30 minutes north. Kayaking on Indian Arm from Deep Cove Kayak. Calm waters, waterfalls, glacier views. The most accessible excursion in the city." },
      { time:"Return",   text:"Back to Vancouver before sunset. English Bay to watch the Pacific sunset — the best end of day at any host city in the tournament." },
      { time:"Night",    text:"Final dinner in Vancouver. Score on Davie for the evening match if there's one, or sushi on Robson Street to close the chapter." },
    ]},
  ],

  lagomTips:[
    "June 24 (Switzerland vs. Canada, Group B decider) and June 18 (Canada vs. Qatar) are the highest-demand dates in Vancouver. Canada's two matches at this venue generate a lodging demand with no precedent in the city's tourism history.",
    "The correct station for BC Place is Main Street-Science World. Stadium-Chinatown will be CLOSED to World Cup fans on every match day. No app will update this in real time.",
    "Canadian eTA required before flying — apply at canada.ca. Don't confuse it with a U.S. visa: they're completely independent requirements.",
    "Vancouver has the best ramen scene in North America outside Japan, sushi with direct Pacific access, and dim sum that rivals Hong Kong. Don't eat twice in the same place.",
  ],

  matchDayChecklist:[
    "Valid Canadian eTA (canada.ca)",
    "Digital match ticket — FIFA app",
    "SkyTrain: Main Street-Science World (not Stadium-Chinatown)",
    "Compass Card loaded for TransLink",
    "Layered clothing — 18–24°C, rain possible",
    "Light umbrella (the BC Place roof covers, but the walk doesn't)",
    "Hotel reservation confirmed for Jun 18 and Jun 24",
    "Arrive at the stadium 90 min ahead — gates open at H-1:30",
  ],

  didYouKnow:"BC Place hosted the 2015 FIFA Women's World Cup Final. It's the only covered stadium in Canada in the tournament. The retractable roof — the largest in the world when it opened in 1983 — lets Vancouver guarantee the match regardless of Pacific weather.",
  closingNote:"Vancouver arrives at the World Cup with seven matches, a retractable roof, and the North Shore mountains in the background. Canada plays here twice, and the second time — June 24 against Switzerland — may be the most important match of the tournament for the country. Before that match, and after it, there's a city that knows how to receive the world because it has spent decades being everyone's landing point. LagomPlan gives you the right SkyTrain station, the right neighborhood, and the reason to stay one more day. The Pacific handles the rest.",
  closingSignature:"Lagomplan · Field Guide · Vancouver · World Cup 2026",
  plannerCTA:"Generate my Vancouver trip",

  sectionSubtitles:{
    matches:"7 matches confirmed at BC Place. The two Canada matches — June 18 and 24 — are the highest-demand dates.",
    vibe:"Official Fan Fest, city-wide screens, and the Italian neighborhood that has been showing calcio for 30 years.",
    logistics:"One instruction matters more than any other in this guide.",
    food:"Vancouver doesn't have a national cuisine — it has the Pacific at its door and an Asian community that has spent decades redefining what eating well means in North America.",
  },
  staysWarning:"Prices are estimates for the World Cup period. June 24 (Switzerland vs. Canada, Group B decider) and June 18 (Canada vs. Qatar) are the highest-demand dates in Vancouver. If you don't have a confirmed reservation, Airbnb in Kitsilano, Commercial Drive, or East Vancouver offer good SkyTrain connectivity.",
}
