# Agent prompt — Meta Conversions API (CAPI) mirror

Paste the prompt below into a fresh Claude Code session when Meta ad spend is on the calendar (within ~30 days). Self-contained — the future agent won't have the conversation context from when this was scoped, so the prompt re-establishes everything needed.

## Why this exists, in one paragraph

The browser-side Meta Pixel that ships from `app/[locale]/layout.tsx` (gated behind cookie consent in `components/analytics/ConsentSync.tsx`) loses 20–40% of events to iOS 14+ ATT, Safari ITP, ad blockers, and users closing tabs before the success page loads. Meta's Conversions API (CAPI) fires server-to-server with 100% delivery. Both Pixel + CAPI fire to the same Pixel ID; Meta deduplicates events that share an `event_id`. This prompt scopes a Purchase-only mirror that adds the server-side fire alongside the existing browser-side one. Without it, ROAS reports systematically undercount and Meta's optimization algorithm trains on the wrong audience.

## When to ship

- ✅ Ship when: Meta ad spend is starting within 30 days, OR ROAS reports are showing numbers you don't trust
- ⛔ Skip when: Meta ads aren't on the 90-day roadmap (CAPI's value is conditional on having an optimization algorithm to feed)

---

## The prompt

```
Ship the Meta Conversions API (CAPI) mirror for Purchase events. Mirror
the pattern we already shipped for Google Analytics via Measurement
Protocol — see lib/analytics/ga-server.ts and how it's called from
app/api/stripe-webhook/route.ts.

WHY: browser-side Meta Pixel events (fbq) lose 20–40% to iOS ATT,
Safari ITP, ad blockers, and users closing tabs before the success
page loads. CAPI fires server-to-server with 100% delivery. Meta
dedupes via shared event_id, so both fires count as one purchase.

SCOPE FOR THIS PR:
  • Purchase-only (skip CompleteRegistration / Lead — separate PR
    later if needed).
  • Server-side fire from app/api/stripe-webhook/route.ts after a
    successful checkout.session.completed.
  • Browser-side keeps firing from TripResult.tsx (events.purchase
    on the /planner?checkout=success page).
  • event_id dedup wiring between the two fires.

PREREQUISITES (user must set in Vercel before this works):
  • META_CAPI_ACCESS_TOKEN — generate in Meta Business Manager →
    Data Sources → click Pixel → Settings → Conversions API →
    Generate access token. Server-only env var, NOT NEXT_PUBLIC.
  • NEXT_PUBLIC_META_PIXEL_ID — already set, no action needed.

EXISTING PATTERNS TO MIRROR (study these before writing code):

  1. lib/analytics/ga-server.ts is the closest reference. It posts
     to google-analytics.com/mp/collect with a client_id captured
     from the browser's _ga cookie at checkout creation time. The
     same shape applies for Meta CAPI: capture _fbp cookie at
     checkout creation, pass through Stripe metadata, fire from
     webhook with full match-quality user_data.

  2. app/api/checkout/route.ts already uses parseGaClientId(
     req.cookies.get('_ga')?.value) to stash ga_client_id in Stripe
     metadata. Add parallel logic for _fbp and fbclid:
       - Read req.cookies.get('_fbp')?.value
       - Read fbclid from query params on the request (it'll be
         in the URL the user hit when they triggered checkout, but
         that's tricky — easier path is to read it from the
         first-touch attribution localStorage we capture in
         lib/analytics/attribution.ts). For first iteration, just
         use _fbp; fbclid is optional.

  3. app/api/stripe-webhook/route.ts already calls gaServerEvent
     after a successful credit/sub grant. Add a metaCAPIEvent call
     right next to it, sharing the same transaction_id (Stripe
     session.id) as the event_id for dedup.

  4. lib/analytics/events.ts — events.purchase currently fires
     metaTrack('Purchase', params) browser-side. Modify to:
       - Generate a unique event_id (use crypto.randomUUID())
       - Pass it as the third arg to fbq for browser-side
       - Forward it to Stripe metadata via the checkout call site
         (TripResult.tsx — search for the purchase flow that calls
         /api/checkout)

NEW FILES:

  lib/analytics/meta-server.ts
    Mirror ga-server.ts shape exactly. Export:
      metaCAPIEvent({ eventName, eventId, eventTime, eventSourceUrl,
                      userData, customData })
    Implementation:
      - POST to https://graph.facebook.com/v18.0/{PIXEL_ID}/events
      - Body shape (Meta v18 spec):
        {
          data: [{
            event_name:       eventName,
            event_time:       eventTime,
            event_id:         eventId,
            action_source:    'website',
            event_source_url: eventSourceUrl,
            user_data: {
              em:                 sha256(email_lowercase),
              external_id:        sha256(supabase_user_id),
              client_ip_address:  rawIp,
              client_user_agent:  userAgent,
              fbp:                fbpCookie,
              fbc:                fbcStringIfPresent,
            },
            custom_data: { value, currency, content_ids?, contents? },
          }],
          access_token: META_CAPI_ACCESS_TOKEN,
        }
      - Hashing: SHA-256 hex, lowercase before hashing for emails,
        no salt (Meta wants the raw lowercase hash, NOT peppered).
      - Silent fail-safe like gaServerEvent — return false on any
        error, never throw.

  helper for sha256: Node crypto.createHash('sha256').update(s)
    .digest('hex'). Don't import a new dep — Node has it.

EDITS:

  app/api/checkout/route.ts
    Read _fbp cookie alongside _ga. Stash both in Stripe metadata:
      ga_client_id, fbp, event_id (generated here for THIS purchase
      so browser + server share it). Pass event_id back to the
      client in the response so events.purchase can use the same
      one for the browser fire.

  app/api/stripe-webhook/route.ts
    After the existing gaServerEvent call, add metaCAPIEvent with:
      - eventName: 'Purchase'
      - eventId: session.id (Stripe session ID — natural dedup key,
        matches what the browser-side fire would have used if we
        also store it as event_id from the metadata)
      - eventTime: Math.floor(Date.now() / 1000)
      - eventSourceUrl: session.success_url or the constructed
        success URL (origin + '/planner?checkout=success')
      - userData: pulled from session + req headers
      - customData: { value: session.amount_total / 100, currency,
        contents: [{ id: plan, quantity: 1 }] }

  lib/analytics/events.ts
    events.purchase: generate eventId via crypto.randomUUID() (if
    available browser-side) and pass to metaTrack as a third arg.
    The metaTrack wrapper in lib/analytics/meta.ts needs to accept
    the third arg too — Meta's fbq supports
    fbq('track', 'Purchase', params, { eventID: '...' }).

  lib/analytics/meta.ts
    Update metaTrack signature to accept optional
    { eventID?: string } third arg, forward to fbq.

CONSENT GATING:
  Like ga-server, only fire when the user actually accepted analytics.
  Browser Meta Pixel only loads under consent='all' (see ConsentSync),
  so _fbp cookie absence is a natural signal — if metadata.fbp is
  empty, skip the CAPI fire. Same posture as ga-server: never
  synthesize a phantom identifier for users who declined.

TESTING:
  Meta Business Manager → Events Manager → click Pixel → Test Events
  tab → grab the test_event_code → temporarily include it in the
  CAPI payload's test_event_code field while testing → verify both
  browser-side and CAPI-side fires appear AND that Meta dedupes by
  event_id (should see "1 server, 1 browser, deduplicated" in the
  Test Events view).

NOT IN SCOPE:
  • CompleteRegistration / Lead via CAPI — separate PR
  • ViewContent via CAPI — browser fires usually land OK for views
  • Periodic batch upload (Meta supports batching past events) —
    YAGNI for now
  • Customer Match audience uploads — different API entirely

REPO NOTES:
  • Migration drift means supabase db push doesn't work — but this
    PR doesn't need a migration. Pure code.
  • All commits should be type-checked with `npx tsc --noEmit`
    before push.
  • Follow the existing inline-comment style in ga-server.ts —
    explain WHY decisions were made, especially around silent
    failures and consent posture.

ASK ME BEFORE STARTING if you need clarification on the user_data
fields — Meta's hashing requirements are easy to get wrong and a
1-character mistake silently drops match quality.
```

---

## Related context

- Pattern reference (study before writing code): [`lib/analytics/ga-server.ts`](../../lib/analytics/ga-server.ts) — the GA equivalent we already shipped
- Webhook call site: [`app/api/stripe-webhook/route.ts`](../../app/api/stripe-webhook/route.ts) — where the CAPI fire goes
- Cookie threading pattern: [`app/api/checkout/route.ts`](../../app/api/checkout/route.ts) — already does `_ga`, mirror for `_fbp`
- Consent system: [`components/analytics/ConsentSync.tsx`](../../components/analytics/ConsentSync.tsx) — Meta Pixel only loads under `consent='all'`, same posture must apply to CAPI fires

## Estimated effort

~3–4 hours end-to-end including testing in Meta's Test Events view.
