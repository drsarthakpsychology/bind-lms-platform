import * as React from "react";

import { prefs } from "./storage";
import { createStore } from "./store";

/**
 * A short "recently opened" list kept on this phone (newest first), for the
 * Practise hub (what you opened, the last Exam Prep subject) and the medicine
 * library (Recently opened). Loaded once per list; writes are fire and forget.
 */
export type Recent = {
  /** Put `id` first. */
  add: (id: string) => void;
  /** The ids, newest first; empty until loaded. */
  use: () => string[];
};

export function recentList(name: string, max = 8): Recent {
  const key = `vibha.recent.${name}`;
  const store = createStore<{ ids: string[]; loaded: boolean }>({ ids: [], loaded: false });
  const load = () => {
    if (store.get().loaded) return;
    store.set({ loaded: true });
    void prefs
      .get(key)
      .then((v) => {
        const saved = v ? (JSON.parse(v) as unknown) : [];
        if (!Array.isArray(saved)) return;
        // Ids added before the read finished stay first.
        const now = store.get().ids;
        store.set({ ids: [...now, ...saved.filter((x): x is string => typeof x === "string" && !now.includes(x))].slice(0, max) });
      })
      .catch(() => undefined);
  };
  return {
    add: (id) => {
      load();
      const ids = [id, ...store.get().ids.filter((x) => x !== id)].slice(0, max);
      store.set({ ids });
      void prefs.set(key, JSON.stringify(ids)).catch(() => undefined);
    },
    use: () => {
      React.useEffect(load, []);
      return store.use((s) => s.ids);
    },
  };
}

/** Practise rows opened from the hub, by the server's row id. */
export const recentPractise = recentList("practise");
/** Exam Prep subjects opened, by subject id. */
export const recentPrep = recentList("prep", 3);
/** Medicine pages opened, by medicine id. */
export const recentMedicines = recentList("medicines", 3);
