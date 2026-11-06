import "server-only";
/**
 * The live banks on the server, plus "Learn this" links checked against the
 * real study modules. Answers never leave the server from here.
 */
import { ALL_INTERVIEWS, ALL_QUESTIONS } from "@/content/prep/index";
import { moduleById, sectionById } from "@/lib/study";
import { isSubject, learnTarget, studyHref } from "./catalog";
import type { InterviewQuestion, PrepQuestion, Subject } from "./types";

export const BANK: PrepQuestion[] = ALL_QUESTIONS;
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

/** "Learn" for a subject: the module section its questions point to most. */
export function learnHrefFor(subject: Subject): string {
  let href = subjectLinks.get(subject);
  if (!href) {
    href = studyHref(learnTarget(subject, BANK), exists);
    subjectLinks.set(subject, href);
  }
  return href;
}

/** "Learn this" for one question: its own module, else its subject's. */
export function learnHrefForQuestion(q: PrepQuestion): string {
  return q.module ? studyHref(q.module, (m, s) => exists(m, s) || (!s && exists(m))) : learnHrefFor(q.subject);
}

/** Subjects that have at least one question (the plan only lists what can be practised). */
export function subjectsWithQuestions(): Set<Subject> {
  return new Set(BANK.map((q) => q.subject).filter(isSubject));
}
