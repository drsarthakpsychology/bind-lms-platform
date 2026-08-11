# Infrastructure Setup — Plain-English Guide

This is written for someone who has **not** done DevOps before. It walks
through every service this project uses, what the free/paid limits are, and
the first sign you've hit a limit.

**Decisions already made for Cohort One (Aug 20, ~30 students):**
- **Hosting: Vercel Pro** ($20/mo) — legal for a paid program (Hobby is not).
- **Video: Cloudflare R2 + self-encoded HLS** — $0 bill, but you encode videos.
- **Database/Auth/Storage: Supabase** (current).
- **Email: Resend** (future). **Errors: Sentry** (future).
- **Deferred:** AI Tutor, PostHog, Zoom API, affiliate engine, seat/billing,
  audit logging, multi-tenant RLS.

---

## 1. Vercel Pro — hosting your site

**What it is:** the company that serves your website to students.
**Status:** you're already on Vercel (free Hobby). You need **Pro** because a
paid training program is *commercial use* — Vercel's Hobby plan is for
non-commercial projects and can be flagged/taken down.

**Setup:**
1. Go to **https://vercel.com** → your project `bind-lms-platform`.
2. **Settings → Plans** → choose **Pro** ($20/month).
3. Billing is month-to-month; you can downgrade after a cohort if you like.

**Free-tier limit / first symptom:** On Hobby, a commercial site can be
suspended with little notice. That's the whole reason to upgrade.

---

## 2. Cloudflare R2 — where lesson videos will live

**What it is:** cheap file storage on Cloudflare. The important part: **you
pay nothing to move video data out** (zero egress), unlike most providers.
For 30 students watching hour-long lectures, this is the $0 option.

**Why we need it (in plain words):** right now videos stream straight from
Supabase Storage as one big file. For a paid course we want them delivered in
small chunks (HLS) so a student can't just download one `.mp4`, and so
playback is smoother. R2 stores those chunks cheaply.

**Setup (do this once):**
1. Create a Cloudflare account at **https://dash.cloudflare.com** (free).
2. In the dashboard, click **R2** → **Create bucket** → name it `plms-videos`.
3. In R2, click **Manage R2 API Tokens** → **Create API Token** → allow
   *read* (Object Read) on `plms-videos`. Copy the **Access Key ID** and
   **Secret Access Key** (the secret is shown once).
4. Your **Account ID** is in the dashboard sidebar (right side).
5. Fill these into `.env.local`:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME=plms-videos`

**Limits / first symptom:** R2's free tier includes 10 GB storage and 1
million class-A operations/month. You'd need a LOT of students to hit that;
the first symptom is billing warnings in your Cloudflare dashboard.

---

## 3. Encode videos to HLS (the one manual task)

**What it is:** turning each lecture video into small chunk files (`ffmpeg`
does this) so the player can stream instead of downloading one big file.

**Why:** your video decision is "self-encoded HLS." You upload a video to R2,
run one command on your computer to convert it, and the player streams the
chunks.

**How (once per video, on your Mac):**
1. Install `ffmpeg` if not present (it already is on this Mac).
2. For a file `lecture.mp4`:
   ```
   ffmpeg -i lecture.mp4 -codec copy -start_number 0 \
     -hls_time 10 -hls_list_size 0 -f hls lecture/index.m3u8
   ```
3. Upload the resulting `index.m3u8` + `.ts` chunks to `plms-videos/<course>/<lesson>/`.

**Live today — use the publish script, not hand-rolled ffmpeg.** The repo ships
`scripts/publish-lecture.ts` which does the whole ladder + upload + media_assets
record in one command:

```
npm run publish-lecture -- ./raw/lecture.mp4 --lesson <lessonId> --encrypt
```

`--encrypt` enables **AES-128** encryption: each rendition references a random
per-video key, the key file is uploaded alongside the segments, and the stream
proxy serves it through an authenticated endpoint — never embedded in the
playlist, never handed to the browser. Skip `--encrypt` for unencrypted HLS.

**Honest note:** encoding is manual per lecture. If it becomes tedious,
Cloudflare Stream (paid) does it automatically — a reasonable upgrade later.

---

## 4. Supabase — database, login, current storage

**What it is:** your database + student logins + file storage.
**Status:** already set up and working. No changes needed for Cohort One.

**Limits / first symptom:** free projects **pause after inactivity** — if no
one visits for ~a week, the first student who logs in may get an error for a
minute while it wakes up. Between cohorts, either visit the site weekly or
upgrade to Pro ($25/mo) once Cohort One is live.

---

## 5. Not needed yet (don't add until code exists)

- **Resend** (sending emails) — for welcome/reminder emails.
- **Sentry** (error monitoring) — genuinely worth wiring up; do this before
  the cohort goes live.
- **Cloudflare Turnstile** (login bot check) — free, adds a "prove you're
  human" on login.
- **Upstash Redis** (rate limiting) — only matters at scale.

---

## 6. Environment variables — where they live

| Variable | Where the value comes from | Used for |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | DB connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key | App ↔ DB |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role (secret) | Admin actions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard sidebar | R2 video delivery |
| `R2_ACCESS_KEY_ID` | R2 → Manage API Tokens | R2 video delivery |
| `R2_SECRET_ACCESS_KEY` | R2 → Manage API Tokens (shown once) | R2 video delivery |
| `R2_BUCKET_NAME` | your R2 bucket (e.g. `plms-videos`) | R2 video delivery |
| `NEXT_PUBLIC_APP_URL` | your deployed origin (e.g. `https://bind-lms-platform.vercel.app`) | same-origin gate on media endpoints |
| `R2_SECRET_ACCESS_KEY` | R2 → Manage API Tokens | R2 (future) |
| `R2_BUCKET_NAME` | the bucket you created | R2 (future) |

