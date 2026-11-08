import "server-only";
/**
 * Answer history, database side (table answer_history, see
 * supabase/migrations_pending/2026_11_answer_history.sql). Writes use the
 * service role from server code only. Every call fails open: if the table is
 * missing or a query fails, reads come back empty (`ready: false`) and writes
 * are dropped, so every tool still works in its plain random order.
 *
 * Exam Prep keeps its own per-question record (prep_answers and prep_seen);
 * its history is read from there (src/lib/prep/history.ts), not from here.
 */
import { createAdminClient } from "@/lib/supabase/server";
import { cleanItem, isHistoryTool, nextRow, orderByHistory, seededRng, type History, type HistoryRow, type HistoryTool } from "./order";

const TABLE = "answer_history";
const MAX_READ = 5000;
const MAX_WRITE = 100;

type Admin = ReturnType<typeof createAdminClient>;

function admin(): Admin | null {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

const ms = (v: unknown): number | null => {
  if (typeof v !== "string" && typeof v !== "number") return null;
  const t = typeof v === "number" ? v : Date.parse(v);
  return Number.isFinite(t) ? t : null;
};

export function toHistoryRow(r: Record<string, unknown>): HistoryRow | null {
  const item = cleanItem(r.item);
  const at = ms(r.last_seen_at);
  if (!item || at === null) return null;
  const seen = Number(r.seen_count);
  return { item, seen: Number.isFinite(seen) && seen > 0 ? Math.floor(seen) : 1, ok: r.last_correct === true ? true : r.last_correct === false ? false : null, at, due: ms(r.next_due) };
}

export type HistoryBook = { ready: boolean; map: Map<string, HistoryRow> };

/** One student's history in one tool. `items` limits the read to those ids. */
export async function loadHistory(userId: string, tool: HistoryTool, items?: readonly string[]): Promise<HistoryBook> {
  const map = new Map<string, HistoryRow>();
  const db = admin();
  if (!db || !userId || !isHistoryTool(tool)) return { ready: false, map };
  try {
    let q = db.from(TABLE).select("item, seen_count, last_correct, last_seen_at, next_due").eq("user_id", userId).eq("tool", tool);
    if (items) {
      const list = [...new Set(items.map(cleanItem).filter((x): x is string => !!x))].slice(0, 1000);
      if (!list.length) return { ready: true, map };
      q = q.in("item", list);
    }
    const { data, error } = await q.order("last_seen_at", { ascending: false }).limit(MAX_READ);
    if (error || !Array.isArray(data)) return { ready: false, map };
    for (const r of data as Record<string, unknown>[]) {
      const row = toHistoryRow(r);
      if (row) map.set(row.item, row);
    }
    return { ready: true, map };
  } catch {
    return { ready: false, map };
  }
}

export type Answered = { item: string; correct: boolean | null };

/**
 * Record answers (one row per student, tool and item; a repeat updates the
 * row). The same item twice in one call counts once, with its last answer.
 * Returns false when nothing could be stored.
 */
export async function recordHistory(userId: string, tool: HistoryTool, answers: readonly Answered[], now = new Date()): Promise<boolean> {
  if (!userId || !isHistoryTool(tool)) return false;
  const last = new Map<string, boolean | null>();
  for (const a of answers) {
    const item = cleanItem(a?.item);
    if (item) last.set(item, a.correct === true ? true : a.correct === false ? false : null);
  }
  const list = [...last.keys()].slice(0, MAX_WRITE);
  if (!list.length) return false;
  const db = admin();
  if (!db) return false;
  try {
    const { data, error } = await db.from(TABLE).select("item, seen_count, last_correct, last_seen_at, next_due").eq("user_id", userId).eq("tool", tool).in("item", list);
    if (error) return false;
    const had = new Map<string, HistoryRow>();
    for (const r of (data ?? []) as Record<string, unknown>[]) {
      const row = toHistoryRow(r);
      if (row) had.set(row.item, row);
    }
    const t = now.getTime();
    const rows = list.map((item) => {
      const n = nextRow(had.get(item), item, last.get(item) ?? null, t);
      return { user_id: userId, tool, item, seen_count: n.seen, last_correct: n.ok, last_seen_at: new Date(n.at).toISOString(), next_due: n.due === null ? null : new Date(n.due).toISOString() };
    });
    const { error: upErr } = await db.from(TABLE).upsert(rows, { onConflict: "user_id,tool,item" });
    return !upErr;
  } catch {
    return false;
  }
}

/** One answer (see recordHistory). */
export function record(userId: string, tool: HistoryTool, itemId: string, correct: boolean | null, now = new Date()): Promise<boolean> {
  return recordHistory(userId, tool, [{ item: itemId, correct }], now);
}

/** A fresh seed per request (never during render). */
export function requestRng(userId: string, now = Date.now()): () => number {
  let h = 2166136261;
  for (let i = 0; i < userId.length; i++) h = Math.imul(h ^ userId.charCodeAt(i), 16777619);
  return seededRng((now ^ h ^ Math.floor(Math.random() * 2 ** 31)) >>> 0);
}

/**
 * The candidates in history order: never seen first, then wrong ones once
 * due, then right ones (oldest first). Without a history (table missing, no
 * user) it is a plain random order.
 */
export async function order(userId: string, tool: HistoryTool, candidateIds: readonly string[], opts: { rng?: () => number; now?: Date; history?: History } = {}): Promise<string[]> {
  const now = opts.now ?? new Date();
  const rng = opts.rng ?? requestRng(userId, now.getTime());
  const history = opts.history ?? (userId ? (await loadHistory(userId, tool, candidateIds.length <= 1000 ? candidateIds : undefined)).map : new Map());
  return orderByHistory(candidateIds, (x) => x, history, now.getTime(), rng);
}
