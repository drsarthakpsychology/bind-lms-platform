import "server-only";
/**
 * Server side of fresh cases (see ./fresh.ts): what a page needs to arrange
 * a case library for the signed-in viewer, and the hubs' new-case count.
 * Fails open: no history means every case is new.
 */
import { createAdminClient } from "@/lib/supabase/server";
import { toRows, type HistoryRow, type HistoryTool } from "@/lib/history/order";
import { loadHistory, toHistoryRow } from "@/lib/history/server";
import { viewerId } from "@/lib/history/viewer";
import { newCount } from "./fresh";
import { ownerTag, type ProgressSnapshot, type ProgressTool } from "./progress";
import { progressSnapshot } from "./progress-server";

/** Everything a case page passes to its client part (all plain data). */
export type CaseContext = {
  /** A stable tag for the viewer (the weekly set is per student). */
  student: string;
  /** The viewer's history rows for these cases. */
  history: HistoryRow[];
  /** The viewer's saved half-way steps. */
  progress: ProgressSnapshot;
  /** The server's clock, so the server and the browser arrange the same way. */
  now: number;
};

export async function caseContext(tool: HistoryTool, ids: readonly string[], progressTool?: ProgressTool, userId?: string): Promise<CaseContext> {
  const id = userId ?? (await viewerId());
  const [book, progress] = await Promise.all([
    id ? loadHistory(id, tool, ids.length <= 1000 ? ids : undefined) : Promise.resolve({ ready: false, map: new Map<string, HistoryRow>() }),
    progressTool && id ? progressSnapshot(id, progressTool) : Promise.resolve<ProgressSnapshot>({ owner: id ? ownerTag(id) : null, rows: [] }),
  ]);
  return { student: id ? ownerTag(id) : "", history: toRows(book.map), progress, now: Date.now() };
}

/** The request's clock, for server pages (kept out of render bodies). */
export function requestNow(): number {
  return Date.now();
}

/** Many tools' rows in one read. */
async function loadMany(userId: string, tools: readonly HistoryTool[]): Promise<Map<string, Map<string, HistoryRow>>> {
  const out = new Map<string, Map<string, HistoryRow>>(tools.map((t) => [t, new Map()]));
  if (!userId || !tools.length) return out;
  try {
    const db = createAdminClient();
    const { data, error } = await db.from("answer_history").select("tool, item, seen_count, last_correct, last_seen_at, next_due").eq("user_id", userId).in("tool", [...tools]).limit(20000);
    if (error || !Array.isArray(data)) return out;
    for (const r of data as Record<string, unknown>[]) {
      const row = toHistoryRow(r);
      const m = out.get(String(r.tool));
      if (row && m) m.set(row.item, row);
    }
  } catch {
    /* no table yet: everything is new */
  }
  return out;
}

/** How many cases the viewer has never done, across a hub's case tools. */
export async function newCasesIn(userId: string, libraries: readonly { tool: HistoryTool; ids: readonly string[] }[]): Promise<number> {
  const book = await loadMany(userId, [...new Set(libraries.map((l) => l.tool))]);
  return libraries.reduce((n, l) => n + newCount(l.ids, book.get(l.tool) ?? new Map()), 0);
}
