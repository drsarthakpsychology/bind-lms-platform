# QUEUE
# Format is STRICT. Unchecked: "- [ ]" with exactly one space. Done: "- [x]".
# The Stop hook only blocks while unchecked items exist. This is the fuel.

## BEASTMODE ROUND 8 — content depth + scoring + polish (2026-08-12)

- [x] **Content Volume (Idioms)**: Seed remaining 15 regional idioms ( Bengali/Tamil/Telugu/Kannada/Marathi/Gujarati) to reach the 110 target [Master §5.2]
- [x] **Content Volume (Cases)**: Author 5 new "no-disorder" cases to reach the 9-case restraint bank [Addendum §A8] — Already 9 cases exist: grief-no-disorder, dep-grief-raj, psy-mahesh, soma-b12-pramod, normalTeen, examAnxiety, sunita, rohit-parent, neelam-sent
- [x] **Content Volume (Quizzes)**: Add 15 new best-response MCQ/spot-the-error items to the bank [Master §4.1]
- [x] **Content Volume (Clinic)**: Expand Two-Minute Clinic with 20 new one-liner prompts + expert comparisons [Ideas Next]
- [ ] **Scoring Coverage**: Write 10 unit tests for the debrief scoring logic (deterministic, fixture-tested) [Master §11]
- [ ] **A7 Dictate-as-conversation**: Initial scaffold for the dictation interviewer (Whisper → follow-up LLM → sim_case spec) [Addendum §A7]
- [ ] **A5 Queue auto-release**: Add the `AI-generated — not yet faculty reviewed` label to student-facing feedback [Addendum §A5]
- [ ] **Polish (Haptics)**: Audit every practice activity and ensure `haptics.ts` fires on card tap, state change, and correct answer [Addendum §B5]
- [ ] **Polish (Focus)**: Ensure focus management on the MSE drill and long forms for keyboard-only users [Master §4]
- [ ] **Infra (Optimization)**: Audit text column sizes and apply `infra_snapshots` logic to the newest tables [Master §9.3]
- [ ] **Docs (Freshness)**: Update MORNING_REPORT.md and NIGHT_LOG.md with Round 8 status [Master §0.4]
- [ ] **Final Pass**: Run `npm run lint && npx tsc --noEmit && npm run test && npm run build` [Master §0.2]
