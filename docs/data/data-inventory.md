# Data inventory — Lagomplan

**Date:** 2026-10-29 · **Code state:** `main` @ `5428967` · **Status:** read-only inventory, no changes made to the database or the app.

## How this was made, and its limits

- **No table rows were read, queried or printed.** Sources: (1) the **live** public schema (tables, columns, types) from the PostgREST OpenAPI document, which describes structure and contains no data; (2) the repository's migrations (`supabase/migrations/*.sql`) for RLS policies, grants, functions and foreign keys; (3) the application code (`app/`, `lib/`, `components/`, `supabase/functions/`, `middleware.ts`); (4) the **names** (never the values) of the Production environment variables.
- **The live policies and grants were not read.** The Postgres catalog (`pg_policies`, grants) was not queried; policies below come from the migrations. Production is known to have been patched outside the migrations once (the `trips` policy, 2026-07-21), so each policy line is "verified in the migrations", not "verified live". Section 1.3 has read-only SQL to confirm them in the Supabase dashboard.
- Tags: **[verified in schema/code]** = seen directly in the live schema, a migration or the code (with file:line). **[inferred]** = a conclusion from names, comments or documented third-party behaviour. **[por confirmar]** = cannot be known from the repository.
- Things outside the repository that this document cannot see: Supabase dashboard settings (Auth site URL, email templates, `verify_jwt` per function), Vercel/Supabase log retention, Google Analytics / Meta / Mailchimp / Stripe account settings, Anthropic's data-retention terms.
- The free-guide work (`/guia/cdmx`, the `guide_reports` code) is **not in `main`**; the `guide_reports` table is live (migration applied 2026-10-21).

## 1. Database (public schema)

The live schema has **23 tables and 247 columns**, identical to what the migrations declare (checked column by column; no drift). Authentication data lives outside `public`, in Supabase's `auth` schema (`auth.users`: email, password hash, `raw_user_meta_data.full_name`, sign-in timestamps; Supabase also keeps sessions and an audit log there, which normally include IP and user-agent) [inferred: Supabase defaults, not inspected].

### 1.1 Columns

Types are from the live schema [verified in schema]. "What it is for" comes from the schema comments, the code, or the column name [verified where a comment/code exists, otherwise inferred].

