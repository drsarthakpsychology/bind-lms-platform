# Access Control — BOLA / BFLA / IDOR

Broken access control is OWASP A01 (2025) and API1:2023 **BOLA** is the #1 API
attack class (~40% of API attacks). It is the dominant flaw in AI-assisted code
and must be the first thing you check.

## Definitions

- **BOLA / IDOR** — manipulating an object ID to access another user's object
  (e.g. `GET /api/submissions/123` where 123 belongs to someone else). The
  direct analog of Supabase RLS failures.
- **BFLA** — calling a function-level endpoint you shouldn't have access to
  (e.g. an admin action from a student session).
- **BOPLA** (API3) — writing fields you shouldn't (e.g. a policy lets a row
  update but not every column — RLS is row-level, not column-level).

## Checklist

1. Enumerate every endpoint, route handler, and server action.
2. For each, trace: is there an auth check, and does it **re-verify at the
   data layer** (an ownership `WHERE user_id = auth.uid()` / RLS policy)?
3. Flag any route that reads an ID from the request and queries without an
   ownership check.
4. Test cross-tenant: authenticate as user A, attempt to read/modify user B's
   object by ID. Repeat as anon, authenticated, and different custom-claim
   roles.
5. Never rely on middleware alone for authorization — it can be bypassed
   (see `nextjs.md` CVE-2025-29927).

## Testing notes

- Static reading misses BOLA — verify empirically per request. OWASP explicitly
  notes BOLA is not reliably caught by automated static/dynamic tests.
- Negative tests (unauthenticated/forbidden must fail) and cross-role tests
  catch the inverted-auth bugs (blocked-logged-in, anonymous-through) that
  shipped in real incidents.
- In Supabase, test from the **client SDK** with the anon key, never the SQL
  Editor (which bypasses RLS). See `supabase-rls.md`.
