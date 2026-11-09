/**
 * scripts/experiences/build-review.ts
 *
 * Phase 1a of the Experiencias hub. READ-ONLY with respect to guide files:
 * it only reads FLAT_REGISTRY and writes two review CSVs next to itself.
 *
 *   scripts/experiences/review.csv         one row per experience pair (ES+EN by index)
 *   scripts/experiences/guides-review.csv  one row per guide (region, shortName, persona check)
 *
 * Everything in the proposed_* columns is a PROPOSAL for Elena to edit; a blank
 * means "no data to propose" (empty > invented). Phase 1b reads the approved
 * CSVs and writes the fields into the guide files.
 *
 * Run: npx tsx scripts/experiences/build-review.ts
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { getAllFlatGuides } from '../../lib/data/guides/index'
import type { FlatGuide } from '../../lib/data/guides/types'

const OUT = __dirname

// ── helpers ───────────────────────────────────────────────────────────────────

const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

function slugify(s: string): string {
  const slug = strip(s)
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/['’"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (slug.length <= 60) return slug
  const cut = slug.slice(0, 60)
  return cut.slice(0, Math.max(cut.lastIndexOf('-'), 20))
}

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const csvRow = (cells: unknown[]) => cells.map(csvCell).join(',')

// ── category proposal (keywords on name + tags; first hit in priority order wins) ──

type Category = 'comida' | 'cultura' | 'naturaleza' | 'aventura' | 'excursion' | 'bienestar'
const CATEGORY_KEYWORDS: Array<[Category, RegExp]> = [
  ['bienestar',  /\b(spa|masaje|masajes|yoga|temazcal|termas|aguas termales|hammam|onsen|retiro|massage|hot springs?|wellness)\b/i],
  ['comida',     /\b(cena|comida|desayuno|brunch|tacos?|mercado|degustaci[oó]n|vinos?|bodegas?|cata|catas|clase de cocina|cocina|gastronom[ií]a|restaurante|chocolate|mezcal|tequila|cerveza|dinner|lunch|breakfast|wine|tasting|cooking|market|winery|wineries|brewery|street food|fine dining|food|farm to table|chef)\b/i],
  ['aventura',   /\b(trekking|senderismo|kayak|rafting|escalada|tirolesa|buceo|snorkel|surf|globo|cuatrimoto|ciclismo|bicicleta|hike|hiking|zipline|zip line|dive|diving|balloon|climb|climbing|canyoning|paddle|paddleboard|ski|esqu[ií]|via ferrata|atv)\b/i],
  ['naturaleza', /\b(parque nacional|national park|cenotes?|volc[aá]n|volcanes|volcano|volcanoes|lago|lagos|lake|cascadas?|waterfalls?|reserva natural|nature reserve|fauna|wildlife|ballenas?|whales?|flamencos?|flamingos?|aves|birds|bosque|forest|glaciar|glacier|fiordos?|fjords?|gorilas?|gorillas?|geiser|geyser|dunas|dunes|salar|laguna|lagoon|puffins?|frailecillos?)\b/i],
  ['cultura',    /\b(museo|museos|museum|templo|templos|temple|palacio|palace|galer[ií]as?|gallery|galleries|arte|art|historia|history|historic|hist[oó]ric[oa]s?|arqueol[oó]gic[oa]s?|archaeolog\w*|ruinas|ruins|pir[aá]mides?|pyramids?|catedral|cathedral|artesan[ií]as?|crafts?|castillo|castle|zoco|souk|medina|walking tour|tour a pie|cultural|barrio|neighborhood|neighbourhood|mural\w*|santuario|shrine|monasterio|monastery)\b/i],
  ['excursion',  /\b(excursi[oó]n|day trip|ferry|crucero|cruise|catamar[aá]n|catamaran|barco|boat|lancha|traslado|transfer|road trip|roadtrip|bus tour|tour en bus|helic[oó]ptero|helicopter|sobrevuelo|flight)\b/i],
]

// Tags that describe booking logistics, not the activity ("Reserva con meses de
// anticipación", "Book 21 days ahead…"). They must never drive a category.
const BOOKING_NOTE = /\b(reserva|reservar|book|booking|descuento|discount)\b/i

function scan(hay: string): Array<{ cat: Category; kw: string }> {
  const hits: Array<{ cat: Category; kw: string }> = []
  for (const [cat, re] of CATEGORY_KEYWORDS) {
    const m = hay.match(re)
    if (m) hits.push({ cat, kw: m[0] })
  }
  return hits
}

/** Name first; tags only when the name matches nothing. Blank when neither does. */
function proposeCategory(name: string, tags: string[]): { value: string; candidates: string; basis: string } {
  let hits = scan(name)
  let source = 'name'
  if (!hits.length) {
    hits = scan(tags.filter(t => !BOOKING_NOTE.test(t)).join(' '))
    source = 'tags'
  }
  if (!hits.length) return { value: '', candidates: '', basis: '' }
  return {
    value: hits[0].cat,
    candidates: hits.map(h => h.cat).join('|'),
    basis: `${source}: ` + hits.map(h => `${h.cat}:${h.kw}`).join('; '),
  }
}

