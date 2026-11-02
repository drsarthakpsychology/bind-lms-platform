/**
 * Coach — the adaptive teaching engine.
 *
 * Each concept has a mastery level per student (0 = new … 5 = mastered).
 * - New concepts are TAUGHT first (a teach card), then asked.
 * - The question format gets harder as mastery grows:
 *   L0–1 pick the term from its meaning → L2 pick the meaning →
 *   L3 true/false with a look-alike → L4 type the term from memory.
 * - A wrong answer drops the level, re-teaches the concept (and shows a
 *   side-by-side with whatever the student confused it with), and asks it
 *   again a few questions later, until they get it right.
 * - Confusions are remembered, and the confused concept is then used as a
 *   distractor on purpose, so the student practises the exact distinction
 *   they struggle with.
 * - Sessions mix: concepts to relearn, reviews that are due, NEW concepts
 *   that are similar to recent mistakes, and fresh concepts in the weakest area.
 * Pure functions; randomness comes from the `rng` argument.
 */
import { addDays } from "./engine";
import { ALL_CONCEPTS, conceptById } from "./concepts";
import type { Concept, Domain } from "./concepts/types";

export type ConceptStat = { lvl: number; seen: number; right: number; wrong: number; due: string; teach: boolean; miss: string[] };
export type CoachData = { concepts: Record<string, ConceptStat>; confusions: Record<string, number> };

export const COACH_INTERVALS = [0, 1, 2, 4, 7, 14]; // days, by level reached
export type Format = "pick-term" | "pick-meaning" | "tf" | "type";

export function formatFor(lvl: number, rng: () => number): Format {
  if (lvl <= 1) return "pick-term";
  if (lvl === 2) return "pick-meaning";
  if (lvl === 3) return "tf";
  if (lvl === 4) return "type";
  return (["pick-term", "pick-meaning", "tf", "type"] as const)[Math.floor(rng() * 4)];
}

export function newStat(today: string): ConceptStat {
  return { lvl: 0, seen: 0, right: 0, wrong: 0, due: today, teach: true, miss: [] };
}

/** Update one concept after an answer. `picked` = the concept the student wrongly chose. */
export function updateStat(prev: ConceptStat | undefined, correct: boolean, today: string, picked?: string): ConceptStat {
  const s = prev ?? newStat(today);
  if (correct) {
    const lvl = Math.min(5, s.lvl + 1);
    return { ...s, lvl, seen: s.seen + 1, right: s.right + 1, due: addDays(today, COACH_INTERVALS[lvl]), teach: false };
  }
  const miss = picked ? [picked, ...s.miss.filter((m) => m !== picked)].slice(0, 3) : s.miss;
  return { ...s, lvl: Math.max(0, s.lvl - 1), seen: s.seen + 1, wrong: s.wrong + 1, due: today, teach: true, miss };
}

export const pairKey = (a: string, b: string) => [a, b].sort().join("|");

export function recordAnswer(data: CoachData, id: string, correct: boolean, today: string, picked?: string): CoachData {
  const concepts = { ...data.concepts, [id]: updateStat(data.concepts[id], correct, today, picked) };
  const confusions = { ...data.confusions };
  if (!correct && picked && picked !== id) confusions[pairKey(id, picked)] = (confusions[pairKey(id, picked)] ?? 0) + 1;
  return { concepts, confusions };
}

/* ------------------------------------------------------------- similarity */
export function similarity(a: Concept, b: Concept): number {
  if (a.id === b.id) return -1;
  const shared = a.tags.filter((t) => b.tags.includes(t)).length;
  return shared * 2 + (a.domain === b.domain ? 1 : 0);
}

export function similarConcepts(c: Concept, n = 3, pool: Concept[] = ALL_CONCEPTS): Concept[] {
  return pool
    .map((x) => ({ x, s: similarity(c, x) }))
    .filter((p) => p.s > 1)
    .sort((p, q) => q.s - p.s || p.x.id.localeCompare(q.x.id))
    .slice(0, n)
    .map((p) => p.x);
}

/** Distractors: the student's own past confusions first, then the most similar concepts. */
export function distractors(c: Concept, data: CoachData, n: number, rng: () => number): Concept[] {
  const own = (data.concepts[c.id]?.miss ?? []).map(conceptById).filter((x): x is Concept => Boolean(x) && x!.id !== c.id);
  const near = similarConcepts(c, 8).filter((x) => !own.some((o) => o.id === x.id));
  const sameDomain = ALL_CONCEPTS.filter((x) => x.domain === c.domain && x.id !== c.id && !own.some((o) => o.id === x.id) && !near.some((s) => s.id === x.id));
  const shuffledNear = [...near].sort(() => rng() - 0.5);
  const shuffledDomain = [...sameDomain].sort(() => rng() - 0.5);
  return [...own, ...shuffledNear, ...shuffledDomain].slice(0, n);
}

