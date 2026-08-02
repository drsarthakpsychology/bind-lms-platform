# Decision Log

| ts | rule | decision |
|---|---|---|
| 2026-08-02T23:25 | Pass 0 | Built locator index — 73 drugs, 10 sources; 18 monograph source read |
| 2026-08-02T23:25 | Pass 1 | Stahl 7th monographs → deterministic draft rows (quote-first) |
| 2026-08-02T23:25 | Rule 2 | Clonazepam 0.5–2 (Stahl) vs 0.5–3 (Maudsley) = PARTIAL, union stored |
| 2026-08-02T23:25 | Rule 20 | Supabase apply deferred — DB connection unavailable (timeout) |
