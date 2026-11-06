import "server-only";
/**
 * Database side shared by the second-wave games. Every call degrades
 * quietly: if the games2 tables (supabase/migrations_pending/2026_11_games2.sql)
 * are missing, reads come back empty and writes are dropped.
 */
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/learn/leaderboard";
import { loadCohortMap } from "@/lib/standing/cohort-map";
import { sameGroup } from "@/lib/standing/boards";
import { isHiddenAccount } from "@/lib/people/hidden";
import { addDays, istToday } from "@/lib/learn/engine";
import { recordAttempts } from "@/lib/learn/model/server";
import type { Attempt } from "@/lib/learn/model/student";
import { accuracyBoard, type AccuracyRow, type ResultRow } from "../boards";

export type Admin = ReturnType<typeof createAdminClient>;

export function adminDb(): Admin | null {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

/** The signed-in person (any role), or null. */
export async function currentUser(): Promise<{ id: string; role: string } | null> {
  try {
    const s = await getSession();
    return s.status === "ok" ? { id: s.profile.id, role: s.profile.role } : null;
  } catch {
    return null;
  }
}

/** Graded answers into the student model (students and alumni only, like the events API). */
export async function gradeAnswers(user: { id: string; role: string }, attempts: Attempt[]): Promise<void> {
  if (user.role !== "student" && user.role !== "alumni") return;
  if (!attempts.length) return;
  try {
    await recordAttempts(user.id, attempts);
  } catch {
    /* model tables missing */
  }
}

export async function saveResult(userId: string, row: { game: string; item: string | null; score: number; right: number; total: number; meta?: Record<string, unknown> }): Promise<boolean> {
  const db = adminDb();
  if (!db) return false;
  try {
    const { error } = await db.from("games2_results").insert({
      user_id: userId,
      game: row.game,
      item: row.item,
      score: Math.min(1, Math.max(0, row.score)),
      right_count: row.right,
      total: row.total,
      meta: row.meta ?? {},
    });
    return !error;
  } catch {
    return false;
  }
}

/** Display names of students in the viewer's cohort(s) (everyone, if not in a cohort). */
export async function cohortNames(me: string | null): Promise<Map<string, string>> {
  const db = adminDb();
  const out = new Map<string, string>();
  if (!db) return out;
  try {
    const [{ data, error }, cohorts] = await Promise.all([db.from("profiles").select("id, name, email, role, is_test").in("role", ["student", "alumni"]).limit(5000), loadCohortMap()]);
    if (error) return out;
    const mine = (me && cohorts.get(me)) || [];
    for (const p of data ?? []) {
      if (isHiddenAccount(p)) continue;
      const id = p.id as string;
      if (id !== me && !sameGroup(mine, cohorts.get(id) ?? [])) continue;
      out.set(id, displayName(p.name as string | null, String(p.email ?? "")));
    }
  } catch {
    /* profiles unreadable */
  }
  return out;
}

/** This week's (last 7 IST days) accuracy board for one game, limited to the viewer's cohort. */
export async function loadAccuracyBoard(game: string, me: string | null): Promise<{ ranked: AccuracyRow[]; mine: AccuracyRow | null; live: boolean }> {
  const db = adminDb();
  if (!db) return { ranked: [], mine: null, live: false };
  try {
    const since = addDays(istToday(), -6);
    const { data, error } = await db.from("games2_results").select("user_id, score, right_count, total, meta, created_at").eq("game", game).gte("created_at", `${since}T00:00:00+05:30`).limit(20000);
    if (error) return { ranked: [], mine: null, live: false };
    const names = await cohortNames(me);
    return { ...accuracyBoard((data ?? []) as ResultRow[], names, me), live: true };
  } catch {
    return { ranked: [], mine: null, live: false };
  }
}
