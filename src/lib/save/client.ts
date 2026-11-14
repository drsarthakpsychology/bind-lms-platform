"use client";
/**
 * Student work on its way to the server, from the browser.
 *
 * queueSave() writes the save to the outbox (localStorage) first, then sends
 * it to /api/save. A failed send is tried again with growing waits (2 s, 5 s,
 * 15 s ... 5 min), when the connection comes back, when the tab is shown again
 * and on the next page load. While a save keeps failing the student sees a
 * small "Couldn't save, retrying" note (components/save/save-status.tsx).
 *
 * The outbox only runs once <SaveStatus> (mounted by the dashboard layout) has
 * told it whose saves these are. Until then saveReady() is false and callers
 * use their old direct path, so nothing changes outside the dashboard or in
 * tests.
 */
import { unstable_isUnrecognizedActionError } from "next/navigation";
import { createOutbox, type Merge, type Outbox, type OutboxItem, type SaveKind } from "./outbox";

/** Kinds that are safe to send twice (the second write changes nothing). */
const IDEMPOTENT: ReadonlySet<SaveKind> = new Set(["progress", "complete", "learn"]);
/** Browsers refuse keepalive bodies over 64 KB. */
const KEEPALIVE_MAX = 60_000;

export type SaveStatus = "idle" | "retrying" | "signed-out" | "stale";
type SavedHandler = (data: Record<string, unknown> | undefined, item: OutboxItem) => void;

let outbox: Outbox = createOutbox();
let owner: string | null = null;
let flushing: Promise<void> | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let stale = false;
let signedOut = false;
let status: SaveStatus = "idle";
/** Direct saves (trySave) waiting to be tried again. */
let retryingDirect = 0;
const listeners = new Set<() => void>();
const handlers = new Map<SaveKind, Set<SavedHandler>>();
let transport: (body: string, keepalive: boolean) => Promise<Response> = (body, keepalive) =>
  fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive, credentials: "same-origin" });

function computeStatus(): SaveStatus {
  if (stale) return "stale";
  const mine = owner ? outbox.list(owner) : [];
  if (signedOut && mine.length) return "signed-out";
  if (retryingDirect > 0 || mine.some((x) => x.tries > 0)) return "retrying";
  return "idle";
}

function update() {
  const next = computeStatus();
  if (next === status) return;
  status = next;
  listeners.forEach((l) => l());
}

/** True once the dashboard has said who is signed in: queueSave() may be used. */
export function saveReady(): boolean {
  return owner !== null && typeof window !== "undefined";
}

/** Called by <SaveStatus> with ownerTag(profile.id). Starts sending what is queued. */
export function setSaveOwner(tag: string | null) {
  if (owner === tag) return;
  owner = tag;
  signedOut = false;
  if (tag) {
    // Saves from a tab that was closed mid-send: resend the ones that are safe to send twice.
    outbox.release(outbox.list(tag).filter((x) => IDEMPOTENT.has(x.kind) && x.lockedUntil).map((x) => x.id));
    outbox.wake(tag);
    void flushSaves();
  }
  update();
}

/** Run `fn` with what the server answered whenever a save of this kind is stored. */
export function onSaved(kind: SaveKind, fn: SavedHandler): () => void {
  const set = handlers.get(kind) ?? new Set();
  set.add(fn);
  handlers.set(kind, set);
  return () => set.delete(fn);
}

/**
 * Queue a save and send it soon. Saves with the same kind and key replace each
 * other (the newest wins) unless `merge` combines them. Returns false when the
 * outbox is not running yet (use the direct path instead).
 */
export function queueSave(kind: SaveKind, key: string, payload: unknown, merge?: Merge): boolean {
  if (!saveReady() || !owner) return false;
  outbox.add({ kind, key, owner, payload }, merge);
  schedule(0);
  return true;
}

function schedule(ms: number) {
  if (typeof window === "undefined") return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void flushSaves();
  }, ms);
}

