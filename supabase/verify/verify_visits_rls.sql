-- Run AFTER applying 20261008000000_guide_demo_visits.sql. Expected results in comments.
-- Lives in supabase/verify/ (not supabase/migrations/) so `supabase db push`
-- never mistakes it for a migration.

-- 1) Only INSERT policies exist (no SELECT/ALL/UPDATE/DELETE) → 2 rows, cmd = INSERT
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename in ('guide_visits', 'demo_visits');

-- 2) RLS on → both true
select relname, relrowsecurity as rls_on
from pg_class
where relnamespace = 'public'::regnamespace and relname in ('guide_visits', 'demo_visits');

-- 3) Table-level privileges for anon/authenticated → 0 rows (nothing at table level)
select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name in ('guide_visits', 'demo_visits')
  and grantee in ('anon', 'authenticated', 'PUBLIC');

-- 4) Column-level privileges for anon/authenticated → only INSERT, only
--    slug / lang / params_present / ua_summary / ref  (SELECT, UPDATE and
--    REFERENCES must NOT appear; id and created_at must NOT appear)
select table_name, grantee, column_name, privilege_type
from information_schema.column_privileges
where table_schema = 'public' and table_name in ('guide_visits', 'demo_visits')
  and grantee in ('anon', 'authenticated')
order by 1, 2, 3, 4;

-- 5) Client-level checks (run from a shell with the PUBLIC anon key; NOT SQL):
--   URL=https://<project>.supabase.co  KEY=<anon key>
--   a) valid insert passes (201, empty body):
--      curl -s -o /dev/null -w "%{http_code}\n" -X POST "$URL/rest/v1/demo_visits" \
--        -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
--        -H "Prefer: return=minimal" \
--        -d '{"slug":"verify-rls","lang":"es","params_present":["noches","ref"],"ua_summary":"desktop:chrome","ref":"qr"}'
--   b) anon SELECT fails (401/403 "permission denied", never rows):
--      curl -s "$URL/rest/v1/demo_visits?select=*" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
--   c) invalid rows rejected (400, check violation): lang "fr"; ref "UPPER CASE!";
--      an unknown params_present name; ua_summary with a raw user-agent string
--   d) client-set created_at / id rejected (42501 permission denied for column)
--   Afterwards delete the test row from the dashboard:
--      delete from demo_visits where slug = 'verify-rls';
