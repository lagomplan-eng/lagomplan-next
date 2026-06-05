-- supabase/migrations/20260520_smart_finds_catalog.sql
--
-- Smart Finds catalog: moves the editorial product + kit data from
-- lib/smart-finds/{kits,products}.ts into Supabase so prices, links, and
-- copy can be updated from Supabase Studio without a code deploy.
--
-- Schema mirrors the existing TS shape exactly:
--   sf_products              ← Product entity (atomic)
--   sf_kits                  ← Kit entity (header + content_type discriminator)
--   sf_kit_sections          ← Optional, only for kits with content_type='systems'
--   sf_kit_subsections       ← Optional, nested under sections (kit 02 uses this)
--   sf_kit_section_products  ← Single junction handling all three locations:
--                              flat kit       → (section_id null, subsection_id null)
--                              system section → (section_id set,  subsection_id null)
--                              system subsec. → (section_id set,  subsection_id set)
--
-- IDs are TEXT (not UUID) so the existing slug-style identifiers
-- ('doona-car-seat-stroller', 'sin-perder-a-nadie') survive — the seed
-- script can run idempotently against the same source TS file without
-- generating new IDs on every run.
--
-- RLS: public read for active rows (the catalog is editorial content,
-- not user data). Writes happen via the service-role seed script.
--
-- Run with:  supabase migration up --project-ref qvntwqnzvspoisaglgpp
-- Or paste this block into the Supabase dashboard SQL editor.

BEGIN;

-- ── ENUMS ────────────────────────────────────────────────────────────────────

CREATE TYPE sf_persona AS ENUM ('familias', 'parejas', 'fan');

CREATE TYPE sf_kit_content_type AS ENUM ('flat', 'systems');

CREATE TYPE sf_category AS ENUM ('avion', 'organizado', 'conectado', 'familia');

-- ── PRODUCTS ─────────────────────────────────────────────────────────────────

CREATE TABLE public.sf_products (
  id            text        PRIMARY KEY,
  brand         text        NOT NULL,
  name          text        NOT NULL,
  tag           text        NOT NULL,
  opinion       text        NOT NULL,
  price         text        NOT NULL,
  where_to_buy  text        NOT NULL,     -- "where" is reserved in SQL
  link          text        NOT NULL,
  icon          text,                     -- SVG IconKey from lib/smart-finds/icons.tsx
  image         text,                     -- "/images/smart-finds/<slug>.jpg"
  emoji         text,
  aside         text,
  category      sf_category,
  surfaces      text[]      NOT NULL DEFAULT '{}'::text[],
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ── KITS ─────────────────────────────────────────────────────────────────────

CREATE TABLE public.sf_kits (
  id            text                 PRIMARY KEY,
  num           text                 NOT NULL,     -- display label "01", "02"
  title         text                 NOT NULL,
  subtitle      text                 NOT NULL,
  pain_moment   text                 NOT NULL,
  scene         text                 NOT NULL,
  omit          text,                              -- optional "what we left out" callout
  persona       sf_persona           NOT NULL,
  situations    text[]               NOT NULL DEFAULT '{}'::text[],
  content_type  sf_kit_content_type  NOT NULL,
  sort_order    int                  NOT NULL DEFAULT 0,
  is_active     boolean              NOT NULL DEFAULT true,
  created_at    timestamptz          NOT NULL DEFAULT now(),
  updated_at    timestamptz          NOT NULL DEFAULT now()
);

-- ── SECTIONS (systems-type kits only) ────────────────────────────────────────

CREATE TABLE public.sf_kit_sections (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id     text        NOT NULL REFERENCES public.sf_kits(id) ON DELETE CASCADE,
  position   int         NOT NULL,
  label      text        NOT NULL,
  note       text,                                 -- optional editorial intro
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kit_id, position)
);

-- ── SUBSECTIONS (nested inside sections, e.g. kit 02 Sistema A/B/C) ─────────

CREATE TABLE public.sf_kit_subsections (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid        NOT NULL REFERENCES public.sf_kit_sections(id) ON DELETE CASCADE,
  position   int         NOT NULL,
  label      text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section_id, position)
);

-- ── JUNCTION (kit → product, scoped by optional section/subsection) ─────────

CREATE TABLE public.sf_kit_section_products (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id         text        NOT NULL REFERENCES public.sf_kits(id)            ON DELETE CASCADE,
  section_id     uuid                 REFERENCES public.sf_kit_sections(id)    ON DELETE CASCADE,
  subsection_id  uuid                 REFERENCES public.sf_kit_subsections(id) ON DELETE CASCADE,
  product_id     text        NOT NULL REFERENCES public.sf_products(id)        ON DELETE CASCADE,
  position       int         NOT NULL,
  is_hero        boolean     NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  -- Shape contract: if subsection is set, section must also be set.
  CONSTRAINT sf_kit_section_products_location_check CHECK (
    (subsection_id IS NULL) OR (section_id IS NOT NULL)
  )
);

-- ── INDEXES ──────────────────────────────────────────────────────────────────

CREATE INDEX sf_kits_sort_active_idx
  ON public.sf_kits (sort_order)
  WHERE is_active = true;

CREATE INDEX sf_kits_persona_idx
  ON public.sf_kits (persona);

CREATE INDEX sf_kit_section_products_kit_idx
  ON public.sf_kit_section_products (kit_id, position);

CREATE INDEX sf_kit_section_products_section_idx
  ON public.sf_kit_section_products (section_id)
  WHERE section_id IS NOT NULL;

CREATE INDEX sf_products_active_idx
  ON public.sf_products (is_active)
  WHERE is_active = true;

-- ── AUTO updated_at TRIGGERS (reuse set_updated_at if it already exists) ────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER sf_products_updated_at
  BEFORE UPDATE ON public.sf_products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER sf_kits_updated_at
  BEFORE UPDATE ON public.sf_kits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── RLS (public-read editorial catalog) ──────────────────────────────────────

ALTER TABLE public.sf_products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sf_kits                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sf_kit_sections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sf_kit_subsections     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sf_kit_section_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sf_products"
  ON public.sf_products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read sf_kits"
  ON public.sf_kits FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read sf_kit_sections"
  ON public.sf_kit_sections FOR SELECT
  USING (true);

CREATE POLICY "Public read sf_kit_subsections"
  ON public.sf_kit_subsections FOR SELECT
  USING (true);

CREATE POLICY "Public read sf_kit_section_products"
  ON public.sf_kit_section_products FOR SELECT
  USING (true);

COMMIT;
