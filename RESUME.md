# RESUME — session state (2026-08-11, overnight completion run)

## Where I am

- **Branch:** `feat/v5-depth`
- **Last commit:** `d5c37be docs: queue complete — all buildable items done (v5 + addendum)` (20 commits this session, 6b4ee8d → d5c37be)
- **Build state:** ✅ GREEN — `npm run lint` (0 errors, 3 pre-existing warnings), `npx tsc --noEmit` clean, `npm run test` **244 passed**, `npm run build` compiles in ~7s. Verified at 22:46 local after the final voice commit.
- **Uncommitted on disk right now:** MORNING_REPORT.md, NEEDS_KAVYA.md (rewritten this turn), NIGHT_LOG.md (stale from earlier + modified), AUDIT.md (new, untracked — the Phase 3 gap report).

## What I was doing when this stopped

The queue is EMPTY — every buildable item is done and committed. I was writing the Phase 5 artifacts (NEEDS_KAVYA.md single-sitting checklist, MORNING_REPORT.md, then NIGHT_LOG.md entry + BUGS.md update + IDEAS_NEXT.md + final commit of the docs).

**Next edit was:** NIGHT_LOG.md — append the session entry (20 commits list + decisions) with the final commit hash; then commit the docs batch.

## Landmines

1. **QUEUE.md is empty of unchecked items** — the Stop hook that "refuses to let the session end" has nothing to block on now. A fresh session should generate NEW work from BUGS.md, IDEAS_NEXT.md, and the brief's §11 (content volume, coverage, polish) — or it will appear "finished".
2. **`feature_flags`, `infra_metrics`, `infra_snapshots`, `rubric_dimensions`, `calibration_pairs`, `wall_reactions`, and the wall anonymity views exist in the LIVE DB** but until this session only some were in repo migrations. Now: `practice_layer_infra.sql` covers infra; **feature_flags + rubric_dimensions + calibration_pairs + wall views still only exist live** — they must be added to a migration if a fresh Supabase project is ever created. (Prioritised low: single-project reality.)
3. **Data-policy guard is ON and strict**: with no no-train provider key, `guardStudentCall` throws for `sim_patient_turn` / `debrief_scoring` / `journal_support` when `AI_ENABLED=true`. With `AI_ENABLED=false` (current .env.local), everything runs on fixtures — demoable. Do NOT set `AI_ENABLED=true` without a no-train key (ANTHROPIC_API_KEY) or the Consulting Room 503s by design.
4. **`AI_FIXTURE_FALLBACK`** can paper over that (fixtures when no provider) but is dev-only; don't ship it as the prod answer.
5. **MCP Supabase 502s intermittently** (Cloudflare overload) — retry after ~60s; the `pg` direct connection also ECONNRESETs from this machine (migrations went through MCP instead).
6. **Lessons table uses `video_status` not `is_published`** — the draft-cards script checks `video_status === "ready"`.
7. **wall_posts/wall_replies base tables hide anonymous rows from students** (policy `is_admin() or is_anonymous=false`); students read the `*_visible` views (author_id nulled for anonymous). Any new wall query MUST use the views.
8. **`moves.ts` fallback lines power never-silent + pregen-voice (74 lines)** — a pristine 24-move library is the voice-cache contract.
9. **The 9 no-disorder cases are enumerated by id** in the debrief route (`NO_DISORDER_IDS`) + title hints — adding a 10th no-disorder case must update both lists.
10. **`today` page + `/practice` recommendation** read sim_scores/sim_sessions via the student client — works, but a brand-new student sees the fallback recommendation (Decode). Fine by design.
11. **queue→resume harness:** if a fresh session reads NIGHT_LOG's last entry + first unchecked QUEUE.md item, there is no unchecked item — point it at IDEAS_NEXT.md / brief §11.

## Migrations

`src/migrations_pending/` (all additive; the live DB has them applied):
- practice_layer_sim.sql (+ **rubric_dimensions, calibration_pairs** appended this session)
- practice_layer_rest.sql (+ **wall_reactions table, wall_posts_visible, wall_replies_visible views** appended)
- practice_layer_infra.sql (**NEW this session** — infra_metrics RPC, infra_snapshots, size caps)
- practice_layer_idioms, _modules, _dictation, _habit, _tools, _pair (pre-existing)

**Applied to live DB this session (idempotently re-verified):** rubric_dimensions (8 rows), calibration_pairs, wall_reactions, wall_posts_visible, wall_replies_visible, infra migration. **NOT yet in any migration (live-only):** `feature_flags` table + its 17 rows, `sim_sessions.state/seed/parent_session_id/is_branch` columns (in practice_layer_pair.sql? — NO: pair.sql has sim_branches but the session columns were applied live; pair.sql's block covers sim_turns.state + sim_branches + parent_session_id + is_branch — verify before relying on a fresh project).

Wait — checked earlier: `practice_layer_pair.sql` DOES contain the A1 block adding `seed`, `state`, `parent_session_id`, `is_branch` to sim_sessions. So live-only table remaining: **feature_flags** (+ its seed rows). Actions: write `practice_layer_flags.sql` from the live definition when time permits.

## Env

From `.env.local` + `.env.example`:
- **Set:** NEXT_PUBLIC_SUPABASE_URL/ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET, NEXT_PUBLIC_APP_URL (localhost), SUPABASE_DB_PASSWORD, CLOUDFLARE_ACCOUNT_ID, R2_* (older values), GEMINI_API_KEY? (check — .env.example documents; local has "R…" truncated values of unknown meaning)
- **Missing (all optional but unlock real AI):** NVIDIA_API_KEY, GROQ_API_KEY, CEREBRAS_API_KEY, OPENROUTER_API_KEY, ANTHROPIC_API_KEY, KOKORO_API_URL, ICD_CLIENT_ID/SECRET, CRON_SECRET, APP_URL, TURNSTILE_*, SENTRY_*
- **AI_ENABLED** — the fixture switch. When false (current), everything runs on deterministic fixtures. **Do not flip true without ANTHROPIC_API_KEY (or another trainsOnData===false provider).**
- `AI_STUDENT_TIER` and `R2_PUBLIC_URL` are documented in .env.example but **never read in code** (audit finding — either wire them or drop them).

## The full session summary (what got built)

A1 determinism test + comparison strip · A3 kappa dashboard + provisional hiding + 20 self-play seeds · MSE 6→10 distinctions + 20 small-things · Out-of-Depth 10→30 · Ethics 6→30 · OSCE 3→12 · Landmark 8→19 · Weak-spots drill generation · Quizzes wired (decode+ethics) · Journal sharing · Wall reactions+replies+anonymity views · Practice page redesign (icons/verbs/reason-gate) · server-side flag gates + not-available page · Modules student view · A8: 3 new no-disorder cases (9 total) + restraint praise · draft-cards-from-lessons pipeline (7 cards live) · Forge stage 4 own-transcript · infa reproducible migrations · 4 corpus fetchers · Voice: affect→voice live mapping + CosyVoice/Kokoro chain + Whisper STT + pregen (fixtures demoable, keys pending)