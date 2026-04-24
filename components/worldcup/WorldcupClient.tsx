'use client'

import { useState } from 'react'
import { Link } from '../../lib/navigation'

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — LagomPlan canonical
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  pine:          '#0F3A33',
  sage:          '#6B8F86',
  sageLight:     '#EAF2F0',
  sand:          '#EDE7E1',
  sandLight:     '#F7F4F1',
  sandDark:      '#D9D2C9',
  coral:         '#E1615B',
  coralLight:    '#FCEEED',
  fjord:         '#2D4F6C',
  fjordLight:    '#E3EBF2',
  ink:           '#1C1C1A',
  inkMid:        '#5A5A56',
  inkFaint:      '#9A9A94',
  white:         '#FFFFFF',
  matchGold:     '#B8860B',
  matchGoldLight:'#FBF5E0',
} as const

const RADIUS = 8
const CARD_SHADOW = '0 1px 4px rgba(28,28,26,0.05)'

const df = (size: string | number, weight = 400, style = 'normal') => ({
  fontFamily: "'Fraunces', serif",
  fontSize:   size,
  fontWeight: weight,
  fontStyle:  style,
} as const)

const uf = (size: string | number, weight = 400) => ({
  fontFamily: "'Manrope', sans-serif",
  fontSize:   size,
  fontWeight: weight,
} as const)

// ─────────────────────────────────────────────────────────────────────────────
// PERSONA CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const PERSONAS_CFG = {
  roberto:   { label: { es: 'Fan WC',  en: 'WC Fan'  }, emoji: '⚽', color: T.coral,    bg: T.coralLight },
  valentina: { label: { es: 'Familia', en: 'Family'  }, emoji: '👨‍👩‍👧', color: '#1A6B5A', bg: '#D8EEE9'   },
  andrea:    { label: { es: 'Pareja',  en: 'Couple'  }, emoji: '💑', color: T.fjord,    bg: T.fjordLight },
} as const

type PersonaKey = keyof typeof PERSONAS_CFG

