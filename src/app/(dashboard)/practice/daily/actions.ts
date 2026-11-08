"use server";

import { istToday } from "@/lib/learn/engine";
import { CASES, caseById } from "@/lib/games/daily/cases";
import {
  apply,
  cleanLog,
  dailyIndex,
  dailyStreak,
  MAX_HINTS,
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
import { admin, cohortPeers, currentPlayer, isMissing } from "@/lib/games/server";
import { hintedItems, hintStatus, spendHint, type HintStatus } from "@/lib/hints/server";
import { itemKey } from "@/lib/hints/rules";
import { awardXp, XP_SOURCES } from "@/lib/leagues/xp";
import type { DailyCase } from "@/lib/games/daily/types";
import { flagAiCase, getAiPracticeCase, loadAiCase } from "@/lib/ai-cases";
import { AI_TOPICS } from "@/lib/ai-cases/criteria";
import { rateLimit } from "@/lib/rate-limit";
import { availableProviders, isEnabled, PROVIDER_PRIORITY, PROVIDERS } from "@/lib/ai/router";

export type DailyMeta = {
  day: string;
  /** Case number shown to players ("Case #6"). */
  number: number;
  streak: number;
  playedDays: string[];
  /** Hints left today (free, bought and spare), counted on the server. */
  hints: HintStatus | null;
  cohort: (CohortStats & { scope: "batch" | "everyone" }) | null;
  /** False when results can't be saved yet (table missing): the browser keeps them. */
  stored: boolean;
};

export type MoveResult =
  | {
      ok: true;
      view: CaseView;
      meta: DailyMeta;
      log: Action[];
      justFinished: boolean;
      xp: number;
      /** True when the XP went into the server ledger (a solved daily case), so the browser must not add it again. */
      xpSaved: boolean;
    }
  | { ok: false; error: string };

const LAUNCH = "2026-11-01";
const TABLE = "daily_case_results";

function caseNumber(day: string) {
  return Math.max(1, Math.round((Date.parse(day) - Date.parse(LAUNCH)) / 86400000) + 1);
}

function todaysCase(day: string) {
  return CASES[dailyIndex(day, CASES.length)];
}

type Row = { log: unknown; hints: number; status: string };

async function loadRow(userId: string, mode: string, day: string, caseId: string): Promise<{ row: Row | null; stored: boolean }> {
  try {
    const { data, error } = await admin().from(TABLE).select("log, hints, status").eq("user_id", userId).eq("mode", mode).eq("day", day).eq("case_id", caseId).maybeSingle();
    if (error) return { row: null, stored: !isMissing(error) };
    return { row: (data as Row | null) ?? null, stored: true };
  } catch {
    return { row: null, stored: false };
  }
}

async function meta(userId: string, day: string, stored: boolean, withCohort: boolean): Promise<DailyMeta> {
  const hintsP = hintStatus(userId).catch(() => null);
  const base: DailyMeta = { day, number: caseNumber(day), streak: 0, playedDays: [], hints: null, cohort: null, stored };
  if (!stored) return { ...base, hints: await hintsP };
  try {
    const db = admin();
    const [{ data: days }, hints] = await Promise.all([
      db.from(TABLE).select("day").eq("user_id", userId).eq("mode", "daily").neq("status", "playing").order("day", { ascending: false }).limit(400),
      hintsP,
    ]);
    const playedDays = (days ?? []).map((r) => String(r.day));
    const out: DailyMeta = {
      ...base,
      playedDays,
      streak: dailyStreak(playedDays, day),
      hints,
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
    return { ...base, hints: await hintsP };
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
  // Hints are charged per case by the hint counter; this is the case's key there.
  const hintItem = itemKey("daily", mode, day, c.id);
  let baseLog = stored ? cleanLog(row?.log ?? []) : cleanLog(input.log);
  if (!stored) {
    // The browser's log can't add hints the server never granted.
    const granted = (await hintedItems(me.id, hintItem).catch(() => new Map<string, number>())).get(hintItem) ?? 0;
    let seen = 0;
    baseLog = baseLog.filter((a) => a.t !== "hint" || ++seen <= granted);
  }
  const before = replay(c, baseLog);
  let progress = before.progress;
  let log = before.log;

  if (input.action) {
    const action = cleanLog([input.action])[0];
    if (!action) return { ok: false, error: "That move isn't allowed." };
    if (action.t === "hint") {
      if (progress.status !== "playing" || progress.hints >= MAX_HINTS) return { ok: false, error: "No more hints for this case." };
      const spent = await spendHint(me.id, { game: "daily", item: hintItem, step: progress.hints + 1 });
      if (!spent.ok) return { ok: false, error: spent.error };
    }
    const next = apply(c, progress, action);
    if (next !== progress) {
      progress = next;
      log = [...log, action];
    } else if (action.t === "clue") {
      return { ok: false, error: "Make a guess to open the next clue." };
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

  // A solved daily case pays into the ledger (once per day), which is what the
  // "daily cases solved" milestones and league points count.
  let xpSaved = false;
  if (justFinished && mode === "daily" && progress.status === "solved" && xp > 0) {
    xpSaved = (await awardXp(me.id, XP_SOURCES.dailyCase, xp, day)).ok;
  }

  const m = await meta(me.id, day, stored, mode === "daily" && progress.status !== "playing");
  return { ok: true, view: buildView(c, progress, mode, me.admin, { ai: isAi }), meta: m, log, justFinished, xp, xpSaved };
}

/** Pick the next practice case for this player (adapts to recent scores). */
export async function nextPractice(localHistory: PracticeRecord[] = []): Promise<{ ok: true; caseId: string; target: number } | { ok: false; error: string }> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  const day = istToday();
  let history: PracticeRecord[] = Array.isArray(localHistory) ? localHistory.filter((h) => h && typeof h.id === "string").slice(-50) : [];
  try {
    const { data, error } = await admin().from(TABLE).select("case_id, score, status, updated_at").eq("user_id", me.id).eq("mode", "practice").neq("status", "playing").order("updated_at", { ascending: true }).limit(500);
    if (!error && data?.length) history = data.map((r) => ({ id: String(r.case_id), score: Number(r.score), difficulty: caseById(String(r.case_id))?.difficulty ?? 1, solved: r.status === "solved" }));
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
  if (!got) {
    // No stored case and no case could be made. When no AI provider key is
    // set on this site, say so to admins (students get the calm line only).
    const off = !isEnabled() ? "AI is switched off on this site (AI_ENABLED is false)." : availableProviders().length === 0 ? `No AI key is set on this site. Add one of: ${AI_KEY_NAMES}.` : null;
    if (off) console.warn(`[ai-cases] AI case cannot run: ${off}`);
    if (off && me.admin) return { ok: false, error: `AI cases are off. ${off}` };
    return { ok: false, error: "AI cases are coming soon. They will start working here once the AI service is switched on. Today's case and Practice work now." };
  }
  return { ok: true, caseId: got.case.id };
}

/** The env var names of the AI providers that can write a case, in the order they are tried. */
const AI_KEY_NAMES = PROVIDER_PRIORITY.json.map((id) => PROVIDERS.find((p) => p.id === id)?.apiKeyEnv).filter(Boolean).join(", ");

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
