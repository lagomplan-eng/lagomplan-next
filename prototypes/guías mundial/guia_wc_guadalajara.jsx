"use client";

import { useState, useEffect } from "react";

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
const CITY_ACCENT = "#8B2635";
const SECTION_ALT_BG = "#F4F0EB";

const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>
    {children}
  </span>
);

const GDL = {
  id:"gdl",
  city:"Guadalajara",
  country:"México",
  state:"Jalisco",
  flag:"🇲🇽",
  accent: CITY_ACCENT,

  tags:["Fútbol","Gastronomía","Cultura","Sede co-anfitriona"],

  stadium:{ name:"Estadio Akron", capacity:"~48,000", area:"Zapopan — poniente de la ciudad" },

  headline:"Aquí no se pregunta de qué equipo eres. Se nota antes de que abras la boca.",
  description:"Aquí no se pregunta de qué equipo eres — se nota antes de que abras la boca. Guadalajara llega al Mundial con cuatro partidos de fase de grupos, incluyendo México vs. Corea del Sur el 18 de junio y la joya táctica del calendario: Uruguay vs. España. El Estadio Akron fue construido para el fútbol. La ciudad, también.",

  scores:[
    { label:"Ambiente",     value:4 },
    { label:"Fútbol local", value:5 },
    { label:"Gastronomía",  value:4 },
    { label:"Transporte",   value:4 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:4 },
  ],

  matches:[
    {
      id:"m1", date:"11 Jun", day:"Jue", time:"21:00 CT",
      teams:[{name:"Corea del Sur",flag:"🇰🇷"},{name:"Rep. Checa",flag:"🇨🇿"}],
      stadium:"Estadio Akron", tag:"Grupo A — apertura de la sede", highlight:false,
    },
    {
      id:"m2", date:"18 Jun", day:"Jue", time:"20:00 CT",
      teams:[{name:"México",flag:"🇲🇽"},{name:"Corea del Sur",flag:"🇰🇷"}],
      stadium:"Estadio Akron", tag:"Grupo A — el partido más esperado de la sede", highlight:true,
    },
    {
      id:"m3", date:"23 Jun", day:"Mar", time:"21:00 CT",
      teams:[{name:"Colombia",flag:"🇨🇴"},{name:"Rep. Dem. del Congo",flag:"🇨🇩"}],
      stadium:"Estadio Akron", tag:"Grupo K", highlight:false,
    },
    {
      id:"m4", date:"26 Jun", day:"Vie", time:"19:00 CT",
      teams:[{name:"Uruguay",flag:"🇺🇾"},{name:"España",flag:"🇪🇸"}],
      stadium:"Estadio Akron", tag:"Grupo H — la joya táctica del calendario", highlight:true,
    },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",        value:"Estadio Guadalajara (Estadio Akron)" },
      { label:"Aforo",               value:"~48,000 — configuración FIFA. Construido específicamente para el fútbol, sin pista atlética." },
      { label:"Techo",               value:"Sin techo — estadio abierto" },
      { label:"Clima (jun–jul)",     value:"25–29°C días · 15–17°C noches · Temporada de lluvias — chubascos breves por las tardes, mañanas soleadas" },
      { label:"Partidos",            value:"4 confirmados — exclusivamente fase de grupos. No habrá partidos de eliminación directa en esta sede." },
      { label:"Aeropuerto principal",value:"GDL — Aeropuerto Internacional Miguel Hidalgo y Costilla, a ~16 km del centro. ~30 minutos al estadio en Uber o taxi." },
      { label:"Visa",                value:"México no requiere visa para la mayoría de países latinoamericanos ni para muchos países europeos. Verificar en embajada o consulado antes de volar." },
    ],
    body:"Guadalajara no es CDMX ni Monterrey. Es la ciudad donde el fútbol se practica como filosofía antes de que los turistas lleguen a verlo. Dos clubes de Liga MX — Chivas y Atlas — convierten el Estadio Akron en campo de batalla cada fin de semana, y el 18 de junio de 2026 lo convierten en el epicentro del sueño mexicano de avanzar. Cuatro partidos de fase de grupos, incluyendo la joya táctica del calendario: Uruguay vs. España el 26 de junio. Esta sede no tiene rondas de eliminación. Lo que tiene es cuatro partidos que ninguna otra ciudad del torneo puede superar en densidad de interés. Calendario completo: 🇰🇷🇨🇿 Jue 11 Jun · 21:00 CT: Corea del Sur vs. República Checa (Grupo A — apertura de la sede); 🇲🇽🇰🇷 Jue 18 Jun · 20:00 CT: México vs. Corea del Sur (Grupo A — el partido más esperado de la sede); 🇨🇴🇨🇩 Mar 23 Jun · 21:00 CT: Colombia vs. Rep. Democrática del Congo (Grupo K); 🇺🇾🇪🇸 Vie 26 Jun · 19:00 CT: Uruguay vs. España (Grupo H — la joya táctica del calendario).",
    lagomNote:"El 18 de junio (México vs. Corea del Sur) y el 26 de junio (Uruguay vs. España) son las fechas críticas de esta sede. El primer partido define el ánimo de toda la semana en Guadalajara. El segundo es el partido tácticamente más interesante de la fase de grupos del torneo.",
  },

  vibe:{
    body:"La ciudad que tiene a México vs. Corea del Sur el 18 de junio no necesita mucho más para posicionarse. El Estadio Akron se convertirá ese día en la barricada más ruidosa del Grupo A — y el resto de la ciudad lo celebrará sin boleto. Dos clubes de Liga MX (Chivas y Atlas), un estadio construido específicamente para el fútbol y una afición que define su identidad cultural en relación directa con el balón. Los tapatíos no 'ven' fútbol — lo practican como filosofía. La gastronomía suma: la cuna de la torta ahogada, la birria y el tejuino. Una cocina regional que no necesita importar influencias para ser relevante.",
    zones:[
      {
        name:"FIFA Fan Festival™ @ Plaza Liberación",
        type:"Fan Fest oficial",
        typeColor:T.coral,
        desc:"El Fan Fest se instala en la Plaza Liberación del Centro Histórico con pantallas gigantes y cartel confirmado: Maná, Carlos Santana, el Potrillo Fernández y el Mariachi Vargas de Tecalitlán. Espacios satélite en Zapopan (Parque Rojo y Plaza Las Américas). Acceso por BRT al centro histórico.",
        tag:"Sin boleto OK",
      },
      {
        name:"Glorieta de la Minerva",
        type:"Punto de reunión",
        typeColor:T.fjord,
        desc:"El monumento más simbólico de la ciudad es el punto de reunión orgánico de cualquier celebración masiva en Guadalajara. Confirmado como punto satélite de transmisiones y posible escenario de palomazo musical improvisado. Para el 18 de junio, la Minerva va a ser el epicentro que no requiere convocatoria oficial.",
        tag:"Icónico",
      },
      {
        name:"Estadio Jalisco (Zona Huentitán)",
        type:"Transmisión histórica",
        typeColor:T.pine,
        desc:"La casa histórica del fútbol en Guadalajara — donde jugó El Tri en 1970 y 1986 — puede habilitar sus exteriores para transmisiones públicas durante el torneo. Ver un partido de la selección en los alrededores del Jalisco tiene más historia que cualquier plaza de nueva construcción.",
        tag:"Histórico",
      },
      {
        name:"Parque Rojo (Zapopan)",
        type:"Zona satélite",
        typeColor:T.sage,
        desc:"Espacio verde al poniente de la ciudad, cerca del Estadio Akron, confirmado como zona satélite de transmisiones por el gobierno de Jalisco. Para el fan que quiere ambiente mundialista sin la densidad del centro histórico — y que ya tiene entrada para el partido del día siguiente.",
        tag:"Zapopan",
      },
      {
        name:"Bar Américas (Americana)",
        type:"Bar-cantina",
        typeColor:"#1A3A5C",
        desc:"El punto de reunión de los aficionados al fútbol europeo en Guadalajara. Premier League los domingos, Champions los miércoles y Mundial las 24 horas durante junio. Sistema de sonido de estadio activado en partidos relevantes. La comida de cantina — ahogadas, birria, botanas — funciona igual de bien que las pantallas.",
        tag:"Fútbol europeo",
      },
    ],
    lagomNote:"Para el 18 de junio (México vs. Corea del Sur, partido más esperado de la sede) y el 26 de junio (Uruguay vs. España), la Glorieta de la Minerva y la Plaza Liberación se llenan horas antes del inicio. El BRT hacia el estadio opera con carril confinado — la única ruta que no se detiene por el tráfico de partido.",
  },

  neighborhoods:[
    {
      name:"Providencia / Americana",
      vibe:"Base recomendada. Providencia es el barrio donde vive la clase creativa de Guadalajara: restaurantes con criterio, bares bien curados y arquitectura que mezcla colonial tardío con modernismo de los 60. La Americana está contigua con más opciones de hospedaje. Ambos conectan al centro en menos de 20 minutos por BRT. Distancia al estadio: 20–35 minutos en Uber.",
      best_for:"Fan WC",
      walk_to_stadium:"20–35 min en Uber o BRT + Uber",
      lagomNote:null,
    },
    {
      name:"Zapopan Centro",
      vibe:"Opción por cercanía. Hoteles y restaurantes decentes con 15 minutos al estadio en transporte normal. Combina bien con una visita al Santuario de Zapopan — uno de los puntos religiosos más importantes del estado.",
      best_for:"Logística",
      walk_to_stadium:"~15 min al estadio",
      lagomNote:null,
    },
    {
      name:"Tlaquepaque",
      vibe:"Perfecto para una tarde, no como base. Precioso para artesanías y galerías, pero logísticamente alejado tanto del estadio como del centro. Plan de día libre ideal — base de operaciones mundialista, no.",
      best_for:"Excursión",
      walk_to_stadium:"30–45 min — no recomendado como base",
      lagomNote:null,
    },
  ],

  stays:[
    {
      name:"Hotel Demetria",
      area:"Providencia",
      price:"$$$",
      priceCAD:"Precio estimado en periodo mundialista: $150–250 USD/noche",
      tags:["Boutique","Cocina jaliscience","Parque Metropolitano"],
      note:"Dieciséis habitaciones, restaurante con cocina jaliscience seria y una estética que evita todos los clichés del boutique latinoamericano. A cuatro cuadras del Parque Metropolitano y con acceso rápido al BRT.",
      best_for:"Hotel boutique",
      url:"",
    },
    {
      name:"La Villa Hostel",
      area:"Americana",
      price:"$",
      priceCAD:"Precio estimado en periodo mundialista: $18–45 USD/noche según tipo de habitación",
      tags:["Presupuesto","Habitaciones privadas","Cocina comunitaria"],
      note:"Hostal de gestión independiente con buen ambiente internacional, habitaciones compartidas y privadas, y cocina comunitaria. Una de las opciones más honestas de la ciudad para el viajero con presupuesto ajustado.",
      best_for:"Presupuesto",
      url:"",
    },
    {
      name:"Hyatt Regency Guadalajara",
      area:"López Mateos / Minerva",
      price:"$$$$",
      priceCAD:"Precio estimado en periodo mundialista: $280–480 USD/noche",
      tags:["Cadena internacional","BRT cercano","Minerva"],
      note:"En el corredor financiero de la ciudad, con acceso fácil al BRT y a la red de restaurantes de Zapopan. Infraestructura completa de cadena internacional — a precios que, comparados con CDMX en periodo mundialista, se sienten casi razonables.",
      best_for:"Lujo",
      url:"",
    },
  ],

  logistics:{
    transport:[
      {
        icon:"✈",
        title:"Llegar a Guadalajara — GDL",
        text:"GDL — Aeropuerto Internacional Miguel Hidalgo y Costilla está a ~16 km del centro de Guadalajara. Aproximadamente 30 minutos al estadio en Uber o taxi ($200–350 MXN). No existe conexión directa de Metro entre el aeropuerto y el estadio — el BRT es la opción preferible desde el centro.",
      },
      {
        icon:"🚌",
        title:"Ruta maestra al estadio — BRT Mi Macro Periférico",
        text:"El BRT Mi Macro Periférico tiene una estación llamada Estadio Chivas a pocos metros del Estadio Akron. Opera en carril confinado — el tráfico de partido no lo afecta. Desde Providencia o el centro, el recorrido toma entre 25 y 40 minutos. Tarifa: ~$9 MXN. Es la opción más eficiente disponible para esta sede.",
      },
      {
        icon:"🏟",
        title:"Al estadio el día del partido",
        text:"BRT Mi Macro Periférico → Estación Estadio Chivas. Desde Providencia: ~30 minutos. Desde Centro Histórico: ~40 minutos. Alternativa: Uber en días sin partido de México (~20–30 min). En el 18 de junio, solo BRT — el corredor de Avenida Vallarta hacia Zapopan concentra todo el tráfico de la ciudad.",
      },
      {
        icon:"⚠️",
        title:"Error crítico — no vayas en auto el 18 de junio",
        text:"El corredor de Avenida Vallarta hacia Zapopan concentra todo el tráfico de Guadalajara el día de México vs. Corea del Sur. Quien llega en auto, llega tarde o no llega. El BRT tiene carril confinado y no se detiene por el tráfico general — esta diferencia importa más que cualquier otra en esta sede.",
        isWarning:true,
      },
    ],
    timings:[
      { label:"Desde Providencia en BRT",                  value:"~30 min" },
      { label:"Desde Centro Histórico en BRT",             value:"~40 min" },
      { label:"Desde GDL (aeropuerto) en Uber al estadio", value:"~35 min" },
      { label:"Uber desde Providencia (día normal)",       value:"20–30 min" },
      { label:"Uber desde Providencia (día de partido)",   value:"35–50 min — calcula margen" },
    ],
    matchDayCronologia:{
      matchName:"18 Jun · México vs. Corea del Sur · 20:00 CT",
      steps:[
        { time:"H-4:00", text:"El 18 de junio Guadalajara entera se detiene para este partido. Abastécete temprano — todo cierra o se llena antes de lo esperado." },
        { time:"H-3:00", text:"Almuerza. Los restaurantes cerca del estadio tendrán cola desde horas antes." },
        { time:"H-2:00", text:"Toma el BRT desde Providencia o tu punto de referencia hacia la Estación Estadio Chivas." },
        { time:"H-1:30", text:"Llegada al estadio. Las puertas abren 90 minutos antes del partido." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo en el móvil — sin versión en papel." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:30", text:"Sal por la ruta opuesta a tu entrada. El BRT opera dirección centro desde la misma estación Estadio Chivas." },
      ],
    },
    timing:"El Estadio Akron está en Zapopan, accesible por BRT pero sin metro directo. La buena noticia: Guadalajara no tiene el caos de tráfico de CDMX ni el calor extremo de Monterrey. El BRT con carril confinado es la instrucción más importante de esta guía para días de partido.",
    cost:"La mejor relación calidad-precio entre las tres sedes mexicanas. No barata, pero razonable para los estándares de un torneo de esta magnitud. El Mercado Corona, la torta ahogada y la birria con 16 especias son razones suficientes para no comer en el estadio.",
  },

  vibeCards:[
    {
      title:"FIFA Fan Festival™ @ Plaza Liberación",
      type:"Fan fest oficial",
      typeColor:T.coral,
      desc:"El Fan Fest se instala en la Plaza Liberación del Centro Histórico con pantallas gigantes y cartel confirmado: Maná, Carlos Santana, el Potrillo Fernández y el Mariachi Vargas de Tecalitlán. Espacios satélite en Zapopan (Parque Rojo y Plaza Las Américas). Acceso por BRT.",
      tag:"Sin boleto OK",
    },
    {
      title:"Glorieta de la Minerva",
      type:"Punto de reunión",
      typeColor:T.fjord,
      desc:"El monumento más simbólico de Guadalajara es el epicentro de cualquier celebración masiva. Confirmado como punto satélite de transmisiones mundialistas. Para el 18 de junio (México), la Minerva va a llenarse sin que nadie la convoque formalmente.",
      tag:"Icónico",
    },
    {
      title:"Estadio Jalisco (Zona Huentitán)",
      type:"Transmisión histórica",
      typeColor:T.pine,
      desc:"La casa histórica del fútbol en Guadalajara — donde jugó El Tri en el 70 y el 86 — puede habilitar sus exteriores para transmisiones públicas. Ver el partido de México en los alrededores del Jalisco tiene más historia que cualquier pantalla de nueva instalación.",
      tag:"Historia viva",
    },
    {
      title:"Parque Rojo (Zapopan)",
      type:"Zona satélite",
      typeColor:T.sage,
      desc:"Espacio verde confirmado como zona satélite de transmisiones por el gobierno de Jalisco. Cerca del Estadio Akron, para el fan que quiere ambiente mundialista sin la densidad del centro histórico.",
      tag:"Zapopan",
    },
    {
      title:"Bar Américas (Americana)",
      type:"Bar-cantina",
      typeColor:"#1A3A5C",
      desc:"El punto de reunión de los aficionados al fútbol europeo en Guadalajara. Premier League, Champions y Mundial 24 horas. Sistema de sonido de estadio en partidos relevantes. La comida de cantina — torta ahogada, birria, botanas — funciona tan bien como las pantallas.",
      tag:"Fútbol serio",
    },
    {
      title:"Trago Cuervo (Zapopan)",
      type:"Cervecería artesanal",
      typeColor:"#2D6B4A",
      desc:"Cervecería artesanal jalisciense a pocos minutos del Estadio Akron. Terraza exterior amplia, pantallas bien ubicadas y más de veinte cervezas locales. Para el día de Uruguay vs. España o México vs. Corea, llegar aquí antes del partido — o después — es el plan más sensato del corredor de Zapopan.",
      tag:"Pre-estadio",
    },
  ],

  food:[
    { dish:"Bar Américas",          where:"Americana — torta ahogada + cerveza artesanal de barril; cantina de fútbol, ruidosa en los momentos correctos", price:"$$", type:"Pre-partido" },
    { dish:"La Fonda de San Miguel", where:"Centro Histórico — birria de res con 16 especias + tortillas hechas a mano; patio colonial, pantalla funcional", price:"$$", type:"Jaliscience" },
    { dish:"Trago Cuervo",          where:"Zapopan — IPA de temporada + taquitos de canasta; cervecería artesanal cerca del estadio", price:"$$", type:"Pre-estadio" },
    { dish:"Mercado Corona",        where:"Centro Histórico — el mercado gastronómico de referencia de la ciudad; birria, tejuino, jugos frescos", price:"$",  type:"Mercado" },
    { dish:"Torta ahogada callejera", where:"Cualquier puesto en Providencia o la Americana — la torta más emblemática de México bañada en salsa de chile de árbol", price:"$",  type:"Imperdible" },
  ],

  experiences:[
    {
      title:"Tequila — excursión de día",
      duration:"Día completo",
      desc:"El pueblo de Tequila está a 65 kilómetros al noreste de Guadalajara, accesible en autobús desde la Central de Autobuses en menos de 90 minutos, o en el Tequila Express los fines de semana (incluye visita a destilería y degustación). Las destilerías Herradura y Casa Cuervo ofrecen tours con reserva previa; la destilería Fortaleza es la opción artesanal más recomendada para quien quiere entender el proceso antes de beber. Regreso antes de las 7pm deja tiempo para un partido nocturno en la ciudad.",
      type:"Excursión",
      affiliateLink:"AFFILIATE_LINK_GDL_TEQUILA",
      affiliateLabel:"Ver tours a Tequila",
    },
    {
      title:"Tlaquepaque + Tonalá",
      duration:"Día completo",
      desc:"Dos municipios conurbados con identidades distintas: Tlaquepaque es el barrio de galerías, cerámica talavera y el mejor Mercado de Arte Popular del estado; Tonalá es el mayoreo, donde los artesanos venden sin intermediario y los precios son considerablemente más bajos. Para el viajero con poco tiempo: Tlaquepaque en la mañana, Tonalá en la tarde. Ambos a 20 minutos del centro en Uber.",
      type:"Cultural",
      affiliateLink:"AFFILIATE_LINK_GDL_TLAQUEPAQUE",
      affiliateLabel:"Tour de artesanías en Tlaquepaque",
    },
    {
      title:"Lago Chapala / Ajijic",
      duration:"Día completo",
      desc:"El lago Chapala, a 45 kilómetros al sur, es el más grande de México. El pueblo de Ajijic en la ribera norte tiene restaurantes con vistas al agua que funcionan como antídoto perfecto al ritmo mundialista. Autobús directo desde la Central Camionera Sur en 55 minutos. Ideal como día de descanso entre partidos — especialmente entre el 18 y el 23 de junio.",
      type:"Natural",
      affiliateLink:"AFFILIATE_LINK_GDL_CHAPALA",
      affiliateLabel:"Tours al lago Chapala",
    },
  ],

  itinerary:[
    {
      day:1,
      title:"Llegada y primer pulso",
      subtitle:"Providencia · Americana · Centro Histórico",
      isMatchDay:false,
      steps:[
        { time:"Llegada",   text:"Uber desde GDL al centro (~$200–300 MXN). Guadalajara tiene lógica de barrios clara — elige bien la base y el resto de la semana se organiza solo." },
        { time:"Tarde",     text:"Camina por Providencia y la Americana. La Avenida Chapultepec tiene la mayor concentración de bares con criterio de la ciudad." },
        { time:"Atardecer", text:"Glorieta de la Minerva. El monumento más fotogénico de la ciudad a la hora dorada." },
        { time:"Noche",     text:"Cena en Providencia. Guadalajara tiene una escena gastronómica que no necesita compararse con CDMX para ser buena." },
      ],
    },
    {
      day:2,
      title:"Día de partido — México vs. Corea del Sur",
      subtitle:"Estadio Akron · Jue 18 Jun · 20:00 CT",
      isMatchDay:true,
      matchRef:"m2",
      steps:[
        { time:"H-4:00", text:"Guadalajara entera se detiene para este partido. Abastécete temprano — todo se llena antes de lo esperado." },
        { time:"H-3:00", text:"Almuerza en Providencia. La birria de res del desayuno sigue siendo el mejor pre-partido de cualquier sede mexicana." },
        { time:"H-2:00", text:"BRT Mi Macro Periférico desde tu estación más cercana hacia Estación Estadio Chivas." },
        { time:"H-1:30", text:"Llegada al Estadio Akron. Puertas abiertas. La afición mexicana llega desde temprano — el estadio va a estar ruidoso mucho antes del calentamiento." },
        { time:"20:00",  text:"México vs. Corea del Sur. El estadio más futbolero de México en el partido que el país entero ve más de cerca." },
      ],
    },
    {
      day:3,
      title:"Excursión a Tequila",
      subtitle:"65 km · Autobús desde Central · Día completo",
      isMatchDay:false,
      steps:[
        { time:"Mañana",   text:"Autobús desde Central de Autobuses hacia Tequila (~90 min, ~$80 MXN). Llega temprano para evitar el calor del mediodía." },
        { time:"Mediodía", text:"Tour en destilería Fortaleza, Herradura o Casa Cuervo — reserva con anticipación. El proceso del agave al tequila en menos de 2 horas." },
        { time:"Tarde",    text:"El pueblo tiene una sola calle principal. Comida local, mezcal artesanal, vista al volcán Tequila." },
        { time:"Regreso",  text:"Autobús de regreso antes de las 7pm — deja tiempo para el partido nocturno en la ciudad si hay uno." },
      ],
    },
    {
      day:4,
      title:"Día de partido — Uruguay vs. España",
      subtitle:"Estadio Akron · Vie 26 Jun · 19:00 CT",
      isMatchDay:true,
      matchRef:"m4",
      steps:[
        { time:"H-3:00", text:"Tlaquepaque en la mañana si tienes tiempo. Regreso a la base antes del mediodía." },
        { time:"H-2:00", text:"BRT desde Providencia o centro hacia Estación Estadio Chivas." },
        { time:"H-1:30", text:"Llegada al estadio. Uruguay vs. España es el partido más tácticamente interesante de la fase de grupos en cualquier sede del torneo." },
        { time:"19:00",  text:"Uruguay vs. España. Dos estilos completamente opuestos en un estadio que sabe lo que es un partido exigente." },
        { time:"Post",   text:"Regreso por BRT o Uber. Trago Cuervo en Zapopan para el post-partido si quieres alargar la noche." },
      ],
    },
    {
      day:5,
      title:"Lago Chapala y cierre",
      subtitle:"Ajijic · Lago más grande de México",
      isMatchDay:false,
      steps:[
        { time:"Mañana",   text:"Autobús desde Central Camionera Sur hacia Ajijic, ribera norte del lago Chapala (~55 min)." },
        { time:"Mediodía", text:"Almuerzo con vistas al lago. El ritmo baja — exactamente lo que se necesita después de la semana mundialista." },
        { time:"Tarde",    text:"El pueblo de Ajijic tiene galerías, artesanía local y un malecón que explica por qué hay tanta comunidad extranjera viviendo aquí." },
        { time:"Regreso",  text:"De vuelta a Guadalajara antes del atardecer. Última cena en la Americana o Providencia para cerrar el capítulo." },
      ],
    },
  ],

  lagomTips:[
    "El 18 de junio (México vs. Corea del Sur) es la fecha de mayor demanda de la sede. Reserva alojamiento con meses de anticipación — las opciones en Zapopan y Providencia se agotan primero. El 26 de junio (Uruguay vs. España) tiene alta demanda entre aficionados al fútbol de criterio.",
    "La ruta correcta al estadio es el BRT Mi Macro Periférico hasta Estación Estadio Chivas. El carril confinado hace que el tráfico de partido no lo afecte — esta diferencia importa más que cualquier otra en esta sede.",
    "No vayas en auto al estadio el 18 de junio. El corredor de Avenida Vallarta hacia Zapopan concentra todo el tráfico de la ciudad. Quien llega en auto, llega tarde o no llega.",
    "Guadalajara tiene la mejor relación calidad-precio entre las tres sedes mexicanas. El Mercado Corona, la torta ahogada y la birria con 16 especias son razones suficientes para no comer en el estadio.",
  ],

  matchDayChecklist:[
    "Boleto digital del partido — app FIFA (sin versión en papel)",
    "Efectivo MXN o tarjeta para el BRT (~$9 MXN)",
    "Ruta: BRT Mi Macro Periférico → Estación Estadio Chivas",
    "Almuerza antes de salir — los restaurantes cerca del estadio tienen cola desde horas antes",
    "Llegada al estadio 90 min antes — puertas abren H-1:30",
    "Ropa ligera con capa — 25–29°C días, 15–17°C noches, posibles chubascos",
    "Reserva de hotel confirmada para 18 jun y 26 jun",
    "Efectivo MXN para botanas y transporte",
  ],

  didYouKnow:"El Estadio Akron fue diseñado y construido exclusivamente para el fútbol — sin pista atlética — con las mejores líneas de visión de cualquier estadio en México. Es la casa de Chivas, el único equipo de Liga MX que tiene estatutariamente prohibido contratar jugadores extranjeros. En el torneo, alberga cuatro partidos de fase de grupos sin llegar a la eliminación directa.",

  closingNote:"Guadalajara llega al Mundial con algo que ninguna otra sede mexicana puede replicar: el partido que el país entero va a ver más de cerca. El 18 de junio, México y Corea del Sur se miden en el Estadio Akron. La Guadalajara que sale a celebrar — o a consolar — esa noche es una ciudad que lleva el fútbol en el tejido de su identidad social desde décadas antes de que los mapas de turismo la descubrieran. LagomPlan te da el criterio para que la semana sea más que un partido. El resto lo pone la ciudad — y lo pone bien.",
  closingSignature:"Lagomplan · Guía de campo · Guadalajara · Mundial 2026",
  plannerCTA:"Generar mi viaje a Guadalajara",
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATION — Guadalajara
// ─────────────────────────────────────────────────────────────────────────────
const GdlIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#EDE8DC" rx={RADIUS} />
    <rect x="0" y="0" width="280" height="80" fill="#F5EEE5" opacity="0.5" />
    {/* Cathedral towers */}
    <rect x="78" y="42" width="9" height="48" fill="#8B2635" opacity="0.28" rx={1} />
    <polygon points="82.5,42 77,52 88,52" fill="#8B2635" opacity="0.35" />
    <rect x="94" y="42" width="9" height="48" fill="#8B2635" opacity="0.28" rx={1} />
    <polygon points="98.5,42 93,52 104,52" fill="#8B2635" opacity="0.35" />
    {/* Cathedral body */}
    <rect x="70" y="68" width="51" height="22" fill="#8B2635" opacity="0.14" rx={1} />
    {/* City buildings */}
    <rect x="10" y="70" width="6"  height="20" fill="#8B2635" opacity="0.22" rx={1} />
    <rect x="20" y="62" width="8"  height="28" fill="#8B2635" opacity="0.26" rx={1} />
    <rect x="32" y="66" width="5"  height="24" fill="#8B2635" opacity="0.18" rx={1} />
    <rect x="40" y="58" width="10" height="32" fill="#8B2635" opacity="0.22" rx={1} />
    <rect x="54" y="64" width="6"  height="26" fill="#8B2635" opacity="0.16" rx={1} />
    {/* Minerva roundabout */}
    <circle cx="168" cy="85" r="14" fill="none" stroke="#8B2635" strokeWidth="1.2" opacity="0.28" />
    <rect x="166" y="62" width="4" height="23" fill="#8B2635" opacity="0.38" rx={1} />
    <polygon points="168,62 164.5,69 171.5,69" fill="#8B2635" opacity="0.42" />
    {/* Estadio Akron oval */}
    <ellipse cx="222" cy="108" rx="36" ry="13" fill="#8B2635" opacity="0.14" />
    <ellipse cx="222" cy="108" rx="26" ry="9"  fill="#8B2635" opacity="0.10" />
    {/* Agave plant hint */}
    <line x1="245" y1="90" x2="238" y2="80" stroke="#2D6B4A" strokeWidth="1.5" opacity="0.4" />
    <line x1="245" y1="90" x2="252" y2="80" stroke="#2D6B4A" strokeWidth="1.5" opacity="0.4" />
    <line x1="245" y1="90" x2="245" y2="78" stroke="#2D6B4A" strokeWidth="1.5" opacity="0.4" />
    {/* Flag */}
    <text x="258" y="50" fontSize="20" textAnchor="middle">🇲🇽</text>
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
      style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow: isHovered ? "0 4px 16px rgba(28,28,26,0.09), 0 1px 3px rgba(28,28,26,0.05)" : CARD_SHADOW, transition:"box-shadow 0.22s, transform 0.22s", transform: isHovered ? "translateY(-1px)" : "none", cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </div>
  );
};

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
  <div style={{ display:"flex", gap:16, padding:"18px 22px", background:T.sandLight, borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
    <span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.14em", textTransform:"uppercase", flexShrink:0, marginTop:3 }}>Lagom</span>
    <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:0 }}>{children}</p>
  </div>
);

