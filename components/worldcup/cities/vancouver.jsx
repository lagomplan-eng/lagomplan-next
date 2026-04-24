"use client";

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
  bg:"#fff9f3",
};

const RADIUS = 10;
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";
const CARD_BORDER = "rgba(28,28,26,0.09)";
const CITY_ACCENT = "#2D4F6C";
const SECTION_ALT_BG = "#F4F0EB"; // warm sand tint for alternating sections

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

  headline:"La única sede del torneo donde el estadio comparte el horizonte con montañas nevadas. No hace falta que sea metáfora.",
  description:"La única sede del torneo donde el estadio comparte el horizonte con montañas nevadas. No hace falta que sea metáfora. Vancouver llega al Mundial con siete partidos, un techo retráctil — el único estadio techado de Canadá en el torneo — y Canadá jugando dos veces aquí. La segunda, el 24 de junio contra Suiza, puede ser la más importante para el país.",

  scores:[
    { label:"Ambiente",    value:4 },
    { label:"Fútbol local",value:4 },
    { label:"Gastronomía", value:5 },
    { label:"Transporte",  value:5 },
    { label:"Seguridad",   value:5 },
    { label:"Costo",       value:2 },
  ],

  matches:[
    {
      id:"m1", date:"13 Jun", day:"Sáb", time:"21:00 PT",
      teams:[{name:"Australia",flag:"🇦🇺"},{name:"Türkiye",flag:"🇹🇷"}],
      stadium:"BC Place", tag:"Grupo D — apertura nocturna de la sede", highlight:false,
    },
    {
      id:"m2", date:"18 Jun", day:"Jue", time:"12:00 PT",
      teams:[{name:"Canadá",flag:"🇨🇦"},{name:"Qatar",flag:"🇶🇦"}],
      stadium:"BC Place", tag:"Grupo B — Canadá en casa", highlight:true,
    },
    {
      id:"m3", date:"21 Jun", day:"Dom", time:"18:00 PT",
      teams:[{name:"Nueva Zelanda",flag:"🇳🇿"},{name:"Egipto",flag:"🇪🇬"}],
      stadium:"BC Place", tag:"Grupo F", highlight:false,
    },
    {
      id:"m4", date:"24 Jun", day:"Mié", time:"12:00 PT",
      teams:[{name:"Suiza",flag:"🇨🇭"},{name:"Canadá",flag:"🇨🇦"}],
      stadium:"BC Place", tag:"Grupo B — partido definitorio del grupo", highlight:true,
    },
    {
      id:"m5", date:"26 Jun", day:"Vie", time:"20:00 PT",
      teams:[{name:"Nueva Zelanda",flag:"🇳🇿"},{name:"Bélgica",flag:"🇧🇪"}],
      stadium:"BC Place", tag:"Grupo F", highlight:false,
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

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",   value:"Vancouver Stadium (BC Place)" },
      { label:"Aforo",          value:"~54,500 — configuración FIFA — con techo retráctil, el único estadio techado de Canadá en el torneo" },
      { label:"Techo",          value:"Retráctil — único estadio techado de Canadá en el torneo" },
      { label:"Clima (jun–jul)", value:"18–24°C · Lluvia ocasional · El techo cubre al fanático cuando el Pacífico decide opinar" },
      { label:"Partidos",       value:"7 confirmados (5 grupos + 1 Ronda de 32 + 1 Ronda de 16)" },
      { label:"Aeropuerto principal", value:"YVR — Vancouver International (a ~12 km del estadio, accesible por SkyTrain Canada Line en ~25 minutos)" },
      { label:"Visa",           value:"Canadá requiere eTA para ciudadanos de muchos países — se tramita en línea en canada.ca. No confundir con visa estadounidense; son requisitos independientes." },
    ],
    body:"Vancouver no necesitaba el Mundial para ser un destino. Lo que el torneo le da es contexto: siete partidos, el sueño de Canadá de avanzar jugándose aquí, y la confirmación de que el BC Place — donde se jugó la final de la Copa del Mundo Femenina 2015 — sabe lo que es un partido grande. El estadio conoce el peso. La ciudad también.",
    lagomNote:"Canadá requiere eTA (Electronic Travel Authorization) para ciudadanos de muchos países. Se tramita en canada.ca — no confundir con la visa estadounidense, son requisitos independientes. Tramítala antes de comprar el vuelo.",
  },

  vibe:{
    body:"Canadá juega aquí dos veces — incluyendo el partido decisivo del Grupo B el 24 de junio contra Suiza. Vancouver es donde el sueño canadiense de avanzar se define. Si Canadá pasa la fase de grupos, esta ciudad lo vive antes que nadie. El Vancouver Whitecaps tiene una de las bases de fanáticos más activas de MLS en el país. El BC Place ya albergó la final de la Copa del Mundo Femenina 2015 — el estadio conoce el peso de un partido grande. La ciudad suma la mejor escena de sushi fuera de Japón, dim sum que rivaliza con Hong Kong, izakaya de referencia internacional y mercados con acceso directo al Pacífico. Para comer, Vancouver no necesita justificarse. El costo es el límite: una de las ciudades más caras de Norteamérica en año sin Mundial, y el torneo no hace más que confirmar lo que el mercado inmobiliario ya había establecido.",
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

  neighborhoods:[
      {
        name:"Gastown / Downtown",
      vibe:"Dónde situarse: barrios clave. Vancouver es compacta para su tamaño. BC Place está en el centro de la ciudad, junto al False Creek — lo que significa que la mayoría de los barrios interesantes están a quince o veinte minutos del estadio a pie o en SkyTrain. Base recomendada: Gastown / Downtown. Gastown es el barrio histórico de Vancouver: adoquines, arquitectura de almacén restaurada y la mejor concentración de bares y restaurantes de la ciudad en radio corto. A diez minutos caminando de BC Place. El acceso al SkyTrain desde Waterfront Station conecta con el aeropuerto y con Main Street-Science World (la estación para ir al estadio en día de partido). Para el fanático que quiere estar en el corazón de la ciudad y llegar al partido caminando.",
      best_for:"Fan WC",
      walk_to_stadium:"10 min a pie · Waterfront Station (SkyTrain)",
      lagomNote:null,
    },
      {
        name:"Yaletown",
      vibe:"Opción con diseño: Yaletown. Antiguo distrito industrial reconvertido en barrio residencial de alta gama con restaurantes de autor, patios de cerveza artesanal y bares donde la Premier League se ve con pantalla de tamaño correcto. También a diez minutos caminando del estadio. Más tranquilo que Gastown, con mejor calidad promedio de restaurantes.",
      best_for:"Pareja",
      walk_to_stadium:"10 min a pie · False Creek waterfront",
      lagomNote:null,
    },
      {
        name:"Mount Pleasant / Main Street",
      vibe:"Presupuesto con criterio: Mount Pleasant / Main Street. Al sur del centro, Mount Pleasant tiene el mayor número de cafeterías independientes, librerías y restaurantes de costo razonable de Vancouver. Está en la Expo Line (Main Street-Science World), que es exactamente la estación que se usa para llegar al estadio en días de partido. La logística no podría ser más limpia.",
      best_for:"Presupuesto",
      walk_to_stadium:"Main Street-Science World + ruta peatonal (~15 min)",
      lagomNote:null,
    },
  ],

  stays:[
    {
      name:"Burrard Hotel",
      area:"Downtown",
      price:"$$$",
      priceCAD:"Precio estimado en periodo mundialista: $300–480 CAD/noche",
      tags:["Diseño honesto","Boutique","Robson cerca"],
      note:"Hotel de mediados del siglo XX con reforma contemporánea inteligente. Piscina en el techo, habitaciones con diseño honesto y ubicación a cuatro cuadras de Robson Street. A quince minutos caminando del estadio.",
      best_for:"Hotel boutique",
      url:"https://booking.stay22.com/lagomplan/D7ruOYHXD-",
    },
    {
      name:"HI Vancouver Central",
      area:"Downtown",
      price:"$",
      priceCAD:"Precio estimado en periodo mundialista: $55–120 CAD/noche según tipo de habitación",
      tags:["Presupuesto","Habitaciones privadas","SkyTrain cerca"],
      note:"El hostal de referencia en Vancouver para el viajero con presupuesto ajustado. Instalaciones actualizadas, habitaciones privadas disponibles y conexión directa al SkyTrain a dos cuadras.",
      best_for:"Presupuesto / hostal",
      url:"https://booking.stay22.com/lagomplan/ZgKZumDd-f",
    },
    {
      name:"Fairmont Pacific Rim",
      area:"Coal Harbour / Waterfront",
      price:"$$$$",
      priceCAD:"Precio estimado en periodo mundialista: $600–1,200 CAD/noche",
      tags:["Vistas a las montañas","Spa","Piscina en techo"],
      note:"Vistas directas a las montañas y a la bahía de Coal Harbour desde el mismo hotel. Spa, piscina en el techo, restaurante de referencia. La dirección más impresionante de Vancouver para el viajero que también puede pagarlo.",
      best_for:"Lujo de cadena",
      url:"https://booking.stay22.com/lagomplan/imm_Upe4Mm",
    },
  ],

  logistics:{
    transport:[
      {
        icon:"✈",
        title:"Llegar a Vancouver — YVR",
        text:"YVR — Vancouver International está a ~12 km del estadio y es accesible por SkyTrain Canada Line en ~25 minutos. Canadá requiere eTA (Electronic Travel Authorization) para ciudadanos de muchos países — se tramita en línea en canada.ca. No confundir con visa estadounidense; son requisitos independientes.",
      },
      {
        icon:"🚇",
        title:"Del aeropuerto a la ciudad",
        text:"Canada Line SkyTrain desde YVR hasta Waterfront Station: ~25 minutos. Desde ahí puedes conectar con la Expo Line hacia Main Street-Science World. TransLink opera todo el SkyTrain — usa Compass Card o pago sin contacto.",
      },
      {
        icon:"🏟",
        title:"Al estadio el día del partido — ruta maestra",
        text:"SkyTrain Expo Line → Main Street-Science World → ruta peatonal designada. La estación Main Street-Science World está a unos 10-15 minutos caminando del estadio por la ruta peatonal mundialista que pasa por Concord Lands. Es la estación oficial para BC Place durante el Mundial. Desde Gastown o Yaletown, el trayecto desde Waterfront Station o Granville Station toma entre 8 y 12 minutos en SkyTrain.",
      },
      {
        icon:"⚠️",
        title:"Error crítico — Stadium-Chinatown CERRADA",
        text:"Usar la estación Stadium-Chinatown del SkyTrain en días de partido es el error crítico. TransLink ha confirmado que esta estación estará CERRADA para fans mundialistas en todos los días de partido en BC Place. No importa lo que diga tu aplicación de tránsito o cualquier otra guía — no puedes entrar por ahí. La estación correcta es Main Street-Science World, siempre.",
        isWarning:true,
      },
    ],
    timings:[
      { label:"YVR → Waterfront (Canada Line)", value:"~25 min" },
      { label:"Desde Gastown (Waterfront + SkyTrain + caminata)", value:"~25 min total" },
      { label:"YVR → Waterfront + Expo Line a Main St", value:"~40 min total" },
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
        { time:"H+1:30", text:"SkyTrain de regreso por la misma ruta. El BC Place tiene techo — si llueve después del partido, ya estás adentro hasta que pase." },
      ],
    },
    timing:"BC Place está en el centro de la ciudad — literalmente. El desafío no es la distancia, sino saber qué estación de SkyTrain usar. Aquí hay una sola instrucción que importa más que cualquier otra en esta guía: Main Street-Science World, siempre.",
    cost:"Una de las ciudades más caras de Norteamérica en año sin Mundial. El torneo confirma lo que el mercado inmobiliario ya había establecido. Reserva con anticipación.",
  },

  vibeCards:[
    {
      title:"FIFA Fan Festival™ — PNE / Hastings Park",
      type:"Fan fest oficial",
      typeColor:T.coral,
      desc:"El Fan Fest de Vancouver se instala en el Hastings Park (PNE — Pacific National Exhibition), el gran recinto ferial del este de la ciudad. Pantallas de gran formato, programación cultural y activaciones en un espacio que tiene capacidad para decenas de miles de fanáticos. Acceso por SkyTrain Expo Line hasta Commercial-Broadway, luego autobús hacia Hastings. Para el fan sin boleto en días de partido de Canadá, llega temprano: el PNE se llena.",
      tag:"Sin boleto OK",
    },
    {
      title:"Plaza Canada Place",
      type:"Pantalla exterior",
      typeColor:T.fjord,
      desc:"El emblemático edificio de velas blancas sobre el puerto de Burrard Inlet tiene una explanada exterior orientada al agua que en eventos internacionales opera como pantalla de facto de la ciudad. Para los partidos de Canadá, el contexto — Puerto de Vancouver, montañas North Shore, skyline — es el mejor telón de fondo mundialista del país.",
      tag:"Icónico",
    },
    {
      title:"Robson Square",
      type:"Plaza peatonal",
      typeColor:T.sage,
      desc:"La plaza peatonal techada frente al Tribunal de Justicia Provincial y la Galería de Arte de BC fue el escenario de las celebraciones del oro en hockey de los Juegos Olímpicos de 2010. Vancouver la activa para eventos masivos con cierta regularidad — el torneo justifica hacerlo de nuevo.",
      tag:"Familiar",
    },
    {
      title:"Commercial Drive — La Drive",
      type:"Barrio italiano",
      typeColor:T.pine,
      desc:"El corredor italiano de Vancouver lleva transmitiendo calcio en sus cafeterías y terrazas desde los años 90. En días de partido de Italia (cuando clasifican), Argentina o Brasil, la Drive se convierte en un estadio al aire libre sin que nadie lo haya convocado formalmente. La historia futbolera más orgánica de cualquier calle de Canadá.",
      tag:"Auténtico",
    },
    {
      title:"Shark Club Bar & Grill",
      type:"Sports bar",
      typeColor:"#1A3A5C",
      desc:"El bar de deportes de referencia en Vancouver, con pantallas en cada ángulo y la mayor concentración de aficionados al fútbol por metro cuadrado de la ciudad en días de partido de Canadá. Para el 24 de junio (Suiza vs. Canadá), llega dos horas antes — se llena y no espera. Qué pedir: Alitas + cerveza local de BC. Vibe: Sports bar serio, el más animado de Vancouver en partidos internacionales.",
      tag:"Alta demanda",
    },
    {
      title:"The Cambie",
      type:"Pub histórico",
      typeColor:"#5A3A2A",
      desc:"Pub histórico con precios razonables y un ambiente de mezcla internacional que encaja perfectamente con el perfil del torneo. La clientela es tan diversa como el partido que esté en pantalla — para la sede con Australia, Bélgica, Nueva Zelanda y Qatar en el mismo calendario, The Cambie tiene a alguien de cada selección sentado en la barra. Qué pedir: Poutine + cerveza local de barril. Vibe: De barrio, con historia, sin pretensiones.",
      tag:"Gastown",
    },
    {
      title:"Score on Davie",
      type:"Sports bar",
      typeColor:"#093b12",
      desc:"El sports bar más activo del barrio de Davie, con múltiples pantallas, terraza exterior y una tradición establecida de transmitir fútbol internacional desde la era de la Champions en los años 2000. Para los partidos de Bélgica y Nueva Zelanda — con diásporas activas en Vancouver — Score es el punto de reunión natural. Qué pedir: Nachos de la casa + lo que esté de barril. Vibe: Barrio, activo, pantalla siempre encendida.",
      tag:"Davie Village",
    },
  ],

  food:[
    { dish:"Shark Club Bar & Grill", where:"Downtown — alitas + cerveza local de BC; sports bar serio, el más animado de Vancouver en partidos internacionales", price:"$$", type:"Pre-partido" },
    { dish:"The Cambie",             where:"Gastown — poutine + cerveza local de barril; pub histórico, precios razonables y ambiente mezclado", price:"$", type:"De barrio" },
    { dish:"Score on Davie",         where:"Davie Village — nachos de la casa + lo que esté de barril; barrio activo, terraza y pantalla siempre encendida", price:"$$", type:"Sports bar" },
    { dish:"Ramen de referencia",    where:"Robson Street — la mayor densidad de ramen de Norteamérica fuera de Japón", price:"$–$$", type:"Imperdible" },
    { dish:"Sushi del Pacífico",     where:"Robson o Coal Harbour — sushi con acceso directo al Pacífico", price:"$$", type:"Local" },
    { dish:"Curry sikh",             where:"Surrey, a 30 min en SkyTrain — la mejor comunidad sikh de Columbia Británica", price:"$", type:"Excursión" },
  ],

  experiences:[
    {
      title:"Whistler — excursión de día",
      duration:"Día completo",
      desc:"El entretiempo ideal para entender por qué Vancouver tiene una lista de espera de inmigración que el Mundial no va a achicar. A dos horas de Vancouver por la Sea-to-Sky Highway — una de las carreteras más espectaculares de Norteamérica. En junio, Whistler tiene senderismo de alta montaña, tirolesas, el Whistler Mountain Bike Park y vistas a glaciares. El autobús Whistler Mountaineer opera desde el centro de Vancouver. Para el fan con un día completo libre entre el 13 y el 18 de junio, no hay mejor excursión en el torneo.",
      type:"Excursión",
      affiliateLink:"AFFILIATE_LINK_WHISTLER",
      affiliateLabel:"Ver tours a Whistler",
    },
    {
      title:"Deep Cove + Indian Arm — kayak",
      duration:"Medio día",
      desc:"A 30 minutos en auto o transporte privado al norte de Vancouver, Deep Cove es un pueblo de kayak en el Indian Arm. Alquiler de kayaks y paddleboards disponibles por hora o por día. El recorrido hacia el fiordo tiene aguas tranquilas, cascadas y vistas que explican por qué la gente paga $2 millones por vivir cerca.",
      type:"Aventura",
      affiliateLink:"AFFILIATE_LINK_DEEPCOVE_KAYAK",
      affiliateLabel:"Reservar kayak en Deep Cove",
    },
    {
      title:"Stanley Park + English Bay",
      duration:"Mañana o tarde",
      desc:"El parque urbano más grande de Norteamérica rodea la parte norte de la península de Vancouver en 405 hectáreas de bosque costero. La ruta en bicicleta del Seawall (22 km de circuito) recorre la costa del parque con vistas al estrecho de Georgia. El alquiler de bicicletas está disponible en English Bay y junto al parque. Al atardecer, English Bay es el punto de reunión de la ciudad: el mejor sitio para ver el ocaso del Pacífico antes de un partido nocturno.",
      type:"Ciudad",
      affiliateLink:"AFFILIATE_LINK_STANLEY_PARK_BIKES",
      affiliateLabel:"Alquilar bicicleta en English Bay",
    },
    {
      title:"BC Place — el estadio antes del partido",
      duration:"1–2 horas",
      desc:"El BC Place tiene techo retráctil y fue sede de la final de la Copa del Mundo Femenina 2015. Llegar 90 minutos antes del partido no es logística — es el espectáculo. La explanada exterior, el False Creek a pasos, y las montañas North Shore al fondo son la foto previa al partido.",
      type:"Imperdible",
      affiliateLink:"AFFILIATE_LINK_BCPLACE_TICKETS",
      affiliateLabel:"Ver entradas disponibles",
    },
  ],

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
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATION — Vancouver
// ─────────────────────────────────────────────────────────────────────────────
const VanIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#E8F0EC" rx={RADIUS} />
    <rect x="0" y="95" width="280" height="45" fill="#D8E5EE" />
    <polygon points="0,95 45,40 90,95"  fill="#4A7A6A" opacity="0.5" />
    <polygon points="40,95 90,28 140,95" fill="#2D4F4A" opacity="0.55" />
    <polygon points="90,95 145,32 200,95" fill="#3D6A5A" opacity="0.45" />
    <polygon points="155,95 200,52 245,95" fill="#4A7A6A" opacity="0.35" />
    <polygon points="90,28 102,46 78,46"  fill="white" opacity="0.85" />
    <polygon points="145,32 155,48 135,48" fill="white" opacity="0.7" />
    <polygon points="45,40 53,55 37,55"  fill="white" opacity="0.6" />
    <rect x="16" y="72" width="7"  height="23" fill="#2D4F6C" opacity="0.3" rx={1} />
    <rect x="27" y="64" width="9"  height="31" fill="#2D4F6C" opacity="0.35" rx={1} />
    <rect x="40" y="68" width="6"  height="27" fill="#2D4F6C" opacity="0.25" rx={1} />
    <rect x="50" y="60" width="8"  height="35" fill="#2D4F6C" opacity="0.3" rx={1} />
    <rect x="62" y="70" width="5"  height="25" fill="#2D4F6C" opacity="0.2" rx={1} />
    <ellipse cx="226" cy="88" rx="30" ry="12" fill="#2D4F6C" opacity="0.18" />
    <rect x="196" y="76" width="60" height="12" fill="#2D4F6C" opacity="0.15" rx={2} />
    <path d="M196,76 Q226,60 256,76" stroke="#2D4F6C" strokeWidth="1.5" fill="none" opacity="0.3" />
    <line x1="0" y1="93" x2="180" y2="93" stroke="#6B8F86" strokeWidth="1" opacity="0.4" strokeDasharray="4,3" />
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
      style={{
        background:T.white,
        border:`1px solid ${CARD_BORDER}`,
        borderRadius:RADIUS,
        boxShadow: isHovered ? "0 4px 16px rgba(28,28,26,0.09), 0 1px 3px rgba(28,28,26,0.05)" : CARD_SHADOW,
        transition:"box-shadow 0.22s, transform 0.22s",
        transform: isHovered ? "translateY(-1px)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>
      {children}
    </div>
  );
};

