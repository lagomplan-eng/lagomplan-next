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
      .select('id, user_id, status, chunks_total, chunks_done, result, error, trip_id, updated_at')
      .eq('id', id)
      .single()

    if (error || !data) return err(404, 'job_not_found', 'Job not found')
    if (data.user_id !== user.id) return err(403, 'forbidden', 'Not your job')

    // Client-driven reconciliation. Hobby tier doesn't allow per-minute crons,
    // so use the user's polling traffic as the rescue mechanism: if a job is
    // stuck in queued/running and hasn't been touched in STALE_MS, the
    // self-reinvoke chain probably died. Fire the worker to resume. Pre-write
    // updated_at so concurrent polls don't all fire — the next poll on the
    // same job will see fresh updated_at and skip.
    //
    // Threshold must exceed the worker's typical per-segment time (~130s) so
    // we don't fire redundant invocations during normal operation. 180s gives
    // a safe margin while keeping rescue latency at <3 min.
    const STALE_MS = 180_000
    const isStuck = (data.status === 'queued' || data.status === 'running')
    const updatedAtMs = data.updated_at ? new Date(data.updated_at).getTime() : 0
    if (isStuck && Date.now() - updatedAtMs > STALE_MS) {
      // Claim the rescue first so racing polls bail. Optimistic: only update
      // if status is still the value we read; otherwise some other process
      // already advanced the job.
      await (admin as any)
        .from('generation_jobs')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', data.id)
        .eq('status', data.status)

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (supabaseUrl && anonKey) {
        fetch(`${supabaseUrl}/functions/v1/generate-trip-worker`, {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            Authorization:   `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ job_id: data.id }),
        }).catch(e => console.warn('[trips/jobs/poll] reinvoke failed:', e))
        console.log('[trips/jobs/poll] rescued stuck job', data.id, 'last touched', Math.round((Date.now() - updatedAtMs) / 1000), 's ago')
      }
    }

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
