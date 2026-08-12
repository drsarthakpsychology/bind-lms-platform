# VISIBILITY — every practice surface, audited (Bug 4)

Audit date: 2026-08-12. Method: queried `feature_flags`/`courses`/`lessons`
live via Supabase MCP + listed `src/app` routes on disk. A feature that
exists in code but a student cannot reach is NOT SHIPPED.

## Flags before / after

| Flag | Before | After | Route exists | Real data |
|---|---|---|---|---|
| consulting_room | on | on | yes | yes — 8 published cases, authored voices |
| decoder | on | on | yes | yes — 125 idioms |
| mse | on | on | yes | yes — confusable pairs, stimuli |
| judgment | on | on | yes | yes — 197 SCT items |
| rounds | on | on | yes | yes — 11 cards, ts-fsrs |
| journal | on | on | yes | yes — wall + journal |
| **formulation** | **off** | **on** | yes | yes — cases, forge |
| **osce** | **off** | **on** | yes | yes — 12 stations |
| **ethics** | **off** | **on** | yes | yes — 50 dilemmas |
| **case_library** | **off** | **on** | yes | yes — annotated cases |
| **landmark** | **off** | **on** | yes | yes — 25 cases |
| **peer_roleplay** | **off** | **on** | yes | yes — lobby, pair sessions |
| **two_minute_clinic** | **off** | **on** | yes | yes — 116 prompts |
| **supervision** | **off** | **on** | yes | yes — log entries |
| **skills_passport** | **off** | **on** | yes | yes — 11 competencies |
| **weak_spots** | **off** | **on** | yes | yes — drill generation |
| **checkin** | **off** | **on** | yes | yes — aggregate view |
| **modules** | **off** | **on** | yes | yes — module access |

**Root cause of "I can only see 3 tools":** 12 of 18 `feature_flags` rows had
`enabled = false` (Cohort One was seeded with only 6 on — a scope-cut from
the brief). The tools were fully built and on disk; the flags hid them.

**Fix:** flipped all 18 flags on for the cohort (live DB + migration file
`practice_layer_flags.sql` now seeds all true).

## "0 of 1 lessons" — root cause

Counting is NOT broken. The database has exactly **1 lesson** (MSE, ready)
in 1 course (Psychology Cohort 1). `0 of 1 lessons complete` is the truth —
the course needs content, not a counting fix. Action: QUEUE.md gets
"author more lessons" (planned with the corpus pipeline).

## Not built (honest) → QUEUE.md

- Lessons content (1 lesson only)
- 200+ authored characters (Kavya's request — the authored-voice system now
  supports it; volume is the work)
- Voice TTS/STT live (built on fixtures, waits for NVIDIA/Groq keys)
- Corpus acquisition runs (waits for the rights gate / paid titles named)
