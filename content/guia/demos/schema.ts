// content/guia/demos/schema.ts
//
// Zod schema for content/demos/<slug>/demo.json — the ONE description of a
// demo. The shape mimics the future partners / properties / guides columns
// (partner = operator + brand, property = the house, guide = what is published)
// plus `kind` ("demo" | "partner") so both can share a table later.
//
// Pure (no fs): file-level checks (logo exists, images exist, reviewers list)
// live in validate.ts. Unknown keys are errors, so typos fail instead of being
// silently ignored.

import { z } from 'zod'
import type { IconKey } from '../types'
import { DEMO_ZONES } from './types'

export const SCHEMA_VERSION = 1

/** Icons usable for "Your house" spots (place-type icons only). */
export const SPOT_ICONS = [
  'coffee', 'croissant', 'utensilsSm', 'utensils', 'basket', 'trees',
  'landmark', 'martini', 'iceCream', 'mountain', 'compass', 'cross',
] as const satisfies readonly IconKey[]

const text = (what: string) => z.string({ error: `${what} must be text` }).trim().min(1, `${what} can't be empty`)
const https = (_what: string) =>
  z.string({ error: 'must be text' }).regex(/^https:\/\/[^\s]+$/, 'must be a full https:// URL (https://…)')
const bilingual = (what: string) =>
  z.object({ es: text(`${what}.es`), en: text(`${what}.en`) }, { error: `${what} needs both "es" and "en"` }).strict()

const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const tour = z.object({
  name: text('name'),
  description: bilingual('description'),
  price: text('price (use "[precio]" if unknown)'),
  url: https('url'),
  image: z.string().regex(/^\/images\/guia\/experiences\/[\w.-]+\.(?:jpg|jpeg|png|webp)$/,
    'must be one of our own illustrations: /images/guia/experiences/<file> (no third-party images). Omit it to show "[imagen]"').optional(),
  how_to_book: bilingual('how_to_book').optional(),
  min_booking_time: text('min_booking_time').optional(),
}).strict()

const spot = z.object({
  icon: z.enum(SPOT_ICONS, { error: `must be one of: ${SPOT_ICONS.join(', ')}` }),
  name: text('name'),
  distance: text('distance (street / address)'),
  note: text('note'),
}).strict()

