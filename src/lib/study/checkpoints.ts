import { studyKey, type StudyProgress } from "@/lib/learn/engine";
import { orderByHistory, tierOf, type History } from "@/lib/history/order";
import { splitSection } from "./chunk";
import { readingSections } from "./plan";
import type { Card, Mcq, Section, StudyModule } from "./types";

/**
 * Checkpoints: quizzes that come AFTER a block of reading, not straight after
 * each section. Reading something and being asked about it a minute later
 * tests short-term memory; being asked after you've moved on to new material
 * makes you retrieve it, which is what makes it stick.
 *
 * - The teaching sections of a module are grouped in blocks of about three
 *   (never across a Part boundary). The exam-zone sections are not grouped.
 * - A checkpoint can be opened any time. It is suggested ("ready") once
 *   every section in it is read AND the student has finished at least one
 *   later section (or straight away if nothing comes after it).
 * - Questions: the case-based questions written into those sections (many
 *   need you to apply, not repeat, what you read), then the "say it out loud"
 *   recall cards from the same sections, shuffled. A level check section
 *   ("Check yourself") is a quiz on the whole level in its own right, so its
 *   questions are NOT copied into the checkpoint that holds it: they ask about
 *   other blocks, and the student has just answered them there.
 * - A retake asks only what is not yet right (answer history, tool
 *   "study-check"); the score is how many of the checkpoint's questions are
 *   right now, out of all of them.
 */
export type Checkpoint = { n: number; key: string; title: string; sectionIds: string[]; firstNum: string; lastNum: string };
/** Every checkpoint can be opened any time. The status only says when it is best taken: "early" (its sections are not all read yet), "waiting" (read, but nothing later read yet), "ready" or "done". */
export type CheckpointStatus = "early" | "waiting" | "ready" | "done";

const isExam = (s: Section) => /exam zone/i.test(s.part ?? "");
export const BLOCK = 3;

export function teachingSections(m: StudyModule): Section[] {
  return readingSections(m).filter((s) => !isExam(s));
}

export function checkpoints(m: StudyModule): Checkpoint[] {
  const teach = teachingSections(m);
  const groups: Section[][] = [];
  let cur: Section[] = [];
  let part: string | undefined;
  for (const s of teach) {
    if (cur.length && (s.part !== part || cur.length >= BLOCK)) {
      groups.push(cur);
      cur = [];
    }
    part = s.part;
    cur.push(s);
  }
  if (cur.length) groups.push(cur);
  // A lone leftover section joins the block before it (same Part only).
  for (let i = groups.length - 1; i > 0; i--) {
    if (groups[i].length === 1 && groups[i][0].part === groups[i - 1][0].part) {
      groups[i - 1].push(...groups[i]);
      groups.splice(i, 1);
    }
  }
  return groups.map((g, i) => ({
    n: i + 1,
    key: `${m.id}~cp${i + 1}`,
    title: g.length === 1 ? `${g[0].num} ${g[0].title}` : `${g[0].num} to ${g[g.length - 1].num}`,
    sectionIds: g.map((s) => s.id),
    firstNum: g[0].num,
    lastNum: g[g.length - 1].num,
  }));
}

export function checkpointHref(m: StudyModule, cp: Checkpoint): string {
  return `/study/${m.id}/checkpoint/${cp.n}`;
}

/** Ids of the reading sections that come after this block. */
export function laterSectionIds(m: StudyModule, cp: Checkpoint): string[] {
  const all = readingSections(m).map((s) => s.id);
  const last = all.indexOf(cp.sectionIds[cp.sectionIds.length - 1]);
  return all.slice(last + 1);
}

export function checkpointStatus(m: StudyModule, cp: Checkpoint, p: StudyProgress, later = laterSectionIds(m, cp)): CheckpointStatus {
  if (p.tests[cp.key]) return "done";
  if (!cp.sectionIds.every((id) => p.done[studyKey(m.id, id)])) return "early";
  if (!later.length) return "ready";
  return later.some((id) => p.done[studyKey(m.id, id)]) ? "ready" : "waiting";
}

/**
 * The checkpoint to suggest next: the most recent one that is ready and not
 * yet taken. One the student has left behind (a later checkpoint's sections
 * are all read since) stays open on the module page, but is no longer pushed,
 * so a skipped checkpoint 1 never comes back in place of every later one.
 */
export function dueCheckpoint(m: StudyModule, p: StudyProgress): Checkpoint | null {
  const all = checkpoints(m);
  const read = (cp: Checkpoint) => cp.sectionIds.every((id) => p.done[studyKey(m.id, id)]);
  const due = all.filter((cp, i) => checkpointStatus(m, cp, p) === "ready" && !all.slice(i + 1).some(read));
  return due[due.length - 1] ?? null;
}

/** A checkpoint as the reader sees it (plain data, sent to the browser). */
export type CheckLink = { key: string; href: string; sectionIds: string[]; later: string[] };

function readyIn(c: CheckLink, moduleId: string, p: Pick<StudyProgress, "done" | "tests">): boolean {
  const done = (id: string) => Boolean(p.done[studyKey(moduleId, id)]);
  return !p.tests[c.key] && c.sectionIds.every(done) && (!c.later.length || c.later.some(done));
}

/**
 * After a section is finished: the checkpoint that finishing it has just
 * opened (ready now, not ready before), or null. A checkpoint that was
 * already open (skipped, or left half way) is not offered again here, so
 * finishing each later section never leads back to the same quiz.
 */
export function openedCheckpoint(checks: CheckLink[], moduleId: string, before: Pick<StudyProgress, "done" | "tests">, after: Pick<StudyProgress, "done" | "tests">): CheckLink | null {
  const opened = checks.filter((c) => readyIn(c, moduleId, after) && !readyIn(c, moduleId, before));
  return opened[opened.length - 1] ?? null;
}

/** A small deterministic shuffle (same order on server and in the browser). */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function checkpointQuestions(m: StudyModule, cp: Checkpoint, seed = cp.key): { mcq: Mcq[]; recall: Card[] } {
  const mcq: Mcq[] = [];
  const recall: Card[] = [];
  for (const id of cp.sectionIds) {
    const s = m.sections.find((x) => x.id === id);
    if (!s) continue;
    const parts = splitSection(s);
    // A level check's questions belong to the level check (see the top of this file).
    if (!s.levelCheck) mcq.push(...parts.mcq);
    recall.push(...parts.recall);
  }
  // The same question written into two sections is asked once.
  const seen = new Set<string>();
  const unique = mcq.filter((q) => {
    const k = `${q.q}|${q.options.join("|")}`.trim().toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return { mcq: seededShuffle(unique, seed), recall: seededShuffle(recall, `${seed}r`) };
}

/**
 * The case questions for one sitting of a checkpoint: never seen first, then
 * missed ones, and never one the student last answered right. Empty when
 * every question is already right.
 */
export function checkpointRound<T>(mcq: readonly T[], idOf: (q: T) => string, history: History, now: number, rng: () => number): T[] {
  return orderByHistory(mcq, idOf, history, now, rng).filter((q) => tierOf(history.get(idOf(q)), now) !== 4);
}

/** How many of a checkpoint's questions are right now (latest answer), out of all of them. */
export function checkpointKnown<T>(mcq: readonly T[], idOf: (q: T) => string, history: History): { right: number; total: number } {
  return { right: mcq.filter((q) => history.get(idOf(q))?.ok === true).length, total: mcq.length };
}
