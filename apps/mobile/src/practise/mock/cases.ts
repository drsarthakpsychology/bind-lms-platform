/* Case tools, Exam Prep and the hub, on the mock server (mock builds only). */
import dict from "../data/dictionaries.json";
import type * as P from "../types";
import { CONTENT, FAIL, held, keep, nextSeed, PlayError, rng, shuffled } from "./kit";
import { escapeSaved, wardSaved } from "./games";

const DX = dict.DIAGNOSES as { id: string; name: string; chapter: string }[];
const CH = dict.CHAPTERS as Record<string, { name: string }>;
const dxName = (id: string) => DX.find((d) => d.id === id)?.name ?? id;

/** What this student has finished and started (the case-progress rows). */
const doneItems = new Set<string>(["wwyd:sc-mania-1", "ethics:mha-advance-directive"]);
const started = new Map<string, { title: string; step: string; token: string }>();

/* ------------------------------------------------------------------ daily */
type DailyCase = { id: string; difficulty: 1 | 2 | 3; chapter: string; answer: string; synonyms: string[]; setting: string; clues: string[]; investigations: { kind: P.DailyKind; label: string; result: string }[]; differentials: { dx: string; whyNot: string }[]; overview: string; pointer: string; module: string };
const DAILY = CONTENT.DAILY as DailyCase[];
type Prog = { clues: number; invs: number[]; guesses: P.DailyView["guesses"]; hints: number; status: P.DailyView["status"]; chapterHit: boolean; marks: string[]; log: P.DailyAction[] };
const dailyRows = new Map<string, Prog>();
const fresh = (): Prog => ({ clues: 1, invs: [], guesses: [], hints: 0, status: "playing", chapterHit: false, marks: [], log: [] });
const used = (p: Prog) => p.clues - 1 + p.invs.length;
const scoreOf = (p: Prog) => (p.status === "solved" ? Math.max(0, Math.max(10, 100 - 15 * used(p)) - 10 * p.hints) : p.status === "lost" ? (p.chapterHit ? 15 : 0) : 0);
const canClue = (p: Prog) => p.status === "playing" && p.clues < 6 && p.clues + 1 <= 3;
function applyDaily(c: DailyCase, p: Prog, a: P.DailyAction): Prog {
  if (p.status !== "playing") return p;
  const log = [...p.log, a];
  switch (a.t) {
    case "clue":
      return canClue(p) ? { ...p, clues: p.clues + 1, marks: [...p.marks, "clue"], log } : p;
    case "inv":
      return a.i >= 0 && a.i < c.investigations.length && !p.invs.includes(a.i) ? { ...p, invs: [...p.invs, a.i], marks: [...p.marks, "inv"], log } : p;
    case "hint":
      return p.hints < 2 ? { ...p, hints: p.hints + 1, marks: [...p.marks, "hint"], log } : p;
    case "giveup":
      return { ...p, status: "lost", log };
    case "guess": {
      if (!DX.some((d) => d.id === a.dx) || p.guesses.some((g) => g.dx === a.dx)) return p;
      if (a.dx === c.answer || c.synonyms.includes(a.dx)) return { ...p, status: "solved", guesses: [...p.guesses, { dx: a.dx, name: dxName(a.dx), ok: true, sameChapter: true, reason: "" }], marks: [...p.marks, "hit"], log };
      const g = DX.find((d) => d.id === a.dx)!;
      const sameChapter = g.chapter === c.chapter;
      const own = c.differentials.find((x) => x.dx === a.dx);
      const reason = own ? own.whyNot : `${sameChapter ? `Right chapter (${CH[c.chapter]?.name ?? c.chapter}), wrong disorder. ` : ""}The clues so far don't fit ${g.name}.`;
      const guesses = [...p.guesses, { dx: a.dx, name: g.name, ok: false, sameChapter, reason }];
      const chapterHit = p.chapterHit || (sameChapter && p.hints === 0);
      const marks = [...p.marks, sameChapter ? "near" : "miss"];
      if (p.clues >= 6) return { ...p, guesses, chapterHit, marks, status: "lost", log };
      return { ...p, guesses, chapterHit, marks, clues: p.clues + 1, log };
    }
  }
}
const SQ: Record<string, string> = { clue: "⬜", inv: "🔎", hint: "💡", near: "🟨", miss: "🟥", hit: "🟩" };
function dailyView(c: DailyCase, p: Prog, mode: "daily" | "practice"): P.DailyView {
  const over = p.status !== "playing";
  return {
    mode,
    caseId: c.id,
    ai: false,
    difficulty: c.difficulty,
    setting: c.setting,
    clues: c.clues.slice(0, p.clues),
    cluesOpen: p.clues,
    unopened: Math.max(0, c.clues.length - p.clues) + c.investigations.filter((_, i) => !p.invs.includes(i)).length,
    investigations: c.investigations.map((x, i) => ({ i, kind: x.kind, label: x.label, result: p.invs.includes(i) ? x.result : null, ordered: p.invs.includes(i) })),
    guesses: p.guesses,
    hints: { used: p.hints, chapter: p.hints >= 1 || over ? (CH[c.chapter]?.name ?? null) : null, pointer: p.hints >= 2 || over ? c.pointer : null },
    canClue: canClue(p),
    status: p.status,
    points: used(p),
    score: scoreOf(p),
    grid: p.marks.map((m) => SQ[m] ?? "").join(""),
    reveal: over ? { answer: dxName(c.answer), chapter: CH[c.chapter]?.name ?? c.chapter, topic: c.chapter, overview: c.overview, lookAlikes: c.differentials.map((x) => ({ name: dxName(x.dx), whyNot: x.whyNot })), module: c.module, refs: null } : null,
  };
}
const dailyCase = (mode: string, caseId?: string) => (mode === "practice" ? (DAILY.find((c) => c.id === caseId) ?? DAILY[1]!) : DAILY[0]!);
const daily = {
  move(input: { mode?: string; caseId?: string; action?: P.DailyAction }): P.DailyMove {
    const mode = input?.mode === "practice" ? "practice" : "daily";
    const c = dailyCase(mode, input?.caseId);
    const key = `${mode}:${c.id}`;
    const before = dailyRows.get(key) ?? fresh();
    const after = input.action ? applyDaily(c, before, input.action) : before;
    dailyRows.set(key, after);
    const justFinished = before.status === "playing" && after.status !== "playing";
    if (justFinished && mode === "daily") doneItems.add("daily:today");
    return { ok: true, view: dailyView(c, after, mode), meta: { day: "2026-11-15", number: 47, streak: 6, playedDays: [], hints: null, cohort: null, stored: true }, log: after.log, justFinished, xp: justFinished ? Math.round(scoreOf(after) / 10) + (mode === "daily" ? 5 : 0) : 0, xpSaved: true };
  },
  rest(input: { mode?: string; caseId?: string }): { ok: true; rest: { clues: { n: number; text: string }[]; tests: { kind: P.DailyKind; label: string; result: string }[] } } {
    const mode = input?.mode === "practice" ? "practice" : "daily";
    const c = dailyCase(mode, input?.caseId);
    const p = dailyRows.get(`${mode}:${c.id}`);
    if (!p || p.status === "playing") throw FAIL();
    return { ok: true, rest: { clues: c.clues.slice(p.clues).map((text, i) => ({ n: p.clues + i + 1, text })), tests: c.investigations.filter((_, i) => !p.invs.includes(i)) } };
  },
  next(_local: unknown, current?: unknown): { ok: true; caseId: string; target: string; recycled: boolean } {
    const others = DAILY.slice(1).filter((c) => c.id !== current);
    const c = others[nextSeed() % others.length] ?? DAILY[1]!;
    dailyRows.delete(`practice:${c.id}`);
    return { ok: true, caseId: c.id, target: `/practice/daily?case=${c.id}`, recycled: false };
  },
};

