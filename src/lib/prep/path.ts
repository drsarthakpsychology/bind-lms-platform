import "server-only";
/**
 * What each question bank screen needs, in one call per screen: the home
 * (resume point and subjects), a subject (its topics), a topic set, Smart
 * practice, and the Saved and Wrong lists. Also the per-request random seed
 * (kept out of components).
 */
import { decayedTheta } from "@/lib/learn/model/elo";
import { makeRng } from "@/lib/learn/model/picker";
import { BANK, BANK_IDS, KEY, bankSubjects, bankTopics, locate } from "./bank";
import { OPTIONAL_SUBJECTS, SUBJECT_TITLE } from "./catalog";
import { loadAnswers, type AnswerBook } from "./answers";
import { buildPlan } from "./plan";
import { latestAnswered, nextSet, pageOf, resumePoint, savedIds, startIndex, statsOf, wrongIds, type Stats } from "./progress";
import { pickSmart, SMART_SIZE } from "./smart";
import { reviewQueue } from "./sampling";
import { loadCards, loadItemB, loadLastSeen, loadSkills, type PrepCard } from "./server";
import { setsOf } from "./topics";
import type { Subject } from "./types";

/** A fresh random seed per request (never during render). */
export function requestSeed(userId: string, now = new Date()): number {
  let h = 2166136261;
  for (let i = 0; i < userId.length; i++) h = Math.imul(h ^ userId.charCodeAt(i), 16777619);
  return (now.getTime() ^ h) >>> 0;
}

export const topicHref = (subject: string, topic: string, set?: number) => `/prep/${subject}/${topic}${set === undefined ? "" : `?set=${set + 1}`}`;

/** Questions missed at least once (spaced-review cards): the Wrong list before prep_answers exists. */
function missedFromCards(cards: PrepCard[]): string[] {
  return cards.filter((c) => c.lapses > 0 && BANK_IDS.has(c.id)).map((c) => c.id);
}

async function wrongList(userId: string, book: AnswerBook): Promise<string[]> {
  if (book.ready) return wrongIds(book.map).filter((id) => BANK_IDS.has(id));
  return missedFromCards(await loadCards(userId));
}

/* ------------------------------------------------------------- home */

export type ResumeView = { href: string; subjectTitle: string; topicTitle: string; set: number; sets: number; index: number };
export type SubjectRow = { subject: Subject; title: string; optional: boolean; stats: Stats };
export type HomeView = { resume: ResumeView | null; subjects: SubjectRow[]; saved: number; wrong: number; canSave: boolean };

export async function loadHome(userId: string): Promise<HomeView> {
  const book = await loadAnswers(userId);
  const latest = book.ready ? latestAnswered(book.map) : await loadLastSeen(userId);
  const at = resumePoint(latest && KEY.has(latest) ? latest : null, locate, book.map);
  let resume: ResumeView | null = null;
  if (at) {
    const subject = at.subject as Subject;
    const t = bankTopics(subject).find((x) => x.id === at.topic);
    if (t) resume = { href: topicHref(subject, t.id, at.set), subjectTitle: SUBJECT_TITLE[subject], topicTitle: t.title, set: at.set, sets: setsOf(t.ids).length, index: at.index };
  }
  const subjects = bankSubjects().map((s) => ({ subject: s, title: SUBJECT_TITLE[s], optional: OPTIONAL_SUBJECTS.has(s), stats: statsOf(bankTopics(s).flatMap((t) => t.ids), book.map) }));
  const saved = book.ready ? savedIds(book.map).filter((id) => BANK_IDS.has(id)).length : 0;
  const wrong = (await wrongList(userId, book)).length;
  return { resume, subjects, saved, wrong, canSave: book.ready };
}

/* ---------------------------------------------------------- subject */

export type TopicRow = { id: string; title: string; href: string; stats: Stats };

export async function loadSubject(userId: string, subject: Subject): Promise<{ topics: TopicRow[]; stats: Stats }> {
  const book = await loadAnswers(userId);
  const topics = bankTopics(subject).map((t) => ({ id: t.id, title: t.title, href: topicHref(subject, t.id, nextSet(t.ids, book.map)), stats: statsOf(t.ids, book.map) }));
  return { topics, stats: statsOf(bankTopics(subject).flatMap((t) => t.ids), book.map) };
}

