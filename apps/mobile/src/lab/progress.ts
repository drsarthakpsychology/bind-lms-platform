import * as React from "react";

import { prefs } from "@/lib/storage";
import { createStore } from "@/lib/store";
import type { LabResult } from "./runners-a";

/**
 * What a student has run in the Lab, kept on this phone only until the Lab
 * has an API (docs/CONNECT-blab.md). On the website this lives in the
 * student's learn state on the server (recordLabRun, recordLabCheck).
 */
export type LabDone = Record<string, { result: LabResult; check?: { right: number; total: number } }>;
const KEY = "vibha.lab.done";
const store = createStore<{ done: LabDone; loaded: boolean }>({ done: {}, loaded: false });

function load() {
  if (store.get().loaded) return;
  store.set({ loaded: true });
  void prefs
    .get(KEY)
    .then((v) => {
      const saved = v ? (JSON.parse(v) as LabDone) : {};
      if (saved && typeof saved === "object") store.set({ done: { ...saved, ...store.get().done } });
    })
    .catch(() => undefined);
}
function save(done: LabDone) {
  store.set({ done });
  void prefs.set(KEY, JSON.stringify(done)).catch(() => undefined);
}

export function recordRun(id: string, result: LabResult): void {
  load();
  save({ ...store.get().done, [id]: { ...store.get().done[id], result } });
}
export function recordCheck(id: string, right: number, total: number): void {
  load();
  const old = store.get().done[id];
  if (old) save({ ...store.get().done, [id]: { ...old, check: { right, total } } });
}
export function useLabDone(): LabDone {
  React.useEffect(load, []);
  return store.use((s) => s.done);
}
