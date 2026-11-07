"use client";

import * as React from "react";
import {
  emptyMarks,
  isEmptyMarks,
  mergeMarks,
  newerThan,
  normaliseMarks,
  storageKey,
  type Marks,
} from "./marks";
import { pullMarks, pushMarks, type PullResult, type PushResult } from "./marks-actions";

/**
 * A student's bookmarks and notes in the browser, kept in step with the
 * server copy (table study_marks, see marks-actions.ts).
 *
 * - The browser copy (localStorage, one key per student) is read first, so
 *   marks show at once and keep working offline.
 * - On the first use per page load the server copy is pulled and merged in;
 *   anything the browser has that the server lacks (made offline, or before
 *   the table existed) is sent up. Neither side loses an entry: every entry
 *   carries its own time and the newest change wins (marks.ts).
 * - Each change is saved in the browser at once and sent to the server a
 *   moment later. A failed send waits for the next change, the browser coming
 *   back online, or the next page load.
 * - Until the table exists the server answers "off" and syncing stops quietly
 *   for the rest of the page load.
 * Other tabs pick up changes through the "storage" event.
 */

const EMPTY = emptyMarks();
const PREFIX = "vibha-study-marks-v1:";
const PUSH_DELAY_MS = 800;

const cache = new Map<string, Marks>();
const listeners = new Set<() => void>();

type Sync = { pull: () => Promise<PullResult>; push: (m: Marks) => Promise<PushResult> };
let sync: Sync = { pull: pullMarks, push: pushMarks };
/** Owners whose server copy has been pulled (or is being pulled) this page load. */
const pulled = new Set<string>();
/** Changes waiting to be sent, per owner. */
const pending = new Map<string, Marks>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const sending = new Set<string>();
let serverOff = false;

function notify() {
  listeners.forEach((l) => l());
}

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

/** Saves the browser copy. Returns false when the browser would not save (storage full or blocked). */
function writeLocal(owner: string, m: Marks): boolean {
  cache.set(owner, m);
  notify();
  try {
    window.localStorage.setItem(storageKey(owner), JSON.stringify(m));
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------ server sync */

function queue(owner: string, changes: Marks) {
  if (!owner || serverOff) return;
  if (!isEmptyMarks(changes))
    pending.set(owner, mergeMarks(pending.get(owner) ?? emptyMarks(), changes));
  schedule(owner);
}

function schedule(owner: string) {
  if (!pending.has(owner)) return;
  const t = timers.get(owner);
  if (t) clearTimeout(t);
  timers.set(
    owner,
    setTimeout(() => void flush(owner), PUSH_DELAY_MS),
  );
}

async function flush(owner: string): Promise<void> {
  timers.delete(owner);
  const batch = pending.get(owner);
  if (!batch || serverOff || sending.has(owner)) return;
  pending.delete(owner);
  sending.add(owner);
  let res: PushResult = { ok: false };
  try {
    res = await sync.push(batch);
  } catch {
    res = { ok: false };
  }
  sending.delete(owner);
  if (res.off) {
    serverOff = true;
    pending.clear();
    return;
  }
  if (!res.ok) {
    // Keep it for the next try; anything newer typed since then wins the merge.
    pending.set(owner, mergeMarks(batch, pending.get(owner) ?? emptyMarks()));
    return;
  }
  schedule(owner);
}

/** Pull the server copy once per page load, merge, and send up what only the browser has. */
async function startSync(owner: string): Promise<void> {
  if (!owner || serverOff || pulled.has(owner)) return;
  pulled.add(owner);
  let res: PullResult;
  try {
    res = await sync.pull();
  } catch {
    res = { ok: false, off: false };
  }
  if (!res.ok) {
    if (res.off) serverOff = true;
    else pulled.delete(owner); // try again on the next visit to a Study page
    return;
  }
  const local = read(owner);
  const merged = mergeMarks(local, res.marks);
  if (JSON.stringify(merged) !== JSON.stringify(local)) writeLocal(owner, merged);
  queue(owner, newerThan(local, res.marks));
}

/** Save a change in the browser now and queue it for the server. False when the browser would not save. */
function applyUpdate(owner: string, fn: (m: Marks) => Marks): boolean {
  const cur = read(owner);
  const next = fn(cur);
  if (next === cur) return true;
  const saved = writeLocal(owner, next);
  queue(owner, newerThan(next, cur));
  return saved;
}

function retryAll() {
  for (const owner of pending.keys()) schedule(owner);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (!e.key?.startsWith(PREFIX)) return;
    const owner = e.key.slice(PREFIX.length);
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
  window.addEventListener("online", retryAll);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("online", retryAll);
  };
}

/** The student's marks, plus an updater. Empty on the server and first render. */
export function useMarks(owner: string): [Marks, (fn: (m: Marks) => Marks) => boolean] {
  const marks = React.useSyncExternalStore(
    subscribe,
    () => read(owner),
    () => EMPTY,
  );
  React.useEffect(() => {
    void startSync(owner);
  }, [owner]);
  const update = React.useCallback((fn: (m: Marks) => Marks) => applyUpdate(owner, fn), [owner]);
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

/** Test hooks: swap the server calls and reset module state. Not for app code. */
export const __marksSyncForTests = {
  use(next: Sync) {
    sync = next;
  },
  reset() {
    cache.clear();
    pulled.clear();
    pending.clear();
    for (const t of timers.values()) clearTimeout(t);
    timers.clear();
    sending.clear();
    serverOff = false;
    sync = { pull: pullMarks, push: pushMarks };
  },
  startSync,
  flush,
  read,
  update: applyUpdate,
  pending: (owner: string) => pending.get(owner) ?? null,
};
