'use client'

/**
 * components/affiliate/Stay22Loader.tsx
 *
 * Loads the Stay22 LetMeAllez script (it was an inline <Script> in the layout), except on
 * the Experiencias hub, which has no non-GetYourGuide links and where the script costs
 * ~1-3 s of main-thread time on mobile.
 *
 * - Landing on the hub: the script is not requested at all.
 * - Navigating from the hub to another page (client-side): it loads then, once.
 * - `excludes: 'getyourguide'`: LetMeAllez must not rewrite GetYourGuide links. Left alone it swaps
 *   our GetYourGuide partner_id (see lib/affiliate/gyg.ts) for Stay22's and swallows the click before our own handlers run.
 *   Everything else (hotels, flights, …) is monetized by Stay22 as before.
 */

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const LMA_ID = '69b992c248666aca4133dbbe'
const HUB_PATH = /^\/(es|en)\/(experiencias|experiences)\/?$/

export function isExperiencesHubPath(pathname: string | null | undefined): boolean {
  return !!pathname && HUB_PATH.test(pathname)
}

export default function Stay22Loader() {
  const pathname = usePathname()

  useEffect(() => {
    if (isExperiencesHubPath(pathname)) return
    const w = window as unknown as { Stay22?: { params?: Record<string, unknown> } }
    if (document.getElementById('stay22-letmeallez')) return
    w.Stay22 = w.Stay22 || {}
    w.Stay22.params = { lmaID: LMA_ID, excludes: 'getyourguide' }
    const s = document.createElement('script')
    s.id = 'stay22-letmeallez'
    s.async = true
    s.src = 'https://scripts.stay22.com/letmeallez.js'
    document.head.appendChild(s)
  }, [pathname])

  return null
}