// ── editorial category decisions, keyed by proposed_id ─────────────────────────────
// 'elena'       = Elena's explicit answer (2026-10-30), overrides the keyword pass.
// 'description' = second pass: judged from name + ES description where the keyword
//                 pass found nothing. Category is our editorial classification, so a
//                 proposal from the description is allowed; Elena confirms in the CSV.
// An id absent from both maps keeps the keyword proposal (or stays blank when none
// of the six categories fits, e.g. a beach-club day).
const EDITORIAL: Record<string, { cat: Category; basis: 'elena' | 'description' }> = {
  // Elena's answers
  'kayaking-in-the-westfjords-fjords': { cat: 'aventura', basis: 'elena' },
  'hornstrandir-nature-reserve-boat-tour-y-hike': { cat: 'aventura', basis: 'elena' },
  'dynjandi-waterfall-day-tour-from-isafjor-ur': { cat: 'naturaleza', basis: 'elena' },
  'mountain-gorilla-trekking': { cat: 'naturaleza', basis: 'elena' },
  'dian-fossey-hike-to-karisoke-research-centre': { cat: 'naturaleza', basis: 'elena' },
  'city-palace-y-tour-en-barco-por-el-lago-pichola': { cat: 'cultura', basis: 'elena' },
  'paseo-en-barco-con-recorrido-por-la-ciudad-antigua': { cat: 'cultura', basis: 'elena' },
  'star-ferry-symphony-of-lights-y-mercado-mayorista': { cat: 'cultura', basis: 'elena' },
  'casa-luis-barragan': { cat: 'cultura', basis: 'elena' },
  'caminata-por-la-colonia-americana': { cat: 'cultura', basis: 'elena' },
  // Second pass (name + description)
  'valle-de-la-luna-al-atardecer': { cat: 'naturaleza', basis: 'elena' },
  'dia-en-isla-mujeres': { cat: 'excursion', basis: 'description' },
  'parque-xcaret': { cat: 'excursion', basis: 'elena' },
  'jardines-de-mexico': { cat: 'naturaleza', basis: 'description' },
  'safari-de-tortas-ahogadas': { cat: 'comida', basis: 'description' },
  'sunset-sail-privado': { cat: 'excursion', basis: 'description' },
  'uxmal-y-choco-story': { cat: 'cultura', basis: 'description' },
  'reserva-de-el-corchito': { cat: 'naturaleza', basis: 'description' },
  'taller-de-alebrijes-en-arrazola': { cat: 'cultura', basis: 'description' },
  'hierve-el-agua': { cat: 'naturaleza', basis: 'description' },
  'navegacion-privada-a-majahuitas': { cat: 'excursion', basis: 'description' },
  'atardecer-en-the-iguana': { cat: 'comida', basis: 'description' },
  'bar-hopping-de-terrazas': { cat: 'comida', basis: 'description' },
  'caminata-por-el-acueducto': { cat: 'cultura', basis: 'description' },
  'rio-secreto': { cat: 'aventura', basis: 'description' },
  'sian-kaan-por-muyil': { cat: 'naturaleza', basis: 'description' },
  'dia-de-vinedos-en-cuna-de-tierra': { cat: 'comida', basis: 'description' },
  'fabrica-la-aurora': { cat: 'cultura', basis: 'description' },
  'ascenso-mistico-al-tepozteco': { cat: 'aventura', basis: 'description' },
  'sanacion-de-sonido-sound-healing': { cat: 'bienestar', basis: 'description' },
  'vuelo-en-parapente': { cat: 'aventura', basis: 'description' },
  'reserva-monte-alto': { cat: 'aventura', basis: 'description' },
  'geiseres-del-tatio-al-amanecer': { cat: 'naturaleza', basis: 'description' },
  'atardecer-en-playa-langosta': { cat: 'naturaleza', basis: 'description' },
  'tren-a-las-nubes-opcional-segun-disponibilidad': { cat: 'excursion', basis: 'description' },
  'recorrido-por-la-quebrada-de-humahuaca': { cat: 'cultura', basis: 'description' },
  'corcovado-en-tren-cremallera': { cat: 'cultura', basis: 'description' },
  'estancia-de-un-dia-en-el-campo-uruguayo': { cat: 'excursion', basis: 'description' },
  'sete-cidades-y-lagoa-do-fogo-full-day-tour': { cat: 'naturaleza', basis: 'description' },
  'private-pintxos-tour-in-parte-vieja': { cat: 'comida', basis: 'description' },
  'day-tour-gjirokastra-blue-eye': { cat: 'excursion', basis: 'description' },
  'ljubljana-bike-tour-with-local-guide': { cat: 'cultura', basis: 'description' },
  'islas-feroe-full-day-highlights-tour': { cat: 'excursion', basis: 'description' },
  'torres-del-paine-w-trek': { cat: 'aventura', basis: 'description' },
  'torres-del-paine-full-day-tour-desde-puerto-natales': { cat: 'excursion', basis: 'description' },
  'napa-valley-guided-bike-tour-through-sustainable-vineyards': { cat: 'comida', basis: 'description' },
  'dolomites-cable-car-y-family-alpine-meadow-experience': { cat: 'naturaleza', basis: 'description' },
  'ceremonia-del-te-en-casa-de-te-con-jardin': { cat: 'cultura', basis: 'description' },
  'taller-de-ceramica-en-marrakech': { cat: 'cultura', basis: 'description' },
  'taller-de-ceramica-con-te-marroqui-atelier-lamsaty': { cat: 'cultura', basis: 'description' },
  'tour-de-dia-completo-chamarel-7-colores-y-cataratas-del': { cat: 'naturaleza', basis: 'description' },
  'tour-de-quad-por-el-sur-de-mauricio': { cat: 'aventura', basis: 'description' },
  'tour-de-dia-con-dim-sum': { cat: 'cultura', basis: 'description' },
  // Deliberately absent: 'beach-club-day-en-papaya-playa-project' (nightlife; fits none of the six)
}

