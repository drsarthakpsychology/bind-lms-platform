/**
 * Library tags for hand-written game items (Rx Detective, Ward Week, Escape
 * Room, Comorbid). Every item carries a topic, a level on the five-step
 * ladder, one learning objective, the exams it honestly helps with and the
 * Study module that "Learn this" opens.
 */
import type { PrepExam } from "@/lib/prep/types";

/** 1 recognise, 2 recall, 3 apply, 4 tell look-alikes apart, 5 full case. */
export type Level = 1 | 2 | 3 | 4 | 5;

export type ItemTags = {
  /** A short, specific topic (for example "SSRIs and bleeding"). */
  topic: string;
  level: Level;
  /** One short line: what the student can do after this item. */
  objective: string;
  exams: PrepExam[];
  /** Study module id (a TOPICS id) for "Learn this". */
  learn: string;
};

export const LEVEL_LABEL: Record<Level, string> = {
  1: "Recognise",
  2: "Recall",
  3: "Apply",
  4: "Tell look-alikes apart",
  5: "Full case",
};

export const PHARM_EXAMS: PrepExam[] = ["md-psychiatry", "mcp-entrance"];
export const CLINIC_EXAMS: PrepExam[] = ["mcp-entrance", "md-psychiatry", "ma-semester"];
export const DX_EXAMS: PrepExam[] = ["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"];

const DASH = new RegExp("[\\u2013\\u2014]");
/** Book, journal or citation text never shows in student copy. */
const CITE = /\bet al\b|Kaplan|Sadock|Stahl|Maudsley|Ahuja|Lishman|Lancet|\bBMJ\b|\bJAMA\b|\bdoi\b|ISBN|\bpp?\. ?\d/;
const WEEKS = /\bweeks?\b/i;

/**
 * Problems with a set of items: duplicate ids, missing or bad tags, dashes,
 * citations or week numbers in the student text. Empty when all is well.
 */
export function tagProblems(items: { id: string; tags?: ItemTags; text: string }[], topics: ReadonlySet<string>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const it of items) {
    if (seen.has(it.id)) out.push(`${it.id}: duplicate id`);
    seen.add(it.id);
    const t = it.tags;
    if (!t) {
      out.push(`${it.id}: no tags`);
      continue;
    }
    if (!t.topic.trim()) out.push(`${it.id}: empty topic`);
    if (![1, 2, 3, 4, 5].includes(t.level)) out.push(`${it.id}: level ${t.level}`);
    if (t.objective.trim().length < 8) out.push(`${it.id}: objective too short`);
    if (!t.exams.length) out.push(`${it.id}: no exams`);
    if (!topics.has(t.learn)) out.push(`${it.id}: learn ${t.learn} is not a Study module`);
    const text = `${it.text} ${t.topic} ${t.objective}`;
    if (DASH.test(text)) out.push(`${it.id}: dash`);
    if (CITE.test(text)) out.push(`${it.id}: citation text`);
    if (WEEKS.test(text)) out.push(`${it.id}: week number`);
  }
  return out;
}

/** How many items sit at each level. */
export function levelSpread(items: { tags?: ItemTags }[]): Record<Level, number> {
  const out: Record<Level, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const it of items) if (it.tags) out[it.tags.level] += 1;
  return out;
}

/**
 * Share of items whose right option is strictly the longest, and strictly the
 * shortest, of its options (each should stay near a third or below).
 */
export function lengthBias(items: { right: string; options: string[] }[]): { longest: number; shortest: number } {
  let longest = 0;
  let shortest = 0;
  for (const it of items) {
    const others = it.options.filter((o) => o !== it.right).map((o) => o.length);
    if (!others.length) continue;
    if (it.right.length > Math.max(...others)) longest += 1;
    if (it.right.length < Math.min(...others)) shortest += 1;
  }
  const n = Math.max(1, items.length);
  return { longest: longest / n, shortest: shortest / n };
}
