/**
 * Prep catalogue: the section's name, goals, subject names, subject weights,
 * the student-model keys, and where "Learn this" goes. Pure, no I/O.
 *
 * Owner direction (6 Nov 2026): one shared course for every psychology
 * entrance and competitive exam. Subject mastery first, exam-specific prep
 * later. The curriculum is the union of every exam's syllabus, so nothing any
 * exam asks is dropped (NET Paper 1 included). Exam tracks (goal picker,
 * exam-pattern mocks, goal-only interview prompts) stay in the code behind
 * EXAM_TRACKS_ENABLED.
 */
import { EXAM_SPECS, type PrepSpec } from "@/content/prep/specs";
import { SUBJECTS, type Difficulty, type PrepExam, type PrepQuestion, type Subject } from "./types";

/**
 * Exam tracks switch. Off: no student is asked to pick an exam, every subject
 * is in one plan, mocks are the shared psychology mocks. On: the goal picker,
 * the exam-pattern mocks (src/content/prep/specs.ts) and goal-weighted plans
 * come back.
 */
export const EXAM_TRACKS_ENABLED: boolean = false;

/** The section's full name (page titles and the hero). No dashes in student text. */
export const PREP_TITLE = "Psychology Entrance & Competitive Exam Preparation";
/** The exams the one course prepares for, shown as a separate line under the title. */
export const PREP_EXAMS = ["CUET-PG", "UGC-NET", "Clinical Psychology Entrances (M.Clin.Psy)"] as const;
/** Short label for the nav and back links. */
export const PREP_SHORT = "Exam Prep";

export type Goal = { id: PrepExam; label: string; detail: string };

export const GOALS: Goal[] = [
  { id: "cuet-pg", label: "CUET PG", detail: "Master's entrance (MA/MSc Psychology)" },
  { id: "ugc-net", label: "UGC NET", detail: "Paper 1 and Paper 2 Psychology" },
  { id: "mcp-entrance", label: "Clinical psychology entrance", detail: "M.Clin.Psy / M.Phil: NIMHANS, CIP, IHBAS and others" },
  { id: "ma-semester", label: "MA/MSc semester exams", detail: "Your university's semester papers" },
];

export const isGoal = (v: unknown): v is PrepExam => GOALS.some((g) => g.id === v);
/** The goal that should shape what a student sees: none while exam tracks are off. */
export const activeGoal = (g: PrepExam | null | undefined, tracks = EXAM_TRACKS_ENABLED): PrepExam | null => (tracks && g ? g : null);
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
 * Where "Learn this" goes when a question has no `module`: the dedicated
 * module first (several are still being written), then the closest existing
 * module or the matching part of the Exam prep module ("module/section").
 * The first one that exists at runtime wins.
 */
export const SUBJECT_MODULE: Record<Subject, readonly string[]> = {
  "research-methods": ["research-methods", "exam-prep/2-2"],
  statistics: ["statistics", "exam-prep/2-2"],
  "psychometrics-assessment": ["assessment"],
  cognitive: ["thinking-language", "exam-prep/2-3"],
  "perception-attention": ["sensation-perception", "exam-prep/2-3"],
  "learning-motivation-emotion": ["learning-memory", "motivation-emotion", "exam-prep/2-3"],
  biological: ["brain"],
  developmental: ["lifespan", "child"],
  social: ["social", "exam-prep/2-4"],
  "personality-theories": ["personality-theories", "exam-prep/2-4"],
  "history-systems": ["foundations", "exam-prep/2-1"],
  psychopathology: ["exam-prep/3-1"],
  "clinical-therapies": ["therapies"],
  counselling: ["therapies"],
  health: ["applied", "exam-prep/2-1"],
  positive: ["applied", "exam-prep/2-1"],
  organisational: ["applied", "exam-prep/2-1"],
  "indian-psychology": ["foundations", "exam-prep/2-1"],
  "ethics-law": ["ethics-law"],
  "ugc-paper1": ["net-paper1", "exam-prep/1-1"],
};

