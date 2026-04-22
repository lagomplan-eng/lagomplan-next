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
const CITY_ACCENT = "#1A6B5A";
const SECTION_ALT_BG = "#F4F0EB";

const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>
    {children}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// CDMX GUIDE DATA
// ─────────────────────────────────────────────────────────────────────────────
const CDMX = {
  id:"cdmx",
  city:"Ciudad de México",
  country:"México",
  state:"CDMX",
  flag:"🇲🇽",
  accent: CITY_ACCENT,

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
    {
      id:"m1", date:"11 Jun", day:"Jue", time:"14:00 CT",
      teams:[{name:"México",flag:"🇲🇽"},{name:"Sudáfrica",flag:"🇿🇦"}],
      stadium:"Estadio Azteca", tag:"Partido Inaugural — primer Mundial en el Azteca desde 1986", highlight:true,
    },
    {
      id:"m2", date:"17 Jun", day:"Mié", time:"21:00 CT",
      teams:[{name:"Uzbekistán",flag:"🇺🇿"},{name:"Colombia",flag:"🇨🇴"}],
      stadium:"Estadio Azteca", tag:"Grupo F", highlight:false,
    },
    {
      id:"m3", date:"24 Jun", day:"Mié", time:"20:00 CT",
      teams:[{name:"Rep. Checa",flag:"🇨🇿"},{name:"México",flag:"🇲🇽"}],
      stadium:"Estadio Azteca", tag:"Grupo A — partido definitorio del grupo", highlight:true,
    },
    {
      id:"m4", date:"30 Jun", day:"Mar", time:"20:00 CT",
      teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}],
      stadium:"Estadio Azteca", tag:"Fase eliminatoria", highlight:false,
    },
    {
      id:"m5", date:"5 Jul", day:"Dom", time:"19:00 CT",
      teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}],
      stadium:"Estadio Azteca", tag:"Fase eliminatoria", highlight:false,
    },
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
    body:"La Ciudad de México no llega al Mundial — el Mundial regresa a donde siempre estuvo. El Estadio Azteca albergó la final de 1970 y la de 1986. En 2026 se convierte en el único recinto del planeta con tres ediciones de la Copa del Mundo. El 11 de junio, además, el estadio recibirá el partido inaugural del torneo por primera vez en su historia — 72,000 personas, México en casa, y el sonido más cargado de expectativa de cualquier ciudad del torneo. El estadio conoce el peso. La ciudad también. Calendario de partidos: 🇲🇽🇿🇦 Jue 11 Jun · 14:00 CT: México vs. Sudáfrica (Partido Inaugural — primer Mundial en el Azteca desde 1986); 🇺🇿🇨🇴 Mié 17 Jun · 21:00 CT: Uzbekistán vs. Colombia (Grupo F); 🇨🇿🇲🇽 Mié 24 Jun · 20:00 CT: República Checa vs. México (Grupo A — partido definitorio del grupo); Mar 30 Jun · 20:00 CT: Ronda de 32; Dom 5 Jul · 19:00 CT: Ronda de 16 (TBD). Los cruces de eliminación se confirman al terminar la fase de grupos.",
    lagomNote:"CDMX requiere planificación logística real. El tráfico no distingue entre día de partido y día normal — lo que cambia es que 70,000 personas intentan hacer lo mismo que tú, al mismo tiempo. Metro + Tren Ligero es la única ruta que no depende del tráfico. Tarifa total: $10 MXN. Si llegaste a AIFA, necesitas al menos dos días de margen antes del partido.",
  },

  vibe:{
    body:"El país anfitrión juega dos partidos en este estadio. El 11 de junio, el Azteca recibe el partido inaugural del torneo por primera vez en su historia. No hay ciudad en México que vaya a superar eso. Este estadio vio la Mano de Dios y el Gol del Siglo. En 2026 escribe su tercer capítulo mundialista. El peso histórico de la sede es único en el torneo. La ciudad suma la gastronomía con más diversidad de América Latina — más de 150 tipos de chile, 70 formas de preparar el maíz, y una escena que la UNESCO reconoció como Patrimonio Cultural Inmaterial. El costo es el límite: la más cara de las tres sedes mexicanas, y el Mundial la encarece aún más.",
    zones:[
      {
        name:"FIFA Fan Festival™ @ Zócalo",
        type:"Fan Fest oficial",
        typeColor:T.coral,
        desc:"El Fan Fest oficial toma la plaza más grande de México. Pantallas de gran formato, zonas culturales y una instalación temática sobre el juego de pelota mesoamericano. El cartel de pre-apertura incluye a Alejandro Fernández, Carin León y Timbiriche. Nota: no se vende alcohol en el recinto oficial. Metro Línea 2 (Zócalo). Operación del 11 de junio al 19 de julio.",
        tag:"Sin boleto OK",
      },
    ],
    lagomNote:"El 11 de junio (México vs. Sudáfrica, partido inaugural) y el 24 de junio (Rep. Checa vs. México, definitorio del Grupo A) son las fechas más críticas. Reserva alojamiento con meses de anticipación — el Mundial inaugural en el Azteca desde 1986 no tiene precedente en turismo de la ciudad.",
  },

  neighborhoods:[
    {
      name:"Condesa / Roma Norte",
      vibe:"Base recomendada. El triángulo de oro del turismo consciente en CDMX. Hoteles boutique, mercados, restaurantes con identidad y conexión directa al Metro. El recorrido al Azteca toma entre 45 y 55 minutos usando Metro Línea 1 → Pino Suárez → Línea 2 → Tasqueña → Tren Ligero → Estadio Azteca.",
      best_for:"Fan WC",
      walk_to_stadium:"45–55 min · Metro Línea 1 → Tasqueña → Tren Ligero",
      lagomNote:null,
    },
    {
      name:"Coyoacán",
      vibe:"Jugada de criterio. El barrio bohemio del sur tiene una ventaja que pocos fans aprovechan: el Tren Ligero pasa por aquí. La estación Xotepingo está a menos de dos kilómetros del Jardín Centenario. Precio por debajo de Condesa, atmósfera por encima de cualquier cadena hotelera en Insurgentes.",
      best_for:"Pareja",
      walk_to_stadium:"~15 min · Tren Ligero desde Xotepingo",
      lagomNote:null,
    },
    {
      name:"Tlalpan / Santa Úrsula Coapa",
      vibe:"Zona a evitar como base. La zona inmediata al Azteca tiene opciones de hospedaje muy limitadas y una infraestructura de servicios que no está preparada para absorber a 72,000 fanáticos internacionales. Conveniente en teoría, frustrante en la práctica.",
      best_for:"Evitar",
      walk_to_stadium:"Cerca del estadio — sin infraestructura de servicios",
      lagomNote:null,
    },
  ],

  stays:[
    {
      name:"Ignacia Guest House",
      area:"Roma Norte",
      price:"$$$",
      priceCAD:"Precio estimado en periodo mundialista: $200–320 USD/noche",
      tags:["Boutique","Casona porfiriana","11 habitaciones"],
      note:"Once habitaciones en una casona porfiriana restaurada. Sin lobby monumental, sin conserje corporativo: diseño serio, jardín interior y una ubicación que pone al huésped a una cuadra de los mejores restaurantes de la ciudad.",
      best_for:"Hotel boutique",
    },
    {
      name:"Hostel Home",
      area:"Roma Norte",
      price:"$",
      priceCAD:"Precio estimado en periodo mundialista: $25–60 USD/noche según tipo de habitación",
      tags:["Presupuesto","Habitaciones privadas","Terraza comunitaria"],
      note:"Una de las pocas opciones de calidad real para viajeros con presupuesto ajustado en CDMX. Camas en dormitorio y habitaciones privadas, terraza comunitaria y conexión de metro a dos cuadras.",
      best_for:"Presupuesto",
    },
    {
      name:"St. Regis Mexico City",
      area:"Paseo de la Reforma",
      price:"$$$$",
      priceCAD:"Precio estimado en periodo mundialista: $400–700 USD/noche",
      tags:["Vista a Chapultepec","Metro Insurgentes","Reforma"],
      note:"Vista directa al Bosque de Chapultepec y a la Columna de la Independencia. Acceso rápido al Metro Insurgentes. Uno de los hoteles con mejor relación posición-servicio de la ciudad.",
      best_for:"Lujo",
    },
  ],

  logistics:{
    transport:[
      {
        icon:"✈",
        title:"Llegar a Ciudad de México — AICM",
        text:"AICM — Benito Juárez International (MEX) está en el nororiente de la ciudad. Metro desde Terminal Aérea (Línea 5) → Pantitlán → Línea 1 hacia Condesa / Roma Norte. El recorrido completo AICM → Estadio Azteca via Metro + Tren Ligero toma ~75 minutos. Costo total: ~$10 MXN.",
      },
      {
        icon:"🚇",
        title:"Del aeropuerto al barrio base",
        text:"Metro desde Terminal Aérea → Pantitlán → Línea 1 → Insurgentes o Pino Suárez (para Condesa / Roma Norte). El sistema opera con Tarjeta CDMX recargable. Tarifa: $5 MXN por viaje. Uber desde AICM a Roma Norte: ~$150–250 MXN sin tráfico, hasta $500 MXN en hora punta.",
      },
      {
        icon:"🏟",
        title:"Al estadio el día del partido — ruta maestra",
        text:"Metro Línea 1 o 2 → Tasqueña → Tren Ligero → Estadio Azteca. El Tren Ligero opera con derecho de vía propio desde Tasqueña hasta la estación Estadio Azteca en ~15 minutos. Desde Condesa o Roma Norte, el recorrido completo toma entre 45 y 55 minutos. Tarifa total: $10 MXN ($5 Metro + $5 Tren Ligero). Lleva Tarjeta CDMX cargada.",
      },
      {
        icon:"⚠️",
        title:"Error crítico — AIFA no es opción",
        text:"AIFA (Felipe Ángeles, Santa Lucía) está en el Estado de México, a más de 80 kilómetros al norte del Estadio Azteca. Si tu aerolínea opera desde AIFA, llega a CDMX con al menos dos días de margen antes del partido. La conexión al sur de la ciudad en día de partido es un ejercicio de paciencia que no todos sobreviven con buen humor.",
        isWarning:true,
      },
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
    {
      title:"FIFA Fan Festival™ @ Zócalo",
      type:"Fan fest oficial",
      typeColor:T.coral,
      desc:"El Fan Fest oficial toma la plaza más grande de México con pantallas de gran formato, zonas culturales y una instalación temática sobre el juego de pelota mesoamericano. El cartel de pre-apertura (9 y 10 de junio) incluye a Alejandro Fernández, Carin León y Timbiriche. Nota: no se vende alcohol en el recinto oficial. Metro Línea 2 (Zócalo). Operación prevista del 11 de junio al 19 de julio.",
      tag:"Sin boleto OK",
    },
    {
      title:"Campo Marte (Polanco)",
      type:"Pantalla exterior",
      typeColor:T.fjord,
      desc:"El espacio al aire libre frente al Bosque de Chapultepec se transforma en zona de transmisión masiva con pantallas de formato estadio, activaciones en vivo y capacidad para miles de personas. El contexto — entre los Pinos y el Castillo de Chapultepec — no tiene equivalente en ninguna otra sede del torneo.",
      tag:"Icónico",
    },
    {
      title:"Foro Indie Rocks! (Roma Norte)",
      type:"Recinto cultural",
      typeColor:T.sage,
      desc:"Recinto de conciertos que habilita sus pantallas y su espacio exterior para el Mundial. Convoca a una multitud que no necesariamente se define como fanática del fútbol, pero que celebra igual — y en Roma Norte, eso es suficiente para definir la noche.",
      tag:"Roma Norte",
    },
    {
      title:"Estadio Olímpico Universitario (UNAM)",
      type:"Transmisión universitaria",
      typeColor:T.pine,
      desc:"La UNAM confirmó transmisiones en el campus universitario para estudiantes y público general. Ver el partido de México en el estadio olímpico donde Pelé jugó en 1968 — aunque sea en pantalla — tiene un peso histórico que el Zócalo no puede replicar.",
      tag:"Histórico",
    },
    {
      title:"La Polar (Azcapotzalco)",
      type:"Cantina histórica",
      typeColor:"#5A3A2A",
      desc:"Cantina histórica de 1938 con ambiente de tribuna y clientela que sabe de fútbol. El menú de botanas sin cargo — chicharrón, cacahuates enchilados, quesadillas — viene incluido con el consumo de cervezas. Las pantallas llevan décadas transmitiendo Liga MX y partidos internacionales. Para el partido de México, La Polar es el estadio alterno de la ciudad.",
      tag:"Cantina clásica",
    },
    {
      title:"Salón Corona (Centro Histórico)",
      type:"Cantina histórica",
      typeColor:"#8B2635",
      desc:"Desde 1928, esta cantina del centro transmite todo lo que se puede transmitir. Pantallas en cada rincón, cerveza de barril, botanas sin cargo y acceso al Metro Zócalo para llegar al Fan Fest sin rodeos. La clientela mezcla oficinistas del centro con turistas que acaban de descubrir que existe una cantina mejor que cualquier cosa en su país.",
      tag:"Centro Histórico",
    },
    {
      title:"El Paisa (Condesa)",
      type:"Bar de barrio",
      typeColor:"#2D6B4A",
      desc:"Bar de barrio con terrazas exteriores y pantallas orientadas a la calle. En días de partido de México o de la UEFA, la terraza se convierte en el punto de reunión del vecindario de Condesa. Comida de pub mexicano honesta, precios más bajos que el promedio del barrio y una actitud que no intenta ser otra cosa de lo que es.",
      tag:"Condesa",
    },
  ],

  food:[
    { dish:"La Polar",                   where:"Azcapotzalco — cerveza de barril + botanas sin cargo; cantina de 1938, el estadio alterno de la ciudad en días de México",      price:"$",   type:"Pre-partido" },
    { dish:"Salón Corona",               where:"Centro Histórico — tostadas de pata + lo que haya de barril; desde 1928, pantalla siempre encendida",                           price:"$",   type:"Cantina clásica" },
    { dish:"El Paisa",                   where:"Condesa — tacos de canasta + michelada; terraza a la calle, precios honestos",                                                  price:"$",   type:"De barrio" },
    { dish:"Mercado de Coyoacán",        where:"Coyoacán — antojitos del mercado; el almuerzo más auténtico antes de una tarde en el barrio bohemio",                           price:"$",   type:"Mercado" },
    { dish:"Taquería El Califa de León", where:"San Rafael — el taco de bistec que ganó una estrella Michelin en 2024; cuatro opciones, sin exceso de carta",                  price:"$",   type:"Imperdible" },
    { dish:"Restaurantes de Roma Norte", where:"Roma Norte — gastronomía de autor con identidad; el barrio con mejor concentración de cocina de calidad de la ciudad",          price:"$$",  type:"Autor" },
  ],

  experiences:[
    {
      title:"Teotihuacán + Museo Nacional de Antropología",
      duration:"Día completo",
      desc:"La zona arqueológica de Teotihuacán está a 50 kilómetros al noreste y se puede llegar en camión desde la Terminal del Norte en menos de una hora. Recomendación: llegada antes de las 9am para evitar el calor y los grupos de tour. Para la tarde, el Museo Nacional de Antropología en Chapultepec tiene la colección arqueológica prehispánica más completa del continente — la Sala Mexica justifica la visita por sí sola.",
      type:"Histórico",
      affiliateLink:"AFFILIATE_LINK_CDMX_TEOTIHUACAN",
      affiliateLabel:"Ver tours a Teotihuacán",
    },
    {
      title:"Xochimilco + Coyoacán",
      duration:"Día completo",
      desc:"Trajinera por la mañana, Mercado de Coyoacán al mediodía, Museo Frida Kahlo por la tarde (reserva en línea con anticipación — el acceso en puerta siempre está agotado). El Tren Ligero conecta Coyoacán con la ciudad central, lo que hace de este plan el día libre más lógico para quien también tiene partido en el Azteca.",
      type:"Cultural",
      affiliateLink:"AFFILIATE_LINK_CDMX_XOCHIMILCO",
      affiliateLabel:"Reservar trajinera en Xochimilco",
    },
    {
      title:"Mercado de Jamaica + La Merced",
      duration:"Medio día",
      desc:"El Mercado de Jamaica es el mayoreo de flores más grande de México — llega al amanecer. La Merced es el corazón comercial del oriente de la ciudad: bulliciosa, fotogénica y poco visitada por el fan internacional. Ninguno de los dos está en el itinerario estándar. Por eso merecen estar aquí.",
      type:"Local",
      affiliateLink:"AFFILIATE_LINK_CDMX_MERCADOS",
      affiliateLabel:"Tour de mercados en CDMX",
    },
    {
      title:"Bosque de Chapultepec",
      duration:"Mañana o tarde",
      desc:"El parque urbano más grande de América Latina rodea el Castillo de Chapultepec en más de 680 hectáreas. El lago, los museos del perímetro — Rufino Tamayo, Arte Moderno, Historia Natural — y la vista del Castillo desde la segunda sección hacen de Chapultepec el respiro necesario entre partidos. Entrada libre los domingos.",
      type:"Ciudad",
      affiliateLink:"AFFILIATE_LINK_CDMX_CHAPULTEPEC",
      affiliateLabel:"Tour cultural en Chapultepec",
    },
  ],

  itinerary:[
    {
      day:1,
      title:"Llegada y primer pulso",
      subtitle:"Roma Norte · Condesa · Paseo de la Reforma",
      isMatchDay:false,
      steps:[
        { time:"Llegada",   text:"Metro desde AICM: Terminal Aérea (Línea 5) → Pantitlán → Línea 1 → Insurgentes. Bienvenido a la ciudad más grande del torneo." },
        { time:"Tarde",     text:"Camina entre Roma Norte y Condesa. Parque México, Álvaro Obregón, las librerías de la colonia si llegaste con tiempo." },
        { time:"Atardecer", text:"Paseo de la Reforma. El Ángel de la Independencia, la avenida más fotogénica de la sede, con el Castillo al fondo." },
        { time:"Noche",     text:"Cena en Roma Norte. CDMX tiene más restaurantes que cualquier capital de América Latina — elige uno con identidad." },
      ],
    },
    {
      day:2,
      title:"Día de partido — México vs. Sudáfrica",
      subtitle:"Estadio Azteca · Jue 11 Jun · 14:00 CT · Partido Inaugural",
      isMatchDay:true,
      matchRef:"m1",
      steps:[
        { time:"H-3:00", text:"Almuerza en el barrio. El Azteca no tiene gastronomía que valga la pena; come bien antes de salir." },
        { time:"H-2:30", text:"Metro Línea 1 o 2 hacia Tasqueña. Sin prisa, sin correr." },
        { time:"H-1:30", text:"Llegada a Tasqueña. Toma el Tren Ligero — la única ruta que no depende del tráfico de CDMX." },
        { time:"H-1:00", text:"Estadio Azteca. Puertas abiertas. El primer partido inaugural del Azteca en sus 60 años de historia." },
        { time:"14:00",  text:"México vs. Sudáfrica. El Coloso de Santa Úrsula abre el torneo más importante desde 1986." },
      ],
    },
    {
      day:3,
      title:"Teotihuacán y Chapultepec",
      subtitle:"Zona Arqueológica · Bosque de Chapultepec",
      isMatchDay:false,
      steps:[
        { time:"Mañana",   text:"Camión desde Terminal del Norte a Teotihuacán (~1 hora). Llega antes de las 9am para evitar el calor y los grupos." },
        { time:"Mediodía", text:"Regreso a la ciudad. Almuerzo en el camino o en el barrio base." },
        { time:"Tarde",    text:"Museo Nacional de Antropología en Chapultepec. La Sala Mexica es imprescindible — la colección prehispánica más completa del continente." },
        { time:"Noche",    text:"Cena en la colonia Polanco o Roma Norte. La ciudad a tu disposición." },
      ],
    },
    {
      day:4,
      title:"Día de partido — Rep. Checa vs. México",
      subtitle:"Estadio Azteca · Mié 24 Jun · 20:00 CT — definitorio del Grupo A",
      isMatchDay:true,
      matchRef:"m3",
      steps:[
        { time:"H-3:00", text:"Tarde tranquila. Xochimilco o Coyoacán para el día libre antes del partido nocturno." },
        { time:"H-2:30", text:"Regreso a la base. Metro y cena temprana — el Azteca no tiene gastronomía que valga." },
        { time:"H-1:30", text:"Metro hacia Tasqueña. Tren Ligero al estadio. La afición mexicana llega desde temprano." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo. Si México necesita un resultado, el ambiente va a ser el más intenso del torneo." },
        { time:"Post",   text:"Tren Ligero de regreso desde el estadio. Salida inmediata — la espera se multiplica cada 15 minutos." },
      ],
    },
    {
      day:5,
      title:"Día sin partido — CDMX profunda",
      subtitle:"Mercado de Jamaica · La Merced · Coyoacán",
      isMatchDay:false,
      steps:[
        { time:"Mañana",   text:"Mercado de Jamaica al amanecer — el mayoreo de flores más grande del país." },
        { time:"Mediodía", text:"La Merced: el corazón comercial del oriente, bullicioso y fotogénico. Almuerzo en el mercado." },
        { time:"Tarde",    text:"Coyoacán: Jardín Centenario, Mercado de Coyoacán, Museo Frida Kahlo (reserva con anticipación)." },
        { time:"Noche",    text:"Cantina de barrio. La Polar o Salón Corona para cerrar con cerveza de barril y botanas sin cargo." },
      ],
    },
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
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATION — Ciudad de México
// ─────────────────────────────────────────────────────────────────────────────
const CdmxIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#EBF0E8" rx={RADIUS} />
    <rect x="0" y="0" width="280" height="80" fill="#F5F0E8" opacity="0.5" />
    {/* Popocatépetl volcano */}
    <polygon points="148,90 188,25 228,90" fill="#2D5A3A" opacity="0.42" />
    <polygon points="185,90 218,36 251,90" fill="#3A6B4A" opacity="0.35" />
    {/* Snow caps */}
    <polygon points="188,25 200,46 176,46" fill="white" opacity="0.82" />
    <polygon points="218,36 228,52 208,52" fill="white" opacity="0.65" />
    {/* City skyline */}
    <rect x="10" y="66" width="6"  height="24" fill="#1A6B5A" opacity="0.28" rx={1} />
    <rect x="19" y="58" width="8"  height="32" fill="#1A6B5A" opacity="0.32" rx={1} />
    <rect x="31" y="63" width="5"  height="27" fill="#1A6B5A" opacity="0.22" rx={1} />
    <rect x="39" y="52" width="10" height="38" fill="#1A6B5A" opacity="0.30" rx={1} />
    <rect x="53" y="60" width="7"  height="30" fill="#1A6B5A" opacity="0.20" rx={1} />
    <rect x="64" y="56" width="6"  height="34" fill="#1A6B5A" opacity="0.25" rx={1} />
    {/* Torre Latinoamericana — tall spire */}
    <rect x="74" y="40" width="4"  height="50" fill="#1A6B5A" opacity="0.35" rx={1} />
    <polygon points="76,40 73,47 79,47" fill="#1A6B5A" opacity="0.4" />
    {/* Estadio Azteca oval */}
    <ellipse cx="110" cy="110" rx="36" ry="13" fill="#1A6B5A" opacity="0.16" />
    <ellipse cx="110" cy="110" rx="26" ry="9"  fill="#1A6B5A" opacity="0.10" />
    {/* Ángel de la Independencia column */}
    <rect x="33" y="42" width="2.5" height="24" fill="#C4622A" opacity="0.55" />
    <polygon points="34.25,42 31.5,49 37,49" fill="#C4622A" opacity="0.5" />
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

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom:32 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
      <span style={{ ...uf(9,500), letterSpacing:"0.18em", textTransform:"uppercase", color:T.inkFaint }}>{number}</span>
      <div style={{ flex:1, height:1, background:"rgba(28,28,26,0.08)" }} />
    </div>
    <h2 style={{ ...df(27,700,"italic"), color:T.pine, lineHeight:1.05, marginBottom:subtitle ? 8 : 0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.65, margin:0, maxWidth:540 }}>{subtitle}</p>}
  </div>
);

const LagomNote = ({ children }) => (
  <div style={{ display:"flex", gap:16, padding:"18px 22px", background:T.sandLight, borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
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
            <span style={{
              ...uf(9,700), letterSpacing:"0.08em", textTransform:"uppercase",
              color: match.highlight ? T.matchGold : CITY_ACCENT,
              background: match.highlight ? T.matchGoldLight : CITY_ACCENT+"15",
              border:`1px solid ${match.highlight ? T.matchGold+"50" : CITY_ACCENT+"35"}`,
              padding:"4px 10px", borderRadius:40, flexShrink:0, maxWidth:160, textAlign:"right",
            }}>{match.tag}</span>
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
        {isTBD && (
          <div style={{ ...uf(12,400), color:T.inkFaint, textAlign:"center", padding:"8px 0", fontStyle:"italic" }}>
            Rival por definir al terminar fase de grupos
          </div>
        )}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESSIVE DISCLOSURE
// ─────────────────────────────────────────────────────────────────────────────
const ShowMoreToggle = ({ expanded, onToggle }) => (
  <button onClick={onToggle} style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:16, background:"transparent", border:`1px solid ${T.sage}55`, borderRadius:40, ...uf(10,600), color:T.sage, cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 14px", transition:"all 0.18s" }}
    onMouseEnter={e => { e.currentTarget.style.background=T.sageLight; e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.color=T.pine; }}
    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`${T.sage}55`; e.currentTarget.style.color=T.sage; }}>
    {expanded ? "Ver menos ↑" : "Ver más ↓"}
  </button>
);

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
          <span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint, background:T.sand, padding:"3px 8px", borderRadius:5, border:`1px solid ${T.sandDark}` }}>{tag}</span>
        ))}
      </div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"14px 22px", borderTop:`1px solid ${T.sandDark}` }}>
      <button style={{ width:"100%", padding:"11px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }}
        onMouseEnter={e => e.currentTarget.style.opacity="0.82"}
        onMouseLeave={e => e.currentTarget.style.opacity="1"}>
        Ver opciones →
      </button>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// FOOD CARD
// ─────────────────────────────────────────────────────────────────────────────
const FoodCard = ({ item }) => (
  <div style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:CARD_SHADOW, padding:"16px 18px", display:"flex", flexDirection:"column", gap:6 }}>
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

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const GuideSidebar = ({ guide, onPlan }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      <Card style={{ padding:"22px 22px", background:T.sandLight, borderColor:T.sandDark }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...df(16,700,"italic"), color:T.pine, lineHeight:1.4, marginBottom:16 }}>
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
          <div style={{ width:28, height:28, background:T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>✦</span>
          </div>
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
          <div style={{ width:28, height:28, background:T.matchGoldLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>☑</span>
          </div>
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
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:"0 0 12px" }}>
              Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.
            </p>
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

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE HERO
// ─────────────────────────────────────────────────────────────────────────────
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
      <h1 style={{ ...df("clamp(44px,5.5vw,72px)",900,"italic"), color:T.pine, lineHeight:0.92, letterSpacing:"-0.03em", marginBottom:22 }}>
        {guide.city}
      </h1>
      <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, maxWidth:500, marginBottom:32 }}>
        {guide.description}
      </p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
        {guide.tags.map(tag => (
          <span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`, padding:"5px 13px", borderRadius:40 }}>{tag}</span>
        ))}
        <span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}35`, padding:"5px 13px", borderRadius:40 }}>
          ⚽ {guide.matches.length} partidos
        </span>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:3 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width:6, height:6, borderRadius:"50%", background: i <= s.value ? T.sage : T.sandDark }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}>
      <CdmxIllustration />
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
  <div style={{ position:"sticky", top:0, zIndex:40, background:`${T.bg}F5`, backdropFilter:"blur(18px)", borderBottom:`1px solid ${T.sandDark}`, height:52, display:"flex", alignItems:"center", padding:"0 40px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none", cursor:"pointer", padding:"0 14px 0 0", marginRight:14, borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em", transition:"color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color=T.pine}
      onMouseLeave={e => e.currentTarget.style.color=T.inkFaint}>
      ← Guías
    </button>
    <span style={{ ...df(14,700,"italic"), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>Ciudad de México</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{ ...uf(10, active===item.id ? 700 : 500), letterSpacing:"0.08em", textTransform:"uppercase", color: active===item.id ? T.pine : T.inkFaint, background:"none", border:"none", padding:"0 13px", height:"100%", cursor:"pointer", borderBottom:`2px solid ${active===item.id ? T.coral : "transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0 }}>{item.label}</button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE DETAIL
// ─────────────────────────────────────────────────────────────────────────────
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

        <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:52, alignItems:"flex-start" }}>

          {/* ── MAIN ── */}
          <div>

            {/* 01 — MATCHES */}
            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos"
                subtitle="5 partidos confirmados en el Estadio Azteca. México juega el 11 y el 24 de junio — las dos fechas de mayor demanda del torneo en la ciudad." />
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
                subtitle="Refugios seleccionados para recargar energías entre diseño de autor y confort estratégico." />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>
                    Los precios son estimaciones para el periodo mundialista. El 11 de junio (México vs. Sudáfrica, partido inaugural) y el 24 de junio (Rep. Checa vs. México) son las fechas más críticas.
                    Si aún no tienes alojamiento, prioriza Airbnb en <strong>Coyoacán</strong> antes de considerar hoteles de cadena en zonas sobredemandadas. AIFA NO es una opción cercana al estadio — está a 80 km al norte.
                  </p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay => <StayCard key={stay.name} stay={stay} />)}
              </div>
            </section>

            {/* 04 — VIBE */}
            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente"
                subtitle="Fan Fest oficial en el Zócalo, pantallas en el Bosque de Chapultepec y las cantinas que llevan décadas transmitiendo fútbol." />
              <p style={{
                ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe ? 28 : 0, maxWidth:640,
                ...(showVibe ? {} : { display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }),
              }}>
                {guide.vibe.body}
              </p>
              {showVibe && (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
                    {guide.vibeCards.map(item => <CollapsibleVibeCard key={item.title} item={item} />)}
                  </div>
                  <LagomNote>{guide.vibe.lagomNote}</LagomNote>
                </>
              )}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} />
            </section>

            {/* 05 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio"
                subtitle="Metro + Tren Ligero es la única ruta que no depende del tráfico de CDMX." />
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom: showLogistics ? 24 : 0 }}>
                {guide.logistics.transport.slice(0, 2).map((item, i) => <LogisticsCard key={i} item={item} />)}
              </div>
              {showLogistics && (
                <>
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
                        <div key={i} style={{ display:"flex", gap:16, paddingTop: i > 0 ? 14 : 0, paddingBottom: i < guide.logistics.matchDayCronologia.steps.length-1 ? 14 : 0, borderBottom: i < guide.logistics.matchDayCronologia.steps.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
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
                </>
              )}
              <ShowMoreToggle expanded={showLogistics} onToggle={() => setShowLogistics(!showLogistics)} />
            </section>

            {/* 06 — FOOD */}
            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista"
                subtitle="CDMX tiene la gastronomía con más diversidad de América Latina — más de 150 tipos de chile y una cocina reconocida por la UNESCO. El reto no es encontrar dónde comer bien, sino elegir." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                {guide.food.slice(0, 3).map((f, i) => <FoodCard key={i} item={f} />)}
                {showFood && guide.food.slice(3).map((f, i) => <FoodCard key={i+3} item={f} />)}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} />
            </section>

            {/* 07 — EXPERIENCES */}
            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio"
                subtitle="El entretiempo ideal para descubrir que hay vida — y mucha cultura — más allá de los 90 minutos." />
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {guide.experiences.slice(0, 1).map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>
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
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>
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
            <GuideSidebar guide={guide} onPlan={() => alert("Planificador: CDMX")} />
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
      <GuideDetail guide={CDMX} onBack={() => {}} />
    </>
  );
}