| Table | Column | Type | What it is for | Personal data? |
|---|---|---|---|---|
| `click_events` | `id` | uuid | Row identifier (random UUID). | no |
| `click_events` | `event_type` | text | Kind of click event (free text chosen by the sender). | free text (client-controlled) |
| `click_events` | `item_type` | text | What kind of item was clicked. | free text (client-controlled) |
| `click_events` | `item_slug` | text | Slug of the item. | free text (client-controlled) |
| `click_events` | `item_name` | text | Display name of the item. | free text (client-controlled) |
| `click_events` | `page` | text | Page where it happened (client-supplied; could contain a URL with a query string). | free text (client-controlled) |
| `click_events` | `created_at` | timestamptz | When the row was created. | no |
| `consent_log` | `id` | uuid | Row identifier (random UUID). | no |
| `consent_log` | `created_at` | timestamptz | When the row was created. | no |
| `consent_log` | `choice` | text | Cookie choice: "all" or "essential". | no |
| `consent_log` | `user_id` | uuid | Account of the visitor at that moment (null if logged out). | YES |
| `consent_log` | `ip_hash` | text | Salted SHA-256 of the visitor IP address. | pseudonymous |
| `consent_log` | `user_agent` | text | Full browser user-agent string, cut at 500 characters. | device data (personal-adjacent) |
| `consent_log` | `locale` | text | Page language. | no |
| `consent_log` | `gpc` | boolean | Whether the browser sent Global Privacy Control. | no |
| `consent_log` | `policy_version` | text | Version of the privacy policy shown. | no |
| `demo_visits` | `id` | uuid | Row identifier (random UUID). | no |
| `demo_visits` | `created_at` | timestamptz | When the row was created. | no |
| `demo_visits` | `slug` | text | Slug of the demo (prospect) page viewed. | no |
| `demo_visits` | `lang` | text | Language shown (es/en). | no |
| `demo_visits` | `params_present` | text[] | NAMES of URL parameters present (never their values). | no |
| `demo_visits` | `ua_summary` | text | Device and browser bucket, e.g. mobile:safari. Never the raw user-agent. | no |
| `demo_visits` | `ref` | text | Optional campaign tag from ?ref= (regex a-z0-9_- up to 32 chars). | tag typed in a link (low risk) |
| `generation_chunks` | `job_id` | uuid | Generation job this piece belongs to. | no |
| `generation_chunks` | `chunk_index` | integer | Position of the piece in the itinerary. | no |
| `generation_chunks` | `content` | jsonb | AI-generated itinerary piece (JSON). | derived from user input |
| `generation_chunks` | `created_at` | timestamptz | When the row was created. | no |
| `generation_jobs` | `id` | uuid | Row identifier (random UUID). | no |
| `generation_jobs` | `user_id` | uuid | Account that requested the trip. | YES |
| `generation_jobs` | `trip_id` | uuid | Resulting trip. | no |
| `generation_jobs` | `status` | text | Job state. | no |
| `generation_jobs` | `inputs` | jsonb | Planner inputs sent to the generator (JSON). | free text possible |
| `generation_jobs` | `chunks_total` | integer | Pieces to generate. | no |
| `generation_jobs` | `chunks_done` | integer | Pieces generated so far. | no |
| `generation_jobs` | `result` | jsonb | Final AI result (JSON). | derived from user input |
| `generation_jobs` | `error` | text | Error message if the job failed. | possible echo of input |
| `generation_jobs` | `created_at` | timestamptz | When the row was created. | no |
| `generation_jobs` | `updated_at` | timestamptz | When the row was last modified. | no |
| `generation_jobs` | `partial_result` | jsonb | Progressive result while generating. | derived from user input |
| `generation_jobs` | `budget_currency_suspect` | boolean | Sanity-check flag on the budget currency. | no |
| `generation_jobs` | `skeleton` | jsonb | Day-by-day outline computed first (JSON). | derived from user input |
| `generation_jobs` | `credit_charged_at` | timestamptz | When one trip credit was charged. | no |
| `generation_metrics` | `id` | uuid | Row identifier (random UUID). | no |
| `generation_metrics` | `job_id` | uuid | Job the call belongs to. | no |
| `generation_metrics` | `chunk_index` | integer | Piece number. | no |
| `generation_metrics` | `schema_kind` | text | Type of generation call. | no |
| `generation_metrics` | `path` | text | Code path used. | no |
| `generation_metrics` | `model` | text | Anthropic model used. | no |
| `generation_metrics` | `ms` | integer | Duration in ms. | no |
| `generation_metrics` | `input_tokens` | integer | Tokens sent. | no |
| `generation_metrics` | `output_tokens` | integer | Tokens received. | no |
| `generation_metrics` | `stop_reason` | text | Why the model stopped. | no |
| `generation_metrics` | `ok` | boolean | Whether the call succeeded. | no |
| `generation_metrics` | `created_at` | timestamptz | When the row was created. | no |
| `generation_metrics` | `cache_read` | integer | Prompt-cache tokens read. | no |
| `generation_metrics` | `attempt` | integer | Retry number. | no |
| `generation_metrics` | `status_code` | integer | HTTP status returned by Anthropic. | no |
| `generation_metrics` | `error` | text | Truncated error body for failed calls. | possible echo of input |
| `generation_metrics` | `cost_usd` | numeric | Computed cost of the call. | no |
| `generation_metrics` | `model_fallback` | boolean | Whether a fallback model was used. | no |
| `guide_reports` | `id` | uuid | Row identifier (random UUID). | no |
| `guide_reports` | `created_at` | timestamptz | When the row was created. | no |
| `guide_reports` | `guide_slug` | text | Guide the report came from. | no |
| `guide_reports` | `neighborhood` | text | Zone tab of the reported place. | no |
| `guide_reports` | `place` | text | Name of the place reported as closed/different. | no |
| `guide_reports` | `issue` | text | `closed` or `different`. | no |
| `guide_visits` | `id` | uuid | Row identifier (random UUID). | no |
| `guide_visits` | `created_at` | timestamptz | When the row was created. | no |
| `guide_visits` | `slug` | text | Slug of the partner guide viewed (or free_<host> for the free guide). | no |
| `guide_visits` | `lang` | text | Language shown (es/en). | no |
| `guide_visits` | `params_present` | text[] | NAMES of URL parameters present (never their values). | no |
| `guide_visits` | `ua_summary` | text | Device and browser bucket. Never the raw user-agent. | no |
| `guide_visits` | `ref` | text | Optional campaign tag from ?ref= (regex a-z0-9_- up to 32 chars). | tag typed in a link (low risk) |
| `kit_products` | `id` | uuid | Row identifier (random UUID). | no |
| `kit_products` | `kit_id` | uuid | Kit. | no |
| `kit_products` | `product_id` | uuid | Product. | no |
| `kit_products` | `sort_order` | integer | Display order. | no |
| `kit_products` | `created_at` | timestamptz | When the row was created. | no |
| `kits` | `id` | uuid | Row identifier (random UUID). | no |
| `kits` | `slug` | text | URL slug. | no |
| `kits` | `name` | text | Kit name. | no |
| `kits` | `description` | text | Kit description. | no |
| `kits` | `image_url` | text | Image. | no |
| `kits` | `cta_label` | text | Button text. | no |
| `kits` | `is_active` | boolean | Published flag. | no |
| `kits` | `is_featured` | boolean | Featured flag. | no |
| `kits` | `sort_order` | integer | Display order. | no |
| `kits` | `created_at` | timestamptz | When the row was created. | no |
| `kpi_monthly` | `id` | uuid | Row identifier (random UUID). | no |
| `kpi_monthly` | `month_id` | text | Month key. | no |
| `kpi_monthly` | `month_label` | text | Month name. | no |
| `kpi_monthly` | `month_start` | date | First day of the month. | no |
| `kpi_monthly` | `revenue_total` | numeric | Monthly revenue (business-sensitive). | business-sensitive |
| `kpi_monthly` | `email_total` | integer | Total email subscribers. | no |
| `kpi_monthly` | `explorer_active` | integer | Active paid Explorer users. | no |
| `kpi_monthly` | `guides_published` | integer | Guides published. | no |
| `kpi_monthly` | `ad_spend` | numeric | Advertising spend (business-sensitive). | business-sensitive |
| `kpi_monthly` | `stay22_month` | integer | Stay22 clicks in the month. | no |
| `kpi_monthly` | `created_at` | timestamptz | When the row was created. | no |
| `kpi_monthly` | `updated_at` | timestamptz | When the row was last modified. | no |
| `kpi_weekly` | `id` | uuid | Row identifier (random UUID). | no |
| `kpi_weekly` | `week_id` | text | Week key. | no |
| `kpi_weekly` | `week_start` | date | First day of the week. | no |
| `kpi_weekly` | `week_label` | text | Week name. | no |
| `kpi_weekly` | `sessions` | integer | Site sessions. | no |
| `kpi_weekly` | `sessions_wc` | integer | World Cup sessions. | no |
| `kpi_weekly` | `planner_uses` | integer | Planner uses. | no |
| `kpi_weekly` | `planner_wc` | integer | World Cup planner uses. | no |
| `kpi_weekly` | `stay22_clicks` | integer | Stay22 clicks. | no |
| `kpi_weekly` | `stay22_wc` | integer | World Cup Stay22 clicks. | no |
| `kpi_weekly` | `social_reach` | integer | Social reach. | no |
| `kpi_weekly` | `reel_saves` | integer | Reel saves. | no |
| `kpi_weekly` | `subs_new` | integer | New subscribers. | no |
| `kpi_weekly` | `accounts_new` | integer | New accounts. | no |
| `kpi_weekly` | `returning_logins` | integer | Returning logins. | no |
| `kpi_weekly` | `created_at` | timestamptz | When the row was created. | no |
| `kpi_weekly` | `updated_at` | timestamptz | When the row was last modified. | no |
| `lead_magnet_attempts` | `id` | bigint | Row identifier (random UUID). | no |
| `lead_magnet_attempts` | `kind` | text | `ip` or `email`. | no |
| `lead_magnet_attempts` | `key_hash` | text | Salted SHA-256 of the IP or the email, used only to rate-limit the checklist form. | pseudonymous (email hash is personal data) |
| `lead_magnet_attempts` | `created_at` | timestamptz | When the row was created. | no |
| `plans` | `id` | uuid | Row identifier (random UUID). | no |
| `plans` | `user_id` | uuid | Owner. | YES |
| `plans` | `created_at` | timestamptz | When the row was created. | no |
| `plans` | `title` | text | Plan title. | free text |
| `plans` | `destination` | text | Destination. | free text |
| `plans` | `start_date` | date | Start date. | no |
| `plans` | `end_date` | date | End date. | no |
| `plans` | `locale` | text | Language. | no |
| `plans` | `inputs` | jsonb | Planner inputs (JSON). | free text possible |
| `plans` | `itinerary` | jsonb | Generated itinerary (JSON). | derived from user input |
| `plans` | `prompt_version` | text | Prompt version. | no |
| `plans` | `model` | text | Model used. | no |
| `products` | `id` | uuid | Row identifier (random UUID). | no |
| `products` | `slug` | text | URL slug. | no |
| `products` | `name` | text | Name. | no |
| `products` | `short_description` | text | Description. | no |
| `products` | `category` | text | Category. | no |
| `products` | `subcategory` | text | Subcategory. | no |
| `products` | `image_url` | text | Image. | no |
| `products` | `affiliate_url` | text | Affiliate link. | no |
| `products` | `merchant` | text | Merchant. | no |
| `products` | `price_label` | text | Price text. | no |
| `products` | `badge_text` | text | Badge. | no |
| `products` | `is_active` | boolean | Published. | no |
| `products` | `is_essential` | boolean | Flag. | no |
| `products` | `is_family` | boolean | Flag. | no |
| `products` | `is_featured` | boolean | Flag. | no |
| `products` | `sort_order` | integer | Order. | no |
| `products` | `created_at` | timestamptz | When the row was created. | no |
| `profiles` | `id` | uuid | Row identifier (random UUID). | no |
| `profiles` | `email` | text | Account email, copied from the login at sign-up. | YES |
| `profiles` | `plan` | text | Legacy plan label. | no |
| `profiles` | `save_limit` | integer | Legacy save limit. | no |
| `profiles` | `saves_used` | integer | Legacy saves used. | no |
| `profiles` | `period_start` | date | Legacy period start. | no |
| `profiles` | `created_at` | timestamptz | When the row was created. | no |
| `profiles` | `updated_at` | timestamptz | When the row was last modified. | no |
| `sf_kit_section_products` | `id` | uuid | Row identifier (random UUID). | no |
| `sf_kit_section_products` | `kit_id` | text | Kit. | no |
| `sf_kit_section_products` | `section_id` | uuid | Section. | no |
| `sf_kit_section_products` | `subsection_id` | uuid | Subsection. | no |
| `sf_kit_section_products` | `product_id` | text | Product. | no |
| `sf_kit_section_products` | `position` | integer | Order. | no |
| `sf_kit_section_products` | `is_hero` | boolean | Hero flag. | no |
| `sf_kit_section_products` | `created_at` | timestamptz | When the row was created. | no |
| `sf_kit_sections` | `id` | uuid | Row identifier (random UUID). | no |
| `sf_kit_sections` | `kit_id` | text | Kit. | no |
| `sf_kit_sections` | `position` | integer | Order. | no |
| `sf_kit_sections` | `label` | text | Heading. | no |
| `sf_kit_sections` | `note` | text | Note. | no |
| `sf_kit_sections` | `created_at` | timestamptz | When the row was created. | no |
| `sf_kit_subsections` | `id` | uuid | Row identifier (random UUID). | no |
| `sf_kit_subsections` | `section_id` | uuid | Section. | no |
| `sf_kit_subsections` | `position` | integer | Order. | no |
| `sf_kit_subsections` | `label` | text | Heading. | no |
| `sf_kit_subsections` | `created_at` | timestamptz | When the row was created. | no |
| `sf_kits` | `id` | text | Row identifier (random UUID). | no |
| `sf_kits` | `num` | text | Kit number. | no |
| `sf_kits` | `title` | text | Title. | no |
| `sf_kits` | `subtitle` | text | Subtitle. | no |
| `sf_kits` | `pain_moment` | text | Copy. | no |
| `sf_kits` | `scene` | text | Copy. | no |
| `sf_kits` | `omit` | text | Copy. | no |
| `sf_kits` | `persona` | public.sf_persona | Audience enum. | no |
| `sf_kits` | `situations` | text[] | Tags. | no |
| `sf_kits` | `content_type` | public.sf_kit_content_type | Type enum. | no |
| `sf_kits` | `sort_order` | integer | Order. | no |
| `sf_kits` | `is_active` | boolean | Published. | no |
| `sf_kits` | `created_at` | timestamptz | When the row was created. | no |
| `sf_kits` | `updated_at` | timestamptz | When the row was last modified. | no |
| `sf_products` | `id` | text | Row identifier (random UUID). | no |
| `sf_products` | `brand` | text | Brand. | no |
| `sf_products` | `name` | text | Name. | no |
| `sf_products` | `tag` | text | Tag. | no |
| `sf_products` | `opinion` | text | Editorial text. | no |
| `sf_products` | `price` | text | Price text. | no |
| `sf_products` | `where_to_buy` | text | Retailer. | no |
| `sf_products` | `link` | text | Affiliate link. | no |
| `sf_products` | `icon` | text | Icon. | no |
| `sf_products` | `image` | text | Image. | no |
| `sf_products` | `emoji` | text | Emoji. | no |
| `sf_products` | `aside` | text | Note. | no |
| `sf_products` | `category` | public.sf_category | Category enum. | no |
| `sf_products` | `surfaces` | text[] | Where it shows. | no |
| `sf_products` | `is_active` | boolean | Published. | no |
| `sf_products` | `created_at` | timestamptz | When the row was created. | no |
| `sf_products` | `updated_at` | timestamptz | When the row was last modified. | no |
| `trips` | `id` | uuid | Row identifier (random UUID). | no |
| `trips` | `user_id` | uuid | Owner (null for a trip created without an account). | YES |
| `trips` | `title` | text | Trip title. | free text possible |
| `trips` | `input` | jsonb | Planner form as submitted (JSON). | free text possible |
| `trips` | `output` | jsonb | Generated trip (JSON). | derived from user input |
| `trips` | `created_at` | timestamptz | When the row was created. | no |
| `trips` | `slug` | text | URL slug. | no |
| `trips` | `origin` | text | Where the traveller starts. | free text |
| `trips` | `destination` | text | Destination. | free text |
| `trips` | `duration_days` | integer | Length in days. | no |
| `trips` | `travelers` | text | Group description. | free text |
| `trips` | `travel_style` | text | Style (e.g. romantic). | no |
| `trips` | `budget_level` | text | Budget level. | no |
| `trips` | `interests` | text[] | Interests chosen. | no |
| `trips` | `trip_data` | jsonb | Full trip document (JSON), the main working copy. | derived + user edits (notes/links) |
| `trips` | `user_email` | text | Email attached to the trip (nullable). | YES |
| `trips` | `status` | text | Trip state. | no |
| `trips` | `share_id` | uuid | Unguessable id used in the public share link. | link secret |
| `trips` | `is_shared` | boolean | Whether the trip is shared. | no |
| `trips` | `traveler_adults` | integer | Number of adults. | no |
| `trips` | `traveler_children` | jsonb | Children in the group (JSON). | children data (likely ages) |
| `trips` | `traveler_group_count` | integer | Group size. | no |
| `trips` | `currency` | text | Display currency. | no |
| `trips` | `intelligence` | jsonb | Computed trip badges (JSON). | derived |
| `trips` | `walking_tolerance` | text | low/medium/high. | no |
| `trips` | `trip_progress` | jsonb | Companion-view progress: notes, links, packing check-off (JSON). | free text (typed by the traveller) |
| `trips` | `ref_source` | text | Partner that referred the guest: host:<slug> or free:<host>. | attribution tag |
| `trips` | `is_public_example` | boolean | Marks a public sample trip. | no |
| `trips` | `budget_currency_suspect` | boolean | Sanity-check flag. | no |
| `user_entitlements` | `user_id` | uuid | Account. | YES |
| `user_entitlements` | `tier` | text | free / paid tier. | no |
| `user_entitlements` | `trips_remaining` | integer | Trip credits left. | no |
| `user_entitlements` | `trips_used` | integer | Trip credits used. | no |
| `user_entitlements` | `stripe_customer_id` | text | Stripe customer id. | identifier |
| `user_entitlements` | `stripe_subscription_id` | text | Stripe subscription id. | identifier |
| `user_entitlements` | `current_period_end` | timestamptz | End of the paid period. | no |
| `user_entitlements` | `created_at` | timestamptz | When the row was created. | no |
| `user_entitlements` | `updated_at` | timestamptz | When the row was last modified. | no |
| `user_entitlements` | `last_session_id` | text | Last Stripe Checkout session id. | identifier |