/** Topic-level exceptions: motivation and emotion questions go to their own module. */
export function topicModules(subject: Subject, topic: string): readonly string[] {
  if (subject === "learning-motivation-emotion" && /motiv|emotion/i.test(topic)) return ["motivation-emotion", ...SUBJECT_MODULE[subject]];
  return SUBJECT_MODULE[subject];
}

/**
 * "module" or "module/section" (or a list of them, best first) → a /study
 * link. The first module that exists wins; a missing section falls back to
 * its module. Nothing found → the Exam prep module.
 */
export function studyHref(target: string | readonly string[] | undefined, exists: (module: string, section?: string) => boolean = () => true): string {
  const list = typeof target === "string" ? [target] : (target ?? []);
  for (const t of list) {
    const [mod, sec] = t.split("/");
    if (!mod || !exists(mod)) continue;
    return sec && exists(mod, sec) ? `/study/${mod}/${sec}` : `/study/${mod}`;
  }
  return "/study/exam-prep";
}

/** Where to learn a subject, best first: the most common `module` among its questions, then the subject map. */
export function learnTarget(subject: Subject, bank: PrepQuestion[]): string[] {
  const counts = new Map<string, number>();
  for (const q of bank) if (q.subject === subject && q.module) counts.set(q.module, (counts.get(q.module) ?? 0) + 1);
  let best: string | null = null;
  let n = 0;
  for (const [m, c] of counts) if (c > n) [best, n] = [m, c];
  return [...(best ? [best] : []), ...SUBJECT_MODULE[subject].filter((m) => m !== best)];
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

/**
 * The shared course's weights: each exam's subject weights, averaged over the
 * exams (every exam counts once, however many patterns it has). A subject
 * that more exams test, and test heavily, weighs more. Every subject in the
 * bank's list is in, so the course is the union of all syllabi; a subject no
 * pattern names still gets a small floor share. Sums to 1.
 */
export function unifiedWeights(specs: PrepSpec[] = EXAM_SPECS): Map<Subject, number> {
  const exams = [...new Set(specs.map((s) => s.exam).filter((e): e is PrepExam => e !== null))];
  const sum = new Map<Subject, number>();
  for (const e of exams) for (const [s, w] of subjectWeights(e, specs)) sum.set(s, (sum.get(s) ?? 0) + w / exams.length);
  const floor = 0.25 / SUBJECTS.length;
  const out = new Map<Subject, number>();
  for (const s of SUBJECTS) out.set(s, Math.max(sum.get(s) ?? 0, sum.size ? floor : 1));
  const total = [...out.values()].reduce((a, b) => a + b, 0);
  for (const [s, w] of out) out.set(s, w / total);
  return out;
}

/** The weights that drive the plan, diagnostic and suggestions: the goal's when tracks are on and one is set, else the shared course's. */
export function planWeights(goal: PrepExam | null): Map<Subject, number> {
  return goal ? subjectWeights(goal) : unifiedWeights();
}

/** How many of the exams test a subject (for "tested in N of 3 exams" style copy). */
export function examsTesting(subject: Subject, specs: PrepSpec[] = EXAM_SPECS): PrepExam[] {
  return [...new Set(specs.filter((s) => s.exam && s.sections.some((x) => x.subjects.includes(subject))).map((s) => s.exam as PrepExam))];
}

/** A shared practice mock (not any one exam's pattern)? */
export const isPracticeSpec = (s: PrepSpec) => s.exam === null;
/** Exam-pattern mocks only show when exam tracks are on; the shared practice mocks always show. */
export const specVisible = (s: PrepSpec, tracks = EXAM_TRACKS_ENABLED) => isPracticeSpec(s) || tracks;

/** Questions that fit a goal (tagged with that exam). */
export function bankForGoal(bank: PrepQuestion[], goal: PrepExam): PrepQuestion[] {
  return bank.filter((q) => q.exams.includes(goal));
}
