# What This Project Needs to Run (Project Setup)

This is a complete checklist of everything required to run and deploy VIBHA.
For each item: **why it's needed**, **where to get it**, **whether it's free**,
and **where it's configured**.

---

## 1. Required software (on your computer)

### Node.js
- **Why:** The "engine" that runs the app. Next.js requires Node.
- **Where:** https://nodejs.org (choose the **LTS** version).
- **Free?** Yes.
- **Configured:** Nothing to configure — it's just installed. **Already present** (v26.5.1).

### npm (comes with Node.js)
- **Why:** Downloads the project's parts (packages) and runs its commands.
- **Where:** Installed automatically with Node.js.
- **Free?** Yes.
- **Configured:** Nothing to configure. **Already present** (v11.17.0).

### Git
- **Why:** Version control — tracks changes and connects to GitHub.
- **Where:** Installed with Xcode Command Line Tools on a Mac (`xcode-select --install`) or from https://git-scm.com.
- **Free?** Yes.
- **Configured:** `user.name` and `user.email` set **locally** to `PLMS` / `kavya@plms.local`. **Already present** (v2.55.0).

---

## 2. Optional software (not required)

| Tool | Why it might be useful | Free? | Status |
| --- | --- | --- | --- |
| **Docker** | Run a full copy of Supabase on your computer | Yes | Installed, but the app (Docker Desktop) isn't open — not needed for development |
| **FFmpeg** | Video/audio processing | Yes | Installed (v8.0) — not used by the app yet |
| **Vercel CLI** | Deploy from the command line | Yes | **Installed** (v58.4.4) and signed in |
| **Supabase CLI** | Manage the database from the command line | Yes | Not installed — optional, the hosted dashboard covers it |
| **GitHub CLI (gh)** | Manage GitHub from the command line | Yes | Not installed — optional, not needed for this workflow |

---

## 3. Required accounts

### GitHub
- **Why:** Stores your code and is what Vercel watches to auto-deploy.
- **Where:** https://github.com — sign up free.
- **Free?** Yes.
- **Configured:** Your repo is `drsarthakpsychology/bind-lms-platform`, and this
  computer can already push to it (git remote `origin` is set).

### Supabase
- **Why:** The online database, authentication, and file storage behind the app.
- **Where:** https://supabase.com — sign up free, create a project.
- **Free?** Yes (free tier covers this app).
- **Configured:** Your project is connected — the app reads it via `.env.local`.

### Vercel
- **Why:** Hosts your site on the internet.
- **Where:** https://vercel.com — sign up free (can use your GitHub account).
- **Free?** Yes (Hobby plan is free for this project).
- **Configured:** **✅ Connected** — project `bind-lms-platform`, GitHub repo linked,
  all three env vars set, CLI installed and signed in. See `DEPLOYMENT_GUIDE.md`.

---

## 4. Required API keys (secrets)

### Supabase keys (3)
All three are found in the **Supabase dashboard → Project Settings → API**.

| Key | What it does | Free? | Where configured |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your project's internet address | Yes | `.env.local` (and Vercel when deploying) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Lets the app talk to the database securely (public) | Yes | `.env.local` (and Vercel) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key that bypasses security for admin tasks — **keep secret** | Yes | `.env.local` (and Vercel) |

Full details for each: see `ENVIRONMENT_VARIABLES.md`.

---

## 5. Environment variables (the config file)

- The app reads secrets from a file called **`.env.local`** in the project root.
- This file is **not** uploaded to GitHub (it's in `.gitignore`).
- A template named **`.env.example`** shows which variables exist — copy it to
  `.env.local` and fill in real values.

**Current status:**
- ✅ `.env.local` exists with your three real Supabase values.
- ✅ Verified working (connection + database + storage all confirmed).

---

## 6. What the project already has (verified)

- ✅ **Framework:** Next.js 16 (App Router, React 19, TypeScript)
- ✅ **Package manager:** npm
- ✅ **Build:** `npm run build` passes (Next.js production build)
- ✅ **Deployment config:** `vercel.json` (region: Mumbai `bom1`) exists
- ✅ **Supabase:** connected, tables + storage buckets verified
- ✅ **Git:** repo initialized, pushed to GitHub, `origin` set
- ✅ **Dev server:** starts and serves the app

---

## 7. What's still needed for a complete setup

- ✅ **Vercel connected** (project created, GitHub linked, env vars set, CLI installed)
- ✅ **Local development works** (dev server + build + lint + typecheck verified)
- ⬜ **Optional:** run the first production deployment (`vercel --prod`) — see `DEPLOYMENT_GUIDE.md`
- ⬜ **Optional:** add automated tests (none exist yet)
