-- supabase/migrations/20260522_consent_log.sql
--
-- GDPR Article 7(1) audit trail for cookie consent decisions.
--
-- Why: localStorage on the user's device is not a defensible record —
-- the user can wipe it, and we have no proof of what they chose. EU
-- regulators expect the controller to be able to "demonstrate that the
-- data subject has consented." This table is that proof.
--
-- One row per accept/decline event. Older rows for the same user are
-- kept (not upserted) so we have a chronological history if a user's
-- decision changed over time — that's what the audit actually needs.
--
-- Privacy of the audit trail itself:
--   - We never store the raw IP. The API route SHA-256s it with a
--     server-side pepper (CONSENT_IP_SALT env var) so the column is
--     pseudonymous and not rainbow-table reversible.
--   - user_id is nullable and ON DELETE SET NULL — when a user
--     deletes their account, the row stays for audit purposes but
--     becomes unlinkable.
--
-- RLS:
--   - Inserts are service-role only (the /api/consent route uses the
--     admin client).
--   - Authenticated users can SELECT their own rows (for a future
--     "consent history" view under the right of access).
--   - Anon users cannot read anyone's rows.
--
-- Run with: supabase migration up --project-ref qvntwqnzvspoisaglgpp
-- Or paste into the Supabase dashboard SQL editor.

BEGIN;

CREATE TABLE IF NOT EXISTS public.consent_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  choice          text NOT NULL CHECK (choice IN ('all', 'essential')),
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash         text,
  user_agent      text,
  locale          text,
  gpc             boolean NOT NULL DEFAULT false,
  policy_version  text NOT NULL DEFAULT 'v1'
);

CREATE INDEX IF NOT EXISTS consent_log_user_id_idx    ON public.consent_log(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS consent_log_created_at_idx ON public.consent_log(created_at DESC);

ALTER TABLE public.consent_log ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own rows (future right-of-access UI).
DROP POLICY IF EXISTS "users_read_own_consent" ON public.consent_log;
CREATE POLICY "users_read_own_consent"
  ON public.consent_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for authenticated or anon roles —
-- the service role bypasses RLS, so the /api/consent route handles all
-- writes from the server side. This prevents a malicious client from
-- forging consent rows.

COMMIT;
