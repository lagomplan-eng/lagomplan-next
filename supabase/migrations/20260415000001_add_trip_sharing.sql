-- Migration: add sharing support to the trips table
-- Run via: supabase db push  OR  paste in Supabase SQL editor

ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS share_id   UUID    UNIQUE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_shared  BOOLEAN NOT NULL DEFAULT FALSE;

-- Fast lookup by share_id (partial index — only indexes non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS trips_share_id_idx
  ON trips (share_id)
  WHERE share_id IS NOT NULL;

-- Allow any authenticated user to read a trip that has been explicitly shared.
-- Without this, RLS blocks non-owners from loading a shared trip via /planner?trip_id=...
-- (The share page redirects authenticated users there after verifying the share_id.)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'trips' AND policyname = 'authenticated_read_shared_trips'
  ) THEN
    CREATE POLICY "authenticated_read_shared_trips"
      ON trips FOR SELECT
      TO authenticated
      USING (is_shared = true);
  END IF;
END $$;
