import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#8B2635'

export const es: CityGuide = {
  id:"gdl",
  city:"Guadalajara",
  country:"México",
  state:"Jalisco",
  flag:"🇲🇽",
  accent: ACCENT,

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
    { id:"m1", date:"11 Jun", day:"Jue", time:"21:00 CT", teams:[{name:"Corea del Sur",flag:"🇰🇷"},{name:"Rep. Checa",flag:"🇨🇿"}], stadium:"Estadio Akron", tag:"Grupo A — apertura de la sede", highlight:false },
    { id:"m2", date:"18 Jun", day:"Jue", time:"20:00 CT", teams:[{name:"México",flag:"🇲🇽"},{name:"Corea del Sur",flag:"🇰🇷"}], stadium:"Estadio Akron", tag:"Grupo A — el partido más esperado de la sede", highlight:true },
    { id:"m3", date:"23 Jun", day:"Mar", time:"21:00 CT", teams:[{name:"Colombia",flag:"🇨🇴"},{name:"Rep. Dem. del Congo",flag:"🇨🇩"}], stadium:"Estadio Akron", tag:"Grupo K", highlight:false },
    { id:"m4", date:"26 Jun", day:"Vie", time:"19:00 CT", teams:[{name:"Uruguay",flag:"🇺🇾"},{name:"España",flag:"🇪🇸"}], stadium:"Estadio Akron", tag:"Grupo H — la joya táctica del calendario", highlight:true },
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
      { name:"FIFA Fan Festival™ @ Plaza Liberación", type:"Fan Fest oficial", typeColor:CORAL, desc:"El Fan Fest se instala en la Plaza Liberación del Centro Histórico con pantallas gigantes y cartel confirmado: Maná, Carlos Santana, el Potrillo Fernández y el Mariachi Vargas de Tecalitlán. Espacios satélite en Zapopan (Parque Rojo y Plaza Las Américas). Acceso por BRT al centro histórico.", tag:"Sin boleto OK" },
      { name:"Glorieta de la Minerva", type:"Punto de reunión", typeColor:FJORD, desc:"El monumento más simbólico de la ciudad es el punto de reunión orgánico de cualquier celebración masiva en Guadalajara. Confirmado como punto satélite de transmisiones y posible escenario de palomazo musical improvisado. Para el 18 de junio, la Minerva va a ser el epicentro que no requiere convocatoria oficial.", tag:"Icónico" },
      { name:"Estadio Jalisco (Zona Huentitán)", type:"Transmisión histórica", typeColor:PINE, desc:"La casa histórica del fútbol en Guadalajara — donde jugó El Tri en 1970 y 1986 — puede habilitar sus exteriores para transmisiones públicas durante el torneo. Ver un partido de la selección en los alrededores del Jalisco tiene más historia que cualquier plaza de nueva construcción.", tag:"Histórico" },
      { name:"Parque Rojo (Zapopan)", type:"Zona satélite", typeColor:SAGE, desc:"Espacio verde al poniente de la ciudad, cerca del Estadio Akron, confirmado como zona satélite de transmisiones por el gobierno de Jalisco. Para el fan que quiere ambiente mundialista sin la densidad del centro histórico — y que ya tiene entrada para el partido del día siguiente.", tag:"Zapopan" },
      { name:"Bar Américas (Americana)", type:"Bar-cantina", typeColor:"#1A3A5C", desc:"El punto de reunión de los aficionados al fútbol europeo en Guadalajara. Premier League los domingos, Champions los miércoles y Mundial las 24 horas durante junio. Sistema de sonido de estadio activado en partidos relevantes. La comida de cantina — ahogadas, birria, botanas — funciona igual de bien que las pantallas.", tag:"Fútbol europeo" },
    ],
    lagomNote:"Para el 18 de junio (México vs. Corea del Sur, partido más esperado de la sede) y el 26 de junio (Uruguay vs. España), la Glorieta de la Minerva y la Plaza Liberación se llenan horas antes del inicio. El BRT hacia el estadio opera con carril confinado — la única ruta que no se detiene por el tráfico de partido.",
  },

  neighborhoods:[
    { name:"Providencia / Americana", vibe:"Base recomendada. Providencia es el barrio donde vive la clase creativa de Guadalajara: restaurantes con criterio, bares bien curados y arquitectura que mezcla colonial tardío con modernismo de los 60. La Americana está contigua con más opciones de hospedaje. Ambos conectan al centro en menos de 20 minutos por BRT. Distancia al estadio: 20–35 minutos en Uber.", best_for:"Fan WC", walk_to_stadium:"20–35 min en Uber o BRT + Uber", lagomNote:null },
    { name:"Zapopan Centro", vibe:"Opción por cercanía. Hoteles y restaurantes decentes con 15 minutos al estadio en transporte normal. Combina bien con una visita al Santuario de Zapopan — uno de los puntos religiosos más importantes del estado.", best_for:"Logística", walk_to_stadium:"~15 min al estadio", lagomNote:null },
    { name:"Tlaquepaque", vibe:"Perfecto para una tarde, no como base. Precioso para artesanías y galerías, pero logísticamente alejado tanto del estadio como del centro. Plan de día libre ideal — base de operaciones mundialista, no.", best_for:"Excursión", walk_to_stadium:"30–45 min — no recomendado como base", lagomNote:null },
  ],

  stayNeighborhoods:{
    intro:"Guadalajara escala mejor que CDMX y tiene una lógica de barrios más clara para el visitante de corta estancia. El estadio está en Zapopan — municipio conurbado al poniente de la ciudad, no en Guadalajara propiamente — lo que importa saber para planificar el transporte.",
    items:[
      { kind:"recommended", title:"Base recomendada: Providencia / Americana", body:"Providencia es el barrio donde vive la clase creativa de Guadalajara: restaurantes con criterio, bares bien curados, tiendas independientes y una arquitectura que mezcla colonial tardío con modernismo de los 60. La Americana está contigua y agrega opciones de hospedaje más variadas. Ambos conectan con el resto de la ciudad por BRT y tienen acceso al centro histórico en menos de 20 minutos. La distancia al estadio (en Zapopan, al poniente) es de 20 a 35 minutos en Uber según el tráfico." },
      { kind:"alternative", title:"Opción por cercanía: Zapopan Centro", body:"Si priorizas logística sobre ambiente, Zapopan Centro tiene hoteles y restaurantes decentes con 15 minutos al estadio en transporte normal. Combina bien con una visita al Santuario de Zapopan, uno de los puntos religiosos más importantes del estado." },
      { kind:"avoid", title:"Perfecto para una tarde, no como base: Tlaquepaque", body:"Precioso para una tarde de artesanías y galerías, pero logísticamente alejado tanto del estadio como del centro de Guadalajara. Plan de día libre ideal; base de operaciones mundialista, no." },
    ],
  },
  stays:[
    { name:"Hotel Demetria", area:"Providencia", price:"$$$", priceCAD:"Precio estimado en periodo mundialista: $150–250 USD/noche", tags:["Boutique","Cocina jaliscience","Parque Metropolitano"], note:"Dieciséis habitaciones, restaurante con cocina jaliscience seria y una estética que evita todos los clichés del boutique latinoamericano. A cuatro cuadras del Parque Metropolitano y con acceso rápido al BRT.", best_for:"Hotel boutique", url:"https://booking.stay22.com/lagomplan/dDSl_dn7B8" },
    { name:"La Villa Hostel", area:"Americana", price:"$", priceCAD:"Precio estimado en periodo mundialista: $18–45 USD/noche según tipo de habitación", tags:["Presupuesto","Habitaciones privadas","Cocina comunitaria"], note:"Hostal de gestión independiente con buen ambiente internacional, habitaciones compartidas y privadas, y cocina comunitaria. Una de las opciones más honestas de la ciudad para el viajero con presupuesto ajustado.", best_for:"Presupuesto", url:"" },
    { name:"Hyatt Regency Guadalajara", area:"López Mateos / Minerva", price:"$$$$", priceCAD:"Precio estimado en periodo mundialista: $280–480 USD/noche", tags:["Cadena internacional","BRT cercano","Minerva"], note:"En el corredor financiero de la ciudad, con acceso fácil al BRT y a la red de restaurantes de Zapopan. Infraestructura completa de cadena internacional — a precios que, comparados con CDMX en periodo mundialista, se sienten casi razonables.", best_for:"Lujo", url:"https://booking.stay22.com/lagomplan/MVkiwMYOZS" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Guadalajara — GDL", text:"GDL — Aeropuerto Internacional Miguel Hidalgo y Costilla está a ~16 km del centro de Guadalajara. Aproximadamente 30 minutos al estadio en Uber o taxi ($200–350 MXN). No existe conexión directa de Metro entre el aeropuerto y el estadio — el BRT es la opción preferible desde el centro." },
      { icon:"🚌", title:"Ruta maestra al estadio — BRT Mi Macro Periférico", text:"El BRT Mi Macro Periférico tiene una estación llamada Estadio Chivas a pocos metros del Estadio Akron. Opera en carril confinado — el tráfico de partido no lo afecta. Desde Providencia o el centro, el recorrido toma entre 25 y 40 minutos. Tarifa: ~$9 MXN. Es la opción más eficiente disponible para esta sede." },
      { icon:"🏟", title:"Al estadio el día del partido", text:"BRT Mi Macro Periférico → Estación Estadio Chivas. Desde Providencia: ~30 minutos. Desde Centro Histórico: ~40 minutos. Alternativa: Uber en días sin partido de México (~20–30 min). En el 18 de junio, solo BRT — el corredor de Avenida Vallarta hacia Zapopan concentra todo el tráfico de la ciudad." },
      { icon:"⚠️", title:"Error crítico — no vayas en auto el 18 de junio", text:"El corredor de Avenida Vallarta hacia Zapopan concentra todo el tráfico de Guadalajara el día de México vs. Corea del Sur. Quien llega en auto, llega tarde o no llega. El BRT tiene carril confinado y no se detiene por el tráfico general — esta diferencia importa más que cualquier otra en esta sede.", isWarning:true },
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
    { title:"FIFA Fan Festival™ @ Plaza Liberación", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest se instala en la Plaza Liberación del Centro Histórico con pantallas gigantes y cartel confirmado: Maná, Carlos Santana, el Potrillo Fernández y el Mariachi Vargas de Tecalitlán. Espacios satélite en Zapopan (Parque Rojo y Plaza Las Américas). Acceso por BRT.", tag:"Sin boleto OK" },
    { title:"Glorieta de la Minerva", type:"Punto de reunión", typeColor:FJORD, desc:"El monumento más simbólico de Guadalajara es el epicentro de cualquier celebración masiva. Confirmado como punto satélite de transmisiones mundialistas. Para el 18 de junio (México), la Minerva va a llenarse sin que nadie la convoque formalmente.", tag:"Icónico" },
    { title:"Estadio Jalisco (Zona Huentitán)", type:"Transmisión histórica", typeColor:PINE, desc:"La casa histórica del fútbol en Guadalajara — donde jugó El Tri en el 70 y el 86 — puede habilitar sus exteriores para transmisiones públicas. Ver el partido de México en los alrededores del Jalisco tiene más historia que cualquier pantalla de nueva instalación.", tag:"Historia viva" },
    { title:"Parque Rojo (Zapopan)", type:"Zona satélite", typeColor:SAGE, desc:"Espacio verde confirmado como zona satélite de transmisiones por el gobierno de Jalisco. Cerca del Estadio Akron, para el fan que quiere ambiente mundialista sin la densidad del centro histórico.", tag:"Zapopan" },
    { title:"Bar Américas (Americana)", type:"Bar-cantina", typeColor:"#1A3A5C", desc:"El punto de reunión de los aficionados al fútbol europeo en Guadalajara. Premier League, Champions y Mundial 24 horas. Sistema de sonido de estadio en partidos relevantes. La comida de cantina — torta ahogada, birria, botanas — funciona tan bien como las pantallas.", tag:"Fútbol serio" },
    { title:"Trago Cuervo (Zapopan)", type:"Cervecería artesanal", typeColor:"#2D6B4A", desc:"Cervecería artesanal jalisciense a pocos minutos del Estadio Akron. Terraza exterior amplia, pantallas bien ubicadas y más de veinte cervezas locales. Para el día de Uruguay vs. España o México vs. Corea, llegar aquí antes del partido — o después — es el plan más sensato del corredor de Zapopan.", tag:"Pre-estadio" },
  ],

  food:[
    { dish:"Bar Américas",            where:"Americana — torta ahogada + cerveza artesanal de barril; cantina de fútbol, ruidosa en los momentos correctos", price:"$$", type:"Pre-partido" },
    { dish:"La Fonda de San Miguel",  where:"Centro Histórico — birria de res con 16 especias + tortillas hechas a mano; patio colonial, pantalla funcional", price:"$$", type:"Jaliscience" },
    { dish:"Trago Cuervo",            where:"Zapopan — IPA de temporada + taquitos de canasta; cervecería artesanal cerca del estadio", price:"$$", type:"Pre-estadio" },
    { dish:"Mercado Corona",          where:"Centro Histórico — el mercado gastronómico de referencia de la ciudad; birria, tejuino, jugos frescos", price:"$",  type:"Mercado" },
    { dish:"Torta ahogada callejera", where:"Cualquier puesto en Providencia o la Americana — la torta más emblemática de México bañada en salsa de chile de árbol", price:"$",  type:"Imperdible" },
  ],

  experiences:[
    { title:"Tequila — excursión de día", duration:"Día completo", desc:"El pueblo de Tequila está a 65 kilómetros al noreste de Guadalajara, accesible en autobús desde la Central de Autobuses en menos de 90 minutos, o en el Tequila Express los fines de semana (incluye visita a destilería y degustación). Las destilerías Herradura y Casa Cuervo ofrecen tours con reserva previa; la destilería Fortaleza es la opción artesanal más recomendada para quien quiere entender el proceso antes de beber. Regreso antes de las 7pm deja tiempo para un partido nocturno en la ciudad.", type:"Excursión", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Ver tours a Tequila" },
    { title:"Tlaquepaque + Tonalá", duration:"Día completo", desc:"Dos municipios conurbados con identidades distintas: Tlaquepaque es el barrio de galerías, cerámica talavera y el mejor Mercado de Arte Popular del estado; Tonalá es el mayoreo, donde los artesanos venden sin intermediario y los precios son considerablemente más bajos. Para el viajero con poco tiempo: Tlaquepaque en la mañana, Tonalá en la tarde. Ambos a 20 minutos del centro en Uber.", type:"Cultural", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Tour de artesanías en Tlaquepaque" },
    { title:"Lago Chapala / Ajijic", duration:"Día completo", desc:"El lago Chapala, a 45 kilómetros al sur, es el más grande de México. El pueblo de Ajijic en la ribera norte tiene restaurantes con vistas al agua que funcionan como antídoto perfecto al ritmo mundialista. Autobús directo desde la Central Camionera Sur en 55 minutos. Ideal como día de descanso entre partidos — especialmente entre el 18 y el 23 de junio.", type:"Natural", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Tours al lago Chapala" },
  ],

  itinerary:[
    { day:1, title:"Llegada y primer pulso", subtitle:"Providencia · Americana · Centro Histórico", isMatchDay:false, steps:[
      { time:"Llegada",   text:"Uber desde GDL al centro (~$200–300 MXN). Guadalajara tiene lógica de barrios clara — elige bien la base y el resto de la semana se organiza solo." },
      { time:"Tarde",     text:"Camina por Providencia y la Americana. La Avenida Chapultepec tiene la mayor concentración de bares con criterio de la ciudad." },
      { time:"Atardecer", text:"Glorieta de la Minerva. El monumento más fotogénico de la ciudad a la hora dorada." },
      { time:"Noche",     text:"Cena en Providencia. Guadalajara tiene una escena gastronómica que no necesita compararse con CDMX para ser buena." },
    ]},
    { day:2, title:"Día de partido — México vs. Corea del Sur", subtitle:"Estadio Akron · Jue 18 Jun · 20:00 CT", isMatchDay:true, matchRef:"m2", steps:[
      { time:"H-4:00", text:"Guadalajara entera se detiene para este partido. Abastécete temprano — todo se llena antes de lo esperado." },
      { time:"H-3:00", text:"Almuerza en Providencia. La birria de res del desayuno sigue siendo el mejor pre-partido de cualquier sede mexicana." },
      { time:"H-2:00", text:"BRT Mi Macro Periférico desde tu estación más cercana hacia Estación Estadio Chivas." },
      { time:"H-1:30", text:"Llegada al Estadio Akron. Puertas abiertas. La afición mexicana llega desde temprano — el estadio va a estar ruidoso mucho antes del calentamiento." },
      { time:"20:00",  text:"México vs. Corea del Sur. El estadio más futbolero de México en el partido que el país entero ve más de cerca." },
    ]},
    { day:3, title:"Excursión a Tequila", subtitle:"65 km · Autobús desde Central · Día completo", isMatchDay:false, steps:[
      { time:"Mañana",   text:"Autobús desde Central de Autobuses hacia Tequila (~90 min, ~$80 MXN). Llega temprano para evitar el calor del mediodía." },
      { time:"Mediodía", text:"Tour en destilería Fortaleza, Herradura o Casa Cuervo — reserva con anticipación. El proceso del agave al tequila en menos de 2 horas." },
      { time:"Tarde",    text:"El pueblo tiene una sola calle principal. Comida local, mezcal artesanal, vista al volcán Tequila." },
      { time:"Regreso",  text:"Autobús de regreso antes de las 7pm — deja tiempo para el partido nocturno en la ciudad si hay uno." },
    ]},
    { day:4, title:"Día de partido — Uruguay vs. España", subtitle:"Estadio Akron · Vie 26 Jun · 19:00 CT", isMatchDay:true, matchRef:"m4", steps:[
      { time:"H-3:00", text:"Tlaquepaque en la mañana si tienes tiempo. Regreso a la base antes del mediodía." },
      { time:"H-2:00", text:"BRT desde Providencia o centro hacia Estación Estadio Chivas." },
      { time:"H-1:30", text:"Llegada al estadio. Uruguay vs. España es el partido más tácticamente interesante de la fase de grupos en cualquier sede del torneo." },
      { time:"19:00",  text:"Uruguay vs. España. Dos estilos completamente opuestos en un estadio que sabe lo que es un partido exigente." },
      { time:"Post",   text:"Regreso por BRT o Uber. Trago Cuervo en Zapopan para el post-partido si quieres alargar la noche." },
    ]},
    { day:5, title:"Lago Chapala y cierre", subtitle:"Ajijic · Lago más grande de México", isMatchDay:false, steps:[
      { time:"Mañana",   text:"Autobús desde Central Camionera Sur hacia Ajijic, ribera norte del lago Chapala (~55 min)." },
      { time:"Mediodía", text:"Almuerzo con vistas al lago. El ritmo baja — exactamente lo que se necesita después de la semana mundialista." },
      { time:"Tarde",    text:"El pueblo de Ajijic tiene galerías, artesanía local y un malecón que explica por qué hay tanta comunidad extranjera viviendo aquí." },
      { time:"Regreso",  text:"De vuelta a Guadalajara antes del atardecer. Última cena en la Americana o Providencia para cerrar el capítulo." },
    ]},
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
}

export const en: CityGuide = {
  id:"gdl",
  city:"Guadalajara",
  country:"Mexico",
  state:"Jalisco",
  flag:"🇲🇽",
  accent: ACCENT,

  tags:["Football","Food","Culture","Co-host city"],

  stadium:{ name:"Estadio Akron", capacity:"~48,000", area:"Zapopan — western edge of the city" },

  headline:"No one here asks which team you support. It's obvious before you open your mouth.",
  description:"No one here asks which team you support — it's obvious before you open your mouth. Guadalajara arrives at the World Cup with four group-stage matches, including Mexico vs. South Korea on June 18 and the tactical jewel of the calendar: Uruguay vs. Spain. Estadio Akron was built for football. The city was too.",

  scores:[
    { label:"Atmosphere", value:4 },
    { label:"Football",   value:5 },
    { label:"Food",       value:4 },
    { label:"Transit",    value:4 },
    { label:"Safety",     value:4 },
    { label:"Cost",       value:4 },
  ],

  matches:[
    { id:"m1", date:"Jun 11", day:"Thu", time:"21:00 CT", teams:[{name:"South Korea",flag:"🇰🇷"},{name:"Czech Rep.",flag:"🇨🇿"}], stadium:"Estadio Akron", tag:"Group A — host opener", highlight:false },
    { id:"m2", date:"Jun 18", day:"Thu", time:"20:00 CT", teams:[{name:"Mexico",flag:"🇲🇽"},{name:"South Korea",flag:"🇰🇷"}], stadium:"Estadio Akron", tag:"Group A — the most anticipated match in the host city", highlight:true },
    { id:"m3", date:"Jun 23", day:"Tue", time:"21:00 CT", teams:[{name:"Colombia",flag:"🇨🇴"},{name:"DR Congo",flag:"🇨🇩"}], stadium:"Estadio Akron", tag:"Group K", highlight:false },
    { id:"m4", date:"Jun 26", day:"Fri", time:"19:00 CT", teams:[{name:"Uruguay",flag:"🇺🇾"},{name:"Spain",flag:"🇪🇸"}], stadium:"Estadio Akron", tag:"Group H — tactical jewel of the calendar", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",     value:"Estadio Guadalajara (Estadio Akron)" },
      { label:"Capacity",         value:"~48,000 — FIFA configuration. Purpose-built for football, no athletic track." },
      { label:"Roof",             value:"No roof — open stadium" },
      { label:"Weather (Jun–Jul)",value:"25–29°C days · 15–17°C nights · Rainy season — short afternoon showers, sunny mornings" },
      { label:"Matches",          value:"4 confirmed — group stage only. No knockout matches at this host city." },
      { label:"Primary airport",  value:"GDL — Miguel Hidalgo y Costilla International Airport, ~16 km from downtown. ~30 min to the stadium by Uber or taxi." },
      { label:"Visa",             value:"Mexico requires no visa for most Latin American countries or many European ones. Check your embassy or consulate before flying." },
    ],
    body:"Guadalajara isn't CDMX or Monterrey. It's the city where football is practiced as philosophy long before tourists show up to watch it. Two Liga MX clubs — Chivas and Atlas — turn Estadio Akron into a battlefield every weekend, and on June 18, 2026 they turn it into the epicenter of Mexico's dream of advancing. Four group-stage matches, including the tactical jewel of the calendar: Uruguay vs. Spain on June 26. This host city has no knockout rounds. What it has are four matches that no other city in the tournament can match in density of interest. Full schedule: 🇰🇷🇨🇿 Thu Jun 11 · 21:00 CT: South Korea vs. Czech Republic (Group A — host opener); 🇲🇽🇰🇷 Thu Jun 18 · 20:00 CT: Mexico vs. South Korea (Group A — the most anticipated match in the host city); 🇨🇴🇨🇩 Tue Jun 23 · 21:00 CT: Colombia vs. DR Congo (Group K); 🇺🇾🇪🇸 Fri Jun 26 · 19:00 CT: Uruguay vs. Spain (Group H — tactical jewel of the calendar).",
    lagomNote:"June 18 (Mexico vs. South Korea) and June 26 (Uruguay vs. Spain) are the critical dates here. The first match sets the mood for the entire week in Guadalajara. The second is the most tactically interesting match in the group stage anywhere in the tournament.",
  },

  vibe:{
    body:"The city that hosts Mexico vs. South Korea on June 18 doesn't need much else to make its case. Estadio Akron becomes the loudest barricade in Group A that day — and the rest of the city celebrates without a ticket. Two Liga MX clubs (Chivas and Atlas), a stadium purpose-built for football, and a crowd that defines its cultural identity in direct relation to the ball. Tapatíos don't 'watch' football — they practice it as philosophy. Food adds to the pitch: the birthplace of the torta ahogada, birria, and tejuino. A regional cuisine that doesn't need to import influences to be relevant.",
    zones:[
      { name:"FIFA Fan Festival™ @ Plaza Liberación", type:"Official fan fest", typeColor:CORAL, desc:"The Fan Fest sets up in Plaza Liberación in the historic center with giant screens and a confirmed lineup: Maná, Carlos Santana, Alejandro Fernández, and Mariachi Vargas de Tecalitlán. Satellite sites in Zapopan (Parque Rojo and Plaza Las Américas). BRT access to the historic center.", tag:"No ticket needed" },
      { name:"Glorieta de la Minerva", type:"Meeting point", typeColor:FJORD, desc:"The city's most iconic monument is the organic meeting point for any mass celebration in Guadalajara. Confirmed as a satellite broadcast site and possible stage for an improvised mariachi set. For June 18, the Minerva will be the epicenter without anyone formally calling it.", tag:"Iconic" },
      { name:"Estadio Jalisco (Huentitán)", type:"Historic screening", typeColor:PINE, desc:"Guadalajara's historic football home — where El Tri played in 1970 and 1986 — may open its exterior grounds for public broadcasts during the tournament. Watching Mexico's match around the Jalisco carries more weight than any newly built plaza.", tag:"Historic" },
      { name:"Parque Rojo (Zapopan)", type:"Satellite zone", typeColor:SAGE, desc:"A green space on the west side, near Estadio Akron, confirmed as a satellite broadcast zone by the Jalisco state government. For the fan who wants World Cup atmosphere without the density of the historic center — and who already has a ticket for the next day.", tag:"Zapopan" },
      { name:"Bar Américas (Americana)", type:"Bar-cantina", typeColor:"#1A3A5C", desc:"The gathering point for European-football fans in Guadalajara. Premier League on Sundays, Champions on Wednesdays, and the World Cup around the clock through June. Stadium-grade sound system active for big matches. The cantina food — ahogadas, birria, botanas — works as well as the screens.", tag:"European football" },
    ],
    lagomNote:"For June 18 (Mexico vs. South Korea, the most anticipated match here) and June 26 (Uruguay vs. Spain), the Glorieta de la Minerva and Plaza Liberación fill up hours before kickoff. The BRT to the stadium runs in a dedicated lane — the only route that doesn't stop for match-day traffic.",
  },

  neighborhoods:[
    { name:"Providencia / Americana", vibe:"Recommended base. Providencia is the neighborhood where Guadalajara's creative class lives: restaurants with a point of view, well-curated bars, and architecture that mixes late colonial with 1960s modernism. Americana sits right next door with more lodging options. Both connect to downtown in under 20 minutes by BRT. Stadium distance: 20–35 min by Uber.", best_for:"WC fan", walk_to_stadium:"20–35 min by Uber or BRT + Uber", lagomNote:null },
    { name:"Zapopan Centro", vibe:"A proximity play. Decent hotels and restaurants with 15 minutes to the stadium in normal transit. Pairs well with a visit to the Santuario de Zapopan — one of the state's most important religious sites.", best_for:"Logistics", walk_to_stadium:"~15 min to the stadium", lagomNote:null },
    { name:"Tlaquepaque", vibe:"Perfect for an afternoon, not as a base. Beautiful for crafts and galleries, but logistically removed from both the stadium and downtown. Ideal off-day plan — World Cup base, no.", best_for:"Day trip", walk_to_stadium:"30–45 min — not recommended as a base", lagomNote:null },
  ],

  stayNeighborhoods:{
    intro:"Guadalajara scales better than CDMX and has a clearer neighborhood logic for short-stay visitors. The stadium is in Zapopan — a municipality bordering the city to the west, not Guadalajara proper — which matters when planning transit.",
    items:[
      { kind:"recommended", title:"Recommended base: Providencia / Americana", body:"Providencia is the neighborhood where Guadalajara's creative class lives: thoughtful restaurants, well-curated bars, independent shops, and architecture that mixes late-colonial with 1960s modernism. La Americana sits next door and adds more varied lodging. Both connect to the rest of the city via BRT and reach the historic center in under 20 minutes. The distance to the stadium (in Zapopan, to the west) runs 20 to 35 minutes by Uber depending on traffic." },
      { kind:"alternative", title:"Proximity pick: Zapopan Centro", body:"If you prioritize logistics over atmosphere, Zapopan Centro has decent hotels and restaurants at 15 minutes from the stadium by normal transit. Pairs well with a visit to the Santuario de Zapopan, one of the state's most important religious sites." },
      { kind:"avoid", title:"Perfect for an afternoon, not as a base: Tlaquepaque", body:"Lovely for an afternoon of crafts and galleries, but logistically far from both the stadium and Guadalajara's center. Ideal day-off plan; World Cup base of operations, no." },
    ],
  },
  stays:[
    { name:"Hotel Demetria", area:"Providencia", price:"$$$", priceCAD:"World Cup rates: $150–250 USD/night", tags:["Boutique","Jalisco kitchen","Parque Metropolitano"], note:"Sixteen rooms, a restaurant serving serious Jaliscense cooking, and an aesthetic that avoids every boutique-Latin-America cliché. Four blocks from Parque Metropolitano with fast BRT access.", best_for:"Boutique", url:"https://booking.stay22.com/lagomplan/dDSl_dn7B8" },
    { name:"La Villa Hostel", area:"Americana", price:"$", priceCAD:"World Cup rates: $18–45 USD/night by room type", tags:["Budget","Private rooms","Communal kitchen"], note:"An independently run hostel with a good international vibe, shared and private rooms, and a communal kitchen. One of the most honest options in the city for budget travelers.", best_for:"Budget", url:"" },
    { name:"Hyatt Regency Guadalajara", area:"López Mateos / Minerva", price:"$$$$", priceCAD:"World Cup rates: $280–480 USD/night", tags:["International chain","BRT nearby","Minerva"], note:"In the city's financial corridor, with easy BRT access and quick routes to Zapopan's restaurant grid. Full international-chain infrastructure — at prices that, compared to CDMX during the tournament, feel almost reasonable.", best_for:"Luxury", url:"https://booking.stay22.com/lagomplan/MVkiwMYOZS" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Guadalajara — GDL", text:"GDL — Miguel Hidalgo y Costilla International Airport sits ~16 km from downtown Guadalajara. Roughly 30 minutes to the stadium by Uber or taxi ($200–350 MXN). There's no direct Metro link between the airport and the stadium — BRT is the preferred option from downtown." },
      { icon:"🚌", title:"Master route to the stadium — BRT Mi Macro Periférico", text:"The BRT Mi Macro Periférico has a stop called Estadio Chivas a few meters from Estadio Akron. It runs in a dedicated lane — match-day traffic doesn't affect it. From Providencia or downtown, the trip takes 25–40 minutes. Fare: ~$9 MXN. It's the most efficient option available in this host city." },
      { icon:"🏟", title:"To the stadium on match day", text:"BRT Mi Macro Periférico → Estadio Chivas stop. From Providencia: ~30 minutes. From Centro Histórico: ~40 minutes. Alternative: Uber on non–Mexico match days (~20–30 min). On June 18, BRT only — Avenida Vallarta toward Zapopan absorbs all the city's traffic." },
      { icon:"⚠️", title:"Critical error — don't drive on June 18", text:"Avenida Vallarta toward Zapopan absorbs all of Guadalajara's traffic on the Mexico vs. South Korea match day. Whoever drives arrives late or doesn't arrive at all. The BRT has a dedicated lane and doesn't stop for general traffic — this difference matters more than any other in this host city.", isWarning:true },
    ],
    timings:[
      { label:"From Providencia via BRT",                  value:"~30 min" },
      { label:"From Centro Histórico via BRT",             value:"~40 min" },
      { label:"From GDL (airport) by Uber to the stadium", value:"~35 min" },
      { label:"Uber from Providencia (normal day)",        value:"20–30 min" },
      { label:"Uber from Providencia (match day)",         value:"35–50 min — leave buffer" },
    ],
    matchDayCronologia:{
      matchName:"Jun 18 · Mexico vs. South Korea · 20:00 CT",
      steps:[
        { time:"H-4:00", text:"On June 18 all of Guadalajara stops for this match. Stock up early — everything closes or fills up sooner than you'd expect." },
        { time:"H-3:00", text:"Eat lunch. Restaurants near the stadium will have lines hours in advance." },
        { time:"H-2:00", text:"Board the BRT from Providencia or your nearest stop toward Estadio Chivas." },
        { time:"H-1:30", text:"At the stadium. Gates open 90 minutes before kickoff." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready on your phone — no paper version." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:30", text:"Leave via the opposite route from your arrival. The BRT runs toward downtown from the same Estadio Chivas stop." },
      ],
    },
    timing:"Estadio Akron is in Zapopan, accessible by BRT but without a direct metro link. The good news: Guadalajara doesn't have CDMX's traffic chaos or Monterrey's extreme heat. The BRT with its dedicated lane is the single most important instruction in this guide for match days.",
    cost:"The best value among the three Mexican host cities. Not cheap, but reasonable by tournament standards. The Mercado Corona, the torta ahogada, and birria with 16 spices are reasons enough not to eat at the stadium.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ @ Plaza Liberación", type:"Official fan fest", typeColor:CORAL, desc:"The Fan Fest sets up in Plaza Liberación in the historic center with giant screens and a confirmed lineup: Maná, Carlos Santana, Alejandro Fernández, and Mariachi Vargas de Tecalitlán. Satellite sites in Zapopan (Parque Rojo and Plaza Las Américas). BRT access.", tag:"No ticket needed" },
    { title:"Glorieta de la Minerva", type:"Meeting point", typeColor:FJORD, desc:"Guadalajara's most iconic monument is the epicenter of any mass celebration. Confirmed as a satellite broadcast site for the World Cup. For June 18 (Mexico), the Minerva will fill up without anyone formally calling it.", tag:"Iconic" },
    { title:"Estadio Jalisco (Huentitán)", type:"Historic screening", typeColor:PINE, desc:"Guadalajara's historic football home — where El Tri played in '70 and '86 — may open its exterior grounds for public broadcasts. Watching Mexico's match around the Jalisco carries more weight than any newly installed screen.", tag:"Living history" },
    { title:"Parque Rojo (Zapopan)", type:"Satellite zone", typeColor:SAGE, desc:"A green space confirmed as a satellite broadcast zone by the Jalisco state government. Near Estadio Akron, for the fan who wants World Cup atmosphere without the density of the historic center.", tag:"Zapopan" },
    { title:"Bar Américas (Americana)", type:"Bar-cantina", typeColor:"#1A3A5C", desc:"The gathering point for European-football fans in Guadalajara. Premier League, Champions, and the World Cup 24/7. Stadium-grade sound system for big matches. The cantina food — torta ahogada, birria, botanas — works as well as the screens.", tag:"Serious football" },
    { title:"Trago Cuervo (Zapopan)", type:"Craft brewery", typeColor:"#2D6B4A", desc:"Jaliscense craft brewery a few minutes from Estadio Akron. Wide outdoor terrace, well-placed screens, and more than twenty local beers on the list. For Uruguay vs. Spain or Mexico vs. Korea, stopping here before the match — or after — is the most sensible plan in the Zapopan corridor.", tag:"Pre-stadium" },
  ],

  food:[
    { dish:"Bar Américas",            where:"Americana — torta ahogada + craft draft beer; football cantina, loud at the right moments", price:"$$", type:"Pre-match" },
    { dish:"La Fonda de San Miguel",  where:"Centro Histórico — beef birria with 16 spices + handmade tortillas; colonial patio, working screen", price:"$$", type:"Jaliscense" },
    { dish:"Trago Cuervo",            where:"Zapopan — seasonal IPA + tacos de canasta; craft brewery near the stadium", price:"$$", type:"Pre-stadium" },
    { dish:"Mercado Corona",          where:"Centro Histórico — the city's benchmark food market; birria, tejuino, fresh juices", price:"$",  type:"Market" },
    { dish:"Street-side torta ahogada", where:"Any stand in Providencia or Americana — Mexico's most emblematic sandwich drowned in árbol chile salsa", price:"$",  type:"Must try" },
  ],

  experiences:[
    { title:"Tequila — day trip", duration:"Full day", desc:"The town of Tequila sits 65 km northeast of Guadalajara, reachable by bus from the Central de Autobuses in under 90 minutes, or on the weekend Tequila Express (includes distillery visit and tasting). Herradura and Casa Cuervo offer tours by advance booking; Fortaleza is the craft option most recommended for anyone who wants to understand the process before drinking. Return by 7pm leaves time for a night match in the city.", type:"Day trip", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"See Tequila tours" },
    { title:"Tlaquepaque + Tonalá", duration:"Full day", desc:"Two neighboring municipalities with distinct identities: Tlaquepaque is galleries, talavera ceramics, and the state's best Folk Art Market; Tonalá is wholesale, where artisans sell without middlemen and prices run considerably lower. For the traveler short on time: Tlaquepaque in the morning, Tonalá in the afternoon. Both 20 minutes from downtown by Uber.", type:"Cultural", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Tlaquepaque crafts tour" },
    { title:"Lake Chapala / Ajijic", duration:"Full day", desc:"Lake Chapala, 45 km south, is Mexico's largest. The town of Ajijic on the north shore has lakeside restaurants that work as the perfect antidote to the World Cup rhythm. Direct bus from the Central Camionera Sur in 55 minutes. Ideal as a rest day between matches — especially between June 18 and 23.", type:"Nature", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Lake Chapala tours" },
  ],

  itinerary:[
    { day:1, title:"Arrival and first pulse", subtitle:"Providencia · Americana · Historic Center", isMatchDay:false, steps:[
      { time:"Arrival",  text:"Uber from GDL to downtown (~$200–300 MXN). Guadalajara has clear neighborhood logic — choose your base well and the rest of the week organizes itself." },
      { time:"Afternoon",text:"Walk through Providencia and Americana. Avenida Chapultepec has the city's densest concentration of bars with a point of view." },
      { time:"Sunset",   text:"Glorieta de la Minerva. The city's most photogenic monument at golden hour." },
      { time:"Evening",  text:"Dinner in Providencia. Guadalajara has a food scene that doesn't need to compare itself to CDMX to be good." },
    ]},
    { day:2, title:"Match day — Mexico vs. South Korea", subtitle:"Estadio Akron · Thu Jun 18 · 20:00 CT", isMatchDay:true, matchRef:"m2", steps:[
      { time:"H-4:00", text:"All of Guadalajara stops for this match. Stock up early — everything fills up sooner than you'd expect." },
      { time:"H-3:00", text:"Lunch in Providencia. Birria de res for breakfast is still the best pre-match of any Mexican host city." },
      { time:"H-2:00", text:"BRT Mi Macro Periférico from your nearest stop toward Estadio Chivas." },
      { time:"H-1:30", text:"At Estadio Akron. Gates open. Mexican fans arrive early — the stadium will be loud long before warm-ups." },
      { time:"20:00",  text:"Mexico vs. South Korea. Mexico's most football-minded stadium in the match the entire country watches closest." },
    ]},
    { day:3, title:"Day trip to Tequila", subtitle:"65 km · Bus from Central · Full day", isMatchDay:false, steps:[
      { time:"Morning", text:"Bus from the Central de Autobuses to Tequila (~90 min, ~$80 MXN). Arrive early to avoid the midday heat." },
      { time:"Midday",  text:"Distillery tour at Fortaleza, Herradura, or Casa Cuervo — book ahead. The process from agave to tequila in under 2 hours." },
      { time:"Afternoon",text:"The town has a single main street. Local food, craft mezcal, view of the Tequila volcano." },
      { time:"Return",  text:"Bus back before 7pm — leaves time for a night match in the city if there is one." },
    ]},
    { day:4, title:"Match day — Uruguay vs. Spain", subtitle:"Estadio Akron · Fri Jun 26 · 19:00 CT", isMatchDay:true, matchRef:"m4", steps:[
      { time:"H-3:00", text:"Tlaquepaque in the morning if you have time. Back to base before noon." },
      { time:"H-2:00", text:"BRT from Providencia or downtown toward Estadio Chivas." },
      { time:"H-1:30", text:"At the stadium. Uruguay vs. Spain is the most tactically interesting match in the group stage anywhere in the tournament." },
      { time:"19:00",  text:"Uruguay vs. Spain. Two completely opposite styles in a stadium that knows what a demanding match looks like." },
      { time:"Post",   text:"Back via BRT or Uber. Trago Cuervo in Zapopan for post-match if you want to stretch the night." },
    ]},
    { day:5, title:"Lake Chapala and wrap", subtitle:"Ajijic · Mexico's largest lake", isMatchDay:false, steps:[
      { time:"Morning", text:"Bus from Central Camionera Sur to Ajijic, the north shore of Lake Chapala (~55 min)." },
      { time:"Midday",  text:"Lunch with lake views. The pace drops — exactly what you need after the World Cup week." },
      { time:"Afternoon",text:"Ajijic has galleries, local crafts, and a lakefront walk that explains why so many expats live here." },
      { time:"Return",  text:"Back in Guadalajara before sunset. Last dinner in Americana or Providencia to close the chapter." },
    ]},
  ],

  lagomTips:[
    "June 18 (Mexico vs. South Korea) is the highest-demand date here. Book accommodation months in advance — Zapopan and Providencia options sell out first. June 26 (Uruguay vs. Spain) draws heavy demand from the serious-football crowd.",
    "The correct route to the stadium is BRT Mi Macro Periférico to the Estadio Chivas stop. The dedicated lane keeps match-day traffic from touching it — this difference matters more than any other in this host city.",
    "Don't drive to the stadium on June 18. Avenida Vallarta toward Zapopan absorbs all of the city's traffic. Whoever drives arrives late or doesn't arrive at all.",
    "Guadalajara has the best price-to-quality ratio of Mexico's three host cities. Mercado Corona, the torta ahogada, and birria with 16 spices are reasons enough not to eat at the stadium.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app (no paper version)",
    "MXN cash or card for the BRT (~$9 MXN)",
    "Route: BRT Mi Macro Periférico → Estadio Chivas stop",
    "Eat before leaving — restaurants near the stadium have lines hours ahead",
    "Arrive at the stadium 90 min ahead — gates open at H-1:30",
    "Light layers — 25–29°C days, 15–17°C nights, possible showers",
    "Hotel reservation confirmed for Jun 18 and Jun 26",
    "MXN cash for snacks and transit",
  ],

  didYouKnow:"Estadio Akron was designed and built exclusively for football — no athletic track — with the best sightlines of any stadium in Mexico. It's the home of Chivas, the only Liga MX club with a statutory ban on signing foreign players. For the tournament, it hosts four group-stage matches without reaching the knockout round.",
  closingNote:"Guadalajara arrives at the World Cup with something no other Mexican host city can match: the match the entire country watches closest. On June 18, Mexico and South Korea face off at Estadio Akron. The Guadalajara that spills out to celebrate — or to console — that night is a city that has carried football in the weave of its social identity for decades before tourism maps ever found it. LagomPlan gives you the judgment to make the week more than a match. The city handles the rest — and it handles it well.",
  closingSignature:"Lagomplan · Field Guide · Guadalajara · World Cup 2026",
  plannerCTA:"Generate my Guadalajara trip",
}
