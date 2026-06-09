-- supabase/migrations/add_user_entitlements.sql
-- Paywall: per-user entitlement tracking.
-- Run with: supabase db push

-- ── Table ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_entitlements (
  user_id                UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier                   TEXT        NOT NULL DEFAULT 'free',    -- free | per_trip | pack_5 | pack_10 | explorer
  trips_remaining        INT         NOT NULL DEFAULT 3,         -- free users start with 3
  trips_used             INT         NOT NULL DEFAULT 0,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  current_period_end     TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;

-- Users can read their own row (for /api/me/plan)
CREATE POLICY "users_read_own_entitlements"
  ON user_entitlements FOR SELECT
  USING (auth.uid() = user_id);

-- Only service_role (admin client) can insert/update/delete
CREATE POLICY "service_role_all_entitlements"
  ON user_entitlements FOR ALL
  USING (auth.role() = 'service_role');

-- ── Auto-provision on signup ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user_entitlement()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_entitlements (user_id, tier, trips_remaining, trips_used)
  VALUES (NEW.id, 'free', 3, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_entitlement ON auth.users;
CREATE TRIGGER on_auth_user_created_entitlement
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_entitlement();
