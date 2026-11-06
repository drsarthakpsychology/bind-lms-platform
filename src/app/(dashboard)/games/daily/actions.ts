"use server";

import { istToday } from "@/lib/learn/engine";
import { CASES, caseById } from "@/lib/games/daily/cases";
import {
  apply,
  cleanLog,
  dailyIndex,
  dailyStreak,
  FREE_HINTS_PER_DAY,
  HINT_XP_COST,
  pickPractice,
  pointsUsed,
  replay,
  scoreOf,
  summariseCohort,
  targetDifficulty,
  xpFor,
  type Action,
  type CohortStats,
  type PracticeRecord,
} from "@/lib/games/daily/engine";
import { buildView, type CaseView } from "@/lib/games/daily/view";
import { admin, cohortPeers, currentPlayer, isMissing, learnXp } from "@/lib/games/server";
import type { DailyCase } from "@/lib/games/daily/types";
import { flagAiCase, getAiPracticeCase, loadAiCase } from "@/lib/ai-cases";
import { AI_TOPICS } from "@/lib/ai-cases/criteria";
import { rateLimit } from "@/lib/rate-limit";

export type DailyMeta = {
  day: string;
  /** Case number shown to players ("Case #6"). */
  number: number;
  streak: number;
  playedDays: string[];
  freeHintsLeft: number;
  hintCost: number;
  spendableXp: number;
  cohort: (CohortStats & { scope: "batch" | "everyone" }) | null;
  /** False when results can't be saved yet (table missing): the browser keeps them. */
  stored: boolean;
};

export type MoveResult =
  | { ok: true; view: CaseView; meta: DailyMeta; log: Action[]; justFinished: boolean; xp: number }
  | { ok: false; error: string };

const LAUNCH = "2026-11-01";
const TABLE = "daily_case_results";

function caseNumber(day: string) {
  return Math.max(1, Math.round((Date.parse(day) - Date.parse(LAUNCH)) / 86400000) + 1);
}

function todaysCase(day: string) {
  return CASES[dailyIndex(day, CASES.length)];
}

type Row = { log: unknown; hints: number; xp_spent: number; status: string };

async function loadRow(userId: string, mode: string, day: string, caseId: string): Promise<{ row: Row | null; stored: boolean }> {
  try {
    const { data, error } = await admin().from(TABLE).select("log, hints, xp_spent, status").eq("user_id", userId).eq("mode", mode).eq("day", day).eq("case_id", caseId).maybeSingle();
    if (error) return { row: null, stored: !isMissing(error) };
    return { row: (data as Row | null) ?? null, stored: true };
  } catch {
    return { row: null, stored: false };
  }
}

async function hintsToday(userId: string, day: string): Promise<{ used: number; spentAll: number }> {
  try {
    const db = admin();
    const [{ data: today }, { data: all }] = await Promise.all([
      db.from(TABLE).select("hints").eq("user_id", userId).eq("day", day),
      db.from(TABLE).select("xp_spent").eq("user_id", userId).gt("xp_spent", 0).limit(5000),
    ]);
    return {
      used: (today ?? []).reduce((a, r) => a + ((r.hints as number) ?? 0), 0),
      spentAll: (all ?? []).reduce((a, r) => a + ((r.xp_spent as number) ?? 0), 0),
    };
  } catch {
    return { used: 0, spentAll: 0 };
  }
}

