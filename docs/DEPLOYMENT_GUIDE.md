# Deploying VIBHA School of Psychology to the Internet (Vercel)

This guide explains how the project gets published on the internet. It's
written for non-developers, so every step is explained.

---

## 1. How deployment works (the big picture)

Your project lives on GitHub (a code-storage website). Vercel (a hosting
company) watches your GitHub project, and every time you update the code,
Vercel builds it and puts the finished website on the internet at a
`*.vercel.app` address.

```
You write code → GitHub (saved) → Vercel (builds + hosts) → Internet
```

Vercel is **free** for projects like this.

---

## 2. Is Vercel connected already?

**✅ Yes.** This project is now fully connected to Vercel:

- **Account:** `drsarthakpsychology`
- **Vercel project:** `bind-lms-platform` (under team `drsarthakpsychologys-projects`)
- **GitHub repo:** `drsarthakpsychology/bind-lms-platform` — connected, so Vercel
  auto-deploys on every push to `main`
- **Framework:** detected as Next.js automatically
- **Environment variables:** all three Supabase secrets added (encrypted)
- **Vercel CLI:** installed (v58.4.4) and signed in
- **Build:** verified — `vercel build` completes successfully

Your production URL will be **https://bind-lms-platform.vercel.app** once the
first deployment runs.

---

## 3. Your everyday workflow (nothing to do)

Since GitHub and Vercel are connected, **you never deploy manually.** When you
(or I) push code to the `main` branch:

```bash
git push
```

Vercel automatically builds and publishes the new version. That's it.

---

## 4. The one-time setup (already done — for reference)

If you ever need to reconnect from scratch, this is what was done:

1. Sign up at **https://vercel.com** (free, can use GitHub).
2. Run `vercel login` in the project folder (opens your browser to approve).
3. Run `vercel link` to connect this folder to the Vercel project.
4. Add the three environment variables to the project:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   ```
5. Connect the GitHub repo in the Vercel dashboard (Project → Settings → Git)
   so pushes auto-deploy.

---

## 5. Deploying from the command line (preview)

While developing, you can create a **preview deployment** (a private test URL,
not the live site):

```bash
vercel
```

Vercel builds and gives you a unique URL like
`bind-lms-platform-abc123.vercel.app` that you can share and test before going
live.

---

## 6. Deploying to production

- **Normal way (recommended):** push to `main` on GitHub — Vercel publishes to
  production automatically.
- **Command line:** `vercel --prod`.

The production URL is **https://bind-lms-platform.vercel.app**.

---

## 7. Preview deployments (try before you publish)

With the GitHub connection, **every pull request gets its own preview URL**
automatically:

1. Make a new branch and push it.
2. Open a **pull request** on GitHub.
3. Vercel posts a preview link in the pull request's comments — a private test
   copy of your site.
4. When you merge the pull request to `main`, Vercel publishes to production.

---

## 8. Rollback (undo a bad deploy)

If a deployed version turns out broken:

1. Go to your project on **vercel.com**.
2. Click **Deployments** (or **Activity**).
3. Find the last version that worked.
4. Click the **⋮** (three dots) menu → **"Promote to Production"** (or
   **"Redeploy"**).

Vercel instantly puts the old working version back online.

---

## 9. Where the environment variables live on Vercel

Vercel stores the three secrets separately from your code (so they're never in
the repo). To view/edit them:

- **Dashboard:** vercel.com → project `bind-lms-platform` → **Settings →
  Environment Variables**
- **CLI:** `vercel env ls production`

To update a secret: `vercel env rm NAME production` then re-add it, or edit in
the dashboard. After changing env vars, **redeploy** (push again or `vercel
--prod`).

---

## 10. The deployment checklist I'll follow

Before every deployment, I will run, in order:

1. `npm run lint` — code quality
2. `npx tsc --noEmit` — type errors
3. `npm run build` — production build (catches most issues)
4. Verify the app runs locally
5. Show you a summary and ask: **"Everything is ready. Would you like me to
   deploy this version?"**

I will **never** deploy without your explicit "Yes."

---

## 11. Troubleshooting a failed deploy

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Build fails | A code error | Check the build log on vercel.com → Deployments → the failed deploy |
| Site loads but data errors | Env vars missing/wrong | Re-add the three Supabase vars in Vercel Settings → Environment Variables, then redeploy |
| 500 errors | Supabase not reachable | Verify `.env.local` values on Supabase dashboard → Settings → API |
| "not found" page | Wrong URL | Use the exact production URL from your Deployments list |
