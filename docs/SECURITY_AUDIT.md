# Security audit — 2026-08-14 (auditing-app-security skill)

Method: static reading + empirical replay (anon-key REST, read-only). Scope:
access control, secrets, misconfiguration, dependencies, test coverage. No
production changes made — the one DB fix is staged in
`src/migrations_pending/` pending Kavya's approval (infra safety rule).

## STRIX AI pentest (2026-08-14, added after the manual audit)

Ran `strix --target ./src -m quick -n` (DeepSeek `deepseek-chat`,
DOCKER_HOST set, headless) with instructions focused on authn/authz (IDOR/
BOLA), secrets, injection. **Result: 0 exploitable vulnerabilities**
(cost $0.0265; report dir `strix_runs/src_cd7e`, gitignored; re-run with
`DOCKER_HOST=unix://$HOME/.docker/run/docker.sock ~/.strix/bin/strix ...`).

STRIX's top observation: `createAdminClient()` (service role, bypasses RLS)
is used in 62 files, several student-facing (sim/session, sim/turn, sim/rewind,
sim/debrief, mse/osce/sct/formulation attempt, competency, library/note,
wall/pin, journal/share, roleplay/session) — making app-level ownership checks
load-bearing. **Follow-up validation (completed, mitigates the finding):** every
flagged student route enforces ownership in code. Verified directly:
- `sim/turn` route.ts:52-56 — reads session, `session.user_id !== user.id → 404`.
- `sim/rewind` route.ts:41-45 — `parent.user_id !== user.id → 404`.
- All attempt routes insert with `user_id: user.id` from `getUser()`.
- `journal`/`wall` use the regular (RLS-enforcing) client; RLS owner-only +
  `*_visible` views for anonymous wall content (privacy regression tests cover).
- Combined with the manual audit (zero anon-granting policies, anon replay
  returns 0 rows / denied), the service-role blast radius is contained.

STRIX also confirmed: no committed .env/secrets; injection surface minimal
(2 `.rpc()` call sites, zod-validated). Model-quality note: DeepSeek chat is
not STRIX's recommended frontier model — re-run with a recommended model
(e.g. openai/gpt-5.4 or anthropic/claude-opus-5) for a deeper pass if desired.

## Live-site STRIX scan (2026-08-14, `https://vibhapsychology.com`, standard)

MEDIUM 1 · INFO 1 · cost $0.93 · report `strix_runs/vibhapsychology-com_4e69`.

### vuln-0001 — Stored XSS via unsanitized /enquire input (MEDIUM, CWE-79)
STRIX showed an `<img onerror=...>` payload is stored verbatim (returns
`{"ok":true}`). **Triage: not exploitable as submitted** — the honeypot IS
enforced server-side (`if (parsed.data.honeypot) return { ok: true }`, a bot
trap that stores nothing), an IP rate limit exists (5/h), and the admin render
path escapes via React text interpolation (no `dangerouslySetInnerHTML`).
**Fix applied (defense-in-depth):** write-time `stripMarkup` in
`src/app/enquire/actions.ts` (removes tag-like sequences before insert) +
`src/lib/sanitize.test.ts` (3 regression tests). Any future raw-HTML render or
export path can no longer execute a stored payload.

### vuln-0002 — Login CAPTCHA / rate limiting (INFO, CWE-307)
STRIX saw no Turnstile widget and no throttling. **Triage: rate limiting exists**
(`rateLimit("login:<email>", 10)`, verified in `src/lib/auth/actions.ts`); the
Turnstile widget + server verification are fully coded but dormant because
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` are unset. Needs the
two keys configured in Vercel (NEEDS_KAVYA) — not a code change.

### Sitemap hygiene (part of vuln-0001's report)
Live `sitemap.xml` served `bind-lms-platform.vercel.app` URLs. Code fallback in
`src/app/sitemap.ts` fixed to `https://vibhapsychology.com`; production
`NEXT_PUBLIC_APP_URL` should be set to the custom domain (NEEDS_KAVYA).

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
