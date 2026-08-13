# Security audit — 2026-08-14 (auditing-app-security skill)

Method: static reading + empirical replay (anon-key REST, read-only). Scope:
access control, secrets, misconfiguration, dependencies, test coverage. No
production changes made — the one DB fix is staged in
`src/migrations_pending/` pending Kavya's approval (infra safety rule).

## Verdict: strong posture, one LOW finding

### Finding 1 — LOW · `_migrations_applied` has RLS disabled
- **CWE:** CWE-284 (Improper Access Control)
- **Affected:** `public._migrations_applied`
- **Weakness:** The migration ledger is the only public table with RLS off.
  The anon key can read it via PostgREST.
- **Evidence:** `curl` with only the anon key →
  `GET /rest/v1/_migrations_applied?select=*&limit=1` → **HTTP 200**
  `[{"name":"mse_attempts_slug.sql","applied_at":"2026-08-13T18:17:26Z"}]`
- **Impact:** Minor internal-info disclosure (migration filenames + timestamps).
  No PII, no credentials, no student data. Not KEV/EPSS-relevant.
- **Remediation:** `alter table public._migrations_applied enable row level security;`
  — no policies granted, so nothing is readable/writable via REST afterwards.
  Migration scripts use the direct `pg` pooler (RLS-bypassing) — unaffected.
  **Staged** in `src/migrations_pending/rls_migrations_applied.sql`; NOT applied
  (brief: stop-and-explain before Supabase changes).
- **Effort:** S (apply one ALTER).

## Checked and clean (with evidence)

### Secrets (skill step 3)
- No server secret hardcoded in `src` — every `SUPABASE_SERVICE_ROLE_KEY` /
  `SESSION_SECRET` reference is a `process.env` read or an "isn't set in this
  deployment" error string.
- All `NEXT_PUBLIC_*` vars are public-by-design (anon key, URLs, Turnstile
  site key, Sentry DSN, feature flags). No `NEXT_PUBLIC_*` named SECRET/TOKEN
  that is actually secret.
- Build-bundle matches are the public anon key inlined by design.

### Access control / middleware (skill step 2)
- Next **16.2.12** — beyond the CVE-2025-29927 patched line (14.2.25+ /
  15.2.3+); not vulnerable by version.
- `src/proxy.ts` is a thin session-refresh layer (Next 16 proxy model). The
  **authoritative** auth is re-checked in every protected layout via
  `getSession()` (expired → `/expired`, unauthenticated/replaced →
  `/login`) — a proxy bypass alone grants nothing (defense-in-depth).
- Route handlers do owner-scoped checks (e.g. chain route scopes
  `sim_sessions` by `user_id`); attempt routes carry 401/ownership tests.

### RLS (skill step 2 — empirical)
- Only `_migrations_applied` has RLS off (above).
- **Zero policies grant the anon role** (`pg_policy` query → `[]`).
- Anon replay (read-only, anon key only):
  - `profiles` → HTTP 200, **0 rows**
  - `journal_entries` → HTTP 200, **0 rows**
  - `sim_sessions` → HTTP 401 `permission denied for function is_admin`
  - `sim_cases` → HTTP 401 `permission denied for function is_admin`
- No P0 breach-in-progress; no `service_role` exposed.

### Headers / config (skill step 4)
`https://bind-lms-platform.vercel.app`:
- `content-security-policy` present (default-src 'self', object-src 'none',
  frame-ancestors 'self', upgrade-insecure-requests)
- `strict-transport-security: max-age=63072000; includeSubDomains; preload`
- `x-frame-options: SAMEORIGIN`, `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy: camera=(), microphone=(), geolocation=()`
- `cache-control: private, no-store` on the protected root

### Dependencies (skill step 5)
- `npm audit`: 3 high remaining after safe fixes — next's bundled `postcss`
  (≤8.5.22), `sharp` (libvips CVEs), `nanoid` — all pre-existing, **not KEV**,
  fix requires a force Next major bump. Deliberately deferred (Next 16.2.12 is
  pinned; see NIGHT_LOG plugin entry).

### Test coverage (skill step 7)
- 392 tests. Privacy regression suite (`src/lib/practice/privacy.test.ts`):
  journal owner-only, sct admin-only, checkins aggregate-only, wall anonymous
  hidden, RLS enabled.
- 12 authz/negative cases across the practice route tests (401/400/invalid).

### Performance (skill step 6) — not audited in depth
Pre-launch, small cohort; no CrUX data. A deep index/query audit has low value
at this scale — revisit post-launch with `pg_stat_statements`.
