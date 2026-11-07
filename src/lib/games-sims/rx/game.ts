/**
 * Rx Detective rules (pure). A run mixes three kinds of question:
 * - chain: drug, then class, mechanism, key adverse effect, monitoring;
 * - mystery: a side effect, explained by the receptor behind it;
 * - puzzle: two medicines together, and what happens.
 * Three lives: a question scored under half costs one.
 */
import type { Attempt } from "@/lib/learn/model/student";
import { shuffle, type Rng } from "../common";
import { DRUGS, EFFECTS, FAMILY, MYSTERIES, OUTCOMES, OVERLAP, PUZZLES, drugById, effectById, outcomeById, type Drug } from "./content";
import { PROFILE, conceptsOf } from "./drugs";

export type Kind = "chain" | "mystery" | "puzzle";
export type StepKey = "cls" | "mech" | "ae" | "mon";
export const STEPS: { key: StepKey; label: string; ask: string }[] = [
  { key: "cls", label: "Class", ask: "What kind of medicine is it?" },
  { key: "mech", label: "How it works", ask: "How does it work?" },
  { key: "ae", label: "Watch for", ask: "Which side effect is the one to remember?" },
  { key: "mon", label: "Check", ask: "What do you monitor?" },
];

export type Question = { kind: "chain"; id: string; steps: string[][] } | { kind: "mystery"; id: string; options: string[] } | { kind: "puzzle"; id: string; options: string[] };
export type Mode = "mixed" | Kind;
export type Answer = { kind: Kind; id: string; picks: string[] };
export type Graded = { score: number; parts: { ok: boolean; chosen: string | null; correct: string }[] };

export const LIVES = 3;
export const RUN_SIZE = 12;

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
  const p = PUZZLES.find((x) => x.id === id);
  if (!p) return null;
  const others = shuffle(
    OUTCOMES.map((o) => o.id).filter((o) => o !== p.answer),
    rng,
  ).slice(0, 3);
  return { kind, id, options: shuffle([p.answer, ...others], rng) };
}

/** A run: interleaved kinds (mixing them teaches the differences better than blocks). */
export function buildRun(mode: Mode, rng: Rng, size = RUN_SIZE): Question[] {
  const pools: Record<Kind, string[]> = {
    chain: shuffle(
      DRUGS.map((d) => d.id),
      rng,
    ),
    mystery: shuffle(
      MYSTERIES.map((m) => m.id),
      rng,
    ),
    puzzle: shuffle(
      PUZZLES.map((p) => p.id),
      rng,
    ),
  };
  const order: Kind[] = mode === "mixed" ? ["chain", "mystery", "puzzle"] : [mode];
  const out: Question[] = [];
  const used: Record<Kind, number> = { chain: 0, mystery: 0, puzzle: 0 };
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
  const p = PUZZLES.find((x) => x.id === a.id);
  if (!p) return null;
  const ok = a.picks[0] === p.answer;
  return { score: ok ? 1 : 0, parts: [{ ok, chosen: outcomeById(a.picks[0] ?? "")?.label ?? null, correct: outcomeById(p.answer)!.label }] };
}

export function topicOf(a: Pick<Answer, "kind" | "id">): string | null {
  if (a.kind === "chain") return drugById(a.id)?.topic ?? null;
  if (a.kind === "mystery") return MYSTERIES.find((x) => x.id === a.id)?.topic ?? null;
  return PUZZLES.find((x) => x.id === a.id)?.topic ?? null;
}

/** Graded answers for the student model: one per chain step, one per mystery or puzzle. */
export function attemptsFor(a: Answer): Attempt[] {
  const g = grade(a);
  const topic = topicOf(a);
  if (!g || !topic) return [];
  const skill = `${topic}:pharm`;
  if (a.kind === "chain") return g.parts.map((p, i) => ({ skill, item: `rx:chain:${a.id}:${STEPS[i].key}`, outcome: p.ok ? 1 : 0, chosen: p.chosen, correct: p.correct }));
  return [{ skill, item: `rx:${a.kind === "mystery" ? "mys" : "int"}:${a.id}`, outcome: g.score, chosen: g.parts[0].chosen, correct: g.parts[0].correct }];
}

export const costsLife = (score: number) => score < 0.5;

/** Points: 100 per fully right answer, part credit for chains, +10% per streak step (max +50%). */
export function pointsFor(score: number, streak: number): number {
  return Math.round(score * 100 * (1 + Math.min(5, streak) * 0.1));
}
export const nextStreak = (streak: number, score: number) => (score >= 0.999 ? streak + 1 : 0);

/** XP: 5 for playing plus 2 per question's worth of right answers, at most 40. */
export function rxXp(scores: number[]): number {
  return Math.min(40, 5 + Math.round(scores.reduce((a, s) => a + s, 0) * 2));
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