// ── duration proposal: ONLY from an explicit duration tag, never description ─────

type Duration = 'corto' | 'medio' | 'completo'
function durationFromTags(tags: string[]): { value: Duration | ''; note: string } {
  for (const raw of tags) {
    const t = strip(raw).toLowerCase().trim()
    if (/^(dia completo|tour dia completo|full[- ]?day( tour)?)$/.test(t)) return { value: 'completo', note: raw }
    if (/^(medio dia|half[- ]?day( tour)?)$/.test(t)) return { value: 'medio', note: raw }
    // Buckets (Elena, 2026-10-30): corto ≤ 4 h, medio > 4 h to 7 h, completo > 7 h.
    const h = t.match(/^(\d+(?:[.,]\d+)?)\s*(horas?|hours?|hrs?|h)$/)
    if (h) {
      const n = parseFloat(h[1].replace(',', '.'))
      return { value: n <= 4 ? 'corto' : n <= 7 ? 'medio' : 'completo', note: raw }
    }
    const m = t.match(/^(\d+)\s*(min|mins|minutos|minutes)$/)
    if (m) return { value: 'corto', note: raw }
    if (/^(multi[- ]?dia)$/.test(t)) return { value: '', note: `${raw} (multi-day: no bucket, left blank)` }
  }
  return { value: '', note: '' }
}

// ── persona map (ES hero.tags = source of truth; per decision 2) ────────────────

