/**
 * The browser outbox: student work waiting to reach the server.
 *
 * Every save is written here first (localStorage, so it survives a closed tab,
 * a reload, a new deployment or a dropped connection), then sent to
 * /api/save. It leaves the outbox only when the server says it is stored, or
 * when the server says it can never be stored (bad data, account paused).
 *
 * Pure apart from the storage it is given, so it is unit-tested directly.
 * Every storage call is wrapped: when localStorage is blocked or full, the
 * outbox carries on in memory for this tab.
 */

export const SAVE_KINDS = ["progress", "complete", "learn", "history", "events"] as const;
export type SaveKind = (typeof SAVE_KINDS)[number];

export type OutboxItem = {
  id: string;
  kind: SaveKind;
  /** Saves with the same kind and key are merged (the newer one wins, or `merge` combines them). */
  key: string;
  /** ownerTag() of the student who made it. */
  owner: string;
  payload: unknown;
  /** Failed sends so far. */
  tries: number;
  /** When it was first queued (ms). */
  at: number;
  /** Earliest time to send it again (ms). */
  next: number;
  /** Being sent until this time (ms): not merged into and not sent again meanwhile, by any tab. */
  lockedUntil?: number;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const OUTBOX_KEY = "vibha-outbox-v1";
/** Older than this, a save is dropped (a lecture position from last week is no use). */
export const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_TRIES = 60;
export const MAX_ITEMS = 300;
/** A send that has not answered by then is treated as lost (closed tab, dead network). */
export const LOCK_MS = 30_000;

/** Wait before the next try: 2 s, 5 s, 15 s, 30 s, 1 min, 2 min, then every 5 min. */
const STEPS = [2_000, 5_000, 15_000, 30_000, 60_000, 120_000, 300_000];
export function backoff(tries: number): number {
  return STEPS[Math.min(Math.max(tries, 1), STEPS.length) - 1];
}

function isItem(x: unknown): x is OutboxItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.key === "string" &&
    typeof o.owner === "string" &&
    (SAVE_KINDS as readonly string[]).includes(o.kind as string) &&
    typeof o.tries === "number" &&
    typeof o.at === "number" &&
    typeof o.next === "number"
  );
}

export type Merge = (older: unknown, newer: unknown) => unknown;

export type Outbox = ReturnType<typeof createOutbox>;

