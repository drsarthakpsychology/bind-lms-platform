# First tool runs (2026-11-14)

Branch `agent/eco`. Nothing in the app was changed to fix these. They are listed for the owner and the other agents.

## 1. Accessibility (axe-core 4.14, WCAG 2.0, 2.1, 2.2 A and AA)

**How it ran:** the fixture harness (the same one the mobile agents use, copied to the scratchpad and pointed at this worktree) renders the real page components with stubbed data. axe ran on 15 student pages at 390px and 1280px, light theme, plus 5 pages in dark theme. 40 page runs in all.

Pages: home (dashboard), study, module, reader (study section), games, blitz, prep, practice, progress, smart play (quiz), checkpoint, lesson, settings, login, not found.

**Result: no colour contrast, missing label, keyboard or ARIA errors on any page.** Two kinds of problem only:

| Rule | Impact | Where | What it means | Fix |
|---|---|---|---|---|
| `label-content-name-mismatch` (WCAG 2.5.3) | serious | Logo link in `src/components/navigation/top-bar.tsx:78-89`: visible text "VIBHA School of Psychology", but `aria-label="VIBHA home"` | Voice control users say what they see ("click VIBHA School of Psychology") and it does not match. On every signed in page. | Make the label start with the visible text, e.g. `aria-label="VIBHA School of Psychology, home"`, or drop the aria-label. |
| same | serious | Login page logo, `src/components/auth/auth-shell.tsx:36` (phone width) | Same issue, the wordmark text vs "VIBHA home". | Same fix. |
| same | serious | Reader at 390px: the account button `src/components/navigation/account-menu.tsx:63-71` ("Your account" label over initials), and on the lesson page the lesson picker `src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/lesson-picker.tsx:46` | Visible text is not part of the name. | Include the visible text in the label, or use `aria-describedby` for the extra words. |
| `document-title` | serious | All pages | **Harness only.** The harness has no `<title>`. Next.js sets titles on the real site. Ignore. |

Also: the progress page threw React error #482 in the harness (a server component pattern the harness does not support). Not a real bug signal.

Not covered: the public landing page and waitlist (they need a running server). Run `npm run test:a11y` against `next dev` to cover them and the real signed in pages.

## 2. Dead code (knip 6.32.2)

Full list for the cleanup agent: [KNIP_2026_11_14.md](KNIP_2026_11_14.md).

| Kind | Count |
|---|---|
| Unused files | 76 (48 in `src`, 28 scripts and others) |
| Unused exported values | 535 |
| Unused exported types | 148 |
| Unused dependencies | `@hookform/resolvers`, `react-hook-form` (only `src/components/ui/form.tsx` uses them, and that file is unused too) |
| Unused devDependencies | `@tailwindcss/forms`, `@types/adm-zip` (plus `@axe-core/playwright`, a false alarm) |
| Unlisted | `livekit-agent/agent.ts` imports `dotenv`, which is not in package.json |
| Duplicate export | `ADMIN_ITEMS` and `ADMIN_SIDEBAR` in `src/components/navigation/nav-config.ts` |

Notable unused files: `src/components/knowledge/tutor-chat.tsx` (the only caller of `/api/knowledge/ask`), the old landing page set (`src/components/landing/landing-page.tsx`, `kinetic-headline`, `marquee`, `parallax`, `reveal`, `scroll-scale`), 7 shadcn ui files, `src/components/mobile/mobile-mode-switcher.tsx` and `mobile-assessment-flow.tsx` (listed as primitives in `docs/mobile-strategy.md`).

## 3. Secrets (gitleaks 8.30.0)

Scanned the working tree and all 1,003 commits, with secrets redacted in the output.

**Result: no real secrets.** 5 hits, all false alarms:
- `NIGHT_LOG.md` lines 3339 and 3798: drug name text and a model name.
- `NEEDS_KAVYA.md:587` and `docs/CHATTERBOX_AWS_DEPLOY.md:78`: the placeholder `<a-long-secret>`.
- `src/lib/auth/roster.ts:120`: `CREDENTIAL_ALPHABET`, a list of letters, not a key.

## 4. Dependencies (osv-scanner 2.3.0 on package-lock.json, 1,305 packages)

