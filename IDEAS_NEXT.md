# IDEAS NEXT — things thought of but not built

## Built (2026-08-10 sweep)
- **Ethics & Law dilemmas** — /practice/ethics: 6 consequence-first dilemmas (MHA 2017, POCSO, RCI scope)
- **Case Library** — /practice/library: browse + search the 129 normalised PMC docs
- **Supervision log** — /practice/supervision: log contact hours, tag competencies → competency_events
- **Check-in** (non-clinical weekly) — /practice/check-in: 30-sec, aggregate-only for admin
- **Skills Passport** (progress view) — /practice/passport: competency tracker fed by competency_events
- **Ask the Syllabus** — ⌘K command palette in the AppShell (opens via ⌘K/Ctrl+K or sidebar trigger), lexical search over tools, courses, competencies, admin surfaces + case-library docs
- **Check-in aggregate admin view** — /admin/checkins reads checkins_aggregate ONLY (no identifiers)
- **Two-Minute Clinic on the hub** — was dashboard-only; now on /practice too
- **Peer role-play rooms** — /practice/role-play: pair by email, patient/clinician roles, persistent message thread (pair_messages, participant-only RLS)
- **Skills Passport PDF** — /practice/passport "Download passport PDF"; supervision sign-off flow (student requests, /admin/supervision signs/rejects)
- **OSCE station randomisation** — /practice/osce rotates station order daily + "Pick a random station"
- **Weak-spots heatmap** — /practice/weak-spots: consistent gaps across sim debriefs, ranked with a drill-down tool per weak skill
- **Sim debrief → passport** — completing a Consulting Room session credits the mapped competencies (source 'sim') with the score as evidence

## Deferred this session (v5 build, 2026-08-11)
- **CFI Practice mode** (Decoder Mode 4) — the DSM-5 Cultural Formulation Interview drill
- **MSE full rebuild levels** — five-level ladder + small-things checklist + MSE-from-own-transcript (confusable-pairs done)
- **Voice (CosyVoice 2 + emotion mapping)** — needs the NVIDIA key; browser TTS is the zero-cost fallback
- **Corpus fetchers for ICD-11 / mhGAP / NMHS / MHA 2017** — noted in reports as "scaffolds written" but the scripts are NOT in the repo; the PMC + Gutenberg corpus is what actually exists

## New ideas
- Deepgram streaming STT with built-in turn-taking + medical vocabulary for voice
- ElevenLabs pre-generated patient lines cached in R2 (Kavya has an account, voice "Rudra")
- Formulation Wall for anonymised peer critique
- Peer role-play skill-matching algorithm
- Persist attempts from the other practice tools (judgment/MSE/OSCE/rounds/formulation) into competency_events, not just sim + supervision
- Practice-tool attempt persistence (currently in-memory, not written to the attempt tables)
- **A7 Dictate-as-conversation** — Dr. Sarthak talks, Whisper transcribes, an LLM interviewer fills the sim_case spec
- **A5 queue auto-release label** on student-facing AI feedback (the triage side is built)

## Completion-run ideas (2026-08-11, not built)
- **Two-Minute Clinic expansion** — the retention feature needs 60+ prompts with idiom variants (low effort, high impact)
- **Peer role-play skill-matching** — pair students on complementary weak spots (medium, high)
- **Persist judgment/MSE/OSCE/formulation attempts to competency_events** — currently in-memory; wiring feeds the passport
- **Scheduled module release via GitHub Actions cron** (A2 enable_at) — flags table has enable_at but no cron flips it yet
- **`AI_STUDENT_TIER` + `R2_PUBLIC_URL`** — documented in .env.example but never read; wire or drop
- **feature_flags migration file** — table + 17 seed rows exist only in the live DB; reproduce for a fresh project
- **mhGAP/NMHS/POCSO/RCI manual downloads** — the fetchers point at them; NIMHANS/India-Code links need browser downloads
- **Wall pinned Case of the Week UI** — is_pinned + reactions exist; a faculty flow to pin a case is missing
- **Weekly check-in → pulse cross-reference** — activity drop + load spike detection is spec'd but not surfaced
