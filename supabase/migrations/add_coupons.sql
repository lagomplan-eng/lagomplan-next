-- supabase/migrations/add_coupons.sql
-- Custom coupon system that bypasses Stripe for $0 flows.
-- Run with: supabase db push

-- ── Coupon definitions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code                TEXT        UNIQUE NOT NULL,
  credits_granted     INT,        -- null when grants_subscription = true
  grants_subscription BOOLEAN     NOT NULL DEFAULT FALSE,
  max_uses            INT,        -- null = unlimited
  uses_count          INT         NOT NULL DEFAULT 0,
  expires_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Per-user redemption log (prevents double-use) ─────────────────────────────
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  coupon_id   UUID        NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (coupon_id, user_id)
);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_coupons"
  ON coupons FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "users_read_own_redemptions"
  ON coupon_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "service_role_all_redemptions"
  ON coupon_redemptions FOR ALL
  USING (auth.role() = 'service_role');
