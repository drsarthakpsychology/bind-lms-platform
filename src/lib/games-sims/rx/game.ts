/**
 * Rx Detective rules (pure). A run mixes three kinds of question:
 * - chain: drug, then class, mechanism, key adverse effect, monitoring;
 * - mystery: a side effect, explained by the receptor behind it;
 * - puzzle: two medicines together, and what happens;
 * - review: a prescription for a described patient, and its one problem.
 * Three lives: a question scored under half costs one.
 */
import type { Attempt } from "@/lib/learn/model/student";
import { shuffle, type Rng } from "../common";
import { orderByHistory, type History } from "@/lib/history/order";
import { DRUGS, EFFECTS, FAMILY, MYSTERIES, OUTCOMES, OVERLAP, PUZZLES, REVIEWS, drugById, effectById, outcomeById, reviewById, type Drug } from "./content";
import { PROFILE, conceptsOf } from "./drugs";
import { costsLife, LIVES, nextStreak, pointsFor, RUN_SIZE, rxItem, STEPS, type Graded, type Kind, type Mode, type StepKey } from "./rules";

export { costsLife, LIVES, nextStreak, pointsFor, RUN_SIZE, rxItem, rxXp, STEPS, type Graded, type Kind, type Mode, type StepKey } from "./rules";

export type Question = { kind: "chain"; id: string; steps: string[][] } | { kind: "mystery"; id: string; options: string[] } | { kind: "puzzle"; id: string; options: string[] } | { kind: "review"; id: string; options: string[] };
export type Answer = { kind: Kind; id: string; picks: string[] };

/**
 * Can `x` supply a wrong option for drug `d` at this step? Never from the same
 * family; for the later steps never from the same topic or a hand-checked
 * overlap group; and never when the option shares an idea (weight, QT, D2,
 * the serotonin pump, ...) with anything the reference says about `d`, so a
 * "wrong" option is never also true. An option with no recognisable idea is
 * not offered, because it cannot be checked.
 */
export function canDistract(d: Drug, x: Drug, key: StepKey): boolean {
  if (x.id === d.id || FAMILY[x.id] === FAMILY[d.id]) return false;
  if (key !== "cls" && (x.topic === d.topic || OVERLAP.some((g) => g.includes(d.id) && g.includes(x.id)))) return false;
  const idea = conceptsOf(x[key]);
  if (!idea.size) return false;
  const own = key === "cls" || key === "mech" ? PROFILE[d.id]?.pharm : PROFILE[d.id]?.clinical;
  if (!own) return false;
  for (const c of idea) if (own.has(c)) return false;
  return true;
}

/**
 * The right answer and three wrong ones. The wrong ones also differ from each
 * other in idea, so two options never read as the same thing twice.
 */
export function chainOptions(d: Drug, key: StepKey, rng: Rng): string[] {
  const pool = shuffle([...new Set(DRUGS.filter((x) => canDistract(d, x, key)).map((x) => x[key]))].filter((v) => v !== d[key]), rng);
  const picked: string[] = [];
  const seen = new Set<string>();
  for (const v of pool) {
    if (picked.length === 3) break;
    const idea = conceptsOf(v);
    if ([...idea].some((c) => seen.has(c))) continue;
    picked.push(v);
    idea.forEach((c) => seen.add(c));
  }
  for (const v of pool) if (picked.length < 3 && !picked.includes(v)) picked.push(v);
  return shuffle([d[key], ...picked], rng);
}

export function buildQuestion(kind: Kind, id: string, rng: Rng): Question | null {
  if (kind === "chain") {
    const d = drugById(id);
    return d ? { kind, id, steps: STEPS.map((s) => chainOptions(d, s.key, rng)) } : null;
  }
  if (kind === "mystery") {
    const m = MYSTERIES.find((x) => x.id === id);
    return m ? { kind, id, options: shuffle(m.options, rng) } : null;
  }
  if (kind === "review") {
    const r = reviewById(id);
    return r ? { kind, id, options: shuffle([r.answer, ...r.wrong], rng) } : null;
  }
  const p = PUZZLES.find((x) => x.id === id);
  if (!p) return null;
  // Fixed wrong outcomes are checked to be false for this pair; never draw at random.
  if (p.options?.length) return { kind, id, options: shuffle([p.answer, ...p.options], rng) };
  const others = shuffle(
    OUTCOMES.map((o) => o.id).filter((o) => o !== p.answer),
    rng,
  ).slice(0, 3);
  return { kind, id, options: shuffle([p.answer, ...others], rng) };
}


/**
 * A run. With an answer history (src/lib/history), each kind's questions go
 * never seen first, then missed ones, right ones last (oldest first).
 */
