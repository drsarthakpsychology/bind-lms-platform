import "server-only";
/**
 * Hints and quests on Supabase. All counting happens here, never in the
 * browser. See engine.ts for the storage fallbacks (fail closed).
 */
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { istToday, liveStreak, normalise, type LearnState } from "@/lib/learn/engine";
import { sign, verify } from "@/lib/games/token";
import { isMissing } from "@/lib/games/server";
import { awardXp, xpBalance } from "@/lib/leagues/xp";
import { istMidnightUtc } from "@/lib/leagues/week";
import * as core from "./engine";
import type { HintDb, HintStatus } from "./engine";
import { ALL_QUESTS_XP, allDone, isGameSource, QUEST_XP, questProgress, questsFor, type QuestView } from "./quests";
import type { HintRow, Pool } from "./rules";

export type { HintStatus } from "./engine";

const COOKIE = "vibha_hints";

function db() {
  return createAdminClient();
}

type PgErr = { code?: string; message?: string } | null;

function insertResult(error: PgErr): core.Insert {
  if (!error) return "ok";
  if (isMissing(error)) return "missing";
  if (error.code === "23505") return /hint_ledger_item/.test(error.message ?? "") ? "dup-item" : "dup-slot";
  return "error";
}

const supabaseDb: HintDb = {
  async readHints(userId) {
    try {
      const { data, error } = await db().from("hint_ledger").select("day, pool, delta, slot, item, step").eq("user_id", userId).order("created_at", { ascending: false }).limit(5000);
      if (error) return isMissing(error) ? "missing" : "error";
      return {
        rows: (data ?? []).map((r) => ({
          day: String(r.day).slice(0, 10),
          pool: r.pool as Pool | "earn",
          delta: Number(r.delta) || 0,
          slot: String(r.slot),
          item: (r.item as string | null) ?? null,
          step: typeof r.step === "number" ? r.step : null,
        })),
      };
    } catch {
      return "error";
    }
  },
  async insertHint(row) {
    try {
      const { error } = await db().from("hint_ledger").insert({ user_id: row.userId, day: row.day, pool: row.pool, delta: row.delta, slot: row.slot, game: row.game, item: row.item, step: row.step });
      return insertResult(error as PgErr);
    } catch {
      return "error";
    }
  },
  async readLedgerHints(userId) {
    try {
      const { data, error } = await db().from("xp_ledger").select("source, ref, created_at").eq("user_id", userId).in("source", ["hint:slot", "hint:item"]).limit(5000);
      if (error) return isMissing(error) ? "missing" : "error";
      return (data ?? []).map((r) => ({ source: String(r.source), ref: String(r.ref ?? ""), day: istToday(new Date(String(r.created_at))) }));
    } catch {
      return "error";
    }
  },
  async insertLedger(userId, source, amount, ref) {
    try {
      const { error } = await db().from("xp_ledger").insert({ user_id: userId, source, amount, ref });
      if (!error) return "ok";
      if (isMissing(error)) return "missing";
      return (error as PgErr)?.code === "23505" ? "dup" : "error";
    } catch {
      return "error";
    }
  },
  async deleteLedger(userId, source, ref) {
    try {
      await db().from("xp_ledger").delete().eq("user_id", userId).eq("source", source).eq("ref", ref);
    } catch {
      /* best effort */
    }
  },
  async boughtToday(userId, day) {
    try {
      const { data, error } = await db().from("xp_ledger").select("id").eq("user_id", userId).eq("source", "shop:hints_3").eq("ref", day).limit(1);
      return !error && (data?.length ?? 0) > 0;
    } catch {
      return false;
    }
  },
  async xp(userId) {
    try {
      const b = await xpBalance(userId);
      return b.ready ? b.balance : null;
    } catch {
      return null;
    }
  },
  async readSession(userId, day) {
    try {
      const raw = (await cookies()).get(COOKIE)?.value;
      const v = raw ? verify<{ u: string; d: string; i: string[] }>(raw) : null;
      if (!v || v.u !== userId || v.d !== day || !Array.isArray(v.i)) return [];
      return v.i.filter((x) => typeof x === "string").slice(0, 10);
    } catch {
      return [];
    }
  },
  async writeSession(userId, day, items) {
    try {
      (await cookies()).set(COOKIE, sign({ u: userId, d: day, i: items.slice(0, 10) }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 36 });
      return true;
    } catch {
      // Not in a server action (cookies are read-only): no hint can be recorded, so none is given.
      return false;
    }
  },
};

