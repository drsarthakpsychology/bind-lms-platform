import "server-only";
/**
 * The question bank's per-student record (table prep_answers, see
 * supabase/migrations_pending/2026_11_prep_bank.sql): last answer, right and
 * wrong counts, and the Saved flag. Every call is wrapped: before the table
 * exists, reads say `ready: false` and writes are dropped quietly.
 */
import { createAdminClient } from "@/lib/supabase/server";
import type { AnswerState } from "./progress";

type Admin = ReturnType<typeof createAdminClient>;

function admin(): Admin | null {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

export type AnswerBook = { ready: boolean; map: Map<string, AnswerState> };

const PAGE = 1000;
const MAX_ROWS = 12000;

/** Every bank answer this student has, newest first. */
export async function loadAnswers(userId: string): Promise<AnswerBook> {
  const map = new Map<string, AnswerState>();
  const db = admin();
  if (!db || !userId) return { ready: false, map };
  try {
    for (let from = 0; from < MAX_ROWS; from += PAGE) {
      const { data, error } = await db
        .from("prep_answers")
        .select("item, last_choice, last_ok, right_n, wrong_n, saved, last_at")
        .eq("user_id", userId)
        .order("last_at", { ascending: false })
        .range(from, from + PAGE - 1);
      if (error) return { ready: false, map };
      for (const r of data ?? []) {
        map.set(String(r.item), {
          choice: typeof r.last_choice === "number" ? r.last_choice : null,
          ok: typeof r.last_ok === "boolean" ? r.last_ok : null,
          right: Number(r.right_n) || 0,
          wrong: Number(r.wrong_n) || 0,
          saved: r.saved === true,
          at: String(r.last_at),
        });
      }
      if ((data?.length ?? 0) < PAGE) break;
    }
    return { ready: true, map };
  } catch {
    return { ready: false, map };
  }
}

async function current(db: Admin, userId: string, item: string): Promise<{ right_n: number; wrong_n: number; saved: boolean } | null> {
  const { data, error } = await db.from("prep_answers").select("right_n, wrong_n, saved").eq("user_id", userId).eq("item", item).maybeSingle();
  if (error) throw error;
  return data ? { right_n: Number(data.right_n) || 0, wrong_n: Number(data.wrong_n) || 0, saved: data.saved === true } : null;
}

/** Store one answer. Returns false when the table isn't there yet. */
export async function saveAnswer(userId: string, item: string, choice: number, ok: boolean, now = new Date()): Promise<boolean> {
  const db = admin();
  if (!db || !userId) return false;
  try {
    const had = await current(db, userId, item);
    const { error } = await db.from("prep_answers").upsert(
      { user_id: userId, item, last_choice: choice, last_ok: ok, right_n: (had?.right_n ?? 0) + (ok ? 1 : 0), wrong_n: (had?.wrong_n ?? 0) + (ok ? 0 : 1), saved: had?.saved ?? false, last_at: now.toISOString() },
      { onConflict: "user_id,item" },
    );
    return !error;
  } catch {
    return false;
  }
}

/**
 * Store many answers at once (a submitted mock): one read, one upsert. A
 * question listed twice keeps its last answer. Returns false when the table
 * isn't there yet.
 */
export async function saveAnswers(userId: string, list: readonly { item: string; choice: number; ok: boolean }[], now = new Date()): Promise<boolean> {
  const db = admin();
  const last = new Map(list.filter((a) => a.item && Number.isInteger(a.choice) && a.choice >= 0 && a.choice <= 3).map((a) => [a.item, a]));
  if (!db || !userId || !last.size) return false;
  try {
    const items = [...last.keys()].slice(0, 300);
    const { data, error } = await db.from("prep_answers").select("item, right_n, wrong_n, saved").eq("user_id", userId).in("item", items);
    if (error) return false;
    const had = new Map((data ?? []).map((r) => [String(r.item), { right_n: Number(r.right_n) || 0, wrong_n: Number(r.wrong_n) || 0, saved: r.saved === true }]));
    const rows = items.map((item) => {
      const a = last.get(item)!;
      const h = had.get(item);
      return { user_id: userId, item, last_choice: a.choice, last_ok: a.ok, right_n: (h?.right_n ?? 0) + (a.ok ? 1 : 0), wrong_n: (h?.wrong_n ?? 0) + (a.ok ? 0 : 1), saved: h?.saved ?? false, last_at: now.toISOString() };
    });
    const { error: upErr } = await db.from("prep_answers").upsert(rows, { onConflict: "user_id,item" });
    return !upErr;
  } catch {
    return false;
  }
}

/** Save or unsave a question. A question saved before it is answered keeps no answer. */
export async function setSaved(userId: string, item: string, saved: boolean, now = new Date()): Promise<boolean> {
  const db = admin();
  if (!db || !userId) return false;
  try {
    const had = await current(db, userId, item);
    if (had) {
      const { error } = await db.from("prep_answers").update({ saved, saved_at: saved ? now.toISOString() : null }).eq("user_id", userId).eq("item", item);
      return !error;
    }
    if (!saved) return true;
    const { error } = await db.from("prep_answers").insert({ user_id: userId, item, saved: true, saved_at: now.toISOString(), last_at: now.toISOString() });
    return !error;
  } catch {
    return false;
  }
}
