-- Idempotency key: track the last Stripe session processed per user
-- so webhook + success-URL fallback can't double-credit.
ALTER TABLE user_entitlements
  ADD COLUMN IF NOT EXISTS last_session_id TEXT;
