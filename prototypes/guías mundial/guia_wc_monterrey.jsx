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
const CITY_ACCENT = "#2D4F6C";
const SECTION_ALT_BG = "#F4F0EB";

const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>
    {children}
  </span>
);

const MTY = {
  id:"mty",
  city:"Monterrey",
  country:"México",
  state:"Nuevo León",
  flag:"🇲🇽",
  accent: CITY_ACCENT,

  tags:["Fútbol","Gastronomía","Industria","Sede co-anfitriona"],

  stadium:{ name:"Estadio BBVA", capacity:"~53,500", area:"Guadalupe — municipio adyacente a la ciudad" },

  headline:"La ciudad más trabajadora de México recibe el Mundial con la misma actitud con la que construyó sus industrias: sin exceso de ornamento.",
  description:"La ciudad más trabajadora de México recibe el Mundial sin exceso de ornamento. El Estadio BBVA es el estadio de fútbol más moderno del país. La Sierra Madre es el telón de fondo más honesto que puede tener un partido. Cuatro partidos confirmados — y la advertencia más importante de esta guía: en junio, Monterrey puede superar los 40°C.",

  scores:[
    { label:"Ambiente",     value:4 },
    { label:"Fútbol local", value:4 },
    { label:"Gastronomía",  value:4 },
    { label:"Transporte",   value:4 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:4 },
  ],

  matches:[
    {
      id:"m1", date:"14 Jun", day:"Dom", time:"21:00 CT",
      teams:[{name:"Túnez",flag:"🇹🇳"},{name:"Rep. UEFA B",flag:""}],
      stadium:"Estadio BBVA", tag:"Grupo A — apertura de la sede", highlight:false,
    },
    {
      id:"m2", date:"19 Jun", day:"Vie", time:"23:00 CT",
      teams:[{name:"Túnez",flag:"🇹🇳"},{name:"Japón",flag:"🇯🇵"}],
      stadium:"Estadio BBVA", tag:"Partido de medianoche — hora local", highlight:false,
    },
    {
      id:"m3", date:"24 Jun", day:"Mié", time:"20:00 CT",
      teams:[{name:"Sudáfrica",flag:"🇿🇦"},{name:"Corea del Sur",flag:"🇰🇷"}],
      stadium:"Estadio BBVA", tag:"Grupo A — jornada final simultánea", highlight:false,
    },
    {
      id:"m4", date:"29 Jun", day:"Lun", time:"20:00 CT",
      teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}],
      stadium:"Estadio BBVA", tag:"Fase eliminatoria", highlight:false,
    },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",        value:"Estadio Monterrey (Estadio BBVA)" },
      { label:"Aforo",               value:"~53,500 — configuración FIFA. Diseñado por Populous, con el espectador a 9 metros del campo." },
      { label:"Techo",               value:"Techumbre parcial — muchas zonas expuestas al sol. Hidratación obligatoria." },
      { label:"Clima (jun–jul)",     value:"34–40°C días · 24–27°C noches · Calor seco e intenso. El estadio no tiene A/C." },
      { label:"Partidos",            value:"4 confirmados — fase de grupos (3) + Ronda de 32 (1)" },
      { label:"Aeropuerto principal",value:"MTY — Aeropuerto Internacional General Mariano Escobedo, a ~24 km del estadio en Guadalupe." },
      { label:"Visa",                value:"México no requiere visa para la mayoría de países latinoamericanos ni europeos. Verificar en embajada o consulado." },
    ],
    body:"Monterrey no vende postal. Vende precisión: una ciudad que construyó las industrias del país y ahora recibe al mundo con la misma lógica que siempre la ha guiado — sin adorno innecesario, con resultado concreto. El Estadio BBVA es el estadio de fútbol más moderno de México: diseño de Populous, espectador a nueve metros del campo, y una vista a la Sierra Madre que ningún estadio de la competencia tiene. Cuatro partidos confirmados, incluyendo un partido de medianoche el 19 de junio (Túnez vs. Japón, 23:00 CT) — la trampa logística más específica de esta sede. Calendario completo: 🇹🇳 Dom 14 Jun · 21:00 CT: Túnez vs. Repechaje UEFA B (Grupo A — apertura); 🇹🇳🇯🇵 Vie 19 Jun · 23:00 CT: Túnez vs. Japón (partido de medianoche); 🇿🇦🇰🇷 Mié 24 Jun · 20:00 CT: Sudáfrica vs. Corea del Sur (Grupo A — jornada final simultánea con Rep. Checa vs. México en CDMX); Lun 29 Jun · 20:00 CT: Ronda de 32.",
    lagomNote:"El partido de las 23:00 del 19 de junio es una trampa logística: salir del estadio a medianoche sin alojamiento confirmado en un municipio con poca oferta nocturna de transporte no es una situación ideal. Confirma alojamiento y transporte de regreso antes de asistir a ese partido. El calor de Monterrey en junio tampoco es opcional: el estadio tiene techumbre parcial y muchas zonas quedan expuestas al sol.",
  },

  vibe:{
    body:"Monterrey no tiene el peso simbólico de CDMX ni el cariño nacional de Guadalajara, pero su afición es de las más intensas de Liga MX. Con el Clásico Regio (Rayados vs. Tigres) como referencia habitual, la ciudad sabe recibir partidos de alta presión. Dos clubes de primer nivel, una rivalidad regional que divide familias y un estadio diseñado para maximizar el ruido. El Gigante de Acero no es solo un apodo — el diseño de Populous mantiene al espectador a nueve metros del campo. Más accesible que CDMX, comparable a Guadalajara en precio. El cabrito, el machacado y la cocina norteña son razones suficientes para extender la estadía más allá de los días de partido.",
    zones:[],
    lagomNote:"El Parque Fundidora — una acería del siglo XIX convertida en parque de 140 hectáreas — es el Fan Fest oficial de la sede. El contexto físico es uno de los mejores del torneo: chimeneas industriales de fondo, espacio abierto generoso y acceso por Metrorrey Línea 1 (estación Parque Fundidora). Para los partidos de grupo, el Paseo Santa Lucía tiene restaurantes con pantallas a lo largo del canal de 2.5 km.",
  },

  neighborhoods:[
    {
      name:"Barrio Antiguo",
      vibe:"Base recomendada. El único barrio de Monterrey con vida en la calle más allá de las 11pm. Calles empedradas, bares de cerveza artesanal, taquerías de madrugada y murales que documentan la historia industrial de la región. Acceso directo al Metrorrey Línea 1 desde la estación Cuauhtémoc.",
      best_for:"Fan WC",
      walk_to_stadium:"Metrorrey Cuauhtémoc → Exposición + shuttle (~25 min)",
      lagomNote:null,
    },
    {
      name:"San Pedro Garza García",
      vibe:"Alternativa con criterio. El municipio más próspero de México funciona como la zona residencial premium de Monterrey. Más tranquilo que el Barrio Antiguo, con restaurantes de nivel internacional y acceso por Metrorrey Línea 2.",
      best_for:"Pareja",
      walk_to_stadium:"Metrorrey Línea 2 + transbordo (~35 min)",
      lagomNote:null,
    },
    {
      name:"Guadalupe (inmediaciones del estadio)",
      vibe:"Zona a evitar como base para estadías de varios días. La zona alrededor del Estadio BBVA es funcional y segura pero sin mucho que ofrecer fuera de los días de partido.",
      best_for:"Solo logística",
      walk_to_stadium:"15 min — sin infraestructura de barrio",
      lagomNote:null,
    },
  ],

  stays:[
    {
      name:"Habitta Monterrey",
      area:"San Pedro Garza García",
      price:"$$$",
      priceCAD:"Precio estimado en periodo mundialista: $180–290 USD/noche",
      tags:["Boutique","Terraza con vistas","Sierra Madre"],
      note:"Diseño contemporáneo en el corredor más cotizado de la ciudad. Restaurante propio, terraza con vistas a la Sierra Madre y habitaciones sin el aspecto institucional de las cadenas internacionales.",
      best_for:"Hotel boutique",
      url:"",
    },
    {
      name:"Hostel El Greco",
      area:"Barrio Antiguo",
      price:"$",
      priceCAD:"Precio estimado en periodo mundialista: $20–50 USD/noche según tipo de habitación",
      tags:["Presupuesto","Habitaciones privadas","Barrio Antiguo"],
      note:"Una de las pocas opciones de hostal serias en Monterrey, bien ubicada para quien quiere vivir el barrio y no solo dormir en él. Habitaciones privadas y compartidas disponibles.",
      best_for:"Presupuesto",
      url:"",
    },
    {
      name:"Safi Royal Luxury Valley",
      area:"San Pedro Garza García",
      price:"$$$$",
      priceCAD:"Precio estimado en periodo mundialista: $350–580 USD/noche",
      tags:["Vista al Cerro de la Silla","Spa","50 habitaciones"],
      note:"Cincuenta habitaciones, spa, piscina y vista directa al Cerro de la Silla. El nivel de servicio es desproporcionadamente alto para el tamaño del hotel — la mejor relación tamaño-calidad de la ciudad.",
      best_for:"Lujo",
      url:"",
    },
  ],

  logistics:{
    transport:[
      {
        icon:"✈",
        title:"Llegar a Monterrey — MTY",
        text:"MTY — Aeropuerto Internacional General Mariano Escobedo está a ~24 km del estadio. Taxi o Uber directo al estadio: ~35 minutos, ~$250–400 MXN. Al Barrio Antiguo o San Pedro: ~30 minutos, ~$200–350 MXN.",
      },
      {
        icon:"🚇",
        title:"Ruta maestra al estadio — Metrorrey + shuttle",
        text:"Metrorrey Línea 1 → estación Exposición → shuttle FIFA o caminata (~1.5 km). El Metrorrey conecta desde Barrio Antiguo (Cuauhtémoc → Exposición: ~15 min). Tarifa: $5 MXN. FIFA operará shuttles en días de partido desde Exposición hasta el estadio.",
      },
      {
        icon:"🏟",
        title:"Al estadio el día del partido",
        text:"Metrorrey hasta Exposición, luego shuttle o caminata señalizada de 1.5 km. Alternativa: Uber con drop-off habilitado cerca de la Puerta D. En días de partido: el Uber al regreso puede tardar 35–50 minutos de espera. Si usas Uber de regreso, solicítalo antes de que termine el partido.",
      },
      {
        icon:"⚠️",
        title:"Advertencia crítica — calor extremo",
        text:"En junio, Monterrey puede superar los 40°C durante el día. El estadio tiene techumbre parcial — muchas zonas quedan expuestas al sol. Hidratación antes del partido no es opcional: sombrero, protector solar y dos litros de agua antes de entrar. El estadio limita los contenedores al ingreso — verifica la normativa FIFA antes del partido.",
        isWarning:true,
      },
    ],
    timings:[
      { label:"Desde Barrio Antiguo (Metrorrey + shuttle)", value:"~25 min" },
      { label:"Desde San Pedro (Metrorrey, transbordo)",    value:"~35 min" },
      { label:"Desde MTY (aeropuerto) en Uber al estadio",  value:"~35 min" },
      { label:"Uber desde Barrio Antiguo (día de partido)", value:"35–50 min + posible surge" },
    ],
    matchDayCronologia:{
      matchName:"19 Jun · Túnez vs. Japón · 23:00 CT",
      steps:[
        { time:"H-4:00", text:"Cena temprana en Barrio Antiguo. Es un partido de medianoche — come bien antes de las 8pm." },
        { time:"H-2:30", text:"Desplázate al Metrorrey. Línea 1 desde Cuauhtémoc hacia Exposición." },
        { time:"H-1:30", text:"Llegada al estadio. Puertas abiertas. La noche refresca — el juego nocturno tiene otra textura en Monterrey." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo. El calor del día ya no aplica a las 11pm — es el mejor horario de la sede." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:45", text:"Son las 2:00am. Salida inmediata — la oferta de transporte nocturno es limitada. Metrorrey último servicio varía; confirma horario antes del partido." },
      ],
    },
    timing:"El estadio está en Guadalupe, a ~6 km del centro. El Metrorrey es la ruta más confiable en días de partido. Para el partido nocturno del 19 de junio (23:00 CT), confirma el horario de último servicio del Metrorrey y ten Uber como respaldo.",
    cost:"Más accesible que CDMX, comparable a Guadalajara. Los precios subirán en fechas de partido, pero el margen de aumento es menor que en la capital. El gasto real en esta sede es hidratación y protector solar.",
  },

  vibeCards:[
    {
      title:"FIFA Fan Festival™ @ Parque Fundidora",
      type:"Fan fest oficial",
      typeColor:T.coral,
      desc:"Una acería del siglo XIX convertida en parque urbano de 140 hectáreas. El Fan Fest de Monterrey tiene uno de los mejores contextos físicos del torneo: chimeneas industriales de fondo, espacio abierto generoso y programación con artistas internacionales confirmados. Acceso por Metrorrey Línea 1, estación Parque Fundidora. Gratuito.",
      tag:"Sin boleto OK",
    },
    {
      title:"Macroplaza / Explanada de los Héroes",
      type:"Pantalla exterior",
      typeColor:T.fjord,
      desc:"La plaza cívica más grande de América Latina — cuatro veces el Zócalo — tiene capacidad para transmisiones masivas sin instalaciones adicionales. La vista al Cerro de la Silla desde la explanada convierte cualquier partido nocturno en algo difícil de olvidar.",
      tag:"Centro",
    },
    {
      title:"Paseo Santa Lucía",
      type:"Corredor fluvial",
      typeColor:T.sage,
      desc:"El canal navegable de 2.5 km que conecta el Parque Fundidora con la Macroplaza tiene puentes, terrazas y restaurantes que instalan pantallas durante el torneo. Ver el partido sentado a la orilla del agua, con el skyline de fondo, es el plan menos masivo y más disfrutable de la sede.",
      tag:"Tranquilo",
    },
    {
      title:"Estadio Tecnológico (ITESM)",
      type:"Transmisión histórica",
      typeColor:T.pine,
      desc:"La antigua casa de los Rayados antes del BBVA fue sede mundialista en 1970 y 1986. El campus del Tec puede activar espacios exteriores con pantallas para los partidos de mayor perfil. Ver el fútbol con historia en un estadio con historia.",
      tag:"Histórico",
    },
    {
      title:"La Fe Restaurante (Barrio Antiguo)",
      type:"Norteño contemporáneo",
      typeColor:"#2D6B4A",
      desc:"Cocina norteña con técnica más cuidada que el promedio. El lugar más honesto para entender cómo come Monterrey cuando quiere hacerlo bien — arrachera, frijoles charros, pantallas de buen tamaño sin sacrificar la experiencia gastronómica.",
      tag:"Barrio Antiguo",
    },
    {
      title:"Bola Ocho Restaurant & Bar (San Pedro)",
      type:"Sports bar",
      typeColor:"#1A3A5C",
      desc:"Amplio sports bar con mesas de billar, pantallas de gran formato y el ambiente de fútbol más internacional de Monterrey. El punto de encuentro habitual de quienes siguen la Premier League en la ciudad. Para la sede con más calor del torneo, el A/C de Bola Ocho también es un argumento.",
      tag:"Sports bar",
    },
  ],

  food:[
    { dish:"La Fe Restaurante",   where:"Barrio Antiguo — arrachera + frijoles charros; norteño contemporáneo, pantallas de buen tamaño",       price:"$$",  type:"Norteño" },
    { dish:"La Catarina",         where:"San Pedro — corte a elegir + queso fundido; asador, ruidoso y apasionado en días de partido",            price:"$$$", type:"Asador" },
    { dish:"Bola Ocho",           where:"San Pedro — alitas + cervezas de barril; sports bar con A/C, el más internacional de Monterrey",        price:"$$",  type:"Sports bar" },
    { dish:"Cabrito al pastor",   where:"Cualquier asador del Barrio Antiguo o el centro — el plato más emblemático de la cocina norteña",        price:"$$",  type:"Imperdible" },
    { dish:"Taquería de machacado", where:"Barrio Antiguo o mercado de San Luisito — machacado con huevo, el desayuno regiomontano de referencia", price:"$",   type:"Desayuno" },
  ],

  experiences:[
    {
      title:"Parque Fundidora + Paseo Santa Lucía",
      duration:"Medio día",
      desc:"El Parque Fundidora es la reconversión más exitosa de espacio industrial en México: 140 hectáreas con el MARCO de Arte Contemporáneo a cuadras, patinódromo, lago artificial y los altos hornos originales que se pueden recorrer. El Paseo Santa Lucía es un canal navegable de 2.5 km que conecta el parque con la Macroplaza en trajinera — 45 minutos de recorrido, la forma más tranquila de orientarse en la ciudad.",
      type:"Urbano",
      affiliateLink:"AFFILIATE_LINK_MTY_FUNDIDORA",
      affiliateLabel:"Tour por Parque Fundidora",
    },
    {
      title:"Grutas de García",
      duration:"Medio día",
      desc:"A 45 kilómetros al noroeste, en el municipio de García, estas grutas son una de las formaciones geológicas más grandes y accesibles del noreste de México. El acceso incluye un teleférico. Recomendable en horario matutino para evitar el calor de la tarde. Se puede ir y volver en medio día con transporte propio o tour desde el centro.",
      type:"Aventura",
      affiliateLink:"AFFILIATE_LINK_MTY_GRUTAS",
      affiliateLabel:"Tours a las Grutas de García",
    },
    {
      title:"Museo de Historia Mexicana + Museo del Noreste",
      duration:"Mañana",
      desc:"Dos museos en el mismo complejo frente al Río Santa Catarina en el centro. El de Historia ofrece un recorrido cronológico desde las culturas prehispánicas hasta el siglo XX; el del Noreste profundiza en la historia regional. Acceso económico, bien climatizado — lo agradecerás en junio — y a quince minutos caminando del Barrio Antiguo.",
      type:"Cultural",
      affiliateLink:"AFFILIATE_LINK_MTY_MUSEOS",
      affiliateLabel:"Ver museos del centro de Monterrey",
    },
  ],

  itinerary:[
    {
      day:1,
      title:"Llegada y primer pulso",
      subtitle:"Barrio Antiguo · Macroplaza · Paseo Santa Lucía",
      isMatchDay:false,
      steps:[
        { time:"Llegada",   text:"Uber desde MTY al Barrio Antiguo (~30 min, ~$250 MXN). Monterrey es compacta para sus dimensiones y más fácil de orientar que CDMX." },
        { time:"Tarde",     text:"Macroplaza. La plaza cívica más grande de América Latina con el Cerro de la Silla al fondo. La vista que ningún turista espera de una ciudad industrial." },
        { time:"Atardecer", text:"Paseo Santa Lucía. El canal navegable desde la Macroplaza hasta Parque Fundidora. Restaurantes con terraza, skyline al fondo." },
        { time:"Noche",     text:"Barrio Antiguo. La única zona con vida en la calle después de las 11pm — calles empedradas, taquerías y cervecerías artesanales." },
      ],
    },
    {
      day:2,
      title:"Día de partido — Túnez vs. Japón",
      subtitle:"Estadio BBVA · Vie 19 Jun · 23:00 CT · Partido de medianoche",
      isMatchDay:true,
      matchRef:"m2",
      steps:[
        { time:"H-4:00", text:"Cena temprana en el Barrio Antiguo — es un partido de medianoche. Come bien antes de las 8pm." },
        { time:"H-2:30", text:"Metrorrey Línea 1 desde Cuauhtémoc hacia Exposición. Sin prisa — la ciudad de noche es diferente." },
        { time:"H-1:30", text:"Shuttle FIFA desde Exposición o caminata señalizada al estadio. La noche refresca — el juego nocturno tiene otra textura en Monterrey." },
        { time:"23:00",  text:"Túnez vs. Japón. Medianoche local. El calor del día no aplica a esta hora — es el mejor horario de la sede." },
        { time:"H+1:45", text:"Son las 2:00am. Salida inmediata. Confirma horario de último Metrorrey antes del partido y ten Uber como respaldo." },
      ],
    },
    {
      day:3,
      title:"Grutas de García y Parque Fundidora",
      subtitle:"Grutas de García · 45 km · Regreso al Parque Fundidora",
      isMatchDay:false,
      steps:[
        { time:"Mañana",   text:"Salida temprana hacia las Grutas de García (~45 km, tour organizado o auto propio). Teleférico incluido en el acceso." },
        { time:"Mediodía", text:"Regreso a la ciudad. Almuerzo en el Barrio Antiguo — cabrito al pastor o machacado con huevo." },
        { time:"Tarde",    text:"Parque Fundidora: altos hornos originales, lago artificial, MARCO de Arte Contemporáneo." },
        { time:"Noche",    text:"Cervecería artesanal en el Barrio Antiguo. La escena de cerveza artesanal de Monterrey es la más desarrollada del noreste de México." },
      ],
    },
    {
      day:4,
      title:"Día de partido — Sudáfrica vs. Corea del Sur",
      subtitle:"Estadio BBVA · Mié 24 Jun · 20:00 CT",
      isMatchDay:true,
      matchRef:"m3",
      steps:[
        { time:"H-3:00", text:"Tarde libre. Museo de Historia Mexicana o paseo por la Macroplaza antes del partido." },
        { time:"H-2:00", text:"Metrorrey Línea 1 hacia Exposición. Shuttle al estadio." },
        { time:"H-1:30", text:"Llegada al estadio. Sudáfrica vs. Corea del Sur — jornada final del Grupo A, simultánea con Rep. Checa vs. México en CDMX." },
        { time:"20:00",  text:"Partido. El calor del mediodía ya cedió. Monterrey en la noche es otra ciudad." },
        { time:"Post",   text:"Regreso por Metrorrey. La Catarina en San Pedro o el Barrio Antiguo para el post-partido." },
      ],
    },
  ],

  lagomTips:[
    "El calor de Monterrey en junio no es opcional. El estadio tiene techumbre parcial — muchas zonas quedan expuestas al sol. Sombrero, protector solar y dos litros de agua antes de entrar. Para los partidos diurnos o vespertinos, esto no es consejo de guía turística: es instrucción de seguridad.",
    "El partido de las 23:00 del 19 de junio (Túnez vs. Japón) es la trampa logística más específica de esta sede. Confirma el horario de último servicio del Metrorrey antes de asistir y ten Uber como respaldo para el regreso pasada la medianoche.",
    "La ruta correcta al estadio es Metrorrey Línea 1 → estación Exposición → shuttle FIFA o caminata de 1.5 km. El Metrorrey opera en carril exclusivo — el tráfico de partido no lo afecta.",
    "Monterrey es la capital de la carne asada en México. No porque los norteños lo proclamen — sino porque la tradición del asado como evento social tiene aquí una consistencia que pocas ciudades del país replican. El cabrito al pastor es la experiencia gastronómica imprescindible de la sede.",
  ],

  matchDayChecklist:[
    "Boleto digital del partido — app FIFA (sin versión en papel)",
    "Efectivo MXN o tarjeta para Metrorrey (~$5 MXN)",
    "Ruta: Metrorrey Línea 1 → Exposición → shuttle o caminata al BBVA",
    "Sombrero y protector solar (partidos con sol); hidratación antes de entrar",
    "Verificar normativa FIFA sobre contenedores de bebidas permitidos",
    "Para partido de medianoche (19 jun): confirmar último servicio del Metrorrey",
    "Llegada al estadio 90 min antes — puertas abren H-1:30",
    "Reserva de hotel confirmada para noches de partido",
  ],

  didYouKnow:"El Estadio BBVA fue diseñado por Populous — los mismos arquitectos del Tottenham Hotspur Stadium y el Yankee Stadium — con el objetivo explícito de que ningún espectador esté a más de 9 metros del campo. El diseño mantiene la presión sonora de la tribuna dentro del recinto de una manera que pocos estadios del mundo replican. La Sierra Madre al fondo no estaba en los planos de Populous, pero nadie se queja.",

  closingNote:"Monterrey no vende postal. Vende precisión: una ciudad que construyó las industrias del país y ahora recibe al mundo con la misma lógica que siempre la ha guiado — sin adorno innecesario, con resultado concreto. El Estadio BBVA es el estadio de fútbol más moderno de México. La Sierra Madre es el telón de fondo más honesto que puede tener un partido. LagomPlan no te pide que te enamores de la ciudad. Solo que llegues con agua, con reserva confirmada y con la certeza de que en Monterrey, el fútbol se vive en serio.",
  closingSignature:"Lagomplan · Guía de campo · Monterrey · Mundial 2026",
  plannerCTA:"Generar mi viaje a Monterrey",
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATION — Monterrey
// ─────────────────────────────────────────────────────────────────────────────
const MtyIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#E8EDF2" rx={RADIUS} />
    <rect x="0" y="0" width="280" height="80" fill="#F0EDE8" opacity="0.6" />
    {/* Sierra Madre — Cerro de la Silla iconic shape */}
    <polygon points="100,90 140,22 180,90" fill="#2D4F6C" opacity="0.5" />
    <polygon points="60,90 105,35 150,90" fill="#3A6080" opacity="0.4" />
    <polygon points="150,90 185,45 220,90" fill="#2D4F6C" opacity="0.35" />
    {/* Cerro de la Silla saddle hint */}
    <path d="M125,42 Q140,22 155,42" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6" />
    {/* Industrial chimneys — Fundidora */}
    <rect x="10" y="55" width="5" height="35" fill="#2D4F6C" opacity="0.4" rx={1} />
    <rect x="19" y="48" width="5" height="42" fill="#2D4F6C" opacity="0.45" rx={1} />
    <rect x="28" y="52" width="5" height="38" fill="#2D4F6C" opacity="0.38" rx={1} />
    {/* Smoke from chimneys */}
    <circle cx="12" cy="53" r="3" fill="#9A9A94" opacity="0.25" />
    <circle cx="21" cy="46" r="3" fill="#9A9A94" opacity="0.2" />
    {/* City skyline */}
    <rect x="40" y="64" width="7"  height="26" fill="#2D4F6C" opacity="0.28" rx={1} />
    <rect x="51" y="58" width="9"  height="32" fill="#2D4F6C" opacity="0.32" rx={1} />
    <rect x="64" y="62" width="6"  height="28" fill="#2D4F6C" opacity="0.22" rx={1} />
    {/* Estadio BBVA oval */}
    <ellipse cx="225" cy="108" rx="36" ry="12" fill="#2D4F6C" opacity="0.16" />
    <ellipse cx="225" cy="108" rx="26" ry="8"  fill="#2D4F6C" opacity="0.10" />
    {/* Flag */}
    <text x="258" y="50" fontSize="20" textAnchor="middle">🇲🇽</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({ children, style={}, onClick, hover=false }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => hover && setIsHovered(true)} onMouseLeave={() => hover && setIsHovered(false)}
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
          {match.tag && <span style={{ ...uf(9,700), letterSpacing:"0.08em", textTransform:"uppercase", color: match.highlight ? T.matchGold : CITY_ACCENT, background: match.highlight ? T.matchGoldLight : CITY_ACCENT+"15", border:`1px solid ${match.highlight ? T.matchGold+"50" : CITY_ACCENT+"35"}`, padding:"4px 10px", borderRadius:40, flexShrink:0, maxWidth:160, textAlign:"right" }}>{match.tag}</span>}
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
        {!isTBD ? (
          <button onClick={() => onPlanAround && onPlanAround(match)} style={{ width:"100%", padding:"10px", background:"transparent", border:`1px solid ${T.sandDark}`, borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkMid, cursor:"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=CITY_ACCENT; e.currentTarget.style.color=T.pine; e.currentTarget.style.background=T.sageLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=T.sandDark; e.currentTarget.style.color=T.inkMid; e.currentTarget.style.background="transparent"; }}>
            <span style={{ fontSize:12 }}>✦</span> Planear mi viaje alrededor de este partido
          </button>
        ) : (
          <div style={{ ...uf(12,400), color:T.inkFaint, textAlign:"center", padding:"8px 0", fontStyle:"italic" }}>Rival por definir al terminar fase de grupos</div>
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
    <div style={{ width:40, height:40, flexShrink:0, background:item.isWarning ? T.coral+"20" : T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{item.icon}</div>
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
        <p style={{ ...uf(16, 700), color:T.pine, lineHeight:1.4, marginBottom:16 }}>¿Listo para tu versión del Mundial? Convierte esta guía en un itinerario adaptado a tus tiempos y presupuesto.</p>
        <button onClick={onPlan} style={{ width:"100%", padding:"11px 16px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.82"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
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
    <div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}><MtyIllustration /></div>
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
      onMouseEnter={e => e.currentTarget.style.color=T.pine} onMouseLeave={e => e.currentTarget.style.color=T.inkFaint}>← Guías</button>
    <span style={{ ...uf(14, 700), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>Monterrey</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{ ...uf(10, active===item.id ? 700 : 500), letterSpacing:"0.08em", textTransform:"uppercase", color: active===item.id ? T.pine : T.inkFaint, background:"none", border:"none", padding:"0 13px", height:"100%", cursor:"pointer", borderBottom:`2px solid ${active===item.id ? T.coral : "transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0 }}>{item.label}</button>
    ))}
  </div>
);

const GuideDetail = ({ guide, onBack }) => {
  const [active, setActive] = useState("matches");
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
      obs.observe(el); observers.push(obs);
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

            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos" subtitle="4 partidos confirmados en el Estadio BBVA. Atención al partido de medianoche del 19 de junio — la trampa logística más específica de esta sede." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {guide.matches.map(match => <MatchCard key={match.id} match={match} onPlanAround={() => {}} />)}
              </div>
            </section>

            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title="Manifiesto de campo" subtitle="Lo que necesitas saber antes de llegar — y lo que el calor de junio no perdona." />
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

            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso" subtitle="Refugios seleccionados para recargar energías con el Cerro de la Silla de fondo." />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>
                    El partido del 24 de junio y la Ronda de 32 del 29 de junio son las fechas de mayor demanda. Para el partido nocturno del 19 de junio (23:00 CT), confirma alojamiento y transporte de regreso antes de asistir — salir del estadio a medianoche sin plan claro es la trampa más común de esta sede.
                  </p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay => <StayCard key={stay.name} stay={stay} />)}
              </div>
            </section>

            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente" subtitle="Parque Fundidora, la Macroplaza y el Paseo Santa Lucía." />
              <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe ? 28 : 0, maxWidth:640, ...(showVibe ? {} : { display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>
                {guide.vibe.body}
              </p>
              {showVibe && (<><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>{guide.vibeCards.map(item => <CollapsibleVibeCard key={item.title} item={item} />)}</div><LagomNote>{guide.vibe.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} />
            </section>

            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio" subtitle="Metrorrey → Exposición → shuttle. Y lleva agua." />
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom: showLogistics ? 24 : 0 }}>
                {guide.logistics.transport.slice(0,2).map((item, i) => <LogisticsCard key={i} item={item} />)}
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

            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista" subtitle="La capital de la carne asada en México. El cabrito, el machacado y la cocina norteña son razones suficientes para extender la estadía." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                {guide.food.slice(0,3).map((f, i) => <FoodCard key={i} item={f} />)}
                {showFood && guide.food.slice(3).map((f, i) => <FoodCard key={i+3} item={f} />)}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} />
            </section>

            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio" subtitle="El entretiempo ideal para descubrir que hay vida — y mucha industria reconvertida — más allá de los 90 minutos." />
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {guide.experiences.slice(0,1).map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>{String(i+1).padStart(2,"0")}</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                      {exp.affiliateLink && <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"inline-flex", alignItems:"center", gap:6, ...uf(11,600), color:T.sage, letterSpacing:"0.05em", textDecoration:"none", borderBottom:`1px solid ${T.sage}50`, paddingBottom:1, transition:"color 0.15s, border-color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.color=T.pine; e.currentTarget.style.borderColor=T.pine; }} onMouseLeave={e => { e.currentTarget.style.color=T.sage; e.currentTarget.style.borderColor=`${T.sage}50`; }}>{exp.affiliateLabel} ↗</a>}
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
                      {exp.affiliateLink && <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"inline-flex", alignItems:"center", gap:6, ...uf(11,600), color:T.sage, letterSpacing:"0.05em", textDecoration:"none", borderBottom:`1px solid ${T.sage}50`, paddingBottom:1, transition:"color 0.15s, border-color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.color=T.pine; e.currentTarget.style.borderColor=T.pine; }} onMouseLeave={e => { e.currentTarget.style.color=T.sage; e.currentTarget.style.borderColor=`${T.sage}50`; }}>{exp.affiliateLabel} ↗</a>}
                    </div>
                  </div>
                ))}
              </div>
              <ShowMoreToggle expanded={showExp} onToggle={() => setShowExp(!showExp)} />
            </section>

            <section style={{ marginBottom:0 }}>
              <div style={{ background:T.pine, borderRadius:RADIUS+2, padding:"48px 44px 44px", overflow:"hidden" }}>
                <div style={{ width:32, height:2, background:T.coral, marginBottom:28, opacity:0.85 }} />
                <blockquote style={{ ...df("clamp(18px,2.4vw,24px)",400,"italic"), color:T.sand, lineHeight:1.75, margin:"0 0 24px", maxWidth:540 }}>"{guide.closingNote}"</blockquote>
                <Label color={`${T.sage}`} style={{ opacity:0.7 }}>{guide.closingSignature}</Label>
              </div>
            </section>

          </div>
          <div style={{ position:"sticky", top:64, alignSelf:"flex-start", paddingBottom:48 }}>
            <GuideSidebar guide={guide} onPlan={() => alert("Planificador: Monterrey")} />
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
      <GuideDetail guide={MTY} onBack={() => {}} />
    </>
  );
}
