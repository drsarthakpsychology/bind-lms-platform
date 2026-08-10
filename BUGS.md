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
