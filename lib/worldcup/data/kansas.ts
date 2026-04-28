import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#7B3F8C'

export const es: CityGuide = {
  id:"kc",
  city:"Kansas City",
  country:"EE.UU.",
  state:"Missouri / Kansas",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Fútbol","BBQ","Jazz","Cuartos de Final"],

  stadium:{ name:"GEHA Field at Arrowhead Stadium", capacity:"~76,000", area:"Truman Sports Complex — 13 km al este del downtown" },

  headline:"El estadio más ruidoso del mundo al aire libre recibe al campeón defensor. Trae tapones para los oídos — y úsalos solo si los necesitas.",
  description:"El estadio más ruidoso del mundo al aire libre recibe al campeón defensor el 16 de junio. Argentina abre su torneo en Arrowhead — el estadio con el récord de 142.2 decibelios — ante una comunidad albiceleste del Medio Oeste que lleva meses esperando este momento. Seis partidos confirmados, incluyendo un Cuartos de Final el 11 de julio.",

  scores:[
    { label:"Ambiente",     value:5 },
    { label:"Fútbol local", value:4 },
    { label:"Gastronomía",  value:5 },
    { label:"Transporte",   value:3 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:3 },
  ],

  matches:[
    { id:"m1", date:"16 Jun", day:"Mar", time:"20:00 CT", teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Argelia",flag:"🇩🇿"}], stadium:"Arrowhead Stadium", tag:"Grupo J — el campeón defensor abre su torneo", highlight:true },
    { id:"m2", date:"20 Jun", day:"Sáb", time:"19:00 CT", teams:[{name:"Ecuador",flag:"🇪🇨"},{name:"Curazao",flag:"🇨🇼"}], stadium:"Arrowhead Stadium", tag:"Grupo E", highlight:false },
    { id:"m3", date:"25 Jun", day:"Jue", time:"18:00 CT", teams:[{name:"Túnez",flag:"🇹🇳"},{name:"Países Bajos",flag:"🇳🇱"}], stadium:"Arrowhead Stadium", tag:"Grupo F", highlight:false },
    { id:"m4", date:"27 Jun", day:"Sáb", time:"21:00 CT", teams:[{name:"Argelia",flag:"🇩🇿"},{name:"Austria",flag:"🇦🇹"}], stadium:"Arrowhead Stadium", tag:"Grupo J — cierre del grupo", highlight:false },
    { id:"m5", date:"3 Jul",  day:"Vie", time:"20:30 CT", teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}], stadium:"Arrowhead Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m6", date:"11 Jul", day:"Sáb", time:"20:00 CT", teams:[{name:"Cuartos de Final",flag:""},{name:"Por definir",flag:""}], stadium:"Arrowhead Stadium", tag:"Cuartos de Final", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",    value:"Kansas City Stadium (GEHA Field at Arrowhead Stadium)" },
      { label:"Aforo",           value:"~76,000 — configuración FIFA. Estadio al aire libre, sin techo. Récord mundial: 142.2 dB registrados en partido de Chiefs." },
      { label:"Techo",           value:"Sin techo — estadio abierto al aire libre" },
      { label:"Clima (jun–jul)", value:"29–34°C días · Humedad moderada · Tormentas de verano frecuentes — posibilidad de suspensión breve por rayo; protocolo FIFA prevé esperas dentro del estadio" },
      { label:"Partidos",        value:"6 confirmados — 5 grupos + 1 Ronda de 32 + 1 Cuartos de Final (11 de julio)" },
      { label:"Ubicación",       value:"Truman Sports Complex — 13 km al este del downtown de Kansas City. Sin metro ni tren al estadio." },
      { label:"Aeropuerto",      value:"MCI — Kansas City International (nuevo terminal 2023, a 24 km al norte del downtown; ConnectKC26 Airport Direct al centro)" },
      { label:"Visa / ESTA",     value:"Ciudadanos del Programa de Exención de Visa necesitan ESTA aprobado antes de volar. Otros requieren visa B-2. Tramita en travel.state.gov." },
    ],
    body:"Kansas City es la sede que menos explicación necesita y que más sorprende a quien la visita sin haber estado antes. El estadio más ruidoso del mundo al aire libre. El campeón defensor en el partido inaugural de la ciudad el 16 de junio. La BBQ más seria del continente a precios que no requieren disculpa. Argentina podría regresar para el Cuartos de Final del 11 de julio — y la comunidad albiceleste de Chicago, Nueva York y Miami tiene esa fecha en el radar.",
    lagomNote:"El partido de Argentina el 16 de junio y el Cuartos de Final del 11 de julio son las dos fechas de mayor demanda. Para el Cuartos, los equipos no se conocen hasta el 4 de julio — reserva con tarifa cancelable y confirma en cuanto salgan los cruces. El pase ConnectKC26 Stadium Direct se agota para estos partidos.",
  },

  vibe:{
    body:"Arrowhead tiene el récord mundial de decibelios en estadio al aire libre — 142.2 dB. El diseño de cuenco abierto concentra el ruido hacia el campo. Cuando Argentina juega aquí el 16 de junio, la comunidad albiceleste del Medio Oeste va a demostrar por qué ese diseño importa. Sporting KC tiene una de las barras organizadas más activas de la MLS — los Cauldron llevan años construyendo una cultura de tribuna seria. Kansas City tiene también el CPKC Stadium, el primer estadio construido específicamente para un equipo profesional femenino en el mundo. Y la BBQ: la capital mundial del burnt end, la salsa dulce-picante y la discusión más seria del continente sobre qué ciudad cocina mejor la carne.",
    lagomNote:"KC Live! Block en el Power & Light District va a ser el segundo estadio de la ciudad en el partido de Argentina. El Fan Fest en el National WWI Museum — con vistas al skyline desde el Liberty Memorial — es el punto de salida del ConnectKC26 Stadium Direct.",
  },

  neighborhoods:[
    { name:"Downtown / Power & Light District", vibe:"Base recomendada. El barrio de entretenimiento del downtown con bares con pantallas, restaurantes y acceso al KC Streetcar (gratuito). Los ConnectKC26 Stadium Direct salen del Fan Fest del National WWI Museum, a cinco minutos caminando.", best_for:"Fan WC", walk_to_stadium:"ConnectKC26 Stadium Direct (~30 min)", lagomNote:null },
    { name:"Crossroads Arts District", vibe:"Barrio con ambiente. La mayor concentración de murales callejeros y restaurantes de autor de la ciudad. A 15 minutos caminando del downtown.", best_for:"Pareja", walk_to_stadium:"ConnectKC26 Stadium Direct desde WWI Museum", lagomNote:null },
    { name:"Kansas City, Kansas (KCK)", vibe:"Para fans latinoamericanos y argentinos. La mayor comunidad latinoamericana del área metropolitana — restaurantes, bares y la Avenida Central que en días de Argentina o Ecuador replica la Calle Ocho de Miami.", best_for:"Comunidad", walk_to_stadium:"Bus o Uber desde KCK (~15 min al downtown)", lagomNote:null },
  ],

  stayNeighborhoods:{
    intro:"Kansas City tiene una lógica urbana más sencilla que otras sedes del torneo. El downtown, el Power & Light District y el Country Club Plaza concentran la mayoría de las opciones. El estadio está al este — sin metro, como Dallas con Arlington, pero con la red ConnectKC26 como solución oficial.",
    items:[
      { kind:"recommended", title:"Base recomendada: Downtown / Power & Light District", body:"El Power & Light District es el barrio de entretenimiento del downtown de Kansas City: bares con pantallas, restaurantes y acceso directo al KC Streetcar (gratuito, que conecta el Riverfront con la Union Station en 2.2 kilómetros). Los ConnectKC26 Stadium Direct buses salen desde el Fan Fest en el National WWI Museum, a cinco minutos caminando. La logística más limpia de la ciudad para los días de partido." },
      { kind:"alternative", title:"Para el ambiente de barrio: Crossroads Arts District", body:"El barrio de galerías y restaurantes de autor de Kansas City, a quince minutos caminando del downtown. El Crossroads tiene la mayor concentración de murales callejeros de la ciudad y los restaurantes más interesantes fuera del circuito turístico del Power & Light. Para el fan que quiere comer bien entre el partido del 16 y el del 20 de junio." },
      { kind:"alternative", title:"Para fans de Argentina y Ecuador: Kansas City, Kansas (KCK)", body:"Al otro lado del río Kansas, la ciudad de KCK tiene la mayor comunidad latinoamericana del área metropolitana: restaurantes mexicanos, panaderías y bares que en partidos de Argentina o Ecuador convierten la Avenida Central en algo parecido a la Calle Ocho de Miami. Acceso por bus o Uber desde el downtown en 15 minutos." },
    ],
  },
  stays:[
    { name:"Hotel Kansas City", area:"Downtown / Baltimore Avenue", price:"$$$", priceCAD:"$220–380 USD/noche (periodo mundialista)", tags:["Boutique","Logia Masónica 1914","ConnectKC26 cercano"], note:"Inaugurado en 2020 en el edificio de la Logia Masónica de 1914. Techos de 6 metros, bar de whisky americano y habitaciones sin el diseño anónimo de las cadenas. ConnectKC26 Stadium Direct sale a cuatro cuadras.", best_for:"Hotel boutique", url:"" },
    { name:"Loews Kansas City Hotel", area:"Convention Center / Downtown", price:"$$$", priceCAD:"$180–300 USD/noche (periodo mundialista)", tags:["Presupuesto calidad","Piscina","Conecta todo"], note:"La opción con mejor relación posición-servicio del downtown: habitaciones amplias, piscina, restaurante propio y acceso caminando a todas las rutas de ConnectKC26.", best_for:"Relación calidad", url:"https://booking.stay22.com/lagomplan/AZ3nVqqWKm" },
    { name:"21c Museum Hotel Kansas City", area:"Crossroads Arts District", price:"$$$", priceCAD:"$250–420 USD/noche (periodo mundialista)", tags:["Arte contemporáneo","Galería 24h","Restaurante"], note:"Hotel-museo con instalaciones permanentes, galería pública abierta las 24 horas y restaurante de referencia. Para el fan que quiere la versión más interesante de Kansas City entre partidos de Argentina.", best_for:"Arte + fútbol", url:"" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Kansas City — MCI", text:"MCI — Kansas City International tiene nuevo terminal inaugurado en 2023, a 24 km al norte del downtown. ConnectKC26 Airport Direct al centro del downtown. En Uber o taxi desde MCI al downtown: ~35 minutos, ~$40–55 USD." },
      { icon:"🚌", title:"Ruta maestra — ConnectKC26 Stadium Direct", text:"215 autobuses expresos exclusivos para portadores de boleto de partido. Salen desde cuatro puntos park-and-ride en el área metropolitana y desde el Fan Fest en el National WWI Museum (downtown). Trayecto al estadio: ~20–30 minutos. Frecuencia: cada 15–20 minutos. El pase del Stadium Direct se compra separado del boleto de partido — reserva con anticipación." },
      { icon:"🏟", title:"Al estadio — puntos park-and-ride", text:"Highway 40 & Stadium Drive (más cercano al estadio). Independence Center (este del área). Oak Park Mall (sur y Kansas). North Kansas City (único con servicio Region Direct también). El Stadium Direct tiene capacidad limitada — los pases para Argentina y el Cuartos de Final se agotan primero." },
      { icon:"⚠️", title:"Error crítico — reservar el pase Stadium Direct con anticipación", text:"Los 215 autobuses tienen capacidad limitada por partido. Los pases se venden por separado al boleto de partido. Para Argentina (16 jun) y el Cuartos (11 jul), quien llega al Fan Fest sin pase reservado tiene Uber con surge o quedarse en el Fan Fest. Las 4,000 plazas de parking del estadio se venden a través de paquetes FIFA — no en puerta el día del partido.", isWarning:true },
    ],
    timings:[
      { label:"Desde Fan Fest (WWI Museum) en Stadium Direct",    value:"~30 min" },
      { label:"Desde Highway 40 park-and-ride en Stadium Direct", value:"~15 min" },
      { label:"Desde MCI en Airport Direct + Stadium Direct",     value:"~65 min total" },
      { label:"Uber desde downtown (día de partido Argentina)",   value:"40–60 min + surge" },
    ],
    matchDayCronologia:{
      matchName:"16 Jun · Argentina vs. Argelia · 20:00 CT",
      steps:[
        { time:"H-4:00", text:"Cena temprana en el Power & Light o el Crossroads. El ambiente de Argentina antes del partido ya es de partido." },
        { time:"H-3:00", text:"Fan Fest en el WWI Museum. La comunidad albiceleste del Medio Oeste lleva horas ahí." },
        { time:"H-2:00", text:"ConnectKC26 Stadium Direct desde el Fan Fest. Pase presentado en el autobús." },
        { time:"H-1:30", text:"Llegada al estadio. El tailgate en los parking colindantes lleva horas activo." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo. Arrowhead ya está rugiendo." },
        { time:"H+0:00", text:"Partido — el campeón defensor abre su torneo en el estadio más ruidoso del mundo." },
        { time:"H+1:30", text:"ConnectKC26 de regreso. Los autobuses operan hasta que el último fan sale. No te quedes en la explanada." },
      ],
    },
    timing:"Arrowhead está en el Truman Sports Complex, 13 km al este del downtown. Sin metro. El ConnectKC26 Stadium Direct es la solución oficial — 215 buses, cuatro park-and-rides y salida desde el Fan Fest del WWI Museum. El pase se compra por separado al boleto de partido.",
    cost:"La sede más accesible del torneo en Estados Unidos. La BBQ más barata por calidad del país. Los precios suben para Argentina y el Cuartos de Final, pero el margen de aumento es menor que en cualquier ciudad costera.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ @ National WWI Museum", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest toma el terreno del único museo nacional de la Primera Guerra Mundial en EE.UU. — con la mejor vista del skyline de Kansas City desde su terraza. El Liberty Memorial como telón de fondo. Punto de salida del ConnectKC26 Stadium Direct. Acceso caminando desde el Power & Light en 12 min.", tag:"Sin boleto OK" },
    { title:"KC Live! Block (Power & Light)", type:"Pantalla exterior", typeColor:FJORD, desc:"El bloque de entretenimiento del downtown con pantallas permanentes en su plaza central. Para los partidos de Argentina, KC Live! va a ser el segundo estadio de la ciudad — sin registro, sin límite de capacidad oficial.", tag:"Sin boleto" },
    { title:"Union Station (Great Hall)", type:"Transmisión histórica", typeColor:PINE, desc:"La estación histórica de Kansas City activa su Gran Salón para eventos deportivos de alta demanda. Ver un partido de Argentina bajo las bóvedas de piedra con pantallas donde antes había tableros de horarios es el plan mundialista más inesperado de la sede.", tag:"Icónico" },
    { title:"18th & Vine (Jazz District)", type:"Jazz District", typeColor:SAGE, desc:"El corazón histórico del jazz americano en Kansas City tiene plazas exteriores que la comunidad futbolera activa para partidos de alto perfil. Para el fan de Países Bajos o Argentina con un bourbon de Missouri en la mano y jazz en vivo de al lado.", tag:"Jazz y fútbol" },
    { title:"No Other Pub (Power & Light)", type:"Bar de fútbol", typeColor:"#1A3A5C", desc:"El punto de reunión de los aficionados de Sporting KC. Pantallas en todos los ángulos, selección de cervezas artesanales de Missouri y el ambiente más entendido en fútbol del downtown. Para el partido de Argentina del 16 de junio, reserva con días de anticipación.", tag:"Sporting KC fans" },
  ],

  food:[
    { dish:"Joe's Kansas City BBQ",          where:"Sur de Kansas City — los mejores burnt ends del continente; llega antes de las 11am o espera cola",                 price:"$$", type:"Imperdible" },
    { dish:"Q39",                             where:"Westport / midtown — burnt ends de referencia y el ambiente más consistente de la BBQ de KC",                       price:"$$", type:"BBQ" },
    { dish:"No Other Pub",                    where:"Power & Light — alitas + cerveza artesanal de Missouri; el bar de fútbol más serio del downtown",                   price:"$$", type:"Pre-partido" },
    { dish:"Flying Saucer Draught Emporium",  where:"Crossroads — más de 150 cervezas en barril + pretzels artesanales; para partidos europeos nocturnos",               price:"$$", type:"Cervecería" },
    { dish:"Flea Market Bar",                 where:"18th & Vine / Jazz District — nachos + margarita o cerveza mexicana; comunidad latinoamericana activa",             price:"$",  type:"De barrio" },
  ],

  experiences:[
    { title:"18th & Vine Jazz District + Negro Leagues Baseball Museum", duration:"Medio día", desc:"El 18th & Vine District es donde nació el jazz de Kansas City en los años 30 — Charlie Parker y Count Basie pusieron este cruce en el mapa mundial. El American Jazz Museum tiene colecciones de instrumentos, grabaciones y sala de conciertos activa los fines de semana. A veinte metros, el Negro Leagues Baseball Museum documenta las ligas segregadas con una de las colecciones de béisbol más importantes del país. Los dos juntos completan un día sin auto desde el downtown.", type:"Musical", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Tours por el Jazz District de KC" },
    { title:"Union Station + Science City + Sea Life", duration:"Día completo", desc:"La Union Station de Kansas City — restaurada en 2002 — alberga Science City: museo de ciencias interactivo con 50 exhibiciones para familias ($16 adultos / $12 niños). En el mismo complejo, Sea Life Kansas City tiene tiburones, medusas y túnel acrílico subacuático ($24 adultos / $18 niños). Acceso por KC Streetcar hasta Union Station.", type:"Familia", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Science City en Union Station" },
    { title:"City Market + Strawberry Hill", duration:"Mañana", desc:"El City Market al norte del downtown opera desde 1857: productores locales, especias importadas y el mejor desayuno de fin de semana sábados y domingos de 8am a 3pm. A 10 minutos al norte, Strawberry Hill en KCK tiene la mayor concentración de restaurantes croatas y eslovenos del país — una comunidad que los partidos de Croacia y Austria van a activar.", type:"Mercado", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Tours gastronómicos en KC" },
  ],

  itinerary:[
    { day:1, title:"Llegada y primer pulso", subtitle:"Power & Light · Jazz District · Union Station", isMatchDay:false, steps:[
      { time:"Llegada",   text:"ConnectKC26 Airport Direct desde MCI al downtown (~35 min). Kansas City tiene una lógica urbana más sencilla que otras sedes del torneo." },
      { time:"Tarde",     text:"Power & Light District. KC Live! Block con las pantallas ya activas para los partidos del día." },
      { time:"Atardecer", text:"Liberty Memorial y el Fan Fest en el WWI Museum. La mejor vista del skyline de KC desde aquí." },
      { time:"Noche",     text:"18th & Vine Jazz District. Jazz en vivo, bourbon de Missouri y el ambiente que no existe en ninguna otra sede del torneo." },
    ]},
    { day:2, title:"Día de partido — Argentina vs. Argelia", subtitle:"Arrowhead Stadium · Mar 16 Jun · 20:00 CT", isMatchDay:true, matchRef:"m1", steps:[
      { time:"H-4:00", text:"Cena temprana en el Crossroads o el Power & Light. El ambiente albiceleste empieza horas antes del partido." },
      { time:"H-3:00", text:"Fan Fest en el WWI Museum. La comunidad argentina del Medio Oeste lleva ahí desde el mediodía." },
      { time:"H-2:00", text:"ConnectKC26 Stadium Direct desde el Fan Fest. El pase debe estar reservado con anticipación." },
      { time:"20:00",  text:"Argentina vs. Argelia. El estadio más ruidoso del mundo. El campeón defensor abre su torneo." },
    ]},
    { day:3, title:"BBQ y Jazz District", subtitle:"Joe's Kansas City · 18th & Vine", isMatchDay:false, steps:[
      { time:"Mañana",   text:"Joe's Kansas City BBQ antes de las 11am para evitar la cola. Los burnt ends no se negocia." },
      { time:"Mediodía", text:"Negro Leagues Baseball Museum + American Jazz Museum en 18th & Vine. Dos museos en el mismo barrio." },
      { time:"Tarde",    text:"Crossroads Arts District: murales, galerías, la escena de arte más activa de KC." },
      { time:"Noche",    text:"Jazz en vivo en alguno de los clubs del Jazz District. El único plan nocturno que justifica por sí solo el viaje." },
    ]},
  ],

  lagomTips:[
    "El pase ConnectKC26 Stadium Direct se vende por separado al boleto de partido y tiene capacidad limitada. Para Argentina (16 jun) y el Cuartos de Final (11 jul), los pases se agotan primero. Reserva en kansascityfwc26.com en cuanto abran la venta.",
    "Kansas City tiene más de 100 restaurantes de BBQ. La diferencia está en los burnt ends — las puntas del pecho de res que se caramelizan en la segunda cocción. Joe's Kansas City y Q39 sirven los mejores. Empieza por ahí y decide el resto después.",
    "Para el Cuartos de Final del 11 de julio, los equipos en juego no se conocen hasta el 4 de julio. Reserva alojamiento con tarifa cancelable para esa semana y confirma en cuanto salgan los cruces del torneo.",
    "Arrowhead ostenta el récord Guinness de estadio al aire libre más ruidoso del mundo: 142.2 decibelios registrados en partido de Chiefs. El diseño de cuenco concentra el ruido hacia el campo. El partido de Argentina va a estar a esa escala.",
  ],

  matchDayChecklist:[
    "Pase ConnectKC26 Stadium Direct reservado (separado del boleto de partido)",
    "Boleto digital del partido — app FIFA (sin versión en papel)",
    "ESTA aprobado o visa B-2 vigente",
    "Llegada al Fan Fest del WWI Museum con tiempo para el bus",
    "Ropa ligera + capa para tormentas de verano del Medio Oeste",
    "Llegada al estadio 90 min antes — puertas abren H-1:30",
    "Reserva de hotel confirmada para 16 jun y 11 jul",
    "Efectivo USD o tarjeta para BBQ, bars y transporte",
  ],

  didYouKnow:"Arrowhead Stadium ostenta el récord Guinness de estadio al aire libre más ruidoso del mundo: 142.2 decibelios, registrados durante un partido de los Kansas City Chiefs en 2014. El diseño de cuenco abierto no es solo estética — fue construido deliberadamente para concentrar el sonido hacia el campo. En junio de 2026, Argentina va a descubrir lo que significa jugar en un estadio diseñado para el ruido.",
  closingNote:"Kansas City es la sede que menos explicación necesita y que más sorprende a quien la visita sin haber estado antes. El estadio más ruidoso del mundo al aire libre. El campeón defensor en el partido inaugural de la ciudad. La BBQ más seria del continente a precios que no requieren disculpa. El ConnectKC26 resuelve el problema de transporte que el metro no puede resolver. LagomPlan te da el autobús correcto, el burnt end apropiado y la sala donde nació el jazz. El resto lo hace Arrowhead — a 142.2 decibelios de capacidad máxima.",
  closingSignature:"Lagomplan · Guía de campo · Kansas City · Mundial 2026",
  plannerCTA:"Generar mi viaje a Kansas City",

  sectionSubtitles:{
    matches:"6 partidos confirmados en Arrowhead Stadium — incluyendo Argentina vs. Argelia (16 jun) y un Cuartos de Final el 11 de julio.",
    vibe:"Fan Fest oficial en el National WWI Museum, pantallas en el Power & Light District y los bares de fútbol que Sporting KC convirtió en referencia.",
    logistics:"Sin metro al estadio. ConnectKC26 Stadium Direct es la solución oficial — el pase se compra por separado al boleto de partido.",
    food:"La BBQ más seria del continente, el Jazz District y los bares que Sporting KC convirtió en el mapa futbolero de la ciudad.",
  },
  staysWarning:"Los precios son estimaciones para el periodo mundialista. Argentina (16 jun) y el Cuartos de Final (11 jul) son las fechas más críticas. Para el Cuartos, los equipos no se conocen hasta el 4 de julio — reserva con tarifa cancelable en Power & Light o Crossroads y confirma en cuanto salgan los cruces.",
}

export const en: CityGuide = {
  id:"kc",
  city:"Kansas City",
  country:"USA",
  state:"Missouri / Kansas",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Football","BBQ","Jazz","Quarterfinal"],

  stadium:{ name:"GEHA Field at Arrowhead Stadium", capacity:"~76,000", area:"Truman Sports Complex — 13 km east of downtown" },

  headline:"The loudest open-air stadium in the world welcomes the defending champion. Bring earplugs — and only use them if you need them.",
  description:"The loudest open-air stadium in the world welcomes the defending champion on June 16. Argentina opens its tournament at Arrowhead — the stadium with the 142.2 dB world record — in front of a Midwest Argentine community that has been waiting months for this moment. Six matches confirmed, including a Quarterfinal on July 11.",

  scores:[
    { label:"Atmosphere", value:5 },
    { label:"Football",   value:4 },
    { label:"Food",       value:5 },
    { label:"Transit",    value:3 },
    { label:"Safety",     value:4 },
    { label:"Cost",       value:3 },
  ],

  matches:[
    { id:"m1", date:"Jun 16", day:"Tue", time:"20:00 CT", teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Algeria",flag:"🇩🇿"}], stadium:"Arrowhead Stadium", tag:"Group J — defending champion opens", highlight:true },
    { id:"m2", date:"Jun 20", day:"Sat", time:"19:00 CT", teams:[{name:"Ecuador",flag:"🇪🇨"},{name:"Curaçao",flag:"🇨🇼"}], stadium:"Arrowhead Stadium", tag:"Group E", highlight:false },
    { id:"m3", date:"Jun 25", day:"Thu", time:"18:00 CT", teams:[{name:"Tunisia",flag:"🇹🇳"},{name:"Netherlands",flag:"🇳🇱"}], stadium:"Arrowhead Stadium", tag:"Group F", highlight:false },
    { id:"m4", date:"Jun 27", day:"Sat", time:"21:00 CT", teams:[{name:"Algeria",flag:"🇩🇿"},{name:"Austria",flag:"🇦🇹"}], stadium:"Arrowhead Stadium", tag:"Group J — group finale", highlight:false },
    { id:"m5", date:"Jul 3",  day:"Fri", time:"20:30 CT", teams:[{name:"Round of 32",flag:""},{name:"TBD",flag:""}], stadium:"Arrowhead Stadium", tag:"Knockout stage", highlight:false },
    { id:"m6", date:"Jul 11", day:"Sat", time:"20:00 CT", teams:[{name:"Quarterfinal",flag:""},{name:"TBD",flag:""}], stadium:"Arrowhead Stadium", tag:"Quarterfinal", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",     value:"Kansas City Stadium (GEHA Field at Arrowhead Stadium)" },
      { label:"Capacity",         value:"~76,000 — FIFA configuration. Open-air stadium, no roof. World record: 142.2 dB registered during a Chiefs game." },
      { label:"Roof",             value:"No roof — fully open-air stadium" },
      { label:"Weather (Jun–Jul)",value:"29–34°C days · Moderate humidity · Frequent summer storms — possibility of brief lightning suspension; FIFA protocol allows in-stadium waits" },
      { label:"Matches",          value:"6 confirmed — 5 group + 1 Round of 32 + 1 Quarterfinal (July 11)" },
      { label:"Location",         value:"Truman Sports Complex — 13 km east of downtown Kansas City. No subway or train to the stadium." },
      { label:"Airport",          value:"MCI — Kansas City International (new 2023 terminal, 24 km north of downtown; ConnectKC26 Airport Direct to downtown)" },
      { label:"Visa / ESTA",      value:"Citizens of the Visa Waiver Program need an approved ESTA before flying. Others require a B-2 visa. Apply at travel.state.gov." },
    ],
    body:"Kansas City is the host city that needs the least explanation and most surprises first-time visitors. The loudest open-air stadium in the world. The defending champion in the city's opening match on June 16. The most serious barbecue on the continent at prices that don't need an apology. Argentina could return for the July 11 Quarterfinal — and the Argentine communities in Chicago, New York, and Miami have that date on their radar.",
    lagomNote:"Argentina on June 16 and the Quarterfinal on July 11 are the two highest-demand dates. For the Quarterfinal, the teams won't be known until July 4 — book a cancellable rate and confirm once brackets are set. The ConnectKC26 Stadium Direct pass sells out first for these matches.",
  },

  vibe:{
    body:"Arrowhead holds the world record for open-air stadium decibels — 142.2 dB. The open-bowl design channels noise toward the pitch. When Argentina plays here on June 16, the Midwest's Argentine community is going to show why that design matters. Sporting KC has one of the most active organized supporter groups in MLS — The Cauldron has been building a serious terrace culture for years. Kansas City also has CPKC Stadium, the first stadium ever built specifically for a professional women's team. And the barbecue: the world capital of burnt ends, sweet-spicy sauce, and the most serious debate on the continent about which city cooks meat better.",
    lagomNote:"KC Live! Block in the Power & Light District will be the city's second stadium for the Argentina match. The Fan Fest at the National WWI Museum — with skyline views from Liberty Memorial — is the departure point for ConnectKC26 Stadium Direct.",
  },

  neighborhoods:[
    { name:"Downtown / Power & Light District", vibe:"Recommended base. The downtown entertainment district with screens at every bar, restaurants, and KC Streetcar access (free). The ConnectKC26 Stadium Direct leaves from the National WWI Museum Fan Fest, a five-minute walk away.", best_for:"WC fan", walk_to_stadium:"ConnectKC26 Stadium Direct (~30 min)", lagomNote:null },
    { name:"Crossroads Arts District", vibe:"The atmospheric neighborhood. The city's highest concentration of street murals and chef-driven restaurants. A 15-minute walk from downtown.", best_for:"Couple", walk_to_stadium:"ConnectKC26 Stadium Direct from WWI Museum", lagomNote:null },
    { name:"Kansas City, Kansas (KCK)", vibe:"For Latin American and Argentine fans. The metro area's largest Latin American community — restaurants, bars, and Central Avenue, which on Argentina or Ecuador match days replicates Miami's Calle Ocho.", best_for:"Community", walk_to_stadium:"Bus or Uber from KCK (~15 min to downtown)", lagomNote:null },
  ],

  stayNeighborhoods:{
    intro:"Kansas City has a simpler urban logic than other host cities. Downtown, the Power & Light District, and the Country Club Plaza concentrate most options. The stadium is east — no metro, like Dallas with Arlington, but with the ConnectKC26 network as the official solution.",
    items:[
      { kind:"recommended", title:"Recommended base: Downtown / Power & Light District", body:"The Power & Light District is the entertainment heart of downtown Kansas City: bars with screens, restaurants, and direct access to the KC Streetcar (free, connecting the Riverfront to Union Station over 2.2 km). The ConnectKC26 Stadium Direct buses leave from the Fan Fest at the National WWI Museum, five minutes on foot. The cleanest match-day logistics in town." },
      { kind:"alternative", title:"For neighborhood feel: Crossroads Arts District", body:"Kansas City's gallery and chef-driven restaurant neighborhood, fifteen minutes on foot from downtown. Crossroads has the city's largest concentration of street murals and the most interesting restaurants outside the Power & Light tourist circuit. For the fan who wants to eat well between the June 16 and June 20 matches." },
      { kind:"alternative", title:"For Argentina and Ecuador fans: Kansas City, Kansas (KCK)", body:"Across the Kansas River, KCK has the metro's largest Latin American community: Mexican restaurants, bakeries, and bars that on Argentina or Ecuador match days turn Central Avenue into something close to Miami's Calle Ocho. Access by bus or Uber from downtown in 15 minutes." },
    ],
  },
  stays:[
    { name:"Hotel Kansas City", area:"Downtown / Baltimore Avenue", price:"$$$", priceCAD:"$220–380 USD/night (World Cup period)", tags:["Boutique","Masonic Lodge 1914","Near ConnectKC26"], note:"Opened in 2020 in the 1914 Masonic Lodge building. 6-meter ceilings, an American whiskey bar, and rooms without the anonymous chain-hotel design. ConnectKC26 Stadium Direct leaves four blocks away.", best_for:"Boutique", url:"" },
    { name:"Loews Kansas City Hotel", area:"Convention Center / Downtown", price:"$$$", priceCAD:"$180–300 USD/night (World Cup period)", tags:["Quality value","Pool","Connects everything"], note:"The best position-to-service ratio downtown: large rooms, pool, in-house restaurant, and walking access to every ConnectKC26 route.", best_for:"Value", url:"https://booking.stay22.com/lagomplan/AZ3nVqqWKm" },
    { name:"21c Museum Hotel Kansas City", area:"Crossroads Arts District", price:"$$$", priceCAD:"$250–420 USD/night (World Cup period)", tags:["Contemporary art","24h gallery","Restaurant"], note:"A hotel-museum with permanent installations, a public gallery open 24 hours, and a reference restaurant. For fans who want the most interesting version of Kansas City between Argentina matches.", best_for:"Art + football", url:"" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Kansas City — MCI", text:"MCI — Kansas City International has a new terminal opened in 2023, 24 km north of downtown. ConnectKC26 Airport Direct runs to downtown. Uber or taxi from MCI to downtown: ~35 minutes, ~$40–55 USD." },
      { icon:"🚌", title:"Master route — ConnectKC26 Stadium Direct", text:"215 express buses exclusively for match-ticket holders. They depart from four park-and-ride points in the metro area and from the Fan Fest at the National WWI Museum (downtown). Trip to the stadium: ~20–30 minutes. Frequency: every 15–20 minutes. The Stadium Direct pass is sold separately from the match ticket — book ahead." },
      { icon:"🏟", title:"To the stadium — park-and-ride points", text:"Highway 40 & Stadium Drive (closest to the stadium). Independence Center (east of the metro). Oak Park Mall (south and Kansas). North Kansas City (the only one with Region Direct service too). Stadium Direct has limited capacity — passes for Argentina and the Quarterfinal sell out first." },
      { icon:"⚠️", title:"Critical error — not booking the Stadium Direct pass ahead", text:"The 215 buses have limited per-match capacity. Passes are sold separately from match tickets. For Argentina (Jun 16) and the Quarterfinal (Jul 11), anyone who arrives at the Fan Fest without a reserved pass is stuck with surge Uber or staying at the Fan Fest. The stadium's 4,000 parking spots are sold through FIFA packages — not at the gate on match day.", isWarning:true },
    ],
    timings:[
      { label:"From Fan Fest (WWI Museum) on Stadium Direct",    value:"~30 min" },
      { label:"From Highway 40 park-and-ride on Stadium Direct", value:"~15 min" },
      { label:"From MCI on Airport Direct + Stadium Direct",     value:"~65 min total" },
      { label:"Uber from downtown (Argentina match day)",        value:"40–60 min + surge" },
    ],
    matchDayCronologia:{
      matchName:"Jun 16 · Argentina vs. Algeria · 20:00 CT",
      steps:[
        { time:"H-4:00", text:"Early dinner at Power & Light or Crossroads. The Argentina atmosphere before kickoff is already match-day." },
        { time:"H-3:00", text:"Fan Fest at the WWI Museum. The Midwest Argentine community has been there for hours." },
        { time:"H-2:00", text:"ConnectKC26 Stadium Direct from the Fan Fest. Pass shown on the bus." },
        { time:"H-1:30", text:"Arrive at the stadium. The tailgate in the adjacent parking lots has been going for hours." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready. Arrowhead is already roaring." },
        { time:"H+0:00", text:"Kickoff — the defending champion opens its tournament in the loudest stadium in the world." },
        { time:"H+1:30", text:"ConnectKC26 back. The buses run until the last fan leaves. Don't linger on the esplanade." },
      ],
    },
    timing:"Arrowhead sits in the Truman Sports Complex, 13 km east of downtown. No subway. The ConnectKC26 Stadium Direct is the official solution — 215 buses, four park-and-rides, and departures from the WWI Museum Fan Fest. The pass is sold separately from the match ticket.",
    cost:"The most affordable host city in the U.S. tournament. The cheapest serious barbecue in the country by quality. Prices rise for Argentina and the Quarterfinal, but the markup is smaller than in any coastal city.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ @ National WWI Museum", type:"Official fan fest", typeColor:CORAL, desc:"The Fan Fest takes over the grounds of the only U.S. national museum dedicated to World War I — with the best Kansas City skyline view from its terrace. Liberty Memorial as backdrop. Departure point for ConnectKC26 Stadium Direct. Walkable from Power & Light in 12 min.", tag:"No ticket needed" },
    { title:"KC Live! Block (Power & Light)", type:"Outdoor screen", typeColor:FJORD, desc:"The downtown entertainment block with permanent screens in its central plaza. For Argentina matches, KC Live! will be the city's second stadium — no registration, no official capacity limit.", tag:"No ticket" },
    { title:"Union Station (Great Hall)", type:"Historic broadcast", typeColor:PINE, desc:"Kansas City's historic station activates its Grand Hall for high-demand sporting events. Watching an Argentina match under stone vaults with screens where timetables once hung is the most unexpected World Cup plan in the venue.", tag:"Iconic" },
    { title:"18th & Vine (Jazz District)", type:"Jazz District", typeColor:SAGE, desc:"The historic heart of American jazz in Kansas City has outdoor plazas the football community activates for high-profile matches. For Netherlands or Argentina fans with a Missouri bourbon in hand and live jazz next door.", tag:"Jazz and football" },
    { title:"No Other Pub (Power & Light)", type:"Football bar", typeColor:"#1A3A5C", desc:"The gathering point for Sporting KC supporters. Screens at every angle, a selection of Missouri craft beers, and the most knowledgeable football atmosphere downtown. For the June 16 Argentina match, book days ahead.", tag:"Sporting KC fans" },
  ],

  food:[
    { dish:"Joe's Kansas City BBQ",          where:"South Kansas City — the best burnt ends on the continent; arrive before 11am or wait in line",          price:"$$", type:"Must try" },
    { dish:"Q39",                             where:"Westport / midtown — reference burnt ends and the most consistent atmosphere in KC barbecue",          price:"$$", type:"BBQ" },
    { dish:"No Other Pub",                    where:"Power & Light — wings + Missouri craft beer; the most serious football bar downtown",                  price:"$$", type:"Pre-match" },
    { dish:"Flying Saucer Draught Emporium",  where:"Crossroads — 150+ beers on tap + artisan pretzels; for European evening matches",                       price:"$$", type:"Beer hall" },
    { dish:"Flea Market Bar",                 where:"18th & Vine / Jazz District — nachos + margarita or Mexican beer; active Latin American community",    price:"$",  type:"Neighborhood" },
  ],

  experiences:[
    { title:"18th & Vine Jazz District + Negro Leagues Baseball Museum", duration:"Half day", desc:"The 18th & Vine District is where Kansas City jazz was born in the 1930s — Charlie Parker and Count Basie put this intersection on the world map. The American Jazz Museum has collections of instruments, recordings, and a concert hall active on weekends. Twenty meters away, the Negro Leagues Baseball Museum documents the segregated leagues with one of the most important baseball collections in the country. Together they make a complete no-car day from downtown.", type:"Musical", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"KC Jazz District tours" },
    { title:"Union Station + Science City + Sea Life", duration:"Full day", desc:"Kansas City's Union Station — restored in 2002 — houses Science City: an interactive science museum with 50 family exhibits ($16 adults / $12 kids). In the same complex, Sea Life Kansas City has sharks, jellyfish, and an underwater acrylic tunnel ($24 adults / $18 kids). Access via KC Streetcar to Union Station.", type:"Family", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"Science City at Union Station" },
    { title:"City Market + Strawberry Hill", duration:"Morning", desc:"The City Market north of downtown has been running since 1857: local producers, imported spices, and the best weekend breakfast Saturdays and Sundays 8am–3pm. Ten minutes north, Strawberry Hill in KCK holds the country's highest concentration of Croatian and Slovenian restaurants — a community the Croatia and Austria matches will activate.", type:"Market", affiliateLink:"https://getyourguide.stay22.com/lagomplan/s1vPPVVq1r", affiliateLabel:"KC food tours" },
  ],

  itinerary:[
    { day:1, title:"Arrival and first pulse", subtitle:"Power & Light · Jazz District · Union Station", isMatchDay:false, steps:[
      { time:"Arrival", text:"ConnectKC26 Airport Direct from MCI to downtown (~35 min). Kansas City has a simpler urban logic than other host cities." },
      { time:"Afternoon", text:"Power & Light District. KC Live! Block with screens already on for the day's matches." },
      { time:"Evening", text:"Liberty Memorial and the Fan Fest at the WWI Museum. The best KC skyline view from here." },
      { time:"Night", text:"18th & Vine Jazz District. Live jazz, Missouri bourbon, and an atmosphere that doesn't exist at any other host city." },
    ]},
    { day:2, title:"Match day — Argentina vs. Algeria", subtitle:"Arrowhead Stadium · Tue Jun 16 · 20:00 CT", isMatchDay:true, matchRef:"m1", steps:[
      { time:"H-4:00", text:"Early dinner at Crossroads or Power & Light. The Argentine atmosphere starts hours before kickoff." },
      { time:"H-3:00", text:"Fan Fest at the WWI Museum. The Midwest Argentine community has been there since midday." },
      { time:"H-2:00", text:"ConnectKC26 Stadium Direct from the Fan Fest. The pass must be booked ahead." },
      { time:"20:00",  text:"Argentina vs. Algeria. The loudest stadium in the world. The defending champion opens its tournament." },
    ]},
    { day:3, title:"BBQ and Jazz District", subtitle:"Joe's Kansas City · 18th & Vine", isMatchDay:false, steps:[
      { time:"Morning", text:"Joe's Kansas City BBQ before 11am to skip the line. Burnt ends are not up for debate." },
      { time:"Midday",  text:"Negro Leagues Baseball Museum + American Jazz Museum at 18th & Vine. Two museums in the same neighborhood." },
      { time:"Afternoon", text:"Crossroads Arts District: murals, galleries, the most active art scene in KC." },
      { time:"Night",   text:"Live jazz at one of the Jazz District clubs. The only nightlife plan that alone justifies the trip." },
    ]},
  ],

  lagomTips:[
    "The ConnectKC26 Stadium Direct pass is sold separately from the match ticket and has limited capacity. For Argentina (Jun 16) and the Quarterfinal (Jul 11), passes sell out first. Book at kansascityfwc26.com as soon as sales open.",
    "Kansas City has 100+ barbecue restaurants. The difference lies in the burnt ends — the caramelized brisket tips that earn their second cook. Joe's Kansas City and Q39 serve the best. Start there and decide the rest after.",
    "For the July 11 Quarterfinal, the teams playing won't be known until July 4. Book accommodation at a cancellable rate that week and confirm once the brackets drop.",
    "Arrowhead holds the Guinness record for the loudest open-air stadium in the world: 142.2 decibels registered during a Chiefs game. The bowl design channels sound onto the field. The Argentina match will operate at that scale.",
  ],

  matchDayChecklist:[
    "ConnectKC26 Stadium Direct pass booked (separate from match ticket)",
    "Digital match ticket — FIFA app (no paper version)",
    "ESTA approved or valid B-2 visa",
    "Arrive at the WWI Museum Fan Fest with time for the bus",
    "Light clothing + layer for Midwest summer storms",
    "Arrive at the stadium 90 min before — gates open H-1:30",
    "Hotel reservation confirmed for Jun 16 and Jul 11",
    "USD cash or card for BBQ, bars, and transit",
  ],

  didYouKnow:"Arrowhead Stadium holds the Guinness record as the loudest open-air stadium in the world: 142.2 decibels, recorded during a Kansas City Chiefs game in 2014. The open-bowl design isn't only aesthetic — it was deliberately built to channel sound toward the field. In June 2026, Argentina is going to discover what it means to play in a stadium designed for noise.",
  closingNote:"Kansas City is the host city that needs the least explanation and most surprises first-time visitors. The loudest open-air stadium in the world. The defending champion in the city's opening match. The most serious barbecue on the continent at prices that don't need an apology. ConnectKC26 solves the transport problem the subway can't. LagomPlan gives you the right bus, the right burnt end, and the room where jazz was born. The rest is Arrowhead — at 142.2 decibels of capacity.",
  closingSignature:"Lagomplan · Field Guide · Kansas City · World Cup 2026",
  plannerCTA:"Generate my Kansas City trip",

  sectionSubtitles:{
    matches:"6 matches confirmed at Arrowhead Stadium — including Argentina vs. Algeria (Jun 16) and a Quarterfinal on July 11.",
    vibe:"Official Fan Fest at the National WWI Museum, screens at the Power & Light District, and the football bars Sporting KC turned into the reference.",
    logistics:"No subway to the stadium. ConnectKC26 Stadium Direct is the official solution — the pass is sold separately from the match ticket.",
    food:"The most serious barbecue on the continent, the Jazz District, and the bars Sporting KC turned into the city's football map.",
  },
  staysWarning:"Prices are estimates for the World Cup period. Argentina (Jun 16) and the Quarterfinal (Jul 11) are the critical dates. For the Quarterfinal, the teams won't be known until July 4 — book a cancellable rate in Power & Light or Crossroads and confirm once the brackets drop.",
}
