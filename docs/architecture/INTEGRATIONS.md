# Third-party integrations

Every outside service the code talks to, what for, and which environment variables it needs. "Set in production" was checked in the Vercel project on 2026-11-14 (names only).

| Service | Used for | Code | Env vars | Set in production |
|---|---|---|---|---|
| **Vercel** | Hosting, builds, crons, Web Analytics, Speed Insights | `vercel.json`, `next.config.ts`, `src/app/layout.tsx` | `VERCEL_ENV`, `VERCEL_DEPLOYMENT_ID`, `VERCEL_GIT_COMMIT_SHA` (set by Vercel) | Automatic |
| **Supabase** | Login, Postgres, row level security, Storage | `src/lib/supabase/*`, `src/proxy.ts` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Yes |
| **Cloudflare R2** | Lecture video, credential files, voice cache, backups | `src/lib/media/r2.ts`, `src/lib/achievements/storage.ts`, `src/lib/voice/synthesize.ts`, `scripts/publish-lecture.ts`, `.github/workflows/backup.yml` | `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, optional `R2_PUBLIC_URL` | Yes (production only). `R2_PUBLIC_URL` no |
| **Resend** | All email out (setup links, campaigns, nudges, doubt follow-ups, certificates, standing notes), delivery webhook, inbound replies | `sendResendEmail` in `src/lib/auth/roster.ts`, `src/lib/nudge/send.ts`, `src/lib/notify/*`, `src/app/api/emails/resend/route.ts` | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`, `RESEND_WEBHOOK_SECRET`, `RESEND_DAILY_LIMIT` (default 100) | Yes, except `RESEND_DAILY_LIMIT` |
| **AI: Groq** | Primary lane for chat, JSON, simulated patient, Whisper speech to text | `src/lib/ai/router.ts`, `src/lib/sim/llm-gateway.ts`, `src/lib/voice/stt.ts` | `GROQ_API_KEY` | Yes |
| **AI: SambaNova, OpenRouter, OpenCode** | Fallback lanes (no-train) | `src/lib/ai/router.ts` | `SAMBANOVA_API_KEY`, `OPENROUTER_API_KEY`, `OPENCODE_API_KEY` | Yes |
| **AI: Gemini, Cerebras, OmniRoute, DeepSeek, Anthropic** | More lanes. Gemini and DeepSeek may train on data, so the guard keeps them off student data | `src/lib/ai/router.ts`, `src/lib/ai/guards.ts` | `GEMINI_API_KEY`, `CEREBRAS_API_KEY`, `OMNIROUTE_URL`, `OMNIROUTE_API_KEY`, `DEEPSEEK_API_KEY`, `ANTHROPIC_API_KEY` | No |
| AI switches | Turn AI off (fixtures), debug, student privacy tier | `src/lib/ai/client.ts`, `guards.ts` | `AI_ENABLED`, `AI_DEBUG`, `AI_FIXTURE_FALLBACK`, `AI_STUDENT_TIER` | `AI_ENABLED` only |
| **NVIDIA NIM** | CosyVoice text to speech, Whisper fallback | `src/lib/voice/*` | `NVIDIA_API_KEY` | No |
| **Other text to speech** (MiMo, Kokoro, Qwen, Chatterbox, ElevenLabs) | Voice tiers for the simulated patient | `src/lib/voice/synthesize.ts` | `MIMO_TTS_URL`, `MIMO_TTS_API_KEY`, `KOKORO_API_URL`, `QWEN_TTS_URL`, `QWEN_TTS_API_KEY`, `CHATTERBOX_TTS_URL`, `CHATTERBOX_TTS_API_KEY`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` | No |
| **Deepgram** | Speech to text, tried first when set | `src/app/api/practice/voice/stt/route.ts` | `DEEPGRAM_API_KEY` | No |
| **LiveKit** | Realtime voice room for the Consulting Room | `src/lib/livekit/token.ts`, `src/app/api/livekit/token/route.ts`, `livekit-agent/` (separate worker, `npm run livekit:worker`) | `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | No (feature off) |
| **Sentry** | Error reports | `sentry.*.config.ts`, `src/instrumentation*.ts`, `next.config.ts` | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, build: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | No: inactive |
| **PostHog** | Product analytics, loaded lazily | `src/lib/analytics.ts` | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | No: inactive. The CSP `connect-src` does not list a PostHog host, so it would also need a CSP change |
| **Cloudflare Turnstile** | Bot check on login | `src/lib/auth/actions.ts`, login page | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | No: inactive |
| **GitHub Actions** | CI, nightly backup, backup check, uptime, cron calls | `.github/workflows/*` | GitHub secrets: `SUPABASE_DB_URL`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BACKUP_BUCKET`, `RESEND_API_KEY`, `ALERT_EMAIL`, `SITE_URL`, `APP_URL`, `CRON_SECRET`, `E2E_*` | Not visible to this audit |
| **WHO ICD-11 API, PubMed Central, Gutenberg, openFDA** | One-off content scripts only, never at runtime | `scripts/corpus/*`, `scripts/psychopharm/*` | `ICD_CLIENT_ID`, `ICD_CLIENT_SECRET` | Not needed |

Not used by the code although once planned: Cloudflare Stream (only listed in the CSP), Zoom, payments.

## Free tier limits that matter

| Service | Plan seen | Limit to watch |
|---|---|---|
| Supabase | Free (organisation plan, checked) | 500 MB database (210 MB used), 1 GB storage, 5 GB egress a month, 60 direct connections, no backups or point-in-time recovery, pauses after a week with no activity |
| Resend | Assumed free (code default `RESEND_DAILY_LIMIT` 100) | 100 emails a day, 3,000 a month on the free plan. Bulk sends are paced to the daily limit |
| Groq | Free key | Requests per minute and per day per model. The router fails over on 429 |
| Vercel | Not visible to this audit | Bandwidth and function duration (video), cron count and frequency on Hobby |

See `docs/SCALABILITY_30_TO_300.md` for what happens at 300 students.
