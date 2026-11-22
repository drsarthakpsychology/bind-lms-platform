import "server-only";
import { z } from "zod";
import { saveLearnState } from "@/app/(dashboard)/study/actions";
import { istToday, recordLabCheck, recordLabReflection, recordLabRun, type LabRecord, type LearnState } from "@/lib/learn/engine";
import { BIAS_CASES, BIASES, EXPERIMENTS, experimentById, type LabExperiment } from "@/lib/lab/experiments";
import { ATTRIBUTION_CASES, CONS_ITEMS, CONS_REASONS, CONS_STAGES, CONS_TASK_TEXT, CORR_READINGS, CORR_SCENARIOS } from "@/lib/lab/experiments2";
import { CASEBOOK, caseById, caseKey } from "@/content/casebook";
import { nextTier } from "@/lib/casebook/rounds";
import type { CaseActivity } from "@/lib/casebook/types";
import { moduleById } from "@/lib/study";
import { myLearnState } from "./learn-state";
import { ApiFail } from "./respond";

/**
 * The Psychology Lab and the Casebook for the app: the website's own content
 * (src/lib/lab, src/content/casebook) and the student's own Lab records in
 * the learn state (recordLabRun, recordLabCheck, recordLabReflection, the
 * same functions the website's pages call). Educator-only notes (book
 * references, review flags) never leave the server. Every write reads the
 * stored state, applies one checked change on the server and saves it with
 * the website's saveLearnState (points clamped, never going backwards).
 */

export const LAB_GATE = { path: "/games/lab", flag: "lab" } as const;

/** One stored record, as the app reads it. */
export type LabRecordOut = { runs: number; last: string; result: Record<string, number>; check: { right: number; total: number } | null; recheckDue: string | null; reflected: boolean };
export type LabExperimentOut = Omit<LabExperiment, "bookRefs">;
export type LabHome = {
  v: 1;
  today: string;
  experiments: LabExperimentOut[];
  /** What the runners need (bias cases, conservation items, ...), the website's lists. */
  data: {
    BIASES: readonly string[];
    BIAS_CASES: typeof BIAS_CASES;
    CONS_TASK_TEXT: typeof CONS_TASK_TEXT;
    CONS_ITEMS: typeof CONS_ITEMS;
    CONS_STAGES: readonly string[];
    CONS_REASONS: readonly string[];
    ATTRIBUTION_CASES: typeof ATTRIBUTION_CASES;
    CORR_READINGS: readonly string[];
    CORR_SCENARIOS: typeof CORR_SCENARIOS;
  };
  /** By experiment id: only what this student has run. */
  records: Record<string, LabRecordOut>;
};
type Shown<A> = A extends unknown ? Omit<A, "bookRef" | "reviewFlags"> : never;
export type CaseOut = Shown<CaseActivity>;
export type CasebookHome = { v: 1; today: string; cases: CaseOut[]; modules: Record<string, string>; records: Record<string, LabRecordOut & { tier: 1 | 2 | 3 }> };
export type LabWrite = { v: 1; record: LabRecordOut };

export function recordOut(r: LabRecord): LabRecordOut {
  return { runs: r.runs, last: r.last, result: r.result, check: r.check, recheckDue: r.check ? r.recheck.due : null, reflected: r.reflected };
}

export function experimentOut(e: LabExperiment): LabExperimentOut {
  const { bookRefs: _b, ...rest } = e;
  void _b;
  return rest;
}

export function caseOut(c: CaseActivity): CaseOut {
  const { bookRef: _b, reviewFlags: _r, ...rest } = c;
  void _b;
  void _r;
  return rest as CaseOut;
}

const isCaseKey = (k: string) => k.startsWith("cb-");

export function labHome(s: LearnState): LabHome {
  const records: Record<string, LabRecordOut> = {};
  for (const [id, r] of Object.entries(s.lab)) if (!isCaseKey(id) && experimentById(id)) records[id] = recordOut(r);
  return {
    v: 1,
    today: istToday(),
    experiments: EXPERIMENTS.map(experimentOut),
    data: { BIASES, BIAS_CASES, CONS_TASK_TEXT, CONS_ITEMS, CONS_STAGES, CONS_REASONS, ATTRIBUTION_CASES, CORR_READINGS, CORR_SCENARIOS },
    records,
  };
}

