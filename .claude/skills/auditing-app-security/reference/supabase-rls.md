# Supabase — RLS, anon/service_role keys, and IDOR

Supabase auto-exposes every table in `public` via PostgREST. The **anon key**
ships in every browser bundle, so any `public` table without RLS is readable
and writable by anyone. This is the #1 vibe-coded flaw (CVE-2025-48757 class).

## The core check

```sql
-- public tables WITHOUT row-level security → full CRUD to the internet.
SELECT schemaname, relname
FROM pg_tables
WHERE schemaname = 'public' AND NOT relrowsecurity;
```

- RLS **disabled** = open CRUD. **P0.**
- RLS **enabled with no policies** = deny-all (safe default).
- Every table should have RLS **and** at least one policy.

## Key facts

- **service_role key bypasses ALL RLS by design.** It must be server-only. One
  copy in a client bundle undoes every policy. If exposed: rotate it. (The anon
  key itself need not be rotated once RLS is fixed.)
- **`raw_user_meta_data` in the JWT is user-modifiable** — never use it for
  authorization. Use a DB table or `app_metadata` (server-set).
- **`SECURITY DEFINER` views/functions bypass RLS** — flag them.
- **The SQL Editor bypasses RLS** — policies must be tested from the client
  SDK, not the dashboard.
- **RLS is row-level only** — a policy allowing UPDATE lets a user write every
  column. Use Postgres column privileges to narrow writes (revoke table-wide,
  grant back only needed columns).
- **Public storage buckets** — Splinter lint 0025 (public bucket allows listing).
- **Realtime** respects RLS (only emits rows the user can SELECT), but
  unfiltered subscriptions can exhaust the ~20 free-tier connections.

## Empirical verification (do this — it catches what reading misses)

Replay the anon key against every table:

```bash
curl -s "https://<project>.supabase.co/rest/v1/<table>?select=*" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>"
```

- HTTP 200 with a populated JSON array → **RLS off, P0 breach.**
- HTTP 200 with `[]` → policy exists but returns nothing for anon (good).
- 401 / permission-denied → properly gated.

The PostgREST OpenAPI doc at `/rest/v1/` enumerates tables/columns to
anonymous callers.

## Tooling

- **Supabase Security Advisor / Splinter** — run the lints (0007 policy_exists_rls_disabled,
  0008 rls_enabled_no_policy, 0010 security_definer_view, 0013 rls_disabled_in_public,
  0015 rls_references_user_metadata, 0024 permissive_rls_policy, 0025 public_bucket_allows_listing).
- **SupaShield** — introspects schema, simulates anon/authenticated/custom-JWT
  roles, tests CRUD on every RLS table, wraps in transactions with ROLLBACK.
- **pgTAP** — in-database RLS tests with role impersonation
  (`SET ROLE`, `set_config('request.jwt.claims', ...)`).

## Regression gate

Add pgTAP + cross-role (SupaShield) tests to CI. Make an RLS-disabled
`public` table a merge blocker.
