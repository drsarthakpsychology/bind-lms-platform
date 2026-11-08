/**
 * Picking questions: the diagnostic, mock papers and adaptive topic practice.
 * Pure: randomness only comes from the `rng` argument (see makeRng).
 */
import { guessFloor, prob } from "@/lib/learn/model/elo";
import { CORE_BAND, pickSession, shuffle, type Candidate, type Picked } from "@/lib/learn/model/picker";
import { orderByHistory, spreadOut, tierOf, type History } from "@/lib/history/order";
import type { PrepSpec } from "@/content/prep/specs";
import { PRIOR_B, planWeights } from "./catalog";
import type { Difficulty, PrepExam, PrepQuestion, Subject } from "./types";

export type Rng = () => number;
/** How often this student has already seen each question id (any mode). */
export type Seen = ReadonlyMap<string, number>;

/** Starting check length for one exam's track. */
export const DIAGNOSTIC_SIZE = 25;
/** Starting check length for the shared course: every subject at least once, about 30 minutes. */
export const UNIFIED_DIAGNOSTIC_SIZE = 30;
export const diagnosticSize = (goal: PrepExam | null) => (goal ? DIAGNOSTIC_SIZE : UNIFIED_DIAGNOSTIC_SIZE);

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
 * The starting check: seats spread over the subjects by weight (at least one
 * each), mixed difficulty, fresh questions first, subjects interleaved. With
 * no goal (exam tracks off) it samples every subject of the shared course.
 * It gets harder as it goes: every subject's easier question comes before
 * its harder one. Short banks give a shorter check.
 */
export function sampleDiagnostic(bank: PrepQuestion[], goal: PrepExam | null, rng: Rng, seen: Seen = new Map(), size = diagnosticSize(goal)): PrepQuestion[] {
  const weights = planWeights(goal);
  const pools = new Map<Subject, PrepQuestion[]>();
  for (const q of bank) {
    if (!weights.has(q.subject)) continue;
    pools.set(q.subject, [...(pools.get(q.subject) ?? []), q]);
  }
  // Prefer questions tagged for this goal; others in the same subject still count.
  for (const [s, list] of pools) pools.set(s, goal ? [...freshFirst(list.filter((q) => q.exams.includes(goal)), seen, rng), ...freshFirst(list.filter((q) => !q.exams.includes(goal)), seen, rng)] : freshFirst(list, seen, rng));
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
    perSubject.push(out.sort((a, b) => a.difficulty - b.difficulty));
  }
  return roundRobin(shuffle(perSubject, rng));
}

function roundRobin<T>(groups: T[][]): T[] {
  const out: T[] = [];
  const g = groups.map((x) => [...x]);
  while (g.some((x) => x.length)) for (const x of g) if (x.length) out.push(x.shift()!);
  return out;
}

/**
 * Reorder so difficulty follows the easy-to-very-hard mix (difficultyMix),
 * keeping the list's own order within each level. A mock section that takes
 * the first n of a subject then gets a spread of levels, not n of one kind.
 */
export function mixByDifficulty(list: PrepQuestion[]): PrepQuestion[] {
  const levels = new Map<Difficulty, PrepQuestion[]>();
  for (const q of list) levels.set(q.difficulty, [...(levels.get(q.difficulty) ?? []), q]);
  const out: PrepQuestion[] = [];
  for (const want of difficultyMix(list.length)) {
    let best: Difficulty | null = null;
    for (const [d, l] of levels) if (l.length && (best === null || Math.abs(d - want) < Math.abs(best - want) || (Math.abs(d - want) === Math.abs(best - want) && d < best))) best = d;
    if (best === null) break;
    out.push(levels.get(best)!.shift()!);
  }
  return out;
}

/* ------------------------------------------------------------ mocks */

export type PaperSection = { title: string; ids: string[]; wanted: number };
export type Paper = { specId: string; sections: PaperSection[] };

/**
 * A mock paper for a pattern. Per section: questions from the section's
 * subjects (and types, if set), spread evenly over subjects, tagged-for-this-
 * exam first, then least-seen first so a student rarely repeats a question,
 * at mixed difficulty (easy to very hard). No question appears twice in one
 * paper.
 */
