-- Fix: travelers column is INTEGER in the live DB — must be TEXT to accept 'solo'|'pareja'|'familia'|'amigos'
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → Run)

-- Set existing rows to NULL first to avoid USING-clause cast errors on old integer data
ALTER TABLE trips ALTER COLUMN travelers DROP DEFAULT;

ALTER TABLE trips
  ALTER COLUMN travelers TYPE TEXT USING NULL;
