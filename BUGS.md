# BUGS — Lumen Practice Layer

`ID | Sev | Feature | Symptom | Repro | Status | Fix commit`
Log bugs even when fixed minutes later.

| ID | Sev | Feature | Symptom | Repro | Status | Fix commit |
|---|---|---|---|---|---|---|
| 1 | MED | AI client | tsc: `opts.capability` compared to `"smart"` with no overlap | Build after slice A | Fixed | 0207707 |
| 2 | MED | Migrations | z.record needs 2 args (Zod v4) | tsc after corpus slice | Fixed | f2bdab3 |
| 3 | HIGH | Voice | react-hooks purity: `Date.now()` in render (useVoiceMetrics) | lint after slice C | Fixed | 57b524b |
| 4 | MED | Voice | setState in effect (availability init) — react-hooks rule | lint after slice C | Fixed | 57b524b |
| 5 | MED | Rounds | ts-fsrs API mismatch (createEmptyCard standalone, repeat returns keyed map) | tests after slice E | Fixed | bc2855e |
| 6 | MED | Streaks | gap logic allowed grace to cover multi-day gaps (rule violated) | tests after slice E | Fixed | bc2855e |
| 7 | MED | Corpus/PMC | OA API `format` params + ftp/https 404s | fetch after slice D | Fixed | f2bdab3 |
| 8 | LOW | Formulation | seed factors inferred `bucket: string` not the union | tsc after slice F | Fixed | 16cb463 |
| 9 | MED | Journal/Wall | unused `userId` props (server resolves auth) | lint after slice G | Fixed | 41afdcc |
| 10 | MED | Practice page | `/practice/wall` dead link (route at `/wall`); Layers/FlaskConical/BookOpen/CircleCheck icon dupes; "ONE TAP"/"WATCH" not verb words | audit 2026-08-11 | Fixed | 7a0fa6f |
| 11 | MED | MSE | duplicate `MULTI_TERM_DRILLS` declaration + `scoreMultiTerm` typed without `prompt` | tsc after L3 expand | Fixed | 8fefa81 |
| 12 | MED | Ethics | new dilemmas had 2 options → failed ≥3 test | test after expansion | Fixed | feea61d |
| 13 | MED | Flags | non-async pages got `await requireFeature` → async conversion needed | tsc after gating | Fixed | 7a0fa6f |
| 14 | LOW | flags.ts | duplicated `import "server-only"` | lint sweep | Fixed | 7a0fa6f |
| 15 | MED | Infra | `ADD CONSTRAINT IF NOT EXISTS` is MySQL-only → DO-block | applying migration live | Fixed | 4a4d320 |
| 16 | MED | Voice | hand-rolled SigV4 broken → AWS SDK putR2 | pregen/synth test | Fixed | 90c9c49 |
| 17 | MED | Voice | `server-only` import blocked pregen script → shared synthesis-keys module | pregen dry-run | Fixed | 90c9c49 |
| 18 | MED | Corpus | lessons uses `video_status` not `is_published` (draft-cards failed) | live run | Fixed | 823e1eb |
| 19 | LOW | Wall | anonymous posts/replies invisible to students (row-hiding policy) — privacy UX fix via `*_visible` views | audit | Fixed | ff15d15 |
| 20 | MED | Calibration | scaffold copy bug in weightedKappa first pass (assertion 0.6 vs <0.5) — corrected with realistic near-random fixture | tests | Fixed | 71a8147 |

Open: 0.