const letterLang = z.object({
  paragraphs: z.array(text('paragraph')).min(1, 'at least 1 paragraph').max(6, 'at most 6 paragraphs'),
  link: z.object({
    text: text('link.text'),
    href: z.string().regex(/^(?:#tour-\d{1,2}|https:\/\/[^\s]+)$/, 'must be "#tour-N" or a full https:// URL'),
  }).strict().optional(),
}).strict()

/** `reviewers` comes from content/demos/config.json (see validate.ts). */
export function makeDemoSchema(reviewers: readonly string[]) {
  return z.object({
    schema_version: z.literal(SCHEMA_VERSION, { error: `must be ${SCHEMA_VERSION}` }),
    kind: z.enum(['demo', 'partner'], { error: 'must be "demo" or "partner"' }),
    slug: z.string().regex(SLUG, 'lowercase letters, digits and hyphens only (max 64)'),
    /** Where it is served. Default: both. ["preview"] ⇒ 404 on Production. */
    environments: z.array(z.enum(['preview', 'production'])).min(1, 'at least one environment').optional(),
    city: z.literal('cdmx', { error: 'must be "cdmx" (no other city exists yet)' }),
    /** null until the editorial reviewer OKs it. A valid review is required to publish to Production. */
    review: z.object({
      by: z.enum(reviewers as [string, ...string[]], { error: `must be one of: ${reviewers.join(', ')}` }),
      // One message per problem (not three): format, then real date, then not in the future.
      date: z.string().superRefine((d, ctx) => {
        const say = (message: string) => ctx.addIssue({ code: 'custom', message })
        if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return say(`must be YYYY-MM-DD (got "${d}")`)
        const t = new Date(`${d}T00:00:00Z`)
        if (Number.isNaN(t.getTime()) || t.toISOString().slice(0, 10) !== d) return say(`"${d}" is not a real date`)
        if (t.getTime() > Date.now() + 36e5 * 36) say(`"${d}" is in the future`)
      }),
    }).strict().nullable(),

    partner: z.object({
      name: text('partner.name'),
      /** File in the demo folder (png/jpg/webp/svg). */
      logo: z.string().regex(/^[\w.-]+\.(?:png|jpe?g|webp|svg)$/i, 'must be a file name inside the demo folder, e.g. "logo.png"').optional(),
      logo_source_url: https('logo_source_url').optional(),
      brand_color: z.string().regex(HEX, 'must be #rgb or #rrggbb, e.g. #194332').optional(),
      brand_color_provisional: z.boolean().optional(),
      brand_color_note: text('brand_color_note').optional(),
      contact: z.object({
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'is not a valid email').optional(),
        whatsapp: z.object({
          label: bilingual('whatsapp.label').optional(),
          href: z.string().regex(/^https:\/\/wa\.me\/\d{8,15}(?:\?[^\s]*)?$/, 'must look like https://wa.me/5215512345678').optional(),
        }).strict().optional(),
        instagram: z.string().regex(/^@[\w.]{1,30}$/, 'must be "@handle"').optional(),
      }).strict().optional(),
    }).strict(),

    property: z.object({
      /** First zone = initial tab and the FAQ zone (known limitation: FAQ uses only the first). */
      zones: z.array(z.enum(DEMO_ZONES, { error: `must be one of: ${DEMO_ZONES.join(', ')}` }))
        .min(1, 'at least one zone is required').max(3),
      check_out: text('check_out').optional(),
      rules: text('rules').optional(),
      /** "Your house" tab. Omit to show the highlighted placeholders. */
      house: z.object({
        name: text('house.name'),
        map_url: https('house.map_url').optional(),
        tagline: bilingual('house.tagline').optional(),
        orientation: bilingual('house.orientation').optional(),
        spots: z.object({
          es: z.array(spot).min(3, 'at least 3 spots per language').max(8),
          en: z.array(spot).min(3, 'at least 3 spots per language').max(8),
        }, { error: 'house.spots needs both "es" and "en"' }).strict(),
      }).strict().optional(),
    }).strict(),

    guide: z.object({
      /** Header/letter/stay-card co-brand layout. Needs partner.logo. */
      cobrand: z.boolean().optional(),
      host_letter: z.object({ es: letterLang.optional(), en: letterLang.optional() }).strict().optional(),
      tours: z.array(tour).min(1).max(6, 'at most 6 tours').optional(),
      tours_partner_note: bilingual('tours_partner_note').optional(),
      /** Replaces the two FAQ cards we must not promise on the operator's behalf. */
      faq: z.object({
        chefs_at_home: bilingual('faq.chefs_at_home').optional(),
        massages: bilingual('faq.massages').optional(),
      }).strict().optional(),
    }).strict().optional(),
  }).strict().superRefine((d, ctx) => {
    const add = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message })
    if (d.guide?.cobrand && !d.partner.logo) add(['guide', 'cobrand'], 'cobrand needs partner.logo (the header shows the logo alone)')
    if (d.partner.brand_color_provisional && !d.partner.brand_color) add(['partner', 'brand_color_provisional'], 'provisional flag set but there is no brand_color')
    const letter = d.guide?.host_letter
    if (letter) {
      for (const lang of ['es', 'en'] as const) {
        const l = letter[lang]
        if (!l) { add(['guide', 'host_letter', lang], `host_letter needs "${lang}" too (or remove the letter): the page is bilingual`); continue }
        if (l.link) {
          if (!l.paragraphs.some((p) => p.includes(l.link!.text))) add(['guide', 'host_letter', lang, 'link', 'text'], `"${l.link.text}" doesn't appear in any paragraph`)
          const m = /^#tour-(\d+)$/.exec(l.link.href)
          if (m && (!d.guide?.tours || Number(m[1]) > d.guide.tours.length || Number(m[1]) < 1)) add(['guide', 'host_letter', lang, 'link', 'href'], `${l.link.href} points to a tour that doesn't exist (${d.guide?.tours?.length ?? 0} tours)`)
        }
      }
    }
    if (d.guide?.cobrand && d.guide.host_letter && !d.property.rules && !d.partner.contact?.email && !d.partner.contact?.instagram) {
      add(['property', 'rules'], 'the "Your stay at a glance" card needs rules, an email or an Instagram')
    }
  })
}

export type DemoConfig = z.infer<ReturnType<typeof makeDemoSchema>>
export type DemoTour = z.infer<typeof tour>
export type Bilingual = { es: string; en: string }