type Persona = 'familia' | 'pareja' | 'amigos'
const PERSONA_ES: Record<string, Persona> = {
  'Familia': 'familia', 'Niños pequeños': 'familia', 'Familia con adolescentes': 'familia', 'Adolescentes': 'familia',
  'Pareja': 'pareja', 'Parejas': 'pareja', 'Romance': 'pareja',
  'Amigos': 'amigos', 'Amigas': 'amigos', 'Grupo de amigos': 'amigos',
}
// Only used to FLAG disagreement; the EN guide inherits the ES set regardless.
const PERSONA_EN: Record<string, Persona> = {
  'Family': 'familia', 'Young kids': 'familia', 'Small kids': 'familia', 'Family with teenagers': 'familia', 'Teenagers': 'familia', 'Teens': 'familia',
  'Couple': 'pareja', 'Couples': 'pareja', 'Romance': 'pareja',
  'Friends': 'amigos', 'Group of friends': 'amigos',
}
const personaSet = (tags: string[], map: Record<string, Persona>) =>
  [...new Set(tags.map(t => map[t]).filter(Boolean))].sort() as Persona[]

// ── region + shortName proposals (Elena edits these) ───────────────────────────

type Region = 'mexico' | 'latam' | 'norteamerica' | 'europa' | 'asia' | 'africa' | 'oceania'
const REGION: Record<string, { region: Region; note?: string }> = {
  'cancun': { region: 'mexico' }, 'ciudad-de-mexico': { region: 'mexico' }, 'cuernavaca': { region: 'mexico' },
  'guadalajara': { region: 'mexico' }, 'los-cabos': { region: 'mexico' }, 'merida': { region: 'mexico' },
  'oaxaca': { region: 'mexico' }, 'puerto-vallarta': { region: 'mexico' }, 'queretaro': { region: 'mexico' },
  'riviera-maya': { region: 'mexico' }, 'san-miguel-de-allende': { region: 'mexico' }, 'tepoztlan': { region: 'mexico' },
  'tulum': { region: 'mexico' }, 'valle-de-bravo': { region: 'mexico' }, 'chile-en-nogada': { region: 'mexico', note: 'Puebla route' },
  'atacama': { region: 'latam' }, 'cartagena': { region: 'latam' }, 'cusco-machu-picchu': { region: 'latam' },
  'guanacaste': { region: 'latam', note: 'Costa Rica (Central America)' }, 'guatemala': { region: 'latam', note: 'Central America' },
  'norte-de-argentina': { region: 'latam' }, 'rio-de-janeiro': { region: 'latam' }, 'uruguay': { region: 'latam' },
  'torres-del-paine': { region: 'latam' },
  'napa-sonoma': { region: 'norteamerica' },
  'azores': { region: 'europa' }, 'copenhague': { region: 'europa' }, 'pais-vasco': { region: 'europa' },
  'albania': { region: 'europa' }, 'eslovenia': { region: 'europa' }, 'islas-feroe': { region: 'europa' },
  'westfjords-islandia': { region: 'europa' }, 'alto-adigio-dolomitas': { region: 'europa' }, 'roma': { region: 'europa' },
  'capadocia': { region: 'asia', note: 'JUDGEMENT: Turkey straddles Europe/Asia; proposed asia (Anatolia)' },
  'kioto-osaka': { region: 'asia' }, 'udaipur': { region: 'asia' }, 'hong-kong': { region: 'asia' },
  'marrakech': { region: 'africa' }, 'ruanda': { region: 'africa' },
  'mauricio': { region: 'africa', note: 'JUDGEMENT: Indian Ocean island; proposed africa. No guide maps to oceania today' },
}

