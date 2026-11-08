"use server";

import { istToday } from "@/lib/learn/engine";
import { CHAPTERS, diagnosisById } from "@/lib/games/diagnoses";
import { dailyIndex } from "@/lib/games/daily/engine";
import { permutation } from "@/lib/games/rng";
import { BOARDS, boardById, type SortBoard } from "@/lib/games/sort/boards";
import { check, cleanPicks, cleanPlacement, groupOf, MAX_TRIES, sortScore, sortXp, TILES, type Tier } from "@/lib/games/sort/engine";
import { admin, cohortPeers, currentPlayer, isMissing } from "@/lib/games/server";
import { secretSeed } from "@/lib/games/token";
import { awardXp, XP_SOURCES } from "@/lib/leagues/xp";
import { orderByHistory, type HistoryRow } from "@/lib/history/order";

export type SortReveal = {
  solved: boolean;
  score: number;
  /** In the shuffled order the player saw. */
  tiles: { text: string; group: number; why: string }[];
  thresholds: (string | null)[];
  module: string;
  topic: string;
};

export type SortView = {
  mode: "daily" | "practice";
  tier: Tier;
  boardId: string;
  title: string;
  difficulty: number;
  groups: string[];
  tiles: string[];
  thresholds: string[] | null;
  triesUsed: number;
  done: SortReveal | null;
  /** Today's board in this tier, across your batch (daily only). */
  cohort: { played: number; solvedPct: number; scope: "batch" | "everyone" } | null;
  stored: boolean;
};

export type CheckResult =
  | {
      ok: true;
      groupsDone: boolean[];
      oneAway: number[];
      thresholdWrong: number[];
      triesUsed: number;
      done: SortReveal | null;
      xp: number;
      /** True when the XP went into the server ledger (a solved board), so the browser must not add it again. */
      xpSaved: boolean;
      cohort: SortView["cohort"];
    }
  | { ok: false; error: string };

const TABLE = "sort_results";

function dailyBoard(day: string, tier: Tier): SortBoard {
  const pool = tier === "advanced" ? BOARDS.filter((b) => b.thresholds) : BOARDS;
  return pool[(dailyIndex(day, pool.length) + (tier === "advanced" ? 3 : 0)) % pool.length];
}

function permFor(b: SortBoard, mode: string, day: string, userId: string): number[] {
  return permutation(mode === "daily" ? secretSeed("sort", b.id, day) : secretSeed("sort", b.id, userId, day), TILES);
}

function itemAt(b: SortBoard, idx: number) {
  return b.groups[groupOf(idx)].items[idx % 4];
}

function reveal(b: SortBoard, perm: number[], solved: boolean, score: number): SortReveal {
  return {
    solved,
    score,
    tiles: perm.map((idx) => ({ text: itemAt(b, idx).text, group: groupOf(idx), why: itemAt(b, idx).why })),
    thresholds: b.groups.map((g) => g.threshold),
    module: b.module,
    topic: CHAPTERS[diagnosisById(b.groups[0].dx)!.chapter].topic,
  };
}

type Row = { tries: number; solved: boolean; score: number };

async function loadRow(userId: string, mode: string, day: string, boardId: string, tier: Tier): Promise<{ row: Row | null; stored: boolean }> {
  try {
    const { data, error } = await admin().from(TABLE).select("tries, solved, score").eq("user_id", userId).eq("mode", mode).eq("day", day).eq("board_id", boardId).eq("tier", tier).maybeSingle();
    if (error) return { row: null, stored: !isMissing(error) };
    return { row: (data as Row | null) ?? null, stored: true };
  } catch {
    return { row: null, stored: false };
  }
}

async function cohortFor(userId: string, day: string, b: SortBoard, tier: Tier): Promise<SortView["cohort"]> {
  try {
    const peers = await cohortPeers(userId);
    let q = admin().from(TABLE).select("solved, tries").eq("mode", "daily").eq("day", day).eq("board_id", b.id).eq("tier", tier).limit(5000);
    if (peers) q = q.in("user_id", peers);
    const { data, error } = await q;
    if (error) return null;
    const done = (data ?? []).filter((r) => r.solved || (r.tries as number) >= MAX_TRIES);
    return { played: done.length, solvedPct: done.length ? Math.round((done.filter((r) => r.solved).length / done.length) * 100) : 0, scope: peers ? "batch" : "everyone" };
  } catch {
    return null;
  }
}

/**
 * Answer history for boards, from sort_results (daily and practice): boards
 * never played first, then unsolved ones, solved ones last (oldest first).
 * Empty when the table is missing, so the pick is plain random.
 */
async function boardHistory(userId: string): Promise<Map<string, HistoryRow>> {
  const out = new Map<string, HistoryRow>();
  try {
    const { data, error } = await admin().from(TABLE).select("board_id, solved, tries, created_at").eq("user_id", userId).order("created_at", { ascending: true }).limit(2000);
    if (error) return out;
    for (const r of data ?? []) {
      const at = Date.parse(String(r.created_at));
      const id = String(r.board_id);
      const done = r.solved === true || Number(r.tries) >= MAX_TRIES;
      out.set(id, { item: id, seen: (out.get(id)?.seen ?? 0) + 1, ok: r.solved === true ? true : done ? false : null, at: Number.isFinite(at) ? at : 0, due: null });
    }
  } catch {
    /* table missing: random */
  }
  return out;
}

