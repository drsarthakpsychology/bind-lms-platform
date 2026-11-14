/**
 * Clinic detective, dealt on the server. The browser gets each case's four
 * options and only the clues the student has opened; the answer and the
 * other clues stay here until they are asked for. Pure (the secret mask is
 * passed in), so every rule is unit-tested; the server actions live in
 * src/app/(dashboard)/practice/detective/actions.ts.
 *
 * A deal is a signed token holding the run id and, per round, the case number
 * shifted by a secret mask. The token is readable (base64 JSON), so it never
 * holds a case id, an answer or a plain case number.
 */
import { CASES, type Case } from "./detective";
import { CLUES, ROUNDS, type DealtRound, type Family } from "./detective-rules";

export { CLUES, ROUNDS, type DealtRound, type Family };
/** The token's payload. */
export type DealToken = { u: string; run: string; k: number[] };
/** The secret mask for a round (a large unsigned number). */
export type Mask = (run: string, round: number) => number;

const N = CASES.length;
const mod = (a: number, n: number) => ((a % n) + n) % n;

export function poolFor(family: Family): Case[] {
  return CASES.filter((c) => family === "mixed" || c.family === family);
}

function shuffle<T>(a: readonly T[], rng: () => number): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Deal a run. `ordered` is the family's case answers in answer-history order
 * (never seen first, missed ones next, solved ones last).
 */
export function deal(userId: string, run: string, ordered: readonly string[], mask: Mask, rng: () => number): { payload: DealToken; rounds: DealtRound[] } {
  const picked = ordered
    .map((a) => CASES.findIndex((c) => c.answer === a))
    .filter((i) => i >= 0)
    .slice(0, ROUNDS);
  const rounds = picked.map((i) => {
    const c = CASES[i];
    const others = shuffle(
      CASES.filter((x) => x.family === c.family && x.answer !== c.answer),
      rng,
    )
      .slice(0, 3)
      .map((x) => x.answer);
    return { options: shuffle([c.answer, ...others], rng), clue: c.clues[0] };
  });
  return { payload: { u: userId, run, k: picked.map((i, r) => mod(i + mask(run, r), N)) }, rounds };
}

/** The case behind round `round` of a verified token, for this student only. */
export function caseAt(t: DealToken | null, userId: string, round: number, mask: Mask): Case | null {
  if (!t || t.u !== userId || !Array.isArray(t.k) || !Number.isInteger(round) || round < 0 || round >= t.k.length) return null;
  const k = t.k[round];
  if (!Number.isInteger(k)) return null;
  return CASES[mod(k - mask(t.run, round), N)] ?? null;
}

/** Clue n (1 to 4) of a case. */
export function clueOf(c: Case, n: number): string | null {
  return Number.isInteger(n) && n >= 1 && n <= CLUES ? c.clues[n - 1] : null;
}

/**
 * A guess. The answer comes back only when the guess is right or the round
 * is over (`final`: the last clue was open, or the student gave up).
 */
export function judge(c: Case, guess: string, final: boolean): { right: boolean; answer: string | null } {
  const right = guess === c.answer;
  return { right, answer: right || final ? c.answer : null };
}