const ShowMoreToggle = ({ expanded, onToggle }) => (
  <button onClick={onToggle} style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:16, background:"transparent", border:`1px solid ${T.sage}55`, borderRadius:40, ...uf(10,600), color:T.sage, cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 14px", transition:"all 0.18s" }}
    onMouseEnter={e => { e.currentTarget.style.background=T.sageLight; e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.color=T.pine; }}
    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`${T.sage}55`; e.currentTarget.style.color=T.sage; }}>
    {expanded ? "Ver menos ↑" : "Ver más ↓"}
  </button>
);

const MatchCard = ({ match, onPlanAround }) => {
  const isTBD = !match.teams[0].flag && !match.teams[1].flag;
  const borderColor = match.highlight ? `${T.matchGold}50` : T.sandDark;
  const accentBar = match.highlight ? T.matchGold : isTBD ? T.sandDark : CITY_ACCENT;
  return (
    <Card style={{ overflow:"hidden", borderColor, opacity: isTBD ? 0.55 : 1 }}>
      <div style={{ height:4, background:accentBar }} />
      <div style={{ padding:"22px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ textAlign:"center", minWidth:48, padding:"8px 12px", background:T.sand, borderRadius:RADIUS-2, border:`1px solid ${T.sandDark}` }}>
              <div style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkFaint }}>{match.day}</div>
              <div style={{ ...df(20,700), color:T.pine, lineHeight:1.1, margin:"2px 0" }}>{match.date.split(" ")[0]}</div>
              <div style={{ ...uf(9,500), color:T.inkFaint }}>{match.date.split(" ")[1]}</div>
            </div>
            <div>
              <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3 }}>{match.stadium}</div>
              <div style={{ ...uf(13,500), color:T.inkMid }}>{match.time} local</div>
            </div>
          </div>
          {match.tag && (
            <span style={{ ...uf(9,700), letterSpacing:"0.08em", textTransform:"uppercase", color: match.highlight ? T.matchGold : CITY_ACCENT, background: match.highlight ? T.matchGoldLight : CITY_ACCENT+"15", border:`1px solid ${match.highlight ? T.matchGold+"50" : CITY_ACCENT+"35"}`, padding:"4px 10px", borderRadius:40, flexShrink:0, maxWidth:160, textAlign:"right" }}>{match.tag}</span>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"18px 0", borderTop:`1px solid ${T.sandDark}`, borderBottom:`1px solid ${T.sandDark}`, marginBottom:18 }}>
          <div style={{ flex:1, textAlign:"right" }}>
            <div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[0].name}</div>
            {match.teams[0].flag && <div style={{ fontSize:26, lineHeight:1 }}>{match.teams[0].flag}</div>}
          </div>
          <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.12em", padding:"6px 14px", background:T.sand, borderRadius:6, border:`1px solid ${T.sandDark}` }}>vs</div>
          <div style={{ flex:1, textAlign:"left" }}>
            <div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[1].name}</div>
            {match.teams[1].flag && <div style={{ fontSize:26, lineHeight:1 }}>{match.teams[1].flag}</div>}
          </div>
        </div>
        {!isTBD && (
          <button onClick={() => onPlanAround && onPlanAround(match)} style={{ width:"100%", padding:"10px", background:"transparent", border:`1px solid ${T.sandDark}`, borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkMid, cursor:"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=CITY_ACCENT; e.currentTarget.style.color=T.pine; e.currentTarget.style.background=T.sageLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=T.sandDark; e.currentTarget.style.color=T.inkMid; e.currentTarget.style.background="transparent"; }}>
            <span style={{ fontSize:12 }}>✦</span> Planear mi viaje alrededor de este partido
          </button>
        )}
      </div>
    </Card>
  );
};

