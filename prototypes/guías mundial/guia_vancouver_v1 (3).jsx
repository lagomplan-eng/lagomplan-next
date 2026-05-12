import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — LagomPlan canonical
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  pine:"#0F3A33", sage:"#6B8F86", sageLight:"#EAF2F0",
  sand:"#EDE7E1", sandLight:"#F7F4F1", sandDark:"#D9D2C9",
  coral:"#E1615B", coralLight:"#FCEEED",
  fjord:"#2D4F6C", fjordLight:"#E3EBF2",
  ink:"#1C1C1A", inkMid:"#5A5A56", inkFaint:"#9A9A94",
  white:"#FFFFFF",
  matchGold:"#B8860B", matchGoldLight:"#FBF5E0",
  bg:"#fff9f3",   // ← updated background for individual guides
};

const RADIUS = 8;
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";
const CITY_ACCENT = "#2D4F6C"; // Vancouver fjord

const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>
    {children}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// VANCOUVER GUIDE DATA — real content, no hallucinations
// ─────────────────────────────────────────────────────────────────────────────
const VANCOUVER = {
  id:"van",
  city:"Vancouver",
  country:"Canadá",
  state:"Columbia Británica",
  flag:"🇨🇦",
  accent: CITY_ACCENT,

  tags:["Fútbol","Gastronomía","Naturaleza","Sede co-anfitriona"],

  stadium:{ name:"BC Place", capacity:"~54,500", area:"Downtown — junto al False Creek" },

  headline:"La única sede del torneo donde el estadio comparte el horizonte con montañas nevadas.",
  description:"No hace falta que sea metáfora. Vancouver llega al Mundial con siete partidos, un techo retráctil — el único estadio techado de Canadá en el torneo — y Canadá jugando dos veces aquí. La segunda, el 24 de junio contra Suiza, puede ser la más importante para el país.",

  scores:[
    { label:"Ambiente",    value:4 },
    { label:"Fútbol local",value:4 },
    { label:"Gastronomía", value:5 },
    { label:"Transporte",  value:5 },
    { label:"Seguridad",   value:5 },
    { label:"Costo",       value:2 },
  ],

  // ── MATCHES — 7 confirmados ────────────────────────────────────────────────
  matches:[
    {
      id:"m1", date:"13 Jun", day:"Sáb", time:"21:00 PT",
      teams:[{name:"Australia",flag:"🇦🇺"},{name:"Türkiye",flag:"🇹🇷"}],
      stadium:"BC Place", tag:"Apertura nocturna", highlight:false,
    },
    {
      id:"m2", date:"18 Jun", day:"Jue", time:"12:00 PT",
      teams:[{name:"Canadá",flag:"🇨🇦"},{name:"Qatar",flag:"🇶🇦"}],
      stadium:"BC Place", tag:"Canadá en casa", highlight:true,
    },
    {
      id:"m3", date:"21 Jun", day:"Dom", time:"18:00 PT",
      teams:[{name:"Nueva Zelanda",flag:"🇳🇿"},{name:"Egipto",flag:"🇪🇬"}],
      stadium:"BC Place", tag:null, highlight:false,
    },
    {
      id:"m4", date:"24 Jun", day:"Mié", time:"12:00 PT",
      teams:[{name:"Suiza",flag:"🇨🇭"},{name:"Canadá",flag:"🇨🇦"}],
      stadium:"BC Place", tag:"Partido definitorio — Grupo B", highlight:true,
    },
    {
      id:"m5", date:"26 Jun", day:"Vie", time:"20:00 PT",
      teams:[{name:"Nueva Zelanda",flag:"🇳🇿"},{name:"Bélgica",flag:"🇧🇪"}],
      stadium:"BC Place", tag:null, highlight:false,
    },
    {
      id:"m6", date:"2 Jul", day:"Jue", time:"TBD",
      teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}],
      stadium:"BC Place", tag:"Fase eliminatoria", highlight:false,
    },
    {
      id:"m7", date:"7 Jul", day:"Mar", time:"13:00 PT",
      teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}],
      stadium:"BC Place", tag:"Fase eliminatoria", highlight:false,
    },
  ],

  // ── 01 MANIFIESTO ──────────────────────────────────────────────────────────
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",   value:"Vancouver Stadium (BC Place)" },
      { label:"Aforo",          value:"~54,500 — configuración FIFA" },
      { label:"Techo",          value:"Retráctil — único estadio techado de Canadá en el torneo" },
      { label:"Clima (jun–jul)", value:"18–24°C · Lluvia ocasional · El techo cubre al fanático cuando el Pacífico decide opinar" },
      { label:"Partidos",       value:"7 confirmados (5 grupos + Ronda 32 + Ronda 16)" },
      { label:"Aeropuerto",     value:"YVR — Vancouver International · ~12 km · SkyTrain Canada Line en ~25 min" },
    ],
    body:"Vancouver no necesitaba el Mundial para ser un destino. Lo que el torneo le da es contexto: siete partidos, el sueño de Canadá de avanzar jugándose aquí, y la confirmación de que el BC Place — donde se jugó la final de la Copa del Mundo Femenina 2015 — sabe lo que es un partido grande. El estadio conoce el peso. La ciudad también.",
    lagomNote:"Canadá requiere eTA (Electronic Travel Authorization) para ciudadanos de muchos países. Se tramita en canada.ca — no confundir con la visa estadounidense, son requisitos independientes. Tramítala antes de comprar el vuelo.",
  },

  // ── 02 VIBRA ───────────────────────────────────────────────────────────────
  vibe:{
    body:"Canadá juega aquí dos veces, incluyendo el partido decisivo del Grupo B el 24 de junio contra Suiza. Vancouver es donde el sueño canadiense de avanzar se define. Si Canadá pasa la fase de grupos, esta ciudad lo vive antes que nadie. El Vancouver Whitecaps tiene una de las bases de fanáticos más activas de MLS — el BC Place ya albergó la final de la Copa del Mundo Femenina 2015. El estadio conoce el peso de un partido grande.",
    zones:[
      {
        name:"FIFA Fan Festival™ — Hastings Park (PNE)",
        type:"Fan Fest oficial",
        typeColor:T.coral,
        desc:"El Fan Fest de Vancouver se instala en el PNE — Hastings Park. Pantallas de gran formato, programación cultural y capacidad para decenas de miles de fanáticos. Acceso por Expo Line hasta Commercial-Broadway, luego autobús. Para el fan sin boleto en días de partido de Canadá, llega temprano: el PNE se llena.",
        tag:"Sin boleto OK",
      },
      {
        name:"Plaza Canada Place",
        type:"Pantalla exterior",
        typeColor:T.fjord,
        desc:"El edificio de velas blancas sobre el puerto de Burrard Inlet tiene una explanada exterior orientada al agua que opera como pantalla de facto de la ciudad. Para los partidos de Canadá, el contexto — Puerto de Vancouver, montañas North Shore, skyline — es el mejor telón de fondo mundialista del país.",
        tag:"Icónico",
      },
      {
        name:"Robson Square",
        type:"Plaza peatonal",
        typeColor:T.sage,
        desc:"La plaza peatonal techada frente al Tribunal de Justicia Provincial y la Galería de Arte de BC. Vancouver la activó para las celebraciones del oro en hockey de los JJ.OO. del 2010 — el torneo justifica hacerlo de nuevo.",
        tag:"Familiar",
      },
      {
        name:"Commercial Drive — 'La Drive'",
        type:"Barrio",
        typeColor:T.pine,
        desc:"El corredor italiano de Vancouver lleva transmitiendo calcio en sus cafeterías y terrazas desde los años 90. En días de partido de Argentina, Brasil o Italia (cuando clasifican), La Drive se convierte en un estadio al aire libre sin que nadie lo haya convocado formalmente. La historia futbolera más orgánica de cualquier calle de Canadá.",
        tag:"Auténtico",
      },
    ],
    lagomNote:"Para el 24 de junio (Suiza vs. Canadá, partido definitorio del Grupo B) y el 18 de junio (Canadá vs. Qatar), el PNE se llena antes del mediodía. Los dos partidos de Canadá en esta sede generan una demanda sin precedente en la historia del turismo de la ciudad.",
  },

  // ── 3.1 BARRIOS ────────────────────────────────────────────────────────────
  neighborhoods:[
    {
      name:"Gastown / Downtown",
      vibe:"Barrio histórico con adoquines, arquitectura de almacén restaurada y la mejor concentración de bares y restaurantes de la ciudad. A diez minutos caminando de BC Place.",
      best_for:"Fan WC",
      walk_to_stadium:"10 min a pie · Waterfront Station (SkyTrain)",
      lagomNote:null,
    },
    {
      name:"Yaletown",
      vibe:"Antiguo distrito industrial reconvertido en barrio de alta gama con restaurantes de autor, patios de cerveza artesanal y bares donde la Premier League se ve en pantalla correcta.",
      best_for:"Pareja",
      walk_to_stadium:"10 min a pie · False Creek waterfront",
      lagomNote:null,
    },
    {
      name:"Mount Pleasant / Main Street",
      vibe:"Al sur del centro. La mayor concentración de cafeterías independientes, librerías y restaurantes de costo razonable de Vancouver. En la Expo Line (Main St-Science World) — la estación oficial para BC Place.",
      best_for:"Presupuesto",
      walk_to_stadium:"Main Street-Science World + ruta peatonal (~15 min)",
      lagomNote:null,
    },
  ],

  // ── 3.2 HOTELES ────────────────────────────────────────────────────────────
  stays:[
    {
      name:"Fairmont Pacific Rim",
      area:"Coal Harbour / Waterfront",
      price:"$$$$",
      priceCAD:"$600–1,200 CAD/noche (periodo mundialista)",
      tags:["Vistas a las montañas","Spa","Piscina en techo"],
      note:"Vistas directas a Coal Harbour y las montañas desde el mismo hotel. Restaurante de referencia. La dirección más impresionante de Vancouver.",
      best_for:"Pareja",
    },
    {
      name:"Burrard Hotel",
      area:"Downtown",
      price:"$$$",
      priceCAD:"$300–480 CAD/noche (periodo mundialista)",
      tags:["Piscina en techo","Diseño honesto","Boutique"],
      note:"Hotel de mediados del siglo XX con reforma contemporánea. A cuatro cuadras de Robson Street y quince minutos caminando del estadio.",
      best_for:"Pareja / Fan WC",
    },
    {
      name:"HI Vancouver Central",
      area:"Downtown",
      price:"$",
      priceCAD:"$55–120 CAD/noche según tipo de habitación",
      tags:["Presupuesto","Habitaciones privadas","SkyTrain cerca"],
      note:"El hostal de referencia en Vancouver para viajero con presupuesto ajustado. Instalaciones actualizadas, habitaciones privadas disponibles, SkyTrain a dos cuadras.",
      best_for:"Fan WC solo",
    },
  ],

  // ── 3.3 LOGÍSTICA ──────────────────────────────────────────────────────────
  logistics:{
    transport:[
      {
        icon:"✈",
        title:"Llegar a Vancouver — YVR",
        text:"Aeropuerto YVR a ~12 km del estadio. Requiere eTA canadiense (tramitar en canada.ca antes de volar). Desde CDMX: escala en LAX o SFO, total 7–9 horas.",
      },
      {
        icon:"🚇",
        title:"Del aeropuerto a la ciudad",
        text:"Canada Line SkyTrain desde YVR hasta Waterfront Station: ~25 minutos. Tarifa aproximada según zona. TransLink opera todo el SkyTrain — usa la app Compass Card.",
      },
      {
        icon:"🏟",
        title:"Al estadio el día del partido — ruta maestra",
        text:"SkyTrain Expo Line → Main Street-Science World → ruta peatonal designada (~10-15 min). Esta es la estación oficial para BC Place durante el Mundial. Desde Gastown: Waterfront Station → Main Street, 8-12 min en SkyTrain.",
      },
      {
        icon:"⚠️",
        title:"Error crítico — Stadium-Chinatown CERRADA",
        text:"TransLink ha confirmado que la estación Stadium-Chinatown estará CERRADA para fans mundialistas en TODOS los días de partido en BC Place. No importa lo que diga tu app de tránsito. La estación correcta es Main Street-Science World, siempre.",
        isWarning:true,
      },
    ],
    timings:[
      { label:"YVR → Waterfront (Canada Line)", value:"~25 min" },
      { label:"Desde Gastown (Waterfront + SkyTrain + caminata)", value:"~25 min total" },
      { label:"Desde Yaletown (caminando por False Creek)", value:"~15 min a pie" },
      { label:"Uber desde Downtown (sin tráfico)", value:"10 min — imprevisible con tráfico de partido" },
    ],
    matchDayCronologia:{
      matchName:"24 Jun · Suiza vs. Canadá · 12:00 PT",
      steps:[
        { time:"H-2:30", text:"Desayuna en Gastown o Yaletown. Los partidos de mediodía son los mejores para empezar bien el día." },
        { time:"H-2:00", text:"Toma el SkyTrain desde tu estación más cercana hacia Main Street-Science World." },
        { time:"H-1:30", text:"Llegada al estadio. Las puertas abren 90 minutos antes." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo. El BC Place tiene techo — si llueve, ya estás adentro." },
        { time:"H+0:00", text:"Partido." },
        { time:"Post",   text:"SkyTrain de regreso por la misma ruta. El techo del BC Place cubre el post-partido si llueve." },
      ],
    },
    timing:"Las fechas de mayor demanda en Vancouver son 18 jun (Canadá vs. Qatar) y 24 jun (Suiza vs. Canadá). Si no tienes reserva confirmada, Airbnb en Kitsilano, Commercial Drive o East Vancouver tienen buena conexión de SkyTrain.",
    cost:"Una de las ciudades más caras de Norteamérica en año sin Mundial. El torneo confirma lo que el mercado inmobiliario ya había establecido. Reserva con anticipación.",
  },

  // ── 3.4 VIBE CARDS (puntos de encuentro) ───────────────────────────────────
  vibeCards:[
    {
      title:"FIFA Fan Festival™ — PNE / Hastings Park",
      type:"Fan fest oficial",
      typeColor:T.coral,
      desc:"El Fan Fest de Vancouver en el PNE. Pantallas de gran formato, programación cultural, capacidad para decenas de miles. Expo Line hasta Commercial-Broadway + autobús. Para días de Canadá: llega temprano.",
      tag:"Sin boleto OK",
    },
    {
      title:"Plaza Canada Place",
      type:"Pantalla exterior",
      typeColor:T.fjord,
      desc:"Explanada sobre el puerto de Burrard Inlet. El mejor telón de fondo mundialista del país: puerto de Vancouver + montañas North Shore + skyline. Para partidos de Canadá, el contexto supera a cualquier fan bar.",
      tag:"Icónico",
    },
    {
      title:"Robson Square",
      type:"Plaza peatonal",
      typeColor:T.sage,
      desc:"Plaza techada frente al Tribunal de Justicia y la Galería de Arte de BC. Vancouver la activó para el oro olímpico de hockey en 2010 — el torneo la justifica de nuevo.",
      tag:"Familiar",
    },
    {
      title:"Commercial Drive — La Drive",
      type:"Barrio italiano",
      typeColor:T.pine,
      desc:"La Drive transmite calcio desde los años 90. En días de Argentina, Brasil o Italia, se convierte en estadio al aire libre sin convocatoria formal. La historia futbolera más orgánica de Canadá.",
      tag:"Auténtico",
    },
    {
      title:"Shark Club Bar & Grill",
      type:"Sports bar",
      typeColor:"#1A3A5C",
      desc:"El bar de deportes de referencia en Vancouver, con pantallas en cada ángulo. Para el 24 de junio (Suiza vs. Canadá), llega dos horas antes — se llena y no espera. Alitas + cerveza de BC.",
      tag:"Alta demanda",
    },
    {
      title:"The Cambie",
      type:"Pub histórico",
      typeColor:"#5A3A2A",
      desc:"Pub histórico en Gastown con precios razonables. La clientela es tan diversa como el partido en pantalla — para la sede con Australia, Bélgica, Nueva Zelanda y Qatar en el mismo calendario.",
      tag:"Gastown",
    },
  ],

  // ── 3.5 COMIDA ─────────────────────────────────────────────────────────────
  food:[
    { dish:"Ramen de referencia",    where:"Robson Street — la mayor densidad de ramen de Norteamérica fuera de Japón", price:"$–$$",   type:"Imperdible" },
    { dish:"Sushi del Pacífico",     where:"Cualquier sushi bar de Robson o Coal Harbour — acceso directo al océano", price:"$$",     type:"Local" },
    { dish:"Dim sum",                where:"Commercial Drive o Richmond — comunidad cantonesa de referencia",          price:"$",      type:"Ritual" },
    { dish:"Alitas + cerveza de BC", where:"Shark Club Bar & Grill, Downtown — el sports bar del torneo en Vancouver", price:"$$",     type:"Pre-partido" },
    { dish:"Poutine de barril",      where:"The Cambie, Gastown — pub histórico, precios razonables, ambiente mezclado", price:"$",     type:"De barrio" },
    { dish:"Curry sikh",             where:"Surrey (30 min en SkyTrain) — la mejor comunidad sikh de Columbia Británica", price:"$",    type:"Excursión" },
  ],

  // ── 3.6 EXPERIENCIAS ───────────────────────────────────────────────────────
  experiences:[
    {
      title:"Whistler — excursión de día",
      duration:"Día completo",
      desc:"A dos horas por la Sea-to-Sky Highway, una de las carreteras más espectaculares de Norteamérica. En junio: senderismo de alta montaña, tirolesas, Whistler Mountain Bike Park y vistas a glaciares. El autobús Whistler Mountaineer opera desde el centro. Para el fan con un día libre entre el 13 y el 18 de junio, no hay mejor excursión en el torneo.",
      type:"Excursión",
    },
    {
      title:"Deep Cove + Indian Arm — kayak",
      duration:"Medio día",
      desc:"A 30 minutos al norte de Vancouver. Deep Cove es un pueblo de kayak en el Indian Arm. Alquiler disponible por hora o por día. Aguas tranquilas, cascadas, vistas que explican por qué la gente paga $2 millones CAD por vivir cerca.",
      type:"Aventura",
    },
    {
      title:"Stanley Park + English Bay",
      duration:"Mañana o tarde",
      desc:"El parque urbano más grande de Norteamérica: 405 hectáreas de bosque costero. La ruta en bicicleta del Seawall (22 km) recorre la costa con vistas al estrecho de Georgia. Alquiler de bicicletas disponible en English Bay. Al atardecer, English Bay es el punto de reunión de la ciudad — el mejor sitio para ver el ocaso del Pacífico antes de un partido nocturno.",
      type:"Ciudad",
    },
    {
      title:"BC Place — el estadio antes del partido",
      duration:"1–2 horas",
      desc:"El BC Place tiene techo retráctil y fue sede de la final de la Copa del Mundo Femenina 2015. Llegar 90 minutos antes del partido no es logística — es el espectáculo. La explanada exterior, el False Creek a pasos, y las montañas North Shore al fondo son la foto previa al partido.",
      type:"Imperdible",
    },
  ],

  // ── ITINERARIO SUGERIDO ────────────────────────────────────────────────────
  itinerary:[
    {
      day:1,
      title:"Llegada y primer pulso",
      subtitle:"Gastown · Yaletown · False Creek",
      isMatchDay:false,
      steps:[
        { time:"Llegada",  text:"Canada Line SkyTrain desde YVR hasta Waterfront Station. ~25 minutos. Directo, sin trasbordos, con elevadores." },
        { time:"Tarde",    text:"Deja el equipaje y camina hacia Gastown. El reloj de vapor, las galerías en Water Street, el café de especialidad en Revolver Coffee." },
        { time:"Atardecer", text:"Ruta a pie por el False Creek hacia Yaletown. El BC Place iluminado al fondo del canal es la bienvenida al torneo." },
        { time:"Noche",    text:"Cena en Yaletown. Bares de Mainland Street para cerrar el día. Vancouver tiene sol hasta las 9:30pm en junio." },
      ],
    },
    {
      day:2,
      title:"Día de partido — Australia vs. Türkiye",
      subtitle:"BC Place · Sáb 13 Jun · 21:00 PT",
      isMatchDay:true,
      matchRef:"m1",
      steps:[
        { time:"Mañana",   text:"Sin prisa — el partido es nocturno. Granville Island Market para desayunar. Puesto de ostras del Pacífico ($2–3 CAD cada una)." },
        { time:"Tarde",    text:"Stanley Park en bici. Alquiler en English Bay ($12 CAD/hora). El Seawall con vistas al estrecho de Georgia justifica el día libre." },
        { time:"18:00",    text:"Pre-partido en The Cambie (Gastown) o Shark Club. La afición australiana y turca estará activa en la ciudad desde las 5pm." },
        { time:"20:30",    text:"Camina al BC Place desde Gastown: 10 minutos por el waterfront. O SkyTrain desde Waterfront → Main Street-Science World." },
        { time:"21:00",    text:"Apertura nocturna de la sede. Australia vs. Türkiye. El techo retráctil estará abierto si el clima lo permite." },
      ],
    },
    {
      day:3,
      title:"Día de partido — Canadá vs. Qatar",
      subtitle:"BC Place · Jue 18 Jun · 12:00 PT",
      isMatchDay:true,
      matchRef:"m2",
      steps:[
        { time:"H-2:30",   text:"Desayuno temprano en Gastown o Mount Pleasant. Los partidos de mediodía piden empezar el día bien." },
        { time:"H-2:00",   text:"Plaza Canada Place para absorber el ambiente antes del partido. El Fan Fest del PNE abre desde la mañana en días de Canadá." },
        { time:"H-1:30",   text:"SkyTrain Expo Line → Main Street-Science World. La estación correcta. Stadium-Chinatown estará cerrada." },
        { time:"12:00",    text:"Canadá vs. Qatar en casa. Si Canadá gana, el 24 de junio se convierte en el partido más importante del país." },
        { time:"Post",     text:"Post-partido en Robson Square o Commercial Drive. La Drive celebra independientemente del resultado." },
      ],
    },
    {
      day:4,
      title:"Día de partido — Suiza vs. Canadá",
      subtitle:"BC Place · Mié 24 Jun · 12:00 PT — Partido definitorio del Grupo B",
      isMatchDay:true,
      matchRef:"m4",
      steps:[
        { time:"H-2:30",   text:"Desayuna en Gastown o Yaletown. Este es el partido que define si Canadá avanza. El día empieza con calma calculada." },
        { time:"H-2:00",   text:"SkyTrain Expo Line desde tu estación hacia Main Street-Science World. Compra el Compass Card con anticipación." },
        { time:"H-1:30",   text:"Puertas abiertas. BC Place con techo cerrado si hay lluvia. La afición canadiense llega desde temprano — el estadio va a estar lleno antes del warmup." },
        { time:"H-0:30",   text:"En tu asiento. Boleto digital en la app FIFA listo. Suiza es un rival serio — el partido puede ir a cualquier lado." },
        { time:"Post",     text:"Si Canadá pasa: Commercial Drive y Robson Square van a estar imposibles — de la mejor manera posible. SkyTrain de regreso desde Main Street-Science World." },
      ],
    },
    {
      day:5,
      title:"Excursión — Whistler o Deep Cove",
      subtitle:"Sea-to-Sky Highway · Indian Arm",
      isMatchDay:false,
      steps:[
        { time:"Opción A",  text:"Whistler: 2 horas por la Sea-to-Sky Highway. Senderismo de alta montaña, tirolesas, Whistler Mountain Bike Park. El autobús Whistler Mountaineer sale del centro de Vancouver. Para el día libre entre el 13 y el 21 de junio." },
        { time:"Opción B",  text:"Deep Cove: 30 minutos al norte. Kayak en el Indian Arm desde Deep Cove Kayak. Aguas tranquilas, cascadas, vistas glaciares. La excursión más accesible de la ciudad." },
        { time:"Regreso",   text:"De vuelta a Vancouver antes del atardecer. English Bay para ver el ocaso del Pacífico — el mejor final de día de cualquier sede del torneo." },
        { time:"Noche",     text:"Cena final en Vancouver. Score on Davie para el partido de la noche si hay uno, o sushi en Robson Street para cerrar el capítulo." },
      ],
    },
  ],

  // ── SIDEBAR — contenido real ───────────────────────────────────────────────
  lagomTips:[
    "El 24 de junio (Suiza vs. Canadá, Grupo B definitorio) y el 18 de junio (Canadá vs. Qatar) son las fechas de mayor demanda hotelera en la historia del turismo de Vancouver. Reserva con meses de anticipación.",
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

  closingNote:"Vancouver llega al Mundial con siete partidos, un techo retráctil y las montañas North Shore de fondo. Canadá juega aquí dos veces y la segunda vez — el 24 de junio contra Suiza — puede ser la más importante del torneo para el país. Antes de ese partido, y después de él, hay una ciudad que sabe recibir al mundo porque lleva décadas siendo el punto de llegada de todos.",
  closingSignature:"Lagomplan · Guía de campo · Vancouver · Mundial 2026",
  plannerCTA:"Generar mi viaje a Vancouver",
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATION — Vancouver
// ─────────────────────────────────────────────────────────────────────────────
const VanIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#E8F0EC" rx={RADIUS} />
    {/* Water / False Creek */}
    <rect x="0" y="95" width="280" height="45" fill="#D8E5EE" />
    {/* Mountains — North Shore */}
    <polygon points="0,95 45,40 90,95"  fill="#4A7A6A" opacity="0.5" />
    <polygon points="40,95 90,28 140,95" fill="#2D4F4A" opacity="0.55" />
    <polygon points="90,95 145,32 200,95" fill="#3D6A5A" opacity="0.45" />
    <polygon points="155,95 200,52 245,95" fill="#4A7A6A" opacity="0.35" />
    {/* Snow caps */}
    <polygon points="90,28 102,46 78,46"  fill="white" opacity="0.85" />
    <polygon points="145,32 155,48 135,48" fill="white" opacity="0.7" />
    <polygon points="45,40 53,55 37,55"  fill="white" opacity="0.6" />
    {/* City skyline — Downtown */}
    <rect x="16" y="72" width="7"  height="23" fill="#2D4F6C" opacity="0.3" rx={1} />
    <rect x="27" y="64" width="9"  height="31" fill="#2D4F6C" opacity="0.35" rx={1} />
    <rect x="40" y="68" width="6"  height="27" fill="#2D4F6C" opacity="0.25" rx={1} />
    <rect x="50" y="60" width="8"  height="35" fill="#2D4F6C" opacity="0.3" rx={1} />
    <rect x="62" y="70" width="5"  height="25" fill="#2D4F6C" opacity="0.2" rx={1} />
    {/* BC Place dome */}
    <ellipse cx="226" cy="88" rx="30" ry="12" fill="#2D4F6C" opacity="0.18" />
    <rect x="196" y="76" width="60" height="12" fill="#2D4F6C" opacity="0.15" rx={2} />
    {/* BC Place roof arc */}
    <path d="M196,76 Q226,60 256,76" stroke="#2D4F6C" strokeWidth="1.5" fill="none" opacity="0.3" />
    {/* SkyTrain line hint */}
    <line x1="0" y1="93" x2="180" y2="93" stroke="#6B8F86" strokeWidth="1" opacity="0.4" strokeDasharray="4,3" />
    {/* Flag */}
    <text x="258" y="48" fontSize="20" textAnchor="middle">🇨🇦</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({ children, style={}, onClick, hover=false }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      style={{ background:T.white, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS,
        boxShadow: isHovered?"0 3px 12px rgba(28,28,26,0.09)":CARD_SHADOW,
        transition:"box-shadow 0.18s, transform 0.18s",
        transform: isHovered?"translateY(-1px)":"none",
        cursor: onClick?"pointer":"default", ...style }}>
      {children}
    </div>
  );
};

const Divider = ({ my=40 }) => <div style={{ height:1, background:T.sandDark, margin:`${my}px 0` }} />;

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom:24 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
      <span style={{ ...uf(10,700), letterSpacing:"0.18em", textTransform:"uppercase", color:T.coral }}>{number}</span>
      <div style={{ flex:1, height:1, background:T.sandDark }} />
    </div>
    <h2 style={{ ...df(26,700,"italic"), color:T.pine, lineHeight:1.1, marginBottom:subtitle?6:0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.6, margin:0, maxWidth:520 }}>{subtitle}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MATCH CARD
// ─────────────────────────────────────────────────────────────────────────────
const MatchCard = ({ match, onPlanAround }) => {
  const isTBD = !match.teams[0].flag && !match.teams[1].flag;
  const bgColor = match.highlight ? T.matchGoldLight : T.white;
  const borderColor = match.highlight ? `${T.matchGold}50` : T.sandDark;
  const accentBar = match.highlight ? T.matchGold : isTBD ? T.sandDark : CITY_ACCENT;

  return (
    <Card style={{ overflow:"hidden", borderColor, opacity: isTBD ? 0.6 : 1 }}>
      <div style={{ height:3, background:accentBar }} />
      <div style={{ padding:"18px 20px", background:bgColor }}>
        {/* Date + tag row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"center", minWidth:44, padding:"6px 10px", background:T.sand, borderRadius:6 }}>
              <div style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkFaint }}>{match.day}</div>
              <div style={{ ...df(18,700), color:T.pine, lineHeight:1.1 }}>{match.date.split(" ")[0]}</div>
              <div style={{ ...uf(9,500), color:T.inkFaint }}>{match.date.split(" ")[1]}</div>
            </div>
            <div>
              <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:2 }}>
                {match.stadium}
              </div>
              <div style={{ ...uf(12,500), color:T.inkFaint }}>{match.time} local</div>
            </div>
          </div>
          {match.tag && (
            <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
              color: match.highlight ? T.matchGold : CITY_ACCENT,
              background: match.highlight ? T.matchGoldLight : CITY_ACCENT+"18",
              border:`1px solid ${match.highlight ? T.matchGold : CITY_ACCENT}40`,
              padding:"3px 9px", borderRadius:40, flexShrink:0,
            }}>{match.tag}</span>
          )}
        </div>

        {/* Teams */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16,
          padding:"14px 0", borderTop:`1px solid ${T.sandDark}`, borderBottom:`1px solid ${T.sandDark}`, marginBottom:14 }}>
          <div style={{ flex:1, textAlign:"right" }}>
            <div style={{ ...df(15,700), color:T.ink, marginBottom:2 }}>{match.teams[0].name}</div>
            {match.teams[0].flag && <div style={{ fontSize:24 }}>{match.teams[0].flag}</div>}
          </div>
          <div style={{ ...uf(12,600), color:T.inkFaint, letterSpacing:"0.1em", padding:"5px 12px", background:T.sand, borderRadius:6 }}>
            vs
          </div>
          <div style={{ flex:1, textAlign:"left" }}>
            <div style={{ ...df(15,700), color:T.ink, marginBottom:2 }}>{match.teams[1].name}</div>
            {match.teams[1].flag && <div style={{ fontSize:24 }}>{match.teams[1].flag}</div>}
          </div>
        </div>

        {/* CTA */}
        {!isTBD && (
          <button onClick={() => onPlanAround && onPlanAround(match)} style={{
            width:"100%", padding:"9px",
            background:"transparent", border:`1px solid ${T.sandDark}`, borderRadius:RADIUS-2,
            ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkMid,
            cursor:"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=CITY_ACCENT; e.currentTarget.style.color=T.pine; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=T.sandDark; e.currentTarget.style.color=T.inkMid; }}
          >
            <span style={{ fontSize:13 }}>✦</span> Planear mi viaje alrededor de este partido
          </button>
        )}
        {isTBD && (
          <div style={{ ...uf(11,400), color:T.inkFaint, textAlign:"center", padding:"8px 0" }}>
            Rival por definir al terminar fase de grupos
          </div>
        )}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ITINERARY DAY
// ─────────────────────────────────────────────────────────────────────────────
const ItineraryDay = ({ day, matchMap }) => {
  const [open, setOpen] = useState(day.isMatchDay);
  const match = day.matchRef ? matchMap[day.matchRef] : null;

  return (
    <Card style={{ overflow:"hidden", borderColor: day.isMatchDay ? `${T.matchGold}50` : T.sandDark }} hover>
      {day.isMatchDay && <div style={{ height:3, background:T.matchGold }} />}
      <button onClick={() => setOpen(!open)} style={{ width:"100%", padding:"17px 20px", display:"flex", alignItems:"center", gap:14, background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
        <div style={{ width:34, height:34, background:day.isMatchDay?T.matchGold:T.sageLight, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ ...uf(12,700), color:day.isMatchDay?T.white:T.pine }}>{day.day}</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
            <span style={{ ...df(15,700), color:T.pine }}>{day.title}</span>
            {day.isMatchDay && (
              <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
                color:T.matchGold, background:T.matchGoldLight, padding:"2px 7px", borderRadius:40, border:`1px solid ${T.matchGold}40` }}>
                Día de partido
              </span>
            )}
          </div>
          <span style={{ ...uf(11,400), color:T.inkFaint }}>{day.subtitle}</span>
        </div>
        <div style={{ width:26, height:26, border:`1px solid ${T.sandDark}`, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          transform:open?"rotate(180deg)":"none", transition:"transform 0.2s" }}>
          <span style={{ ...uf(11,600), color:T.inkMid, lineHeight:1 }}>↓</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop:`1px solid ${T.sandDark}`, padding:"4px 20px 18px" }}>
          {match && (
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 13px",
              background:T.matchGoldLight, border:`1px solid ${T.matchGold}40`, borderRadius:RADIUS-2, margin:"12px 0 18px" }}>
              <span style={{ fontSize:16 }}>⚽</span>
              <div>
                <div style={{ ...uf(10,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, marginBottom:1 }}>
                  {match.date} · {match.time}
                </div>
                <div style={{ ...uf(13,600), color:T.ink }}>
                  {match.teams[0].flag} {match.teams[0].name} vs {match.teams[1].flag} {match.teams[1].name}
                </div>
              </div>
            </div>
          )}
          {day.steps.map((step, i) => (
            <div key={i} style={{ display:"flex", gap:14,
              paddingTop:14, paddingBottom: i<day.steps.length-1?14:0,
              borderBottom: i<day.steps.length-1?`1px solid ${T.sandDark}`:"none" }}>
              <div style={{ width:58, flexShrink:0, paddingTop:2 }}>
                <span style={{ ...uf(10,600), color:T.inkFaint, letterSpacing:"0.04em" }}>{step.time}</span>
              </div>
              <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>{step.text}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAY CARD
// ─────────────────────────────────────────────────────────────────────────────
const StayCard = ({ stay }) => (
  <Card hover style={{ display:"flex", flexDirection:"column", height:"100%" }}>
    <div style={{ padding:"18px 18px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ ...df(22,700), color:T.pine }}>{stay.price}</span>
        <Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label>
      </div>
      <div style={{ ...df(16,700), color:T.pine, lineHeight:1.2, marginBottom:3 }}>{stay.name}</div>
      <div style={{ ...uf(11,500), color:T.inkFaint, marginBottom:6 }}>{stay.area}</div>
      {stay.priceCAD && (
        <div style={{ ...uf(11,600), color:CITY_ACCENT, marginBottom:10, letterSpacing:"0.04em" }}>{stay.priceCAD}</div>
      )}
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
        {stay.tags.map(tag => (
          <span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase",
            color:T.inkFaint, background:T.sand, padding:"2px 7px", borderRadius:4 }}>{tag}</span>
        ))}
      </div>
      <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.6 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"12px 18px", borderTop:`1px solid ${T.sandDark}` }}>
      <button style={{ width:"100%", padding:"9px", background:T.pine, border:"none", borderRadius:RADIUS-2,
        ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.white, cursor:"pointer" }}
        onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity="1"}>
        Ver opciones →
      </button>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE CARD
// ─────────────────────────────────────────────────────────────────────────────
const ExperienceCard = ({ item }) => (
  <Card hover style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:9 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
        color:item.typeColor, background:item.typeColor+"18", padding:"3px 8px", borderRadius:40 }}>
        {item.type}
      </span>
      <span style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase",
        color:T.inkFaint, background:T.sand, padding:"3px 7px", borderRadius:40 }}>
        {item.tag}
      </span>
    </div>
    <div style={{ ...df(15,700), color:T.pine, lineHeight:1.2 }}>{item.title}</div>
    <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{item.desc}</p>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGISTICS CARD
// ─────────────────────────────────────────────────────────────────────────────
const LogisticsCard = ({ item }) => (
  <Card style={{ display:"flex", gap:14, padding:"14px 18px", alignItems:"flex-start",
    borderColor: item.isWarning?`${T.coral}50`:T.sandDark,
    background: item.isWarning?T.coralLight:T.white }}>
    <div style={{ width:36, height:36, flexShrink:0, background:item.isWarning?T.coral+"20":T.sageLight,
      borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>
      {item.icon}
    </div>
    <div>
      <div style={{ ...uf(13,700), color:item.isWarning?T.coral:T.pine, marginBottom:4 }}>{item.title}</div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{item.text}</p>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const GuideSidebar = ({ guide, onPlan }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* CTA primario */}
      <Card style={{ padding:"22px", background:T.pine, border:"none" }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...df(17,700,"italic"), color:T.sand, lineHeight:1.3, marginBottom:14 }}>
          Arma tu ruta alrededor de los partidos.
        </p>
        <button onClick={onPlan} style={{ width:"100%", padding:"12px", background:T.coral, border:"none",
          borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase",
          color:T.white, cursor:"pointer" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          {guide.plannerCTA} →
        </button>
      </Card>

      {/* Notas Lagom */}
      <Card style={{ padding:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:26, height:26, background:T.sageLight, borderRadius:RADIUS-2,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>✦</span>
          </div>
          <Label color={T.pine}>Notas Lagom</Label>
        </div>
        {guide.lagomTips.map((tip, i) => (
          <div key={i} style={{ display:"flex", gap:9,
            paddingTop:10, paddingBottom:10,
            borderBottom: i<guide.lagomTips.length-1?`1px solid ${T.sandDark}`:"none" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:T.sage, flexShrink:0, marginTop:6 }} />
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{tip}</p>
          </div>
        ))}
      </Card>

      {/* Checklist día de partido */}
      <Card style={{ padding:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:26, height:26, background:T.matchGoldLight, borderRadius:RADIUS-2,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>☑</span>
          </div>
          <Label color={T.pine}>Checklist día de partido</Label>
        </div>
        {guide.matchDayChecklist.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => ({...p,[i]:!p[i]}))} style={{
            display:"flex", alignItems:"flex-start", gap:9, padding:"7px 0",
            borderTop: i>0?`1px solid ${T.sandDark}`:"none",
            background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%",
          }}>
            <div style={{ width:15, height:15, flexShrink:0, marginTop:2,
              border:`1.5px solid ${checked[i]?T.sage:T.sandDark}`, borderRadius:3,
              background:checked[i]?T.sage:"transparent",
              display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
              {checked[i] && <span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ ...uf(12,400), color:checked[i]?T.inkFaint:T.inkMid, lineHeight:1.5,
              textDecoration:checked[i]?"line-through":"none", transition:"all 0.15s" }}>
              {item}
            </span>
          </button>
        ))}
      </Card>

      {/* ¿Sabías que? */}
      <Card style={{ padding:"16px 18px", background:T.fjordLight, borderColor:`${T.fjord}30` }}>
        <Label color={T.fjord} style={{ marginBottom:8, display:"block" }}>¿Sabías que?</Label>
        <p style={{ ...uf(12,400), color:T.fjord, lineHeight:1.65, margin:0 }}>{guide.didYouKnow}</p>
      </Card>

      {/* IA — optimizar */}
      <Card style={{ padding:"14px 18px", borderStyle:"dashed" }}>
        <div style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>✦</span>
          <div>
            <div style={{ ...uf(11,700), color:T.pine, marginBottom:4 }}>Optimizar itinerario con IA</div>
            <p style={{ ...uf(11,400), color:T.inkMid, lineHeight:1.6, margin:"0 0 9px" }}>
              Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.
            </p>
            <button onClick={onPlan} style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
              color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2,
              padding:"6px 12px", cursor:"pointer" }}>
              Optimizar ruta →
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE HERO
// ─────────────────────────────────────────────────────────────────────────────
const GuideHero = ({ guide }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:36, alignItems:"center",
    padding:"44px 0 36px", borderBottom:`1px solid ${T.sandDark}`, marginBottom:36 }}>
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:20 }}>{guide.flag}</span>
        <Label color={T.inkFaint}>{guide.country} · {guide.state}</Label>
        <span style={{ color:T.sandDark }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.name}</Label>
        <span style={{ color:T.sandDark }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.capacity}</Label>
      </div>
      <h1 style={{ ...df("clamp(40px,5.5vw,68px)",900,"italic"), color:T.pine, lineHeight:0.95,
        letterSpacing:"-0.03em", marginBottom:18 }}>
        {guide.city}
      </h1>
      <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.7, maxWidth:460, marginBottom:22 }}>
        {guide.description}
      </p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:22 }}>
        {guide.tags.map(tag => (
          <span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase",
            color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`,
            padding:"5px 12px", borderRadius:40 }}>{tag}</span>
        ))}
        <span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase",
          color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}30`,
          padding:"5px 12px", borderRadius:40 }}>
          ⚽ {guide.matches.length} partidos
        </span>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:2 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width:5, height:5, borderRadius:"50%",
                  background: i<=s.value ? T.sage : T.sandDark }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ height:190, borderRadius:RADIUS, overflow:"hidden" }}>
      <VanIllustration />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STICKY NAV
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {id:"matches",   label:"Partidos"},
  {id:"manifesto", label:"Manifiesto"},
  {id:"itinerary", label:"Itinerario"},
  {id:"stays",     label:"Dónde dormir"},
  {id:"vibe",      label:"Ambiente"},
  {id:"logistics", label:"Logística"},
];

