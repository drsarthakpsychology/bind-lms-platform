import "server-only";
/**
 * Saved progress, database side (see ./progress.ts). Service role from
 * server code only. Fails open: no table, no `state` column or a failed
 * query means no saved steps on the server (the browser copy still works)
 * and dropped writes.
 */
import { createAdminClient } from "@/lib/supabase/server";
import { cleanItem } from "@/lib/history/order";
import { cleanState, isProgressTool, ownerTag, progressKey, type ProgressRow, type ProgressSnapshot, type ProgressTool } from "./progress";

const TABLE = "answer_history";

function admin() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

/** One student's saved steps in one tool. */
export async function loadProgress(userId: string, tool: ProgressTool): Promise<ProgressRow[]> {
  const db = admin();
  if (!db || !userId || !isProgressTool(tool)) return [];
  try {
    const { data, error } = await db.from(TABLE).select("item, state, last_seen_at").eq("user_id", userId).eq("tool", progressKey(tool)).order("last_seen_at", { ascending: false }).limit(200);
    if (error || !Array.isArray(data)) return [];
    const out: ProgressRow[] = [];
    for (const r of data as Record<string, unknown>[]) {
      const item = cleanItem(r.item);
      const at = typeof r.last_seen_at === "string" ? Date.parse(r.last_seen_at) : NaN;
      if (!item || !Number.isFinite(at)) continue;
      out.push({ item, state: r.state ?? null, at });
    }
    return out;
  } catch {
    return [];
  }
}

/** For server pages: the viewer's saved steps, tagged with whose they are. */
export async function progressSnapshot(userId: string, tool: ProgressTool): Promise<ProgressSnapshot> {
  if (!userId) return { owner: null, rows: [] };
  return { owner: ownerTag(userId), rows: await loadProgress(userId, tool) };
}

/** Save (or, with `state` null, clear) one case's step. */
export async function saveProgress(userId: string, tool: ProgressTool, itemId: string, state: unknown, now = new Date()): Promise<boolean> {
  const item = cleanItem(itemId);
  if (!userId || !item || !isProgressTool(tool)) return false;
  const clean = state === null ? null : cleanState(state);
  if (clean === undefined) return false;
  const db = admin();
  if (!db) return false;
  try {
    const { error } = await db
      .from(TABLE)
      .upsert({ user_id: userId, tool: progressKey(tool), item, seen_count: 1, last_correct: null, last_seen_at: now.toISOString(), next_due: null, state: clean }, { onConflict: "user_id,tool,item" });
    return !error;
  } catch {
    return false;
  }
}