/** When the next queued save is due, set a timer for it. */
function scheduleNextDue() {
  if (!owner) return;
  const mine = outbox.list(owner);
  if (!mine.length) return;
  const soonest = Math.min(...mine.map((x) => Math.max(x.next, x.lockedUntil ?? 0)));
  schedule(Math.max(50, soonest - Date.now()));
}

async function sendOnce(keepalive: boolean): Promise<boolean> {
  if (!owner) return false;
  outbox.prune();
  const batch = outbox.claim(owner, 25);
  if (!batch.length) return false;
  const ids = batch.map((x) => x.id);
  const body = JSON.stringify({ owner, items: batch.map(({ id, kind, payload }) => ({ id, kind, payload })) });
  try {
    const res = await transport(body, keepalive && body.length < KEEPALIVE_MAX);
    if (res.status === 401) {
      // Signed out or signed in on another device: keep everything for later.
      signedOut = true;
      outbox.fail(ids, 60_000);
      return false;
    }
    signedOut = false;
    if (res.status === 403 || res.status === 400) {
      // Paused account or unreadable saves: they can never be stored.
      outbox.remove(ids);
      return true;
    }
    if (res.status === 409) {
      // Saved by another account on this browser: leave them for that account.
      outbox.release(ids);
      return false;
    }
    if (!res.ok) {
      outbox.fail(ids);
      return false;
    }
    const json = (await res.json().catch(() => null)) as { results?: { id: string; status: string; data?: Record<string, unknown> }[] } | null;
    const byId = new Map((json?.results ?? []).map((r) => [r.id, r]));
    const done: string[] = [];
    const failed: string[] = [];
    for (const item of batch) {
      const r = byId.get(item.id);
      if (r?.status === "ok") {
        done.push(item.id);
        handlers.get(item.kind)?.forEach((fn) => {
          try {
            fn(r.data, item);
          } catch {
            /* a handler must never stop the outbox */
          }
        });
      } else if (r?.status === "drop") done.push(item.id);
      else failed.push(item.id);
    }
    outbox.remove(done);
    if (failed.length) outbox.fail(failed);
    return failed.length === 0;
  } catch {
    // Offline or the request was cut: try again later.
    outbox.fail(ids);
    return false;
  }
}

/** Send everything that is due. Safe to call often: one send runs at a time. */
let again = false;
export function flushSaves(opts: { keepalive?: boolean } = {}): Promise<void> {
  if (!owner || typeof window === "undefined") return Promise.resolve();
  if (flushing) {
    // Something new was queued during a send: go round once more before stopping.
    again = true;
    return flushing;
  }
  flushing = (async () => {
    try {
      for (let i = 0; i < 20; i++) {
        again = false;
        const ok = await sendOnce(Boolean(opts.keepalive));
        if (!owner) break;
        const more = outbox.due(owner).length > 0;
        // Keep going while batches go through and more is due.
        if (!(ok && more) && !(again && more)) break;
      }
    } finally {
      flushing = null;
      update();
      scheduleNextDue();
    }
  })();
  return flushing;
}

/**
 * The page is going away (tab closed, reload, hard navigation): send what is
 * queued without waiting for an answer. Saves that are safe to send twice stay
 * in the outbox until the next page load confirms them; the others are sent
 * once (best effort, as before).
 */
export function flushOnExit() {
  if (!owner || typeof window === "undefined") return;
  const batch = outbox.claim(owner, 25);
  if (!batch.length) return;
  const body = JSON.stringify({ owner, items: batch.map(({ id, kind, payload }) => ({ id, kind, payload })) });
  let sent = false;
  try {
    if (body.length < KEEPALIVE_MAX) sent = Boolean(navigator.sendBeacon?.("/api/save", new Blob([body], { type: "application/json" })));
  } catch {
    sent = false;
  }
  if (!sent) {
    try {
      void transport(body, body.length < KEEPALIVE_MAX).catch(() => undefined);
      sent = true;
    } catch {
      sent = false;
    }
  }
  if (!sent) {
    outbox.release(batch.map((x) => x.id));
    return;
  }
  outbox.remove(batch.filter((x) => !IDEMPOTENT.has(x.kind)).map((x) => x.id));
}