// ─────────────────────────────────────────────────────────────────────────────
// ROSTER — 16 cities, full editorial data
// ─────────────────────────────────────────────────────────────────────────────
const ROSTER = [
  {
    id:'cdmx', city:'Ciudad de México', short:'CDX', country:{ es:'México',  en:'Mexico'  }, flag:'🇲🇽', region:'mx',
    accent:'#1A6B5A', persona:'roberto' as PersonaKey, stadium:'Estadio Azteca', ready:true,
    tagline:'El Azteca no necesita presentación. Lo que sí necesita, y mucho, es una estrategia de transporte.',
    intro:'Roberto, esto es para ti. El Azteca fue tuyo antes de que nacieras — y ahora va a ser tuyo de nuevo, en el Mundial más importante desde el 86.',
    matches:[
      {date:'Jue 11 Jun', teamA:'México',        flagA:'🇲🇽', teamB:'Sudáfrica',    flagB:'🇿🇦'},
      {date:'Mié 17 Jun', teamA:'Uzbekistán',    flagA:'🇺🇿', teamB:'Colombia',     flagB:'🇨🇴'},
      {date:'Mié 24 Jun', teamA:'Rep. Checa',    flagA:'🇨🇿', teamB:'México',       flagB:'🇲🇽'},
    ],
  },
  {
    id:'gdl', city:'Guadalajara', short:'GDL', country:{ es:'México',  en:'Mexico'  }, flag:'🇲🇽', region:'mx',
    accent:'#8B2635', persona:'valentina' as PersonaKey, stadium:'Estadio Akron', ready:true,
    tagline:'Aquí no se pregunta de qué equipo eres. Se nota antes de que abras la boca.',
    intro:'Valentina, este es tu partido. Guadalajara es la ciudad más amable de México para viajar con bebé — barrios tranquilos, comida extraordinaria, mucho espacio.',
    matches:[
      {date:'Jue 11 Jun', teamA:'Corea del Sur', flagA:'🇰🇷', teamB:'Rep. Checa',    flagB:'🇨🇿'},
      {date:'Jue 18 Jun', teamA:'México',        flagA:'🇲🇽', teamB:'Corea del Sur', flagB:'🇰🇷'},
      {date:'Mar 23 Jun', teamA:'Colombia',      flagA:'🇨🇴', teamB:'RD Congo',      flagB:'🇨🇩'},
    ],
  },
  {
    id:'mty', city:'Monterrey', short:'MTY', country:{ es:'México',  en:'Mexico'  }, flag:'🇲🇽', region:'mx',
    accent:'#2D4F6C', persona:'andrea' as PersonaKey, stadium:'Estadio BBVA', ready:true,
    tagline:'La ciudad más trabajadora de México recibe el Mundial con la misma actitud con la que construyó sus industrias: sin exceso de ornamento.',
    intro:'Andrea, Monterrey va a sorprenderte. El estadio BBVA es probablemente el más fotogénico del torneo. Y la escena de restaurantes se convirtió en referencia nacional.',
    matches:[
      {date:'Dom 14 Jun', teamA:'Túnez',         flagA:'🇹🇳', teamB:'Rep. UEFA B',   flagB:''},
      {date:'Vie 19 Jun', teamA:'Túnez',         flagA:'🇹🇳', teamB:'Japón',         flagB:'🇯🇵'},
      {date:'Mié 24 Jun', teamA:'Sudáfrica',     flagA:'🇿🇦', teamB:'Corea del Sur', flagB:'🇰🇷'},
    ],
  },
  {
    id:'la', city:'Los Ángeles', short:'LA', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#C4622A', persona:'roberto' as PersonaKey, stadium:'SoFi Stadium', ready:true,
    tagline:'El estadio más caro jamás construido está a tres millas del aeropuerto más cercano a cualquier estadio mundialista. En Los Ángeles, hasta las distancias son de película.',
    intro:'Roberto, LA es tu partido de visita que se siente de local. Hay más afición mexicana en Los Ángeles que en Guadalajara. El SoFi Stadium va a parecer el Azteca.',
    matches:[
      {date:'Vie 12 Jun', teamA:'EUA',           flagA:'🇺🇸', teamB:'Paraguay',      flagB:'🇵🇾'},
      {date:'Dom 15 Jun', teamA:'Irán',          flagA:'🇮🇷', teamB:'Nueva Zelanda', flagB:'🇳🇿'},
      {date:'Jue 18 Jun', teamA:'Suiza',         flagA:'🇨🇭', teamB:'Bosnia',        flagB:'🇧🇦'},
    ],
  },
  {
    id:'mia', city:'Miami', short:'MIA', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#0E8B8B', persona:'andrea' as PersonaKey, stadium:'Hard Rock Stadium', ready:true,
    tagline:'El calor en Miami no es el clima. Es el estado de ánimo permanente de la ciudad.',
    intro:'Andrea, Miami para una pareja que sabe viajar es el destino del torneo. No porque el fútbol sea lo principal — sino porque todo lo que rodea el partido es extraordinario.',
    matches:[
      {date:'Lun 15 Jun', teamA:'Arabia Saudita', flagA:'🇸🇦', teamB:'Uruguay',      flagB:'🇺🇾'},
      {date:'Dom 21 Jun', teamA:'Uruguay',        flagA:'🇺🇾', teamB:'Cabo Verde',   flagB:'🇨🇻'},
      {date:'Mié 24 Jun', teamA:'Escocia',        flagA:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', teamB:'Brasil',       flagB:'🇧🇷'},
    ],
  },
  {
    id:'nyc', city:'Nueva York', short:'NYC', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#1A3A5C', persona:'roberto' as PersonaKey, stadium:'MetLife Stadium', ready:true,
    tagline:'La ciudad que alberga la Final no necesita explicar por qué. Solo necesita que sepas llegar al estadio.',
    intro:'Roberto, escúchame. La final del Mundial 2026 se juega en MetLife Stadium. Si Argentina llega — y hay buenas razones para creerlo — el partido más importante del siglo se va a jugar a 30 minutos de Manhattan.',
    matches:[
      {date:'Sáb 13 Jun', teamA:'Brasil',        flagA:'🇧🇷', teamB:'Marruecos',    flagB:'🇲🇦'},
      {date:'Mar 16 Jun', teamA:'Francia',       flagA:'🇫🇷', teamB:'Senegal',      flagB:'🇸🇳'},
      {date:'Lun 22 Jun', teamA:'Noruega',       flagA:'🇳🇴', teamB:'Senegal',      flagB:'🇸🇳'},
    ],
  },
  {
    id:'dal', city:'Dallas', short:'DAL', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#8B2635', persona:'andrea' as PersonaKey, stadium:'AT&T Stadium', ready:true,
    tagline:'El estadio más grande del torneo está en Arlington. No en Dallas. Y no hay metro que llegue ahí.',
    intro:'Andrea, Dallas no es el destino obvio — y esa es la razón para ir. El AT&T Stadium es la experiencia deportiva más espectacular del torneo: pantalla de 60 metros, 80 mil personas.',
    matches:[
      {date:'Jue 11 Jun', teamA:'México',        flagA:'🇲🇽', teamB:'Sudáfrica',    flagB:'🇿🇦'},
      {date:'Mié 18 Jun', teamA:'España',        flagA:'🇪🇸', teamB:'Brasil',       flagB:'🇧🇷'},
      {date:'Jue 26 Jun', teamA:'México',        flagA:'🇲🇽', teamB:'Uruguay',      flagB:'🇺🇾'},
    ],
  },
  {
    id:'sf', city:'San Francisco', short:'SF', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#4A6B9E', persona:'roberto' as PersonaKey, stadium:"Levi's Stadium", ready:true,
    tagline:'Brasil y Alemania juegan aquí. Y México podría avanzar a octavos aquí también.',
    intro:'Roberto, Mission District es el barrio latino más auténtico de EE.UU. en la costa oeste. Murales de Diego Rivera en las paredes, taquería El Farolito abierta hasta las 3am.',
    matches:[
      {date:'Dom 14 Jun', teamA:'Países Bajos',  flagA:'🇳🇱', teamB:'Japón',        flagB:'🇯🇵'},
      {date:'Mar 17 Jun', teamA:'Inglaterra',    flagA:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', teamB:'Croacia',      flagB:'🇭🇷'},
      {date:'Lun 22 Jun', teamA:'Argentina',     flagA:'🇦🇷', teamB:'Austria',      flagB:'🇦🇹'},
    ],
  },
  {
    id:'hou', city:'Houston', short:'HOU', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#6B4226', persona:'valentina' as PersonaKey, stadium:'NRG Stadium', ready:true,
    tagline:'La ciudad más diversa de Texas recibe al torneo más diverso de la historia. La aritmética tiene sentido.',
    intro:'Valentina, Houston es probablemente la sede más amable del torneo para viajar con bebé. La ciudad es enorme y tiene todo — barrios tranquilos, mucho espacio.',
    matches:[
      {date:'Dom 14 Jun', teamA:'Alemania',      flagA:'🇩🇪', teamB:'Curazao',      flagB:'🇨🇼'},
      {date:'Mié 17 Jun', teamA:'Portugal',      flagA:'🇵🇹', teamB:'Playoff IC-1', flagB:''},
      {date:'Sáb 20 Jun', teamA:'Países Bajos',  flagA:'🇳🇱', teamB:'Rep. UEFA B',  flagB:''},
    ],
  },
  {
    id:'sea', city:'Seattle', short:'SEA', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#2D6E4E', persona:'andrea' as PersonaKey, stadium:'Lumen Field', ready:true,
    tagline:'La única sede del torneo donde el estadio está a diez minutos caminando del mercado de pescado más famoso de Norteamérica. Aprovéchalo antes del partido.',
    intro:'Andrea, Seattle es el destino del torneo para la pareja que quiere hacer algo diferente de verdad. No es la ciudad obvia — y esa es exactamente el punto.',
    matches:[
      {date:'Dom 15 Jun', teamA:'Bélgica',       flagA:'🇧🇪', teamB:'Egipto',       flagB:'🇪🇬'},
      {date:'Vie 19 Jun', teamA:'EUA',           flagA:'🇺🇸', teamB:'Australia',    flagB:'🇦🇺'},
      {date:'Mié 24 Jun', teamA:'Bosnia y Herz.',flagA:'🇧🇦', teamB:'Qatar',        flagB:'🇶🇦'},
    ],
  },
  {
    id:'kc', city:'Kansas City', short:'KC', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#7B3F8C', persona:'valentina' as PersonaKey, stadium:'Arrowhead Stadium', ready:true,
    tagline:'El estadio más ruidoso del mundo al aire libre recibe al campeón defensor. Trae tapones para los oídos — y úsalos solo si los necesitas.',
    intro:'Valentina, Kansas City es probablemente la sede más amable del torneo para familia con bebé: precios razonables, espacios amplios, sin la densidad agobiante de NYC o LA.',
    matches:[
      {date:'Mar 16 Jun', teamA:'Argentina',     flagA:'🇦🇷', teamB:'Argelia',      flagB:'🇩🇿'},
      {date:'Sáb 20 Jun', teamA:'Ecuador',       flagA:'🇪🇨', teamB:'Curazao',      flagB:'🇨🇼'},
      {date:'Jue 25 Jun', teamA:'Túnez',         flagA:'🇹🇳', teamB:'Países Bajos', flagB:'🇳🇱'},
    ],
  },
  {
    id:'atl', city:'Atlanta', short:'ATL', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#B5451B', persona:'roberto' as PersonaKey, stadium:'Mercedes-Benz Stadium', ready:true,
    tagline:'El único estadio mundialista con techo retráctil y aire acondicionado en Estados Unidos. En julio en Georgia, eso no es un lujo — es una política de salud pública.',
    intro:'Roberto, Atlanta tiene dos cosas que no combinan en ninguna otra sede del torneo: el estadio más moderno del mundo y una de las comunidades latinoamericanas de crecimiento más rápido de EE.UU.',
    matches:[
      {date:'Lun 15 Jun', teamA:'España',        flagA:'🇪🇸', teamB:'Cabo Verde',    flagB:'🇨🇻'},
      {date:'Jue 18 Jun', teamA:'Sudáfrica',     flagA:'🇿🇦', teamB:'Rep. UEFA D',   flagB:''},
      {date:'Dom 21 Jun', teamA:'España',        flagA:'🇪🇸', teamB:'Arabia Saudita',flagB:'🇸🇦'},
    ],
  },
  {
    id:'phi', city:'Filadelfia', short:'PHI', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#2A5F8F', persona:'roberto' as PersonaKey, stadium:'Lincoln Financial Field', ready:true,
    tagline:'El 4 de julio de 2026, Filadelfia celebra 250 años de independencia y un partido de Ronda de 16. El orden de las prioridades lo decide cada quien.',
    intro:'Roberto, la afición local ya vive el fútbol desde dentro. La comunidad mexicana de South Philly lleva 30 años convirtiendo el barrio en un pedazo de México.',
    matches:[
      {date:'Dom 14 Jun', teamA:'Costa de Marfil',flagA:'🇨🇮',teamB:'Ecuador',       flagB:'🇪🇨'},
      {date:'Vie 19 Jun', teamA:'Brasil',         flagA:'🇧🇷',teamB:'Haití',          flagB:'🇭🇹'},
      {date:'Lun 22 Jun', teamA:'Francia',        flagA:'🇫🇷',teamB:'Playoff IC-2',   flagB:''},
    ],
  },
  {
    id:'bos', city:'Boston', short:'BOS', country:{ es:'EE.UU.', en:'USA' }, flag:'🇺🇸', region:'us',
    accent:'#8B1A1A', persona:'andrea' as PersonaKey, stadium:'Gillette Stadium', ready:true,
    tagline:'El estadio no está en Boston. El partido sí. Esa distinción vale un tren.',
    intro:'Andrea, Boston es la ciudad del torneo más parecida a Europa sin salir de América del Norte. Y el 27 de junio, Argentina vs Brasil en Gillette Stadium.',
    matches:[
      {date:'Sáb 13 Jun', teamA:'Haití',         flagA:'🇭🇹', teamB:'Escocia',       flagB:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
      {date:'Mar 16 Jun', teamA:'Playoff IC-2',  flagA:'',    teamB:'Noruega',       flagB:'🇳🇴'},
      {date:'Vie 19 Jun', teamA:'Escocia',       flagA:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', teamB:'Marruecos',    flagB:'🇲🇦'},
    ],
  },
  {
    id:'tor', city:'Toronto', short:'TOR', country:{ es:'Canadá', en:'Canada' }, flag:'🇨🇦', region:'ca',
    accent:'#C41E3A', persona:'andrea' as PersonaKey, stadium:'BMO Field', ready:true,
    tagline:'El estadio más pequeño del torneo también es el que pone al fanático más cerca del campo. No es una coincidencia.',
    intro:'Andrea, Toronto no te pide que la ames. Solo te da 200 idiomas, 50 cocinas, y un ferry al atardecer — y espera a ver qué haces con eso.',
    matches:[
      {date:'Vie 12 Jun', teamA:'Canadá',        flagA:'🇨🇦', teamB:'Bosnia y Herz.',flagB:'🇧🇦'},
      {date:'Mié 17 Jun', teamA:'Ghana',         flagA:'🇬🇭', teamB:'Panamá',        flagB:'🇵🇦'},
      {date:'Sáb 20 Jun', teamA:'Alemania',      flagA:'🇩🇪', teamB:'Costa de Marfil',flagB:'🇨🇮'},
    ],
  },
  {
    id:'van', city:'Vancouver', short:'VAN', country:{ es:'Canadá', en:'Canada' }, flag:'🇨🇦', region:'ca',
    accent:'#2D4F6C', persona:'valentina' as PersonaKey, stadium:'BC Place', ready:true,
    tagline:'La única sede del torneo donde el estadio comparte el horizonte con montañas nevadas. No hace falta que sea metáfora.',
    intro:'Valentina, Vancouver con bebé en junio es un plan sorprendentemente cómodo. La ciudad está cubierta de parques, la temperatura es fresca y agradable, y tiene museos infantiles de primer nivel.',
    matches:[
      {date:'Sáb 13 Jun', teamA:'Australia',     flagA:'🇦🇺', teamB:'Türkiye',      flagB:'🇹🇷'},
      {date:'Jue 18 Jun', teamA:'Canadá',        flagA:'🇨🇦', teamB:'Qatar',        flagB:'🇶🇦'},
      {date:'Dom 21 Jun', teamA:'Nueva Zelanda', flagA:'🇳🇿', teamB:'Egipto',       flagB:'🇪🇬'},
    ],
  },
] as const

type RosterItem = typeof ROSTER[number]

// ─────────────────────────────────────────────────────────────────────────────
// COPY — bilingual UI strings
// ─────────────────────────────────────────────────────────────────────────────
const COPY = {
  eyebrow:      { es:'16 guías editoriales · Mundial 2026 · Completo', en:'16 editorial guides · World Cup 2026 · Complete' },
  title:        { es:'Guías para el fanático',                          en:'Guides for the fan'                              },
  subtitle:     {
    es:'No una guía turística. Una guía escrita desde adentro — para la pareja que quiere vivir algo, para la familia que lo va a planear todo, y para el fanático que fue por el fútbol.',
    en:'Not a tourist guide. A guide written from within — for the couple who wants to experience something, for the family who will plan everything, and for the fan who came for the football.',
  },
  filterLabel:  { es:'Filtrar:',  en:'Filter:' },
  filterAll:    { es:'Todas',     en:'All'     },
  filterMX:     { es:'México',    en:'Mexico'  },
  filterUS:     { es:'EE.UU.',    en:'USA'     },
  filterCA:     { es:'Canadá',    en:'Canada'  },
  guideCount:   { es:'guías',     en:'guides'  },
  matches:      { es:'Partidos',  en:'Matches' },
  planCTA:      { es:'Planificar →', en:'Plan →' },
  viewGuide:    { es:'ver guía →',   en:'view guide →' },
  personas: {
    roberto:   {
      es:{ label:'Fan WC',  desc:'Para el que viajó por el fútbol, no por el turismo.' },
      en:{ label:'WC Fan',  desc:'For the one who traveled for football, not for tourism.' },
    },
    valentina: {
      es:{ label:'Familia', desc:'Para la que organiza todo y necesita que funcione.' },
      en:{ label:'Family',  desc:'For the one who organizes everything and needs it to work.' },
    },
    andrea: {
      es:{ label:'Pareja',  desc:'Para la pareja que quiere vivir algo, no solo verlo.' },
      en:{ label:'Couple',  desc:'For the couple who wants to experience something, not just see it.' },
    },
  },
} as const

type Locale = 'es' | 'en'

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE INDEX COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function WorldcupClient({ locale }: { locale: string }) {
  const [filter, setFilter] = useState<'all' | 'mx' | 'us' | 'ca'>('all')
  const [hovered, setHovered] = useState<string | null>(null)

  const isES = locale === 'es'
  const l = (isES ? 'es' : 'en') as Locale
  const t = <K extends keyof typeof COPY>(key: K) => COPY[key][l] as string

  const filtered = ROSTER.filter(g =>
    filter === 'all' ? true :
    filter === 'mx'  ? g.region === 'mx' :
    filter === 'us'  ? g.region === 'us' :
    filter === 'ca'  ? g.region === 'ca' : true
  )

  const FILTERS = [
    { id:'all' as const, label: t('filterAll') },
    { id:'mx'  as const, label: t('filterMX')  },
    { id:'us'  as const, label: t('filterUS')  },
    { id:'ca'  as const, label: t('filterCA')  },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Manrope:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        button{font-family:'Manrope',sans-serif;}
        button:focus-visible{outline:2px solid ${T.coral};outline-offset:2px;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:#fff9f3;}
        ::-webkit-scrollbar-thumb{background:${T.sandDark};border-radius:3px;}
      `}</style>

      <div style={{ background:'#fff9f3', minHeight:'100vh', fontFamily:"'Manrope', sans-serif" }}>

        {/* PAGE HEADER */}
        <div style={{ maxWidth:1020, margin:'0 auto', padding:'40px 32px 0' }}>

          {/* Eyebrow + persona legend */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:10 }}>
            <span style={{ ...uf(10,600), letterSpacing:'0.14em', textTransform:'uppercase', color:T.inkFaint }}>
              {t('eyebrow')}
            </span>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {(['roberto','valentina','andrea'] as PersonaKey[]).map(key => {
                const p = PERSONAS_CFG[key]
                const copy = COPY.personas[key][l]
                return (
                  <div key={key} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ ...uf(9,700), letterSpacing:'0.1em', textTransform:'uppercase', color:p.color, background:p.bg, padding:'2px 8px', borderRadius:40, flexShrink:0 }}>
                      {copy.label}
                    </span>
                    <span style={{ ...uf(10,400), color:T.inkFaint }}>{copy.desc}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <h1 style={{ ...df('clamp(38px,5.5vw,60px)',900,'italic'), color:T.pine, lineHeight:1, letterSpacing:'-0.03em', marginBottom:14 }}>
            {t('title')}
          </h1>
          <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.7, maxWidth:600, marginBottom:28 }}>
            {t('subtitle')}
          </p>

          {/* Filters */}
          <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:28, flexWrap:'wrap' }}>
            <span style={{ ...uf(10,600), letterSpacing:'0.1em', textTransform:'uppercase', color:T.inkFaint, marginRight:4 }}>
              {t('filterLabel')}
            </span>
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  ...uf(10, filter===f.id ? 700 : 500),
                  letterSpacing:'0.09em', textTransform:'uppercase',
                  padding:'5px 14px', borderRadius:40,
                  border:`1px solid ${filter===f.id ? T.pine : T.sandDark}`,
                  background: filter===f.id ? T.pine : 'transparent',
                  color: filter===f.id ? T.white : T.inkMid,
                  cursor:'pointer', transition:'all 0.18s',
                }}
              >
                {f.label}
              </button>
            ))}
            <span style={{ ...uf(11,400), color:T.inkFaint, marginLeft:6 }}>
              {filtered.length} {t('guideCount')}
            </span>
          </div>
        </div>

        {/* CARDS */}
        <div style={{ maxWidth:1020, margin:'0 auto', padding:'0 32px 80px', display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map((item) => {
            const persona = PERSONAS_CFG[item.persona]
            const personaCopy = COPY.personas[item.persona][l]
            const isHov = hovered === item.id

            return (
              <Link
                key={item.id}
                href={{ pathname:'/worldcup/[slug]', params:{ slug:item.id } }}
                style={{ textDecoration:'none', color:'inherit', display:'block' }}
              >
                <div
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background:T.white,
                    border:`1px solid ${T.sandDark}`,
                    borderLeft:`4px solid ${item.accent}`,
                    borderRadius:RADIUS,
                    boxShadow: isHov ? '0 4px 16px rgba(28,28,26,0.09)' : CARD_SHADOW,
                    transition:'box-shadow 0.2s, transform 0.2s',
                    transform: isHov ? 'translateY(-1px)' : 'none',
                    cursor:'pointer',
                    display:'grid',
                    gridTemplateColumns:'1fr 204px',
                    overflow:'hidden',
                    position:'relative',
                  }}
                >
                  {/* Ghost abbreviation */}
                  <div style={{
                    position:'absolute', right:218, top:'50%',
                    transform:'translateY(-50%)',
                    ...df('clamp(72px,9vw,108px)',900,'italic'),
                    color:item.accent, opacity:0.06,
                    lineHeight:1, userSelect:'none', pointerEvents:'none',
                    letterSpacing:'-0.04em',
                  }}>
                    {item.short}
                  </div>

                  {/* LEFT — editorial content */}
                  <div style={{ padding:'22px 28px 22px 24px', position:'relative' }}>

                    {/* Eyebrow */}
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:9, flexWrap:'wrap' }}>
                      <span style={{ fontSize:15 }}>{item.flag}</span>
                      <span style={{
                        ...uf(9,700), letterSpacing:'0.12em', textTransform:'uppercase',
                        color:item.accent, background:item.accent+'18',
                        padding:'2px 8px', borderRadius:40,
                      }}>
                        {item.country[l]}
                      </span>
                      <span style={{
                        ...uf(9,700), letterSpacing:'0.12em', textTransform:'uppercase',
                        color:persona.color, background:persona.bg,
                        padding:'2px 8px', borderRadius:40,
                      }}>
                        {personaCopy.label}
                      </span>
                      <span style={{ ...uf(10,400), color:T.inkFaint }}>{item.stadium}</span>
                    </div>

                    {/* City name */}
                    <h2 style={{
                      ...df('clamp(26px,3.5vw,38px)',900,'italic'),
                      color:T.pine, lineHeight:1, letterSpacing:'-0.025em', marginBottom:7,
                    }}>
                      {item.city}
                    </h2>

                    {/* Tagline */}
                    <p style={{ ...uf(13,500), color:T.inkMid, lineHeight:1.5, marginBottom:6, maxWidth:500 }}>
                      {item.tagline}
                    </p>

                    {/* Intro excerpt */}
                    <p style={{
                      ...uf(12,400), color:T.inkFaint, lineHeight:1.65, maxWidth:500, marginBottom:18,
                      display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
                    } as React.CSSProperties}>
                      {item.intro}
                    </p>

                    {/* CTAs */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span
                        style={{
                          background:item.accent, border:'none', color:T.white,
                          borderRadius:5,
                          ...uf(9,700), letterSpacing:'0.12em', textTransform:'uppercase',
                          padding:'8px 16px', display:'inline-block',
                        }}
                      >
                        {t('planCTA')}
                      </span>
                      <span style={{
                        background:'transparent', border:'none', color:T.inkFaint,
                        ...uf(11,400), letterSpacing:'0.02em',
                        padding:'8px 4px', display:'inline-block',
                      }}>
                        {t('viewGuide')}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT — match panel */}
                  <div style={{
                    borderLeft:`1px solid ${T.sandDark}`,
                    background:T.sandLight,
                    padding:'20px 18px',
                    display:'flex', flexDirection:'column', justifyContent:'center',
                    gap:0,
                  }}>
                    <span style={{
                      ...uf(9,700), letterSpacing:'0.14em', textTransform:'uppercase',
                      color:T.inkFaint, marginBottom:12, display:'block',
                    }}>
                      {t('matches')}
                    </span>

                    {item.matches.map((m, i) => (
                      <div key={i} style={{
                        paddingTop: i>0 ? 10 : 0,
                        paddingBottom: i<item.matches.length-1 ? 10 : 0,
                        borderBottom: i<item.matches.length-1 ? `1px solid ${T.sandDark}` : 'none',
                      }}>
                        <div style={{ ...uf(10,600), color:T.inkFaint, letterSpacing:'0.08em', marginBottom:5 }}>
                          {m.date}
                        </div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                          <span style={{
                            ...uf(10,600),
                            color:item.accent,
                            background:item.accent+'16',
                            border:`1px solid ${item.accent}30`,
                            padding:'2px 7px', borderRadius:4,
                            display:'flex', alignItems:'center', gap:3,
                          }}>
                            {m.flagA} {m.teamA}
                          </span>
                          <span style={{ ...uf(9,400), color:T.inkFaint, alignSelf:'center' }}>vs</span>
                          <span style={{
                            ...uf(10,600),
                            color:item.accent,
                            background:item.accent+'16',
                            border:`1px solid ${item.accent}30`,
                            padding:'2px 7px', borderRadius:4,
                            display:'flex', alignItems:'center', gap:3,
                          }}>
                            {m.flagB} {m.teamB}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
