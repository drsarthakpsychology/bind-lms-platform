"use client";
/**
 * Saved progress in the browser (see ./progress.ts).
 *
 * - useCaseProgress(tool, server): the saved steps, server copy (passed in
 *   by the page) merged with this browser's copy; re-renders when either
 *   changes. Reads localStorage through useSyncExternalStore, so it is safe
 *   during render and empty on the server.
 * - saveCaseProgress / clearCaseProgress: from event handlers. The browser
 *   copy is written at once; the server write is sent shortly after (the
 *   last step wins) and never blocks or breaks the tool.
 */
import * as React from "react";
import { cleanItem } from "@/lib/history/order";
import { cleanState, mergeProgress, NO_PROGRESS, startedIds, type ProgressRow, type ProgressSnapshot, type ProgressTool } from "./progress";

const KEY = (tool: string) => `vibha-progress-v1:${tool}`;
const MAX_LOCAL = 100;
const SEND_AFTER_MS = 700;

type Stored = { o: string | null; r: Record<string, [unknown, number]> };

/** How the browser reaches the server (tests swap it). */
type Transport = { save: (tool: ProgressTool, item: string, state: unknown) => Promise<unknown> };
const viaActions: Transport = { save: async (tool, item, state) => (await import("./progress-actions")).saveMyProgress(tool, item, state) };
let transport: Transport = viaActions;
export function setProgressTransport(t?: Transport) {
  transport = t ?? viaActions;
}

const listeners = new Map<string, Set<() => void>>();
function emit(tool: string) {
  for (const f of listeners.get(tool) ?? []) f();
}
function subscribeTo(tool: string) {
  return (f: () => void) => {
    const set = listeners.get(tool) ?? new Set();
    set.add(f);
    listeners.set(tool, set);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY(tool)) f();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      set.delete(f);
      window.removeEventListener("storage", onStorage);
    };
  };
}

function readRaw(tool: string): string | null {
  try {
    return window.localStorage.getItem(KEY(tool));
  } catch {
    return null;
  }
}

function parse(raw: string | null): { owner: string | null; rows: ProgressRow[] } {
  if (!raw) return { owner: null, rows: [] };
  try {
    const s = JSON.parse(raw) as Stored;
    const rows: ProgressRow[] = [];
    for (const [item, v] of Object.entries(s?.r ?? {})) {
      if (!cleanItem(item) || !Array.isArray(v) || typeof v[1] !== "number") continue;
      rows.push({ item, state: v[0] ?? null, at: v[1] });
    }
    return { owner: typeof s?.o === "string" ? s.o : null, rows };
  } catch {
    return { owner: null, rows: [] };
  }
}

function write(tool: string, owner: string | null, rows: Iterable<ProgressRow>) {
  try {
    const keep = [...rows].sort((a, b) => b.at - a.at).slice(0, MAX_LOCAL);
    const r: Stored["r"] = {};
    for (const x of keep) r[x.item] = [x.state ?? null, x.at];
    window.localStorage.setItem(KEY(tool), JSON.stringify({ o: owner, r } satisfies Stored));
  } catch {
    /* storage full or blocked: the server copy still counts */
  }
  emit(tool);
}

const owners = new Map<string, string>();
const timers = new Map<string, { t: ReturnType<typeof setTimeout>; send: () => void }>();

function flushAll() {
  for (const [k, x] of timers) {
    clearTimeout(x.t);
    timers.delete(k);
    x.send();
  }
}
let flushHooked = false;
function hookFlush() {
  if (flushHooked) return;
  flushHooked = true;
  try {
    window.addEventListener("pagehide", flushAll);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushAll();
    });
  } catch {
    /* not a browser */
  }
}

function queue(tool: ProgressTool, item: string, state: unknown, now: boolean) {
  const k = `${tool}|${item}`;
  const had = timers.get(k);
  if (had) clearTimeout(had.t);
  const send = () => void transport.save(tool, item, state).catch(() => {});
  if (now) {
    timers.delete(k);
    send();
    return;
  }
  hookFlush();
  timers.set(k, {
    send,
    t: setTimeout(() => {
      timers.delete(k);
      send();
    }, SEND_AFTER_MS),
  });
}

function put(tool: ProgressTool, item: string, state: unknown) {
  const local = parse(readRaw(tool));
  const map = new Map(local.rows.map((r) => [r.item, r]));
  map.set(item, { item, state, at: Date.now() });
  write(tool, owners.get(tool) ?? local.owner, map.values());
}

/** Remember where the student is in a case (call from event handlers). */
export function saveCaseProgress(tool: ProgressTool, itemId: string, state: unknown) {
  const item = cleanItem(itemId);
  const clean = cleanState(state);
  if (!item || clean === undefined) return;
  put(tool, item, clean);
  queue(tool, item, clean, false);
}

/** The case is finished: forget its saved step here and on the server. */
export function clearCaseProgress(tool: ProgressTool, itemId: string) {
  const item = cleanItem(itemId);
  if (!item) return;
  put(tool, item, null);
  queue(tool, item, null, true);
}

export type CaseProgress = {
  rows: ReadonlyMap<string, ProgressRow>;
  /** Cases with a live saved step. */
  started: Set<string>;
  get: <T>(item: string) => T | null;
};

/** The saved steps for a tool: the page's server copy merged with this browser's. */
export function useCaseProgress(tool: ProgressTool, server: ProgressSnapshot = NO_PROGRESS): CaseProgress {
  const raw = React.useSyncExternalStore(
    React.useMemo(() => subscribeTo(tool), [tool]),
    () => readRaw(tool),
    () => null,
  );
  React.useEffect(() => {
    if (!server.owner) return;
    owners.set(tool, server.owner);
    const local = parse(readRaw(tool));
    // Another student used this browser: drop their copy.
    if (local.owner && local.owner !== server.owner) write(tool, server.owner, []);
    else if (!local.owner && local.rows.length) write(tool, server.owner, local.rows);
  }, [tool, server.owner]);
  return React.useMemo(() => {
    const local = parse(raw);
    const mine = server.owner && local.owner && local.owner !== server.owner ? [] : local.rows;
    const rows = mergeProgress(server.rows, mine);
    return {
      rows,
      started: startedIds(rows),
      get: <T,>(item: string) => (rows.get(item)?.state ?? null) as T | null,
    };
  }, [raw, server]);
}

/** Test hook. */
export function resetProgressClient() {
  for (const x of timers.values()) clearTimeout(x.t);
  timers.clear();
  owners.clear();
}
