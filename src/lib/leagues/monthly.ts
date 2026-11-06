import { tierName } from "./tiers";

/**
 * Who the monthly job rewards (owner decision 38). Pure, so it is tested.
 * - Merit certificate: the top 3 places of each cohort by the month's league
 *   points (ties share a place, so a tie for 3rd gets two certificates).
 *   Nobody with 0 points.
 * - Champion title: the student with the most points in each tier
 *   ("Cortex Champion · Nov 2026"); ties share it.
 */
export const MERIT_PLACES = 3;

export function meritWinners(memberIds: ReadonlyMap<string, readonly string[]>, points: ReadonlyMap<string, number>, places = MERIT_PLACES): Map<string, { cohortId: string; place: number; points: number }> {
  const out = new Map<string, { cohortId: string; place: number; points: number }>();
  for (const [cohortId, ids] of memberIds) {
    const ranked = [...new Set(ids)].map((id) => ({ id, p: points.get(id) ?? 0 })).filter((r) => r.p > 0).sort((a, b) => b.p - a.p || a.id.localeCompare(b.id));
    let place = 0;
    let last = Number.NaN;
    ranked.forEach((r, i) => {
      if (r.p !== last) place = i + 1;
      last = r.p;
      if (place <= places && !out.has(r.id)) out.set(r.id, { cohortId, place, points: r.p });
    });
  }
  return out;
}

export function championTitle(tier: number, monthLabel: string): string {
  return `${tierName(tier)} Champion · ${monthLabel}`;
}

export function champions(tiers: ReadonlyMap<string, number>, points: ReadonlyMap<string, number>): Map<string, number> {
  const best = new Map<number, number>();
  for (const [id, t] of tiers) best.set(t, Math.max(best.get(t) ?? 0, points.get(id) ?? 0));
  const out = new Map<string, number>();
  for (const [id, t] of tiers) {
    const p = points.get(id) ?? 0;
    if (p > 0 && p === best.get(t)) out.set(id, t);
  }
  return out;
}