async function meta(userId: string, day: string, stored: boolean, withCohort: boolean): Promise<DailyMeta> {
  const base: DailyMeta = { day, number: caseNumber(day), streak: 0, playedDays: [], freeHintsLeft: FREE_HINTS_PER_DAY, hintCost: HINT_XP_COST, spendableXp: 0, cohort: null, stored };
  const xpP = learnXp(userId);
  if (!stored) return { ...base, spendableXp: await xpP };
  try {
    const db = admin();
    const [{ data: days }, hints, xp] = await Promise.all([
      db.from(TABLE).select("day").eq("user_id", userId).eq("mode", "daily").neq("status", "playing").order("day", { ascending: false }).limit(400),
      hintsToday(userId, day),
      xpP,
    ]);
    const playedDays = (days ?? []).map((r) => String(r.day));
    const out: DailyMeta = {
      ...base,
      playedDays,
      streak: dailyStreak(playedDays, day),
      freeHintsLeft: Math.max(0, FREE_HINTS_PER_DAY - hints.used),
      spendableXp: Math.max(0, xp - hints.spentAll),
    };
    if (withCohort) {
      const peers = await cohortPeers(userId);
      let q = db.from(TABLE).select("status, clues, score").eq("mode", "daily").eq("day", day).neq("status", "playing").limit(5000);
      if (peers) q = q.in("user_id", peers);
      const { data: rows } = await q;
      const stats = summariseCohort((rows ?? []).map((r) => ({ status: String(r.status), clues: Number(r.clues), score: Number(r.score) })));
      out.cohort = { ...stats, scope: peers ? "batch" : "everyone" };
    }
    return out;
  } catch {
    return base;
  }
}

/**
 * Play one move (or just load, when `action` is missing). The server replays
 * the stored log; the browser's log is used only when nothing can be stored.
 */
export async function dailyMove(input: { mode: "daily" | "practice"; caseId?: string; log?: unknown; action?: Action }): Promise<MoveResult> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  const day = istToday();
  const daily = todaysCase(day);
  const mode = input.mode === "practice" ? "practice" : "daily";
  // AI cases ("ai-…") play in practice mode only, through the same engine.
  const isAi = mode === "practice" && typeof input.caseId === "string" && input.caseId.startsWith("ai-");
  let c: DailyCase | undefined;
  if (mode === "daily") c = daily;
  else if (isAi) c = (await loadAiCase(input.caseId!))?.daily;
  else if (input.caseId) c = caseById(input.caseId);
  if (!c) return { ok: false, error: "That case isn't available." };
  if (mode === "practice" && c.id === daily.id) return { ok: false, error: "That's today's daily case. Play it from the Daily tab." };

  const { row, stored } = await loadRow(me.id, mode, day, c.id);
  const baseLog = stored ? cleanLog(row?.log ?? []) : cleanLog(input.log);
  const before = replay(c, baseLog);
  let progress = before.progress;
  let log = before.log;
  let spent = row?.xp_spent ?? 0;

  if (input.action) {
    const action = cleanLog([input.action])[0];
    if (!action) return { ok: false, error: "That move isn't allowed." };
    if (action.t === "hint" && stored && progress.status === "playing") {
      const h = await hintsToday(me.id, day);
      if (h.used >= FREE_HINTS_PER_DAY) {
        const spendable = (await learnXp(me.id)) - h.spentAll;
        if (spendable < HINT_XP_COST) return { ok: false, error: `You've used today's free hints. Another costs ${HINT_XP_COST} XP and you have ${Math.max(0, spendable)} to spend.` };
        spent += HINT_XP_COST;
      }
    }
    const next = apply(c, progress, action);
    if (next !== progress) {
      progress = next;
      log = [...log, action];
    } else if (action.t === "hint") {
      spent = row?.xp_spent ?? 0;
    }
  }

  const justFinished = before.progress.status === "playing" && progress.status !== "playing";
  const score = scoreOf(progress);
  const xp = justFinished ? xpFor(mode, score) : 0;

  if (stored && (input.action || !row)) {
    try {
      const now = new Date().toISOString();
      const { error } = await admin()
        .from(TABLE)
        .upsert(
          {
            user_id: me.id,
            mode,
            day,
            case_id: c.id,
            log,
            status: progress.status,
            clues: progress.clues,
            points: pointsUsed(progress),
            score,
            hints: progress.hints,
            xp_spent: spent,
            ...(justFinished ? { xp_earned: xp, finished_at: now } : {}),
            updated_at: now,
          },
          { onConflict: "user_id,mode,day,case_id" },
        );
      if (error) console.warn("dailyMove: save failed:", error.message);
    } catch (e) {
      console.warn("dailyMove: save failed:", e instanceof Error ? e.message : e);
    }
  }

  const m = await meta(me.id, day, stored, mode === "daily" && progress.status !== "playing");
  return { ok: true, view: buildView(c, progress, mode, me.admin, { ai: isAi }), meta: m, log, justFinished, xp };
}

