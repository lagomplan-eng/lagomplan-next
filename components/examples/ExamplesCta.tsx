'use client'

import { Link } from '../../lib/navigation'
import { events } from '../../lib/analytics/events'

export default function ExamplesCta({ label }: { label: string }) {
  return (
    <Link
      href="/examples"
      onClick={() => events.ctaClick({ cta_id: 'hero_see_example', surface: 'home_hero' })}
      className="btn-outline inline-block"
    >
      {label}
    </Link>
  )
}