/* ---------------------------------------------------------------- mastery */
export function domainMastery(data: CoachData, domain: Domain | "all"): { pct: number; seen: number; total: number; mastered: number } {
  const pool = domain === "all" ? ALL_CONCEPTS : ALL_CONCEPTS.filter((c) => c.domain === domain);
  let sum = 0;
  let seen = 0;
  let mastered = 0;
  for (const c of pool) {
    const s = data.concepts[c.id];
    if (!s) continue;
    sum += s.lvl;
    seen++;
    if (s.lvl >= 4) mastered++;
  }
  return { pct: pool.length ? Math.round((sum / (pool.length * 5)) * 100) : 0, seen, total: pool.length, mastered };
}

export function topConfusions(data: CoachData, n = 5): { a: Concept; b: Concept; times: number }[] {
  return Object.entries(data.confusions)
    .sort((x, y) => y[1] - x[1])
    .slice(0, n)
    .map(([k, times]) => {
      const [a, b] = k.split("|").map(conceptById);
      return a && b ? { a, b, times } : null;
    })
    .filter((x): x is { a: Concept; b: Concept; times: number } => Boolean(x));
}

/* ---------------------------------------------------------------- session */
export function buildSession(data: CoachData, domain: Domain | "all", today: string, rng: () => number, size = 10): string[] {
  const pool = domain === "all" ? ALL_CONCEPTS : ALL_CONCEPTS.filter((c) => c.domain === domain);
  const st = (id: string) => data.concepts[id];
  const relearn = pool
    .filter((c) => st(c.id) && st(c.id)!.teach && st(c.id)!.due <= today)
    .sort((a, b) => st(b.id)!.wrong - st(a.id)!.wrong)
    .map((c) => c.id);
  const due = pool
    .filter((c) => st(c.id) && !st(c.id)!.teach && st(c.id)!.due <= today && st(c.id)!.lvl < 5)
    .sort((a, b) => st(a.id)!.lvl - st(b.id)!.lvl)
    .map((c) => c.id);
  const missed = Object.entries(data.concepts)
    .filter(([, s]) => s.wrong > 0)
    .map(([id]) => conceptById(id))
    .filter((x): x is Concept => Boolean(x));
  const similar = Array.from(
    new Set(missed.flatMap((m) => similarConcepts(m, 3, pool).filter((x) => !st(x.id)).map((x) => x.id))),
  );
  const fresh = pool.filter((c) => !st(c.id)).map((c) => c.id);

  const picked: string[] = [];
  const add = (ids: string[], max: number) => {
    for (const id of ids) {
      if (picked.length >= size || max <= 0) break;
      if (!picked.includes(id)) {
        picked.push(id);
        max--;
      }
    }
  };
  add(relearn, 3);
  add(due, 4);
  add(similar, 2);
  // New concepts: a gentle random offset so students don't all see the same order.
  const start = fresh.length ? Math.floor(rng() * Math.min(fresh.length, 6)) : 0;
  add([...fresh.slice(start), ...fresh.slice(0, start)], size);
  add(due, size);
  add(relearn, size);
  // Still short (everything mastered)? Revisit the weakest.
  if (picked.length < size) add([...pool].sort((a, b) => (st(a.id)?.lvl ?? 0) - (st(b.id)?.lvl ?? 0)).map((c) => c.id), size);
  return picked;
}

/** Why this concept is in the session (shown to the student). */
export function reasonFor(id: string, data: CoachData, today: string): string {
  const s = data.concepts[id];
  if (!s) {
    const c = conceptById(id);
    const missedSimilar = c && Object.entries(data.concepts).some(([mid, ms]) => ms.wrong > 0 && similarity(conceptById(mid)!, c) > 1);
    return missedSimilar ? "New, and close to something you missed" : "New concept";
  }
  if (s.teach) return "You missed this, so let's lock it in";
  if (s.due <= today) return "Due for review";
  return "Practice";
}

/* ------------------------------------------------------------ type answers */
function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
function lev(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
/** Accept small typos and the main word of a long term ("loosening" for "Loosening of associations"). */
export function typedMatches(typed: string, term: string): boolean {
  const t = norm(typed);
  const target = norm(term);
  if (!t) return false;
  if (t === target) return true;
  const tolerance = target.length <= 5 ? 0 : target.length <= 9 ? 1 : 2;
  if (lev(t, target) <= tolerance) return true;
  const words = target.split(" ");
  if (words.length < 2) return false;
  const key = [words[0], [...words].sort((a, b) => b.length - a.length)[0]];
  return key.some((w) => w.length >= 6 && lev(t, w) <= 1);
}
