# Mobile interaction-flow audit (T19)

The spec that feeds T20–T90. For every major mobile feature this defines the
five interaction-flow attributes, then flags the **competing actions** that
crowd the initial viewport and should move into a contextual reveal.

Method: definitions are derived from the shipped components (not aspirational).
"Primary action" = the single tap the screen exists for. "Next action" = the
immediate step after the primary action. "Secondary" = anything that must exist
but should not compete with the primary action on the first screenful.

## Initial-viewport discipline (the T19 rule)

One screen = one cognitive task. The primary action is the only thing that
should sit in the thumb zone, visually dominant. Competing actions are demoted:

1. **Defer** — move off the first viewport entirely (behind a chip, a sheet, a
   "more" affordance, or a later step).
2. **Yield** — stay visible but go visually quiet when another action is
   primary (the `/today` chain card already does this vs. "Resume session").
3. **Contextualise** — only render when the state that makes it relevant exists
   (never a placeholder, never a banner with nothing to say).

Nothing is *removed* from the feature — only from the first screenful.

---

## Front door & navigation

### /today — front door
- **Primary goal:** land on the single next thing to do.
- **Primary action:** the primary card (`Resume` when a session is open, else `Decode`).
- **Required info:** what it is, why now (reason), time cost.
- **Next action:** tap → session or drill.
- **Secondary (contextual):** streak line, weak-spots banner, in-progress chain card, quick/deep chips, "All practice tools" link.
- **Competing actions:** weak-spots banner + chain card + primary card can all stack above the fold. The chain card already yields to "Resume"; the weak-spots banner should yield (or collapse) when a resume/chain continuation is primary, so only one "do this now" survives the first viewport.

### /practice — deliberate browse
- **Primary goal:** choose a tool by how much time the student has.
- **Primary action:** the grouped tool cards (verb label + time badge + state).
- **Required info:** group (under 5 / 5–10 / deep / whenever), verb, time, honest state.
- **Next action:** tap a card → tool.
- **Secondary (contextual):** recommended card (always states a reason), weak-spots banner, "Your record" links (passport / supervision), keyboard nav hint.
- **Competing actions:** the recommended card and weak-spots banner both sit above the tool list — two "do this" surfaces before the browse surface. On mobile these should be at most one, or collapsible; the groups are the primary surface.

### Bottom tab bar (navigation)
- **Primary goal:** get to one of the 5 core destinations in one thumb tap.
- **Primary action:** the 5 tabs (Today / My Courses / Practice / Journal / Wall; admin: Overview / Review / Submissions / Students).
- **Required info:** label + icon, active state (ink-on-peach, constant geometry).
- **Next action:** tap → destination.
- **Secondary (contextual):** everything else lives behind the drawer / destination page.
- **Competing actions:** none in the bar itself (already a constant 5-tab geometry) — keep it that way; do not add a 6th tab or a badge that competes for attention.

### /courses → module → week → lesson
- **Primary goal:** continue the course at the right lesson.
- **Primary action:** the next/current lesson row.
- **Required info:** module → week → lesson hierarchy flattened into rows; completion state; locked/available.
- **Next action:** tap lesson → lesson viewer.
- **Secondary (contextual):** resource lists, reflections, quizzes — revealed inside the lesson, not on the course index.
- **Competing actions:** nested week cards (already killed in T5). Keep the index to a single flat list of lessons; per-lesson resources stay inside the lesson.

---

## Practice tools

### Judgment Calls (SCT)
- **Primary goal:** update a probability when new information arrives.
- **Primary action:** the answer choice ("slide" to commit).
- **Required info:** the vignette + the 3–4 options + the panel distribution after committing.
- **Next action:** commit → see panel distribution + expert response.
- **Secondary (contextual):** rationale, prior-case reminders — after commit.
- **Competing actions:** nothing should sit between the vignette and the options; explanations defer to post-commit.

### Two-Minute Clinic
- **Primary goal:** produce a one-liner, differential, next question in 120s.
- **Primary action:** the typed answer fields (one at a time).
- **Required info:** the prompt + the single active field + the timer.
- **Next action:** submit → expert comparison.
- **Secondary (contextual):** the comparison and idiom variant — after submit.
- **Competing actions:** the timer is ambient, not a competing action; keep the three prompts sequential, not stacked.

### Rounds
- **Primary goal:** recall spaced-repetition cards.
- **Primary action:** rate the card (again/hard/good/easy) — or the single active answer.
- **Required info:** the card front; the back after reveal; the daily cap.
- **Next action:** rate → next card.
- **Secondary (contextual):** "you're done" state at the 25/day cap.
- **Competing actions:** only one card visible at a time; the cap message is a terminal state, not a competing banner.

