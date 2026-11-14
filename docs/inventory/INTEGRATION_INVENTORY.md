> **SUPERSEDED on 2026-11-14.** Use docs/architecture/INTEGRATIONS.md instead. This file is kept for history and may be out of date. Index of current docs: docs/README.md.

# Integration Inventory
> Verified against `main` @ `b2a9698`. Env var **names** only; values are never recorded.

| Service | Purpose | Env vars (names) | Code | Status |
|---|---|---|---|---|
| Supabase | DB, Auth, Storage, RLS | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` | `lib/supabase/*` | required |
| Cloudflare R2 | HLS video, materials, submissions | `R2_ACCOUNT_ID`/`CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `NEXT_PUBLIC_MEDIA_PROVIDER` | `lib/media/r2.ts` | required for video |
| Vercel | hosting, analytics, speed insights | `VERCEL_GIT_COMMIT_SHA` | `vercel.json` | required |
| Resend | email + webhook | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`, `RESEND_WEBHOOK_SECRET`, `RESEND_DAILY_LIMIT` | `lib/auth/roster.ts`, `api/emails/resend` | key presence UNVERIFIED |
| Sentry | errors | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG/PROJECT/AUTH_TOKEN` | `sentry.*.config.ts` | optional |
| PostHog | product analytics | `NEXT_PUBLIC_POSTHOG_KEY/HOST` | `posthog-js` | optional |
| Cloudflare Turnstile | login bot check | `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `auth/actions.ts` | optional |
| LLM providers | AI features | `GROQ_API_KEY`, `CEREBRAS_API_KEY`, `NVIDIA_API_KEY`, `OMNIROUTE_URL`, (+ others read via router: Gemini, SambaNova, OpenRouter, OpenCode, DeepSeek, Anthropic) | `lib/ai/router.ts` | which are set UNVERIFIED |
| Speech | STT/TTS | `DEEPGRAM_API_KEY`, `ELEVENLABS_*`, `CHATTERBOX_TTS_*`, `QWEN_TTS_*`, `MIMO_TTS_*`, `KOKORO_API_URL` | `lib/voice/*` | optional |
| LiveKit | realtime voice | `LIVEKIT_URL` (+ key/secret) | `api/livekit/token`, `livekit-agent` | optional |
| ICD-11 / PMC / FDA / Gutenberg | corpus ingestion | `ICD_CLIENT_ID/SECRET`, `PMC_CASE_LIMIT` | `scripts/corpus`, `scripts/psychopharm` | offline scripts |
| GitHub Actions | CI, cron, backups | secrets: `APP_URL`, `CRON_SECRET`, E2E_*, backup secrets (names UNVERIFIED) | `.github/workflows` | |
| Internal secrets | `SESSION_SECRET` (stream tokens), `CRON_SECRET`, `AI_ENABLED`, `AI_STUDENT_TIER` | | | required |