// Explicit short names where "text before the first comma/colon" is not enough.
const SHORT_OVERRIDE: Record<string, { es: string; en: string }> = {
  'oaxaca':               { es: 'Oaxaca',            en: 'Oaxaca' },
  'cartagena':            { es: 'Cartagena',         en: 'Cartagena' },
  'atacama':              { es: 'Atacama',           en: 'Atacama' },
  'cusco-machu-picchu':   { es: 'Cusco y Machu Picchu', en: 'Cusco & Machu Picchu' },
  'norte-de-argentina':   { es: 'Norte de Argentina', en: 'Northern Argentina' },
  'ruanda':               { es: 'Ruanda',            en: 'Rwanda' },
  'napa-sonoma':          { es: 'Napa y Sonoma',     en: 'Napa & Sonoma' },
  'alto-adigio-dolomitas':{ es: 'Alto Adigio',       en: 'South Tyrol' },
  'chile-en-nogada':      { es: 'Puebla',            en: 'Puebla' },
  'westfjords-islandia':  { es: 'Westfjords',        en: 'Westfjords' },
  'kioto-osaka':          { es: 'Kioto y Osaka',     en: 'Kyoto & Osaka' },
  'capadocia':            { es: 'Capadocia',         en: 'Cappadocia' },
  'marrakech':            { es: 'Marrakech',         en: 'Marrakech' },
  'guanacaste':           { es: 'Guanacaste',        en: 'Guanacaste' },
  'torres-del-paine':     { es: 'Torres del Paine',  en: 'Torres del Paine' },
}
function shortName(key: string, flat: FlatGuide, loc: 'es' | 'en'): string {
  const o = SHORT_OVERRIDE[key]?.[loc]
  if (o) return o
  return flat.hero.title.split(/[,:]/)[0].replace(/\s*&\s*/g, loc === 'es' ? ' y ' : ' & ').trim()
}

// ── name-pairing flags ─────────────────────────────────────────────────────────

