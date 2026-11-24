-- Optional signup fields for hotel_partners: WhatsApp/phone, number of rooms, contact role.
-- Additive: three nullable columns, no default, no backfill. NOT applied yet.
-- Apply BEFORE using a build that lets hotels fill these in: a signup that includes any of them fails until the
-- columns exist (signups that leave them empty keep working either way).

ALTER TABLE "public"."hotel_partners"
  ADD COLUMN IF NOT EXISTS "contact_phone" text CHECK ("contact_phone" IS NULL OR char_length("contact_phone") BETWEEN 6 AND 40),
  ADD COLUMN IF NOT EXISTS "rooms"         integer CHECK ("rooms" IS NULL OR "rooms" BETWEEN 1 AND 5000),
  ADD COLUMN IF NOT EXISTS "contact_role"  text CHECK ("contact_role" IS NULL OR char_length("contact_role") <= 120);
