/**
 * lib/analytics/index.ts — public surface.
 *
 * Call sites should only import from here:
 *
 *   import { events } from '@/lib/analytics'
 *   events.lead({ value: 199, currency: 'MXN' })
 *
 * The vendor-specific helpers (`metaTrack`, `metaTrackCustom`) are
 * also exported for the rare case where you need a pixel-only event
 * with no GA equivalent — but prefer adding a method to `events` so
 * everything stays consistent across providers.
 */

export { events } from './events'
export {
  metaTrack,
  metaTrackCustom,
  metaPageView,
  isMetaEnabled,
} from './meta'
export type { MetaStandardEvent } from './meta'
export { gaTrack, gaPageView, isGAEnabled } from './ga'