const CollapsibleVibeCard = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <Card hover style={{ overflow:"hidden", display:"flex", flexDirection:"row" }}>
      <div style={{ width:3, flexShrink:0, background:item.typeColor, opacity:0.7 }} />
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:9, flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:item.typeColor }}>{item.type}</span>
          <span style={{ ...uf(9,500), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint }}>{item.tag}</span>
        </div>
        <div style={{ ...df(14,700), color:T.pine, lineHeight:1.25 }}>{item.title}</div>
        <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0, ...(open ? {} : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{item.desc}</p>
        <ShowMoreToggle expanded={open} onToggle={() => setOpen(!open)} />
      </div>
    </Card>
  );
};

const StayCard = ({ stay }) => (
  <Card hover style={{ display:"flex", flexDirection:"column", height:"100%" }}>
    <div style={{ padding:"22px 22px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ ...df(26,700), color:T.pine, letterSpacing:"-0.02em" }}>{stay.price}</span>
        <Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label>
      </div>
      <div style={{ ...df(17,700), color:T.pine, lineHeight:1.2, marginBottom:4 }}>{stay.name}</div>
      <div style={{ ...uf(12,500), color:T.inkFaint, marginBottom:10 }}>{stay.area}</div>
      {stay.priceCAD && <div style={{ ...uf(12,600), color:CITY_ACCENT, marginBottom:14, letterSpacing:"0.02em" }}>{stay.priceCAD}</div>}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
        {stay.tags.map(tag => <span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint, background:T.sand, padding:"3px 8px", borderRadius:5, border:`1px solid ${T.sandDark}` }}>{tag}</span>)}
      </div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"14px 22px", borderTop:`1px solid ${T.sandDark}` }}>
      <a href={stay.url || "#"} target={stay.url ? "_blank" : undefined} rel="noopener noreferrer" style={{ display:"block", textAlign:"center", width:"100%", padding:"11px", borderRadius:RADIUS-2, background: stay.url ? T.pine : T.sandDark, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, textDecoration:"none", transition:"opacity 0.18s", pointerEvents: stay.url ? "auto" : "none", opacity: stay.url ? 1 : 0.45 }}
        onMouseEnter={e => { if (stay.url) e.currentTarget.style.opacity="0.82"; }}
        onMouseLeave={e => { if (stay.url) e.currentTarget.style.opacity="1"; }}>
        Ver opciones →
      </a>
    </div>
  </Card>
);

