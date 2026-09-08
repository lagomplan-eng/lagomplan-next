// content/guia/zones/index.ts
//
// Zone registry. Register a new zone here after adding its file under
// content/guia/zones/<id>.ts. Multiple partners can share one zone.

import type { Zone, ZoneId } from './types'
import { condesa } from './condesa'
import { roma } from './roma'
import { polanco } from './polanco'

const ZONES: Partial<Record<ZoneId, Zone>> = {
  condesa,
  roma,
  polanco,
}

export function getZone(id: ZoneId | undefined): Zone | null {
  if (!id) return null
  return ZONES[id] ?? null
}
