/**
 * types/messages.d.ts
 *
 * Types next-intl's useTranslations() against the actual message shape.
 * Import es.json as the canonical type source — it's always the most complete.
 *
 * After editing messages/*.json, TypeScript will immediately catch
 * missing keys in any useTranslations() call.
 */

import esMessages from '../messages/es.json'

type Messages = typeof esMessages

declare global {
  // Merges with next-intl's IntlMessages interface
  interface IntlMessages extends Messages {}
}
