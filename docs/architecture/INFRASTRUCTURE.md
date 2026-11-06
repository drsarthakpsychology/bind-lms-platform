# Infrastructure & Deployment
> Verified against `main` @ `b2a9698`. Dashboard-side settings (Vercel, Supabase, Cloudflare, Resend, DNS) are **not in the repo → UNVERIFIED**.

```mermaid
flowchart LR
  GH["GitHub repo drsarthakpsychology/bind-lms-platform"] -->|"PR + CI"| CI["GitHub Actions ci.yml"]
  GH -->|"integration"| VER["Vercel: previews per branch, prod from main, region bom1"]
  VER --> SB[("Supabase project")]
  VER --> R2[("Cloudflare R2 bucket")]
  VER --> RESEND["Resend"]
  subgraph Scheduled GitHub Actions
    A1["backup.yml 03:17 UTC"] --> SB
    A2["verify-backup.yml Sun 04:17"] --> SB
    A3["db-keepalive.yml Mon 03:22"] -->|"task=keepalive"| VER
    A4["infra-check.yml 00:12"] -->|"task=infra-snapshot"| VER
    A5["reminders.yml 16:37"] -->|"send-reminders, release-scheduled"| VER
    A6["alumni-transition.yml 05:07"] -->|"task=alumni-transition"| VER
    A7["uptime.yml 4x/day"] --> VER
  end
```
| Item | Detail (source) |
|---|---|
| Hosting | Vercel, `regions: ["bom1"]` (`vercel.json`) |
| Build | `next build`; `outputFileTracingIncludes` ships `docs/psychopharm`, `content/policies`, `scripts/corpus/normalised` (`next.config.ts`) |
| CI | tsc, eslint, vitest, build; Playwright only if `E2E_BASE_URL` secret set (`ci.yml`) |
| Cron tasks | `keepalive, prune-logs, infra-snapshot, alumni-transition, release-scheduled, send-reminders` (`api/internal/cron/route.ts`). `prune-logs` has no workflow in `.github/workflows` → `UNVERIFIED` whether invoked elsewhere |
| Backups | nightly + weekly verification (`backup.yml`, `verify-backup.yml`, `scripts/restore.ts`, `docs/RESTORE_RUNBOOK.md`) — required GitHub secrets are `UNVERIFIED` |
| Media | R2 HLS ladder, AES-128; CORS via `scripts/set-r2-cors.ts`; key rotation `docs/R2_KEY_ROTATION.md` |
| Voice | LiveKit worker (`livekit-agent/`) deployed separately (`UNVERIFIED` where); Chatterbox TTS on AWS/Azure (`docs/CHATTERBOX_*_DEPLOY.md`) |
| Env vars | ~70 names referenced in code (see `docs/ENVIRONMENT_VARIABLES.md` for the maintained list; **values never documented**) |
