# CASEBOOK — BUILD BRIEF ADDENDUM
## Part 2 of 2. Read after BRIEF_V5_MASTER.md. This reorders the build.

All operating rules from Master §0 still apply: never stop, never ask, four hard limits, blockers become one line in `NEEDS_KAVYA.md` and you move on.

---

# A. TEN IMPROVEMENTS

## A1. Retry from turn N — **the highest-value feature in the product**
*Build immediately after the Patient Engine. Do not defer.*

### Why
Feedback with no immediate re-attempt is criticism, not teaching. Deliberate practice needs the rep **right after** the correction, not next week. You already persist `PatientState` per turn, so this is nearly free.

### Behaviour
In the debrief, every flagged moment gets a **"Try this again"** button. Tapping it rewinds to that turn — same case, same seed, same `PatientState` snapshot, same mood — and the student re-attempts from exactly there.

### Schema
```sql
alter table sim_sessions
  add column parent_session_id uuid references sim_sessions(id),
  add column branched_from_turn int,
  add column is_branch boolean not null default false;
```

### Implementation
- Rewind = clone the session rows up to turn N−1, set `parent_session_id`, `branched_from_turn`, `is_branch = true`, resume live.
- **The Director must be deterministic given identical state + identical input.** Same seed, same temperature bucket. Write a test: identical rewind + identical input → identical patient move. Different input → divergence.
- **Cap at 3 branches per moment** so it doesn't become infinite scrubbing.
- Branches count toward practice volume but faculty review only originals unless they ask.

### The screen that makes it land
Side-by-side comparison strip:

| Attempt 1 | Attempt 2 |
|---|---|
| *"so you're feeling sad, right?"* | *"how would you describe how you've been?"* |
| Patient shut down | Patient disclosed the debt |
| trust −1 | **trust +2** |

Same patient. Same moment. Two futures. **That comparison is the entire lesson.**

### DONE MEANS
- [ ] "Try this again" on every flagged debrief moment
- [ ] Rewind restores exact state; determinism test passes
- [ ] Comparison strip renders both attempts with the state delta
- [ ] 3-branch cap enforced
- [ ] Faculty queue shows originals only by default

---

## A2. Scope cut — ship six, build fifteen

Fifteen surfaces across thirty students over twelve weeks produces thin usage everywhere and teaches you nothing about what actually worked.

**Live for Cohort One:** Consulting Room · Decoder · MSE Trainer · 5 Judgment Calls · Rounds · Journal

**Built but flagged off:** Formulation Forge · OSCE · Ethics · Case Library · Landmark Cases · Peer Role-Play · Two-Minute Clinic · Supervision Log · Skills Passport · Crisis Hour

```sql
create table feature_flags (
  key text primary key,
  enabled boolean not null default false,
  enabled_for_cohort uuid,
  enable_at timestamptz,
  updated_at timestamptz not null default now()
);
```

Admin toggle at `/admin/flags`. **Build everything — ship six.** One click reveals any of them, and staged reveal is itself an engagement mechanic. Wire Skills Passport and Two-Minute Clinic to auto-enable around week 4 via `enable_at` + the GitHub Actions cron.

### DONE MEANS
- [ ] `feature_flags` table + `/admin/flags` toggle UI
- [ ] Flag checked server-side in the route-group layout, not just hidden in the UI
- [ ] Exactly 6 flags on by default
- [ ] Flagged-off routes return a proper "not yet available" page, not a 404

---

## A3. Scorer calibration harness — **do this before 20 August**
`/admin/calibration`

### Why
You are about to grade students on empathy, question quality and risk assessment behind a confident interface. If the scorer is wrong, you teach the wrong thing **persuasively**. That is the biggest credibility risk in the product and it is cheap to close.

### Build
- **Blind scoring UI:** Dr. Sarthak sees a transcript with the AI score hidden, scores each rubric dimension himself, submits. Only then are both revealed side by side.
- **Agreement dashboard:** per-dimension Cohen's weighted kappa (or ICC), plus a scatter of AI vs human.
- Every disagreement writes to `scoring_corrections` — which Master §2 already specs as few-shot injection into future scoring calls. **The calibration run trains the scorer as a side effect.**
- **Seed with 20 AI-vs-AI self-play transcripts** so he has something to score before students exist.

### The gate — this is the point, not the dashboard
```sql
create table rubric_dimensions (
  key text primary key,
  label text not null,
  status text not null default 'provisional'
    check (status in ('provisional','validated')),
  agreement numeric,
  n_scored int not null default 0
);
```
**Any dimension with `status='provisional'` has its numeric score hidden from students.** They still see the qualitative feedback for it. Wire this as a real check in the debrief renderer, not a comment.

