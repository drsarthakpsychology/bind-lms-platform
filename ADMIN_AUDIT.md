# ADMIN AUDIT — 2026-08-26

Every admin route, its real current state as found in source (not the QUEUE.md
claim), what was fixed, and what was already fine. Test applied to each: would
Kavya, doing this at 11pm, know what to press in two seconds?

## What was wrong (Part 0 finding)

QUEUE.md marked T98 ("Remove unnecessary Rights UI") and T111–T114
("calibration automation") as `[x]` done. Both were false on the live site:

- `/admin/rights` was still fully present (route + nav entry + API).
- `/admin/calibration` was still a manual blind-scoring screen, not automatic.

Root cause: the checkboxes described intent, not shipped behaviour. A scoring
UI shell + agreement dashboard shipped, but that is still a manual scoring
screen — it never automated anything.

---

## Route-by-route

### Removed (this session)

- **`/admin/rights`** — REMOVED entirely. Route, nav entry, `rights-list`
  component, and `/api/admin/rights` all deleted. The `rights_registry` table
  is kept (harmless acquisition-tracking data the two ingest CLIs still write
  `acquired_file`/`sha256` to), but every UI surface and every gating check
  (the `INGESTIBLE_RIGHTS` gate in `layers.ts`, and the gates in `acquire.ts` /
  `fetch-licensed.ts`) came out. Kavya holds the rights to every book — nothing
  is excluded on `rights_status` anymore.

### Fixed (this session)

- **`/admin/calibration`** — no longer requires manual work. Three automatic
  signals now drive it: multi-model consensus, self-consistency variance, and
  passive capture from the review queue. The page shows "Auto: models agree
  X% · self-variance Y" per dimension. The manual scoring list remains as an
  optional tool (for when Dr. Sarthak wants to), not a requirement.

- **`/admin/corpus/dictate`** — stripped to record / transcript / save. The
  schema-shaped `dictate-form` fallback is gone; the only surface is the
  conversation. Added inline transcript editing.

- **`/admin/students`** — fine (single-student create + roster). The bulk
  import (below) was rebuilt.

- **`/admin/tools`** — bulk-import form rebuilt: name+email CSV only, a scope
  selector (Full / Lectures-only), no default-password field. Creates accounts
  via secure set-your-password invite links (never a plaintext password).

### Already fine (verified, no change)

- `/admin` (Overview), `/admin/triage`, `/admin/submissions`,
  `/admin/sim-review`, `/admin/supervision`, `/admin/wall-reports`,
  `/admin/enquiries`, `/admin/checkins`, `/admin/courses`, `/admin/modules`,
  `/admin/cards`, `/admin/idioms`, `/admin/psychopharm-review`,
  `/admin/flags`, `/admin/pulse`, `/admin/infra` — present and wired; each has
  one clear primary action and (per the existing loading-state sweep) a
  page-shaped loading skeleton.

## The two-second test

- `/admin/rights` → gone (404), so the test is moot.
- `/admin/calibration` → now reads "calibration is automatic" up front; the
  two-second action is "look at the agreement/variance summary."
- `/admin/corpus/dictate` → the two-second action is the mic button.
- Roster import → `/admin/tools` → "Import students" (one file, one scope).

## Load-bearing things NOT removed

- `rights_registry` table + seeder + RLS migrations (ingest CLIs write to it).
- `calibration_pairs` / `scoring_corrections` (passive capture + kappa).
- The manual scoring list (kept, but optional).
