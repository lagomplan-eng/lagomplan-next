// content/guia/agenda/public.ts
//
// What the browser may receive of the agenda. The page data (the props a Server Component hands to
// GuiaClient) is shipped to every visitor, so it must hold only what the page can show:
//   - Production: verified events only. Unverified events never leave the server.
//   - Preview / local: unverified events too (they render with a "Por confirmar" pill), but
//   - never the internal fields: checkNote (QA note), verifiedAt / verifiedBy, and the reference-only
//     why / hours / cost that no row renders.
// Pure (no fs), so a test can assert it.

import type { Agenda, AgendaEvent } from './schema'

/** Event fields that are internal or never rendered: removed from the page data in every environment. */
export const INTERNAL_EVENT_FIELDS = ['checkNote', 'verifiedAt', 'verifiedBy', 'why', 'hours', 'cost'] as const

export function publicAgenda(agenda: Agenda, showUnverified: boolean): Agenda {
  const events = agenda.events
    .filter((e) => e.status === 'verified' || showUnverified)
    .map((e) => {
      const copy: Record<string, unknown> = { ...e }
      for (const k of INTERNAL_EVENT_FIELDS) delete copy[k]
      return copy as unknown as AgendaEvent
    })
  return { ...agenda, events }
}

/** The agenda props of a guide page: Production (VERCEL_ENV=production) = verified only. */
export function agendaPageProps(agenda: Agenda, vercelEnv: string | undefined): { agenda: Agenda; showUnverified: boolean } {
  const showUnverified = vercelEnv !== 'production'
  return { agenda: publicAgenda(agenda, showUnverified), showUnverified }
}
