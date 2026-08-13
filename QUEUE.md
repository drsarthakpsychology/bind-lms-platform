# QUEUE
# Format is STRICT. Unchecked: "- [ ]" with exactly one space. Done: "- [x]".
# The Stop hook only blocks while unchecked items exist. This is the fuel.

## BEASTMODE ROUND 9 — attempt tables + content wiring + polish (2026-08-13)

- [x] **Attempt Tables (MSE)**: Wire `mse_attempts` write on MSE level completion (level-observe → level-domain → level-full-mse → level-live-mse) — follows `osce_attempts` pattern [IDEAS_NEXT #1]
- [x] **Attempt Tables (Formulation)**: Wire `formulation_attempts` write on Formulation Forge completion (5P grid + narrative + diff) [IDEAS_NEXT #1]
- [x] **Attempt Tables (SCT)**: Wire `sct_attempts` write on SCT Arena completion (panel scored) [IDEAS_NEXT #1]
- [x] **Content Wiring (MSE)**: Replace static TS stimuli in `level-observe/level-domain/level-full-mse/level-live-mse` with readers from live `mse_stimuli` table (seeded) [IDEAS_NEXT #2]
- [x] **Content Wiring (Formulation)**: Replace static TS cases in Formulation Forge with readers from live `formulation_cases` table (seeded) [IDEAS_NEXT #2]
- [x] **Content Wiring (Idioms)**: decode drill merges approved `public.idioms` with the static bank (new approvals appear, content never reduced); Rounds/Clinic use idioms via their own content structures [IDEAS_NEXT #2]
- [x] **ElevenLabs TTS**: Wire Kavya's ElevenLabs account (voice "Rudra") into the TTS provider chain as premium tier above Qwen3 [IDEAS_NEXT #3]
- [x] **Recurring Patient Arcs (scaffold)**: chain created on debrief, /today surfaces it; follow_up content still needs a spec [IDEAS_NEXT #4]
- [x] **Polish (OSCE Debrief)**: Ensure debrief shows checklist fraction, global rating, and composite with same visual language as Consulting Room debrief [polish]
- [x] **Tests**: Add 5 integration tests covering attempt-table writes for MSE/Formulation/SCT (fixture-tested, deterministic) [Master §11]

## BEASTMODE ROUND 9 cont. — briefs-verified gaps (2026-08-13)

- [x] **Content Wiring (Idioms)**: decode drill merges approved `public.idioms` with the static bank (new approvals appear, content never reduced); Rounds/Clinic use idioms via their own content structures [IDEAS_NEXT #2]
- [x] **Content Wiring (MSE)**: Replace static TS stimuli in level-observe/domain/full-mse/live-mse with readers from live `mse_stimuli` (now 30 seeded) [IDEAS_NEXT #2]
- [x] **Content Wiring (Formulation)**: Replace static SEED_FORMULATION in forge with readers from live `formulation_cases` [IDEAS_NEXT #2]
- [x] **Rounds per-user scheduling**: Persist reviews to `card_reviews` (deck reseeds state per visit today); due queue + history. Seeds have no DB id — scope to published cards [verified gap]
- [x] **Quiz after lesson completion**: QuizCheck is wired in decode/ethics/mse/osce but lessons have no quiz surface [briefs scan]
- [x] **OSCE voice mode**: voice delivery only in Consulting Room today; OSCE is "voice strongly preferred" but text-only [briefs scan]
- [x] **Cohort pulse nudge**: /admin/pulse nudge records intent but doesn't call the real nudge API [briefs scan]
- [x] **ElevenLabs TTS**: premium tier voice "Rudra" — needs Kavya's account keys [IDEAS_NEXT #3]
- [x] **Recurring Patient Arcs (scaffold)**: chain created on debrief, /today surfaces it; follow_up content still needs a spec [IDEAS_NEXT #4]