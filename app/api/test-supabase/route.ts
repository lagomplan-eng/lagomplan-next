import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    return NextResponse.json({
      ok: hasUrl && hasAnon,
      hasUrl,
      hasAnon,
      error: null
    })
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}