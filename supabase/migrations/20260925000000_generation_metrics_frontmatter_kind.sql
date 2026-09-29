-- Front-matter (title/tagline/hero_tags/before_you_go/budget_breakdown/
-- accommodations) split out of chunk 0 into its own concurrent call
-- (generateFrontmatter in the worker) so chunk 0 doesn't carry the extra
-- weight that made it consistently the slowest call in the batch. Widen
-- the schema_kind check to allow tagging those rows.

ALTER TABLE "public"."generation_metrics"
  DROP CONSTRAINT IF EXISTS "generation_metrics_schema_kind_check";

ALTER TABLE "public"."generation_metrics"
  ADD CONSTRAINT "generation_metrics_schema_kind_check"
  CHECK ("schema_kind" = ANY (ARRAY['full'::"text", 'lean'::"text", 'skeleton'::"text", 'frontmatter'::"text"]));