const properTokens = (s: string) =>
  (s.match(/\b[A-ZÁÉÍÓÚÑ][\p{L}'’-]{3,}/gu) ?? []).map(t => strip(t).toLowerCase())
function namesLookUnpaired(es: string, en: string): boolean {
  const a = properTokens(es), b = new Set(properTokens(en))
  if (!a.length || !b.size) return false
  return !a.some(t => b.has(t))
}

// ── build ──────────────────────────────────────────────────────────────────────

const es = getAllFlatGuides('es')
const en = new Map(getAllFlatGuides('en').map(g => [g.canonical, g.flat]))

type Row = {
  guide: string; index: number; es_name: string; en_name: string
  base_id: string; es_tags: string[]; en_tags: string[]; es_url: string; en_url: string
}
const rows: Row[] = []
const guideFlags: Record<string, string[]> = {}
for (const { canonical, flat } of es) {
  const enFlat = en.get(canonical)
  const flags: string[] = (guideFlags[canonical] = [])
  if (!enFlat) { flags.push('NO_EN_GUIDE'); continue }
  if (flat.experiences.length !== enFlat.experiences.length) {
    flags.push(`COUNT_DIFFERS es=${flat.experiences.length} en=${enFlat.experiences.length}`)
  }
  const n = Math.max(flat.experiences.length, enFlat.experiences.length)
  for (let i = 0; i < n; i++) {
    const e = flat.experiences[i], x = enFlat.experiences[i]
    rows.push({
      guide: canonical, index: i,
      es_name: e?.name ?? '', en_name: x?.name ?? '',
      base_id: slugify(e?.name ?? x?.name ?? `exp-${i + 1}`),
      es_tags: e?.tags ?? [], en_tags: x?.tags ?? [],
      es_url: e?.affiliateUrl ?? '', en_url: x?.affiliateUrl ?? '',
    })
  }
}

// ids: unique across all guides. Bare slug when free; otherwise guide-key prefix.
const seen = new Map<string, number>()
for (const r of rows) seen.set(r.base_id, (seen.get(r.base_id) ?? 0) + 1)
const finalIds = new Set<string>()
const ids = rows.map(r => {
  let id = (seen.get(r.base_id) ?? 0) > 1 ? `${r.guide}-${r.base_id}` : r.base_id
  let k = 2
  while (finalIds.has(id)) id = `${r.guide}-${r.base_id}-${k++}`
  finalIds.add(id)
  return id
})

const unknownEditorial = Object.keys(EDITORIAL).filter(k => !finalIds.has(k))
if (unknownEditorial.length) {
  throw new Error(`EDITORIAL has ids that match no experience (typo or id changed): ${unknownEditorial.join(', ')}`)
}

const reviewHeader = [
  'guide', 'index', 'es_name', 'en_name',
  'proposed_id', 'proposed_category', 'proposed_duration',
  'source_tags', 'current_affiliateUrl',
  'flags', 'category_candidates', 'category_basis', 'duration_basis',
]
const lines = [csvRow(reviewHeader)]
let blankCat = 0, withDur = 0, flagged = 0
rows.forEach((r, i) => {
  const kw = proposeCategory(r.es_name, r.es_tags)
  const ed = EDITORIAL[ids[i]]
  const cat = ed
    ? { value: ed.cat, candidates: kw.candidates, basis: ed.basis === 'elena' ? 'elena' : 'description' }
    : kw
  const dur = durationFromTags(r.es_tags)
  const durEn = durationFromTags(r.en_tags)
  const flags: string[] = []
  if (!r.es_name || !r.en_name) flags.push('MISSING_ONE_SIDE')
  else if (namesLookUnpaired(r.es_name, r.en_name) && r.es_url !== r.en_url) flags.push('NAMES_MAY_NOT_MATCH')
  if (r.es_url !== r.en_url) flags.push('URL_DIFFERS_ES_EN')
  if (r.es_tags.length !== r.en_tags.length) flags.push(`TAG_COUNT_DIFFERS es=${r.es_tags.length} en=${r.en_tags.length}`)
  if (dur.value !== durEn.value) flags.push(`DURATION_ES_EN_DISAGREE es=${dur.value || '-'} en=${durEn.value || '-'}`)
  if (!ed && cat.candidates.includes('|')) flags.push('CATEGORY_AMBIGUOUS')
  if (!cat.value) flags.push('NO_CATEGORY_FITS')
  if (!cat.value) blankCat++
  if (dur.value) withDur++
  if (flags.length) flagged++
  lines.push(csvRow([
    r.guide, r.index, r.es_name, r.en_name,
    ids[i], cat.value, dur.value,
    `ES: ${r.es_tags.join(' | ')}  ||  EN: ${r.en_tags.join(' | ')}`,
    r.es_url,
    flags.join('; '), cat.candidates, cat.basis, dur.note,
  ]))
})
writeFileSync(join(OUT, 'review.csv'), lines.join('\n') + '\n')

const guidesHeader = [
  'guide', 'es_title', 'en_title',
  'proposed_region', 'proposed_shortName_es', 'proposed_shortName_en',
  'es_hero_tags', 'en_hero_tags',
  'es_personas', 'en_implied_personas', 'persona_flag',
  'es_exp_count', 'en_exp_count', 'bookable_now', 'flags',
]
const gl = [csvRow(guidesHeader)]
let personaFlags = 0
for (const { canonical, flat } of es) {
  const enFlat = en.get(canonical)!
  const esP = personaSet(flat.hero.tags, PERSONA_ES)
  const enP = personaSet(enFlat.hero.tags, PERSONA_EN)
  const differ = esP.join(',') !== enP.join(',')
  if (differ) personaFlags++
  const bookable = flat.experiences.filter(e => /getyourguide\.com|getyourguide\.stay22\.com/.test(e.affiliateUrl)).length
  const reg = REGION[canonical]
  const flags = [...(guideFlags[canonical] ?? []), ...(reg ? (reg.note ? [reg.note] : []) : ['NO_REGION_PROPOSED'])]
  gl.push(csvRow([
    canonical, flat.hero.title, enFlat.hero.title,
    reg?.region ?? '', shortName(canonical, flat, 'es'), shortName(canonical, enFlat, 'en'),
    flat.hero.tags.join(' | '), enFlat.hero.tags.join(' | '),
    esP.join('+') || '(none)', enP.join('+') || '(none)',
    differ ? `DIFFERS: EN implies [${enP.join('+') || 'none'}]; EN guide will inherit ES [${esP.join('+') || 'none'}]` : '',
    flat.experiences.length, enFlat.experiences.length, bookable, flags.join('; '),
  ]))
}
writeFileSync(join(OUT, 'guides-review.csv'), gl.join('\n') + '\n')

console.log(JSON.stringify({
  guides: es.length, experiencePairs: rows.length, withProposedDuration: withDur, blankCategory: blankCat,
  rowsWithFlags: flagged, personaFlags,
  idsCollidingBeforePrefix: [...seen.entries()].filter(([, n]) => n > 1).map(([k]) => k),
  uniqueIds: new Set(ids).size,
}, null, 1))
