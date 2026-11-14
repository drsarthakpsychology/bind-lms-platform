# Environment variables

Every variable the code reads, checked by searching `src`, `scripts`, `livekit-agent`, `next.config.ts`, `sentry.*.config.ts` and `.github/workflows` on 2026-11-14. "Set in" was read from the Vercel project (names only, never values).

- Local work: copy `.env.example` to `.env.local` and fill in values. `.env.local` and `.env` are git-ignored.
- Vercel: Project, Settings, Environment Variables. **Production** = `main` (vibhapsychology.com). **Preview** = other branches; some variables are set only for the `admin-redesign` branch.
- `NEXT_PUBLIC_*` values are built into the browser bundle. Never put a secret in one.

Legend: **Req** = the app or a core feature breaks without it. **Opt** = a feature is off or falls back without it.

## Core

| Name | Req | Set in | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Req | Production, Preview (admin-redesign and general) | Supabase project address |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Req | Production, Preview | Public Supabase key. Row level security protects the data |
| `SUPABASE_SERVICE_ROLE_KEY` | Req | Production, Preview (admin-redesign only) | Server-only key that skips row level security. Admin writes, flags, rate limits |
| `NEXT_PUBLIC_APP_URL` | Req | Production, Preview | Public address for links in emails and the same-origin check. A blank or localhost value falls back to `https://vibhapsychology.com` (`src/lib/app-url.ts`) |
| `NEXT_PUBLIC_SITE_URL` | Opt | Not set | Base URL printed on certificates and credential QR codes. Falls back to `NEXT_PUBLIC_APP_URL` |
| `SESSION_SECRET` | Req | Production, Preview | Signs video stream tokens and derives video keys. Video fails closed without it. Make it with `openssl rand -base64 32` |
| `CRON_SECRET` | Req for crons | **Not set** | Bearer token every cron endpoint checks. Must equal the GitHub secret of the same name. Missing today, so all cron endpoints answer 401 |
| `GAMES_SECRET` | Opt (should be set) | Not set | Signs game tokens. Falls back to the service-role key, then to a fixed dev string (`src/lib/games/token.ts`) |

## Video and files (Cloudflare R2)

| Name | Req | Set in | Purpose |
|---|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Req | Production only | R2 endpoint account |
| `R2_ACCESS_KEY_ID` | Req | Production only | R2 key id |
| `R2_SECRET_ACCESS_KEY` | Req | Production only | R2 secret |
| `R2_BUCKET_NAME` | Req | Production only | Bucket for lectures, credentials, signatures, voice cache (`plms-videos`) |
| `R2_PUBLIC_URL` | Opt | Not set | Public base URL, used only for cached voice files |
| `NEXT_PUBLIC_MEDIA_PROVIDER` | Opt | Not set | Old switch (`supabase` or `r2`) for `getMediaProvider()`. Playback ignores it and reads the location from the database |

## Email (Resend)

| Name | Req | Set in | Purpose |
|---|---|---|---|
| `RESEND_API_KEY` | Req for email | Production, Preview | Sending. Without it, sends report "email-not-configured" |
| `RESEND_FROM_EMAIL` | Req for email | Production | From address |
| `RESEND_REPLY_TO` | Opt | Production, Preview | Reply-to address |
| `RESEND_WEBHOOK_SECRET` | Req for mail tracking | Production, Preview | Checks the Svix signature on `/api/emails/resend` |
| `RESEND_DAILY_LIMIT` | Opt | Not set (default 100) | Daily cap used to pace bulk sends |
| `ALLOWED_TEST_RECIPIENT` | Opt | Preview | Comma list. Preview deployments email only these addresses |
| `REMINDERS_SESSION_TOMORROW`, `REMINDERS_ASSIGNMENT_DUE_48H`, `REMINDERS_INACTIVE_7D` | Opt | Not set | Turn reminder types off with `0` or `false` (`src/lib/reminders.ts`). Reminders are not sent yet |

## AI (all optional)

| Name | Set in | Purpose |
|---|---|---|
| `AI_ENABLED` | Production, Preview, Development | `false` uses fixed fixture answers everywhere |
| `AI_DEBUG` | Not set | `true` logs every AI call |
| `AI_FIXTURE_FALLBACK` | Not set | `true` uses fixtures when no provider works (dev only) |
| `AI_STUDENT_TIER` | Not set (default `no_train_only`) | `any` lets student data reach providers that train. Dev only |
| `GROQ_API_KEY` | Production, Preview, Development | Main AI lane and Whisper |
| `SAMBANOVA_API_KEY`, `OPENROUTER_API_KEY`, `OPENCODE_API_KEY` | Production | Fallback lanes |
| `GEMINI_API_KEY`, `CEREBRAS_API_KEY`, `DEEPSEEK_API_KEY`, `ANTHROPIC_API_KEY` | Not set | More lanes |
| `OMNIROUTE_URL`, `OMNIROUTE_API_KEY` | Not set | OmniRoute gateway (default `http://localhost:20128/v1`) |