const Divider = ({ my=48 }) => <div style={{ height:1, background:T.sandDark, margin:`${my}px 0` }} />;

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom:32 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
      <span style={{ ...uf(9,500), letterSpacing:"0.18em", textTransform:"uppercase", color:T.inkFaint }}>{number}</span>
      <div style={{ flex:1, height:1, background:"rgba(28,28,26,0.08)" }} />
    </div>
    <h2 style={{ ...uf(27, 700), color:T.pine, lineHeight:1.05, marginBottom:subtitle ? 8 : 0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.65, margin:0, maxWidth:540 }}>{subtitle}</p>}
  </div>
);

const LagomNote = ({ children }) => (
  <div style={{
    display:"flex", gap:16, padding:"18px 22px",
    background:T.sandLight,
    borderLeft:`3px solid ${T.sage}`,
    borderRadius:`0 ${RADIUS}px ${RADIUS}px 0`,
  }}>
    <span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.14em", textTransform:"uppercase", flexShrink:0, marginTop:3 }}>Lagom</span>
    <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:0 }}>{children}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MATCH CARD
// ─────────────────────────────────────────────────────────────────────────────
const MatchCard = ({ match, onPlanAround }) => {
  const isTBD = !match.teams[0].flag && !match.teams[1].flag;
  const borderColor = match.highlight ? `${T.matchGold}50` : T.sandDark;
  const accentBar = match.highlight ? T.matchGold : isTBD ? T.sandDark : CITY_ACCENT;

  return (
    <Card style={{ overflow:"hidden", borderColor, opacity: isTBD ? 0.55 : 1 }}>
      <div style={{ height:4, background:accentBar }} />
      <div style={{ padding:"22px 24px" }}>

        {/* Date + tag row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{
              textAlign:"center", minWidth:48, padding:"8px 12px",
              background: T.sand,
              borderRadius:RADIUS-2,
              border:`1px solid ${T.sandDark}`,
            }}>
              <div style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkFaint }}>{match.day}</div>
              <div style={{ ...df(20,700), color:T.pine, lineHeight:1.1, margin:"2px 0" }}>{match.date.split(" ")[0]}</div>
              <div style={{ ...uf(9,500), color:T.inkFaint }}>{match.date.split(" ")[1]}</div>
            </div>
            <div>
              <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3 }}>
                {match.stadium}
              </div>
              <div style={{ ...uf(13,500), color:T.inkMid }}>{match.time} local</div>
            </div>
          </div>
          {match.tag && (
            <span style={{
              ...uf(9,700), letterSpacing:"0.08em", textTransform:"uppercase",
              color: match.highlight ? T.matchGold : CITY_ACCENT,
              background: match.highlight ? T.matchGoldLight : CITY_ACCENT+"15",
              border:`1px solid ${match.highlight ? T.matchGold+"50" : CITY_ACCENT+"35"}`,
              padding:"4px 10px", borderRadius:40, flexShrink:0, maxWidth:140, textAlign:"right",
            }}>{match.tag}</span>
          )}
        </div>

        {/* Teams */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:16,
          padding:"18px 0",
          borderTop:`1px solid ${T.sandDark}`,
          borderBottom:`1px solid ${T.sandDark}`,
          marginBottom:18,
        }}>
          <div style={{ flex:1, textAlign:"right" }}>
            <div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[0].name}</div>
            {match.teams[0].flag && <div style={{ fontSize:26, lineHeight:1 }}>{match.teams[0].flag}</div>}
          </div>
          <div style={{
            ...uf(11,600), color:T.inkFaint, letterSpacing:"0.12em",
            padding:"6px 14px", background:T.sand, borderRadius:6,
            border:`1px solid ${T.sandDark}`,
          }}>
            vs
          </div>
          <div style={{ flex:1, textAlign:"left" }}>
            <div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[1].name}</div>
            {match.teams[1].flag && <div style={{ fontSize:26, lineHeight:1 }}>{match.teams[1].flag}</div>}
          </div>
        </div>

        {/* CTA */}
        {!isTBD && (
          null
        )}
        {isTBD && (
          <div style={{ ...uf(12,400), color:T.inkFaint, textAlign:"center", padding:"8px 0" }}>
            Rival por definir al terminar fase de grupos
          </div>
        )}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESSIVE DISCLOSURE — shared toggle + collapsible section
