"use client";

import * as React from "react";
import { emptyMarks, mergeMarks, normaliseMarks, storageKey, type Marks } from "./marks";

/**
 * Browser copy of a student's bookmarks and notes (see marks.ts).
 * Saved on this device only, in localStorage, one key per student.
 * Other tabs pick up changes through the "storage" event.
 * TODO(server sync): see the note at the top of marks.ts.
 */

const EMPTY = emptyMarks();
const cache = new Map<string, Marks>();
const listeners = new Set<() => void>();

function read(owner: string): Marks {
  const hit = cache.get(owner);
  if (hit) return hit;
  let m = EMPTY;
  try {
    const raw = window.localStorage.getItem(storageKey(owner));
    if (raw) m = normaliseMarks(JSON.parse(raw));
  } catch {
    // Private mode or broken JSON: start empty.
  }
  cache.set(owner, m);
  return m;
}

/** Returns false when the browser would not save (storage full or blocked). */
function write(owner: string, m: Marks): boolean {
  cache.set(owner, m);
  listeners.forEach((l) => l());
  try {
    window.localStorage.setItem(storageKey(owner), JSON.stringify(m));
    return true;
  } catch {
    return false;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (!e.key?.startsWith("vibha-study-marks-v1:")) return;
    const owner = e.key.slice("vibha-study-marks-v1:".length);
    const cur = cache.get(owner);
    if (!cur) return;
    let other = EMPTY;
    try {
      other = e.newValue ? normaliseMarks(JSON.parse(e.newValue)) : EMPTY;
    } catch {}
    cache.set(owner, mergeMarks(cur, other));
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** The student's marks, plus an updater. Empty on the server and first render. */
export function useMarks(owner: string): [Marks, (fn: (m: Marks) => Marks) => boolean] {
  const marks = React.useSyncExternalStore(
    subscribe,
    () => read(owner),
    () => EMPTY,
  );
  const update = React.useCallback((fn: (m: Marks) => Marks) => {
    const cur = read(owner);
    const next = fn(cur);
    return next === cur ? true : write(owner, next);
  }, [owner]);
  return [marks, update];
}

/** True once the browser copy has been read (after hydration). */
export function useHydrated(): boolean {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