10 packages have known advisories. **None is in code that runs for students on the live site.** All come in through dev tools or the voice agent worker:

| Package | Pulled in by | Worst score | Note |
|---|---|---|---|
| undici 8.10.0 (19 advisories) | jsdom (tests only) | 7.5 | Upgrade jsdom when a fixed version ships. |
| vite 8.2.0, @vitest/mocker, vitest 4.1.10 | vitest (tests only) | 7.5 | Upgrade vitest. |
| brace-expansion 1.1.18, js-yaml 4.3.1 | eslint 9 (dev only) | 7.5 | Upgrade eslint. |
| glob 13.0.6, minimatch 10.2.6 | `@livekit/agents` (voice worker), `@sentry/nextjs` (build time) | 6.9 | Build and worker only. |
| fast-copy 3.0.2 | `@livekit/agents` through pino-pretty | 6.3 | The existing override only covers the `@livekit/rtc-node` path; add one for pino-pretty if the worker matters. |
| smol-toml 1.8.0 | knip (dev only) | 5.3 | Upgrade knip to 6.45. |

## 5. Database (Supabase advisors and pg_stat_statements, read only)

**Security advisors:**
- 4 `SECURITY DEFINER` functions callable by any signed in user through `/rest/v1/rpc`: `app_role()`, `is_admin()`, `is_super_admin()`, `publish_medication_document(p_drug_id, p_reason)`. The first three are normal RLS helpers. `publish_medication_document` was checked: its first line raises "forbidden" unless `app_role()` is admin or reviewer, so a student call fails. Safe as is; revoking `EXECUTE` from `authenticated` would only silence the warning. ([lint 0029](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable))
- Leaked password protection is off. Free to turn on: Supabase dashboard, Authentication, then Passwords. ([docs](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection))
- `vector` and `pg_trgm` are installed in `public`. Low risk; moving them is a careful migration.
- 10 tables have RLS on with no policies (only the service role can use them). This is fine if intended: `_migrations_applied`, `admin_settings`, `contacts`, `device_setup_codes`, `doubt_followups`, `email_campaigns`, `lesson_share_links`, `link_form_submissions`, `link_forms`, `master_login_events`.

**Performance advisors:**
- **123 RLS policies re-run `auth.uid()` for every row** (`auth_rls_initplan`), including `answer_history`, `streaks`, `card_reviews`, `checkins`, `sim_sessions`. The fix is to write `(select auth.uid())` instead of `auth.uid()` in each policy. This is the biggest cheap speed win for student pages as data grows. ([lint 0003](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan))
- 78 cases of more than one permissive policy for the same action (`feature_flags` has 5). Each extra policy is evaluated on every row. Merge them.
- 57 foreign keys with no index, mostly `psych_*` reference tables (small, low priority) and `doubts_legacy`.
- 94 indexes never used. Do not drop yet; the cohort is new and usage is low.
- 1 duplicate index on `notifications`.

**Top queries by total time (pg_stat_statements, since last reset):**

| Query | Calls | Mean |
|---|---|---|
| `SELECT name FROM pg_timezone_names` | 306 | 547 ms |
| A rate limit RPC (`p_key, p_limit, p_window_ms`) | 13,586 | 6.3 ms |
| Insert into `page_visits` (two shapes) | 21,708 | 3.4 to 6.4 ms |
| Upsert into `progress` (video watch time) | 78,303 | 0.7 ms |
| `standing_totals()` RPC | 613 | 76 ms |
| `infra_metrics()` RPC | 1,731 | 22 ms |

Notes: `pg_timezone_names` and the type lookup query are PostgREST and dashboard internals, not app code. `standing_totals()` at 76 ms each is the slowest app call; it is worth a look with `index_advisor` or a cached table. The `progress` upsert runs very often (78k calls); check how often the video player saves.

## 6. AI usage log (read only)

`ai_usage_log` has **no rows since September 2026**. The last rows (1 September) show every provider failing over (Groq, SambaNova, OpenRouter, OpenCode) and the request ending on the scripted fixture. `provider_health` shows Groq's last success on 15 August and OpenCode, OpenRouter and SambaNova with no success ever. Details and fixes: [../research/AI_RELIABILITY_2026_11.md](../research/AI_RELIABILITY_2026_11.md).
