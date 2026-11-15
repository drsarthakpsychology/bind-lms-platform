import type { SaveItem, SaveResult } from "@/api/contract";
import { createStore } from "./store";
import type { KeyValue } from "./storage";

/**
 * The save outbox: watch progress and finished lectures are written to the
 * phone first, then sent to POST /save in batches of up to 25. An item stays
 * until the server answers "ok" or "drop". While sends fail, Home shows one
 * quiet line ("Couldn't save, retrying") and the outbox tries again with a
 * growing wait (2 s, 4 s ... up to a minute).
 */
export type OutboxState = { pending: number; retrying: boolean };

const KEY = "vibha.outbox.v1";
type Post = (items: SaveItem[]) => Promise<SaveResult>;

export function createOutbox(deps: { store: KeyValue; post: Post; schedule?: (fn: () => void, ms: number) => unknown; newId?: () => string }) {
  const state = createStore<OutboxState>({ pending: 0, retrying: false });
  let items: SaveItem[] = [];
  let loaded = false;
  let sending: Promise<void> | null = null;
  let failures = 0;
  let n = 0;
  const schedule = deps.schedule ?? ((fn: () => void, ms: number) => setTimeout(fn, ms));
  const newId = deps.newId ?? (() => `s${Date.now().toString(36)}${(n++).toString(36)}`);

  async function load(): Promise<void> {
    if (loaded) return;
    loaded = true;
    try {
      const raw = await deps.store.get(KEY);
      const saved = raw ? (JSON.parse(raw) as SaveItem[]) : [];
      // Items added before the load finished stay after the saved ones.
      items = [...saved.filter((s) => !items.some((i) => i.id === s.id)), ...items];
    } catch {
      /* a broken copy is dropped */
    }
    state.set({ pending: items.length });
  }

  async function persist(): Promise<void> {
    state.set({ pending: items.length });
    await deps.store.set(KEY, JSON.stringify(items)).catch(() => undefined);
  }

  /** Progress for one lecture replaces the older progress item of the same lecture. */
  function merge(item: SaveItem): void {
    if (item.kind === "progress") {
      const i = items.findIndex((x) => x.kind === "progress" && x.payload.lessonId === item.payload.lessonId);
      if (i >= 0) {
        const old = items[i] as Extract<SaveItem, { kind: "progress" }>;
        items[i] = { ...item, payload: { ...item.payload, watched: Math.max(old.payload.watched, item.payload.watched) } };
        return;
      }
    }
    items.push(item);
  }

  async function sendOnce(): Promise<void> {
    await load();
    while (items.length) {
      const batch = items.slice(0, 25);
      let res: SaveResult;
      try {
        res = await deps.post(batch);
      } catch {
        failures += 1;
        state.set({ retrying: true });
        schedule(() => void flush(), Math.min(60_000, 1000 * 2 ** failures));
        return;
      }
      failures = 0;
      const done = new Set(res.results.filter((r) => r.status === "ok" || r.status === "drop").map((r) => r.id));
      const before = items.length;
      items = items.filter((i) => !done.has(i.id));
      await persist();
      if (items.length === before) {
        // The server asked to keep everything ("retry"): try again later, not in a loop.
        state.set({ retrying: true });
        schedule(() => void flush(), 15_000);
        return;
      }
    }
    state.set({ retrying: false });
  }

  function flush(): Promise<void> {
    if (!sending) sending = sendOnce().finally(() => (sending = null));
    return sending;
  }

  return {
    state,
    async add(item: Omit<SaveItem, "id"> & { id?: string }): Promise<void> {
      await load();
      merge({ ...item, id: item.id ?? newId() } as SaveItem);
      await persist();
      void flush();
    },
    flush,
    items: () => items,
    /** Sign-out: what was not sent belongs to the old account. */
    async clear(): Promise<void> {
      items = [];
      loaded = true;
      await persist();
      state.set({ retrying: false });
    },
  };
}

export type Outbox = ReturnType<typeof createOutbox>;
