# Dead-code candidates — first `knip` run (2026-08-14)

`npm run knip` (v6, `--reporter compact`) surfaced unused exported values and
types. Knip is installed as an analysis tool; it does NOT gate the build.
This file records the first-run output so cleanup can be done in targeted,
reviewable slices — NOT a mass delete (some exports are re-export conveniences,
script-only helpers, or used through paths knip can't statically see).

Spot-checked and confirmed genuinely unused (grep across src, no consumers):
- `src/lib/sim/gates.ts: evaluateGate` — no importers outside gates.ts.
- `src/lib/voice/stt.ts: createServerStt / deepgramSttAvailable / createDeepgramStt`
  — no importers (STT route may reference a different entry; verify before removing).
- `src/lib/practice/competency-client.ts: toolScore` — no importers.
- `src/lib/voice/synthesize.ts` re-export `synthesisCacheKey` — consumers import
  from `synthesis-keys` directly; the re-export is dead (safe to drop).

## Unused exported values (~35)
```
src/lib/mse/mse-stories.ts: MSE_CASE_TITLES
src/lib/mse/small-things.ts: readingFor
src/lib/practice/competency-client.ts: toolScore
src/lib/practice/mse.ts: DIAGNOSTIC_TERMS
src/lib/practice/sct.ts: SEED_SCT_ITEMS, makeMoreSctItems
src/lib/practice/streaks.ts: istNow, MAX_GRACE_DAYS
src/lib/psychopharm/draft-seed.ts: KNOWLEDGE_BASE_NOTES
src/lib/psychopharm/equivalences.ts: SGA_EQUIV, BZD_EQUIV
src/lib/psychopharm/forbidden-phrases.ts: ACKNOWLEDGEMENT_TEXT
src/lib/psychopharm/observer-seed.ts: observerChipsSeeder, citesFor
src/lib/psychopharm/p3-seed.ts: p3CitesFor
src/lib/psychopharm/sim/cases.ts: seedCaseByTitle
src/lib/psychopharm/store.ts: drugList, SOURCES
src/lib/sim/delivery.ts: findUnparsedMarkers
src/lib/sim/fixture-patient.ts: hashString
src/lib/sim/gates.ts: evaluateGate
src/lib/sim/moves.ts: MOVE_BY_ID
src/lib/sim/types.ts: TRAPS
src/lib/sim/variation.ts: mulberry32
src/lib/voice/casting.ts: providerVoice
src/lib/voice/stt.ts: createServerStt, deepgramSttAvailable, createDeepgramStt
src/lib/voice/synthesize.ts: synthesisCacheKey (dead re-export)
```

## Unused exported types (17) — most are types used only inside their module or
as casts (knip is conservative); the psychopharm seed types + `sim/types.ts`
export surface look like genuine cruft. Remove only with a consumer grep.

## Guidance
- Treat this as a candidate list, not a mandate. Before deleting any export:
  1. `grep -rn "name" src scripts` — confirm zero consumers.
  2. Check for dynamic `import()` or config references (scripts/psychopharm/**,
     seed scripts) knip ignores.
  3. Prefer removing only values (safe) over types (may be cast-imported).
- Re-run `npm run knip` after each removal slice to confirm the count drops.
