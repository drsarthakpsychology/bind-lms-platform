# System Architecture (diagrams)
> Verified against `main` @ `b2a9698`. Each diagram cites the code it was drawn from.

## 1. Overall system
```mermaid
flowchart TB
  subgraph Client
    B["Browser: React 19 client components + hls.js"]
  end
  subgraph Vercel["Vercel (bom1)"]
    PX["src/proxy.ts"]
    RSC["Server Components / Server Actions"]
    RH["Route handlers /api/*"]
  end
  subgraph Supabase
    AU["Auth"]
    PG[("Postgres + RLS")]
    ST["Storage buckets: videos, materials, submissions"]
  end
  R2[("Cloudflare R2: HLS ladder, materials, submissions")]
  MAIL["Resend"]
  LLM["LLM providers via src/lib/ai/router.ts"]
  VOICE["LiveKit + TTS/STT providers"]
  GHA["GitHub Actions"]
  B --> PX --> RSC
  B --> RH
  RSC & RH --> AU & PG
  RSC & RH --> R2
  RSC --> MAIL
  MAIL -. webhook (Svix-signed) .-> RH
  RH --> LLM & VOICE
  GHA -->|"cron / backup / uptime"| RH
```
Sources: `src/proxy.ts`, `src/lib/supabase/server.ts`, `src/lib/media/*`, `src/lib/ai/router.ts`, `.github/workflows/*`.

## 2. Request lifecycle for an authenticated page
```mermaid
sequenceDiagram
  participant Br as Browser
  participant Px as proxy.ts
  participant Ly as (dashboard)/layout.tsx
  participant Se as getSession() (cached per request)
  participant Db as Supabase
  Br->>Px: GET /practice/x (cookies)
  Px->>Db: refresh Supabase auth cookie, set x-pathname header
  Px-->>Br: redirect /login if no auth user
  Px->>Ly: continue
  Ly->>Se: getSession()
  Se->>Db: auth.getUser(), profiles row
  Se-->>Ly: ok | blocked | expired | session_replaced | unauthenticated
  Ly->>Db: scope + access_blocks + cohort memberships
  Ly-->>Br: render page, or redirect (/paused, /expired, /dashboard?off=1)
```
Sources: `src/proxy.ts`, `src/lib/auth/session.ts`, `src/app/(dashboard)/layout.tsx`, `src/lib/access/*`.

## 3. Deployment/CI flow
```mermaid
flowchart LR
  Dev["Push / PR to main"] --> CI["GitHub CI: tsc, eslint, vitest, next build, Playwright if E2E secrets"]
  Dev --> Vercel["Vercel build + preview/prod deploy"]
  Cron["GitHub cron"] --> C["api/internal/cron?task=..."]
```
Sources: `.github/workflows/ci.yml`, `vercel.json`. The Vercel↔GitHub integration itself is configured outside the repo (`UNVERIFIED`).

Further diagrams: auth → [AUTHENTICATION](../modules/AUTHENTICATION.md) · enrolment → [ENROLLMENT_FLOW](../workflows/ENROLLMENT_FLOW.md) · video → [VIDEO_SYSTEM](../modules/VIDEO_SYSTEM.md), [VIDEO_PROCESSING](../workflows/VIDEO_PROCESSING.md) · quizzes → [ASSESSMENT_FLOW](../workflows/ASSESSMENT_FLOW.md) · certificates → [CERTIFICATE_FLOW](../workflows/CERTIFICATE_FLOW.md) · notifications → [NOTIFICATIONS](../modules/NOTIFICATIONS.md) · data model → [DATABASE_ARCHITECTURE](DATABASE_ARCHITECTURE.md) · student/admin lifecycle → [STUDENT_LIFECYCLE](../workflows/STUDENT_LIFECYCLE.md).