export function casebookHome(s: LearnState): CasebookHome {
  const records: CasebookHome["records"] = {};
  for (const c of CASEBOOK) {
    const r = s.lab[caseKey(c.id)];
    if (r) records[c.id] = { ...recordOut(r), tier: nextTier(r.result as { right: number; total: number; tier?: number }) };
  }
  const modules = Object.fromEntries([...new Set(CASEBOOK.map((c) => c.module))].map((m) => [m, moduleById(m)?.title ?? m]));
  return { v: 1, today: istToday(), cases: CASEBOOK.map(caseOut), modules, records };
}

/** Bodies the app sends. Small and strict: the server works out the rest. */
export const runSchema = z.object({ numbers: z.record(z.string().min(1).max(40), z.number().finite().min(-1e6).max(1e6)).refine((o) => Object.keys(o).length <= 12) });
export const checkSchema = z.object({ answers: z.array(z.number().int().min(-1).max(20)).min(1).max(20) });
export const caseDoneSchema = z.object({ right: z.number().int().min(0).max(200), total: z.number().int().min(1).max(200) });

/** How many scored steps one play of a case can have at most (a round never has more than its items). */
export function caseSize(c: CaseActivity): number {
  switch (c.format) {
    case "matching":
      return c.pairs.length;
    case "branching":
      return c.nodes.length;
    case "timeline":
      return c.events.length;
    default:
      return c.items.length;
  }
}

/** The check questions, graded here against the website's keys. A missing or wrong-length set is refused. */
export function gradeChecks(e: LabExperiment, answers: readonly number[]): { right: number; total: number } {
  if (answers.length !== e.checks.length) throw new ApiFail("bad_request", "Answer every question, then send them together.");
  const right = e.checks.reduce((n, k, i) => n + (answers[i] === k.answer ? 1 : 0), 0);
  return { right, total: e.checks.length };
}

export const applyRun = (s: LearnState, id: string, numbers: Record<string, number>, today: string) => recordLabRun(s, id, numbers, today);
export const applyCheck = (s: LearnState, id: string, right: number, total: number, today: string) => {
  if (!s.lab[id]) throw new ApiFail("conflict", "Run the experiment first, then check yourself.");
  return recordLabCheck(s, id, right, total, today);
};
export const applyReflect = (s: LearnState, id: string, today: string) => {
  if (!s.lab[id]) throw new ApiFail("conflict", "Run the experiment first.");
  return recordLabReflection(s, id, today);
};
/** One finished play of a case: the tier is the server's (from the stored record), the score is checked against the case's size. */
export function applyCaseDone(s: LearnState, c: CaseActivity, right: number, total: number, today: string): LearnState {
  if (right > total || total > caseSize(c)) throw new ApiFail("bad_request", "That score does not fit this case.");
  const key = caseKey(c.id);
  const prev = s.lab[key];
  const tier = nextTier(prev ? (prev.result as { right: number; total: number; tier?: number }) : null);
  const ran = recordLabRun(s, key, { right, total, tier }, today);
  return recordLabCheck(ran, key, right, total, today);
}

export function experimentOr404(id: string): LabExperiment {
  const e = experimentById(id);
  if (!e) throw new ApiFail("not_found");
  return e;
}
export function caseOr404(id: string): CaseActivity {
  const c = caseById(id);
  if (!c) throw new ApiFail("not_found");
  return c;
}

/** Read, change, save, then answer with the stored record. */
export async function writeLab(key: string, change: (s: LearnState, today: string) => LearnState): Promise<LabWrite> {
  const today = istToday();
  const next = change(await myLearnState(), today);
  const r = await saveLearnState(next);
  if (!r.ok) throw new ApiFail(r.retry === false ? "too_large" : "server_error", r.retry === false ? undefined : "Couldn't save. Try again.");
  const stored = (await myLearnState()).lab[key] ?? next.lab[key];
  if (!stored) throw new ApiFail("server_error", "Couldn't save. Try again.");
  return { v: 1, record: recordOut(stored) };
}