export function hintStatus(userId: string, now = new Date()): Promise<HintStatus> {
  return core.getStatus(supabaseDb, userId, istToday(now));
}

export function spendHint(userId: string, req: { game: string; item: string; step?: number }, now = new Date()) {
  return core.spend(supabaseDb, userId, istToday(now), req);
}

export function buyHints(userId: string, now = new Date()) {
  return core.buy(supabaseDb, userId, istToday(now));
}

/** Hints granted per item key, for keys starting with `prefix` (e.g. "rx:<run>:"). */
export function hintedItems(userId: string, prefix: string, now = new Date()) {
  return core.hintedItems(supabaseDb, userId, istToday(now), prefix);
}

/* -------------------------------------------------------------- quests */

export type QuestCard = { quests: QuestView[]; done: boolean; paid: boolean; spareBonus: number; xpBonus: number };

async function learnState(userId: string): Promise<LearnState | null> {
  try {
    const { data } = await db().from("learn_progress").select("state").eq("user_id", userId).maybeSingle();
    return data ? normalise(data.state) : null;
  } catch {
    return null;
  }
}

async function playedTodaysCase(userId: string, day: string, ledger: { source: string; ref: string | null }[]): Promise<boolean> {
  if (ledger.some((r) => r.source === "daily_case:solved" && r.ref === day)) return true;
  try {
    const { data, error } = await db().from("daily_case_results").select("id").eq("user_id", userId).eq("mode", "daily").eq("day", day).neq("status", "playing").limit(1);
    return !error && (data?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Today's quests with quiet progress, and pay what was earned: 5 XP per quest
 * and, for all three, 10 XP more plus 2 spare hints. Every payout has a
 * unique ref, so loading this twice never pays twice. Also pays the spare
 * hints for keeping the streak and hitting the daily goal.
 */
export async function loadQuests(userId: string, now = new Date()): Promise<QuestCard> {
  const day = istToday(now);
  const ids = questsFor(userId, day);
  const [state, ledger] = await Promise.all([learnState(userId), todaysLedger(userId, day)]);
  const s = state;
  const quests = questProgress(ids, {
    sectionToday: s ? Object.values(s.study.done).includes(day) : false,
    noteToday: s ? Object.values(s.notesRead).includes(day) : false,
    pointsToday: s && s.daily.day === day ? s.daily.xp : 0,
    caseToday: ids.includes("case") ? await playedTodaysCase(userId, day, ledger.rows) : false,
    gameToday: ledger.rows.some((r) => isGameSource(r.source)),
  });
  const done = allDone(quests);
  let paid = false;
  if (ledger.ready) {
    const has = (source: string, ref: string) => ledger.rows.some((r) => r.source === source && r.ref === ref);
    const pays = quests.filter((q) => q.done && !has("quest:done", `${day}:${q.id}`)).map((q) => awardXp(userId, "quest:done", QUEST_XP, `${day}:${q.id}`));
    if (done && !has("quest:all", day)) pays.push(awardXp(userId, "quest:all", ALL_QUESTS_XP, day));
    const res = await Promise.all(pays);
    paid = res.every((r) => r.ok);
  }
  if (s) {
    await core.settleEarnings(supabaseDb, userId, {
      today: day,
      streak: liveStreak(s.streak, day),
      streakKeptToday: s.streak.lastDay === day,
      goalHit: s.daily.day === day && s.daily.goalHit,
      questsDone: done,
    });
  }
  return { quests, done, paid, spareBonus: 2, xpBonus: ALL_QUESTS_XP };
}

async function todaysLedger(userId: string, day: string): Promise<{ rows: { source: string; ref: string | null }[]; ready: boolean }> {
  try {
    const { data, error } = await db().from("xp_ledger").select("source, ref").eq("user_id", userId).gte("created_at", istMidnightUtc(day).toISOString()).limit(500);
    if (error) return { rows: [], ready: false };
    return { rows: (data ?? []).map((r) => ({ source: String(r.source), ref: (r.ref as string | null) ?? null })), ready: true };
  } catch {
    return { rows: [], ready: false };
  }
}

export type { HintRow };
