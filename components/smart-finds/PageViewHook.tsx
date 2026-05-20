'use client'

/**
 * components/smart-finds/PageViewHook.tsx
 *
 * Tiny client island that fires events.contentViewed on mount. Lets the
 * server-rendered Smart Finds kit pages emit a content-viewed signal
 * without converting the entire page to a client component. Reusable
 * across any kit page that wants the same retargeting hook.
 *
 * Renders null — purely analytical.
 */

import { useEffect } from 'react'
import { events } from '../../lib/analytics'

interface Props {
  kitId:   string
  locale:  'es' | 'en'
  persona?: string
}

export default function PageViewHook({ kitId, locale, persona }: Props) {
  useEffect(() => {
    events.contentViewed({
      content_type: 'kit',
      content_id:   kitId,
      locale,
      persona,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kitId, locale])

  return null
}
