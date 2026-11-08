/**
 * Exam Prep's answer history in the shared shape (src/lib/history/order.ts).
 * Prep already keeps a per-question record: prep_answers (last answer, right
 * or wrong) and prep_seen (seen in any mode). This turns those into history
 * rows, so prep pickers follow the same order as every other tool without a
 * second table. Pure.
 */
import { RIGHT_GAPS_DAYS, WRONG_GAP_MS, type HistoryRow } from "@/lib/history/order";
import type { Answers } from "./progress";

const DAY = 86_400_000;

/** `seen`: prep_seen rows (count and last time). Answers win over a bare "seen". */
export function prepHistory(answers: Answers, seen: ReadonlyMap<string, { n: number; at: string | null }> = new Map()): Map<string, HistoryRow> {
  const out = new Map<string, HistoryRow>();
  for (const [item, s] of seen) {
    const at = Date.parse(s.at ?? "");
    out.set(item, { item, seen: Math.max(1, s.n), ok: null, at: Number.isFinite(at) ? at : 0, due: null });
  }
  for (const [item, a] of answers) {
    if (a.ok === null) continue;
    const at = Date.parse(a.at);
    if (!Number.isFinite(at)) continue;
    const n = Math.max(1, a.right + a.wrong, out.get(item)?.seen ?? 0);
    out.set(item, { item, seen: n, ok: a.ok, at, due: a.ok ? at + RIGHT_GAPS_DAYS[Math.min(n, RIGHT_GAPS_DAYS.length) - 1] * DAY : at + WRONG_GAP_MS });
  }
  return out;
}
