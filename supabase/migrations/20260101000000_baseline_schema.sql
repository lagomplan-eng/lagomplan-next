


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."sf_category" AS ENUM (
    'avion',
    'organizado',
    'conectado',
    'familia'
);


ALTER TYPE "public"."sf_category" OWNER TO "postgres";


CREATE TYPE "public"."sf_kit_content_type" AS ENUM (
    'flat',
    'systems'
);


ALTER TYPE "public"."sf_kit_content_type" OWNER TO "postgres";


CREATE TYPE "public"."sf_persona" AS ENUM (
    'familias',
    'parejas',
    'fan'
);


ALTER TYPE "public"."sf_persona" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user_entitlement"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.user_entitlements (user_id, tier, trips_remaining, trips_used)
  VALUES (NEW.id, 'free', 3, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user_entitlement"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_generation_jobs_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."touch_generation_jobs_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."click_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_type" "text" NOT NULL,
    "item_type" "text" NOT NULL,
    "item_slug" "text",
    "item_name" "text",
    "page" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."click_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."consent_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "choice" "text" NOT NULL,
    "user_id" "uuid",
    "ip_hash" "text",
    "user_agent" "text",
    "locale" "text",
    "gpc" boolean DEFAULT false NOT NULL,
    "policy_version" "text" DEFAULT 'v1'::"text" NOT NULL,
    CONSTRAINT "consent_log_choice_check" CHECK (("choice" = ANY (ARRAY['all'::"text", 'essential'::"text"])))
);


