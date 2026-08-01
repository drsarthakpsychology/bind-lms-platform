# Deployment Checklist

Run in order before any production deployment.

## 1. Static gates
- [ ] `npm run lint` exits 0
- [ ] `npx tsc --noEmit` exits 0
- [ ] `npm run build` exits 0 (production build compiles)

## 2. Functional verification
- [ ] Dev server starts (`npm run dev`)
- [ ] `/login` renders, `/` redirects to `/login`
- [ ] Authenticated `/dashboard` renders (no RSC errors)
- [ ] Authenticated `/admin` renders admin nav
- [ ] Course listing, lesson page, assignment panel render

## 3. Security verification
- [ ] Security headers present (CSP, X-Frame-Options, nosniff, Referrer-Policy)
- [ ] `.env.local` gitignored, service key not in bundle
- [ ] Admin actions gate on `requireAdmin()`
- [ ] Supabase pending migrations applied (multi-select types + RLS)

## 4. Data/storage
- [ ] Supabase connection verified
- [ ] Core tables respond (profiles, courses, lessons, progress, assignments, submissions)
- [ ] Storage buckets present (videos, submissions)

## 5. Docs
- [ ] `/docs` suite current (QA, ARCHITECTURE, CHANGELOG, etc.)
- [ ] README reflects current state

## 6. Deploy
- [ ] Commit message documents the change
- [ ] Push to GitHub → Vercel auto-deploys to production
- [ ] Post-deploy: smoke-test production URL (`bind-lms-platform.vercel.app`)
