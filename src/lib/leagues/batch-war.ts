/**
 * The monthly batch war (owner decision 37): each cohort's average league
 * points per ACTIVE student this month, so a big batch can't win on size and
 * idle students don't drag a batch down. Pure.
 */

export type WarEntry = { cohortId: string; name: string; active: number; members: number; total: number; average: number };

export function batchWar(cohorts: readonly { id: string; name: string }[], memberIds: ReadonlyMap<string, readonly string[]>, monthPoints: ReadonlyMap<string, number>): WarEntry[] {
  return cohorts
    .map((c) => {
      const ids = memberIds.get(c.id) ?? [];
      const active = ids.filter((id) => (monthPoints.get(id) ?? 0) > 0);
      const total = active.reduce((a, id) => a + (monthPoints.get(id) ?? 0), 0);
      return { cohortId: c.id, name: c.name, active: active.length, members: ids.length, total, average: active.length ? Math.round(total / active.length) : 0 };
    })
    .filter((e) => e.members > 0)
    .sort((a, b) => b.average - a.average || b.active - a.active || a.name.localeCompare(b.name));
}
