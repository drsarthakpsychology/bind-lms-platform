# FIXED — what was broken, the real cause, what changed, how it's proven

Date: 2026-08-12. Branch: feat/v5-depth.

---

## Bug 1 (HIGH) — The patient is not reading the case

### Symptom
Opening Suresh (45, alcohol use disorder, resistant) produced Ravi's
depression line: *"I don't know. It just… everything feels heavy lately.
Even getting up feels like a lot."* Every patient was the same generic
depressed responder with a different name on the card.

### Root cause (traced end to end, proven in the database)
1. `.env.local` has **no AI keys and no `AI_ENABLED`**. `aiChat()`'s
   `isEnabled()` returns `false`, so every `sim_patient_turn` fell to
   `fixtureReply()` in `src/lib/ai/fixtures/index.ts` — a **shared canned
   bank** keyed by *difficulty archetype* (`cooperative` / `guarded` /
   `resistant` / `crisis`).
2. The turn route never passed the case's difficulty, so the fixture
   always defaulted to `cooperative` → **every patient got Ravi's bank.**
3. `sim_sessions` seed was drawn with the **fixed value 1** → every session
   of a case got the identical variant → identical lines.
4. Verified at the stored-turn level: Suresh's real session (case
   `ab68c7f7…`, status complete) contains Ravi's lines verbatim in
   `sim_turns` — the case spec never reached any model, in any mode.

The assembled prompt was **never assembled** — the model was never called.

### The fix
- **`src/lib/sim/fixture-patient.ts`** — a deterministic, case-aware
  patient engine for no-key mode:
  - Opens with the case's OWN authored few_shot line (seeded pick);
  - Every later turn draws from the case's authored `fixture_lines`
    (6 per case, written in that patient's register) before any shared
    fallback — authored voice ALWAYS wins, so cases can never bleed;
  - Per-case `variation` schemas (7 fields × 3-4 options) mixed into a
    session humidity → same case, different seeds = different sessions;
  - Code-enforced: pressure/abruptness streaks raise irritation; 3×
    premature advice → permanent hollow compliance; fatigue shortens;
    anti-repetition (no move twice in 3; authored-first regen on
    similarity > 0.85);
  - Deterministic per (case, seed, turn) — the rewind contract holds.
- **Session route**: persists the patient's OWN opening line as the first
  turn with the initial state; seeds the variant per session (no more
  fixed 1).
- **Turn route**: fixture mode routes through the new engine; the live
  Director/Actor path is unchanged and still preferred when keys exist.
- **DB**: all 8 case rows upserted with authored `fixture_lines` +
  `variation` so the live path (DB-first) uses them too.

### Before / after assembled prompt
**Before** (fixture path, every patient, every turn):

```
fixtureReply('sim_patient_turn') → PATIENT_REPLIES['cooperative'][turn % 5]
  → "I don't know. It just… everything feels heavy lately. Even getting up feels like a lot."
```

**After** (same no-key mode, Suresh, greeting → follow-up):

```
runFixtureTurn(Suresh, seed, "Hello")
  few_shot[humidity % 1] → "She thinks I drink too much. I tell her it's
    the business, the pressure. She doesn't understand."
runFixtureTurn(Suresh, seed, "What brings you here today?")
  fixture_lines[(turn + humidity) % 6] → "One peg, maybe two. That's
    normal. You tell me — a man can't have a peg after work?"
```

### Proven
- 16 new tests (`src/lib/sim/fixture-patient.test.ts`): Suresh speaks
  alcohol denial and never Ravi's content; all 8 cases pairwise distinct
  across 3 turns; "hey/why/hey" gives 3 different replies and irritation
  rises; 10 seeds of one case play differently; every other case's
  few_shot never leaks.
- Stored-turn proof: session route now writes the opening as the first
  patient turn — the transcript starts with the patient's own words.

---

## Bug 2 (HIGH) — Duplicate messages in the transcript

### Root cause (two layers, proven)
1. The shared fixture bank produced the SAME line across turns → `sim_turns`
   held 2-4 copies of one reply per session (verified: session
   `16d9a7db…` has the Ravi line at 19:33:11/13/15/17 — a double-send
   stacking rows).
2. The client's typing reveal replaced the LAST turn by position; a second
   student message mid-reveal re-pushed a fresh copy of the old reply.
   The renderer keyed turns by index, so React couldn't reconcile.

### Fix
- Renderer: stable per-turn ids, append-once + update-by-id reveal,
  `pendingReply` guard so a second send mid-reveal never duplicates.
- DB: unique `(session_id, role, content)` constraint applied live +
  mirrored in the migration; 27 legacy duplicate rows pruned (all old
  fixture repeats; zero legitimate collisions verified first).
- Regression suite: `src/lib/sim/reveal.test.ts` (3 tests).

---

## Bug 3 (MED) — One Start button firing all

Audited: per-id pending state (`starting === c.id`), stable list keys, and
no form wrapper were ALREADY correct on disk. Added a 4-test regression
(`case-picker.test.ts`) proving pressing one card disables only that card,
a second press while pending is ignored, settle re-enables, keys stable.

---

## Bug 4 (HIGH) — "I can only see 3 practice tools"

### Root cause
12 of 18 `feature_flags` rows had `enabled = false` (the brief's "ship six"
scope cut). Every tool was fully built and on disk; the flags hid them.

### Fix
- All 18 flags enabled for Cohort One (live + migration file).
- `VISIBILITY.md`: per-tool audit (route / real data / flag / nav / cohort
  access), before/after.
- "0 of 1 lessons" is CORRECT: 1 published lesson (MSE) in 1 course — the
  course needs content, not a counting fix (QUEUE.md).

---

## UI overhaul
- Session screen: patient header (name, age, difficulty chip, one-line
  context), speaker distinction (patient left + name label, student right
  primary bubble), quiet secondary timer, turn counter, SIMULATION badge,
  3-dot typing indicator with name, voice button with listening state +
  live waveform + editable interim draft, composer anchored.
- Case picker: grouped by difficulty with headers + counts; each card led
  by the patient's OWN words (hook blockquote), clinical line secondary and
  non-diagnostic; per-case real state (Not attempted / In progress with
  Resume / Completed · score); dead "Reviewed" chip removed; one tap
  target per card.
- 380px pass (e2e/mobile-380.spec.ts): practice hub, picker, and session
  screen — no horizontal scroll, primary action reachable.

## Security
- `wall_posts_visible`, `wall_replies_visible`, `formulation_wall_visible`
  recreated as SECURITY INVOKER (projection-only; RLS gates rows). Advisor
  re-run confirms the three view lints are gone.

## Sweep
- Full e2e suite: 31 passed (weak-spots drill flow fixed with
  `data-testid="drill-next"`; roleplay landing wait widened to /today).
- BUGS.md rows 21-27 logged.
