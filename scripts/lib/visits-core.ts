// scripts/lib/visits-core.ts
//
// Pure logic for `npm run demo:visits`: which tables/columns may be read, the
// fixed filters, and the aggregation. No I/O, no secrets.
//
// Hard limits (by design, not options): only these two tables, only these five
// columns, always without ref=qa-elena|pili and without ua_summary "bot:*",
// and the output is aggregate counts only — never individual rows.

export const TABLES = { demo: 'demo_visits', guide: 'guide_visits' } as const
export type TableKey = keyof typeof TABLES
export const COLUMNS = ['slug', 'ref', 'lang', 'ua_summary', 'created_at'] as const
export const EXCLUDED_REFS = ['qa-elena', 'pili'] as const
export const PAGE = 1000
export const MAX_PAGES = 20
export const MAX_DAYS = 180

export interface Row { slug: string; ref: string | null; lang: string; ua_summary: string; created_at: string }

/** Path+query for one page. Throws for any table outside the whitelist. */
export function buildPath(table: string, sinceIso: string, offset: number, slug?: string): string {
  if (!(Object.values(TABLES) as string[]).includes(table)) throw new Error(`table "${table}" is not allowed (only ${Object.values(TABLES).join(', ')})`)
  if (slug && !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(slug)) throw new Error(`invalid slug filter "${slug}"`)
  const q = [
    `select=${COLUMNS.join(',')}`,
    `created_at=gte.${encodeURIComponent(sinceIso)}`,
    'ua_summary=not.like.bot:*',
    // NULL refs must stay: `ref=not.in.(...)` alone would drop them.
    `or=(ref.is.null,ref.not.in.(${EXCLUDED_REFS.join(',')}))`,
    ...(slug ? [`slug=eq.${slug}`] : []),
    'order=created_at.desc',
    `limit=${PAGE}`,
    `offset=${offset}`,
  ]
  return `/rest/v1/${table}?${q.join('&')}`
}

/** Defense in depth: the server already filters, but never trust it with a privacy rule. */
export function keep(r: Row): boolean {
  return !r.ua_summary.startsWith('bot:') && !(r.ref !== null && (EXCLUDED_REFS as readonly string[]).includes(r.ref))
}

/** Only the five allowed columns may come back. */
export function assertColumns(r: Record<string, unknown>): void {
  const extra = Object.keys(r).filter((k) => !(COLUMNS as readonly string[]).includes(k))
  if (extra.length) throw new Error(`unexpected columns in the response: ${extra.join(', ')} — refusing to continue`)
}

export interface Group { slug: string; ref: string; visits: number; es: number; en: number; mobile: number; desktop: number; tablet: number; other: number }
export interface DayCount { day: string; slug: string; ref: string; visits: number }

export function device(ua: string): 'mobile' | 'desktop' | 'tablet' | 'other' {
  const d = ua.split(':')[0]
  return d === 'mobile' || d === 'desktop' || d === 'tablet' ? d : 'other'
}

export function aggregate(rows: Row[]): { total: number; groups: Group[]; days: DayCount[] } {
  const groups = new Map<string, Group>()
  const days = new Map<string, DayCount>()
  let total = 0
  for (const r of rows) {
    if (!keep(r)) continue
    total++
    const ref = r.ref ?? '(none)'
    const g = groups.get(`${r.slug}\u0000${ref}`) ?? { slug: r.slug, ref, visits: 0, es: 0, en: 0, mobile: 0, desktop: 0, tablet: 0, other: 0 }
    g.visits++
    if (r.lang === 'es') g.es++; else g.en++
    g[device(r.ua_summary)]++
    groups.set(`${r.slug}\u0000${ref}`, g)
    const day = r.created_at.slice(0, 10) // UTC
    const dk = `${day}\u0000${r.slug}\u0000${ref}`
    const d = days.get(dk) ?? { day, slug: r.slug, ref, visits: 0 }
    d.visits++
    days.set(dk, d)
  }
  return {
    total,
    groups: [...groups.values()].sort((a, b) => a.slug.localeCompare(b.slug) || b.visits - a.visits || a.ref.localeCompare(b.ref)),
    days: [...days.values()].sort((a, b) => b.day.localeCompare(a.day) || a.slug.localeCompare(b.slug) || a.ref.localeCompare(b.ref)),
  }
}

const pad = (s: string | number, n: number) => String(s).padEnd(n)

export function render(table: string, days: number, a: ReturnType<typeof aggregate>): string {
  const out = [`${table} — last ${days} day(s), UTC — without ref=${EXCLUDED_REFS.join('|')} and bot:* — ${a.total} visit(s)`]
  if (!a.total) return out.join('\n') + '\n  (no visits)'
  out.push('', `  ${pad('slug', 22)}${pad('ref', 18)}${pad('visits', 8)}${pad('es/en', 8)}mobile/desktop/tablet/other`)
  for (const g of a.groups) out.push(`  ${pad(g.slug, 22)}${pad(g.ref, 18)}${pad(g.visits, 8)}${pad(`${g.es}/${g.en}`, 8)}${g.mobile}/${g.desktop}/${g.tablet}/${g.other}`)
  out.push('', `  ${pad('day', 12)}${pad('slug', 22)}${pad('ref', 18)}visits`)
  for (const d of a.days) out.push(`  ${pad(d.day, 12)}${pad(d.slug, 22)}${pad(d.ref, 18)}${d.visits}`)
  return out.join('\n')
}
