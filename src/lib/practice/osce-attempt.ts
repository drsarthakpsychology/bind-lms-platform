import type { OsceStation } from "./osce";

/** Shape a self-assessed OSCE attempt for the server persistence route. */
export interface OsceAttemptPayload {
  slug: string;
  mode: "text";
  started_at: string;
  completed_at: string;
  checklist: Array<{ item: string; weight: number; done: boolean }>;
  global_rating: number;
  scores: { checklist_fraction: number; global_rating: number; composite: number };
}

/**
 * Build a persistence payload from a completed station self-assessment.
 * Pure, tested, no network or auth.
 */
export function buildOsceAttemptPayload(
  station: OsceStation,
  checked: Record<string, boolean>,
  globalRating: number,
  startedAt: Date,
  completedAt: Date,
): OsceAttemptPayload {
  const checklist = station.checklist.map((c) => ({
    ...c,
    done: !!checked[c.item],
  }));
  const totalWeight = checklist.reduce((a, c) => a + (c.weight ?? 1), 0);
  const doneWeight = checklist.reduce((a, c) => a + (c.done ? (c.weight ?? 1) : 0), 0);
  const checklistFraction = totalWeight ? doneWeight / totalWeight : 0;
  const normalizedGlobal = station.global_rating.max ? globalRating / station.global_rating.max : 0;
  const composite = Math.round((checklistFraction * 0.6 + normalizedGlobal * 0.4) * 100) / 100;
  return {
    slug: station.id,
    mode: "text",
    started_at: startedAt.toISOString(),
    completed_at: completedAt.toISOString(),
    checklist,
    global_rating: globalRating,
    scores: {
      checklist_fraction: checklistFraction,
      global_rating: normalizedGlobal,
      composite,
    },
  };
}