import "server-only";
import { INTERVIEWS, KEY, bankTopics, learnHrefForTopic } from "@/lib/prep/bank";
import { CATEGORY_LABEL, pickPanel } from "@/lib/prep/interview";
import { makeRng } from "@/lib/learn/model/picker";
import { currentGoal } from "@/app/(dashboard)/prep/viewer";
import { EXAM_TRACKS_ENABLED, SUBJECT_TITLE, isSubject } from "@/lib/prep/catalog";
import { loadHome, loadList, loadSmart, loadSubject, loadTopicSet, requestSeed } from "@/lib/prep/path";
import { loadInterviewHistory, loadMockHistory } from "@/lib/prep/server";
import { toView } from "@/lib/prep/view";
import { longCount, longSubjects, longTopic, longTopicsFor } from "@/lib/prep/long-server";
import { EXAM_SPECS, PRACTICE_SPECS } from "@/content/prep/specs";
import type { Subject } from "@/lib/prep/types";
import type { Profile } from "@/lib/auth/session";
import { toAppTarget } from "./target";
import type { PractiseRow, PrepHome, PrepInterview, PrepLong, PrepMocks, PrepQuestion, PrepSet, PrepStats, PrepSubjectDetail } from "./contract-practise-admin";

/**
 * Exam Prep for the app, from the website's own loaders (src/lib/prep/path.ts:
 * loadHome, loadSubject, loadTopicSet, loadSmart, loadList). Questions go out
 * as the website's toView (no answer, no explanation); the answer and why
 * come back only from the server's checkAnswer (POST /play/prep/check).
 */

/** Students and alumni have their answers saved; staff see a preview (the website's prepViewer). */
export const isLearner = (p: Profile) => p.role === "student" || p.role === "alumni";

const stats = (s: { total: number; answered: number; right: number }): PrepStats => ({ total: s.total, answered: s.answered, right: s.right });
const questions = (ids: readonly string[]): PrepQuestion[] => ids.flatMap((id) => {
  const q = KEY.get(id);
  return q ? [toView(q) as unknown as PrepQuestion] : [];
});

const row = (id: string, title: string, meta: string, href: string): PractiseRow => ({ id, title, meta, kind: "prep", target: toAppTarget(href), trailing: null, locked: false, play: "native" });

export async function prepHome(p: Profile): Promise<PrepHome> {
  const home = await loadHome(p.id);
  const parse = (href: string) => {
    const [, , subject, topic] = new URL(href, "https://x.invalid").pathname.split("/");
    return { subject: subject ?? "", topic: topic ?? "" };
  };
  return {
    v: 1,
    preview: !isLearner(p),
    resume: home.resume ? { ...parse(home.resume.href), subjectTitle: home.resume.subjectTitle, topicTitle: home.resume.topicTitle, set: home.resume.set, sets: home.resume.sets, index: home.resume.index, target: toAppTarget(home.resume.href) } : null,
    subjects: home.subjects.map((s) => ({ id: s.subject, title: s.optional ? "General paper" : s.title, optional: s.optional, questions: s.stats.total, done: s.stats.answered, best: s.stats.pct, stats: stats(s.stats) })),
    saved: home.saved,
    wrong: home.wrong,
    canSave: home.canSave,
    more: [
      row("smart", "Smart practice", "From your weak topics and missed questions", "/prep/smart"),
      row("mock", "Mock tests", "Timed papers with marking", "/prep/mock"),
      row("interview", "Mock interview", "Practise for the panel", "/prep/interview"),
      row("saved", "Saved and wrong", "Questions to look at again", home.saved || !home.wrong ? "/prep/saved" : "/prep/wrong"),
      row("long", "Long answers", `${longCount()} written answers`, "/prep/long"),
    ],
  };
}

export async function prepSubject(p: Profile, subject: string): Promise<PrepSubjectDetail | null> {
  if (!isSubject(subject)) return null;
  const s = await loadSubject(p.id, subject);
  return { v: 1, id: subject, title: SUBJECT_TITLE[subject], stats: stats(s.stats), topics: s.topics.map((t) => ({ id: t.id, title: t.title, stats: stats(t.stats) })), long: longTopicsFor(subject).reduce((a, t) => a + t.items.length, 0) };
}

