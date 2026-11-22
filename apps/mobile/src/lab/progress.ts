import * as React from "react";

import { prefs } from "@/lib/storage";
import { createStore } from "@/lib/store";
import { runNumbers, saveCheck, saveRun, useLabHome } from "./data";
import type { LabResult } from "./runners-a";
import type { LabRecord } from "./types";

/**
 * What a student has run in the Lab. The record (runs, check score, when the
 * re-check is due) is the server's, in the learn state, the same one the
 * website keeps. This phone only remembers how the last result looked (its
 * lines and bars), to draw it again; the server keeps its numbers.
 */
export type LabDone = Record<string, { result: LabResult; check?: { right: number; total: number }; record: LabRecord }>;
const KEY = "vibha.lab.shown";
const store = createStore<{ shown: Record<string, LabResult>; loaded: boolean }>({ shown: {}, loaded: false });

function load() {
  if (store.get().loaded) return;
  store.set({ loaded: true });
  void prefs
    .get(KEY)
    .then((v) => {
      const saved = v ? (JSON.parse(v) as Record<string, LabResult>) : {};
      if (saved && typeof saved === "object") store.set({ shown: { ...saved, ...store.get().shown } });
    })
    .catch(() => undefined);
}

/** A finished run: drawn at once, saved on the server. */
export function recordRun(id: string, result: LabResult): void {
  load();
  const shown = { ...store.get().shown, [id]: result };
  store.set({ shown });
  void prefs.set(KEY, JSON.stringify(shown)).catch(() => undefined);
  void saveRun(id, runNumbers(result.lines));
}
/** The check answers, graded on the server. */
export function recordCheck(id: string, answers: number[]): void {
  void saveCheck(id, answers);
}

/** A result drawn from the server's numbers, for a run made on another device or on the website. */
function fromRecord(r: LabRecord): LabResult {
  const lines = Object.entries(r.result).map(([k, v]) => ({ label: k.replace(/-/g, " ").replace(/^./, (x) => x.toUpperCase()), value: String(v) }));
  return { headline: r.runs === 1 ? "Run once" : `Run ${r.runs} times`, lines };
}

export function useLabDone(): LabDone {
  React.useEffect(load, []);
  const shown = store.use((s) => s.shown);
  const records = useLabHome().data?.records;
  return React.useMemo(() => {
    const out: LabDone = {};
    for (const [id, rec] of Object.entries(records ?? {})) out[id] = { result: shown[id] ?? fromRecord(rec), check: rec.check ?? undefined, record: rec };
    return out;
  }, [records, shown]);
}
