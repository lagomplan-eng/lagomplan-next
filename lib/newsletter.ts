// lib/newsletter.ts
//
// Pure helpers behind POST /api/subscribe (Mailchimp). Extracted from the route
// so the email-validation + env-config logic is unit-testable — the config path
// is exactly what surfaces as "Server configuration error" when the Mailchimp
// env vars aren't present in the running environment (e.g. a non-main Vercel
// preview, where MAILCHIMP_* may be scoped to Preview (main) only).

/** Same shape the route accepts: trims + lowercases, then a basic RFC-ish check. */
export function isValidNewsletterEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const e = email.trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

export interface MailchimpConfig {
  apiKey: string
  listId: string
  tag: string
  /** Datacenter parsed from the key suffix, e.g. "abc-us13" → "us13". */
  dc: string
}

/**
 * Read + validate the Mailchimp env config. Returns null when the required
 * vars (API key, list id) are missing/empty — the caller turns that into the
 * 500 "Server configuration error". Reads from the passed env (defaults to
 * process.env) at call time, not module load, so it reflects the live
 * environment and is injectable in tests.
 */
export function readMailchimpConfig(env: NodeJS.ProcessEnv = process.env): MailchimpConfig | null {
  const apiKey = (env.MAILCHIMP_API_KEY ?? '').trim()
  const listId = (env.MAILCHIMP_LIST_ID ?? '').trim()
  const tag    = (env.MAILCHIMP_TAG ?? '').trim()
  if (!apiKey || !listId) return null
  const dc = apiKey.split('-').pop() ?? ''
  return { apiKey, listId, tag, dc }
}

/** Mailchimp Marketing API members endpoint for a given config. */
export function mailchimpMembersUrl(cfg: MailchimpConfig): string {
  return `https://${cfg.dc}.api.mailchimp.com/3.0/lists/${cfg.listId}/members`
}