export function buildRun(mode: Mode, rng: Rng, size = RUN_SIZE, history?: History, now = 0): Question[] {
  const rank = (kind: Kind, ids: string[]) => (history ? orderByHistory(ids, (id) => rxItem(kind, id), history, now, rng) : shuffle(ids, rng));
  const pools: Record<Kind, string[]> = {
    chain: rank(
      "chain",
      DRUGS.map((d) => d.id),
    ),
    mystery: rank(
      "mystery",
      MYSTERIES.map((m) => m.id),
    ),
    puzzle: rank(
      "puzzle",
      PUZZLES.map((p) => p.id),
    ),
    review: rank(
      "review",
      REVIEWS.map((r) => r.id),
    ),
  };
  const order: Kind[] = mode === "mixed" ? ["chain", "mystery", "puzzle", "review"] : [mode];
  const out: Question[] = [];
  const used: Record<Kind, number> = { chain: 0, mystery: 0, puzzle: 0, review: 0 };
  for (let i = 0; out.length < size && i < size * 3; i++) {
    const k = order[i % order.length];
    const id = pools[k][used[k]++];
    if (!id) continue;
    const q = buildQuestion(k, id, rng);
    if (q) out.push(q);
  }
  return out;
}

export function grade(a: Answer): Graded | null {
  if (a.kind === "chain") {
    const d = drugById(a.id);
    if (!d) return null;
    const parts = STEPS.map((s, i) => ({ ok: a.picks[i] === d[s.key], chosen: a.picks[i] ?? null, correct: d[s.key] }));
    return { score: parts.filter((p) => p.ok).length / STEPS.length, parts };
  }
  if (a.kind === "mystery") {
    const m = MYSTERIES.find((x) => x.id === a.id);
    if (!m) return null;
    const ok = a.picks[0] === m.answer;
    return { score: ok ? 1 : 0, parts: [{ ok, chosen: effectById(a.picks[0] ?? "")?.label ?? null, correct: effectById(m.answer)!.label }] };
  }
  if (a.kind === "review") {
    const r = reviewById(a.id);
    if (!r) return null;
    const ok = a.picks[0] === r.answer;
    return { score: ok ? 1 : 0, parts: [{ ok, chosen: a.picks[0] ?? null, correct: r.answer }] };
  }
  const p = PUZZLES.find((x) => x.id === a.id);
  if (!p) return null;
  const ok = a.picks[0] === p.answer;
  return { score: ok ? 1 : 0, parts: [{ ok, chosen: outcomeById(a.picks[0] ?? "")?.label ?? null, correct: outcomeById(p.answer)!.label }] };
}

export function topicOf(a: Pick<Answer, "kind" | "id">): string | null {
  if (a.kind === "chain") return drugById(a.id)?.topic ?? null;
  if (a.kind === "mystery") return MYSTERIES.find((x) => x.id === a.id)?.topic ?? null;
  if (a.kind === "review") return reviewById(a.id)?.topic ?? null;
  return PUZZLES.find((x) => x.id === a.id)?.topic ?? null;
}

/** Graded answers for the student model: one per chain step, one per mystery or puzzle. */
export function attemptsFor(a: Answer): Attempt[] {
  const g = grade(a);
  const topic = topicOf(a);
  if (!g || !topic) return [];
  const skill = `${topic}:pharm`;
  if (a.kind === "chain") return g.parts.map((p, i) => ({ skill, item: `rx:chain:${a.id}:${STEPS[i].key}`, outcome: p.ok ? 1 : 0, chosen: p.chosen, correct: p.correct }));
  return [{ skill, item: `rx:${a.kind === "mystery" ? "mys" : a.kind === "review" ? "rev" : "int"}:${a.id}`, outcome: g.score, chosen: g.parts[0].chosen, correct: g.parts[0].correct }];
}



/** Score a whole run (server and browser agree). */
export function runSummary(answers: Answer[]) {
  let streak = 0;
  let best = 0;
  let lives = LIVES;
  let points = 0;
  let got = 0;
  let total = 0;
  const scores: number[] = [];
  for (const a of answers) {
    if (lives <= 0) break;
    const g = grade(a);
    if (!g) continue;
    points += pointsFor(g.score, streak);
    streak = nextStreak(streak, g.score);
    best = Math.max(best, streak);
    if (costsLife(g.score)) lives -= 1;
    got += g.parts.filter((p) => p.ok).length;
    total += g.parts.length;
    scores.push(g.score);
  }
  return { points, best, lives, got, total, scores };
}

export { EFFECTS };
