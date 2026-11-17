import { onlineManager } from "@tanstack/react-query";

import { createStore } from "@/lib/store";
import type { Transport } from "./client";
import { ApiFailure } from "./errors";

/**
 * Whether the phone can reach the server right now. There is no network
 * library in the app, so this follows the calls themselves (every call goes
 * through `watchTransport`): any answer from the server means online.
 *
 * One failed call is not "offline". A call can fail on its own (a slow route,
 * a dropped packet, a lift between floors), and calling that "offline" greyed
 * out buttons and showed the offline line while the internet was fine. So a
 * failed call starts one light check of the server, and only when that check
 * cannot reach it either does the phone count as offline. While offline the
 * check runs again after 15 s, then 30 s, then every minute (never while the
 * app is in the background), so the line goes away by itself.
 *
 * `slow` is set for two minutes after a call ran out of time: the
 * prefetcher then loads only what the student asked for.
 *
 * React Query is told too (onlineManager), so while offline its retries wait
 * instead of failing, queued writes wait, and everything carries on when the
 * internet is back.
 */
export const netStore = createStore({ offline: false, slow: false });

export const useOffline = (): boolean => netStore.use((s) => s.offline);

let probe: (() => Promise<unknown>) | null = null;
let onBack: (() => void) | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let checking = false;
let misses = 0;
let paused = false;
let slowUntil = 0;
const SLOW_MS = 2 * 60_000;
const PROBE_MS = [15_000, 30_000, 60_000];

/** How long until the next check while offline (grows so a phone left offline does not keep waking up). */
export function probeDelay(n: number): number {
  return PROBE_MS[Math.min(n, PROBE_MS.length - 1)]!;
}

function clearTimer(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function schedule(): void {
  if (timer || !probe || paused) return;
  timer = setTimeout(() => {
    timer = null;
    if (!netStore.get().offline) return;
    misses += 1;
    check();
  }, probeDelay(misses));
}

/** Ask the server once. Reaching it (any answer) means online; only "could not reach" means offline. */
function check(): void {
  if (!probe || checking) return;
  checking = true;
  probe()
    .then(() => markOnline())
    .catch((e: unknown) => {
      if (e instanceof ApiFailure && e.code === "network") markOffline();
      else markOnline();
    })
    .finally(() => {
      checking = false;
    });
}

/** Offline for sure (the check failed too). Tests and the web build call this directly. */
export function markOffline(): void {
  if (!netStore.get().offline) {
    netStore.set({ offline: true });
    misses = 0;
  }
  schedule();
}

export function markOnline(): void {
  if (!netStore.get().offline) return;
  netStore.set({ offline: false });
  misses = 0;
  clearTimer();
  onBack?.();
}

/** A call reached the server (any status). */
export function noteReached(): void {
  markOnline();
}

/** A call could not reach the server. Not offline yet: check first. */
export function noteUnreached(timedOut = false): void {
  if (timedOut) {
    slowUntil = Date.now() + SLOW_MS;
    if (!netStore.get().slow) netStore.set({ slow: true });
  }
  if (netStore.get().offline) {
    schedule();
    return;
  }
  // Nothing to check with (tests that never wired one): trust the call.
  if (!probe) {
    markOffline();
    return;
  }
  check();
}

/** True while the connection has recently been too slow: load only what is asked for. */
export function isSlow(): boolean {
  const s = netStore.get();
  if (s.slow && Date.now() > slowUntil) netStore.set({ slow: false });
  return netStore.get().slow;
}

/** The app went to the background (stop checking) or came back (check at once if offline). */
export function setForeground(active: boolean): void {
  paused = !active;
  if (!active) {
    clearTimer();
    return;
  }
  if (netStore.get().offline) check();
}

/** Every call goes through this, so the online state follows real answers, not only screen reads. */
export function watchTransport(t: Transport): Transport {
  return async (req) => {
    try {
      const res = await t(req);
      noteReached();
      return res;
    } catch (e) {
      if (e instanceof ApiFailure && e.code === "network") noteUnreached(e.details.timeout === true);
      throw e;
    }
  };
}

/** Wired once from queries.ts: how to check the server, and what to do when it answers again. */
export function configureOnline(opts: { probe: () => Promise<unknown>; onBack: () => void }): void {
  probe = opts.probe;
  onBack = opts.onBack;
}

/** Tests: back to a clean start. */
export function resetOnline(): void {
  clearTimer();
  checking = false;
  misses = 0;
  paused = false;
  slowUntil = 0;
  netStore.set({ offline: false, slow: false });
}

// React Query follows this store: retries and queued writes wait while offline and carry on after.
onlineManager.setEventListener((setOnline) => {
  setOnline(!netStore.get().offline);
  return netStore.subscribe(() => setOnline(!netStore.get().offline));
});

// The web build: the browser knows when the connection drops.
const w = (globalThis as { window?: { addEventListener?: (t: string, f: () => void) => void; navigator?: { onLine?: boolean } } }).window;
if (w && typeof w.addEventListener === "function") {
  w.addEventListener("offline", () => markOffline());
  w.addEventListener("online", () => markOnline());
}
