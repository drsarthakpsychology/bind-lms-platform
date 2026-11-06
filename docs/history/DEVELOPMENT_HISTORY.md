# Development History
> Everything here is **HISTORICAL context**. The current system is described by [MASTER_ARCHITECTURE](../MASTER_ARCHITECTURE.md); where history and code disagree, code wins. Nothing below should be used as a reason to restore an older design.

## Source and limits
- Git: `main` @ `b2a9698` exposes **77 reachable commits** (1 dated 2026-08-27, 76 dated 2026-11-01…03). Work before that is not visible in this checkout's history (squash/rewrite or shallow import — cause UNVERIFIED); earlier context comes from in-repo notes (`docs/*`, `NIGHT_LOG.md`, `BRIEF_V5_MASTER.md`, `AUDIT.md`, `docs/SECURITY_AUDIT.md` 2026-08-14, `docs/DEAD_CODE.md` 2026-08-14).
- The long working conversation that produced Nov 2026 features is summarised, not reproduced; items are limited to what is also visible in code or git.

## Timeline
| When | Change | Evidence |
|---|---|---|
| ≤ Aug 2026 | Original build: Next.js + Supabase LMS; roster import (no public signup), R2 HLS video with stream proxy, Practice layer (sim, MSE, OSCE, SCT, formulation…), psychopharm KMS, three-state feature flags, rights registry | `docs/SYSTEM_MAP.md`, migrations |
| 2026-08-14 | Security audit + STRIX pentests; write-time markup stripping; knip dead-code pass | `docs/SECURITY_AUDIT.md`, `docs/DEAD_CODE.md` |
| 2026-08-27 | PR #34 "night: rights, roster, video" merged | git |
| 2026-11-01 | Homepage "Cohort Two" student-first redesign | git |
| 2026-11-02 | PR #36 platform redesign: student Home + Lectures, admin in 5 sections, new shell; "Learn with Chai" gamified lessons; medicines Student/Clinician view | git |
| 2026-11-03 | PRs #37–#39: cohorts, quick add by email, first-login details, levels/hours board, better lecture player, learn & free tools | git, `docs/COHORTS.md` |
| 2026-11-03 | PRs #41–#43: nav fix; "vibha-lms-transformation" integration (Lab, Casebook, Revise, Games, Doubts, access manager, Journey, Rankings, support key, flat Practice list, all students set to Full access via migration); learning insights + CSV | git |
| 2026-11-03 | PR #42 cohort separation: recordings belong to the cohort chosen at upload; students see only their own cohort(s); cross-add by hand | git |
| 2026-11-03 | PR #44 mail: message one cohort without notifying others; PR #45 Quiz leaderboard lists the whole cohort | git |

## Fixes of note (Nov 2026)
Valid mobile numbers rejected at login/details → normaliser rewritten and unknown numbers saved; `localhost` links in emails → `appUrl()/cleanAppUrl()` default to the live domain; hidden test/robot accounts removed from people lists, leaderboards and counts; mail "Clear failed" added; AI-calibration/Lumen test items removed from user-facing lists.

## Features discussed but not built (see FEATURE_INVENTORY class G)
Payments/checkout; auto certificate on completion; leaderboard penalty/negative scores; WhatsApp/SMS notifications (number is collected only); server sync of Notes highlights; real daily-digest email.
