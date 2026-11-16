import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { liveStreak, type LearnState } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";
import { xpBalance } from "./xp";
import { leagueWeek } from "./week";
import { canRepair, isLookId, type LookId } from "./shop";
import { loadLearnState } from "@/app/(dashboard)/study/actions";

/**
 * What the XP shop starts with for the signed-in student: balance, streak,
 * whether a repair is possible this week, the looks they own and wear.
 * One read for the website's shop page and the app.
 */
export async function loadShop(userId: string): Promise<{
  ready: boolean;
  balance: number;
  streak: { count: number; alive: boolean };
  repair: { ok: boolean; text: string };
  owned: LookId[];
  look: string | null;
  learn: LearnState | null;
}> {
  const admin = createAdminClient();
  const today = istToday();
  const week = leagueWeek();
  const [bal, learn, used, profile] = await Promise.all([
    xpBalance(userId),
    loadLearnState(),
    admin.from("streak_repairs").select("week").eq("user_id", userId).eq("week", week).maybeSingle(),
    admin.from("profiles").select("look").eq("id", userId).maybeSingle(),
  ]);
  const streak = learn?.streak ?? { count: 0, best: 0, lastDay: null, freezes: 0 };
  const repair = canRepair(streak, today, Boolean(used.data));
  const owned = bal.ledger.filter((r) => r.source === "shop:look" && r.ref && isLookId(r.ref)).map((r) => r.ref as LookId);
  return {
    ready: bal.ready && !used.error,
    balance: bal.balance,
    streak: { count: streak.count, alive: liveStreak(streak, today) > 0 },
    repair: repair.ok ? { ok: true, text: `Brings back your ${repair.count}-day streak.` } : { ok: false, text: repair.reason },
    owned,
    look: (profile.data?.look as string | null) ?? null,
    learn,
  };
}
