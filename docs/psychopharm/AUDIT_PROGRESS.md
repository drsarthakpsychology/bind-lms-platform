# Security / Performance Audit — Progress Tracker

Last updated: 2026-08-03

Status legend: ⬜ not started · 🔄 in progress · ✅ done · ⛔ blocked

## Skill build
- ✅ SKILL.md (140 lines) + 7 reference files + 4 scripts created
- ✅ Scripts made executable

## Audit checklist (risk-ordered, from the skill)

- ✅ 1. Scope & inventory — Next 16.2.12 (CVE-2025-29927 N/A), React 19.2.4, Supabase 2.111, 13 API routes, 24 psych tables, proxy.ts = middleware
- ✅ 2. Access control — BOLA-safe (media/submissions ownership verified); **BFLA: editor can publish** (policy `*`); app_roles empty
- ✅ 3. Secrets scan — only public anon/turnstile keys; service_role server-only
- ✅ 4. Config — strong headers; x-powered-by exposed; no s-maxage on auth routes
- ✅ 5. Dependencies — 3 high (sharp<0.35 libvips, postcss≤8.5.22), transitive via Next
- ✅ 6. Performance — pg_stat_statements on, no seq scans, indexes present; KB file-read per call (fine at 152)
- ✅ 7. Test coverage — 18 psych tests pass; **NO RLS/cross-role regression tests** (gap)
- ✅ 8. Report written → docs/psychopharm/SECURITY_AUDIT_REPORT.md

## Findings log (appended as found)
| # | Severity | Area | Finding | Evidence | Remediation | Effort | Regression test |
|---|---|---|---|---|---|---|---|
| 1 | MED | RLS (KMS roles) | `med_docs_write_editor_reviewer_admin` policy is `polcmd='*'` — an `editor` can set status='published'. Publish should be reviewer/admin-only (BFLA). | policy `polcmd='*'` for admin/reviewer/editor; publish route sets `reviewer=user.id` which satisfies the published CHECK. | Split into UPDATE-vs-status policies: allow editor UPDATE on content, but only reviewer/admin may flip status→published (add a status-guard to the policy or a SECURITY DEFINER publish fn). | S | cross-role test: editor publish must 403 |
| 2 | MED | RLS (KMS roles) | `app_roles` table is empty — the reviewer/editor roles are inert. Effective roles are only profiles.admin / profiles.student. The role model advertises more than it grants. | `SELECT role,count(*) FROM app_roles` → 0 rows; profiles → admin(1), student(1). | Seed app_roles for the reviewer/editor accounts; or document that only admin/student exist. | S | assert app_roles has expected assignments |
| 3 | LOW | RLS (anon) | `psych_sources` is anon-readable (HTTP 200, rows returned). Benign — exposes only title/type citation metadata, local_path is null. By design. | anon replay: `psych_sources` → 200, rows=3; fields shown title,type,local_path(null). | None needed (by-design reference metadata). | — | — |
| 4 | INFO | Access control | All public tables have RLS + ≥1 policy; media routes use requireSession + canAccessMaterial + same-origin + rate-limit; submissions route enforces ownership (BOLA-safe). Strong posture. | `pg_tables NOT rowsecurity` → 0 rows; media/submission routes verified. | None. | — | — |
| 5 | LOW | Secrets | `SUPABASE_SERVICE_ROLE_KEY` is reused as the stream-token / session secret in `lib/media/crypto.ts` + `stream-token.ts` (fallback to SESSION_SECRET). Using the role-bypass master key as a generic signing secret is over-broad. | crypto.ts:30 `process.env.SESSION_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY`. | Set a dedicated `SESSION_SECRET` (random, 32B) and drop the service_role fallback; rotate the stream tokens after. | S | — |
| 6 | INFO | Secrets | No secrets committed; `.env*.local` in .gitignore. Anon key + turnstile site key are client-safe (meant to be public). service_role only in server files (`import "server-only"` where it matters). | `.env.local` untracked; gitignore covers; no `"use client"` file references service_role. | None. | — | — |
| 7 | INFO | Config | Production security headers are strong: full CSP, HSTS (preload), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, CORP. No `ACAO: *`. Configured in `next.config.js async headers()`. | check-headers.sh vs prod. | None. | — | — |
| 8 | LOW | Config | `x-powered-by: Next.js` exposed — `poweredByHeader: false` not set in next.config. Minor fingerprint leak. | prod header `x-powered-by: Next.js`. | Set `poweredByHeader: false`. | S | assert header absent |
| 9 | INFO | Config | No `s-maxage`/ISR on personalized/auth routes — no SvelteSpill-class caching risk. Only `revalidatePath` on admin mutations (safe). Root + login redirect serve `private, no-cache, no-store`. | grep for s-maxage/revalidate/force-dynamic → only revalidatePath in admin actions. | None. | — | — |
| 10 | MED | Deps | `sharp 0.34.5` (transitive via Next 16.2.12) vulnerable to libvips CVEs (CVE-2026-33327/8/90/91, high). Not directly imported by src (build/edge-image only) → lower real-world exploitability. | `npm audit --omit=dev` → 3 high; sharp 0.34.5; no `import sharp` in src. | Pin `sharp >=0.35.0` via npm `overrides`; do NOT `npm audit fix --force` (downgrades Next to 9.3.3, breaking). | M | CI dependency gate |
| 11 | LOW | Deps | `postcss 8.4.31` (bundled by Next) has sourceMappingURL path-traversal advisory (GHSA-r28c-9q8g-f849). Build-time only, low runtime reachability. | `postcss@8.4.31` in next deps. | Pin patched postcss via overrides; watch for a Next 16.x patch bump. | S | — |
