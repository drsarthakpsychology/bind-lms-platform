import "server-only";
/**
 * Build what the results screen shows, after a mock is scored: the score,
 * standing, breakdowns and every question with its answer and explanation.
 */
import type { PrepSpec } from "@/content/prep/specs";
import { SUBJECT_TITLE } from "./catalog";
import { KEY, learnHrefFor, learnHrefForQuestion } from "./bank";
import type { MockScore, Standing } from "./scoring";
import { toView, type PrepQView } from "./view";
import type { Subject } from "./types";

export type ReviewRow = { q: PrepQView; section: string; chosen: number | null; answer: number; correct: boolean; ms: number | null; explanation: string; learnHref: string; marked: boolean };

export type MockResultView = {
  specId: string;
  title: string;
  marksPerRight: number;
  marksPerWrong: number;
  score: number;
  max: number;
  right: number;
  wrong: number;
  blank: number;
  accuracy: number | null;
  standing: Standing | null;
  saved: boolean;
  late: boolean;
  totalMs: number;
  sections: { title: string; score: number; max: number; right: number; wrong: number; blank: number }[];
  subjects: { subject: Subject; title: string; score: number; max: number; right: number; wrong: number; blank: number; learnHref: string }[];
  rows: ReviewRow[];
};

export function resultView(spec: PrepSpec, s: MockScore, standing: Standing | null, opts: { saved: boolean; late: boolean; marked?: string[] }): MockResultView {
  const marked = new Set(opts.marked ?? []);
  const rows: ReviewRow[] = s.items.flatMap((it) => {
    const q = KEY.get(it.id);
    if (!q) return [];
    return [{ q: toView(q), section: it.section, chosen: it.chosen, answer: q.answer, correct: it.correct, ms: it.ms, explanation: q.explanation, learnHref: learnHrefForQuestion(q), marked: marked.has(it.id) }];
  });
  return {
    specId: spec.id,
    title: spec.title,
    marksPerRight: spec.marksPerRight,
    marksPerWrong: spec.marksPerWrong,
    score: s.score,
    max: s.max,
    right: s.right,
    wrong: s.wrong,
    blank: s.blank,
    accuracy: s.accuracy,
    standing,
    saved: opts.saved,
    late: opts.late,
    totalMs: s.items.reduce((a, i) => a + (i.ms ?? 0), 0),
    sections: s.sections.map(({ title, score, max, right, wrong, blank }) => ({ title, score, max, right, wrong, blank })),
    subjects: s.subjects.map((x) => ({ subject: x.subject, title: SUBJECT_TITLE[x.subject] ?? x.title, score: x.score, max: x.max, right: x.right, wrong: x.wrong, blank: x.blank, learnHref: learnHrefFor(x.subject) })),
    rows,
  };
}