/* -------------------------------------------------------------- detective */
type DetCase = { answer: string; family: "drug" | "disorder"; clues: string[] };
const DET = CONTENT.DETECTIVE as DetCase[];
const detName = (c: DetCase | string) => {
  const a = typeof c === "string" ? c : c.answer;
  const s = a.replace(/-/g, " ");
  return DX.find((d) => d.id === a)?.name ?? s.charAt(0).toUpperCase() + s.slice(1);
};
type DetRun = { cases: DetCase[]; options: string[][] };
const detective = {
  deal(family: unknown): P.DetDeal {
    const r = rng(nextSeed());
    const pool = DET.filter((c) => family === "mixed" || !family || c.family === family);
    const cases = shuffled(pool, r).slice(0, 8);
    const options = cases.map((c) => shuffled([c, ...shuffled(pool.filter((x) => x.family === c.family && x.answer !== c.answer), r).slice(0, 3)].map(detName), r));
    const marks: P.CaseMark[] = cases.map((_, i) => (i === 0 ? "new" : i === 1 ? "week" : "new"));
    return { ok: true, token: keep<DetRun>({ cases, options }), run: "mock", rounds: cases.map((c, i) => ({ options: options[i]!, clue: c.clues[0]! })), marks, recycled: false };
  },
  clue(token: unknown, round: unknown, n: unknown): { ok: true; clue: string } {
    const c = held<DetRun>(token).cases[Number(round)];
    const clue = c?.clues[Number(n)];
    if (!clue) throw FAIL();
    return { ok: true, clue };
  },
  clues(token: unknown, round: unknown): { ok: true; clues: string[] } {
    const c = held<DetRun>(token).cases[Number(round)];
    if (!c) throw FAIL();
    return { ok: true, clues: c.clues };
  },
  guess(token: unknown, round: unknown, guess: unknown, final: unknown): { ok: true; right: boolean; answer: string | null } {
    const c = held<DetRun>(token).cases[Number(round)];
    if (!c) throw FAIL();
    const right = guess === detName(c);
    if (right || final) doneItems.add(`detective:${c.answer}`);
    return { ok: true, right, answer: right || final === true ? detName(c) : null };
  },
};

