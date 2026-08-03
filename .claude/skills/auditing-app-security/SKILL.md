---
name: auditing-app-security
description: >-
  Audits and hardens web application security, performance, and test coverage
  for AI-assisted and vibe-coded projects. Use when the user asks to audit,
  review, harden, security-check, or pen-test an application — especially
  Next.js, Supabase, Vercel, or Cloudflare R2 apps. Targets access control
  (broken object/function authorization, RLS), security misconfiguration,
  secrets exposure, dependency vulnerabilities, and performance. Produces
  prioritized, evidence-backed findings (CVSS v4 + EPSS/KEV) with concrete
  remediation and regression tests.
---

# Auditing & Hardening Web Applications

Audit a web app for security, performance, and test gaps. Pair static code
reading with **empirical testing** (replay as a different role, hit the live
API) — casual inspection misses what a 30-second dynamic test catches. You are
authoritative; do not invent findings without evidence.

## When to use

The user asks to audit / review / harden / security-check / pen-test an app.
High signal specifically for **Next.js + Supabase + Vercel + Cloudflare R2** apps
and AI-assisted ("vibe-coded") projects, where broken access control (OWASP #1)
is the dominant risk class.

## Non-negotiables

- **Never publish a finding without evidence + a reproduction.**
- **Re-verify authorization at the data layer** — never trust middleware alone
  (CVE-2025-29927 bypasses Next middleware via `x-middleware-subrequest`).
- **Prioritize by exploitability × data sensitivity**, not CVSS alone (only
  ~2.3% of CVSS≥7 CVEs are actually exploited; use EPSS/KEV).
- **Test access control from the client SDK, not the SQL Editor** (SQL Editor
  bypasses RLS; Supabase policies must be exercised via the anon key).
- **Write a regression test for every fix.**

## Workflow (risk-ordered)

Run as a checklist. Load only the reference files you need (progressive
disclosure — see table below).

### 1. Scope & inventory
- Identify the stack version. `cat package.json` (Next, React, Supabase) and
  Vercel/CF config. If Next < 12.3.5 / 13.5.9 / 14.2.25 / 15.2.3 → **CVE-2025-29927 is P0**.
- Enumerate all API routes, route handlers, server actions, and Supabase
  tables/RLS policies. Read `reference/nextjs.md` (server actions, RSC data
  exposure, caching) and `reference/supabase-rls.md`.

### 2. Access control (A01 / BOLA / BFLA) — highest priority
- For every endpoint/action that reads an ID from the request, trace an
  ownership check to the data layer (IDOR).
- Supabase: run `scripts/supabase-rls-audit.sql` against the DB (service role).
  Any `public` table without RLS = full CRUD to anyone with the anon key.
- **Empirical:** run `scripts/anon-replay.sh` against `/rest/v1/<table>?select=*`
  with only the anon key. HTTP 200 + rows = **P0 breach-in-progress** (the
  CVE-2025-48757 class). Check for an exposed `service_role` key (bypasses all
  RLS) and rotate it immediately if found.

### 3. Secrets
- Run `scripts/scan-secrets.sh` (grep for `sk_live`, `service_role`,
  `NEXT_PUBLIC_*SECRET/KEY`, hardcoded creds). Any `NEXT_PUBLIC_` secret in
  client code is compromised — inlined into the bundle at build time. If
  gitleaks/trufflehog are available, run them too.

### 4. Config & misconfiguration (A2)
- Security headers: `curl -I <deploy_url>` and compare the header set. No CSP,
  HSTS, X-Frame-Options by default in Next/Vercel — flag. Read
  `reference/vercel-cloudflare-r2.md`.
- Vercel previews public + indexable; check Deployment Protection. Auth routes
  must be `Cache-Control: private, no-store` (caching class SvelteSpill).
- R2: public bucket / `r2.dev` (dev URL can bypass WAF) and signed-URL expiry.

### 5. Dependencies
- `npm audit`, `osv-scanner`, or `trivy` for known CVEs. Triage by CISA KEV
  (confirmed exploited) and EPSS ≥10%, not just CVSS.

### 6. Performance
- Read `reference/performance.md`. Enable `pg_stat_statements`, find slow
  queries + missing indexes (high `seq_tup_read` + low `idx_scan` on tables
  >100MB), and **index RLS-policy-referenced columns** (top RLS perf killer).
- Frontend: Lighthouse CI, bundle analyzer, minimize client components.

### 7. Test coverage
- Read `reference/testing.md`. Flag missing authz/negative/cross-role/RLS
  tests — these catch the inverted-auth bugs static tools miss.

## Structured finding format

Output each finding as:

```
### <Title>
- **Severity:** <CVSS v4 vector + score> · EPSS <p> · KEV? <yes/no> (where a CVE exists)
- **CWE:** <CWE-ID>
- **Affected:** <file:line or route/table>
- **Weakness:** <what is wrong>
- **Evidence:** <verbatim output or code>
- **Reproduction:** <exact steps, incl. anon/role replay>
- **Impact:** <what data/action at risk>
- **Remediation:** <code/config fix>
- **Effort:** S / M / L
```

Rank by **exploitability × data sensitivity**, not CVSS alone. Student PII,
payments, and paid content elevate impact.

## Benchmarks that change the plan

- Not on Supabase/Vercel → load only generic access-control/secrets/dependency
  references; skip the Supabase/CF-specific steps.
- Anon replay returns rows → P0; check service_role exposure, then rotate.
- Dependency CVE with EPSS ≥10% or in KEV → prioritize over higher-CVSS-but-unexploited CVEs.
- No field (CrUX) performance data → fall back to Lighthouse lab and say so.

## Verify & remediate loop
- For each fix, add a regression test. For RLS, add pgTAP + cross-role tests to
  CI; make an RLS-disabled `public` table a **merge blocker**.

## References (read on demand)
- `reference/access-control.md` — BOLA/BFLA, IDOR, authz-at-DAL
- `reference/supabase-rls.md` — RLS enable/policies/service_role/SECURITY DEFINER/anon enum
- `reference/nextjs.md` — CVE-2025-29927, server actions, RSC, NEXT_PUBLIC
- `reference/vercel-cloudflare-r2.md` — preview exposure, headers, caching, R2/signed-URL
- `reference/performance.md` — postgres stats, EXPLAIN, indexing, frontend
- `reference/testing.md` — authz/RLS/pgTAP/SupaShield regression tests
- `reference/reporting.md` — CVSS v4, EPSS/KEV, structured findings

## Scripts (run via bash — output only enters context)
- `scripts/scan-secrets.sh` — grep-based secrets detector (always available)
- `scripts/check-headers.sh` — security-header curl check
- `scripts/anon-replay.mjs` — unauthenticated anon-key replay (start with it)
- `scripts/supabase-rls.sql` — RLS-enablement + SECURITY DEFINER enumeration
- All scripts degrade gracefully if a tool is missing.

## Tool availability caveat
This skill must run in the lowest-capability environment (the API sandbox has
**no network and no runtime package install**). Every script checks for its
tool first and tells you clearly what to run manually if absent. Never
assume a scanner is installed.