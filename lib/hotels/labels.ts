// lib/hotels/labels.ts — Spanish labels for the admin (the stored values stay English identifiers).
import type { HotelStatus } from './types'

export const STATUS_LABEL: Record<HotelStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  paused: 'Pausado',
  waitlist: 'Lista de espera',
}
export const EDITION_LABEL: Record<'free' | 'paid', string> = { free: 'Gratis', paid: 'De pago' }
