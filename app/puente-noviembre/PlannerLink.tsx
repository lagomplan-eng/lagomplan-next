'use client'

/**
 * Planner link for /puente-noviembre. Plain <a> (the planner lives under a
 * different root layout, so it's a full navigation anyway). No UTMs: the click
 * is tracked as GA4 `planner_cta_click` { lead_magnet, destination } instead.
 */

import { gaTrack } from '../../lib/analytics/ga'

export default function PlannerLink({
  href, destination, className, children,
}: {
  href: string
  /** GA4 `destination` param: a destination id, or 'hero' / 'final' / 'closing'. */
  destination: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => gaTrack('planner_cta_click', { lead_magnet: 'puente_noviembre', destination })}
    >
      {children}
    </a>
  )
}