/* --------------------------------------------------------- direct saves */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** A failed answer worth trying again: a gateway or server error, a timeout, a throttle. */
function retryable(result: unknown): boolean {
  if (typeof Response !== "undefined" && result instanceof Response) return result.status >= 500 || result.status === 408 || result.status === 429;
  return false;
}

/**
 * For saves that go straight to a Server Action or an API route (a game
 * answer, a quiz attempt). Tries again on a dropped connection or a server
 * error (after 1.5 s, then 5 s), with "Couldn't save, retrying" showing
 * meanwhile, instead of failing silently. A call that hits a newer deployment
 * is not retried: the student is asked to reload. Never throws; answers the
 * last result, or undefined when every try threw.
 */
export async function trySave<T>(fn: () => Promise<T>, label = "save", delaysMs: readonly number[] = [1500, 5000]): Promise<T | undefined> {
  let waiting = false;
  try {
    for (let i = 0; ; i++) {
      try {
        const r = await fn();
        if (!retryable(r) || i >= delaysMs.length) {
          if (retryable(r)) console.warn(`${label} was not saved (server answered ${(r as Response).status}).`);
          return r;
        }
      } catch (e) {
        if (unstable_isUnrecognizedActionError(e)) {
          markStale();
          return undefined;
        }
        if (i >= delaysMs.length) {
          console.warn(`${label} was not saved:`, e instanceof Error ? e.message : e);
          return undefined;
        }
      }
      if (!waiting) {
        waiting = true;
        retryingDirect += 1;
        update();
      }
      await sleep(delaysMs[i]);
    }
  } finally {
    if (waiting) {
      retryingDirect -= 1;
      update();
    }
  }
}

/* ------------------------------------------------------- stale deploys */

/** A new version of the site went live while this tab was open: its Server Actions no longer exist. */
export function markStale() {
  if (stale) return;
  stale = true;
  update();
}

let watching = false;
/**
 * Notice when a Server Action call hits a newer deployment (Next answers with
 * the x-nextjs-action-not-found header and the call fails). Wraps fetch once
 * and only reads that header.
 */
export function installStaleWatch() {
  if (watching || typeof window === "undefined" || typeof window.fetch !== "function") return;
  watching = true;
  const original = window.fetch;
  const wrapped: typeof fetch = async (...args) => {
    const res = await original.apply(window, args);
    try {
      if (res.headers.get("x-nextjs-action-not-found") === "1") markStale();
    } catch {
      /* opaque response */
    }
    return res;
  };
  window.fetch = wrapped;
}

/** Reload onto the new version, after the outbox has had its chance to send. */
export async function reloadForNewVersion() {
  try {
    await Promise.race([flushSaves(), new Promise((r) => setTimeout(r, 3000))]);
  } finally {
    window.location.reload();
  }
}

/* ------------------------------------------------------------- status */

export function subscribeSaveStatus(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export const getSaveStatus = (): SaveStatus => status;
export const getServerSaveStatus = (): SaveStatus => "idle";

/** Test hooks: a fresh outbox and transport, and module state reset. Not for app code. */
export const __saveForTests = {
  reset(next?: { outbox?: Outbox; transport?: typeof transport }) {
    outbox = next?.outbox ?? createOutbox();
    if (next?.transport) transport = next.transport;
    owner = null;
    flushing = null;
    again = false;
    if (timer) clearTimeout(timer);
    timer = null;
    stale = false;
    signedOut = false;
    status = "idle";
    retryingDirect = 0;
    handlers.clear();
  },
  outbox: () => outbox,
  sendOnce,
};