const FoodCard = ({ item }) => (
  <div style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:CARD_SHADOW, padding:"16px 18px", display:"flex", flexDirection:"column", gap:6 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
      <span style={{ ...uf(13,600), color:T.pine, lineHeight:1.3 }}>{item.dish}</span>
      <span style={{ ...uf(12,500), color:T.inkFaint, flexShrink:0 }}>{item.price}</span>
    </div>
    <p style={{ ...uf(12,400), color:T.inkFaint, lineHeight:1.55, margin:0 }}>{item.where}</p>
    <div style={{ marginTop:4 }}><Label color={T.sage} bg={T.sageLight}>{item.type}</Label></div>
  </div>
);

const LogisticsCard = ({ item }) => (
  <Card style={{ display:"flex", gap:16, padding:"18px 22px", alignItems:"flex-start", borderColor: item.isWarning ? `${T.coral}55` : T.sandDark, background: item.isWarning ? T.coralLight : T.white }}>
    <div style={{ width:40, height:40, flexShrink:0, background:item.isWarning ? T.coral+"20" : T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
      {item.icon}
    </div>
    <div>
      <div style={{ ...uf(13,700), color:item.isWarning ? T.coral : T.pine, marginBottom:6 }}>{item.title}</div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{item.text}</p>
    </div>
  </Card>
);

const GuideSidebar = ({ guide, onPlan }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Card style={{ padding:"22px", background:T.sandLight, borderColor:T.sandDark }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...uf(16, 700), color:T.pine, lineHeight:1.4, marginBottom:16 }}>
          ¿Listo para tu versión del Mundial? Convierte esta guía en un itinerario adaptado a tus tiempos y presupuesto.
        </p>
        <button onClick={onPlan} style={{ width:"100%", padding:"11px 16px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.82"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          {guide.plannerCTA} →
        </button>
      </Card>
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:13 }}>✦</span></div>
          <Label color={T.pine} style={{ fontSize:11 }}>Notas Lagom</Label>
        </div>
        {guide.lagomTips.map((tip, i) => (
          <div key={i} style={{ display:"flex", gap:11, paddingTop:12, paddingBottom:12, borderBottom: i < guide.lagomTips.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:T.sage, flexShrink:0, marginTop:7 }} />
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{tip}</p>
          </div>
        ))}
      </Card>
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.matchGoldLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:13 }}>☑</span></div>
          <Label color={T.pine} style={{ fontSize:11 }}>Checklist día de partido</Label>
        </div>
        {guide.matchDayChecklist.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => ({...p,[i]:!p[i]}))} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderTop: i > 0 ? `1px solid ${T.sandDark}` : "none", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%" }}>
            <div style={{ width:16, height:16, flexShrink:0, marginTop:2, border:`1.5px solid ${checked[i] ? T.sage : T.sandDark}`, borderRadius:4, background:checked[i] ? T.sage : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
              {checked[i] && <span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ ...uf(12,400), color:checked[i] ? T.inkFaint : T.inkMid, lineHeight:1.55, textDecoration:checked[i] ? "line-through" : "none", transition:"all 0.15s" }}>{item}</span>
          </button>
        ))}
      </Card>
      <Card style={{ padding:"20px 22px", background:T.fjordLight, borderColor:`${T.fjord}30` }}>
        <Label color={T.fjord} style={{ marginBottom:10, display:"block" }}>¿Sabías que?</Label>
        <p style={{ ...uf(13,400), color:T.fjord, lineHeight:1.72, margin:0 }}>{guide.didYouKnow}</p>
      </Card>
      <Card style={{ padding:"18px 22px", borderStyle:"dashed", borderColor:T.sandDark }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>✦</span>
          <div>
            <div style={{ ...uf(12,700), color:T.pine, marginBottom:6 }}>Optimizar itinerario con IA</div>
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:"0 0 12px" }}>Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.</p>
            <button onClick={onPlan} style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2, padding:"7px 14px", cursor:"pointer", transition:"all 0.18s" }}
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

