// lib/lead-magnets.ts
//
// Single source of truth for every email lead magnet. /api/lead-magnet and the
// landing pages read from here by slug. To add a magnet: put the PDF in
// public/downloads/, write an email template in lib/email/, add one entry below,
// build its landing page and render <LeadMagnetForm magnet={toPublic(...)} />.
//
// SERVER-ONLY: entries hold the email `render` function (which pulls in the
// HTML template). Client components must receive `toPublic(magnet)` as props,
// never import this file.

import { renderChecklistEmail } from './email/checklist-baby'

export interface RenderedEmail { html: string; text: string }

export interface LeadMagnet {
  /** Request/config key, e.g. "checklist-baby". */
  slug: string
  /** GA4 `lead_magnet` param value (snake_case). */
  analyticsId: string
  /** Mailchimp tags applied on signup (UTM tags are appended by the route). */
  mailchimpTags: string[]
  /** Site-relative PDF path (landing page success link). */
  pdfPath: string
  /** Absolute PDF URL (email button). */
  pdfUrl: string
  emailSubject: string
  emailPreheader: string
  render: (args: { name: string; preheader: string; pdfUrl: string }) => RenderedEmail
}

/** Plain-data subset that is safe to hand to client components. */
export interface LeadMagnetPublic {
  slug: string
  analyticsId: string
  pdfPath: string
}

export const LEAD_MAGNETS: Record<string, LeadMagnet> = {
  'checklist-baby': {
    slug: 'checklist-baby',
    analyticsId: 'checklist_baby',
    mailchimpTags: ['magnet_baby', 'persona_family'],
    pdfPath: '/downloads/checklist-hotel-bebe.pdf',
    pdfUrl: 'https://lagomplan.com/downloads/checklist-hotel-bebe.pdf',
    emailSubject: 'Tu checklist: 24 preguntas antes de reservar',
    emailPreheader: 'Empieza por la cuna. Es la que más sorpresas da.',
    render: ({ name, preheader, pdfUrl }) => renderChecklistEmail({ name, preheader, pdfUrl }),
  },
}

export function getLeadMagnet(slug: unknown): LeadMagnet | undefined {
  return typeof slug === 'string' && Object.prototype.hasOwnProperty.call(LEAD_MAGNETS, slug)
    ? LEAD_MAGNETS[slug]
    : undefined
}

export function toPublic(m: LeadMagnet): LeadMagnetPublic {
  return { slug: m.slug, analyticsId: m.analyticsId, pdfPath: m.pdfPath }
}