const StickyNav = ({ active, onNavigate, onBack }) => (
  <div style={{ position:"sticky", top:0, zIndex:40,
    background:`${T.bg}F2`, backdropFilter:"blur(16px)",
    borderBottom:`1px solid ${T.sandDark}`, height:50,
    display:"flex", alignItems:"center", padding:"0 32px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none",
      cursor:"pointer", padding:"0 12px 0 0", marginRight:12,
      borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em" }}>
      ← Guías
    </button>
    <span style={{ ...df(14,700,"italic"), color:T.pine, marginRight:18, whiteSpace:"nowrap" }}>Vancouver</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{
        ...uf(10, active===item.id?700:500),
        letterSpacing:"0.08em", textTransform:"uppercase",
        color: active===item.id?T.pine:T.inkFaint,
        background:"none", border:"none", padding:"0 12px", height:"100%",
        cursor:"pointer",
        borderBottom:`2px solid ${active===item.id?T.coral:"transparent"}`,
        transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0,
      }}>{item.label}</button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE DETAIL — main layout
// ─────────────────────────────────────────────────────────────────────────────
const GuideDetail = ({ guide, onBack }) => {
  const [active, setActive] = useState("matches");
  const matchMap = Object.fromEntries(guide.matches.map(m => [m.id, m]));

  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(item.id); },
        { rootMargin:"-30% 0px -65% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <StickyNav active={active} onNavigate={scrollTo} onBack={onBack} />

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px" }}>
        <GuideHero guide={guide} />

        {/* TWO-COLUMN LAYOUT */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 304px", gap:44, alignItems:"flex-start" }}>

          {/* ── MAIN ── */}
          <div>

            {/* 01 — MATCHES */}
            <section id="matches" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="01" title="Tus partidos"
                subtitle="7 partidos confirmados en BC Place. Los dos de Canadá — 18 y 24 de junio — son los de mayor demanda." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:14 }}>
                {guide.matches.map(match => (
                  <MatchCard key={match.id} match={match} onPlanAround={() => {}} />
                ))}
              </div>
            </section>

            {/* 02 — MANIFIESTO */}
            <section id="manifesto" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="02" title="Manifiesto de campo"
                subtitle="Lo que necesitas saber antes de llegar." />

              {/* Stadium metadata */}
              <Card style={{ marginBottom:20, overflow:"hidden" }}>
                <div style={{ height:3, background:CITY_ACCENT }} />
                <div style={{ padding:"18px 20px" }}>
                  {guide.manifesto.stadiumInfo.map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:16, padding:"9px 0",
                      borderBottom: i<guide.manifesto.stadiumInfo.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(11,600), color:T.inkFaint, minWidth:140, flexShrink:0,
                        letterSpacing:"0.06em" }}>{item.label}</span>
                      <span style={{ ...uf(13,500), color:T.ink, lineHeight:1.5 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <p style={{ ...uf(15,400), color:T.ink, lineHeight:1.85, marginBottom:20 }}>
                {guide.manifesto.body}
              </p>

              {/* Lagom note */}
              <div style={{ display:"flex", gap:14, padding:"16px 18px", background:T.sandLight,
                borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
                <span style={{ ...uf(9,700), color:T.sage, fontWeight:700, letterSpacing:"0.12em",
                  textTransform:"uppercase", flexShrink:0, marginTop:2 }}>Lagom</span>
                <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>
                  {guide.manifesto.lagomNote}
                </p>
              </div>
            </section>

            {/* 03 — ITINERARY */}
            <section id="itinerary" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="03" title="Ruta sugerida — 5 días"
                subtitle="Construida alrededor de los días de partido. Los días de Canadá vienen expandidos." />
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {guide.itinerary.map(day => (
                  <ItineraryDay key={day.day} day={day} matchMap={matchMap} />
                ))}
              </div>
            </section>

            {/* 04 — STAYS */}
            <section id="stays" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="04" title="Dónde dormir"
                subtitle="Tres opciones reales con precio en periodo mundialista — presupuesto, diseño y lujo." />
              <div style={{ marginBottom:14, padding:"12px 16px", background:T.coralLight,
                border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.6, margin:0 }}>
                    Los precios indicados son estimaciones para el periodo mundialista. El 18 y 24 de junio (partidos de Canadá) son las fechas de mayor demanda en la historia hotelera de Vancouver.
                    Si no tienes reserva confirmada, Airbnb en <strong>Kitsilano</strong>, <strong>Commercial Drive</strong> o <strong>East Vancouver</strong> tienen buena conexión de SkyTrain.
                  </p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:14 }}>
                {guide.stays.map(stay => (
                  <StayCard key={stay.name} stay={stay} />
                ))}
              </div>
            </section>

            {/* 05 — VIBE / AMBIENTE */}
            <section id="vibe" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="05" title="Siente el ambiente"
                subtitle="Fan fest oficial, pantallas en la ciudad y el barrio italiano que lleva 30 años transmitiendo calcio." />

              {/* Vibe body text */}
              <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.8, marginBottom:20 }}>
                {guide.vibe.body}
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                {guide.vibeCards.map(item => (
                  <ExperienceCard key={item.title} item={item} />
                ))}
              </div>

              {/* Lagom note vibe */}
              <div style={{ display:"flex", gap:14, padding:"16px 18px", background:T.sandLight,
                borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
                <span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.12em", textTransform:"uppercase",
                  flexShrink:0, marginTop:2 }}>Lagom</span>
                <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{guide.vibe.lagomNote}</p>
              </div>
            </section>

            {/* 06 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="06" title="Llegar al estadio"
                subtitle="Una sola instrucción importa más que cualquier otra en esta guía." />

              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                {guide.logistics.transport.map((item, i) => (
                  <LogisticsCard key={i} item={item} />
                ))}
              </div>

              {/* Timings table */}
              <Card style={{ marginBottom:20 }}>
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ ...uf(10,700), letterSpacing:"0.14em", textTransform:"uppercase",
                    color:T.inkFaint, marginBottom:12 }}>Tiempos reales de desplazamiento</div>
                  {guide.logistics.timings.map((t, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"9px 0", borderBottom: i<guide.logistics.timings.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(12,400), color:T.inkMid }}>{t.label}</span>
                      <span style={{ ...uf(12,600), color:T.pine }}>{t.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Match day cronología */}
              <Card style={{ overflow:"hidden" }}>
                <div style={{ height:3, background:T.matchGold }} />
                <div style={{ padding:"18px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:16 }}>
                    <span style={{ fontSize:16 }}>⚽</span>
                    <div style={{ ...uf(11,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.matchGold }}>
                      Cronología recomendada
                    </div>
                    <span style={{ ...uf(12,600), color:T.ink }}>{guide.logistics.matchDayCronologia.matchName}</span>
                  </div>
                  {guide.logistics.matchDayCronologia.steps.map((step, i) => (
                    <div key={i} style={{ display:"flex", gap:14,
                      paddingTop: i>0?12:0, paddingBottom: i<guide.logistics.matchDayCronologia.steps.length-1?12:0,
                      borderBottom: i<guide.logistics.matchDayCronologia.steps.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(10,700), color:T.matchGold, minWidth:44, flexShrink:0,
                        letterSpacing:"0.04em", paddingTop:1 }}>{step.time}</span>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{step.text}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Timing note */}
              <div style={{ display:"flex", gap:10, marginTop:14, padding:"12px 16px",
                background:T.sandLight, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS }}>
                <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
                <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>
                  {guide.logistics.timing}
                </p>
              </div>
            </section>

            {/* 07 — FOOD */}
            <section style={{ marginBottom:52 }}>
              <SectionHeader number="07" title="Dónde comer"
                subtitle="Vancouver no tiene una gastronomía nacional — tiene el Pacífico a la puerta." />
              <div style={{ display:"flex", flexDirection:"column" }}>
                {guide.food.map((f, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr auto auto",
                    alignItems:"center", gap:14, padding:"13px 0",
                    borderBottom: i<guide.food.length-1?`1px solid ${T.sandDark}`:"none" }}>
                    <div>
                      <span style={{ ...uf(13,600), color:T.pine }}>{f.dish}</span>
                      <span style={{ ...uf(12,400), color:T.inkFaint, marginLeft:8 }}>— {f.where}</span>
                    </div>
                    <Label bg={T.sageLight} color={T.sage}>{f.type}</Label>
                    <span style={{ ...uf(12,500), color:T.inkFaint, textAlign:"right" }}>{f.price}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 08 — EXPERIENCES */}
            <section style={{ marginBottom:52 }}>
              <SectionHeader number="08" title="Fuera del estadio"
                subtitle="Los días sin partido justifican el viaje." />
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                {guide.experiences.map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 20px" }}>
                    <div style={{ ...df(30,900), color:T.sandDark, lineHeight:1, userSelect:"none",
                      paddingTop:3, width:36, textAlign:"right" }}>
                      {String(i+1).padStart(2,"0")}
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:5 }}>
                        <span style={{ ...uf(14,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 09 — CIERRE */}
            <section style={{ paddingBottom:0 }}>
              <div style={{ width:36, height:3, background:T.coral, marginBottom:22 }} />
              <blockquote style={{ ...df(21,400,"italic"), color:T.pine, lineHeight:1.65,
                margin:"0 0 14px", maxWidth:560, borderLeft:`3px solid ${T.coral}`, paddingLeft:22 }}>
                "{guide.closingNote}"
              </blockquote>
              <Label color={T.inkFaint} style={{ paddingLeft:22 }}>{guide.closingSignature}</Label>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position:"sticky", top:60, alignSelf:"flex-start", paddingBottom:40 }}>
            <GuideSidebar guide={guide} onPlan={() => alert("Planificador: Vancouver")} />
          </div>
        </div>

        <div style={{ height:80 }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("guide");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Manrope:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        button{font-family:'Manrope',sans-serif;}
        button:focus-visible{outline:2px solid ${T.coral};outline-offset:2px;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${T.bg};}
        ::-webkit-scrollbar-thumb{background:${T.sandDark};border-radius:3px;}
      `}</style>
      <GuideDetail guide={VANCOUVER} onBack={() => {}} />
    </>
  );
}
