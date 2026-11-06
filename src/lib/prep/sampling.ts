/**
 * Picking questions: the diagnostic, mock papers and adaptive topic practice.
 * Pure: randomness only comes from the `rng` argument (see makeRng).
 */
import { prob } from "@/lib/learn/model/elo";
import { pickSession, shuffle, type Candidate, type Picked } from "@/lib/learn/model/picker";
import type { PrepSpec } from "@/content/prep/specs";
import { PRIOR_B, subjectWeights } from "./catalog";
import type { Difficulty, PrepExam, PrepQuestion, Subject } from "./types";

export type Rng = () => number;
/** How often this student has already seen each question id (any mode). */
export type Seen = ReadonlyMap<string, number>;

export const DIAGNOSTIC_SIZE = 25;

/**
 * Split `total` seats over weights (largest remainder). With `minOne`, every
 * weighted key gets at least one seat when there are enough seats.
 */
export function allocate<K>(weights: Map<K, number>, total: number, minOne = true): Map<K, number> {
  const keys = [...weights.keys()].filter((k) => (weights.get(k) ?? 0) > 0);
  const out = new Map<K, number>();
  if (!keys.length || total <= 0) return out;
  const floor = minOne && total >= keys.length ? 1 : 0;
  const left = total - floor * keys.length;
  const sum = keys.reduce((a, k) => a + weights.get(k)!, 0);
  const raw = keys.map((k) => ({ k, x: (weights.get(k)! / sum) * left }));
  for (const r of raw) out.set(r.k, floor + Math.floor(r.x));
  let given = [...out.values()].reduce((a, b) => a + b, 0);
  const byRemainder = [...raw].sort((a, b) => b.x - Math.floor(b.x) - (a.x - Math.floor(a.x)));
  for (let i = 0; given < total && byRemainder.length; i = (i + 1) % byRemainder.length) {
    out.set(byRemainder[i].k, out.get(byRemainder[i].k)! + 1);
    given++;
  }
  return out;
}

/** Fewest-seen first, random within the same count. */
function freshFirst(list: PrepQuestion[], seen: Seen, rng: Rng): PrepQuestion[] {
  return shuffle(list, rng).sort((a, b) => (seen.get(a.id) ?? 0) - (seen.get(b.id) ?? 0));
}

/** Target difficulties for n questions: a mix of easy, medium, hard and very hard. */
export function difficultyMix(n: number): Difficulty[] {
  const cycle: Difficulty[] = [2, 3, 1, 2, 3, 4];
  return Array.from({ length: n }, (_, i) => cycle[i % cycle.length]);
}

/**
 * The 25-question diagnostic: seats spread over the goal's subjects by weight
 * (at least one each), mixed difficulty, fresh questions first, subjects
 * interleaved. Short banks give a shorter diagnostic.
 */
export function sampleDiagnostic(bank: PrepQuestion[], goal: PrepExam, rng: Rng, seen: Seen = new Map(), size = DIAGNOSTIC_SIZE): PrepQuestion[] {
  const weights = subjectWeights(goal);
  const pools = new Map<Subject, PrepQuestion[]>();
  for (const q of bank) {
    if (!weights.has(q.subject)) continue;
    pools.set(q.subject, [...(pools.get(q.subject) ?? []), q]);
  }
  // Prefer questions tagged for this goal; others in the same subject still count.
  for (const [s, list] of pools) pools.set(s, [...freshFirst(list.filter((q) => q.exams.includes(goal)), seen, rng), ...freshFirst(list.filter((q) => !q.exams.includes(goal)), seen, rng)]);
  const live = new Map([...weights].filter(([s]) => (pools.get(s)?.length ?? 0) > 0));
  const seats = allocate(live, Math.min(size, [...pools.values()].reduce((a, l) => a + l.length, 0)));

  // Subjects with too few questions hand their seats on.
  let spare = 0;
  for (const [s, n] of seats) {
    const have = pools.get(s)!.length;
    if (n > have) {
      spare += n - have;
      seats.set(s, have);
    }
  }
  for (const s of [...live.keys()].sort((a, b) => live.get(b)! - live.get(a)!)) {
    while (spare > 0 && seats.get(s)! < pools.get(s)!.length) {
      seats.set(s, seats.get(s)! + 1);
      spare--;
    }
  }

  const perSubject: PrepQuestion[][] = [];
  for (const [s, n] of seats) {
    const pool = [...pools.get(s)!];
    const out: PrepQuestion[] = [];
    for (const want of difficultyMix(n)) {
      if (!pool.length) break;
      let best = 0;
      for (let i = 1; i < pool.length; i++) if (Math.abs(pool[i].difficulty - want) < Math.abs(pool[best].difficulty - want)) best = i;
      out.push(pool.splice(best, 1)[0]);
    }
    perSubject.push(out);
  }
  return roundRobin(shuffle(perSubject, rng));
}

