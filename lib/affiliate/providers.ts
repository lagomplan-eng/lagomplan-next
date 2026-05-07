/**
 * lib/affiliate/providers.ts
 *
 * Registry of every Stay22-Allez-compatible provider used by the planner.
 * The Allez slug is the path segment after `/allez/` in the canonical URL
 * documented at:
 *   https://community.stay22.com/allez-deep-links-everything-you-need-to-know
 *
 * To add a new provider, append an entry. Nothing else has to change —
 * `buildAffiliateLink` reads from this map.
 */

export type ProviderId = 'booking' | 'hotelscom' | 'getyourguide' | 'expedia'

export type ProviderCategory = 'hotel' | 'activity'

export interface ProviderConfig {
  id:         ProviderId
  /** Path segment after /allez/ in the canonical Stay22 deep-link URL. */
  allezSlug:  string
  /** Display label used by analytics + the booking modal. */
  label:      string
  /** Drives validation hints and the booking-modal copy bucket. */
  category:   ProviderCategory
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  booking: {
    id:         'booking',
    allezSlug:  'booking',
    label:      'Booking.com',
    category:   'hotel',
  },
  hotelscom: {
    id:         'hotelscom',
    allezSlug:  'hotelscom',
    label:      'Hotels.com',
    category:   'hotel',
  },
  getyourguide: {
    id:         'getyourguide',
    allezSlug:  'getyourguide',
    label:      'GetYourGuide',
    category:   'activity',
  },
  expedia: {
    id:         'expedia',
    allezSlug:  'expedia',
    label:      'Expedia',
    category:   'activity',
  },
} as const