/* -------------------------------------------------------- topic set */

export type SetChip = { n: number; href: string; stats: Stats };
export type SetView = { title: string; sets: SetChip[]; set: number; ids: string[]; start: number; prior: Record<string, boolean>; saved: string[]; canSave: boolean };

/** `setParam` counts from 1 (as in the address); missing or out of range opens the next unfinished set. */
export async function loadTopicSet(userId: string, subject: Subject, topic: string, setParam: number | null): Promise<SetView | null> {
  const t = bankTopics(subject).find((x) => x.id === topic);
  if (!t) return null;
  const book = await loadAnswers(userId);
  const sets = setsOf(t.ids);
  const set = setParam !== null && setParam >= 1 && setParam <= sets.length ? setParam - 1 : nextSet(t.ids, book.map);
  const ids = sets[set] ?? [];
  const prior: Record<string, boolean> = {};
  for (const id of ids) {
    const a = book.map.get(id);
    if (a && a.ok !== null) prior[id] = a.ok;
  }
  return {
    title: t.title,
    sets: sets.map((s, i) => ({ n: i + 1, href: topicHref(subject, t.id, i), stats: statsOf(s, book.map) })),
    set,
    ids,
    start: startIndex(ids, book.map),
    prior,
    saved: ids.filter((id) => book.map.get(id)?.saved),
    canSave: book.ready,
  };
}

/* ---------------------------------------------------- smart practice */

/** Weak subjects for Smart practice: weakest first, NET Paper 1 only when the student practises it. */
const WEAK_SUBJECTS = 3;

export async function loadSmart(userId: string, now = new Date()): Promise<{ ids: string[]; reviews: number; saved: string[]; canSave: boolean }> {
  const [skills, cards, book] = await Promise.all([loadSkills(userId), loadCards(userId), loadAnswers(userId)]);
  const available = new Set(bankSubjects().filter((s) => !OPTIONAL_SUBJECTS.has(s) || skills.has(s)));
  const plan = buildPlan(null, skills, now, available);
  const weakSubjects = plan.filter((t) => t.status !== "strong").slice(0, WEAK_SUBJECTS).map((t) => t.subject);
  const due = new Set(reviewQueue(cards, BANK_IDS, now, 50));
  const weakTopics = new Set<string>();
  const gotRight = new Set<string>();
  if (book.ready) {
    for (const s of bankSubjects())
      for (const t of bankTopics(s)) {
        const st = statsOf(t.ids, book.map);
        if (st.answered >= 3 && (st.pct ?? 100) < 60) weakTopics.add(`${s}:${t.id}`);
      }
    for (const [id, a] of book.map) if (a.ok) gotRight.add(id);
  }
  const b = await loadItemB(BANK.filter((q) => due.has(q.id) || weakSubjects.includes(q.subject)).map((q) => q.id).slice(0, 3000));
  const theta = (s: Subject) => {
    const k = skills.get(s);
    return k ? decayedTheta(k.theta, k.lastAt, now) : 0;
  };
  const picked = pickSmart(BANK, { theta, b: (x) => b.get(x), due, weakSubjects, weakTopics, gotRight }, makeRng(requestSeed(userId, now)), SMART_SIZE);
  const ids = picked.map((p) => p.id);
  return { ids, reviews: picked.filter((p) => p.bucket === "review").length, saved: ids.filter((id) => book.map.get(id)?.saved), canSave: book.ready };
}

/* ---------------------------------------------- saved and wrong lists */

export type ListView = { ids: string[]; page: number; pages: number; total: number; saved: string[]; canSave: boolean; prior: Record<string, boolean> };

export async function loadList(userId: string, kind: "saved" | "wrong", page: number): Promise<ListView> {
  const book = await loadAnswers(userId);
  const all = kind === "saved" ? (book.ready ? savedIds(book.map).filter((id) => BANK_IDS.has(id)) : []) : await wrongList(userId, book);
  const p = pageOf(all, page);
  return { ids: p.items, page: p.page, pages: p.pages, total: all.length, saved: p.items.filter((id) => book.map.get(id)?.saved), canSave: book.ready, prior: {} };
}
