// lib/lead-magnets.ts
//
// Single source of truth for every email lead magnet. /api/lead-magnet and the
// landing pages read from here by slug. To add a magnet: put the PDF in
// public/downloads/, write an email template in lib/email/, add one entry below,
// build its landing page and render <LeadMagnetForm magnet={toPublic(...)} />.
//
// The PDF is optional (pdfPath/pdfUrl): a magnet without one delivers its
// content in the email itself, and the form's success state shows no
// download link.
//
// SERVER-ONLY: entries hold the email `render` function (which pulls in the
// HTML template). Client components must receive `toPublic(magnet)` as props,
// never import this file.

import { renderChecklistEmail } from './email/checklist-baby'
import { renderPuenteNoviembreEmail } from './email/puente-noviembre'

export interface RenderedEmail { html: string; text: string }

/**
 * Optional "next step" block shown under the success message. The shared form
 * renders only what this gives it; a magnet without `nextStep` shows no block.
 */
export interface LeadMagnetNextStep {
  /** Mono eyebrow when the delivery email was sent. */
  eyebrowSent: string
  /** Mono eyebrow when the email failed (the PDF, if any, is offered directly). */
  eyebrowFailed: string
  text: string
  buttonLabel: string
  /**
   * Button URL. MUST NOT carry UTM params when it points inside the site:
   * UTMs on internal links make GA4 start a new session and overwrite the
   * visitor's original source (e.g. Instagram). The click is tracked by
   * `analyticsEvent` instead. UTMs are only appropriate for external links.
   */
  buttonUrl: string
  /**
   * GA4 event fired on click (receives lead_magnet + form_position).
   * Optional: the form falls back to "planner_cta_click".
   */
  analyticsEvent?: string
  /** Extra GA4 params for that click event (e.g. { destination: 'form_success' }). */
  analyticsParams?: Record<string, string>
}

/** Per-magnet copy for the shared LeadMagnetForm. */
export interface LeadMagnetFormCopy {
  submitLabel: string
  /** Small print under the button. */
  microcopy: string
  /** Success text before the bolded address: "{successLead} {email}." */
  successLead: string
  /** Success text after the address sentence. */
  successTail: string
  /**
   * Headline when the email failed. With a PDF the form also shows a download
   * button; without one it only confirms the signup.
   */
  failedHeadline: string
}

export interface LeadMagnet {
  /** Request/config key, e.g. "checklist-baby". */
  slug: string
  /** GA4 `lead_magnet` param value (snake_case). */
  analyticsId: string
  /** Mailchimp tags applied on signup (UTM tags are appended by the route). */
  mailchimpTags: string[]
  /** Site-relative PDF path (landing page success link). Omit for no PDF. */
  pdfPath?: string
  /** Absolute PDF URL (email button). Omit for no PDF. */
  pdfUrl?: string
  emailSubject: string
  emailPreheader: string
  form: LeadMagnetFormCopy
  nextStep?: LeadMagnetNextStep
  render: (args: { name: string; preheader: string; pdfUrl?: string }) => RenderedEmail
}

/** Plain-data subset that is safe to hand to client components. */
export interface LeadMagnetPublic {
  slug: string
  analyticsId: string
  pdfPath?: string
  form: LeadMagnetFormCopy
  nextStep?: LeadMagnetNextStep
}

const CHECKLIST_PDF_URL = 'https://lagomplan.com/downloads/checklist-hotel-bebe.pdf'

export const LEAD_MAGNETS: Record<string, LeadMagnet> = {
  'checklist-baby': {
    slug: 'checklist-baby',
    analyticsId: 'checklist_baby',
    mailchimpTags: ['magnet_baby', 'persona_family'],
    pdfPath: '/downloads/checklist-hotel-bebe.pdf',
    pdfUrl: CHECKLIST_PDF_URL,
    emailSubject: 'Tu checklist: 24 preguntas antes de reservar',
    emailPreheader: 'Empieza por la cuna. Es la que más sorpresas da.',
    form: {
      submitLabel:    'Recibir el checklist gratis →',
      microcopy:      'Un PDF de 12 páginas, para imprimir o guardar en tu celular. Sin spam — puedes darte de baja cuando quieras.',
      successLead:    'Te mandamos el checklist a',
      successTail:    'Si no llega en 5 minutos, revisa promociones o spam.',
      failedHeadline: 'Listo. Aquí está tu checklist.',
    },
    nextStep: {
      eyebrowSent:   'Mientras llega tu checklist',
      eyebrowFailed: 'Siguiente paso',
      text:          'Arma tu próximo viaje en familia en 60 segundos — con horarios de siesta incluidos.',
      buttonLabel:   'Planea tu viaje gratis →',
      buttonUrl:     '/es/planificador',
      analyticsEvent: 'planner_cta_click',
    },
    render: ({ name, preheader, pdfUrl }) => renderChecklistEmail({ name, preheader, pdfUrl: pdfUrl ?? CHECKLIST_PDF_URL }),
  },
  // No PDF: the four escapadas are in the email body itself.
  'puente-noviembre': {
    slug: 'puente-noviembre',
    analyticsId: 'puente_noviembre',
    mailchimpTags: ['magnet_puente', 'persona_couple'],
    emailSubject: 'Las 4 escapadas para el puente de noviembre',
    emailPreheader: 'Sábado 14 a lunes 16. Elijan una y el plan sale en 60 segundos.',
    form: {
      submitLabel:    'Mandármelas →',
      microcopy:      'Un correo, sin spam. Puedes darte de baja cuando quieras.',
      successLead:    'Te mandamos las cuatro escapadas a',
      successTail:    'Reenvíaselo a quien siempre dice "tú decide".',
      failedHeadline: 'Listo. Ya estás en la lista.',
    },
    nextStep: {
      eyebrowSent:    'MIENTRAS TANTO',
      eyebrowFailed:  'Siguiente paso',
      text:           'Elige una y arma el plan en 60 segundos.',
      buttonLabel:    'Planear nuestro puente →',
      buttonUrl:      '/es/planificador',
      analyticsEvent: 'planner_cta_click',
      analyticsParams: { destination: 'form_success' },
    },
    render: ({ name, preheader }) => renderPuenteNoviembreEmail({ name, preheader }),
  },
}

export function getLeadMagnet(slug: unknown): LeadMagnet | undefined {
  return typeof slug === 'string' && Object.prototype.hasOwnProperty.call(LEAD_MAGNETS, slug)
    ? LEAD_MAGNETS[slug]
    : undefined
}

export function toPublic(m: LeadMagnet): LeadMagnetPublic {
  return { slug: m.slug, analyticsId: m.analyticsId, pdfPath: m.pdfPath, form: m.form, nextStep: m.nextStep }
}
