/**
 * The browser build's answers for GET /lab, /casebook and /prep/interview
 * and their writes, from samples of the website's content (lab.json,
 * casebook.json, interview.json, copied 21 Nov 2026). Loaded only when
 * EXPO_PUBLIC_API_MODE is "mock" (src/api/mock/server.ts), so a release
 * build carries none of it. The answer keys stay here, as on the server.
 */
import type { RawResponse } from "@/api/client";
import type { CasebookHome, Case } from "@/lab/data";
import type { LabHome, LabRecord } from "@/lab/types";
import labRaw from "./lab.json";
import caseRaw from "./casebook.json";
import interviewRaw from "./interview.json";

type IQ = { id: string; category: string; question: string; followUps: string[]; modelAnswer: string; mustCover: string[]; redFlags: string[] };
const LAB = labRaw as unknown as Omit<LabHome, "v" | "today" | "records"> & { experiments: LabHome["experiments"] } & Record<string, unknown>;
const CASES = caseRaw as unknown as Case[];
const IVS = interviewRaw as unknown as IQ[];
const LABEL: Record<string, string> = { motivation: "About you", academic: "Subject knowledge", "clinical-vignette": "A case", assessment: "Tests and assessment", research: "Research", ethics: "Ethics and law", "current-affairs": "Current affairs" };
const ORDER = ["motivation", "academic", "clinical-vignette", "assessment", "research", "ethics", "current-affairs"];
const MODULES: Record<string, string> = { "interview-mse": "Interview and mental state", "ethics-law": "Ethics and law", "medicine-profiles": "Medicines", antipsychotics: "Antipsychotics", stabilisers: "Mood stabilisers", antidepressants: "Antidepressants", substance: "Substance use", assessment: "Assessment", anxiety: "Anxiety" };

const ok = <T,>(data: T): RawResponse => ({ status: 200, json: { ok: true, data } });
const fail = (status: number, code: string, message: string): RawResponse => ({ status, json: { ok: false, error: { code, message } } });
const today = () => new Date().toISOString().slice(0, 10);

let records: Record<string, LabRecord> = {};
let turn = 0;
export function resetLabMock() {
  records = {};
  turn = 0;
}

function bump(key: string, result: Record<string, number>): LabRecord {
  const prev = records[key];
  const r: LabRecord = prev ? { ...prev, runs: prev.runs + 1, last: today(), result } : { runs: 1, last: today(), result, check: null, recheckDue: null, reflected: false };
  records[key] = r;
  return r;
}

function panel() {
  const out: IQ[] = [];
  for (const c of ORDER) {
    const pool = IVS.filter((q) => q.category === c);
    const q = pool[turn % Math.max(1, pool.length)];
    if (q && out.length < 5) out.push(q);
  }
  turn++;
  return out.map((q) => ({ id: q.id, category: LABEL[q.category] ?? q.category, question: q.question, followUp: q.followUps[0] ?? null }));
}

/** Answers one of these routes, or null. `kind` is the signed-in account's kind. */
export function labRoute(method: string, path: string, body: unknown, kind: string): RawResponse | null {
  const seg = path.split("?")[0]!.split("/").filter(Boolean);
  const b = (body ?? {}) as Record<string, unknown>;
  if (seg[0] === "prep" && seg[1] === "interview" && method === "GET") return ok({ v: 1, questions: panel(), saving: kind === "student" });
  if (seg[0] === "play" && seg[1] === "prep" && (seg[2] === "interviewReveal" || seg[2] === "interviewSave")) {
    const args = (b.args as unknown[]) ?? [];
    if (seg[2] === "interviewReveal") {
      const q = IVS.find((x) => x.id === args[0]);
      return ok({ kind: "prep.interviewReveal", v: 1, data: q ? { modelAnswer: q.modelAnswer, mustCover: q.mustCover, redFlags: q.redFlags } : { error: "That question is gone." } });
    }
    const items = ((args[0] as { items?: { id: string; covered: string[]; flags: string[] }[] })?.items ?? []).flatMap((it) => {
      const q = IVS.find((x) => x.id === it.id);
      if (!q) return [];
      const base = q.mustCover.length ? (it.covered.filter((c) => q.mustCover.includes(c)).length / q.mustCover.length) * 100 : 0;
      return [Math.max(0, Math.min(100, Math.round(base - 15 * it.flags.filter((f) => q.redFlags.includes(f)).length)))];
    });
    return ok({ kind: "prep.interviewSave", v: 1, data: { saved: kind === "student", score: items.length ? Math.round(items.reduce((a, x) => a + x, 0) / items.length) : 0 } });
  }
  if (seg[0] !== "lab" && seg[0] !== "casebook") return null;
  if (kind === "lecture") return fail(403, "scope", "Your account is for lectures only.");
  if (seg[0] === "lab") {
    if (method === "GET" && seg.length === 1) {
      const own = Object.fromEntries(Object.entries(records).filter(([k]) => !k.startsWith("cb-")));
      const { experiments, ...data } = LAB;
      return ok({ v: 1, today: today(), experiments, data, records: own });
    }
    const e = LAB.experiments.find((x) => x.id === seg[1]);
    if (!e || method !== "POST") return fail(404, "not_found", "Not found.");
    if (seg[2] === "run") return ok({ v: 1, record: bump(e.id, (b.numbers as Record<string, number>) ?? {}) });
    const prev = records[e.id];
    if (!prev) return fail(409, "conflict", "Run the experiment first, then check yourself.");
    if (seg[2] === "check") {
      const answers = (b.answers as number[]) ?? [];
      if (answers.length !== e.checks.length) return fail(400, "bad_request", "Answer every question, then send them together.");
      const right = e.checks.filter((k, i) => answers[i] === k.answer).length;
      records[e.id] = { ...prev, check: { right, total: e.checks.length }, recheckDue: today() };
      return ok({ v: 1, record: records[e.id] });
    }
    if (seg[2] === "reflect") return ok({ v: 1, record: (records[e.id] = { ...prev, reflected: true }) });
    return fail(404, "not_found", "Not found.");
  }
  if (method === "GET" && seg.length === 1) {
    const recs: CasebookHome["records"] = {};
    for (const c of CASES) {
      const r = records[`cb-${c.id}`];
      if (r) recs[c.id] = { ...r, tier: 2 };
    }
    return ok<CasebookHome>({ v: 1, today: today(), cases: CASES, modules: MODULES, records: recs });
  }
  const c = CASES.find((x) => x.id === seg[1]);
  if (!c || method !== "POST" || seg[2] !== "done") return fail(404, "not_found", "Not found.");
  const right = Number(b.right) || 0;
  const total = Number(b.total) || 0;
  const r = bump(`cb-${c.id}`, { right, total, tier: 2 });
  records[`cb-${c.id}`] = { ...r, check: { right, total } };
  return ok({ v: 1, record: records[`cb-${c.id}`] });
}
