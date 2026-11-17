// lib/hotels/lang.ts — 'es' when the phone's most preferred language is Spanish, otherwise 'en'.
export function langFromAcceptLanguage(header: string | null | undefined): 'es' | 'en' {
  if (!header) return 'en'
  const ranked = header
    .split(',')
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(';')
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='))
      const q = qParam ? parseFloat(qParam.slice(2)) : 1
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q, i }
    })
    .filter((t) => t.tag && t.tag !== '*' && t.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i)
  return ranked[0]?.tag.split('-')[0] === 'es' ? 'es' : 'en'
}