const GuideHero = ({ guide }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:56, alignItems:"center", padding:"72px 0 64px", borderBottom:`1px solid rgba(28,28,26,0.08)`, marginBottom:56 }}>
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <span style={{ fontSize:18 }}>{guide.flag}</span>
        <Label color={T.inkFaint}>{guide.country} · {guide.state}</Label>
        <span style={{ color:T.sandDark, fontSize:12 }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.name}</Label>
        <span style={{ color:T.sandDark, fontSize:12 }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.capacity}</Label>
      </div>
      <h1 style={{ ...uf("clamp(44px,5.5vw,72px)", 900), color:T.pine, lineHeight:0.92, letterSpacing:"-0.03em", marginBottom:22 }}>{guide.city}</h1>
      <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, maxWidth:500, marginBottom:32 }}>{guide.description}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
        {guide.tags.map(tag => <span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`, padding:"5px 13px", borderRadius:40 }}>{tag}</span>)}
        <span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}35`, padding:"5px 13px", borderRadius:40 }}>⚽ {guide.matches.length} partidos</span>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:3 }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background: i<=s.value ? T.sage : T.sandDark }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}><GdlIllustration /></div>
  </div>
);

const NAV_ITEMS = [
  {id:"matches",   label:"Partidos"},
  {id:"manifesto", label:"Manifiesto"},
  {id:"stays",     label:"Dónde dormir"},
  {id:"vibe",      label:"Ambiente"},
  {id:"logistics", label:"Logística"},
];

