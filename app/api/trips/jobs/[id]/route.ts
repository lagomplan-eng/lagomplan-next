// app/api/trips/jobs/[id]/route.ts
// GET: return the current state of a generation job. Client polls this.

import { NextRequest, NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { getSupabaseAdmin, getSupabaseServer } from '../../../../../lib/supabase/server'

export const dynamic = 'force-dynamic'

type ErrBody = { ok: false; code: string; message: string }
const err = (status: number, code: string, message: string) =>
  NextResponse.json<ErrBody>({ ok: false, code, message }, { status })

async function resolveUser(req: NextRequest): Promise<User | null> {
  const supabase = await getSupabaseServer()
  const cookieRes = await supabase.auth.getUser()
  if (cookieRes.data.user) return cookieRes.data.user
  const authHeader = req.headers.get('authorization') ?? ''
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim()
    if (token) {
      const tokenRes = await supabase.auth.getUser(token)
      if (tokenRes.data.user) return tokenRes.data.user
    }
  }
  return null
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const user = await resolveUser(req)
    if (!user) return err(401, 'not_authenticated', 'Sign in required')

    const admin = getSupabaseAdmin()
    const { data, error } = await (admin as any)
      .from('generation_jobs')
      .select('id, user_id, status, chunks_total, chunks_done, result, error, trip_id')
      .eq('id', id)
      .single()

    if (error || !data) return err(404, 'job_not_found', 'Job not found')
    if (data.user_id !== user.id) return err(403, 'forbidden', 'Not your job')

    const payload: Record<string, unknown> = {
      jobId:       data.id,
      status:      data.status,
      chunksTotal: data.chunks_total,
      chunksDone:  data.chunks_done,
    }
    if (data.status === 'completed') {
      payload.trip_data = data.result
      payload.tripId    = data.trip_id
    }
    if (data.status === 'failed') {
      payload.error = data.error ?? 'generation_failed'
    }

    return NextResponse.json(payload)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return err(500, 'internal', `Internal error: ${message}`)
  }
}
