-- Rate-limit ledger for POST /api/lead-magnet (checklist landing).
-- One row per accepted attempt. kind = 'ip' | 'email'; key_hash is a salted
-- SHA-256 (never the raw IP/email). The route counts rows in a window
-- (5 per IP / 10 min, 3 per email / 24h) before inserting. Service-role only:
-- RLS is on with no policies, so anon/authenticated clients can't read or write.

CREATE TABLE IF NOT EXISTS "public"."lead_magnet_attempts" (
  "id"         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "kind"       text        NOT NULL CHECK ("kind" IN ('ip', 'email')),
  "key_hash"   text        NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "lead_magnet_attempts_lookup_idx"
  ON "public"."lead_magnet_attempts" ("kind", "key_hash", "created_at" DESC);

ALTER TABLE "public"."lead_magnet_attempts" ENABLE ROW LEVEL SECURITY;