### 1.2 Who can read and write each table, and how long data is kept

Row Level Security is **enabled on all 23 tables** [verified in migrations]. `anon`, `authenticated` and `service_role` all hold table-level `GRANT ALL` on every table (Supabase default, present in the baseline migration), so **RLS policies are the only barrier** for `anon` and `authenticated`. `service_role` bypasses RLS and is used only on the server (Vercel routes, edge functions); no `'use client'` file imports the admin helper [verified in code, grep]. The only SECURITY DEFINER functions are the two sign-up triggers `handle_new_user` (copies the email into `profiles`) and `handle_new_user_entitlement` (creates 3 free credits); their bodies are in the baseline, but the triggers on `auth.users` are not in the migrations [inferred that they exist live]. **There is no retention job anywhere:** no `pg_cron`, no `DELETE FROM`, no TTL; the only deletions are the `ON DELETE CASCADE` chains from `auth.users` and a user deleting one trip [verified in migrations/code].

| Table | Purpose | Personal data? | `anon` (public key, browser) | `authenticated` (logged-in browser) | `service_role` (our server / edge functions) | Retention / deletion |
|---|---|---|---|---|---|---|
| `trips` | Saved trips: the planner form, the AI result, the working copy, sharing, companion-view notes | **Yes**: owner id, `user_email` (never written by current code), origin/destination, children's ages, free-text budget/interests, notes and links typed by the traveller, `ref_source` | **No access** since the `USING (true)` policy was dropped (prod 2026-07-21; repo 2026-08-04) | SELECT own rows; SELECT **every** row with `is_shared = true`, all columns; INSERT own. No UPDATE/DELETE policy (server does those) | Everything (all `/api/trips/*` routes, server pages, edge worker) | None. Deleted only when the owner deletes that trip, or by cascade if the auth user is deleted (`trips.user_id` → `profiles` → `auth.users`). Rows with `user_id` NULL are never cleaned up |
| `profiles` | One row per account, filled by a trigger at sign-up | **Yes**: `email` | None | SELECT own; **UPDATE own, any column** (`plan`, `save_limit`, `saves_used`, `email`) | Everything | Cascade from `auth.users`. No code reads this table |
| `user_entitlements` | Trip credits and Stripe ids per account | **Yes** (identifiers): `stripe_customer_id`, `stripe_subscription_id`, `last_session_id` | None | SELECT own | Everything | Cascade from `auth.users` |
| `plans` | Older saved-itinerary table | **Yes**: owner, free-text `inputs` | None | SELECT / INSERT / DELETE own (no UPDATE) | Everything | Cascade from `auth.users` |
| `generation_jobs` | Queue/state of a trip generation (logged-in users only) | **Yes**: user id, `inputs` (planner form), results | None | SELECT own | Everything | Cascade from `auth.users`; no TTL for finished jobs |
| `generation_chunks` | AI output pieces of a job | Derived from user input | None | None | Everything | Cascade from its job |
| `generation_metrics` | Cost/latency per AI call | No (model, tokens, status); `error` holds a truncated upstream error | None | None | Everything | None |
| `consent_log` | Record of each cookie choice | **Yes** (pseudonymous): `ip_hash`, raw `user_agent`, `user_id` | None | SELECT own | INSERT (via `/api/consent`) | None. Kept forever; on account deletion `user_id` becomes NULL but `ip_hash` + `user_agent` stay |
| `guide_visits` | One row per partner-guide view | No by design (device bucket, param names, `ref` tag) | **INSERT only**, 5 columns (`REVOKE ALL` first); no SELECT | Same as `anon` | Reads via the `demo:visits` script | None |
| `demo_visits` | Same, for `/demo/*` | No by design | **INSERT only**, 5 columns; no SELECT | Same | Same | None |
| `guide_reports` | "Closed or different?" reports from the free guide | No (place, zone, issue, guide). Code not merged to `main` yet; table is live | **INSERT only**, 4 columns; no SELECT | Same | Dashboard / service role | None |
| `lead_magnet_attempts` | Rate-limit ledger for the checklist form | **Yes** (pseudonymous): salted SHA-256 of the IP or of the **email** | None (RLS on, no policy) | None | Everything | None; rows accumulate (the route only reads the last 24 h) |
| `click_events` | Intended click log | Free-text columns, client-controlled; **no code writes it** | **INSERT** (policy `true`) | INSERT | Everything | None |
| `kpi_monthly` | Business KPIs: revenue, ad spend, subscribers | No personal data; **business-sensitive** | None | **ALL commands** (read + write + delete) for any logged-in user | Everything | None. No code references it |
| `kpi_weekly` | Weekly traffic/planner/affiliate KPIs | No personal data | None | **ALL commands** for any logged-in user | Everything | None. No code references it |
| `kits`, `products`, `kit_products` | Older shop catalogue | No | SELECT all rows (`USING true`) | SELECT all rows | Everything | n/a (catalogue) |
| `sf_kits`, `sf_products` | Smart Finds catalogue | No | SELECT active rows | SELECT active rows | Everything | n/a (catalogue) |
| `sf_kit_sections`, `sf_kit_subsections`, `sf_kit_section_products` | Smart Finds structure | No | SELECT all rows | SELECT all rows | Everything | n/a (catalogue) |

