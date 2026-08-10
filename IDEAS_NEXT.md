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

## Deferred this session (have migrations, no UI)
- **Peer role-play rooms** — pair_sessions table exists, no UI (needs a messages table + matching flow)
- **Skills Passport PDF** — certificate evidence appendix (pdf-lib + generateCertificatePdf exist; needs the admin sign-off flow driving it)
- **Corpus fetchers for ICD-11 / mhGAP / NMHS / MHA 2017** — scaffolds written, not run (PMC + Gutenberg done)

## New ideas
- Deepgram streaming STT with built-in turn-taking + medical vocabulary for voice
- ElevenLabs pre-generated patient lines cached in R2 (Kavya has an account, voice "Rudra")
- Weak-spots heatmap drilling into the lesson for each weak topic
- Formulation Wall for anonymised peer critique
- OSCE station randomisation for timed exam practice
- Peer role-play skill-matching algorithm
- Retroactive competency-event import from psychopharm tool usage
