/**
 * Scoring: mock exams (with negative marking), percentiles among VIBHA
 * students, and the diagnostic's topic-strength profile. Pure.
 */
import { estimateTheta, prob } from "@/lib/learn/model/elo";
import type { PrepSpec } from "@/content/prep/specs";
import { PRIOR_B, SUBJECT_TITLE } from "./catalog";
import type { Paper } from "./sampling";
import type { PrepQuestion, Subject } from "./types";

/** A chosen option 0 to 3, or null for blank. */
export type Choice = number | null;

export const cleanChoice = (v: unknown): Choice => (typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 3 ? v : null);

export type Tally = { right: number; wrong: number; blank: number; score: number; max: number };
export type MockItem = { id: string; section: string; subject: Subject; chosen: Choice; answer: number; correct: boolean; ms: number | null };
export type MockScore = Tally & {
  specId: string;
  accuracy: number | null;
  sections: (Tally & { title: string })[];
  subjects: (Tally & { subject: Subject; title: string })[];
  items: MockItem[];
};

const empty = (): Tally => ({ right: 0, wrong: 0, blank: 0, score: 0, max: 0 });
/** Avoids 0.1 + 0.2 noise in -0.25 marking. */
export const round2 = (x: number) => Math.round(x * 100) / 100;

function add(t: Tally, chosen: Choice, ok: boolean, spec: PrepSpec) {
  t.max += spec.marksPerRight;
  if (chosen === null) t.blank++;
  else if (ok) {
    t.right++;
    t.score += spec.marksPerRight;
  } else {
    t.wrong++;
    t.score += spec.marksPerWrong;
  }
}

/** Score a paper against the bank. Unknown ids are left out (not counted against the student). */
export function scoreMock(spec: PrepSpec, paper: Paper, answers: Record<string, unknown>, key: ReadonlyMap<string, PrepQuestion>, times: Record<string, unknown> = {}): MockScore {
  const total = empty();
  const sections: (Tally & { title: string })[] = [];
  const bySubject = new Map<Subject, Tally>();
  const items: MockItem[] = [];
  for (const sec of paper.sections) {
    const t = { ...empty(), title: sec.title };
    for (const id of sec.ids) {
      const q = key.get(id);
      if (!q) continue;
      const chosen = cleanChoice(answers[id]);
      const ok = chosen !== null && chosen === q.answer;
      add(t, chosen, ok, spec);
      add(total, chosen, ok, spec);
      const s = bySubject.get(q.subject) ?? empty();
      add(s, chosen, ok, spec);
      bySubject.set(q.subject, s);
      const ms = times[id];
      items.push({ id, section: sec.title, subject: q.subject, chosen, answer: q.answer, correct: ok, ms: typeof ms === "number" && Number.isFinite(ms) && ms >= 0 ? Math.round(ms) : null });
    }
    sections.push({ ...t, score: round2(t.score) });
  }
  const tried = total.right + total.wrong;
  return {
    specId: spec.id,
    ...total,
    score: round2(total.score),
    accuracy: tried ? total.right / tried : null,
    sections,
    subjects: [...bySubject]
      .map(([subject, t]) => ({ subject, title: SUBJECT_TITLE[subject], ...t, score: round2(t.score) }))
      .sort((a, b) => a.score / (a.max || 1) - b.score / (b.max || 1)),
    items,
  };
}

export type Standing = { rank: number; of: number; percentile: number | null };

/**
 * Where a score sits among other VIBHA students' best scores on the same mock.
 * Rank counts only higher scores (ties share a rank). Percentile = share of
 * the others scored below, ties counting half; null when nobody else has sat it.
 */
export function standing(score: number, others: number[]): Standing {
  const higher = others.filter((x) => x > score).length;
  const lower = others.filter((x) => x < score).length;
  const ties = others.length - higher - lower;
  return { rank: higher + 1, of: others.length + 1, percentile: others.length ? Math.round(((lower + ties / 2) / others.length) * 100) : null };
}

/** Each user's best score (one entry per user), leaving out `exclude`. */
export function bestPerUser(rows: { user: string; score: number }[], exclude?: string): number[] {
  const best = new Map<string, number>();
  for (const r of rows) {
    if (r.user === exclude || !Number.isFinite(r.score)) continue;
    best.set(r.user, Math.max(best.get(r.user) ?? -Infinity, r.score));
  }
  return [...best.values()];
}

/* -------------------------------------------------------- diagnostic */

export type Level = "strong" | "okay" | "weak";
export type ProfileTopic = { subject: Subject; title: string; right: number; total: number; theta: number; p: number; level: Level };
export type DiagnosticResult = { version: 1; answered: number; right: number; topics: ProfileTopic[] };

export function levelOf(p: number): Level {
  if (p >= 0.7) return "strong";
  if (p < 0.45) return "weak";
  return "okay";
}

/**
 * Topic-strength profile: per subject, the most likely ability given each
 * answer and the question's difficulty (1PL with a gentle prior). A skipped
 * question counts as not known. Weakest first.
 */
export function scoreDiagnostic(answers: { id: string; choice: Choice }[], key: ReadonlyMap<string, PrepQuestion>, b: (id: string) => number | undefined = () => undefined): DiagnosticResult {
  const by = new Map<Subject, { b: number; outcome: number }[]>();
  let right = 0;
  let answered = 0;
  for (const a of answers) {
    const q = key.get(a.id);
    if (!q) continue;
    answered++;
    const ok = a.choice !== null && a.choice === q.answer;
    if (ok) right++;
    by.set(q.subject, [...(by.get(q.subject) ?? []), { b: b(q.id) ?? PRIOR_B[q.difficulty], outcome: ok ? 1 : 0 }]);
  }
  const topics = [...by].map(([subject, list]): ProfileTopic => {
    const theta = estimateTheta(list);
    const p = prob(theta, 0);
    return { subject, title: SUBJECT_TITLE[subject], right: list.filter((x) => x.outcome === 1).length, total: list.length, theta, p, level: levelOf(p) };
  });
  topics.sort((x, y) => x.p - y.p);
  return { version: 1, answered, right, topics };
}