/** Pick the next practice case for this player (adapts to recent scores). */
export async function nextPractice(localHistory: PracticeRecord[] = []): Promise<{ ok: true; caseId: string; target: number } | { ok: false; error: string }> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  const day = istToday();
  let history: PracticeRecord[] = Array.isArray(localHistory) ? localHistory.filter((h) => h && typeof h.id === "string").slice(-50) : [];
  try {
    const { data, error } = await admin().from(TABLE).select("case_id, score, updated_at").eq("user_id", me.id).eq("mode", "practice").neq("status", "playing").order("updated_at", { ascending: true }).limit(500);
    if (!error && data?.length) history = data.map((r) => ({ id: String(r.case_id), score: Number(r.score), difficulty: caseById(String(r.case_id))?.difficulty ?? 1 }));
  } catch {
    /* use the browser's history */
  }
  const id = pickPractice(CASES, history, todaysCase(day).id, Math.random());
  if (!id) return { ok: false, error: "No practice cases left." };
  return { ok: true, caseId: id, target: targetDifficulty(history) };
}

/**
 * An AI-made practice case ("AI case"). Reuses a stored case the student
 * hasn't played; otherwise one is made and checked by rules. Can take up to
 * half a minute when a new one has to be made.
 */
export async function nextAiCase(input: { topic?: string | null; setting?: "indian" | "global" | null; exclude?: string[] } = {}): Promise<{ ok: true; caseId: string } | { ok: false; error: string }> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  const topic = AI_TOPICS.some((t) => t.id === input.topic) ? input.topic! : null;
  const setting = input.setting === "indian" || input.setting === "global" ? input.setting : null;
  let exclude = Array.isArray(input.exclude) ? input.exclude.filter((x) => typeof x === "string" && x.startsWith("ai-")).slice(-100) : [];
  try {
    const { data } = await admin().from(TABLE).select("case_id").eq("user_id", me.id).eq("mode", "practice").like("case_id", "ai-%").limit(300);
    if (data?.length) exclude = [...new Set([...exclude, ...data.map((r) => String(r.case_id))])];
  } catch {
    /* use the browser's list */
  }
  let history: { score: number }[] = [];
  try {
    const { data } = await admin().from(TABLE).select("score").eq("user_id", me.id).eq("mode", "practice").neq("status", "playing").order("updated_at", { ascending: false }).limit(10);
    history = (data ?? []).map((r) => ({ score: Number(r.score) }));
  } catch {
    /* default level */
  }
  const avg = history.length ? history.reduce((a, r) => a + r.score, 0) / history.length : 50;
  const difficulty = avg >= 70 ? 3 : avg >= 40 ? 2 : 1;
  const got = await getAiPracticeCase({ userId: me.id, topic, setting, difficulty, exclude });
  if (!got) return { ok: false, error: "No AI case is ready right now. Try again in a minute, or play a practice case." };
  return { ok: true, caseId: got.case.id };
}

/** A student says an AI case looks wrong. It leaves practice until an admin checks it. */
export async function flagAiCaseAction(input: { caseId: string; reason: string }): Promise<{ ok: boolean; message: string }> {
  const me = await currentPlayer();
  if (!me) return { ok: false, message: "Please sign in again." };
  if (typeof input.caseId !== "string" || !input.caseId.startsWith("ai-")) return { ok: false, message: "Only AI cases can be reported here." };
  if (!(await rateLimit(`ai-case-flag:${me.id}`, 10, 60 * 60 * 1000))) return { ok: false, message: "Too many reports in an hour. Try later." };
  const reason = String(input.reason ?? "").trim().slice(0, 500);
  const res = await flagAiCase(input.caseId, me.id, reason || "No reason given");
  if (res === "ok") return { ok: true, message: "Thanks. An admin will check this case." };
  if (res === "already") return { ok: true, message: "You've already reported this case. Thanks." };
  return { ok: false, message: "Reports can't be saved yet. Tell your faculty instead." };
}