// ─────────────────────────────────────────────────────────────────────────────
const ShowMoreToggle = ({ expanded, onToggle }) => (
  <button onClick={onToggle} style={{
    display:"inline-flex", alignItems:"center", gap:5, marginTop:16,
    background:"transparent",
    border:`1px solid ${T.sage}55`,
    borderRadius:40,
    ...uf(10,600), color:T.sage, cursor:"pointer",
    letterSpacing:"0.08em", textTransform:"uppercase",
    padding:"5px 14px", transition:"all 0.18s",
  }}
    onMouseEnter={e => { e.currentTarget.style.background=T.sageLight; e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.color=T.pine; }}
    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`${T.sage}55`; e.currentTarget.style.color=T.sage; }}>
    {expanded ? "Ver menos ↑" : "Ver más ↓"}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// COLLAPSIBLE VIBE CARD — ExperienceCard with expand/collapse on desc
// ─────────────────────────────────────────────────────────────────────────────
const CollapsibleVibeCard = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <Card hover style={{ overflow:"hidden", display:"flex", flexDirection:"row" }}>
      {/* Left accent bar */}
      <div style={{ width:3, flexShrink:0, background:item.typeColor, opacity:0.7 }} />
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:9, flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase",
            color:item.typeColor }}>
            {item.type}
          </span>
          <span style={{ ...uf(9,500), letterSpacing:"0.08em", textTransform:"uppercase",
            color:T.inkFaint }}>
            {item.tag}
          </span>
        </div>
        <div style={{ ...df(14,700), color:T.pine, lineHeight:1.25 }}>{item.title}</div>
        <p style={{
          ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0,
          ...(open ? {} : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }),
        }}>{item.desc}</p>
        <ShowMoreToggle expanded={open} onToggle={() => setOpen(!open)} />
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAY CARD
// ─────────────────────────────────────────────────────────────────────────────
const StayCard = ({ stay }) => (
  <Card hover style={{ display:"flex", flexDirection:"column", height:"100%" }}>
    <div style={{ padding:"22px 22px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ ...df(26,700), color:T.pine, letterSpacing:"-0.02em" }}>{stay.price}</span>
        <Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label>
      </div>
      <div style={{ ...df(17,700), color:T.pine, lineHeight:1.2, marginBottom:4 }}>{stay.name}</div>
      <div style={{ ...uf(12,500), color:T.inkFaint, marginBottom:10 }}>{stay.area}</div>
      {stay.priceCAD && (
        <div style={{ ...uf(12,600), color:CITY_ACCENT, marginBottom:14, letterSpacing:"0.02em" }}>{stay.priceCAD}</div>
      )}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
        {stay.tags.map(tag => (
          <span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase",
            color:T.inkFaint, background:T.sand, padding:"3px 8px", borderRadius:5, border:`1px solid ${T.sandDark}` }}>{tag}</span>
        ))}
      </div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"14px 22px", borderTop:`1px solid ${T.sandDark}` }}>
      <a href={stay.url || "#"} target={stay.url ? "_blank" : undefined} rel="noopener noreferrer" style={{
        display:"block", textAlign:"center",
        width:"100%", padding:"11px", background: stay.url ? T.pine : T.sandDark, borderRadius:RADIUS-2,
        ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white,
        textDecoration:"none", transition:"opacity 0.18s",
        pointerEvents: stay.url ? "auto" : "none", opacity: stay.url ? 1 : 0.45,
      }}
        onMouseEnter={e => { if (stay.url) e.currentTarget.style.opacity="0.82"; }}
        onMouseLeave={e => { if (stay.url) e.currentTarget.style.opacity="1"; }}>
        Ver disponibilidad
      </a>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE CARD (vibe cards)
