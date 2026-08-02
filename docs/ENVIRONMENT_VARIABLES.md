# Environment Variables

Environment variables are secret settings the app reads when it starts. They
live in a file called **`.env.local`** in the project root. This file is
**ignored by Git** — secrets are never uploaded to GitHub.

The placeholder template is in **`.env.example`**.

---

## The variables

### 1. `NEXT_PUBLIC_SUPABASE_URL`

| | |
| --- | --- |
| **What it is** | The internet address of your Supabase project |
| **Why it exists** | The app needs to know where its database lives |
| **Required?** | **Yes** — without it nothing connects to the database |
| **Where to get it** | Supabase dashboard → **Project Settings → API** → "Project URL" |
| **Example format** | `https://hojhzwvuccojqkvkkslw.supabase.co` |
| **Where used** | `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/proxy.ts` |

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

| | |
| --- | --- |
| **What it is** | The public key that lets the app talk to Supabase (called "anon" or "publishable" in the dashboard) |
| **Why it exists** | Every database request must prove it's from the app; this key identifies the app. It is **safe** to show in the browser because the database's security rules (RLS) still protect the data |
| **Required?** | **Yes** |
| **Where to get it** | Supabase dashboard → **Project Settings → API** → "anon public" (or "publishable") key |
| **Example format** | `sb_publishable_...` **or** `eyJhbGciOiJIUzI1NiIs...` (a long JWT) |
| **Where used** | Same as #1 (client, server, proxy) |

### 3. `SUPABASE_SERVICE_ROLE_KEY`

| | |
| --- | --- |
| **What it is** | The **secret** admin key that can do anything in your database |
| **Why it exists** | Used only by admin operations (creating student accounts, admin reviews) that must bypass the normal user-level security |
| **Required?** | **Yes** for admin features |
| **Where to get it** | Supabase dashboard → **Project Settings → API** → "service_role secret" (may ask you to reveal/re-enter your password) |
| **Example format** | `sb_secret_...` **or** `eyJhbGciOiJIUzI1NiIs...` (a long JWT) |
| **⚠️ Important** | This key **bypasses all security**. Never put it in a file that reaches the browser, never prefix it with `NEXT_PUBLIC_`, never paste it into GitHub issues or chat. It goes only in `.env.local` and Vercel's secret settings |
| **Where used** | `src/lib/supabase/server.ts` (`createAdminClient`) |

### 4. Cloudflare R2 — video delivery

| | |
| --- | --- |
| **What they are** | Credentials for the R2 bucket that stores lesson HLS |
| **Why they exist** | R2 is the video delivery backend (segmented + optionally AES-128 encrypted HLS) |
| **Required?** | **Yes** once a lesson has a `media_assets` row with `provider = 'r2'` |
| **Where to get them** | Cloudflare dashboard → R2 → Manage R2 API Tokens |

| Variable | Format | Used for |
| --- | --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | hex string (dashboard sidebar) | R2 S3 endpoint |
| `R2_ACCESS_KEY_ID` | long hex | R2 auth |
| `R2_SECRET_ACCESS_KEY` | long hex, shown once | R2 auth (secret) |
| `R2_BUCKET_NAME` | e.g. `plms-videos` | object bucket |
| `R2_BACKUP_BUCKET` | e.g. `plms-backups` | nightly DB dumps |

### 5. `NEXT_PUBLIC_APP_URL`

| | |
| --- | --- |
| **What it is** | The canonical origin of the deployed app (scheme + host, no trailing slash) |
| **Why it exists** | The same-origin gate on the media-token endpoints. Only requests whose `Origin`/`Referer` matches this are accepted |
| **Required?** | **Yes** for media playback to work |
| **Where to get it** | Your production domain, e.g. `https://bind-lms-platform.vercel.app` |

---

## Where each environment variable must be configured

| Location | Which variables |
| --- | --- |
| **`.env.local`** (local development) | All (Supabase + R2 + `NEXT_PUBLIC_APP_URL`) |
| **Vercel → Project → Settings → Environment Variables** (when deploying) | All |
| **Supabase dashboard** | Not configured there — you *copy from* there |

---

## The public vs. secret rule (easy version)

- Starts with `NEXT_PUBLIC_` → it's public, safe anywhere.
- Does **not** start with `NEXT_PUBLIC_` → it's a secret, **server-only**.

The service-role key and the R2 secret are the secrets in this project. Treat
them like passwords.

---

## Checklist to verify yours are set

- [ ] `.env.local` exists in the project root
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is your project URL (real value, not `your-project-ref`)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is a real key (long string)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is a real key (long string)
- [ ] `CLOUDFLARE_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET_NAME` are set
- [ ] `NEXT_PUBLIC_APP_URL` is your deployed origin
- [ ] You have **not** committed `.env.local` (it's gitignored — check with `git status`)
- [ ] When deploying, you've added them to Vercel too

---

*Secrets are handled in this repo so that this document describes the variables
without exposing their values.*
