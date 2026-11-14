/**
 * Rx Detective, dealt on the server. The browser gets each case's story and
 * options; every pick is checked here, a chain step's right answer comes
 * back only once that step is picked, and a case's answer card only once
 * the case is answered. Pure (the secret mask is passed in), so every rule
 * is unit-tested; the server actions live in
 * src/app/(dashboard)/games/rx/actions.ts.
 *
 * A run is a signed token holding, per case, its number in the case list
 * shifted by a secret mask (the token is readable, so it never holds a case
 * id), the case in play, its picks so far and the scores of the cases done.
 */
import { MEDS } from "@/lib/meds";
import type { History } from "@/lib/history/order";
import type { Rng } from "../common";
import { DRUGS, MYSTERIES, PUZZLES, REVIEWS, drugById, effectById, outcomeById, reviewById } from "./content";
import { buildRun, grade, type Answer, type Question } from "./game";
import { rxItemPages } from "./med-pages";
import { costsLife, LIVES, nextStreak, pointsFor, STEPS, type Answered, type Kind, type LearnItem, type Mode, type PublicCase, type Reveal } from "./rules";

export type RxToken = { u: string; run: string; k: number[]; i: number; p: string[]; s: number[] };
/** The secret mask for a case of a run (a large unsigned number). */
export type Mask = (run: string, round: number) => number;
export type CaseRef = { kind: Kind; id: string };

const ALL: CaseRef[] = [
  ...DRUGS.map((d) => ({ kind: "chain" as const, id: d.id })),
  ...MYSTERIES.map((m) => ({ kind: "mystery" as const, id: m.id })),
  ...PUZZLES.map((p) => ({ kind: "puzzle" as const, id: p.id })),
  ...REVIEWS.map((r) => ({ kind: "review" as const, id: r.id })),
];
const N = ALL.length;
const INDEX = new Map(ALL.map((c, i) => [`${c.kind}:${c.id}`, i]));
const mod = (a: number, n: number) => ((a % n) + n) % n;
const MED_IDS = new Set(MEDS.map((m) => m.id));

const drugByName = (name: string) => {
  const n = name.toLowerCase();
  return drugById(n) ?? drugById(n.replace("sodium ", ""));
};

/** The case as the browser may see it before answering. */
export function publicCase(q: Question): PublicCase | null {
  if (q.kind === "chain") {
    const d = drugById(q.id);
    return d ? { kind: "chain", title: `Chain: ${d.name}`, name: d.name, brands: [...d.brands], steps: q.steps.map((s) => [...s]) } : null;
  }
  if (q.kind === "mystery") {
    const mys = MYSTERIES.find((x) => x.id === q.id);
    const d = mys ? drugById(mys.drug) : undefined;
    if (!mys || !d) return null;
    return { kind: "mystery", title: `Mystery: ${d.name}`, who: mys.who, story: mys.story, clues: [...mys.clues], drug: d.name, brand: d.brands[0] ?? "", options: q.options.map((id) => ({ id, label: effectById(id)?.label ?? id })) };
  }
  if (q.kind === "review") {
    const rv = reviewById(q.id);
    return rv ? { kind: "review", title: `Prescription: ${rv.who}`, who: rv.who, story: rv.story, rx: [...rv.rx], options: q.options.map((o) => ({ id: o, label: o })) } : null;
  }
  const p = PUZZLES.find((x) => x.id === q.id);
  if (!p) return null;
  return { kind: "puzzle", title: `Mix: ${p.a} + ${p.b}`, a: p.a, b: p.b, aBrands: drugByName(p.a)?.brands ?? null, bBrands: drugByName(p.b)?.brands ?? null, story: p.story, options: q.options.map((id) => ({ id, label: outcomeById(id)?.label ?? id })) };
}

/** Deal a run (answer history order inside each kind, kinds interleaved). */
export function dealRx(userId: string, run: string, mode: Mode, rng: Rng, history: History, now: number, mask: Mask): { payload: RxToken; cases: PublicCase[] } {
  const picked: { i: number; c: PublicCase }[] = [];
  for (const q of buildRun(mode, rng, undefined, history, now)) {
    const i = INDEX.get(`${q.kind}:${q.id}`);
    const c = publicCase(q);
    if (i !== undefined && c) picked.push({ i, c });
  }
  return { payload: { u: userId, run, k: picked.map((x, r) => mod(x.i + mask(run, r), N)), i: 0, p: [], s: [] }, cases: picked.map((x) => x.c) };
}

/** The case behind round `round` of a verified token, for this student only. */
export function caseAt(t: RxToken | null, userId: string, round: number, mask: Mask): CaseRef | null {
  if (!t || t.u !== userId || typeof t.run !== "string" || !Array.isArray(t.k) || !Number.isInteger(round) || round < 0 || round >= t.k.length) return null;
  const k = t.k[round];
  return Number.isInteger(k) ? (ALL[mod(k - mask(t.run, round), N)] ?? null) : null;
}

