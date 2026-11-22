import { useQuery } from "@tanstack/react-query";

import { ApiFailure } from "@/api/errors";
import { queryClient } from "@/api/queries";
import { api } from "@/auth";
import { toast } from "@/ds/toast";
import type { CaseActivity } from "@/casebook/types";
import type { LabHome, LabLists, LabRecord, LabWrite } from "./types";

/**
 * The Lab and the Casebook, from the website (GET /lab, GET /casebook).
 * Runs, checks and case scores are saved on the server in the student's
 * learn state; the check questions are graded there. Nothing here is sample
 * data: the browser build's mock server answers the same routes.
 */

type Shown<A> = A extends unknown ? Omit<A, "bookRef" | "reviewFlags"> : never;
export type Case = Shown<CaseActivity>;
export type CaseRecord = LabRecord & { tier: 1 | 2 | 3 };
/** GET /casebook */
export type CasebookHome = { v: 1; today: string; cases: Case[]; modules: Record<string, string>; records: Record<string, CaseRecord> };

export const labKeys = { lab: ["lab", "home"] as const, casebook: ["lab", "casebook"] as const };

export const useLabHome = (enabled = true) => useQuery({ queryKey: labKeys.lab, queryFn: () => api.get<LabHome>("/lab"), staleTime: 10 * 60_000, enabled });
export const useCasebook = (enabled = true) => useQuery({ queryKey: labKeys.casebook, queryFn: () => api.get<CasebookHome>("/casebook"), staleTime: 10 * 60_000, enabled });

const NO_LISTS: LabLists = { BIASES: [], BIAS_CASES: [], CONS_TASK_TEXT: {}, CONS_ITEMS: [], CONS_STAGES: [], CONS_REASONS: [], ATTRIBUTION_CASES: [], CORR_READINGS: [], CORR_SCENARIOS: [] };
/** The runners' lists from the loaded Lab (a runner opens only from a loaded experiment page). */
export const useLabLists = (): LabLists => useLabHome().data?.data ?? NO_LISTS;

/** The module a case belongs to, in the website's words. */
export function moduleName(home: CasebookHome | undefined, id: string): string {
  return home?.modules[id] ?? id.replace(/-/g, " ").replace(/^./, (x) => x.toUpperCase());
}

/** The headline numbers of a run, as the server keeps them: the first number in each line, keyed by its label. */
export function runNumbers(lines: readonly { label: string; value: string }[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const l of lines) {
    if (Object.keys(out).length >= 12) break;
    const m = /-?\d+(?:\.\d+)?/.exec(l.value);
    const key = l.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
    if (m && key && !(key in out)) out[key] = Number(m[0]);
  }
  return out;
}

function failed(e: unknown) {
  toast.show(e instanceof ApiFailure && e.code !== "network" ? e.message : "Not saved. Check your connection and try again.");
}

async function send(path: string, body: unknown, id: string, list: "lab" | "casebook"): Promise<LabRecord | null> {
  try {
    const r = await api.post<LabWrite>(path, body);
    if (list === "lab") queryClient.setQueryData<LabHome>(labKeys.lab, (old) => (old ? { ...old, records: { ...old.records, [id]: r.record } } : old));
    else void queryClient.invalidateQueries({ queryKey: labKeys.casebook });
    return r.record;
  } catch (e) {
    failed(e);
    return null;
  }
}

const seg = encodeURIComponent;
export const saveRun = (id: string, numbers: Record<string, number>) => send(`/lab/${seg(id)}/run`, { numbers }, id, "lab");
export const saveCheck = (id: string, answers: number[]) => send(`/lab/${seg(id)}/check`, { answers }, id, "lab");
export const saveReflect = (id: string) => send(`/lab/${seg(id)}/reflect`, {}, id, "lab");
export const saveCase = (id: string, right: number, total: number) => send(`/casebook/${seg(id)}/done`, { right, total }, id, "casebook");
