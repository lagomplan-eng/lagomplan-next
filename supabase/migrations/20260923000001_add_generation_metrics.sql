-- generation_metrics: one row per Anthropic call made while generating a
-- trip (skeleton/Haiku pass, full-schema chunk 0, lean day chunks 1+, and
-- multi-city segment calls). Write-only from the two Edge Functions
-- (generate-trip, generate-trip-worker) via a fire-and-forget REST insert
-- using the service role key — no app code reads this table today; it
-- exists purely to compare wall-clock time and token usage across
-- schema_kind ('full' | 'lean' | 'skeleton') and path ('single' | 'multi')
-- once the day-level concurrency redesign is live. See the 2026-09-23 PR.

CREATE TABLE IF NOT EXISTS "public"."generation_metrics" (
    "id"             "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id"         "uuid",
    "chunk_index"    integer,
    "schema_kind"    "text" NOT NULL,
    "path"           "text" NOT NULL,
    "model"          "text" NOT NULL,
    "ms"             integer NOT NULL,
    "input_tokens"   integer,
    "output_tokens"  integer,
    "stop_reason"    "text",
    "ok"             boolean NOT NULL DEFAULT true,
    "created_at"     timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "generation_metrics_schema_kind_check"
        CHECK ("schema_kind" = ANY (ARRAY['full'::"text", 'lean'::"text", 'skeleton'::"text"])),
    CONSTRAINT "generation_metrics_path_check"
        CHECK ("path" = ANY (ARRAY['single'::"text", 'multi'::"text"]))
);

ALTER TABLE "public"."generation_metrics" OWNER TO "postgres";

ALTER TABLE ONLY "public"."generation_metrics"
    ADD CONSTRAINT "generation_metrics_pkey" PRIMARY KEY ("id");

-- No FK to generation_jobs — job_id is best-effort telemetry, not a
-- referential-integrity requirement, and metrics rows should survive a
-- job row being pruned/archived independently in the future.
CREATE INDEX "generation_metrics_job_id_idx"
  ON "public"."generation_metrics" USING "btree" ("job_id");
CREATE INDEX "generation_metrics_created_at_idx"
  ON "public"."generation_metrics" USING "btree" ("created_at" DESC);
CREATE INDEX "generation_metrics_path_schema_kind_idx"
  ON "public"."generation_metrics" USING "btree" ("path", "schema_kind");

ALTER TABLE "public"."generation_metrics" ENABLE ROW LEVEL SECURITY;

-- Same pattern as generation_jobs/generation_chunks: service_role only.
-- This is internal telemetry, never read or written by an end-user
-- session, so no analogous "users_read_own_*" policy exists here.
CREATE POLICY "service_role_all_generation_metrics" ON "public"."generation_metrics"
  USING (("auth"."role"() = 'service_role'::"text"));

GRANT ALL ON TABLE "public"."generation_metrics" TO "anon";
GRANT ALL ON TABLE "public"."generation_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."generation_metrics" TO "service_role";