export function sampleMock(bank: PrepQuestion[], spec: PrepSpec, rng: Rng, seen: Seen = new Map(), opts: { history?: History; now?: number } = {}): Paper {
  const used = new Set<string>();
  const { history } = opts;
  const now = opts.now ?? 0;
  const sections = spec.sections.map((sec): PaperSection => {
    const fits = (q: PrepQuestion) => sec.subjects.includes(q.subject) && (!sec.types || sec.types.includes(q.type));
    const groups = shuffle(sec.subjects, rng).map((s) => {
      const pool = bank.filter((q) => q.subject === s && fits(q));
      // An exam pattern prefers questions tagged for its exam; a shared practice mock (exam null) takes any.
      const exam = spec.exam;
      if (history) {
        // Answer history order (src/lib/history): never seen, then wrong, then
        // seen without an answer, then right (oldest first). Each group keeps
        // the difficulty mix and the exam tag preference.
        const ordered = orderByHistory(pool, (q) => q.id, history, now, rng);
        const group = (q: PrepQuestion) => [0, 1, 1, 2, 3][tierOf(history.get(q.id), now)];
        // Right answers recycle oldest first, so they skip the difficulty mix.
        const keep = (list: PrepQuestion[], mix: (l: PrepQuestion[]) => PrepQuestion[]) => (exam ? [...mix(list.filter((q) => q.exams.includes(exam))), ...mix(list.filter((q) => !q.exams.includes(exam)))] : mix(list));
        return [0, 1, 2, 3].flatMap((g) => keep(ordered.filter((q) => group(q) === g), g === 3 ? (l) => l : mixByDifficulty));
      }
      const order = (list: PrepQuestion[]) => freshFirst(list, seen, rng);
      // Seen questions only after every fresh one, whatever the exam tag.
      const fresh = pool.filter((q) => !seen.get(q.id));
      const old = pool.filter((q) => seen.get(q.id));
      const tagged = (list: PrepQuestion[]) => (exam ? [...mixByDifficulty(order(list.filter((q) => q.exams.includes(exam)))), ...mixByDifficulty(order(list.filter((q) => !q.exams.includes(exam))))] : mixByDifficulty(order(list)));
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
    return { title: sec.title, ids: history ? spreadOut(shuffle(ids, rng), (x) => x, history, now) : shuffle(ids, rng), wanted: sec.count };
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
 * The next difficulty step for an ability: the easiest level (1 easy to 4
 * very hard) a student is not yet comfortable with, that is, where the
 * predicted chance of a right answer drops below the core band. A new
 * student (theta 0) steps up to medium; a strong one (theta about 2.5) to
 * very hard.
 */
export function stepUp(theta: number): Difficulty {
  for (const d of [1, 2, 3, 4] as const) if (prob(theta, PRIOR_B[d]) < CORE_BAND[0]) return d;
  return 4;
}

/**
 * Adaptive topic practice: every question in the subject gets a predicted
 * chance of a right answer from the Elo model, then the shared Goldilocks
 * picker mixes core (70 to 85 %), review, stretch and easy-win questions so
 * the round lands near 70 % success. A new subject therefore starts near easy
 * and medium. To keep the climb going, every round also holds at least one
 * question at the student's next step up (stepUp), so hard and then very
 * hard questions appear as ability grows. Questions seen most are held back
 * unless due.
 */
export function pickPractice(bank: PrepQuestion[], subject: Subject, state: PracticeState, rng: Rng, seen: Seen = new Map(), size = 10, goal?: PrepExam): Picked[] {
  const all = bank.filter((q) => q.subject === subject);
  const tagged = goal ? all.filter((q) => q.exams.includes(goal)) : all;
  const pool = tagged.length >= size ? tagged : all;
  const cap = Math.max(1, ...pool.map((q) => seen.get(q.id) ?? 0));
  // Leave out the most-repeated questions when there are enough others.
  const fresh = pool.filter((q) => state.due(q.id) || (seen.get(q.id) ?? 0) < cap);
  const use = fresh.length >= size ? fresh : pool;
  const level = new Map(use.map((q) => [q.id, q.difficulty]));
  const candidates: Candidate[] = use.map((q) => ({ id: q.id, topic: q.topic, family: subject, p: prob(state.theta, state.b(q.id) ?? PRIOR_B[q.difficulty], guessFloor(q.options.length)), due: state.due(q.id) }));
  const picked = pickSession(candidates, size, rng);

  const up = stepUp(state.theta);
  if (picked.some((p) => (level.get(p.id) ?? 0) >= up)) return picked;
  const inRound = new Set(picked.map((p) => p.id));
  // The most reachable question at the next level (or above).
  const climb = candidates.filter((c) => !inRound.has(c.id) && (level.get(c.id) ?? 0) >= up).sort((a, b) => b.p - a.p)[0];
  if (!climb) return picked;
  // It replaces the easiest non-review question (never the opening easy win if anything else can go).
  let swap = -1;
  for (let i = 0; i < picked.length; i++) {
    if (picked[i].bucket === "review" || (i === 0 && picked[i].bucket === "confidence" && picked.length > 1)) continue;
    if (swap < 0 || picked[i].p > picked[swap].p) swap = i;
  }
  if (swap < 0) {
    if (picked.length >= size) return picked;
    return [...picked, { ...climb, bucket: "stretch" }];
  }
  const out = [...picked];
  out[swap] = { ...climb, bucket: "stretch" };
  return out;
}

/** Questions due for spaced review that were missed at least once, most overdue first. */
export function reviewQueue(cards: { id: string; dueAt: string; lapses: number }[], bankIds: ReadonlySet<string>, now: Date, max = 15): string[] {
  return cards
    .filter((c) => c.lapses > 0 && bankIds.has(c.id) && Date.parse(c.dueAt) <= now.getTime())
    .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt))
    .slice(0, max)
    .map((c) => c.id);
}