### Why it matters commercially
"Our AI scoring is calibrated against a practising psychiatrist, with published agreement statistics" is a far stronger line for the St. Xavier's MOU than "we use AI."

### DONE MEANS
- [ ] Blind-then-reveal flow works
- [ ] Per-dimension agreement computed and displayed
- [ ] Disagreements write to `scoring_corrections` and are injected into subsequent scoring prompts
- [ ] Provisional dimensions hide their number in the student debrief — tested
- [ ] 20 self-play transcripts seeded

---

## A4. Out of Depth — the missing safety competency
`/practice/out-of-depth`

Your students train toward counselling roles, not clinical psychology licences. The most important safety skill for that audience is **recognising when to refer, escalate, or stop** — currently a subsection of Ethics instead of its own drill.

**Format:** vignette → choose → consequence unfolds → then the reasoning.

Options always include: *continue* · *continue with supervision* · *refer to a psychiatrist* · *needs medical workup first* · *outside RCI scope for you*

**Score both directions.** Failing to refer is dangerous. **Referring everything is also a real harm** — it's what anxious novices do, it abandons clients, and nobody ever tells them off for it. Track an **over-referral rate** alongside under-referral and show both.

**30 scenarios:** active suicidality · psychosis · suspected bipolar started on an SSRI · child protection disclosure · eating disorder with medical instability · substance withdrawal · medical mimic (thyroid, B12, delirium) · client asking for a diagnosis you can't give · client asking for medication advice · client who is a friend's relative · request for a court letter · deterioration mid-therapy · client who won't leave at session end · client disclosing intent to harm someone else · a minor asking you not to tell their parents

### DONE MEANS
- [ ] 30 scenarios with consequence chains
- [ ] Both over- and under-referral tracked and shown
- [ ] Statute cited where relevant (MHA 2017, POCSO, RCI scope)

---

## A5. Review queue triage — stop Dr. Sarthak drowning in week two

Thirty students × multiple sessions = a queue he'll work enthusiastically for ten days and then abandon. Sixty a week is not sustainable; five is.

