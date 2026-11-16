import { createStore } from "@/lib/store";

/**
 * Whether the phone can reach the server right now. There is no network
 * library in the app, so this follows the calls themselves: a call that could
 * not reach the server marks the phone offline, any answer marks it online
 * again. While offline a light check runs every 15 seconds so the line goes
 * away by itself when the internet is back. On the web build the browser's
 * own online and offline events are used too.
 */
export const netStore = createStore({ offline: false });

export const useOffline = (): boolean => netStore.use((s) => s.offline);

let probe: (() => Promise<unknown>) | null = null;
let onBack: (() => void) | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const PROBE_MS = 15_000;

function schedule(): void {
  if (timer || !probe) return;
  timer = setTimeout(() => {
    timer = null;
    if (!netStore.get().offline || !probe) return;
    probe()
      .then(() => markOnline())
      .catch(() => schedule());
  }, PROBE_MS);
}

export function markOffline(): void {
  if (!netStore.get().offline) netStore.set({ offline: true });
  schedule();
}

export function markOnline(): void {
  if (!netStore.get().offline) return;
  netStore.set({ offline: false });
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  onBack?.();
}

/** Wired once from queries.ts: how to check the server, and what to do when it answers again. */
export function configureOnline(opts: { probe: () => Promise<unknown>; onBack: () => void }): void {
  probe = opts.probe;
  onBack = opts.onBack;
}

// The web build: the browser knows when the connection drops.
const w = (globalThis as { window?: { addEventListener?: (t: string, f: () => void) => void; navigator?: { onLine?: boolean } } }).window;
if (w && typeof w.addEventListener === "function") {
  w.addEventListener("offline", () => markOffline());
  w.addEventListener("online", () => markOnline());
}