function finished(r: Row | null) {
  return !!r && (r.solved || r.tries >= MAX_TRIES);
}

function viewOf(b: SortBoard, mode: "daily" | "practice", tier: Tier, perm: number[], row: Row | null, stored: boolean, cohort: SortView["cohort"]): SortView {
  return {
    mode,
    tier,
    boardId: b.id,
    title: b.title,
    difficulty: b.difficulty,
    groups: b.groups.map((g) => diagnosisById(g.dx)?.name ?? g.dx),
    tiles: perm.map((idx) => itemAt(b, idx).text),
    thresholds: tier === "advanced" ? b.thresholds : null,
    triesUsed: row?.tries ?? 0,
    done: finished(row) ? reveal(b, perm, row!.solved, row!.score) : null,
    cohort,
    stored,
  };
}

export async function loadSort(input: { mode: "daily" | "practice"; tier: Tier; boardId?: string }): Promise<{ ok: true; view: SortView } | { ok: false; error: string }> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  const day = istToday();
  const tier: Tier = input.tier === "advanced" ? "advanced" : "basic";
  const mode = input.mode === "practice" ? "practice" : "daily";
  const today = dailyBoard(day, tier);
  let b: SortBoard | undefined = today;
  if (mode === "practice") {
    const pool = BOARDS.filter((x) => x.id !== today.id && (tier === "basic" || x.thresholds));
    b = input.boardId ? boardById(input.boardId) : orderByHistory(pool, (x) => x.id, await boardHistory(me.id), Date.now(), Math.random)[0];
    if (!b || b.id === today.id || (tier === "advanced" && !b.thresholds)) return { ok: false, error: "That board isn't available." };
  }
  const { row, stored } = await loadRow(me.id, mode, day, b.id, tier);
  const cohort = mode === "daily" && stored ? await cohortFor(me.id, day, b, tier) : null;
  return { ok: true, view: viewOf(b, mode, tier, permFor(b, mode, day, me.id), row, stored, cohort) };
}

/** Check a full board. The server counts tries when it can store them. */
export async function checkSort(input: { mode: "daily" | "practice"; tier: Tier; boardId: string; placement: unknown; picks: unknown; tries: number }): Promise<CheckResult> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  const day = istToday();
  const tier: Tier = input.tier === "advanced" ? "advanced" : "basic";
  const mode = input.mode === "practice" ? "practice" : "daily";
  const b = boardById(input.boardId);
  if (!b) return { ok: false, error: "That board isn't available." };
  if (mode === "daily" && b.id !== dailyBoard(day, tier).id) return { ok: false, error: "A new daily board is out. Reload to play it." };
  const placement = cleanPlacement(input.placement);
  if (placement.some((p) => p === null)) return { ok: false, error: "Place all 16 tiles first." };
  const picks = cleanPicks(input.picks);
  const perm = permFor(b, mode, day, me.id);

  const { row, stored } = await loadRow(me.id, mode, day, b.id, tier);
  if (finished(row)) return { ok: false, error: "You've already finished this board." };
  const tries = stored ? (row?.tries ?? 0) + 1 : Math.min(MAX_TRIES, Math.max(1, Math.floor(Number(input.tries) || 1)));

  const answers = b.groups.map((g) => g.threshold);
  const c = check(perm, placement, tier, answers, picks);
  const over = c.solved || tries >= MAX_TRIES;
  const score = over ? sortScore(tries, c, tier) : 0;
  const xp = over ? sortXp(score, mode) : 0;

  if (stored) {
    try {
      const { error } = await admin()
        .from(TABLE)
        .upsert({ user_id: me.id, mode, day, board_id: b.id, tier, tries, solved: c.solved, score }, { onConflict: "user_id,mode,day,board_id,tier" });
      if (error) console.warn("checkSort: save failed:", error.message);
    } catch (e) {
      console.warn("checkSort: save failed:", e instanceof Error ? e.message : e);
    }
  }
  // Groups with all four tiles right but the wrong threshold.
  const right = [0, 0, 0, 0];
  c.tiles.forEach((t, i) => {
    if (t === "ok") right[groupOf(perm[i])]++;
  });
  const thresholdWrong = tier === "advanced" ? [0, 1, 2, 3].filter((g) => right[g] === 4 && answers[g] !== null && c.thresholds[g] !== true) : [];
  const cohort = over && mode === "daily" && stored ? await cohortFor(me.id, day, b, tier) : null;
  // A solved board pays into the ledger, once per board, tier and day.
  const xpSaved = c.solved && xp > 0 ? (await awardXp(me.id, XP_SOURCES.sortSolved, xp, `${mode}:${day}:${b.id}:${tier}`)).ok : false;
  return { ok: true, groupsDone: c.groupsDone, oneAway: c.oneAway, thresholdWrong, triesUsed: tries, done: over ? reveal(b, perm, c.solved, score) : null, xp, xpSaved, cohort };
}