export function createOutbox(opts: { storage?: () => StorageLike | null; now?: () => number } = {}) {
  const getStorage = opts.storage ?? (() => (typeof window === "undefined" ? null : window.localStorage));
  const now = opts.now ?? (() => Date.now());
  let memory: OutboxItem[] | null = null;
  /** Storage refused a write: this tab's memory is the full truth from now on. */
  let memoryOnly = false;
  let counter = 0;

  function storage(): StorageLike | null {
    try {
      return getStorage();
    } catch {
      return null;
    }
  }

  function read(): OutboxItem[] {
    if (memoryOnly && memory) return memory;
    const s = storage();
    if (s) {
      try {
        const raw = s.getItem(OUTBOX_KEY);
        if (raw) {
          const list: unknown = JSON.parse(raw);
          if (Array.isArray(list)) {
            memory = list.filter(isItem);
            return memory;
          }
        } else if (memory === null) {
          memory = [];
        }
      } catch {
        /* blocked or broken JSON: fall back to memory */
      }
    }
    return memory ?? (memory = []);
  }

  function write(list: OutboxItem[]) {
    memory = list;
    const s = storage();
    if (!s) return;
    try {
      if (list.length) s.setItem(OUTBOX_KEY, JSON.stringify(list));
      else s.removeItem(OUTBOX_KEY);
    } catch {
      // Storage full: this tab keeps everything in memory, and the newest half
      // is stored so the latest work still survives a reload.
      memoryOnly = true;
      try {
        s.setItem(OUTBOX_KEY, JSON.stringify(list.slice(-Math.ceil(list.length / 2))));
      } catch {
        /* blocked: memory only */
      }
    }
  }

  function newId(): string {
    counter += 1;
    return `${now().toString(36)}-${counter.toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
  }

  return {
    /** Queue a save. A queued save with the same kind, key and owner is replaced (or merged). */
    add(item: { kind: SaveKind; key: string; owner: string; payload: unknown }, merge?: Merge): OutboxItem {
      const list = read().slice();
      const t = now();
      let entry: OutboxItem | null = null;
      for (let i = 0; i < list.length && !entry; i++) {
        const old = list[i];
        // Never merge into a save that is on its way: the merged part would be lost when it lands.
        if (old.kind !== item.kind || old.key !== item.key || old.owner !== item.owner || (old.lockedUntil ?? 0) > t) continue;
        const payload = merge ? merge(old.payload, item.payload) : item.payload;
        // A merge that answers undefined means "full": this save starts a new entry.
        if (payload === undefined) continue;
        entry = { ...old, payload, next: Math.min(old.next, t) };
        list[i] = entry;
      }
      if (!entry) {
        entry = { id: newId(), kind: item.kind, key: item.key, owner: item.owner, payload: item.payload, tries: 0, at: t, next: t };
        list.push(entry);
      }
      write(list.length > MAX_ITEMS ? list.slice(-MAX_ITEMS) : list);
      return entry;
    },
    /** Everything queued for this student. */
    list(owner?: string): OutboxItem[] {
      const all = read();
      return owner === undefined ? all.slice() : all.filter((x) => x.owner === owner);
    },
    /** Saves that are due now for this student and not already on their way. */
    due(owner: string, at = now()): OutboxItem[] {
      return read().filter((x) => x.owner === owner && x.next <= at && !((x.lockedUntil ?? 0) > at));
    },
    /** Take the due saves for sending: they stay stored (a closed tab loses nothing) but are locked. */
    claim(owner: string, limit = 25, at = now()): OutboxItem[] {
      const picked = new Set(
        read()
          .filter((x) => x.owner === owner && x.next <= at && !((x.lockedUntil ?? 0) > at))
          .slice(0, limit)
          .map((x) => x.id),
      );
      if (!picked.size) return [];
      const list = read().map((x) => (picked.has(x.id) ? { ...x, lockedUntil: at + LOCK_MS } : x));
      write(list);
      return list.filter((x) => picked.has(x.id));
    },
    /** These saves are stored on the server (or can never be): forget them. */
    remove(ids: readonly string[]) {
      const gone = new Set(ids);
      write(read().filter((x) => !gone.has(x.id)));
    },
    /** A send failed: count it, unlock it and wait longer before the next one. */
    fail(ids: readonly string[], minWaitMs = 0) {
      const ids2 = new Set(ids);
      const t = now();
      write(
        read().map((x) => {
          if (!ids2.has(x.id)) return x;
          const tries = x.tries + 1;
          return { ...x, tries, lockedUntil: undefined, next: t + Math.max(backoff(tries), minWaitMs) };
        }),
      );
    },
    /** Unlock without counting a failure (the send was never answered, for example a beacon). */
    release(ids: readonly string[]) {
      const ids2 = new Set(ids);
      write(read().map((x) => (ids2.has(x.id) ? { ...x, lockedUntil: undefined } : x)));
    },
    /** Send everything due right away (back online, page shown again). */
    wake(owner: string) {
      const t = now();
      write(read().map((x) => (x.owner === owner && x.next > t ? { ...x, next: t } : x)));
    },
    /** Drop saves that are too old or have failed too often. Returns what was dropped. */
    prune(at = now()): OutboxItem[] {
      const list = read();
      const keep = list.filter((x) => at - x.at <= MAX_AGE_MS && x.tries <= MAX_TRIES);
      if (keep.length !== list.length) write(keep);
      return list.filter((x) => !keep.includes(x));
    },
    /** Test hook. */
    clear() {
      write([]);
    },
  };
}

/* ----------------------------------------------------- merges per kind */

type HistoryPayload = { tool: string; answers: { item: string; correct: boolean | null }[] };
type EventsPayload = { path: string; events: unknown[] };

/** Answers for one tool pile up in one save, up to the 100 the server takes at a time; then a new save starts. */
export function mergeHistory(older: unknown, newer: unknown): unknown {
  const a = older as HistoryPayload;
  const b = newer as HistoryPayload;
  const answers = [...(a?.answers ?? []), ...(b?.answers ?? [])];
  return answers.length > 100 ? undefined : { tool: b.tool, answers };
}

/** Learning events for one page pile up in one save, up to the 50 the server takes at a time; then a new save starts. */
export function mergeEvents(older: unknown, newer: unknown): unknown {
  const a = older as EventsPayload;
  const b = newer as EventsPayload;
  const events = [...(a?.events ?? []), ...(b?.events ?? [])];
  return events.length > 50 ? undefined : { path: b.path, events };
}