**Two places they must go:** (1) `.env.local` for local dev, (2) Vercel →
project → Settings → Environment Variables for the live site. Never put the
`SUPABASE_SERVICE_ROLE_KEY` or `R2_SECRET_ACCESS_KEY` anywhere a browser can
see them.

## 7. Free-tier discipline (v3, 2026-08-10)

The practice layer must run on Supabase Free (500 MB DB, 1 GB file storage,
5 GB egress) and Vercel Hobby (100 GB transfer, 1M invocations, 4 CPU-hours,
60s functions). Exceeding a limit doesn't bill — **it takes the feature or the
app offline until the cycle resets, with one grace period.**

Rules:
- **Postgres is the scarcest resource.** Route everything possible to R2
  (free egress).
- **Embeddings are halfvec(384), never vector(1536).** `src/lib/ai/embed.ts`
  is the only embedding entry point. Matryoshka truncate to 384 + L2-renorm.
- **Full corpus text lives in R2** (`corpus/{hash}.txt`); Postgres stores keys
  + retrieval snippets.
- **Audio submissions + PDF materials migrate to R2** (`npm run
  migrate-submissions-r2`). New uploads write straight to R2.
- **Long jobs are `scripts/`, not Vercel functions.** Corpus ingestion, batch
  embedding, bulk generation.
- **Crons are GitHub Actions** (`.github/workflows/`), hitting
  `/api/internal/cron` with `CRON_SECRET` bearer. Never leave a cron endpoint
  open.
- **Log tables get 30-day retention** (prune-logs cron task).

### Upgrade triggers (upgrade only the one service that trips)

| Trigger | Action |
|---|---|
| Supabase DB > 400 MB, or egress > 4 GB/mo | Supabase Pro $25/mo, or split corpus into a 2nd free project |
| Vercel Active CPU > 3 hrs/mo, or payments start | Vercel Pro $20/mo |
| Free AI tiers 429ing during class hours | add paid credit to OpenRouter ($10 once) |

Expected spend: ~$1/mo R2 + one-time $10 OpenRouter credit.

### /admin/infra

Live headroom dashboard: DB size vs 500 MB, top 10 tables, 7d AI usage,
provider health. Red banner at 70%. A warning strip appears on /admin too.
Fed by `infra_metrics()` RPC (service_role only).


## Scheduled releases + admin tools (A2 / round-6 additions)

- **Scheduled module release**: GitHub Actions cron runs
  `/api/internal/cron?task=release-scheduled` daily, flipping modules whose
  `release_at` has arrived to published. Never Vercel cron.
- **Wall reports**: students flag posts/replies; faculty resolve them at
  `/admin/wall-reports` (wall_reports table, open → resolved).
