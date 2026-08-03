# Security & Performance Audit Report — psychopharm

Generated 2026-08-04 by the `auditing-app-security` skill.
Scope: the psychopharmacology tool + its Supabase backend (Next 16.2.12,
Supabase 2.111, Vercel). Every finding verified against the live DB and the
deployed production site.

---

## Prioritized findings

| # | Sev | CWE | Finding | Effort |
|---|---|---|---|---|
| F1 | **High** | CWE-863 | An `editor` can publish a medication document (BFLA) | S |
| F2 | **Med** | CWE-269 | `app_roles` reviewer/editor roles are inert (empty table) | S |
| F3 | **Med** | CWE-1104 | `sharp <0.35` libvips CVEs (transitive via Next) | M |
| F4 | **Low** | CWE-200 | `x-powered-by: Next.js` exposed | S |
| F5 | **Low** | CWE-798 | service_role key reused as stream-token secret | S |
| F6 | **Low** | CWE-1035 | postcss ≤8.5.22 path-traversal advisory (build-time) | S |
| G1 | **Gap** | — | No RLS / cross-role regression tests in CI | M |

---

## F1 — Editor can publish (BFLA) — HIGH

- **CVSS v4:** AV:N/AC:L/AT:P/PR:L/UI:N/VC:H/VI:H/VA:N/SC:L/SI:L — 7.1
- **Affected:** `medication_documents` policy `med_docs_write_editor_reviewer_admin`
- **Weakness:** The write policy is `polcmd='*'` for admin/reviewer/editor. A
  single policy covers UPDATE, so an `editor` may set `status='published'`. The
  publish route then sets `reviewer = user.id`, satisfying the
  `medication_documents_published_requires_reviewer` CHECK. Publishing is
  supposed to be reviewer/admin-only.
- **Evidence:** `pg_get_expr(polwithcheck)` returns
  `app_role() = ANY ('admin','reviewer','editor')` for the `*` policy; the
  publish endpoint (`document/publish/route.ts`) sets `reviewer: user.id`.
- **Reproduction:** grant a user `editor` via `app_roles`; call
  `POST /api/psychopharm/document/publish` → succeeds because RLS allows it.
- **Impact:** An editor (content role) can make changes student-visible without
  reviewer sign-off.
- **Remediation:** Split the write policy: allow editors UPDATE on `document`
  content only; restrict flipping `status`→`published` to reviewer/admin. A
  `SECURITY DEFINER` publish function that checks `app_role() IN ('admin',
  'reviewer')` is the cleanest.
- **Regression test:** cross-role test — `editor` publish returns 403.

## F2 — `app_roles` reviewer/editor inert — MEDIUM

- **Affected:** `app_roles` table
- **Weakness:** The table is empty, so `app_role()` falls back to
  `profiles.role` (admin/student only). The KMS advertises reviewer/editor but
  no account can hold them.
- **Evidence:** `SELECT role,count(*) FROM app_roles` → 0 rows; `profiles` →
  admin(1), student(1).
- **Remediation:** Seed `app_roles` for the intended reviewer/editor accounts,
  or document that only admin exists.
- **Effort:** S.

## F3 — sharp <0.35 libvips CVEs — MEDIUM (low real-world reach)

- **CVEs:** CVE-2026-33327/8, CVE-2026-35590/91 (high, libvips)
- **Affected:** `node_modules/sharp` 0.34.5 (transitive via Next 16.2.12)
- **Note:** no `src` file imports `sharp`; it is build/edge-image processing
  only, so exploitability in this app is low.
- **Remediation:** `npm overrides: { "sharp": ">=0.35.0" }`. Do NOT run
  `npm audit fix --force` — it downgrades Next to 9.3.3 (breaking).
- **Effort:** M.

## F4 — x-powered-by exposed — LOW

- **Affected:** all responses (next.config)
- **Remediation:** `poweredByHeader: false`.
- **Effort:** S.

## F5 — service_role reused as stream secret — LOW

- **Affected:** `lib/media/crypto.ts:30`, `lib/media/stream-token.ts:25`
- **Weakness:** `SUPABASE_SERVICE_ROLE_KEY` (role-bypass master key) is the
  fallback HMAC secret for stream tokens. If a stream token leaks it is derived
  from the master key.
- **Remediation:** set a dedicated random `SESSION_SECRET` and drop the
  service_role fallback; rotate stream tokens after.
- **Effort:** S.

## F6 — postcss sourceMappingURL advisory — LOW

- **Advisory:** GHSA-r28c-9q8g-f849 (path traversal via source maps)
- **Note:** build-time only, low runtime reach.
- **Remediation:** pin patched postcss via overrides; await Next 16.x patch.
- **Effort:** S.

---

## Verified strong (no action)

- **All public tables have RLS + ≥1 policy.** `pg_tables NOT rowsecurity` → 0 rows.
- **BOLA-safe:** media/material routes use same-origin → session →
  `canAccessMaterial` (enrolled + published) → rate-limit. Submission file route
  checks ownership (`submission.user_id !== profile.id && role !== 'admin'`).
- **Anon-key replay** against psych tables → HTTP 200 rows=0 (gated) or 401;
  `psych_sources` returns only citation metadata (by design).
- **Security headers** on prod: CSP, HSTS (preload), X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, CORP.
- **No s-maxage/ISR** on personalized routes (no cache-deception class).
- **Performance:** `pg_stat_statements` enabled, no sequential scans, indexes on
  RLS columns, batch queries (no N+1). KB file-read per call is fine at 152 drugs.
- **Tests:** 18 psych tests pass.

---

## Gaps

- **No RLS / cross-role regression tests** in CI. The skill's own guidance: add
  pgTAP + cross-role (SupaShield) tests; make an RLS-disabled public table a
  merge blocker. This is the single highest-leverage testing gap for this stack.