### Presenting Complaint Decoder (4 modes)
- **Primary goal:** decode an idiom ("not feeling fresh") into candidate readings.
- **Primary action:** the active mode's single input (funnel step / reading pick / CFI probe).
- **Required info:** the idiom + the active step.
- **Next action:** commit the step → next step (open → specify → instantiate → quantify → contextualise → attribute).
- **Secondary (contextual):** the 6 readings, the funnel card reference, mode switch — behind the active step.
- **Competing actions:** mode selection should not compete with the active drill; surface it as a secondary chip, not a parallel rail.

### MSE Trainer (5-level ladder)
- **Primary goal:** describe before you label.
- **Primary action:** the observation/domain/rating for the active level.
- **Required info:** the level's prompt + controlled vocab.
- **Next action:** submit observation → feedback/next domain.
- **Secondary (contextual):** the 11-domain map, confusable pairs, ladder gating — behind the active level.
- **Competing actions:** the ladder is gated in order; do not render all 5 levels or all 11 domains at once on mobile.

### OSCE Stations
- **Primary goal:** complete one 7-minute station task.
- **Primary action:** the station's single task (voice-first where available).
- **Required info:** the station brief + timer + the one task.
- **Next action:** perform → mark complete → next station.
- **Secondary (contextual):** checklist, observer notes — after the task.
- **Competing actions:** one station at a time; the station list is a menu, not a parallel surface.

### Formulation Forge
- **Primary goal:** assemble a 5P formulation.
- **Primary action:** tap-to-select-then-place each factor.
- **Required info:** the case + the factor buckets + the working narrative.
- **Next action:** place factors → write narrative → compare against the model.
- **Secondary (contextual):** distractors, the model diff — after the draft.
- **Competing actions:** select and place are one gesture on mobile; do not show the full model answer before the student commits.

### Ethics & Law
- **Primary goal:** choose the right consequence-first action.
- **Primary action:** the choice among scenarios.
- **Required info:** the vignette + consequence preview.
- **Next action:** choose → reveal the statute (with section).
- **Secondary (contextual):** the statute citation, the two-step consequence unfold — after the choice.
- **Competing actions:** consequence-first means the statute must NOT be visible before the choice.

### Landmark Cases
- **Primary goal:** read what was believed and what held up.
- **Primary action:** the case narrative.
- **Required info:** the case + the contestation/reassessment.
- **Next action:** read → inline quiz.
- **Secondary (contextual):** the quiz — revealed after the read, not before.
- **Competing actions:** keep quizzes inline-but-after; do not stack quiz cards between the narrative and the reading flow.

### Out of Depth (refer/escalate drill)
- **Primary goal:** know when to refer, escalate, or stop.
- **Primary action:** pick the referral option.
- **Required info:** the vignette + the options.
- **Next action:** pick → reasoning (+ Back to revisit, Finish on the last).
- **Secondary (contextual):** over-referral tally, the "over-referral is also a harm" note, restart.
- **Competing actions:** options are the only interactive surface until the choice; reasoning + the harm note reveal after committing (already true — preserve it).

### Consulting Room (patient sim)
- **Primary goal:** interview a simulated patient.
- **Primary action:** the composer (send a line) — or the mic.
- **Required info:** patient line, status pill, session progress.
- **Next action:** send/talk → next patient turn → debrief.
- **Secondary (contextual):** notes sheet, hint sheet, disclosure gates — behind sheets.
- **Competing actions:** the giant fixture banner was killed in T2; keep the status pill and never re-introduce a banner above the transcript.

### Peer Role-Play
- **Primary goal:** pair two students and run a role-play.
- **Primary action:** the message input in the room.
- **Required info:** role, partner, the transcript.
- **Next action:** send → partner replies (polled).
- **Secondary (contextual):** observer checklist + timer (currently missing — build, but behind a sheet).
- **Competing actions:** roles + the transcript are the room; keep checklist/timer off the first viewport.

### Psychology Tutor
- **Primary goal:** ask a grounded question and read a sourced answer.
- **Primary action:** the question input.
- **Required info:** the question + the sourced answer + expandable citations.
- **Next action:** ask → read answer → expand sources.
- **Secondary (contextual):** source citations expand per answer; read-aloud toggle per reply.
- **Competing actions:** sources must not render full-width above the answer; keep them as an expandable after the answer.

