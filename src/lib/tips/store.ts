"use client";

import * as React from "react";
import { loadTips, saveTips } from "./actions";

/**
 * Which first-time tips this student has closed.
 *
 * The list lives on the server (tip_dismissals) when that table exists, and
 * always in this browser too (localStorage, one key per student), so a tip
 * never comes back after "Got it", even before the table is created. When the
 * server table appears later, tips closed only in the browser are copied up
 * once.
 *
 * Read it with useSyncExternalStore: the server render and the first paint see
 * "not ready" (the tip stays folded), then the real list.
 */

export type TipSnapshot = { ready: boolean; seen: ReadonlySet<string> };

export type TipRemote = {
  load: () => Promise<{ owner: string | null; ids: string[] | null }>;
  save: (ids: string[]) => Promise<boolean>;
};

const PREFIX = "vibha-tips-v1:";

function readLocal(owner: string): string[] {
  try {
    const raw = window.localStorage.getItem(PREFIX + owner);
    const list: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeLocal(owner: string, ids: Iterable<string>) {
  try {
    window.localStorage.setItem(PREFIX + owner, JSON.stringify([...ids]));
  } catch {
    // Private mode or storage full: the server copy (if any) still holds it.
  }
}

export function createTipStore(remote: TipRemote) {
  const NOT_READY: TipSnapshot = { ready: false, seen: new Set() };
  let snap: TipSnapshot = NOT_READY;
  let owner = "anon";
  let started = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  async function start() {
    let ids: string[] | null = null;
    try {
      const r = await remote.load();
      if (r.owner) owner = r.owner;
      ids = r.ids;
    } catch {
      ids = null;
    }
    const local = readLocal(owner);
    const seen = new Set([...local, ...(ids ?? []), ...snap.seen]);
    if (ids) {
      const onServer = new Set(ids);
      const missing = [...seen].filter((id) => !onServer.has(id));
      if (missing.length) void remote.save(missing).catch(() => false);
    }
    writeLocal(owner, seen);
    snap = { ready: true, seen };
    emit();
  }

  function subscribe(cb: () => void) {
    listeners.add(cb);
    if (!started && typeof window !== "undefined") {
      started = true;
      void start();
    }
    return () => {
      listeners.delete(cb);
    };
  }

  function dismiss(id: string) {
    if (snap.seen.has(id)) return;
    const seen = new Set(snap.seen);
    seen.add(id);
    snap = { ready: snap.ready, seen };
    writeLocal(owner, seen);
    void remote.save([id]).catch(() => false);
    emit();
  }

  return {
    subscribe,
    dismiss,
    get: () => snap,
    getServer: () => NOT_READY,
  };
}

export type TipStore = ReturnType<typeof createTipStore>;

let shared: TipStore | null = null;
function store(): TipStore {
  shared ??= createTipStore({ load: loadTips, save: saveTips });
  return shared;
}

/**
 * `seen` is null until the list is known (server render, first paint, or while
 * loading), then true or false. `dismiss` remembers the tip for good.
 */
export function useTip(id: string, s: TipStore = store()): { seen: boolean | null; dismiss: () => void } {
  const snap = React.useSyncExternalStore(s.subscribe, s.get, s.getServer);
  const dismiss = React.useCallback(() => s.dismiss(id), [s, id]);
  return { seen: snap.ready ? snap.seen.has(id) : null, dismiss };
}

/** Close a tip for good from outside it, for example when a game starts. */
export function dismissTip(id: string, s: TipStore = store()) {
  s.dismiss(id);
}