**Surface only what needs human eyes.** Priority score per submission:
- AI scorer confidence low, or two passes disagreed
- Anything flagged concerning (risk content, distress in the student's own reflection)
- Same rubric dimension failed three sessions running
- A student's **very first session** (always)
- Random 5% sample for quality control

Everything else auto-releases with a visible `AI-generated — not yet faculty reviewed` label. He can pull any item into the queue on demand.

**Target: the queue never shows more than 10 items.** Show "34 auto-released this week" as an expandable count, not a backlog to clear.

---

## A6. Cohort Pulse — instrument the humans
`/admin/pulse`

`/admin/infra` watches Postgres. Nothing tells Kavya seven students haven't logged in since week three — and that's the metric that decides whether Cohort One succeeds.

One screen:
- **Drifting** — no activity 7+ days, sorted by days silent
- **Stuck** — same rubric dimension failed 3+ times, or same module incomplete 2+ weeks
- **Flying** — finished everything available, at risk of boredom. **These are your Cohort Two testimonials. Don't lose them.**
- **Cohort curve** — activity by week, so week 9 crushing everyone is visible before it's terminal
- **One-tap nudge** — pre-drafted, personal, via Resend. **Never automated guilt; Kavya presses send.**

Cross-reference with the weekly check-in aggregate. Activity dropping *and* load score spiking = a curriculum problem, not a motivation problem.

---

## A7. `/admin/corpus/dictate` becomes a conversation, not a form

Dr. Sarthak's twenty cases are the highest-value asset in the product and no competitor can copy them. **Don't make him fill in a schema.**

He taps record and talks. Whisper transcribes. An LLM interviewer asks follow-ups to complete the `sim_case` spec:
> *"What did the family say when he first stopped going to work?"*
> *"What would he say if you asked him directly about the drinking?"*
> *"What's the one thing he'd never volunteer?"*

It fills disclosure gates, resistance patterns and affect rules from his answers, then shows the structured case for approval and editing.

**Ten minutes of a psychiatrist talking beats an hour of him typing into fields.** Keep the raw transcript — his phrasing of how patients talk is itself training data for the Actor's few-shot slots.

---

## A8. "No disorder" as a principle

Over-diagnosis is the dominant novice error. One case where the answer is "this person is fine" teaches nothing; a **pattern** teaches restraint.

**9 of the 60 cases have no diagnosable disorder:** normal grief within weeks of a death · normal adolescent withdrawal · situational stress with intact function · a worried parent whose child is developmentally typical · exam anxiety within range · culturally normative possession experience with no functional impairment · a first panic attack after a medical scare, non-recurrent · someone sent by a family member who has no complaint themselves · low mood fully explained by a treatable medical cause

**The debrief must explicitly praise correct restraint.** A student who *doesn't* diagnose should feel rewarded — currently nothing in the product does that.

---

## A9. Supervision Log → transfer loop

When a student logs a real-world contact hour, ask two questions:
> *What did you try that you practised here?*
> *What happened?*

Store as `supervision_entries.transfer_note`. This is your **only evidence that platform practice changes real behaviour** — and, in students' own words, the best Cohort Two marketing you will ever have. Add a consent checkbox for anonymised promotional use; ask once, store the answer.

---

## A10. Alumni mode — what happens on 16 November

Access windows currently expire and take the practice history with them, **including the Skills Passport that's meant to be evidence of competence.** That's the wrong ending.

On cohort end, role becomes `alumni`: permanent read-only access to their own transcripts, Skills Passport, journal and certificate, plus **one new case per month** and a readable Wall.

Costs approximately nothing. Keeps sixty people attached. Turns Cohort One into the enrollment channel for Cohort Two.

Add `alumni` to the role model and a `cohort_ended_at` transition job in the GitHub Actions cron.

---

# B. REDESIGN THE PRACTICE PAGE

## B1. What's wrong now

Fourteen visually identical cards in a three-column grid. Specifically:

1. **No state.** Nothing shows what's due, in progress, never opened, or locked. Every card looks equally urgent, so none are.
2. **No time cost.** A student with five minutes can't tell which of these takes five minutes. **Time estimate is the single biggest determinant of whether someone starts.**
3. **Five taxonomies in one grid.** `DILEMMAS` (content type) · `CONTACT HOURS` (unit) · `NON-CLINICAL` (category) · `CORPUS` (data source) · `COMPETENCIES` (framework) · `DAILY · 2 MINUTES` (frequency+time) · `WITH A PEER` (social mode) · `INSIGHTS` (vague). Pure cognitive load, and a real cause of "they all blur together."
4. **Repeated icons.** The checklist glyph appears on Script Concordance, Supervision Log, Skills Passport **and** Peer Role-Play. The timer appears twice. Icons are meant to aid recognition; these actively confuse.
5. **No recommendation.** Fourteen equal choices is a decision the student must make before doing anything. Decision cost is why people close the tab.
6. **No progress.** Nothing shows 14/60 cases, a 9-day streak, or "never opened."
7. **Weak Spots is meta** but sits in the same grid as the things it comments on.
8. **Mobile.** Three columns collapse to a fourteen-card vertical scroll of identical rectangles.

## B2. New structure

`/today` is the front door (Master §7.1). `/practice` becomes the deliberate browse view — and it should be genuinely good at browsing.

### Top: one recommended card, with a reason
Full-width, system-chosen, **always states why** in one line:
> *"You've missed the risk-assessment gate in 3 of your last 4 sessions."*
> **Consulting Room · Case 12 · 12 min**

**Reason beats recommendation.** A recommendation with no reason reads as an ad.

### Then: group by time and mode, not category
Students decide by "how long have I got," not "what category is this."

- **Under 5 minutes** — 5 Judgment Calls · Two-Minute Clinic · Rounds · Decode
- **A proper session** — Consulting Room · OSCE · Formulation Forge · MSE Full
- **With someone else** — Peer Role-Play · Wall · Crisis Hour
- **Read and reflect** — Case Library · Landmark Cases · Journal · Ethics
- **Your record** — Skills Passport · Supervision Log

Collapsible headers, open/closed state remembered per user.

### Every card gets four things it doesn't have
1. **State chip** — `Due 12` · `In progress` · `New` · `Done today` · `Opens 2 Sept`. State drives the visual: due cards get the peach fill; done-today drops to 60% opacity and sorts last; locked greyed with the reason.
2. **Time badge** — `2 min` · `12 min` · `7 min`
3. **Progress line** — `14/60 cases` · `day 9` · `3 domains weak`. One line, no chart.
4. **Unique icon.** One glyph per feature. **No repeats.**

### Eyebrow labels: one taxonomy — the interaction verb
`TALK` · `SLIDE` · `SORT` · `TAG` · `CHOOSE` · `RATE` · `TYPE` · `PERFORM` · `ANNOTATE` · `PAIR` · `DECODE` · `RECORD` · `REFLECT` · `ASK`

One word, one taxonomy. It also teaches the student these are genuinely different activities — which was the original complaint.

### Weak Spots leaves the grid
Becomes a **dismissible banner above the sections**: *"Your three weakest domains this week: thought form, risk timing, mood vs affect →"* — tapping generates the 10-item drill immediately.

## B3. Mobile
- Single column. Sections collapsed by default **except** the one matching time of day (short things in the morning, longer in the evening — read local IST).
- Recommended card pinned, full-bleed.
- **State chip and time badge on the same line as the title**, not below — vertical space is the scarce resource.
- Whole card is one tap target. No nested buttons.
- Sticky bottom bar with the single next action so they never scroll back up.
- **Test at 380px, then on a real iPhone.**

## B4. Empty and first-visit states
Three states per card, not one fixed description:
- **Never opened** — what actually happens: *"A patient walks in. You have twelve minutes."* Not a feature description.
- **In progress** — *"Case 12, turn 7, paused 2 days ago."*
- **Complete for now** — *"Nothing due. Back tomorrow."* Say "you're done" and mean it.

## B5. Micro-details
- `haptics.ts` on every card tap, state change, correct answer. It exists — use it.
- Skeleton loaders matching card shape, never a spinner.
- Optimistic state: card flips to `In progress` before the route resolves.
- Sections animate open with the existing `motion` setup; respect `prefers-reduced-motion`.
- Keyboard: `j`/`k` between cards, `Enter` to open, `/` to search. An afternoon's work; makes desktop feel like a tool.
- Filter row: competency, trap, time. Behind one icon on mobile.

## B6. DONE MEANS
- [ ] Recommended card always renders **with a stated reason**, never generic
- [ ] Every card shows state, time and progress
- [ ] No two cards share an icon
- [ ] All eyebrow labels are one-word interaction verbs
- [ ] Done-today cards sort last at reduced opacity
- [ ] Locked cards state the reason; never silently hidden
- [ ] Section open/closed remembered per user
- [ ] **Starting any activity from `/practice` is 1 tap**
- [ ] Full pass at 380px and on a real iPhone
- [ ] Whole page works with `AI_ENABLED=false`

---

# C. THE BUILD ORDER — this supersedes Master §9

1. **Decoder + 60-idiom bank** (Master §1)
2. **Patient Engine** — Director/Actor split (Master §2)
3. **A1 Retry from turn N** ← *the thing that makes it teach*
4. **A3 Scorer calibration harness** ← *the thing that makes it trustworthy*
5. **Practice page redesign (B) + `/today` + mobile audit**
6. **MSE five-level ladder** (Master §3)
7. **Voice** (Master §6)
8. **A2 Feature flags** + cut to six live
9. **A4 Out of Depth**
10. **Content** — 60 cases across 16 traps, **9 no-disorder (A8)**, Gutenberg style patterns
11. **A5 Review triage** + **A6 Cohort Pulse**
12. **A7 Dictate-as-conversation**
13. Modules, quizzes, remaining Master §4 upgrades
14. **A9 transfer loop** + **A10 alumni mode**

**Short on time: 1 through 5, complete.** A patient who behaves like a person, a student who can decode what they said, a retry that makes the lesson stick, a scorer you can trust, and a page that costs one tap. That is a product.

---

# D. MORNING REPORT — additions to Master §12

```
## Retry
Branches created in testing __ · determinism test: pass/fail
Comparison strip renders: yes/no

## Calibration
Self-play transcripts seeded __/20
Dimensions marked provisional: (list)

## Practice page
Icons unique __/14 · labels converted to verbs __/14
Taps to start any activity __ · section state remembered: yes/no

## Flags
Live for Cohort One __/6 · built-but-off __
```

---

# THE POINT, RESTATED

Everything here serves one of three things:

**Making it actually teach** — retry, out-of-depth, no-disorder cases, transfer loop.
**Making it trustworthy** — calibration, provisional dimensions, review triage.
**Making it survivable for the two humans running it** — scope cut, cohort pulse, dictate-as-conversation, alumni mode.

A patient says *"I'm not feeling fresh."* The student misses it. The debrief shows them exactly where. **They retry from that turn and the patient opens up instead.** That loop is the whole product.

**Start at C1. Work until morning. Ask nothing.**
