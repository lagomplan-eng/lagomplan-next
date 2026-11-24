/** GET /api/admin/hotels/export?status=&zone=&q= — CSV of the dashboard table (same filters). Admin only. */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminEmail } from '../../../../../lib/hotels/admin'
import { loadDashboard } from '../../../../../lib/hotels/stats'
import { filterHotels, hotelsToCsv } from '../../../../../lib/hotels/csv'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // never serve a hotel lookup from the Data Cache (see lib/hotels/db.ts)
export const revalidate = 0

export async function GET(req: NextRequest) {
  if (!(await getAdminEmail())) return new NextResponse(null, { status: 404 })
  const sp = req.nextUrl.searchParams
  const { hotels } = await loadDashboard()
  const rows = filterHotels(hotels, { status: sp.get('status') ?? undefined, zone: sp.get('zone') ?? undefined, q: sp.get('q') ?? undefined })
  return new NextResponse(hotelsToCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="hoteles-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
