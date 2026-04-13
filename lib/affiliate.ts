/**
 * lib/affiliate.ts
 *
 * Append affiliate ref param to outbound booking/experience URLs.
 * Replace REF_ID with your actual affiliate ID when live.
 */

const REF_ID = 'lagomplan'

export function withRef(url: string | undefined): string {
  if (!url) return '#'
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}ref=${REF_ID}`
}
