// app/api/generate-trip/route.ts
// Proxies to Supabase Edge Function — keeps API keys server-side

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 },
      )
    }

    const functionUrl = `${supabaseUrl}/functions/v1/generate-trip`
    console.log('[generate-trip] payload:', JSON.stringify(body))
    console.log('[generate-trip] calling:', functionUrl)

    // Abort after 55s so Node never drops the browser connection silently
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55_000)

    let edgeRes: Response
    try {
      edgeRes = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    console.log('[generate-trip] edge status:', edgeRes.status)

    // Read as text first so we can log and handle non-JSON safely
    const responseText = await edgeRes.text()
    console.log('[generate-trip] edge response (first 1000):', responseText.slice(0, 1000))

    if (!edgeRes.ok) {
      let detail: unknown
      try { detail = JSON.parse(responseText) } catch { detail = responseText }
      return NextResponse.json(
        { error: `Edge Function returned ${edgeRes.status}`, detail },
        { status: 502 },
      )
    }

    let data: unknown
    try {
      data = JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { error: 'Edge Function returned non-JSON', raw: responseText.slice(0, 500) },
        { status: 502 },
      )
    }

    return NextResponse.json(data)

  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError'
    const message   = err instanceof Error ? err.message : String(err)
    console.error('[generate-trip] error:', message)
    return NextResponse.json(
      { error: isTimeout ? 'Edge Function timed out (>55s)' : `Internal error: ${message}` },
      { status: isTimeout ? 504 : 500 },
    )
  }
}
