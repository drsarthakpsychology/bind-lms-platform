import "server-only";
/**
 * The live long-answer lists: every hand-written LongQA plus every Study
 * module Q&A, built once per server process.
 */
import { LONG_QA } from "@/content/prep-long/index";
import { MODULES, moduleById, sectionById } from "@/lib/study";
import { learnHrefFor } from "./bank";
import { BANK_SUBJECTS, SUBJECT_TITLE, isSubject, studyHref } from "./catalog";
import { collectStudyQAs, longTopics, prepLongItem, studyLongItems, type LongItem, type LongTopic } from "./long";
import type { Subject } from "./types";

const exists = (mod: string, sec?: string) => {
  const m = moduleById(mod);
  return !!m && (!sec || !!sectionById(m, sec));
};

let cache: { items: LongItem[]; topics: Map<Subject, LongTopic[]>; byKey: Map<string, LongItem>; unique: number } | null = null;

function build() {
  if (cache) return cache;
  const prep = LONG_QA.filter((q) => isSubject(q.subject)).map((q) => prepLongItem(q, SUBJECT_TITLE[q.subject], q.module ? studyHref(q.module, exists) : learnHrefFor(q.subject)));
  const items = [...prep, ...studyLongItems(collectStudyQAs(MODULES))];
  const topics = new Map<Subject, LongTopic[]>();
  for (const s of BANK_SUBJECTS) topics.set(s, longTopics(s, items));
  const byKey = new Map(items.map((x) => [`${x.subject}:${x.id}`, x]));
  cache = { items, topics, byKey, unique: new Set(items.map((x) => x.id)).size };
  return cache;
}

/** How many different long answers there are (one shown under two subjects counts once). */
export const longCount = () => build().unique;

/** One subject's long answers by topic. */
export const longTopicsFor = (subject: Subject): LongTopic[] => build().topics.get(subject) ?? [];

export function longTopic(subject: Subject, topic: string): LongTopic | null {
  return longTopicsFor(subject).find((t) => t.id === topic) ?? null;
}

/** Subjects with long answers, in bank order, with their counts. */
export function longSubjects(): { subject: Subject; title: string; count: number }[] {
  return BANK_SUBJECTS.flatMap((s) => {
    const n = longTopicsFor(s).reduce((a, t) => a + t.items.length, 0);
    return n ? [{ subject: s, title: s === "ugc-paper1" ? "General paper: teaching, research and reasoning" : SUBJECT_TITLE[s], count: n }] : [];
  });
}

export const longHref = (x: Pick<LongItem, "subject" | "topic" | "id">) => `/prep/${x.subject}/long/${x.topic}/${x.id}`;

/** Short cards for the Saved and Practise again lists: each id where it is first listed. */
export function longCards(ids: readonly string[]): { id: string; question: string; marks: number; subjectTitle: string; href: string }[] {
  const { items } = build();
  const first = new Map<string, LongItem>();
  for (const x of items) if (!first.has(x.id)) first.set(x.id, x);
  return ids.flatMap((id) => {
    const x = first.get(id);
    return x ? [{ id, question: x.question, marks: x.marks, subjectTitle: SUBJECT_TITLE[x.subject], href: longHref(x) }] : [];
  });
}