function roundRobin<T>(groups: T[][]): T[] {
  const out: T[] = [];
  const g = groups.map((x) => [...x]);
  while (g.some((x) => x.length)) for (const x of g) if (x.length) out.push(x.shift()!);
  return out;
}

/* ------------------------------------------------------------ mocks */

export type PaperSection = { title: string; ids: string[]; wanted: number };
export type Paper = { specId: string; sections: PaperSection[] };

/**
 * A mock paper for a pattern. Per section: questions from the section's
 * subjects (and types, if set), spread evenly over subjects, tagged-for-this-
 * exam first, then least-seen first so a student rarely repeats a question.
 * No question appears twice in one paper.
 */
export function sampleMock(bank: PrepQuestion[], spec: PrepSpec, rng: Rng, seen: Seen = new Map()): Paper {
  const used = new Set<string>();
  const sections = spec.sections.map((sec): PaperSection => {
    const fits = (q: PrepQuestion) => sec.subjects.includes(q.subject) && (!sec.types || sec.types.includes(q.type));
    const groups = shuffle(sec.subjects, rng).map((s) => {
      const pool = bank.filter((q) => q.subject === s && fits(q));
      const order = (list: PrepQuestion[]) => freshFirst(list, seen, rng);
      // Seen questions only after every fresh one, whatever the exam tag.
      const fresh = pool.filter((q) => !seen.get(q.id));
      const old = pool.filter((q) => seen.get(q.id));
      const tagged = (list: PrepQuestion[]) => [...order(list.filter((q) => q.exams.includes(spec.exam))), ...order(list.filter((q) => !q.exams.includes(spec.exam)))];
      return [...tagged(fresh), ...tagged(old)];
    });
    const ids: string[] = [];
    while (ids.length < sec.count && groups.some((g) => g.length)) {
      for (const g of groups) {
        if (ids.length >= sec.count) break;
        while (g.length && used.has(g[0].id)) g.shift();
        const q = g.shift();
        if (q) {
          used.add(q.id);
          ids.push(q.id);
        }
      }
    }
    return { title: sec.title, ids: shuffle(ids, rng), wanted: sec.count };
  });
  return { specId: spec.id, sections };
}

/* --------------------------------------------------------- practice */

export type PracticeState = {
  /** Current ability in this subject (logits). */
  theta: number;
  /** Calibrated difficulty for a question, when the model has one. */
  b: (id: string) => number | undefined;
  /** Due for spaced review? */
  due: (id: string) => boolean;
};

/**
 * Adaptive topic practice: every question in the subject gets a predicted
 * chance of a right answer from the Elo model, then the shared Goldilocks
 * picker mixes core (70–85 %), review, stretch and easy-win questions so the
 * round lands near 70 % success. Questions seen most are held back unless due.
 */
export function pickPractice(bank: PrepQuestion[], subject: Subject, state: PracticeState, rng: Rng, seen: Seen = new Map(), size = 10, goal?: PrepExam): Picked[] {
  const all = bank.filter((q) => q.subject === subject);
  const tagged = goal ? all.filter((q) => q.exams.includes(goal)) : all;
  const pool = tagged.length >= size ? tagged : all;
  const cap = Math.max(1, ...pool.map((q) => seen.get(q.id) ?? 0));
  // Leave out the most-repeated questions when there are enough others.
  const fresh = pool.filter((q) => state.due(q.id) || (seen.get(q.id) ?? 0) < cap);
  const use = fresh.length >= size ? fresh : pool;
  const candidates: Candidate[] = use.map((q) => ({ id: q.id, topic: q.topic, family: subject, p: prob(state.theta, state.b(q.id) ?? PRIOR_B[q.difficulty]), due: state.due(q.id) }));
  return pickSession(candidates, size, rng);
}

/** Questions due for spaced review that were missed at least once, most overdue first. */
export function reviewQueue(cards: { id: string; dueAt: string; lapses: number }[], bankIds: ReadonlySet<string>, now: Date, max = 15): string[] {
  return cards
    .filter((c) => c.lapses > 0 && bankIds.has(c.id) && Date.parse(c.dueAt) <= now.getTime())
    .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt))
    .slice(0, max)
    .map((c) => c.id);
}
