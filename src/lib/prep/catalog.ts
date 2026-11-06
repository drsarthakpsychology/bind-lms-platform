/**
 * Prep catalogue: goals, subject names, subject weights per goal, the
 * student-model keys, and where "Learn this" goes. Pure, no I/O.
 */
import { EXAM_SPECS, type PrepSpec } from "@/content/prep/specs";
import { SUBJECTS, type Difficulty, type PrepExam, type PrepQuestion, type Subject } from "./types";

export type Goal = { id: PrepExam; label: string; detail: string };

export const GOALS: Goal[] = [
  { id: "cuet-pg", label: "CUET PG", detail: "Master's entrance (MA/MSc Psychology)" },
  { id: "ugc-net", label: "UGC NET", detail: "Paper 1 and Paper 2 Psychology" },
  { id: "mcp-entrance", label: "Clinical psychology entrance", detail: "M.Clin.Psy / M.Phil: NIMHANS, CIP, IHBAS and others" },
  { id: "ma-semester", label: "MA/MSc semester exams", detail: "Your university's semester papers" },
];

export const isGoal = (v: unknown): v is PrepExam => GOALS.some((g) => g.id === v);
export const goalLabel = (g: PrepExam) => GOALS.find((x) => x.id === g)?.label ?? g;

export const SUBJECT_TITLE: Record<Subject, string> = {
  "research-methods": "Research methods",
  statistics: "Statistics",
  "psychometrics-assessment": "Testing and assessment",
  cognitive: "Thinking, memory and intelligence",
  "perception-attention": "Sensation, perception and attention",
  "learning-motivation-emotion": "Learning, motivation and emotion",
  biological: "Brain and biology",
  developmental: "Development across life",
  social: "Social psychology",
  "personality-theories": "Personality theories",
  "history-systems": "History and schools",
  psychopathology: "Psychopathology",
  "clinical-therapies": "Therapies",
  counselling: "Counselling",
  health: "Health psychology",
  positive: "Positive psychology",
  organisational: "Work and organisations",
  "indian-psychology": "Indian psychology",
  "ethics-law": "Ethics and law",
  "ugc-paper1": "NET Paper 1: teaching and reasoning",
};

export const isSubject = (v: unknown): v is Subject => (SUBJECTS as readonly string[]).includes(v as string);

/**
 * Where "Learn this" goes when a question has no `module`: the closest VIBHA
 * module, or the matching part of the Exam prep module ("module/section").
 */
export const SUBJECT_MODULE: Record<Subject, string> = {
  "research-methods": "exam-prep/2-2",
  statistics: "exam-prep/2-2",
  "psychometrics-assessment": "assessment",
  cognitive: "exam-prep/2-3",
  "perception-attention": "exam-prep/2-3",
  "learning-motivation-emotion": "exam-prep/2-3",
  biological: "brain",
  developmental: "child",
  social: "exam-prep/2-4",
  "personality-theories": "exam-prep/2-4",
  "history-systems": "exam-prep/2-1",
  psychopathology: "exam-prep/3-1",
  "clinical-therapies": "therapies",
  counselling: "therapies",
  health: "exam-prep/2-1",
  positive: "exam-prep/2-1",
  organisational: "exam-prep/2-1",
  "indian-psychology": "exam-prep/2-1",
  "ethics-law": "ethics-law",
  "ugc-paper1": "exam-prep/1-1",
};

/** "module" or "module/section" → a /study link. Unknown modules fall back to the Exam prep module. */
export function studyHref(target: string | undefined, exists: (module: string, section?: string) => boolean = () => true): string {
  const [mod, sec] = (target ?? "").split("/");
  if (mod && exists(mod, sec)) return sec ? `/study/${mod}/${sec}` : `/study/${mod}`;
  if (mod && exists(mod)) return `/study/${mod}`;
  return "/study/exam-prep";
}

/** The most common `module` among a subject's questions, else the subject map. */
export function learnTarget(subject: Subject, bank: PrepQuestion[]): string {
  const counts = new Map<string, number>();
  for (const q of bank) if (q.subject === subject && q.module) counts.set(q.module, (counts.get(q.module) ?? 0) + 1);
  let best: string | null = null;
  let n = 0;
  for (const [m, c] of counts) if (c > n) [best, n] = [m, c];
  return best ?? SUBJECT_MODULE[subject];
}

/* ------------------------------------------------- student model keys */

/** Skill key in the shared student model: "prep-statistics:apply". */
export const prepSkill = (s: Subject) => `prep-${s}:apply`;
/** Item key in the shared student model (namespaced so it never clashes with module questions). */
export const prepItem = (id: string) => `prep:${id}`;
export const fromPrepItem = (item: string) => (item.startsWith("prep:") ? item.slice(5) : null);
export function subjectOfSkill(skill: string): Subject | null {
  const m = skill.match(/^prep-([a-z0-9-]+):/);
  return m && isSubject(m[1]) ? m[1] : null;
}

/** Starting difficulty (logits) from the author's 1–4 rating, until real answers calibrate it. */
export const PRIOR_B: Record<Difficulty, number> = { 1: -1, 2: 0, 3: 1, 4: 1.8 };

/* ------------------------------------------------------- weights */

export function specsForGoal(goal: PrepExam): PrepSpec[] {
  return EXAM_SPECS.filter((s) => s.exam === goal);
}

/**
 * How much each subject counts for a goal: its share of questions across the
 * goal's mock patterns (a section's count is split evenly over its subjects),
 * averaged over the goal's patterns. Sums to 1.
 */
export function subjectWeights(goal: PrepExam, specs: PrepSpec[] = specsForGoal(goal)): Map<Subject, number> {
  const out = new Map<Subject, number>();
  const list = specs.filter((s) => s.exam === goal);
  if (!list.length) return out;
  for (const spec of list) {
    const total = spec.sections.reduce((a, s) => a + s.count, 0) || 1;
    for (const sec of spec.sections) {
      const share = sec.count / total / Math.max(1, sec.subjects.length) / list.length;
      for (const sub of sec.subjects) out.set(sub, (out.get(sub) ?? 0) + share);
    }
  }
  return out;
}

/** Questions that fit a goal (tagged with that exam). */
export function bankForGoal(bank: PrepQuestion[], goal: PrepExam): PrepQuestion[] {
  return bank.filter((q) => q.exams.includes(goal));
}