const StickyNav = ({ active, onNavigate, onBack }) => (
  <div style={{ position:"sticky", top:0, zIndex:40, background:`${T.bg}F5`, backdropFilter:"blur(18px)", borderBottom:`1px solid ${T.sandDark}`, height:52, display:"flex", alignItems:"center", padding:"0 40px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none", cursor:"pointer", padding:"0 14px 0 0", marginRight:14, borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em", transition:"color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color=T.pine}
      onMouseLeave={e => e.currentTarget.style.color=T.inkFaint}>← Guías</button>
    <span style={{ ...uf(14, 700), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>Guadalajara</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{ ...uf(10, active===item.id ? 700 : 500), letterSpacing:"0.08em", textTransform:"uppercase", color: active===item.id ? T.pine : T.inkFaint, background:"none", border:"none", padding:"0 13px", height:"100%", cursor:"pointer", borderBottom:`2px solid ${active===item.id ? T.coral : "transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0 }}>{item.label}</button>
    ))}
  </div>
);

const GuideDetail = ({ guide, onBack }) => {
  const [active,        setActive]        = useState("matches");
  const [showManifesto, setShowManifesto] = useState(false);
  const [showVibe,      setShowVibe]      = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [showFood,      setShowFood]      = useState(false);
  const [showExp,       setShowExp]       = useState(false);

  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(item.id); }, { rootMargin:"-30% 0px -65% 0px" });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:"smooth", block:"start" }); };

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <StickyNav active={active} onNavigate={scrollTo} onBack={onBack} />
      <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 40px" }}>
        <GuideHero guide={guide} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:52, alignItems:"flex-start" }}>
          <div>

            {/* 01 — MATCHES */}
            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos"
                subtitle="4 partidos de fase de grupos en el Estadio Akron. México juega el 18 de junio y Uruguay vs. España el 26 — las dos citas imprescindibles de la sede." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {guide.matches.map(match => <MatchCard key={match.id} match={match} onPlanAround={() => {}} />)}
              </div>
            </section>

            {/* 02 — MANIFIESTO */}
            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title="Manifiesto de campo" subtitle="Lo que necesitas saber antes de llegar." />
              <Card style={{ marginBottom:24, overflow:"hidden" }}>
                <div style={{ height:4, background:CITY_ACCENT }} />
                <div style={{ padding:"20px 24px" }}>
                  {guide.manifesto.stadiumInfo.map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:20, padding:"11px 0", borderBottom: i < guide.manifesto.stadiumInfo.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
                      <span style={{ ...uf(11,600), color:T.inkFaint, minWidth:148, flexShrink:0, letterSpacing:"0.05em" }}>{item.label}</span>
                      <span style={{ ...uf(13,500), color:T.ink, lineHeight:1.6 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              {showManifesto && (<><p style={{ ...uf(15,400), color:T.ink, lineHeight:1.9, marginBottom:24, maxWidth:640 }}>{guide.manifesto.body}</p><LagomNote>{guide.manifesto.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showManifesto} onToggle={() => setShowManifesto(!showManifesto)} />
            </section>

            {/* 03 — STAYS */}
            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso" subtitle="Refugios seleccionados para recargar energías entre diseño de autor y confort estratégico." />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>
                    El 18 de junio (México vs. Corea del Sur) es la fecha de mayor demanda. Las opciones en Zapopan y Providencia se agotan meses antes. Si aún no tienes alojamiento, considera Airbnb en <strong>Americana</strong>, <strong>Chapalita</strong> o el corredor <strong>López Mateos</strong>.
                  </p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay => <StayCard key={stay.name} stay={stay} />)}
              </div>
            </section>

            {/* 04 — VIBE */}
            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente" subtitle="Fan Fest en la Plaza Liberación, la Glorieta de la Minerva y las cantinas donde el fútbol se practica como filosofía." />
              <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe ? 28 : 0, maxWidth:640, ...(showVibe ? {} : { display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>
                {guide.vibe.body}
              </p>
              {showVibe && (<><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>{guide.vibeCards.map(item => <CollapsibleVibeCard key={item.title} item={item} />)}</div><LagomNote>{guide.vibe.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} />
            </section>

            {/* 05 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio" subtitle="BRT Mi Macro Periférico → Estación Estadio Chivas. La única instrucción que importa." />
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom: showLogistics ? 24 : 0 }}>
                {guide.logistics.transport.slice(0, 2).map((item, i) => <LogisticsCard key={i} item={item} />)}
              </div>
              {showLogistics && (<>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                  {guide.logistics.transport.slice(2).map((item, i) => <LogisticsCard key={i} item={item} />)}
                </div>
                <Card style={{ marginBottom:24 }}>
                  <div style={{ padding:"18px 24px" }}>
                    <div style={{ ...uf(10,700), letterSpacing:"0.16em", textTransform:"uppercase", color:T.inkFaint, marginBottom:14 }}>Tiempos reales de desplazamiento</div>
                    {guide.logistics.timings.map((t, i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom: i < guide.logistics.timings.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
                        <span style={{ ...uf(13,400), color:T.inkMid }}>{t.label}</span>
                        <span style={{ ...uf(13,700), color:T.pine }}>{t.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card style={{ overflow:"hidden", marginBottom:16 }}>
                  <div style={{ height:4, background:T.matchGold }} />
                  <div style={{ padding:"20px 24px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                      <span style={{ fontSize:16 }}>⚽</span>
                      <div style={{ ...uf(11,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.matchGold }}>Cronología recomendada</div>
                      <span style={{ ...uf(13,600), color:T.ink }}>{guide.logistics.matchDayCronologia.matchName}</span>
                    </div>
                    {guide.logistics.matchDayCronologia.steps.map((step, i) => (
                      <div key={i} style={{ display:"flex", gap:16, paddingTop: i>0 ? 14 : 0, paddingBottom: i<guide.logistics.matchDayCronologia.steps.length-1 ? 14 : 0, borderBottom: i<guide.logistics.matchDayCronologia.steps.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
                        <span style={{ ...uf(10,700), color:T.matchGold, minWidth:46, flexShrink:0, letterSpacing:"0.04em", paddingTop:2 }}>{step.time}</span>
                        <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{step.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <div style={{ display:"flex", gap:12, padding:"14px 18px", background:T.sandLight, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS }}>
                  <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{guide.logistics.timing}</p>
                </div>
              </>)}
              <ShowMoreToggle expanded={showLogistics} onToggle={() => setShowLogistics(!showLogistics)} />
            </section>

            {/* 06 — FOOD */}
            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista" subtitle="La cuna de la torta ahogada, la birria y el tejuino. Una cocina regional que no necesita importar influencias para ser relevante." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                {guide.food.slice(0, 3).map((f, i) => <FoodCard key={i} item={f} />)}
                {showFood && guide.food.slice(3).map((f, i) => <FoodCard key={i+3} item={f} />)}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} />
            </section>

            {/* 07 — EXPERIENCES */}
            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio" subtitle="El entretiempo ideal para descubrir que Jalisco tiene más que estadios y mariachis — aunque ambos también valen." />
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {guide.experiences.slice(0, 1).map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>{String(i+1).padStart(2,"0")}</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                      {exp.affiliateLink && (
                        <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"inline-flex", alignItems:"center", gap:6, ...uf(11,600), color:T.sage, letterSpacing:"0.05em", textDecoration:"none", borderBottom:`1px solid ${T.sage}50`, paddingBottom:1, transition:"color 0.15s, border-color 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.color=T.pine; e.currentTarget.style.borderColor=T.pine; }}
                          onMouseLeave={e => { e.currentTarget.style.color=T.sage; e.currentTarget.style.borderColor=`${T.sage}50`; }}>
                          {exp.affiliateLabel} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {showExp && guide.experiences.slice(1).map((exp, i) => (
                  <div key={i+1} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>{String(i+2).padStart(2,"0")}</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                      {exp.affiliateLink && (
                        <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"inline-flex", alignItems:"center", gap:6, ...uf(11,600), color:T.sage, letterSpacing:"0.05em", textDecoration:"none", borderBottom:`1px solid ${T.sage}50`, paddingBottom:1, transition:"color 0.15s, border-color 0.15s" }}
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
            <section style={{ marginBottom:0 }}>
              <div style={{ background:T.pine, borderRadius:RADIUS+2, padding:"48px 44px 44px", overflow:"hidden" }}>
                <div style={{ width:32, height:2, background:T.coral, marginBottom:28, opacity:0.85 }} />
                <blockquote style={{ ...df("clamp(18px,2.4vw,24px)",400,"italic"), color:T.sand, lineHeight:1.75, margin:"0 0 24px", maxWidth:540 }}>
                  "{guide.closingNote}"
                </blockquote>
                <Label color={`${T.sage}`} style={{ opacity:0.7 }}>{guide.closingSignature}</Label>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position:"sticky", top:64, alignSelf:"flex-start", paddingBottom:48 }}>
            <GuideSidebar guide={guide} onPlan={() => alert("Planificador: Guadalajara")} />
          </div>
        </div>
        <div style={{ height:96 }} />
      </div>
    </div>
  );
};

export default function App() {
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
      <GuideDetail guide={GDL} onBack={() => {}} />
    </>
  );
}