### 1.3 Confirm the live policies (read-only SQL for the Supabase SQL editor)

These read only the catalog (policies, grants, triggers), never table rows.

```sql
-- 1) Every RLS policy in public
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' order by tablename, policyname;

-- 2) Is RLS enabled / forced on each table?
select c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' order by 1;

-- 3) Table-level and column-level privileges of anon / authenticated
select grantee, table_name, string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated') group by 1, 2 order by 2, 1;
select grantee, table_name, column_name, privilege_type
from information_schema.column_privileges
where table_schema = 'public' and grantee in ('anon', 'authenticated') order by 2, 3;

-- 4) Triggers attached to auth.users (sign-up) and to public tables
select tgname, tgrelid::regclass, tgenabled from pg_trigger where not tgisinternal order by 2, 1;

-- 5) Does the table the contact form writes to exist? (NULL = it does not)
select to_regclass('public.contact_messages');
```

Expected from the migrations: no `Public can read trips by slug` policy; `authenticated_read_shared_trips` and `trips_select_own` on `trips`; `auth only` on both `kpi_*` tables; column-limited INSERT grants on `guide_visits`, `demo_visits` and `guide_reports`; and `NULL` for `contact_messages` (confirmed by the live schema).

## 2. The guest's journey from a partner guide

Legend: **Account?** = needs a logged-in user. **Written by**: *browser (anon key)* = the visitor's browser talks to Supabase with the public key; *browser (JWT)* = same, logged in; *server* = a Vercel route using the service-role key; *edge* = Supabase edge function.