ALTER TABLE "public"."consent_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."generation_chunks" (
    "job_id" "uuid" NOT NULL,
    "chunk_index" integer NOT NULL,
    "content" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."generation_chunks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."generation_jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trip_id" "uuid",
    "status" "text" NOT NULL,
    "inputs" "jsonb" NOT NULL,
    "chunks_total" integer NOT NULL,
    "chunks_done" integer DEFAULT 0 NOT NULL,
    "result" "jsonb",
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "partial_result" "jsonb",
    CONSTRAINT "generation_jobs_status_check" CHECK (("status" = ANY (ARRAY['queued'::"text", 'running'::"text", 'completed'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."generation_jobs" OWNER TO "postgres";


COMMENT ON COLUMN "public"."generation_jobs"."partial_result" IS 'Progressive trip assembly written by the worker after each chunk completes.';



CREATE TABLE IF NOT EXISTS "public"."kit_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "kit_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "sort_order" integer DEFAULT 100 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."kit_products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."kits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "cta_label" "text" DEFAULT 'View kit'::"text",
    "is_active" boolean DEFAULT true NOT NULL,
    "is_featured" boolean DEFAULT false NOT NULL,
    "sort_order" integer DEFAULT 100 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."kits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."kpi_monthly" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "month_id" "text" NOT NULL,
    "month_label" "text",
    "month_start" "date" NOT NULL,
    "revenue_total" numeric,
    "email_total" integer,
    "explorer_active" integer,
    "guides_published" integer,
    "ad_spend" numeric,
    "stay22_month" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."kpi_monthly" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."kpi_weekly" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "week_id" "text" NOT NULL,
    "week_start" "date" NOT NULL,
    "week_label" "text",
    "sessions" integer,
    "sessions_wc" integer,
    "planner_uses" integer,
    "planner_wc" integer,
    "stay22_clicks" integer,
    "stay22_wc" integer,
    "social_reach" integer,
    "reel_saves" integer,
    "subs_new" integer,
    "accounts_new" integer,
    "returning_logins" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."kpi_weekly" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "destination" "text",
    "start_date" "date",
    "end_date" "date",
    "locale" "text" DEFAULT 'es-MX'::"text",
    "inputs" "jsonb" NOT NULL,
    "itinerary" "jsonb" NOT NULL,
    "prompt_version" "text",
    "model" "text"
);


ALTER TABLE "public"."plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "short_description" "text",
    "category" "text" NOT NULL,
    "subcategory" "text",
    "image_url" "text",
    "affiliate_url" "text" NOT NULL,
    "merchant" "text",
    "price_label" "text",
    "badge_text" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "is_essential" boolean DEFAULT false NOT NULL,
    "is_family" boolean DEFAULT false NOT NULL,
    "is_featured" boolean DEFAULT false NOT NULL,
    "sort_order" integer DEFAULT 100 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "plan" "text" DEFAULT 'free'::"text",
    "save_limit" integer DEFAULT 2,
    "saves_used" integer DEFAULT 0,
    "period_start" "date" DEFAULT CURRENT_DATE,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sf_kit_section_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "kit_id" "text" NOT NULL,
    "section_id" "uuid",
    "subsection_id" "uuid",
    "product_id" "text" NOT NULL,
    "position" integer NOT NULL,
    "is_hero" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "sf_kit_section_products_location_check" CHECK ((("subsection_id" IS NULL) OR ("section_id" IS NOT NULL)))
);


ALTER TABLE "public"."sf_kit_section_products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sf_kit_sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "kit_id" "text" NOT NULL,
    "position" integer NOT NULL,
    "label" "text" NOT NULL,
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sf_kit_sections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sf_kit_subsections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section_id" "uuid" NOT NULL,
    "position" integer NOT NULL,
    "label" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sf_kit_subsections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sf_kits" (
    "id" "text" NOT NULL,
    "num" "text" NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text" NOT NULL,
    "pain_moment" "text" NOT NULL,
    "scene" "text" NOT NULL,
    "omit" "text",
    "persona" "public"."sf_persona" NOT NULL,
    "situations" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "content_type" "public"."sf_kit_content_type" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sf_kits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sf_products" (
    "id" "text" NOT NULL,
    "brand" "text" NOT NULL,
    "name" "text" NOT NULL,
    "tag" "text" NOT NULL,
    "opinion" "text" NOT NULL,
    "price" "text" NOT NULL,
    "where_to_buy" "text" NOT NULL,
    "link" "text" NOT NULL,
    "icon" "text",
    "image" "text",
    "emoji" "text",
    "aside" "text",
    "category" "public"."sf_category",
    "surfaces" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sf_products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trips" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "title" "text",
    "input" "jsonb",
    "output" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "slug" "text",
    "origin" "text",
    "destination" "text",
    "duration_days" integer,
    "travelers" "text",
    "travel_style" "text",
    "budget_level" "text",
    "interests" "text"[],
    "trip_data" "jsonb",
    "user_email" "text",
    "status" "text",
    "share_id" "uuid",
    "is_shared" boolean DEFAULT false NOT NULL,
    "traveler_adults" integer DEFAULT 2 NOT NULL,
    "traveler_children" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "traveler_group_count" integer,
    "currency" "text" DEFAULT 'MXN'::"text" NOT NULL,
    "intelligence" "jsonb",
    "walking_tolerance" "text" DEFAULT 'medium'::"text",
    "trip_progress" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    CONSTRAINT "trips_currency_check" CHECK (("currency" = ANY (ARRAY['USD'::"text", 'MXN'::"text"]))),
    CONSTRAINT "trips_traveler_adults_check" CHECK ((("traveler_adults" >= 1) AND ("traveler_adults" <= 20))),
    CONSTRAINT "trips_traveler_group_count_check" CHECK ((("traveler_group_count" IS NULL) OR (("traveler_group_count" >= 2) AND ("traveler_group_count" <= 50))))
);


ALTER TABLE "public"."trips" OWNER TO "postgres";


COMMENT ON COLUMN "public"."trips"."slug" IS 'Unique — used in the URL';



COMMENT ON COLUMN "public"."trips"."origin" IS 'Where user travels from';



COMMENT ON COLUMN "public"."trips"."destination" IS 'Where they''re going';



COMMENT ON COLUMN "public"."trips"."duration_days" IS 'Number of days';



COMMENT ON COLUMN "public"."trips"."travelers" IS 'Number of people';



COMMENT ON COLUMN "public"."trips"."travel_style" IS 'e.g. "romantic"';



COMMENT ON COLUMN "public"."trips"."budget_level" IS 'e.g. "medium"';



COMMENT ON COLUMN "public"."trips"."interests" IS 'Array of strings';



COMMENT ON COLUMN "public"."trips"."trip_data" IS 'The full AI output';



COMMENT ON COLUMN "public"."trips"."user_email" IS 'nullable';



COMMENT ON COLUMN "public"."trips"."status" IS 'Default: ''generated''';



COMMENT ON COLUMN "public"."trips"."intelligence" IS 'TripIntelligence object computed by lib/intelligence.ts.';



COMMENT ON COLUMN "public"."trips"."walking_tolerance" IS 'low | medium | high — drives intelligence energy_warning threshold.';



COMMENT ON COLUMN "public"."trips"."trip_progress" IS 'Companion-view traveler progress (per-item notes/links + packing check-off). Owned by the mobile trip view; never written by the desktop planner autosave. See lib/planner/progress.ts.';



CREATE TABLE IF NOT EXISTS "public"."user_entitlements" (
    "user_id" "uuid" NOT NULL,
    "tier" "text" DEFAULT 'free'::"text" NOT NULL,
    "trips_remaining" integer DEFAULT 3 NOT NULL,
    "trips_used" integer DEFAULT 0 NOT NULL,
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "current_period_end" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_session_id" "text"
);


ALTER TABLE "public"."user_entitlements" OWNER TO "postgres";


ALTER TABLE ONLY "public"."click_events"
    ADD CONSTRAINT "click_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."consent_log"
    ADD CONSTRAINT "consent_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."generation_chunks"
    ADD CONSTRAINT "generation_chunks_pkey" PRIMARY KEY ("job_id", "chunk_index");



ALTER TABLE ONLY "public"."generation_jobs"
    ADD CONSTRAINT "generation_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kit_products"
    ADD CONSTRAINT "kit_products_kit_id_product_id_key" UNIQUE ("kit_id", "product_id");



ALTER TABLE ONLY "public"."kit_products"
    ADD CONSTRAINT "kit_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kits"
    ADD CONSTRAINT "kits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kits"
    ADD CONSTRAINT "kits_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."kpi_monthly"
    ADD CONSTRAINT "kpi_monthly_month_id_key" UNIQUE ("month_id");



ALTER TABLE ONLY "public"."kpi_monthly"
    ADD CONSTRAINT "kpi_monthly_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kpi_weekly"
    ADD CONSTRAINT "kpi_weekly_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kpi_weekly"
    ADD CONSTRAINT "kpi_weekly_week_id_key" UNIQUE ("week_id");



ALTER TABLE ONLY "public"."plans"
    ADD CONSTRAINT "plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sf_kit_section_products"
    ADD CONSTRAINT "sf_kit_section_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sf_kit_sections"
    ADD CONSTRAINT "sf_kit_sections_kit_id_position_key" UNIQUE ("kit_id", "position");



ALTER TABLE ONLY "public"."sf_kit_sections"
    ADD CONSTRAINT "sf_kit_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sf_kit_subsections"
    ADD CONSTRAINT "sf_kit_subsections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sf_kit_subsections"
    ADD CONSTRAINT "sf_kit_subsections_section_id_position_key" UNIQUE ("section_id", "position");



ALTER TABLE ONLY "public"."sf_kits"
    ADD CONSTRAINT "sf_kits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sf_products"
    ADD CONSTRAINT "sf_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_share_id_key" UNIQUE ("share_id");



ALTER TABLE ONLY "public"."user_entitlements"
    ADD CONSTRAINT "user_entitlements_pkey" PRIMARY KEY ("user_id");



CREATE INDEX "consent_log_created_at_idx" ON "public"."consent_log" USING "btree" ("created_at" DESC);



CREATE INDEX "consent_log_user_id_idx" ON "public"."consent_log" USING "btree" ("user_id") WHERE ("user_id" IS NOT NULL);



CREATE INDEX "generation_jobs_stale_idx" ON "public"."generation_jobs" USING "btree" ("status", "updated_at") WHERE ("status" = ANY (ARRAY['queued'::"text", 'running'::"text"]));



CREATE INDEX "generation_jobs_user_created_idx" ON "public"."generation_jobs" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_kit_products_kit_id" ON "public"."kit_products" USING "btree" ("kit_id");



CREATE INDEX "idx_kit_products_product_id" ON "public"."kit_products" USING "btree" ("product_id");



CREATE INDEX "idx_kit_products_sort_order" ON "public"."kit_products" USING "btree" ("sort_order");



CREATE INDEX "idx_kits_active" ON "public"."kits" USING "btree" ("is_active");



CREATE INDEX "idx_kits_featured" ON "public"."kits" USING "btree" ("is_featured");



CREATE INDEX "idx_kits_sort_order" ON "public"."kits" USING "btree" ("sort_order");



CREATE INDEX "idx_products_active" ON "public"."products" USING "btree" ("is_active");



CREATE INDEX "idx_products_essential" ON "public"."products" USING "btree" ("is_essential");



CREATE INDEX "idx_products_family" ON "public"."products" USING "btree" ("is_family");



CREATE INDEX "idx_products_sort_order" ON "public"."products" USING "btree" ("sort_order");



CREATE INDEX "plans_user_created_idx" ON "public"."plans" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "sf_kit_section_products_kit_idx" ON "public"."sf_kit_section_products" USING "btree" ("kit_id", "position");



CREATE INDEX "sf_kit_section_products_section_idx" ON "public"."sf_kit_section_products" USING "btree" ("section_id") WHERE ("section_id" IS NOT NULL);



CREATE INDEX "sf_kits_persona_idx" ON "public"."sf_kits" USING "btree" ("persona");



CREATE INDEX "sf_kits_sort_active_idx" ON "public"."sf_kits" USING "btree" ("sort_order") WHERE ("is_active" = true);



CREATE INDEX "sf_products_active_idx" ON "public"."sf_products" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "trips_intelligence_gin_idx" ON "public"."trips" USING "gin" ("intelligence") WHERE ("intelligence" IS NOT NULL);



CREATE UNIQUE INDEX "trips_share_id_idx" ON "public"."trips" USING "btree" ("share_id") WHERE ("share_id" IS NOT NULL);



CREATE INDEX "trips_user_id_idx" ON "public"."trips" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "generation_jobs_touch_updated_at" BEFORE UPDATE ON "public"."generation_jobs" FOR EACH ROW EXECUTE FUNCTION "public"."touch_generation_jobs_updated_at"();



CREATE OR REPLACE TRIGGER "sf_kits_updated_at" BEFORE UPDATE ON "public"."sf_kits" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "sf_products_updated_at" BEFORE UPDATE ON "public"."sf_products" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."consent_log"
    ADD CONSTRAINT "consent_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."generation_chunks"
    ADD CONSTRAINT "generation_chunks_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."generation_jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."generation_jobs"
    ADD CONSTRAINT "generation_jobs_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."generation_jobs"
    ADD CONSTRAINT "generation_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."kit_products"
    ADD CONSTRAINT "kit_products_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "public"."kits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."kit_products"
    ADD CONSTRAINT "kit_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."plans"
    ADD CONSTRAINT "plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sf_kit_section_products"
    ADD CONSTRAINT "sf_kit_section_products_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "public"."sf_kits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sf_kit_section_products"
    ADD CONSTRAINT "sf_kit_section_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."sf_products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sf_kit_section_products"
    ADD CONSTRAINT "sf_kit_section_products_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sf_kit_sections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sf_kit_section_products"
    ADD CONSTRAINT "sf_kit_section_products_subsection_id_fkey" FOREIGN KEY ("subsection_id") REFERENCES "public"."sf_kit_subsections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sf_kit_sections"
    ADD CONSTRAINT "sf_kit_sections_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "public"."sf_kits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sf_kit_subsections"
    ADD CONSTRAINT "sf_kit_subsections_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sf_kit_sections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_entitlements"
    ADD CONSTRAINT "user_entitlements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Public can read trips by slug" ON "public"."trips" FOR SELECT USING (true);



CREATE POLICY "Public insert click_events" ON "public"."click_events" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Public read kit_products" ON "public"."kit_products" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public read kits" ON "public"."kits" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public read products" ON "public"."products" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public read sf_kit_section_products" ON "public"."sf_kit_section_products" FOR SELECT USING (true);



CREATE POLICY "Public read sf_kit_sections" ON "public"."sf_kit_sections" FOR SELECT USING (true);



CREATE POLICY "Public read sf_kit_subsections" ON "public"."sf_kit_subsections" FOR SELECT USING (true);



CREATE POLICY "Public read sf_kits" ON "public"."sf_kits" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Public read sf_products" ON "public"."sf_products" FOR SELECT USING (("is_active" = true));



CREATE POLICY "auth only" ON "public"."kpi_monthly" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "auth only" ON "public"."kpi_weekly" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "authenticated_read_shared_trips" ON "public"."trips" FOR SELECT TO "authenticated" USING (("is_shared" = true));



ALTER TABLE "public"."click_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."consent_log" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "delete own plans" ON "public"."plans" FOR DELETE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."generation_chunks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."generation_jobs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert own plans" ON "public"."plans" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."kit_products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."kits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."kpi_monthly" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."kpi_weekly" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "read own plans" ON "public"."plans" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "service_role_all_chunks" ON "public"."generation_chunks" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "service_role_all_entitlements" ON "public"."user_entitlements" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "service_role_all_jobs" ON "public"."generation_jobs" USING (("auth"."role"() = 'service_role'::"text"));



ALTER TABLE "public"."sf_kit_section_products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sf_kit_sections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sf_kit_subsections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sf_kits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sf_products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trips" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "trips_insert_own" ON "public"."trips" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "trips_select_own" ON "public"."trips" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."user_entitlements" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_read_own_consent" ON "public"."consent_log" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "users_read_own_entitlements" ON "public"."user_entitlements" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "users_read_own_jobs" ON "public"."generation_jobs" FOR SELECT USING (("auth"."uid"() = "user_id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user_entitlement"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user_entitlement"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user_entitlement"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_generation_jobs_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_generation_jobs_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_generation_jobs_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."click_events" TO "anon";
GRANT ALL ON TABLE "public"."click_events" TO "authenticated";
GRANT ALL ON TABLE "public"."click_events" TO "service_role";



GRANT ALL ON TABLE "public"."consent_log" TO "anon";
GRANT ALL ON TABLE "public"."consent_log" TO "authenticated";
GRANT ALL ON TABLE "public"."consent_log" TO "service_role";



GRANT ALL ON TABLE "public"."generation_chunks" TO "anon";
GRANT ALL ON TABLE "public"."generation_chunks" TO "authenticated";
GRANT ALL ON TABLE "public"."generation_chunks" TO "service_role";



GRANT ALL ON TABLE "public"."generation_jobs" TO "anon";
GRANT ALL ON TABLE "public"."generation_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."generation_jobs" TO "service_role";



GRANT ALL ON TABLE "public"."kit_products" TO "anon";
GRANT ALL ON TABLE "public"."kit_products" TO "authenticated";
GRANT ALL ON TABLE "public"."kit_products" TO "service_role";



GRANT ALL ON TABLE "public"."kits" TO "anon";
GRANT ALL ON TABLE "public"."kits" TO "authenticated";
GRANT ALL ON TABLE "public"."kits" TO "service_role";



GRANT ALL ON TABLE "public"."kpi_monthly" TO "anon";
GRANT ALL ON TABLE "public"."kpi_monthly" TO "authenticated";
GRANT ALL ON TABLE "public"."kpi_monthly" TO "service_role";



GRANT ALL ON TABLE "public"."kpi_weekly" TO "anon";
GRANT ALL ON TABLE "public"."kpi_weekly" TO "authenticated";
GRANT ALL ON TABLE "public"."kpi_weekly" TO "service_role";



GRANT ALL ON TABLE "public"."plans" TO "anon";
GRANT ALL ON TABLE "public"."plans" TO "authenticated";
GRANT ALL ON TABLE "public"."plans" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."sf_kit_section_products" TO "anon";
GRANT ALL ON TABLE "public"."sf_kit_section_products" TO "authenticated";
GRANT ALL ON TABLE "public"."sf_kit_section_products" TO "service_role";



GRANT ALL ON TABLE "public"."sf_kit_sections" TO "anon";
GRANT ALL ON TABLE "public"."sf_kit_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."sf_kit_sections" TO "service_role";



GRANT ALL ON TABLE "public"."sf_kit_subsections" TO "anon";
GRANT ALL ON TABLE "public"."sf_kit_subsections" TO "authenticated";
GRANT ALL ON TABLE "public"."sf_kit_subsections" TO "service_role";



GRANT ALL ON TABLE "public"."sf_kits" TO "anon";
GRANT ALL ON TABLE "public"."sf_kits" TO "authenticated";
GRANT ALL ON TABLE "public"."sf_kits" TO "service_role";



GRANT ALL ON TABLE "public"."sf_products" TO "anon";
GRANT ALL ON TABLE "public"."sf_products" TO "authenticated";
GRANT ALL ON TABLE "public"."sf_products" TO "service_role";



GRANT ALL ON TABLE "public"."trips" TO "anon";
GRANT ALL ON TABLE "public"."trips" TO "authenticated";
GRANT ALL ON TABLE "public"."trips" TO "service_role";



GRANT ALL ON TABLE "public"."user_entitlements" TO "anon";
GRANT ALL ON TABLE "public"."user_entitlements" TO "authenticated";
GRANT ALL ON TABLE "public"."user_entitlements" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































