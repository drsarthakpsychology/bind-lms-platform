/**
 * Cohort boards for the second-wave games (pure, so the ranking rules are
 * unit-tested). Rows come from games2_results.
 */
export type ResultRow = { user_id: string; score: number; right_count: number | null; total: number | null; meta: Record<string, unknown> | null; created_at: string };

export type AccuracyRow = { userId: string; name: string; accuracy: number; tags: number; bestStreak: number; rounds: number; me: boolean; rank: number };

/** Players need at least this many graded tags this week to be ranked (one lucky round can't top the board). */
export const MIN_TAGS = 12;

/**
 * Accuracy board: this week's points scored ÷ points possible, best accuracy
 * streak as the tie-break. People under MIN_TAGS are left off (except "me",
 * who is shown unranked so they know how close they are).
 */
export function accuracyBoard(rows: ResultRow[], names: Map<string, string>, me: string | null): { ranked: AccuracyRow[]; mine: AccuracyRow | null } {
  const by = new Map<string, { got: number; total: number; streak: number; rounds: number }>();
  for (const r of rows) {
    const total = Math.max(0, Number(r.total ?? 0));
    if (!total) continue;
    const got = Math.min(total, Math.max(0, Number(r.score) * total));
    const streak = Number((r.meta ?? {}).streak ?? 0);
    const cur = by.get(r.user_id) ?? { got: 0, total: 0, streak: 0, rounds: 0 };
    cur.got += got;
    cur.total += total;
    cur.rounds += 1;
    cur.streak = Math.max(cur.streak, Number.isFinite(streak) ? Math.min(streak, 500) : 0);
    by.set(r.user_id, cur);
  }
  const all = [...by.entries()]
    .filter(([id]) => names.has(id) || id === me)
    .map(([id, v]) => ({ userId: id, name: names.get(id) ?? "You", accuracy: v.total ? Math.round((v.got / v.total) * 100) : 0, tags: v.total, bestStreak: v.streak, rounds: v.rounds, me: id === me, rank: 0 }));
  const ranked = all
    .filter((r) => r.tags >= MIN_TAGS)
    .sort((a, b) => b.accuracy - a.accuracy || b.bestStreak - a.bestStreak || b.tags - a.tags || a.name.localeCompare(b.name))
    .map((r, i) => ({ ...r, rank: i + 1 }));
  const mine = ranked.find((r) => r.me) ?? all.find((r) => r.me) ?? null;
  return { ranked, mine };
}
