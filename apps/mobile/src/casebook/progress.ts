import * as React from "react";

import { recentList } from "@/lib/recent";
import { prefs } from "@/lib/storage";
import { createStore } from "@/lib/store";

/**
 * Saved cases and best scores, kept on this phone only until the Casebook has
 * an API (docs/CONNECT-blab.md). On the website both live in the student's
 * learn state on the server.
 */
export const savedCases = recentList("casebook-saved", 60);

type Best = Record<string, { right: number; total: number }>;
const KEY = "vibha.casebook.best";
const store = createStore<{ best: Best; loaded: boolean }>({ best: {}, loaded: false });
function load() {
  if (store.get().loaded) return;
  store.set({ loaded: true });
  void prefs
    .get(KEY)
    .then((v) => {
      const saved = v ? (JSON.parse(v) as Best) : {};
      if (saved && typeof saved === "object") store.set({ best: { ...saved, ...store.get().best } });
    })
    .catch(() => undefined);
}

export function recordCase(id: string, right: number, total: number): void {
  load();
  const old = store.get().best[id];
  if (old && old.right / Math.max(1, old.total) >= right / Math.max(1, total)) return;
  const best = { ...store.get().best, [id]: { right, total } };
  store.set({ best });
  void prefs.set(KEY, JSON.stringify(best)).catch(() => undefined);
}

export function useBest(): Best {
  React.useEffect(load, []);
  return store.use((s) => s.best);
}
