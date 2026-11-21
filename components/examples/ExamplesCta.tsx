'use client'

import { Link } from '../../lib/navigation'
import { events } from '../../lib/analytics/events'
import { Button } from '../design'

export default function ExamplesCta({ label }: { label: string }) {
  return (
    <Button
      as={Link}
      href="/examples"
      variant="secondary"
      onClick={() => events.ctaClick({ cta_id: 'hero_see_example', surface: 'home_hero' })}
    >
      {label}
    </Button>
  )
}