export async function prepTopicSet(p: Profile, subject: string, topic: string, set: number | null): Promise<PrepSet | null> {
  if (!isSubject(subject)) return null;
  const view = await loadTopicSet(p.id, subject, topic, set);
  if (!view) return null;
  const topics = bankTopics(subject);
  const at = topics.findIndex((x) => x.id === topic);
  const nextChip = view.sets[view.set + 1];
  const nextTopic = nextChip || at < 0 ? undefined : topics[at + 1];
  return {
    v: 1,
    id: `${subject}/${topic}`,
    title: view.title,
    sets: view.sets.map((c) => ({ n: c.n, stats: stats(c.stats) })),
    set: view.set + 1,
    start: view.start,
    questions: questions(view.ids),
    prior: view.prior,
    saved: view.saved,
    canSave: view.canSave && isLearner(p),
    preview: !isLearner(p),
    next: nextChip ? { label: "Next set", target: toAppTarget(nextChip.href) } : nextTopic ? { label: `Next topic: ${nextTopic.title}`, target: toAppTarget(`/prep/${subject}/${nextTopic.id}`) } : { label: "Learn this topic in Study", target: toAppTarget(learnHrefForTopic(subject as Subject, topic)) },
  };
}

export async function prepSmart(p: Profile): Promise<PrepSet> {
  const s = await loadSmart(p.id);
  return { v: 1, id: "smart", title: "Smart practice", sets: [], set: 1, start: 0, questions: questions(s.ids), prior: {}, saved: s.saved, canSave: s.canSave && isLearner(p), preview: !isLearner(p), next: null };
}

export async function prepList(p: Profile, kind: "saved" | "wrong", page: number): Promise<PrepSet> {
  const l = await loadList(p.id, kind, page);
  return { v: 1, id: kind, title: kind === "saved" ? "Saved" : "Wrong", sets: [], set: 1, start: 0, questions: questions(l.ids), prior: l.prior, saved: l.saved, canSave: l.canSave && isLearner(p), preview: !isLearner(p), next: null, page: { page: l.page, pages: l.pages, total: l.total } };
}

/** A paper's pattern without its source note. */
function withoutSource(spec: object): Record<string, unknown> {
  const out = { ...(spec as Record<string, unknown>) };
  delete out.source;
  return out;
}

export async function prepMocks(p: Profile): Promise<PrepMocks> {
  const history = await loadMockHistory(p.id, 20).catch(() => []);
  const specs = [...PRACTICE_SPECS, ...(EXAM_TRACKS_ENABLED ? EXAM_SPECS : [])];
  // Sources stay on the website's staff notes (students never see citations).
  return { v: 1, specs: specs.map((s) => ({ ...withoutSource(s), id: s.id, title: s.short, minutes: s.minutes, questions: s.sections.reduce((a, x) => a + x.count, 0) })), history: history as unknown as Record<string, unknown>[] };
}

export function prepLong(level: PrepLong["level"], subject?: string, topic?: string, id?: string): PrepLong | null {
  if (level === "home") return { v: 1, level, data: { subjects: longSubjects() } };
  if (!subject || !isSubject(subject)) return null;
  if (level === "subject") return { v: 1, level, data: { subject, title: SUBJECT_TITLE[subject], topics: longTopicsFor(subject).map((t) => ({ id: t.id, title: t.title, count: t.items.length })) } };
  const t = longTopic(subject, topic ?? "");
  if (!t) return null;
  if (level === "topic") return { v: 1, level, data: { subject, topic: t.id, title: t.title, items: t.items.map((x) => ({ id: x.id, question: x.question, marks: x.marks, difficulty: x.difficulty })) } };
  const i = t.items.findIndex((x) => x.id === id);
  if (i < 0) return null;
  const next = t.items[i + 1];
  return { v: 1, level, data: { item: t.items[i], next: next ? { id: next.id, question: next.question } : null } };
}

/** GET /prep/interview: the website's /prep/interview panel (pickPanel over the questions this student has not had). */
export async function prepInterview(p: Profile): Promise<PrepInterview> {
  const [goal, history] = await Promise.all([currentGoal(p.id), loadInterviewHistory(p.id).catch(() => ({ sessions: 0, seen: new Set<string>() }))]);
  const panel = pickPanel(INTERVIEWS, goal, makeRng(requestSeed(p.id)), history.seen);
  return { v: 1, questions: panel.map((q) => ({ id: q.id, category: CATEGORY_LABEL[q.category], question: q.question, followUp: q.followUps[0] ?? null })), saving: isLearner(p) };
}