// ─────────────────────────────────────────────────────────────────────────────
const ExperienceCard = ({ item }) => (
  <Card hover style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:10 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
        color:item.typeColor, background:item.typeColor+"15", padding:"4px 10px", borderRadius:40 }}>
        {item.type}
      </span>
      <span style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase",
        color:T.inkFaint, background:T.sand, padding:"4px 8px", borderRadius:40, border:`1px solid ${T.sandDark}` }}>
        {item.tag}
      </span>
    </div>
    <div style={{ ...df(15,700), color:T.pine, lineHeight:1.25 }}>{item.title}</div>
    <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{item.desc}</p>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// FOOD CARD — soft card replacing list rows
// ─────────────────────────────────────────────────────────────────────────────
const FoodCard = ({ item }) => (
  <div style={{
    background:T.white,
    border:`1px solid ${CARD_BORDER}`,
    borderRadius:RADIUS,
    boxShadow:CARD_SHADOW,
    padding:"16px 18px",
    display:"flex", flexDirection:"column", gap:6,
  }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
      <span style={{ ...uf(13,600), color:T.pine, lineHeight:1.3 }}>{item.dish}</span>
      <span style={{ ...uf(12,500), color:T.inkFaint, flexShrink:0 }}>{item.price}</span>
    </div>
    <p style={{ ...uf(12,400), color:T.inkFaint, lineHeight:1.55, margin:0 }}>{item.where}</p>
    <div style={{ marginTop:4 }}>
      <Label color={T.sage} bg={T.sageLight}>{item.type}</Label>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGISTICS CARD
// ─────────────────────────────────────────────────────────────────────────────
const LogisticsCard = ({ item }) => (
  <Card style={{
    display:"flex", gap:16, padding:"18px 22px", alignItems:"flex-start",
    borderColor: item.isWarning ? `${T.coral}55` : T.sandDark,
    background: item.isWarning ? T.coralLight : T.white,
  }}>
    <div style={{
      width:40, height:40, flexShrink:0,
      background:item.isWarning ? T.coral+"20" : T.sageLight,
      borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
    }}>
      {item.icon}
    </div>
    <div>
      <div style={{ ...uf(13,700), color:item.isWarning ? T.coral : T.pine, marginBottom:6 }}>{item.title}</div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{item.text}</p>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const GuideSidebar = ({ guide, onPlan }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* CTA primario */}
      <Card style={{ padding:"22px 22px", background:T.sandLight, borderColor:T.sandDark }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...uf(16, 700), color:T.pine, lineHeight:1.4, marginBottom:16 }}>
          ¿Listo para tu versión del Mundial? Convierte esta guía en un itinerario adaptado a tus tiempos y presupuesto.
        </p>
        <button onClick={onPlan} style={{
          width:"100%", padding:"11px 16px",
          background:T.pine, border:"none",
          borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.12em", textTransform:"uppercase",
          color:T.white, cursor:"pointer", transition:"opacity 0.18s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.82"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          {guide.plannerCTA} →
        </button>
      </Card>

      {/* Notas Lagom */}
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.sageLight, borderRadius:RADIUS-2,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>✦</span>
          </div>
          <Label color={T.pine} style={{ fontSize:11 }}>Notas Lagom</Label>
        </div>
        {guide.lagomTips.map((tip, i) => (
          <div key={i} style={{
            display:"flex", gap:11,
            paddingTop:12, paddingBottom:12,
            borderBottom: i < guide.lagomTips.length-1 ? `1px solid ${T.sandDark}` : "none",
          }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:T.sage, flexShrink:0, marginTop:7 }} />
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{tip}</p>
          </div>
        ))}
      </Card>

      {/* Checklist día de partido */}
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.matchGoldLight, borderRadius:RADIUS-2,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>☑</span>
          </div>
          <Label color={T.pine} style={{ fontSize:11 }}>Checklist día de partido</Label>
        </div>
        {guide.matchDayChecklist.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => ({...p,[i]:!p[i]}))} style={{
            display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0",
            borderTop: i > 0 ? `1px solid ${T.sandDark}` : "none",
            background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%",
          }}>
            <div style={{
              width:16, height:16, flexShrink:0, marginTop:2,
              border:`1.5px solid ${checked[i] ? T.sage : T.sandDark}`, borderRadius:4,
              background:checked[i] ? T.sage : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s",
            }}>
              {checked[i] && <span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ ...uf(12,400), color:checked[i] ? T.inkFaint : T.inkMid, lineHeight:1.55,
              textDecoration:checked[i] ? "line-through" : "none", transition:"all 0.15s" }}>
              {item}
            </span>
          </button>
        ))}
      </Card>

      {/* ¿Sabías que? */}
      <Card style={{ padding:"20px 22px", background:T.fjordLight, borderColor:`${T.fjord}30` }}>
        <Label color={T.fjord} style={{ marginBottom:10, display:"block" }}>¿Sabías que?</Label>
        <p style={{ ...uf(13,400), color:T.fjord, lineHeight:1.72, margin:0 }}>{guide.didYouKnow}</p>
      </Card>

      {/* IA — optimizar */}
      <Card style={{ padding:"18px 22px", borderStyle:"dashed", borderColor:T.sandDark }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>✦</span>
          <div>
            <div style={{ ...uf(12,700), color:T.pine, marginBottom:6 }}>Optimizar itinerario con IA</div>
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:"0 0 12px" }}>
              Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.
            </p>
            <button onClick={onPlan} style={{
              ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
              color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2,
              padding:"7px 14px", cursor:"pointer", transition:"all 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background=T.pine; e.currentTarget.style.color=T.white; }}
              onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color=T.pine; }}>
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
  <div style={{
    display:"grid", gridTemplateColumns:"1fr 280px", gap:56, alignItems:"center",
    padding:"72px 0 64px", borderBottom:`1px solid rgba(28,28,26,0.08)`, marginBottom:56,
  }}>
    <div>
      {/* Breadcrumb meta */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <span style={{ fontSize:18 }}>{guide.flag}</span>
        <Label color={T.inkFaint}>{guide.country} · {guide.state}</Label>
        <span style={{ color:T.sandDark, fontSize:12 }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.name}</Label>
        <span style={{ color:T.sandDark, fontSize:12 }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.capacity}</Label>
      </div>

      {/* City name */}
      <h1 style={{
        ...uf("clamp(44px,5.5vw,72px)", 900),
        color:T.pine, lineHeight:0.92,
        letterSpacing:"-0.03em", marginBottom:22,
      }}>
        {guide.city}
      </h1>

      {/* Description */}
      <p style={{
        ...uf(15,400), color:T.inkMid, lineHeight:1.85,
        maxWidth:500, marginBottom:32,
      }}>
        {guide.description}
      </p>

      {/* Tags */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
        {guide.tags.map(tag => (
          <span key={tag} style={{
            ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase",
            color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`,
            padding:"5px 13px", borderRadius:40,
          }}>{tag}</span>
        ))}
        <span style={{
          ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase",
          color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}35`,
          padding:"5px 13px", borderRadius:40,
        }}>
          ⚽ {guide.matches.length} partidos
        </span>
      </div>

      {/* Scores */}
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:3 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  width:6, height:6, borderRadius:"50%",
                  background: i <= s.value ? T.sage : T.sandDark,
                }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Illustration */}
    <div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}>
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
  {id:"stays",     label:"Dónde dormir"},
  {id:"vibe",      label:"Ambiente"},
  {id:"logistics", label:"Logística"},
];

const StickyNav = ({ active, onNavigate, onBack }) => (
  <div style={{
    position:"sticky", top:0, zIndex:40,
    background:`${T.bg}F5`, backdropFilter:"blur(18px)",
    borderBottom:`1px solid ${T.sandDark}`, height:52,
    display:"flex", alignItems:"center", padding:"0 40px", gap:0, overflowX:"auto",
  }}>
    <button onClick={onBack} style={{
      ...uf(11,500), color:T.inkFaint, background:"none", border:"none",
      cursor:"pointer", padding:"0 14px 0 0", marginRight:14,
      borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em",
      transition:"color 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.color=T.pine}
      onMouseLeave={e => e.currentTarget.style.color=T.inkFaint}>
      ← Guías
    </button>
    <span style={{ ...uf(14, 700), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>Vancouver</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{
        ...uf(10, active === item.id ? 700 : 500),
        letterSpacing:"0.08em", textTransform:"uppercase",
        color: active === item.id ? T.pine : T.inkFaint,
        background:"none", border:"none", padding:"0 13px", height:"100%",
        cursor:"pointer",
        borderBottom:`2px solid ${active === item.id ? T.coral : "transparent"}`,
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

  // Progressive disclosure state per section
  const [showManifesto, setShowManifesto]   = useState(false);
  const [showVibe,      setShowVibe]        = useState(false);
  const [showLogistics, setShowLogistics]   = useState(false);
  const [showFood,      setShowFood]        = useState(false);
  const [showExp,       setShowExp]         = useState(false);

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

      <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 40px" }}>
        <GuideHero guide={guide} />

        {/* TWO-COLUMN LAYOUT */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:52, alignItems:"flex-start" }}>

          {/* ── MAIN ── */}
          <div>

            {/* 01 — MATCHES */}
            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos"
                subtitle="7 partidos confirmados en BC Place. Los dos de Canadá — 18 y 24 de junio — son los de mayor demanda." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {guide.matches.map(match => (
                  <MatchCard key={match.id} match={match} onPlanAround={() => {}} />
                ))}
              </div>
            </section>

            {/* 02 — MANIFIESTO */}
            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title="Manifiesto de campo"
                subtitle="Lo que necesitas saber antes de llegar." />

              {/* Stadium metadata — always visible */}
              <Card style={{ marginBottom:24, overflow:"hidden" }}>
                <div style={{ height:4, background:CITY_ACCENT }} />
                <div style={{ padding:"20px 24px" }}>
                  {guide.manifesto.stadiumInfo.map((item, i) => (
                    <div key={i} style={{
                      display:"flex", gap:20, padding:"11px 0",
                      borderBottom: i < guide.manifesto.stadiumInfo.length-1 ? `1px solid ${T.sandDark}` : "none",
                    }}>
                      <span style={{ ...uf(11,600), color:T.inkFaint, minWidth:148, flexShrink:0, letterSpacing:"0.05em" }}>{item.label}</span>
                      <span style={{ ...uf(13,500), color:T.ink, lineHeight:1.6 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Collapsible narrative */}
              {showManifesto && (
                <>
                  <p style={{ ...uf(15,400), color:T.ink, lineHeight:1.9, marginBottom:24, maxWidth:640 }}>
                    {guide.manifesto.body}
                  </p>
                  <LagomNote>{guide.manifesto.lagomNote}</LagomNote>
                </>
              )}
              <ShowMoreToggle expanded={showManifesto} onToggle={() => setShowManifesto(!showManifesto)} />
            </section>

            {/* 03 — STAYS */}
            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso"
                subtitle="Refugios seleccionados para recargar energías entre el diseño de autor y el confort estratégico." />
              <div style={{
                marginBottom:18, padding:"14px 18px", background:T.coralLight,
                border:`1px solid ${T.coral}40`, borderRadius:RADIUS,
              }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>
                    Los precios indicados son estimaciones para el periodo mundialista. El 24 de junio (Suiza vs. Canadá, partido definitorio del Grupo B) y el 18 de junio (Canadá vs. Qatar) son las fechas de mayor demanda en Vancouver.
                    Si no tienes reserva confirmada, Airbnb en <strong>Kitsilano</strong>, <strong>Commercial Drive</strong> o <strong>East Vancouver</strong> tienen buena conexión de SkyTrain.
                  </p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay => (
                  <StayCard key={stay.name} stay={stay} />
                ))}
              </div>
            </section>

            {/* 04 — VIBE / AMBIENTE */}
            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente"
                subtitle="Fan fest oficial, pantallas en la ciudad y el barrio italiano que lleva 30 años transmitiendo calcio." />

              {/* Body preview — always 2 lines */}
              <p style={{
                ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe ? 28 : 0, maxWidth:640,
                ...(showVibe ? {} : { display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }),
              }}>
                {guide.vibe.body}
              </p>

              {showVibe && (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
                    {guide.vibeCards.map(item => (
                      <CollapsibleVibeCard key={item.title} item={item} />
                    ))}
                  </div>
                  <LagomNote>{guide.vibe.lagomNote}</LagomNote>
                </>
              )}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} />
            </section>

            {/* 05 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio"
                subtitle="Una sola instrucción importa más que cualquier otra en esta guía." />

              {/* First 2 transport cards — always visible */}
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom: showLogistics ? 24 : 0 }}>
                {guide.logistics.transport.slice(0, 2).map((item, i) => (
                  <LogisticsCard key={i} item={item} />
                ))}
              </div>

              {showLogistics && (
                <>
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                    {guide.logistics.transport.slice(2).map((item, i) => (
                      <LogisticsCard key={i} item={item} />
                    ))}
                  </div>

                  {/* Timings table */}
                  <Card style={{ marginBottom:24 }}>
                    <div style={{ padding:"18px 24px" }}>
                      <div style={{ ...uf(10,700), letterSpacing:"0.16em", textTransform:"uppercase",
                        color:T.inkFaint, marginBottom:14 }}>Tiempos reales de desplazamiento</div>
                      {guide.logistics.timings.map((t, i) => (
                        <div key={i} style={{
                          display:"flex", justifyContent:"space-between", alignItems:"center",
                          padding:"11px 0",
                          borderBottom: i < guide.logistics.timings.length-1 ? `1px solid ${T.sandDark}` : "none",
                        }}>
                          <span style={{ ...uf(13,400), color:T.inkMid }}>{t.label}</span>
                          <span style={{ ...uf(13,700), color:T.pine }}>{t.value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Match day cronología */}
                  <Card style={{ overflow:"hidden", marginBottom:16 }}>
                    <div style={{ height:4, background:T.matchGold }} />
                    <div style={{ padding:"20px 24px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                        <span style={{ fontSize:16 }}>⚽</span>
                        <div style={{ ...uf(11,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.matchGold }}>
                          Cronología recomendada
                        </div>
                        <span style={{ ...uf(13,600), color:T.ink }}>{guide.logistics.matchDayCronologia.matchName}</span>
                      </div>
                      {guide.logistics.matchDayCronologia.steps.map((step, i) => (
                        <div key={i} style={{
                          display:"flex", gap:16,
                          paddingTop: i > 0 ? 14 : 0, paddingBottom: i < guide.logistics.matchDayCronologia.steps.length-1 ? 14 : 0,
                          borderBottom: i < guide.logistics.matchDayCronologia.steps.length-1 ? `1px solid ${T.sandDark}` : "none",
                        }}>
                          <span style={{ ...uf(10,700), color:T.matchGold, minWidth:46, flexShrink:0, letterSpacing:"0.04em", paddingTop:2 }}>{step.time}</span>
                          <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{step.text}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Timing note */}
                  <div style={{
                    display:"flex", gap:12, padding:"14px 18px",
                    background:T.sandLight, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS,
                  }}>
                    <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
                    <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{guide.logistics.timing}</p>
                  </div>
                </>
              )}
              <ShowMoreToggle expanded={showLogistics} onToggle={() => setShowLogistics(!showLogistics)} />
            </section>

            {/* 06 — FOOD */}
            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista"
                subtitle="Vancouver no tiene una gastronomía nacional — tiene el Pacífico a la puerta y una comunidad asiática que lleva décadas redefiniendo lo que significa comer bien en Norteamérica." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                {/* First 3 cards always visible */}
                {guide.food.slice(0, 3).map((f, i) => (
                  <FoodCard key={i} item={f} />
                ))}
                {/* Remaining cards — collapsible */}
                {showFood && guide.food.slice(3).map((f, i) => (
                  <FoodCard key={i+3} item={f} />
                ))}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} />
            </section>

            {/* 07 — EXPERIENCES */}
            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio"
                subtitle="El entretiempo ideal para entender por qué Vancouver tiene una lista de espera de inmigración que el Mundial no va a achicar." />
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {/* First experience always visible */}
                {guide.experiences.slice(0, 1).map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{
                      ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none",
                      paddingTop:4, width:40, textAlign:"right", flexShrink:0,
                    }}>
                      {String(i+1).padStart(2,"0")}
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                      {exp.affiliateLink && (
                        <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{
                          display:"inline-flex", alignItems:"center", gap:6,
                          ...uf(11,600), color:T.sage, letterSpacing:"0.05em",
                          textDecoration:"none", borderBottom:`1px solid ${T.sage}50`,
                          paddingBottom:1, transition:"color 0.15s, border-color 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.color=T.pine; e.currentTarget.style.borderColor=T.pine; }}
                          onMouseLeave={e => { e.currentTarget.style.color=T.sage; e.currentTarget.style.borderColor=`${T.sage}50`; }}>
                          {exp.affiliateLabel} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {/* Remaining experiences — collapsible */}
                {showExp && guide.experiences.slice(1).map((exp, i) => (
                  <div key={i+1} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{
                      ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none",
                      paddingTop:4, width:40, textAlign:"right", flexShrink:0,
                    }}>
                      {String(i+2).padStart(2,"0")}
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                      {exp.affiliateLink && (
                        <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{
                          display:"inline-flex", alignItems:"center", gap:6,
                          ...uf(11,600), color:T.sage, letterSpacing:"0.05em",
                          textDecoration:"none", borderBottom:`1px solid ${T.sage}50`,
                          paddingBottom:1, transition:"color 0.15s, border-color 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.color=T.pine; e.currentTarget.style.borderColor=T.pine; }}
                          onMouseLeave={e => { e.currentTarget.style.color=T.sage; e.currentTarget.style.borderColor=`${T.sage}50`; }}>
                          {exp.affiliateLabel} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <ShowMoreToggle expanded={showExp} onToggle={() => setShowExp(!showExp)} />
            </section>

            {/* 08 — CIERRE */}
            <section style={{ marginBottom:0, scrollMarginTop:64 }}>
              <div style={{
                background:T.pine,
                borderRadius:RADIUS+2,
                padding:"48px 44px 44px",
                position:"relative",
                overflow:"hidden",
              }}>
                {/* Decorative coral stroke */}
                <div style={{ width:32, height:2, background:T.coral, marginBottom:28, opacity:0.85 }} />
                <blockquote style={{
                  ...df("clamp(18px,2.4vw,24px)",400,"normal"),
                  color:T.sand, lineHeight:1.75,
                  margin:"0 0 24px", maxWidth:540,
                }}>
                  "{guide.closingNote}"
                </blockquote>
                <Label color={`${T.sage}`} style={{ opacity:0.7 }}>{guide.closingSignature}</Label>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position:"sticky", top:64, alignSelf:"flex-start", paddingBottom:48 }}>
            <GuideSidebar guide={guide} onPlan={() => { if (typeof window !== "undefined") window.location.href = "/es/planificador?destination=" + encodeURIComponent(guide.city) }} />
          </div>
        </div>

        <div style={{ height:96 }} />
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
