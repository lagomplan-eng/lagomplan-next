// content/guia/agenda/copy.ts
//
// ES/EN strings of the "Mientras estás aquí" section. One flat shape per
// language so a test can assert both have exactly the same keys.

export type AgendaLang = 'es' | 'en'

export interface AgendaCopy {
  eyebrow: string
  title: string
  subtitle: string
  open: string
  close: string
  plan: string
  plans: string
  tabAlways: string
  tabTrips: string
  featuredBadge: string
  showAll: string // {n}
  showLess: string
  detailsShow: string // + title
  detailsHide: string // + title
  dates: string
  hours: string
  cost: string
  official: string
  emptyTitle: string
  emptyBody: string
  emptyCta: string
  hostPickLabel: string
  hostPickMissing: string
  photo: string
  toConfirm: string
  link: string
  catFood: string
  catCulture: string
  catSport: string
  catOutdoors: string
}

export const AGENDA_COPY: Record<AgendaLang, AgendaCopy> = {
  es: {
    eyebrow: 'La ciudad estos días',
    title: 'Mientras estás aquí',
    subtitle: 'Lo que pasa en la ciudad este mes y el próximo, elegido por quien la vive.',
    open: 'Ver la agenda de la ciudad',
    close: 'Ocultar la agenda',
    plan: 'plan',
    plans: 'planes',
    tabAlways: 'Siempre en la ciudad',
    tabTrips: 'Si te sobra un día',
    featuredBadge: 'Destacado del mes',
    showAll: 'Ver los {n} planes',
    showLess: 'Ver menos',
    detailsShow: 'Ver detalles de',
    detailsHide: 'Ocultar detalles de',
    dates: 'Fechas',
    hours: 'Horario',
    cost: 'Costo',
    official: 'Sitio oficial →',
    emptyTitle: 'Mes tranquilo en la ciudad',
    emptyBody: 'Todavía no tenemos eventos para este mes. Mientras tanto, mira los planes para cuando te sobre un día.',
    emptyCta: 'Ver «Si te sobra un día» →',
    hostPickLabel: 'La recomendación del anfitrión',
    hostPickMissing: '[recomendación del anfitrión]',
    photo: '[foto]',
    toConfirm: '[Por confirmar]',
    link: '[enlace]',
    catFood: 'Comida',
    catCulture: 'Cultura',
    catSport: 'Deporte',
    catOutdoors: 'Aire libre',
  },
  en: {
    eyebrow: 'The city these days',
    title: "While you're here",
    subtitle: "What's happening in the city this month and next, picked by people who live here.",
    open: 'See the city agenda',
    close: 'Hide the agenda',
    plan: 'plan',
    plans: 'plans',
    tabAlways: 'Always in the city',
    tabTrips: 'If you have a spare day',
    featuredBadge: 'Featured this month',
    showAll: 'See all {n}',
    showLess: 'See less',
    detailsShow: 'Show details for',
    detailsHide: 'Hide details for',
    dates: 'Dates',
    hours: 'Hours',
    cost: 'Cost',
    official: 'Official site →',
    emptyTitle: 'A quiet month in the city',
    emptyBody: "We don't have events for this month yet. In the meantime, see the plans for when you have a spare day.",
    emptyCta: 'See “If you have a spare day” →',
    hostPickLabel: "The host's pick",
    hostPickMissing: '[host recommendation]',
    photo: '[photo]',
    toConfirm: '[To confirm]',
    link: '[link]',
    catFood: 'Food',
    catCulture: 'Culture',
    catSport: 'Sport',
    catOutdoors: 'Outdoors',
  },
}
