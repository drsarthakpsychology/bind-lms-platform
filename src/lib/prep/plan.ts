/**
 * The personal plan and the "next 1 to 3 things to do" (owner rule: one
 * pathway, never more than three actions at once). Pure.
 */
import { decayedTheta, prob } from "@/lib/learn/model/elo";
import { EXAM_TRACKS_ENABLED, PREP_ONBOARDING_ENABLED, SUBJECT_TITLE, planWeights } from "./catalog";
import { diagnosticSize } from "./sampling";
import type { PrepExam, Subject } from "./types";

export type SkillSnap = { theta: number; n: number; lastAt: string | null };
export type TopicStatus = "new" | "weak" | "building" | "strong";
export type PlanTopic = {
  subject: Subject;
  title: string;
  /** Share of the exams (or of the one exam, with tracks on), 0 to 1. */
  weight: number;
  /** Chance of a right answer on a medium question; null before any answer. */
  p: number | null;
  n: number;
  status: TopicStatus;
  /** Higher = do sooner. */
  priority: number;
};

/** Strong = likely right on a medium question, with enough answers to trust it. */
export const STRONG_P = 0.8;
export const STRONG_N = 8;
export const WEAK_P = 0.55;

export function statusOf(p: number | null, n: number): TopicStatus {
  if (p === null) return "new";
  if (p >= STRONG_P && n >= STRONG_N) return "strong";
  if (p < WEAK_P) return "weak";
  return "building";
}

export const STATUS_LABEL: Record<TopicStatus, string> = { new: "Not tested", weak: "Weak", building: "Getting there", strong: "Strong" };

/**
 * Every subject, ordered weakest and most heavily weighted first:
 * priority = weight × (1 − p), with untested subjects at p = 0.5. Strong
 * subjects drop to the end. Ties go to the bigger subject. With no goal
 * (exam tracks off) the weights are the shared course's: each subject
 * weighed by how much the exams test it, averaged over the exams.
 */
export function buildPlan(goal: PrepExam | null, skills: ReadonlyMap<Subject, SkillSnap>, now: Date, available?: ReadonlySet<Subject>): PlanTopic[] {
  const weights = planWeights(goal);
  const out: PlanTopic[] = [];
  for (const [subject, weight] of weights) {
    if (available && !available.has(subject)) continue;
    const s = skills.get(subject);
    const p = s && s.n > 0 ? prob(decayedTheta(s.theta, s.lastAt, now), 0) : null;
    const n = s?.n ?? 0;
    const status = statusOf(p, n);
    out.push({ subject, title: SUBJECT_TITLE[subject], weight, p, n, status, priority: weight * (1 - (p ?? 0.5)) });
  }
  return out.sort((a, b) => Number(a.status === "strong") - Number(b.status === "strong") || b.priority - a.priority || b.weight - a.weight);
}

export type ActionKind = "goal" | "diagnostic" | "topic" | "review" | "mock" | "interview";
export type NextAction =
  | { kind: "goal" | "diagnostic" | "review" | "mock" | "interview"; title: string; why: string; href: string; count?: number }
  | { kind: "topic"; title: string; why: string; subject: Subject; learnHref: string; practiceHref: string; learnFirst: boolean };

export type PathState = {
  goal: PrepExam | null;
  /** Exam tracks on? Off: no goal step, interviews are for everyone. Defaults to EXAM_TRACKS_ENABLED. */
  tracks?: boolean;
  /** Starting check and goal step on? Off: never asked, the steps start at once. Defaults to PREP_ONBOARDING_ENABLED. */
  onboarding?: boolean;
  diagnosed: boolean;
  plan: PlanTopic[];
  /** Missed questions due for review. */
  due: number;
  /** Graded prep answers so far (practice + diagnostic + mocks). */
  answered: number;
  mocks: number;
  lastMockAt: string | null;
  interviews: number;
  learnHref: (s: Subject) => string;
  now: Date;
};

/** Answers before a full mock is worth it. */
export const MOCK_AFTER = 60;
/** Missed questions due before review becomes a next step. */
export const REVIEW_AFTER = 3;
const WEEK = 7 * 86_400_000;

/**
 * At most three next steps, most important first. With onboarding on, before
 * the diagnostic (and, with exam tracks on, before a goal) there is only ever
 * one thing to do. With it off nothing is asked first.
 */
export function nextActions(st: PathState, max = 3): NextAction[] {
  const tracks = st.tracks ?? EXAM_TRACKS_ENABLED;
  const onboarding = st.onboarding ?? PREP_ONBOARDING_ENABLED;
  const goal = tracks ? st.goal : null;
  if (onboarding && tracks && !goal) return [{ kind: "goal", title: "Pick your exam", why: "So everything here fits it", href: "/prep" }];
  if (onboarding && !st.diagnosed) {
    const n = diagnosticSize(goal);
    return [{ kind: "diagnostic", title: "Take the starting check", why: `${n} questions ${goal ? "across your syllabus" : "across every subject"}, about ${n} minutes. It builds your plan.`, href: "/prep/diagnostic" }];
  }

  const out: NextAction[] = [];
  const topics = st.plan.filter((t) => t.status !== "strong");
  const topicAction = (t: PlanTopic): NextAction => ({
    kind: "topic",
    title: t.title,
    why: t.status === "weak" ? "Your weakest big topic" : t.status === "new" ? (goal ? "Not tested yet, and it carries marks" : "Not tested yet, and the exams ask it") : "Close to strong. Keep going.",
    subject: t.subject,
    learnHref: st.learnHref(t.subject),
    practiceHref: `/prep/practice/${t.subject}`,
    learnFirst: t.status === "weak" && t.n < STRONG_N,
  });

  if (topics[0]) out.push(topicAction(topics[0]));
  if (st.due >= REVIEW_AFTER) out.push({ kind: "review", title: `Review ${st.due} missed ${st.due === 1 ? "question" : "questions"}`, why: "Spaced review makes them stick", href: "/prep/review", count: st.due });

  const mockStale = !st.lastMockAt || st.now.getTime() - Date.parse(st.lastMockAt) > WEEK;
  if (st.answered >= MOCK_AFTER && mockStale) out.push({ kind: "mock", title: st.mocks ? "Take another timed mock" : "Take your first timed mock", why: goal ? "Real exam pattern, timer and marking" : "Every subject, a timer and marking", href: "/prep/mock" });
  // Interviews: for clinical entrances only while tracks are on; for everyone in the shared course.
  if ((goal ? goal === "mcp-entrance" : true) && st.mocks > 0 && st.interviews === 0) out.push({ kind: "interview", title: "Try a mock interview", why: "Panels ask you to explain, not just recall", href: "/prep/interview" });

  for (const t of topics.slice(1)) {
    if (out.length >= max) break;
    out.push(topicAction(t));
  }
  if (!out.length) out.push({ kind: "mock", title: "Take a timed mock", why: "Every topic is strong. Test it under time.", href: "/prep/mock" });
  return out.slice(0, max);
}
