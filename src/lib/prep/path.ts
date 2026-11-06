import "server-only";
/**
 * Everything the /prep home needs, in one call: plan and the next 1 to 3
 * steps (and the goal, when exam tracks are on). Also the per-request random
 * seed (kept out of components).
 */
import { BANK, BANK_IDS, INTERVIEWS, learnHrefFor, subjectsWithQuestions } from "./bank";
import { EXAM_TRACKS_ENABLED, activeGoal } from "./catalog";
import { buildPlan, nextActions, type NextAction, type PlanTopic } from "./plan";
import { decayedTheta } from "@/lib/learn/model/elo";
import { isDue } from "@/lib/learn/model/fsrs";
import { makeRng } from "@/lib/learn/model/picker";
import { pickPractice, reviewQueue } from "./sampling";
import type { PrepExam, Subject } from "./types";
import { answeredCount, loadCards, loadInterviewHistory, loadItemB, loadMockHistory, loadProfile, loadSeen, loadSkills, type MockMeta, type PrepProfile } from "./server";

export type PathView = {
  profile: PrepProfile;
  diagnosed: boolean;
  plan: (PlanTopic & { learnHref: string })[];
  actions: NextAction[];
  due: number;
  answered: number;
  mocks: MockMeta[];
  interviews: number;
  bankSize: number;
  interviewSize: number;
};

/**
 * `fallback`: the cookie copy of the goal, used when the database has none
 * (tables not set up yet). While exam tracks are off the stored goal is kept
 * but ignored: `profile.goal` is null and the plan is the shared course's.
 */
export async function loadPath(userId: string, fallback: { goal: PrepExam | null; diagnosed: boolean }, now = new Date()): Promise<PathView> {
  const [stored, skills, cards, mocks, iv] = await Promise.all([loadProfile(userId), loadSkills(userId), loadCards(userId), loadMockHistory(userId), loadInterviewHistory(userId)]);
  const profile: PrepProfile = { ...stored, goal: activeGoal(stored.goal ?? fallback.goal) };
  const diagnosed = !!stored.diagnostic || fallback.diagnosed;
  const plan = profile.goal || !EXAM_TRACKS_ENABLED ? buildPlan(profile.goal, skills, now, subjectsWithQuestions()) : [];
  const due = reviewQueue(cards, BANK_IDS, now, 999).length;
  const answered = answeredCount(skills);
  const done = mocks.filter((m) => m.submittedAt);
  const actions = BANK.length
    ? nextActions({ goal: profile.goal, diagnosed, plan, due, answered, mocks: done.length, lastMockAt: done[0]?.submittedAt ?? null, interviews: iv.sessions, learnHref: learnHrefFor, now })
    : (profile.goal || !EXAM_TRACKS_ENABLED) && INTERVIEWS.length
      ? [{ kind: "interview" as const, title: "Try a mock interview", why: "Questions for practice and mocks are still being added", href: "/prep/interview" }]
      : [];
  return { profile, diagnosed, plan: plan.map((t) => ({ ...t, learnHref: learnHrefFor(t.subject) })), actions, due, answered, mocks, interviews: iv.sessions, bankSize: BANK.length, interviewSize: INTERVIEWS.length };
}

/** A fresh random seed per request (never during render). */
export function requestSeed(userId: string, now = new Date()): number {
  let h = 2166136261;
  for (let i = 0; i < userId.length; i++) h = Math.imul(h ^ userId.charCodeAt(i), 16777619);
  return (now.getTime() ^ h) >>> 0;
}

/** A 10-question adaptive round for one subject (question ids, in order). `goal` only narrows the pool with exam tracks on. */
export async function loadPracticeRound(userId: string, subject: Subject, goal: PrepExam | null, size = 10, now = new Date()): Promise<string[]> {
  const ids = BANK.filter((q) => q.subject === subject).map((q) => q.id);
  const [skills, cards, seen, b] = await Promise.all([loadSkills(userId), loadCards(userId), loadSeen(userId), loadItemB(ids)]);
  const s = skills.get(subject);
  const theta = s ? decayedTheta(s.theta, s.lastAt, now) : 0;
  const due = new Map(cards.map((c) => [c.id, c.dueAt]));
  const picked = pickPractice(BANK, subject, { theta, b: (x) => b.get(x), due: (x) => due.has(x) && isDue({ dueAt: due.get(x)! }, now) }, makeRng(requestSeed(userId, now)), seen, size, activeGoal(goal) ?? undefined);
  return picked.map((p) => p.id);
}

/** Missed questions due for spaced review, most overdue first. */
export async function loadReviewRound(userId: string, size = 15, now = new Date()): Promise<string[]> {
  return reviewQueue(await loadCards(userId), BANK_IDS, now, size);
}
