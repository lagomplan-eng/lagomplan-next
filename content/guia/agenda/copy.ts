// content/guia/agenda/copy.ts
//
// ES/EN strings of the "Mientras estás aquí" / "While you're here" section (month tabs). One flat
// shape per language so a test can assert both have exactly the same keys. Day and
// month names are fixed lists (not Intl) so labels never depend on the runtime's ICU.

export type AgendaLang = 'es' | 'en'

export interface AgendaCopy {
  eyebrow: string
  title: string
  subtitle: string
  rangesLabel: string
  weeklyTitle: string
  tripsTitle: string
  quietTitle: string
  quietBody: string
  toConfirm: string
  officialSite: string
  everyPrefix: string
  weekdays: string[] // 0 = Sunday
  weekdaysShort: string[]
  monthsShort: string[]
  monthsLong: string[]
  catFood: string
  catCulture: string
  catSport: string
  catOutdoors: string
  catMusic: string
  catCity: string
}

export const AGENDA_COPY: Record<AgendaLang, AgendaCopy> = {
  es: {
    eyebrow: 'La ciudad estos días',
    title: 'Mientras estás aquí',
    subtitle: 'Lo que pasa en la ciudad este mes y el siguiente.',
    rangesLabel: 'Mes',
    weeklyTitle: 'Cada semana en la ciudad',
    tripsTitle: 'Escapadas de un día',
    quietTitle: 'Días tranquilos en la ciudad',
    quietBody: 'No hay eventos especiales por ahora. Buen momento para lo de cada semana o para salir de la ciudad.',
    toConfirm: 'Por confirmar',
    officialSite: 'Abre el sitio oficial',
    everyPrefix: 'Cada',
    weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    weekdaysShort: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'],
    monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    monthsLong: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    catFood: 'Comida',
    catCulture: 'Cultura',
    catSport: 'Deporte',
    catOutdoors: 'Aire libre',
    catMusic: 'Música',
    catCity: 'Ciudad',
  },
  en: {
    eyebrow: 'The city these days',
    title: "While you're here",
    subtitle: "What's happening in the city this month and next.",
    rangesLabel: 'Month',
    weeklyTitle: 'Every week in the city',
    tripsTitle: 'Day trips',
    quietTitle: 'Quiet days in the city',
    quietBody: 'There are no special events right now. A good time for the weekly highlights or to get out of the city.',
    toConfirm: 'To confirm',
    officialSite: 'Opens the official site',
    everyPrefix: 'Every',
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthsLong: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    catFood: 'Food',
    catCulture: 'Culture',
    catSport: 'Sport',
    catOutdoors: 'Outdoors',
    catMusic: 'Music',
    catCity: 'City',
  },
}
