import { studyKey, type StudyProgress } from "@/lib/learn/engine";
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
 *   recall cards from the same sections, shuffled.
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

/** The first checkpoint that is ready and not yet taken. */
export function dueCheckpoint(m: StudyModule, p: StudyProgress): Checkpoint | null {
  return checkpoints(m).find((cp) => checkpointStatus(m, cp, p) === "ready") ?? null;
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
    mcq.push(...parts.mcq);
    recall.push(...parts.recall);
  }
  return { mcq: seededShuffle(mcq, seed), recall: seededShuffle(recall, `${seed}r`) };
}