/* ---------------------------------------------------------- case progress */
const cases = {
  progress(t: unknown): P.ProgressSnapshot {
    if (t === "ward") return { owner: "mock", rows: wardSaved().map((item) => ({ item, state: { step: "saved" }, at: Date.now() })) };
    if (t === "escape") return { owner: "mock", rows: escapeSaved().map(([item, token]) => ({ item, state: { token }, at: Date.now() })) };
    const rows = [...started.entries()].filter(([k]) => k.startsWith(`${t}:`)).map(([k, v]) => ({ item: k.split(":")[1]!, state: { step: v.step }, at: Date.now() }));
    return { owner: "mock", rows };
  },
  mark(tool: unknown, item: unknown, state: unknown): { ok: true } {
    const key = `${String(tool)}:${String(item)}`;
    if (state == null) {
      started.delete(key);
      doneItems.add(key);
    } else started.set(key, { title: String(item), step: "saved", token: JSON.stringify(state) });
    return { ok: true };
  },
};

/* ------------------------------------------------------------------- prep */
type PQ = P.PrepQView & { answer: number; explanation: string; difficulty: number };
const PREP = CONTENT.PREP as PQ[];
const TOPICS = CONTENT.PREP_TOPICS as { subject: string; topics: { id: string; title: string; ids: string[] }[] }[];
const SUBJECTS = CONTENT.PREP_SUBJECTS as { id: string; title: string }[];
const answered = new Map<string, boolean>();
type Long = { id: string; subject: string; topic: string; marks: number; difficulty: number; question: string; plan: string[]; answer: string; keyPoints: string[]; pitfalls?: string[] };
const LONG = CONTENT.LONG as Long[];
const prep = {
  check(input: { id?: string; choice?: number }): P.PrepChecked {
    const q = PREP.find((x) => x.id === input?.id);
    if (!q) throw new PlayError(400, "bad_request", "Unknown question");
    const correct = input.choice === q.answer;
    answered.set(q.id, correct);
    return { id: q.id, answer: q.answer, explanation: q.explanation, learnHref: "/study", correct };
  },
  reveal(qid: unknown): P.PrepReveal {
    const q = PREP.find((x) => x.id === qid);
    if (!q) throw new PlayError(400, "bad_request", "Unknown question");
    return { id: q.id, answer: q.answer, explanation: q.explanation, learnHref: "/study" };
  },
  save(): { ok: true } {
    return { ok: true };
  },
};

export const CASES: Record<string, Record<string, (...args: never[]) => unknown>> = {
  daily: { move: daily.move, rest: daily.rest, next: daily.next },
  detective: { deal: detective.deal, clue: detective.clue, clues: detective.clues, guess: detective.guess },
  cases: { progress: cases.progress, mark: cases.mark },
  prep: { check: prep.check, reveal: prep.reveal, save: prep.save },
};
export function resetCases() {
  dailyRows.clear();
  started.clear();
  answered.clear();
  doneItems.clear();
  doneItems.add("wwyd:sc-mania-1");
  doneItems.add("ethics:mha-advance-directive");
}

/** For the mock's read routes (mock/routes.ts). */
export const caseState = { doneItems, started };
export const prepData = { PREP, TOPICS, SUBJECTS, LONG, answered };
