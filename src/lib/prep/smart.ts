/**
 * Smart practice: one mixed set of 10 from the student's weak topics and the
 * questions due for spaced review. It replaces Coach, the Quiz path and
 * Today's practice. The mix is the shared Goldilocks picker
 * (src/lib/learn/model/picker): due reviews first, then mostly questions the
 * student can just about get, one stretch and one easy win, with look-alike
 * topics interleaved. Pure: randomness only comes from `rng`.
 */
import { prob } from "@/lib/learn/model/elo";
import { pickSession, type Candidate, type Picked } from "@/lib/learn/model/picker";
import { PRIOR_B } from "./catalog";
import { groupOf } from "./topics";
import type { PrepQuestion, Subject } from "./types";

export type SmartState = {
  /** Ability per subject (logits); 0 when unknown. */
  theta: (s: Subject) => number;
  /** Calibrated difficulty, when known. */
  b: (id: string) => number | undefined;
  /** Question ids due for spaced review. */
  due: ReadonlySet<string>;
  /** Subjects to draw new questions from, weakest first. */
  weakSubjects: readonly Subject[];
  /** "subject:topic" groups the student keeps missing (drawn from whatever the subject). */
  weakTopics: ReadonlySet<string>;
  /** Questions last answered right (held back while enough others remain). */
  gotRight: ReadonlySet<string>;
};

export const SMART_SIZE = 10;

export function pickSmart(bank: readonly PrepQuestion[], st: SmartState, rng: () => number, size = SMART_SIZE): Picked[] {
  const weak = new Set(st.weakSubjects);
  const pool = bank.filter((q) => st.due.has(q.id) || weak.has(q.subject) || st.weakTopics.has(`${q.subject}:${groupOf(q.subject, q.topic, q.module)}`));
  const fresh = pool.filter((q) => st.due.has(q.id) || !st.gotRight.has(q.id));
  const use = fresh.length >= size ? fresh : pool;
  const candidates: Candidate[] = use.map((q) => ({
    id: q.id,
    topic: `${q.subject}:${groupOf(q.subject, q.topic, q.module)}`,
    family: q.subject,
    p: prob(st.theta(q.subject), st.b(q.id) ?? PRIOR_B[q.difficulty]),
    due: st.due.has(q.id),
  }));
  return pickSession(candidates, size, rng);
}
