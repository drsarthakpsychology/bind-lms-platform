import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { addDays, normalise } from "@/lib/learn/engine";
import { balanceOf } from "./shop";
import { pointsBetween } from "./data";
import { leagueWeek } from "./week";

/**
 * Server-side XP. Games that score on the server (duels, the daily case,
 * bonus challenges) call awardXp(); the shop spends with negative amounts.
 * Learn XP earned in the browser stays in learn_progress and is not copied
 * here, so nothing is counted twice.
 *
 * Use these sources so milestones can count them:
 */
export const XP_SOURCES = {
  duelWin: "duel:win",
  duelPlayed: "duel:played",
  dailyCase: "daily_case:solved",
  bonus: "bonus:challenge",
} as const;

export type AwardResult = { ok: boolean; duplicate?: boolean; error?: string };

/**
 * Add XP for a student. Pass `ref` (e.g. the duel id or the day) to make it
 * idempotent: the same user + source + ref is only ever stored once.
 * Never throws; returns ok:false if the ledger table isn't there yet.
 */
export async function awardXp(userId: string, source: string, amount: number, ref?: string): Promise<AwardResult> {
  const amt = Math.round(amount);
  if (!userId || !source || !Number.isFinite(amt) || amt === 0 || Math.abs(amt) > 100000) return { ok: false, error: "Bad award." };
  try {
    const { error } = await createAdminClient()
      .from("xp_ledger")
      .insert({ user_id: userId, source: source.slice(0, 80), amount: amt, ref: ref ? ref.slice(0, 120) : null });
    if (error) return (error as { code?: string }).code === "23505" ? { ok: true, duplicate: true } : { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Ledger unavailable." };
  }
}

export type LedgerRow = { source: string; amount: number; ref: string | null; created_at: string };

/** A student's whole ledger (empty if the table is missing). */
export async function loadLedger(userId: string): Promise<{ rows: LedgerRow[]; ready: boolean }> {
  try {
    const { data, error } = await createAdminClient().from("xp_ledger").select("source, amount, ref, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5000);
    if (error) return { rows: [], ready: false };
    return { rows: (data ?? []) as LedgerRow[], ready: true };
  } catch {
    return { rows: [], ready: false };
  }
}

/** Learn XP + ledger: what a student can spend right now. */
export async function xpBalance(userId: string): Promise<{ balance: number; learnXp: number; ledger: LedgerRow[]; ready: boolean }> {
  const admin = createAdminClient();
  const [{ data: learn }, led] = await Promise.all([admin.from("learn_progress").select("state").eq("user_id", userId).maybeSingle(), loadLedger(userId)]);
  const learnXp = normalise(learn?.state ?? null).xp;
  return { balance: balanceOf(learnXp, led.rows), learnXp, ledger: led.rows, ready: led.ready };
}

/** This week's league points for one student (live). */
export async function leaguePointsThisWeek(userId: string, now: Date = new Date()): Promise<number> {
  const week = leagueWeek(now);
  const map = await pointsBetween(createAdminClient(), week, addDays(week, 7), [userId]);
  return map.get(userId)?.total ?? 0;
}
