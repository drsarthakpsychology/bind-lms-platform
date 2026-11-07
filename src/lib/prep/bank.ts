import "server-only";
/**
 * The live banks on the server, plus "Learn this" links checked against the
 * real study modules. Answers never leave the server from here. Every
 * question is stored in one labelling style (see labels.ts), so lists,
 * statements, options and explanations agree on every screen.
 */
import { ALL_INTERVIEWS, ALL_QUESTIONS } from "@/content/prep/index";
import { moduleById, sectionById } from "@/lib/study";
import { BANK_SUBJECTS, SUBJECT_MODULE, SUBJECT_TITLE, isSubject, learnTarget, studyHref, topicModules } from "./catalog";
import { normaliseLabels } from "./labels";
import { groupLearn, groupOf, topicsOf, type BankTopic } from "./topics";
import type { InterviewQuestion, PrepQuestion, Subject } from "./types";

export const BANK: PrepQuestion[] = ALL_QUESTIONS.map(normaliseLabels);
export const INTERVIEWS: InterviewQuestion[] = ALL_INTERVIEWS;
export const KEY: ReadonlyMap<string, PrepQuestion> = new Map(BANK.map((q) => [q.id, q]));
export const INTERVIEW_KEY: ReadonlyMap<string, InterviewQuestion> = new Map(INTERVIEWS.map((q) => [q.id, q]));
export const BANK_IDS: ReadonlySet<string> = new Set(BANK.map((q) => q.id));

function exists(mod: string, sec?: string): boolean {
  const m = moduleById(mod);
  if (!m) return false;
  return !sec || !!sectionById(m, sec);
}

const subjectLinks = new Map<Subject, string>();

/**
 * "Learn" for a subject: the module section its questions point to most, else
 * the dedicated module, else the closest existing one. Checked against the
 * live module registry, so new modules light up as soon as they land.
 */
export function learnHrefFor(subject: Subject): string {
  let href = subjectLinks.get(subject);
  if (!href) {
    href = studyHref(learnTarget(subject, BANK), exists);
    subjectLinks.set(subject, href);
  }
  return href;
}

/** "Learn" for one topic of the bank: its Study section, else the subject's link. */
export function learnHrefForTopic(subject: Subject, topic: string): string {
  const list = groupLearn(subject, topic);
  return list.length ? studyHref(list, exists) : learnHrefFor(subject);
}

/**
 * "Learn this" for one question: its bank topic's Study section first (most
 * questions only name a whole module, or the general Exam prep module), then
 * its own module, then its subject's.
 */
export function learnHrefForQuestion(q: PrepQuestion): string {
  const list = groupLearn(q.subject, groupOf(q.subject, q.topic));
  if (list.length) return studyHref(list, exists);
  const byTopic = topicModules(q.subject, q.topic);
  if (q.module && q.module !== "exam-prep") return studyHref([q.module, ...byTopic], exists);
  return byTopic === SUBJECT_MODULE[q.subject] ? learnHrefFor(q.subject) : studyHref(byTopic, exists);
}

/** Subjects that have at least one question (the plan only lists what can be practised). */
export function subjectsWithQuestions(): Set<Subject> {
  return new Set(BANK.map((q) => q.subject).filter(isSubject));
}

/* ------------------------------------------------------- the bank's topics */

const TOPICS = new Map<Subject, BankTopic[]>(BANK_SUBJECTS.map((s) => [s, topicsOf(s, BANK, SUBJECT_TITLE[s])]));
const WHERE = new Map<string, { subject: Subject; topic: string; ids: string[] }>();
for (const [subject, list] of TOPICS) for (const t of list) for (const id of t.ids) WHERE.set(id, { subject, topic: t.id, ids: t.ids });

/** A subject's topics, in order, each with its question ids (easier first). */
export function bankTopics(subject: Subject): BankTopic[] {
  return TOPICS.get(subject) ?? [];
}

/** Subjects in list order, only those with questions. */
export function bankSubjects(): Subject[] {
  return BANK_SUBJECTS.filter((s) => (TOPICS.get(s)?.length ?? 0) > 0);
}

/** Which subject and topic a question sits in. */
export function locate(id: string): { subject: Subject; topic: string; ids: string[] } | null {
  return WHERE.get(id) ?? null;
}