const livesLeft = (t: RxToken) => LIVES - t.s.filter(costsLife).length;

/** The case in play, or null when the run is over (or the token is not this student's). */
export function current(t: RxToken | null, userId: string, mask: Mask): CaseRef | null {
  if (!t || !Array.isArray(t.p) || !Array.isArray(t.s) || !Number.isInteger(t.i) || livesLeft(t) <= 0) return null;
  return caseAt(t, userId, t.i, mask);
}

/** "Learn this" links for the medicines in a case: its Medicines page, or its Study module. */
export function learnFor(c: CaseRef): LearnItem[] {
  const p = c.kind === "puzzle" ? PUZZLES.find((x) => x.id === c.id) : undefined;
  const keys = c.kind === "chain" ? [c.id] : c.kind === "mystery" ? [MYSTERIES.find((x) => x.id === c.id)?.drug ?? ""] : c.kind === "review" ? (reviewById(c.id)?.drugs ?? []) : [p?.a ?? "", p?.b ?? ""];
  return keys.filter(Boolean).map((k) => {
    const d = drugById(k) ?? DRUGS.find((x) => x.name.toLowerCase() === k.toLowerCase());
    const id = d?.id ?? k.toLowerCase();
    return { id, name: d?.name ?? k, ...(MED_IDS.has(id) ? { href: `/practice/medicines/${id}` } : d ? { href: `/study/${d.topic}` } : {}) };
  });
}

/** The answer card for a case. */
export function revealOf(c: CaseRef): { answer: string; reveal: Reveal } | null {
  if (c.kind === "chain") {
    const d = drugById(c.id);
    return d ? { answer: "", reveal: { kind: "chain", name: d.name, values: STEPS.map((s) => d[s.key]), dose: d.dose, receptor: d.target.receptor, line: d.target.line } } : null;
  }
  if (c.kind === "mystery") {
    const mys = MYSTERIES.find((x) => x.id === c.id);
    const e = mys ? effectById(mys.answer) : undefined;
    const d = mys ? drugById(mys.drug) : undefined;
    if (!mys || !e || !d) return null;
    return { answer: mys.answer, reveal: { kind: "mystery", label: e.label, why: mys.why, not: mys.not ?? null, receptor: e.receptor, drug: d.name } };
  }
  if (c.kind === "review") {
    const rv = reviewById(c.id);
    return rv ? { answer: rv.answer, reveal: { kind: "review", answer: rv.answer, why: rv.why, not: rv.not } } : null;
  }
  const p = PUZZLES.find((x) => x.id === c.id);
  const o = p ? outcomeById(p.answer) : undefined;
  if (!p || !o) return null;
  return { answer: p.answer, reveal: { kind: "puzzle", label: o.label, why: p.why, not: p.not ?? null, journey: p.journey ?? null, receptor: p.receptor ?? null, qt: p.answer === "qt" } };
}

export type PickOutcome =
  | { type: "step"; next: RxToken; right: boolean; correct: string }
  | { type: "case"; next: RxToken; answer: Answer; answered: Answered };

/**
 * One pick on the case in play. A chain takes four (one per step); the
 * others take one. The case's answer card comes back only with its last pick.
 */
export function pickRx(t: RxToken, c: CaseRef, value: string): PickOutcome | null {
  if (typeof value !== "string" || value.length > 200) return null;
  const picks = [...t.p, value];
  if (c.kind === "chain" && picks.length < STEPS.length) {
    const d = drugById(c.id);
    if (!d) return null;
    const correct = d[STEPS[picks.length - 1].key];
    return { type: "step", next: { ...t, p: picks }, right: value === correct, correct };
  }
  const answer: Answer = { kind: c.kind, id: c.id, picks };
  const graded = grade(answer);
  const r = revealOf(c);
  if (!graded || !r) return null;
  return { type: "case", next: { ...t, i: t.i + 1, p: [], s: [...t.s, graded.score] }, answer, answered: { graded, answer: r.answer, reveal: r.reveal, learn: learnFor(c), pages: rxItemPages(c.kind, c.id) } };
}

/** A run's totals from the token (the server's own grades, never the browser's). */
export function runTotals(t: RxToken, userId: string, mask: Mask) {
  let streak = 0;
  let best = 0;
  let lives = LIVES;
  let points = 0;
  let got = 0;
  let total = 0;
  const done: { score: number; ref: CaseRef }[] = [];
  for (const [i, score] of t.s.entries()) {
    const ref = caseAt(t, userId, i, mask);
    if (!ref || lives <= 0 || typeof score !== "number") break;
    const parts = ref.kind === "chain" ? STEPS.length : 1;
    points += pointsFor(score, streak);
    streak = nextStreak(streak, score);
    best = Math.max(best, streak);
    if (costsLife(score)) lives -= 1;
    got += Math.round(score * parts);
    total += parts;
    done.push({ score, ref });
  }
  return { points, best, lives, got, total, done };
}
