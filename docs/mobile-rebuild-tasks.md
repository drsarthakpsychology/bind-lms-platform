# Mobile Rebuild & Simulation Overhaul — Task List

Generated from the 90-task brief (v1.0). Effort: S = <1h, M = half-day, L = day+.
Markers: `[added by CC]` = missing from brief; `[disputed by CC]` = likely wrong.

**Already started (committed `900ecef`):** mobile primitives (`src/components/mobile/`:
MobilePage, MobileSection, MobileCard, MobileListItem, MobileHeader,
MobileBottomSheet, StatusPill), sim components (`src/components/sim/`: ChatMessage,
SimulationHeader, ChatComposer), session-view v1 full-screen rebuild, shell
full-bleed + tab-bar hiding on the session route. These land Phases 1.16 + 3.x
(partial). **Not yet done: the brief's Phase 0 correctness fixes, which must ship first.**

---

## PHASE 0 — Correctness (all ship-blocking; do before any styling)

- [x] **0.1** Quiz options not shuffled — correct answer always first. P0. `[S?M]`
  - Find quiz render path (grep for option mapping); determine if shuffle exists + when it runs.
  - Seeded deterministic shuffle (mulberry32/xorshift32, `hash(attempt_id + question_id)`), Fisher–Yates.
  - Persist `presented_order` per attempt-question; debrief renders from stored order.
  - Write `scripts/audit-item-bank.ts` → `docs/item-bank-audit.md` (correct-idx distribution, length-vs-distractor, <3 options, near-dupes). Do NOT fix content (Dr. Dave's call).
  - Files: quiz renderer (unknown — locate), `src/lib/quiz/`, `scripts/audit-item-bank.ts`.
- [x] **0.2** "Order steps" renders as multiple choice. P0. `[S?M]`
  - Inspect item schema + renderer type-switch. Report which case (data is MCQ vs data is ordering).
  - If ordering data: build tap-to-sequence (no drag-drop); full-width 48px rows; a11y.
  - Files: quiz renderer + item types.
- [x] **0.3** Internal schema values render to students (`order steps` pill). P1. `[S]`
  - Recommend Option B (remove pill — instruction text already says it). Sweep for other snake_case/SCREAMING in JSX text.
- [x] **0.4** "Week 1" renders twice, overlapping. P0. `[M]`
  - Find week accordion header; badge gets number only, heading gets full label + status; badge `min-w` not fixed `w`.
  - Files: course detail week/lesson component (locate).
- [x] **0.5** "NEXT" badge overflows. P1. `[S]`
  - Keep number in badge; signal "next" via existing tint + "Start here". Files: lesson row.
- [x] **0.6** Course material fails to load (code-side) (`Curriculum_Overview_Light`). P0. `[M]`
  - Investigate R2 object / signed-URL TTL / CORS / content-type / HLS manifest; report actual cause.
  - Human-readable title (strip `_Light` suffix); correlation ID per failure (logged server-side, shown as `Reference: 7K2M9`); loading vs error distinct; centre error card; optional "Download instead".
  - Files: material viewer + media routes.
- [ ] **0.7** Audit fixed-size containers w/ variable content (w-8/w-10/size- on dynamic children). P1. `[M]`
  - Grep fixed dims on dynamic content; convert `w-*`→`min-w-*` + `px-*`, add `min-w-0` on truncating flex siblings.
- [ ] **0.8** Establish whether AI provider is connected in prod. P0. `[S/M]`
  - **Finding so far (code wins):** the "Offline mode" banner is a STATIC `fixtureMode` prop (passed from the page), not real-time provider health. AI router has Groq configured + verified live; `AI_ENABLED` gates the fixture fallback. Confirm prod env + whether a live provider is selected; report blocker.
  - Files: `src/lib/ai/router.ts`, `sim/session page.tsx`, Vercel env.
- [ ] **0.9** Sweep silent failures (video per week, debrief, journal save, wall post for second user, anonymous payload identity, report/flag, progress). `[M]`
  - **Priority verify:** anonymous wall post must strip author id from the CLIENT PAYLOAD, not just DOM (check network response, not rendered output).

---

## PHASE 1 — Foundations

- [ ] **1.1** Mobile strategy → **Option C (mobile-first + named exceptions)**: one tree, `md:`+ progressive enhancement; simulation screen is the one granted exception. `[S]` → write `docs/mobile-strategy.md`.
- [ ] **1.2** Mobile-first spacing scale as `@theme` tokens (`--space-screen-top/x/section/card/list-gap/heading/form`). `[M]` Files: `globals.css`, sweep `py/pt/pb/mt/mb` > 8.
- [ ] **1.3** Bottom-nav clipping — shared scroll padding `calc(--nav-h + safe-area + 1.5rem)`. `[M]` Files: `app-shell.tsx`/`ShellContent`.
- [ ] **1.4** Safe-area: confirm `viewport-fit=cover` in viewport meta; nav `padding-bottom: env(safe-area-inset-bottom)`; sim composer inset. `[S]`
- [ ] **1.5** Bottom nav: rename "My Courses"→"Courses"; active treatment (build Variant A + B, screenshot both); fixed `--nav-h`; ≥48px full-column targets; nested-route active detection. `[M]` Files: `bottom-tab-bar.tsx`.
- [ ] **1.6** Eliminate nested scroll containers (one per screen; sim = inner scroll only). `[M]` Grep `overflow-y-auto`/`max-h-*`+overflow.
- [ ] **1.7** Shadow/border/nesting: exactly 2 shadow tokens (`--shadow-card`, `--shadow-raised`); delete soft blurred shadows; ≤2 nested bordered levels; consider 1.5px borders on mobile nested. `[M]`
- [ ] **1.8** Horizontal overflow: temp diagnostic script; fix shadows/badges/long strings/negative margins; zero overflow at 320–412. `[M]`
- [ ] **1.9** Disabled vs enabled vs pending: 3 distinct states; `aria-disabled`/`aria-busy`; say why when disabled. `[M]` Files: `ui/button.tsx` variants.
- [ ] **1.10** Remove keyboard copy on touch (gate on `(hover:hover) and (pointer:fine)`); sweep `Enter/Shift/Ctrl/click/hover/drag`. `[S]`
- [ ] **1.11** Truncation: primary list titles `line-clamp-2` (mobile), no clamp on card headings, never truncate names/labels. `[M]`
- [ ] **1.12** `formatRelativeTime()` (Intl.RelativeTimeFormat, explicit locale); no bare numeric dates. `[S]` Files: new `src/lib/format.ts`.
- [ ] **1.13** Typography scale tokens; nothing < 0.75rem; body ≥ 1rem; survive 200% Android scaling (rem not px); prose ≤ 62ch. `[M]`
- [ ] **1.14** Tap-target audit: script all interactive elements, report < 44×44. `[M]`
- [ ] **1.15** Colour tokens (`--surface-1/2`, `--card`, `--ink/ink-60/ink-40`, `--hair`, `--amber/amber-soft`, `--rust`); exactly 2 surfaces; measure WCAG ratios; report failures. `[M]` Files: `globals.css`.
  - Note: marketing page already has `--surface-1/2` + `--card` tokens (`#FBF2E9/#F5E9DA/#FDF8F2`) — reuse these; add `--hair`, `--ink-40`, `--amber-soft`, `--rust`.
- [ ] **1.16** Shared primitives: `<Screen>`, `<ScreenHeader>`, `<Card>` (default/highlighted/flat), `<ListRow>`, `<Stack>/<Row>`. `[L]` Files: `src/components/mobile/` + `design-system/`.
  - **Partially started** (MobilePage/Section/Card/ListItem/Header/StatusPill exist); finish `<Screen>`, `<ScreenHeader>`, `<Stack>/<Row>`.

---

## PHASE 2 — Screen by screen (assumes Phase 1 primitives)

- [ ] **2.1** Today — remove dead space; flame icon gets value (`🔥 3 day streak`) or remove; stack secondary cards vertically <480px; equal heights. `[S/M]` Files: `today/page.tsx`.
- [ ] **2.2** Courses list + detail — progress meaningful at 0% (text, not empty bar); ONE primary action (drop "Start course" button); ONE emphasis on next lesson; lesson rows (number badge, 2-line title, duration+status, 56px, full-row tap). `[L]` Files: `courses/`.
- [ ] **2.3** Lesson/material viewer — error card centred, human title, correlation id, loading skeleton, slow-conn messaging (8s), retry backoff, playback position persist. `[M/L]` Files: material `viewer.tsx`, lesson `page.tsx`.
- [ ] **2.4** Quiz — selected state (not colour-only, `role=radiogroup`+`aria-checked`); ≤2 nested borders; sources shown or copy changed; incorrect→explanation; `3 of 8` progress. `[L]` Files: quiz components + item bank.
- [ ] **2.5** Journal — stacked composer, autosave draft (localStorage), mood chips (not select), full-width save, "Your entries" clears nav, RLS privacy verify. `[M]` Files: `reflect/`.
- [ ] **2.6** Wall — stacked composer, 48px anon checkbox, Reply primary/Report in ⋯, relative dates, anonymity payload verify, moderation path doc. `[M]` Files: `wall/`.
- [ ] **2.7** Debrief — audit (don't redesign unless broken): transcript readable, shows missed + hints + specific moments, saveable/shareable, abandoned-session behaviour. `[S]`
- [ ] **2.8** Menu/settings/account — audit contents, logout ≤3 taps, help/contact route, safe-area, focus-trap. `[S]`
- [ ] **2.9** Empty/loading/error states everywhere — one copy deck; skeletons not spinners; correlation ids. `[M]` Files: all screens + `design-system/`.

---

## PHASE 3 — Rebuild the simulation screen (the product)

- [ ] **3.0** Confirm diagnosis (header overlap, banner > conversation, composer 40%, nested scroll, half-cut header, no send feedback, wall-of-instruction empty state). `[S]` — **mostly done in v1.**
- [ ] **3.1** `100dvh` (fallback `100vh`), hide bottom nav (done), `overscroll-behavior: contain`, prevent body scroll. `[S]` — **partial (nav hidden + full-bleed done).**
- [ ] **3.2** Compact header: back + first name + timer + ⋯; move disposition/descriptor/turn-count to a "case file" card as the FIRST message in the list + detail sheet. `[M]` — **header v1 done; case-file card + detail sheet not yet.**
- [ ] **3.3** Demote offline banner → single-line chip (36px), dismissible, driven by REAL provider health (see 0.8), student-facing copy. `[S/M]` — **StatusPill done; not yet dismissible/health-driven.**
- [ ] **3.4** Move hints into the conversation (inline "HINT" message, no permanent strip); track hint count/timestamps per session. `[M]`
- [ ] **3.5** Message list: group consecutive messages (4px intra, 12px inter), timestamps on tap, auto-scroll respects reading position + "jump to latest", streaming tokens, typing indicator (reduced-motion static), inline errors (never lose typed text). `[L]`
- [ ] **3.6** Composer: one row (mic + textarea + send), auto-grow 1–5 lines, no keyboard hint on touch, "Finish" moved + confirmation, `enterkeyhint="enter"`, `autocapitalize/autocorrect/spellcheck`. `[M]` — **composer v1 done; auto-grow + finish-confirm remain.**
- [ ] **3.7** Keyboard: `interactive-widget=resizes-content` meta + `visualViewport` fallback; real-device test required. `[M]`
- [ ] **3.8** Session persistence/resilience: persist every turn (server-side), restore on return, local composer draft, offline queue + retry, connection indicator, Today "Resume" after crash. `[L]` — investigate what already persists first.
- [ ] **3.9** Timing/pacing: timer target marker (not countdown), turn-limit gentle prompt, silence honored (no timeout). `[S]`

---

## PHASE 4 — Voice

- [ ] **4.1** Mic: tap-to-toggle (not hold); states (idle/requesting/listening/processing/error); live level meter; interim transcript in textarea; no auto-send; append (don't replace). `[M/L]` — **current is hold-to-talk; needs tap-to-toggle rework.**
- [ ] **4.2** Permissions/failure matrix: request on first tap, distinct copy per failure, Android Chrome path, release mic on background/lock/call, hide (not disable) unsupported. `[M]`
- [ ] **4.3** STT approach: report Web Speech vs streaming-STT-through-router (data policy is non-negotiable: no-train only); test Indian-English + code-switching + clinical terms; interim results mandatory. `[L]` — report before building.
- [ ] **4.4** Patient TTS — evaluate only, do not build before 20 Aug (cost, affect-matching, streaming, data policy, mobile data). `[S]`

---

## PHASE 5 — The patient does not talk like a person

- [ ] **5.0** Baseline: connect live provider (0.8) FIRST, run 5 sessions, save transcripts, THEN decide. `[S]` — blocked on 0.8.
- [ ] **5.1** `docs/simulation-architecture.md` — Director/Actor prompts VERBATIM, state carried, models, token budget, disposition encoding, fallback location. `[M]`
- [ ] **5.2** Constrain patient speech: 1–3 sentences default (<40 words median); patient vocabulary (no clinical terms); don't volunteer (risk never unprompted); disposition behaves differently; respond to poor technique (one-word → confusion, leading → false agree, jargon → "what does that mean?"); never break frame. `[L]` — **engine already has structure; this is prompt + gate wiring.**
- [ ] **5.3** Director real work: rapport (exists — `rapport_events[]` declared but never populated), disclosure gating (exists — `gates.ts` + `disclosed[]`; turn route currently FLATTENS `disclosure_rules` to `/./`), affect trajectory (exists), cues, silent scoring for debrief. `[L]` — **wire existing rich fields into the turn route (smallest sensible change).**
- [ ] **5.4** Timing/pacing: variable pre-typing delay (400–1200ms, longer for hard questions), streaming, length-proportional. `[M]`
- [ ] **5.5** Safety behaviour — **do NOT build without Dr. Dave sign-off.** Report proposed structure + open questions. `[S]` (report only)
- [ ] **5.6** Eval harness `scripts/eval-simulation.ts` — 7 personas × cases × dispositions, transcripts to `evals/`, automated metrics + human rubric. `[L]`

---

## Key disputes / corrections (code wins)

1. **0.8 / 3.3 — "Offline banner is static"** — confirmed: `fixtureMode` is a prop, not live health. Real fix is wiring router health into it + confirming prod env, not just restyling.
2. **5.3 — "Director may not be tracking state"** — it already tracks a rich `PatientState` (trust/guardedness/mood/disclosed/gates_met/phase). The gap is that some authored richness (`disclosure_rules` gate depth, `story`/`drama`/`contradictions`/`voice_profile`, `rapport_events`) is NOT wired into the live turn route. So "give the Director real work" is partly "wire what already exists."
3. **1.15 — colour tokens** — `--surface-1/2` + `--card` already exist from the marketing pass (`#FBF2E9`/`#F5E9DA`/`#FDF8F2`). Reuse, add the missing `--hair`/`--ink-40`/`--amber-soft`/`--rust`.

## Ship-blocking first (per §0.5 rule 5)
Phase 0 → Phase 1 → Phase 3 must land before 20 Aug. Phases 4–8 can follow.
