# Performance Auditing

## Core Web Vitals (2025/2026, 75th percentile field data)

- **LCP** ≤ 2.5s good / >4s poor
- **INP** ≤ 200ms good / >500ms poor
- **CLS** ≤ 0.1 good / >0.25 poor

Field data (CrUX) beats lab. INP cannot be fully measured in a lab. If no field
data (low traffic), fall back to Lighthouse lab and say so explicitly.

## Postgres

Enable `pg_stat_statements` (`shared_preload_libraries`). Then:

```sql
-- slow queries
SELECT query, calls, mean_exec_time, rows
FROM pg_stat_statements
ORDER BY mean_exec_time * calls DESC LIMIT 10;

-- missing indexes (high seq_tup_read + low idx_scan on a large table)
SELECT schemaname, relname, seq_scan, seq_tup_read, idx_scan, n_live_tup
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC;

-- unused indexes (cost writes; consider dropping)
SELECT indexrelname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan = 0;
```

- Rule of thumb: any table >100MB with >10% sequential-scan access warrants
  investigation. Use `seq_tup_read` (rows), not just `seq_scan` (events).
- Confirm with `EXPLAIN (ANALYZE, BUFFERS) <query>;` — read `Filter:` and
  `Sort:` as index candidates.
- Keep statistics fresh (autovacuum/ANALYZE); stale `pg_statistic` causes
  seq-scan plans despite good indexes.
- On SSD, lower `random_page_cost` to ~1.1.

### RLS + performance (top killer)

- **Always index columns referenced in RLS policies.**
- Wrap auth functions as `(select auth.uid())` to prevent per-row
  re-evaluation (a bare `auth.uid()` call can be evaluated per row).

## Frontend

- Bundle analysis (`@next/bundle-analyzer`), code splitting.
- Minimize client components / hydration cost; re-render analysis.
- Unoptimized images, blocking resources, missing caching, N+1 queries,
  unbounded queries (no LIMIT), over-fetching (`select *`), missing pagination.

Tooling: Lighthouse CI, WebPageTest, PageSpeed Insights / CrUX. Note Lighthouse
13 renamed some audit IDs (e.g. `layout-shifts` → `cls-culprits-insight`).