### Case Library
- **Primary goal:** find a case report.
- **Primary action:** search, then open a case.
- **Required info:** the search field + result list (title, licence, fetched date).
- **Next action:** open a case → read snippet → annotate.
- **Secondary (contextual):** "Your note" + peers' notes — inside the opened case, after the read.
- **Competing actions:** the note editor must not render before a case is opened; annotation stays contextually inside the case (flattened, not a nested card — T59).

### Cohort Wall
- **Primary goal:** share one thing with the cohort.
- **Primary action:** the composer (post) — and the reaction/reply on each post.
- **Required info:** post content, anonymous toggle, author-ish metadata (anonymity preserved).
- **Next action:** post → see it at top; react/reply on any post.
- **Secondary (contextual):** reactions (always available, even at 0), reply composer (revealed), report/pin (faculty context).
- **Competing actions:** the composer is the one primary surface; the reaction row is always-visible but secondary to the post text; reply composer is a reveal, not a persistent input.

### Modules
- **Primary goal:** see the course in order, with honest lock reasons.
- **Primary action:** the unlocked module (or reading the lock reason).
- **Required info:** order, title, state, and the lock reason ("Opens 2 Sept" / "finish Module 3 first").
- **Next action:** tap an unlocked module → its content.
- **Secondary (contextual):** the special-grant note, archived/draft reasons.
- **Competing actions:** locked modules are visible-but-greyed (never hidden, never a parallel CTA); the empty state is a shared EmptyState, not a dashed `<li>` (T51).

---

## Record & reflection

### Journal (/reflect)
- **Primary goal:** write a private entry.
- **Primary action:** the entry textarea.
- **Required info:** the entry + owner-only visibility (RLS-invariant).
- **Next action:** save → entry appears.
- **Secondary (contextual):** "help me think" (no-train only), per-entry sharing (table exists, UI missing — build behind the entry).
- **Competing actions:** nothing but the composer on the first viewport; sharing and reflection helpers reveal per-entry.

### Supervision log & weekly check-in (/record)
- **Primary goal:** log supervision + answer the non-clinical weekly check-in.
- **Primary action:** the active form's single step.
- **Required info:** the step's fields.
- **Next action:** save → next step.
- **Secondary (contextual):** aggregate view (no PHQ/GAD — deliberate).
- **Competing actions:** the two (log + check-in) are separate flows; do not merge them into one long form (see T21).

### Skills Passport (/passport)
- **Primary goal:** see competency evidence.
- **Primary action:** open a competency's evidence drill-down.
- **Required info:** the 11 competencies + per-competency evidence.
- **Next action:** drill down → evidence list → PDF download.
- **Secondary (contextual):** PDF download (already built) behind a chip; the radar chart (currently a list view).
- **Competing actions:** evidence drill-down is the primary; PDF + radar are secondary chips, not leading CTAs.

---

## Admin (mobile)

### Admin overview / triage / submissions / students
- **Primary goal:** act on the highest-frequency review task.
- **Primary action:** the 4-tab bar + the single "needs attention" item.
- **Required info:** counts, the pending queue, student identities (full, not truncated).
- **Next action:** tap an item → review/act.
- **Secondary (contextual):** infra banner (only when ≥70% — already conditional), calibration, flags.
- **Competing actions:** the infra warning is the one thing allowed above the list and only when it is true; emails render wrapped/`break-all`, never `truncate` (T58).

---

## Public (auth)

### Login
- **Primary goal:** sign in.
- **Primary action:** the credential form.
- **Required info:** email + password (invite-only copy).
- **Next action:** submit → dashboard.
- **Secondary (contextual):** theme toggle, wordmark.
- **Competing actions:** the form is the only interactive surface; tagline is copy, not a CTA.

### Waitlist
- **Primary goal:** capture one lead honestly.
- **Primary action:** the waitlist form (name/email/phone/status/note).
- **Required info:** the fields + the honest "a conversation, not a form" copy.
- **Next action:** submit → confirmation.
- **Secondary (contextual):** the 01/02/03 process steps (left pitch), privacy line.
- **Competing actions:** the form is primary; the pitch is a sticky sidebar on desktop and should collapse/recede on mobile so the sheet leads.

### Verify certificate
- **Primary goal:** prove a certificate exists.
- **Primary action:** the verified card (student + course + issued date).
- **Required info:** the certificate record.
- **Next action:** none — it's a read-only proof.
- **Secondary (contextual):** nothing.
- **Competing actions:** the not-found state is a shared EmptyState (T51), not a raw card.

### Expired
- **Primary goal:** route back to sign-in.
- **Primary action:** "Back to sign in".
- **Required info:** why access ended.
- **Next action:** tap → /login.
- **Secondary (contextual):** nothing.
- **Competing actions:** the single button is the only action; no redundant bordered container around it (T59).
