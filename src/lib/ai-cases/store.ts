import "server-only";
/**
 * ai_cases + ai_case_flags (migration supabase/migrations_pending/2026_11_ai_cases.sql).
 * Service-role only. Every call copes with the tables being missing: reads
 * come back empty, writes report false.
 */
import { createAdminClient } from "@/lib/supabase/server";
import type { AiCase, AiCaseRecord, AiCaseStatus, Difficulty, Setting } from "./types";

type Db = ReturnType<typeof createAdminClient>;

function db(): Db | null {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

function toRecord(r: Record<string, unknown>): AiCaseRecord | null {
  const data = r.case_data as AiCase | null;
  if (!data || !Array.isArray(data.clues) || data.clues.length !== 6) return null;
  const status = (["live", "flagged", "removed"] as const).includes(r.status as AiCaseStatus) ? (r.status as AiCaseStatus) : "live";
  return { ...data, id: String(r.id), ai: true, status, flags: typeof r.flags === "number" ? r.flags : 0 };
}

const COLS = "id, status, flags, case_data, created_at";

export async function saveAiCase(c: AiCase, provider: string): Promise<boolean> {
  const d = db();
  if (!d) return false;
  try {
    const { error } = await d.from("ai_cases").upsert(
      {
        id: c.id,
        dx: c.answer,
        topic: c.topic,
        difficulty: c.difficulty,
        setting: c.setting,
        status: "live",
        flags: 0,
        case_data: c,
        provider,
        checked_by: c.checkedBy,
        created_at: c.createdAt,
      },
      { onConflict: "id", ignoreDuplicates: true },
    );
    return !error;
  } catch {
    return false;
  }
}

/** Live cases for practice (flagged ones wait for review). */
export async function listLiveCases(f: { dx?: string; topic?: string; difficulty?: Difficulty; setting?: Setting; limit?: number }): Promise<AiCaseRecord[]> {
  const d = db();
  if (!d) return [];
  try {
    let q = d.from("ai_cases").select(COLS).eq("status", "live");
    if (f.dx) q = q.eq("dx", f.dx);
    if (f.topic) q = q.eq("topic", f.topic);
    if (f.difficulty) q = q.eq("difficulty", f.difficulty);
    if (f.setting) q = q.eq("setting", f.setting);
    const { data, error } = await q.order("created_at", { ascending: false }).limit(f.limit ?? 50);
    if (error || !Array.isArray(data)) return [];
    return data.map((r) => toRecord(r as Record<string, unknown>)).filter((x): x is AiCaseRecord => !!x);
  } catch {
    return [];
  }
}

export async function getAiCase(id: string): Promise<AiCaseRecord | null> {
  const d = db();
  if (!d || !id) return null;
  try {
    const { data, error } = await d.from("ai_cases").select(COLS).eq("id", id).maybeSingle();
    if (error || !data) return null;
    return toRecord(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

/** A student says "this seems wrong". One flag per student per case. */
export async function flagAiCase(id: string, userId: string, reason: string): Promise<"ok" | "already" | "unavailable"> {
  const d = db();
  if (!d) return "unavailable";
  try {
    const { error } = await d.from("ai_case_flags").insert({ case_id: id, user_id: userId, reason: reason.slice(0, 500) });
    if (error) return error.code === "23505" ? "already" : "unavailable";
    const { count } = await d.from("ai_case_flags").select("case_id", { count: "exact", head: true }).eq("case_id", id);
    await d.from("ai_cases").update({ flags: count ?? 1 }).eq("id", id);
    // A live case leaves practice until an admin looks at it.
    await d.from("ai_cases").update({ status: "flagged" }).eq("id", id).eq("status", "live");
    return "ok";
  } catch {
    return "unavailable";
  }
}

export async function setAiCaseStatus(id: string, status: AiCaseStatus, adminId: string): Promise<boolean> {
  const d = db();
  if (!d) return false;
  try {
    const { error } = await d
      .from("ai_cases")
      .update({ status, reviewed_by: adminId, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export type ReviewRow = {
  id: string;
  status: AiCaseStatus;
  flags: number;
  createdAt: string;
  case: AiCase;
  reasons: string[];
};

/** Admin review list: flagged first, then live, then removed. */
export async function listForReview(limit = 60): Promise<{ rows: ReviewRow[]; missing: boolean }> {
  const d = db();
  if (!d) return { rows: [], missing: true };
  try {
    const { data, error } = await d.from("ai_cases").select(COLS).order("flags", { ascending: false }).order("created_at", { ascending: false }).limit(limit);
    if (error || !Array.isArray(data)) return { rows: [], missing: true };
    const recs = data.map((r) => toRecord(r as Record<string, unknown>)).filter((x): x is AiCaseRecord => !!x);
    const ids = recs.filter((r) => r.flags > 0).map((r) => r.id);
    const reasons = new Map<string, string[]>();
    if (ids.length) {
      const { data: fl } = await d.from("ai_case_flags").select("case_id, reason").in("case_id", ids).order("created_at", { ascending: false }).limit(300);
      for (const f of fl ?? []) {
        const k = String(f.case_id);
        const list = reasons.get(k) ?? [];
        if (f.reason && list.length < 5) list.push(String(f.reason));
        reasons.set(k, list);
      }
    }
    const order: Record<AiCaseStatus, number> = { flagged: 0, live: 1, removed: 2 };
    const rows = recs
      .map((r) => {
        const { status, flags, ...c } = r;
        return { id: r.id, status, flags, createdAt: r.createdAt, case: c as AiCase, reasons: reasons.get(r.id) ?? [] };
      })
      .sort((a, b) => order[a.status] - order[b.status] || b.flags - a.flags || b.createdAt.localeCompare(a.createdAt));
    return { rows, missing: false };
  } catch {
    return { rows: [], missing: true };
  }
}
