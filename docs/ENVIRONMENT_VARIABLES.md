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

---

## Where each environment variable must be configured

| Location | Which variables |
| --- | --- |
| **`.env.local`** (local development) | All three |
| **Vercel → Project → Settings → Environment Variables** (when deploying) | All three |
| **Supabase dashboard** | Not configured there — you *copy from* there |

---

## The public vs. secret rule (easy version)

- Starts with `NEXT_PUBLIC_` → it's public, safe anywhere.
- Does **not** start with `NEXT_PUBLIC_` → it's a secret, **server-only**.

The service role key is the only secret in this project. Treat it like a
password.

---

## Checklist to verify yours are set

- [ ] `.env.local` exists in the project root
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is your project URL (real value, not `your-project-ref`)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is a real key (long string)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is a real key (long string)
- [ ] You have **not** committed `.env.local` (it's gitignored — check with `git status`)
- [ ] When deploying, you've added all three to Vercel too

---

*Secrets are handled in this repo so that this document describes the variables
without exposing their values.*