| Step | Data | Where it lands | Written by | Account? | Personal data? | Evidence | Status |
|---|---|---|---|---|---|---|---|
| **a. Browsing the guide** | Page view: guide slug, language, **names** of URL params present, device:browser bucket, optional `?ref=` tag (Production only) | `guide_visits` / `demo_visits` | browser (anon key), INSERT only | No | No by design | `GuiaClient.tsx:428-440`, `lib/guia/visit.ts`, migration `20261008000000` | [verified in schema/code] |
| a | Attribution tag `host:<slug>` / `demo:<slug>` (`free:<host>` on the free guide) | Cookie `lagom_ref` (180 days, `SameSite=Lax`, not HttpOnly) + localStorage `lagom_ref` (no expiry) | browser JS, **no consent check** | No | Pseudonymous campaign tag | `GuiaClient.tsx:416-422` | [verified in code] |
| a | URL param **values** `llegada`, `noches`, `adultos`, `ninos` | Kept in page memory only (used to draw the heading); **never saved by us** | browser | No | Dates and party size | `GuiaClient.tsx:400-412`, `lib/guia/stay.ts` | [verified in code] |
| a | The same values, because they are part of the page URL | **Google Analytics 4** `page_path` / `page_location` once analytics consent is granted | browser (gtag) | No | Dates, party size | `GoogleAnalyticsTracker.tsx:33-37`, `ConsentSync.tsx:68-77` | [verified in code]; that GA keeps the full query string is [inferred] |
| a | Guide events: `host_guide_view`, `*_planner_click`, `*_map_click`, `*_tour_click`, `*_discover_click`, `*_agenda_*` (`demo_guide_*` on `/demo`): slugs and ids only | Google Analytics 4 | browser (gtag) | No | No | `GuiaClient.tsx`, `AgendaSection.tsx` | [verified in code] |
| a | Weather: the request to `api.open-meteo.com` for fixed Mexico City coordinates. Open-Meteo sees the visitor's IP and browser | Open-Meteo (third party) | browser | No | IP (as with any request) | `lib/guia/weather.ts:42-59` | [verified in code] |
| a | Newsletter box in the guide: the email typed | **Mailchimp**, subscribed directly (no double opt-in, no checkbox, fine print only) | server (`/api/subscribe`) | No | **Email** | `NewsletterSignup.tsx`, `app/api/subscribe/route.ts` | [verified in code] |
| a | **No cookie banner on `/guia/*` and `/demo/*`**: the banner only exists on the localized site | n/a | n/a | n/a | n/a | `CookieBanner` mounted only in `app/[locale]/layout.tsx:245` | [verified in code] |
| **b. Planner without an account** | All form fields go into the **URL** of `/planner`: origin, destination, dates, traveller type, adults, **children as `type:age`**, group size, **interests (free text)**, pace, **budget (free text)**, currency, walking tolerance | Browser history; GA `page_path`/`page_location` after consent; sessionStorage `redirectAfterLogin` / `plannerReturnUrl` | browser | No | **Yes**: free text, children's ages | `components/forms/HeroForm.tsx:296-346`, `GoogleAnalyticsTracker.tsx` | [verified in code] |
| b | Destination as search term | GA (`search_term`) and Meta (`search_string`) | browser | No | Destination | `lib/analytics/events.ts:74-76`, `HeroForm.tsx:343` | [verified in code] |
| b | Same fields in the request body → **Anthropic** (the one free anonymous trip) | Nothing saved for the guest; Anthropic receives the prompt | server route → edge function → Anthropic | No (1 free trip) | **Yes** | `app/api/generate-trip/route.ts:178-186`, `supabase/functions/generate-trip/index.ts` | [verified in code]; Anthropic retention [por confirmar] |
| b | Cost metrics per AI call (model, tokens, ms, status; no user text) | `generation_metrics` | edge, service role | No | No | `generate-trip/index.ts:20-30` | [verified in code] |
| b | Counter for the free anonymous trip | Cookie `anon_gen_count` (30 days, HttpOnly, `SameSite=Lax`) | server | No | Pseudonymous counter | `app/api/generate-trip/route.ts:22,339-351` | [verified in code] |
| b | The generated trip while the tab is open | sessionStorage `tripCache` (full itinerary + inputs); `pendingSave` | browser | No | **Yes** (on the device only) | `TripResult.tsx:130,1797,2703` | [verified in code] |
| b | Server logs of the request: user id or "anon", key names of the body, **first 1,000 characters of the AI response**, destination on some paths | Vercel function logs | server | No | Destination, itinerary text | `generate-trip/route.ts:89-95,198,296-314` | [verified in code]; retention [por confirmar] |
| b | Saving needs an account: `POST /api/trips` returns 401 without a session; the async queue (`generation_jobs`) also needs login. A claim route for anonymous trips exists but **nothing calls it** | n/a | n/a | **Yes** | n/a | `app/api/trips/route.ts:49-56`, `jobs/route.ts:75-79`, `claim/route.ts` | [verified in code] |
| b | After "Ya reservé" on an anonymous trip: booking code, check-in time, notes (≤280 chars), link | localStorage `lagomplan_booking_<trip>_<hotel>` (no expiry) | browser | No | Booking code and notes, on the device | `PlannerHotelsSection.tsx:765-770` | [verified in code] |
| **c. Sign up / log in** | Name (`full_name`), email, password | Supabase Auth (`auth.users`, outside `public`) | browser (anon key) | n/a | **Yes** | `components/auth/SignupForm.tsx:28-32`, `LoginForm.tsx:87` | [verified in code]; only email + password exists in code |
| c | Email copied to `profiles`; `user_entitlements` created (free tier, 3 credits). `full_name` is **not** copied | `profiles`, `user_entitlements` | database trigger functions (SECURITY DEFINER) | n/a | **Email** | baseline migration `handle_new_user*` | function bodies [verified in schema]; that the triggers are attached to `auth.users` is [inferred] (no `CREATE TRIGGER` in migrations) |
| c | Session | Cookie `sb-<project>-auth-token` (Supabase library default, ~400 days, not HttpOnly) | browser (`@supabase/ssr`) | Yes | Session tokens | `lib/supabase/client.ts`, `server.ts` | name/lifetime [inferred] |
| c | Cookie choice (also automatic when the browser sends GPC): choice, `user_id` if logged in, **salted hash of the IP**, **raw user agent**, locale, GPC flag, policy version | `consent_log` | server (`/api/consent`), service role | No | Yes (pseudonymous + device data) | `app/api/consent/route.ts`, `lib/consent.ts` | [verified in code] |
| c | The account's user id to GA (`user_id`) and to Meta (`external_id`), plus `trip_count`, `days_since_signup`, `last_trip_at` | Google Analytics, Meta Pixel (only if loaded) | browser | Yes | Pseudonymous id | `components/analytics/AuthEventsBridge.tsx:44-132` | [verified in code] |
| c | Console logs in the **browser** of the full login response (session tokens) and the user object (email) | The visitor's own devtools only | browser | Yes | Tokens, email | `LoginForm.tsx:88`, `SupabaseProvider.tsx:19` | [verified in code] |
| **d. Saving or sharing a trip** | Trip row: title, origin, destination, days, travellers, style, budget level (free text), interests (free text), the full trip document, `traveler_adults`, **`traveler_children` (`[{type, age}]`)**, currency, `ref_source` (from the `lagom_ref` cookie; only `host:` and, once merged, `free:` values pass) | `trips` | server, using the logged-in user's session (RLS applies); long trips are inserted by the edge worker (service role) | **Yes** | **Yes** | `app/api/trips/route.ts:140-186`, `generate-trip-worker/index.ts:1964-1991`, `lib/attribution/ref-source.ts` | [verified in code] |
| d | `trips.user_email` | `trips` | **no code writes it** | n/a | Email, if any old row has it | grep: no writer in `app/`, `lib/`, `components/`, `supabase/functions/` | [verified in code]; whether any row is populated is [por confirmar] |
| d | Notes and links typed in the companion view, packing check-off, booking confirmation code and notes of the owner | `trips.trip_progress`, `trips.trip_data` | server, service role, after an owner check | Yes (owner) | Free text | `companion/route.ts`, `booking-confirm/route.ts` | [verified in code] |
| d | Sharing: `share_id` (random UUID) + `is_shared = true`. The link is a bearer token | `trips.share_id`, `trips.is_shared` | server, service role, after an owner check | Yes | The link | `app/api/trips/[trip_id]/share/route.ts` | [verified in code] |
| d | Who can read a shared trip: the share page shows only title, destination and days to a guest; **but `GET /api/trips/[trip_id]` returns the whole row (including `user_email`, children, notes) to anyone who knows the trip id when the trip is shared**, and `/api/trips/share/[shareId]` hands out that id | n/a (read) | server, service role | No | **Yes** | `app/api/trips/[trip_id]/route.ts:14-58,67`, `share/[shareId]/route.ts:45-50` | [verified in code] |
| d | Server logs: the insert payload without the trip document (user id, title, origin, destination, interests, `traveler_children`, `ref_source`); trip id + title on reads | Vercel function logs | server | Yes | **Yes** | `app/api/trips/route.ts:178-181`, `[trip_id]/route.ts:81` | [verified in code] |
| d | Events `trip_saved`, `trip_shared`, `itinerary_generated {destination, nights, locale, traveler, trip_id}` | GA, Meta | browser | n/a | Destination, trip id | `lib/analytics/events.ts:126-211` | [verified in code] |
| **e. Clicking a booking / experience button** | GA event `partner_link_click {link_name, partner_slug, zone, lang, section, destination = host name only, experience_name}`. **No row in our database** | Google Analytics | browser | No | No | `lib/analytics/ga.ts:78-109` | [verified in code] |
| e | What the destination receives in the URL: Insider/WhatsApp links get `utm_source=lagomplan`, `utm_medium=guide`, `utm_campaign=<pilot>`, `utm_content=<partner slug>`; Airalo, Peek, Localbird and the chef/massage links get no UTM. Stay22 links in the planner carry `aid=lagomplan`, campaign, the **destination text** and the dates/adults | Insider / WhatsApp, Airalo, Peek, Localbird, Stay22 | browser (the visitor's click) | No | Destination and dates for Stay22 | `lib/guia/links.ts`, `lib/affiliate/build.ts`, `lib/booking.ts` | [verified in code] |
| e | Planner hotel/tour/restaurant clicks: `planner_hotel_clicked`, `affiliate_clicked {provider, surface, category, destination, trip_id, partner_id…}` | GA, Meta | browser | No | Destination, trip id | `lib/analytics/events.ts:381-526` | [verified in code] |
| e | The browser's default referrer policy applies to outbound links; no custom `Referrer-Policy` found | Destination site | browser | No | The page URL's origin | `next.config.mjs`, `vercel.json` | [inferred] |

## 3. Third parties that receive data

Every server that receives a browser request also sees the visitor's IP address and browser (user-agent); this is not repeated in each row. **Consent** column: *Before* = fires with no banner answer; *After* = only after "accept all"; *n/a* = needed to deliver what the user asked for, or click-only.

| Third party | Purpose | Data it receives | Consent | Evidence | Status |
|---|---|---|---|---|---|
| **Google Analytics 4** (browser) | Web analytics | **Script loads and `config` runs on every page**, with Consent Mode defaults `denied` (ad_storage, ad_user_data, ad_personalization, analytics_storage; `wait_for_update` 500 ms). Becomes `analytics_storage: granted` only if `lagomplan-consent = all`. Events: ~40 names (planner, trips, affiliate clicks, mobile view, `host_guide_*`/`demo_guide_*`, `partner_link_click`, `partner_visit`) with ids, destination, nights, locale, traveller type, trip id, partner slug. `page_view` carries `page_path` **with the full query string** and `page_location` (the planner URL contains origin, destination, free-text interests, children's ages). Logged-in users: `user_id` = Supabase UUID, plus `trip_count`, `days_since_signup`, `last_trip_at`. First-touch UTM/click ids/referrer as user properties. `search_term` = typed destination. `error_occurred.message` = first 100 chars of an error. No email is sent | **Before** (script, config, cookieless pings); cookies/identifiers **After** | `app/[locale]/layout.tsx:173-200`, `app/guia/layout.tsx:52-78`, `components/analytics/GoogleAnalyticsTracker.tsx:33-37`, `ConsentSync.tsx:62-77`, `AuthEventsBridge.tsx:72-109`, `lib/analytics/events.ts`, `lib/analytics/ga.ts` | Code [verified in code]; what Google transmits while `denied` and how long it keeps the URL [inferred] |
| **Google Analytics 4** (server, Measurement Protocol) | Backup `purchase` conversion | From our Vercel server: `client_id` (taken from the `_ga` cookie), **`user_id` (Supabase UUID)**, one `purchase` event (Stripe session id, amount, currency, plan). No email | Only if the `_ga` cookie existed at checkout; consent is **not re-checked** at webhook time and withdrawing consent does not delete `_ga` | `lib/analytics/ga-server.ts:57-107`, `app/api/stripe-webhook/route.ts:155-170`, `app/api/checkout/route.ts:95` | [verified in code] |
| **Meta Pixel** | Marketing / conversions | `PageView` with the page URL (planner query included), `_fbp` cookie; standard and custom events (Lead, ViewContent, Search with the typed destination, InitiateCheckout, CompleteRegistration, Purchase, ItineraryGenerated, TripSaved…). Logged-in users: `external_id` = **raw Supabase UUID**. No email/phone passed in code; Meta's Automatic Advanced Matching depends on dashboard settings. No server-side Conversions API | **After** (injected only when consent = all) | `components/analytics/ConsentSync.tsx:83-108`, `AuthEventsBridge.tsx:116-122`, `lib/analytics/meta.ts` | Gating [verified in code]; Automatic Advanced Matching [por confirmar] |
| **Anthropic API** (Claude) | Generates the itinerary | Sent from Supabase **edge functions** (not from Next): destination, origin, dates and nights, number of travellers, **children's ages**, travel style, budget level and currency, **interests including the free-text box**, multi-city segments, locale. System prompts are static. **Not sent:** email, name, user id, trip id, IP; there is no `metadata` field in any request. Outputs are stored in `generation_chunks`, `generation_jobs` and `trips` | n/a (user action; not gated) | `supabase/functions/generate-trip/prompt.ts:754,886-890,988`, `generate-trip/index.ts:198,330`, `generate-trip-worker/index.ts:669,910`, `app/api/generate-trip/route.ts:99-105` | [verified in code]; Anthropic's retention terms [por confirmar] |
| **Mailchimp** (a) connected-site script | Mailchimp's site tracking / popups | The script (`chimpstatic.com`) is added in `<head>` of **every localized page** | **Before** (no gating) | `app/[locale]/layout.tsx:131-137` | Loading [verified in code]; what it collects [por confirmar] |
| Mailchimp (b) newsletter | Newsletter list | **Email** only, from our server (`status: subscribed`, tag from `MAILCHIMP_TAG`). Single opt-in; no checkbox; no consent record or timestamp kept by us | n/a (user typed it) | `app/api/subscribe/route.ts:35-98`, `NewsletterSignup.tsx:72` | [verified in code] |
| Mailchimp (c) checklist / lead magnets | Deliver a PDF and subscribe | **Name** (`FNAME`) and **email**, tags (magnet, persona, `src_<utm_source>`, `cmp_<utm_campaign>`), single opt-in. We also store a salted hash of the IP and of the email in `lead_magnet_attempts` | n/a | `app/api/lead-magnet/route.ts:54-97`, `lib/lead-magnet/rate-limit.ts` | [verified in code] |
| **Resend** (email sending) | Contact notifications; lead-magnet delivery | Contact form: name, email, subject, message → sent to a Gmail address (`lagomplan@gmail.com`) from `onboarding@resend.dev`; the text is put into the email HTML **without escaping**. Lead magnet: sent to the user with their name | n/a | `app/api/contact/route.ts:17,94-120`, `lead-magnet/route.ts:78-97` | [verified in code] |
| **Stripe** | Payments | At checkout: the user's **email** (`customer_email`), user id (`client_reference_id` and metadata), plan, and the GA client id in metadata. Card data is entered on Stripe's page. We store back `stripe_customer_id`, `stripe_subscription_id`, `last_session_id`, tier and credits | n/a | `app/api/checkout/route.ts:74-105`, `app/api/stripe-webhook/route.ts:92-136` | [verified in code] |
| **Supabase** (database, Auth, edge functions) | Everything stored; sign-up/log-in | Auth: email, password (hashed by Supabase), `full_name`, session. Browser also writes `guide_visits` / `demo_visits` / `guide_reports` directly with the public key. The database is hosted in AWS **us-east-2** (from the tracked pooler host) | n/a | `components/auth/SignupForm.tsx:28-32`, `supabase/.temp/pooler-url`, `lib/supabase/*` | [verified in code]; region [inferred]; confirmation emails and sender are dashboard settings [por confirmar] |
| **Vercel** (hosting, functions) | Serves the site; runs the API routes | Every request (IP, path and query string, user-agent) lands in Vercel's request/runtime logs. No Vercel Analytics, Speed Insights or OpenTelemetry package is installed. `console.*` output (see risk R8) is stored in function logs | n/a | `package.json`, `vercel.json` (`{}`) | Code [verified]; log retention [por confirmar] |
| **Stay22** (LetMeAllez script + Allez links) | Hotel/activity affiliate links | The **LetMeAllez script loads on every localized page with no consent gate** and can see the page and its outbound travel links. Allez links built by us carry `aid=lagomplan`, campaign, the **destination text**, check-in/out dates and number of adults, onward to Booking/Expedia/GetYourGuide on click | **Before** (script); links on click | `app/[locale]/layout.tsx:209-221`, `components/affiliate/Stay22Guard.tsx`, `lib/affiliate/build.ts:55-81` | Loading [verified in code]; what Stay22 collects [por confirmar] |
| **Open-Meteo** | Live weather card in guides | A GET with **fixed** Mexico City coordinates; no user location, no cookies | **Before** (no banner on `/guia`, `/demo`) | `lib/guia/weather.ts:41-59` | [verified in code] |
| **Google Maps / Places** | Destination autocomplete in the planner forms | The script loads when the form mounts (home page and planner). **Every keystroke after 2 characters** (debounced 200 ms) is sent to Google with a session token; Google also sets its own cookies. The API key is public by design (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) | **Before** | `lib/googleMaps.ts:34`, `components/forms/PlacesInput.tsx:59,85-100` | Loading [verified in code]; key restrictions in Google Cloud [por confirmar] |
| **Google Fonts** | Fonts | Normal pages: `next/font` downloads and self-hosts at build time (no request from the visitor). **Exception:** `/worldcup` has a runtime `@import url('https://fonts.googleapis.com/…')` | **Before** (worldcup only) | `components/worldcup/WorldcupClient.tsx:489` | Self-hosting [inferred, Next.js documented behaviour]; exception [verified in code] |
| **Unsplash** | Three background images on the planner page | The browser requests `images.unsplash.com` | **Before** | `app/[locale]/planner/TripGeneratorClient.tsx:138-180` | [verified in code] |
| **Gmail** (the owner's inbox) | Receives contact-form notifications | Name, email, subject, message | n/a | `app/api/contact/route.ts:17` | [verified in code] |
| **GitHub Actions** | Calls `/api/trips/jobs/reconcile` every 5 minutes to restart stuck jobs | No personal data (a bearer `CRON_SECRET`) | n/a | `.github/workflows/reconcile-stuck-jobs.yml` | [verified in code] |
| **Link-out partners** (Insider/WhatsApp, Airalo, Peek, Localbird, Take a Chef, Acuity, OpenTable, Resy, TheFork, Uber, Google Maps links, Amazon/MercadoLibre short links) | Booking and affiliate destinations | Nothing is sent until the visitor clicks. On click they receive the URL we built (UTMs for Insider links, venue/city text for restaurant links) and the visitor's IP/UA/referrer | n/a (click) | `lib/guia/links.ts`, `lib/booking.ts`, guide content | [verified in code]; referrer behaviour [inferred] |

**Consent machinery.** The choice is stored in the browser (`localStorage` key `lagomplan-consent`: `all` | `essential`) and each choice is also posted to `/api/consent` (see `consent_log`). If the browser sends Global Privacy Control the banner auto-selects `essential`. Only two things are gated on "accept all": GA's `analytics_storage` update and the Meta Pixel. Withdrawing consent only re-opens the banner; it does not delete `_ga`/`_fbp` or unload anything. The banner exists **only** in the localized layout (`app/[locale]/layout.tsx:245`); `/guia`, `/demo`, `/puente-noviembre` and `/checklist-viajar-con-bebe` have no banner [verified in code].

**What fires before any banner answer** (summary): Google gtag script + `config` (cookieless pings while `denied`), Mailchimp `mcjs`, Stay22 LetMeAllez, Google Maps/Places, Open-Meteo, Unsplash images, the `/worldcup` Google Fonts import, plus our own `lagom_ref` cookie/localStorage and the `guide_visits` insert on guides. Vercel and Supabase see every request they serve.

## 4. Risks

Severity is my own judgement (High = personal data of other people could be read or changed by someone who should not; Medium = personal data goes somewhere unexpected, or a promise made in the privacy policy is not kept; Low = hygiene).

| # | Severity | Risk | Evidence | Status |
|---|---|---|---|---|
| R1 | **High** | **Any logged-in user can read every shared trip, all columns** (including `user_email`, `traveler_children`, notes) straight from the database with the public key: the policy `authenticated_read_shared_trips` is `USING (is_shared = true)` and has no column limit. Anyone can create a free account | baseline migration `:892`, re-asserted in `20260804000000_fix_trips_public_read_policy.sql`; table grants `ALL` to `authenticated` | Policy [verified in schema]; live state [por confirmar] (see 1.3); consequence [inferred] |
| R2 | **High** | **`GET /api/trips/[trip_id]` returns the whole `trips` row to anyone who knows the trip id when the trip is shared or a public example** (no login): `user_email`, `traveler_children`, `user_id`, trip notes, booking codes. The public share endpoint hands out that trip id | `app/api/trips/[trip_id]/route.ts:14-58,67` (`select('*')`, service role), `app/api/trips/share/[shareId]/route.ts:45-50` | [verified in code]. Whether any row has `user_email` filled is [por confirmar] (no code writes it) |
| R3 | **High** | **KPI tables are readable and writable by any logged-in user**: `kpi_monthly` (revenue, ad spend, subscribers) and `kpi_weekly` have a policy `"auth only"` with no command limit and no `WITH CHECK`. No code in the repo uses them | baseline `:884-888` | [verified in schema]; live state [por confirmar] |
| R4 | **High** | **The planner puts personal data in the URL** (origin, destination, free-text interests and budget, children as `type:age`, group size). That URL goes to Google Analytics (`page_path` and `page_location`) after analytics consent, to Meta (`PageView`) after "accept all", into browser history and into `sessionStorage` | `components/forms/HeroForm.tsx:296-346`, `GoogleAnalyticsTracker.tsx:33-37`, `ConsentSync.tsx:68-98` | [verified in code]; what GA/Meta keep is [por confirmar] |
| R5 | **High** | **The contact form is probably broken and logs personal data.** `/api/contact` inserts into `contact_messages`, which does **not exist** in the live schema; on failure it returns 500 **before** sending the notification email, so a message would be lost. It also logs name, email and subject on every call, and puts the message into the email HTML without escaping | `app/api/contact/route.ts:32,54-70,97-111`; live schema (23 tables, none called `contact_messages`) | [verified in code] + [verified in live schema]; whether the page is linked is [por confirmar] |
| R6 | Medium | **No cookie banner on `/guia/*` and `/demo/*`**, yet these pages already: load the GA script (Consent Mode starts "denied", but the script and its cookieless pings still reach Google), set the `lagom_ref` cookie (180 days) and localStorage, write `guide_visits`, call Open-Meteo. A guest can only give or refuse consent on the localized site | `app/guia/layout.tsx:52-78`, `GuiaClient.tsx:416-440`, `lib/guia/weather.ts`; `CookieBanner` only in `app/[locale]/layout.tsx:245` | [verified in code]; cookieless pings carrying the URL is [inferred] from Google's Consent Mode behaviour |
| R7 | Medium | **Stay22's LetMeAllez script loads on every localized page with no consent gate**, while the privacy policy says optional cookies load only after "Aceptar todas" (it lists the Stay22 cookie as "Funcional") | `app/[locale]/layout.tsx:209-221`; policy `:355-372` | [verified in code]; what the script collects [por confirmar] |
| R8 | Medium | **Personal data in logs** (Vercel function logs and Supabase edge-function logs): contact name/email/subject; the trip insert payload (user id, `traveler_children`, destination, interests); the first 1,000 characters of the AI response (itinerary); 500 characters of the insert payload when the worker fails; Mailchimp error bodies (may contain the email); user ids and Stripe ids. In the **browser console**: the full login response (session tokens) and the user object | `app/api/contact/route.ts:32`, `app/api/trips/route.ts:178-181`, `app/api/generate-trip/route.ts:198`, `supabase/functions/generate-trip-worker/index.ts:2000`, `app/api/subscribe/route.ts:91`, `app/api/lead-magnet/route.ts:137`, `components/auth/LoginForm.tsx:88`, `components/auth/SupabaseProvider.tsx:19` | Log calls [verified in code]; log retention [por confirmar] (plan-dependent, outside the repo) |
| R9 | Medium | **Nothing is ever deleted and there is no way to ask.** No retention job, no TTL, no `DELETE FROM` in any migration; no account-deletion or data-export route; the "Mi cuenta" page says "Coming soon". The privacy policy promises: cancelled accounts kept up to 5 years, browsing data/cookies 13 months, minors' data deleted in 30 days, requests answered in 20 working days via "Mi cuenta > Privacidad" | `app/[locale]/account/page.tsx:38`, `vercel.json` (`{}`), migrations; policy `:228-240,260-270` | [verified in code/schema] |
| R10 | Medium | **`consent_log` keeps the raw user-agent (500 chars) and a hash of the IP forever**, next to the user id when logged in. The hash is SHA-256 with a salt: if the salt leaks, the IPv4 space can be brute-forced. The salt exists in Production; without it the code falls back to a constant in the repo | `app/api/consent/route.ts:42-72`; `CONSENT_IP_SALT` present in Production (name only checked) | [verified in code]; salt value not inspected |
| R11 | Medium | **The privacy policy does not match what the product does.** It lists vendors we do not use (AWS/GCP, Mixpanel, SendGrid/Mailgun, Conekta, MercadoPago), and does not mention Anthropic, Mailchimp, Resend, Vercel, Supabase, Open-Meteo, Google Maps, the consent log, the visit log or the partner-attribution cookie. It claims 2FA, phone, date of birth, parental consent for 13-17, "model training on anonymised data" and "paid plans soon". It is Spanish-only (the English page is a stub) | `app/[locale]/privacy/page.tsx` (retention `:228-240`, rights `:260-270`, cookies `:355-372`, automated decisions/training `:398-406`; the rest is quoted by section below) and `terms/page.tsx` | [verified in code] |
| R12 | Medium | **Children's ages go to the database and to Anthropic** (`traveler_children`, and the form values in the prompt). No age gate or parental flow exists although the policy and terms describe one | `app/api/trips/route.ts:91-99`, edge functions, `terms/page.tsx:103-105` | [verified in code] |
| R13 | Medium | **Unauthenticated writes on trips with no owner.** Any trip with `user_id = NULL` can be overwritten (notes, budget, booking code) by anyone with its id (`companion`, `booking-confirm`), and any logged-in user can claim it (`claim`). Current code cannot create such trips (`POST /api/trips` requires login), so this only concerns old rows | `companion/route.ts:124-133`, `booking-confirm/route.ts:98-108`, `claim/route.ts:50-62`, `app/[locale]/trips/[trip_id]/page.tsx:90-91` | Code [verified]; existence of old rows [por confirmar] |
| R14 | Medium | **Open endpoints with no rate limit that write, email or call a paid API:** `/api/contact` (DB + email), `/api/subscribe` (Mailchimp), `/api/consent` (DB), `/api/generate-trip` (Anthropic; the "one free trip" limit is a cookie that can be cleared), the browser-side INSERTs into `guide_visits`/`demo_visits`. Only `/api/lead-magnet` has a limiter, and it fails open and trusts the first `x-forwarded-for` value | `lib/lead-magnet/rate-limit.ts`, `lib/plan/limits.ts:21` | [verified in code] |
| R15 | Medium | **The Anthropic edge functions answer any caller who holds the public anon key** (CORS `*`, no caller check inside the function). Whether Supabase's JWT check is on for them is not in the repo | `generate-trip/index.ts:101-102`, `generate-trip-worker/index.ts:396-398`, `supabase/config.toml` | Code [verified]; `verify_jwt` setting [por confirmar] |
| R16 | Medium | **Free-text fields that can hold personal data and are stored:** `trips.input/title/budget_level/interests`, `trip_progress` notes and links, `trip_data` booking codes and notes, `generation_jobs.inputs`, `plans.inputs`, contact message, `click_events.*`. Plus localStorage on the device (booking codes, notes) with no expiry | schema + `PlannerHotelsSection.tsx:765-770`, `MobileTripClient.tsx:521-540` | [verified in schema/code] |
| R17 | Medium | **Newsletter and checklist forms subscribe straight to Mailchimp** (`status: subscribed`, no checkbox, fine print only). The guide's newsletter box sends only the email | `app/api/subscribe/route.ts`, `NewsletterSignup.tsx:72` | [verified in code] |
| R18 | Low | **`profiles` can be edited by its owner in every column** (`plan`, `save_limit`, `saves_used`, `email`). Nothing reads the table today, so it is harmless until something does | baseline `:941` | [verified in schema] |
| R19 | Low | **`click_events` accepts anonymous INSERTs of free text and no code uses it** (a free spam target). `kit_products`, `kits`, `products`, `kpi_*`, `profiles` are also unreferenced by the app | baseline `:848`; code search | [verified in schema/code] |
| R20 | Low | **Table-level `GRANT ALL` to `anon` and `authenticated` on all 23 tables** (Supabase default). Safety rests only on RLS, so one wrong policy exposes a table (R1 and R3 are exactly that) | baseline grants | [verified in schema] |
| R21 | Low | **The database triggers that create `profiles` and `user_entitlements` are not in the migrations** (they live in the `auth` schema), so a rebuild from the repo would not reproduce sign-up. Supabase Auth settings (Site URL, redirects, email confirmation) are not in the repo either | migrations; `supabase/config.toml` is local-dev only | [inferred] |
| R22 | Low | **The partner cookie `lagom_ref` is not HttpOnly, lasts 180 days and is written without consent**; `lagomplan-first-touch` (UTM, click ids, referrer URL) and `lagomplan-partner-touch` stay in localStorage with no expiry | `GuiaClient.tsx:416-422`, `lib/analytics/attribution.ts:137`, `partner-attribution.ts:162` | [verified in code] |
| R23 | Low | **A logged-in user's id goes to Google (`user_id`) and Meta (`external_id`)** as a raw Supabase UUID, together with trip counts and dates | `components/analytics/AuthEventsBridge.tsx:44-132` | [verified in code]; only after consent for Meta (loaded only on "accept all") |
| R24 | Low | **An unrelated personal WhatsApp number is in public code and links** (the chef contact is "Elena's personal number, TEMPORARY"), with a prefilled message that names Livin Roma | `lib/guia/links.ts:10-16`, `content/guia/partners/livin_roma.ts:82` | [verified in code] |
| R25 | Low | **Files that should not be in git:** two vim swap files (`app/[locale]/planner/.TripResult.tsx.swp`, `.!80883!.TripResult.tsx.swp`), two `.bak` files, and `supabase/.temp/*` (project ref, pooler URL). A debug route `/api/test-supabase` is live (it only returns booleans) | `git ls-files` | [verified in git] |
| R26 | Low | **The baseline migration still contains the world-readable `trips` policy** that production already dropped; the later migration removes it, but anyone who stops half-way through a rebuild reintroduces the leak | baseline `:844`, `20260804000000` | [verified in schema] |
| R27 | Medium | **Mailchimp's connected-site script loads on every localized page with no consent gate**, and is not in the policy's cookie table | `app/[locale]/layout.tsx:131-137` | Loading [verified in code]; what it collects [por confirmar] |
| R28 | Medium | **Google Maps/Places loads on the home page and planner before any consent and sends every keystroke of the origin/destination fields to Google** (after 2 characters). The browser key is public by design; its referrer/API restrictions are not visible in code | `lib/googleMaps.ts:34`, `components/forms/PlacesInput.tsx:59,85-100` | [verified in code]; key restrictions [por confirmar] |
| R29 | Medium | **The server-side GA purchase event sends the user id and the `_ga` client id without re-checking consent**, and withdrawing consent does not delete `_ga`, so the webhook keeps sending | `lib/analytics/ga-server.ts:83-88`, `lib/consent.ts:79-85` | [verified in code] |
| R30 | Low | **Meta's Automatic Advanced Matching and automatic event detection** are not switched off in code (`autoConfig` is not set to false), so email typed in login/newsletter forms could be hashed and sent by the pixel depending on the Events Manager setting | `ConsentSync.tsx:83-98` | Code [verified]; dashboard setting [por confirmar] |
| R31 | Low | **Runtime requests to Google Fonts (`/worldcup`) and Unsplash (planner page)** expose the visitor's IP with no notice or consent | `components/worldcup/WorldcupClient.tsx:489`, `TripGeneratorClient.tsx:138-180` | [verified in code] |

### Log calls that can carry personal data (evidence for R8)

Vercel function logs: `app/api/contact/route.ts:32` (name, email, subject); `app/api/trips/route.ts:52,178-181,199` (user id; insert payload without `trip_data`: user id, title, origin, destination, interests, `traveler_children`, `ref_source`); `app/api/trips/[trip_id]/route.ts:20,81` (trip id and title); `app/api/generate-trip/route.ts:89-95,140-144,198,236-245` (user id or "anon", key names of the body, **first 1,000 characters of the AI response**, the project function URL); `app/api/checkout/route.ts:107`, `checkout/fulfill/route.ts`, `stripe-webhook/route.ts` (user ids, Stripe session/subscription ids; no email, no payload); `app/api/subscribe/route.ts:91` and `app/api/lead-magnet/route.ts:137-138` (Mailchimp error bodies, which can echo the subscriber's email). Supabase edge-function logs: `generate-trip-worker/index.ts:217-222` (key fragments: first 10 characters of the anon key and its length, on every cold start), `:1351` (user id, job id), `:2000` (**first 500 characters of the trip insert payload when it fails**), `:823,1575,1947` and `generate-trip/index.ts:367,436` (Anthropic error bodies and 500 characters of raw model output). Browser console only: `LoginForm.tsx:88` (full sign-in response with tokens), `SupabaseProvider.tsx:19` (user object with email), `TripResult.tsx:1738,1774,2669` (request and response payloads). No code logs `x-forwarded-for`, IP, user-agent, cookies or `Authorization` headers [verified by grep of every `console.*` call]. Retention of Vercel and Supabase logs: [por confirmar] (plan-dependent, outside the repository).

### What the privacy policy says versus what the code does

Policy: `app/[locale]/privacy/page.tsx` (Spanish only; the English page is a "working on it" stub), version 1.0, dated 5 March 2026.

- **Matches:** optional analytics/marketing cookies "only after Aceptar todas" holds for the Meta Pixel and for GA's *storage*; GPC is honoured by the banner; the cookie table lists `sb-*`, `lagomplan-consent`, `_ga`, `_fbp`, `stay22_*`.
- **Contradicted:** the claim that nothing optional loads before consent (GA script, Mailchimp script, Stay22, Google Maps, Open-Meteo load first); retention periods (5 years / 13 months / 30 days for minors) that no code enforces; deletion and access requests "from Mi cuenta > Privacidad" (that page is "Coming soon"; the rights mailbox `privacidad@lagomplan.com` is [por confirmar]; the same page also gives `contact@elenaferre.com`); "revoke secondary consents from Configuración de Privacidad" (no such setting); data collected (phone, date of birth, 2FA, reviews, wishlists, billing address, RFC, parental consent for 13-17) that the app does not collect or implement; vendors named but not used (AWS/GCP, Mixpanel, SendGrid/Mailgun, Conekta, MercadoPago, Zendesk/Intercom); "paid plans soon" (Stripe is live); "anonymised data used to train our models" (no such pipeline in the repository).
- **Not mentioned although it happens:** Anthropic (trip inputs, including children's ages and free text, go to the model), Mailchimp (script and subscriptions), Resend, Vercel, Supabase (region us-east-2 [inferred]), Open-Meteo, Google Maps/Places, Unsplash, the consent log (hashed IP + user-agent), the guide visit log, the `lagom_ref` partner cookie and localStorage, `anon_gen_count`, the first-touch/partner-touch localStorage keys, server-side GA events with `user_id`, and contact messages.
