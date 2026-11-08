"use client";
/**
 * Answer history in the browser, for tools that pick their rounds there.
 *
 * - A copy lives in localStorage (one per tool), so a round still avoids
 *   what was just answered when offline or before the table exists.
 * - The server copy is fetched once per page (useHistoryPrefetch) and merged.
 * - Every answer is written to both (noteAnswer); the server write is fire
 *   and forget and never blocks or breaks the game.
 *
 * Call historyFor / pickRoundFor / orderFor only from event handlers or
 * effects (never during render): they read localStorage and the clock.
 */
import * as React from "react";
import { cleanItem, mergeHistory, nextRow, orderByHistory, pickRound, type History, type HistoryRow, type HistoryTool } from "./order";

const KEY = (tool: string) => `vibha-history-v1:${tool}`;
const MAX_LOCAL = 2000;

type Stored = { o: string | null; r: Record<string, [number, 0 | 1 | null, number, number | null]> };

const server = new Map<string, Map<string, HistoryRow>>();
const fetching = new Map<string, Promise<void>>();

function readLocal(tool: string): { owner: string | null; map: Map<string, HistoryRow> } {
  const map = new Map<string, HistoryRow>();
  try {
    const raw = window.localStorage.getItem(KEY(tool));
    if (!raw) return { owner: null, map };
    const s = JSON.parse(raw) as Stored;
    for (const [item, v] of Object.entries(s?.r ?? {})) {
      if (!cleanItem(item) || !Array.isArray(v)) continue;
      const [seen, ok, at, due] = v;
      if (typeof at !== "number") continue;
      map.set(item, { item, seen: typeof seen === "number" && seen > 0 ? seen : 1, ok: ok === 1 ? true : ok === 0 ? false : null, at, due: typeof due === "number" ? due : null });
    }
    return { owner: typeof s?.o === "string" ? s.o : null, map };
  } catch {
    return { owner: null, map };
  }
}

function writeLocal(tool: string, owner: string | null, map: ReadonlyMap<string, HistoryRow>) {
  try {
    const rows = [...map.values()].sort((a, b) => b.at - a.at).slice(0, MAX_LOCAL);
    const r: Stored["r"] = {};
    for (const x of rows) r[x.item] = [x.seen, x.ok === null ? null : x.ok ? 1 : 0, x.at, x.due];
    window.localStorage.setItem(KEY(tool), JSON.stringify({ o: owner, r } satisfies Stored));
  } catch {
    /* storage full or blocked: the server copy still counts */
  }
}

/** Fetch this student's server rows for a tool (once per page load). Never throws. */
export function prefetchHistory(tool: HistoryTool): Promise<void> {
  const had = fetching.get(tool);
  if (had) return had;
  const p = (async () => {
    try {
      const { loadMyHistory } = await import("./actions");
      const res = await loadMyHistory(tool);
      if (!res.owner) return;
      const local = readLocal(tool);
      // Another student used this browser: drop their copy.
      if (local.owner && local.owner !== res.owner) writeLocal(tool, res.owner, new Map());
      else if (!local.owner) writeLocal(tool, res.owner, local.map);
      server.set(tool, new Map(res.rows.map((r) => [r.item, r])));
    } catch {
      /* offline or no table: the browser copy is used alone */
    }
  })();
  fetching.set(tool, p);
  return p;
}

/** Start fetching the server copy when the tool mounts (no state is set). */
export function useHistoryPrefetch(tool: HistoryTool) {
  React.useEffect(() => {
    void prefetchHistory(tool);
  }, [tool]);
}

/** Server copy and browser copy, merged. */
export function historyFor(tool: HistoryTool): History {
  return mergeHistory(server.get(tool) ?? new Map(), readLocal(tool).map);
}

/**
 * Remember answers in this browser and on the server. Pass `server: false`
 * when the tool's own server action already records them.
 */
export function noteAnswers(tool: HistoryTool, answers: readonly { item: string; correct: boolean | null }[], opts: { server?: boolean; now?: number } = {}) {
  const now = opts.now ?? Date.now();
  const list = answers.filter((a) => cleanItem(a.item));
  if (!list.length) return;
  const local = readLocal(tool);
  const cache = server.get(tool);
  for (const a of list) {
    const prev = mergeHistory(cache ?? new Map(), local.map).get(a.item);
    const row = nextRow(prev, a.item, a.correct, now);
    local.map.set(a.item, row);
    cache?.set(a.item, row);
  }
  writeLocal(tool, local.owner, local.map);
  if (opts.server === false) return;
  void import("./actions")
    .then(({ recordMyAnswers }) => recordMyAnswers(tool, list.map((a) => ({ item: a.item, correct: a.correct }))))
    .catch(() => {});
}

export function noteAnswer(tool: HistoryTool, item: string, correct: boolean | null, opts: { server?: boolean } = {}) {
  noteAnswers(tool, [{ item, correct }], opts);
}

/** A round of `size` from the candidates, in history order (see order.ts). */
export function pickRoundFor<T>(tool: HistoryTool, candidates: readonly T[], idOf: (t: T) => string, size: number, rng: () => number = Math.random): T[] {
  return pickRound(candidates, idOf, historyFor(tool), Date.now(), rng, size);
}

/** Every candidate in history order. */
export function orderFor<T>(tool: HistoryTool, candidates: readonly T[], idOf: (t: T) => string, rng: () => number = Math.random): T[] {
  return orderByHistory(candidates, idOf, historyFor(tool), Date.now(), rng);
}

/** Test hook: forget the cached server rows. */
export function resetHistoryCache() {
  server.clear();
  fetching.clear();
}
