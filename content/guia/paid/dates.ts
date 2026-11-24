// content/guia/paid/dates.ts — a stay's dates as the guest reads them ("12–15 December"). Fixed month names, no Intl, so the
// built page and the browser always agree. Pure.
import type { Lang } from '../types'

const MONTHS: Record<Lang, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
}

function parts(iso: string): { d: number; m: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  const month = Number(m[2]), day = Number(m[3])
  return month >= 1 && month <= 12 && day >= 1 && day <= 31 ? { d: day, m: month - 1 } : null
}

export function stayDates(arrive: string, depart: string, lang: Lang): string | null {
  const a = parts(arrive), b = parts(depart)
  if (!a || !b) return null
  const of = lang === 'es' ? ' de ' : ' '
  if (a.m === b.m) return `${a.d}–${b.d}${of}${MONTHS[lang][a.m]}`
  return `${a.d}${of}${MONTHS[lang][a.m]} – ${b.d}${of}${MONTHS[lang][b.m]}`
}

export function welcomeLine(name: string, arrive: string, depart: string, lang: Lang): string {
  const dates = stayDates(arrive, depart, lang)
  const hello = lang === 'es' ? `Te damos la bienvenida, ${name}` : `Welcome, ${name}`
  return dates ? `${hello} · ${dates}` : hello
}