## Voice (all optional, all not set in production)

| Name | Purpose |
|---|---|
| `NVIDIA_API_KEY` | CosyVoice text to speech, Whisper fallback |
| `DEEPGRAM_API_KEY` | Speech to text, tried first |
| `MIMO_TTS_URL`, `MIMO_TTS_API_KEY` | MiMo text to speech |
| `KOKORO_API_URL` | Self-hosted Kokoro text to speech |
| `QWEN_TTS_URL`, `QWEN_TTS_API_KEY` | Qwen text to speech |
| `CHATTERBOX_TTS_URL`, `CHATTERBOX_TTS_API_KEY` | Chatterbox text to speech |
| `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` | Paid, last resort |
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | Realtime voice room |
| `LIVEKIT_TTS_MODEL`, `LIVEKIT_TTS_VOICE`, `LIVEKIT_STT_MODEL` | Only for the separate `livekit-agent` worker |

## Monitoring, analytics, bot check (all optional, none set)

| Name | Purpose |
|---|---|
| `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | Turn Sentry on (server and browser) |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Build-time source map upload |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Turn PostHog on |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Bot check on login |

## Other app switches

| Name | Set in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_PSYCH_MODE` | **Not set** | `production` shows only published medicine pages. Unset means test mode: students also see draft and in-review content with an "awaiting review" badge (`src/lib/psychopharm/mode.ts`) |
| `DUEL_MIN` | Tests only | Minimum duel library size in a test |

## Set by Vercel or Node (do not set by hand)

`NODE_ENV`, `NEXT_RUNTIME`, `VERCEL_ENV`, `VERCEL_DEPLOYMENT_ID`, `VERCEL_GIT_COMMIT_SHA`, `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`, `NEXT_DEPLOYMENT_ID` (set when Skew Protection is on).

## Scripts only (in `.env.local`, never in Vercel)

| Name | Used by |
|---|---|
| `SUPABASE_DB_PASSWORD` | `scripts/apply-pending.ts`, `scripts/apply-migrations.ts` |
| `SUPABASE_DB_URL` | `scripts/restore.ts`, `scripts/verify-backup.ts`, backup workflows |
| `R2_ACCOUNT_ID`, `R2_BACKUP_BUCKET` | Backup scripts and workflows |
| `R2_NEW_ACCESS_KEY_ID`, `R2_NEW_SECRET_ACCESS_KEY` | `scripts/rotate-r2.ts` |
| `SITE_URL`, `APP_URL` | Uptime and cron workflows |
| `ICD_CLIENT_ID`, `ICD_CLIENT_SECRET`, `PMC_CASE_LIMIT`, `ACQUIRE_DROP_FOLDER` | Corpus fetch scripts |
| `SIM_ENV_FILE`, `SIM_EVAL_LIVE` | Simulation evaluation scripts |
| `E2E_BASE_URL`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, `E2E_STUDENT_EMAIL`, `E2E_STUDENT_PASSWORD`, `E2E_LESSON_URL`, `E2E_ASSIGNMENT_URL` | Playwright e2e tests |

## In Vercel but not read by the code

`R2_DIRECT_STREAMING`, `DEMO_SUPPRESS_EMAIL`, `DEMO_ACHIEVEMENTS_USER_ID` (production). Nothing in the repo reads them. Safe to delete after the owner confirms no other project uses them.

## GitHub Actions secrets

`SUPABASE_DB_URL`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BACKUP_BUCKET`, `RESEND_API_KEY`, `ALERT_EMAIL`, `SITE_URL`, `APP_URL`, `CRON_SECRET`, `E2E_*`. Set in GitHub, Settings, Secrets and variables, Actions.

## To fix (owner)

1. Add `CRON_SECRET` to Vercel production, same value as the GitHub secret. Then redeploy.
2. Add `GAMES_SECRET` (random 32 bytes) to Vercel production.
3. Decide on `NEXT_PUBLIC_PSYCH_MODE=production` once the medicine pages are reviewed.
4. Add the R2 variables to the `admin-redesign` preview if the test link must play video.
